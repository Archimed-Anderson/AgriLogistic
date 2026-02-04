import axios from 'axios';

const MISSION_SERVICE_URL = process.env.NEXT_PUBLIC_MISSION_SERVICE_URL || 'http://localhost:3006';

const api = axios.create({
  baseURL: MISSION_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreateMissionDto {
  shipperId: string;
  receiverId: string;
  productName: string;
  quantity: number;
  unit: string;
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  originName: string;
  originLat?: number;
  originLng?: number;
  destinationName: string;
  destinationLat?: number;
  destinationLng?: number;
  driverId?: string;
  truckId?: string;
}

export const missionsApi = {
  getMissions: async () => {
    const response = await api.get('/missions');
    return response.data;
  },

  getMission: async (id: string) => {
    const response = await api.get(`/missions/${id}`);
    return response.data;
  },

  createMission: async (data: CreateMissionDto) => {
    const response = await api.post('/missions', data);
    return response.data;
  },

  updateStatus: async (id: string, status: string, evidenceUrl?: string, notes?: string) => {
    const response = await api.patch(`/missions/${id}/status`, {
      status,
      evidenceUrl,
      notes,
    });
    return response.data;
  },

  getDriverSuggestions: async (id: string) => {
    const response = await api.get(`/missions/${id}/suggestions`);
    return response.data;
  },
};
