/**
 * Route Map Component
 * Interactive map with draggable waypoint markers for route optimization
 */
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Waypoint } from '@/types/transporter';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWdyb2xvZ2lzdGljIiwiYSI6ImNsZGV4YW1wbGUifQ.example';

interface RouteMapProps {
  waypoints: Waypoint[];
  onWaypointsChange: (waypoints: Waypoint[]) => void;
  showRoute?: boolean;
  height?: string;
}

export function RouteMap({
  waypoints,
  onWaypointsChange,
  showRoute = true,
  height = '600px',
}: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [selectedWaypoint, setSelectedWaypoint] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-17.4467, 14.6928],
      zoom: 10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Add click handler to add new waypoints
    map.current.on('click', (e) => {
      if (selectedWaypoint) {
        // Update selected waypoint position
        const updated = waypoints.map((wp) =>
          wp.id === selectedWaypoint
            ? { ...wp, coordinates: [e.lngLat.lng, e.lngLat.lat] as [number, number] }
            : wp
        );
        onWaypointsChange(updated);
        setSelectedWaypoint(null);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when waypoints change
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    Object.values(markers.current).forEach((marker) => marker.remove());
    markers.current = {};

    // Add new markers
    waypoints.forEach((waypoint, index) => {
      if (!map.current) return;

      const el = document.createElement('div');
      el.className = `cursor-move relative`;
      
      const color =
        waypoint.type === 'pickup'
          ? 'bg-green-500'
          : waypoint.type === 'delivery'
          ? 'bg-blue-500'
          : 'bg-gray-500';

      el.innerHTML = `
        <div class="w-10 h-10 ${color} rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm">
          ${index + 1}
        </div>
        ${
          waypoint.priority === 'urgent'
            ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>'
            : ''
        }
      `;

      const marker = new mapboxgl.Marker({
        element: el,
        draggable: true,
      })
        .setLngLat(waypoint.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${waypoint.type === 'pickup' ? 'Pickup' : waypoint.type === 'delivery' ? 'Delivery' : 'Waypoint'} #${index + 1}</h3>
              <p class="text-xs text-gray-600 mt-1">${waypoint.address}</p>
              ${waypoint.timeWindow ? `<p class="text-xs text-gray-500 mt-1">⏰ ${new Date(waypoint.timeWindow.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(waypoint.timeWindow.end).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>` : ''}
              <p class="text-xs text-gray-500 mt-1">⏱️ ${waypoint.duration} min</p>
            </div>
          `)
        )
        .addTo(map.current);

      // Handle drag end
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        const updated = waypoints.map((wp) =>
          wp.id === waypoint.id
            ? { ...wp, coordinates: [lngLat.lng, lngLat.lat] as [number, number] }
            : wp
        );
        onWaypointsChange(updated);
      });

      markers.current[waypoint.id] = marker;
    });

    // Fit bounds to show all waypoints
    if (waypoints.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      waypoints.forEach((wp) => bounds.extend(wp.coordinates));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [waypoints, onWaypointsChange]);

  // Draw route line
  useEffect(() => {
    if (!map.current || !showRoute || waypoints.length < 2) return;

    const sourceId = 'route';
    const layerId = 'route-line';

    // Wait for map to load
    if (!map.current.isStyleLoaded()) {
      map.current.once('load', () => {
        addRouteLayer();
      });
    } else {
      addRouteLayer();
    }

    function addRouteLayer() {
      if (!map.current) return;

      // Remove existing layer and source
      if (map.current.getLayer(layerId)) {
        map.current.removeLayer(layerId);
      }
      if (map.current.getSource(sourceId)) {
        map.current.removeSource(sourceId);
      }

      // Add route line
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: waypoints.map((wp) => wp.coordinates),
          },
        },
      });

      map.current.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4,
          'line-opacity': 0.8,
        },
      });
    }

    return () => {
      if (map.current) {
        if (map.current.getLayer(layerId)) {
          map.current.removeLayer(layerId);
        }
        if (map.current.getSource(sourceId)) {
          map.current.removeSource(sourceId);
        }
      }
    };
  }, [waypoints, showRoute]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Carte Interactive</h2>
          <p className="text-sm text-gray-600 mt-1">
            {waypoints.length} point{waypoints.length > 1 ? 's' : ''} • Glissez pour repositionner
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
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full" />
            <span className="text-sm text-gray-600">Waypoint</span>
          </div>
        </div>
      </div>
      <div ref={mapContainer} style={{ height }} />
    </div>
  );
}
