/**
 * Marketplace Filters Component
 * Filter loads by route, cargo type, vehicle requirements
 */
import React from 'react';
import { Filter, MapPin, Truck, Calendar } from 'lucide-react';

interface LoadFiltersProps {
  // Add props as needed based on actual filter implementation
}

export function LoadFilters(props: LoadFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" /> Filtres
        </h2>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
          Réinitialiser
        </button>
      </div>

      <div className="space-y-6">
        {/* Route */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" /> Itinéraire
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Départ (ex: Dakar)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="Arrivée (ex: Touba)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="nearby" className="rounded text-blue-600" />
              <label htmlFor="nearby" className="text-sm text-gray-600">
                Rayon de 50 km
              </label>
            </div>
          </div>
        </div>

        {/* Date */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" /> Dates
          </h3>
          <div className="space-y-3">
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Cargo */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-500" /> Caractéristiques
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="rounded text-blue-600" />
              <span>Réfrigéré</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="rounded text-blue-600" />
              <span>Matières Dangereuses</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="rounded text-blue-600" />
              <span>Chargement Complet (FTL)</span>
            </label>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Prix Minimum</h3>
          <input
            type="range"
            min="0"
            max="1000000"
            step="50000"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0 XOF</span>
            <span>1M+ XOF</span>
          </div>
        </div>

        <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
}
