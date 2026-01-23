/**
 * Budget Analyzer Component
 * Track expenses and income with forecasting
 */
'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { BudgetEntry } from '@/types/farmer/operations';

interface BudgetAnalyzerProps {
  budget: BudgetEntry[];
  isLoading?: boolean;
}

export function BudgetAnalyzer({ budget, isLoading }: BudgetAnalyzerProps) {
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  const totalExpenses = budget
    .filter(b => b.type === 'expense')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalIncome = budget
    .filter(b => b.type === 'income')
    .reduce((sum, b) => sum + b.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Group by category
  const expensesByCategory = budget
    .filter(b => b.type === 'expense')
    .reduce((acc, b) => {
      acc[b.category] = (acc[b.category] || 0) + b.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Analyse Budgétaire</h2>
        </div>
        <div className="flex gap-2">
          {(['month', 'quarter', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-sm rounded-lg ${
                period === p
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p === 'month' ? 'Mois' : p === 'quarter' ? 'Trimestre' : 'Année'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700 font-medium">Dépenses</span>
          </div>
          <p className="text-2xl font-bold text-red-900">
            {(totalExpenses / 1000).toFixed(0)}K XOF
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Revenus</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {(totalIncome / 1000).toFixed(0)}K XOF
          </p>
        </div>

        <div className={`rounded-lg p-4 ${balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className={`w-4 h-4 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            <span className={`text-sm font-medium ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
              Balance
            </span>
          </div>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
            {balance >= 0 ? '+' : ''}{(balance / 1000).toFixed(0)}K XOF
          </p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Répartition des dépenses</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${(value / 1000).toFixed(1)}K XOF`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Entries */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Dernières transactions</h3>
        <div className="space-y-2">
          {budget.slice(0, 5).map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{entry.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(entry.date).toLocaleDateString('fr-FR')} • {entry.category}
                </p>
              </div>
              <span
                className={`font-semibold ${
                  entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {entry.type === 'income' ? '+' : '-'}
                {(entry.amount / 1000).toFixed(1)}K
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
