/**
 * Farmer Dashboard Data Hook
 * Fetches and manages dashboard data with real-time updates
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { DashboardKPIs, RevenueData, AgriTask, WeatherData, WeatherAlert, AIRecommendation } from '@/types/farmer/dashboard';

// Mock data for development
const mockKPIs: DashboardKPIs = {
  totalRevenue: 245890,
  monthlyRevenue: 45890,
  revenueGrowth: 12.5,
  activeOrders: 23,
  pendingOrders: 8,
  completedOrders: 156,
  equipmentRented: 5,
  rentalRevenue: 12450,
  marketplaceRevenue: 28340,
  servicesRevenue: 5100,
  totalCrops: 12,
  activeCrops: 8,
  harvestReady: 3,
};

const mockRevenueData: RevenueData[] = [
  { date: '2024-01-01', marketplace: 15000, rental: 5000, services: 2000, total: 22000 },
  { date: '2024-01-08', marketplace: 18000, rental: 6000, services: 2500, total: 26500 },
  { date: '2024-01-15', marketplace: 22000, rental: 7500, services: 3000, total: 32500 },
  { date: '2024-01-22', marketplace: 28340, rental: 12450, services: 5100, total: 45890 },
];

const mockTasks: AgriTask[] = [
  {
    id: '1',
    title: 'Irrigation du champ nord',
    description: 'Vérifier et activer le système d\'irrigation',
    type: 'irrigation',
    priority: 'high',
    status: 'pending',
    dueDate: new Date('2024-01-23'),
    estimatedDuration: 2,
  },
  {
    id: '2',
    title: 'Récolte des tomates',
    description: 'Récolte prévue pour la serre 2',
    type: 'harvesting',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: new Date('2024-01-22'),
    estimatedDuration: 6,
  },
  {
    id: '3',
    title: 'Traitement bio des pommes',
    description: 'Application du traitement préventif',
    type: 'treatment',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date('2024-01-25'),
    estimatedDuration: 3,
  },
];

const mockWeather: WeatherData[] = [
  {
    date: new Date('2024-01-22'),
    temperature: { min: 8, max: 16, current: 12 },
    humidity: 65,
    precipitation: 0,
    precipitationProbability: 10,
    windSpeed: 15,
    windDirection: 'NO',
    condition: 'cloudy',
    uvIndex: 3,
  },
  {
    date: new Date('2024-01-23'),
    temperature: { min: 6, max: 14, current: 10 },
    humidity: 75,
    precipitation: 5,
    precipitationProbability: 60,
    windSpeed: 20,
    windDirection: 'O',
    condition: 'rainy',
    uvIndex: 2,
  },
];

const mockAlerts: WeatherAlert[] = [
  {
    id: '1',
    type: 'frost',
    severity: 'warning',
    title: 'Risque de gel',
    description: 'Températures négatives attendues dans la nuit du 24 au 25 janvier',
    startDate: new Date('2024-01-24T22:00:00'),
    endDate: new Date('2024-01-25T08:00:00'),
    affectedCrops: ['tomates', 'salades'],
    recommendations: [
      'Protéger les cultures sensibles avec des voiles',
      'Activer le système anti-gel si disponible',
      'Reporter les plantations prévues',
    ],
  },
];

const mockRecommendations: AIRecommendation[] = [
  {
    id: '1',
    type: 'market',
    priority: 'high',
    title: 'Opportunité de vente - Tomates',
    description: 'Les prix des tomates ont augmenté de 15% cette semaine. Moment idéal pour vendre votre stock.',
    action: 'Créer une offre flash',
    impact: {
      type: 'revenue',
      value: 2500,
      unit: 'XOF',
    },
    confidence: 87,
    validUntil: new Date('2024-01-25'),
  },
  {
    id: '2',
    type: 'crop',
    priority: 'medium',
    title: 'Rotation culturale recommandée',
    description: 'Le champ sud serait optimal pour des légumineuses après la récolte actuelle.',
    action: 'Planifier la rotation',
    impact: {
      type: 'efficiency',
      value: 20,
      unit: '%',
    },
    confidence: 92,
    validUntil: new Date('2024-02-01'),
  },
];

export function useDashboardData() {
  const queryClient = useQueryClient();

  // Fetch KPIs
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['farmer', 'dashboard', 'kpis'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/api/farmer/dashboard/kpis');
      // return response.data;
      return mockKPIs;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch revenue data
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['farmer', 'dashboard', 'revenue'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockRevenueData;
    },
    staleTime: 60000,
  });

  // Fetch tasks
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['farmer', 'dashboard', 'tasks'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockTasks;
    },
    staleTime: 30000,
  });

  // Fetch weather
  const { data: weather, isLoading: weatherLoading } = useQuery({
    queryKey: ['farmer', 'dashboard', 'weather'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockWeather;
    },
    staleTime: 300000, // 5 minutes
  });

  // Fetch weather alerts
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['farmer', 'dashboard', 'alerts'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockAlerts;
    },
    staleTime: 300000,
  });

  // Fetch AI recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['farmer', 'dashboard', 'recommendations'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockRecommendations;
    },
    staleTime: 600000, // 10 minutes
  });

  // Set up real-time updates (WebSocket)
  useEffect(() => {
    // TODO: Implement WebSocket connection
    // const ws = new WebSocket('ws://localhost:8000/farmer/dashboard');
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   queryClient.setQueryData(['farmer', 'dashboard', 'kpis'], data);
    // };
    // return () => ws.close();
  }, [queryClient]);

  return {
    kpis,
    revenueData,
    tasks,
    weather,
    alerts,
    recommendations,
    isLoading: kpisLoading || revenueLoading || tasksLoading || weatherLoading || alertsLoading || recommendationsLoading,
  };
}
