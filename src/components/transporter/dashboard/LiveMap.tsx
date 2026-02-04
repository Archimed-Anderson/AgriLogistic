/**
 * Live Map Component
 * Displays real-time map with active deliveries and routes
 */
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Shipment } from '@/types/transporter';

// Set Mapbox access token (should be in environment variables)
mapboxgl.accessToken =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  'pk.eyJ1IjoiYWdyb2xvZ2lzdGljIiwiYSI6ImNsZGV4YW1wbGUifQ.example';

interface LiveMapProps {
  shipments: Shipment[];
  height?: string;
}

export function LiveMap({ shipments, height = '400px' }: LiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-17.4467, 14.6928], // Dakar, Senegal
      zoom: 10,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add markers for each shipment
    shipments.forEach((shipment) => {
      if (!map.current) return;

      // Pickup marker (green)
      const pickupEl = document.createElement('div');
      pickupEl.className =
        'w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs';
      pickupEl.innerHTML = 'P';

      const pickupMarker = new mapboxgl.Marker(pickupEl)
        .setLngLat(shipment.pickupCoordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">Pickup</h3>
              <p class="text-xs text-gray-600">${shipment.pickupAddress}</p>
              <p class="text-xs text-gray-600 mt-1">${shipment.cargo.description}</p>
            </div>
          `)
        )
        .addTo(map.current);

      markers.current.push(pickupMarker);

      // Delivery marker (blue)
      const deliveryEl = document.createElement('div');
      deliveryEl.className =
        'w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs';
      deliveryEl.innerHTML = 'D';

      const deliveryMarker = new mapboxgl.Marker(deliveryEl)
        .setLngLat(shipment.deliveryCoordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">Delivery</h3>
              <p class="text-xs text-gray-600">${shipment.deliveryAddress}</p>
              <p class="text-xs text-gray-600 mt-1">${shipment.deliveryContact.name}</p>
            </div>
          `)
        )
        .addTo(map.current);

      markers.current.push(deliveryMarker);
    });

    // Fit map to show all markers
    if (markers.current.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      shipments.forEach((shipment) => {
        bounds.extend(shipment.pickupCoordinates);
        bounds.extend(shipment.deliveryCoordinates);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [shipments]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Carte en Temps Réel</h2>
          <p className="text-sm text-gray-600 mt-1">
            {shipments.length} livraison{shipments.length > 1 ? 's' : ''} active
            {shipments.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">Pickup</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-sm text-gray-600">Delivery</span>
          </div>
        </div>
      </div>
      <div ref={mapContainer} style={{ height }} />
    </div>
  );
}
