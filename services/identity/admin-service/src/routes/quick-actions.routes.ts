import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { executeQuickAction } from '../controllers/quick-actions.controller';

const router = Router();

router.use(authMiddleware);

/**
 * POST /api/v1/admin/quick-actions/:action
 * Exécution des actions rapides (bypass cache)
 */
router.post('/:action', executeQuickAction);

export default router;
