/**
 * Cost Calculator Component
 * Displays detailed cost breakdown for the route
 */
import React from 'react';
import { DollarSign, Fuel, Navigation, Wrench, Clock, TrendingDown, TrendingUp } from 'lucide-react';
import type { RouteCost } from '@/types/transporter';

interface CostCalculatorProps {
  cost: RouteCost;
  distance: number;
  duration: number;
  isLoading?: boolean;
}

export function CostCalculator({ cost, distance, duration, isLoading }: CostCalculatorProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const costItems = [
    {
      label: 'Carburant',
      value: cost.fuel,
      icon: Fuel,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      percentage: (cost.fuel / cost.total) * 100,
    },
    {
      label: 'Péages',
      value: cost.tolls,
      icon: Navigation,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      percentage: (cost.tolls / cost.total) * 100,
    },
    {
      label: 'Usure véhicule',
      value: cost.wear,
      icon: Wrench,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      percentage: (cost.wear / cost.total) * 100,
    },
    {
      label: 'Main d\'œuvre',
      value: cost.labor,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      percentage: (cost.labor / cost.total) * 100,
    },
  ];

  const costPerKm = cost.total / distance;
  const costPerHour = cost.total / (duration / 60);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Estimation des Coûts</h2>
          <p className="text-sm text-gray-600 mt-1">
            {distance.toFixed(1)} km • {Math.round(duration)} min
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Coût total estimé</p>
          <p className="text-2xl font-bold text-gray-900">
            {cost.total.toLocaleString()} {cost.currency}
          </p>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-3 mb-6">
        {costItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value.toLocaleString()} {cost.currency}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.bgColor}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-500 w-12 text-right">
                {item.percentage.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Coût par km</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {costPerKm.toFixed(0)} {cost.currency}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Coût par heure</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {costPerHour.toFixed(0)} {cost.currency}
          </p>
        </div>
      </div>

      {/* Optimization Tip */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 text-sm">Conseil d'optimisation</h3>
            <p className="text-sm text-blue-700 mt-1">
              Réorganisez les points d'arrêt pour réduire la distance et économiser jusqu'à 15% sur les coûts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
