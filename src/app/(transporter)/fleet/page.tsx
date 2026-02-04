/**
 * Fleet Management Page
 * Main page for managing vehicles, maintenance, and costs
 */
import React, { useState } from 'react';
import { VehicleList } from '@/components/transporter/fleet/VehicleList';
import { FleetStats } from '@/components/transporter/fleet/FleetStats';
import { MaintenanceScheduler } from '@/components/transporter/fleet/MaintenanceScheduler';
import { useFleetData } from '@/hooks/transporter/useFleetData';
import { Plus, Filter, Download } from 'lucide-react';
import type { Vehicle } from '@/types/transporter';

export default function FleetPage() {
  const { vehicles, stats, isLoading } = useFleetData();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleVehicleClick = (vehicle: Vehicle) => {
    // TODO: Open vehicle details modal
    console.log('Clicked vehicle:', vehicle);
  };

  const filteredVehicles = vehicles?.filter(
    (v) => filterStatus === 'all' || v.status === filterStatus
  );

  // Extract all maintenance tasks
  const maintenanceTasks =
    vehicles?.flatMap((v) => v.maintenanceSchedule.map((m) => ({ ...m, vehicleName: v.name }))) ||
    [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🚛 Gestion de Flotte</h1>
              <p className="text-sm text-gray-600">
                {vehicles?.length || 0} véhicules • {stats?.active || 0} en mission
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span>Rapport</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Nouveau Véhicule</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        {stats && <FleetStats stats={stats} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterStatus('in_use')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'in_use'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                En mission
              </button>
              <button
                onClick={() => setFilterStatus('available')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'available'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Disponibles
              </button>
              <button
                onClick={() => setFilterStatus('maintenance')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'maintenance'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Maintenance
              </button>
            </div>

            {/* Vehicle List */}
            <VehicleList vehicles={filteredVehicles || []} onVehicleClick={handleVehicleClick} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <MaintenanceScheduler tasks={maintenanceTasks} />

            {/* Quick Tips */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Conseil d'entretien</h3>
              <p className="text-sm text-blue-700">
                La maintenance préventive permet d'économiser jusqu'à 20% sur les coûts de
                réparation. Vérifiez régulièrement la pression des pneus pour optimiser la
                consommation de carburant.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
