'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  Database,
  Smartphone,
  Cpu,
  ArrowRight,
  Activity,
  Layers,
  AlertOctagon,
  Play,
  RotateCcw,
  Settings,
  GitBranch,
  HardDrive,
  Zap,
  Filter,
  Table2,
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
} from 'recharts';

// --- MOCK DATA ---
const THROUGHPUT_DATA = [
  { time: '10:00', in: 1200, out: 1150 },
  { time: '10:05', in: 1500, out: 1400 },
  { time: '10:10', in: 3200, out: 3000 }, // Spike
  { time: '10:15', in: 2800, out: 2750 },
  { time: '10:20', in: 2100, out: 2100 },
  { time: '10:25', in: 1800, out: 1800 },
];

const TOPICS = [
  { name: 'iot.telemetry.v1', partitions: 12, msgRate: '2.4k/s', lag: 45, retention: '7d' },
  { name: 'logistics.positions', partitions: 6, msgRate: '850/s', lag: 0, retention: '30d' },
  { name: 'market.offers', partitions: 3, msgRate: '120/s', lag: 0, retention: '1y' },
  { name: 'system.logs', partitions: 24, msgRate: '15k/s', lag: 1200, retention: '3d' },
];

const BROKERS = [
  { id: 101, status: 'ONLINE', cpu: 45, disk: 62 },
  { id: 102, status: 'ONLINE', cpu: 48, disk: 58 },
  { id: 103, status: 'MAINTENANCE', cpu: 0, disk: 0 },
];

// --- COMPONENTS ---

const PipelineNode = ({ title, icon: Icon, type, metrics }: any) => (
  <div
    className={`
        relative w-40 p-4 rounded-2xl border flex flex-col items-center gap-3 z-10
        ${
          type === 'source'
            ? 'bg-blue-900/20 border-blue-500/30'
            : type === 'process'
              ? 'bg-purple-900/20 border-purple-500/30'
              : type === 'storage'
                ? 'bg-emerald-900/20 border-emerald-500/30'
                : 'bg-gray-900/40 border-gray-700'
        }
        backdrop-blur-xl
    `}
  >
    <div className={`p-3 rounded-xl bg-white/5 border border-white/5 shadow-lg`}>
      <Icon
        className={`w-6 h-6 ${
          type === 'source'
            ? 'text-blue-400'
            : type === 'process'
              ? 'text-purple-400'
              : type === 'storage'
                ? 'text-emerald-400'
                : 'text-gray-400'
        }`}
      />
    </div>
    <div className="text-center">
      <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-300">{title}</h4>
      {metrics && <p className="text-[9px] font-mono text-gray-500 mt-1">{metrics}</p>}
    </div>

    {/* Status Indicator */}
    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
  </div>
);

const AnimatedFlow = () => (
  <div className="flex-1 h-0.5 bg-white/10 relative overflow-hidden mx-2">
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/2"
      animate={{ x: ['-100%', '200%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

export default function DataPipelinePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#0B0E14] relative text-white">
      {/* 🌌 DOT MATRIX BG */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full">
          <pattern id="dot-matrix" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#6366f1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dot-matrix)" />
        </svg>
      </div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600/20 p-3 rounded-2xl border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
            <GitBranch className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Data <span className="text-indigo-500">PIPELINE</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Real-time Kafka Streams & Event Processing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-xs font-mono text-gray-400 bg-gray-900/50 px-4 py-2 rounded-xl border border-white/5">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Healthy
            </span>
            <span className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-2">
              <Activity className="w-3 h-3" /> Latency: 45ms
            </span>
          </div>
        </div>
      </header>

      {/* 🕹️ PIPELINE VISUALIZATION (RIVER FLOW) */}
      <div className="flex-1 flex flex-col gap-6 relative z-10 overflow-hidden">
        {/* 1. TOPOLOGY VIEW */}
        <div className="bg-[#161B22]/80 backdrop-blur-xl border border-white/5 p-8 rounded-[40px] flex items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

          {/* SOURCES */}
          <div className="flex flex-col gap-4">
            <PipelineNode title="IoT Devices" icon={Cpu} type="source" metrics="1.2k active" />
            <PipelineNode title="Mobile Apps" icon={Smartphone} type="source" metrics="450 req/s" />
          </div>

          <AnimatedFlow />

          {/* INGESTION (Kafka) */}
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="relative w-48 h-48 rounded-full border-4 border-dashed border-indigo-500/30 flex items-center justify-center bg-indigo-500/5 animate-[spin_10s_linear_infinite] group-hover:border-indigo-500/60 transition-colors">
              <div className="w-32 h-32 rounded-full border-4 border-indigo-500/20" />
            </div>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <Layers className="w-8 h-8 text-indigo-400 mb-2" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">
                Kafka Cluster
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">3 Brokers • 45 Topics</p>
            </div>
          </div>

          <AnimatedFlow />

          {/* PROCESSING */}
          <div className="flex flex-col gap-4">
            <PipelineNode
              title="Stream Processor"
              icon={Zap}
              type="process"
              metrics="Filtering & Agg."
            />
            <PipelineNode
              title="AI Inference"
              icon={Activity}
              type="process"
              metrics="Anomalies Det."
            />
          </div>

          <AnimatedFlow />

          {/* SINKS */}
          <div className="flex flex-col gap-4">
            <PipelineNode
              title="TimescaleDB"
              icon={Database}
              type="storage"
              metrics="Time-series"
            />
            <PipelineNode
              title="Data Lake"
              icon={HardDrive}
              type="storage"
              metrics="Cold StORAGE"
            />
          </div>
        </div>

        {/* 2. METRICS & CONTROLS CONTAINER */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* LEFT: THROUGHPUT CHART */}
          <div className="flex-1 bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">
                Throughput (Msg/sec)
              </h3>
              <select className="bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-gray-400">
                <option>Last 1 Hour</option>
                <option>Last 24 Hours</option>
              </select>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={THROUGHPUT_DATA}>
                  <defs>
                    <linearGradient id="inGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="#4b5563"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: '#000',
                      border: '1px solid #333',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="in"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#inGradient)"
                    name="Ingress"
                  />
                  <Area
                    type="monotone"
                    dataKey="out"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#outGradient)"
                    name="Egress"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MIDDLE: TOPICS MANAGEMENT */}
          <div className="w-[400px] bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">
                Active Topics
              </h3>
              <button className="p-1.5 hover:bg-white/10 rounded text-gray-400">
                <Filter className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
              {TOPICS.map((topic) => (
                <div
                  key={topic.name}
                  className="bg-black/20 border border-white/5 rounded-xl p-3 flex flex-col gap-2 hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-300 group-hover:text-indigo-400 transition-colors">
                      {topic.name}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${topic.lag > 100 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}
                    >
                      Lag: {topic.lag}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>Rate: {topic.msgRate}</span>
                    <span>Part: {topic.partitions}</span>
                    <span>Ret: {topic.retention}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: CONTROL ACTIONS */}
          <div className="w-[280px] flex flex-col gap-4">
            {/* BROKER STATUS */}
            <div className="bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-5">
              <h3 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3">
                Cluster Health
              </h3>
              <div className="space-y-2">
                {BROKERS.map((broker) => (
                  <div key={broker.id} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${broker.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      />
                      <span className="text-gray-300">Broker-{broker.id}</span>
                    </div>
                    <div className="flex gap-2 font-mono text-gray-500">
                      <span>CPU:{broker.cpu}%</span>
                      <span>DSK:{broker.disk}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex-1 bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-5 flex flex-col justify-end gap-3">
              <h3 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">
                Emergency Ops
              </h3>

              <button className="flex items-center gap-3 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 p-3 rounded-xl transition-all group">
                <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
                  <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-indigo-100">Replay Events</p>
                  <p className="text-[9px] text-indigo-300/60">Last 1h to Dev Sink</p>
                </div>
              </button>

              <button className="flex items-center gap-3 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 p-3 rounded-xl transition-all group">
                <div className="p-1.5 bg-rose-500/80 rounded-lg text-white">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-rose-100">Purge DLQ</p>
                  <p className="text-[9px] text-rose-300/60">1,204 Bad Messages</p>
                </div>
              </button>
              <button className="flex items-center gap-3 bg-gray-700/20 hover:bg-gray-700/40 border border-white/5 p-3 rounded-xl transition-all group">
                <div className="p-1.5 bg-gray-600 rounded-lg text-white">
                  <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-200">Schema Registry</p>
                  <p className="text-[9px] text-gray-500">View Avro/Protobuf</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-indigo-500/70">
            <Server className="w-3 h-3" />
            Kafka ver: 3.4.0 (Kraft Mode)
          </span>
          <span className="flex items-center gap-1.5 text-blue-500/70 italic">
            <Activity className="w-3 h-3" />
            Consumer Groups: 12 Active
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          STREAM_PROCESSOR_V2
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
