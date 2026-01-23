/**
 * Rental Data Hook
 */
import { useQuery } from '@tanstack/react-query';
import type { Equipment, Rental, MaintenanceSchedule, AvailabilitySlot } from '@/types/farmer/rental';

// Mock data
const mockEquipment: Equipment[] = [
  {
    id: 'eq1',
    name: 'Tracteur John Deere 6M',
    type: 'tractor',
    brand: 'John Deere',
    model: '6M Series',
    year: 2022,
    serialNumber: 'JD6M2022001',
    status: 'available',
    condition: 'excellent',
    images: ['/equipment/tractor.jpg'],
    specifications: {
      power: '140 HP',
      weight: '5,500 kg',
      dimensions: '4.5m x 2.3m x 2.9m',
    },
    pricing: {
      hourly: 15000,
      daily: 85000,
      weekly: 450000,
      monthly: 1500000,
    },
    location: {
      coordinates: [2.3522, 48.8566],
      address: 'Ferme Principale, Champ Nord',
      lastUpdated: new Date(),
    },
    usage: {
      totalHours: 1250,
      lastService: new Date('2024-01-10'),
      nextService: new Date('2024-02-10'),
      serviceInterval: 250,
    },
    insurance: {
      provider: 'AgroAssurance',
      policyNumber: 'AA-2024-001',
      coverage: 50000000,
      expiryDate: new Date('2024-12-31'),
    },
  },
  {
    id: 'eq2',
    name: 'Moissonneuse-batteuse Case IH',
    type: 'harvester',
    brand: 'Case IH',
    model: 'Axial-Flow 250',
    year: 2021,
    serialNumber: 'CIH250-2021-042',
    status: 'rented',
    condition: 'good',
    images: ['/equipment/harvester.jpg'],
    specifications: {
      power: '380 HP',
      capacity: '12,000 kg',
      weight: '15,000 kg',
    },
    pricing: {
      hourly: 35000,
      daily: 250000,
      weekly: 1500000,
      monthly: 5000000,
    },
    location: {
      coordinates: [2.3542, 48.8556],
      address: 'En location - Ferme Martin',
      lastUpdated: new Date(),
    },
    usage: {
      totalHours: 850,
      lastService: new Date('2024-01-05'),
      nextService: new Date('2024-03-05'),
      serviceInterval: 200,
    },
    currentRental: {
      rentalId: 'r1',
      renterId: 'c1',
      renterName: 'Ferme Martin',
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-01-27'),
      totalCost: 1500000,
    },
    insurance: {
      provider: 'AgroAssurance',
      policyNumber: 'AA-2024-002',
      coverage: 100000000,
      expiryDate: new Date('2024-12-31'),
    },
  },
];

const mockRentals: Rental[] = [
  {
    id: 'r1',
    rentalNumber: 'RNT-2024-001',
    equipmentId: 'eq2',
    equipmentName: 'Moissonneuse-batteuse Case IH',
    renter: {
      id: 'c1',
      name: 'Jean Martin',
      email: 'jean.martin@ferme.fr',
      phone: '+33 6 12 34 56 78',
      company: 'Ferme Martin',
    },
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-01-27'),
    status: 'active',
    pricing: {
      rateType: 'weekly',
      rate: 1500000,
      duration: 1,
      subtotal: 1500000,
      insurance: 50000,
      tax: 0,
      total: 1550000,
    },
    contract: {
      signed: true,
      signedDate: new Date('2024-01-19'),
      documentUrl: '/contracts/RNT-2024-001.pdf',
    },
    delivery: {
      required: true,
      address: 'Ferme Martin, Route de Campagne',
      cost: 25000,
    },
    tracking: {
      currentLocation: [2.3542, 48.8556],
      lastUpdate: new Date(),
      hoursUsed: 45,
      fuelLevel: 65,
    },
    incidents: [],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date(),
  },
];

const mockMaintenance: MaintenanceSchedule[] = [
  {
    id: 'm1',
    equipmentId: 'eq1',
    equipmentName: 'Tracteur John Deere 6M',
    type: 'routine',
    description: 'Vidange et révision complète',
    scheduledDate: new Date('2024-02-10'),
    status: 'scheduled',
    cost: 45000,
    technician: 'Service John Deere',
    nextDue: new Date('2024-05-10'),
  },
];

export function useRental() {
  const { data: equipment, isLoading: equipmentLoading } = useQuery({
    queryKey: ['farmer', 'rental', 'equipment'],
    queryFn: async () => mockEquipment,
    staleTime: 60000,
  });

  const { data: rentals, isLoading: rentalsLoading } = useQuery({
    queryKey: ['farmer', 'rental', 'rentals'],
    queryFn: async () => mockRentals,
    staleTime: 30000,
  });

  const { data: maintenance, isLoading: maintenanceLoading } = useQuery({
    queryKey: ['farmer', 'rental', 'maintenance'],
    queryFn: async () => mockMaintenance,
    staleTime: 60000,
  });

  return {
    equipment,
    rentals,
    maintenance,
    isLoading: equipmentLoading || rentalsLoading || maintenanceLoading,
  };
}
