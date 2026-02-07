import { Test, TestingModule } from '@nestjs/testing';
import { RedisLockService } from '../src/services/redis-lock.service';
import { ConflictException } from '@nestjs/common';

describe('RedisLockService', () => {
  let service: RedisLockService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisLockService],
    }).compile();

    service = module.get<RedisLockService>(RedisLockService);
  });

  afterAll(async () => {
    await service.onModuleDestroy();
  });

  const testEquipmentId = 'test-equipment-' + Date.now();
  const testRenterId = 'test-renter-123';

  describe('acquireLock', () => {
    it('should successfully acquire a lock', async () => {
      const result = await service.acquireLock(testEquipmentId, testRenterId);

      expect(result).toBe(true);

      // Cleanup
      await service.forceReleaseLock(testEquipmentId);
    });

    it('should throw ConflictException when lock already exists', async () => {
      // First lock
      await service.acquireLock(testEquipmentId, testRenterId);

      // Second lock attempt (different renter)
      await expect(
        service.acquireLock(testEquipmentId, 'another-renter-456'),
      ).rejects.toThrow(ConflictException);

      // Cleanup
      await service.forceReleaseLock(testEquipmentId);
    });

    it('should set TTL correctly', async () => {
      const customTTL = 300; // 5 minutes
      await service.acquireLock(testEquipmentId, testRenterId, customTTL);

      const lockInfo = await service.checkLock(testEquipmentId);

      expect(lockInfo.locked).toBe(true);
      expect(lockInfo.expiresIn).toBeLessThanOrEqual(customTTL);
      expect(lockInfo.expiresIn).toBeGreaterThan(customTTL - 10); // Allow some delay

      // Cleanup
      await service.forceReleaseLock(testEquipmentId);
    });
  });

  describe('releaseLock', () => {
    it('should release lock held by correct renter', async () => {
      await service.acquireLock(testEquipmentId, testRenterId);

      const result = await service.releaseLock(testEquipmentId, testRenterId);

      expect(result).toBe(true);

      const lockInfo = await service.checkLock(testEquipmentId);
      expect(lockInfo.locked).toBe(false);
    });

    it('should not release lock held by different renter', async () => {
      await service.acquireLock(testEquipmentId, testRenterId);

      const result = await service.releaseLock(
        testEquipmentId,
        'wrong-renter-789',
      );

      expect(result).toBe(false);

      const lockInfo = await service.checkLock(testEquipmentId);
      expect(lockInfo.locked).toBe(true);

      // Cleanup
      await service.forceReleaseLock(testEquipmentId);
    });

    it('should return false when releasing non-existent lock', async () => {
      const result = await service.releaseLock(
        'non-existent-equipment',
        testRenterId,
      );

      expect(result).toBe(false);
    });
  });

  describe('checkLock', () => {
    it('should return lock info for locked equipment', async () => {
      await service.acquireLock(testEquipmentId, testRenterId);

      const lockInfo = await service.checkLock(testEquipmentId);

      expect(lockInfo.locked).toBe(true);
      expect(lockInfo.renterId).toBe(testRenterId);
      expect(lockInfo.expiresIn).toBeGreaterThan(0);

      // Cleanup
      await service.forceReleaseLock(testEquipmentId);
    });

    it('should return unlocked status for available equipment', async () => {
      const lockInfo = await service.checkLock('available-equipment-999');

      expect(lockInfo.locked).toBe(false);
      expect(lockInfo.renterId).toBeUndefined();
      expect(lockInfo.expiresIn).toBeUndefined();
    });
  });

  describe('extendLock', () => {
    it('should extend lock TTL', async () => {
      await service.acquireLock(testEquipmentId, testRenterId, 300);

      const initialLock = await service.checkLock(testEquipmentId);
      const initialTTL = initialLock.expiresIn || 0;

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const extended = await service.extendLock(
        testEquipmentId,
        testRenterId,
        300,
      );

      expect(extended).toBe(true);

      const extendedLock = await service.checkLock(testEquipmentId);
      const extendedTTL = extendedLock.expiresIn || 0;

      // TTL should be longer after extension
      expect(extendedTTL).toBeGreaterThan(initialTTL);

      // Cleanup
      await service.forceReleaseLock(testEquipmentId);
    });

    it('should not extend lock held by different renter', async () => {
      await service.acquireLock(testEquipmentId, testRenterId);

      const extended = await service.extendLock(
        testEquipmentId,
        'wrong-renter',
        300,
      );

      expect(extended).toBe(false);

      // Cleanup
      await service.forceReleaseLock(testEquipmentId);
    });
  });

  describe('forceReleaseLock', () => {
    it('should force release any lock', async () => {
      await service.acquireLock(testEquipmentId, testRenterId);

      const released = await service.forceReleaseLock(testEquipmentId);

      expect(released).toBe(true);

      const lockInfo = await service.checkLock(testEquipmentId);
      expect(lockInfo.locked).toBe(false);
    });

    it('should return false when force releasing non-existent lock', async () => {
      const released = await service.forceReleaseLock('non-existent-lock');

      expect(released).toBe(false);
    });
  });

  describe('getActiveLocks', () => {
    it('should list all active locks', async () => {
      const equipment1 = 'test-equipment-1-' + Date.now();
      const equipment2 = 'test-equipment-2-' + Date.now();

      await service.acquireLock(equipment1, 'renter-1');
      await service.acquireLock(equipment2, 'renter-2');

      const activeLocks = await service.getActiveLocks();

      expect(activeLocks).toBeDefined();
      expect(Array.isArray(activeLocks)).toBe(true);
      expect(activeLocks.length).toBeGreaterThanOrEqual(2);

      const lock1 = activeLocks.find((l) => l.equipmentId === equipment1);
      const lock2 = activeLocks.find((l) => l.equipmentId === equipment2);

      expect(lock1).toBeDefined();
      expect(lock1?.renterId).toBe('renter-1');
      expect(lock2).toBeDefined();
      expect(lock2?.renterId).toBe('renter-2');

      // Cleanup
      await service.forceReleaseLock(equipment1);
      await service.forceReleaseLock(equipment2);
    });
  });

  describe('Race Condition Test', () => {
    it('should handle concurrent lock attempts correctly', async () => {
      const equipmentId = 'race-test-' + Date.now();

      // Simulate 10 renters trying to book simultaneously
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          service
            .acquireLock(equipmentId, `renter-${i}`)
            .catch((error) => error),
        );
      }

      const results = await Promise.all(promises);

      // Only one should succeed (true), others should fail (ConflictException)
      const successes = results.filter((r) => r === true);
      const failures = results.filter((r) => r instanceof ConflictException);

      expect(successes.length).toBe(1);
      expect(failures.length).toBe(9);

      // Cleanup
      await service.forceReleaseLock(equipmentId);
    });
  });
});
