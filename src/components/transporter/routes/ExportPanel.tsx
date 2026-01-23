/**
 * Export Panel Component
 * Export route to various formats (GPX, Google Maps, Waze)
 */
import React from 'react';
import { Download, Map, Navigation, Share2 } from 'lucide-react';
import type { Route } from '@/types/transporter';

interface ExportPanelProps {
  route: Route;
  onExportGPX: () => void;
  onExportGoogleMaps: () => void;
}

export function ExportPanel({ route, onExportGPX, onExportGoogleMaps }: ExportPanelProps) {
  const handleShareWaze = () => {
    // Waze deep link format
    const firstWaypoint = route.waypoints[0];
    const wazeUrl = `https://waze.com/ul?ll=${firstWaypoint.coordinates[1]},${firstWaypoint.coordinates[0]}&navigate=yes`;
    window.open(wazeUrl, '_blank');
  };

  const handleCopyToClipboard = async () => {
    const routeText = route.waypoints
      .map((wp, i) => `${i + 1}. ${wp.address}`)
      .join('\n');
    
    try {
      await navigator.clipboard.writeText(routeText);
      alert('Route copiée dans le presse-papiers !');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Exporter la Route</h2>
          <p className="text-sm text-gray-600 mt-1">
            {route.waypoints.length} points • {route.totalDistance.toFixed(1)} km
          </p>
        </div>
        <button
          onClick={handleCopyToClipboard}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Copier</span>
        </button>
      </div>

      <div className="space-y-3">
        {/* GPX Export */}
        <button
          onClick={onExportGPX}
          className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:shadow-md transition-all group"
        >
          <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <Download className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-gray-900">Fichier GPX</h3>
            <p className="text-sm text-gray-600">
              Pour GPS Garmin, TomTom, etc.
            </p>
          </div>
          <Navigation className="w-5 h-5 text-green-600" />
        </button>

        {/* Google Maps Export */}
        <button
          onClick={onExportGoogleMaps}
          className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:shadow-md transition-all group"
        >
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Map className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-gray-900">Google Maps</h3>
            <p className="text-sm text-gray-600">
              Ouvrir dans Google Maps
            </p>
          </div>
          <Navigation className="w-5 h-5 text-blue-600" />
        </button>

        {/* Waze Export */}
        <button
          onClick={handleShareWaze}
          className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:shadow-md transition-all group"
        >
          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Navigation className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-gray-900">Waze</h3>
            <p className="text-sm text-gray-600">
              Ouvrir dans Waze
            </p>
          </div>
          <Navigation className="w-5 h-5 text-purple-600" />
        </button>
      </div>

      {/* Route Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 text-sm mb-3">Résumé de la route</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Distance totale</span>
            <span className="font-medium text-gray-900">{route.totalDistance.toFixed(1)} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Durée estimée</span>
            <span className="font-medium text-gray-900">
              {Math.floor(route.totalDuration / 60)}h {Math.round(route.totalDuration % 60)}min
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Coût estimé</span>
            <span className="font-medium text-gray-900">
              {route.estimatedCost.total.toLocaleString()} {route.estimatedCost.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Points d'arrêt</span>
            <span className="font-medium text-gray-900">{route.waypoints.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
