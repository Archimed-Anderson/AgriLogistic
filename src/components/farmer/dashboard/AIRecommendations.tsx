/**
 * AI Recommendations Component
 * Displays contextual AI-powered suggestions
 */
'use client';

import React from 'react';
import { Sparkles, TrendingUp, DollarSign, Leaf, AlertCircle } from 'lucide-react';
import type { AIRecommendation } from '@/types/farmer/dashboard';

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
  isLoading?: boolean;
}

export function AIRecommendations({ recommendations, isLoading }: AIRecommendationsProps) {
  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-xl" />;
  }

  const getTypeIcon = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'market':
        return <TrendingUp className="w-5 h-5" />;
      case 'financial':
        return <DollarSign className="w-5 h-5" />;
      case 'crop':
        return <Leaf className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: AIRecommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'medium':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const getImpactIcon = (type: AIRecommendation['impact']['type']) => {
    switch (type) {
      case 'revenue':
        return '💰';
      case 'cost':
        return '💸';
      case 'efficiency':
        return '⚡';
      case 'risk':
        return '🛡️';
      default:
        return '📊';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Recommandations IA</h2>
        <span className="ml-auto text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
          Propulsé par IA
        </span>
      </div>

      <div className="space-y-4">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
            >
              {/* Priority Badge */}
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getPriorityColor(rec.priority)} text-white`}>
                  {getTypeIcon(rec.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="font-medium">{rec.confidence}%</span>
                      <span>confiance</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>

                  {/* Impact */}
                  <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                    <span className="text-lg">{getImpactIcon(rec.impact.type)}</span>
                    <span className="text-sm font-medium text-gray-700">Impact estimé:</span>
                    <span className="text-sm font-bold text-green-600">
                      +{rec.impact.value} {rec.impact.unit}
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                      {rec.action}
                    </button>
                    <span className="text-xs text-gray-500">
                      Valide jusqu'au {new Date(rec.validUntil).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Aucune recommandation pour le moment</p>
            <p className="text-sm mt-1">L'IA analyse vos données...</p>
          </div>
        )}
      </div>

      {recommendations && recommendations.length > 0 && (
        <button className="w-full mt-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
          Voir toutes les recommandations →
        </button>
      )}
    </div>
  );
}
