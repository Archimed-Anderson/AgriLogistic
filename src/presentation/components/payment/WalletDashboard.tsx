/**
 * Wallet Dashboard Component
 * Displays balance, transactions, and quick actions
 */
'use client';

import React, { useState } from 'react';
import { useWalletBalance, useWalletTransactions, useTopUpWallet, useTransferFunds } from '@/application/hooks/usePayment';
import { formatCurrency } from '@/lib/utils';

export function WalletDashboard() {
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();
  const { data: transactions, isLoading: txLoading } = useWalletTransactions({ limit: 10 });
  const [showTopUp, setShowTopUp] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  if (balanceLoading) {
    return <div className="animate-pulse bg-gray-200 h-48 rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-sm opacity-80">Solde disponible</p>
        <h2 className="text-4xl font-bold mt-1">
          {formatCurrency(balance?.available_balance || 0, 'XOF')}
        </h2>
        <div className="mt-4 flex gap-4 text-sm">
          <div>
            <p className="opacity-70">Total</p>
            <p className="font-semibold">{formatCurrency(balance?.balance || 0, 'XOF')}</p>
          </div>
          <div>
            <p className="opacity-70">Réservé</p>
            <p className="font-semibold">{formatCurrency(balance?.reserved_balance || 0, 'XOF')}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button 
          onClick={() => setShowTopUp(true)}
          className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border"
        >
          <span className="text-2xl mb-2">💳</span>
          <span className="text-sm font-medium">Recharger</span>
        </button>
        <button 
          onClick={() => setShowTransfer(true)}
          className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border"
        >
          <span className="text-2xl mb-2">↗️</span>
          <span className="text-sm font-medium">Transférer</span>
        </button>
        <button className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border">
          <span className="text-2xl mb-2">🏦</span>
          <span className="text-sm font-medium">Retirer</span>
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">Transactions récentes</h3>
        {txLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-12 bg-gray-100 rounded" />
            ))}
          </div>
        ) : transactions?.items?.length > 0 ? (
          <div className="space-y-3">
            {transactions.items.map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {tx.amount > 0 ? '↓' : '↑'}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-gray-500">{new Date(tx.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <span className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount, 'XOF')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Aucune transaction</p>
        )}
      </div>
    </div>
  );
}

export default WalletDashboard;
