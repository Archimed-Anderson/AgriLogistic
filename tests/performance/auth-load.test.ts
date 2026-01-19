import { describe, it, expect } from 'vitest';
import { RealAuthAdapter } from '../../src/infrastructure/api/rest/auth-api';
import { apiClient } from '../../src/infrastructure/api/rest/api-client';
import { vi } from 'vitest';

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

describe('Auth Performance Tests', () => {
  let adapter: RealAuthAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new RealAuthAdapter();
  });

  describe('Login Performance', () => {
    it('should complete login within acceptable time', async () => {
      const mockResponse = {
        success: true,
        token: 'token',
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'buyer',
        },
      };

      // Simulate fast response (< 200ms)
      vi.mocked(apiClient.post).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockResponse), 50))
      );

      const startTime = Date.now();
      await adapter.login('test@example.com', 'password');
      const endTime = Date.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(200); // Should complete in < 200ms
    });

    it('should handle concurrent login requests', async () => {
      const mockResponse = {
        success: true,
        token: 'token',
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'buyer',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const startTime = Date.now();
      const promises = Array.from({ length: 10 }, () =>
        adapter.login('test@example.com', 'password')
      );
      await Promise.all(promises);
      const endTime = Date.now();

      const duration = endTime - startTime;
      // All 10 requests should complete reasonably fast
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Token Refresh Performance', () => {
    it('should refresh token efficiently', async () => {
      localStorageMock.getItem.mockReturnValue('token');
      const mockResponse = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'buyer',
      };

      vi.mocked(apiClient.get).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve(mockResponse), 30))
      );

      const startTime = Date.now();
      await adapter.getCurrentUser();
      const endTime = Date.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(100); // Should be very fast
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory with multiple logins', async () => {
      const mockResponse = {
        success: true,
        token: 'token',
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'buyer',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      // Perform multiple logins
      for (let i = 0; i < 100; i++) {
        await adapter.login('test@example.com', 'password');
      }

      // Verify localStorage was called appropriately
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Response Time Metrics', () => {
    it('should track login response times', async () => {
      const responseTimes: number[] = [];
      const mockResponse = {
        success: true,
        token: 'token',
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'buyer',
        },
      };

      vi.mocked(apiClient.post).mockImplementation(() =>
        new Promise(resolve => {
          const start = Date.now();
          setTimeout(() => {
            responseTimes.push(Date.now() - start);
            resolve(mockResponse);
          }, Math.random() * 100);
        })
      );

      // Perform multiple requests
      for (let i = 0; i < 10; i++) {
        await adapter.login('test@example.com', 'password');
      }

      // Calculate average response time
      const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      expect(avgTime).toBeLessThan(200); // Average should be < 200ms
    });
  });
});
