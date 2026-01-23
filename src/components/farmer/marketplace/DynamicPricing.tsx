/**
 * Dynamic Pricing Component
 * AI-powered price optimization with market analysis
 */
'use client';

import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Product, MarketAnalysis } from '@/types/farmer/marketplace';

interface DynamicPricingProps {
  product: Product;
  analysis: MarketAnalysis;
  isLoading?: boolean;
}

export function DynamicPricing({ product, analysis, isLoading }: DynamicPricingProps) {
  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  const priceDiff = product.price - analysis.marketAverage;
  const priceDiffPercent = (priceDiff / analysis.marketAverage) * 100;

  const getTrendIcon = (trend: MarketAnalysis['demandTrend']) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Prix Dynamique IA</h2>
        </div>
        <span className="flex items-center gap-1 text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
          <Sparkles className="w-3 h-3" />
          Optimisé par IA
        </span>
      </div>

      {/* Current vs Market */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-700 font-medium mb-1">Votre Prix</p>
          <p className="text-3xl font-bold text-blue-900">
            {(product.price / 1000).toFixed(1)}K XOF
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 font-medium mb-1">Moyenne Marché</p>
          <p className="text-3xl font-bold text-gray-900">
            {(analysis.marketAverage / 1000).toFixed(1)}K XOF
          </p>
          <div className="flex items-center gap-1 mt-1">
            {priceDiff < 0 ? (
              <span className="text-xs text-green-600 font-medium">
                -{Math.abs(priceDiffPercent).toFixed(1)}% moins cher
              </span>
            ) : (
              <span className="text-xs text-red-600 font-medium">
                +{priceDiffPercent.toFixed(1)}% plus cher
              </span>
            )}
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Recommandation IA</h3>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Min</p>
                <p className="text-lg font-bold text-gray-900">
                  {(analysis.priceRecommendation.min / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="text-center bg-white rounded-lg p-2">
                <p className="text-xs text-green-600 font-medium mb-1">Optimal</p>
                <p className="text-2xl font-bold text-green-600">
                  {(analysis.priceRecommendation.optimal / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Max</p>
                <p className="text-lg font-bold text-gray-900">
                  {(analysis.priceRecommendation.max / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700 bg-white/50 rounded p-2">
              💡 {analysis.priceRecommendation.reasoning}
            </p>
            {product.price !== analysis.priceRecommendation.optimal && (
              <button className="mt-3 w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                Appliquer le prix optimal (+
                {(((analysis.priceRecommendation.optimal - product.price) / product.price) * 100).toFixed(0)}
                % de revenus)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Market Trend */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Tendance de la demande</h3>
          <div className="flex items-center gap-2">
            {getTrendIcon(analysis.demandTrend)}
            <span className="text-sm font-medium capitalize">{analysis.demandTrend}</span>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Saisonnalité</span>
            <span className="text-sm font-semibold text-gray-900">{analysis.seasonality}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${analysis.seasonality}%` }}
            />
          </div>
        </div>
      </div>

      {/* Competitors */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Analyse Concurrentielle</h3>
        <div className="space-y-2">
          {analysis.competitors.map((comp, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{comp.seller}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                  <span>Stock: {comp.stock} kg</span>
                  <span className="flex items-center gap-1">
                    ⭐ {comp.rating}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {(comp.price / 1000).toFixed(1)}K
                </p>
                <p className={`text-xs ${
                  comp.price > product.price ? 'text-green-600' : 'text-red-600'
                }`}>
                  {comp.price > product.price ? '+' : ''}
                  {(((comp.price - product.price) / product.price) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price History Chart */}
      {product.priceHistory && product.priceHistory.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Historique des Prix</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={product.priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { month: 'short' })}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                formatter={(value: number) => `${(value / 1000).toFixed(1)}K XOF`}
                labelFormatter={(date) => new Date(date).toLocaleDateString('fr-FR')}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                strokeWidth={2}
                name="Votre prix"
              />
              <Line
                type="monotone"
                dataKey="marketAverage"
                stroke="#6b7280"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Moyenne marché"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
