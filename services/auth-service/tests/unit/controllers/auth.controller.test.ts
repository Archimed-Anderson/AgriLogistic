import { Request, Response } from 'express';
import { AuthController } from '../../../src/controllers/auth.controller';
import { UserRepository } from '../../../src/repositories/user.repository';
import { LoginAttemptRepository } from '../../../src/repositories/login-attempt.repository';
import { JWTService } from '../../../src/services/jwt.service';
import { PasswordService } from '../../../src/services/password.service';
import { getRedisService } from '../../../src/services/redis.service';
import { getPermissionsByRole, UserRole } from '../../../src/models/permission.model';

// Mock dependencies
jest.mock('../../../src/repositories/user.repository');
jest.mock('../../../src/repositories/login-attempt.repository');
jest.mock('../../../src/services/jwt.service');
jest.mock('../../../src/services/password.service');
jest.mock('../../../src/services/redis.service');
jest.mock('../../../src/models/permission.model');

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockLoginAttemptRepository: jest.Mocked<LoginAttemptRepository>;
  let mockJWTService: jest.Mocked<JWTService>;
  let mockPasswordService: jest.Mocked<PasswordService>;
  let mockRedisService: any;

  beforeEach(() => {
    mockRequest = {
      body: {},
      headers: {},
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-user-agent'),
      socket: { remoteAddress: '127.0.0.1' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    } as any;

    mockLoginAttemptRepository = {
      recordAttempt: jest.fn(),
      shouldLockAccount: jest.fn().mockResolvedValue(false),
      getFailedAttempts: jest.fn().mockResolvedValue(0),
    } as any;

    mockJWTService = {
      generateTokenPair: jest.fn(),
      verifyAccessToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      getTokenExpiration: jest.fn(),
    } as any;

    mockPasswordService = {
      hashPassword: jest.fn(),
      verifyPassword: jest.fn(),
      validatePasswordStrength: jest.fn(),
    } as any;

    mockRedisService = {
      storeRefreshToken: jest.fn().mockResolvedValue(undefined),
      blacklistToken: jest.fn().mockResolvedValue(undefined),
      removeRefreshToken: jest.fn().mockResolvedValue(undefined),
      removeAllRefreshTokens: jest.fn().mockResolvedValue(undefined),
    };

    (getRedisService as jest.Mock).mockReturnValue(mockRedisService);
    (UserRepository as jest.Mock).mockImplementation(() => mockUserRepository);
    (LoginAttemptRepository as jest.Mock).mockImplementation(() => mockLoginAttemptRepository);
    (JWTService as jest.Mock).mockImplementation(() => mockJWTService);
    (PasswordService as jest.Mock).mockImplementation(() => mockPasswordService);
    (getPermissionsByRole as jest.Mock).mockImplementation((role: UserRole) => {
      if (role === UserRole.ADMIN) return ['*'];
      if (role === UserRole.BUYER) return ['product:browse', 'order:create'];
      return ['delivery:view_assigned'];
    });

    authController = new AuthController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new buyer user', async () => {
      mockRequest.body = {
        email: 'newbuyer@example.com',
        password: 'SecurePass123!',
        firstName: 'New',
        lastName: 'Buyer',
        role: 'buyer',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordService.validatePasswordStrength.mockReturnValue({ valid: true, errors: [] });
      mockPasswordService.hashPassword.mockResolvedValue('hashed_password');
      mockUserRepository.create.mockResolvedValue({
        id: 'user123',
        email: 'newbuyer@example.com',
        firstName: 'New',
        lastName: 'Buyer',
        role: 'buyer',
        emailVerified: false,
        phone: null,
        phoneVerified: false,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        passwordHash: 'hashed_password',
      } as any);

      mockJWTService.generateTokenPair.mockReturnValue({
        accessToken: 'test_token',
        refreshToken: 'test_refresh',
        expiresIn: 900,
      });

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: 'test_token',
          user: expect.objectContaining({
            role: 'buyer',
            permissions: expect.any(Array),
          }),
        })
      );
    });

    it('should reject registration with admin role', async () => {
      mockRequest.body = {
        email: 'admin@example.com',
        password: 'SecurePass123!',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      };

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('admin'),
        })
      );
    });

    it('should reject weak password', async () => {
      mockRequest.body = {
        email: 'user@example.com',
        password: 'weak',
        firstName: 'Test',
        lastName: 'User',
      };

      mockPasswordService.validatePasswordStrength.mockReturnValue({
        valid: false,
        errors: ['Password must be at least 8 characters long'],
      });

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const testUser = {
        id: 'user123',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        firstName: 'Test',
        lastName: 'User',
        role: 'buyer',
        emailVerified: true,
        phone: null,
        phoneVerified: false,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      mockUserRepository.findByEmail.mockResolvedValue(testUser as any);
      mockPasswordService.verifyPassword.mockResolvedValue(true);
      mockLoginAttemptRepository.shouldLockAccount.mockResolvedValue(false);
      mockJWTService.generateTokenPair.mockReturnValue({
        accessToken: 'test_token',
        refreshToken: 'test_refresh',
        expiresIn: 900,
      });

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: 'test_token',
          user: expect.objectContaining({
            id: 'user123',
            email: 'test@example.com',
            permissions: expect.any(Array),
          }),
        })
      );
    });

    it('should reject login with invalid password', async () => {
      const testUser = {
        id: 'user123',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        firstName: 'Test',
        lastName: 'User',
        role: 'buyer',
        emailVerified: true,
        phone: null,
        phoneVerified: false,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      mockUserRepository.findByEmail.mockResolvedValue(testUser as any);
      mockPasswordService.verifyPassword.mockResolvedValue(false);
      mockLoginAttemptRepository.shouldLockAccount.mockResolvedValue(false);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockLoginAttemptRepository.recordAttempt).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          success: false,
        })
      );
    });

    it('should lock account after multiple failed attempts', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      mockLoginAttemptRepository.shouldLockAccount.mockResolvedValue(true);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(429);
    });
  });

  describe('me', () => {
    it('should return current user info', async () => {
      const testUser = {
        id: 'user123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'buyer',
        emailVerified: true,
        phone: null,
        phoneVerified: false,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        passwordHash: null,
      };

      mockRequest.user = {
        id: 'user123',
        email: 'test@example.com',
        role: UserRole.BUYER,
        permissions: ['product:browse'],
      };

      mockUserRepository.findById.mockResolvedValue(testUser as any);

      await authController.me(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          user: expect.objectContaining({
            id: 'user123',
            permissions: expect.any(Array),
          }),
        })
      );
    });

    it('should reject if user not authenticated', async () => {
      mockRequest.user = undefined;

      await authController.me(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockRequest.headers = {
        authorization: 'Bearer test_token',
      };
      mockRequest.body = {
        refreshToken: 'test_refresh_token',
      };
      mockRequest.user = {
        id: 'user123',
        email: 'test@example.com',
        role: UserRole.BUYER,
        permissions: [],
      };

      mockJWTService.getTokenExpiration.mockReturnValue(
        new Date(Date.now() + 900000)
      );

      await authController.logout(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe('refresh', () => {
    it('should refresh access token', async () => {
      const testUser = {
        id: 'user123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'buyer',
        emailVerified: true,
        phone: null,
        phoneVerified: false,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        passwordHash: null,
      };

      mockRequest.body = {
        refreshToken: 'valid_refresh_token',
      };

      mockJWTService.verifyRefreshToken.mockReturnValue({ sub: 'user123' });
      mockUserRepository.findById.mockResolvedValue(testUser as any);
      mockRedisService.hasRefreshToken.mockResolvedValue(true);
      mockJWTService.generateTokenPair.mockReturnValue({
        accessToken: 'new_token',
        refreshToken: 'new_refresh',
        expiresIn: 900,
      });

      await authController.refresh(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: 'new_token',
        })
      );
    });
  });
});
