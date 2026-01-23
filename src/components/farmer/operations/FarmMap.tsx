/**
 * Farm Map Component
 * Interactive Mapbox map showing farm fields and sensors
 */
'use client';

import React, { useState } from 'react';
import { Map, Layers, MapPin, Activity } from 'lucide-react';
import type { FarmField, IoTSensor } from '@/types/farmer/operations';

interface FarmMapProps {
  fields: FarmField[];
  sensors: IoTSensor[];
  isLoading?: boolean;
}

export function FarmMap({ fields, sensors, isLoading }: FarmMapProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showSensors, setShowSensors] = useState(true);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-[500px] rounded-xl" />;
  }

  const getSensorStatusColor = (status: IoTSensor['lastReading']['status']) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-orange-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Carte de la Ferme</h2>
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
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
            <Layers className="w-4 h-4" />
            Couches
          </button>
        </div>
      </div>

      {/* Map Placeholder (Replace with actual Mapbox) */}
      <div className="relative h-[500px] bg-gradient-to-br from-green-50 to-blue-50">
        {/* TODO: Integrate Mapbox GL JS */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Map className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 font-medium">Carte Interactive Mapbox</p>
            <p className="text-sm text-gray-500 mt-1">Intégration en cours...</p>
          </div>
        </div>

        {/* Field Overlays (Simplified) */}
        <div className="absolute top-4 left-4 space-y-2">
          {fields.map((field) => (
            <button
              key={field.id}
              onClick={() => setSelectedField(field.id)}
              className={`flex items-start gap-3 p-3 rounded-lg backdrop-blur-sm transition-all ${
                selectedField === field.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white/90 text-gray-900 hover:bg-white'
              }`}
            >
              <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold">{field.name}</p>
                <p className="text-xs opacity-90">{field.area} ha • {field.soilType}</p>
                {field.currentCrop && (
                  <p className="text-xs mt-1 opacity-75">
                    🌱 {field.currentCrop.name}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Sensors Overlay */}
        {showSensors && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 max-w-xs">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Capteurs Actifs ({sensors.filter(s => s.status === 'active').length}/{sensors.length})
            </h3>
            <div className="space-y-2">
              {sensors.slice(0, 3).map((sensor) => (
                <div key={sensor.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getSensorStatusColor(sensor.lastReading.status)}`} />
                    <span className="capitalize">{sensor.type.replace('_', ' ')}</span>
                  </div>
                  <span className="font-semibold">
                    {sensor.lastReading.value} {sensor.lastReading.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
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
          </div>
          <button className="text-green-600 hover:text-green-700 font-medium">
            Vue satellite →
          </button>
        </div>
      </div>
    </div>
  );
}
