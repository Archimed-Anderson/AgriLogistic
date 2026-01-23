/**
 * Farm Operations API Endpoints
 */

import apiClient from './client';
import type { FarmField, IoTSensor, CropRotationPlan, InventoryItem, BudgetEntry, CropProfitability } from '@/types/farmer/operations';

export const operationsAPI = {
  /**
   * Get farm fields
   */
  getFields: async (): Promise<FarmField[]> => {
    const response = await apiClient.get('/api/farmer/operations/fields');
    return response.data;
  },

  /**
   * Get IoT sensors
   */
  getSensors: async (): Promise<IoTSensor[]> => {
    const response = await apiClient.get('/api/farmer/operations/sensors');
    return response.data;
  },

  /**
   * Get sensor readings (real-time)
   */
  getSensorReadings: async (sensorId: string, hours: number = 24): Promise<any[]> => {
    const response = await apiClient.get(`/api/farmer/operations/sensors/${sensorId}/readings`, {
      params: { hours },
    });
    return response.data;
  },

  /**
   * Get crop rotation plans
   */
  getRotationPlans: async (): Promise<CropRotationPlan[]> => {
    const response = await apiClient.get('/api/farmer/operations/rotations');
    return response.data;
  },

  /**
   * Generate AI rotation plan
   */
  generateRotationPlan: async (fieldId: string): Promise<CropRotationPlan> => {
    const response = await apiClient.post('/api/farmer/operations/rotations/generate', {
      fieldId,
    });
    return response.data;
  },

  /**
   * Get inventory
   */
  getInventory: async (): Promise<InventoryItem[]> => {
    const response = await apiClient.get('/api/farmer/operations/inventory');
    return response.data;
  },

  /**
   * Update inventory item
   */
  updateInventory: async (itemId: string, quantity: number): Promise<InventoryItem> => {
    const response = await apiClient.patch(`/api/farmer/operations/inventory/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  /**
   * Get budget entries
   */
  getBudget: async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<BudgetEntry[]> => {
    const response = await apiClient.get('/api/farmer/operations/budget', {
      params: { period },
    });
    return response.data;
  },

  /**
   * Get crop profitability
   */
  getProfitability: async (): Promise<CropProfitability[]> => {
    const response = await apiClient.get('/api/farmer/operations/profitability');
    return response.data;
  },
};
