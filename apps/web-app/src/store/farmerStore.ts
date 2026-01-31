import { create } from 'zustand';
import { Parcel, Harvest, FarmerNotification, WeatherData } from '@/types/farmer';

interface ParcelSlice {
  parcels: Parcel[];
  setParcels: (parcels: Parcel[]) => void;
  updateParcelHealth: (id: string, score: number) => void;
}

interface HarvestSlice {
  harvests: Harvest[];
  pendingHarvests: Harvest[];
  addHarvest: (harvest: Harvest) => void;
  addPendingHarvest: (harvest: Harvest) => void;
  clearPendingHarvests: () => void;
}

interface UiSlice {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: FarmerNotification[];
  addNotification: (notif: FarmerNotification) => void;
  weather: WeatherData | null;
  setWeather: (weather: WeatherData) => void;
}

type FarmerStore = ParcelSlice & HarvestSlice & UiSlice;

export const useFarmerStore = create<FarmerStore>((set) => ({
  // Parcel Slice
  parcels: [],
  setParcels: (parcels) => set({ parcels }),
  updateParcelHealth: (id, score) =>
    set((state) => ({
      parcels: state.parcels.map((p) =>
        p.id === id ? { ...p, healthScore: score } : p
      ),
    })),

  // Harvest Slice
  harvests: [],
  pendingHarvests: [],
  addHarvest: (harvest) =>
    set((state) => ({ harvests: [...state.harvests, harvest] })),
  addPendingHarvest: (harvest) =>
    set((state) => ({ pendingHarvests: [...state.pendingHarvests, harvest] })),
  clearPendingHarvests: () => set({ pendingHarvests: [] }),

  // UI Slice
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  activeTab: "overview",
  setActiveTab: (tab) => set({ activeTab: tab }),
  notifications: [],
  addNotification: (notif) =>
    set((state) => ({ notifications: [notif, ...state.notifications] })),
  weather: null,
  setWeather: (weather) => set({ weather }),
}));
