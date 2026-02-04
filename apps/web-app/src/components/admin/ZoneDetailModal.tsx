'use client';

import {
  X,
  MapPin,
  Calendar,
  TrendingUp,
  Droplets,
  Sun,
  AlertTriangle,
  CheckCircle,
  Satellite,
} from 'lucide-react';
import { type CropZone, getHealthStatus } from '@/data/crop-intelligence-data';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface ZoneDetailModalProps {
  zone: CropZone | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ZoneDetailModal({ zone, isOpen, onClose }: ZoneDetailModalProps) {
  if (!isOpen || !zone) return null;

  const healthStatus = getHealthStatus(zone.healthScore);

  // Simuler historique de santé (7 derniers jours)
  const healthHistory = [
    { day: 'J-6', score: Math.max(20, zone.healthScore - 12) },
    { day: 'J-5', score: Math.max(20, zone.healthScore - 9) },
    { day: 'J-4', score: Math.max(20, zone.healthScore - 6) },
    { day: 'J-3', score: Math.max(20, zone.healthScore - 4) },
    { day: 'J-2', score: Math.max(20, zone.healthScore - 2) },
    { day: 'J-1', score: Math.max(20, zone.healthScore - 1) },
    { day: 'Auj.', score: zone.healthScore },
  ];

  const getWeatherIcon = () => {
    switch (zone.weatherCondition) {
      case 'Ensoleillé':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'Sec':
        return <Sun className="h-6 w-6 text-orange-500" />;
      default:
        return <Sun className="h-6 w-6" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Image */}
          <div className="relative h-64">
            <img
              src={zone.satelliteImage}
              alt={zone.zoneName}
              className="w-full h-full object-cover rounded-t-3xl"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
            >
              <X className="h-6 w-6 text-slate-700" />
            </button>

            {/* Zone Title Overlay */}
            <div className="absolute bottom-4 left-6 right-6">
              <h2 className="text-4xl font-black text-white mb-2">{zone.zoneName}</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md">
                  <MapPin className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">{zone.location.region}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-lg font-bold ${healthStatus.color}`}>
                  {zone.healthScore}% - {healthStatus.label}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-medium text-emerald-600 mb-1">Type de Culture</p>
                <p className="text-2xl font-black text-emerald-900">{zone.cropType}</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <p className="text-xs font-medium text-blue-600 mb-1">Surface</p>
                <p className="text-2xl font-black text-blue-900">{zone.area.toLocaleString()} ha</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-orange-50 border border-orange-200">
                <p className="text-xs font-medium text-orange-600 mb-1">Rendement Prévu</p>
                <p className="text-2xl font-black text-orange-900">{zone.estimatedYield} t/ha</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <p className="text-xs font-medium text-purple-600 mb-1">Production Totale</p>
                <p className="text-2xl font-black text-purple-900">
                  {(zone.estimatedYield * zone.area).toLocaleString('fr-FR', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  t
                </p>
              </div>
            </div>

            {/* Health History Chart */}
            <div className="mb-8 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Évolution Santé (7 derniers jours)
                </h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthHistory}>
                    <XAxis
                      dataKey="day"
                      stroke="#64748b"
                      style={{ fontSize: '12px', fontWeight: '600' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      domain={[0, 100]}
                      style={{ fontSize: '12px', fontWeight: '600' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insight Section */}
            <div className="mb-8 p-6 rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-600 shrink-0">
                  <Satellite className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Analyse IA</h3>
                  <p className="text-blue-800 font-medium leading-relaxed">{zone.aiInsight}</p>
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Weather & Irrigation */}
              <div className="p-6 rounded-2xl bg-white border-2 border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Conditions Environnementales
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getWeatherIcon()}
                      <span className="font-medium text-slate-700">Météo</span>
                    </div>
                    <span className="font-bold text-slate-900">{zone.weatherCondition}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Droplets className="h-6 w-6 text-blue-500" />
                      <span className="font-medium text-slate-700">Irrigation</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg font-bold text-sm ${
                        zone.irrigationStatus === 'Optimal'
                          ? 'bg-emerald-100 text-emerald-700'
                          : zone.irrigationStatus === 'Insuffisant'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {zone.irrigationStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Last Scan */}
              <div className="p-6 rounded-2xl bg-white border-2 border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Informations de Scan</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-purple-500" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Dernier Scan</p>
                      <p className="font-bold text-slate-900">
                        {new Date(zone.lastScan).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Satellite className="h-6 w-6 text-cyan-500" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Coordonnées GPS</p>
                      <p className="font-mono font-bold text-slate-900 text-sm">
                        {zone.location.coordinates.lat.toFixed(4)}°N,{' '}
                        {zone.location.coordinates.lng.toFixed(4)}°E
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
