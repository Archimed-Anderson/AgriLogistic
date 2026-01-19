import { Request, Response, NextFunction } from 'express';
import { authenticateToken, optionalAuth } from '../../../src/middleware/auth.middleware';
import { JWTService } from '../../../src/services/jwt.service';

// Mock Redis service
const mockRedisService = {
  isTokenBlacklisted: jest.fn().mockResolvedValue(false),
};

jest.mock('../../../src/services/redis.service', () => ({
  getRedisService: jest.fn(() => mockRedisService),
}));

describe('Authentication Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jwtService: jest.Mocked<JWTService>;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      ip: '127.0.0.1',
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    mockRedisService.isTokenBlacklisted.mockResolvedValue(false);
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

      // Mock JWTService
      jest.spyOn(JWTService.prototype, 'verifyAccessToken').mockReturnValue(decoded);
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

      jest.spyOn(JWTService.prototype, 'verifyAccessToken').mockImplementation(() => {
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

      jest.spyOn(JWTService.prototype, 'verifyAccessToken').mockReturnValue(decoded);
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

      jest.spyOn(JWTService.prototype, 'verifyAccessToken').mockImplementation(() => {
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
