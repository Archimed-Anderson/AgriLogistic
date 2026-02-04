'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Smartphone,
  Palette,
  Globe,
  Zap,
  Key,
  Webhook,
  Settings,
  Search,
  Plus,
  Copy,
  CheckCircle2,
  Terminal,
  LayoutTemplate,
  CreditCard,
  BarChart3,
  Activity,
  Shield,
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
} from 'recharts';

// --- MOCK DATA ---
const INSTANCES = [
  {
    id: 1,
    name: 'Coopérative Cacao Ivoire',
    domain: 'app.cacao-ivoire.com',
    plan: 'Enterprise',
    status: 'Active',
    color: '#10b981',
    type: 'Solutions White Label',
  },
  {
    id: 2,
    name: 'FinAgri Bank',
    domain: 'connect.finagri.bj',
    plan: 'Business',
    status: 'Maintenance',
    color: '#3b82f6',
    type: 'API Partner',
  },
  {
    id: 3,
    name: 'Transport Express',
    domain: 'logistics.express.sn',
    plan: 'Starter',
    status: 'Active',
    color: '#f59e0b',
    type: 'Solutions White Label',
  },
];

const API_KEYS = [
  {
    id: 'key_live_...932a',
    name: 'Production Key',
    prefix: 'pk_live',
    created: '2023-11-12',
    lastUsed: '2 mins ago',
    usage: '84%',
  },
  {
    id: 'key_test_...112x',
    name: 'Test Key',
    prefix: 'pk_test',
    created: '2024-01-05',
    lastUsed: '1 day ago',
    usage: '2%',
  },
];

const BILLING_PACKAGES = [
  {
    name: 'Starter',
    price: '$499/mo',
    features: ['1 White Label Instance', '10k API Req/day', 'Email Support'],
  },
  {
    name: 'Business',
    price: '$1299/mo',
    features: ['3 Instances', '100k API Req/day', 'Slack Support', 'Webhooks'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['Unlimited Instances', 'Uncapped API', 'Dedicated AM', 'SLA 99.9%'],
  },
];

// --- COMPONENTS ---

const InstanceCard = ({ instance }: any) => (
  <div className="bg-[#161B22] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 flex flex-col gap-4 group transition-all relative overflow-hidden">
    <div className="flex justify-between items-start z-10">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
          style={{ backgroundColor: instance.color }}
        >
          {instance.name.substring(0, 1)}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-200 group-hover:text-white">
            {instance.name}
          </h3>
          <a
            href="#"
            className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1"
          >
            {instance.domain} <Globe className="w-2 h-2" />
          </a>
        </div>
      </div>
      <span
        className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
          instance.status === 'Active'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}
      >
        {instance.status}
      </span>
    </div>

    <div className="flex items-center gap-2 p-2 bg-black/20 rounded-lg border border-white/5 z-10">
      <LayoutTemplate className="w-3 h-3 text-gray-500" />
      <span className="text-[10px] text-gray-400">Theme: {instance.plan} Custom</span>
    </div>

    <div className="flex gap-2 mt-auto z-10">
      <button className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold text-gray-300 transition-colors">
        Config
      </button>
      <button className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold text-gray-300 transition-colors">
        Analytics
      </button>
    </div>

    {/* Deco */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
  </div>
);

const ApiKeyRow = ({ apikey }: any) => (
  <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 border border-indigo-500/30">
        <Key className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-white flex items-center gap-2">
          {apikey.name}{' '}
          <span className="text-[9px] font-normal text-gray-500 bg-black/40 px-1 rounded">
            {apikey.prefix}
          </span>
        </h4>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
          <span>Created: {apikey.created}</span>
          <span>•</span>
          <span>
            Last used: <span className="text-emerald-400">{apikey.lastUsed}</span>
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end gap-1">
        <span className="text-[9px] text-gray-400 uppercase font-bold">Quota Usage</span>
        <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full" style={{ width: apikey.usage }} />
        </div>
      </div>
      <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
        <Copy className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default function PlatformStudioPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('INSTANCES'); // INSTANCES, API, WEBHOOKS, BILLING

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 CODE MATRIX BG */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(0deg, transparent 24%, #6366f1 25%, #6366f1 26%, transparent 27%, transparent 74%, #6366f1 75%, #6366f1 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #6366f1 25%, #6366f1 26%, transparent 27%, transparent 74%, #6366f1 75%, #6366f1 76%, transparent 77%, transparent)',
          backgroundSize: '30px 30px',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl border border-white/10 shadow-xl">
            <Code className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Developer <span className="text-indigo-400">STUDIO</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              White Label, API Gateway & Integrations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 overflow-x-auto max-w-md">
            {['INSTANCES', 'API', 'WEBHOOKS', 'BILLING'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 border border-white/10">
            <Plus className="w-3 h-3" /> New App
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative z-10 flex gap-6">
        {/* LEFT: MAIN WORKSPACE */}
        <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
          {activeTab === 'INSTANCES' && (
            <div className="h-full flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Deployed Instances
                </h3>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Filter..."
                    className="bg-black/40 border border-white/10 rounded-lg pl-8 p-1.5 text-[10px] text-white w-48"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pr-2 pb-2">
                {INSTANCES.map((inst) => (
                  <InstanceCard key={inst.id} instance={inst} />
                ))}
                <div className="border border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.02] cursor-pointer transition-colors group">
                  <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Smartphone className="w-6 h-6 text-gray-600 group-hover:text-gray-400" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300">
                    Create White Label App
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'API' && (
            <div className="h-full flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
              <div className="bg-[#161B22]/60 border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3 text-emerald-400" /> API Credentials
                  </h3>
                  <button className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">
                    Regenerate All
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {API_KEYS.map((key) => (
                    <ApiKeyRow key={key.id} apikey={key} />
                  ))}
                </div>
              </div>

              <div className="bg-[#161B22]/60 border border-white/5 rounded-2xl p-6">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-blue-400" /> Hourly Throughput
                </h3>
                <div className="h-40 bg-black/20 rounded-xl flex items-center justify-center text-gray-600 text-xs font-mono border border-white/5">
                  [Usage Chart Component Placeholder]
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: DOCS & STATUS */}
        <div className="flex-1 flex flex-col gap-6">
          {/* DOCUMENTATION WIDGET */}
          <div className="bg-gradient-to-b from-[#161B22] to-black border border-white/5 rounded-[30px] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-3 h-3 text-purple-400" /> Developer Hub
              </h3>
            </div>
            <div className="space-y-3">
              <a
                href="#"
                className="block p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors group"
              >
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 flex items-center justify-between">
                  API Reference (v2) <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                </h4>
                <p className="text-[10px] text-gray-500 mt-1">
                  Comprehensive endpoints documentation for Logistics & Finance.
                </p>
              </a>
              <a
                href="#"
                className="block p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors group"
              >
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 flex items-center justify-between">
                  SDKs & Libraries
                </h4>
                <div className="flex gap-2 mt-2">
                  <span className="px-1.5 py-0.5 bg-black/40 rounded text-[9px] text-gray-400 font-mono">
                    Node.js
                  </span>
                  <span className="px-1.5 py-0.5 bg-black/40 rounded text-[9px] text-gray-400 font-mono">
                    Python
                  </span>
                  <span className="px-1.5 py-0.5 bg-black/40 rounded text-[9px] text-gray-400 font-mono">
                    PHP
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* USAGE QUOTA */}
          <div className="flex-1 bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col relative overflow-hidden">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <CreditCard className="w-3 h-3 text-amber-400" /> Plan Usage
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Monthly API Calls</span>
                  <span className="text-white font-bold">8.2M / 10M</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[82%]" />
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <span className="text-[10px] text-amber-200 font-bold block mb-1">
                  Projected Overage
                </span>
                <span className="text-xs text-amber-400">~$45.00 this month</span>
              </div>
            </div>
            {/* Deco */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-indigo-500/70">
            <Zap className="w-3 h-3" />
            Gateway Latency: 42ms
          </span>
          <span className="flex items-center gap-1.5 text-emerald-500/70 italic">
            <CheckCircle2 className="w-3 h-3" />
            All Services Operational
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          DEV_STUDIO_V2.1
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
