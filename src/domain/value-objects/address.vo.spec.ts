import { describe, it, expect } from 'vitest';
import { Address } from './address.vo';

describe('Address Value Object', () => {
  const validAddressProps = {
    street: '123 Main Street',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
  };

  describe('Valid addresses', () => {
    it('should create address with required fields', () => {
      const address = new Address(validAddressProps);
      
      expect(address.street).toBe('123 Main Street');
      expect(address.city).toBe('Paris');
      expect(address.postalCode).toBe('75001');
      expect(address.country).toBe('France');
    });

    it('should create address with optional fields', () => {
      const addressWithOptionals = new Address({
        ...validAddressProps,
        state: 'Île-de-France',
        complement: 'Apartment 42',
      });
      
      expect(addressWithOptionals.state).toBe('Île-de-France');
      expect(addressWithOptionals.complement).toBe('Apartment 42');
    });
  });

  describe('Invalid addresses', () => {
    it('should reject address without street', () => {
      expect(() => new Address({ ...validAddressProps, street: '' })).toThrow('Street is required');
    });

    it('should reject address without city', () => {
      expect(() => new Address({ ...validAddressProps, city: '' })).toThrow('City is required');
    });

    it('should reject address without postal code', () => {
      expect(() => new Address({ ...validAddressProps, postalCode: '' })).toThrow('Postal code is required');
    });

    it('should reject address without country', () => {
      expect(() => new Address({ ...validAddressProps, country: '' })).toThrow('Country is required');
    });
  });

  describe('Formatting', () => {
    it('should format address correctly', () => {
      const address = new Address(validAddressProps);
      const formatted = address.formatted;
      
      expect(formatted).toContain('123 Main Street');
      expect(formatted).toContain('Paris');
      expect(formatted).toContain('75001');
      expect(formatted).toContain('France');
    });

    it('should include optional fields in formatted output', () => {
      const address = new Address({
        ...validAddressProps,
        complement: 'Building B',
        state: 'Île-de-France',
      });
      
      expect(address.formatted).toContain('Building B');
      expect(address.formatted).toContain('Île-de-France');
    });
  });

  describe('Serialization', () => {
    it('should convert to JSON correctly', () => {
      const address = new Address(validAddressProps);
      const json = address.toJSON();
      
      expect(json).toEqual(validAddressProps);
    });
  });

  describe('Equality', () => {
    it('should correctly compare equal addresses', () => {
      const address1 = new Address(validAddressProps);
      const address2 = new Address(validAddressProps);
      
      expect(address1.equals(address2)).toBe(true);
    });

    it('should correctly compare different addresses', () => {
      const address1 = new Address(validAddressProps);
      const address2 = new Address({ ...validAddressProps, street: '456 Other Street' });
      
      expect(address1.equals(address2)).toBe(false);
    });
  });
});
