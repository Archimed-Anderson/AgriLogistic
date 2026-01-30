import { createClient } from 'redis';
import { logger } from './logger.service';

export class RedisService {
  private client: ReturnType<typeof createClient> | null = null;
  private isConnected: boolean = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;
    const redisPassword = process.env.REDIS_PASSWORD;

    const clientOptions: Parameters<typeof createClient>[0] = {
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis reconnection failed after 10 attempts');
            return new Error('Redis connection failed');
          }
          return Math.min(retries * 100, 3000);
        },
      },
    };

    // Only send AUTH when it is explicitly required/encoded.
    // In local dev it's common to run Redis without auth; sending AUTH causes hard failures.
    const urlIncludesPassword = /redis(s)?:\/\/:.*@/i.test(redisUrl);
    const shouldUsePassword = urlIncludesPassword || process.env.REDIS_USE_PASSWORD === 'true';

    if (shouldUsePassword && redisPassword && redisPassword.trim() !== '') {
      (clientOptions as any).password = redisPassword;
    }

    const client = createClient(clientOptions);
    this.client = client;

    client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    client.on('connect', () => {
      logger.info('Redis client connecting...');
    });

    client.on('ready', () => {
      logger.info('Redis client ready');
      this.isConnected = true;
    });

    client.on('end', () => {
      logger.warn('Redis client connection ended');
      this.isConnected = false;
    });
  }

  /**
   * Connect to Redis
   */
  async connect(): Promise<void> {
    if (!this.client) {
      this.initializeClient();
    }

    if (!this.isConnected && this.client) {
      try {
        await this.client.connect();
        this.isConnected = true;
        logger.info('✅ Redis connected successfully');
      } catch (error) {
        logger.error('❌ Redis connection failed:', error);
        throw error;
      }
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      try {
        await this.client.quit();
        this.isConnected = false;
        logger.info('Redis disconnected');
      } catch (error) {
        logger.error('Redis disconnect error:', error);
      }
    }
  }

  /**
   * Check if Redis is connected
   */
  isRedisConnected(): boolean {
    return this.isConnected && this.client !== null;
  }

  /**
   * Blacklist a token (store with expiration)
   * @param token - JWT token to blacklist
   * @param expiresIn - Expiration time in seconds
   */
  async blacklistToken(token: string, expiresIn: number): Promise<void> {
    if (!this.isRedisConnected()) {
      await this.connect();
    }

    if (!this.client) {
      throw new Error('Redis client not initialized');
    }

    try {
      const key = `blacklist:token:${token}`;
      await this.client.setEx(key, expiresIn, '1');
      logger.debug(`Token blacklisted: ${key.substring(0, 20)}...`);
    } catch (error) {
      logger.error('Error blacklisting token:', error);
      throw error;
    }
  }

  /**
   * Check if a token is blacklisted
   * @param token - JWT token to check
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    if (!this.isRedisConnected()) {
      await this.connect();
    }

    if (!this.client) {
      return false; // If Redis is not available, allow token (fail open)
    }

    try {
      const key = `blacklist:token:${token}`;
      const result = await this.client.get(key);
      return result !== null;
    } catch (error) {
      logger.error('Error checking token blacklist:', error);
      return false; // Fail open - if Redis fails, allow token
    }
  }

  /**
   * Store session data
   * @param sessionId - Session identifier
   * @param data - Session data to store
   * @param expiresIn - Expiration time in seconds
   */
  async setSession(sessionId: string, data: any, expiresIn: number): Promise<void> {
    if (!this.isRedisConnected()) {
      await this.connect();
    }

    if (!this.client) {
      throw new Error('Redis client not initialized');
    }

    try {
      const key = `session:${sessionId}`;
      await this.client.setEx(key, expiresIn, JSON.stringify(data));
      logger.debug(`Session stored: ${sessionId}`);
    } catch (error) {
      logger.error('Error storing session:', error);
      throw error;
    }
  }

  /**
   * Get session data
   * @param sessionId - Session identifier
   */
  async getSession(sessionId: string): Promise<any | null> {
    if (!this.isRedisConnected()) {
      await this.connect();
    }

    if (!this.client) {
      return null;
    }

    try {
      const key = `session:${sessionId}`;
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Clear session data
   * @param sessionId - Session identifier
   */
  async clearSession(sessionId: string): Promise<void> {
    if (!this.isRedisConnected()) {
      await this.connect();
    }

    if (!this.client) {
      return;
    }

    try {
      const key = `session:${sessionId}`;
      await this.client.del(key);
      logger.debug(`Session cleared: ${sessionId}`);
    } catch (error) {
      logger.error('Error clearing session:', error);
    }
  }

  /**
   * Store refresh token
   * @param userId - User ID
   * @param refreshToken - Refresh token
   * @param expiresIn - Expiration time in seconds
   */
  async storeRefreshToken(userId: string, refreshToken: string, expiresIn: number): Promise<void> {
    if (!this.isRedisConnected()) {
      await this.connect();
    }

    if (!this.client) {
      throw new Error('Redis client not initialized');
    }

    try {
      const key = `refresh_token:${userId}:${refreshToken}`;
      await this.client.setEx(key, expiresIn, '1');
    } catch (error) {
      logger.error('Error storing refresh token:', error);
      throw error;
    }
  }

  /**
   * Check if refresh token exists
   * @param userId - User ID
   * @param refreshToken - Refresh token
   */
  async hasRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    if (!this.isRedisConnected()) {
      await this.connect();
    }

    if (!this.client) {
      return false;
    }

    try {
      const key = `refresh_token:${userId}:${refreshToken}`;
      const result = await this.client.get(key);
      return result !== null;
    } catch (error) {
      logger.error('Error checking refresh token:', error);
      return false;
    }
  }

  /**
   * Remove refresh token
   * @param userId - User ID
   * @param refreshToken - Refresh token
   */
  async removeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    if (!this.isRedisConnected()) {
      await this.connect();
    }

    if (!this.client) {
      return;
    }

    try {
      const key = `refresh_token:${userId}:${refreshToken}`;
      await this.client.del(key);
    } catch (error) {
      logger.error('Error removing refresh token:', error);
    }
  }

  /**
   * Remove all refresh tokens for a user
   * @param userId - User ID
   */
  async removeAllRefreshTokens(userId: string): Promise<void> {
    if (!this.isRedisConnected()) {
      await this.connect();
    }

    if (!this.client) {
      return;
    }

    try {
      const pattern = `refresh_token:${userId}:*`;
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      logger.error('Error removing all refresh tokens:', error);
    }
  }
}

// Singleton instance
let redisServiceInstance: RedisService | null = null;

export const getRedisService = (): RedisService => {
  if (!redisServiceInstance) {
    redisServiceInstance = new RedisService();
  }
  return redisServiceInstance;
};
