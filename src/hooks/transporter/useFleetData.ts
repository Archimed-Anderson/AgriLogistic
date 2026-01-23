/**
 * Fleet Management Hook
 * Manages vehicle data, maintenance schedules, and fleet statistics
 */
import { useQuery } from '@tanstack/react-query';
import type { Vehicle, MaintenanceSchedule } from '@/types/transporter';

// Mock fleet data
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Camion Frigo 01',
    type: 'refrigerated',
    licensePlate: 'DK-1234-AB',
    specifications: {
      maxWeight: 3500,
      maxVolume: 12,
      hasRefrigeration: true,
      maxHeight: 3.2,
      maxWidth: 2.5,
      maxLength: 7,
    },
    status: 'in_use',
    currentLocation: [-17.4467, 14.6928],
    iotDevice: {
      deviceId: 'IOT-001',
      connected: true,
      lastUpdate: new Date(),
      data: {
        fuelLevel: 75,
        temperature: 4,
        speed: 65,
        engineStatus: 'on',
        batteryVoltage: 24.5,
      },
    },
    maintenanceSchedule: [
      {
        id: 'm1',
        type: 'oil_change',
        description: 'Vidange moteur',
        scheduledDate: new Date('2024-02-15'),
        status: 'scheduled',
      },
      {
        id: 'm2',
        type: 'inspection',
        description: 'Contrôle technique',
        scheduledDate: new Date('2024-01-10'),
        completedDate: new Date('2024-01-10'),
        cost: 45000,
        status: 'completed',
      },
    ],
    costs: {
      insurance: 150000,
      registration: 25000,
      maintenance: 45000,
      fuel: 450000,
      repairs: 0,
      total: 670000,
    },
    documents: [],
    purchaseDate: new Date('2022-03-15'),
    mileage: 45000,
    hoursOfOperation: 1200,
    nextMaintenance: new Date('2024-02-15'),
  },
  {
    id: '2',
    name: 'Camion Benne 02',
    type: 'truck',
    licensePlate: 'DK-5678-CD',
    specifications: {
      maxWeight: 12000,
      maxVolume: 20,
      hasRefrigeration: false,
      maxHeight: 3.5,
      maxWidth: 2.5,
      maxLength: 8,
    },
    status: 'available',
    currentLocation: [-17.4567, 14.7028],
    iotDevice: {
      deviceId: 'IOT-002',
      connected: true,
      lastUpdate: new Date(),
      data: {
        fuelLevel: 45,
        speed: 0,
        engineStatus: 'off',
        batteryVoltage: 24.2,
      },
    },
    maintenanceSchedule: [
      {
        id: 'm3',
        type: 'tire_rotation',
        description: 'Changement pneus',
        scheduledDate: new Date('2024-01-20'),
        status: 'overdue',
      },
    ],
    costs: {
      insurance: 200000,
      registration: 35000,
      maintenance: 0,
      fuel: 650000,
      repairs: 25000,
      total: 910000,
    },
    documents: [],
    purchaseDate: new Date('2021-06-10'),
    mileage: 85000,
    hoursOfOperation: 2500,
    nextMaintenance: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Van Express 03',
    type: 'van',
    licensePlate: 'DK-9012-EF',
    specifications: {
      maxWeight: 1500,
      maxVolume: 8,
      hasRefrigeration: false,
      maxHeight: 2.2,
      maxWidth: 2.0,
      maxLength: 5,
    },
    status: 'maintenance',
    currentLocation: [-17.4767, 14.7328],
    maintenanceSchedule: [],
    costs: {
      insurance: 80000,
      registration: 15000,
      maintenance: 120000,
      fuel: 250000,
      repairs: 120000,
      total: 585000,
    },
    documents: [],
    purchaseDate: new Date('2023-01-15'),
    mileage: 25000,
    hoursOfOperation: 600,
  },
];

export function useFleetData() {
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['transporter', 'fleet'],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockVehicles;
    },
  });

  const getFleetStats = () => {
    if (!vehicles) return null;

    return {
      total: vehicles.length,
      active: vehicles.filter((v) => v.status === 'in_use').length,
      available: vehicles.filter((v) => v.status === 'available').length,
      maintenance: vehicles.filter((v) => v.status === 'maintenance').length,
      totalCosts: vehicles.reduce((sum, v) => sum + v.costs.total, 0),
      fuelCost: vehicles.reduce((sum, v) => sum + v.costs.fuel, 0),
      maintenanceCost: vehicles.reduce((sum, v) => sum + v.costs.maintenance, 0),
    };
  };

  return {
    vehicles,
    stats: getFleetStats(),
    isLoading,
  };
}
