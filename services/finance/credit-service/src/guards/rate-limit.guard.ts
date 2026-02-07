import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

/**
 * Rate Limiting Guard
 * 
 * Implements token bucket algorithm for rate limiting
 * Limits requests per IP address
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly requests = new Map<string, number[]>();
  private readonly enabled: boolean;
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    this.enabled = this.configService.get<boolean>('RATE_LIMIT_ENABLED', true);
    this.windowMs = this.configService.get<number>('RATE_LIMIT_WINDOW', 60000); // 1 minute
    this.maxRequests = this.configService.get<number>('RATE_LIMIT_MAX', 100);

    // Cleanup old entries every minute
    if (this.enabled) {
      setInterval(() => this.cleanup(), 60000);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.enabled) {
      return true;
    }

    // Check if rate limiting is disabled for this route
    const skipRateLimit = this.reflector.get<boolean>(
      'skipRateLimit',
      context.getHandler(),
    );

    if (skipRateLimit) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    // Get client identifier (IP address)
    const clientId = this.getClientId(request);
    
    // Get or create request history for this client
    const now = Date.now();
    const requestHistory = this.requests.get(clientId) || [];
    
    // Remove requests outside the time window
    const recentRequests = requestHistory.filter(
      (timestamp) => now - timestamp < this.windowMs,
    );

    // Check if limit exceeded
    if (recentRequests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...recentRequests);
      const retryAfter = Math.ceil((oldestRequest + this.windowMs - now) / 1000);

      // Set rate limit headers
      response.setHeader('X-RateLimit-Limit', this.maxRequests);
      response.setHeader('X-RateLimit-Remaining', 0);
      response.setHeader('X-RateLimit-Reset', new Date(oldestRequest + this.windowMs).toISOString());
      response.setHeader('Retry-After', retryAfter);

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests, please try again later',
          retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Add current request to history
    recentRequests.push(now);
    this.requests.set(clientId, recentRequests);

    // Set rate limit headers
    response.setHeader('X-RateLimit-Limit', this.maxRequests);
    response.setHeader('X-RateLimit-Remaining', this.maxRequests - recentRequests.length);
    response.setHeader('X-RateLimit-Reset', new Date(now + this.windowMs).toISOString());

    return true;
  }

  /**
   * Get client identifier from request
   */
  private getClientId(request: any): string {
    // Try to get real IP from proxy headers
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }

    const realIp = request.headers['x-real-ip'];
    if (realIp) {
      return realIp;
    }

    // Fallback to connection IP
    return request.ip || request.connection.remoteAddress || 'unknown';
  }

  /**
   * Cleanup old entries to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    
    for (const [clientId, timestamps] of this.requests.entries()) {
      const recentRequests = timestamps.filter(
        (timestamp) => now - timestamp < this.windowMs,
      );

      if (recentRequests.length === 0) {
        this.requests.delete(clientId);
      } else {
        this.requests.set(clientId, recentRequests);
      }
    }
  }
}
