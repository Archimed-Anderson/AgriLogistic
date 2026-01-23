import { Router } from 'express';
import systemController from '../controllers/system.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/permissions.middleware';
import { AdminRole } from '../models/AdminUser';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get services health
router.get('/health', systemController.getServicesHealth);

// Get system metrics
router.get('/metrics', systemController.getMetrics);

// Get logs
router.get('/logs', systemController.getLogs);

// Restart service (admin only)
router.post(
  '/services/:name/restart',
  requireRole(AdminRole.ADMIN),
  systemController.restartService
);

export default router;
