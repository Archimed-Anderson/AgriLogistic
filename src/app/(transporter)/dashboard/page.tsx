/**
 * Transporter Dashboard Page - Premium Modernized Version
 * Real-time KPIs, live map preview, and active shipments
 */
'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Clock,
  MapPin,
  DollarSign,
  Fuel,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Navigation,
  Calendar,
  Star,
  Zap,
} from 'lucide-react';

// Mock data for demonstration
const kpis = [
  { label: 'Livraisons aujourd\'hui', value: '12', change: '+3', trend: 'up', icon: Package, color: 'from-blue-500 to-blue-600' },
  { label: 'Revenus du jour', value: '185 000', suffix: 'FCFA', change: '+12%', trend: 'up', icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
  { label: 'Distance parcourue', value: '245', suffix: 'km', change: '-8%', trend: 'down', icon: Navigation, color: 'from-purple-500 to-purple-600' },
  { label: 'Note moyenne', value: '4.8', suffix: '/5', change: '+0.2', trend: 'up', icon: Star, color: 'from-amber-500 to-amber-600' },
];

const activeShipments = [
  {
    id: 'SHP-2026-0042',
    client: 'Restaurant Le Teranga',
    pickup: 'Ferme Bio Casamance, Ziguinchor',
    delivery: 'Plateau, Dakar',
    status: 'in_transit',
    eta: '14:30',
    progress: 65,
    value: 45000,
    priority: 'high',
  },
  {
    id: 'SHP-2026-0043',
    client: 'Hôtel Terrou-Bi',
    pickup: 'Coopérative Niayes, Thiès',
    delivery: 'Corniche Ouest, Dakar',
    status: 'pickup',
    eta: '11:00',
    progress: 25,
    value: 78000,
    priority: 'normal',
  },
  {
    id: 'SHP-2026-0044',
    client: 'Supermarché City Dia',
    pickup: 'Ferme Kolda',
    delivery: 'Almadies, Dakar',
    status: 'pending',
    eta: '15:45',
    progress: 0,
    value: 125000,
    priority: 'normal',
  },
];

const alerts = [
  { type: 'warning', message: 'Embouteillage détecté sur Route de Ouakam - Retard estimé 15 min', time: '5 min' },
  { type: 'info', message: 'Nouveau client disponible dans votre zone - Bonus +20%', time: '12 min' },
];

const upcomingDeliveries = [
  { time: '11:00', client: 'Hôtel Terrou-Bi', location: 'Thiès → Dakar' },
  { time: '14:30', client: 'Restaurant Chez Loutcha', location: 'Mbour → Dakar' },
  { time: '16:00', client: 'Marché Sandaga', location: 'Saint-Louis → Dakar' },
];

const statusConfig = {
  in_transit: { label: 'En transit', color: 'bg-blue-100 text-blue-700', dotColor: 'bg-blue-500' },
  pickup: { label: 'Enlèvement', color: 'bg-amber-100 text-amber-700', dotColor: 'bg-amber-500' },
  pending: { label: 'En attente', color: 'bg-slate-100 text-slate-700', dotColor: 'bg-slate-400' },
  delivered: { label: 'Livré', color: 'bg-emerald-100 text-emerald-700', dotColor: 'bg-emerald-500' },
};

export default function TransporterDashboardPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-600">Bienvenue, Mamadou. Vous avez 3 livraisons en cours.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/transporter/routes"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Optimiser itinéraire
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
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
              className={`flex items-center gap-4 p-4 rounded-xl border ${
                alert.type === 'warning'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              {alert.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              ) : (
                <Zap className="w-5 h-5 text-blue-600 shrink-0" />
              )}
              <p className={`flex-1 text-sm ${alert.type === 'warning' ? 'text-amber-800' : 'text-blue-800'}`}>
                {alert.message}
              </p>
              <span className={`text-xs ${alert.type === 'warning' ? 'text-amber-600' : 'text-blue-600'}`}>
                Il y a {alert.time}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Shipments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Livraisons actives</h2>
            <Link to="/transporter/shipments" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Voir tout <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {activeShipments.map((shipment) => {
              const config = statusConfig[shipment.status as keyof typeof statusConfig];
              return (
                <div key={shipment.id} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium text-slate-900">{shipment.id}</span>
                        {shipment.priority === 'high' && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg">Prioritaire</span>
                        )}
                      </div>
                      <p className="text-slate-600">{shipment.client}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-lg ${config.color}`}>
                      {config.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Enlèvement</p>
                        <p className="text-sm text-slate-700">{shipment.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <MapPin className="w-3 h-3 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Livraison</p>
                        <p className="text-sm text-slate-700">{shipment.delivery}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        ETA: {shipment.eta}
                      </div>
                      <div className="text-sm font-medium text-slate-900">
                        {formatCurrency(shipment.value)} FCFA
                      </div>
                    </div>
                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${config.dotColor}`}
                        style={{ width: `${shipment.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Planning du jour</h2>
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {upcomingDeliveries.map((delivery, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-700">{delivery.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{delivery.client}</p>
                    <p className="text-sm text-slate-500 truncate">{delivery.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Status */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Mon véhicule</h2>
              <Truck className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Véhicule actif</p>
                <p className="text-xl font-bold">DK-4521-AB</p>
                <p className="text-sm text-slate-400">Camion frigorifique • 3.5T</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Fuel className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-slate-300">Carburant</span>
                  </div>
                  <p className="text-xl font-bold text-amber-400">75%</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-slate-300">État</span>
                  </div>
                  <p className="text-sm font-medium text-emerald-400">Opérationnel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Ce mois</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-700">156</p>
                <p className="text-sm text-blue-600">Livraisons</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <p className="text-3xl font-bold text-emerald-700">2.8M</p>
                <p className="text-sm text-emerald-600">FCFA gagnés</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
