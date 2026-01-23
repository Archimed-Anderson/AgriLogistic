/**
 * Finance Overview Component
 * Displays key financial metrics and charts
 */
import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { FinancialMetrics } from '@/types/transporter';

interface FinanceOverviewProps {
  metrics: FinancialMetrics;
}

export function FinanceOverview({ metrics }: FinanceOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      label: 'Chiffre d\'affaires',
      value: metrics.totalRevenue,
      change: +12.5,
      icon: DollarSign,
      color: 'blue',
    },
    {
      label: 'Bénéfice Net',
      value: metrics.netProfit,
      change: +8.2,
      icon: TrendingUp,
      color: 'green',
    },
    {
      label: 'Charges Totales',
      value: metrics.totalCosts,
      change: -2.3,
      icon: TrendingDown,
      color: 'orange',
    },
    {
      label: 'Marge Nette',
      value: metrics.profitMargin,
      isPercentage: true,
      change: +1.5,
      icon: PieChart,
      color: 'purple',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700',
      green: 'bg-green-50 text-green-700',
      orange: 'bg-orange-50 text-orange-700',
      purple: 'bg-purple-50 text-purple-700',
    };
    return colors[color as keyof typeof colors];
  };

  // Prepare chart data
  const revenueData = [
    { name: 'Livraisons', value: metrics.revenueByType.deliveries },
    { name: 'Bonus', value: metrics.revenueByType.bonuses },
    { name: 'Commissions', value: metrics.revenueByType.commissions },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.change >= 0;

          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">{card.label}</span>
                <div className={`p-2 rounded-lg ${getColorClasses(card.color)}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {card.isPercentage ? `${card.value}%` : formatCurrency(card.value)}
                </span>
                <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{Math.abs(card.change)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition des Revenus</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Analyse des Coûts</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Fuel className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Carburant</p>
                  <p className="text-sm text-gray-500">55% des charges</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">{formatCurrency(metrics.costsByType.fuel)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Maintenance</p>
                  <p className="text-sm text-gray-500">22% des charges</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">{formatCurrency(metrics.costsByType.maintenance)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Assurance</p>
                  <p className="text-sm text-gray-500">15% des charges</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">{formatCurrency(metrics.costsByType.insurance)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icon
function Fuel({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 22v-8a2 2 0 0 1 2-2h2.5" />
      <path d="M6 10h11.5" />
      <path d="M10 22v-8" />
      <path d="M14 22v-8a2 2 0 0 1 2-2h2.5" />
      <path d="M3 22h18" />
      <path d="M18 10V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v5" />
    </svg>
  );
}
