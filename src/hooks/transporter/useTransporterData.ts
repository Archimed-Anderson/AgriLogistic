/**
 * Transporter Dashboard Data Hook
 * Fetches and manages dashboard data with real-time updates
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type {
  TransporterKPIs,
  RevenueBreakdown,
  Shipment,
  OpportunityAlert,
  TrafficAlert,
} from '@/types/transporter';

// Mock data for development
const mockKPIs: TransporterKPIs = {
  dailyRevenue: 45890,
  weeklyRevenue: 245890,
  monthlyRevenue: 892340,
  revenueGrowth: 15.3,

  activeDeliveries: 8,
  completedToday: 12,
  completedWeek: 67,
  completedMonth: 289,

  kmToday: 245,
  kmWeek: 1567,
  kmMonth: 6789,
  fuelEfficiency: 12.5,

  onTimeRate: 94.5,
  customerSatisfaction: 4.7,
  averageRating: 4.7,
  totalRatings: 234,
};

const mockRevenueData: RevenueBreakdown[] = [
  {
    date: '2024-01-15',
    marketplace: 12000,
    rental: 5000,
    services: 2000,
    bonuses: 1000,
    total: 20000,
  },
  {
    date: '2024-01-16',
    marketplace: 15000,
    rental: 6000,
    services: 2500,
    bonuses: 1500,
    total: 25000,
  },
  {
    date: '2024-01-17',
    marketplace: 18000,
    rental: 7000,
    services: 3000,
    bonuses: 2000,
    total: 30000,
  },
  {
    date: '2024-01-18',
    marketplace: 22000,
    rental: 8000,
    services: 3500,
    bonuses: 2500,
    total: 36000,
  },
  {
    date: '2024-01-19',
    marketplace: 25000,
    rental: 9000,
    services: 4000,
    bonuses: 3000,
    total: 41000,
  },
  {
    date: '2024-01-20',
    marketplace: 28000,
    rental: 10000,
    services: 4500,
    bonuses: 3500,
    total: 46000,
  },
  {
    date: '2024-01-21',
    marketplace: 32000,
    rental: 11000,
    services: 5000,
    bonuses: 4000,
    total: 52000,
  },
];

const mockActiveShipments: Shipment[] = [
  {
    id: '1',
    orderId: 'ORD-2024-001',
    status: 'in_transit',
    pickupAddress: '123 Rue des Agriculteurs, Dakar',
    pickupCoordinates: [-17.4467, 14.6928],
    pickupContact: {
      name: 'Mamadou Diallo',
      phone: '+221 77 123 4567',
      company: 'Ferme Bio Dakar',
    },
    deliveryAddress: '456 Avenue du Commerce, Thiès',
    deliveryCoordinates: [-16.9252, 14.7886],
    deliveryContact: {
      name: 'Fatou Sall',
      phone: '+221 77 234 5678',
      company: 'Marché Central Thiès',
    },
    cargo: {
      description: 'Tomates fraîches',
      weight: 500,
      volume: 2.5,
      quantity: 100,
      unit: 'caisses',
      requiresRefrigeration: true,
      temperatureRange: { min: 2, max: 8 },
      fragile: true,
      hazardous: false,
    },
    documents: [],
    price: 25000,
    currency: 'XOF',
    paymentStatus: 'pending',
    createdAt: new Date('2024-01-22T08:00:00'),
    updatedAt: new Date('2024-01-22T10:30:00'),
  },
  {
    id: '2',
    orderId: 'ORD-2024-002',
    status: 'in_transit',
    pickupAddress: '789 Route de Kaolack, Kaolack',
    pickupCoordinates: [-16.0725, 14.1522],
    pickupContact: {
      name: 'Ibrahima Ndiaye',
      phone: '+221 77 345 6789',
      company: 'Coopérative Agricole',
    },
    deliveryAddress: '321 Boulevard du Port, Dakar',
    deliveryCoordinates: [-17.4467, 14.6928],
    deliveryContact: {
      name: 'Aminata Touré',
      phone: '+221 77 456 7890',
      company: 'Export Agro',
    },
    cargo: {
      description: 'Arachides',
      weight: 1000,
      volume: 5,
      quantity: 50,
      unit: 'sacs',
      requiresRefrigeration: false,
      fragile: false,
      hazardous: false,
    },
    documents: [],
    price: 45000,
    currency: 'XOF',
    paymentStatus: 'pending',
    createdAt: new Date('2024-01-22T09:00:00'),
    updatedAt: new Date('2024-01-22T11:00:00'),
  },
];

const mockOpportunityAlerts: OpportunityAlert[] = [
  {
    id: '1',
    type: 'nearby_load',
    title: 'Chargement à proximité',
    message: 'Nouveau chargement disponible à 5 km de votre position actuelle',
    priority: 'high',
    actionUrl: '/transporter/marketplace',
    actionLabel: "Voir l'offre",
    expiresAt: new Date(Date.now() + 3600000),
    createdAt: new Date(),
    read: false,
  },
  {
    id: '2',
    type: 'optimal_route',
    title: 'Route optimale disponible',
    message: 'Économisez 45 km en regroupant 3 livraisons sur le même trajet',
    priority: 'medium',
    actionUrl: '/transporter/routes',
    actionLabel: 'Optimiser',
    createdAt: new Date(),
    read: false,
  },
  {
    id: '3',
    type: 'price_surge',
    title: 'Prix en hausse',
    message: "Les prix pour Dakar-Thiès ont augmenté de 20% aujourd'hui",
    priority: 'high',
    actionUrl: '/transporter/marketplace',
    actionLabel: 'Voir les offres',
    createdAt: new Date(),
    read: false,
  },
];

const mockTrafficAlerts: TrafficAlert[] = [
  {
    id: '1',
    type: 'congestion',
    severity: 'medium',
    location: 'Autoroute à Péage Dakar-Thiès',
    coordinates: [-17.1, 14.7],
    description: 'Trafic dense, ralentissements sur 5 km',
    affectedRoutes: ['Dakar-Thiès', 'Dakar-Mbour'],
    estimatedDelay: 15,
    startTime: new Date(),
  },
  {
    id: '2',
    type: 'weather',
    severity: 'low',
    location: 'Route de Kaolack',
    coordinates: [-16.0, 14.1],
    description: 'Pluie légère, visibilité réduite',
    affectedRoutes: ['Kaolack-Dakar'],
    estimatedDelay: 5,
    startTime: new Date(),
    endTime: new Date(Date.now() + 7200000),
  },
];

export function useTransporterData() {
  const queryClient = useQueryClient();

  // Fetch KPIs
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['transporter', 'dashboard', 'kpis'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/api/transporter/dashboard/kpis');
      // return response.data;
      return mockKPIs;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch revenue data
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['transporter', 'dashboard', 'revenue'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockRevenueData;
    },
    staleTime: 60000,
  });

  // Fetch active shipments
  const { data: activeShipments, isLoading: shipmentsLoading } = useQuery({
    queryKey: ['transporter', 'dashboard', 'active-shipments'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockActiveShipments;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });

  // Fetch opportunity alerts
  const { data: opportunityAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['transporter', 'dashboard', 'opportunity-alerts'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockOpportunityAlerts;
    },
    staleTime: 60000,
    refetchInterval: 120000,
  });

  // Fetch traffic alerts
  const { data: trafficAlerts, isLoading: trafficLoading } = useQuery({
    queryKey: ['transporter', 'dashboard', 'traffic-alerts'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockTrafficAlerts;
    },
    staleTime: 300000, // 5 minutes
    refetchInterval: 300000,
  });

  // Set up real-time updates (WebSocket)
  useEffect(() => {
    // TODO: Implement WebSocket connection
    // const ws = new WebSocket('ws://localhost:8000/transporter/dashboard');
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   queryClient.setQueryData(['transporter', 'dashboard', 'kpis'], data);
    // };
    // return () => ws.close();
  }, [queryClient]);

  return {
    kpis,
    revenueData,
    activeShipments,
    opportunityAlerts,
    trafficAlerts,
    isLoading: kpisLoading || revenueLoading || shipmentsLoading || alertsLoading || trafficLoading,
  };
}
