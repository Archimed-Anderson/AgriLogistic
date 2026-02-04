'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  ShieldCheck,
  AlertTriangle,
  FileWarning,
  CheckCircle2,
  RefreshCcw,
  Filter,
  Search,
  BarChart3,
  Activity,
  GitMerge,
  History,
  FileCheck,
  Layers,
  ArrowRight,
  Play,
  Settings2,
  Users,
  Tractor,
  ShoppingBag,
  Trash2,
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
const QUALITY_SCORE_HISTORY = [
  { day: 'Mon', score: 82, issues: 145 },
  { day: 'Tue', score: 85, issues: 120 },
  { day: 'Wed', score: 84, issues: 125 },
  { day: 'Thu', score: 88, issues: 95 },
  { day: 'Fri', score: 89, issues: 84 },
  { day: 'Sat', score: 91, issues: 65 },
  { day: 'Sun', score: 92, issues: 58 },
];

const DOMAIN_SCORES = [
  { name: 'Users', score: 95, color: '#10B981', icon: Users },
  { name: 'Parcelles', score: 78, color: '#F59E0B', icon: Tractor },
  { name: 'Marketplace', score: 88, color: '#3B82F6', icon: ShoppingBag },
  { name: 'Logistics', score: 92, color: '#8B5CF6', icon: Activity },
];

const ANOMALIES = [
  {
    id: 'A-2401',
    type: 'COHERENCE',
    severity: 'HIGH',
    domain: 'Parcelles',
    desc: 'Production impossible: 50T Maize on 0.5ha',
    entity: 'Farm #4829',
    date: '2h ago',
    status: 'PENDING',
  },
  {
    id: 'A-2402',
    type: 'COMPLETENESS',
    severity: 'MEDIUM',
    domain: 'Users',
    desc: 'Missing GPS coordinates for delivery point',
    entity: 'User @kouame_jean',
    date: '4h ago',
    status: 'PENDING',
  },
  {
    id: 'A-2405',
    type: 'DUPLICATE',
    severity: 'HIGH',
    domain: 'Users',
    desc: 'Potential duplicate account (Phone match)',
    entity: 'User #8821 / #9932',
    date: '1d ago',
    status: 'PENDING',
  },
  {
    id: 'A-2398',
    type: 'OUTLIER',
    severity: 'LOW',
    domain: 'Marketplace',
    desc: 'Price anomaly: Cashew nut $0.05/kg',
    entity: 'Offer #9921',
    date: '1d ago',
    status: 'RESOLVED',
  },
];

// --- COMPONENTS ---

const ScoreCard = ({ domain }: any) => (
  <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
    <div className="p-3 rounded-xl bg-white/5">
      <domain.icon className="w-5 h-5" style={{ color: domain.color }} />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-end mb-1">
        <span className="text-[10px] text-gray-500 uppercase font-black">{domain.name}</span>
        <span className="text-sm font-black text-white">{domain.score}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${domain.score}%`, backgroundColor: domain.color }}
        />
      </div>
    </div>
  </div>
);

const AnomalyRow = ({ item }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
  >
    <div
      className={`p-2 rounded-lg ${
        item.severity === 'HIGH'
          ? 'bg-rose-500/10 text-rose-400'
          : item.severity === 'MEDIUM'
            ? 'bg-amber-500/10 text-amber-400'
            : 'bg-blue-500/10 text-blue-400'
      }`}
    >
      <AlertTriangle className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span
          className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
            item.type === 'COHERENCE'
              ? 'border-rose-500/20 text-rose-400'
              : item.type === 'DUPLICATE'
                ? 'border-purple-500/20 text-purple-400'
                : 'border-gray-500/20 text-gray-400'
          }`}
        >
          {item.type}
        </span>
        <span className="text-[10px] text-gray-500 font-mono">{item.id}</span>
      </div>
      <p className="text-xs font-medium text-gray-200 truncate">{item.desc}</p>
      <p className="text-[10px] text-gray-500 mt-0.5">
        {item.entity} • {item.date}
      </p>
    </div>
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
        <CheckCircle2 className="w-4 h-4" />
      </button>
      <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
        <Settings2 className="w-4 h-4" />
      </button>
      <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-rose-400 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

export default function DataQualityPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 DATA MATRIX BACKGROUND */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full">
          <pattern
            id="matrix-grid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10B981" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#matrix-grid)" />
        </svg>
      </div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600/20 p-3 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Data Quality <span className="text-emerald-500">HQ</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Autonomous Data Cleaning & Integrity Enforcement Protocol.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">
              Global Integrity Score
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-black text-white">
                92<span className="text-sm text-gray-500">/100</span>
              </p>
              <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 rounded border border-emerald-500/20">
                +2.4%
              </span>
            </div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl text-xs font-black transition-all border border-white/10 group uppercase tracking-widest italic">
            <Play
              className="w-4 h-4 group-hover:scale-125 transition-transform text-center"
              fill="currentColor"
            />
            Run Full Scan
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* LEFT COLUMN: METRICS & DOMAINS */}
        <div className="w-[380px] flex flex-col gap-6 overflow-hidden">
          {/* OVERALL TREND */}
          <div className="h-[200px] bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                Quality Trend (7d)
              </h3>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex-1 -mx-2 -mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={QUALITY_SCORE_HISTORY}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DOMAIN BREAKDOWN */}
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            <h3 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">
              Domain Health
            </h3>
            {DOMAIN_SCORES.map((domain) => (
              <ScoreCard key={domain.name} domain={domain} />
            ))}

            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <GitMerge className="w-4 h-4 text-white" />
                <span className="text-xs font-black text-white uppercase">Merge Candidates</span>
              </div>
              <p className="text-[10px] text-gray-300 mb-3">
                12 user pairs identified as potential duplicates.
              </p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold text-white uppercase transition-colors">
                Review Merges
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WORKSPACE */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* TABS & FILTERS */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-black/40 border border-white/5 p-1 rounded-2xl">
              {['inbox', 'rules', 'lineage'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? 'bg-white/10 text-white border border-white/10 shadow-lg'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {tab === 'inbox' ? 'Anomalies Inbox (4)' : tab}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 w-48"
                />
              </div>
              <button className="p-2 bg-black/40 border border-white/10 rounded-xl text-gray-500 hover:text-white">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DYNAMIC CONTENT AREA */}
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 overflow-hidden flex flex-col relative">
            {activeTab === 'inbox' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3"
              >
                {ANOMALIES.map((item) => (
                  <AnomalyRow key={item.id} item={item} />
                ))}

                {ANOMALIES.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                    <CheckCircle2 className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-xs font-medium">All clear! No anomalies detected.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'lineage' && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative w-[500px] h-[300px] bg-black/20 rounded-2xl border border-white/5 p-8 flex items-center justify-between">
                    {/* Simple Node Graph Mockup */}
                    <div className="flex flex-col gap-8">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 text-xs font-bold text-center w-32">
                        IoT Sensors
                        <br />
                        (Moisture)
                      </div>
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 text-xs font-bold text-center w-32">
                        Satellite
                        <br />
                        (Imagery)
                      </div>
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-600 animate-pulse" />

                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 text-xs font-bold text-center w-32">
                      Yield
                      <br />
                      Prediction
                      <br />
                      Model v2.4
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-600 animate-pulse" />

                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold text-center w-32">
                      Agri-Score
                      <br />
                      Calculation
                    </div>
                  </div>
                  <p className="mt-4 text-[10px] text-gray-500 uppercase tracking-widest font-black">
                    Data Lineage & Impact Analysis
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="grid grid-cols-2 gap-4 h-full overflow-y-auto custom-scrollbar">
                {[
                  {
                    name: 'GPS Validity',
                    desc: 'Check if coords are within country bound',
                    status: 'ACTIVE',
                  },
                  {
                    name: 'Harvest Date Logic',
                    desc: 'Harvest > Sowing date check',
                    status: 'ACTIVE',
                  },
                  {
                    name: 'Yield Thresholds',
                    desc: 'Warn if yield > 150% regional avg',
                    status: 'ACTIVE',
                  },
                  { name: 'Phone Format', desc: 'E.164 Standard enforcement', status: 'ACTIVE' },
                  {
                    name: 'Duplicate Detector',
                    desc: 'Fuzzy match on Name + Phone',
                    status: 'Running...',
                  },
                ].map((rule, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex justify-between items-start"
                  >
                    <div>
                      <h4 className="text-white font-bold text-xs mb-1">{rule.name}</h4>
                      <p className="text-[10px] text-gray-500">{rule.desc}</p>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded border ${
                        rule.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}
                    >
                      {rule.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-blue-500/70">
            <RefreshCcw className="w-3 h-3" />
            Last Scan: 14 mins ago
          </span>
          <span className="flex items-center gap-1.5 text-emerald-500/70 italic">
            <Database className="w-3 h-3" />
            Great Expectations: Rules Engine Online
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          DATA_INTEGRITY_CENTER
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
