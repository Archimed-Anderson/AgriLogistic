import { create } from 'zustand';

export type VehicleStatus = 'active' | 'available' | 'maintenance' | 'offline' | 'warning';
export type VehicleType = 'Benne' | 'Frigo' | 'Plateau' | 'Citerne';

export interface Vehicle {
  id: string;
  plate: string;
  type: VehicleType;
  image: string;
  status: VehicleStatus;
  driver: {
    name: string;
    phone: string;
    avatar: string;
  };
  capacity: {
    weight: number; // Tonnes
    volume: number; // m3
    currentLoad: number; // %
  };
  location: {
    lat: number;
    lng: number;
    address: string;
    lastSeen: string;
    destination?: string;
  };
  sensors: {
    battery: number;
    tempCargo?: number;
    fuel: number;
    speed: number;
  };
  maintenance: {
    lastService: string;
    nextService: string;
    healthScore: number;
  };
}

export interface FleetState {
  vehicles: Vehicle[];
  filterStatus: string;
  searchQuery: string;
  selectedVehicleId: string | null;
  
  // Stats
  stats: {
    total: number;
    active: number;
    available: number;
    maintenance: number;
    offline: number;
    avgFillRate: number;
    totalKmToday: number;
  };

  // Actions
  setSelectedVehicle: (id: string | null) => void;
  setFilterStatus: (status: string) => void;
  setSearchQuery: (query: string) => void;
  updateVehiclePosition: (id: string, lat: number, lng: number) => void;
}

export const useFleetStore = create<FleetState>((set) => ({
  vehicles: [
    {
      id: 'V-001',
      plate: 'CI-1234-AB',
      type: 'Frigo',
      image: 'https://images.unsplash.com/photo-1519003722824-192d99764654?auto=format&fit=crop&q=80&w=200',
      status: 'active',
      driver: { name: 'Moussa Traoré', phone: '+225 07 45 12 89 00', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Moussa' },
      capacity: { weight: 12, volume: 45, currentLoad: 85 },
      location: { lat: 5.36, lng: -4.00, address: 'Abidjan, Port de Pêche', lastSeen: new Date().toISOString(), destination: 'Yamoussoukro' },
      sensors: { battery: 92, tempCargo: -18, fuel: 65, speed: 72 },
      maintenance: { lastService: '2024-01-15', nextService: '2024-04-15', healthScore: 94 },
    },
    {
      id: 'V-002',
      plate: 'CI-5678-CD',
      type: 'Benne',
      image: 'https://images.unsplash.com/photo-1586191121278-220750c5245d?auto=format&fit=crop&q=80&w=200',
      status: 'available',
      driver: { name: 'Kouassi Jean', phone: '+225 01 02 03 04 05', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean' },
      capacity: { weight: 20, volume: 35, currentLoad: 0 },
      location: { lat: 6.82, lng: -5.27, address: 'Yamoussoukro Centre', lastSeen: new Date().toISOString() },
      sensors: { battery: 88, fuel: 42, speed: 0 },
      maintenance: { lastService: '2023-12-10', nextService: '2024-03-10', healthScore: 82 },
    },
    {
      id: 'V-003',
      plate: 'CI-9012-EF',
      type: 'Plateau',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=200',
      status: 'maintenance',
      driver: { name: 'Ali Bakayoko', phone: '+225 05 55 66 77 88', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali' },
      capacity: { weight: 30, volume: 60, currentLoad: 0 },
      location: { lat: 5.34, lng: -4.01, address: 'Garage Central Abidjan', lastSeen: '2024-02-01T08:00:00Z' },
      sensors: { battery: 12, fuel: 5, speed: 0 },
      maintenance: { lastService: '2024-02-01', nextService: '2024-02-05', healthScore: 45 },
    },
    {
      id: 'V-004',
      plate: 'CI-3456-GH',
      type: 'Frigo',
      image: 'https://images.unsplash.com/photo-1519003722824-192d99764654?auto=format&fit=crop&q=80&w=200',
      status: 'warning',
      driver: { name: 'Koffi Paul', phone: '+225 07 11 22 33 44', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paul' },
      capacity: { weight: 15, volume: 50, currentLoad: 40 },
      location: { lat: 7.69, lng: -5.03, address: 'Bouaké Nord', lastSeen: new Date().toISOString(), destination: 'Korhogo' },
      sensors: { battery: 95, tempCargo: 8, fuel: 15, speed: 85 }, // Low fuel and high temp
      maintenance: { lastService: '2024-01-20', nextService: '2024-04-20', healthScore: 78 },
    }
  ],
  filterStatus: 'all',
  searchQuery: '',
  selectedVehicleId: null,
  stats: {
    total: 47,
    active: 32,
    available: 12,
    maintenance: 3,
    offline: 0,
    avgFillRate: 87,
    totalKmToday: 2847,
  },

  setSelectedVehicle: (id) => set({ selectedVehicleId: id }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  updateVehiclePosition: (id, lat, lng) => set((state) => ({
    vehicles: state.vehicles.map(v => v.id === id ? { ...v, location: { ...v.location, lat, lng, lastSeen: new Date().toISOString() } } : v)
  })),
}));
