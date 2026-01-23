import { Router } from 'express';
import usersRoutes from './users.routes';
import dashboardRoutes from './dashboard.routes';
import systemRoutes from './system.routes';

const router = Router();

// Mount routes
router.use('/users', usersRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/system', systemRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
