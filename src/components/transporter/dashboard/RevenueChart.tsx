/**
 * Revenue Chart Component
 * Displays revenue breakdown over time
 */
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { RevenueBreakdown } from '@/types/transporter';

interface RevenueChartProps {
  data: RevenueBreakdown[];
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-4 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    }),
    Marketplace: item.marketplace / 1000,
    Location: item.rental / 1000,
    Services: item.services / 1000,
    Bonus: item.bonuses / 1000,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Évolution des Revenus</h2>
          <p className="text-sm text-gray-600 mt-1">Revenus par source (en milliers XOF)</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            7 jours
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            30 jours
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            3 mois
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${value}K`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
            formatter={(value: number) => [`${value.toFixed(1)}K XOF`, '']}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
          <Line
            type="monotone"
            dataKey="Marketplace"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Location"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Services"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Bonus"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Marketplace</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {(data[data.length - 1]?.marketplace / 1000).toFixed(1)}K
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-600">Location</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {(data[data.length - 1]?.rental / 1000).toFixed(1)}K
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm text-gray-600">Services</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {(data[data.length - 1]?.services / 1000).toFixed(1)}K
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-sm text-gray-600">Bonus</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {(data[data.length - 1]?.bonuses / 1000).toFixed(1)}K
          </p>
        </div>
      </div>
    </div>
  );
}
