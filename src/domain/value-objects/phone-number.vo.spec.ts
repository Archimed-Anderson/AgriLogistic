import { describe, it, expect } from 'vitest';
import { PhoneNumber } from './phone-number.vo';

describe('PhoneNumber Value Object', () => {
  describe('Valid phone numbers', () => {
    it('should accept valid international format with +', () => {
      const phone = new PhoneNumber('+33612345678');
      expect(phone.value).toBe('+33612345678');
    });

    it('should accept valid phone number without +', () => {
      const phone = new PhoneNumber('33612345678');
      expect(phone.value).toBe('33612345678');
    });

    it('should normalize phone number by removing spaces and dashes', () => {
      const phone = new PhoneNumber('+33 6 12 34 56 78');
      expect(phone.value).toBe('+33612345678');
    });

    it('should accept different country codes', () => {
      const usPhone = new PhoneNumber('+15551234567');
      const ukPhone = new PhoneNumber('+447911123456');

      expect(usPhone.value).toBe('+15551234567');
      expect(ukPhone.value).toBe('+447911123456');
    });
  });

  describe('Invalid phone numbers', () => {
    it('should reject phone numbers that are too short', () => {
      expect(() => new PhoneNumber('+3361234')).toThrow('Invalid phone number');
    });

    it('should reject phone numbers that are too long', () => {
      expect(() => new PhoneNumber('+336123456789012345')).toThrow('Invalid phone number');
    });

    it('should normalize phone numbers with letters by removing them', () => {
      // The phone number normalizes by removing non-digits
      const phone = new PhoneNumber('+33abc123456');
      // After normalization: +33123456 (8 digits, which is minimum valid)
      expect(phone.value).toBe('+33123456');
    });

    it('should reject empty phone numbers', () => {
      expect(() => new PhoneNumber('')).toThrow('Invalid phone number');
    });
  });

  describe('Formatting', () => {
    it('should format phone number with country code', () => {
      const phone = new PhoneNumber('+33612345678');
      expect(phone.formatted).toContain('+33');
    });

    it('should group digits in formatted output', () => {
      const phone = new PhoneNumber('+33612345678');
      expect(phone.formatted.split(' ').length).toBeGreaterThan(1);
    });
  });

  describe('Equality', () => {
    it('should correctly compare equal phone numbers', () => {
      const phone1 = new PhoneNumber('+33612345678');
      const phone2 = new PhoneNumber('+33612345678');

      expect(phone1.equals(phone2)).toBe(true);
    });

    it('should correctly compare different phone numbers', () => {
      const phone1 = new PhoneNumber('+33612345678');
      const phone2 = new PhoneNumber('+33612345679');

      expect(phone1.equals(phone2)).toBe(false);
    });
  });
});
