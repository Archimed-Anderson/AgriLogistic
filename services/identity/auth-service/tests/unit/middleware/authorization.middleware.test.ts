import { Request, Response, NextFunction } from 'express';
import { requireRole, requirePermission, adminOnly } from '../../../src/middleware/authorization.middleware';
import { UserRole } from '../../../src/models/permission.model';

describe('Authorization Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      user: undefined,
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

  describe('requireRole', () => {
    it('should allow access for user with required role', () => {
      mockRequest.user = {
        id: 'user123',
        email: 'buyer@example.com',
        role: UserRole.BUYER,
        permissions: ['product:browse'],
      };

      const middleware = requireRole(UserRole.BUYER);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should deny access for user without required role', () => {
      mockRequest.user = {
        id: 'user123',
        email: 'buyer@example.com',
        role: UserRole.BUYER,
        permissions: ['product:browse'],
      };

      const middleware = requireRole(UserRole.ADMIN);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access for unauthenticated user', () => {
      mockRequest.user = undefined;

      const middleware = requireRole(UserRole.BUYER);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow access if user has one of multiple required roles', () => {
      mockRequest.user = {
        id: 'user123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        permissions: ['*'],
      };

      const middleware = requireRole(UserRole.BUYER, UserRole.ADMIN);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('requirePermission', () => {
    it('should allow access for user with required permission', () => {
      mockRequest.user = {
        id: 'user123',
        email: 'buyer@example.com',
        role: UserRole.BUYER,
        permissions: ['product:browse', 'order:create'],
      };

      const middleware = requirePermission('product:browse');
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it('should deny access for user without required permission', () => {
      mockRequest.user = {
        id: 'user123',
        email: 'buyer@example.com',
        role: UserRole.BUYER,
        permissions: ['product:browse'],
      };

      const middleware = requirePermission('order:create');
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow access for admin with wildcard permission', () => {
      mockRequest.user = {
        id: 'admin123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        permissions: ['*'],
      };

      const middleware = requirePermission('any:permission');
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('adminOnly', () => {
    it('should allow access for admin', () => {
      mockRequest.user = {
        id: 'admin123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        permissions: ['*'],
      };

      adminOnly(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it('should deny access for non-admin', () => {
      mockRequest.user = {
        id: 'user123',
        email: 'buyer@example.com',
        role: UserRole.BUYER,
        permissions: ['product:browse'],
      };

      adminOnly(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
