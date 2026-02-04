'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  Wind,
  Droplets,
  Users,
  TrendingUp,
  Download,
  Globe,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ArrowUpRight,
  Calculator,
  ShieldCheck,
  Building2,
  TreePine,
  ExternalLink,
  FileDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const CARBON_DATA = [
  { month: 'JAN', footprint: 420 },
  { month: 'FEB', footprint: 380 },
  { month: 'MAR', footprint: 450 },
  { month: 'APR', footprint: 310 },
  { month: 'MAY', footprint: 290 },
  { month: 'JUN', footprint: 250 },
];

const ETHICAL_PIE = [
  { name: 'Direct Income', value: 65, color: '#10b981' },
  { name: 'Logistics', value: 15, color: '#3b82f6' },
  { name: 'Platform Fee', value: 10, color: '#6366f1' },
  { name: 'Retail Margin', value: 10, color: '#f59e0b' },
];

export default function ESGDashboard() {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      {/* 🍃 ESG HEADER */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Sustainability & ESG Intelligence
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            EU Deforestation Regulation (EUDR) Compliant • Carbon Audit Log • Social Impact Score
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="h-10 px-4 bg-white/5 border border-white/10 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            <FileDown className="w-4 h-4" />
            Export CSR Report
          </button>
          <button className="h-10 px-4 bg-emerald-600 border border-emerald-500/20 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">
            <Calculator className="w-4 h-4" />
            Audit Calculator
          </button>
        </div>
      </header>

      {/* 📊 GLOBAL PERFORMANCE HUD */}
      <div className="grid grid-cols-4 gap-6 shrink-0">
        <ESGStatCard
          label="Carbon Footprint"
          value="2.4"
          unit="Tons CO2e"
          delta="-12%"
          trend="down"
          icon={Wind}
          color="emerald"
        />
        <ESGStatCard
          label="Deforestation Risk"
          value="Low"
          unit="0.02% Area"
          icon={TreePine}
          color="blue"
        />
        <ESGStatCard
          label="Ethical Score"
          value="94"
          unit="/100"
          delta="+4.2"
          trend="up"
          icon={Users}
          color="indigo"
        />
        <ESGStatCard
          label="Water Efficiency"
          value="88"
          unit="Litres/Kg"
          delta="+2.5%"
          trend="down"
          icon={Droplets}
          color="cyan"
        />
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* LEFT: ANALYTICS FLIGHT DECK */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* CARBON TRENDS */}
          <Card className="flex-1 bg-slate-950/40 border-white/5 rounded-[40px] p-8 flex flex-col gap-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black italic tracking-tighter text-white uppercase">
                  Decarbonization Roadmap
                </h3>
                <span className="text-[9px] font-mono text-slate-500 uppercase font-black">
                  Monthly CO2 Emissions Tracking
                </span>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[8px] font-black text-emerald-500 uppercase">
                  -18% v Prev Year
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CARBON_DATA}>
                  <defs>
                    <linearGradient id="colorFootprint" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="footprint"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorFootprint)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-6 h-[40%]">
            <Card className="bg-slate-950/40 border-white/5 rounded-[40px] p-8 flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
                  Value Redistribution
                </h4>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ETHICAL_PIE}
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {ETHICAL_PIE.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex flex-col gap-2 pl-4 border-l border-white/5">
                {ETHICAL_PIE.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[9px] font-black text-slate-400 uppercase">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-slate-950/40 border-white/5 rounded-[40px] p-8 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  EUDR Compliance Status
                </h4>
              </div>
              <div className="space-y-4 pt-2">
                <ComplianceItem label="Satellite Plot Monitoring" status="READY" />
                <ComplianceItem label="Diligence Document Pack" status="UPDATING" />
                <ComplianceItem label="Zero Deforestation Proofs" status="READY" />
                <ComplianceItem label="Land Tenure Verification" status="READY" />
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT: REAL-TIME FEED */}
        <aside className="w-[380px] flex flex-col gap-6 overflow-hidden">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic px-2">
            CSR Operational Feed
          </h3>
          <ScrollArea className="flex-1 bg-slate-900/10 rounded-[32px] border border-white/5 p-4">
            <div className="space-y-4">
              <CSRAlert
                title="New RSE Export Requested"
                desc="Carrefour Logistics requested Q4 Carbon report."
                type="info"
              />
              <CSRAlert
                title="Alert: Water Stress Detected"
                desc="Zone Z-42 exceeds sustainability threshold."
                type="warn"
              />
              <CSRAlert
                title="Social Audit Passed"
                desc="Ferme du Soleil: 100% Wage Compliance."
                type="success"
              />
              <CSRAlert
                title="EUDR Scan Complete"
                desc="Plot P-15 verification: Geolocation Verified."
                type="success"
              />
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}

function ESGStatCard({ label, value, unit, delta, trend, icon: Icon, color }: any) {
  const colorClasses =
    {
      emerald: 'bg-emerald-500/10 text-emerald-500',
      blue: 'bg-blue-500/10 text-blue-500',
      indigo: 'bg-indigo-500/10 text-indigo-500',
      cyan: 'bg-cyan-500/10 text-cyan-500',
    }[color] || 'bg-white/10 text-white';

  return (
    <Card className="bg-[#05070a] border-white/5 p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorClasses)}>
          <Icon className="w-5 h-5" />
        </div>
        {delta && (
          <div
            className={cn(
              'flex items-center gap-1 text-[10px] font-black tracking-tighter',
              trend === 'up' ? 'text-emerald-500' : 'text-blue-500'
            )}
          >
            {trend === 'up' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <TrendingUp className="w-3 h-3 rotate-180" />
            )}
            {delta}
          </div>
        )}
      </div>
      <div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white italic tracking-tighter uppercase">
            {value}
          </span>
          <span className="text-[10px] font-black text-slate-600 uppercase italic">{unit}</span>
        </div>
      </div>
    </Card>
  );
}

function ComplianceItem({ label, status }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{label}</span>
      <span
        className={cn(
          'text-[8px] font-black px-2 py-0.5 rounded',
          status === 'READY'
            ? 'bg-emerald-500/10 text-emerald-500'
            : 'bg-amber-500/10 text-amber-500'
        )}
      >
        {status}
      </span>
    </div>
  );
}

function CSRAlert({ title, desc, type }: any) {
  const icon = {
    info: <Building2 className="w-4 h-4 text-blue-500" />,
    warn: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  }[type];

  return (
    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-white uppercase italic">{title}</p>
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight mt-1">{desc}</p>
      </div>
    </div>
  );
}
