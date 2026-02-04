'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  BrainCircuit,
  Activity,
  Zap,
  ShieldCheck,
  Database,
  History,
  Play,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BarChart3,
  Layers,
  Share2,
  Info,
  ChevronRight,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Terminal,
  Eye,
  Settings2,
  Bug,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

// --- MOCK DATA ---
const ML_MODELS = [
  {
    id: 'yield-pred',
    name: 'Yield Predictor',
    version: 'v2.4.1',
    status: 'PRODUCTION',
    accuracy: 94.2,
    f1: 0.92,
    latency: '145ms',
    lastTraining: '2026-01-25',
    dataset: 'agri-harvest-v12',
    drift: 1.2,
    color: '#10B981',
  },
  {
    id: 'price-pred',
    name: 'Price Forecasting',
    version: 'v1.8.3',
    status: 'PRODUCTION',
    accuracy: 89.5,
    f1: 0.88,
    latency: '182ms',
    lastTraining: '2026-01-28',
    dataset: 'market-historical-v5',
    drift: 4.8,
    color: '#3B82F6',
  },
  {
    id: 'quality-cv',
    name: 'Quality Computer Vision',
    version: 'v3.0.0-rc1',
    status: 'STAGING',
    accuracy: 97.1,
    f1: 0.96,
    latency: '340ms',
    lastTraining: '2026-01-31',
    dataset: 'seed-quality-v2',
    drift: 0.5,
    color: '#8B5CF6',
  },
  {
    id: 'route-opt',
    name: 'Route Optimizer (OR-Tools)',
    version: 'v2.1.0',
    status: 'PRODUCTION',
    accuracy: 92.0,
    f1: 0.9,
    latency: '85ms',
    lastTraining: '2026-01-20',
    dataset: 'logistics-vrp-base',
    drift: 2.1,
    color: '#F59E0B',
  },
  {
    id: 'fraud-det',
    name: 'Fraud Detection (Anomalies)',
    version: 'v1.2.5',
    status: 'DEV',
    accuracy: 85.2,
    f1: 0.82,
    latency: '45ms',
    lastTraining: '2026-02-01',
    dataset: 'fin-anomalies-latest',
    drift: 0.2,
    color: '#EC4899',
  },
];

const DRIFT_HISTORY = [
  { day: 'Mon', accuracy: 94.2, drift: 0.5 },
  { day: 'Tue', accuracy: 93.8, drift: 0.8 },
  { day: 'Wed', accuracy: 94.5, drift: 0.4 },
  { day: 'Thu', accuracy: 93.1, drift: 1.5 },
  { day: 'Fri', accuracy: 92.5, drift: 2.1 },
  { day: 'Sat', accuracy: 91.8, drift: 2.8 },
  { day: 'Sun', accuracy: 90.5, drift: 4.2 },
];

const SHAP_VALUES = [
  { feature: 'Soil Humidity', value: 0.45 },
  { feature: 'Avg Temp', value: 0.32 },
  { feature: 'Fertilizer Qty', value: 0.18 },
  { feature: 'Pest History', value: -0.12 },
  { feature: 'Seed Quality', value: 0.08 },
];

// --- COMPONENTS ---

const ModelCard = ({ model, active, onClick }: any) => (
  <motion.div
    whileHover={{ x: 5 }}
    onClick={onClick}
    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
      active
        ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10'
        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
    }`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
          <BrainCircuit className="w-5 h-5" style={{ color: model.color }} />
        </div>
        <div>
          <h4 className="text-white font-black text-sm">{model.name}</h4>
          <p className="text-[10px] text-gray-500 font-mono italic">{model.version}</p>
        </div>
      </div>
      <span
        className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${
          model.status === 'PRODUCTION'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : model.status === 'STAGING'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}
      >
        {model.status}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2 mt-4">
      <div className="bg-black/20 p-2 rounded-xl border border-white/5">
        <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Accuracy</p>
        <p className="text-sm font-black text-white">{model.accuracy}%</p>
      </div>
      <div className="bg-black/20 p-2 rounded-xl border border-white/5">
        <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Latency</p>
        <p className="text-sm font-black text-white">{model.latency}</p>
      </div>
    </div>
  </motion.div>
);

export default function MLOpsDashboard() {
  const [mounted, setMounted] = useState(false);
  const [selectedModel, setSelectedModel] = useState(ML_MODELS[0]);
  const [activeTab, setActiveTab] = useState('monitoring');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 NEURAL NETWORK BACKGROUND */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full">
          <pattern
            id="neural-net"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="50" cy="50" r="1" fill="#3B82F6" />
            <line x1="50" y1="50" x2="150" y2="150" stroke="#3B82F6" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="-50" y2="150" stroke="#3B82F6" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#neural-net)" />
        </svg>
      </div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600/20 p-3 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10 relative overflow-hidden group">
            <Cpu className="w-8 h-8 text-emerald-400" />
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-0 left-0 w-full h-1 bg-emerald-400/50"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              MLOps Command Center <span className="text-emerald-500">PRO</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Neural lifecycle management, real-time performance tracking & weights auditing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-8">
            <div className="flex flex-col items-end">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">
                Daily Inferences
              </p>
              <p className="text-xl font-black text-white">
                1.24 <span className="text-xs text-emerald-500 font-mono italic">Million</span>
              </p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">
                Avg Predict Latency
              </p>
              <p className="text-xl font-black text-white italic">
                142<span className="text-xs text-blue-500 ml-1">ms</span>
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg shadow-emerald-600/20 group uppercase tracking-widest italic">
            <Play
              className="w-4 h-4 group-hover:scale-125 transition-transform"
              fill="currentColor"
            />
            Deploy New Model
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN OPS GRID */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* 📋 MODEL REGISTRY (LEFT) */}
        <div className="w-[350px] flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Model Registry
            </h3>
            <div className="flex gap-1">
              <button className="p-1.5 bg-white/5 rounded-lg border border-white/10 text-gray-500">
                <Search className="w-3 h-3" />
              </button>
              <button className="p-1.5 bg-white/5 rounded-lg border border-white/10 text-gray-500">
                <Filter className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 custom-scrollbar">
            {ML_MODELS.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                active={selectedModel.id === model.id}
                onClick={() => setSelectedModel(model)}
              />
            ))}
          </div>
        </div>

        {/* 🛡️ MODEL MONITORING & DEEP DIVE (CENTER/RIGHT) */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* MODEL HEADER */}
          <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                <BrainCircuit className="w-8 h-8" style={{ color: selectedModel.color }} />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-white tracking-tighter">
                    {selectedModel.name}
                  </h2>
                  <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 italic">
                    {selectedModel.version}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Database className="w-3 h-3" /> {selectedModel.dataset}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Last Trained: {selectedModel.lastTraining}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-2xl text-xs font-black transition-all border border-white/10 uppercase tracking-widest italic group">
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Retrain Model
              </button>
              <button className="flex items-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 px-5 py-2.5 rounded-2xl text-xs font-black transition-all border border-blue-500/20 uppercase tracking-widest italic">
                <Share2 className="w-4 h-4" />
                A/B Test (v3.1.0)
              </button>
            </div>
          </div>

          {/* TABS NAVIGATION */}
          <div className="flex gap-1 bg-black/40 border border-white/5 p-1.5 rounded-2xl self-start">
            {['monitoring', 'pipeline', 'explainability'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? 'bg-white/10 text-white border border-white/10 shadow-lg'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* DYNAMIC CONTENT */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'monitoring' && (
                <motion.div
                  key="monitoring"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full grid grid-cols-2 gap-6"
                >
                  {/* PERFORMANCE TREND */}
                  <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[10px] text-gray-600 uppercase font-black tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        Accuracy & Performance Drift
                      </h4>
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        Drift Detected: +4.2%
                      </div>
                    </div>
                    <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={DRIFT_HISTORY}>
                          <defs>
                            <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#ffffff05"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="day"
                            stroke="#4b5563"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="#4b5563"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            domain={['dataMin - 5', 'dataMax + 5']}
                          />
                          <ReTooltip
                            contentStyle={{
                              backgroundColor: '#0D1117',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="accuracy"
                            stroke="#3B82F6"
                            fillOpacity={1}
                            fill="url(#accGradient)"
                            strokeWidth={3}
                          />
                          <Line
                            type="monotone"
                            dataKey="drift"
                            stroke="#EF4444"
                            strokeWidth={2}
                            dot={false}
                            strokeDasharray="5 5"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* DATA DISTRIBUTION (TRAIN VS PROD) */}
                  <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex flex-col">
                    <h4 className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-6 flex items-center gap-2">
                      <Database className="w-4 h-4 text-purple-400" />
                      Input Data Distribution Shift
                    </h4>
                    <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { group: '0-20%', train: 15, prod: 18 },
                            { group: '21-40%', train: 25, prod: 20 },
                            { group: '41-60%', train: 45, prod: 52 },
                            { group: '61-80%', train: 32, prod: 28 },
                            { group: '81-100%', train: 12, prod: 15 },
                          ]}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#ffffff05"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="group"
                            stroke="#4b5563"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                          <ReTooltip
                            contentStyle={{
                              backgroundColor: '#0D1117',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px',
                            }}
                          />
                          <Bar
                            dataKey="train"
                            fill="#ffffff10"
                            radius={[4, 4, 0, 0]}
                            name="Training Set"
                          />
                          <Bar
                            dataKey="prod"
                            fill="#8B5CF6"
                            radius={[4, 4, 0, 0]}
                            name="Production (Live)"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'explainability' && (
                <motion.div
                  key="explainability"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full flex gap-6"
                >
                  <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-8">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h4 className="text-white font-black text-xl italic uppercase tracking-tighter">
                          Feature Impact (SHAP Values)
                        </h4>
                        <p className="text-gray-500 text-xs font-medium">
                          Why the model made this prediction? Understanding local feature weights.
                        </p>
                      </div>
                      <div className="bg-emerald-600/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                        <span className="text-[10px] text-emerald-400 font-mono font-black uppercase">
                          Interpretable: YES
                        </span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {SHAP_VALUES.map((shap, i) => (
                        <div key={shap.feature} className="space-y-2">
                          <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-400">
                            <span>{shap.feature}</span>
                            <span className={shap.value > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              {shap.value > 0 ? '+' : ''}
                              {shap.value}
                            </span>
                          </div>
                          <div className="h-4 bg-white/5 rounded-full overflow-hidden flex relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.abs(shap.value) * 100}%` }}
                              transition={{ delay: i * 0.1, duration: 1 }}
                              className={`h-full relative z-10 ${shap.value > 0 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-rose-500'}`}
                              style={{
                                marginLeft: shap.value < 0 ? 'auto' : '50%',
                                transform: `translateX(${shap.value < 0 ? '0' : '0'})`,
                              }}
                            />
                            <div className="absolute inset-y-0 left-1/2 w-px bg-white/20 z-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-[300px] flex flex-col gap-6">
                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-[40px] p-6">
                      <h5 className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Insight Insight
                      </h5>
                      <p className="text-xs text-gray-300 leading-relaxed italic">
                        Le modèle affiche un poids massif sur l'humidité du sol pour la prédiction
                        finale. Une divergence a été notée par rapport au modèle v2.3.0.
                      </p>
                    </div>
                    <div className="flex-1 bg-black/40 border border-white/5 rounded-[40px] p-6 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Bug className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-[10px] text-gray-500 uppercase font-black italic">
                        Bias Audit
                      </p>
                      <p className="text-xs text-white font-bold mt-1">Status: CLEAN</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'pipeline' && (
                <motion.div
                  key="pipeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="flex items-center gap-8">
                    {[
                      { name: 'ETL / Ingestion', icon: Database, status: 'COMPLETED' },
                      { name: 'Preprocessing', icon: Terminal, status: 'COMPLETED' },
                      { name: 'Fine-Tuning', icon: BrainCircuit, status: 'RUNNING' },
                      { name: 'Validation', icon: CheckCircle2, status: 'PENDING' },
                      { name: 'Deploy (Knative)', icon: Zap, status: 'PENDING' },
                    ].map((step, i, arr) => (
                      <React.Fragment key={step.name}>
                        <div className="flex flex-col items-center gap-4">
                          <div
                            className={`w-20 h-20 rounded-[30px] border flex items-center justify-center relative ${
                              step.status === 'COMPLETED'
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                : step.status === 'RUNNING'
                                  ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                                  : 'bg-white/5 border-white/10 text-gray-500'
                            }`}
                          >
                            <step.icon className="w-10 h-10" />
                            {step.status === 'RUNNING' && (
                              <div className="absolute inset-0 rounded-[30px] border-2 border-blue-500 animate-ping opacity-20" />
                            )}
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-white font-black uppercase tracking-widest">
                              {step.name}
                            </p>
                            <p
                              className={`text-[8px] font-mono italic mt-1 ${
                                step.status === 'COMPLETED'
                                  ? 'text-emerald-500'
                                  : step.status === 'RUNNING'
                                    ? 'text-blue-400'
                                    : 'text-gray-600'
                              }`}
                            >
                              {step.status}
                            </p>
                          </div>
                        </div>
                        {i < arr.length - 1 && (
                          <ChevronRight
                            className={`w-8 h-8 ${step.status === 'COMPLETED' ? 'text-emerald-500' : 'text-gray-800'}`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-blue-500/70">
            <Terminal className="w-3 h-3" />
            MLflow Log: CONNECTED to srv-ml-registry-01
          </span>
          <span className="flex items-center gap-1.5 text-emerald-500/70 italic">
            <ShieldCheck className="w-3 h-3" />
            Security Guard: Weights integrity verified [v2.4.1]
          </span>
          <span className="flex items-center gap-1.5 text-purple-500/70">
            <Zap className="w-3 h-3" />
            Knative Scaling: 4 Pods active (Auto-scale to 0 in 15m idle)
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          AGENT_ML_OPS_UNIT_X45
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
