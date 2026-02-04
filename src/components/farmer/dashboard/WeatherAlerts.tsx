/**
 * Weather Alerts Component
 * Displays 7-day forecast with personalized alerts
 */
'use client';

import React from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle } from 'lucide-react';
import type { WeatherData, WeatherAlert } from '@/types/farmer/dashboard';

interface WeatherAlertsProps {
  weather: WeatherData[];
  alerts: WeatherAlert[];
  isLoading?: boolean;
}

export function WeatherAlerts({ weather, alerts, isLoading }: WeatherAlertsProps) {
  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  const getWeatherIcon = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'stormy':
        return <Wind className="w-8 h-8 text-purple-500" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-400" />;
    }
  };

  const getAlertColor = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getAlertIcon = (type: WeatherAlert['type']) => {
    const icons = {
      frost: '❄️',
      drought: '🌵',
      flood: '🌊',
      storm: '⛈️',
      heatwave: '🌡️',
    };
    return icons[type];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Météo & Alertes</h2>

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 ${getAlertColor(alert.severity)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <h3 className="font-semibold">{alert.title}</h3>
                  </div>
                  <p className="text-sm mb-2">{alert.description}</p>
                  {alert.recommendations && alert.recommendations.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium">Recommandations:</p>
                      <ul className="text-xs space-y-1">
                        {alert.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span>•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7-day Forecast */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Prévisions 7 jours</h3>
        {weather && weather.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weather.map((day, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors"
              >
                <p className="text-xs text-gray-600 mb-2">
                  {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                </p>
                <div className="flex justify-center mb-2">{getWeatherIcon(day.condition)}</div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-gray-900">{day.temperature.max}°</p>
                  <p className="text-sm text-gray-500">{day.temperature.min}°</p>
                </div>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-600">
                  <Droplets className="w-3 h-3" />
                  <span>{day.precipitationProbability}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">Données météo non disponibles</p>
        )}
      </div>

      {/* Current Conditions */}
      {weather && weather.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Humidité</p>
            <p className="text-lg font-semibold text-gray-900">{weather[0].humidity}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Vent</p>
            <p className="text-lg font-semibold text-gray-900">{weather[0].windSpeed} km/h</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">UV</p>
            <p className="text-lg font-semibold text-gray-900">{weather[0].uvIndex}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Précipitations</p>
            <p className="text-lg font-semibold text-gray-900">{weather[0].precipitation} mm</p>
          </div>
        </div>
      )}
    </div>
  );
}
