import AdminUser from '../models/AdminUser';
import { Op } from 'sequelize';

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

export class DashboardService {
  async getMetrics(dateRange?: { from: string; to: string }): Promise<DashboardMetrics> {
    // TODO: Integrate with other services to get real metrics
    // For now, return mock data
    
    const totalUsers = await AdminUser.count();
    const activeUsers = await AdminUser.count({ where: { is_active: true } });

    // Mock data for demonstration
    const usersOverTime = this.generateMockTimeSeries(30, 100, 200);
    const revenueOverTime = this.generateMockTimeSeries(30, 1000, 5000);

    return {
      totalUsers,
      activeUsers,
      totalOrders: 1234, // Mock
      revenue: 45200, // Mock
      usersChange: 12, // Mock
      ordersChange: 8, // Mock
      revenueChange: 15, // Mock
      usersOverTime,
      revenueOverTime,
    };
  }

  async getAlerts() {
    // TODO: Implement real alerts from monitoring system
    return [
      {
        id: '1',
        type: 'warning' as const,
        message: 'High CPU usage detected on product-service',
        timestamp: new Date().toISOString(),
        dismissed: false,
      },
    ];
  }

  async dismissAlert(alertId: string) {
    // TODO: Implement alert dismissal
    return { success: true };
  }

  async getRecentActivity(limit: number = 10) {
    // TODO: Fetch from AuditLog
    return [];
  }

  private generateMockTimeSeries(days: number, min: number, max: number) {
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * (max - min) + min),
        amount: Math.floor(Math.random() * (max - min) + min),
      });
    }

    return data;
  }
}

export default new DashboardService();
