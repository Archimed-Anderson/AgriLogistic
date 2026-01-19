import { PasswordService } from '../../../src/services/password.service';

describe('PasswordService', () => {
  let passwordService: PasswordService;

  beforeEach(() => {
    passwordService = new PasswordService();
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'TestPassword123!';
      const hash = await passwordService.hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2b$')).toBe(true); // bcrypt hash format
    });

    it('should produce different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await passwordService.hashPassword(password);
      const hash2 = await passwordService.hashPassword(password);
      
      expect(hash1).not.toBe(hash2); // Different salts produce different hashes
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await passwordService.hashPassword(password);
      const isValid = await passwordService.verifyPassword(password, hash);
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hash = await passwordService.hashPassword(password);
      const isValid = await passwordService.verifyPassword(wrongPassword, hash);
      
      expect(isValid).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should accept strong password', () => {
      const password = 'StrongPass123!';
      const result = passwordService.validatePasswordStrength(password);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password shorter than 8 characters', () => {
      const password = 'Short1!';
      const result = passwordService.validatePasswordStrength(password);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without lowercase', () => {
      const password = 'UPPERCASE123!';
      const result = passwordService.validatePasswordStrength(password);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without uppercase', () => {
      const password = 'lowercase123!';
      const result = passwordService.validatePasswordStrength(password);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without number', () => {
      const password = 'NoNumberPass!';
      const result = passwordService.validatePasswordStrength(password);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const password = 'NoSpecialChar123';
      const result = passwordService.validatePasswordStrength(password);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should reject password longer than 128 characters', () => {
      const password = 'A'.repeat(129) + '1!';
      const result = passwordService.validatePasswordStrength(password);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must not exceed 128 characters');
    });
  });

  describe('generateRandomPassword', () => {
    it('should generate a random password', () => {
      const password = passwordService.generateRandomPassword();
      
      expect(password).toBeDefined();
      expect(password.length).toBeGreaterThanOrEqual(16);
    });

    it('should generate password with specified length', () => {
      const length = 20;
      const password = passwordService.generateRandomPassword(length);
      
      expect(password.length).toBe(length);
    });

    it('should generate password with all required character types', () => {
      const password = passwordService.generateRandomPassword();
      
      expect(/[a-z]/.test(password)).toBe(true);
      expect(/[A-Z]/.test(password)).toBe(true);
      expect(/[0-9]/.test(password)).toBe(true);
      expect(/[!@#$%^&*(),.?":{}|<>]/.test(password)).toBe(true);
    });
  });
});
