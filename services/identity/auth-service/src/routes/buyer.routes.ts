import { Router } from 'express';
import { BuyerController } from '../controllers/buyer.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';
import { buyerLimiter } from '../middleware/rate-limit.middleware';
import { UserRole } from '../models/permission.model';
const router = Router();
const controller = new BuyerController();
// All buyer routes require authentication and buyer role (or admin)
router.use(authenticateToken, requireRole(UserRole.BUYER, UserRole.ADMIN), buyerLimiter);
// Profile management
router.get('/profile', controller.getProfile);
router.put('/profile', controller.updateProfile);
// Orders
router.get('/orders', controller.getOrders);
router.get('/orders/:id', controller.getOrderDetails);
export default router;
