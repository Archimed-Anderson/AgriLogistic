import { describe, it, expect, vi } from 'vitest';
import { hashPassword, isCryptoAvailable } from '../password-hash';

describe('password-hash utilities', () => {
  describe('isCryptoAvailable', () => {
    it('should return true when crypto is available', () => {
      expect(isCryptoAvailable()).toBe(true);
    });
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeTruthy();
      expect(typeof hash).toBe('string');
      expect(hash).toContain(':');
    });

    it('should produce different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      // Hashes should be different due to different salts
      expect(hash1).not.toBe(hash2);
    });

    it('should produce hash in format salt:hash', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      const parts = hash.split(':');
      expect(parts.length).toBe(2);
      expect(parts[0].length).toBeGreaterThan(0); // salt
      expect(parts[1].length).toBeGreaterThan(0); // hash
    });

    it('should handle empty password', async () => {
      const hash = await hashPassword('');
      expect(hash).toBeTruthy();
      expect(hash).toContain(':');
    });

    it('should handle special characters', async () => {
      const password = 'P@ssw0rd!#$%^&*()';
      const hash = await hashPassword(password);

      expect(hash).toBeTruthy();
      expect(hash).toContain(':');
    });
  });
});
