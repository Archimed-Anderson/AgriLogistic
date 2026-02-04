'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  HardDrive,
  Save,
  RefreshCw,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileArchive,
  Play,
  Cloud,
  Server,
  Download,
  History,
  Calendar,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

// --- MOCK DATA ---
const BACKUP_STATUS = [
  {
    id: 'POSTGRES',
    name: 'PostgreSQL Primary',
    status: 'SUCCESS',
    lastRun: '45 mins ago',
    size: '4.2 GB',
    retention: '30 Days',
    integrity: 'VERIFIED',
  },
  {
    id: 'MONGO',
    name: 'MongoDB Cluster',
    status: 'SUCCESS',
    lastRun: '2 hours ago',
    size: '1.8 GB',
    retention: '30 Days',
    integrity: 'VERIFIED',
  },
  {
    id: 'S3_ASSETS',
    name: 'S3 Media Assets',
    status: 'SYNCING',
    lastRun: 'In Progress',
    size: '145 GB',
    retention: '1 Year',
    integrity: 'PENDING',
  },
  {
    id: 'CONFIG',
    name: 'K8s Config / Etcd',
    status: 'FAILED',
    lastRun: '1 day ago',
    size: '120 MB',
    retention: '90 Days',
    integrity: 'ERROR',
  },
];

const STORAGE_GROWTH = [
  { date: 'Jan', size: 120 },
  { date: 'Feb', size: 135 },
  { date: 'Mar', size: 142 },
  { date: 'Apr', size: 158 },
  { date: 'May', size: 180 },
  { date: 'Jun', size: 210 },
];

const RECOVERY_POINTS = [
  { id: 1, time: '2024-03-24 14:00:00', type: 'Hourly Incremental', size: '50 MB' },
  { id: 2, time: '2024-03-24 13:00:00', type: 'Hourly Incremental', size: '48 MB' },
  { id: 3, time: '2024-03-24 12:00:00', type: 'Full Backup', size: '4.1 GB' },
  { id: 4, time: '2024-03-24 11:00:00', type: 'Hourly Incremental', size: '45 MB' },
];

// --- COMPONENTS ---

const BackupCard = ({ job }: any) => (
  <div
    className={`p-4 rounded-2xl border ${
      job.status === 'SUCCESS'
        ? 'bg-emerald-500/5 border-emerald-500/20'
        : job.status === 'SYNCING'
          ? 'bg-blue-500/5 border-blue-500/20'
          : 'bg-red-500/5 border-red-500/20'
    } flex flex-col gap-3 group transition-all`}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            job.status === 'SUCCESS'
              ? 'bg-emerald-500/20 text-emerald-400'
              : job.status === 'SYNCING'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-red-500/20 text-red-500'
          }`}
        >
          <Database className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-200">{job.name}</h4>
          <span className="text-[10px] text-gray-500">{job.id}</span>
        </div>
      </div>
      <div
        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
          job.status === 'SUCCESS'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : job.status === 'SYNCING'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}
      >
        {job.status}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2 mt-2">
      <div className="bg-black/20 p-2 rounded-lg">
        <span className="text-[9px] text-gray-500 block">Last Run</span>
        <span className="text-xs font-mono text-gray-300">{job.lastRun}</span>
      </div>
      <div className="bg-black/20 p-2 rounded-lg">
        <span className="text-[9px] text-gray-500 block">Total Size</span>
        <span className="text-xs font-mono text-gray-300">{job.size}</span>
      </div>
    </div>

    <div className="flex items-center justify-between pt-2 border-t border-white/5">
      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
        <ShieldCheck
          className={`w-3 h-3 ${job.integrity === 'VERIFIED' ? 'text-emerald-500' : 'text-gray-600'}`}
        />
        Integrity: {job.integrity}
      </div>
      <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  </div>
);

export default function BackupsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('BACKUPS'); // BACKUPS, DR_PLAN, ARCHIVES

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 VAULT BG */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #14b8a6 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-3 rounded-2xl border border-white/10 shadow-xl shadow-teal-500/10">
            <Save className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Backup & <span className="text-teal-400">RECOVERY</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Data Protecting, Archiving & DR Strategy.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            {[
              { id: 'BACKUPS', icon: HardDrive, label: 'Backups' },
              { id: 'DR_PLAN', icon: AlertTriangle, label: 'DR Plan' },
              { id: 'ARCHIVES', icon: FileArchive, label: 'Archives' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <tab.icon className="w-3 h-3" /> {tab.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg border border-white/10">
            <Play className="w-3 h-3" /> Run Backup Now
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative z-10 flex gap-6">
        {/* LEFT: CONTENT */}
        <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
          {activeTab === 'BACKUPS' && (
            <div className="h-full flex flex-col gap-6">
              {/* JOB GRID */}
              <div className="grid grid-cols-2 gap-4">
                {BACKUP_STATUS.map((job) => (
                  <BackupCard key={job.id} job={job} />
                ))}
              </div>

              {/* GROWTH CHART */}
              <div className="flex-1 bg-[#161B22] border border-white/5 rounded-2xl p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Storage Growth (GB)
                  </h3>
                  <span className="text-[10px] text-teal-400">+12% vs last month</span>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={STORAGE_GROWTH}>
                      <defs>
                        <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#666"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#000',
                          borderColor: '#333',
                          borderRadius: '8px',
                        }}
                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="size"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorSize)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'DR_PLAN' && (
            <div className="h-full overflow-y-auto custom-scrollbar pr-2">
              {/* SLA STATUS */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-200">Current RPO</span>
                  </div>
                  <div className="text-2xl font-black text-white">5 min</div>
                  <span className="text-[10px] text-emerald-500/70">Target: &lt; 15 min</span>
                </div>
                <div className="flex-1 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <RefreshCw className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-200">Est. RTO</span>
                  </div>
                  <div className="text-2xl font-black text-white">45 min</div>
                  <span className="text-[10px] text-emerald-500/70">Target: &lt; 4h</span>
                </div>
              </div>

              {/* SIMULATION */}
              <div className="bg-[#161B22] border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Disaster Recovery Simulation
                    </h3>
                    <p className="text-xs text-gray-500">Last successful drill: 3 months ago</p>
                  </div>
                  <button className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors">
                    Initiate Warning Drill
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5 opacity-50">
                    <CheckCircle2 className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-400 line-through">
                      1. Isolate Primary Cluster
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5 opacity-50">
                    <CheckCircle2 className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-400 line-through">
                      2. Activate Failover DNS
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5 opacity-50">
                    <CheckCircle2 className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-400 line-through">
                      3. Mount Snapshot Replicas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: TIMELINE & ACTIONS */}
        <div className="flex-1 flex flex-col gap-6">
          {/* POINT IN TIME RECOVERY */}
          <div className="bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col h-full">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <History className="w-3 h-3 text-teal-400" /> Recovery Points
            </h3>

            <div className="relative pl-4 border-l border-white/5 space-y-6">
              {RECOVERY_POINTS.map((point, i) => (
                <div key={point.id} className="relative group cursor-pointer">
                  <div
                    className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-[#020408] ${i === 0 ? 'bg-teal-500' : 'bg-gray-700'}`}
                  />
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-teal-500/30 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-teal-200">{point.type}</span>
                      <span className="text-[9px] text-gray-500 bg-black/40 px-1.5 py-0.5 rounded">
                        {point.size}
                      </span>
                    </div>
                    <div className="text-xs text-gray-300 font-mono mt-1 mb-2">{point.time}</div>
                    <button className="w-full py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-[10px] font-bold rounded transition-colors opacity-0 group-hover:opacity-100">
                      Test Restore
                    </button>
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
          <span className="flex items-center gap-1.5 text-teal-500/70">
            <Cloud className="w-3 h-3" />
            S3 Storage: eu-west-3 (Paris)
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 italic">
            <Server className="w-3 h-3" />
            Replica: sa-east-1 (São Paulo) [ASYNC]
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          BACKUP_OS_v2.4
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
