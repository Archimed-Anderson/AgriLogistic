import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import AuditLog, { AuditStatus } from '../models/AuditLog';

/**
 * POST /api/v1/admin/quick-actions/:action
 * Exécution des actions rapides (bypass cache)
 * Actions: kyc, report, maint, broadcast, chain, suspend, warroom, export
 */
export async function executeQuickAction(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { action } = req.params;
    const userId = req.user?.user_id;
    const body = req.body || {};

    const allowedActions = ['kyc', 'report', 'maint', 'broadcast', 'chain', 'suspend', 'warroom', 'export'];
    if (!allowedActions.includes(action)) {
      res.status(400).json({ error: 'Invalid action', allowed: allowedActions });
      return;
    }

    // Bypass cache: Cache-Control no-store
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');

    // Exécution immédiate (implémentations métier à brancher)
    switch (action) {
      case 'kyc':
        // TODO: Appel service KYC - file d'attente
        break;
      case 'report':
        // TODO: Génération rapport journalier
        break;
      case 'maint':
        // TODO: Activation mode maintenance
        break;
      case 'broadcast':
        // TODO: Broadcast notification zone transporteurs
        break;
      case 'chain':
        // TODO: Force sync blockchain
        break;
      case 'suspend':
        // TODO: Suspendre compte (body.userId)
        break;
      case 'warroom':
        // Navigation frontend uniquement
        break;
      case 'export':
        // TODO: Export compliance OHADA
        break;
    }

    // Audit trail
    if (userId) {
      try {
        await AuditLog.create({
          admin_user_id: userId,
          action: `quick_action:${action}`,
          resource: 'quick-actions',
          resource_id: action,
          status: AuditStatus.SUCCESS,
          ip_address: req.ip || req.socket?.remoteAddress || 'unknown',
          user_agent: req.get('user-agent') || 'unknown',
          metadata: { body: req.body },
        });
      } catch (e) {
        console.error('Audit log failed:', e);
      }
    }

    res.status(200).json({
      success: true,
      action,
      message: `Action ${action} exécutée`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to execute action',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
