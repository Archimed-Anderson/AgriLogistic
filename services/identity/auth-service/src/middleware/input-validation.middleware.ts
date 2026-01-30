import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../services/logger.service';

/**
 * Enhanced Input Validation Middleware
 * Provides comprehensive validation for all user inputs
 */

// Password validation schema
export const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/)
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must not exceed 128 characters',
    'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  });

// Email validation schema
export const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .max(255)
  .lowercase()
  .trim()
  .messages({
    'string.email': 'Please provide a valid email address',
    'string.max': 'Email must not exceed 255 characters',
  });

// Name validation schema
export const nameSchema = Joi.string()
  .min(1)
  .max(100)
  .pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
  .trim()
  .messages({
    'string.min': 'Name must be at least 1 character',
    'string.max': 'Name must not exceed 100 characters',
    'string.pattern.base': 'Name contains invalid characters',
  });

// Phone validation schema
export const phoneSchema = Joi.string()
  .pattern(/^\+?[1-9]\d{1,14}$/)
  .allow(null, '')
  .messages({
    'string.pattern.base': 'Please provide a valid phone number (E.164 format)',
  });

// Role validation schema
export const roleSchema = Joi.string()
  .valid('admin', 'buyer', 'transporter')
  .messages({
    'any.only': 'Role must be one of: admin, buyer, transporter',
  });

// UUID validation schema
export const uuidSchema = Joi.string()
  .guid({ version: ['uuidv4'] })
  .messages({
    'string.guid': 'Invalid UUID format',
  });

/**
 * Registration validation schema
 */
export const registerSchema = Joi.object({
  email: emailSchema.required(),
  password: passwordSchema.required(),
  firstName: nameSchema.required(),
  lastName: nameSchema.required(),
  role: roleSchema.optional().default('buyer'),
  phone: phoneSchema.optional(),
});

/**
 * Login validation schema
 */
export const loginSchema = Joi.object({
  email: emailSchema.required(),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

/**
 * Update profile validation schema
 */
export const updateProfileSchema = Joi.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema.optional(),
  avatarUrl: Joi.string().uri().max(500).optional(),
});

/**
 * Password reset validation schema
 */
export const passwordResetSchema = Joi.object({
  token: Joi.string().length(32).hex().required().messages({
    'string.length': 'Invalid reset token',
    'string.hex': 'Invalid reset token format',
  }),
  password: passwordSchema.required(),
});

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = Joi.object({
  email: emailSchema.required(),
});

/**
 * Refresh token validation schema
 */
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

/**
 * Generic validation middleware factory
 */
export const validate = (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request body
      const { error, value } = schema.validate(req.body, {
        abortEarly: false, // Return all errors
        stripUnknown: true, // Remove unknown fields
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));

        logger.warn('Validation failed', {
          path: req.path,
          errors,
          ip: req.ip,
        });

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
        });
        return;
      }

      // Replace req.body with validated and sanitized value
      req.body = value;
      next();
    } catch (err) {
      logger.error('Validation middleware error', { error: err });
      res.status(500).json({
        success: false,
        error: 'Validation error',
      });
    }
  };
};

/**
 * Sanitize HTML to prevent XSS
 */
export const sanitizeHtml = (input: string): string => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Middleware to sanitize all string inputs
 */
export const sanitizeInputs = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeHtml(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj !== null && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  };

  // Sanitize body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

/**
 * Validate query parameters
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));

        res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: errors,
        });
        return;
      }

      req.query = value;
      next();
    } catch (err) {
      logger.error('Query validation error', { error: err });
      res.status(500).json({
        success: false,
        error: 'Validation error',
      });
    }
  };
};

/**
 * Validate URL parameters
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = schema.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));

        res.status(400).json({
          success: false,
          error: 'Invalid URL parameters',
          details: errors,
        });
        return;
      }

      req.params = value;
      next();
    } catch (err) {
      logger.error('Params validation error', { error: err });
      res.status(500).json({
        success: false,
        error: 'Validation error',
      });
    }
  };
};

/**
 * Common query schemas
 */
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export const idParamSchema = Joi.object({
  id: uuidSchema.required(),
});
