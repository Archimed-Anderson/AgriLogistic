/**
 * IoT Monitor Component
 * Real-time sensor data monitoring dashboard
 */
'use client';

import React from 'react';
import { Activity, Battery, AlertTriangle, CheckCircle, WifiOff } from 'lucide-react';
import type { IoTSensor } from '@/types/farmer/operations';

interface IoTMonitorProps {
  sensors: IoTSensor[];
  isLoading?: boolean;
}

export function IoTMonitor({ sensors, isLoading }: IoTMonitorProps) {
  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  const getSensorIcon = (type: IoTSensor['type']) => {
    const icons = {
      soil_moisture: '💧',
      temperature: '🌡️',
      humidity: '💨',
      ph: '🧪',
      nutrients: '🌿',
      light: '☀️',
    };
    return icons[type];
  };

  const getStatusBadge = (status: IoTSensor['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Actif
          </span>
        );
      case 'inactive':
        return (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
            <WifiOff className="w-3 h-3" />
            Inactif
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            Erreur
          </span>
        );
      default:
        return (
          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
            Maintenance
          </span>
        );
    }
  };

  const getReadingStatus = (status: IoTSensor['lastReading']['status']) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  const activeSensors = sensors.filter((s) => s.status === 'active').length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Monitoring IoT</h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-600">
            {activeSensors}/{sensors.length} capteurs actifs
          </span>
        </div>
      </div>

      {sensors.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">Aucun capteur configuré</p>
          <p className="text-sm mt-1">Ajoutez des capteurs IoT pour monitorer vos champs</p>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            + Ajouter un capteur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getSensorIcon(sensor.type)}</span>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {sensor.type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-500">ID: {sensor.id}</p>
                  </div>
                </div>
                {getStatusBadge(sensor.status)}
              </div>

              {/* Reading */}
              <div className={`p-3 rounded-lg mb-3 ${getReadingStatus(sensor.lastReading.status)}`}>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold">{sensor.lastReading.value}</span>
                  <span className="text-sm font-medium">{sensor.lastReading.unit}</span>
                </div>
                {sensor.threshold && (
                  <div className="mt-2 text-xs">
                    Seuil: {sensor.threshold.min} - {sensor.threshold.max} {sensor.lastReading.unit}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>
                  {new Date(sensor.lastReading.timestamp).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {sensor.batteryLevel !== undefined && (
                  <div className="flex items-center gap-1">
                    <Battery
                      className={`w-4 h-4 ${
                        sensor.batteryLevel > 50
                          ? 'text-green-600'
                          : sensor.batteryLevel > 20
                          ? 'text-orange-600'
                          : 'text-red-600'
                      }`}
                    />
                    <span>{sensor.batteryLevel}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {sensors.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
          <button className="text-sm text-gray-600 hover:text-gray-900">
            Historique des données →
          </button>
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
            + Ajouter un capteur
          </button>
        </div>
      )}
    </div>
  );
}
