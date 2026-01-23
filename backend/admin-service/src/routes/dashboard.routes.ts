import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get dashboard metrics
router.get('/metrics', dashboardController.getMetrics);

// Get system alerts
router.get('/alerts', dashboardController.getAlerts);

// Dismiss alert
router.post('/alerts/:id/dismiss', dashboardController.dismissAlert);

// Get recent activity
router.get('/activity', dashboardController.getRecentActivity);

export default router;
