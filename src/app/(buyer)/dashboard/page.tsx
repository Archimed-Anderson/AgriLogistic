/**
 * Buyer Dashboard Page
 * Sourcing Intelligent - Main dashboard for buyers
 */
'use client';

import React from 'react';
import { useBuyerDashboard } from '@/hooks/buyer/useBuyerDashboard';
import {
  TrendingDown,
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  Wallet,
  Calendar,
  Bell,
  ArrowRight,
  Leaf,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];

const categoryLabels: Record<string, string> = {
  vegetables: 'Légumes',
  fruits: 'Fruits',
  dairy: 'Produits laitiers',
  meat: 'Viande',
  cereals: 'Céréales',
};

const monthNames = [
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Août',
  'Sep',
  'Oct',
  'Nov',
  'Déc',
];

export default function BuyerDashboardPage() {
  const { stats, priceAlerts, seasonalProducts, spending, isLoading } = useBuyerDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const spendingChartData = spending.map((s) => ({
    name: categoryLabels[s.category] || s.category,
    value: s.amount,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sourcing Intelligent</h1>
          <p className="text-slate-600">Bienvenue ! Voici vos opportunités du jour.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Janvier 2026
          </button>
          <button className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Nouvelle commande
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-600">Total dépensé</span>
            <div className="p-2 bg-amber-100 rounded-xl">
              <Wallet className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(stats?.totalSpent || 0)}
          </p>
          <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" />
            +12% ce mois
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-600">Commandes</span>
            <div className="p-2 bg-blue-100 rounded-xl">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats?.totalOrders}</p>
          <p className="text-sm text-slate-500 mt-2">{stats?.pendingOrders} en attente</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-600">Fournisseurs</span>
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats?.suppliersCount}</p>
          <p className="text-sm text-slate-500 mt-2">Actifs ce mois</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-600">Économies</span>
            <div className="p-2 bg-green-100 rounded-xl">
              <TrendingDown className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(stats?.savedThisMonth || 0)}
          </p>
          <p className="text-sm text-slate-500 mt-2">Grâce aux alertes prix</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Alerts */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <Bell className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Alertes Prix</h2>
                <p className="text-sm text-slate-500">{priceAlerts.length} baisses détectées</p>
              </div>
            </div>
            <button className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {priceAlerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{alert.product.name}</h3>
                      <p className="text-sm text-slate-500">{alert.product.origin}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400 line-through">
                        {formatCurrency(alert.previousPrice)}/kg
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        {formatCurrency(alert.currentPrice)}/kg
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <TrendingDown className="w-3 h-3" />
                      {Math.abs(alert.changePercent).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Calendar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Produits de Saison</h2>
                <p className="text-sm text-slate-500">Janvier 2026</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {seasonalProducts.map((sp) => (
              <div
                key={sp.product.id}
                className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900 text-sm">{sp.product.name}</h3>
                  <p className="text-xs text-slate-500">{sp.product.origin}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 text-sm">
                    {formatCurrency(sp.product.pricePerKg)}/kg
                  </p>
                  {sp.isCurrentlySeasonal && (
                    <span className="text-xs text-emerald-600 font-medium">En saison</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spending Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Répartition des dépenses</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {spendingChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {spending.map((s, index) => (
              <div key={s.category} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-slate-600">{categoryLabels[s.category]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Dépenses par catégorie</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
