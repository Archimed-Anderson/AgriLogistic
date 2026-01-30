import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  const startTime = Date.now();

  // Attach request ID to headers for distributed tracing
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);

  const logData = {
    timestamp: new Date().toISOString(),
    requestId,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('user-agent'),
    ip: req.ip || req.socket.remoteAddress,
    traceId: req.headers['x-trace-id'] || requestId,
    spanId: req.headers['x-span-id'],
  };

  console.log(JSON.stringify({
    level: 'info',
    message: 'Incoming request',
    ...logData,
  }));

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    console.log(JSON.stringify({
      level: res.statusCode >= 400 ? 'error' : 'info',
      message: 'Request completed',
      ...logData,
      statusCode: res.statusCode,
      responseTime: duration,
      contentLength: res.get('content-length'),
    }));
  });

  next();
};

export const errorLogger = (err: Error, req: Request, _res: Response, next: NextFunction) => {
  console.error(JSON.stringify({
    level: 'error',
    message: 'Request error',
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    requestId: req.headers['x-request-id'],
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
  }));

  next(err);
};
