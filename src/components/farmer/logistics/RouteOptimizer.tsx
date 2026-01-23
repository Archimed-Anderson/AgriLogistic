/**
 * Route Optimizer Component
 * VRP algorithm visualization and route planning
 */
'use client';

import React from 'react';
import { Route as RouteIcon, TrendingUp, Clock, MapPin, Zap } from 'lucide-react';
import type { Route } from '@/types/farmer/logistics';

interface RouteOptimizerProps {
  routes: Route[];
  isLoading?: boolean;
}

export function RouteOptimizer({ routes, isLoading }: RouteOptimizerProps) {
  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  const getAlgorithmLabel = (algorithm: Route['optimization']['algorithm']) => {
    const labels = {
      nearest_neighbor: 'Plus Proche Voisin',
      genetic: 'Algorithme Génétique',
      ant_colony: 'Colonie de Fourmis',
    };
    return labels[algorithm];
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
          <RouteIcon className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Optimisation des Routes</h2>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
          + Nouvelle Route
        </button>
      </div>

      {routes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <RouteIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">Aucune route planifiée</p>
          <p className="text-sm mt-1">Créez une route optimisée pour vos livraisons</p>
        </div>
      ) : (
        <div className="space-y-6">
          {routes.map((route) => (
            <div key={route.id} className="border border-gray-200 rounded-lg p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{route.name}</h3>
                  <p className="text-sm text-gray-600">
                    {route.deliveries.length} livraison{route.deliveries.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(route.optimization.score)}`}>
                    {route.optimization.score}
                  </div>
                  <p className="text-xs text-gray-500">Score d'optimisation</p>
                </div>
              </div>

              {/* Optimization Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <MapPin className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-lg font-bold text-blue-900">
                    {route.optimization.totalDistance.toFixed(1)} km
                  </p>
                  <p className="text-xs text-blue-700">Distance totale</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                  <p className="text-lg font-bold text-purple-900">
                    {route.optimization.totalDuration} min
                  </p>
                  <p className="text-xs text-purple-700">Durée estimée</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
                  <p className="text-lg font-bold text-green-900">
                    {(route.optimization.savings.cost / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs text-green-700">Économies</p>
                </div>
              </div>

              {/* Algorithm Info */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Algorithme: {getAlgorithmLabel(route.optimization.algorithm)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-600">Distance économisée:</span>
                    <span className="ml-1 font-semibold text-gray-900">
                      {route.optimization.savings.distance.toFixed(1)} km
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Temps gagné:</span>
                    <span className="ml-1 font-semibold text-gray-900">
                      {route.optimization.savings.time} min
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Coût réduit:</span>
                    <span className="ml-1 font-semibold text-gray-900">
                      {(route.optimization.savings.cost / 1000).toFixed(1)}K XOF
                    </span>
                  </div>
                </div>
              </div>

              {/* Waypoints */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Points de passage</h4>
                <div className="space-y-2">
                  {route.waypoints.map((waypoint, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {waypoint.sequence}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 text-sm">{waypoint.address}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            waypoint.type === 'pickup'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {waypoint.type === 'pickup' ? '📦 Enlèvement' : '🏠 Livraison'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {new Date(waypoint.scheduledTime).toLocaleString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div>
                        {waypoint.status === 'completed' ? (
                          <span className="text-green-600 text-xl">✓</span>
                        ) : waypoint.status === 'skipped' ? (
                          <span className="text-red-600 text-xl">✗</span>
                        ) : (
                          <span className="text-gray-400 text-xl">○</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                  Démarrer la route
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                  Modifier
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                  Carte
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Optimization Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Conseils d'optimisation</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Groupez les livraisons par zone géographique</li>
          <li>• Planifiez les livraisons urgentes en priorité</li>
          <li>• Utilisez l'algorithme génétique pour &gt;10 points</li>
          <li>• Tenez compte des heures de pointe</li>
        </ul>
      </div>
    </div>
  );
}
