import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockAuthAdapter } from '@infrastructure/adapters/mock-auth.adapter';
import { UserRole } from '@domain/enums/user-role.enum';
import { BusinessType } from '@domain/enums/business-type.enum';
import { FarmerSpecialization, LogisticsSpecialization } from '@domain/enums/specialization.enum';
import { RegisterRequestDTO } from '@application/dto/request/register-request.dto';

describe('MockAuthAdapter - User Registration', () => {
  let authAdapter: MockAuthAdapter;

  beforeEach(() => {
    // Create a fresh instance for each test
    authAdapter = new MockAuthAdapter();
    // Clear localStorage
    localStorage.clear();
    // Reset mock database to ensure test isolation
    MockAuthAdapter.resetDatabase();
  });

  describe('Account Creation - Nominal Cases', () => {
    it('should register a new FARMER account with all required fields', async () => {
      const farmerData: RegisterRequestDTO = {
        email: `farmer-${Date.now()}@test.com`,
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'Pierre',
        lastName: 'Agriculteur',
        phone: '+33612345678',
        accountType: UserRole.FARMER,
        businessType: BusinessType.FAMILY_FARM,
        farmSize: 50,
        farmerSpecialization: FarmerSpecialization.CEREALS,
        acceptTerms: true,
        newsletterSubscribed: false,
      };

      const result = await authAdapter.register(farmerData);

      expect(result.email).toContain('@test.com');
      expect(result.userId).toBeTruthy();
      expect(result.verificationToken).toBeTruthy();

      // Verify-first: ensure the created user exists by logging in
      const login = await authAdapter.login(farmerData.email, farmerData.password);
      expect(login.user.firstName).toBe('Pierre');
      expect(login.user.lastName).toBe('Agriculteur');
      expect(login.user.role).toBe(UserRole.FARMER);
    });

    it('should register a new BUYER account with minimal required fields', async () => {
      const buyerData: RegisterRequestDTO = {
        email: `buyer-${Date.now()}@test.com`,
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'Marie',
        lastName: 'Acheteuse',
        phone: '+33698765432',
        accountType: UserRole.BUYER,
        acceptTerms: true,
      };

      const result = await authAdapter.register(buyerData);

      expect(result.userId).toBeTruthy();
      const login = await authAdapter.login(buyerData.email, buyerData.password);
      expect(login.user.role).toBe(UserRole.BUYER);
    });

    it('should register a new TRANSPORTER account with logistics specialization', async () => {
      const transporterData: RegisterRequestDTO = {
        email: `transporter-${Date.now()}@test.com`,
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'Jean',
        lastName: 'Transport',
        phone: '+33611111111',
        accountType: UserRole.TRANSPORTER,
        businessType: BusinessType.SARL,
        logisticsSpecialization: LogisticsSpecialization.REFRIGERATED,
        acceptTerms: true,
      };

      const result = await authAdapter.register(transporterData);

      expect(result.userId).toBeTruthy();
      const login = await authAdapter.login(transporterData.email, transporterData.password);
      expect(login.user.role).toBe(UserRole.TRANSPORTER);
    });

    it('should register a new ADMIN account', async () => {
      const adminData: RegisterRequestDTO = {
        email: `admin-${Date.now()}@test.com`,
        password: 'SecureAdmin123!',
        confirmPassword: 'SecureAdmin123!',
        firstName: 'Admin',
        lastName: 'Test',
        phone: '+33600000099',
        accountType: UserRole.ADMIN,
        acceptTerms: true,
      };

      const result = await authAdapter.register(adminData);

      expect(result.userId).toBeTruthy();
      const login = await authAdapter.login(adminData.email, adminData.password);
      expect(login.user.role).toBe(UserRole.ADMIN);
    });

    it('should not store access token in localStorage after registration (verify-first)', async () => {
      const userData: RegisterRequestDTO = {
        email: `token-test-${Date.now()}@test.com`,
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'Token',
        lastName: 'Test',
        phone: '+33600000088',
        accountType: UserRole.BUYER,
        acceptTerms: true,
      };

      await authAdapter.register(userData);

      const storedToken = localStorage.getItem('accessToken');
      expect(storedToken).toBeNull();
    });
  });

  describe('Account Creation - Error Cases', () => {
    it('should reject registration with existing email', async () => {
      // First, register a user
      const firstUser: RegisterRequestDTO = {
        email: 'duplicate@test.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'First',
        lastName: 'User',
        phone: '+33600000001',
        accountType: UserRole.BUYER,
        acceptTerms: true,
      };

      await authAdapter.register(firstUser);

      // Try to register with the same email
      const duplicateUser: RegisterRequestDTO = {
        ...firstUser,
        firstName: 'Duplicate',
        lastName: 'Attempt',
      };

      await expect(authAdapter.register(duplicateUser)).rejects.toThrow(
        'Un compte avec cet email existe déjà'
      );
    });

    it('should reject registration without email', async () => {
      const invalidData: RegisterRequestDTO = {
        email: '',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'No',
        lastName: 'Email',
        phone: '+33600000002',
        accountType: UserRole.BUYER,
        acceptTerms: true,
      };

      await expect(authAdapter.register(invalidData)).rejects.toThrow(
        'Email et mot de passe requis'
      );
    });

    it('should reject registration without password', async () => {
      const invalidData: RegisterRequestDTO = {
        email: 'nopassword@test.com',
        password: '',
        confirmPassword: '',
        firstName: 'No',
        lastName: 'Password',
        phone: '+33600000003',
        accountType: UserRole.BUYER,
        acceptTerms: true,
      };

      await expect(authAdapter.register(invalidData)).rejects.toThrow(
        'Email et mot de passe requis'
      );
    });

    it('should reject registration without first name', async () => {
      const invalidData: RegisterRequestDTO = {
        email: `noname-${Date.now()}@test.com`,
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: '',
        lastName: 'User',
        phone: '+33600000004',
        accountType: UserRole.BUYER,
        acceptTerms: true,
      };

      await expect(authAdapter.register(invalidData)).rejects.toThrow('Prénom et nom requis');
    });

    it('should reject registration without last name', async () => {
      const invalidData: RegisterRequestDTO = {
        email: `nolastname-${Date.now()}@test.com`,
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'First',
        lastName: '',
        phone: '+33600000005',
        accountType: UserRole.BUYER,
        acceptTerms: true,
      };

      await expect(authAdapter.register(invalidData)).rejects.toThrow('Prénom et nom requis');
    });
  });

  describe('Login with Pre-registered Users', () => {
    it('should login with demo admin account', async () => {
      const result = await authAdapter.login('admin@AgroLogistic.com', 'admin123');

      expect(result.user).toBeDefined();
      expect(result.user.role).toBe(UserRole.ADMIN);
      expect(result.user.firstName).toBe('Admin');
    });

    it('should login with demo farmer account', async () => {
      const result = await authAdapter.login('farmer@AgroLogistic.com', 'farmer123');

      expect(result.user).toBeDefined();
      expect(result.user.role).toBe(UserRole.FARMER);
      expect(result.user.firstName).toBe('Pierre');
    });

    it('should login with demo buyer account', async () => {
      const result = await authAdapter.login('buyer@AgroLogistic.com', 'buyer123');

      expect(result.user).toBeDefined();
      expect(result.user.role).toBe(UserRole.BUYER);
      expect(result.user.firstName).toBe('Marie');
    });

    it('should login with demo transporter account', async () => {
      const result = await authAdapter.login('transporter@AgroLogistic.com', 'transporter123');

      expect(result.user).toBeDefined();
      expect(result.user.role).toBe(UserRole.TRANSPORTER);
      expect(result.user.firstName).toBe('Jean');
    });

    it('should login with newly registered account', async () => {
      // Register a new user
      const newUser: RegisterRequestDTO = {
        email: `newlogin-${Date.now()}@test.com`,
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'New',
        lastName: 'Login',
        phone: '+33600000099',
        accountType: UserRole.FARMER,
        acceptTerms: true,
      };

      await authAdapter.register(newUser);
      localStorage.clear(); // Clear token to simulate new session

      // Now login with the new account
      const loginResult = await authAdapter.login(newUser.email, newUser.password);

      expect(loginResult.user).toBeDefined();
      expect(loginResult.user.firstName).toBe('New');
      expect(loginResult.user.lastName).toBe('Login');
    });
  });

  describe('Session Management', () => {
    it('should return null for getCurrentUser when not logged in', async () => {
      localStorage.removeItem('accessToken');
      const user = await authAdapter.getCurrentUser();
      expect(user).toBeNull();
    });

    it('should clear token on logout', async () => {
      // First login
      await authAdapter.login('demo@AgroLogistic.com', 'password');
      expect(localStorage.getItem('accessToken')).toBeTruthy();

      // Then logout
      await authAdapter.logout();
      expect(localStorage.getItem('accessToken')).toBeNull();
    });

    it('should throw error for invalid test email', async () => {
      await expect(authAdapter.login('error@test.com', 'any-password')).rejects.toThrow(
        'Identifiants invalides'
      );
    });
  });

  describe('Password Reset Flow', () => {
    it('should handle password reset request for existing email', async () => {
      // This should not throw
      await expect(
        authAdapter.sendPasswordResetEmail('admin@AgroLogistic.com')
      ).resolves.not.toThrow();
    });

    it('should handle password reset request for non-existing email silently', async () => {
      // For security, should not reveal if email exists
      await expect(
        authAdapter.sendPasswordResetEmail('nonexistent@test.com')
      ).resolves.not.toThrow();
    });

    it('should reset password with valid token', async () => {
      await expect(
        authAdapter.resetPassword('valid-token', 'NewSecurePass123!')
      ).resolves.not.toThrow();
    });
  });

  describe('Email Verification', () => {
    it('should verify email when user is logged in', async () => {
      await authAdapter.login('demo@AgroLogistic.com', 'password');
      const result = await authAdapter.verifyEmail('valid-token');
      expect(result).toBe(true);
    });

    it('should return false when no user is logged in', async () => {
      localStorage.removeItem('accessToken');
      // Create new adapter instance without logged in user
      const freshAdapter = new MockAuthAdapter();
      const result = await freshAdapter.verifyEmail('valid-token');
      expect(result).toBe(false);
    });
  });

  describe('Provider Configuration', () => {
    it('should always report as configured', async () => {
      const isConfigured = await authAdapter.isConfigured();
      expect(isConfigured).toBe(true);
    });

    it('should have correct provider name', () => {
      expect(authAdapter.name).toBe('mock');
    });
  });
});

describe('User Count Tracking', () => {
  it('should return initial demo user count', () => {
    const count = MockAuthAdapter.getUserCount();
    expect(count).toBeGreaterThanOrEqual(5); // At least 5 demo users
  });
});
