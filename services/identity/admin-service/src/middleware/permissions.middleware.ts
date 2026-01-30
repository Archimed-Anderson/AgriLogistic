import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AdminRole } from '../models/AdminUser';
import AuditLog, { AuditStatus } from '../models/AuditLog';

const ROLE_LEVELS: Record<AdminRole, number> = {
  [AdminRole.SUPER_ADMIN]: 3,
  [AdminRole.ADMIN]: 2,
  [AdminRole.MANAGER]: 1,
  [AdminRole.SUPPORT]: 0,
};

export function requireRole(minRole: AdminRole) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userRole = req.user.roles?.[0] as AdminRole;
      const userLevel = ROLE_LEVELS[userRole] || 0;
      const requiredLevel = ROLE_LEVELS[minRole];

      if (userLevel < requiredLevel) {
        // Log failed authorization attempt
        await AuditLog.create({
          admin_user_id: req.user.user_id,
          action: 'access_denied',
          resource: req.path,
          status: AuditStatus.FAILURE,
          ip_address: req.ip || 'unknown',
          user_agent: req.get('user-agent') || 'unknown',
          metadata: {
            required_role: minRole,
            user_role: userRole,
          },
        });

        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Authorization check failed' });
    }
  };
}

export function requirePermission(permission: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const hasPermission = req.user.permissions?.includes(permission);

      if (!hasPermission) {
        // Log failed authorization attempt
        await AuditLog.create({
          admin_user_id: req.user.user_id,
          action: 'permission_denied',
          resource: req.path,
          status: AuditStatus.FAILURE,
          ip_address: req.ip || 'unknown',
          user_agent: req.get('user-agent') || 'unknown',
          metadata: {
            required_permission: permission,
          },
        });

        res.status(403).json({ error: `Permission required: ${permission}` });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
}
