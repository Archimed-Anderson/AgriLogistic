'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Cpu,
  Activity,
  Map as MapIcon,
  Thermometer,
  Waves,
  Wind,
  Zap,
  ShieldCheck,
  AlertCircle,
  Clock,
  Fingerprint,
  Truck,
  Fuel,
  Lock,
  LockOpen,
  Vibrate,
  Mic,
  Settings,
  History,
  Maximize2,
  Bell,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

// Dynamically import LogisticsMap
const LogisticsMap = dynamic(() => import('@/components/maps/LogisticsMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center text-slate-500 font-black uppercase text-[10px] tracking-[0.5em]">
      Initializing Telemetry Mesh...
    </div>
  ),
});

// --- MOCK DATA ---
const FLEET_IOT = [
  {
    id: 'TRK-001',
    name: 'Moussa Sylla - SCANIA R450',
    status: 'moving',
    cargo: 'Bananes (Frais)',
    temp: 13.5,
    humidity: 62,
    fuel: 78,
    doors: 'locked',
    engine: 'on',
    vibrations: 'low',
    battery: 94,
    lastUpdate: '2s ago',
    coords: [5.3, -4.0],
    alerts: 0,
  },
  {
    id: 'TRK-002',
    name: 'Koffi Adams - VOLVO FH16',
    status: 'stopped',
    cargo: 'Tomates (Primeur)',
    temp: 11.2,
    humidity: 58,
    fuel: 42,
    doors: 'opened',
    engine: 'off',
    vibrations: 'none',
    battery: 12, // ALERT
    lastUpdate: '1m ago',
    coords: [5.5, -3.9],
    alerts: 2,
  },
  {
    id: 'TRK-003',
    name: 'Jean Kouamé - MERCEDES ACTROS',
    status: 'alert',
    cargo: 'Laiterie (UHT)',
    temp: 18.2, // CRITICAL ALERT (should be < 8)
    humidity: 45,
    fuel: 85,
    doors: 'locked',
    engine: 'on',
    vibrations: 'high', // ALERT
    battery: 88,
    lastUpdate: '5s ago',
    coords: [4.8, -6.6],
    alerts: 5,
  },
];

const TEMP_HISTORY = [
  { time: '10:00', temp: 12.5 },
  { time: '10:30', temp: 12.8 },
  { time: '11:00', temp: 13.2 },
  { time: '11:30', temp: 13.5 },
  { time: '12:00', temp: 15.8 }, // Spike
  { time: '12:30', temp: 18.2 }, // Alert
  { time: '13:00', temp: 17.5 },
];

const VIBRATION_SPECTRUM = [
  { freq: '10Hz', amp: 20 },
  { freq: '20Hz', amp: 45 },
  { freq: '50Hz', amp: 80 },
  { freq: '100Hz', amp: 30 },
  { freq: '200Hz', amp: 15 },
];

export default function IoTTrackingPage() {
  const [selectedTruck, setSelectedTruck] = useState(FLEET_IOT[0]);
  const [viewMode, setViewMode] = useState<'live' | 'history'>('live');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 BACKGROUND NEURAL MESH */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
      </div>

      {/* 🛰️ HEADER HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Radio className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              IoT Fleet Command Center
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            Edge Computing v4.2 • Cold-Chain Monitoring • Predictive Maintenance AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-900/40 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
            <NavTab
              active={viewMode === 'live'}
              onClick={() => setViewMode('live')}
              label="Live Stream"
              icon={Activity}
            />
            <NavTab
              active={viewMode === 'history'}
              onClick={() => setViewMode('history')}
              label="History Replay"
              icon={History}
            />
          </div>
          <button
            onClick={handleRefresh}
            className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <RefreshCw className={cn('w-4 h-4 text-slate-400', isRefreshing && 'animate-spin')} />
          </button>
          <button className="h-10 px-6 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
            Provision Device
          </button>
        </div>
      </header>

      {/* 🏢 MAIN INFRASTRUCTURE */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* 📋 LEFT: FLEET LIST */}
        <aside className="w-[380px] flex flex-col gap-6 shrink-0">
          <Card className="flex-1 bg-slate-950/60 border-white/5 backdrop-blur-3xl rounded-[40px] p-6 flex flex-col gap-6 shadow-2xl overflow-hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                type="text"
                placeholder="Search device or truck..."
                className="w-full h-11 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-[10px] font-bold text-white uppercase tracking-widest focus:border-blue-500/50 transition-all"
              />
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-3 pr-4">
                {FLEET_IOT.map((truck) => (
                  <div
                    key={truck.id}
                    onClick={() => setSelectedTruck(truck)}
                    className={cn(
                      'p-4 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden',
                      selectedTruck.id === truck.id
                        ? 'bg-blue-500/10 border-blue-500/20'
                        : 'bg-white/5 border-transparent hover:bg-white/10'
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            truck.status === 'moving'
                              ? 'bg-emerald-500 animate-pulse'
                              : truck.status === 'alert'
                                ? 'bg-red-500 animate-ping'
                                : 'bg-slate-500'
                          )}
                        />
                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                          {truck.id}
                        </span>
                      </div>
                      {truck.alerts > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white rounded text-[8px] font-black tracking-widest">
                          {truck.alerts} ALERTS
                        </span>
                      )}
                    </div>
                    <h4 className="text-[12px] font-black text-slate-300 uppercase tracking-tight truncate mb-4">
                      {truck.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Thermometer
                          className={cn(
                            'w-3 h-3',
                            truck.temp > 15 ? 'text-red-500' : 'text-blue-400'
                          )}
                        />
                        <span className="text-[10px] font-black text-white">{truck.temp}°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] font-black text-white">{truck.fuel}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </aside>

        {/* 🕹️ CENTER: TELEMETRY DASHBOARD */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* LIVE VIEW / HISTORY HUD */}
          <div className="flex-1 flex gap-6 overflow-hidden">
            {/* THE COMMAND UNIT */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
              <Card className="flex-1 bg-slate-950/60 border-white/5 backdrop-blur-3xl rounded-[40px] p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Truck className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                        {selectedTruck.id}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                          {selectedTruck.name}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-slate-700" />
                        <span className="text-[10px] font-mono text-emerald-500 font-black">
                          LAT: {selectedTruck.coords[0]} LNG: {selectedTruck.coords[1]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
                        Payload Integrity
                      </span>
                      <span
                        className={cn(
                          'text-lg font-black italic',
                          selectedTruck.alerts > 0 ? 'text-red-500' : 'text-emerald-500'
                        )}
                      >
                        {selectedTruck.alerts > 0 ? 'COMPROMISED' : 'OPTIMAL'}
                      </span>
                    </div>
                    <button className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                      <Maximize2 className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* TELEMETRY GRID */}
                <div className="grid grid-cols-4 gap-6">
                  <TelemetryGauge
                    label="Cargo Temperature"
                    value={selectedTruck.temp}
                    unit="°C"
                    min={2}
                    max={20}
                    target="4-8°C"
                    status={selectedTruck.temp > 15 ? 'critical' : 'optimal'}
                    icon={Thermometer}
                  />
                  <TelemetryGauge
                    label="Relative Humidity"
                    value={selectedTruck.humidity}
                    unit="%"
                    min={0}
                    max={100}
                    target="< 65%"
                    status="optimal"
                    icon={Waves}
                  />
                  <TelemetryGauge
                    label="Fuel Reservoir"
                    value={selectedTruck.fuel}
                    unit="%"
                    min={0}
                    max={100}
                    target="Refill at 15%"
                    status={selectedTruck.fuel < 20 ? 'warning' : 'optimal'}
                    icon={Fuel}
                  />
                  <TelemetryGauge
                    label="Sensor Battery"
                    value={selectedTruck.battery}
                    unit="%"
                    min={0}
                    max={100}
                    target="Lasts 12h"
                    status={selectedTruck.battery < 20 ? 'critical' : 'optimal'}
                    icon={Zap}
                  />
                </div>

                {/* BOTTOM PANEL: MAP & GRAPHS */}
                <div className="flex-1 flex gap-6 min-h-0">
                  <div className="flex-1 rounded-[32px] overflow-hidden border border-white/5 relative bg-black/40">
                    <LogisticsMap />
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-xl border border-white/5 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">
                        Live GSM Link
                      </span>
                    </div>
                  </div>

                  <div className="w-[300px] flex flex-col gap-6">
                    <Card className="flex-1 bg-black/40 border-white/5 rounded-[32px] p-6 flex flex-col gap-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Thermal Gradient (4H)
                      </h4>
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={TEMP_HISTORY}>
                            <defs>
                              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#ffffff05"
                              vertical={false}
                            />
                            <XAxis dataKey="time" hide />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#020617',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '10px',
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="temp"
                              stroke="#3b82f6"
                              fillOpacity={1}
                              fill="url(#colorTemp)"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-6 bg-black/40 border-white/5 rounded-[32px] space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Binary Sensors
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <StatusBit
                          label="Cargo Doors"
                          active={selectedTruck.doors === 'locked'}
                          icon={selectedTruck.doors === 'locked' ? Lock : LockOpen}
                          color="blue"
                        />
                        <StatusBit
                          label="Engine State"
                          active={selectedTruck.engine === 'on'}
                          icon={Activity}
                          color="emerald"
                        />
                        <StatusBit label="Audio Detect" active={true} icon={Mic} color="blue" />
                        <StatusBit
                          label="Chocs/Vibes"
                          active={selectedTruck.vibrations !== 'none'}
                          icon={Vibrate}
                          color="amber"
                        />
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* FOOTER HUD: PREDICTIVE & ALERTING */}
          <footer className="h-[220px] flex gap-6 shrink-0 relative z-10">
            <Card className="w-[450px] bg-slate-950/60 border-white/5 backdrop-blur-3xl rounded-[40px] p-6 flex flex-col gap-6 shadow-2xl overflow-hidden relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    Maintenance Prédictive
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-black">
                  AI Model: vibration-v2
                </span>
              </div>

              <div className="flex-1 flex gap-6 items-center">
                <div className="w-40 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={VIBRATION_SPECTRUM}>
                      <Bar dataKey="amp" radius={[4, 4, 0, 0]}>
                        {VIBRATION_SPECTRUM.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.amp > 70 ? '#ef4444' : '#10b981'}
                            fillOpacity={0.6}
                            stroke={entry.amp > 70 ? '#ef4444' : '#10b981'}
                            strokeWidth={1}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="p-3 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-black text-slate-600 uppercase">
                        Prochaine Vidange
                      </p>
                      <p className="text-sm font-black text-white italic">DANS 1,240 KM</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-black text-red-500 uppercase">
                        Suspension Arrière
                      </p>
                      <p className="text-sm font-black text-white italic">USURE ANORMALE (AI)</p>
                    </div>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="flex-1 bg-slate-950/60 border-white/5 backdrop-blur-3xl rounded-[40px] p-6 flex flex-col gap-6 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    IoT Event Timeline
                  </h3>
                </div>
                <button className="text-[9px] font-black text-blue-500 uppercase hover:underline">
                  View All Logs
                </button>
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-4 pr-4">
                  <TimelineEvent
                    icon={LockOpen}
                    time="10:45 AM"
                    label="Cargo Door Opened"
                    desc="Unloading at Warehouse San-Pedro"
                    type="info"
                  />
                  <TimelineEvent
                    icon={AlertCircle}
                    time="10:12 AM"
                    label="Temp Boundary Violation"
                    desc="Probe detected 18.2°C in Zone C"
                    type="critical"
                  />
                  <TimelineEvent
                    icon={Wifi}
                    time="09:30 AM"
                    label="GSM Handover"
                    desc="Switched to Cell Tower #84 - Orange CI"
                    type="info"
                  />
                  <TimelineEvent
                    icon={Zap}
                    time="08:15 AM"
                    label="Fuel Cap Drop Detect"
                    desc="Possible minor leak or steep climb"
                    type="warning"
                  />
                </div>
              </ScrollArea>
            </Card>
          </footer>
        </div>
      </div>

      {/* 🌊 STATUS RIPPLE (FOOTER) */}
      <div className="h-6 shrink-0 flex items-center justify-between px-6 bg-slate-900/40 rounded-full border border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
              PostGIS Geofencing: Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
              MQTT Broker: mosquitto-01.agrodeep.io
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-slate-600" />
          <span className="text-[8px] font-mono text-slate-600 uppercase">
            SYS_TIME: 2026-02-01 11:10:45Z
          </span>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavTab({ active, onClick, label, icon: Icon }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-6 py-2.5 rounded-xl flex items-center gap-3 transition-all relative overflow-hidden',
        active ? 'text-blue-500' : 'text-slate-500 hover:text-white'
      )}
    >
      {active && <motion.div layoutId="iot-nav-bg" className="absolute inset-0 bg-white/5" />}
      <Icon className="w-4 h-4" />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function TelemetryGauge({ label, value, unit, min, max, target, status, icon: Icon }: any) {
  const isCritical = status === 'critical';
  const isWarning = status === 'warning';

  return (
    <div className="flex flex-col gap-3 group">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
          {label}
        </span>
        <Icon
          className={cn(
            'w-3 h-3 opacity-30',
            isCritical ? 'text-red-500 opacity-100 animate-pulse' : 'text-slate-500'
          )}
        />
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            'text-3xl font-black italic tracking-tighter uppercase leading-none',
            isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-white'
          )}
        >
          {value}
        </span>
        <span className="text-xs font-black text-slate-500">{unit}</span>
      </div>
      <div className="space-y-1.5">
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((value - min) / (max - min)) * 100}%` }}
            className={cn(
              'h-full',
              isCritical
                ? 'bg-red-500 shadow-[0_0_10px_#ef4444]'
                : isWarning
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
            )}
          />
        </div>
        <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
          <span className="text-slate-600">Goal: {target}</span>
          <span className={cn(isCritical ? 'text-red-500' : 'text-slate-700')}>
            {isCritical ? 'CRITICAL' : 'OK'}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusBit({ label, active, icon: Icon, color }: any) {
  return (
    <div
      className={cn(
        'p-2.5 border rounded-2xl flex items-center gap-3 transition-all',
        active
          ? color === 'blue'
            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            : color === 'emerald'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          : 'bg-white/2 border-white/5 text-slate-600 opacity-50'
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[9px] font-black uppercase tracking-tight">{label}</span>
    </div>
  );
}

function TimelineEvent({ icon: Icon, time, label, desc, type }: any) {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            'w-8 h-8 rounded-full border flex items-center justify-center shrink-0',
            type === 'critical'
              ? 'bg-red-500/10 border-red-500/20 text-red-500'
              : type === 'warning'
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                : 'bg-white/5 border-white/10 text-slate-400'
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="w-px h-full bg-white/5" />
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h5
            className={cn(
              'text-[10px] font-black uppercase',
              type === 'critical' ? 'text-red-500' : 'text-slate-300'
            )}
          >
            {label}
          </h5>
          <span className="text-[9px] font-mono text-slate-600">{time}</span>
        </div>
        <p className="text-[10px] text-slate-500 font-bold uppercase leading-tight tracking-tight">
          {desc}
        </p>
      </div>
    </div>
  );
}

function Wifi(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13a10 10 0 0 1 14 0" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M2 8a15 15 0 0 1 20 0" />
      <line x1="12" x2="12.01" y1="20" y2="20" />
    </svg>
  );
}
