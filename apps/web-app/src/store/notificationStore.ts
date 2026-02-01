import { create } from 'zustand';

export type NotificationType = 'system' | 'user' | 'alert' | 'success' | 'transaction';
export type NotificationPriority = 'critical' | 'high' | 'normal';
export type CampaignType = 'push' | 'sms' | 'email' | 'whatsapp' | 'in-app';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  excerpt: string;
  message: string;
  timestamp: string;
  sender: string;
  isRead: boolean;
  isPinned: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  target: string;
  scheduledAt?: string;
  delivered: number;
  opened: number;
  converted: number;
}

export interface NotificationState {
  notifications: Notification[];
  campaigns: Campaign[];
  unreadCount: number;
  activeTab: string;
  
  // Actions
  fetchNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  togglePin: (id: string) => void;
  setActiveTab: (tab: string) => void;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'delivered' | 'opened' | 'converted'>) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    {
      id: 'NTF-001',
      type: 'alert',
      priority: 'critical',
      title: '🚨 Rupture de stock détectée - Zone Nord',
      excerpt: 'Les stocks de maïs jaune à Korhogo sont inférieurs au seuil critique de 5T.',
      message: 'Attention: Les stocks de maïs jaune à Korhogo sont inférieurs au seuil critique de 5T. Une intervention logistique est nécessaire pour éviter une rupture de service chez les acheteurs locaux.',
      timestamp: new Date().toISOString(),
      sender: 'System Auto',
      isRead: false,
      isPinned: true,
    },
    {
      id: 'NTF-002',
      type: 'transaction',
      priority: 'high',
      title: '💰 Nouveau paiement Escrow - 4.2M CFA',
      excerpt: 'L\'acheteur AgriIndustrial a déposé les fonds pour la commande #CMD-4521.',
      message: 'Le dépôt de 4,200,000 CFA de l\'acheteur AgriIndustrial a été validé et mis en séquestre pour la commande #CMD-4521.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      sender: 'Financial Engine',
      isRead: false,
      isPinned: false,
    },
    {
      id: 'NTF-003',
      type: 'user',
      priority: 'normal',
      title: '👤 Nouveau dossier KYC à valider',
      excerpt: 'M. Ibrahim Koné a soumis ses documents pour le rôle "Transporteur".',
      message: 'Un nouveau dossier KYC a été soumis par Ibrahim Koné. Merci de vérifier les documents d\'identité et les licences de transport.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      sender: 'User Service',
      isRead: true,
      isPinned: false,
    },
    {
      id: 'NTF-004',
      type: 'success',
      priority: 'normal',
      title: '✅ Livraison confirmée #CMD-4520',
      excerpt: 'Le transporteur TR-89 a livré 10T d\'ananas au port d\'Abidjan.',
      message: 'La livraison de 10 tonnes d\'ananas pour la commande #CMD-4520 a été confirmée par l\'acheteur au port d\'Abidjan.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      sender: 'Logistics Bot',
      isRead: true,
      isPinned: false,
    }
  ],
  campaigns: [
    {
      id: 'CMP-01',
      name: 'Rappel Récolte Maïs',
      type: 'push',
      status: 'completed',
      target: 'Agriculteurs Nord',
      delivered: 1245,
      opened: 980,
      converted: 450,
    },
    {
      id: 'CMP-02',
      name: 'Promo Engrais Bio',
      type: 'email',
      status: 'sending',
      target: 'Tous les producteurs',
      delivered: 5600,
      opened: 1200,
      converted: 85,
    },
    {
      id: 'CMP-03',
      name: 'Alerte Météo Orages',
      type: 'sms',
      status: 'scheduled',
      target: 'Zone Littorale',
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      delivered: 0,
      opened: 0,
      converted: 0,
    }
  ],
  unreadCount: 2,
  activeTab: 'Toutes',

  fetchNotifications: () => {
    // Logic to fetch from API
  },

  markAsRead: (id) => set((state) => {
    const notifications = state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    return {
      notifications,
      unreadCount: notifications.filter(n => !n.isRead).length
    };
  }),

  markAllAsRead: () => set((state) => {
    const notifications = state.notifications.map(n => ({ ...n, isRead: true }));
    return {
      notifications,
      unreadCount: 0
    };
  }),

  deleteNotification: (id) => set((state) => {
    const notifications = state.notifications.filter(n => n.id !== id);
    return {
      notifications,
      unreadCount: notifications.filter(n => !n.isRead).length
    };
  }),

  togglePin: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, isPinned: !n.isPinned } : n
    )
  })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  createCampaign: (campaign) => set((state) => ({
    campaigns: [
      {
        ...campaign,
        id: `CMP-${Math.floor(Math.random() * 1000)}`,
        delivered: 0,
        opened: 0,
        converted: 0,
      },
      ...state.campaigns
    ]
  }))
}));
