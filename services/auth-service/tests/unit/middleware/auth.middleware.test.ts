import type { Request, Response, NextFunction } from 'express';

const verifyAccessTokenMock = jest.fn();
const mockRedisService = {
  isTokenBlacklisted: jest.fn().mockResolvedValue(false),
};

type AuthMiddlewareModule = typeof import('../../../src/middleware/auth.middleware');

describe('Authentication Middleware', () => {
  let authenticateToken: AuthMiddlewareModule['authenticateToken'];
  let optionalAuth: AuthMiddlewareModule['optionalAuth'];
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.resetModules();
    verifyAccessTokenMock.mockReset();
    mockRedisService.isTokenBlacklisted.mockReset().mockResolvedValue(false);

    // Ensure mocks are applied BEFORE importing the middleware module (it imports JWT/Redis at module load).
    jest.doMock('../../../src/services/redis.service', () => ({
      getRedisService: jest.fn(() => mockRedisService),
    }));

    jest.doMock('../../../src/services/jwt.service', () => ({
      JWTService: jest.fn().mockImplementation(() => ({
        verifyAccessToken: verifyAccessTokenMock,
      })),
    }));

    // Import after mocks
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('../../../src/middleware/auth.middleware') as AuthMiddlewareModule;
    authenticateToken = mod.authenticateToken;
    optionalAuth = mod.optionalAuth;

    mockRequest = {
      headers: {},
      ip: '127.0.0.1',
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token', async () => {
      const token = 'valid.token.here';
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      const decoded = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'buyer',
        firstName: 'Test',
        lastName: 'User',
        permissions: ['product:browse'],
      };

      verifyAccessTokenMock.mockReturnValue(decoded);
      mockRedisService.isTokenBlacklisted.mockResolvedValue(false);

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user?.id).toBe('user123');
      expect(mockRequest.user?.permissions).toEqual(['product:browse']);
    });

    it('should reject request without token', async () => {
      mockRequest.headers = {};

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject blacklisted token', async () => {
      const token = 'blacklisted.token';
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      mockRedisService.isTokenBlacklisted.mockResolvedValue(true);

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
      const token = 'invalid.token';
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      verifyAccessTokenMock.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      mockRedisService.isTokenBlacklisted.mockResolvedValue(false);

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should set user if valid token provided', async () => {
      const token = 'valid.token';
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      const decoded = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'buyer',
        firstName: 'Test',
        lastName: 'User',
        permissions: ['product:browse'],
      };

      verifyAccessTokenMock.mockReturnValue(decoded);
      mockRedisService.isTokenBlacklisted.mockResolvedValue(false);

      await optionalAuth(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.user).toBeDefined();
    });

    it('should continue without user if no token', async () => {
      mockRequest.headers = {};

      await optionalAuth(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.user).toBeUndefined();
    });

    it('should continue without user if invalid token', async () => {
      const token = 'invalid.token';
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      verifyAccessTokenMock.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await optionalAuth(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.user).toBeUndefined();
    });
  });
});
