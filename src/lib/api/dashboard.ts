/**
 * Dashboard API Endpoints
 */

import apiClient from './client';
import type {
  DashboardKPIs,
  RevenueData,
  AgriTask,
  WeatherData,
  WeatherAlert,
  AIRecommendation,
} from '@/types/farmer/dashboard';

export const dashboardAPI = {
  /**
   * Get dashboard KPIs
   */
  getKPIs: async (): Promise<DashboardKPIs> => {
    const response = await apiClient.get('/api/farmer/dashboard/kpis');
    return response.data;
  },

  /**
   * Get revenue data for charts
   */
  getRevenueData: async (period: 'week' | 'month' | 'year' = 'month'): Promise<RevenueData[]> => {
    const response = await apiClient.get('/api/farmer/dashboard/revenue', {
      params: { period },
    });
    return response.data;
  },

  /**
   * Get agricultural tasks
   */
  getTasks: async (filter?: 'all' | 'today' | 'week'): Promise<AgriTask[]> => {
    const response = await apiClient.get('/api/farmer/dashboard/tasks', {
      params: { filter },
    });
    return response.data;
  },

  /**
   * Update task status
   */
  updateTask: async (taskId: string, status: AgriTask['status']): Promise<AgriTask> => {
    const response = await apiClient.patch(`/api/farmer/dashboard/tasks/${taskId}`, {
      status,
    });
    return response.data;
  },

  /**
   * Get weather forecast
   */
  getWeather: async (days: number = 7): Promise<WeatherData[]> => {
    const response = await apiClient.get('/api/farmer/dashboard/weather', {
      params: { days },
    });
    return response.data;
  },

  /**
   * Get weather alerts
   */
  getAlerts: async (): Promise<WeatherAlert[]> => {
    const response = await apiClient.get('/api/farmer/dashboard/alerts');
    return response.data;
  },

  /**
   * Get AI recommendations
   */
  getRecommendations: async (): Promise<AIRecommendation[]> => {
    const response = await apiClient.get('/api/farmer/dashboard/recommendations');
    return response.data;
  },

  /**
   * Dismiss a recommendation
   */
  dismissRecommendation: async (recommendationId: string): Promise<void> => {
    await apiClient.delete(`/api/farmer/dashboard/recommendations/${recommendationId}`);
  },
};
