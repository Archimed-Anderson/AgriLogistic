import { create } from 'zustand';
import { User } from '@/shared/types/user';

interface AuthState {
  user: User | null;
  impersonatingId: string | null;
  impersonatedUser: User | null;

  // Actions
  setUser: (user: User | null) => void;
  startImpersonation: (user: User) => void;
  stopImpersonation: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'ADMIN-001',
    name: 'Admin Principal',
    email: 'admin@AgriLogistic.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-24T18:30:00Z',
  }, // Mocked logged-in user
  impersonatingId: null,
  impersonatedUser: null,

  setUser: (user) => set({ user }),

  startImpersonation: (targetUser) => {
    console.log(`[AUTH] Starting impersonation of user ${targetUser.id}`);
    set({
      impersonatingId: targetUser.id,
      impersonatedUser: targetUser,
    });
  },

  stopImpersonation: () => {
    console.log('[AUTH] Stopping impersonation');
    set({
      impersonatingId: null,
      impersonatedUser: null,
    });
  },
}));
