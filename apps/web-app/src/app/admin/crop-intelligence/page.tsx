'use client';

import { useState } from 'react';
import {
  Satellite,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Droplets,
  Sun,
  Cloud,
  CloudRain,
  Flame,
  Sprout,
  Calendar,
} from 'lucide-react';
import {
  cropZonesData,
  getCropStatistics,
  getHealthStatus,
  type CropZone,
} from '@/data/crop-intelligence-data';
import { YieldEvolutionChart } from '@/components/admin/YieldEvolutionChart';
import { CriticalAlertsPanel } from '@/components/admin/CriticalAlertsPanel';
import { ZoneDetailModal } from '@/components/admin/ZoneDetailModal';

export default function CropIntelligencePage() {
  const stats = getCropStatistics();
  const [selectedZone, setSelectedZone] = useState<CropZone | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'warning' | 'healthy'>(
    'all'
  );
  const [isScanning, setIsScanning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zones, setZones] = useState<CropZone[]>(cropZonesData);

  // Calculer les alertes actives (zones avec santé < 70%)
  const activeAlerts = zones.filter((zone) => zone.healthScore < 70).length;

  // Simuler un scan global avec mise à jour des scores
  const handleGlobalScan = () => {
    setIsScanning(true);

    setTimeout(() => {
      // Mettre à jour aléatoirement les scores de santé (variation de -5 à +5)
      const updatedZones = zones.map((zone) => {
        const variation = Math.floor(Math.random() * 11) - 5; // -5 à +5
        const newHealthScore = Math.max(20, Math.min(100, zone.healthScore + variation));

        return {
          ...zone,
          healthScore: newHealthScore,
          lastScan: new Date().toISOString(),
        };
      });

      setZones(updatedZones);
      setIsScanning(false);
    }, 2000); // 2 secondes
  };

  const filteredZones = zones.filter((zone) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'critical') return zone.healthScore < 50;
    if (filterStatus === 'warning') return zone.healthScore >= 50 && zone.healthScore < 70;
    return zone.healthScore >= 70;
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Ensoleillé':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'Nuageux':
        return <Cloud className="h-5 w-5 text-slate-400" />;
      case 'Pluvieux':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'Sec':
        return <Sun className="h-5 w-5 text-orange-500" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  const getIrrigationBadge = (status: string) => {
    const config = {
      Optimal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Insuffisant: 'bg-orange-50 text-orange-700 border-orange-200',
      Excessif: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return config[status as keyof typeof config] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/20 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg">
              <Satellite className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-[#0A2619]">Crop Intelligence</h1>
              <p className="text-slate-600 font-medium">
                Surveillance agricole par IA et données satellites
              </p>
            </div>
          </div>

          {/* Global Scan Button */}
          <button
            onClick={handleGlobalScan}
            disabled={isScanning}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Satellite
              className={`h-5 w-5 ${isScanning ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`}
            />
            <span>{isScanning ? 'Scan en cours...' : 'Lancer Scan Global'}</span>
          </button>
        </div>
      </div>

      {/* KPIs - 3 Cartes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Zones Surveillées */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-start justify-between mb-6">
            <div className="p-4 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-600 shadow-xl">
              <MapPin className="h-7 w-7 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
              Zones Surveillées
            </p>
            <p className="text-5xl font-black text-[#0A2619] mb-1">{stats.totalZones}</p>
            <p className="text-xs text-slate-500 font-medium">Régions actives</p>
          </div>
        </div>

        {/* Alertes Actives */}
        <div
          className={`bg-white rounded-3xl p-8 border transition-all duration-300 ${
            activeAlerts > 0
              ? 'border-red-300 bg-red-50/30 hover:shadow-2xl hover:border-red-400'
              : 'border-emerald-300 bg-emerald-50/30 hover:shadow-2xl hover:border-emerald-400'
          }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div
              className={`p-4 rounded-2xl shadow-xl ${
                activeAlerts > 0
                  ? 'bg-linear-to-br from-red-500 to-rose-600'
                  : 'bg-linear-to-br from-emerald-500 to-teal-600'
              }`}
            >
              {activeAlerts > 0 ? (
                <AlertTriangle className="h-7 w-7 text-white" />
              ) : (
                <CheckCircle className="h-7 w-7 text-white" />
              )}
            </div>
            {activeAlerts > 0 && (
              <div className="animate-pulse">
                <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
              Alertes Actives
            </p>
            <p
              className={`text-5xl font-black mb-1 ${
                activeAlerts > 0 ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {activeAlerts}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              {activeAlerts > 0
                ? `${activeAlerts} zone(s) nécessite(nt) attention`
                : 'Toutes les zones sont saines'}
            </p>
          </div>
        </div>

        {/* Rendement Moyen Prévu */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-orange-300 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-start justify-between mb-6">
            <div className="p-4 rounded-2xl bg-linear-to-br from-orange-500 to-amber-600 shadow-xl">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div className="p-2 rounded-lg bg-emerald-50">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
              Rendement Moyen Prévu
            </p>
            <p className="text-5xl font-black text-[#0A2619] mb-1">
              {(stats.totalEstimatedYield / stats.totalZones).toFixed(1)}
              <span className="text-2xl text-slate-500 ml-2">t/ha</span>
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Total: {(stats.totalEstimatedYield / 1000).toFixed(1)}k tonnes
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <FilterButton
          active={filterStatus === 'all'}
          onClick={() => setFilterStatus('all')}
          label={`Toutes (${cropZonesData.length})`}
          color="bg-slate-100 text-slate-700 hover:bg-slate-200"
        />
        <FilterButton
          active={filterStatus === 'healthy'}
          onClick={() => setFilterStatus('healthy')}
          label={`Saines (${stats.healthyZones})`}
          color="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        />
        <FilterButton
          active={filterStatus === 'warning'}
          onClick={() => setFilterStatus('warning')}
          label={`Attention (${stats.warningZones})`}
          color="bg-orange-50 text-orange-700 hover:bg-orange-100"
        />
        <FilterButton
          active={filterStatus === 'critical'}
          onClick={() => setFilterStatus('critical')}
          label={`Critiques (${stats.criticalZones})`}
          color="bg-red-50 text-red-700 hover:bg-red-100"
        />
      </div>

      {/* Yield Evolution Chart & Critical Alerts - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <YieldEvolutionChart />
        <CriticalAlertsPanel />
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredZones.map((zone) => {
          const healthStatus = getHealthStatus(zone.healthScore);

          return (
            <div
              key={zone.id}
              className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer"
              onClick={() => {
                setSelectedZone(zone);
                setIsModalOpen(true);
              }}
            >
              {/* Satellite Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={zone.satelliteImage}
                  alt={zone.zoneName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                {/* Health Score Badge */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`px-4 py-2 rounded-full backdrop-blur-xl bg-white/90 border ${healthStatus.color.split(' ')[1]} shadow-xl`}
                  >
                    <div className="flex items-center gap-2">
                      {zone.healthScore >= 70 ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <span className="font-black text-sm">{zone.healthScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Zone Name */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-black text-white mb-1">{zone.zoneName}</h3>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{zone.location.region}</span>
                  </div>
                </div>
              </div>

              {/* Zone Details */}
              <div className="p-6">
                {/* Crop Type & Area */}
                <div className="flex items-center justify-between mb-4">
                  <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                    <span className="text-sm font-bold text-emerald-700">{zone.cropType}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-600">{zone.area} ha</span>
                </div>

                {/* AI Insight */}
                <div className="mb-4 p-4 rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-600">
                      <Satellite className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 flex-1">{zone.aiInsight}</p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <MetricItem
                    label="Rendement"
                    value={`${zone.estimatedYield} t/ha`}
                    icon={<TrendingUp className="h-4 w-4 text-emerald-600" />}
                  />
                  <MetricItem
                    label="Météo"
                    value={zone.weatherCondition}
                    icon={getWeatherIcon(zone.weatherCondition)}
                  />
                </div>

                {/* Irrigation Status */}
                <div
                  className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${getIrrigationBadge(zone.irrigationStatus)}`}
                >
                  <Droplets className="h-4 w-4" />
                  <span className="text-sm font-bold">Irrigation: {zone.irrigationStatus}</span>
                </div>

                {/* Last Scan */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Scan:{' '}
                    {new Date(zone.lastScan).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredZones.length === 0 && (
        <div className="text-center py-16">
          <AlertTriangle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-600 mb-2">Aucune zone trouvée</h3>
          <p className="text-slate-500">Essayez un autre filtre</p>
        </div>
      )}
    </div>
  );
}

// Composant StatCard
function StatCard({
  title,
  value,
  icon,
  color,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down';
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
        {trend && (
          <div className={`p-1 rounded-lg ${trend === 'up' ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
        <p className="text-3xl font-black text-[#0A2619]">{value}</p>
      </div>
    </div>
  );
}

// Composant FilterButton
function FilterButton({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border-2 ${
        active
          ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg scale-105'
          : `border-transparent ${color}`
      }`}
    >
      {label}
    </button>
  );
}

// Composant MetricItem
function MetricItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}
