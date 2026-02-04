import { create } from 'zustand';

export type UserRole = 'farmer' | 'transporter' | 'buyer' | 'admin';
export type KYCStatus = 'pending' | 'verified' | 'rejected' | 'none';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: {
    region: string;
    country: string;
    flag: string;
  };
  kycStatus: KYCStatus;
  kycProgress: number;
  agriScore: number;
  joinedAt: string;
  avatar?: string;
  isOnline?: boolean;
}

interface UserDirectoryState {
  users: User[];
  searchQuery: string;
  activeTab: string;
  selectedUserId: string | null;
  filters: {
    country: string;
    status: string;
  };
  
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: string) => void;
  setSelectedUserId: (id: string | null) => void;
  setFilters: (filters: Partial<UserDirectoryState['filters']>) => void;
  updateUserKYC: (id: string, status: KYCStatus) => void;
}

export const useUserDirectoryStore = create<UserDirectoryState>((set) => ({
  users: [
    {
      id: 'USR-001',
      name: 'Kofi Annan',
      email: 'kofi.annan@agrolog.ci',
      phone: '+225 07 08 09 10 11',
      role: 'farmer',
      location: { region: 'Yamoussoukro', country: 'Côte d’Ivoire', flag: '🇨🇮' },
      kycStatus: 'verified',
      kycProgress: 100,
      agriScore: 850,
      joinedAt: '2024-03-28T10:00:00Z',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kofi',
      isOnline: true,
    },
    {
      id: 'USR-002',
      name: 'Moussa Traoré',
      email: 'm.traore@transport.sn',
      phone: '+221 77 123 45 67',
      role: 'transporter',
      location: { region: 'Dakar', country: 'Sénégal', flag: '🇸🇳' },
      kycStatus: 'pending',
      kycProgress: 50,
      agriScore: 720,
      joinedAt: '2024-03-30T14:30:00Z',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Moussa',
    },
    {
      id: 'USR-003',
      name: 'Awa Diop',
      email: 'awa.diop@marche.ci',
      phone: '+225 05 55 66 77 88',
      role: 'buyer',
      location: { region: 'Abidjan', country: 'Côte d’Ivoire', flag: '🇨🇮' },
      kycStatus: 'pending',
      kycProgress: 50,
      agriScore: 680,
      joinedAt: '2024-03-31T09:15:00Z',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Awa',
      isOnline: true,
    },
    {
      id: 'USR-004',
      name: 'Kwame Mensah',
      email: 'kwame.mensah@farm.gh',
      phone: '+233 24 987 6543',
      role: 'farmer',
      location: { region: 'Kumasi', country: 'Ghana', flag: '🇬🇭' },
      kycStatus: 'rejected',
      kycProgress: 100,
      agriScore: 450,
      joinedAt: '2024-03-15T11:00:00Z',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kwame',
    },
    {
      id: 'USR-005',
      name: 'Sarah Camara',
      email: 's.camara@agrolog.ci',
      phone: '+225 01 02 03 04 05',
      role: 'farmer',
      location: { region: 'Bouaké', country: 'Côte d’Ivoire', flag: '🇨🇮' },
      kycStatus: 'verified',
      kycProgress: 100,
      agriScore: 920,
      joinedAt: '2024-01-10T08:00:00Z',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
  ],
  searchQuery: '',
  activeTab: 'Tous',
  selectedUserId: null,
  filters: {
    country: 'all',
    status: 'all',
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUserId: (id) => set({ selectedUserId: id }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  updateUserKYC: (id, status) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, kycStatus: status, kycProgress: status === 'verified' ? 100 : u.kycProgress } : u)
  })),
}));
