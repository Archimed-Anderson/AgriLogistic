import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setSecureCookie, getCookie, deleteCookie, hasCookie } from '../cookie';

describe('cookie utilities', () => {
  beforeEach(() => {
    // Clear all cookies before each test
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      deleteCookie(name);
    });
  });

  afterEach(() => {
    // Clean up after each test
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      deleteCookie(name);
    });
  });

  describe('setSecureCookie', () => {
    it('should set a cookie with default options', () => {
      setSecureCookie('test', 'value');

      const cookie = getCookie('test');
      expect(cookie).toBe('value');
    });

    it('should set a cookie with custom maxAge', () => {
      setSecureCookie('test', 'value', { maxAge: 7 });

      const cookie = getCookie('test');
      expect(cookie).toBe('value');
    });

    it('should encode cookie value', () => {
      setSecureCookie('test', 'value with spaces');

      const cookie = getCookie('test');
      expect(cookie).toBe('value with spaces');
    });
  });

  describe('getCookie', () => {
    it('should retrieve existing cookie', () => {
      setSecureCookie('test', 'value');

      const cookie = getCookie('test');
      expect(cookie).toBe('value');
    });

    it('should return null for non-existent cookie', () => {
      const cookie = getCookie('non-existent');
      expect(cookie).toBeNull();
    });

    it('should decode cookie value', () => {
      setSecureCookie('test', 'value%20with%20spaces');

      const cookie = getCookie('test');
      expect(cookie).toBe('value%20with%20spaces');
    });
  });

  describe('deleteCookie', () => {
    it('should delete an existing cookie', () => {
      setSecureCookie('test', 'value');
      expect(getCookie('test')).toBe('value');

      deleteCookie('test');
      expect(getCookie('test')).toBeNull();
    });

    it('should not throw error when deleting non-existent cookie', () => {
      expect(() => deleteCookie('non-existent')).not.toThrow();
    });
  });

  describe('hasCookie', () => {
    it('should return true for existing cookie', () => {
      setSecureCookie('test', 'value');
      expect(hasCookie('test')).toBe(true);
    });

    it('should return false for non-existent cookie', () => {
      expect(hasCookie('non-existent')).toBe(false);
    });
  });
});
