/**
 * Payment API Hook - React Query integration
 * Handles all payment operations with proper error handling
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/api-client';
import { toast } from 'sonner';
import { AxiosResponse, AxiosError } from 'axios';

// Types
export interface PaymentIntent {
  transaction_id: string;
  client_secret: string;
  payment_intent_id: string;
  status: string;
}

export interface WalletBalance {
  balance: number;
  reserved_balance: number;
  available_balance: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  order_id?: string;
  payment_method_id?: string;
  save_payment_method?: boolean;
}

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

// API Functions
const paymentApi = {
  createStripeIntent: async (data: CreatePaymentRequest): Promise<PaymentIntent> => {
    const response: AxiosResponse<PaymentIntent> = await apiClient.post(
      '/api/v1/payments/stripe/intent', 
      data
    );
    return response.data;
  },

  createPayPalOrder: async (data: { 
    amount: number; 
    currency: string; 
    order_id: string; 
  }) => {
    const response: AxiosResponse = await apiClient.post(
      '/api/v1/payments/paypal/create-order', 
      data
    );
    return response.data;
  },

  capturePayPalOrder: async (orderId: string) => {
    const response: AxiosResponse = await apiClient.post(
      `/api/v1/payments/paypal/capture/${orderId}`
    );
    return response.data;
  },

  getWalletBalance: async (): Promise<WalletBalance> => {
    const response: AxiosResponse<WalletBalance> = await apiClient.get(
      '/api/v1/wallet'
    );
    return response.data;
  },

  topUpWallet: async (data: { amount: number; payment_method_id: string }) => {
    const response: AxiosResponse = await apiClient.post(
      '/api/v1/wallet/top-up', 
      data
    );
    return response.data;
  },

  withdrawFromWallet: async (data: { amount: number; bank_account_id: string }) => {
    const response: AxiosResponse = await apiClient.post(
      '/api/v1/wallet/withdraw', 
      data
    );
    return response.data;
  },

  transferFunds: async (data: { 
    recipient_user_id: string; 
    amount: number; 
    note?: string; 
  }) => {
    const response: AxiosResponse = await apiClient.post(
      '/api/v1/wallet/transfer', 
      data
    );
    return response.data;
  },

  getWalletTransactions: async (params?: { 
    limit?: number; 
    offset?: number; 
    type?: string; 
  }) => {
    const response: AxiosResponse = await apiClient.get(
      '/api/v1/wallet/transactions', 
      { params }
    );
    return response.data;
  },

  createRefund: async (
    transactionId: string, 
    data: { amount?: number; reason: string }
  ) => {
    const response: AxiosResponse = await apiClient.post(
      `/api/v1/payments/stripe/${transactionId}/refund`, 
      data
    );
    return response.data;
  },
};

// Hooks
export function useWalletBalance() {
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: paymentApi.getWalletBalance,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useWalletTransactions(params?: { limit?: number; type?: string }) {
  return useQuery({
    queryKey: ['wallet', 'transactions', params],
    queryFn: () => paymentApi.getWalletTransactions(params),
    staleTime: 10000,
  });
}

export function useCreatePaymentIntent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentApi.createStripeIntent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Paiement initialisé');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.detail || 'Erreur de paiement');
    },
  });
}

export function useTopUpWallet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentApi.topUpWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Rechargement en cours');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.detail || 'Erreur de rechargement');
    },
  });
}

export function useWithdrawFromWallet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentApi.withdrawFromWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Demande de retrait envoyée');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.detail || 'Erreur de retrait');
    },
  });
}

export function useTransferFunds() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentApi.transferFunds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Transfert effectué');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.detail || 'Erreur de transfert');
    },
  });
}

export function useCreateRefund() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ transactionId, data }: { 
      transactionId: string; 
      data: { amount?: number; reason: string }; 
    }) => paymentApi.createRefund(transactionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Remboursement initié');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.detail || 'Erreur de remboursement');
    },
  });
}
