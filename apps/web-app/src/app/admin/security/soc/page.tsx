'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  AlertTriangle,
  Globe,
  Activity,
  Eye,
  Users,
  Settings,
  FileWarning,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Server,
  Wifi,
  Fingerprint,
  Siren,
  Ban,
  Key,
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
const THREATS = [
  {
    id: 1,
    type: 'SQL Injection',
    source: '192.168.1.45',
    origin: 'Russia',
    blocked: true,
    time: '2 mins ago',
    severity: 'High',
  },
  {
    id: 2,
    type: 'XSS Attempt',
    source: '10.0.0.12',
    origin: 'China',
    blocked: true,
    time: '15 mins ago',
    severity: 'Medium',
  },
  {
    id: 3,
    type: 'Brute Force SSH',
    source: '172.16.0.5',
    origin: 'Unknown',
    blocked: true,
    time: '1 hour ago',
    severity: 'Critical',
  },
];

const VULNERABILITIES = [
  {
    id: 'CVE-2024-2311',
    pkg: 'lodash',
    version: '4.17.15',
    severity: 'High',
    fix: 'Upgrade to 4.17.21',
  },
  {
    id: 'CVE-2023-4512',
    pkg: 'axios',
    version: '0.21.0',
    severity: 'Medium',
    fix: 'Upgrade to 1.6.0',
  },
];

const SESSIONS = [
  {
    id: 1,
    user: 'Admin Anderson',
    ip: '192.168.1.10',
    device: 'Chrome / Windows',
    location: 'Abidjan, CI',
    activeSince: '45 mins ago',
  },
  {
    id: 2,
    user: 'Support Team',
    ip: '10.5.2.1',
    device: 'Firefox / Mac',
    location: 'Dakar, SN',
    activeSince: '2 hours ago',
  },
];

// --- COMPONENTS ---

const ThreatRow = ({ threat }: any) => (
  <div className="flex items-center justify-between p-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-colors group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-red-500/20 rounded-lg text-red-500 border border-red-500/20">
        <AlertTriangle className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-white group-hover:text-red-400">{threat.type}</h4>
        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" /> {threat.origin}
          </span>
          <span>•</span>
          <span className="font-mono">{threat.source}</span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
        <Shield className="w-3 h-3" /> BLOCKED
      </span>
      <span className="text-[9px] text-gray-500 mt-1 block">{threat.time}</span>
    </div>
  </div>
);

const SessionRow = ({ session }: any) => (
  <div className="flex items-center justify-between p-3 bg-[#161B22] hover:bg-[#1C2128] border border-white/5 rounded-xl transition-colors">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/5 rounded-full text-gray-400">
        <Users className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-200">{session.user}</h4>
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <span>{session.device}</span>
          <span>•</span>
          <span>{session.location}</span>
        </div>
      </div>
    </div>
    <button className="text-[10px] text-red-400 hover:text-red-300 font-bold hover:underline">
      Revoke
    </button>
  </div>
);

export default function SecuritySOCPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // DASHBOARD, ACCESS, POLICIES

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 RED ALERT BG */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 1px, transparent 0, transparent 50%)',
          backgroundSize: '10px 10px',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-red-600 to-rose-700 p-3 rounded-2xl border border-white/10 shadow-xl shadow-red-500/10 animate-pulse-slow">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Security <span className="text-red-500">SOC</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Threat Intelligence & Access Control.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            {['DASHBOARD', 'ACCESS', 'POLICIES'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab === 'DASHBOARD' && <Activity className="w-3 h-3" />}
                {tab === 'ACCESS' && <Key className="w-3 h-3" />}
                {tab === 'POLICIES' && <Settings className="w-3 h-3" />}
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg border border-white/10">
            <Siren className="w-3 h-3 animate-pulse" /> Panic Mode
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative z-10 flex gap-6">
        {/* LEFT: MAIN MONITORS */}
        <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
          {activeTab === 'DASHBOARD' && (
            <div className="h-full flex flex-col gap-6">
              {/* LIVE THREAT MAP PLACEHOLDER */}
              <div className="h-64 bg-[#161B22] border border-red-500/20 rounded-2xl relative overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center grayscale pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent" />

                {/* Mock Attack Lines */}
                <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping delay-75" />
                <div className="flex flex-col items-center gap-2 z-10">
                  <Globe className="w-8 h-8 text-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-red-400 tracking-widest uppercase">
                    Live Threat Map Active
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-3 h-3 text-red-500" /> Recent Intercepts
                </h3>
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-2">
                  {THREATS.map((t) => (
                    <ThreatRow key={t.id} threat={t} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ACCESS' && (
            <div className="h-full flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#161B22] border border-white/5 rounded-2xl">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                    Active Sessions
                  </h4>
                  <span className="text-3xl font-black text-white">42</span>
                </div>
                <div className="p-4 bg-[#161B22] border border-white/5 rounded-2xl">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                    Failed Logins (24h)
                  </h4>
                  <span className="text-3xl font-black text-amber-500">12</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-2">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Session List
                </h3>
                {SESSIONS.map((s) => (
                  <SessionRow key={s.id} session={s} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: VULNERABILITIES & POLICIES */}
        <div className="flex-1 flex flex-col gap-6">
          {/* SYSTEM HEALTH */}
          <div className="bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Server className="w-3 h-3 text-emerald-400" /> System Integrity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">WAF Status</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">SSL Certificate</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Valid (280d)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Dependency Scan</span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> 2 Issues
                </span>
              </div>
            </div>
          </div>

          {/* VULNERABILITY LIST */}
          <div className="flex-1 bg-gradient-to-b from-[#161B22] to-black border border-white/5 rounded-[30px] p-6 flex flex-col relative overflow-hidden">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <FileWarning className="w-3 h-3 text-amber-400" /> Vulnerabilities (CVE)
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 relative z-10">
              {VULNERABILITIES.map((vuln) => (
                <div
                  key={vuln.id}
                  className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-amber-500">{vuln.id}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded uppercase font-bold">
                      {vuln.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 font-mono mb-2">
                    {vuln.pkg} @ {vuln.version}
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <RefreshCw className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] text-emerald-400">{vuln.fix}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Deco */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-emerald-500/70">
            <Shield className="w-3 h-3" />
            Firewall: ENFORCING
          </span>
          <span className="flex items-center gap-1.5 text-red-500/70">
            <Ban className="w-3 h-3" />
            Blocked Today: 1,420
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          SOC_DASHBOARD_v1.0
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
