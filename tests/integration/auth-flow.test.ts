import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { RealAuthAdapter } from '../../src/infrastructure/api/rest/auth-api';
import { Email } from '@domain/value-objects/email.vo';
import { UserRole } from '@domain/enums/user-role.enum';

/**
 * Tests d'intégration pour le flux d'authentification complet
 * Utilise des mocks pour éviter les dépendances au backend
 */
describe('Auth Flow Integration Tests', () => {
  const adapter = new RealAuthAdapter();
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  beforeAll(() => {
    // Mock global fetch pour simuler les réponses API
    global.fetch = vi.fn() as any;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Registration Flow', () => {
    it('should register a new buyer successfully', async () => {
      const mockUser = {
        id: 'user-123',
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        role: UserRole.BUYER,
      };

      const mockResponse = {
        success: true,
        token: 'mock-access-token',
        user: mockUser,
        expiresIn: 3600,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await adapter.register({
        email: testEmail,
        password: testPassword,
        firstName: 'Test',
        lastName: 'User',
        accountType: UserRole.BUYER,
        phone: '1234567890',
        acceptTerms: true,
      });

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email.value).toBe(testEmail);
      expect(localStorage.getItem('accessToken')).toBeTruthy();
    });
  });

  describe('Login Flow', () => {
    it('should login with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        role: UserRole.BUYER,
      };

      const mockResponse = {
        success: true,
        token: 'mock-access-token',
        user: mockUser,
        expiresIn: 3600,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await adapter.login(testEmail, testPassword);

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email.value).toBe(testEmail);
      expect(localStorage.getItem('accessToken')).toBeTruthy();
    });

    it('should fail login with invalid credentials', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ success: false, error: 'Invalid credentials' }),
      });

      await expect(adapter.login(testEmail, 'wrongpassword')).rejects.toThrow();
    });
  });

  describe('Get Current User', () => {
    it('should get current user after login', async () => {
      const mockUser = {
        id: 'user-123',
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        role: UserRole.BUYER,
      };

      // Mock login response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'mock-access-token',
          user: mockUser,
          expiresIn: 3600,
        }),
      });

      await adapter.login(testEmail, testPassword);

      // Mock getCurrentUser response with proper user object including email
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: {
            id: 'user-123',
            firstName: 'Test',
            lastName: 'User',
            email: testEmail, // Include email in response
            role: UserRole.BUYER,
          },
        }),
      });

      const user = await adapter.getCurrentUser();

      expect(user).toBeDefined();
      if (user) {
        expect(user.email.value).toBe(testEmail);
      }
    });
  });

  describe('Logout Flow', () => {
    it('should logout and clear tokens', async () => {
      const mockUser = {
        id: 'user-123',
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        role: UserRole.BUYER,
      };

      // Mock login
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'mock-access-token',
          user: mockUser,
          expiresIn: 3600,
        }),
      });

      await adapter.login(testEmail, testPassword);
      expect(localStorage.getItem('accessToken')).toBeTruthy();

      // Mock logout
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Logged out' }),
      });

      await adapter.logout();

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });
});
