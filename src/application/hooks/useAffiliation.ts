/**
 * Affiliation API Hook - React Query integration
 * Handles affiliate tracking, commissions, and payouts
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/api-client';
import { toast } from 'sonner';

// Types
export interface Affiliate {
  id: string;
  user_id: string;
  referral_code: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  commission_rate: number;
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
  total_referrals: number;
  total_conversions: number;
  is_active: boolean;
  created_at: string;
}

export interface AffiliateLink {
  id: string;
  short_code: string;
  target_url: string;
  campaign?: string;
  total_clicks: number;
  unique_clicks: number;
  conversions: number;
  revenue: number;
  affiliate_url: string;
  is_active: boolean;
  created_at: string;
}

export interface AffiliateStats {
  total_clicks: number;
  unique_clicks: number;
  conversions: number;
  conversion_rate: number;
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
  total_referrals: number;
  active_links: number;
}

export interface Commission {
  id: string;
  order_id: string;
  order_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  created_at: string;
  paid_at?: string;
}

// API Functions
const affiliationApi = {
  register: async (): Promise<Affiliate> => {
    const response = await apiClient.post('/api/v1/affiliates/register', {});
    return response.data;
  },

  getProfile: async (): Promise<Affiliate> => {
    const response = await apiClient.get('/api/v1/affiliates/me');
    return response.data;
  },

  getStats: async (): Promise<AffiliateStats> => {
    const response = await apiClient.get('/api/v1/affiliates/stats');
    return response.data;
  },

  createLink: async (data: { target_url: string; campaign?: string; product_id?: string }) => {
    const response = await apiClient.post('/api/v1/affiliates/links', data);
    return response.data;
  },

  getLinks: async (params?: { limit?: number; offset?: number }) => {
    const response = await apiClient.get('/api/v1/affiliates/links', { params });
    return response.data;
  },

  getCommissions: async (params?: { status?: string; limit?: number; offset?: number }) => {
    const response = await apiClient.get('/api/v1/affiliates/commissions', { params });
    return response.data;
  },

  requestPayout: async (data: { amount: number; payment_method: string; payment_details: object }) => {
    const response = await apiClient.post('/api/v1/affiliates/payouts', data);
    return response.data;
  },

  getPayouts: async (params?: { limit?: number; offset?: number }) => {
    const response = await apiClient.get('/api/v1/affiliates/payouts', { params });
    return response.data;
  },
};

// Hooks
export function useAffiliateProfile() {
  return useQuery({
    queryKey: ['affiliate', 'profile'],
    queryFn: affiliationApi.getProfile,
    staleTime: 60000,
    retry: false,
  });
}

export function useAffiliateStats() {
  return useQuery({
    queryKey: ['affiliate', 'stats'],
    queryFn: affiliationApi.getStats,
    staleTime: 30000,
    refetchInterval: 120000, // Refresh every 2 minutes
  });
}

export function useAffiliateLinks(params?: { limit?: number }) {
  return useQuery({
    queryKey: ['affiliate', 'links', params],
    queryFn: () => affiliationApi.getLinks(params),
    staleTime: 30000,
  });
}

export function useAffiliateCommissions(params?: { status?: string; limit?: number }) {
  return useQuery({
    queryKey: ['affiliate', 'commissions', params],
    queryFn: () => affiliationApi.getCommissions(params),
    staleTime: 30000,
  });
}

export function useAffiliatePayouts() {
  return useQuery({
    queryKey: ['affiliate', 'payouts'],
    queryFn: () => affiliationApi.getPayouts(),
    staleTime: 60000,
  });
}

export function useRegisterAffiliate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: affiliationApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['affiliate', 'profile'], data);
      toast.success('Inscription au programme d\'affiliation réussie!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'inscription');
    },
  });
}

export function useCreateAffiliateLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: affiliationApi.createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate', 'links'] });
      toast.success('Lien d\'affiliation créé!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erreur de création du lien');
    },
  });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: affiliationApi.requestPayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate'] });
      toast.success('Demande de paiement envoyée');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erreur de demande de paiement');
    },
  });
}
