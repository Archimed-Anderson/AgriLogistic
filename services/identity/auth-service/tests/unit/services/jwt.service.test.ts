import { JWTService } from '../../../src/services/jwt.service';

describe('JWTService', () => {
  let jwtService: JWTService;

  beforeEach(() => {
    process.env.JWT_ACCESS_SECRET = 'test_access_secret';
    process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
    jwtService = new JWTService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'buyer',
        firstName: 'Test',
        lastName: 'User',
        permissions: ['product:browse', 'order:create'],
      };

      const token = jwtService.generateAccessToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include permissions in token', () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        permissions: ['*'],
      };

      const token = jwtService.generateAccessToken(payload);
      const decoded = jwtService.decodeToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded?.permissions).toEqual(['*']);
      expect(decoded?.role).toBe('admin');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const userId = 'user123';
      const token = jwtService.generateRefreshToken(userId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('generateTokenPair', () => {
    it('should generate both access and refresh tokens', () => {
      const user = {
        id: 'user123',
        email: 'test@example.com',
        role: 'buyer',
        firstName: 'Test',
        lastName: 'User',
        permissions: ['product:browse'],
      };

      const tokens = jwtService.generateTokenPair(user);
      
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(tokens).toHaveProperty('expiresIn');
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.expiresIn).toBeGreaterThan(0);
    });

    it('should include permissions in token pair', () => {
      const user = {
        id: 'user123',
        email: 'test@example.com',
        role: 'transporter',
        firstName: 'Test',
        lastName: 'User',
        permissions: ['delivery:view_assigned', 'delivery:update_status'],
      };

      const tokens = jwtService.generateTokenPair(user);
      const decoded = jwtService.decodeToken(tokens.accessToken);
      
      expect(decoded?.permissions).toEqual(user.permissions);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'buyer',
        firstName: 'Test',
        lastName: 'User',
        permissions: ['product:browse'],
      };

      const token = jwtService.generateAccessToken(payload);
      const decoded = jwtService.verifyAccessToken(token);
      
      expect(decoded.sub).toBe(payload.sub);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
      expect(decoded.permissions).toEqual(payload.permissions);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => {
        jwtService.verifyAccessToken(invalidToken);
      }).toThrow();
    });

    it('should throw error for expired token', () => {
      process.env.JWT_ACCESS_EXPIRY = '1ms';
      const jwtServiceShort = new JWTService();
      
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'buyer',
        firstName: 'Test',
        lastName: 'User',
        permissions: [],
      };

      const token = jwtServiceShort.generateAccessToken(payload);
      
      // Wait for token to expire
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(() => {
            jwtServiceShort.verifyAccessToken(token);
          }).toThrow();
          resolve(undefined);
        }, 10);
      });
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const userId = 'user123';
      const token = jwtService.generateRefreshToken(userId);
      const decoded = jwtService.verifyRefreshToken(token);
      
      expect(decoded.sub).toBe(userId);
    });

    it('should throw error for invalid refresh token', () => {
      const invalidToken = 'invalid.refresh.token';
      
      expect(() => {
        jwtService.verifyRefreshToken(invalidToken);
      }).toThrow();
    });
  });

  describe('decodeToken', () => {
    it('should decode token without verification', () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'admin',
        firstName: 'Test',
        lastName: 'User',
        permissions: ['*'],
      };

      const token = jwtService.generateAccessToken(payload);
      const decoded = jwtService.decodeToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded?.sub).toBe(payload.sub);
      expect(decoded?.email).toBe(payload.email);
    });

    it('should return null for invalid token', () => {
      const decoded = jwtService.decodeToken('invalid.token');
      expect(decoded).toBeNull();
    });
  });

  describe('getTokenExpiration', () => {
    it('should return expiration date for valid token', () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'buyer',
        firstName: 'Test',
        lastName: 'User',
        permissions: [],
      };

      const token = jwtService.generateAccessToken(payload);
      const expiration = jwtService.getTokenExpiration(token);
      
      expect(expiration).toBeInstanceOf(Date);
      // Allow small timing difference (1 second buffer)
      expect(expiration!.getTime()).toBeGreaterThan(Date.now() - 1000);
    });

    it('should return null for invalid token', () => {
      const expiration = jwtService.getTokenExpiration('invalid.token');
      expect(expiration).toBeNull();
    });
  });
});
