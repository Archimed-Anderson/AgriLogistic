/**
 * Farmer Dashboard Page - Premium Modernized Version
 * Agricultural dashboard with crops, weather, revenue, and recommendations
 */
'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Sprout,
  DollarSign,
  Package,
  Droplets,
  Sun,
  Cloud,
  CloudRain,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ChevronRight,
  Tractor,
  MapPin,
  Clock,
  Thermometer,
  Wind,
  Leaf,
  ShoppingCart,
} from 'lucide-react';

// Mock data
const kpis = [
  {
    label: 'Revenus ce mois',
    value: '1 850 000',
    suffix: 'FCFA',
    change: '+18%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    label: 'Cultures actives',
    value: '8',
    change: '+2',
    trend: 'up',
    icon: Sprout,
    color: 'from-green-500 to-green-600',
  },
  {
    label: 'Stock disponible',
    value: '2.5',
    suffix: 'T',
    change: '-0.3T',
    trend: 'down',
    icon: Package,
    color: 'from-amber-500 to-amber-600',
  },
  {
    label: 'Commandes',
    value: '12',
    change: '+5',
    trend: 'up',
    icon: ShoppingCart,
    color: 'from-blue-500 to-blue-600',
  },
];

const revenueData = [
  { month: 'Août', amount: 1200000 },
  { month: 'Sept', amount: 980000 },
  { month: 'Oct', amount: 1450000 },
  { month: 'Nov', amount: 1680000 },
  { month: 'Déc', amount: 1520000 },
  { month: 'Jan', amount: 1850000 },
];

const crops = [
  {
    name: 'Tomates Bio',
    area: '3 ha',
    status: 'growing',
    progress: 65,
    harvestDate: '15 Fév',
    health: 'excellent',
  },
  {
    name: 'Oignons',
    area: '2 ha',
    status: 'ready',
    progress: 100,
    harvestDate: 'Prêt',
    health: 'good',
  },
  {
    name: 'Carottes',
    area: '1.5 ha',
    status: 'growing',
    progress: 40,
    harvestDate: '28 Mar',
    health: 'excellent',
  },
  {
    name: 'Maïs',
    area: '5 ha',
    status: 'planted',
    progress: 15,
    harvestDate: '10 Avr',
    health: 'good',
  },
];

const weatherForecast = [
  { day: "Aujourd'hui", icon: Sun, temp: 28, condition: 'Ensoleillé' },
  { day: 'Demain', icon: Cloud, temp: 26, condition: 'Nuageux' },
  { day: 'Vendredi', icon: CloudRain, temp: 24, condition: 'Pluie légère' },
];

const alerts = [
  {
    type: 'warning',
    message: 'Risque de sécheresse prévu - Irrigation recommandée pour les tomates',
    action: 'Planifier irrigation',
  },
  {
    type: 'info',
    message: 'Prix du marché en hausse: Oignons +15% cette semaine',
    action: 'Voir opportunités',
  },
];

const upcomingTasks = [
  { time: '08:00', task: 'Irrigation parcelle A3', type: 'water' },
  { time: '10:30', task: 'Visite acheteur - Restaurant Le Teranga', type: 'meeting' },
  { time: '14:00', task: 'Récolte oignons - 200 kg', type: 'harvest' },
];

const statusConfig = {
  growing: { label: 'En croissance', color: 'bg-emerald-100 text-emerald-700' },
  ready: { label: 'Prêt à récolter', color: 'bg-amber-100 text-amber-700' },
  planted: { label: 'Planté', color: 'bg-blue-100 text-blue-700' },
};

const healthConfig = {
  excellent: { label: 'Excellent', color: 'text-emerald-600' },
  good: { label: 'Bon', color: 'text-blue-600' },
  attention: { label: 'Attention', color: 'text-amber-600' },
};

export default function FarmerDashboardPage() {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-600">Bienvenue, Ibrahima. Votre ferme se porte bien ! 🌱</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/farmer/marketplace"
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Nouvelle vente
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {kpi.change}
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {kpi.value}
                {kpi.suffix && <span className="text-lg text-slate-500 ml-1">{kpi.suffix}</span>}
              </p>
              <p className="text-sm text-slate-600 mt-1">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-xl border ${
                alert.type === 'warning'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {alert.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                )}
                <p
                  className={`text-sm ${
                    alert.type === 'warning' ? 'text-amber-800' : 'text-blue-800'
                  }`}
                >
                  {alert.message}
                </p>
              </div>
              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  alert.type === 'warning'
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {alert.action}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Évolution des revenus</h2>
            <span className="text-sm text-slate-500">6 derniers mois</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  tickFormatter={(v) => formatCurrency(v)}
                />
                <Tooltip
                  formatter={(value: number) => [`${formatCurrency(value)} FCFA`, 'Revenus']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weather */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Météo</h2>
            <MapPin className="w-5 h-5 opacity-80" />
          </div>
          <div className="space-y-4">
            {weatherForecast.map((day, i) => {
              const WeatherIcon = day.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    i === 0 ? 'bg-white/20' : 'bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <WeatherIcon className="w-6 h-6" />
                    <div>
                      <p className="font-medium">{day.day}</p>
                      <p className="text-sm opacity-80">{day.condition}</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{day.temp}°</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Crops & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Crops */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Mes Cultures</h2>
            <Link
              to="/farmer/farm"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              Voir tout <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {crops.map((crop, i) => {
              const status = statusConfig[crop.status as keyof typeof statusConfig];
              const health = healthConfig[crop.health as keyof typeof healthConfig];
              return (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{crop.name}</p>
                        <p className="text-sm text-slate-500">{crop.area}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex-1 mr-4">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${crop.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">Récolte: {crop.harvestDate}</span>
                      <span className={health.color}>{health.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Tâches du jour</h2>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {upcomingTasks.map((task, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-16 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-700">{task.time}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{task.task}</p>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    {task.type === 'water' && <Droplets className="w-4 h-4" />}
                    {task.type === 'meeting' && <Calendar className="w-4 h-4" />}
                    {task.type === 'harvest' && <Package className="w-4 h-4" />}
                    <span>
                      {task.type === 'water'
                        ? 'Irrigation'
                        : task.type === 'meeting'
                        ? 'Rendez-vous'
                        : 'Récolte'}
                    </span>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-slate-300 hover:text-emerald-500 cursor-pointer" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/farmer/marketplace"
            className="flex flex-col items-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
          >
            <ShoppingCart className="w-8 h-8 text-emerald-600 mb-2" />
            <span className="text-sm font-medium text-slate-900">Nouvelle vente</span>
          </Link>
          <Link
            to="/farmer/rental"
            className="flex flex-col items-center p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
          >
            <Tractor className="w-8 h-8 text-amber-600 mb-2" />
            <span className="text-sm font-medium text-slate-900">Louer matériel</span>
          </Link>
          <Link
            to="/farmer/operations"
            className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <Package className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-slate-900">Gérer stock</span>
          </Link>
          <Link
            to="/farmer/logistics"
            className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
          >
            <MapPin className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-slate-900">Logistique</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
