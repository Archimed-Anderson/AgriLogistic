'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ToggleLeft,
  ToggleRight,
  FlaskConical,
  Users,
  GitCommit,
  AlertTriangle,
  History,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  PlayCircle,
  PauseCircle,
  BarChart3,
  Zap,
  Globe,
  Target,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- MOCK DATA ---
const FLAGS = [
  {
    id: 'new-checkout-flow',
    name: 'New Checkout Flow (v2)',
    type: 'RELEASE',
    status: 'ACTIVE',
    targeting: '50% Users',
    key: 'checkout_v2',
    updated: '2h ago',
  },
  {
    id: 'dark-mode-beta',
    name: 'Dark Mode Beta',
    type: 'EXPERIMENT',
    status: 'ACTIVE',
    targeting: 'Internal Users',
    key: 'ui_dark_mode',
    updated: '1d ago',
  },
  {
    id: 'payment-momo-ghana',
    name: 'MoMo Payment Gateway (Ghana)',
    type: 'RELEASE',
    status: 'INACTIVE',
    targeting: 'Geo: GH',
    key: 'payment_momo_gh',
    updated: '3d ago',
  },
  {
    id: 'ai-crop-advisor',
    name: 'AI Crop Advisor',
    type: 'OPS',
    status: 'ACTIVE',
    targeting: 'Premium Plan',
    key: 'feat_ai_advisor',
    updated: '5d ago',
  },
];

const EXPERIMENTS = [
  {
    id: 1,
    name: 'Checkout Button Color',
    status: 'RUNNING',
    totalUsers: 14500,
    winner: 'Pending',
    variants: [
      { name: 'Control (Green)', weight: 50 },
      { name: 'Variant B (Orange)', weight: 50 },
    ],
  },
  {
    id: 2,
    name: 'Onboarding Flow Steps',
    status: 'CONCLUDED',
    totalUsers: 45000,
    winner: 'Variant A',
    variants: [
      { name: '3-Step (Short)', weight: 100 },
      { name: '5-Step (Detailed)', weight: 0 },
    ],
  },
];

const AUDIT_LOG = [
  { id: 1, user: 'DevOps Lead', action: 'Toggled ON', flag: 'new-checkout-flow', time: '10:42 AM' },
  {
    id: 2,
    user: 'Product Mgr',
    action: 'Updated Rules',
    flag: 'dark-mode-beta',
    time: 'Yesterday',
  },
  { id: 3, user: 'System', action: 'Kill Switch', flag: 'legacy-api-proxy', time: '2 days ago' },
];

// --- COMPONENTS ---

const FlagCard = ({ flag }: any) => (
  <div
    className={`p-4 rounded-2xl border ${flag.status === 'ACTIVE' ? 'bg-[#161B22] border-indigo-500/20' : 'bg-[#0d1117] border-white/5 opacity-70'} group transition-all`}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            flag.type === 'EXPERIMENT'
              ? 'bg-purple-500/10 text-purple-400'
              : flag.type === 'OPS'
                ? 'bg-amber-500/10 text-amber-400'
                : 'bg-blue-500/10 text-blue-400'
          }`}
        >
          {flag.type === 'EXPERIMENT' ? (
            <FlaskConical className="w-4 h-4" />
          ) : (
            <ToggleRight className="w-4 h-4" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-200 group-hover:text-indigo-400 transition-colors">
            {flag.name}
          </h4>
          <span className="text-[10px] font-mono text-gray-500">{flag.key}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
            flag.status === 'ACTIVE'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-gray-700 text-gray-400 border-gray-600'
          }`}
        >
          {flag.status}
        </span>
        <button className="text-gray-500 hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-4 text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" /> {flag.targeting}
        </span>
        <span className="flex items-center gap-1">
          <History className="w-3 h-3" /> {flag.updated}
        </span>
      </div>
      {/* Toggle Switch Simulation */}
      <div
        className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${flag.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-700'}`}
      >
        <div
          className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${flag.status === 'ACTIVE' ? 'left-4.5' : 'left-0.5'}`}
        />
      </div>
    </div>
  </div>
);

export default function FeatureFlagsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('FLAGS'); // FLAGS, EXPERIMENTS, AUDIT

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 CIRCUIT BOARD BG */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(90deg, #6366f1 1px, transparent 1px), linear-gradient(#6366f1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-3 rounded-2xl border border-white/10 shadow-xl shadow-indigo-500/10">
            <ToggleLeft className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Feature <span className="text-indigo-500">FLAGS</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Release Management & A/B Testing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            {[
              { id: 'FLAGS', icon: ToggleRight, label: 'Feature Flags' },
              { id: 'EXPERIMENTS', icon: FlaskConical, label: 'A/B Tests' },
              { id: 'AUDIT', icon: History, label: 'Audit Log' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <tab.icon className="w-3 h-3" /> {tab.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg border border-white/10">
            <Plus className="w-3 h-3" /> Create Flag
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative z-10 flex gap-6">
        {/* LEFT: CONTENT */}
        <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
          {activeTab === 'FLAGS' && (
            <div className="h-full flex flex-col gap-4">
              {/* FILTERS */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search flags (key, name, tag)..."
                    className="w-full bg-[#161B22]/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white">
                  <Filter className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-1 xl:grid-cols-2 gap-4 pb-2">
                {FLAGS.map((flag) => (
                  <FlagCard key={flag.id} flag={flag} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'EXPERIMENTS' && (
            <div className="h-full overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2">
              {EXPERIMENTS.map((exp) => (
                <div key={exp.id} className="bg-[#161B22] border border-white/5 rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            exp.status === 'RUNNING'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 animate-pulse'
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {exp.status}
                        </span>
                        <span className="text-[10px] text-gray-500">ID: #{exp.id}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{exp.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-white">
                        {exp.totalUsers.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-500">Participants</div>
                    </div>
                  </div>

                  {/* VARIANTS BAR */}
                  <div className="flex h-8 w-full rounded-lg overflow-hidden bg-gray-800 mb-2">
                    {exp.variants.map(
                      (v, i) =>
                        v.weight > 0 && (
                          <div
                            key={v.name}
                            style={{ width: `${v.weight}%` }}
                            className={`h-full flex items-center justify-center text-[10px] font-bold text-white relative group ${
                              i === 0 ? 'bg-indigo-600' : 'bg-purple-600'
                            }`}
                          >
                            <span className="z-10">
                              {v.name} ({v.weight}%)
                            </span>
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                          </div>
                        )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'AUDIT' && (
            <div className="h-full overflow-y-auto custom-scrollbar pr-2">
              <div className="flex flex-col gap-2">
                {AUDIT_LOG.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-white/10">
                        {log.user
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{log.user}</span>
                          <span className="text-[10px] text-gray-500">{log.action}</span>
                        </div>
                        <div className="text-[10px] font-mono text-indigo-400">{log.flag}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: TARGETING & RULES */}
        <div className="flex-1 flex flex-col gap-6">
          {/* KILL SWITCH WIDGET */}
          <div className="bg-rose-900/10 border border-rose-500/20 rounded-[30px] p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl group-hover:bg-rose-500/30 transition-all" />
            <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
              <Zap className="w-3 h-3" /> Emergency Controls
            </h3>
            <p className="text-[10px] text-rose-300/70 mb-4 relative z-10">
              Disabling System Wide flags will effective immediately. Use with caution.
            </p>
            <button className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg border border-white/10 relative z-10 flex items-center justify-center gap-2 transition-all active:scale-95">
              <AlertTriangle className="w-4 h-4" /> Kill Switch
            </button>
          </div>

          {/* TARGETING PREVIEW */}
          <div className="flex-1 bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target className="w-3 h-3 text-indigo-400" /> Active Targeting
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <span className="text-[9px] font-bold text-indigo-400 uppercase block mb-1">
                  Geo-Location
                </span>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-black/40 rounded text-xs text-white">Ghana</span>
                  <span className="px-2 py-0.5 bg-black/40 rounded text-xs text-white">
                    Ivory Coast
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <span className="text-[9px] font-bold text-purple-400 uppercase block mb-1">
                  User Segments
                </span>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-black/40 rounded text-xs text-white">
                    Beta Testers
                  </span>
                  <span className="px-2 py-0.5 bg-black/40 rounded text-xs text-white">
                    Internal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-indigo-500/70">
            <GitCommit className="w-3 h-3" />
            SDK Connected: v4.2.0
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 italic">
            <Globe className="w-3 h-3" />
            Latency: 24ms
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          FEATURE_OS_v1.0
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
