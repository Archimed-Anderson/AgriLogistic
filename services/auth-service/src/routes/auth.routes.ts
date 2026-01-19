import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rate-limit.middleware';
import { getCsrfTokenHandler } from '../middleware/csrf.middleware';
import {
  validate,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  passwordResetSchema,
  refreshTokenSchema,
} from '../middleware/input-validation.middleware';

const router = Router();
const authController = new AuthController();

// CSRF token endpoint (enforcement can be enabled per-env)
router.get('/csrf-token', getCsrfTokenHandler);

// Registration & Login (with rate limiting)
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authenticateToken, authController.logout);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate(passwordResetSchema), authController.resetPassword);

// Token management
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);

// User info (requires authentication)
router.get('/me', authenticateToken, authController.me);

// OAuth routes
router.get('/oauth/google', authController.googleAuth);
router.get('/oauth/google/callback', authController.googleCallback);

export default router;
