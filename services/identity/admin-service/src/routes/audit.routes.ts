import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { persistAudit } from '../controllers/audit.controller';

const router = Router();

router.use(authMiddleware);

/**
 * POST /api/v1/admin/audit
 * Persistance de l'audit trail (qui a fait quoi, quand)
 */
router.post('/', persistAudit);

export default router;
