'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Handshake,
  Briefcase,
  Building,
  MoreHorizontal,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  BarChart3,
  ArrowUpRight,
  FileText,
  Key,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  DollarSign,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// --- MOCK DATA ---
const PIPELINE_DATA = [
  {
    id: '1',
    name: 'CreditAgricole CI',
    type: 'Finance',
    stage: 'Negotiation',
    value: '$1.2M',
    owner: 'A. Diallo',
    logo: '🏦',
  },
  {
    id: '2',
    name: 'Maersk Logistics',
    type: 'Logistics',
    stage: 'Active',
    value: '$4.5M',
    owner: 'S. Koné',
    logo: '🚢',
  },
  {
    id: '3',
    name: 'Orange Cloud',
    type: 'Tech',
    stage: 'Prospect',
    value: '$800k',
    owner: 'J. Smith',
    logo: '☁️',
  },
  {
    id: '4',
    name: 'Cocoa Coop Union',
    type: 'Agri',
    stage: 'Signed',
    value: '$2.1M',
    owner: 'M. Traoré',
    logo: '🍫',
  },
];

const PARTNER_METRICS = [
  {
    name: 'Maersk Logistics',
    volume: 4500,
    commission: '$12.5k',
    status: 'Healthy',
    trend: '+12%',
  },
  { name: 'AXA Insurance', volume: 1200, commission: '$8.2k', status: 'Attention', trend: '-5%' },
  { name: 'Ecobank', volume: 8500, commission: '$24.1k', status: 'Healthy', trend: '+8%' },
];

const STAGES = ['Prospect', 'Negotiation', 'Signed', 'Active', 'Renewal'];

// --- COMPONENTS ---

const KanBanCard = ({ deal }: any) => (
  <motion.div
    layoutId={deal.id}
    className="bg-[#161B22] border border-white/5 rounded-xl p-3 mb-3 cursor-grab hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 group relative overflow-hidden"
  >
    <div className="flex justify-between items-start mb-2 z-10 relative">
      <div className="flex items-center gap-2">
        <span className="text-xl bg-white/5 p-1 rounded-lg">{deal.logo}</span>
        <div>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
              deal.type === 'Finance'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : deal.type === 'Logistics'
                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                  : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
            }`}
          >
            {deal.type}
          </span>
          <h4 className="text-xs font-bold text-white mt-1">{deal.name}</h4>
        </div>
      </div>
      <button className="text-gray-500 hover:text-white">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
    <div className="flex justify-between items-end mt-2 z-10 relative">
      <div className="flex -space-x-2">
        <div className="w-6 h-6 rounded-full bg-emerald-600 border border-[#161B22] flex items-center justify-center text-[9px] font-bold text-white">
          AD
        </div>
      </div>
      <span className="text-emerald-400 font-bold text-xs">{deal.value}</span>
    </div>
    {/* Hover Effect */}
    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/[0.02] transition-colors" />
  </motion.div>
);

const PartnerRow = ({ partner }: any) => (
  <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-colors group">
    <div className="flex items-center gap-3">
      <div
        className={`w-2 h-2 rounded-full ${partner.status === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`}
      />
      <div>
        <h4 className="text-xs font-bold text-gray-300 group-hover:text-white">{partner.name}</h4>
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" /> Trans: {partner.volume}
          </span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-xs font-bold text-white">{partner.commission}</div>
      <span
        className={`text-[9px] font-bold ${partner.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}
      >
        {partner.trend}
      </span>
    </div>
  </div>
);

export default function PartnershipsPage() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState('PIPELINE'); // PIPELINE, PORTFOLIO

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 NETWORK BG */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, #10b981 0%, transparent 40%)',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600/20 p-3 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <Handshake className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Partner <span className="text-emerald-500">NEXUS</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Strategic CRM & Ecosystem Management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('PIPELINE')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                viewMode === 'PIPELINE'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Briefcase className="w-3 h-3" /> Pipeline
            </button>
            <button
              onClick={() => setViewMode('PORTFOLIO')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                viewMode === 'PORTFOLIO'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Building className="w-3 h-3" /> Portfolio
            </button>
          </div>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10">
            <Plus className="w-3 h-3" /> New Deal
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative z-10">
        {viewMode === 'PIPELINE' ? (
          <div className="h-full flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {STAGES.map((stage) => (
              <div
                key={stage}
                className="min-w-[280px] flex-1 flex flex-col bg-[#0D1117]/60 border border-white/5 rounded-2xl p-3"
              >
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {stage}
                  </h3>
                  <span className="bg-white/5 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-mono">
                    {PIPELINE_DATA.filter((d) => d.stage === stage).length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                  {PIPELINE_DATA.filter((d) => d.stage === stage).map((deal) => (
                    <KanBanCard key={deal.id} deal={deal} />
                  ))}
                  <button className="w-full py-2 mt-2 border border-dashed border-white/10 rounded-xl text-gray-600 hover:text-gray-400 hover:border-gray-500 text-xs font-bold transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-3 h-3" /> Add Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full gap-6">
            {/* LEFT: PARTNER LIST */}
            <div className="flex-[2] bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                  Active Partners (142)
                </h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="bg-black/40 border border-white/10 rounded-lg pl-8 p-1.5 text-[10px] text-white w-40"
                    />
                  </div>
                  <button className="p-1.5 bg-white/5 rounded-lg text-gray-400">
                    <Filter className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-2">
                {PARTNER_METRICS.map((p) => (
                  <PartnerRow key={p.name} partner={p} />
                ))}
              </div>
            </div>

            {/* RIGHT: PORTAL & METRICS */}
            <div className="flex-1 flex flex-col gap-6">
              {/* QUICK STATS */}
              <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">
                  Ecosystem Health
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">
                      Total Val.
                    </span>
                    <div className="text-xl font-black text-white mt-1">$12.4M</div>
                    <div className="text-[9px] text-emerald-400 mt-1">+8.2% YoY</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">
                      Active Deals
                    </span>
                    <div className="text-xl font-black text-white mt-1">24</div>
                    <div className="text-[9px] text-blue-400 mt-1">4 Closing soon</div>
                  </div>
                </div>
              </div>

              {/* PORTAL ACTIONS */}
              <div className="flex-1 bg-gradient-to-br from-emerald-900/20 to-black border border-emerald-500/20 rounded-[30px] p-6 flex flex-col relative overflow-hidden">
                <h3 className="text-xs font-black text-emerald-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Key className="w-3 h-3" /> Partner Portal
                </h3>
                <div className="space-y-2 z-10">
                  <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-300 transition-colors group">
                    <span className="flex items-center gap-2">
                      <Key className="w-3 h-3 text-emerald-500" /> API Tokens
                    </span>
                    <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-white" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-300 transition-colors group">
                    <span className="flex items-center gap-2">
                      <FileText className="w-3 h-3 text-emerald-500" /> Contracts
                    </span>
                    <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-white" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-300 transition-colors group">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-3 h-3 text-emerald-500" /> Support
                    </span>
                    <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-white" />
                  </button>
                </div>
                {/* Deco */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-emerald-500/70">
            <Users className="w-3 h-3" />
            CRM Status: Online
          </span>
          <span className="flex items-center gap-1.5 text-blue-500/70 italic">
            <DollarSign className="w-3 h-3" />
            Est. Pipeline: $8.5M
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          PARTNERSHIP_NEXUS_V1
        </div>
      </footer>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
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
