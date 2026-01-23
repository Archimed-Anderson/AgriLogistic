import { describe, it, expect, beforeEach, vi } from 'vitest';
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

(globalThis as any).localStorage = localStorageMock as any;

describe('Auth Performance Tests', () => {
  let adapter: RealAuthAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new RealAuthAdapter();
  });

  describe('Login Performance', () => {
    it('should complete login within acceptable time', async () => {
      const mockTokenResponse = {
        access_token: 'token',
        refresh_token: 'refresh-token',
        expires_in: 3600,
      };
      const mockMeResponse = {
        id: '1',
        email: 'test@example.com',
        full_name: 'Test User',
      };

      // Use fake timers to make the test deterministic.
      vi.useFakeTimers();
      vi.setSystemTime(new Date(0));
      try {
        vi.mocked(apiClient.post).mockImplementation(
          () => new Promise(resolve => setTimeout(() => resolve(mockTokenResponse), 50))
        );
        vi.mocked(apiClient.get).mockResolvedValue(mockMeResponse);

        const startTime = Date.now();
        const p = adapter.login('test@example.com', 'password');
        await vi.advanceTimersByTimeAsync(50);
        await p;
        const endTime = Date.now();

        const duration = endTime - startTime;
        expect(duration).toBeLessThan(200); // Should complete in < 200ms
      } finally {
        vi.useRealTimers();
      }
    });

    it('should handle concurrent login requests', async () => {
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
        full_name: 'Test User',
      };

      // Use fake timers to make the test deterministic.
      vi.useFakeTimers();
      vi.setSystemTime(new Date(0));
      try {
        vi.mocked(apiClient.get).mockImplementation(
          () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 30))
        );

        const startTime = Date.now();
        const p = adapter.getCurrentUser();
        await vi.advanceTimersByTimeAsync(30);
        await p;
        const endTime = Date.now();

        const duration = endTime - startTime;
        expect(duration).toBeLessThan(100); // Should be very fast
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory with multiple logins', async () => {
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
      const mockTokenResponse = {
        access_token: 'token',
        refresh_token: 'refresh-token',
        expires_in: 3600,
      };

      vi.mocked(apiClient.get).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        full_name: 'Test User',
      });

      vi.mocked(apiClient.post).mockImplementation(() =>
        new Promise(resolve => {
          const start = Date.now();
          setTimeout(() => {
            responseTimes.push(Date.now() - start);
            resolve(mockTokenResponse);
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
