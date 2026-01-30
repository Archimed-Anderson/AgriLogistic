import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/authorization.middleware';
import { adminLimiter } from '../middleware/rate-limit.middleware';
const router = Router();
const controller = new AdminController();
// All admin routes require authentication and admin role
router.use(authenticateToken, adminOnly, adminLimiter);
// User management
router.get('/users', controller.listUsers);
router.post('/users', controller.createUser);
router.delete('/users/:id', controller.deleteUser);
// Analytics
router.get('/analytics', controller.getAnalytics);
export default router;
