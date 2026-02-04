import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCSRFToken } from '../use-csrf-token';

describe('useCSRFToken', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should generate a token on mount', () => {
    const { result } = renderHook(() => useCSRFToken());

    expect(result.current.token).toBeTruthy();
    expect(typeof result.current.token).toBe('string');
    expect(result.current.token!.length).toBeGreaterThan(0);
  });

  it('should retrieve existing token from sessionStorage', () => {
    const existingToken = 'existing-csrf-token';
    const expiry = Date.now() + 24 * 60 * 60 * 1000;

    sessionStorage.setItem('csrf_token', existingToken);
    sessionStorage.setItem('csrf_token_expiry', expiry.toString());

    const { result } = renderHook(() => useCSRFToken());

    expect(result.current.token).toBe(existingToken);
  });

  it('should generate new token if existing one is expired', () => {
    const expiredToken = 'expired-token';
    const expiredExpiry = Date.now() - 1000; // Expired 1 second ago

    sessionStorage.setItem('csrf_token', expiredToken);
    sessionStorage.setItem('csrf_token_expiry', expiredExpiry.toString());

    const { result } = renderHook(() => useCSRFToken());

    expect(result.current.token).not.toBe(expiredToken);
    expect(result.current.token).toBeTruthy();
  });

  it('should refresh token', () => {
    const { result } = renderHook(() => useCSRFToken());

    const originalToken = result.current.token;

    act(() => {
      const newToken = result.current.refreshToken();
      expect(newToken).toBeTruthy();
      expect(newToken).not.toBe(originalToken);
    });

    expect(result.current.token).not.toBe(originalToken);
  });

  it('should validate token correctly', () => {
    const { result } = renderHook(() => useCSRFToken());

    const token = result.current.token!;

    act(() => {
      const isValid = result.current.validateToken(token);
      expect(isValid).toBe(true);
    });

    act(() => {
      const isInvalid = result.current.validateToken('wrong-token');
      expect(isInvalid).toBe(false);
    });
  });

  it('should clear token', () => {
    const { result } = renderHook(() => useCSRFToken());

    expect(result.current.token).toBeTruthy();

    act(() => {
      result.current.clearToken();
    });

    expect(result.current.token).toBeNull();
    expect(sessionStorage.getItem('csrf_token')).toBeNull();
  });
});
