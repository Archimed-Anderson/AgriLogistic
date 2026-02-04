'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  Calendar,
  CloudRain,
  BarChart3,
  AlertTriangle,
  BrainCircuit,
  Clock,
  Target,
  RotateCw,
  ArrowRight,
  Sliders,
  Search,
  MapPin,
  Sprout,
  DollarSign,
  Truck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  ReferenceLine,
} from 'recharts';

// --- MOCK DATA ---
const YIELD_FORECAST = [
  { date: 'Week 1', actual: 450, prediction: 460, upper: 480, lower: 440 },
  { date: 'Week 2', actual: 470, prediction: 475, upper: 495, lower: 455 },
  { date: 'Week 3', actual: 485, prediction: 490, upper: 515, lower: 465 },
  { date: 'Week 4', actual: null, prediction: 510, upper: 540, lower: 480 },
  { date: 'Week 5', actual: null, prediction: 530, upper: 565, lower: 495 },
  { date: 'Week 6', actual: null, prediction: 545, upper: 585, lower: 505 },
];

const PRICE_SCENARIOS = [
  { name: 'Base Scenario', growth: '+5%', impact: 'Stable', probability: '65%' },
  { name: 'High Demand', growth: '+12%', impact: 'Shortage', probability: '25%' },
  { name: 'Supply Shock', growth: '+25%', impact: 'Critical', probability: '10%' },
];

const ALERTS = [
  {
    id: 'A-01',
    type: 'SHORTAGE',
    title: 'Maize Shortage Risk',
    desc: 'Predicted supply drop in Northern Region within 3 weeks due to drought impact.',
    severity: 'HIGH',
    action: 'Trigger Import',
  },
  {
    id: 'A-02',
    type: 'LOGISTICS',
    title: 'Transport Spike',
    desc: 'Harvest peak in East aligns with holiday traffic. Expect +40% transit times.',
    severity: 'MEDIUM',
    action: 'Pre-book Fleet',
  },
];

// --- COMPONENTS ---

const PredictionCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-[#0D1117]/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
    <div>
      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-white">{value}</span>
        <span
          className={`text-[10px] font-bold ${change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}
        >
          {change}
        </span>
      </div>
    </div>
    <div className={`p-3 rounded-xl bg-white/5 border border-white/5`}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
  </div>
);

export default function PredictionsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('yield');
  const [horizon, setHorizon] = useState('3M');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 FORECAST GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full">
          <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8B5CF6" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-purple-600/20 p-3 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/10">
            <BrainCircuit className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              AI Forecasting <span className="text-purple-500">LAB</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Predictive Analytics for Business Planning & Risk Management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            {['1M', '3M', '6M', '1Y'].map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  horizon === h
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg shadow-purple-600/20 group uppercase tracking-widest italic">
            <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform" />
            Run Simulation
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN DASHBOARD */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* LEFT: CONTROLS & SCENARIOS */}
        <div className="w-[300px] flex flex-col gap-6 overflow-hidden">
          {/* KPI CARDS */}
          <div className="flex flex-col gap-3">
            <PredictionCard
              title="Yield Prediction"
              value="4,250 T"
              change="+5.2%"
              icon={Sprout}
              color="#10B981"
            />
            <PredictionCard
              title="Market Price Idx"
              value="$1,240"
              change="+1.8%"
              icon={DollarSign}
              color="#3B82F6"
            />
            <PredictionCard
              title="Logistics Load"
              value="85%"
              change="+12%"
              icon={Truck}
              color="#F59E0B"
            />
          </div>

          {/* SCENARIO BUILDER */}
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-black text-white uppercase">What-If Simulator</h3>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase">
                  Rainfall Deviation
                </label>
                <input
                  type="range"
                  className="w-full accent-blue-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                  <span>-50% (Drought)</span>
                  <span>+50% (Flood)</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Fuel Cost</label>
                <input
                  type="range"
                  className="w-full accent-amber-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                  <span>Stability</span>
                  <span>+20% Surge</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <h4 className="text-[10px] text-gray-500 uppercase font-black mb-3">
                  Projected Outcomes
                </h4>
                <div className="space-y-2">
                  {PRICE_SCENARIOS.map((s) => (
                    <div key={s.name} className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-white font-bold">{s.name}</span>
                        <span className="text-[9px] text-purple-400 font-mono">
                          {s.probability} Prob.
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-400">
                        <span>
                          Growth: <span className="text-white">{s.growth}</span>
                        </span>
                        <span
                          className={`font-bold ${s.impact === 'Critical' ? 'text-rose-400' : 'text-emerald-400'}`}
                        >
                          {s.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: CHARTING AREA */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* TABS */}
          <div className="flex gap-4 border-b border-white/5 pb-1">
            {[
              { id: 'yield', label: 'Yield Forecast', icon: Sprout },
              { id: 'price', label: 'Price Trends', icon: DollarSign },
              { id: 'logistics', label: 'Logistics Demand', icon: Truck },
              { id: 'weather', label: 'Weather Impact', icon: CloudRain },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-gray-500 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wide">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* MAIN CHART */}
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 relative flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Regional Yield Forecast{' '}
                  <span className="text-gray-500 text-sm font-normal">vs Actuals</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Confidence Interval: 95% • Model: Prophet v0.8
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <Target className="w-3 h-3" />
                Model Accuracy: 94.2% (Last 30d)
              </div>
            </div>

            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={YIELD_FORECAST}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis
                    dataKey="date"
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
                  <Area
                    type="monotone"
                    dataKey="lower"
                    stackId="1"
                    stroke="transparent"
                    fill="transparent"
                  />
                  <Area
                    type="monotone"
                    dataKey="upper"
                    stackId="1"
                    stroke="transparent"
                    fill="#8B5CF6"
                    fillOpacity={0.1}
                  />
                  <Line
                    type="monotone"
                    name="Actual (Recorded)"
                    dataKey="actual"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10B981' }}
                  />
                  <Line
                    type="monotone"
                    name="AI Prediction"
                    dataKey="prediction"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: '#8B5CF6' }}
                  />
                  <ReferenceLine
                    x="Week 3"
                    stroke="white"
                    strokeDasharray="3 3"
                    label={{ position: 'top', value: 'Today', fill: 'white', fontSize: 10 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ALERTS SECTION */}
          <div className="h-[150px] grid grid-cols-2 gap-6">
            {ALERTS.map((alert) => (
              <motion.div
                key={alert.id}
                whileHover={{ scale: 1.02 }}
                className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex gap-4 cursor-pointer hover:border-white/10 transition-colors"
              >
                <div
                  className={`p-3 rounded-xl h-fit ${
                    alert.severity === 'HIGH'
                      ? 'bg-rose-500/10 text-rose-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                    <span className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-gray-400">
                      {alert.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed mb-2">{alert.desc}</p>
                  <button className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 flex items-center gap-1">
                    Action Suggestions <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-blue-500/70">
            <Clock className="w-3 h-3" />
            Last Update: 12ms ago
          </span>
          <span className="flex items-center gap-1.5 text-purple-500/70 italic">
            <BrainCircuit className="w-3 h-3" />
            Engine: Prophet (Facebook Research)
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          PREDICTIVE_ANALYTICS_V2
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
