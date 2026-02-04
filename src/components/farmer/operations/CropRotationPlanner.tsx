/**
 * Crop Rotation Planner Component
 * AI-powered crop rotation planning
 */
'use client';

import React from 'react';
import { Sparkles, TrendingUp, Leaf, Calendar } from 'lucide-react';
import type { CropRotationPlan } from '@/types/farmer/operations';

interface CropRotationPlannerProps {
  plans: CropRotationPlan[];
  isLoading?: boolean;
}

export function CropRotationPlanner({ plans, isLoading }: CropRotationPlannerProps) {
  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  const getImpactColor = (impact: CropRotationPlan['soilHealthImpact']) => {
    switch (impact) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Planification des Rotations</h2>
        </div>
        <span className="flex items-center gap-1 text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
          <Sparkles className="w-3 h-3" />
          IA
        </span>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Leaf className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">Aucun plan de rotation</p>
          <p className="text-sm mt-1">
            L'IA analysera vos champs pour proposer des rotations optimales
          </p>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Générer un plan IA
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {plans.map((plan) => (
            <div key={plan.id} className="border border-gray-200 rounded-lg p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{plan.fieldName}</h3>
                  <p className="text-sm text-gray-600">
                    Culture actuelle: <span className="font-medium">{plan.currentCrop}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(plan.aiScore)}`}>
                    {plan.aiScore}/100
                  </div>
                  <p className="text-xs text-gray-500">Score IA</p>
                </div>
              </div>

              {/* Rotation Sequence */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Séquence de rotation recommandée
                </h4>
                <div className="space-y-3">
                  {plan.rotationSequence.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{step.crop}</p>
                          <span className="text-sm text-gray-600">{step.season}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {step.benefits.map((benefit, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded"
                            >
                              ✓ {benefit}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          Rendement estimé: {step.estimatedYield} kg/ha
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact */}
              <div className={`p-3 rounded-lg mb-4 ${getImpactColor(plan.soilHealthImpact)}`}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Impact sur la santé du sol:{' '}
                    <span className="capitalize">{plan.soilHealthImpact}</span>
                  </span>
                </div>
              </div>

              {/* Recommendations */}
              {plan.recommendations.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900 mb-2">💡 Recommandations IA:</p>
                  <ul className="space-y-1">
                    {plan.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                  Appliquer ce plan
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
