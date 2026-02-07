import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { Redis } from 'ioredis';

/**
 * Redis Lock Service for Distributed Locking
 * 
 * Prevents race conditions during equipment booking.
 * Multiple users cannot reserve the same equipment simultaneously.
 * 
 * Lock Pattern:
 * - Key: lock:equipment:{equipmentId}
 * - Value: {renterId}:{timestamp}
 * - TTL: 15 minutes (enough for payment completion)
 */
@Injectable()
export class RedisLockService {
  private readonly logger = new Logger(RedisLockService.name);
  private readonly redis: Redis;
  private readonly DEFAULT_TTL_SECONDS = 900; // 15 minutes
  private readonly LOCK_PREFIX = 'lock:equipment:';

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.redis.on('error', (error) => {
      this.logger.error('Redis connection error', error);
    });

    this.redis.on('connect', () => {
      this.logger.log('Connected to Redis');
    });
  }

  /**
   * Acquire a lock on equipment for booking
   * 
   * @param equipmentId - Equipment to lock
   * @param renterId - User attempting to book
   * @param ttlSeconds - Lock duration (default: 15 minutes)
   * @returns true if lock acquired, throws ConflictException if already locked
   */
  async acquireLock(
    equipmentId: string,
    renterId: string,
    ttlSeconds: number = this.DEFAULT_TTL_SECONDS,
  ): Promise<boolean> {
    const lockKey = this.getLockKey(equipmentId);
    const lockValue = this.getLockValue(renterId);

    this.logger.log(`Attempting to acquire lock for equipment ${equipmentId}`);

    try {
      // SET NX (Not eXists) - Only set if key doesn't exist
      // EX - Set expiry in seconds
      // This is an atomic operation
      const result = await this.redis.set(
        lockKey,
        lockValue,
        'EX',
        ttlSeconds,
        'NX', // Only set if not exists
      );

      if (result === 'OK') {
        this.logger.log(
          `Lock acquired for equipment ${equipmentId} by renter ${renterId}`,
        );
        return true;
      } else {
        // Lock already exists - someone else is booking this equipment
        const existingLock = await this.redis.get(lockKey);
        const ttl = await this.redis.ttl(lockKey);

        this.logger.warn(
          `Lock already exists for equipment ${equipmentId}. Held by: ${existingLock}, TTL: ${ttl}s`,
        );

        throw new ConflictException({
          message: 'Equipment is currently being booked by another user',
          equipmentId,
          lockedBy: existingLock?.split(':')[0],
          expiresIn: ttl,
        });
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error('Error acquiring lock', error);
      throw error;
    }
  }

  /**
   * Release a lock after successful booking or cancellation
   * 
   * @param equipmentId - Equipment to unlock
   * @param renterId - User who holds the lock (must match for security)
   * @returns true if lock released, false if lock doesn't exist or doesn't match
   */
  async releaseLock(
    equipmentId: string,
    renterId: string,
  ): Promise<boolean> {
    const lockKey = this.getLockKey(equipmentId);
    const expectedValue = this.getLockValue(renterId);

    try {
      // Lua script for atomic check-and-delete
      // This ensures we only delete the lock if it's held by the correct renter
      const luaScript = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;

      const result = await this.redis.eval(
        luaScript,
        1, // Number of keys
        lockKey, // KEYS[1]
        expectedValue, // ARGV[1]
      );

      if (result === 1) {
        this.logger.log(
          `Lock released for equipment ${equipmentId} by renter ${renterId}`,
        );
        return true;
      } else {
        this.logger.warn(
          `Failed to release lock for equipment ${equipmentId}. Lock may not exist or is held by another user.`,
        );
        return false;
      }
    } catch (error) {
      this.logger.error('Error releasing lock', error);
      throw error;
    }
  }

  /**
   * Check if equipment is currently locked
   * 
   * @param equipmentId - Equipment to check
   * @returns Lock info if locked, null if available
   */
  async checkLock(equipmentId: string): Promise<{
    locked: boolean;
    renterId?: string;
    expiresIn?: number;
  }> {
    const lockKey = this.getLockKey(equipmentId);

    try {
      const lockValue = await this.redis.get(lockKey);

      if (!lockValue) {
        return { locked: false };
      }

      const ttl = await this.redis.ttl(lockKey);
      const renterId = lockValue.split(':')[0];

      return {
        locked: true,
        renterId,
        expiresIn: ttl,
      };
    } catch (error) {
      this.logger.error('Error checking lock', error);
      throw error;
    }
  }

  /**
   * Extend lock TTL (e.g., if payment is taking longer)
   * 
   * @param equipmentId - Equipment lock to extend
   * @param renterId - User who holds the lock
   * @param additionalSeconds - Seconds to add to TTL
   */
  async extendLock(
    equipmentId: string,
    renterId: string,
    additionalSeconds: number = 300, // 5 more minutes
  ): Promise<boolean> {
    const lockKey = this.getLockKey(equipmentId);
    const expectedValue = this.getLockValue(renterId);

    try {
      // Lua script to check ownership and extend TTL
      const luaScript = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          local current_ttl = redis.call("ttl", KEYS[1])
          if current_ttl > 0 then
            redis.call("expire", KEYS[1], current_ttl + tonumber(ARGV[2]))
            return 1
          end
        end
        return 0
      `;

      const result = await this.redis.eval(
        luaScript,
        1,
        lockKey,
        expectedValue,
        additionalSeconds.toString(),
      );

      if (result === 1) {
        this.logger.log(
          `Lock extended for equipment ${equipmentId} by ${additionalSeconds}s`,
        );
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error('Error extending lock', error);
      throw error;
    }
  }

  /**
   * Force release a lock (admin operation, emergency only)
   * 
   * @param equipmentId - Equipment to force unlock
   */
  async forceReleaseLock(equipmentId: string): Promise<boolean> {
    const lockKey = this.getLockKey(equipmentId);

    try {
      const result = await this.redis.del(lockKey);

      if (result === 1) {
        this.logger.warn(
          `Lock forcefully released for equipment ${equipmentId} (ADMIN ACTION)`,
        );
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error('Error force releasing lock', error);
      throw error;
    }
  }

  /**
   * Get all currently locked equipment
   * Useful for monitoring and debugging
   */
  async getActiveLocks(): Promise<
    Array<{
      equipmentId: string;
      renterId: string;
      expiresIn: number;
    }>
  > {
    try {
      // Scan for all lock keys
      const keys = await this.redis.keys(`${this.LOCK_PREFIX}*`);

      const locks = await Promise.all(
        keys.map(async (key) => {
          const equipmentId = key.replace(this.LOCK_PREFIX, '');
          const value = await this.redis.get(key);
          const ttl = await this.redis.ttl(key);

          return {
            equipmentId,
            renterId: value?.split(':')[0] || 'unknown',
            expiresIn: ttl,
          };
        }),
      );

      return locks;
    } catch (error) {
      this.logger.error('Error getting active locks', error);
      throw error;
    }
  }

  /**
   * Helper: Generate lock key
   */
  private getLockKey(equipmentId: string): string {
    return `${this.LOCK_PREFIX}${equipmentId}`;
  }

  /**
   * Helper: Generate lock value with timestamp
   */
  private getLockValue(renterId: string): string {
    return `${renterId}:${Date.now()}`;
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
