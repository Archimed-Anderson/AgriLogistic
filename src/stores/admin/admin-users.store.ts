import { create } from 'zustand';
import { AdminUser } from '@/domain/admin/entities/admin-user.entity';

interface AdminUsersState {
  users: AdminUser[];
  selectedUser: AdminUser | null;
  filters: {
    search: string;
    role: string;
    status: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUsers: (users: AdminUser[]) => void;
  setSelectedUser: (user: AdminUser | null) => void;
  setFilters: (filters: Partial<AdminUsersState['filters']>) => void;
  setPagination: (pagination: Partial<AdminUsersState['pagination']>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  users: [],
  selectedUser: null,
  filters: {
    search: '',
    role: '',
    status: '',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  isLoading: false,
  error: null,
};

export const useAdminUsersStore = create<AdminUsersState>((set) => ({
  ...initialState,
  
  setUsers: (users) => set({ users }),
  
  setSelectedUser: (user) => set({ selectedUser: user }),
  
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 }, // Reset to page 1 on filter change
    })),
  
  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  reset: () => set(initialState),
}));
