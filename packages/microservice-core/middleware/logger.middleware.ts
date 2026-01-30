/**
 * Shared Logger Middleware for Microservices
 * Provides structured JSON logging with distributed tracing support
 * 
 * Features:
 * - Request/Response logging
 * - Distributed tracing headers
 * - Correlation IDs
 * - Performance timing
 */

import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogEntry {
  level: LogLevel;
  message: string;
  service: string;
  timestamp: string;
  traceId?: string;
  spanId?: string;
  requestId?: string;
  [key: string]: any;
}

interface LoggerConfig {
  serviceName: string;
  minLevel?: LogLevel;
  prettyPrint?: boolean;
}

// Log level priority
const levelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

let config: LoggerConfig = {
  serviceName: 'unknown-service',
  minLevel: 'info',
  prettyPrint: process.env.NODE_ENV === 'development',
};

export function configureLogger(newConfig: Partial<LoggerConfig>): void {
  config = { ...config, ...newConfig };
}

// Core logging function
function log(level: LogLevel, message: string, context: Record<string, any> = {}): void {
  if (levelPriority[level] < levelPriority[config.minLevel || 'info']) {
    return;
  }
  
  const entry: LogEntry = {
    level,
    message,
    service: config.serviceName,
    timestamp: new Date().toISOString(),
    ...context,
  };
  
  const output = config.prettyPrint
    ? JSON.stringify(entry, null, 2)
    : JSON.stringify(entry);
  
  if (level === 'error' || level === 'fatal') {
    console.error(output);
  } else if (level === 'warn') {
    console.warn(output);
  } else {
    console.log(output);
  }
}

// Exported log functions
export const logger = {
  debug: (message: string, context?: Record<string, any>) => log('debug', message, context),
  info: (message: string, context?: Record<string, any>) => log('info', message, context),
  warn: (message: string, context?: Record<string, any>) => log('warn', message, context),
  error: (message: string, context?: Record<string, any>) => log('error', message, context),
  fatal: (message: string, context?: Record<string, any>) => log('fatal', message, context),
};

// Generate trace headers
function generateTraceId(): string {
  return randomUUID().replace(/-/g, '').substring(0, 32);
}

function generateSpanId(): string {
  return randomUUID().replace(/-/g, '').substring(0, 16);
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      traceId?: string;
      spanId?: string;
      startTime?: number;
    }
  }
}

// Request logging middleware
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  // Generate or extract trace context
  req.requestId = (req.headers['x-request-id'] as string) || randomUUID();
  req.traceId = (req.headers['x-trace-id'] as string) || generateTraceId();
  req.spanId = generateSpanId();
  req.startTime = Date.now();
  
  // Set response headers for tracing
  res.setHeader('X-Request-ID', req.requestId);
  res.setHeader('X-Trace-ID', req.traceId);
  res.setHeader('X-Span-ID', req.spanId);
  
  // Log incoming request
  logger.info('Incoming request', {
    requestId: req.requestId,
    traceId: req.traceId,
    spanId: req.spanId,
    method: req.method,
    url: req.originalUrl,
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    headers: {
      'user-agent': req.get('user-agent'),
      'content-type': req.get('content-type'),
      'accept': req.get('accept'),
      'origin': req.get('origin'),
    },
    ip: req.ip || req.socket.remoteAddress,
    contentLength: req.get('content-length'),
  });
  
  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - (req.startTime || Date.now());
    const level: LogLevel = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    
    log(level, 'Request completed', {
      requestId: req.requestId,
      traceId: req.traceId,
      spanId: req.spanId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      responseTime: duration,
      responseTimeUnit: 'ms',
      contentLength: res.get('content-length'),
    });
  });
  
  next();
}

// Child logger for specific operations
export function createChildLogger(context: Record<string, any>) {
  return {
    debug: (message: string, extra?: Record<string, any>) => 
      log('debug', message, { ...context, ...extra }),
    info: (message: string, extra?: Record<string, any>) => 
      log('info', message, { ...context, ...extra }),
    warn: (message: string, extra?: Record<string, any>) => 
      log('warn', message, { ...context, ...extra }),
    error: (message: string, extra?: Record<string, any>) => 
      log('error', message, { ...context, ...extra }),
    fatal: (message: string, extra?: Record<string, any>) => 
      log('fatal', message, { ...context, ...extra }),
  };
}

// Request context logger
export function getRequestLogger(req: Request) {
  return createChildLogger({
    requestId: req.requestId,
    traceId: req.traceId,
    spanId: req.spanId,
  });
}
