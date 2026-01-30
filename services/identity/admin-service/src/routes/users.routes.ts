import { Router } from 'express';
import { body, query } from 'express-validator';
import usersController from '../controllers/users.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole, requirePermission } from '../middleware/permissions.middleware';
import { auditMiddleware } from '../middleware/audit.middleware';
import { AdminRole } from '../models/AdminUser';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// List users
router.get(
  '/',
  requirePermission('users:view'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  usersController.listUsers
);

// Get single user
router.get(
  '/:id',
  requirePermission('users:view'),
  usersController.getUser
);

// Create user
router.post(
  '/',
  requirePermission('users:create'),
  auditMiddleware('create_user', 'users'),
  body('email').isEmail(),
  body('name').isString().isLength({ min: 2 }),
  body('password').isString().isLength({ min: 8 }),
  body('role').isIn(Object.values(AdminRole)),
  body('phone').optional().isString(),
  usersController.createUser
);

// Update user
router.patch(
  '/:id',
  requirePermission('users:edit'),
  auditMiddleware('update_user', 'users'),
  body('name').optional().isString().isLength({ min: 2 }),
  body('role').optional().isIn(Object.values(AdminRole)),
  body('phone').optional().isString(),
  body('is_active').optional().isBoolean(),
  usersController.updateUser
);

// Delete user
router.delete(
  '/:id',
  requireRole(AdminRole.ADMIN),
  requirePermission('users:delete'),
  auditMiddleware('delete_user', 'users'),
  usersController.deleteUser
);

// Suspend user
router.post(
  '/:id/suspend',
  requirePermission('users:suspend'),
  auditMiddleware('suspend_user', 'users'),
  usersController.suspendUser
);

// Activate user
router.post(
  '/:id/activate',
  requirePermission('users:suspend'),
  auditMiddleware('activate_user', 'users'),
  usersController.activateUser
);

// Assign role
router.post(
  '/:id/role',
  requireRole(AdminRole.ADMIN),
  auditMiddleware('assign_role', 'users'),
  body('role').isIn(Object.values(AdminRole)),
  usersController.assignRole
);

// Reset password
router.post(
  '/:id/reset-password',
  requirePermission('users:edit'),
  auditMiddleware('reset_password', 'users'),
  usersController.resetPassword
);

export default router;
