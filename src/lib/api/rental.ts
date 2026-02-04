/**
 * Rental API Endpoints
 */

import apiClient from './client';
import type { Equipment, Rental, MaintenanceSchedule } from '@/types/farmer/rental';

export const rentalAPI = {
  /**
   * Get equipment inventory
   */
  getEquipment: async (status?: Equipment['status']): Promise<Equipment[]> => {
    const response = await apiClient.get('/api/farmer/rental/equipment', {
      params: { status },
    });
    return response.data;
  },

  /**
   * Create equipment
   */
  createEquipment: async (equipment: Partial<Equipment>): Promise<Equipment> => {
    const response = await apiClient.post('/api/farmer/rental/equipment', equipment);
    return response.data;
  },

  /**
   * Update equipment
   */
  updateEquipment: async (equipmentId: string, updates: Partial<Equipment>): Promise<Equipment> => {
    const response = await apiClient.patch(`/api/farmer/rental/equipment/${equipmentId}`, updates);
    return response.data;
  },

  /**
   * Get rentals
   */
  getRentals: async (status?: Rental['status']): Promise<Rental[]> => {
    const response = await apiClient.get('/api/farmer/rental/rentals', {
      params: { status },
    });
    return response.data;
  },

  /**
   * Create rental
   */
  createRental: async (rental: Partial<Rental>): Promise<Rental> => {
    const response = await apiClient.post('/api/farmer/rental/rentals', rental);
    return response.data;
  },

  /**
   * Update rental status
   */
  updateRentalStatus: async (rentalId: string, status: Rental['status']): Promise<Rental> => {
    const response = await apiClient.patch(`/api/farmer/rental/rentals/${rentalId}/status`, {
      status,
    });
    return response.data;
  },

  /**
   * Get maintenance schedule
   */
  getMaintenance: async (): Promise<MaintenanceSchedule[]> => {
    const response = await apiClient.get('/api/farmer/rental/maintenance');
    return response.data;
  },

  /**
   * Schedule maintenance
   */
  scheduleMaintenance: async (
    maintenance: Partial<MaintenanceSchedule>
  ): Promise<MaintenanceSchedule> => {
    const response = await apiClient.post('/api/farmer/rental/maintenance', maintenance);
    return response.data;
  },

  /**
   * Get equipment availability
   */
  getAvailability: async (
    equipmentId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> => {
    const response = await apiClient.get(
      `/api/farmer/rental/equipment/${equipmentId}/availability`,
      {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      }
    );
    return response.data.available;
  },

  /**
   * Get equipment GPS location
   */
  getEquipmentLocation: async (equipmentId: string): Promise<[number, number]> => {
    const response = await apiClient.get(`/api/farmer/rental/equipment/${equipmentId}/location`);
    return response.data.coordinates;
  },
};
