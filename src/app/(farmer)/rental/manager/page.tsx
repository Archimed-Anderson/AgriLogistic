/**
 * Rental Manager Page
 * Complete rental management system
 */
'use client';

import React from 'react';
import { EquipmentInventory } from '@/components/farmer/rental/EquipmentInventory';
import { AvailabilityCalendar } from '@/components/farmer/rental/AvailabilityCalendar';
import { useRental } from '@/hooks/farmer/useRental';
import { ArrowLeft, Download, Settings, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RentalManagerPage() {
  const { equipment, rentals, maintenance, isLoading } = useRental();

  const stats = {
    totalEquipment: equipment?.length || 0,
    available: equipment?.filter((e) => e.status === 'available').length || 0,
    rented: equipment?.filter((e) => e.status === 'rented').length || 0,
    revenue: rentals?.reduce((sum, r) => sum + r.pricing.total, 0) || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/farmer/dashboard"
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🚜 Rental Manager</h1>
                <p className="text-sm text-gray-600">Gestion de location de matériel</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Exporter</span>
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Total Équipements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEquipment}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">En Location</p>
              <p className="text-2xl font-bold text-blue-600">{stats.rented}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Revenus du mois</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.revenue / 1000).toFixed(0)}K
                <span className="text-sm text-gray-500 ml-1">XOF</span>
              </p>
            </div>
          </div>

          {/* Equipment Inventory */}
          <section>
            <EquipmentInventory equipment={equipment || []} isLoading={isLoading} />
          </section>

          {/* Calendar */}
          <section>
            <AvailabilityCalendar
              equipment={equipment || []}
              rentals={rentals || []}
              isLoading={isLoading}
            />
          </section>

          {/* Quick Actions */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <span className="text-3xl mb-2">➕</span>
                <span className="text-sm font-medium text-gray-900">Nouvelle Location</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <span className="text-3xl mb-2">🔧</span>
                <span className="text-sm font-medium text-gray-900">Planifier Maintenance</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <span className="text-3xl mb-2">📍</span>
                <span className="text-sm font-medium text-gray-900">Tracking GPS</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <span className="text-3xl mb-2">📊</span>
                <span className="text-sm font-medium text-gray-900">Rapport Location</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
