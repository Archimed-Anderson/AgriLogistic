import { apiClient } from '../api-client';

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  responseTime: number;
  lastCheck: string;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

export interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  service: string;
}

/**
 * Admin System API Repository
 */
export class AdminSystemRepository {
  private readonly basePath = '/admin/system';

  /**
   * Get services health status
   */
  async getServicesHealth(): Promise<ServiceHealth[]> {
    return apiClient.get<ServiceHealth[]>(`${this.basePath}/health`);
  }

  /**
   * Get system metrics
   */
  async getMetrics(): Promise<SystemMetrics> {
    return apiClient.get<SystemMetrics>(`${this.basePath}/metrics`);
  }

  /**
   * Get system logs
   */
  async getLogs(params: { limit?: number; level?: string }): Promise<LogEntry[]> {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.level) queryParams.append('level', params.level);

    return apiClient.get<LogEntry[]>(
      `${this.basePath}/logs?${queryParams.toString()}`
    );
  }

  /**
   * Restart a service
   */
  async restartService(serviceName: string): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/services/${serviceName}/restart`);
  }
}

// Export singleton instance
export const adminSystemRepository = new AdminSystemRepository();
