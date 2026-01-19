/**
 * Shared Health Check Middleware for Microservices
 * Provides standardized health, liveness, and readiness endpoints
 * 
 * Features:
 * - Health check with dependency status
 * - Kubernetes liveness/readiness probes
 * - Configurable dependency checks
 * - Graceful degradation support
 */

import { Request, Response, Router } from 'express';

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface DependencyCheck {
  name: string;
  check: () => Promise<boolean>;
  required?: boolean;
}

interface HealthCheckConfig {
  serviceName: string;
  version?: string;
  dependencies?: DependencyCheck[];
}

interface HealthResponse {
  status: HealthStatus;
  service: string;
  version: string;
  timestamp: string;
  uptime: number;
  dependencies: Record<string, {
    status: 'up' | 'down';
    latency?: number;
  }>;
}

interface LivenessResponse {
  status: 'alive';
  timestamp: string;
}

interface ReadinessResponse {
  status: 'ready' | 'not ready';
  timestamp: string;
  dependencies?: Record<string, string>;
}

let config: HealthCheckConfig = {
  serviceName: 'unknown-service',
  version: '1.0.0',
  dependencies: [],
};

const startTime = Date.now();

export function configureHealthCheck(newConfig: HealthCheckConfig): void {
  config = { ...config, ...newConfig };
}

// Check all dependencies
async function checkDependencies(): Promise<{
  results: Record<string, { status: 'up' | 'down'; latency?: number }>;
  allHealthy: boolean;
  requiredHealthy: boolean;
}> {
  const results: Record<string, { status: 'up' | 'down'; latency?: number }> = {};
  let allHealthy = true;
  let requiredHealthy = true;
  
  for (const dep of config.dependencies || []) {
    const startCheck = Date.now();
    try {
      const isHealthy = await Promise.race([
        dep.check(),
        new Promise<boolean>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        ),
      ]);
      
      const latency = Date.now() - startCheck;
      results[dep.name] = {
        status: isHealthy ? 'up' : 'down',
        latency,
      };
      
      if (!isHealthy) {
        allHealthy = false;
        if (dep.required) {
          requiredHealthy = false;
        }
      }
    } catch {
      results[dep.name] = { status: 'down' };
      allHealthy = false;
      if (dep.required) {
        requiredHealthy = false;
      }
    }
  }
  
  return { results, allHealthy, requiredHealthy };
}

// Determine overall health status
function getOverallStatus(allHealthy: boolean, requiredHealthy: boolean): HealthStatus {
  if (allHealthy) return 'healthy';
  if (requiredHealthy) return 'degraded';
  return 'unhealthy';
}

// Health check endpoint handler
async function healthHandler(_req: Request, res: Response): Promise<void> {
  const { results, allHealthy, requiredHealthy } = await checkDependencies();
  const status = getOverallStatus(allHealthy, requiredHealthy);
  
  const response: HealthResponse = {
    status,
    service: config.serviceName,
    version: config.version || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    dependencies: results,
  };
  
  const httpStatus = status === 'unhealthy' ? 503 : 200;
  res.status(httpStatus).json(response);
}

// Liveness probe - is the process alive?
function livenessHandler(_req: Request, res: Response): void {
  const response: LivenessResponse = {
    status: 'alive',
    timestamp: new Date().toISOString(),
  };
  res.status(200).json(response);
}

// Readiness probe - can the service handle traffic?
async function readinessHandler(_req: Request, res: Response): Promise<void> {
  const { results, requiredHealthy } = await checkDependencies();
  
  const response: ReadinessResponse = {
    status: requiredHealthy ? 'ready' : 'not ready',
    timestamp: new Date().toISOString(),
    dependencies: Object.fromEntries(
      Object.entries(results).map(([k, v]) => [k, v.status])
    ),
  };
  
  const httpStatus = requiredHealthy ? 200 : 503;
  res.status(httpStatus).json(response);
}

// Create health check router
export function createHealthEndpoints(healthConfig?: HealthCheckConfig): Router {
  if (healthConfig) {
    configureHealthCheck(healthConfig);
  }
  
  const router = Router();
  
  router.get('/health', healthHandler);
  router.get('/live', livenessHandler);
  router.get('/liveness', livenessHandler);
  router.get('/ready', readinessHandler);
  router.get('/readiness', readinessHandler);
  
  return router;
}

// Utility: Create common dependency checks
export const commonChecks = {
  postgres: (client: { query: (q: string) => Promise<any> }): DependencyCheck => ({
    name: 'postgres',
    check: async () => {
      try {
        await client.query('SELECT 1');
        return true;
      } catch {
        return false;
      }
    },
    required: true,
  }),
  
  redis: (client: { ping: () => Promise<string> }): DependencyCheck => ({
    name: 'redis',
    check: async () => {
      try {
        const result = await client.ping();
        return result === 'PONG';
      } catch {
        return false;
      }
    },
    required: false,
  }),
  
  mongodb: (client: { db: () => { admin: () => { ping: () => Promise<any> } } }): DependencyCheck => ({
    name: 'mongodb',
    check: async () => {
      try {
        await client.db().admin().ping();
        return true;
      } catch {
        return false;
      }
    },
    required: true,
  }),
  
  http: (url: string, name: string): DependencyCheck => ({
    name,
    check: async () => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
      } catch {
        return false;
      }
    },
    required: false,
  }),
};
