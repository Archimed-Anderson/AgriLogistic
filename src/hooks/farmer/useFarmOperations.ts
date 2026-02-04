/**
 * Farm Operations Data Hook
 */
import { useQuery } from '@tanstack/react-query';
import type {
  FarmField,
  IoTSensor,
  CropRotationPlan,
  InventoryItem,
  BudgetEntry,
  CropProfitability,
} from '@/types/farmer/operations';

// Mock data
const mockFields: FarmField[] = [
  {
    id: '1',
    name: 'Champ Nord',
    area: 5.2,
    coordinates: [
      [2.3522, 48.8566],
      [2.3532, 48.8566],
      [2.3532, 48.8576],
      [2.3522, 48.8576],
    ],
    soilType: 'Argileux',
    currentCrop: {
      id: 'c1',
      name: 'Tomates',
      plantedDate: new Date('2024-01-10'),
      expectedHarvest: new Date('2024-03-15'),
      status: 'growing',
    },
    irrigationSystem: 'drip',
    sensors: [
      {
        id: 's1',
        type: 'soil_moisture',
        location: { fieldId: '1', coordinates: [2.3527, 48.8571] },
        status: 'active',
        lastReading: {
          value: 65,
          unit: '%',
          timestamp: new Date(),
          status: 'normal',
        },
        batteryLevel: 85,
        threshold: { min: 40, max: 80 },
      },
    ],
  },
  {
    id: '2',
    name: 'Champ Sud',
    area: 3.8,
    coordinates: [
      [2.3542, 48.8556],
      [2.3552, 48.8556],
      [2.3552, 48.8566],
      [2.3542, 48.8566],
    ],
    soilType: 'Limoneux',
    irrigationSystem: 'sprinkler',
    sensors: [],
  },
];

const mockSensors: IoTSensor[] = [
  {
    id: 's1',
    type: 'soil_moisture',
    location: { fieldId: '1', coordinates: [2.3527, 48.8571] },
    status: 'active',
    lastReading: {
      value: 65,
      unit: '%',
      timestamp: new Date(),
      status: 'normal',
    },
    batteryLevel: 85,
    threshold: { min: 40, max: 80 },
  },
  {
    id: 's2',
    type: 'temperature',
    location: { fieldId: '1', coordinates: [2.3527, 48.8571] },
    status: 'active',
    lastReading: {
      value: 22,
      unit: '°C',
      timestamp: new Date(),
      status: 'normal',
    },
    batteryLevel: 90,
  },
  {
    id: 's3',
    type: 'ph',
    location: { fieldId: '1', coordinates: [2.3527, 48.8571] },
    status: 'active',
    lastReading: {
      value: 6.8,
      unit: 'pH',
      timestamp: new Date(),
      status: 'warning',
    },
    batteryLevel: 45,
    threshold: { min: 6.0, max: 7.5 },
  },
];

const mockRotationPlans: CropRotationPlan[] = [
  {
    id: 'r1',
    fieldId: '2',
    fieldName: 'Champ Sud',
    currentCrop: 'Jachère',
    rotationSequence: [
      {
        season: 'Printemps 2024',
        crop: 'Légumineuses (Pois)',
        benefits: ['Fixation azote', 'Amélioration structure sol'],
        estimatedYield: 2500,
      },
      {
        season: 'Été 2024',
        crop: 'Céréales (Blé)',
        benefits: ['Utilisation azote fixé', 'Bon rendement'],
        estimatedYield: 4500,
      },
      {
        season: 'Automne 2024',
        crop: 'Légumes racines (Carottes)',
        benefits: ['Aération du sol', 'Diversification'],
        estimatedYield: 3200,
      },
    ],
    aiScore: 92,
    soilHealthImpact: 'positive',
    recommendations: [
      'Commencer par les légumineuses pour enrichir le sol',
      'Prévoir un apport de compost avant le blé',
      'Surveiller le pH pour les carottes',
    ],
  },
];

const mockInventory: InventoryItem[] = [
  {
    id: 'i1',
    name: 'Semences Tomates Bio',
    category: 'seeds',
    quantity: 15,
    unit: 'kg',
    minStock: 10,
    maxStock: 50,
    cost: 45000,
    supplier: 'AgroSemences SA',
    lastRestocked: new Date('2024-01-05'),
    location: 'Entrepôt A',
  },
  {
    id: 'i2',
    name: 'Engrais Organique NPK',
    category: 'fertilizer',
    quantity: 250,
    unit: 'kg',
    minStock: 200,
    maxStock: 1000,
    cost: 125000,
    supplier: 'BioFertil',
    lastRestocked: new Date('2024-01-12'),
    expiryDate: new Date('2025-01-12'),
    location: 'Entrepôt B',
  },
];

const mockBudget: BudgetEntry[] = [
  {
    id: 'b1',
    date: new Date('2024-01-10'),
    category: 'seeds',
    description: 'Achat semences tomates',
    type: 'expense',
    amount: 45000,
    status: 'actual',
    fieldId: '1',
  },
  {
    id: 'b2',
    date: new Date('2024-01-15'),
    category: 'fertilizer',
    description: 'Engrais organique',
    type: 'expense',
    amount: 125000,
    status: 'actual',
  },
];

const mockProfitability: CropProfitability[] = [
  {
    cropId: 'c1',
    cropName: 'Tomates',
    area: 5.2,
    totalRevenue: 850000,
    totalCosts: 320000,
    profit: 530000,
    profitMargin: 62.4,
    roi: 165.6,
    yieldPerHectare: 32500,
    costBreakdown: [
      { category: 'Semences', amount: 45000, percentage: 14 },
      { category: 'Engrais', amount: 125000, percentage: 39 },
      { category: "Main d'œuvre", amount: 95000, percentage: 30 },
      { category: 'Irrigation', amount: 35000, percentage: 11 },
      { category: 'Autres', amount: 20000, percentage: 6 },
    ],
  },
];

export function useFarmOperations() {
  const { data: fields, isLoading: fieldsLoading } = useQuery({
    queryKey: ['farmer', 'operations', 'fields'],
    queryFn: async () => mockFields,
    staleTime: 60000,
  });

  const { data: sensors, isLoading: sensorsLoading } = useQuery({
    queryKey: ['farmer', 'operations', 'sensors'],
    queryFn: async () => mockSensors,
    staleTime: 10000,
    refetchInterval: 30000,
  });

  const { data: rotationPlans, isLoading: rotationLoading } = useQuery({
    queryKey: ['farmer', 'operations', 'rotation'],
    queryFn: async () => mockRotationPlans,
    staleTime: 300000,
  });

  const { data: inventory, isLoading: inventoryLoading } = useQuery({
    queryKey: ['farmer', 'operations', 'inventory'],
    queryFn: async () => mockInventory,
    staleTime: 60000,
  });

  const { data: budget, isLoading: budgetLoading } = useQuery({
    queryKey: ['farmer', 'operations', 'budget'],
    queryFn: async () => mockBudget,
    staleTime: 60000,
  });

  const { data: profitability, isLoading: profitabilityLoading } = useQuery({
    queryKey: ['farmer', 'operations', 'profitability'],
    queryFn: async () => mockProfitability,
    staleTime: 300000,
  });

  return {
    fields,
    sensors,
    rotationPlans,
    inventory,
    budget,
    profitability,
    isLoading:
      fieldsLoading ||
      sensorsLoading ||
      rotationLoading ||
      inventoryLoading ||
      budgetLoading ||
      profitabilityLoading,
  };
}
