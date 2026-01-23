/**
 * Interactive Farm Map with Leaflet (Open Source Alternative)
 * Free alternative to Mapbox - no API key required
 */
'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import { Map as MapIcon, Layers, Activity } from 'lucide-react';
import type { FarmField, IoTSensor } from '@/types/farmer/operations';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface FarmMapLeafletProps {
  fields: FarmField[];
  sensors: IoTSensor[];
  isLoading?: boolean;
}

export function FarmMapLeaflet({ fields, sensors, isLoading }: FarmMapLeafletProps) {
  const [showSensors, setShowSensors] = useState(true);
  const [mapLayer, setMapLayer] = useState<'osm' | 'satellite'>('satellite');

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-[500px] rounded-xl" />;
  }

  // Calculate map center from fields
  const center: [number, number] = fields && fields.length > 0
    ? [fields[0].coordinates[0][1], fields[0].coordinates[0][0]]
    : [48.8566, 2.3522];

  const getSensorStatusColor = (status: IoTSensor['lastReading']['status']) => {
    switch (status) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  };

  // Create custom sensor icon
  const createSensorIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-sensor-icon',
      html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">📡</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Tile layer URLs (all free!)
  const tileLayers = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '© Esri',
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapIcon className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Carte de la Ferme</h2>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            Open Source
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSensors(!showSensors)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg ${
              showSensors
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Activity className="w-4 h-4" />
            Capteurs IoT
          </button>
          <button
            onClick={() => setMapLayer(mapLayer === 'satellite' ? 'osm' : 'satellite')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            <Layers className="w-4 h-4" />
            {mapLayer === 'satellite' ? 'Satellite' : 'Rue'}
          </button>
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="h-[500px]">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          {/* Tile Layer */}
          <TileLayer
            url={tileLayers[mapLayer].url}
            attribution={tileLayers[mapLayer].attribution}
          />

          {/* Field Polygons */}
          {fields.map((field) => {
            const positions: [number, number][] = field.coordinates.map(
              (coord) => [coord[1], coord[0]]
            );
            
            return (
              <Polygon
                key={field.id}
                positions={positions}
                pathOptions={{
                  color: field.currentCrop ? '#059669' : '#4b5563',
                  fillColor: field.currentCrop ? '#10b981' : '#6b7280',
                  fillOpacity: 0.3,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-sm mb-1">{field.name}</h3>
                    <p className="text-xs text-gray-600">Surface: {field.area} ha</p>
                    {field.currentCrop && (
                      <p className="text-xs text-gray-600">Culture: {field.currentCrop}</p>
                    )}
                  </div>
                </Popup>
              </Polygon>
            );
          })}

          {/* Sensor Markers */}
          {showSensors && sensors.map((sensor) => (
            <Marker
              key={sensor.id}
              position={[sensor.location.coordinates[1], sensor.location.coordinates[0]]}
              icon={createSensorIcon(getSensorStatusColor(sensor.lastReading.status))}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm mb-1 capitalize">
                    {sensor.type.replace('_', ' ')}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">ID: {sensor.id}</p>
                  <div className="bg-gray-50 rounded p-2 mb-2">
                    <p className="text-lg font-bold">
                      {sensor.lastReading.value} {sensor.lastReading.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(sensor.lastReading.timestamp).toLocaleTimeString('fr-FR')}
                    </p>
                  </div>
                  {sensor.batteryLevel !== undefined && (
                    <p className="text-xs text-gray-600">
                      Batterie: {sensor.batteryLevel}%
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Map Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Surface totale: <span className="font-semibold text-gray-900">
                {fields.reduce((sum, f) => sum + f.area, 0).toFixed(1)} ha
              </span>
            </span>
            <span className="text-gray-600">
              Champs: <span className="font-semibold text-gray-900">{fields.length}</span>
            </span>
            <span className="text-gray-600">
              Capteurs: <span className="font-semibold text-gray-900">{sensors.length}</span>
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Powered by OpenStreetMap & Leaflet
          </span>
        </div>
      </div>
    </div>
  );
}
