/**
 * Finance Data Hook
 * Manages financial metrics, invoices, and transactions
 */
import { useQuery } from '@tanstack/react-query';
import type { FinancialMetrics, Invoice } from '@/types/transporter';

// Mock financial data
const mockFinancials: FinancialMetrics = {
  totalRevenue: 12500000,
  revenueByType: {
    deliveries: 9500000,
    bonuses: 1200000,
    commissions: 1800000,
  },
  totalCosts: 8200000,
  costsByType: {
    fuel: 4500000,
    maintenance: 1800000,
    insurance: 1200000,
    tolls: 450000,
    other: 250000,
  },
  grossProfit: 4300000,
  netProfit: 3800000,
  profitMargin: 30.4,
  period: 'month',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
};

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'INV-2024-001',
    clientId: 'CL-001',
    clientName: 'Ferme Bio Dakar',
    items: [
      {
        description: 'Transport de marchandises - Dakar/Thiès',
        quantity: 1,
        unitPrice: 150000,
        total: 150000,
      },
      {
        description: 'Frais de manutention',
        quantity: 1,
        unitPrice: 25000,
        total: 25000,
      },
    ],
    subtotal: 1750000,
    tax: 31500,
    taxRate: 18,
    total: 206500,
    currency: 'XOF',
    status: 'paid',
    issueDate: new Date('2024-01-15'),
    dueDate: new Date('2024-01-30'),
    paidDate: new Date('2024-01-18'),
    paymentMethod: 'bank_transfer',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'INV-002',
    invoiceNumber: 'INV-2024-002',
    clientId: 'CL-002',
    clientName: 'Supermarché Central',
    items: [
      {
        description: 'Livraison express - St Louis',
        quantity: 1,
        unitPrice: 350000,
        total: 350000,
      },
    ],
    subtotal: 350000,
    tax: 63000,
    taxRate: 18,
    total: 413000,
    currency: 'XOF',
    status: 'sent',
    issueDate: new Date('2024-01-20'),
    dueDate: new Date('2024-02-05'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'INV-003',
    invoiceNumber: 'INV-2024-003',
    clientId: 'CL-003',
    clientName: 'Coopérative Mbour',
    items: [
      {
        description: 'Location camion frigo (3 jours)',
        quantity: 3,
        unitPrice: 75000,
        total: 225000,
      },
    ],
    subtotal: 225000,
    tax: 40500,
    taxRate: 18,
    total: 265500,
    currency: 'XOF',
    status: 'overdue',
    issueDate: new Date('2024-01-05'),
    dueDate: new Date('2024-01-19'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
  },
];

export function useFinanceData() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['transporter', 'finance', 'metrics'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockFinancials;
    },
  });

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['transporter', 'finance', 'invoices'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockInvoices;
    },
  });

  return {
    metrics,
    invoices,
    isLoading: metricsLoading || invoicesLoading,
  };
}
