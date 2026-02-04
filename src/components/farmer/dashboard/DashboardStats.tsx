/**
 * Dashboard Stats Component
 * Displays real-time KPIs with trend indicators
 */
'use client';

import React from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, Tractor, DollarSign, Sprout } from 'lucide-react';
import type { DashboardKPIs } from '@/types/farmer/dashboard';

interface DashboardStatsProps {
  kpis: DashboardKPIs;
  isLoading?: boolean;
}

export function DashboardStats({ kpis, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Revenus du mois',
      value: `${(kpis.monthlyRevenue / 1000).toFixed(1)}K`,
      unit: 'XOF',
      change: kpis.revenueGrowth,
      icon: DollarSign,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Commandes actives',
      value: kpis.activeOrders.toString(),
      unit: 'commandes',
      change: ((kpis.activeOrders - kpis.pendingOrders) / kpis.pendingOrders) * 100,
      icon: ShoppingCart,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Matériel loué',
      value: kpis.equipmentRented.toString(),
      unit: 'équipements',
      change: 8.3,
      icon: Tractor,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Cultures actives',
      value: kpis.activeCrops.toString(),
      unit: `sur ${kpis.totalCrops}`,
      change: 0,
      icon: Sprout,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;

        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <span className="text-sm text-gray-500">{stat.unit}</span>
                </div>
                {stat.change !== 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {stat.change.toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-500">vs mois dernier</span>
                  </div>
                )}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
