'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  AlertTriangle,
  Server,
  Activity,
  RefreshCcw,
  GitMerge,
  Megaphone,
  CalendarClock,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  XCircle,
  Lock,
  Globe,
  Rocket,
  RotateCcw,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- MOCK DATA ---
const UPCOMING_MAINTENANCE = [
  {
    id: 1,
    title: 'Database Migration (v4.2)',
    date: 'Sun, Feb 4 • 02:00 GMT',
    duration: '2 hours',
    impacted: 'All Services',
    status: 'SCHEDULED',
  },
  {
    id: 2,
    title: 'Security Patching',
    date: 'Sat, Feb 10 • 03:00 GMT',
    duration: '30 mins',
    impacted: 'Auth Service',
    status: 'PLANNED',
  },
];

const DEPLOYMENTS = [
  {
    id: 'v2.4.0',
    title: 'Feature Release: Social Hub',
    type: 'CANARY',
    status: 'SUCCESS',
    traffic: '100%',
    time: '2 hours ago',
  },
  {
    id: 'v2.4.1-rc',
    title: 'Hotfix: Login Timeout',
    type: 'BLUE_GREEN',
    status: 'ROLLING_OUT',
    traffic: '15%',
    time: 'In Progress',
  },
];

const HEALTH_CHECKS = [
  { name: 'API Gateway (Kong)', status: 'OPERATIONAL', uptime: '99.99%', latency: '24ms' },
  { name: 'PostgreSQL Cluster', status: 'OPERATIONAL', uptime: '99.95%', latency: '45ms' },
  { name: 'Redis Cache', status: 'OPERATIONAL', uptime: '100%', latency: '2ms' },
  { name: 'Mobile Money Gateway', status: 'DEGRADED', uptime: '98.50%', latency: '850ms' },
];

const ERROR_RATES = [
  { time: '10:00', rate: 0.1 },
  { time: '10:05', rate: 0.2 },
  { time: '10:10', rate: 0.1 },
  { time: '10:15', rate: 0.1 },
  { time: '10:20', rate: 0.5 },
  { time: '10:25', rate: 1.2 },
  { time: '10:30', rate: 0.8 },
  { time: '10:35', rate: 0.2 },
];

// --- COMPONENTS ---

const MaintenanceModeCard = () => (
  <div className="p-6 bg-[#161B22] border border-white/5 rounded-2xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-50">
      <Wrench className="w-24 h-24 text-amber-500/10 rotate-45" />
    </div>

    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/20">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Maintenance Mode</h3>
          <p className="text-xs text-gray-400">Controls global access to the platform.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase">Current Status</span>
          <span className="flex items-center gap-2 text-sm font-black text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM ONLINE
          </span>
        </div>
      </div>

      <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl mb-6">
        <h4 className="text-xs font-bold text-amber-400 mb-2 uppercase">Configuration</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked
              readOnly
              className="rounded border-gray-600 bg-gray-700 text-amber-500"
            />
            Show "Under Maintenance" Page (HTTP 503)
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked
              readOnly
              className="rounded border-gray-600 bg-gray-700 text-amber-500"
            />
            Allow Whitelisted IPs (Admin/Eng)
          </label>
        </div>
      </div>

      <button className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/20 border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-2">
        <PowerIcon /> ACTIVATE MAINTENANCE
      </button>
    </div>
  </div>
);

const PowerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
    <line x1="12" y1="2" x2="12" y2="12"></line>
  </svg>
);

export default function MaintenancePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('OPS'); // OPS, DEPLOY, HEALTH

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 CONCRETE TEXTURE BG */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #f59e0b 25%, transparent 25%, transparent 75%, #f59e0b 75%, #f59e0b), linear-gradient(45deg, #f59e0b 25%, transparent 25%, transparent 75%, #f59e0b 75%, #f59e0b)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-amber-600 to-orange-700 p-3 rounded-2xl border border-white/10 shadow-xl shadow-amber-500/10">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Maintenance <span className="text-amber-500">& OPS</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              System Updates, Deployments & Health Checks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            {[
              { id: 'OPS', icon: AlertTriangle, label: 'Operations' },
              { id: 'DEPLOY', icon: Rocket, label: 'Deployments' },
              { id: 'HEALTH', icon: Activity, label: 'Health Status' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <tab.icon className="w-3 h-3" /> {tab.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg border border-white/10">
            <Megaphone className="w-3 h-3" /> Notify Users
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative z-10 flex gap-6">
        {/* LEFT: CONTENT */}
        <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
          {activeTab === 'OPS' && (
            <div className="h-full flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <MaintenanceModeCard />

                {/* SCHEDULED OPS */}
                <div className="bg-[#161B22] border border-white/5 rounded-2xl p-6 flex flex-col">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-blue-400" /> Scheduled Maintenance
                  </h3>
                  <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
                    {UPCOMING_MAINTENANCE.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                            {task.title}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/20">
                            {task.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {task.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" /> {task.duration}
                          </span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-gray-500">
                          Impact: <span className="text-gray-300">{task.impacted}</span>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 border-dashed rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors">
                      + Schedule New Window
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'DEPLOY' && (
            <div className="h-full flex flex-col gap-6">
              {/* ACTIVE DEPLOYMENT */}
              <div className="p-6 bg-gradient-to-br from-[#161B22] to-black border border-white/5 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Active Rollout: v2.4.1-rc</h3>
                    <p className="text-xs text-blue-400 font-mono">
                      Strategy: Blue/Green • Target: 100%
                    </p>
                  </div>
                  <button className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors flex items-center gap-2">
                    <RotateCcw className="w-3 h-3" /> Emergency Rollback
                  </button>
                </div>

                <div className="flex items-center gap-8 mb-6">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-gray-400">Traffic Distribution</span>
                      <span className="text-xs font-bold text-white">15% New / 85% Stable</span>
                    </div>
                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-blue-500 animate-pulse" style={{ width: '15%' }} />
                      <div className="h-full bg-emerald-600/50" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-500">0.8%</span>
                    <span className="text-[10px] text-gray-500 block uppercase">Error Rate</span>
                  </div>
                </div>

                {/* ERROR CHART */}
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ERROR_RATES}>
                      <defs>
                        <linearGradient id="colorErr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="rate"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorErr)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Deployment History
                </h3>
                {DEPLOYMENTS.map((dep) => (
                  <div
                    key={dep.id}
                    className="flex justify-between items-center p-4 bg-[#161B22] rounded-xl border border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          dep.status === 'SUCCESS'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : dep.status === 'ROLLING_OUT'
                              ? 'bg-blue-500/20 text-blue-400 animate-pulse'
                              : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        <GitMerge className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{dep.title}</h4>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {dep.id} • {dep.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400">{dep.time}</div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          dep.status === 'SUCCESS'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : dep.status === 'ROLLING_OUT'
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {dep.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'HEALTH' && (
            <div className="h-full overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2">
              <div className="grid grid-cols-2 gap-4">
                {HEALTH_CHECKS.map((check) => (
                  <div
                    key={check.name}
                    className="p-4 bg-[#161B22] border border-white/5 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-gray-300 mb-1">{check.name}</h4>
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex items-center gap-1 text-[10px] font-bold ${
                            check.status === 'OPERATIONAL' ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {check.status === 'OPERATIONAL' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {check.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-white">{check.uptime}</div>
                      <span className="text-[10px] text-gray-500 font-mono">{check.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: GLOBAL STATUS */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1 bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Globe className="w-3 h-3 text-amber-400" /> Public Status Page
            </h3>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h2 className="text-xl font-black text-white">All Systems Operational</h2>
              <p className="text-xs text-emerald-400/70">Last updated: Just now</p>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-xs text-gray-400">Response Time (Global)</span>
                <span className="text-xs font-mono font-bold text-white">124ms</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-xs text-gray-400">Error Rate (24h)</span>
                <span className="text-xs font-mono font-bold text-emerald-400">0.02%</span>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3">
                  Incident History
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                    <div>
                      <p className="text-xs text-gray-300">No incidents reported today.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start opacity-60">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                    <div>
                      <p className="text-xs text-gray-300">Minor: SMS Delivery Delay</p>
                      <span className="text-[9px] text-gray-500">Feb 01 • Resolved in 15m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-emerald-500/70">
            <CheckCircle2 className="w-3 h-3" />
            Agents Connected: 12/12
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 italic">
            <Clock className="w-3 h-3" />
            Next Sync: 45s
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          MAINTENANCE_OS_v3.1
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
