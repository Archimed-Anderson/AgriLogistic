import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface JWTPayload {
  sub: string;        // User ID
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;  // seconds
}

export class JWTService {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    const envAccessSecret = process.env.JWT_ACCESS_SECRET;
    const envRefreshSecret = process.env.JWT_REFRESH_SECRET;

    this.accessTokenSecret = envAccessSecret || '';
    this.refreshTokenSecret = envRefreshSecret || '';
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';

    if (!this.accessTokenSecret || !this.refreshTokenSecret) {
      // In production we must never start without proper secrets.
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT secrets must be defined in environment variables');
      }

      // Developer-friendly fallback: generate ephemeral secrets for local runs/tests.
      // These secrets are NOT persisted and will invalidate tokens on restart.
      const generatedAccess = crypto.randomBytes(64).toString('hex');
      const generatedRefresh = crypto.randomBytes(64).toString('hex');

      // eslint-disable-next-line no-console
      console.warn(
        '[auth-service] JWT secrets missing; using ephemeral in-memory secrets for non-production runtime. ' +
          'Set JWT_ACCESS_SECRET/JWT_REFRESH_SECRET in your .env to persist sessions.'
      );

      this.accessTokenSecret = generatedAccess;
      this.refreshTokenSecret = generatedRefresh;
    }
  }

  /**
   * Generate access token (short-lived, 15 minutes)
   */
  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'AgroLogistic-auth-service',
      audience: 'AgroLogistic-api',
    } as jwt.SignOptions);
  }

  /**
   * Generate refresh token (long-lived, 7 days)
   */
  generateRefreshToken(userId: string): string {
    return jwt.sign(
      { 
        sub: userId, 
        type: 'refresh' 
      },
      this.refreshTokenSecret,
      {
        expiresIn: this.refreshTokenExpiry,
        issuer: 'AgroLogistic-auth-service',
      } as jwt.SignOptions
    );
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'AgroLogistic-auth-service',
        audience: 'AgroLogistic-api',
      });
      
      return decoded as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Access token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid access token');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): { sub: string } {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'AgroLogistic-auth-service',
      });
      
      return decoded as { sub: string };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Generate complete token pair
   */
  generateTokenPair(user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    permissions: string[];
  }): TokenPair {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      permissions: user.permissions,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(user.id);

    // Calculate expiresIn in seconds from expiry string
    const expiryMatch = this.accessTokenExpiry.match(/(\d+)([smhd])/);
    let expiresIn = 900; // default 15 minutes
    if (expiryMatch) {
      const value = parseInt(expiryMatch[1], 10);
      const unit = expiryMatch[2];
      switch (unit) {
        case 's':
          expiresIn = value;
          break;
        case 'm':
          expiresIn = value * 60;
          break;
        case 'h':
          expiresIn = value * 3600;
          break;
        case 'd':
          expiresIn = value * 86400;
          break;
      }
    }

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Decode token without verification (for debugging)
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  }
}
