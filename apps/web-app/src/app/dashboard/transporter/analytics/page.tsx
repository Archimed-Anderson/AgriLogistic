'use client';

import * as React from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Leaf,
  DollarSign,
  Download,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

const performanceData = [
  { name: 'Lun', efficacy: 85, cost: 120 },
  { name: 'Mar', efficacy: 92, cost: 110 },
  { name: 'Mer', efficacy: 78, cost: 140 },
  { name: 'Jeu', efficacy: 95, cost: 95 },
  { name: 'Ven', efficacy: 88, cost: 125 },
  { name: 'Sam', efficacy: 94, cost: 105 },
  { name: 'Dim', efficacy: 91, cost: 115 },
];

const pieData = [
  { name: 'Bio/Local', value: 45, color: '#10b981' },
  { name: 'Industriel', value: 35, color: '#f97316' },
  { name: 'Export', value: 20, color: '#6366f1' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
            ANALYTICS <span className="text-emerald-500">PRECISION</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">
            Intelligence de Marché & Performance Opérationnelle
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border-white/5 bg-slate-900/50 text-slate-400 rounded-xl h-12 flex gap-2 font-black uppercase text-[10px]"
          >
            <CalendarIcon size={14} /> Février 2024
          </Button>
          <Button className="bg-slate-100 hover:bg-white text-slate-950 rounded-xl h-12 px-8 font-black uppercase text-xs flex gap-2">
            <Download size={14} /> Exporter Rapport
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Marge Nette Moyenne', value: '24.5%', trend: 'up', icon: TrendingUp },
          { label: 'Coût au Kilomètre', value: '1.18€', trend: 'down', icon: TrendingDown },
          { label: 'Score Durabilité', value: 'A+', trend: 'stable', icon: Leaf },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-slate-950/40 border-white/5 shadow-xl rounded-3xl p-8 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                <stat.icon
                  size={20}
                  className={
                    stat.trend === 'up'
                      ? 'text-emerald-500'
                      : stat.trend === 'down'
                        ? 'text-orange-500'
                        : 'text-slate-400'
                  }
                />
              </div>
              <Badge className="bg-white/5 text-slate-500 border-none font-black text-[9px] uppercase">
                {stat.trend}
              </Badge>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
                {stat.label}
              </p>
              <p className="text-4xl font-black text-white tracking-tighter tabular-nums">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 bg-slate-950/40 border-white/5 shadow-2xl rounded-[2.5rem] p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                Efficacité vs Coûts
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Optimisation hebdomadaire par le moteur OR-Tools
              </p>
            </div>
            <BarChart3 className="text-emerald-500 h-6 w-6" />
          </div>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#475569"
                  fontSize={10}
                  fontWeight="bold"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={10}
                  fontWeight="bold"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                  }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Bar dataKey="efficacy" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="cost" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-4 bg-slate-950/40 border-white/5 shadow-2xl rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-1 w-full text-left">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">
              Segmentation Flux
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Répartition sectorielle des revenus
            </p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={10}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-3 w-full">
            {pieData.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-black text-white uppercase">{item.name}</span>
                </div>
                <span className="text-xs font-black tabular-nums">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
