import { BUYER_INTEL_DATA } from '@/data/buyer-intel-data';

// Simulation delays to mimic network latency
const DELAY_FAST = 500;
const DELAY_MEDIUM = 1500;
const DELAY_SLOW = 2500;

export const BuyerSimulationService = {
  /**
   * Simulate AI Product Matching/Search
   * Matches fuzzy criteria to mock provider pool
   */
  searchProducts: async (query: string, quantity: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple logic: returns all for now, could filter if dataset was larger
        resolve(BUYER_INTEL_DATA.matchedProviders);
      }, DELAY_SLOW);
    });
  },

  /**
   * Simulate Submitting a Reverse RFQ
   * Returns a transaction hash simulation
   */
  submitRFQ: async (rfqDetails: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'PUBLISHED',
          rfqId: `RFQ-${Math.floor(Math.random() * 10000)}`,
          broadcastCount: 142, // Sent to 142 relevant suppliers
          aiEstimatedResponses: 5,
        });
      }, DELAY_MEDIUM);
    });
  },

  /**
   * Fetch Market Intelligence Data
   * Combines History + Prediction
   */
  getMarketAnalytics: async (commodity: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          commodity: commodity,
          history: BUYER_INTEL_DATA.marketPrices,
          forecast: BUYER_INTEL_DATA.pricePredictions,
          meta: {
            volatility: 'MEDIUM',
            trend: 'BULLISH',
            confidence: 0.85,
          },
        });
      }, DELAY_FAST);
    });
  },

  /**
   * Simulate Smart Contract Deployment
   */
  deploySmartContract: async (contractData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hash:
            '0x' +
            Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          block: 18293044,
          status: 'CONFIRMED',
        });
      }, DELAY_SLOW);
    });
  },
};
