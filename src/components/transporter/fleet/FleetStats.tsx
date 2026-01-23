/**
 * Fleet Statistics Component
 * Displays overall statistics for the fleet
 */
import React from 'react';
import { Truck, Wrench, Wallet, Activity } from 'lucide-react';

interface FleetStatsProps {
  stats: {
    total: number;
    active: number;
    available: number;
    maintenance: number;
    totalCosts: number;
    fuelCost: number;
    maintenanceCost: number;
  };
}

export function FleetStats({ stats }: FleetStatsProps) {
  const items = [
    {
      label: 'Véhicules actifs',
      value: stats.active,
      total: stats.total,
      unit: 'sur ' + stats.total,
      icon: Activity,
      color: 'blue',
    },
    {
      label: 'En maintenance',
      value: stats.maintenance,
      total: stats.total,
      unit: 'véhicules',
      icon: Wrench,
      color: 'orange',
    },
    {
      label: 'Coût total (YTD)',
      value: (stats.totalCosts / 1000).toFixed(0) + 'K',
      subtext: `Dont ${(stats.fuelCost / 1000).toFixed(0)}K carburant`,
      icon: Wallet,
      color: 'green',
    },
    {
      label: 'Disponibilité',
      value: Math.round(((stats.available + stats.active) / stats.total) * 100) + '%',
      subtext: 'Opérationnels',
      icon: Truck,
      color: 'purple',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700',
      orange: 'bg-orange-50 text-orange-700',
      green: 'bg-green-50 text-green-700',
      purple: 'bg-purple-50 text-purple-700',
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">{item.label}</span>
              <div className={`p-2 rounded-lg ${getColorClasses(item.color)}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{item.value}</span>
              {item.unit && <span className="text-sm text-gray-500">{item.unit}</span>}
            </div>
            {item.subtext && <p className="text-xs text-gray-500 mt-1">{item.subtext}</p>}
          </div>
        );
      })}
    </div>
  );
}
