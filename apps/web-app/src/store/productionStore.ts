import { create } from 'zustand';

export type GrowthStage = 'Semis' | 'Croissance' | 'Floraison' | 'Maturité' | 'Récolte';
export type QualityScore = 'A' | 'B' | 'C';

export interface IotReading {
  timestamp: string;
  temp: number;
  humidity: number;
  light: number;
}

export interface ProductionAlert {
  id: string;
  type: 'irrigation' | 'pest' | 'fertilizer' | 'harvest';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
}

export interface ActiveProduction {
  id: string;
  parcelId: string;
  parcelName: string;
  farmerName: string;
  cropType: string;
  region: string;
  estimatedTonnage?: number;
  stage: GrowthStage;
  startDate: string;
  expectedHarvestDate: string;
  healthScore: number; // 0-100
  moistureLevel: number; // %
  qualityPrediction: QualityScore;
  certifications: string[];
  certificationStatus?: Record<string, 'pending' | 'validated'>;
  alerts: ProductionAlert[];
  telemetry: IotReading[];
  location: { lat: number; lng: number };
  timelinePhotos?: { date: string; url: string; source: 'drone' | 'satellite' }[];
}

interface ProductionStore {
  productions: ActiveProduction[];
  selectedProduction: ActiveProduction | null;
  filter: {
    crop: string | 'all';
    stage: GrowthStage | 'all';
    region: string | 'all';
    calendar: 'all' | 'week' | 'month';
  };

  selectProduction: (prod: ActiveProduction | null) => void;
  setFilter: (filter: Partial<ProductionStore['filter']>) => void;
  updateStage: (id: string, stage: GrowthStage) => void;
}

export const useProductionStore = create<ProductionStore>((set) => ({
  productions: [
    {
      id: 'PROD-7721',
      parcelId: 'PARCEL-001',
      parcelName: 'Champ Nord Yamoussoukro',
      farmerName: 'Koffi Amani',
      cropType: 'Maïs',
      region: 'Yamoussoukro',
      estimatedTonnage: 15,
      stage: 'Maturité',
      startDate: '2024-01-10T08:00:00Z',
      expectedHarvestDate: '2024-04-15T00:00:00Z',
      healthScore: 88,
      moistureLevel: 42,
      qualityPrediction: 'A',
      certifications: ['Bio', 'GlobalGAP'],
      certificationStatus: { Bio: 'validated', GlobalGAP: 'validated' },
      location: { lat: 6.82, lng: -5.25 },
      timelinePhotos: [
        { date: '2024-01-15', url: '/images/placeholder-drone.jpg', source: 'drone' },
        { date: '2024-02-20', url: '/images/placeholder-satellite.jpg', source: 'satellite' },
        { date: '2024-03-10', url: '/images/placeholder-drone.jpg', source: 'drone' },
      ],
      alerts: [
        {
          id: 'al-1',
          type: 'harvest',
          severity: 'medium',
          message: 'Récolte optimale prévue dans 5 jours.',
          timestamp: '2024-03-21T10:00:00Z',
        },
      ],
      telemetry: Array.from({ length: 7 }, (_, i) => ({
        timestamp: `2024-03-${15 + i}T12:00:00Z`,
        temp: 28 + Math.random() * 5,
        humidity: 60 + Math.random() * 10,
        light: 800 + Math.random() * 200,
      })),
    },
    {
      id: 'PROD-8842',
      parcelId: 'PARCEL-002',
      parcelName: 'Vignoble de Bouaké',
      farmerName: 'Marie Konan',
      cropType: 'Café',
      region: 'Bouaké',
      estimatedTonnage: 3,
      stage: 'Floraison',
      startDate: '2023-11-20T08:00:00Z',
      expectedHarvestDate: '2024-06-20T00:00:00Z',
      healthScore: 62,
      moistureLevel: 15,
      qualityPrediction: 'B',
      certifications: ['Équitable'],
      certificationStatus: { Équitable: 'validated' },
      location: { lat: 6.85, lng: -5.3 },
      timelinePhotos: [
        { date: '2024-01-10', url: '/images/placeholder-satellite.jpg', source: 'satellite' },
      ],
      alerts: [
        {
          id: 'al-2',
          type: 'irrigation',
          severity: 'high',
          message: 'Stress hydrique critique détecté.',
          timestamp: '2024-03-21T09:30:00Z',
        },
      ],
      telemetry: Array.from({ length: 7 }, (_, i) => ({
        timestamp: `2024-03-${15 + i}T12:00:00Z`,
        temp: 32 + Math.random() * 4,
        humidity: 20 + Math.random() * 5,
        light: 950 + Math.random() * 100,
      })),
    },
    {
      id: 'PROD-9912',
      parcelId: 'PARCEL-003',
      parcelName: 'Plantation Cacao Abengourou',
      farmerName: 'Jean Kouassi',
      cropType: 'Cacao',
      region: 'Abengourou',
      estimatedTonnage: 8,
      stage: 'Récolte',
      startDate: '2023-09-01T08:00:00Z',
      expectedHarvestDate: '2024-04-01T00:00:00Z',
      healthScore: 95,
      moistureLevel: 55,
      qualityPrediction: 'A',
      certifications: ['Bio', 'Équitable'],
      certificationStatus: { Bio: 'validated', Équitable: 'pending' },
      location: { lat: 6.79, lng: -3.5 },
      alerts: [
        {
          id: 'al-3',
          type: 'fertilizer',
          severity: 'low',
          message: 'Fertiliser dans 3 jours pour maintenir le rendement.',
          timestamp: '2024-03-22T08:00:00Z',
        },
      ],
      telemetry: Array.from({ length: 7 }, (_, i) => ({
        timestamp: `2024-03-${15 + i}T12:00:00Z`,
        temp: 26 + Math.random() * 3,
        humidity: 70 + Math.random() * 8,
        light: 600 + Math.random() * 150,
      })),
    },
  ],
  selectedProduction: null,
  filter: {
    crop: 'all',
    stage: 'all',
    region: 'all',
    calendar: 'all',
  },

  selectProduction: (prod) => set({ selectedProduction: prod }),
  setFilter: (newFilter) => set((state) => ({ filter: { ...state.filter, ...newFilter } })),
  updateStage: (id, stage) =>
    set((state) => ({
      productions: state.productions.map((p) => (p.id === id ? { ...p, stage } : p)),
    })),
}));
