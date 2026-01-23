/**
 * Load Card Component
 * Displays individual load details in the marketplace
 */
import React from 'react';
import { Calendar, Scale, Box, Star, AlertTriangle, Truck } from 'lucide-react';
import type { Load } from '@/types/transporter';

interface LoadCardProps {
  load: Load;
  onViewDetails: (load: Load) => void;
  onBid: (load: Load) => void;
}

export function LoadCard({ load, onViewDetails, onBid }: LoadCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: load.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{load.title}</h3>
              {load.cargo.requiresRefrigeration && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  ❄️ Frigo
                </span>
              )}
              {load.cargo.hazardous && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> ADR
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4" /> {load.distance} km
              </span>
              <span>•</span>
              <span>Posté il y a 2h</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(load.offeredPrice)}</p>
            {load.biddingEnabled && (
              <p className="text-xs text-blue-600 font-medium">Enchères ouvertes</p>
            )}
          </div>
        </div>

        {/* Route Visualization */}
        <div className="flex items-center gap-3 mb-6 relative">
          <div className="absolute left-2.5 top-8 bottom-0 w-0.5 bg-gray-200 h-10 -z-10" />
          
          <div className="flex-1 space-y-4">
            {/* Pickup */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full border-4 border-green-500 bg-white" />
              <div>
                <p className="text-sm font-medium text-gray-900">{load.pickupLocation}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(load.pickupDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full border-4 border-blue-500 bg-white" />
              <div>
                <p className="text-sm font-medium text-gray-900">{load.deliveryLocation}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(load.deliveryDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cargo Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Scale className="w-4 h-4" />
              <span>Poids</span>
            </div>
            <p className="font-semibold text-gray-900">{(load.cargo.weight / 1000).toFixed(1)} T</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Box className="w-4 h-4" />
              <span>Volume</span>
            </div>
            <p className="font-semibold text-gray-900">{load.cargo.volume} m³</p>
          </div>
        </div>

        {/* Shipper Info */}
        <div className="flex items-center gap-3 mb-6 p-3 border border-gray-100 rounded-lg">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
            {load.shipperName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{load.shipperName}</p>
            <div className="flex items-center gap-1 text-xs text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <span>{load.shipperRating}</span>
              <span className="text-gray-400">• (50+ envois)</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onViewDetails(load)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Détails
          </button>
          <button
            onClick={() => onBid(load)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {load.biddingEnabled ? 'Placer une offre' : 'Accepter l\'offre'}
          </button>
        </div>
      </div>
    </div>
  );
}
