import rateLimit from 'express-rate-limit';
/**
 * Rate limiter for admin routes
 * Higher limits for administrators
 */
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: {
    success: false,
    error: 'Limite de requêtes atteinte pour administrateur',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
/**
 * Rate limiter for buyer routes
 */
export const buyerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    error: 'Limite de requêtes atteinte',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
/**
 * Rate limiter for transporter routes
 */
export const transporterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  message: {
    success: false,
    error: 'Limite de requêtes atteinte pour transporteur',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
/**
 * Rate limiter for public routes (visitor)
 */
export const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  message: {
    success: false,
    error: 'Limite de requêtes atteinte. Veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
/**
 * Strict rate limiter for auth endpoints (login, register)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});
