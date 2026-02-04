import { Router } from 'express';
import usersRoutes from './users.routes';
import dashboardRoutes from './dashboard.routes';
import systemRoutes from './system.routes';
import quickActionsRoutes from './quick-actions.routes';
import auditRoutes from './audit.routes';
import workflowsRoutes from './workflows.routes';

const router = Router();

// Mount routes
router.use('/users', usersRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/system', systemRoutes);
router.use('/quick-actions', quickActionsRoutes);
router.use('/audit', auditRoutes);
router.use('/workflows', workflowsRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
