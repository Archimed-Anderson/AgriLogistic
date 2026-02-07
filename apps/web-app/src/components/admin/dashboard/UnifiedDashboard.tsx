'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Globe, 
  Cpu, 
  Wallet,
  LayoutGrid,
  Search,
  Download,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Mock data for the unified view
const AGGREGATED_DATA = [
  { name: 'Mon', income: 4500, users: 400, transactions: 240 },
  { name: 'Tue', income: 5200, users: 450, transactions: 300 },
  { name: 'Wed', income: 4800, users: 420, transactions: 280 },
  { name: 'Thu', income: 6100, users: 500, transactions: 350 },
  { name: 'Fri', income: 5900, users: 480, transactions: 320 },
  { name: 'Sat', income: 7200, users: 600, transactions: 400 },
  { name: 'Sun', income: 6800, users: 550, transactions: 380 },
];

const MODULES = [
  { id: 'insurance', label: 'Agri-Insurance', icon: Shield, status: 'Active', data: '4.2k Risk Ops', color: 'emerald' },
  { id: 'logistics', label: 'Fleet & SC', icon: Globe, status: 'Active', data: '85 Routes Live', color: 'blue' },
  { id: 'finance', label: 'Credit Hub', icon: Wallet, status: 'Warning', data: '12 Pending KYC', color: 'amber' },
  { id: 'ai', label: 'Vision Engine', icon: Cpu, status: 'Active', data: '99.8% Accuracy', color: 'purple' },
];

export function UnifiedDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 pb-12">
      {/* --- TOP HUD: SYSTEM PULSE --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PulseCard label="Total Revenue" value="€124,530" trend="+15.2%" icon={TrendingUp} positive />
        <PulseCard label="Active Nodes" value="1,842" trend="+4.1%" icon={Activity} positive />
        <PulseCard label="System Load" value="42%" trend="-5.4%" icon={Cpu} positive={false} />
        <PulseCard label="Safety Score" value="98.5" trend="Stable" icon={Shield} positive />
      </section>

      {/* --- CENTER SECTION: ANALYTICS & MODULES --- */}
      <div className="grid grid-cols-12 gap-8">
        {/* Main Analytics View */}
        <div className="col-span-12 lg:col-span-8 p-1 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="bg-slate-950/40 rounded-[2.2rem] p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Unified Performance Explorer</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cross-Platform Analytics v5.0 • Live Aggregation</p>
              </div>
              <div className="flex gap-2">
                <button className="h-10 px-4 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all flex items-center gap-2">
                  <Filter className="w-3 h-3" /> Filter
                </button>
                <button className="h-10 px-4 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all flex items-center gap-2">
                  <Download className="w-3 h-3" /> Export
                </button>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={AGGREGATED_DATA}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10b981" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Modular Access Panel */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col gap-6 h-full">
            <h3 className="text-sm font-black text-white italic uppercase tracking-widest flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-emerald-500" /> Active Modules
            </h3>
            
            <div className="space-y-4">
              {MODULES.map((mod) => (
                <ModuleWidget key={mod.id} {...mod} />
              ))}
            </div>

            <button className="mt-auto h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-white">
              <PlusIcon className="w-4 h-4" /> Add Custom Widget
            </button>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: OPERATIONAL LOGS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 space-y-6">
          <h3 className="text-sm font-black text-white italic uppercase tracking-widest flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-500" /> Global Search & Audit
          </h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="SEARCH OPERATIONS, TRANSACTIONS, NODES..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 text-[10px] font-black text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/30 transition-all uppercase tracking-widest"
            />
          </div>
          <div className="space-y-4">
            <AuditItem type="INCIDENT" title="Network spike in Delta-Zone 4" time="2m ago" sev="high" />
            <AuditItem type="BLOCKCHAIN" title="Asset #QR-889 synchronized to Solana" time="15m ago" sev="low" />
            <AuditItem type="INSURANCE" title="New policy drafted for Cooper-Alpha" time="1h ago" sev="med" />
          </div>
        </div>

        <div className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 space-y-6">
          <h3 className="text-sm font-black text-white italic uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" /> User Impact Analytics
          </h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={AGGREGATED_DATA}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                  <Bar dataKey="users" radius={[6, 6, 0, 0]}>
                    {AGGREGATED_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? '#10b981' : '#1e293b'} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
            <span>Growth: +450 users/mo</span>
            <span>Ret: 92%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function PulseCard({ label, value, trend, icon: Icon, positive }: any) {
  return (
    <div className="p-6 rounded-[2rem] bg-slate-950/40 border border-white/5 hover:border-white/20 transition-all flex items-center gap-6 group overflow-hidden relative">
      <div className="absolute right-0 top-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform">
        <Icon className="w-24 h-24 text-white" />
      </div>
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
        <Icon className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white italic tracking-tighter leading-none">{value}</span>
          <span className={cn(
            "text-[9px] font-black uppercase",
            positive ? "text-emerald-500" : "text-amber-500"
          )}>{trend}</span>
        </div>
      </div>
    </div>
  );
}

function ModuleWidget({ label, icon: Icon, status, data, color }: any) {
  const colors: any = {
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all cursor-pointer group">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", colors[color])}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[11px] font-black text-white uppercase tracking-wider mb-0.5">{label}</h4>
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{data}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full animate-pulse",
          status === 'Active' ? "bg-emerald-500" : "bg-amber-500"
        )} />
        <span className="text-[8px] font-black text-slate-600 uppercase italic">{status}</span>
      </div>
    </div>
  );
}

function AuditItem({ type, title, time, sev }: any) {
  const sevColor = {
    high: 'text-red-500 bg-red-500/10',
    med: 'text-amber-500 bg-amber-500/10',
    low: 'text-emerald-500 bg-emerald-500/10',
  }[sev as 'high' | 'med' | 'low'];

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/2 hover:bg-white/5 transition-all group">
      <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest", sevColor)}>
        {type}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-slate-300 leading-tight group-hover:text-white transition-colors">{title}</p>
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{time}</span>
      </div>
      <MoreHorizontal className="w-4 h-4 text-slate-700 opacity-0 group-hover:opacity-100 transition-all cursor-pointer" />
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
  );
}
