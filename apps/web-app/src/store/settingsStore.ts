import { create } from 'zustand';

export interface PlatformSettings {
  general: {
    platformName: string;
    logoUrl: string;
    primaryColor: string;
    defaultLanguage: string;
    timezone: string;
    maintenanceMode: boolean;
    activeCountries: string[];
    currencies: string[];
  };
  security: {
    jwtExpiration: number;
    passwordMinLength: number;
    require2FA: boolean;
    rateLimitRequests: number;
    allowedCorsOrigins: string[];
  };
  features: {
    enableMarketplace: boolean;
    enableMobileMoney: boolean;
    enableAIInsights: boolean;
    strictKYC: boolean;
    maxTransactionAmount: number;
    maxUploadSize: number;
  };
  apiKeys: {
    orangeMoney: string;
    wave: string;
    googleMaps: string;
    weatherApi: string;
    sendGrid: string;
  };
  notifications: {
    senderEmail: string;
    smtpHost: string;
    smsProvider: 'twilio' | 'africasTalking';
    thresholdInscriptions: number;
  };
  monetization: {
    platformCommission: number;
    escrowDuration: number;
    plans: {
      name: string;
      price: number;
      features: string[];
    }[];
  };
}

interface SettingsState {
  settings: PlatformSettings;
  isDirty: boolean;
  lastBackup: string;
  
  // Actions
  updateSettings: (category: keyof PlatformSettings, updates: any) => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
  exportConfig: () => string;
  importConfig: (configJson: string) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    general: {
      platformName: 'AgroDeep Alpha',
      logoUrl: '/logo.png',
      primaryColor: '#10B981',
      defaultLanguage: 'fr',
      timezone: 'UTC+0',
      maintenanceMode: false,
      activeCountries: ['CI', 'SN', 'GH'],
      currencies: ['CFA', 'USD', 'EUR'],
    },
    security: {
      jwtExpiration: 60,
      passwordMinLength: 8,
      require2FA: true,
      rateLimitRequests: 100,
      allowedCorsOrigins: ['*.agrolog.ci', 'localhost:3000'],
    },
    features: {
      enableMarketplace: true,
      enableMobileMoney: true,
      enableAIInsights: true,
      strictKYC: true,
      maxTransactionAmount: 10000000,
      maxUploadSize: 10,
    },
    apiKeys: {
      orangeMoney: 'SK_OM_••••••••••••',
      wave: 'SK_WV_••••••••••••',
      googleMaps: 'AIza••••••••••••',
      weatherApi: 'WTH_••••••••••••',
      sendGrid: 'SG.••••••••••••',
    },
    notifications: {
      senderEmail: 'no-reply@agrolog.ci',
      smtpHost: 'smtp.sendgrid.net',
      smsProvider: 'africasTalking',
      thresholdInscriptions: 500,
    },
    monetization: {
      platformCommission: 2.5,
      escrowDuration: 7,
      plans: [
        { name: 'Free', price: 0, features: ['Marketplace Basic', 'Simple Tracking'] },
        { name: 'Pro', price: 15000, features: ['AI Insights', 'Advanced KYC'] },
        { name: 'Enterprise', price: 95000, features: ['Fleet Management', 'API Access'] },
      ],
    }
  },
  isDirty: false,
  lastBackup: new Date().toISOString(),

  updateSettings: (category, updates) => set((state) => ({
    settings: {
      ...state.settings,
      [category]: { ...state.settings[category], ...updates }
    },
    isDirty: true
  })),

  saveSettings: async () => {
    // Simulate API call
    console.log('Saving global settings...', get().settings);
    set({ isDirty: false });
  },

  resetSettings: () => {
    // Logic to reload from API
    set({ isDirty: false });
  },

  exportConfig: () => {
    return JSON.stringify(get().settings, null, 2);
  },

  importConfig: (configJson) => {
    try {
      const parsed = JSON.parse(configJson);
      set({ settings: parsed, isDirty: true });
    } catch (e) {
      console.error('Invalid configuration format');
    }
  }
}));
