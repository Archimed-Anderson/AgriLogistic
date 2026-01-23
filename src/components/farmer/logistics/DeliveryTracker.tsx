/**
 * Delivery Tracker Component
 * Real-time delivery tracking with map
 */
'use client';

import React from 'react';
import { Package, MapPin, Clock, Phone, User, TrendingUp } from 'lucide-react';
import type { Delivery } from '@/types/farmer/logistics';

interface DeliveryTrackerProps {
  deliveries: Delivery[];
  isLoading?: boolean;
}

export function DeliveryTracker({ deliveries, isLoading }: DeliveryTrackerProps) {
  const [selectedDelivery, setSelectedDelivery] = React.useState<string | null>(
    deliveries && deliveries.length > 0 ? deliveries[0].id : null
  );

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  const getStatusConfig = (status: Delivery['status']) => {
    const configs = {
      pending: { color: 'bg-gray-100 text-gray-700', label: 'En attente', icon: '⏳' },
      assigned: { color: 'bg-blue-100 text-blue-700', label: 'Assignée', icon: '👤' },
      picked_up: { color: 'bg-purple-100 text-purple-700', label: 'Récupérée', icon: '📦' },
      in_transit: { color: 'bg-indigo-100 text-indigo-700', label: 'En transit', icon: '🚚' },
      delivered: { color: 'bg-green-100 text-green-700', label: 'Livrée', icon: '✅' },
      failed: { color: 'bg-red-100 text-red-700', label: 'Échec', icon: '❌' },
    };
    return configs[status];
  };

  const getPriorityColor = (priority: Delivery['priority']) => {
    const colors = {
      low: 'text-gray-600',
      normal: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    };
    return colors[priority];
  };

  const currentDelivery = deliveries.find(d => d.id === selectedDelivery);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Suivi des Livraisons</h2>
        </div>
        <span className="text-sm text-gray-600">
          {deliveries.filter(d => d.status === 'in_transit').length} en cours
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery List */}
        <div className="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto">
          {deliveries.map((delivery) => {
            const statusConfig = getStatusConfig(delivery.status);
            const isSelected = delivery.id === selectedDelivery;

            return (
              <button
                key={delivery.id}
                onClick={() => setSelectedDelivery(delivery.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{delivery.deliveryNumber}</p>
                    <p className="text-xs text-gray-500">Commande #{delivery.orderId}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusConfig.color}`}>
                    {statusConfig.icon} {statusConfig.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${getPriorityColor(delivery.priority)}`}>
                    {delivery.priority === 'urgent' ? '🔥 Urgent' : 
                     delivery.priority === 'high' ? '⚡ Prioritaire' : 'Normal'}
                  </span>
                  {delivery.tracking.progress !== undefined && (
                    <span className="text-gray-600">{delivery.tracking.progress}%</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Delivery Details */}
        {currentDelivery && (
          <div className="lg:col-span-2 space-y-4">
            {/* Map Placeholder */}
            <div className="relative h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 font-medium">Carte de Suivi en Temps Réel</p>
                  <p className="text-sm text-gray-500 mt-1">Intégration Mapbox en cours...</p>
                </div>
              </div>
              {currentDelivery.tracking.currentLocation && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-900">Position actuelle</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {currentDelivery.tracking.currentLocation[0].toFixed(4)}, {currentDelivery.tracking.currentLocation[1].toFixed(4)}
                  </p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progression</span>
                <span className="text-sm font-semibold text-gray-900">
                  {currentDelivery.tracking.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${currentDelivery.tracking.progress}%` }}
                />
              </div>
              {currentDelivery.tracking.eta && (
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>
                    ETA: {new Date(currentDelivery.tracking.eta).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Pickup & Dropoff */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    A
                  </div>
                  <span className="font-semibold text-gray-900">Enlèvement</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{currentDelivery.pickup.address}</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{currentDelivery.pickup.contactName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{currentDelivery.pickup.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(currentDelivery.pickup.scheduledTime).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    B
                  </div>
                  <span className="font-semibold text-gray-900">Livraison</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{currentDelivery.dropoff.address}</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{currentDelivery.dropoff.contactName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{currentDelivery.dropoff.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(currentDelivery.dropoff.scheduledTime).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carrier Info */}
            {currentDelivery.carrier && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Transporteur</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Nom</p>
                    <p className="font-medium text-gray-900">{currentDelivery.carrier.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Véhicule</p>
                    <p className="font-medium text-gray-900">{currentDelivery.carrier.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Immatriculation</p>
                    <p className="font-medium text-gray-900">{currentDelivery.carrier.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Contact</p>
                    <p className="font-medium text-gray-900">{currentDelivery.carrier.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Articles ({currentDelivery.items.length})</h3>
              <div className="space-y-2">
                {currentDelivery.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-xs text-gray-600">
                        {item.quantity} unités • {item.weight} kg
                        {item.fragile && ' • Fragile'}
                        {item.temperature && ` • ${item.temperature}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Coût Total</span>
                <span className="text-2xl font-bold text-green-600">
                  {(currentDelivery.cost.total / 1000).toFixed(1)}K XOF
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
