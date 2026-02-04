/**
 * Farm Operations Page
 * Complete farm management with map, IoT, planning, and analytics
 */
import React from 'react';
import { FarmMap } from '@/components/farmer/operations/FarmMap';
import { IoTMonitor } from '@/components/farmer/operations/IoTMonitor';
import { CropRotationPlanner } from '@/components/farmer/operations/CropRotationPlanner';
import { InventoryTracker } from '@/components/farmer/operations/InventoryTracker';
import { BudgetAnalyzer } from '@/components/farmer/operations/BudgetAnalyzer';
import { ProfitabilityMatrix } from '@/components/farmer/operations/ProfitabilityMatrix';
import { useFarmOperations } from '@/hooks/farmer/useFarmOperations';
import { ArrowLeft, Download, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FarmOperationsPage() {
  const { fields, sensors, rotationPlans, inventory, budget, profitability, isLoading } =
    useFarmOperations();

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
                <h1 className="text-2xl font-bold text-gray-900">
                  🌾 Gestion des Opérations Agricoles
                </h1>
                <p className="text-sm text-gray-600">Vue complète de votre exploitation</p>
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
          {/* Farm Map */}
          <section>
            <FarmMap fields={fields || []} sensors={sensors || []} isLoading={isLoading} />
          </section>

          {/* IoT Monitoring */}
          <section>
            <IoTMonitor sensors={sensors || []} isLoading={isLoading} />
          </section>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <CropRotationPlanner plans={rotationPlans || []} isLoading={isLoading} />
              <BudgetAnalyzer budget={budget || []} isLoading={isLoading} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <InventoryTracker inventory={inventory || []} isLoading={isLoading} />
              <ProfitabilityMatrix profitability={profitability || []} isLoading={isLoading} />
            </div>
          </div>

          {/* Quick Actions */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <span className="text-3xl mb-2">🌱</span>
                <span className="text-sm font-medium text-gray-900">Planifier Semis</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <span className="text-3xl mb-2">📊</span>
                <span className="text-sm font-medium text-gray-900">Rapport Complet</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <span className="text-3xl mb-2">🔧</span>
                <span className="text-sm font-medium text-gray-900">Maintenance</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <span className="text-3xl mb-2">📱</span>
                <span className="text-sm font-medium text-gray-900">Ajouter Capteur</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
