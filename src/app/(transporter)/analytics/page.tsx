/**
 * Analytics Page
 * Comprehensive performance analytics for transporters
 */
import React, { useState } from 'react';
import { PerformanceCharts } from '@/components/transporter/analytics/PerformanceCharts';
import { EfficiencyMetrics } from '@/components/transporter/analytics/EfficiencyMetrics';
import { useAnalyticsData } from '@/hooks/transporter/useAnalyticsData';
import { Download, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  const { metrics, isLoading } = useAnalyticsData();
  const [period, setPeriod] = useState<string>('month');

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
              <h1 className="text-2xl font-bold text-gray-900">
                ðŸ“Š Analytics & Performance
              </h1>
              <p className="text-sm text-gray-600">
                Indicateurs clés et optimisation
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 p-0 text-gray-700 font-medium"
                >
                  <option value="week">Cette Semaine</option>
                  <option value="month">Ce Mois</option>
                  <option value="quarter">Ce Trimestre</option>
                  <option value="year">Cette Année</option>
                </select>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                <Download className="w-4 h-4" />
                <span>Exporter PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {metrics && (
          <div className="space-y-8">
            {/* Efficiency Metrics (Top Cards) */}
            <EfficiencyMetrics metrics={metrics} />

            {/* Performance Charts */}
            <PerformanceCharts metrics={metrics} />

            {/* AI Recommendations Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-3 backdrop-blur-sm">
                  âœ¨ IA AgriLogistic
                </div>
                <h3 className="text-xl font-bold mb-2">Conseil d'optimisation</h3>
                <p className="text-indigo-100 max-w-2xl mb-4">
                  Votre consommation de carburant est 12% plus élevée que la moyenne de la flotte sur les trajets Dakar-Touba. 
                  Une réduction de la vitesse de 5km/h pourrait économiser environ 150,000 FCFA par mois.
                </p>
                <button className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
                  Voir l'analyse détaillée
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


