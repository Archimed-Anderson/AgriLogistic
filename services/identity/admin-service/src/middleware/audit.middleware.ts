import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import AuditLog, { AuditStatus } from '../models/AuditLog';

export function auditMiddleware(action: string, resource: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {



    // Continue with request
    res.on('finish', async () => {
      try {
        if (!req.user) return;

        const status = res.statusCode < 400 ? AuditStatus.SUCCESS : AuditStatus.FAILURE;

        await AuditLog.create({
          admin_user_id: req.user.user_id,
          action,
          resource,
          resource_id: req.params.id || req.body?.id,
          status,
          ip_address: req.ip || 'unknown',
          user_agent: req.get('user-agent') || 'unknown',
          metadata: {
            method: req.method,
            path: req.path,
            query: req.query,
            body: req.body,
            status_code: res.statusCode,
          },
        });
      } catch (error) {
        console.error('Failed to create audit log:', error);
      }
    });

    next();
  };
}
