/**
 * Health check utilities for backend services
 */

interface HealthStatus {
  available: boolean;
  message: string;
  endpoint?: string;
}

export class HealthCheckService {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000/api/v1';
  }

  /**
   * Check if the API Gateway is accessible
   */
  async checkGateway(): Promise<HealthStatus> {
    try {
      const response = await fetch(`${this.baseURL.replace('/api/v1', '')}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        return {
          available: true,
          message: 'API Gateway accessible',
          endpoint: this.baseURL,
        };
      }

      return {
        available: false,
        message: `API Gateway returned status ${response.status}`,
        endpoint: this.baseURL,
      };
    } catch (error) {
      return {
        available: false,
        message: 'API Gateway non accessible. Le backend n\'est peut-être pas démarré.',
        endpoint: this.baseURL,
      };
    }
  }

  /**
   * Check if auth service is available
   */
  async checkAuthService(): Promise<HealthStatus> {
    try {
      // Try to access a public endpoint that shouldn't require authentication
      const response = await fetch(`${this.baseURL}/auth/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok || response.status === 404) {
        // 404 means the gateway is routing, service might just not have health endpoint
        return {
          available: true,
          message: 'Service d\'authentification accessible',
        };
      }

      return {
        available: false,
        message: `Service d'authentification non disponible (status ${response.status})`,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          available: false,
          message: 'Service d\'authentification: timeout de connexion',
        };
      }

      return {
        available: false,
        message: 'Service d\'authentification non accessible',
      };
    }
  }

  /**
   * Perform complete health check
   */
  async performHealthCheck(): Promise<{
    healthy: boolean;
    gateway: HealthStatus;
    authService: HealthStatus;
    recommendations: string[];
  }> {
    const [gateway, authService] = await Promise.all([
      this.checkGateway(),
      this.checkAuthService(),
    ]);

    const healthy = gateway.available && authService.available;
    const recommendations: string[] = [];

    if (!gateway.available) {
      recommendations.push(
        'Le backend n\'est pas accessible. Assurez-vous que Docker est démarré:',
        '  • Vérifiez que Docker Desktop est en cours d\'exécution',
        '  • Lancez: docker-compose up -d',
        `  • Ou vérifiez si un serveur écoute sur ${gateway.endpoint}`
      );
    }

    if (!authService.available && gateway.available) {
      recommendations.push(
        'Le service d\'authentification n\'est pas accessible.',
        'Démarrez-le avec:',
        '  • cd services/auth-service',
        '  • docker-compose up -d',
        '  • Ou: npm run dev (pour le développement local)'
      );
    }

    return {
      healthy,
      gateway,
      authService,
      recommendations,
    };
  }
}

// Singleton instance
export const healthCheckService = new HealthCheckService();
