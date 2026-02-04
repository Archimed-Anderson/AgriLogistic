import { create } from 'zustand';

export type OfferStatus = 'pending' | 'active' | 'sold' | 'rejected' | 'flagged';
export type MarketCategory = 'Céréales' | 'Fruits' | 'Légumes' | 'Oléagineux' | 'Autre';

export interface MarketOffer {
  id: string;
  title: string;
  category: MarketCategory;
  price: number;
  unit: string; // e.g., "kg", "tonne"
  quantity: number;
  location: string;
  farmerName: string;
  status: OfferStatus;
  createdAt: string;
  images: string[];
  aiScore: number; // 0-1 (confidence/quality)
  sentiment: 'positive' | 'neutral' | 'negative';
  anomalies?: string[];
}

export interface PriceTrend {
  product: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  region: string;
}

interface MarketplaceStore {
  offers: MarketOffer[];
  selectedOffer: MarketOffer | null;
  trends: PriceTrend[];
  crisisMode: boolean;

  selectOffer: (offer: MarketOffer | null) => void;
  updateOfferStatus: (id: string, status: MarketOffer['status']) => void;
  toggleCrisisMode: () => void;
  setOffers: (offers: MarketOffer[]) => void;
}

export const useMarketplaceStore = create<MarketplaceStore>((set) => ({
  offers: [
    {
      id: 'OFF-9901',
      title: "Cacao Côté d'Ivoire - Grade A",
      category: 'Oléagineux',
      price: 1500,
      unit: 'kg',
      quantity: 500,
      location: 'Abengourou',
      farmerName: 'Kouassi Jean',
      status: 'pending',
      createdAt: '2024-03-21T10:00:00Z',
      images: ['/products/cocoa-1.jpg'],
      aiScore: 0.98,
      sentiment: 'positive',
      anomalies: [],
    },
    {
      id: 'OFF-8822',
      title: 'Maïs Grain Jaune',
      category: 'Céréales',
      price: 250,
      unit: 'kg',
      quantity: 5000,
      location: 'Bouaké',
      farmerName: 'Yao Amenan',
      status: 'active',
      createdAt: '2024-03-20T15:30:00Z',
      images: ['/products/corn-1.jpg'],
      aiScore: 0.85,
      sentiment: 'neutral',
      anomalies: ['Anormal price detected: 25% below regional average'],
    },
  ],
  selectedOffer: null,
  trends: [
    { product: 'Cacao', currentPrice: 1500, previousPrice: 1420, change: 5.6, region: 'CI-Global' },
    { product: 'Maïs', currentPrice: 250, previousPrice: 280, change: -10.7, region: 'Bouaké' },
    { product: 'Café', currentPrice: 1100, previousPrice: 1080, change: 1.8, region: 'West' },
  ],
  crisisMode: false,

  selectOffer: (offer) => set({ selectedOffer: offer }),
  updateOfferStatus: (id, status) =>
    set((state) => ({
      offers: state.offers.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
  toggleCrisisMode: () => set((state) => ({ crisisMode: !state.crisisMode })),
  setOffers: (offers) => set({ offers }),
}));
