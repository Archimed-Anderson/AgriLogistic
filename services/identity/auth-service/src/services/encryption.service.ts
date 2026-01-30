import crypto from 'crypto';
import { logger } from './logger.service';

/**
 * Encryption Service for Sensitive Data
 * Uses AES-256-GCM for encryption
 */

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 16;  // 128 bits
  private readonly saltLength = 64;
  private readonly tagLength = 16;
  private readonly iterations = 100000; // PBKDF2 iterations

  private masterKey: Buffer;

  constructor() {
    const masterKeyEnv = process.env.ENCRYPTION_MASTER_KEY;
    
    if (!masterKeyEnv || masterKeyEnv.length < 64) {
      logger.warn('ENCRYPTION_MASTER_KEY not set or too short. Using default (NOT SECURE FOR PRODUCTION)');
      // Generate a key for development (should never be used in production)
      this.masterKey = crypto.randomBytes(this.keyLength);
    } else {
      // Derive key from master key environment variable
      this.masterKey = crypto.scryptSync(
        masterKeyEnv,
        'AgriLogistic-salt',
        this.keyLength
      );
    }
  }

  /**
   * Encrypt sensitive data
   * @param plaintext - Data to encrypt
   * @param contextData - Additional context for key derivation (optional)
   * @returns Base64-encoded encrypted data with IV, salt, and tag
   */
  encrypt(plaintext: string, contextData?: string): string {
    try {
      if (!plaintext) {
        return '';
      }

      // Generate random IV and salt
      const iv = crypto.randomBytes(this.ivLength);
      const salt = crypto.randomBytes(this.saltLength);

      // Derive encryption key
      const key = this.deriveKey(salt, contextData);

      // Create cipher
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);

      // Encrypt
      let encrypted = cipher.update(plaintext, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      // Get authentication tag
      const tag = cipher.getAuthTag();

      // Combine: salt + iv + tag + encrypted data
      const combined = Buffer.concat([
        salt,
        iv,
        tag,
        Buffer.from(encrypted, 'base64')
      ]);

      return combined.toString('base64');
    } catch (error) {
      logger.error('Encryption error:', error);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypt sensitive data
   * @param encrypted - Base64-encoded encrypted data
   * @param contextData - Additional context for key derivation (must match encryption)
   * @returns Decrypted plaintext
   */
  decrypt(encrypted: string, contextData?: string): string {
    try {
      if (!encrypted) {
        return '';
      }

      // Decode from base64
      const combined = Buffer.from(encrypted, 'base64');

      // Extract components
      const salt = combined.slice(0, this.saltLength);
      const iv = combined.slice(this.saltLength, this.saltLength + this.ivLength);
      const tag = combined.slice(
        this.saltLength + this.ivLength,
        this.saltLength + this.ivLength + this.tagLength
      );
      const encryptedData = combined.slice(
        this.saltLength + this.ivLength + this.tagLength
      );

      // Derive encryption key
      const key = this.deriveKey(salt, contextData);

      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      decipher.setAuthTag(tag);

      // Decrypt
      let decrypted = decipher.update(encryptedData.toString('base64'), 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('Decryption error:', error);
      throw new Error('Decryption failed');
    }
  }

  /**
   * Derive encryption key from master key and salt
   * @param salt - Random salt
   * @param contextData - Additional context (e.g., user ID)
   * @returns Derived key
   */
  private deriveKey(salt: Buffer, contextData?: string): Buffer {
    const info = contextData ? Buffer.from(contextData, 'utf8') : Buffer.alloc(0);
    
    return crypto.pbkdf2Sync(
      this.masterKey,
      Buffer.concat([salt, info]),
      this.iterations,
      this.keyLength,
      'sha256'
    );
  }

  /**
   * Hash data (one-way, for comparison only)
   * @param data - Data to hash
   * @returns Hex-encoded hash
   */
  hash(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }

  /**
   * Generate a secure random token
   * @param length - Length in bytes (default: 32)
   * @returns Hex-encoded random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Mask sensitive data for logging
   * @param data - Data to mask
   * @param visibleChars - Number of characters to show at start and end
   * @returns Masked string
   */
  maskSensitiveData(data: string, visibleChars: number = 4): string {
    if (!data || data.length <= visibleChars * 2) {
      return '***';
    }

    const start = data.substring(0, visibleChars);
    const end = data.substring(data.length - visibleChars);
    const middle = '*'.repeat(Math.min(data.length - visibleChars * 2, 10));

    return `${start}${middle}${end}`;
  }

  /**
   * Encrypt phone number
   * Special method with additional validation
   */
  encryptPhone(phone: string): string {
    if (!phone) return '';
    
    // Validate phone format (E.164)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      logger.warn('Invalid phone format for encryption');
    }

    return this.encrypt(phone, 'phone');
  }

  /**
   * Decrypt phone number
   */
  decryptPhone(encrypted: string): string {
    if (!encrypted) return '';
    return this.decrypt(encrypted, 'phone');
  }

  /**
   * Encrypt email (for special cases where email needs encryption)
   */
  encryptEmail(email: string): string {
    if (!email) return '';
    return this.encrypt(email.toLowerCase(), 'email');
  }

  /**
   * Decrypt email
   */
  decryptEmail(encrypted: string): string {
    if (!encrypted) return '';
    return this.decrypt(encrypted, 'email');
  }

  /**
   * Encrypt address
   */
  encryptAddress(address: string): string {
    if (!address) return '';
    return this.encrypt(address, 'address');
  }

  /**
   * Decrypt address
   */
  decryptAddress(encrypted: string): string {
    if (!encrypted) return '';
    return this.decrypt(encrypted, 'address');
  }

  /**
   * Verify data integrity
   * @param data - Original data
   * @param hash - Hash to verify against
   * @returns True if data matches hash
   */
  verifyIntegrity(data: string, hash: string): boolean {
    const computedHash = this.hash(data);
    return crypto.timingSafeEqual(
      Buffer.from(computedHash, 'hex'),
      Buffer.from(hash, 'hex')
    );
  }

  /**
   * Create HMAC for data authentication
   * @param data - Data to authenticate
   * @returns Hex-encoded HMAC
   */
  createHmac(data: string): string {
    return crypto
      .createHmac('sha256', this.masterKey)
      .update(data)
      .digest('hex');
  }

  /**
   * Verify HMAC
   * @param data - Original data
   * @param hmac - HMAC to verify
   * @returns True if HMAC is valid
   */
  verifyHmac(data: string, hmac: string): boolean {
    const computedHmac = this.createHmac(data);
    return crypto.timingSafeEqual(
      Buffer.from(computedHmac, 'hex'),
      Buffer.from(hmac, 'hex')
    );
  }
}

// Singleton instance
let encryptionServiceInstance: EncryptionService | null = null;

export const getEncryptionService = (): EncryptionService => {
  if (!encryptionServiceInstance) {
    encryptionServiceInstance = new EncryptionService();
  }
  return encryptionServiceInstance;
};

/**
 * Usage Examples:
 * 
 * const encryptionService = getEncryptionService();
 * 
 * // Encrypt sensitive data
 * const encrypted = encryptionService.encryptPhone('+33612345678');
 * 
 * // Decrypt
 * const phone = encryptionService.decryptPhone(encrypted);
 * 
 * // For logging
 * logger.info('Processing phone', { 
 *   phone: encryptionService.maskSensitiveData(phone) 
 * });
 * 
 * // Generate secure token
 * const resetToken = encryptionService.generateToken(32);
 * 
 * // Create/verify integrity
 * const hash = encryptionService.hash(data);
 * const isValid = encryptionService.verifyIntegrity(data, hash);
 */


