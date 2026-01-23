/**
 * Delivery Map with Leaflet (Open Source)
 * Free alternative for delivery tracking
 */
'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Navigation } from 'lucide-react';
import type { Delivery } from '@/types/farmer/logistics';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface DeliveryMapLeafletProps {
  delivery: Delivery;
}

export function DeliveryMapLeaflet({ delivery }: DeliveryMapLeafletProps) {
  const center: [number, number] = [
    delivery.pickup.coordinates[1],
    delivery.pickup.coordinates[0],
  ];

  // Create custom icons
  const createMarkerIcon = (label: string, color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">${label}</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  const currentLocationIcon = L.divIcon({
    className: 'current-location',
    html: '<div style="width: 24px; height: 24px; background-color: #ef4444; border-radius: 50%; animation: pulse 2s infinite; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  // Route coordinates
  const routeCoordinates: [number, number][] = delivery.route
    ? delivery.route.waypoints.map((wp) => [wp[1], wp[0]])
    : [];

  return (
    <div className="relative h-64 rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />

        {/* Pickup Marker */}
        <Marker
          position={[delivery.pickup.coordinates[1], delivery.pickup.coordinates[0]]}
          icon={createMarkerIcon('A', '#2563eb')}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-sm mb-1">📦 Enlèvement</h3>
              <p className="text-xs text-gray-700 mb-1">{delivery.pickup.address}</p>
              <p className="text-xs text-gray-600">{delivery.pickup.contactName}</p>
              <p className="text-xs text-gray-600">{delivery.pickup.contactPhone}</p>
            </div>
          </Popup>
        </Marker>

        {/* Dropoff Marker */}
        <Marker
          position={[delivery.dropoff.coordinates[1], delivery.dropoff.coordinates[0]]}
          icon={createMarkerIcon('B', '#10b981')}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-sm mb-1">🏠 Livraison</h3>
              <p className="text-xs text-gray-700 mb-1">{delivery.dropoff.address}</p>
              <p className="text-xs text-gray-600">{delivery.dropoff.contactName}</p>
              <p className="text-xs text-gray-600">{delivery.dropoff.contactPhone}</p>
            </div>
          </Popup>
        </Marker>

        {/* Current Location */}
        {delivery.tracking.currentLocation && (
          <Marker
            position={[
              delivery.tracking.currentLocation[1],
              delivery.tracking.currentLocation[0],
            ]}
            icon={currentLocationIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-1">🚚 Position actuelle</h3>
                {delivery.tracking.eta && (
                  <p className="text-xs text-gray-600">
                    ETA: {new Date(delivery.tracking.eta).toLocaleTimeString('fr-FR')}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: '#3b82f6',
              weight: 4,
              dashArray: '10, 10',
              opacity: 0.7,
            }}
          />
        )}
      </MapContainer>

      {/* Overlay Info */}
      {delivery.tracking.currentLocation && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-900">En transit</span>
          </div>
          {delivery.tracking.eta && (
            <p className="text-xs text-gray-600">
              ETA: {new Date(delivery.tracking.eta).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      )}

      {/* Distance Info */}
      {delivery.route && (
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{delivery.route.distance.toFixed(1)} km</p>
              <p className="text-xs text-gray-600">{delivery.route.duration} min</p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
      `}</style>
    </div>
  );
}
