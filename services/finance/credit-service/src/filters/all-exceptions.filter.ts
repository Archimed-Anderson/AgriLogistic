import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * All Exceptions Filter
 * 
 * Catches all unhandled exceptions (including non-HTTP exceptions)
 * Provides a safety net for unexpected errors
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptions');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let stack: string | undefined;

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || message;
    }
    // Handle Error objects
    else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }
    // Handle unknown exceptions
    else if (typeof exception === 'string') {
      message = exception;
    }

    // Build error response
    const errorResponse: any = {
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development' && stack) {
      errorResponse.stack = stack;
    }

    // Log error with full details
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      stack,
    );

    // Send to error tracking service (e.g., Sentry) in production
    if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
      // Sentry.captureException(exception);
    }

    // Send response
    response.status(status).json(errorResponse);
  }
}
