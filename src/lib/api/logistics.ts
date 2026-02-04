/**
 * Logistics API Endpoints
 */

import apiClient from './client';
import type { Delivery, Route, Carrier, TransportCost } from '@/types/farmer/logistics';

export const logisticsAPI = {
  /**
   * Get deliveries
   */
  getDeliveries: async (status?: Delivery['status']): Promise<Delivery[]> => {
    const response = await apiClient.get('/api/farmer/logistics/deliveries', {
      params: { status },
    });
    return response.data;
  },

  /**
   * Create delivery
   */
  createDelivery: async (delivery: Partial<Delivery>): Promise<Delivery> => {
    const response = await apiClient.post('/api/farmer/logistics/deliveries', delivery);
    return response.data;
  },

  /**
   * Update delivery status
   */
  updateDeliveryStatus: async (
    deliveryId: string,
    status: Delivery['status']
  ): Promise<Delivery> => {
    const response = await apiClient.patch(
      `/api/farmer/logistics/deliveries/${deliveryId}/status`,
      {
        status,
      }
    );
    return response.data;
  },

  /**
   * Get delivery tracking
   */
  getDeliveryTracking: async (deliveryId: string): Promise<Delivery['tracking']> => {
    const response = await apiClient.get(`/api/farmer/logistics/deliveries/${deliveryId}/tracking`);
    return response.data;
  },

  /**
   * Get routes
   */
  getRoutes: async (status?: Route['status']): Promise<Route[]> => {
    const response = await apiClient.get('/api/farmer/logistics/routes', {
      params: { status },
    });
    return response.data;
  },

  /**
   * Optimize route
   */
  optimizeRoute: async (
    deliveryIds: string[],
    algorithm?: Route['optimization']['algorithm']
  ): Promise<Route> => {
    const response = await apiClient.post('/api/farmer/logistics/routes/optimize', {
      deliveryIds,
      algorithm: algorithm || 'nearest_neighbor',
    });
    return response.data;
  },

  /**
   * Start route
   */
  startRoute: async (routeId: string): Promise<Route> => {
    const response = await apiClient.post(`/api/farmer/logistics/routes/${routeId}/start`);
    return response.data;
  },

  /**
   * Get carriers
   */
  getCarriers: async (): Promise<Carrier[]> => {
    const response = await apiClient.get('/api/farmer/logistics/carriers');
    return response.data;
  },

  /**
   * Assign carrier to delivery
   */
  assignCarrier: async (deliveryId: string, carrierId: string): Promise<Delivery> => {
    const response = await apiClient.post(`/api/farmer/logistics/deliveries/${deliveryId}/assign`, {
      carrierId,
    });
    return response.data;
  },

  /**
   * Calculate transport cost
   */
  calculateCost: async (deliveryId: string): Promise<TransportCost> => {
    const response = await apiClient.get(`/api/farmer/logistics/deliveries/${deliveryId}/cost`);
    return response.data;
  },

  /**
   * Get route directions (for map)
   */
  getRouteDirections: async (waypoints: [number, number][]): Promise<any> => {
    const response = await apiClient.post('/api/farmer/logistics/routes/directions', {
      waypoints,
    });
    return response.data;
  },
};
