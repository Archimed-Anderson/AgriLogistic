import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { emergencyStop, rerouteFleet } from '../controllers/workflows.controller';

const router = Router();

router.use(authMiddleware);

/**
 * POST /api/v1/admin/workflows/emergency-stop
 * Emergency Stop : Suspension temporaire corridor logistique
 */
router.post('/emergency-stop', emergencyStop);

/**
 * POST /api/v1/admin/workflows/reroute-fleet
 * Reroute Fleet : Recalcul VRP pour éviter zone météo dangereuse
 */
router.post('/reroute-fleet', rerouteFleet);

export default router;
