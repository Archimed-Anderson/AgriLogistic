'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TrendingUp, Calendar, Activity, Download, FileText } from 'lucide-react';
import { yieldEvolutionData } from '@/data/crop-intelligence-data';
import { useRef } from 'react';

export function YieldEvolutionChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  // Export PNG function
  const handleExportPNG = async () => {
    if (!chartRef.current) return;

    // Using html2canvas library would be ideal, but for now we'll use a simple approach
    alert(
      "Export PNG: Cette fonctionnalité nécessite html2canvas. Pour l'implémenter complètement, installer: pnpm add html2canvas"
    );
  };

  // Export CSV function
  const handleExportCSV = () => {
    const csvContent = [
      ['Mois', 'Rendement Réel (t/ha)', 'Prédiction IA (t/ha)'],
      ...yieldEvolutionData.map((d) => [d.month, d.rendement, d.prediction]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rendement_evolution_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-black text-[#0A2619]">Évolution du Rendement</h3>
          </div>
          <p className="text-sm text-slate-600 font-medium">
            Rendement moyen prévu sur les 6 derniers mois
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300"
            title="Exporter en CSV"
          >
            <FileText className="h-4 w-4 text-slate-700" />
            <span className="text-xs font-bold text-slate-700">CSV</span>
          </button>
          <button
            onClick={handleExportPNG}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors border border-purple-300"
            title="Exporter en PNG"
          >
            <Download className="h-4 w-4 text-purple-700" />
            <span className="text-xs font-bold text-purple-700">PNG</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-bold text-purple-700">6 mois</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartRef} className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={yieldEvolutionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRendement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: '600' }}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: '600' }}
              label={{
                value: 't/ha',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: '12px', fontWeight: '700', fill: '#64748b' },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: '600',
              }}
              labelStyle={{ color: '#0A2619', fontWeight: '700', marginBottom: '8px' }}
            />
            <Legend
              wrapperStyle={{
                fontSize: '14px',
                fontWeight: '700',
                paddingTop: '20px',
              }}
            />
            <Area
              type="monotone"
              dataKey="rendement"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#colorRendement)"
              name="Rendement Réel"
            />
            <Area
              type="monotone"
              dataKey="prediction"
              stroke="#8b5cf6"
              strokeWidth={3}
              strokeDasharray="5 5"
              fill="url(#colorPrediction)"
              name="Prédiction IA"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-slate-500 font-medium mb-1">Rendement Actuel</p>
          <p className="text-2xl font-black text-emerald-600">6.7 t/ha</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 font-medium mb-1">Prédiction Févr.</p>
          <p className="text-2xl font-black text-purple-600">6.9 t/ha</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 font-medium mb-1">Évolution</p>
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <p className="text-2xl font-black text-emerald-600">+8.1%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
