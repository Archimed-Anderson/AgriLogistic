/**
 * Performance Charts Component
 * Visualizes key performance indicators using Recharts
 */
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import type { PerformanceMetrics } from '@/types/transporter';

interface PerformanceChartsProps {
  metrics: PerformanceMetrics;
}

export function PerformanceCharts({ metrics }: PerformanceChartsProps) {
  // Mock monthly data for line chart
  const revenueTrendData = [
    { name: 'Sem 1', revenue: 2500000, costs: 1800000 },
    { name: 'Sem 2', revenue: 3200000, costs: 2100000 },
    { name: 'Sem 3', revenue: 2800000, costs: 2000000 },
    { name: 'Sem 4', revenue: 4000000, costs: 2300000 },
  ];

  // Data for On-Time Delivery Pie Chart
  const onTimeData = [
    { name: "À l'heure", value: metrics.onTimeDeliveries, color: '#22c55e' },
    { name: 'En retard', value: metrics.lateDeliveries, color: '#ef4444' },
  ];

  // Data for Rating Distribution
  const ratingData = [
    { name: '5 ★', value: metrics.ratingDistribution[5] },
    { name: '4 ★', value: metrics.ratingDistribution[4] },
    { name: '3 ★', value: metrics.ratingDistribution[3] },
    { name: '2 ★', value: metrics.ratingDistribution[2] },
    { name: '1 ★', value: metrics.ratingDistribution[1] },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue & Costs Trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution Revenus vs Coûts</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF',
                    maximumFractionDigits: 0,
                  }).format(value)
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenus"
                stroke="#3b82f6"
                strokeWidth={3}
              />
              <Line type="monotone" dataKey="costs" name="Coûts" stroke="#f97316" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* On-Time Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Ponctualité des Livraisons</h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={onTimeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {onTimeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4">
          <p className="text-3xl font-bold text-gray-900">{metrics.onTimeRate}%</p>
          <p className="text-sm text-gray-500">Taux de ponctualité</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Satisfaction Client</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={40} />
              <Tooltip />
              <Bar dataKey="value" fill="#fbbf24" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
            <span className="text-2xl font-bold">{metrics.averageRating}</span>
            <span className="text-xl">★</span>
          </div>
          <p className="text-sm text-gray-500">Moyenne sur {metrics.totalRatings} avis</p>
        </div>
      </div>
    </div>
  );
}
