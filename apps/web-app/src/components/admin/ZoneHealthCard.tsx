'use client';

import {
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Droplets,
  Sun,
  Cloud,
  CloudRain,
} from 'lucide-react';
import { getHealthStatus, type CropZone } from '@/data/crop-intelligence-data';

interface ZoneHealthCardProps {
  zone: CropZone;
  onClick?: () => void;
}

export function ZoneHealthCard({ zone, onClick }: ZoneHealthCardProps) {
  const healthStatus = getHealthStatus(zone.healthScore);

  // Weather icon mapping
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'ensoleillé':
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'nuageux':
        return <Cloud className="h-4 w-4 text-slate-400" />;
      case 'pluvieux':
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      default:
        return <Sun className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Irrigation status badge color
  const getIrrigationColor = (status: string) => {
    if (status === 'Optimal') return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    if (status === 'Insuffisant') return 'bg-orange-100 text-orange-700 border-orange-300';
    if (status === 'Excessif') return 'bg-blue-100 text-blue-700 border-blue-300';
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer"
    >
      {/* Satellite Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={zone.satelliteImage}
          alt={zone.zoneName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Zone Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-black text-white mb-1">{zone.zoneName}</h3>
          <p className="text-sm text-white/90 font-medium">{zone.cropType}</p>
        </div>

        {/* Health Badge */}
        <div
          className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl ${healthStatus.color} backdrop-blur-sm border-2 border-white/20`}
        >
          <span className="text-xs font-black">{healthStatus.label}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Health Progress Bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Santé Globale
            </span>
            <span className="text-lg font-black text-[#0A2619]">{zone.healthScore}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                zone.healthScore >= 85
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                  : zone.healthScore >= 70
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : zone.healthScore >= 50
                      ? 'bg-gradient-to-r from-orange-500 to-amber-600'
                      : 'bg-gradient-to-r from-red-500 to-rose-600'
              }`}
              style={{ width: `${zone.healthScore}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1">Surface</p>
            <p className="text-lg font-black text-[#0A2619]">{zone.area} ha</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
            <p className="text-xs text-emerald-600 font-medium mb-1">Rendement</p>
            <p className="text-lg font-black text-emerald-700">{zone.estimatedYield} t/ha</p>
          </div>
        </div>

        {/* Conditions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {getWeatherIcon(zone.weatherCondition)}
            <span className="text-sm font-medium text-slate-600">{zone.weatherCondition}</span>
          </div>
          <div
            className={`px-3 py-1 rounded-lg border text-xs font-bold ${getIrrigationColor(zone.irrigationStatus)}`}
          >
            <Droplets className="inline h-3 w-3 mr-1" />
            {zone.irrigationStatus}
          </div>
        </div>
      </div>
    </div>
  );
}
