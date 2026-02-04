'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Building2,
  Database,
  Palette,
  Settings,
  Cpu,
  HardDrive,
  Layers,
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Download,
  Upload,
  Activity,
  Lock,
  Server,
  CreditCard,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

// --- MOCK DATA ---
const TENANTS = [
  {
    id: 'ci_main',
    name: 'Ivory Coast (HQ)',
    type: 'COUNTRY',
    status: 'ACTIVE',
    isolation: 'SHARED_RLS',
    region: 'af-west-1',
    users: 14500,
    storage: '450 GB',
    currency: 'XOF',
    theme: 'Green/Gold',
  },
  {
    id: 'sn_branch',
    name: 'Senegal Operations',
    type: 'COUNTRY',
    status: 'ACTIVE',
    isolation: 'SHARED_RLS',
    region: 'af-west-1',
    users: 8200,
    storage: '210 GB',
    currency: 'XOF',
    theme: 'Green/Red',
  },
  {
    id: 'gh_branch',
    name: 'Ghana Expansion',
    type: 'COUNTRY',
    status: 'PROVISIONING',
    isolation: 'SCHEMA',
    region: 'af-west-1',
    users: 0,
    storage: '0 GB',
    currency: 'GHS',
    theme: 'Black/Yellow',
  },
  {
    id: 'corp_cargill',
    name: 'Cargill Dedicated',
    type: 'ENTERPRISE',
    status: 'ACTIVE',
    isolation: 'DEDICATED_DB',
    region: 'eu-central-1',
    users: 500,
    storage: '1.2 TB',
    currency: 'USD',
    theme: 'Custom (Corp)',
  },
];

const RESOURCES_USAGE = [
  { name: 'Ivory Coast', cpu: 75, storage: 60, api: 85 },
  { name: 'Senegal', cpu: 45, storage: 30, api: 40 },
  { name: 'Ghana', cpu: 5, storage: 2, api: 0 },
  { name: 'Cargill', cpu: 20, storage: 80, api: 25 },
];

// --- COMPONENTS ---

const TenantCard = ({ tenant, isSelected, onClick }: any) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
      isSelected
        ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10'
        : 'bg-[#161B22] border-white/5 hover:border-white/20'
    }`}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            tenant.type === 'COUNTRY'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-purple-500/20 text-purple-400'
          }`}
        >
          {tenant.type === 'COUNTRY' ? (
            <Globe className="w-4 h-4" />
          ) : (
            <Building2 className="w-4 h-4" />
          )}
        </div>
        <div>
          <h4 className={`text-sm font-bold ${isSelected ? 'text-blue-400' : 'text-gray-200'}`}>
            {tenant.name}
          </h4>
          <span className="text-[10px] font-mono text-gray-500">ID: {tenant.id}</span>
        </div>
      </div>
      <span
        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
          tenant.status === 'ACTIVE'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : tenant.status === 'PROVISIONING'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
              : 'bg-gray-700 text-gray-400 border-gray-600'
        }`}
      >
        {tenant.status}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-2 mt-4 text-[10px]">
      <div className="bg-black/20 p-2 rounded-lg">
        <span className="text-gray-500 block mb-1">Isolation</span>
        <span className="font-mono text-gray-300 flex items-center gap-1">
          <Database className="w-3 h-3 text-blue-400" /> {tenant.isolation}
        </span>
      </div>
      <div className="bg-black/20 p-2 rounded-lg">
        <span className="text-gray-500 block mb-1">Region</span>
        <span className="font-mono text-gray-300 flex items-center gap-1">
          <Server className="w-3 h-3 text-amber-400" /> {tenant.region}
        </span>
      </div>
    </div>
  </div>
);

export default function MultiTenancyPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(TENANTS[0]);
  const [activeTab, setActiveTab] = useState('CONFIG'); // CONFIG, RESOURCES, MIGRATION

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 DISCONNECTED BG */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#3b82f6 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-2xl border border-white/10 shadow-xl shadow-blue-500/10">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Multi-<span className="text-blue-500">TENANT</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Global Instance & Client Management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10">
            <Upload className="w-3 h-3" /> Import Config
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg border border-white/10">
            <Plus className="w-3 h-3" /> New Tenant
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative z-10 flex gap-6">
        {/* LEFT: TENANT LIST */}
        <div className="w-80 flex flex-col gap-4 shrink-0">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search tenants..."
              className="w-full bg-[#161B22]/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* LIST */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2">
            {TENANTS.map((tenant) => (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                isSelected={selectedTenant.id === tenant.id}
                onClick={() => setSelectedTenant(tenant)}
              />
            ))}
          </div>
        </div>

        {/* MIDDLE/RIGHT: DETAILS */}
        <div className="flex-1 bg-[#161B22]/50 backdrop-blur-md border border-white/5 rounded-[30px] p-6 flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black bg-gradient-to-br from-gray-800 to-black border border-white/10 shadow-2xl`}
              >
                {selectedTenant.type === 'COUNTRY'
                  ? selectedTenant.id.slice(0, 2).toUpperCase()
                  : 'CP'}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{selectedTenant.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-mono text-blue-400">{selectedTenant.id}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Database className="w-3 h-3" /> {selectedTenant.isolation}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {['CONFIG', 'RESOURCES', 'MIGRATION'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'CONFIG' && (
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Settings className="w-4 h-4 text-blue-500" /> General Settings
                  </h3>

                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">
                        Default Currency
                      </label>
                      <input
                        type="text"
                        value={selectedTenant.currency}
                        readOnly
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">
                        Timezone
                      </label>
                      <input
                        type="text"
                        value="GMT+0 (Greenwich Mean Time)"
                        readOnly
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">
                        Billing Plan
                      </label>
                      <div className="flex gap-2 mt-1">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-bold">
                          Enterprise V1
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Palette className="w-4 h-4 text-pink-500" /> Branding & Theme
                  </h3>

                  <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-600 border border-white/20 shadow-lg" />
                      <div className="w-12 h-12 rounded-lg bg-yellow-500 border border-white/20 shadow-lg" />
                      <div className="w-12 h-12 rounded-lg bg-[#020408] border border-white/20 shadow-lg" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-300">
                        Active Theme: {selectedTenant.theme}
                      </span>
                      <button className="text-xs text-blue-400 hover:underline">
                        Customize JSON
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-200">Whitelabel Features</span>
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-[10px] text-blue-300/70">
                      Custom Domain, Email Templates, and Login Page are configured.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'RESOURCES' && (
              <div className="h-full flex flex-col">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                  <Activity className="w-4 h-4 text-emerald-500" /> Usage Metrics (Live)
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-black/40 border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-gray-400">Compute (vCPU)</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full" style={{ width: '45%' }} />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      45% of allocated quota
                    </span>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <HardDrive className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-gray-400">Storage</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full" style={{ width: '62%' }} />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      62% used (High I/O)
                    </span>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-gray-400">Est. Cost</span>
                    </div>
                    <span className="text-xl font-black text-white">$1,240.50</span>
                    <span className="text-[10px] text-gray-500 mt-1 block">Month-to-date</span>
                  </div>
                </div>

                <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 p-4 min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={RESOURCES_USAGE} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#000',
                          borderRadius: '8px',
                          border: '1px solid #333',
                        }}
                      />
                      <Bar dataKey="cpu" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                      <Bar dataKey="storage" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'MIGRATION' && (
              <div className="flex flex-col gap-6">
                <div className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-blue-200 mb-1">
                      Backup & Migration Strategy
                    </h3>
                    <p className="text-xs text-blue-300/60 max-w-lg">
                      Configure how this tenant's data is moved or replicated. Current isolation
                      level allows for <strong>Hot Swap</strong> migration.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl text-xs font-bold text-gray-300">
                      <Download className="w-3 h-3" /> Export Data (JSON)
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-xs font-bold text-blue-300">
                      <Copy className="w-3 h-3" /> Clone Tenant Config
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Recent Jobs
                  </h3>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-200">Full Daily Snapshot</h4>
                          <span className="text-[10px] text-gray-500">
                            Completed 4 hours ago • 45GB
                          </span>
                        </div>
                      </div>
                      <button className="text-[10px] text-blue-400 hover:underline">
                        View Logs
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-blue-500/70">
            <Globe className="w-3 h-3" />
            Global Tenants: 4
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 italic">
            <Lock className="w-3 h-3" />
            RLS Policy: ENFORCED
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          MULTITENANT_MGR_v2.0
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
