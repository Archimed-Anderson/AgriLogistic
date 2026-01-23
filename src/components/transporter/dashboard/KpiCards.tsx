/**
 * KPI Cards Component
 * Displays key performance indicators for the transporter dashboard
 */
import React from 'react';
import { TrendingUp, TrendingDown, Package, DollarSign, Navigation, Star } from 'lucide-react';
import type { TransporterKPIs } from '@/types/transporter';

interface KpiCardsProps {
  kpis: TransporterKPIs;
  isLoading?: boolean;
}

export function KpiCards({ kpis, isLoading }: KpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Revenus du jour',
      value: `${(kpis.dailyRevenue / 1000).toFixed(1)}K`,
      unit: 'XOF',
      change: kpis.revenueGrowth,
      icon: DollarSign,
      color: 'green',
      subtitle: `${kpis.weeklyRevenue.toLocaleString()} XOF cette semaine`,
    },
    {
      title: 'Livraisons actives',
      value: kpis.activeDeliveries,
      unit: 'en cours',
      change: ((kpis.completedToday - kpis.activeDeliveries) / kpis.activeDeliveries) * 100,
      icon: Package,
      color: 'blue',
      subtitle: `${kpis.completedToday} livrées aujourd'hui`,
    },
    {
      title: 'Distance parcourue',
      value: kpis.kmToday,
      unit: 'km',
      change: ((kpis.kmToday - kpis.kmWeek / 7) / (kpis.kmWeek / 7)) * 100,
      icon: Navigation,
      color: 'purple',
      subtitle: `${kpis.fuelEfficiency} L/100km`,
    },
    {
      title: 'Satisfaction client',
      value: kpis.customerSatisfaction.toFixed(1),
      unit: '/ 5',
      change: kpis.onTimeRate - 90,
      icon: Star,
      color: 'orange',
      subtitle: `${kpis.onTimeRate}% à l'heure`,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-50 text-green-700',
      blue: 'bg-blue-50 text-blue-700',
      purple: 'bg-purple-50 text-purple-700',
      orange: 'bg-orange-50 text-orange-700',
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.change >= 0;

        return (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">{card.title}</span>
              <div className={`p-2 rounded-lg ${getColorClasses(card.color)}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">{card.value}</span>
              <span className="text-sm text-gray-600">{card.unit}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{card.subtitle}</span>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(card.change).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
