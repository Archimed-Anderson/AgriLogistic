/**
 * Efficiency Metrics Component
 * Displays operational efficiency KPIs
 */
import React from 'react';
import { Truck, Fuel, Route, Leaf } from 'lucide-react';
import type { PerformanceMetrics } from '@/types/transporter';

interface EfficiencyMetricsProps {
  metrics: PerformanceMetrics;
}

export function EfficiencyMetrics({ metrics }: EfficiencyMetricsProps) {
  const cards = [
    {
      label: 'Conso Moyenne',
      value: metrics.fuelEfficiency,
      unit: 'L/100km',
      icon: Fuel,
      color: 'blue',
      description: 'Efficacité carburant',
    },
    {
      label: 'Distance à vide',
      value: metrics.emptyKmRate,
      unit: '%',
      icon: Route,
      color: 'orange',
      description: 'Optimisation trajets',
    },
    {
      label: 'Distance / Livraison',
      value: metrics.averageKmPerDelivery,
      unit: 'km',
      icon: Truck,
      color: 'purple',
      description: 'Moyenne parcours',
    },
    {
      label: 'Empreinte Carbone',
      value: (metrics.averageKmPerDelivery * 0.82).toFixed(1), // Estimate mock
      unit: 'kg CO2',
      icon: Leaf,
      color: 'green',
      description: 'Par livraison (est.)',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700',
      orange: 'bg-orange-50 text-orange-700',
      purple: 'bg-purple-50 text-purple-700',
      green: 'bg-green-50 text-green-700',
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">{card.label}</span>
              <div className={`p-2 rounded-lg ${getColorClasses(card.color)}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{card.value}</span>
              <span className="text-sm font-medium text-gray-500">{card.unit}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
}
