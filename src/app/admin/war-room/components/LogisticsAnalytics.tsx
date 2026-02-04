import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { TrendingUp, Zap, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const PERFORMANCE_DATA = [
  { name: 'Lun', transit: 142, volume: 450, prediction: 460 },
  { name: 'Mar', transit: 135, volume: 420, prediction: 430 },
  { name: 'Mer', transit: 158, volume: 510, prediction: 500 },
  { name: 'Jeu', transit: 148, volume: 480, prediction: 490 },
  { name: 'Ven', transit: 162, volume: 620, prediction: 640 },
  { name: 'Sam', transit: 130, volume: 380, prediction: 370 },
  { name: 'Dim', transit: 125, volume: 350, prediction: 340 },
];

export function LogisticsAnalytics() {
  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-xl rounded-[40px] overflow-hidden border border-border shadow-2xl transition-all hover:bg-card/50">
      {/* Header */}
      <div className="p-8 border-b border-border bg-foreground/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-tighter">
                Analytique Opérationnelle
              </h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                Insights & Prédictions ML
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
            Flux Stable
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10">
        {/* KPI Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-foreground/5 p-5 rounded-[28px] border border-border">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Transit Moyen</span>
            </div>
            <h4 className="text-xl font-black text-foreground tracking-tighter">142m</h4>
            <p className="text-[9px] text-emerald-500 font-bold mt-1 text-right">-12% vs S3</p>
          </div>
          <div className="bg-foreground/5 p-5 rounded-[28px] border border-border">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Efficiency Sc.
              </span>
            </div>
            <h4 className="text-xl font-black text-foreground tracking-tighter">94.8</h4>
            <p className="text-[9px] text-primary font-bold mt-1 text-right">+2.4 pts</p>
          </div>
        </div>

        {/* Transit Time Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">
              Évolution des Délais
            </h4>
            <span className="text-[9px] text-muted-foreground italic">(dernières 24h)</span>
          </div>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PERFORMANCE_DATA}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis dataKey="name" hide />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                  itemStyle={{ color: '#3b82f6', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="transit"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={false}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictive Volume Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">
              Volume Prévisionnel
            </h4>
            <span className="text-[9px] text-primary font-black uppercase tracking-tighter">
              ML_ENGINE: ON
            </span>
          </div>
          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PERFORMANCE_DATA.slice(-4)}>
                <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                  {PERFORMANCE_DATA.slice(-4).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 3 ? '#3b82f6' : 'rgba(255,255,255,0.1)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <button className="p-6 bg-foreground/5 border-t border-border flex items-center justify-center gap-3 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] hover:bg-foreground/10 hover:text-primary transition-all group">
        Générer un Rapport d'Efficience
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
