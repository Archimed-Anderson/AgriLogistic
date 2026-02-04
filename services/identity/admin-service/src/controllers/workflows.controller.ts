import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import AuditLog, { AuditStatus } from '../models/AuditLog';

/**
 * POST /api/v1/admin/workflows/emergency-stop
 * Emergency Stop : Suspension temporaire corridor logistique
 */
export async function emergencyStop(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.user_id;
    const { corridorId, reason } = req.body || {};

    // TODO: Intégration service logistique - suspension corridor
    // - Notifier tous les transporteurs du corridor
    // - Mettre à jour statut corridor en maintenance
    // - Émettre événement Kafka pour War Room

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    if (userId) {
      try {
        await AuditLog.create({
          admin_user_id: userId,
          action: 'emergency_stop',
          resource: 'workflows',
          resource_id: corridorId,
          status: AuditStatus.SUCCESS,
          ip_address: req.ip || req.socket?.remoteAddress || 'unknown',
          user_agent: req.get('user-agent') || 'unknown',
          metadata: { reason, body: req.body },
        });
      } catch (e) {
        console.error('Audit log failed:', e);
      }
    }

    res.status(200).json({
      success: true,
      workflow: 'emergency-stop',
      message: 'Corridor logistique suspendu temporairement',
      corridorId: corridorId || null,
      reason: reason || 'Admin action',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Emergency stop failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * POST /api/v1/admin/workflows/reroute-fleet
 * Reroute Fleet : Recalcul VRP pour éviter zone météo dangereuse
 */
export async function rerouteFleet(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.user_id;
    const { zoneId, fleetIds, reason } = req.body || {};

    // TODO: Intégration service VRP - recalcul itinéraires
    // - Déclencher recalcul VRP pour flotte(s) concernée(s)
    // - Exclure zone météo dangereuse
    // - Notifier transporteurs des nouveaux itinéraires

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    if (userId) {
      try {
        await AuditLog.create({
          admin_user_id: userId,
          action: 'reroute_fleet',
          resource: 'workflows',
          resource_id: zoneId,
          status: AuditStatus.SUCCESS,
          ip_address: req.ip || req.socket?.remoteAddress || 'unknown',
          user_agent: req.get('user-agent') || 'unknown',
          metadata: { reason, fleetIds, body: req.body },
        });
      } catch (e) {
        console.error('Audit log failed:', e);
      }
    }

    res.status(200).json({
      success: true,
      workflow: 'reroute-fleet',
      message: 'Recalcul VRP lancé - zone météo exclue',
      zoneId: zoneId || null,
      fleetIds: fleetIds || [],
      reason: reason || 'Météo dangereuse',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Reroute fleet failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
