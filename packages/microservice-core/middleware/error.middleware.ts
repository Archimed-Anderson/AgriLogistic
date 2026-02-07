/**
 * Shared Error Handling Middleware for Microservices
 * Provides consistent error responses and logging across all services
 * 
 * Features:
 * - Custom error classes
 * - Consistent error response format
 * - Error logging with context
 * - Stack trace hiding in production
 */

import { Request, Response, NextFunction } from 'express';

// Base API Error
export class APIError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
    details?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    
    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
    
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

// Common Error Types
export class ValidationError extends APIError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', true, details);
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR', true);
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR', true);
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND', true);
  }
}

export class ConflictError extends APIError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT', true);
  }
}

export class RateLimitError extends APIError {
  constructor(retryAfter?: number) {
    super('Too many requests', 429, 'RATE_LIMIT_EXCEEDED', true, { retryAfter });
  }
}

export class ServiceUnavailableError extends APIError {
  constructor(service?: string) {
    super(service ? `${service} is unavailable` : 'Service temporarily unavailable', 503, 'SERVICE_UNAVAILABLE', true);
  }
}

// Error Response Interface
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    stack?: string;
    requestId?: string;
    timestamp: string;
  };
}

// Error handler configuration
interface ErrorHandlerConfig {
  serviceName: string;
  logToConsole?: boolean;
  includeStackInDev?: boolean;
}

let config: ErrorHandlerConfig = {
  serviceName: 'unknown-service',
  logToConsole: true,
  includeStackInDev: true,
};

export function configureErrorHandler(newConfig: ErrorHandlerConfig): void {
  config = { ...config, ...newConfig };
}

// Error logging function
function logError(error: Error | APIError, req: Request): void {
  const logData = {
    level: 'error',
    service: config.serviceName,
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] as string,
    error: {
      name: error.name,
      message: error.message,
      code: (error as APIError).code || 'UNKNOWN',
      stack: error.stack,
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      headers: {
        'user-agent': req.get('user-agent'),
        'content-type': req.get('content-type'),
      },
      ip: req.ip,
    },
  };
  
  if (config.logToConsole) {
    console.error(JSON.stringify(logData));
  }
}

// Main error handler middleware
export function errorHandler(
  err: Error | APIError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  logError(err, req);
  
  // Determine if it's an operational error
  const isOperational = err instanceof APIError && err.isOperational;
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Get status code
  const statusCode = err instanceof APIError ? err.statusCode : 500;
  
  // Build error response
  const response: ErrorResponse = {
    success: false,
    error: {
      code: err instanceof APIError ? err.code : 'INTERNAL_ERROR',
      message: isOperational ? err.message : 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] as string,
    },
  };
  
  // Include details for validation errors
  if (err instanceof APIError && err.details) {
    response.error.details = err.details;
  }
  
  // Include stack trace in development
  if (isDevelopment && config.includeStackInDev) {
    response.error.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
}

// 404 handler
export function notFoundHandler(req: Request, res: Response): void {
  const response: ErrorResponse = {
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] as string,
    },
  };
  
  res.status(404).json(response);
}

// Async error wrapper
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Validation helper
export function validateRequest<T>(
  schema: { validate: (data: any, options?: any) => { error?: any; value: T } },
  data: any
): T {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const details = error.details?.reduce((acc: Record<string, string>, detail: any) => {
      acc[detail.path.join('.')] = detail.message;
      return acc;
    }, {});
    
    throw new ValidationError('Validation failed', details);
  }
  
  return value;
}
