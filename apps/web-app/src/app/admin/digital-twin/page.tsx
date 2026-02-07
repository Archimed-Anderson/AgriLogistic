'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box as DigitalTwin,
  Map as MapIcon,
  Layers,
  Activity,
  Wind,
  Droplets,
  Sprout,
  Calendar,
  BarChart3,
  ChevronRight,
  AlertTriangle,
  Search,
  Maximize2,
  Cpu,
  Database,
  Zap,
  Clock,
  Scan,
  CloudSun,
  Tractor,
  Download,
  Share2,
  BrainCircuit,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDigitalTwinStore } from '@/store/digitalTwinStore';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Dynamically import the Map component to avoid SSR issues with Leaflet
const GlobalSatelliteMap = dynamic(
  () => import('@/components/admin/digital-twin/GlobalSatelliteMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-900/20 animate-pulse flex flex-col items-center justify-center gap-4 rounded-[40px] border border-white/5">
        <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/40 italic">
          Syncing Geospatial Nodes...
        </span>
      </div>
    ),
  }
);

const CompareMapSlider = dynamic(
  () =>
    import('@/components/admin/digital-twin/CompareMapSlider').then((m) => ({
      default: m.CompareMapSlider,
    })),
  { ssr: false }
);

const GlobalSatelliteMapMapLibre = dynamic(
  () => import('@/components/admin/digital-twin/GlobalSatelliteMapMapLibre'),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-900/20 animate-pulse flex items-center justify-center" /> }
);

const useMapLibre = process.env.NEXT_PUBLIC_DIGITAL_TWIN_USE_MAPLIBRE === 'true';

export default function DigitalTwinPage() {
  const {
    activeLayers,
    toggleLayer,
    selectedParcel,
    selectParcel,
    regionStats,
    timePeriod,
    setTimePeriod,
    compareMode,
    setCompareMode,
  } = useDigitalTwinStore();

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      {/* 📡 MISSION CONTROL TOP HUD */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <DigitalTwin className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Digital Twin: Global Biosphere
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            Sentinel-2 | IoT Fusion | AI Yield Prediction
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 items-center">
            <Clock className="w-4 h-4 text-slate-600 ml-3" />
            <div className="flex gap-1 ml-2">
              {['2023', '2024'].map((p) => (
                <button
                  key={p}
                  onClick={() => setTimePeriod(p as any)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                    timePeriod === p
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'text-slate-500 hover:text-white'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCompareMode(!compareMode)}
            className={cn(
              'h-10 px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all border',
              compareMode
                ? 'bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/5 border-white/10 text-slate-400'
            )}
          >
            <Scan className="w-4 h-4" />
            Comparison Mode
          </button>
        </div>
      </header>

      {/* 🌍 MAIN GEO-WORKSPACE */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* LEFT STAGE: ANALYTICS & LAYER SELECTOR */}
        <aside className="w-80 flex flex-col gap-6 shrink-0">
          {/* LAYER SELECTOR */}
          <Card className="p-6 bg-slate-950/40 border-white/5 rounded-[32px] overflow-hidden">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">
              Spectral Overlays
            </h3>
            <div className="space-y-2">
              {[
                {
                  id: 'ndvi',
                  label: 'NDVI Index',
                  icon: Sprout,
                  color: 'text-emerald-500',
                  desc: 'Vegetation Health',
                },
                {
                  id: 'yield',
                  label: 'Yield Heatmap',
                  icon: BarChart3,
                  color: 'text-amber-500',
                  desc: 'Production Prep',
                },
                {
                  id: 'diseases',
                  label: 'Disease Detection',
                  icon: AlertTriangle,
                  color: 'text-red-500',
                  desc: 'AI Computer Vision',
                },
                {
                  id: 'weather',
                  label: 'Live Precipitation',
                  icon: Droplets,
                  color: 'text-blue-500',
                  desc: 'Satellite Meterology',
                },
              ].map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id as any)}
                  className={cn(
                    'w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group',
                    activeLayers.includes(layer.id as any)
                      ? 'bg-white/5 border-white/10'
                      : 'bg-transparent border-transparent hover:bg-white/5'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'p-2 rounded-lg transition-all',
                        activeLayers.includes(layer.id as any) ? 'bg-white/10' : 'bg-slate-900/50'
                      )}
                    >
                      <layer.icon
                        className={cn(
                          'w-4 h-4',
                          activeLayers.includes(layer.id as any) ? layer.color : 'text-slate-700'
                        )}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          'text-[10px] font-black uppercase tracking-tight',
                          activeLayers.includes(layer.id as any) ? 'text-white' : 'text-slate-600'
                        )}
                      >
                        {layer.label}
                      </span>
                      <span className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">
                        {layer.desc}
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      activeLayers.includes(layer.id as any)
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : 'bg-slate-800'
                    )}
                  />
                </button>
              ))}
            </div>
          </Card>

          {/* MACRO STATS */}
          <Card className="flex-1 p-6 bg-slate-950/40 border-white/5 rounded-[32px] flex flex-col overflow-hidden">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">
              Regional Forecast
            </h3>
            <ScrollArea className="flex-1 -mx-2 px-2">
              <div className="space-y-4">
                {regionStats.map((stat) => (
                  <div
                    key={stat.id}
                    className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-[11px] font-black uppercase tracking-tighter text-white italic">
                        {stat.name}
                      </h4>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest',
                          stat.riskLevel === 'low'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                        )}
                      >
                        {stat.riskLevel} risk
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-600 uppercase font-black">
                          Avg Yield
                        </span>
                        <span className="text-sm font-black text-white italic">
                          {stat.averageYield} T/ha
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-600 uppercase font-black">
                          Surface
                        </span>
                        <span className="text-sm font-black text-white italic truncate">
                          {stat.totalArea.split(' ')[0]}K+
                        </span>
                      </div>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.averageYield / 1.5) * 100}%` }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </aside>

        {/* CENTER STAGE: THE GLOBAL CANVAS */}
        <main className="flex-1 relative bg-[#05070a] rounded-[48px] border border-white/5 overflow-hidden shadow-2xl group">
          {compareMode ? (
            <div className="absolute inset-0">
              <CompareMapSlider
                leftLabel="2023"
                rightLabel="2024"
                leftChildren={
                  useMapLibre ? <GlobalSatelliteMapMapLibre /> : <GlobalSatelliteMap />
                }
                rightChildren={
                  useMapLibre ? <GlobalSatelliteMapMapLibre /> : <GlobalSatelliteMap />
                }
              />
            </div>
          ) : useMapLibre ? (
            <GlobalSatelliteMapMapLibre />
          ) : (
            <GlobalSatelliteMap />
          )}

          {/* FLOATING HUD OVERLAYS */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-3 pointer-events-none">
            <div className="px-4 py-2 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-xl flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">
                  Global Coordinates
                </span>
                <span className="text-xs font-black font-mono text-emerald-500 tracking-tighter italic">
                  6.8214° N, 5.2762° W
                </span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">
                  Resolution
                </span>
                <span className="text-xs font-black font-mono text-white tracking-tighter italic">
                  10M / PX
                </span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 inset-x-10 z-10 flex justify-center pointer-events-none">
            <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-[32px] flex items-center gap-12 pointer-events-auto">
              <LegendItem label="Healthy" color="bg-emerald-500" />
              <LegendItem label="Moderately Stressed" color="bg-amber-500" />
              <LegendItem label="Critical Stress" color="bg-red-500" />
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-4">
                <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-white">
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-white">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* TOP RIGHT TOOLS */}
          <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
            <button className="w-12 h-12 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl">
              <Zap className="w-5 h-5" />
            </button>
            <div className="flex flex-col bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 gap-1 shadow-xl">
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-white/5 transition-all text-[10px] font-black">
                +
              </button>
              <div className="w-6 h-px bg-white/5 mx-auto" />
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-white/5 transition-all text-[10px] font-black">
                -
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT STAGE: PARCEL INSPECTOR */}
        <aside className="w-[420px] flex flex-col gap-6 shrink-0">
          <AnimatePresence mode="wait">
            {selectedParcel ? (
              <motion.div
                key={selectedParcel.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex-1 flex flex-col gap-6 overflow-hidden"
              >
                <Card className="flex-1 p-8 bg-slate-950/40 backdrop-blur-2xl border-white/5 rounded-[40px] flex flex-col gap-8 shadow-2xl overflow-y-auto no-scrollbar">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Sprout className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">
                          Active Parcel
                        </span>
                        <p className="text-[9px] font-mono text-slate-500 uppercase font-black italic">
                          Sentinel-2 ID: {selectedParcel.id}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => selectParcel(null)}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-600"
                    >
                      <ChevronRight className="w-6 h-6 rotate-180" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                        {selectedParcel.owner}
                      </h2>
                      <span className="text-[10px] px-3 py-1 bg-white/5 rounded-full text-slate-500 font-black uppercase">
                        {selectedParcel.cropType}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-white/5 border border-white/5 rounded-3xl">
                        <span className="text-[8px] text-slate-600 uppercase font-black">
                          Total Surface
                        </span>
                        <p className="text-lg font-black text-white italic leading-none mt-1">
                          {selectedParcel.area}
                        </p>
                      </div>
                      <div
                        className={cn(
                          'p-5 border rounded-3xl',
                          selectedParcel.status === 'healthy'
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-amber-500/5 border-amber-500/20'
                        )}
                      >
                        <span className="text-[8px] text-slate-600 uppercase font-black">
                          NDVI Level
                        </span>
                        <p
                          className={cn(
                            'text-lg font-black italic leading-none mt-1',
                            selectedParcel.status === 'healthy'
                              ? 'text-emerald-500'
                              : 'text-amber-500'
                          )}
                        >
                          {selectedParcel.ndvi}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                      Spectral Health Analysis
                    </h3>
                    <div className="p-6 bg-black/40 border border-white/5 rounded-[32px] space-y-6">
                      <HealthMetric
                        label="Photosynthetic Activity"
                        value={selectedParcel.healthScore}
                        color="bg-emerald-500"
                      />
                      <HealthMetric
                        label="Soil Moisture Index (IoT)"
                        value={65}
                        color="bg-blue-500"
                      />
                      <HealthMetric label="Expected Ripening" value={82} color="bg-purple-500" />
                    </div>
                  </div>

                  <div className="space-y-4 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-[32px]">
                    <div className="flex items-center gap-3 mb-2">
                      <BrainCircuit className="w-5 h-5 text-indigo-500" />
                      <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">
                        AI Prediction Node
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic">
                      Predicted yield for campaign 2024 is{' '}
                      <span className="text-white font-black">
                        {selectedParcel.predictedYield} Tons/ha
                      </span>
                      . Harvest window optimized for{' '}
                      <span className="text-white font-black">October 12 - 18</span>.
                    </p>
                  </div>

                  <div className="mt-auto pt-6 flex flex-col gap-3">
                    <button className="w-full h-14 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Parcel Deed
                    </button>
                    <button className="h-12 bg-slate-900 border border-white/5 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:text-white transition-all flex items-center justify-center gap-2">
                      <Tractor className="w-4 h-4" />
                      Order IoT Sensing Probe
                    </button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-900/10 rounded-[40px] border border-dashed border-white/5 space-y-6"
              >
                <div className="w-24 h-24 rounded-[32px] bg-slate-900/50 border border-white/10 flex items-center justify-center">
                  <Activity className="w-12 h-12 text-slate-800" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-[0.4em] text-slate-600 italic">
                    Spatial Intelligence Idle
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-3 max-w-[240px] font-bold uppercase tracking-tight leading-relaxed">
                    Select a parcel polygon on the biosphere map to perform spectral deep-dive.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}

function LegendItem({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn('w-3 h-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.1)]', color)} />
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </span>
    </div>
  );
}

function HealthMetric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-500">{label}</span>
        <span className="text-white italic">{value}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={cn('h-full rounded-full', color)}
        />
      </div>
    </div>
  );
}
