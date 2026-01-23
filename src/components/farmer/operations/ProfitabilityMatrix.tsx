/**
 * Profitability Matrix Component
 * ROI analysis by crop
 */
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { CropProfitability } from '@/types/farmer/operations';

interface ProfitabilityMatrixProps {
  profitability: CropProfitability[];
  isLoading?: boolean;
}

export function ProfitabilityMatrix({ profitability, isLoading }: ProfitabilityMatrixProps) {
  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">Rentabilité par Culture</h2>
      </div>

      {profitability.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucune donnée de rentabilité</p>
        </div>
      ) : (
        <div className="space-y-6">
          {profitability.map((crop) => (
            <div key={crop.cropId} className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{crop.cropName}</h3>
                  <p className="text-sm text-gray-600">{crop.area} hectares</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {crop.roi.toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-500">ROI</p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Revenus</p>
                  <p className="text-lg font-bold text-green-700">
                    {(crop.totalRevenue / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Coûts</p>
                  <p className="text-lg font-bold text-red-700">
                    {(crop.totalCosts / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Profit</p>
                  <p className="text-lg font-bold text-blue-700">
                    {(crop.profit / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Marge</p>
                  <p className="text-lg font-bold text-purple-700">
                    {crop.profitMargin.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Répartition des coûts</p>
                <div className="space-y-2">
                  {crop.costBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{item.category}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {(item.amount / 1000).toFixed(1)}K ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
