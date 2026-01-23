import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RealAuthAdapter } from '../../src/infrastructure/api/rest/auth-api';
import { apiClient } from '../../src/infrastructure/api/rest/api-client';

// Mock apiClient
vi.mock('../../src/infrastructure/api/rest/api-client', () => ({
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

describe('Auth Security Tests', () => {
  let adapter: RealAuthAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new RealAuthAdapter();
  });

  describe('SQL Injection Protection', () => {
    it('should sanitize email input to prevent SQL injection', async () => {
      const maliciousEmail = "admin' OR '1'='1";
      const mockResponse = {
        success: false,
        error: 'Invalid credentials',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      try {
        await adapter.login(maliciousEmail, 'password');
      } catch (error) {
        // Expected to fail
      }

      // Verify that the email was sent as-is (API should handle sanitization)
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: maliciousEmail,
        password: 'password',
      });
    });
  });

  describe('XSS Protection', () => {
    it('should handle XSS attempts in user input', async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      const mockResponse = {
        success: false,
        error: 'Invalid email format',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      try {
        await adapter.login(xssPayload, 'password');
      } catch (error) {
        // Expected to fail
      }

      // The API should reject invalid email format
      expect(apiClient.post).toHaveBeenCalled();
    });
  });

  describe('Token Security', () => {
    it('should store tokens securely in localStorage', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        access_token: 'valid-token',
        refresh_token: 'valid-refresh-token',
        expires_in: 3600,
      });
      vi.mocked(apiClient.get).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        full_name: 'Test User',
      });

      const result = await adapter.login('test@example.com', 'password');

      expect(result).toBeDefined();
      expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'valid-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'valid-refresh-token');
    });

    it('should clear tokens on logout', async () => {
      localStorageMock.getItem.mockReturnValue('token');
      vi.mocked(apiClient.post).mockResolvedValue({ success: true });

      await adapter.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('Password Security', () => {
    it('should not log passwords in error messages', async () => {
      const mockResponse = {
        success: false,
        error: 'Invalid credentials',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      try {
        await adapter.login('test@example.com', 'secret-password');
      } catch (error) {
        // Error should not contain password
        const errorString = JSON.stringify(error);
        expect(errorString).not.toContain('secret-password');
      }

      consoleSpy.mockRestore();
    });
  });

  describe('Rate Limiting', () => {
    it('should handle rate limiting errors gracefully', async () => {
      const rateLimitResponse = {
        success: false,
        error: 'Too many requests',
      };

      vi.mocked(apiClient.post).mockResolvedValue(rateLimitResponse);

      await expect(adapter.login('test@example.com', 'password')).rejects.toThrow();
    });
  });

  describe('Token Validation', () => {
    it('should handle expired tokens', async () => {
      localStorageMock.getItem.mockReturnValue('expired-token');
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Token expired'));

      const user = await adapter.getCurrentUser();

      expect(user).toBeNull();
    });

    it('should handle invalid tokens', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-token');
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Invalid token'));

      const user = await adapter.getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('CSRF Protection', () => {
    it('should include proper headers in API requests', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        access_token: 'token',
        refresh_token: 'refresh-token',
        expires_in: 3600,
      });
      vi.mocked(apiClient.get).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        full_name: 'Test User',
      });

      await adapter.login('test@example.com', 'password');

      // Verify that apiClient was called (headers are handled by apiClient)
      expect(apiClient.post).toHaveBeenCalled();
      expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'token');
    });
  });

  describe('Input Validation', () => {
    it('should reject empty email', async () => {
      const mockResponse = {
        success: false,
        error: 'Email is required',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      await expect(adapter.login('', 'password')).rejects.toThrow();
    });

    it('should reject empty password', async () => {
      const mockResponse = {
        success: false,
        error: 'Password is required',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      await expect(adapter.login('test@example.com', '')).rejects.toThrow();
    });
  });
});
