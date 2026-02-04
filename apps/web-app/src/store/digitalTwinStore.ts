import { create } from 'zustand';

export type MapLayer = 'satellite' | 'ndvi' | 'yield' | 'diseases' | 'weather';
export type TimePeriod = '2023' | '2024';

export interface Parcel {
  id: string;
  owner: string;
  cropType: string;
  area: string; // e.g., "12.5 ha"
  coordinates: [number, number][]; // Polygon
  ndvi: number; // 0 to 1
  predictedYield: number; // tons/ha
  status: 'healthy' | 'stressed' | 'diseased';
  healthScore: number; // 0-100
  lastUpdated: string;
}

export interface RegionStats {
  id: string;
  name: string;
  totalArea: string;
  averageYield: number;
  farmerCount: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface DiseaseZone {
  id: string;
  center: [number, number];
  radius: number;
  severity: 'low' | 'medium' | 'high';
  disease: string;
}

interface DigitalTwinStore {
  activeLayers: MapLayer[];
  selectedParcel: Parcel | null;
  timePeriod: TimePeriod;
  compareMode: boolean;
  parcels: Parcel[];
  regionStats: RegionStats[];
  diseaseZones: DiseaseZone[];

  toggleLayer: (layer: MapLayer) => void;
  selectParcel: (parcel: Parcel | null) => void;
  setTimePeriod: (period: TimePeriod) => void;
  setCompareMode: (enabled: boolean) => void;

  // Mock data initialization logic
}

export const useDigitalTwinStore = create<DigitalTwinStore>((set) => ({
  activeLayers: ['satellite', 'ndvi'],
  selectedParcel: null,
  timePeriod: '2024',
  compareMode: false,
  parcels: [
    {
      id: 'PARCEL-001',
      owner: 'Koffi Amani',
      cropType: 'Cocoa',
      area: '5.2 ha',
      coordinates: [
        [6.82, -5.25],
        [6.83, -5.25],
        [6.83, -5.26],
        [6.82, -5.26],
      ],
      ndvi: 0.78,
      predictedYield: 1.2,
      status: 'healthy',
      healthScore: 92,
      lastUpdated: '2024-03-20T12:00:00Z',
    },
    {
      id: 'PARCEL-002',
      owner: 'Marie Konan',
      cropType: 'Coffee',
      area: '12.8 ha',
      coordinates: [
        [6.85, -5.3],
        [6.86, -5.3],
        [6.86, -5.31],
        [6.85, -5.31],
      ],
      ndvi: 0.42,
      predictedYield: 0.8,
      status: 'stressed',
      healthScore: 45,
      lastUpdated: '2024-03-21T08:00:00Z',
    },
    {
      id: 'PARCEL-003',
      owner: 'Coopérative Abengourou',
      cropType: 'Cocoa',
      area: '8.4 ha',
      coordinates: [
        [6.79, -5.2],
        [6.80, -5.2],
        [6.80, -5.21],
        [6.79, -5.21],
      ],
      ndvi: 0.28,
      predictedYield: 0.4,
      status: 'diseased',
      healthScore: 22,
      lastUpdated: '2024-03-22T09:00:00Z',
    },
  ],
  diseaseZones: [
    { id: 'DZ-01', center: [6.795, -5.205] as [number, number], radius: 800, severity: 'high', disease: 'Black Pod' },
    { id: 'DZ-02', center: [6.84, -5.28] as [number, number], radius: 400, severity: 'medium', disease: 'Swollen Shoot' },
  ],
  regionStats: [
    {
      id: 'REG-01',
      name: 'Yamoussoukro Dept.',
      totalArea: '145,000 ha',
      averageYield: 1.1,
      farmerCount: 12400,
      riskLevel: 'low',
    },
    {
      id: 'REG-02',
      name: 'Bouaké East',
      totalArea: '88,000 ha',
      averageYield: 0.7,
      farmerCount: 8900,
      riskLevel: 'high',
    },
  ],

  toggleLayer: (layer) =>
    set((state) => ({
      activeLayers: state.activeLayers.includes(layer)
        ? state.activeLayers.filter((l) => l !== layer)
        : [...state.activeLayers, layer],
    })),

  selectParcel: (parcel) => set({ selectedParcel: parcel }),
  setTimePeriod: (period) => set({ timePeriod: period }),
  setCompareMode: (enabled) => set({ compareMode: enabled }),
}));
