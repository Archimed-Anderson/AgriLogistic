import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

/**
 * API Key Authentication Guard
 * 
 * Validates API keys in the X-API-Key header
 * Can be bypassed with @Public() decorator
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly validApiKeys: Set<string>;
  private readonly headerName: string;

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    // Load valid API keys from environment
    const apiKey = this.configService.get<string>('API_KEY');
    this.validApiKeys = new Set(apiKey ? [apiKey] : []);
    
    this.headerName = this.configService.get<string>(
      'API_KEY_HEADER',
      'X-API-Key',
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    // Check if API key auth is disabled for this route
    const skipApiKey = this.reflector.get<boolean>(
      'skipApiKey',
      context.getHandler(),
    );

    if (skipApiKey) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    if (!this.isValidApiKey(apiKey)) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }

  /**
   * Extract API key from request headers
   */
  private extractApiKey(request: any): string | undefined {
    return request.headers[this.headerName.toLowerCase()];
  }

  /**
   * Validate API key
   */
  private isValidApiKey(apiKey: string): boolean {
    // In production, this should check against a database
    // For now, we check against environment variable
    return this.validApiKeys.has(apiKey);
  }

  /**
   * Add a new valid API key (for dynamic key management)
   */
  addApiKey(apiKey: string): void {
    this.validApiKeys.add(apiKey);
  }

  /**
   * Remove an API key
   */
  removeApiKey(apiKey: string): void {
    this.validApiKeys.delete(apiKey);
  }
}
