'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Fingerprint,
  Siren,
  Globe2,
  Network,
  UserX,
  LockKeyhole,
  Eye,
  Search,
  MapPin,
  AlertOctagon,
  FileSearch,
  Gavel,
  History,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

// --- MOCK DATA ---
const INCIDENTS_TIMELINE = [
  { time: '08:00', risk: 12 },
  { time: '10:00', risk: 45 },
  { time: '12:00', risk: 25 },
  { time: '14:00', risk: 85 },
  { time: '16:00', risk: 92 },
  { time: '18:00', risk: 30 },
];

const SUSPECTS = [
  {
    id: 'U-8821',
    name: 'Jean K.',
    riskScore: 94,
    location: 'Lagos, NG',
    type: 'Money Laundering',
    status: 'INVESTIGATION',
    flag: 'Wash Trading',
  },
  {
    id: 'U-9932',
    name: 'Transport Ent.',
    riskScore: 88,
    location: 'Abidjan, CI',
    type: 'Logistics Fraud',
    status: 'WATCHLIST',
    flag: 'Ghost Trips',
  },
  {
    id: 'U-1204',
    name: 'Coop Alpha',
    riskScore: 72,
    location: 'Bouaké, CI',
    type: 'Document Fraud',
    status: 'PENDING',
    flag: 'Fake Certs',
  },
];

// --- COMPONENTS ---

const RiskGauge = ({ score }: { score: number }) => (
  <div className="relative w-32 h-32 flex items-center justify-center">
    <svg className="w-full h-full transform -rotate-90">
      <circle cx="64" cy="64" r="56" stroke="#ffffff10" strokeWidth="8" fill="transparent" />
      <circle
        cx="64"
        cy="64"
        r="56"
        stroke={score > 80 ? '#F43F5E' : score > 50 ? '#F59E0B' : '#10B981'}
        strokeWidth="8"
        fill="transparent"
        strokeDasharray={351}
        strokeDashoffset={351 - (351 * score) / 100}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
    <div className="absolute flex flex-col items-center">
      <span className="text-3xl font-black text-white">{score}</span>
      <span className="text-[9px] uppercase font-bold text-gray-500">Risk Score</span>
    </div>
  </div>
);

const SuspectRow = ({ suspect }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
  >
    <div
      className={`p-2 rounded-lg ${
        suspect.riskScore > 90
          ? 'bg-rose-500/10 text-rose-400 animate-pulse'
          : suspect.riskScore > 70
            ? 'bg-amber-500/10 text-amber-400'
            : 'bg-blue-500/10 text-blue-400'
      }`}
    >
      <Fingerprint className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-xs font-black text-white">{suspect.name}</span>
        <span className="text-[9px] text-gray-500 font-mono">{suspect.id}</span>
      </div>
      <p className="text-[10px] text-gray-400">
        {suspect.type} • <span className="text-white font-bold">{suspect.flag}</span>
      </p>
    </div>
    <div className="flex items-center gap-3">
      <div
        className={`text-center px-2 py-1 rounded border ${
          suspect.status === 'INVESTIGATION'
            ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
            : suspect.status === 'WATCHLIST'
              ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
              : 'border-gray-500/20 bg-gray-500/10 text-gray-400'
        }`}
      >
        <p className="text-[9px] font-black uppercase tracking-wider">{suspect.status}</p>
      </div>
      <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
        <Search className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

export default function FraudDetectionPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('live');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 RED ALERT GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full">
          <pattern id="alert-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#F43F5E" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#alert-grid)" />
        </svg>
      </div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-rose-600/20 p-3 rounded-2xl border border-rose-500/30 shadow-lg shadow-rose-500/10 relative overflow-hidden">
            <Siren className="w-8 h-8 text-rose-400 relative z-10" />
            <div className="absolute inset-0 bg-rose-500/20 blur-xl animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Fraud Detection <span className="text-rose-500">UNIT</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Advanced Anomaly Detection & Financial Forensics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">
              Active Alerts
            </p>
            <div className="flex items-baseline gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <p className="text-2xl font-black text-white">
                3 <span className="text-xs text-rose-500 font-bold uppercase">Critical</span>
              </p>
            </div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg shadow-rose-600/20 group uppercase tracking-widest italic">
            <LockKeyhole className="w-4 h-4 group-hover:scale-125 transition-transform" />
            Lockdown Mode
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN OPS GRID */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* LEFT: MONITORING */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* LIVE THREAT MAP MOCKUP */}
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 relative flex flex-col overflow-hidden group">
            <div className="flex justify-between items-start z-10">
              <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <Globe2 className="w-4 h-4" /> Global Threat Heatmap
              </h3>
              <div className="bg-black/40 px-2 py-1 rounded border border-white/10 text-[9px] font-mono text-gray-400">
                LIVE FEED • LAT: 5.34 LON: -4.02
              </div>
            </div>

            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
              {/* Abstract Map Dots */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_20px_rgba(244,63,94,1)] animate-ping" />
              <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,1)] animate-pulse" />
            </div>
            <div className="mt-auto z-10">
              <p className="text-[10px] text-gray-500 uppercase font-black mb-2">Threat Origin</p>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-rose-500" />
                <div>
                  <p className="text-xs font-bold text-white">Yamoussoukro, CI</p>
                  <p className="text-[9px] text-gray-500">Volumetric Spike Detected (x10)</p>
                </div>
              </div>
            </div>
          </div>

          {/* RISK TIMELINE */}
          <div className="h-[200px] bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex flex-col">
            <h3 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4">
              Risk Velocity (24h)
            </h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={INCIDENTS_TIMELINE}>
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="risk"
                    stroke="#F43F5E"
                    fillOpacity={1}
                    fill="url(#riskGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT: INVESTIGATION DESK */}
        <div className="w-[450px] flex flex-col gap-6 overflow-hidden">
          <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-black text-lg italic uppercase tracking-tighter">
                Investigation Desk
              </h3>
              <button className="p-2 bg-white/5 rounded-xl border border-white/10 text-gray-400 hover:text-white">
                <FileSearch className="w-4 h-4" />
              </button>
            </div>

            {/* SUSPECT LIST */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 mb-6">
              {SUSPECTS.map((suspect) => (
                <SuspectRow key={suspect.id} suspect={suspect} />
              ))}
            </div>

            {/* FOCUSED SUSPECT (MOCK) */}
            <div className="bg-black/40 rounded-3xl p-5 border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-black mb-1">
                    Target Analysis
                  </p>
                  <p className="text-sm font-black text-rose-400 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4" /> Higest Priority
                  </p>
                </div>
                <RiskGauge score={94} />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <button className="bg-rose-600 text-white rounded-xl py-2 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-colors">
                  Ban User
                </button>
                <button className="bg-white/5 text-gray-300 rounded-xl py-2 text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-colors">
                  Deep Scan
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[9px] text-gray-500 font-mono">
                <Network className="w-3 h-3" /> Linked to 3 other accounts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-rose-500/70">
            <Eye className="w-3 h-3" />
            Surveillance Active: 12,450 Nodes Monitored
          </span>
          <span className="flex items-center gap-1.5 text-blue-500/70 italic">
            <Gavel className="w-3 h-3" />
            Auto-Ban Threshold: 90
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          SCORPION_FRAUD_SYSTEM_V4
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
