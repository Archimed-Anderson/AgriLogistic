import { Request, Response } from 'express';
import crypto from 'crypto';
import { JWTService } from '../services/jwt.service';
import { PasswordService } from '../services/password.service';
import { OAuth2Service } from '../services/oauth2.service';
import { UserRepository } from '../repositories/user.repository';
import { LoginAttemptRepository } from '../repositories/login-attempt.repository';
import { getRedisService } from '../services/redis.service';
import { getPermissionsByRole, UserRole } from '../models/permission.model';
import { logLoginAttempt, logSecurityAlert, logAuthEvent } from '../services/logger.service';

export class AuthController {
  private jwtService: JWTService;
  private passwordService: PasswordService;
  private oauth2Service: OAuth2Service;
  private userRepository: UserRepository;
  private loginAttemptRepository: LoginAttemptRepository;

  constructor() {
    this.jwtService = new JWTService();
    this.passwordService = new PasswordService();
    this.oauth2Service = new OAuth2Service();
    this.userRepository = new UserRepository();
    this.loginAttemptRepository = new LoginAttemptRepository();
  }

  /**
   * POST /auth/forgot-password
   * Public endpoint - Always returns 202 to prevent user enumeration.
   * Generates a reset token (stored in Redis) and sends it via notification-service.
   */
  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const emailRaw = (req.body?.email || '').toString().trim().toLowerCase();
      if (!emailRaw) {
        res.status(400).json({ success: false, error: 'Email is required' });
        return;
      }

      const user = await this.userRepository.findByEmail(emailRaw);
      if (user) {
        const resetToken = crypto.randomBytes(16).toString('hex');
        const redisService = getRedisService();
        const expiresIn = 60 * 60; // 1 hour
        const sessionId = `pwdreset:${resetToken}`;

        await redisService.setSession(sessionId, { userId: user.id, email: user.email }, expiresIn);

        // Send reset token by email (best-effort)
        try {
          const notificationUrl =
            process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3006';

          await fetch(`${notificationUrl}/notifications/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'email',
              recipient: user.email,
              subject: 'Réinitialisation du mot de passe - AgroLogistic',
              message:
                `Voici votre code de réinitialisation (valide 1h): ${resetToken}\n\n` +
                `Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.`,
              priority: 2,
            }),
          });
        } catch (e) {
          // Ne pas exposer l'erreur au client
          console.warn('Failed to send reset email:', e);
        }
      }

      res.status(202).json({
        success: true,
        message: 'If the account exists, a reset code has been sent.',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(202).json({
        success: true,
        message: 'If the account exists, a reset code has been sent.',
      });
    }
  };

  /**
   * POST /auth/reset-password
   * Public endpoint - Reset password using a token issued by forgotPassword.
   */
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = (req.body?.token || '').toString().trim();
      const password = (req.body?.password || '').toString();

      if (!token || !password) {
        res.status(400).json({ success: false, error: 'Token and password are required' });
        return;
      }

      const passwordValidation = this.passwordService.validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        res.status(400).json({
          success: false,
          error: 'Password does not meet requirements',
          details: passwordValidation.errors,
        });
        return;
      }

      const redisService = getRedisService();
      const sessionId = `pwdreset:${token}`;
      const session = await redisService.getSession(sessionId);

      if (!session?.userId) {
        res.status(400).json({ success: false, error: 'Invalid or expired token' });
        return;
      }

      const passwordHash = await this.passwordService.hashPassword(password);
      const updated = await this.userRepository.updatePassword(session.userId, passwordHash);
      await redisService.clearSession(sessionId);

      // Invalider les refresh tokens existants (best-effort)
      try {
        await redisService.removeAllRefreshTokens(session.userId);
      } catch (e) {
        console.warn('Failed to clear refresh tokens after password reset:', e);
      }

      res.status(updated ? 200 : 500).json({
        success: updated,
        message: updated ? 'Password updated' : 'Failed to update password',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };

  /**
   * POST /auth/register
   * Register new user
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, firstName, lastName, role, phone } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
        return;
      }

      // Validate role - admin cannot be self-registered
      const userRole = (role || 'buyer').toLowerCase();
      if (userRole === 'admin') {
        res.status(403).json({
          success: false,
          error: 'Admin role cannot be assigned during registration',
        });
        return;
      }

      if (!['buyer', 'transporter'].includes(userRole)) {
        res.status(400).json({
          success: false,
          error: 'Invalid role. Allowed roles: buyer, transporter',
        });
        return;
      }

      // Check if user exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists',
        });
        return;
      }

      // Validate password strength
      const passwordValidation = this.passwordService.validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        res.status(400).json({
          success: false,
          error: 'Password does not meet requirements',
          details: passwordValidation.errors,
        });
        return;
      }

      // Hash password
      const passwordHash = await this.passwordService.hashPassword(password);

      // Create user
      const user = await this.userRepository.create({
        email,
        firstName,
        lastName,
        role: userRole as 'buyer' | 'transporter',
        phone,
        passwordHash,
      });

      // Get permissions for role
      const permissions = getPermissionsByRole(userRole as UserRole);

      // Generate tokens
      const tokens = this.jwtService.generateTokenPair({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions,
      });

      // Log registration
      logAuthEvent('user_registered', user.id, user.email, { ip: ipAddress, role: user.role });

      res.status(201).json({
        success: true,
        token: tokens.accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions,
        },
        expiresIn: tokens.expiresIn,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * POST /auth/login
   * Login with email and password
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
        return;
      }

      // Check for too many failed attempts
      const shouldLock = await this.loginAttemptRepository.shouldLockAccount(email, 5, 15);
      if (shouldLock) {
        await this.loginAttemptRepository.recordAttempt({
          email,
          ipAddress,
          success: false,
        });
        logSecurityAlert(email, 5, ipAddress, userAgent);
        res.status(429).json({
          success: false,
          error: 'Too many failed login attempts. Please try again later.',
        });
        return;
      }

      // Find user
      const user = await this.userRepository.findByEmail(email);
      if (!user || !user.passwordHash) {
        await this.loginAttemptRepository.recordAttempt({
          email,
          ipAddress,
          success: false,
        });
        logLoginAttempt(email, false, ipAddress, userAgent);
        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
        return;
      }

      // Verify password
      const isValidPassword = await this.passwordService.verifyPassword(
        password,
        user.passwordHash
      );

      if (!isValidPassword) {
        await this.loginAttemptRepository.recordAttempt({
          email,
          ipAddress,
          success: false,
        });
        logLoginAttempt(email, false, ipAddress, userAgent, user.role);
        
        // Check if we should alert after this failed attempt
        const failedCount = await this.loginAttemptRepository.getFailedAttempts(email, 15);
        if (failedCount >= 5) {
          logSecurityAlert(email, failedCount, ipAddress, userAgent);
        }

        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
        return;
      }

      // Get permissions for role
      const permissions = getPermissionsByRole(user.role as UserRole);

      // Generate tokens
      const tokens = this.jwtService.generateTokenPair({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions,
      });

      // Record successful login attempt
      await this.loginAttemptRepository.recordAttempt({
        email,
        ipAddress,
        success: true,
      });

      // Store refresh token in Redis
      const redisService = getRedisService();
      const refreshExpiry = 7 * 24 * 60 * 60; // 7 days in seconds
      await redisService.storeRefreshToken(user.id, tokens.refreshToken, refreshExpiry);

      logLoginAttempt(email, true, ipAddress, userAgent, user.role);
      logAuthEvent('user_logged_in', user.id, user.email, { ip: ipAddress, role: user.role });

      res.status(200).json({
        success: true,
        token: tokens.accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions,
        },
        expiresIn: tokens.expiresIn,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * POST /auth/refresh
   * Refresh access token
   */
  refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token is required',
        });
        return;
      }

      // Verify refresh token
      const decoded = this.jwtService.verifyRefreshToken(refreshToken);

      // Get user
      const user = await this.userRepository.findById(decoded.sub);
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid refresh token',
        });
        return;
      }

      // Check if refresh token exists in Redis
      const redisService = getRedisService();
      const hasToken = await redisService.hasRefreshToken(user.id, refreshToken);
      if (!hasToken) {
        res.status(401).json({
          success: false,
          error: 'Invalid or expired refresh token',
        });
        return;
      }

      // Get permissions for role
      const permissions = getPermissionsByRole(user.role as UserRole);

      // Generate new tokens
      const tokens = this.jwtService.generateTokenPair({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions,
      });

      // Store new refresh token in Redis
      const refreshExpiry = 7 * 24 * 60 * 60; // 7 days in seconds
      await redisService.removeRefreshToken(user.id, refreshToken);
      await redisService.storeRefreshToken(user.id, tokens.refreshToken, refreshExpiry);

      res.status(200).json({
        success: true,
        token: tokens.accessToken,
        expiresIn: tokens.expiresIn,
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token',
      });
    }
  };

  /**
   * GET /auth/me
   * Get current user info
   * Note: This endpoint should use authenticateToken middleware in routes
   */
  me = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const user = await this.userRepository.findById(req.user.id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      // Get permissions for role
      const permissions = getPermissionsByRole(user.role as UserRole);

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions,
        },
      });
    } catch (error) {
      console.error('Get user info error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * GET /auth/oauth/google
   * Redirect to Google OAuth
   */
  googleAuth = async (_req: Request, res: Response): Promise<void> => {
    try {
      if (!this.oauth2Service.isOAuth2Configured()) {
        res.status(503).json({
          success: false,
          error: 'Google OAuth2 is not configured',
        });
        return;
      }
      const authUrl = this.oauth2Service.getGoogleAuthUrl();
      res.redirect(authUrl);
    } catch (error) {
      console.error('Google OAuth error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to initiate Google authentication',
      });
    }
  };

  /**
   * GET /auth/oauth/google/callback
   * Handle Google OAuth callback
   */
  googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!this.oauth2Service.isOAuth2Configured()) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/auth/error?message=oauth_not_configured`);
        return;
      }

      const { code } = req.query;

      if (!code || typeof code !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Authorization code is required',
        });
        return;
      }

      // Exchange code for tokens
      const googleTokens = await this.oauth2Service.exchangeGoogleCode(code);

      // Get user info
      const googleUser = await this.oauth2Service.getGoogleUserInfo(
        googleTokens.accessToken
      );

      // Find or create user
      let user = await this.userRepository.findByEmail(googleUser.email);

      if (!user) {
        // Create new user from Google profile (default to buyer)
        user = await this.userRepository.create({
          email: googleUser.email,
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          role: 'buyer',
          avatarUrl: googleUser.picture,
        });
      }

      // Get permissions for role
      const permissions = getPermissionsByRole(user.role as UserRole);

      // Generate our JWT tokens
      const tokens = this.jwtService.generateTokenPair({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions,
      });

      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(
        `${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
      );
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/error?message=oauth_failed`);
    }
  };

  /**
   * POST /auth/logout
   * Logout (invalidate tokens)
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      const { refreshToken } = req.body;

      const redisService = getRedisService();

      // Blacklist access token if provided
      if (token) {
        try {
          const jwtService = new JWTService();
          const expiration = jwtService.getTokenExpiration(token);
          if (expiration) {
            const expiresIn = Math.max(0, Math.floor((expiration.getTime() - Date.now()) / 1000));
            await redisService.blacklistToken(token, expiresIn);
          }
        } catch (error) {
          // Token might be invalid, but we still want to logout
          console.log('Token validation failed during logout, continuing...');
        }
      }

      // Remove refresh token if provided
      if (refreshToken && req.user) {
        await redisService.removeRefreshToken(req.user.id, refreshToken);
      }

      // Remove all refresh tokens for user if authenticated
      if (req.user) {
        await redisService.removeAllRefreshTokens(req.user.id);
        logAuthEvent('user_logged_out', req.user.id, req.user.email);
      }

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };
}
