import { Response, NextFunction } from 'express';
import { UserRole } from '../models/permission.model';
import { PermissionService } from '../services/permission.service';
import { logPermissionDenied } from '../services/logger.service';
import { AuthenticatedRequest } from './auth.middleware';
/**
 * Middleware to require specific roles
 */
export const requireRole = (...roles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Non authentifié',
      });
      return;
    }
    if (!roles.includes(req.user.role as UserRole)) {
      logPermissionDenied(
        req.user.id,
        req.user.role,
        `role:${roles.join('|')}`,
      );
      res.status(403).json({
        success: false,
        error: `Accès réservé aux rôles: ${roles.join(', ')}`,
      });
      return;
    }
    next();
  };
};
/**
 * Middleware to require specific permission
 */
export const requirePermission = (permission: string) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Non authentifié',
      });
      return;
    }
    const permissionService = new PermissionService();
    if (!permissionService.hasPermission(req.user.permissions, permission)) {
      logPermissionDenied(req.user.id, req.user.role, permission);
      res.status(403).json({
        success: false,
        error: `Permission requise: ${permission}`,
      });
      return;
    }
    next();
  };
};
/**
 * Middleware to require any of the specified permissions
 */
export const requireAnyPermission = (...permissions: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Non authentifié',
      });
      return;
    }
    const permissionService = new PermissionService();
    const hasAny = permissionService.hasAnyPermission(
      req.user.permissions,
      permissions,
    );
    if (!hasAny) {
      logPermissionDenied(req.user.id, req.user.role, permissions.join('|'));
      res.status(403).json({
        success: false,
        error: `Une des permissions suivantes est requise: ${permissions.join(', ')}`,
      });
      return;
    }
    next();
  };
};
/**
 * Admin-only middleware
 */
export const adminOnly = requireRole(UserRole.ADMIN);
/**
 * Buyer-only middleware
 */
export const buyerOnly = requireRole(UserRole.BUYER);
/**
 * Transporter-only middleware
 */
export const transporterOnly = requireRole(UserRole.TRANSPORTER);
