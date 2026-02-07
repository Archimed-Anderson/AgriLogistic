import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Cache Interceptor
 * 
 * Implements in-memory caching for GET requests
 * Cache key is based on request URL and query parameters
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, { data: any; timestamp: number }>();
  private readonly logger = new Logger('Cache');
  private readonly enabled: boolean;
  private readonly ttl: number;

  constructor(private configService: ConfigService) {
    this.enabled = this.configService.get<boolean>('CACHE_ENABLED', true);
    this.ttl = this.configService.get<number>('REDIS_TTL', 3600) * 1000; // Convert to ms

    // Cleanup expired entries every 5 minutes
    if (this.enabled) {
      setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (!this.enabled) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // Only cache GET requests
    if (method !== 'GET') {
      return next.handle();
    }

    // Generate cache key
    const cacheKey = this.getCacheKey(request);

    // Check if cached response exists and is valid
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      this.logger.debug(`Cache HIT: ${url}`);
      return of(cached.data);
    }

    this.logger.debug(`Cache MISS: ${url}`);

    // Execute request and cache response
    return next.handle().pipe(
      tap((data) => {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
        this.logger.debug(`Cached: ${url}`);
      }),
    );
  }

  /**
   * Generate cache key from request
   */
  private getCacheKey(request: any): string {
    const { url, query } = request;
    const queryString = JSON.stringify(query || {});
    return `${url}:${queryString}`;
  }

  /**
   * Cleanup expired cache entries
   */
  private cleanup(): void {
    const now = Date.now();
    let removed = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.ttl) {
        this.cache.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      this.logger.debug(`Cleaned up ${removed} expired cache entries`);
    }
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.log('Cache cleared');
  }

  /**
   * Clear specific cache entry
   */
  clearCacheEntry(key: string): void {
    this.cache.delete(key);
    this.logger.debug(`Cache entry cleared: ${key}`);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      enabled: this.enabled,
      ttl: this.ttl / 1000, // Convert back to seconds
    };
  }
}
