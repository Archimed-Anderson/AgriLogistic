'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map as MapIcon,
  Layers,
  Navigation,
  Truck,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Filter,
  Play,
  Pause,
  Settings,
  Download,
  Maximize,
  Share2,
  Activity,
  ArrowRight,
  Globe,
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
  PieChart,
  Pie,
} from 'recharts';

// --- MOCK DATA ---
const REGIONS = [
  { id: 'R1', name: 'North Plains', x: 20, y: 30, production: 1200, export: 800 },
  { id: 'R2', name: 'East Delta', x: 70, y: 40, production: 3400, export: 2100 },
  { id: 'R3', name: 'South Highlands', x: 40, y: 80, production: 800, export: 150 },
  { id: 'R4', name: 'West Coast', x: 15, y: 65, production: 2100, export: 1800 },
];

const FLOWS = [
  { from: 'R1', to: 'R2', volume: 450, product: 'Wheat' },
  { from: 'R2', to: 'R4', volume: 1200, product: 'Rice' },
  { from: 'R3', to: 'R2', volume: 300, product: 'Coffee' },
  { from: 'R4', to: 'R1', volume: 600, product: 'Fruits' },
];

const ALERT_ZONES = [{ x: 45, y: 45, type: 'BOTTLENECK', label: 'Bridge Alpha Busy' }];

// --- COMPONENTS ---

const MapRegion = ({ region }: any) => (
  <div
    className="absolute w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-[0_0_20px_rgba(16,185,129,0.5)] z-20 group cursor-pointer"
    style={{ left: `${region.x}%`, top: `${region.y}%`, transform: 'translate(-50%, -50%)' }}
  >
    {/* 3D Extrusion Simulation */}
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 w-3 bg-emerald-500/80 backdrop-blur-sm transition-all duration-1000 origin-bottom group-hover:bg-emerald-400"
      style={{ height: `${region.production / 20}px` }} // Scale height
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-300"></div>
    </div>

    {/* Tooltip */}
    <div className="absolute top-0 right-0 translate-x-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 w-32 pointer-events-none z-30">
      <h4 className="text-[10px] font-bold text-white uppercase">{region.name}</h4>
      <div className="flex justify-between mt-1 text-[9px] text-gray-400">
        <span>Prod:</span> <span className="text-emerald-400">{region.production}T</span>
      </div>
      <div className="flex justify-between text-[9px] text-gray-400">
        <span>Exp:</span> <span className="text-blue-400">{region.export}T</span>
      </div>
    </div>
  </div>
);

const FlowPath = ({ start, end, volume }: any) => {
  // Calculate bezier curve control point
  const cx = (start.x + end.x) / 2;
  const cy = (start.y + end.y) / 2 - 10; // Curvature

  const pathD = `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
      {/* Background Path */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={Math.max(1, volume / 200)}
        vectorEffect="non-scaling-stroke"
      />

      {/* Animated Flow */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#flowGradient)"
        strokeWidth={Math.max(1, volume / 200)}
        strokeDasharray="10 20"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="animate-[dash_30s_linear_infinite]" // Slower for realism
        style={{ animationDuration: `${30000 / volume}s` }} // Faster flows for higher volume
      />

      <defs>
        <linearGradient id="flowGradient" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default function FluxMapPage() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState('LIVE'); // LIVE, HISTORIC
  const [simulationMode, setSimulationMode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#00040A] relative text-white">
      {/* 🌌 DARK MAP BG TEXTURE */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #111827 0%, #000 80%)',
        }}
      ></div>
      {/* Map Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="bg-orange-600/20 p-3 rounded-2xl border border-orange-500/30 shadow-lg shadow-orange-500/10">
            <MapIcon className="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Agri<span className="text-orange-500">FLOW</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Geospatial Flux & Supply Chain Heatmap.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 backdrop-blur-md">
            <button
              onClick={() => setViewMode('LIVE')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                viewMode === 'LIVE'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Activity className="w-3 h-3" /> Live Pulse
            </button>
            <button
              onClick={() => setViewMode('HISTORIC')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                viewMode === 'HISTORIC'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Calendar className="w-3 h-3" /> Historic
            </button>
          </div>

          <button
            onClick={() => setSimulationMode(!simulationMode)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg border border-white/10 uppercase tracking-widest italic group ${
              simulationMode
                ? 'bg-purple-600 border-purple-500/50 shadow-purple-600/30'
                : 'bg-black/40 hover:bg-white/5 text-gray-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Simulation Mode{' '}
            {simulationMode && (
              <span className="absolute top-[-4px] right-[-4px] w-3 h-3 bg-red-500 rounded-full animate-ping" />
            )}
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN MAP AREA */}
      <div className="absolute inset-0 top-24 bottom-24 m-6 border border-white/5 rounded-[40px] overflow-hidden bg-[#05080f] shadow-2xl group z-0">
        {/* Simulated Map Content */}

        {/* 1. Regions (Nodes) */}
        {REGIONS.map((region) => (
          <MapRegion key={region.id} region={region} />
        ))}

        {/* 2. Flows (Edges) */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* We use viewbox 0-100 to stick to percentage based coords */}
            {FLOWS.map((flow, i) => {
              const start = REGIONS.find((r) => r.id === flow.from);
              const end = REGIONS.find((r) => r.id === flow.to);
              return start && end ? (
                <FlowPath key={i} start={start} end={end} volume={flow.volume} />
              ) : null;
            })}
          </svg>
        </div>

        {/* 3. Dynamic Elements (Trucks, Alerts) */}
        {ALERT_ZONES.map((alert, i) => (
          <div
            key={i}
            className="absolute z-20"
            style={{ left: `${alert.x}%`, top: `${alert.y}%` }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-rose-500/20 rounded-full animate-ping" />
              <div className="bg-rose-500 p-1.5 rounded-full border border-white shadow-lg cursor-pointer hover:scale-125 transition-transform">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/80 backdrop-blur px-2 py-1 rounded text-[9px] text-rose-200 whitespace-nowrap border border-rose-500/20">
                {alert.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🛠️ CONTROLS & OVERLAYS */}
      <div className="absolute top-32 left-12 w-[320px] pointer-events-none flex flex-col gap-4">
        {/* FILTER PANEL */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[20px] p-5 pointer-events-auto transform transition-transform hover:scale-105 origin-top-left">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Filters
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[9px] text-gray-500 font-bold block mb-1">Commodity</label>
              <div className="flex flex-wrap gap-2">
                {['Wheat', 'Rice', 'Fruits', 'Coffee'].map((c) => (
                  <button
                    key={c}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[9px] text-gray-300 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[9px] text-gray-500 font-bold block mb-1">Flow Type</label>
              <div className="flex gap-2">
                <button className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-[9px] text-blue-300">
                  Export
                </button>
                <button className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-gray-400">
                  Domestic
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SIMULATION PANEL (If Active) */}
        <AnimatePresence>
          {simulationMode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-purple-900/60 backdrop-blur-xl border border-purple-500/30 rounded-[20px] p-5 pointer-events-auto"
            >
              <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-200 mb-3 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Scenario Builder
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] text-purple-100 p-2 bg-purple-800/40 rounded-lg">
                  <span>Simulate Bridge Closure</span>
                  <div className="w-8 h-4 bg-purple-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-purple-100 p-2 bg-purple-800/40 rounded-lg">
                  <span>Incr. Demand (+20%)</span>
                  <div className="w-8 h-4 bg-gray-700 rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-gray-400 rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="pt-2 border-t border-purple-500/30">
                  <div className="flex justify-between text-[9px] text-purple-300 mb-1">
                    <span>Detour Cost Impact:</span>
                    <span className="font-bold text-white">+12.4%</span>
                  </div>
                  <div className="h-1 bg-purple-900 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 w-[12%]" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FLOW LEGEND BOTTOM RIGHT */}
      <div className="absolute bottom-32 right-12 bg-black/60 backdrop-blur-xl border border-white/10 rounded-[20px] p-4 pointer-events-auto">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
          Map Layers
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-gray-300">
            <div className="w-3 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded" />
            <span>Active Flows (Vol.)</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-300">
            <div className="w-3 h-3 bg-emerald-500 border border-white rounded-full scale-50" />
            <span>Production Hub</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-300">
            <div className="w-3 h-3 bg-rose-500 border border-white rounded-full scale-50" />
            <span>Bottleneck / Alert</span>
          </div>
        </div>
      </div>

      {/* 📟 TIME CONTROLLER FOOTER */}
      <footer className="h-12 shrink-0 flex items-center gap-4 px-6 border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md z-20 rounded-t-2xl mx-12">
        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
          <Play className="w-3 h-3 fill-current" />
        </button>
        <div className="flex-1 relative h-10 flex items-center group cursor-pointer">
          {/* Tick Marks */}
          <div className="absolute inset-0 flex justify-between px-2">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className={`w-px h-2 ${i % 4 === 0 ? 'bg-white/30 h-3' : 'bg-white/10'} self-center`}
              />
            ))}
          </div>
          {/* Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-[65%]" />
          </div>
          {/* Thumb */}
          <div className="absolute left-[65%] w-4 h-4 bg-orange-500 border-2 border-black rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)] flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          {/* Tooltip on Hover */}
          <div className="absolute left-[65%] -top-8 -translate-x-1/2 bg-white text-black text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            15:30
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="text-orange-400">15:30</span> / 23:59
        </div>
        <div className="w-px h-6 bg-white/10 mx-2" />
        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </footer>
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </div>
  );
}
