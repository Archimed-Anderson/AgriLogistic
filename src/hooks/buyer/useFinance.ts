/**
 * Finance Hook
 * Manages transactions, invoices, and payment methods
 */
import { useQuery } from '@tanstack/react-query';

export interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'credit';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
  description: string;
  orderId?: string;
  invoiceId?: string;
  paymentMethod: string;
}

export interface Invoice {
  id: string;
  number: string;
  orderId: string;
  supplierName: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'bank_account' | 'mobile_money' | 'card';
  label: string;
  details: string;
  isDefault: boolean;
}

const mockTransactions: Transaction[] = [
  { id: 't-1', type: 'payment', amount: 92500, status: 'completed', date: new Date('2026-01-22T14:30:00'), description: 'Paiement commande AGR-2026-0001', orderId: 'ord-001', invoiceId: 'inv-001', paymentMethod: 'Orange Money' },
  { id: 't-2', type: 'payment', amount: 250000, status: 'completed', date: new Date('2026-01-21T10:15:00'), description: 'Paiement commande AGR-2026-0002', orderId: 'ord-002', invoiceId: 'inv-002', paymentMethod: 'Virement bancaire' },
  { id: 't-3', type: 'refund', amount: 15000, status: 'completed', date: new Date('2026-01-20T16:45:00'), description: 'Remboursement partiel AGR-2026-0003', orderId: 'ord-003', paymentMethod: 'Orange Money' },
  { id: 't-4', type: 'payment', amount: 160000, status: 'pending', date: new Date('2026-01-22T09:00:00'), description: 'Paiement commande AGR-2026-0004', orderId: 'ord-004', invoiceId: 'inv-003', paymentMethod: 'Wave' },
  { id: 't-5', type: 'credit', amount: 50000, status: 'completed', date: new Date('2026-01-19T11:30:00'), description: 'Crédit fidélité', paymentMethod: 'Portefeuille' },
];

const mockInvoices: Invoice[] = [
  { id: 'inv-001', number: 'FACT-2026-0045', orderId: 'ord-001', supplierName: 'Ferme Bio Casamance', amount: 85000, taxAmount: 7500, totalAmount: 92500, status: 'paid', issueDate: new Date('2026-01-20'), dueDate: new Date('2026-02-20'), paidDate: new Date('2026-01-22') },
  { id: 'inv-002', number: 'FACT-2026-0046', orderId: 'ord-002', supplierName: 'Coopérative Niayes', amount: 230000, taxAmount: 20000, totalAmount: 250000, status: 'paid', issueDate: new Date('2026-01-18'), dueDate: new Date('2026-02-18'), paidDate: new Date('2026-01-21') },
  { id: 'inv-003', number: 'FACT-2026-0047', orderId: 'ord-004', supplierName: 'Verger du Fleuve', amount: 147000, taxAmount: 13000, totalAmount: 160000, status: 'pending', issueDate: new Date('2026-01-22'), dueDate: new Date('2026-02-22') },
  { id: 'inv-004', number: 'FACT-2026-0048', orderId: 'ord-005', supplierName: 'Ferme Kolda', amount: 280000, taxAmount: 25000, totalAmount: 305000, status: 'overdue', issueDate: new Date('2026-01-05'), dueDate: new Date('2026-01-20') },
];

const mockPaymentMethods: PaymentMethod[] = [
  { id: 'pm-1', type: 'mobile_money', label: 'Orange Money', details: '+221 77 123 45 67', isDefault: true },
  { id: 'pm-2', type: 'mobile_money', label: 'Wave', details: '+221 76 987 65 43', isDefault: false },
  { id: 'pm-3', type: 'bank_account', label: 'CBAO', details: 'SN08 CBAO 0145 **** 8920', isDefault: false },
];

export function useFinance() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['buyer', 'finance'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        transactions: mockTransactions,
        invoices: mockInvoices,
        paymentMethods: mockPaymentMethods,
        balance: 350000,
        pendingPayments: 160000,
        monthlySpending: 502500,
      };
    },
  });

  return {
    transactions: data?.transactions || [],
    invoices: data?.invoices || [],
    paymentMethods: data?.paymentMethods || [],
    balance: data?.balance || 0,
    pendingPayments: data?.pendingPayments || 0,
    monthlySpending: data?.monthlySpending || 0,
    isLoading,
    error,
  };
}
