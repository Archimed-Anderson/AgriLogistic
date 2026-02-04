import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, APIError } from '../api-client-enhanced';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('API Client Enhanced', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('diagnoseConnection', () => {
    it('should return isReachable=true when health endpoint responds successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ status: 'healthy' }),
      });

      const result = await apiClient.diagnoseConnection();

      expect(result.isReachable).toBe(true);
      expect(result.endpoint).toContain('localhost');
      expect(result.error).toBeUndefined();
      expect(result.suggestion).toBeUndefined();
    });

    it('should return isReachable=false with suggestion when server responds with error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      const result = await apiClient.diagnoseConnection();

      expect(result.isReachable).toBe(false);
      expect(result.error).toBe('HTTP 503');
      expect(result.suggestion).toContain('services backend');
    });

    it('should detect timeout errors', async () => {
      mockFetch.mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));

      const result = await apiClient.diagnoseConnection();

      expect(result.isReachable).toBe(false);
      expect(result.error).toBe('Timeout');
      expect(result.suggestion).toContain('trop de temps');
    });

    it('should detect connection failures', async () => {
      const networkError = new TypeError('Failed to fetch');
      mockFetch.mockRejectedValueOnce(networkError);

      const result = await apiClient.diagnoseConnection();

      expect(result.isReachable).toBe(false);
      expect(result.error).toBe('Connection failed');
      expect(result.suggestion).toContain('backend est démarré');
      expect(result.suggestion).toContain('.env');
    });
  });

  describe('Error Handling', () => {
    it('should create APIError with network error details', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      try {
        await apiClient.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        const apiError = error as APIError;
        expect(apiError.isNetworkError).toBe(true);
        expect(apiError.message).toContain('backend est démarré');
      }
    });

    it('should create APIError with timeout details', async () => {
      mockFetch.mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));

      try {
        await apiClient.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        const apiError = error as APIError;
        expect(apiError.isTimeout).toBe(true);
        expect(apiError.message).toContain('trop de temps');
      }
    });

    it('should parse JSON error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
        json: async () => ({ error: 'Invalid credentials' }),
      });

      try {
        await apiClient.post('/auth/login', { email: 'test@test.com', password: 'wrong' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        const apiError = error as APIError;
        expect(apiError.statusCode).toBe(400);
        expect(apiError.message).toBe('Invalid credentials');
      }
    });

    it('should identify server errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
        json: async () => ({ error: 'Internal server error' }),
      });

      try {
        await apiClient.get('/test', { skipRetry: true });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        const apiError = error as APIError;
        expect(apiError.isServerError).toBe(true);
        expect(apiError.statusCode).toBe(500);
      }
    });
  });

  describe('Retry Logic', () => {
    it('should retry on retryable status codes', async () => {
      // First call fails with 503, second succeeds
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
          headers: { get: () => null },
          text: async () => 'Service Unavailable',
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
        });

      const result = await apiClient.get('/test');

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-retryable errors (401)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: { get: () => null },
        json: async () => ({ error: 'Unauthorized' }),
      });

      try {
        await apiClient.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        expect(mockFetch).toHaveBeenCalledTimes(1);
      }
    });

    it('should respect skipRetry option', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        headers: { get: () => null },
        text: async () => 'Service Unavailable',
      });

      try {
        await apiClient.get('/test', { skipRetry: true });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Authentication', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should refresh token on 401 using OAuth2 snake_case payload/response', async () => {
      localStorage.setItem('refreshToken', 'rt-123');

      // 1) original request -> 401
      // 2) refresh -> 200 with OAuth2-style keys
      // 3) retry original request -> 200
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          headers: { get: (name: string) => (name === 'content-type' ? 'application/json' : null) },
          json: async () => ({ error: 'Unauthorized' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ access_token: 'at-456', refresh_token: 'rt-789' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: 'ok' }),
        });

      const result = await apiClient.get('/test', { skipRetry: true });

      expect(result).toEqual({ data: 'ok' });
      expect(localStorage.getItem('accessToken')).toBe('at-456');
      expect(localStorage.getItem('refreshToken')).toBe('rt-789');

      const refreshCall = mockFetch.mock.calls[1];
      expect(String(refreshCall[0])).toContain('/auth/refresh');
      expect(refreshCall[1]?.method).toBe('POST');
      expect(refreshCall[1]?.body).toBe(
        JSON.stringify({ refresh_token: 'rt-123', refreshToken: 'rt-123' })
      );
    });

    it('should include Authorization header when token exists', async () => {
      localStorage.setItem('accessToken', 'test-token-123');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await apiClient.get('/test');

      const callArgs = mockFetch.mock.calls[0];
      const headers = callArgs[1]?.headers as Record<string, string>;
      expect(headers['Authorization']).toBe('Bearer test-token-123');
    });

    it('should not include Authorization header when no token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await apiClient.get('/test');

      const callArgs = mockFetch.mock.calls[0];
      const headers = callArgs[1]?.headers as Record<string, string>;
      expect(headers['Authorization']).toBeUndefined();
    });
  });

  describe('HTTP Methods', () => {
    it('should make GET requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      });

      const result = await apiClient.get('/test');

      expect(result).toEqual({ data: 'test' });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should make POST requests with body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await apiClient.post('/test', { name: 'Test' });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[1]?.method).toBe('POST');
      expect(callArgs[1]?.body).toBe(JSON.stringify({ name: 'Test' }));
    });

    it('should make PUT requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await apiClient.put('/test/1', { name: 'Updated' });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[1]?.method).toBe('PUT');
    });

    it('should make DELETE requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await apiClient.delete('/test/1');

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[1]?.method).toBe('DELETE');
    });
  });

  describe('checkHealth', () => {
    it('should return true when health endpoint is accessible', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ status: 'healthy' }),
      });

      const result = await apiClient.checkHealth();

      expect(result).toBe(true);
    });

    it('should return false when health endpoint is not accessible', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await apiClient.checkHealth();

      expect(result).toBe(false);
    });
  });
});
