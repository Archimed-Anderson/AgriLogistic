'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  RadioTower,
  Activity,
  Map as MapIcon,
  Globe2,
  AlertTriangle,
  Smartphone,
  RefreshCw,
  DownloadCloud,
  UploadCloud,
  ServerCrash,
  CheckCircle2,
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
  Legend,
} from 'recharts';

// --- MOCK DATA ---
const LATENCY_DATA = [
  { time: '08:00', latency: 45, loss: 0.1 },
  { time: '10:00', latency: 42, loss: 0.2 },
  { time: '12:00', latency: 120, loss: 2.5 }, // Congestion peak
  { time: '14:00', latency: 55, loss: 0.5 },
  { time: '16:00', latency: 48, loss: 0.1 },
  { time: '18:00', latency: 60, loss: 0.3 },
];

const DEAD_ZONES = [
  {
    id: 'DZ-01',
    name: 'Zone Rural Nord - Sector 4',
    impacted: 145,
    status: 'CRITICAL',
    solution: 'Satellite Link',
  },
  {
    id: 'DZ-02',
    name: 'Vallée Ouest - Route 7',
    impacted: 32,
    status: 'WARNING',
    solution: 'Repeater Install',
  },
  {
    id: 'DZ-03',
    name: 'Plateau Est - Village B',
    impacted: 88,
    status: 'CRITICAL',
    solution: 'Partner Negot.',
  },
];

const OPERATOR_SLA = [
  { name: 'Orange', uptime: 99.8, mttr: '15m', latence: '45ms' },
  { name: 'MTN', uptime: 98.2, mttr: '45m', latence: '62ms' },
  { name: 'Moov', uptime: 96.5, mttr: '2h', latence: '110ms' },
];

// --- COMPONENTS ---

const MetricCard = ({ title, value, sub, icon: Icon, color, trend }: any) => (
  <div className="bg-[#0D1117]/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
    <div>
      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{title}</p>
      <div className="flex flex-col">
        <span className="text-2xl font-black text-white">{value}</span>
        <span
          className={`text-[9px] font-mono font-bold ${trend === 'good' ? 'text-emerald-400' : 'text-rose-400'}`}
        >
          {sub}
        </span>
      </div>
    </div>
    <div className={`p-3 rounded-xl bg-white/5 border border-white/5 relative`}>
      <Icon className="w-5 h-5" style={{ color }} />
      {trend === 'bad' && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
      )}
    </div>
  </div>
);

const ZoneRow = ({ zone }: any) => (
  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
    <div
      className={`p-3 rounded-xl border ${
        zone.status === 'CRITICAL'
          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
      }`}
    >
      <WifiOff className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
        {zone.name}
      </h4>
      <p className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
        <span className="text-white font-bold">{zone.impacted} users impacted</span> • Best Fix:{' '}
        {zone.solution}
      </p>
    </div>
    <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider text-gray-300 transition-colors border border-white/10">
      Deploy Fix
    </button>
  </div>
);

export default function NetworkHealthPage() {
  const [mounted, setMounted] = useState(false);
  const [activeLayer, setActiveLayer] = useState('4G');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 SIGNAL WAVES BG */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full">
          <pattern
            id="signal-waves"
            x="0"
            y="0"
            width="100"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 10 Q 25 20, 50 10 T 100 10"
              fill="none"
              stroke="#10B981"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#signal-waves)" />
        </svg>
      </div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600/20 p-3 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <RadioTower className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Connectivity <span className="text-emerald-500">GRID</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Rural Network Health & Dead Zone Analytics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <Smartphone className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="text-xs font-bold text-rose-400">
              145 Users Offline (SMS Fallback Active)
            </span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg shadow-emerald-600/20 group uppercase tracking-widest italic">
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform" />
            Ping Test All
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* LEFT: MAP & LAYERS */}
        <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
          {/* KEY METRICS */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard
              title="Avg Latency"
              value="52ms"
              sub="Within SLA"
              icon={Activity}
              color="#10B981"
              trend="good"
            />
            <MetricCard
              title="Packet Loss"
              value="0.8%"
              sub="+0.2% vs avg"
              icon={ServerCrash}
              color="#F59E0B"
              trend="good"
            />
            <MetricCard
              title="Bandwidth"
              value="45 Mbps"
              sub="Downlink Peak"
              icon={DownloadCloud}
              color="#3B82F6"
              trend="good"
            />
            <MetricCard
              title="Dead Zones"
              value="3"
              sub="Critical Attention"
              icon={AlertTriangle}
              color="#F43F5E"
              trend="bad"
            />
          </div>

          {/* INTERACTIVE MAP MOCKUP */}
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 relative flex flex-col overflow-hidden group">
            <div className="absolute top-6 left-6 z-10 flex gap-2">
              {['4G', '3G', '2G', 'OFFLINE'].map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                    activeLayer === layer
                      ? 'bg-white/20 border-white text-white'
                      : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>

            {/* Dummy Map Visuals */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <Globe2 className="w-96 h-96 text-emerald-900" />
              <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-rose-500/30 rounded-full blur-2xl animate-pulse" />{' '}
              {/* Dead Zone */}
            </div>

            <div className="mt-auto z-10 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 w-fit">
              <p className="text-[10px] text-gray-400 uppercase font-black mb-2">
                Coverage Heatmap
              </p>
              <div className="flex items-center gap-4 text-[9px] text-gray-300">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> Excellent
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> Good
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500" /> Weak
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-rose-500" /> No Signal
                </span>
              </div>
            </div>
          </div>

          {/* LATENCY CHART */}
          <div className="h-[200px] bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-0">
              <h3 className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                Network Latency (Live)
              </h3>
              <SignalMedium className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex-1 min-h-0 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={LATENCY_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
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
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#latencyGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT: ALERTS & SLA */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* DEAD ZONES LIST */}
          <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex flex-col max-h-[50%]">
            <div className="flex items-center gap-2 mb-4 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-widest">Dead Zones Alert</h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
              {DEAD_ZONES.map((zone) => (
                <ZoneRow key={zone.id} zone={zone} />
              ))}
            </div>
          </div>

          {/* OPERATOR SLA TABLE */}
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex flex-col">
            <h3 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4">
              Operator Performance (SLA)
            </h3>
            <div className="flex-1 flex flex-col gap-4">
              {OPERATOR_SLA.map((op) => (
                <div key={op.name} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black text-white">{op.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Uptime: <span className="text-white">{op.uptime}%</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${op.uptime}%`,
                        backgroundColor:
                          op.uptime > 99 ? '#10B981' : op.uptime > 98 ? '#F59E0B' : '#F43F5E',
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                    <span>Latency: {op.latence}</span>
                    <span>MTTR: {op.mttr}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-orange-500/70">
            <CheckCircle2 className="w-3 h-3" />
            Backup Link: Iridium Satellite (Standby)
          </span>
          <span className="flex items-center gap-1.5 text-blue-500/70 italic">
            <Activity className="w-3 h-3" />
            Global Traffic: 450 GB/h
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          CONNECTIVITY_GUARDIAN
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
