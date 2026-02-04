import { AuthProvider } from './auth-provider.interface';
import { MockAuthAdapter } from './mock-auth.adapter';
import { RealAuthAdapter } from '../api/rest/auth-api';

export enum AuthProviderType {
  MOCK = 'mock',
  REAL = 'real',
  SUPABASE = 'supabase',
  CUSTOM = 'custom',
}

/**
 * Auth Provider Factory
 *
 * Creates and manages authentication provider instances based on configuration.
 * This factory pattern allows the application to switch between different
 * authentication backends without modifying business logic.
 */
export class AuthProviderFactory {
  private static instance: AuthProvider | null = null;
  private static currentType: AuthProviderType = AuthProviderType.REAL;

  /**
   * Get or create the auth provider instance
   */
  static getProvider(type?: AuthProviderType): AuthProvider {
    if (type && type !== this.currentType) {
      this.instance = null;
      this.currentType = type;
    }

    if (!this.instance) {
      this.instance = this.createProvider(this.currentType);
    }

    return this.instance;
  }

  /**
   * Create a new provider instance based on type
   */
  private static createProvider(type: AuthProviderType): AuthProvider {
    switch (type) {
      case AuthProviderType.MOCK:
        console.log('🔧 Using Mock Auth Provider');
        return new MockAuthAdapter();

      case AuthProviderType.REAL:
        console.log('🚀 Using Real Auth Provider (Backend API)');
        return new RealAuthAdapter();

      case AuthProviderType.SUPABASE:
        console.warn('Supabase provider not yet implemented, falling back to Real');
        return new RealAuthAdapter();

      case AuthProviderType.CUSTOM:
        console.warn('Custom provider not yet implemented, falling back to Real');
        return new RealAuthAdapter();

      default:
        throw new Error(`Unknown auth provider type: ${type}`);
    }
  }

  /**
   * Reset the current provider (useful for testing)
   */
  static reset(): void {
    this.instance = null;
  }

  /**
   * Configure the provider type from environment variables
   */
  static configureFromEnv(): AuthProvider {
    // E2E (Playwright) runs with navigator.webdriver=true.
    // Use Mock provider to make UI tests deterministic and isolated from backend availability.
    if (typeof navigator !== 'undefined' && (navigator as any).webdriver) {
      return this.getProvider(AuthProviderType.MOCK);
    }

    const envProvider = import.meta.env?.VITE_AUTH_PROVIDER as string;

    let providerType: AuthProviderType;

    switch (envProvider?.toLowerCase()) {
      case 'mock':
        providerType = AuthProviderType.MOCK;
        break;
      case 'real':
      case 'backend':
      case 'api':
        providerType = AuthProviderType.REAL;
        break;
      case 'supabase':
        providerType = AuthProviderType.SUPABASE;
        break;
      default:
        providerType = AuthProviderType.REAL;
    }

    return this.getProvider(providerType);
  }
}
