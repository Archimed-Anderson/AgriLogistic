/**
 * Route Optimizer Page
 * Complete route optimization interface with VRP algorithm, drag & drop, and export
 */
import React, { useState } from 'react';
import { RouteMap } from '@/components/transporter/routes/RouteMap';
import { StopsManager } from '@/components/transporter/routes/StopsManager';
import { CostCalculator } from '@/components/transporter/routes/CostCalculator';
import { ExportPanel } from '@/components/transporter/routes/ExportPanel';
import { useRouteOptimization } from '@/hooks/transporter/useRouteOptimization';
import { Sparkles, Plus, Save, RefreshCw } from 'lucide-react';
import type { Waypoint, Route, RouteOptimizationParams } from '@/types/transporter';

export default function RouteOptimizerPage() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    {
      id: '1',
      type: 'pickup',
      address: '123 Rue des Agriculteurs, Dakar',
      coordinates: [-17.4467, 14.6928],
      duration: 15,
      priority: 'high',
      contactName: 'Mamadou Diallo',
      contactPhone: '+221 77 123 4567',
    },
    {
      id: '2',
      type: 'delivery',
      address: '456 Avenue du Commerce, Thiès',
      coordinates: [-16.9252, 14.7886],
      duration: 20,
      priority: 'medium',
      contactName: 'Fatou Sall',
      contactPhone: '+221 77 234 5678',
    },
    {
      id: '3',
      type: 'pickup',
      address: '789 Route de Kaolack, Kaolack',
      coordinates: [-16.0725, 14.1522],
      duration: 10,
      priority: 'medium',
      contactName: 'Ibrahima Ndiaye',
      contactPhone: '+221 77 345 6789',
    },
    {
      id: '4',
      type: 'delivery',
      address: '321 Boulevard du Port, Dakar',
      coordinates: [-17.4567, 14.7028],
      duration: 15,
      priority: 'high',
      contactName: 'Aminata Touré',
      contactPhone: '+221 77 456 7890',
    },
  ]);

  const [optimizedRoute, setOptimizedRoute] = useState<Route | null>(null);
  const [allowReordering, setAllowReordering] = useState(true);

  const {
    optimizeRoute,
    recalculateRoute,
    exportToGPX,
    exportToGoogleMaps,
    isOptimizing,
    optimizationError,
  } = useRouteOptimization();

  const { distance, duration, cost } = recalculateRoute(waypoints);

  const handleOptimize = async () => {
    const params: RouteOptimizationParams = {
      waypoints,
      vehicleConstraints: {
        maxWeight: 5000,
        maxVolume: 20,
        hasRefrigeration: false,
        maxHeight: 3,
        maxWidth: 2.5,
        maxLength: 6,
      },
      optimizeFor: 'distance',
      respectTimeWindows: true,
      allowReordering,
    };

    try {
      const route = await optimizeRoute(params);
      setOptimizedRoute(route);
      setWaypoints(route.waypoints);
    } catch (error) {
      console.error('Optimization failed:', error);
    }
  };

  const handleAddWaypoint = () => {
    const newWaypoint: Waypoint = {
      id: `waypoint-${Date.now()}`,
      type: 'waypoint',
      address: 'Nouveau point',
      coordinates: [-17.4, 14.7],
      duration: 10,
      priority: 'medium',
    };
    setWaypoints([...waypoints, newWaypoint]);
  };

  const handleDeleteWaypoint = (waypointId: string) => {
    setWaypoints(waypoints.filter((wp) => wp.id !== waypointId));
  };

  const handleExportGPX = () => {
    if (!optimizedRoute) return;
    
    const gpx = exportToGPX(optimizedRoute);
    const blob = new Blob([gpx], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `route-${Date.now()}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportGoogleMaps = () => {
    if (!optimizedRoute) return;
    
    const url = exportToGoogleMaps(optimizedRoute);
    window.open(url, '_blank');
  };

  const currentRoute: Route = optimizedRoute || {
    id: 'current',
    name: 'Route actuelle',
    waypoints,
    optimized: false,
    totalDistance: distance,
    totalDuration: duration,
    estimatedCost: cost,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🗺️ Optimiseur de Routes
              </h1>
              <p className="text-sm text-gray-600">
                Algorithme VRP • {waypoints.length} points • {distance.toFixed(1)} km
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddWaypoint}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter</span>
              </button>
              <button
                onClick={handleOptimize}
                disabled={isOptimizing || waypoints.length < 2}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Optimisation...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Optimiser</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {optimizationError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{optimizationError}</p>
          </div>
        )}

        {optimizedRoute && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900">Route optimisée !</h3>
                <p className="text-sm text-green-700 mt-1">
                  Distance réduite de{' '}
                  {((1 - optimizedRoute.totalDistance / distance) * 100).toFixed(1)}% •
                  Économie estimée:{' '}
                  {(cost.total - optimizedRoute.estimatedCost.total).toLocaleString()} XOF
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Map */}
          <div className="lg:col-span-2 space-y-6">
            <RouteMap
              waypoints={waypoints}
              onWaypointsChange={setWaypoints}
              showRoute={true}
              height="600px"
            />

            <StopsManager
              waypoints={waypoints}
              onWaypointsChange={setWaypoints}
              onDeleteWaypoint={handleDeleteWaypoint}
            />
          </div>

          {/* Right Column - Cost & Export */}
          <div className="space-y-6">
            {/* Optimization Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Paramètres
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={allowReordering}
                    onChange={(e) => setAllowReordering(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Autoriser la réorganisation des points
                  </span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Optimiser pour
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="distance">Distance minimale</option>
                    <option value="time">Temps minimal</option>
                    <option value="cost">Coût minimal</option>
                  </select>
                </div>
              </div>
            </div>

            <CostCalculator
              cost={cost}
              distance={distance}
              duration={duration}
            />

            <ExportPanel
              route={currentRoute}
              onExportGPX={handleExportGPX}
              onExportGoogleMaps={handleExportGoogleMaps}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
