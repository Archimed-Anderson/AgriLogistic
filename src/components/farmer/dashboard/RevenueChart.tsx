/**
 * Revenue Chart Component
 * Visualizes multi-source revenue with Recharts
 */
'use client';

import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { RevenueData } from '@/types/farmer/dashboard';

interface RevenueChartProps {
  data: RevenueData[];
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-80 rounded-xl" />;
  }

  const formatCurrency = (value: number) => {
    return `${(value / 1000).toFixed(0)}K XOF`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-semibold">{formatCurrency(entry.value)}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between gap-4 text-sm font-bold">
              <span>Total:</span>
              <span>{formatCurrency(payload.reduce((sum: number, entry: any) => sum + entry.value, 0))}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Évolution des Revenus</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 text-sm rounded-lg ${
              chartType === 'area'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Aires
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-sm rounded-lg ${
              chartType === 'line'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Lignes
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'area' ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
            />
            <Area
              type="monotone"
              dataKey="marketplace"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Marketplace"
            />
            <Area
              type="monotone"
              dataKey="rental"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.6}
              name="Location"
            />
            <Area
              type="monotone"
              dataKey="services"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Services"
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
            />
            <Line
              type="monotone"
              dataKey="marketplace"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              name="Marketplace"
            />
            <Line
              type="monotone"
              dataKey="rental"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 4 }}
              name="Location"
            />
            <Line
              type="monotone"
              dataKey="services"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              name="Services"
            />
          </LineChart>
        )}
      </ResponsiveContainer>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-gray-600">Marketplace</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(data[data.length - 1]?.marketplace || 0)}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xs text-gray-600">Location</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(data[data.length - 1]?.rental || 0)}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-600">Services</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(data[data.length - 1]?.services || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
