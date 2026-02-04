'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Flag,
  MapPin,
  Globe2,
  Settings,
  BarChart3,
  Users,
  Wallet,
  Languages,
  Scale,
  Plus,
  Search,
  ArrowUpRight,
  Plane,
  Landmark,
  Coins,
  CheckCircle2,
  Lock,
  RefreshCw,
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
  PieChart,
  Pie,
} from 'recharts';

// --- MOCK DATA ---
const COUNTRIES = [
  {
    id: 'CI',
    name: "Côte d'Ivoire",
    code: 'CI',
    status: 'ACTIVE',
    users: 12500,
    revenue: '$1.2M',
    growth: '+15%',
    flag: '🇨🇮',
  },
  {
    id: 'SN',
    name: 'Sénégal',
    code: 'SN',
    status: 'ACTIVE',
    users: 8400,
    revenue: '$850k',
    growth: '+12%',
    flag: '🇸🇳',
  },
  {
    id: 'ML',
    name: 'Mali',
    code: 'ML',
    status: 'LAUNCHING',
    users: 1200,
    revenue: '$150k',
    growth: '+45%',
    flag: '🇲🇱',
  },
  {
    id: 'GH',
    name: 'Ghana',
    code: 'GH',
    status: 'PLANNED',
    users: 0,
    revenue: '$0',
    growth: '-',
    flag: '🇬🇭',
  },
];

const LAUNCH_CHECKLIST = [
  { id: 1, task: 'Banking License Approval', status: 'Done', country: 'Mali' },
  { id: 2, task: 'Translation (Bambara)', status: 'In Progress', country: 'Mali' },
  { id: 3, task: 'Local Partner Contracts', status: 'Pending', country: 'Ghana' },
];

// --- COMPONENTS ---

const CountryCard = ({ country }: any) => (
  <div
    className={`
        relative p-4 rounded-2xl border transition-all cursor-pointer group overflow-hidden
        ${
          country.status === 'ACTIVE'
            ? 'bg-[#161B22]/60 border-emerald-500/20 hover:border-emerald-500/40'
            : country.status === 'LAUNCHING'
              ? 'bg-[#161B22]/60 border-amber-500/20 hover:border-amber-500/40'
              : 'bg-[#161B22]/40 border-white/5 opacity-60 hover:opacity-100'
        }
    `}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{country.flag}</span>
        <div>
          <h3 className="text-sm font-bold text-white leading-tight">{country.name}</h3>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border mt-1 inline-block ${
              country.status === 'ACTIVE'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : country.status === 'LAUNCHING'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
            }`}
          >
            {country.status}
          </span>
        </div>
      </div>
      {country.status !== 'PLANNED' && (
        <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
          <Settings className="w-3 h-3" />
        </button>
      )}
    </div>

    {country.status !== 'PLANNED' ? (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <Users className="w-3 h-3" /> Users
          </div>
          <span className="text-xs font-bold text-white">{country.users.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <Wallet className="w-3 h-3" /> Revenue
          </div>
          <span className="text-xs font-bold text-white">{country.revenue}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-[9px] text-gray-500">Growth (MoM)</span>
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> {country.growth}
          </span>
        </div>
      </div>
    ) : (
      <div className="h-[88px] flex flex-col items-center justify-center text-gray-500 gap-2">
        <Lock className="w-5 h-5 opacity-50" />
        <span className="text-[10px] uppercase font-bold tracking-wider">Locked</span>
        <span className="text-[9px]">ETA: Q4 2024</span>
      </div>
    )}
  </div>
);

export default function GlobalFootprintPage() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState('MAP'); // MAP, LIST

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 EARTH GRID BG */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      ></div>
      <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[80%] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <Globe2 className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Global <span className="text-blue-500">FOOTPRINT</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Multi-Country Operations & Configuration.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('MAP')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                viewMode === 'MAP'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" /> Map View
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                viewMode === 'LIST'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Flag className="w-3 h-3" /> List View
            </button>
          </div>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10">
            <Plus className="w-3 h-3" /> Add Country
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative z-10 flex gap-6">
        {/* LEFT: COUNTRY GRID */}
        <div className="flex-[2] flex flex-col gap-6">
          {/* FILTERS */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search countries..."
                className="w-full bg-[#161B22]/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
                Active (2)
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                Launching (1)
              </button>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pr-2 pb-2">
            {COUNTRIES.map((c) => (
              <CountryCard key={c.id} country={c} />
            ))}
          </div>
        </div>

        {/* RIGHT: OPERATIONS & COMPLIANCE */}
        <div className="flex-1 flex flex-col gap-6">
          {/* LAUNCH MONITOR */}
          <div className="bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Plane className="w-3 h-3 text-amber-400" /> Launch Checklist
              </h3>
              <button className="text-[10px] text-gray-500 hover:text-white">Detailed Plan</button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2">
              {LAUNCH_CHECKLIST.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3"
                >
                  <div
                    className={`mt-0.5 p-1 rounded-full ${item.status === 'Done' ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400'}`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-300 font-medium leading-tight">{item.task}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] text-gray-500 bg-black/30 px-1.5 py-0.5 rounded">
                        {item.country}
                      </span>
                      <span
                        className={`text-[9px] font-bold ${item.status === 'In Progress' ? 'text-blue-400' : item.status === 'Done' ? 'text-emerald-400' : 'text-gray-500'}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMPLIANCE WIDGET */}
          <div className="flex-1 bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col relative overflow-hidden">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Scale className="w-3 h-3 text-blue-400" /> Compliance Status
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Landmark className="w-4 h-4 text-blue-400" />
                  <div>
                    <h4 className="text-[10px] font-bold text-blue-100">UEMOA Banking Reg.</h4>
                    <p className="text-[9px] text-blue-500/70">Compliant (Last Audit: Jan 24)</p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <Languages className="w-4 h-4 text-gray-400" />
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-300">Translations</h4>
                    <p className="text-[9px] text-gray-500">12/14 Languages Ready</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">85%</span>
              </div>
            </div>
            {/* Deco */}
            <div className="absolute top-10 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-blue-500/70">
            <Globe className="w-3 h-3" />
            Active Regions: 2
          </span>
          <span className="flex items-center gap-1.5 text-amber-500/70 italic">
            <Plane className="w-3 h-3" />
            Next Launch: Mali (T-14 Days)
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          GLOBAL_OPS_CONTROL_V1
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
