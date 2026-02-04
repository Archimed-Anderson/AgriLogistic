'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Server,
  ShieldCheck,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Settings,
  Cpu,
  Zap,
  Users,
  TrendingUp,
  BarChart3,
  Target,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
} from 'recharts';

// --- MOCK DATA ---
const SYSTEM_METRICS = [
  { time: '10:00', cpu: 45, memory: 62, latency: 120 },
  { time: '10:05', cpu: 48, memory: 64, latency: 125 },
  { time: '10:10', cpu: 75, memory: 70, latency: 250 }, // Spike
  { time: '10:15', cpu: 60, memory: 68, latency: 180 },
  { time: '10:20', cpu: 50, memory: 65, latency: 130 },
];

const SERVICES_SLA = [
  { name: 'API Gateway', uptime: 99.98, status: 'OPERATIONAL', latency: '45ms', sla: 99.9 },
  { name: 'Search Engine', uptime: 99.5, status: 'DEGRADED', latency: '350ms', sla: 99.9 },
  { name: 'Payments', uptime: 100.0, status: 'OPERATIONAL', latency: '120ms', sla: 99.99 },
  { name: 'Auth / SSO', uptime: 99.99, status: 'OPERATIONAL', latency: '80ms', sla: 99.95 },
];

const BUSINESS_FUNNEL = [
  { stage: 'Visitors', value: 12000, drop: 0 },
  { stage: 'Signups', value: 3500, drop: 70 },
  { stage: 'KYC Verified', value: 2100, drop: 40 },
  { stage: 'First Trade', value: 1500, drop: 28 },
  { stage: 'Repeat', value: 900, drop: 40 },
];

// --- COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
  const colors =
    status === 'OPERATIONAL'
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : status === 'DEGRADED'
        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        : 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${colors}`}>{status}</span>
  );
};

const KpiCard = ({ title, value, sub, trend, target }: any) => (
  <div className="bg-[#0D1117]/60 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 relative group overflow-hidden">
    <div className="flex justify-between items-start z-10">
      <h4 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{title}</h4>
      {trend && (
        <div
          className={`flex items-center gap-1 text-[9px] font-bold ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}
        >
          {trend > 0 ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="flex items-baseline gap-2 z-10">
      <span className="text-2xl font-black text-white">{value}</span>
      <span className="text-[10px] text-gray-500 font-mono">{sub}</span>
    </div>
    {target && (
      <div className="mt-2 z-10">
        <div className="flex justify-between text-[9px] text-gray-500 mb-1">
          <span>Target</span>
          <span>{target}</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 w-[92%]" />
        </div>
      </div>
    )}
    {/* BG Effect */}
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-colors" />
  </div>
);

export default function PerformancePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('SYSTEM'); // SYSTEM, BUSINESS

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 PULSE BG */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #10b981 0%, transparent 60%)',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-teal-600/20 p-3 rounded-2xl border border-teal-500/30 shadow-lg shadow-teal-500/10">
            <Activity className="w-8 h-8 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Perf <span className="text-teal-500">MONITOR</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              SLA Tracking & Business KPIs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('SYSTEM')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                activeTab === 'SYSTEM'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Server className="w-3 h-3" /> System & SLA
            </button>
            <button
              onClick={() => setActiveTab('BUSINESS')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                activeTab === 'BUSINESS'
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3 h-3" /> Business KPIs
            </button>
          </div>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10">
            <Download className="w-3 h-3" /> Reports
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative z-10">
        {activeTab === 'SYSTEM' ? (
          <div className="h-full flex gap-6 overflow-hidden">
            {/* LEFT: REAL-TIME METRICS */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
              {/* CHARTS ROW */}
              <div className="h-[240px] flex gap-6">
                <div className="flex-1 bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Cpu className="w-3 h-3 text-teal-400" /> Latency & Load
                  </h3>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={SYSTEM_METRICS}>
                        <defs>
                          <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="time"
                          stroke="#4b5563"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                        <ReTooltip
                          contentStyle={{
                            backgroundColor: '#000',
                            border: '1px solid #333',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="latency"
                          stroke="#14b8a6"
                          strokeWidth={2}
                          fill="url(#latencyGrad)"
                          name="Latency (ms)"
                        />
                        <Line
                          type="monotone"
                          dataKey="cpu"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={false}
                          name="CPU %"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* SERVICES GRID */}
              <div className="flex-1 bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-teal-400" /> SLA Monitor
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[9px] text-gray-500 uppercase font-black border-b border-white/5">
                        <th className="py-2 pl-2">Service</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Latency</th>
                        <th className="py-2">Uptime (30d)</th>
                        <th className="py-2">SLA Target</th>
                        <th className="py-2 pr-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SERVICES_SLA.map((svc) => (
                        <tr
                          key={svc.name}
                          className="border-b border-white/5 hover:bg-white/[0.02] text-xs text-gray-300"
                        >
                          <td className="py-3 pl-2 font-bold text-white">{svc.name}</td>
                          <td className="py-3">
                            <StatusBadge status={svc.status} />
                          </td>
                          <td className="py-3 font-mono">{svc.latency}</td>
                          <td className="py-3 font-mono">
                            <span
                              className={
                                svc.uptime < svc.sla ? 'text-rose-400' : 'text-emerald-400'
                              }
                            >
                              {svc.uptime}%
                            </span>
                          </td>
                          <td className="py-3 text-gray-500">{svc.sla}%</td>
                          <td className="py-3 pr-2">
                            <button className="p-1 hover:bg-white/10 rounded text-gray-400">
                              <Settings className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT: INCIDENTS & HEALTH */}
            <div className="w-[300px] flex flex-col gap-6">
              <div className="bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">
                  Platform Health
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                    <span className="text-sm font-bold text-white">All Systems Operational</span>
                    <span className="text-[10px] text-emerald-400/60 mt-1">Last check: 2s ago</span>
                  </div>
                  <div className="space-y-3 mt-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400">Database Cluster</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="w-1.5 h-3 bg-emerald-500 rounded-sm" />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400">Kafka Streams</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-1.5 h-3 bg-emerald-500 rounded-sm" />
                        ))}
                        <div className="w-1.5 h-3 bg-amber-500 rounded-sm animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">
                  Active Incidents
                </h3>
                <div className="flex-1 flex items-center justify-center text-gray-600 text-[10px] bg-black/20 rounded-xl border border-white/5 border-dashed">
                  No active incidents
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col gap-6 overflow-hidden">
            {/* BUSINESS METRICS ROW */}
            <div className="grid grid-cols-4 gap-4">
              <KpiCard
                title="Uptime Platform"
                value="99.98%"
                sub="Last 30 days"
                trend={0.02}
                target="99.90%"
              />
              <KpiCard
                title="API Latency (p95)"
                value="142ms"
                sub="Global Avg"
                trend={-12}
                target="200ms"
              />
              <KpiCard
                title="Conversion Rate"
                value="4.2%"
                sub="Visitor -> Client"
                trend={0.5}
                target="5.0%"
              />
              <KpiCard title="NPS Score" value="72" sub="Customer Sat." trend={3} target="70" />
            </div>

            {/* CHARTS ROW */}
            <div className="flex-1 flex gap-6 min-h-0">
              <div className="flex-[2] bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">
                  Conversion Funnel
                </h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={BUSINESS_FUNNEL} layout="vertical">
                      <XAxis type="number" stroke="#4b5563" fontSize={10} hide />
                      <YAxis
                        dataKey="stage"
                        type="category"
                        stroke="#9ca3af"
                        fontSize={11}
                        width={100}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ReTooltip
                        contentStyle={{
                          backgroundColor: '#000',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={30}>
                        {BUSINESS_FUNNEL.map((entry, index) => (
                          <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.15} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex-1 bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">
                  Country Benchmarks
                </h3>
                <div className="space-y-4">
                  {[
                    { c: 'Sénégal', v: 85 },
                    { c: "Côte d'Ivoire", v: 72 },
                    { c: 'Mali', v: 45 },
                  ].map((item) => (
                    <div key={item.c}>
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>{item.c}</span>
                        <span className="text-white font-bold">{item.v}% Adoption</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500" style={{ width: `${item.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-teal-500/70">
            <Zap className="w-3 h-3" />
            Prometheus: Connected
          </span>
          <span className="flex items-center gap-1.5 text-blue-500/70 italic">
            <Globe className="w-3 h-3" />
            Regions: eu-west-1, af-south-1
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          PERFORMANCE_HUB_V1
        </div>
      </footer>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
