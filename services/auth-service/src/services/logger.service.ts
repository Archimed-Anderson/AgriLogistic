import winston from 'winston';
import path from 'path';
// Create logs directory
const logsDir = path.join(__dirname, '../../logs');
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'auth-service' },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Auth-specific logs
    new winston.transports.File({
      filename: path.join(logsDir, 'auth.log'),
     level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});
// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

/**
 * Log login attempt
 */
export const logLoginAttempt = (
  email: string,
  success: boolean,
  ipAddress: string,
  userAgent?: string,
  role?: string
): void => {
  logger.info('Login attempt', {
    email,
    success,
    role,
    ip: ipAddress,
    userAgent,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log permission denied access
 */
export const logPermissionDenied = (
  userId: string,
  role: string,
  requiredPermission: string,
  ipAddress?: string
): void => {
  logger.warn('Permission denied', {
    userId,
    role,
    requiredPermission,
    ip: ipAddress,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log security alert (multiple failed login attempts)
 */
export const logSecurityAlert = (
  email: string,
  attempts: number,
  ipAddress: string,
  userAgent?: string
): void => {
  logger.error('Security alert: Multiple failed login attempts', {
    email,
    attempts,
    ip: ipAddress,
    userAgent,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log authentication event
 */
export const logAuthEvent = (
  event: string,
  userId?: string,
  email?: string,
  metadata?: Record<string, any>
): void => {
  logger.info('Authentication event', {
    event,
    userId,
    email,
    ...metadata,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log admin action
 */
export const logAdminAction = (
  adminId: string,
  action: string,
  metadata?: Record<string, any>
): void => {
  logger.info('Admin action', {
    adminId,
    action,
    ...metadata,
    timestamp: new Date().toISOString(),
  });
};
