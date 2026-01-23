import { create } from 'zustand';

interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  revenue: number;
  usersChange: number;
  ordersChange: number;
  revenueChange: number;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

interface Activity {
  id: string;
  adminUserId: string;
  adminUserName: string;
  action: string;
  resource: string;
  timestamp: Date;
}

interface AdminDashboardState {
  metrics: DashboardMetrics | null;
  alerts: SystemAlert[];
  recentActivity: Activity[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setMetrics: (metrics: DashboardMetrics) => void;
  setAlerts: (alerts: SystemAlert[]) => void;
  setRecentActivity: (activity: Activity[]) => void;
  dismissAlert: (alertId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  metrics: null,
  alerts: [],
  recentActivity: [],
  isLoading: false,
  error: null,
};

export const useAdminDashboardStore = create<AdminDashboardState>((set) => ({
  ...initialState,
  
  setMetrics: (metrics) => set({ metrics }),
  
  setAlerts: (alerts) => set({ alerts }),
  
  setRecentActivity: (recentActivity) => set({ recentActivity }),
  
  dismissAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== alertId),
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  reset: () => set(initialState),
}));
