import { Router, type IRouter, type RequestHandler } from 'express';
import { TransporterController } from '../controllers/transporter.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';
import { transporterLimiter } from '../middleware/rate-limit.middleware';
import { UserRole } from '../models/permission.model';

const router: IRouter = Router();
const controller = new TransporterController();
// All transporter routes require authentication and transporter role (or admin)
router.use(
  '/',
  authenticateToken as RequestHandler,
  requireRole(UserRole.TRANSPORTER, UserRole.ADMIN) as RequestHandler,
  transporterLimiter,
);
// Deliveries
router.get('/deliveries', controller.getDeliveries);
router.put('/deliveries/:id', controller.updateDeliveryStatus);
router.post('/deliveries/:id/location', controller.updateLocation);
// Statistics
router.get('/stats', controller.getStats);
export default router;
