/**
 * Interactive Farm Map with Mapbox
 * Replaces the placeholder FarmMap component
 */
'use client';

import React, { useState, useCallback } from 'react';
import ReactMapGL, { Marker, Source, Layer, Popup } from 'react-map-gl';
const Map = ReactMapGL.Map as React.FC<Record<string, unknown>>;
import { Map as MapIcon, Layers, Activity } from 'lucide-react';
import type { FarmField, IoTSensor } from '@/types/farmer/operations';
import 'mapbox-gl/dist/mapbox-gl.css';

interface FarmMapInteractiveProps {
  fields: FarmField[];
  sensors: IoTSensor[];
  isLoading?: boolean;
}

export function FarmMapInteractive({ fields, sensors, isLoading }: FarmMapInteractiveProps) {
  const [viewport, setViewport] = useState({
    longitude: fields && fields.length > 0 ? fields[0].coordinates[0][0] : 2.3522,
    latitude: fields && fields.length > 0 ? fields[0].coordinates[0][1] : 48.8566,
    zoom: 14,
  });

  const [selectedSensor, setSelectedSensor] = useState<IoTSensor | null>(null);
  const [showSensors, setShowSensors] = useState(true);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'streets'>('satellite');

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

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-[500px] rounded-xl" />;
  }

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!mapboxToken) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 h-[500px] flex items-center justify-center">
        <div className="text-center">
          <MapIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 font-medium">Mapbox Token Required</p>
          <p className="text-sm text-gray-500 mt-1">Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapIcon className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Carte de la Ferme</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSensors(!showSensors)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg ${
              showSensors ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Activity className="w-4 h-4" />
            Capteurs IoT
          </button>
          <button
            onClick={() => setMapStyle(mapStyle === 'satellite' ? 'streets' : 'satellite')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            <Layers className="w-4 h-4" />
            {mapStyle === 'satellite' ? 'Satellite' : 'Rue'}
          </button>
        </div>
      </div>

      {/* Mapbox Map */}
      <div className="h-[500px]">
        <Map
          {...viewport}
          onMove={(evt) => setViewport(evt.viewState)}
          mapboxAccessToken={mapboxToken}
          style={{ width: '100%', height: '100%' }}
          mapStyle={`mapbox://styles/mapbox/${
            mapStyle === 'satellite' ? 'satellite-v9' : 'streets-v12'
          }`}
        >
          {/* Field Polygons */}
          {fields.map((field) => (
            <Source
              key={field.id}
              type="geojson"
              data={{
                type: 'Feature',
                properties: { name: field.name },
                geometry: {
                  type: 'Polygon',
                  coordinates: [field.coordinates],
                },
              }}
            >
              <Layer
                id={`field-fill-${field.id}`}
                type="fill"
                paint={{
                  'fill-color': field.currentCrop ? '#10b981' : '#6b7280',
                  'fill-opacity': 0.3,
                }}
              />
              <Layer
                id={`field-line-${field.id}`}
                type="line"
                paint={{
                  'line-color': field.currentCrop ? '#059669' : '#4b5563',
                  'line-width': 2,
                }}
              />
            </Source>
          ))}

          {/* Sensor Markers */}
          {showSensors &&
            sensors.map((sensor) => (
              <Marker
                key={sensor.id}
                longitude={sensor.location.coordinates[0]}
                latitude={sensor.location.coordinates[1]}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedSensor(sensor);
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: getSensorStatusColor(sensor.lastReading.status) }}
                >
                  📡
                </div>
              </Marker>
            ))}

          {/* Sensor Popup */}
          {selectedSensor && (
            <Popup
              longitude={selectedSensor.location.coordinates[0]}
              latitude={selectedSensor.location.coordinates[1]}
              onClose={() => setSelectedSensor(null)}
              closeButton={true}
              closeOnClick={false}
            >
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-1 capitalize">
                  {selectedSensor.type.replace('_', ' ')}
                </h3>
                <p className="text-xs text-gray-600 mb-2">ID: {selectedSensor.id}</p>
                <div className="bg-gray-50 rounded p-2 mb-2">
                  <p className="text-lg font-bold">
                    {selectedSensor.lastReading.value} {selectedSensor.lastReading.unit}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedSensor.lastReading.timestamp).toLocaleTimeString('fr-FR')}
                  </p>
                </div>
                {selectedSensor.batteryLevel !== undefined && (
                  <p className="text-xs text-gray-600">Batterie: {selectedSensor.batteryLevel}%</p>
                )}
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Map Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Surface totale:{' '}
              <span className="font-semibold text-gray-900">
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
        </div>
      </div>
    </div>
  );
}
