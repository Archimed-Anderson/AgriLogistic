/**
 * Interactive Delivery Map with Mapbox
 * Real-time delivery tracking with route visualization
 */
'use client';

import React, { useState, useEffect } from 'react';
import Map, { Marker, Source, Layer, Popup } from 'react-map-gl';
import { MapPin, Navigation } from 'lucide-react';
import type { Delivery } from '@/types/farmer/logistics';
import 'mapbox-gl/dist/mapbox-gl.css';

interface DeliveryMapProps {
  delivery: Delivery;
}

export function DeliveryMap({ delivery }: DeliveryMapProps) {
  const [viewport, setViewport] = useState({
    longitude: delivery.pickup.coordinates[0],
    latitude: delivery.pickup.coordinates[1],
    zoom: 11,
  });

  const [showPopup, setShowPopup] = useState<'pickup' | 'dropoff' | null>(null);

  // Center map on current location if available
  useEffect(() => {
    if (delivery.tracking.currentLocation) {
      setViewport((prev) => ({
        ...prev,
        longitude: delivery.tracking.currentLocation![0],
        latitude: delivery.tracking.currentLocation![1],
      }));
    }
  }, [delivery.tracking.currentLocation]);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!mapboxToken) {
    return (
      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
        <p className="text-gray-600">Mapbox Token Required</p>
      </div>
    );
  }

  return (
    <div className="relative h-64 rounded-lg overflow-hidden">
      <Map
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        mapboxAccessToken={mapboxToken}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {/* Pickup Marker */}
        <Marker
          longitude={delivery.pickup.coordinates[0]}
          latitude={delivery.pickup.coordinates[1]}
          onClick={() => setShowPopup('pickup')}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform">
            A
          </div>
        </Marker>

        {/* Dropoff Marker */}
        <Marker
          longitude={delivery.dropoff.coordinates[0]}
          latitude={delivery.dropoff.coordinates[1]}
          onClick={() => setShowPopup('dropoff')}
        >
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform">
            B
          </div>
        </Marker>

        {/* Current Location Marker */}
        {delivery.tracking.currentLocation && (
          <Marker
            longitude={delivery.tracking.currentLocation[0]}
            latitude={delivery.tracking.currentLocation[1]}
          >
            <div className="relative">
              <div className="w-6 h-6 bg-red-600 rounded-full animate-pulse shadow-lg" />
              <div className="absolute inset-0 w-6 h-6 bg-red-600 rounded-full animate-ping opacity-75" />
            </div>
          </Marker>
        )}

        {/* Route Line */}
        {delivery.route && (
          <Source
            type="geojson"
            data={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: delivery.route.waypoints,
              },
            }}
          >
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#3b82f6',
                'line-width': 4,
                'line-dasharray': [2, 2],
              }}
            />
          </Source>
        )}

        {/* Pickup Popup */}
        {showPopup === 'pickup' && (
          <Popup
            longitude={delivery.pickup.coordinates[0]}
            latitude={delivery.pickup.coordinates[1]}
            onClose={() => setShowPopup(null)}
            closeButton={true}
          >
            <div className="p-2">
              <h3 className="font-semibold text-sm mb-1">📦 Enlèvement</h3>
              <p className="text-xs text-gray-700 mb-1">{delivery.pickup.address}</p>
              <p className="text-xs text-gray-600">{delivery.pickup.contactName}</p>
              <p className="text-xs text-gray-600">{delivery.pickup.contactPhone}</p>
            </div>
          </Popup>
        )}

        {/* Dropoff Popup */}
        {showPopup === 'dropoff' && (
          <Popup
            longitude={delivery.dropoff.coordinates[0]}
            latitude={delivery.dropoff.coordinates[1]}
            onClose={() => setShowPopup(null)}
            closeButton={true}
          >
            <div className="p-2">
              <h3 className="font-semibold text-sm mb-1">🏠 Livraison</h3>
              <p className="text-xs text-gray-700 mb-1">{delivery.dropoff.address}</p>
              <p className="text-xs text-gray-600">{delivery.dropoff.contactName}</p>
              <p className="text-xs text-gray-600">{delivery.dropoff.contactPhone}</p>
            </div>
          </Popup>
        )}
      </Map>

      {/* Map Overlay Info */}
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
    </div>
  );
}
