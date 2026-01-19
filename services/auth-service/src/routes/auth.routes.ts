import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rate-limit.middleware';

const router = Router();
const authController = new AuthController();

// Registration & Login (with rate limiting)
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authenticateToken, authController.logout);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', authLimiter, authController.resetPassword);

// Token management
router.post('/refresh', authController.refresh);

// User info (requires authentication)
router.get('/me', authenticateToken, authController.me);

// OAuth routes
router.get('/oauth/google', authController.googleAuth);
router.get('/oauth/google/callback', authController.googleCallback);

export default router;
