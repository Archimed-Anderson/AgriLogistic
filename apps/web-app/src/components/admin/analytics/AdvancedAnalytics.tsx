'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Download, 
  Share2, 
  RefreshCw, 
  Filter, 
  Calendar,
  Layers,
  Zap,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart as RechartsBarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn } from '@/lib/utils';

const TIME_SERIES_DATA = [
  { time: '00:00', yield: 45, energy: 32, cost: 12 },
  { time: '04:00', yield: 52, energy: 28, cost: 15 },
  { time: '08:00', yield: 85, energy: 75, cost: 45 },
  { time: '12:00', yield: 65, energy: 82, cost: 38 },
  { time: '16:00', yield: 92, energy: 45, cost: 30 },
  { time: '20:00', yield: 78, energy: 38, cost: 22 },
  { time: '23:59', yield: 58, energy: 30, cost: 18 },
];

const DISTRIBUTION_DATA = [
  { name: 'Cote d\'Ivoire', value: 400, color: '#10b981' },
  { name: 'Ghana', value: 300, color: '#3b82f6' },
  { name: 'Senegal', value: 200, color: '#8b5cf6' },
  { name: 'Nigeria', value: 278, color: '#f59e0b' },
];

export function AdvancedAnalytics() {
  const [activeRange, setActiveRange] = useState('24h');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- ANALYTICS HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex bg-slate-950/50 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
           {['1h', '24h', '7d', '30d', 'All'].map(range => (
             <button 
               key={range}
               onClick={() => setActiveRange(range)}
               className={cn(
                 "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                 activeRange === range ? "bg-white/10 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
               )}
             >
               {range}
             </button>
           ))}
        </div>
        <div className="flex gap-3">
          <button className="h-12 px-6 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
             <Download className="w-4 h-4" /> Export Report
          </button>
          <button className="h-12 px-6 bg-emerald-500 text-black rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
             <RefreshCw className="w-4 h-4" /> Live Sync
          </button>
        </div>
      </div>

      {/* --- GRID LAYOUT --- */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Real-time Yield Area Chart */}
        <div className="col-span-12 lg:col-span-8 p-1 bg-white/5 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="bg-[#05070a] rounded-[2.8rem] p-8 space-y-8">
             <div className="flex items-start justify-between">
                <div className="space-y-1">
                   <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                      <Zap className="w-5 h-5 text-yellow-500" /> Operational Throughput
                   </h3>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aggregated data from 1.4k active nodes</p>
                </div>
                <div className="flex flex-col items-end">
                   <div className="text-3xl font-black text-emerald-500 italic font-mono tracking-tighter">+8.4%</div>
                   <span className="text-[8px] font-black text-slate-600 uppercase">vs Last Period</span>
                </div>
             </div>

             <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={TIME_SERIES_DATA}>
                      <defs>
                        <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}
                      />
                      <Area type="step" dataKey="yield" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorYield)" />
                      <Area type="monotone" dataKey="energy" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorEnergy)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>

             <div className="grid grid-cols-4 gap-8 pt-8 border-t border-white/5">
                <MiniStat label="Avg Latency" value="142ms" color="text-emerald-500" />
                <MiniStat label="Error Rate" value="0.02%" color="text-red-500" />
                <MiniStat label="Success Rate" value="99.9%" color="text-blue-500" />
                <MiniStat label="Nodes Connected" value="1,842" color="text-purple-500" />
             </div>
          </div>
        </div>

        {/* Global Distribution Pie Chart */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
           <div className="flex-1 p-8 bg-white/3 rounded-[3rem] border border-white/5 backdrop-blur-3xl flex flex-col gap-8">
              <h3 className="text-sm font-black text-white italic uppercase tracking-widest flex items-center gap-2">
                 <Layers className="w-4 h-4 text-purple-500" /> Regional Alpha
              </h3>
              <div className="flex-1 flex items-center justify-center relative">
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Ops</span>
                    <span className="text-2xl font-black text-white italic tracking-tighter">1,178</span>
                 </div>
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie 
                         data={DISTRIBUTION_DATA} 
                         innerRadius={80} 
                         outerRadius={100} 
                         paddingAngle={8} 
                         dataKey="value"
                        >
                          {DISTRIBUTION_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                 {DISTRIBUTION_DATA.map(item => (
                   <div key={item.name} className="flex items-center justify-between text-[11px] font-black uppercase tracking-tighter">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                         <span className="text-slate-400">{item.name}</span>
                      </div>
                      <span className="text-white italic">{Math.round((item.value / 1178) * 100)}%</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="h-48 bg-emerald-500 p-8 rounded-[3rem] text-black shadow-2xl shadow-emerald-500/20 group cursor-pointer overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform">
                 <TrendingUp className="w-32 h-32 text-black" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">Strategic Insight</p>
              <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-[0.9] mb-4">Market demand in Senegal is peaking.</h4>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
           </div>
        </div>

        {/* Predictive Modelling / Resource Cost */}
        <div className="col-span-12 p-8 bg-slate-950/40 rounded-[3rem] border border-white/5 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white italic uppercase tracking-widest flex items-center gap-2">
                 <LineChartIcon className="w-4 h-4 text-blue-500" /> Predictive Resource allocation
              </h3>
              <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[10px] font-black text-blue-500 uppercase italic">Adaptive AI Protocol v2</div>
           </div>
           
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <RechartsBarChart data={TIME_SERIES_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff03" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                    <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                       {TIME_SERIES_DATA.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#1e293b'} />
                       ))}
                    </Bar>
                 </RechartsBarChart>
              </ResponsiveContainer>
           </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function MiniStat({ label, value, color }: any) {
  return (
    <div className="flex flex-col gap-1">
       <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
       <span className={cn("text-xl font-black italic tracking-tighter font-mono", color)}>{value}</span>
    </div>
  );
}
