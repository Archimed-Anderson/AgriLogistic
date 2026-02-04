'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Signal,
  ScanLine,
  Database,
  Play,
  Pause,
  RefreshCw,
  MapPin,
  Settings,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  HardDrive,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

// --- MOCK DATA ---
const DEVICES = [
  {
    id: 'DEV-8821',
    name: 'Soil Sensor Pro',
    type: 'SENSOR',
    location: 'Zone A - Plot 4',
    status: 'ONLINE',
    battery: 85,
    signal: 'STRONG',
    lastPing: '2m ago',
    firmware: 'v2.1.0',
  },
  {
    id: 'DEV-9932',
    name: 'Drone Scout X1',
    type: 'DRONE',
    location: 'Hangar North',
    status: 'CHARGING',
    battery: 45,
    signal: 'OFFLINE',
    lastPing: '4h ago',
    firmware: 'v1.4.5',
  },
  {
    id: 'DEV-1204',
    name: 'Weather St. Mk2',
    type: 'STATION',
    location: 'Zone B - Center',
    status: 'ONLINE',
    battery: 98,
    signal: 'MEDIUM',
    lastPing: '1m ago',
    firmware: 'v3.0.1',
  },
  {
    id: 'DEV-4421',
    name: 'Soil Sensor Std',
    type: 'SENSOR',
    location: 'Zone C - Plot 12',
    status: 'OFFLINE',
    battery: 0,
    signal: 'NONE',
    lastPing: '2d ago',
    firmware: 'v2.0.0',
  },
];

// --- COMPONENTS ---

const DeviceStatCard = ({ title, value, sub, icon: Icon, color }: any) => (
  <div className="bg-[#0D1117]/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
    <div>
      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{title}</p>
      <div className="flex flex-col">
        <span className="text-2xl font-black text-white">{value}</span>
        {sub && <span className="text-[9px] text-gray-500 font-mono">{sub}</span>}
      </div>
    </div>
    <div className={`p-3 rounded-xl bg-white/5 border border-white/5`}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
  </div>
);

const DeviceRow = ({ device }: any) => (
  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
    <div
      className={`p-3 rounded-xl border ${
        device.status === 'ONLINE'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          : device.status === 'CHARGING'
            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
      }`}
    >
      {device.type === 'DRONE' ? (
        <ScanLine className="w-5 h-5" />
      ) : device.type === 'STATION' ? (
        <Wifi className="w-5 h-5" />
      ) : (
        <Cpu className="w-5 h-5" />
      )}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
          {device.name}
        </span>
        <span
          className={`text-[9px] px-1.5 py-0.5 rounded border ${
            device.status === 'ONLINE'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : device.status === 'CHARGING'
                ? 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                : 'border-gray-500/20 bg-gray-500/10 text-gray-400'
          }`}
        >
          {device.status}
        </span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {device.location}
        </span>
        <span className="flex items-center gap-1">
          <HardDrive className="w-3 h-3" /> {device.firmware}
        </span>
      </div>
    </div>

    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1 ${
            device.battery > 50
              ? 'text-emerald-500'
              : device.battery > 20
                ? 'text-amber-500'
                : 'text-rose-500'
          }`}
        >
          {device.status === 'CHARGING' ? (
            <BatteryCharging className="w-3 h-3" />
          ) : (
            <Battery className="w-3 h-3" />
          )}
          <span className="text-[10px] font-bold">{device.battery}%</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div
          className={`flex items-center gap-1 ${
            device.signal === 'STRONG'
              ? 'text-emerald-500'
              : device.signal === 'MEDIUM'
                ? 'text-blue-500'
                : 'text-gray-500'
          }`}
        >
          <Signal className="w-3 h-3" />
        </div>
      </div>
      <span className="text-[9px] text-gray-600">Last Ping: {device.lastPing}</span>
    </div>

    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
      <MoreVertical className="w-4 h-4" />
    </button>
  </div>
);

export default function DeviceManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 CIRCUIT BOARD BG */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full">
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M10,10 L90,10 L90,90 L10,90 Z"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="0.5"
            />
            <circle cx="20" cy="20" r="2" fill="#3B82F6" />
            <circle cx="80" cy="80" r="2" fill="#3B82F6" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <Cpu className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Device <span className="text-blue-500">MANAGER</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              IoT Fleet Control & Sensor Calibration.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            {['ALL', 'ONLINE', 'OFFLINE', 'MAINTENANCE'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg shadow-blue-600/20 group uppercase tracking-widest italic">
            <ScanLine className="w-4 h-4" />
            Pair New Device
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTROL GRID */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* LEFT: DEVICE LIST */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* STATS ROW */}
          <div className="flex gap-4">
            <div className="flex-1">
              <DeviceStatCard
                title="Total Devices"
                value="1,248"
                sub="+12 this week"
                icon={Database}
                color="#3B82F6"
              />
            </div>
            <div className="flex-1">
              <DeviceStatCard
                title="Online Status"
                value="98.2%"
                sub="1,225 Active"
                icon={Wifi}
                color="#10B981"
              />
            </div>
            <div className="flex-1">
              <DeviceStatCard
                title="Low Battery"
                value="23"
                sub="Crit < 10%"
                icon={Battery}
                color="#F59E0B"
              />
            </div>
            <div className="flex-1">
              <DeviceStatCard
                title="Offline"
                value="4"
                sub="Attention req."
                icon={WifiOff}
                color="#F43F5E"
              />
            </div>
          </div>

          {/* LIST CONTAINER */}
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">
                Device Register
              </h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search Device ID..."
                    className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 w-48"
                  />
                </div>
                <button className="p-2 bg-black/40 border border-white/10 rounded-xl text-gray-500 hover:text-white">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-2">
              {DEVICES.map((device) => (
                <DeviceRow key={device.id} device={device} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: CONFIG PANEL */}
        <div className="w-[350px] flex flex-col gap-6 overflow-hidden">
          <div className="h-full bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest">
                Bulk Actions
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors group">
                <RefreshCw className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
                <span className="text-[10px] font-bold text-gray-300">OTA Update</span>
              </button>
              <button className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors group">
                <Pause className="w-5 h-5 text-gray-400 group-hover:text-white" />
                <span className="text-[10px] font-bold text-gray-300">Suspend</span>
              </button>
              <button className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors group">
                <Play className="w-5 h-5 text-gray-400 group-hover:text-white" />
                <span className="text-[10px] font-bold text-gray-300">Wake Up</span>
              </button>
              <button className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors group">
                <Settings className="w-5 h-5 text-gray-400 group-hover:text-white" />
                <span className="text-[10px] font-bold text-gray-300">Sync Config</span>
              </button>
            </div>

            <div className="mt-auto bg-black/40 rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-black mb-3">
                Firmware Distribution
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-white">v3.0.1 (Latest)</span>
                  <span className="text-emerald-400 font-bold">65%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[65%]" />
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-white">v2.1.0</span>
                  <span className="text-gray-400 font-bold">25%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[25%]" />
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
            Protocol: MQTT Secure (TLS 1.3)
          </span>
          <span className="flex items-center gap-1.5 text-blue-500/70 italic">
            <Signal className="w-3 h-3" />
            Gateway Latency: 45ms
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          IOT_FLEET_COMMAND
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
