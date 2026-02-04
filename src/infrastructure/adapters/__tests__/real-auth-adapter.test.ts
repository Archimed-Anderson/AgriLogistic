import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RealAuthAdapter } from '../../api/rest/auth-api';
import { apiClient } from '../../api/rest/api-client';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';

// Mock apiClient
vi.mock('../../api/rest/api-client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = localStorageMock as any;

describe('RealAuthAdapter', () => {
  let adapter: RealAuthAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new RealAuthAdapter();
  });

  describe('login', () => {
    it('should login successfully and store tokens', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        access_token: 'access-token-123',
        refresh_token: 'refresh-token-123',
        expires_in: 3600,
      });
      vi.mocked(apiClient.get).mockResolvedValue({
        id: 'user-1',
        email: 'john@example.com',
        full_name: 'John Doe',
      });

      const result = await adapter.login('john@example.com', 'password123');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'john@example.com',
        password: 'password123',
      });
      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');

      expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'access-token-123');
      expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token-123');

      expect(result.token).toBe('access-token-123');
      expect(result.user).toBeDefined();
      expect(result.user.email.value).toBe('john@example.com');
      expect(result.user.firstName).toBe('John');
      expect(result.user.id).toBe('user-1');
    });

    it('should throw error when login fails', async () => {
      const mockResponse = {
        success: false,
        error: 'Invalid credentials',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      await expect(adapter.login('john@example.com', 'wrong')).rejects.toThrow('Login failed');
    });

    it('should handle API errors', async () => {
      vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

      await expect(adapter.login('john@example.com', 'password123')).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        user_id: 'user-1',
        message: 'Verification email sent',
        verification_token: 'verify-token-123',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const registerData = {
        email: 'jane@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '1234567890',
        accountType: 'buyer' as any,
        acceptTerms: true,
      };

      const result = await adapter.register(registerData);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/register',
        expect.objectContaining({
          email: 'jane@example.com',
          full_name: 'Jane Smith',
        })
      );

      expect(result.email).toBe('jane@example.com');
      expect(result.userId).toBe('user-1');
      expect(result.verificationToken).toBe('verify-token-123');
    });
  });

  describe('logout', () => {
    it('should logout and clear tokens', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ success: true });

      await adapter.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
      expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });

    it('should clear tokens even if API call fails', async () => {
      vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

      await adapter.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('getCurrentUser', () => {
    it('should return user when token exists', async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');

      const mockResponse = {
        id: 'user-1',
        email: 'john@example.com',
        full_name: 'John Doe',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const user = await adapter.getCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(user).toBeDefined();
      expect(user).toBeInstanceOf(User);
      expect(user?.firstName).toBe('John');
      expect(user?.email.value).toBe('john@example.com');
      expect(user?.id).toBe('user-1');
    });

    it('should return null when no token exists', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const user = await adapter.getCurrentUser();

      expect(user).toBeNull();
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it('should return null on API error', async () => {
      localStorageMock.getItem.mockReturnValue('token');
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Unauthorized'));

      const user = await adapter.getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('isConfigured', () => {
    it('should return true when API Gateway is reachable', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
      });

      const isConfigured = await adapter.isConfigured();

      expect(isConfigured).toBe(true);
    });

    it('should return false when API Gateway is unreachable', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const isConfigured = await adapter.isConfigured();

      expect(isConfigured).toBe(false);
    });
  });
});
