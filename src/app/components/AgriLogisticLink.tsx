import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Package,
  Calendar,
  Users,
  Search,
  Filter,
  BarChart3,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import {
  mockLoads,
  mockTrucks,
  mockMatches,
  mockAnalytics,
  Load,
  Truck as TruckType,
  LogisticsMatch,
} from '../data/logistics-operations';

// Helper for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
    case 'Delivered':
    case 'Completed':
    case 'Accepted':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'In Transit':
    case 'En cours':
    case 'Matched':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Pending':
    case 'Suggested':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'Cancelled':
    case 'Rejected':
    case 'Offline':
    case 'Maintenance':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

export function AgriLogisticLink() {
  const [activeTab, setActiveTab] = useState<'overview' | 'loads' | 'trucks' | 'matches'>(
    'overview'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Overview Tab Component
  const OverviewTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3 mr-1" /> +12%
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Chargements Actifs</p>
            <p className="text-2xl font-bold">{mockAnalytics.activeLoads}</p>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Truck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
              <CheckCircle className="h-3 w-3 mr-1" /> {mockAnalytics.availableTrucks} dispos
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Flotte Totale</p>
            <p className="text-2xl font-bold">{mockAnalytics.totalTrucks}</p>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-muted-foreground">Taux de match</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Performance IA</p>
            <p className="text-2xl font-bold">{mockAnalytics.matchRate.toFixed(1)}%</p>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Volume d'Affaires</p>
            <p className="text-2xl font-bold">
              {(mockAnalytics.totalRevenue / 1000000).toFixed(1)}M FCFA
            </p>
          </div>
        </div>
      </div>

      {/* Recent Matches & Live Map Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Matches List */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              Derniers Matchings
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {mockMatches.slice(0, 5).map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      Chargement #{match.loadId.slice(-4)} → {match.truckId}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {match.distance.toFixed(0)} km • {match.estimatedCost.toLocaleString()} FCFA
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{match.matchScore}% Match</div>
                  <div className="text-xs text-muted-foreground">Il y a 2 min</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            Top Routes
          </h3>
          <div className="space-y-4">
            {mockAnalytics.topRoutes.map((route, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm truncate max-w-[180px]">
                    {route.origin} → {route.destination}
                  </span>
                  <span className="text-sm font-bold">{route.frequency} trajets</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(route.frequency / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t">
            <h4 className="font-medium mb-4">Répartition par Produit</h4>
            <div className="space-y-3">
              {mockAnalytics.topProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{prod.product}</span>
                  <span className="font-medium">{prod.volume} T</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loads Tab Component
  const LoadsTable = () => (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 border-b flex items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par ID, produit, ville..."
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="p-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Filter className="h-4 w-4 text-gray-500" />
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            + Nouveau Chargement
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 border-b">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Produit</th>
              <th className="px-6 py-3">Quantité</th>
              <th className="px-6 py-3">Trajet</th>
              <th className="px-6 py-3">Prix Offre</th>
              <th className="px-6 py-3">Statut</th>
              <th className="px-6 py-3">Score IA</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockLoads
              .filter((l) => l.status !== 'Delivered')
              .slice(0, 10)
              .map((load) => (
                <tr
                  key={load.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{load.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{load.productType}</div>
                    <div className="text-xs text-muted-foreground">
                      {load.packaging || 'Standard'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {load.quantity} {load.unit}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        {load.originCity || 'Origine'}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        {load.destinationCity || 'Destination'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {load.priceOffer.toLocaleString()} {load.currency}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        load.status
                      )}`}
                    >
                      {load.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {load.aiMatchScore ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              load.aiMatchScore > 80 ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${load.aiMatchScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{load.aiMatchScore}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:underline">Détails</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AgriLogistic Link</h2>
          <p className="text-muted-foreground">
            Plateforme de mise en relation logistique intelligente
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('loads')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'loads'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Chargements
          </button>
          <button
            onClick={() => setActiveTab('trucks')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'trucks'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Camions
          </button>
        </div>
      </div>

      {/* Dynamic Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'loads' && <LoadsTable />}
      {activeTab === 'trucks' && (
        <div className="flex items-center justify-center p-12 border rounded-xl bg-card text-muted-foreground">
          Module Camions en cours de développement...
        </div>
      )}
    </div>
  );
}

export default AgriLogisticLink;
