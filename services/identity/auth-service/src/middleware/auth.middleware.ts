import { Request, Response, NextFunction, RequestHandler } from 'express';
import { JWTService } from '../services/jwt.service';
import { UserRole } from '../models/permission.model';
import { getRedisService } from '../services/redis.service';
import type { AuthUser } from '../types/express.d';

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Token requis',
    });
    return;
  }
  try {
    // Check if token is blacklisted (logged out)
    const redisService = getRedisService();
    const isBlacklisted = await redisService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      res.status(401).json({
        success: false,
        error: 'Token invalide ou expiré',
      });
      return;
    }

    const jwtService = new JWTService();
    const decoded = jwtService.verifyAccessToken(token);
    (req as AuthenticatedRequest).user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role as UserRole,
      permissions: decoded.permissions || [],
    };
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      error: 'Token invalide ou expiré',
    });
  }
};
/**
 * Optional authentication - continues even if token is invalid
 */
export const optionalAuth: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      // Check if token is blacklisted
      const redisService = getRedisService();
      const isBlacklisted = await redisService.isTokenBlacklisted(token);
      if (!isBlacklisted) {
        const jwtService = new JWTService();
        const decoded = jwtService.verifyAccessToken(token);
        (req as AuthenticatedRequest).user = {
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role as UserRole,
          permissions: decoded.permissions || [],
        };
      }
    } catch (error) {
      // Ignore auth errors for optional auth
      console.log('Optional auth failed, continuing as guest');
    }
  }
  next();
};
