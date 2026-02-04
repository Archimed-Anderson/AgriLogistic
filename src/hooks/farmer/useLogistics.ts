/**
 * Logistics Data Hook
 */
import { useQuery } from '@tanstack/react-query';
import type { Delivery, Route, Carrier, TransportCost } from '@/types/farmer/logistics';

// Mock data
const mockDeliveries: Delivery[] = [
  {
    id: 'd1',
    deliveryNumber: 'DEL-2024-001',
    orderId: 'o1',
    status: 'in_transit',
    priority: 'high',
    items: [
      {
        productId: 'p1',
        productName: 'Tomates Bio',
        quantity: 50,
        weight: 50,
        fragile: true,
        temperature: 'ambient',
      },
    ],
    pickup: {
      address: 'Ferme Principale, Champ Nord',
      coordinates: [2.3522, 48.8566],
      contactName: 'Jean Agriculteur',
      contactPhone: '+33 6 12 34 56 78',
      scheduledTime: new Date('2024-01-22T08:00:00'),
      actualTime: new Date('2024-01-22T08:15:00'),
    },
    dropoff: {
      address: '123 Rue de la Paix, Paris',
      coordinates: [2.3312, 48.8698],
      contactName: 'Marie Dupont',
      contactPhone: '+33 6 98 76 54 32',
      scheduledTime: new Date('2024-01-22T10:00:00'),
    },
    carrier: {
      id: 'c1',
      name: 'Transport Express',
      phone: '+33 6 11 22 33 44',
      vehicleType: 'Van',
      licensePlate: 'AB-123-CD',
    },
    route: {
      distance: 15.5,
      duration: 45,
      optimized: true,
      waypoints: [
        [2.3522, 48.8566],
        [2.3312, 48.8698],
      ],
    },
    tracking: {
      currentLocation: [2.34, 48.862],
      lastUpdate: new Date(),
      eta: new Date('2024-01-22T09:55:00'),
      progress: 65,
    },
    cost: {
      baseRate: 5000,
      distanceCharge: 3100,
      fuelSurcharge: 500,
      total: 8600,
    },
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date(),
  },
  {
    id: 'd2',
    deliveryNumber: 'DEL-2024-002',
    orderId: 'o2',
    status: 'pending',
    priority: 'normal',
    items: [
      {
        productId: 'p2',
        productName: 'Salades Fraîches',
        quantity: 30,
        weight: 15,
        fragile: true,
        temperature: 'refrigerated',
      },
    ],
    pickup: {
      address: 'Ferme Principale, Champ Sud',
      coordinates: [2.3542, 48.8556],
      contactName: 'Jean Agriculteur',
      contactPhone: '+33 6 12 34 56 78',
      scheduledTime: new Date('2024-01-22T14:00:00'),
    },
    dropoff: {
      address: '45 Avenue des Champs, Lyon',
      coordinates: [4.8357, 45.764],
      contactName: 'Pierre Martin',
      contactPhone: '+33 6 55 44 33 22',
      scheduledTime: new Date('2024-01-22T18:00:00'),
    },
    tracking: {
      progress: 0,
    },
    cost: {
      baseRate: 5000,
      distanceCharge: 95000,
      fuelSurcharge: 5000,
      total: 105000,
    },
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date(),
  },
];

const mockRoutes: Route[] = [
  {
    id: 'r1',
    name: 'Route Paris - Matin',
    deliveries: ['d1'],
    status: 'active',
    optimization: {
      algorithm: 'nearest_neighbor',
      score: 85,
      totalDistance: 15.5,
      totalDuration: 45,
      savings: {
        distance: 3.2,
        time: 15,
        cost: 1500,
      },
    },
    waypoints: [
      {
        deliveryId: 'd1',
        sequence: 1,
        coordinates: [2.3522, 48.8566],
        address: 'Ferme Principale',
        type: 'pickup',
        scheduledTime: new Date('2024-01-22T08:00:00'),
        actualTime: new Date('2024-01-22T08:15:00'),
        status: 'completed',
      },
      {
        deliveryId: 'd1',
        sequence: 2,
        coordinates: [2.3312, 48.8698],
        address: '123 Rue de la Paix',
        type: 'dropoff',
        scheduledTime: new Date('2024-01-22T10:00:00'),
        status: 'pending',
      },
    ],
    createdAt: new Date('2024-01-22T07:00:00'),
    startedAt: new Date('2024-01-22T08:00:00'),
  },
];

const mockCarriers: Carrier[] = [
  {
    id: 'c1',
    name: 'Transport Express',
    type: 'company',
    contact: {
      phone: '+33 6 11 22 33 44',
      email: 'contact@transport-express.fr',
    },
    vehicles: [
      {
        id: 'v1',
        type: 'van',
        licensePlate: 'AB-123-CD',
        capacity: {
          weight: 1000,
          volume: 10,
        },
        features: ['GPS', 'refrigeration'],
        status: 'active',
      },
    ],
    rating: {
      average: 4.7,
      count: 156,
    },
    stats: {
      totalDeliveries: 1250,
      onTimeRate: 94,
      successRate: 98,
    },
    availability: {
      available: true,
      currentDeliveries: 3,
      maxCapacity: 10,
    },
    pricing: {
      baseRate: 5000,
      perKmRate: 200,
      perHourRate: 3000,
    },
  },
];

export function useLogistics() {
  const { data: deliveries, isLoading: deliveriesLoading } = useQuery({
    queryKey: ['farmer', 'logistics', 'deliveries'],
    queryFn: async () => mockDeliveries,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const { data: routes, isLoading: routesLoading } = useQuery({
    queryKey: ['farmer', 'logistics', 'routes'],
    queryFn: async () => mockRoutes,
    staleTime: 60000,
  });

  const { data: carriers, isLoading: carriersLoading } = useQuery({
    queryKey: ['farmer', 'logistics', 'carriers'],
    queryFn: async () => mockCarriers,
    staleTime: 300000,
  });

  return {
    deliveries,
    routes,
    carriers,
    isLoading: deliveriesLoading || routesLoading || carriersLoading,
  };
}
