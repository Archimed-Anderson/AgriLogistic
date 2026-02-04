import { apiClient } from '../api-client';

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  revenue: number;
  usersChange: number;
  ordersChange: number;
  revenueChange: number;
  usersOverTime: Array<{ date: string; count: number }>;
  revenueOverTime: Array<{ date: string; amount: number }>;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  dismissed: boolean;
}

export interface Activity {
  id: string;
  adminUserId: string;
  adminUserName: string;
  action: string;
  resource: string;
  timestamp: string;
}

/**
 * Admin Dashboard API Repository
 */
export class AdminDashboardRepository {
  private readonly basePath = '/admin/dashboard';

  /**
   * Get dashboard metrics
   */
  async getMetrics(dateRange?: { from: string; to: string }): Promise<DashboardMetrics> {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('from', dateRange.from);
      params.append('to', dateRange.to);
    }

    return apiClient.get<DashboardMetrics>(`${this.basePath}/metrics?${params.toString()}`);
  }

  /**
   * Get system alerts
   */
  async getAlerts(): Promise<SystemAlert[]> {
    return apiClient.get<SystemAlert[]>(`${this.basePath}/alerts`);
  }

  /**
   * Dismiss an alert
   */
  async dismissAlert(alertId: string): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/alerts/${alertId}/dismiss`);
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 10): Promise<Activity[]> {
    return apiClient.get<Activity[]>(`${this.basePath}/activity?limit=${limit}`);
  }
}

// Export singleton instance
export const adminDashboardRepository = new AdminDashboardRepository();
