import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import AuditLog, { AuditStatus } from '../models/AuditLog';

export interface AuditPayload {
  action: string;
  target?: string | null;
  resource?: string;
  metadata?: object;
}

/**
 * POST /api/v1/admin/audit
 * Persistance de l'audit trail (qui a fait quoi, quand)
 */
export async function persistAudit(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { action, target, resource = 'quick-actions', metadata = {} } = req.body as AuditPayload;

    if (!action || typeof action !== 'string') {
      res.status(400).json({ error: 'action is required' });
      return;
    }

    const userId = req.user?.user_id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await AuditLog.create({
      admin_user_id: userId,
      action,
      resource,
      resource_id: target ?? undefined,
      status: AuditStatus.SUCCESS,
      ip_address: req.ip || req.socket?.remoteAddress || 'unknown',
      user_agent: req.get('user-agent') || 'unknown',
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Audit log persisted',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Audit persist error:', error);
    res.status(500).json({
      error: 'Failed to persist audit',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
