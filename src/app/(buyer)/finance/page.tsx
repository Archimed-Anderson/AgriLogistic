/**
 * Buyer Finance Page
 * Transactions, invoices, and payment management
 */
'use client';

import React, { useState } from 'react';
import { useFinance, Transaction, Invoice } from '@/hooks/buyer/useFinance';
import {
  CreditCard,
  Receipt,
  Wallet,
  TrendingUp,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  Plus,
  X,
  ChevronRight,
  Building,
  Smartphone
} from 'lucide-react';

const transactionTypeConfig = {
  payment: { icon: ArrowUpRight, color: 'text-red-500 bg-red-50', label: 'Paiement' },
  refund: { icon: ArrowDownLeft, color: 'text-emerald-500 bg-emerald-50', label: 'Remboursement' },
  credit: { icon: Gift, color: 'text-purple-500 bg-purple-50', label: 'Crédit' },
};

const invoiceStatusConfig = {
  paid: { label: 'Payée', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  overdue: { label: 'En retard', color: 'bg-red-100 text-red-700 border-red-200' },
};

export default function BuyerFinancePage() {
  const { transactions, invoices, paymentMethods, balance, pendingPayments, monthlySpending, isLoading } = useFinance();
  const [activeTab, setActiveTab] = useState<'transactions' | 'invoices'>('transactions');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finances</h1>
          <p className="text-slate-600">Gérez vos paiements et factures</p>
        </div>
        <button className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un moyen de paiement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">Solde disponible</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-amber-500" />
            <span className="text-sm text-slate-500">Paiements en attente</span>
          </div>
          <p className="text-3xl font-bold text-amber-600">{formatCurrency(pendingPayments)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <span className="text-sm text-slate-500">Dépenses ce mois</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(monthlySpending)}</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-500" />
          Moyens de paiement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 rounded-xl border-2 ${
                method.isDefault ? 'border-amber-500 bg-amber-50' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {method.type === 'mobile_money' ? (
                    <Smartphone className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Building className="w-5 h-5 text-blue-600" />
                  )}
                  <span className="font-medium text-slate-900">{method.label}</span>
                </div>
                {method.isDefault && (
                  <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-lg">Par défaut</span>
                )}
              </div>
              <p className="text-sm text-slate-500 font-mono">{method.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'transactions'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Receipt className="w-4 h-4 inline mr-2" />
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'invoices'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Factures
        </button>
      </div>

      {/* Transactions List */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {transactions.map((transaction) => {
              const config = transactionTypeConfig[transaction.type];
              const Icon = config.icon;

              return (
                <div key={transaction.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{transaction.description}</p>
                        <p className="text-sm text-slate-500">{formatDate(transaction.date)} • {transaction.paymentMethod}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.type === 'payment' ? 'text-red-600' : 'text-emerald-600'}`}>
                        {transaction.type === 'payment' ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </p>
                      <div className="flex items-center gap-1 text-sm">
                        {transaction.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : transaction.status === 'pending' ? (
                          <Clock className="w-4 h-4 text-amber-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-slate-500 capitalize">{transaction.status === 'completed' ? 'Effectuée' : transaction.status === 'pending' ? 'En attente' : 'Échoué'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Invoices List */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Facture</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Fournisseur</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Montant</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Échéance</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Statut</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((invoice) => {
                const statusConf = invoiceStatusConfig[invoice.status];

                return (
                  <tr
                    key={invoice.id}
                    onClick={() => setSelectedInvoice(invoice)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-slate-900">{invoice.number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700">{invoice.supplierName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">{formatCurrency(invoice.totalAmount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{formatDate(invoice.dueDate)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-lg border ${statusConf.color}`}>
                        {statusConf.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedInvoice.number}</h2>
                  <p className="text-slate-500">{selectedInvoice.supplierName}</p>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-center">
                <span className={`px-4 py-2 text-sm font-medium rounded-xl border ${invoiceStatusConfig[selectedInvoice.status].color}`}>
                  {invoiceStatusConfig[selectedInvoice.status].label}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600">Montant HT</span>
                  <span className="font-medium text-slate-900">{formatCurrency(selectedInvoice.amount)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600">TVA</span>
                  <span className="font-medium text-slate-900">{formatCurrency(selectedInvoice.taxAmount)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-medium text-amber-700">Total TTC</span>
                  <span className="font-bold text-amber-800">{formatCurrency(selectedInvoice.totalAmount)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Date d'émission</p>
                  <p className="font-medium text-slate-900">{formatDate(selectedInvoice.issueDate)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Date d'échéance</p>
                  <p className="font-medium text-slate-900">{formatDate(selectedInvoice.dueDate)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Télécharger PDF
                </button>
                {selectedInvoice.status !== 'paid' && (
                  <button className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors">
                    Payer maintenant
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
