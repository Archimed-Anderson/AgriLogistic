'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Satellite,
  Globe,
  Layers,
  Calendar,
  Cloud,
  Eye,
  Download,
  Map as MapIcon,
  Search,
  Filter,
  Activity,
  Maximize,
  Scan,
  ArrowRight,
  Play,
  Settings,
  Database,
  AlertTriangle,
  HardDrive,
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
const SATELLITE_IMAGES = [
  {
    id: 'S2B_20231024_T30NWL',
    satellite: 'Sentinel-2B',
    date: '2023-10-24',
    clouds: 2.4,
    resolution: '10m',
    bands: ['RGB', 'NIR', 'SWIR'],
    thumbnail: 'https://placehold.co/100x100/10b981/ffffff?text=NDVI',
    status: 'READY',
  },
  {
    id: 'L8_20231020_001',
    satellite: 'Landsat 8',
    date: '2023-10-20',
    clouds: 12.8,
    resolution: '30m',
    bands: ['RGB', 'Thermal'],
    thumbnail: 'https://placehold.co/100x100/3b82f6/ffffff?text=RGB',
    status: 'READY',
  },
  {
    id: 'S2A_20231015_T30NWL',
    satellite: 'Sentinel-2A',
    date: '2023-10-15',
    clouds: 45.2,
    resolution: '10m',
    bands: ['RGB', 'NIR'],
    thumbnail: 'https://placehold.co/100x100/6b7280/ffffff?text=CLOUDS',
    status: 'ARCHIVED',
  },
];

const USAGE_DATA = [
  { day: 'Mon', gbs: 45 },
  { day: 'Tue', gbs: 120 },
  { day: 'Wed', gbs: 85 },
  { day: 'Thu', gbs: 210 },
  { day: 'Fri', gbs: 160 },
  { day: 'Sat', gbs: 90 },
  { day: 'Sun', gbs: 60 },
];

// --- COMPONENTS ---

const ImageCard = ({ image }: any) => (
  <div className="bg-[#0D1117]/60 border border-white/5 rounded-xl p-3 flex gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
    <div className="w-20 h-20 rounded-lg bg-black/50 overflow-hidden relative border border-white/10">
      {/* Mock Thumbnail */}
      <div
        className={`absolute inset-0 opacity-50 ${image.clouds > 20 ? 'bg-gray-500' : 'bg-emerald-900'} mix-blend-overlay`}
      />
      <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-white/50">
        PREVIEW
      </div>
      {image.status === 'READY' && (
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-black" />
      )}
    </div>
    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
      <div>
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-xs font-bold text-gray-200 group-hover:text-blue-400 transition-colors truncate">
            {image.id}
          </h4>
          <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300 font-mono">
            {image.satellite}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {image.date}
          </span>
          <span
            className={`flex items-center gap-1 ${image.clouds < 10 ? 'text-emerald-500' : image.clouds < 40 ? 'text-amber-500' : 'text-rose-500'}`}
          >
            <Cloud className="w-3 h-3" /> {image.clouds}%
          </span>
          <span className="flex items-center gap-1">
            <Scan className="w-3 h-3" /> {image.resolution}
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <button className="flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/20 transition-colors border border-blue-500/20">
          <Eye className="w-3 h-3" /> Visualize
        </button>
        <button className="flex items-center gap-1 text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded hover:bg-white/10 transition-colors border border-white/10">
          <Download className="w-3 h-3" /> TIFF
        </button>
      </div>
    </div>
  </div>
);

export default function SatelliteImageryPage() {
  const [mounted, setMounted] = useState(false);
  const [activeMode, setActiveMode] = useState('EXPLORE'); // EXPLORE, ANALYZE

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 ORBITAL LINES BG */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="400"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            strokeDasharray="10 20"
            className="animate-[spin_120s_linear_infinite]"
          />
          <circle
            cx="50%"
            cy="50%"
            r="600"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.5"
            strokeDasharray="20 40"
            className="animate-[spin_180s_linear_infinite_reverse]"
          />
        </svg>
      </div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-sky-600/20 p-3 rounded-2xl border border-sky-500/30 shadow-lg shadow-sky-500/10 relative overflow-hidden">
            <Satellite className="w-8 h-8 text-sky-400 relative z-10" />
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-sky-400/20 to-transparent" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Sky <span className="text-sky-500">EYE</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Satellite Catalog & Remote Sensing Analytics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            {['EXPLORE', 'CHANGE DETECTION', 'BIOMASS'].map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${
                  activeMode === mode
                    ? 'bg-sky-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg shadow-sky-600/20 group uppercase tracking-widest italic">
            <Database className="w-4 h-4" />
            Task New Acquisition
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN WORKSPACE */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* LEFT: FILTERS & LIST */}
        <div className="w-[400px] flex flex-col gap-6 overflow-hidden">
          {/* SEARCH PANEL */}
          <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search location (Lat, Lon or Name)..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-gray-500 uppercase font-black">Date Range</label>
                <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between cursor-pointer hover:border-white/20">
                  <span className="text-[10px] text-white">Last 30 Days</span>
                  <Calendar className="w-3 h-3 text-gray-500" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-gray-500 uppercase font-black">Max Clouds</label>
                <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between cursor-pointer hover:border-white/20">
                  <span className="text-[10px] text-white">20%</span>
                  <Cloud className="w-3 h-3 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {['Sentinel-2', 'Landsat 8', 'Landsat 9', 'PlanetScope'].map((sat) => (
                <button
                  key={sat}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-300 hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-500/30 transition-all"
                >
                  {sat}
                </button>
              ))}
            </div>
          </div>

          {/* RESULTS LIST */}
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">
                Available Imagery <span className="text-sky-500">(124)</span>
              </h3>
              <button className="p-1.5 hover:bg-white/10 rounded text-gray-400">
                <Filter className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2">
              {SATELLITE_IMAGES.map((img) => (
                <ImageCard key={img.id} image={img} />
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE: MAP VISUALIZATION */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] relative overflow-hidden group">
            {/* MAP PLACEHOLDER */}
            <div className="absolute inset-0 bg-[#05080f] flex items-center justify-center">
              <Globe className="w-[400px] h-[400px] text-gray-800 opacity-20 animate-[spin_60s_linear_infinite]" />
              <div
                className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-overlay"
                style={{
                  backgroundImage:
                    'url("https://placehold.co/800x600/1e293b/475569?text=SATELLITE+VIEW+MOCKUP")',
                }}
              ></div>
            </div>

            {/* OVERLAY CONTROLS */}
            <div className="absolute top-6 right-6 flex flex-col gap-3">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 w-48">
                <p className="text-[9px] text-gray-400 uppercase font-black mb-2">
                  Band Combination
                </p>
                <div className="flex flex-col gap-1">
                  <button className="text-[10px] text-white text-left px-2 py-1.5 bg-sky-600/20 border border-sky-600/30 rounded flex justify-between items-center">
                    True Color (RGB) <div className="w-2 h-2 rounded-full bg-sky-500" />
                  </button>
                  <button className="text-[10px] text-gray-400 text-left px-2 py-1.5 hover:bg-white/5 rounded flex justify-between items-center">
                    False Color (NIR)
                  </button>
                  <button className="text-[10px] text-gray-400 text-left px-2 py-1.5 hover:bg-white/5 rounded flex justify-between items-center">
                    NDVI Analysis
                  </button>
                </div>
              </div>

              <button className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                <Layers className="w-5 h-5" />
              </button>
              <button className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>

            {/* BOTTOM ANALYSIS BAR */}
            <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex justify-between items-center">
              <div className="flex gap-8">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-black">Selected Index</p>
                  <p className="text-lg font-black text-emerald-400">NDVI</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-black">Avg Value</p>
                  <p className="text-lg font-black text-white">0.68</p>
                </div>
                <div className="h-full w-px bg-white/10" />
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-black">Change vs Prev.</p>
                  <p className="text-lg font-black text-rose-400 flex items-center gap-1">
                    -1.2% <ArrowRight className="w-3 h-3 rotate-45" />
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20">
                  Calculate Stats
                </button>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all border border-white/10">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: DATA USAGE STATS */}
        <div className="w-[280px] flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <HardDrive className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest">
                Data Usage
              </h3>
            </div>

            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 mb-6">
              <p className="text-[10px] text-gray-500 uppercase font-black mb-1">
                Total Downloaded
              </p>
              <p className="text-2xl font-black text-white flex items-end gap-1">
                4.2 <span className="text-sm text-gray-400 mb-1">TB</span>
              </p>
              <div className="h-1.5 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-sky-500 w-[75%]" />
              </div>
              <p className="text-[9px] text-gray-500 mt-2 text-right">75% of Monthly Quota</p>
            </div>

            <div className="h-40 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={USAGE_DATA}>
                  <Bar dataKey="gbs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <ReTooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      backgroundColor: '#000',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      fontSize: '10px',
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-auto space-y-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-[10px] font-bold text-white">Cache Alert</p>
                  <p className="text-[9px] text-gray-500">
                    Local cache (MinIO) at 92%. Auto-clean scheduled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-sky-500/70">
            <Globe className="w-3 h-3" />
            Providers: ESA Copernicus, USGS, Planet
          </span>
          <span className="flex items-center gap-1.5 text-blue-500/70 italic">
            <Activity className="w-3 h-3" />
            Processing Engine: Google Earth Engine
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          SAT_IMAGERY_HUB_V1
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
