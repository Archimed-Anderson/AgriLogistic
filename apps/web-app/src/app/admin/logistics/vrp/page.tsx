'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Route,
  Settings2,
  Play,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Truck,
  Timer,
  Leaf,
  Fuel,
  Maximize2,
  ChevronRight,
  Plus,
  Save,
  Trash2,
  RefreshCw,
  Clock,
  MapPin,
  CheckCircle2,
  BarChart3,
  Waves,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import dynamic from 'next/dynamic';

// Dynamically import LogisticsMap to avoid SSR issues with Leaflet
const LogisticsMap = dynamic(() => import('@/components/maps/LogisticsMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center text-slate-500 font-black uppercase text-[10px] tracking-[0.5em]">
      Initializing Neural Map...
    </div>
  ),
});

// --- TYPES ---
interface OptimizationStrategy {
  id: string;
  name: string;
  icon: any;
  description: string;
}

interface VRPConstraint {
  id: string;
  label: string;
  value: any;
  type: 'toggle' | 'slider' | 'select';
}

// --- MOCK DATA ---
const STRATEGIES: OptimizationStrategy[] = [
  {
    id: 'time',
    name: 'Temps Minimum',
    icon: Timer,
    description: 'Priorité absolue à la rapidité de livraison.',
  },
  {
    id: 'cost',
    name: 'Coût Minimum',
    icon: Fuel,
    description: 'Réduction maximale de la consommation de carburant.',
  },
  {
    id: 'load',
    name: 'Équilibre Charge',
    icon: Zap,
    description: 'Répartition équitable entre tous les véhicules.',
  },
  {
    id: 'eco',
    name: 'Écologique',
    icon: Leaf,
    description: 'Minimisation des émissions de CO2 et routes vertes.',
  },
];

const CONSTRAINTS: VRPConstraint[] = [
  { id: 'time_windows', label: 'Fenêtres Horaires Strictes', value: true, type: 'toggle' },
  { id: 'capacity', label: 'Capacité Véhicules (MAX)', value: 25, type: 'slider' },
  { id: 'driver_breaks', label: 'Temps de Pause Obligatoire', value: true, type: 'toggle' },
  { id: 'off_road', label: 'Ajustement Pistes Agricoles', value: true, type: 'toggle' },
  { id: 'night_zones', label: 'Évitement Zones Nuit', value: true, type: 'toggle' },
];

export default function VRPPage() {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('cost');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'monitoring' | 'history'>('config');
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [activeConstraints, setActiveConstraints] = useState(CONSTRAINTS);

  const handleOptimize = () => {
    setIsOptimizing(true);
    // Simulate heavy computation
    setTimeout(() => {
      setOptimizationResult({
        gainTime: '2h 15m',
        gainDist: '42 km',
        gainFuel: '18L',
        gainCO2: '45kg',
        qualityScore: 98.4,
        suggestedVehicles: 4,
        routes: [
          { id: 'R1', color: '#10b981', nodes: 5 },
          { id: 'R2', color: '#3b82f6', nodes: 8 },
          { id: 'R3', color: '#f59e0b', nodes: 4 },
        ],
      });
      setIsOptimizing(false);
      setActiveTab('monitoring');
    }, 2500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🧬 BACKGROUND MAP INTERFACE */}
      <div className="absolute inset-0 z-0 opacity-40">
        <LogisticsMap />
        <div className="absolute inset-0 bg-linear-to-t from-[#020408] via-transparent to-[#020408]/20" />
      </div>

      {/* 🚀 HEADER HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Route className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Neural Route Optimization
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            Google OR-Tools VRP Engine • PostGIS Agricultural Mesh • Weather-Aware Routing
          </span>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
          <NavTab
            active={activeTab === 'config'}
            onClick={() => setActiveTab('config')}
            label="Configuration"
            icon={Settings2}
          />
          <NavTab
            active={activeTab === 'monitoring'}
            onClick={() => setActiveTab('monitoring')}
            label="Monitoring"
            icon={Zap}
          />
          <NavTab
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
            label="Impact & History"
            icon={BarChart3}
          />
        </div>
      </header>

      {/* 🏢 MAIN LAYOUT CONTAINER */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* 🛠️ LEFT SIDEBAR: ALGORITHM CONFIG */}
        <AnimatePresence mode="wait">
          {activeTab === 'config' && (
            <motion.aside
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="w-[400px] flex flex-col gap-6"
            >
              <Card className="flex-1 bg-slate-950/60 border-white/5 backdrop-blur-2xl rounded-[40px] p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                      <Zap className="w-3 h-3 text-orange-500" />
                      Solver Engine Strategy
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {STRATEGIES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStrategy(s.id)}
                        className={cn(
                          'p-4 rounded-2xl border text-left transition-all group relative overflow-hidden',
                          selectedStrategy === s.id
                            ? 'bg-orange-500/10 border-orange-500/20'
                            : 'bg-white/5 border-transparent hover:bg-white/10'
                        )}
                      >
                        <s.icon
                          className={cn(
                            'w-5 h-5 mb-2',
                            selectedStrategy === s.id ? 'text-orange-500' : 'text-slate-400'
                          )}
                        />
                        <span
                          className={cn(
                            'text-[10px] font-black uppercase block',
                            selectedStrategy === s.id ? 'text-white' : 'text-slate-500'
                          )}
                        >
                          {s.name}
                        </span>
                        {selectedStrategy === s.id && (
                          <motion.div
                            layoutId="strat-active"
                            className="absolute right-0 top-0 p-2"
                          >
                            <CheckCircle2 className="w-3 h-3 text-orange-500" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    Regional Constraints (Africa)
                  </h3>
                  <div className="space-y-4">
                    {activeConstraints.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-white uppercase tracking-tight">
                            {c.label}
                          </span>
                          {c.id === 'off_road' && (
                            <span className="text-[8px] font-bold text-amber-500 uppercase">
                              Season: Rainy (Muddy Tracks)
                            </span>
                          )}
                        </div>
                        {c.type === 'toggle' ? (
                          <button
                            className={cn(
                              'w-10 h-5 rounded-full relative transition-all',
                              c.value ? 'bg-orange-500' : 'bg-slate-800'
                            )}
                          >
                            <div
                              className={cn(
                                'absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all',
                                c.value ? 'right-0.5' : 'left-0.5'
                              )}
                            />
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-orange-400 font-black">
                            {c.value}T
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <button
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="w-full h-16 bg-white text-black rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-orange-600/10"
                  >
                    {isOptimizing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Computing Routes...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Launch Dispatch Optimization
                      </>
                    )}
                  </button>
                  <div className="bg-amber-400/5 border border-amber-400/10 p-4 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <p className="text-[9px] text-amber-200/60 font-medium leading-relaxed uppercase">
                      Attention: 12 routes affectées par des inondations saisonnières dans la zone
                      de Korhogo. Le solver adaptera les vitesses moyennes.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* 📊 CENTER/RIGHT: MONITORING & RESULTS */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'monitoring' && optimizationResult && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col gap-6 h-full"
              >
                {/* SIMULATION METRICS HUD */}
                <div className="grid grid-cols-4 gap-4">
                  <MetricCard
                    label="Distance Économisée"
                    value={optimizationResult.gainDist}
                    icon={Route}
                    color="emerald"
                    delta="-12%"
                  />
                  <MetricCard
                    label="Temps de Route Gagné"
                    value={optimizationResult.gainTime}
                    icon={Timer}
                    color="blue"
                    delta="-18%"
                  />
                  <MetricCard
                    label="Émissions CO2 Évitées"
                    value={optimizationResult.gainCO2}
                    icon={Leaf}
                    color="emerald"
                    delta="-25%"
                  />
                  <MetricCard
                    label="Algorithmic Confidence"
                    value={`${optimizationResult.qualityScore}%`}
                    icon={Zap}
                    color="orange"
                  />
                </div>

                <div className="flex-1 flex gap-6 overflow-hidden">
                  {/* ROUTES LIST & ACTION */}
                  <Card className="w-[380px] bg-slate-950/60 border-white/5 backdrop-blur-2xl rounded-[40px] p-6 flex flex-col gap-6 shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                        Proposed Assignments
                      </h3>
                      <span className="text-[10px] font-mono text-orange-500 font-bold">
                        3 CLUSTERS
                      </span>
                    </div>

                    <ScrollArea className="flex-1">
                      <div className="space-y-4 pr-4">
                        {optimizationResult.routes.map((r: any) => (
                          <div
                            key={r.id}
                            className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-orange-500/30 transition-all cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: r.color }}
                                />
                                <span className="text-[10px] font-black text-white uppercase italic">
                                  Route {r.id}
                                </span>
                              </div>
                              <div className="px-2 py-0.5 bg-black/40 rounded text-[8px] font-black text-slate-500">
                                {r.nodes} STOPS
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] text-slate-600 uppercase font-black">
                                  Driver
                                </span>
                                <span className="text-[10px] font-black text-slate-300">
                                  Suggested: Moussa S.
                                </span>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] text-slate-600 uppercase font-black">
                                  Timeline
                                </span>
                                <span className="text-[10px] font-black text-slate-300">
                                  06:00 - 14:30
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <button className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Approuver & Déployer
                      </button>
                      <button className="w-full h-12 bg-white/5 hover:bg-white/10 text-white/50 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                        Re-Simuler Variations
                      </button>
                    </div>
                  </Card>

                  {/* VISUAL MONITORING HUD */}
                  <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    <Card className="flex-1 bg-slate-950/60 border-white/5 backdrop-blur-2xl rounded-[40px] p-6 relative overflow-hidden flex flex-col">
                      <div className="absolute top-4 right-6 flex items-center gap-4 z-20">
                        <div className="flex items-center gap-2 bg-black/60 p-2 rounded-xl border border-white/5">
                          <div className="w-3 h-3 rounded-sm bg-red-500 opacity-50" />
                          <span className="text-[9px] font-black text-slate-500 uppercase">
                            Initial
                          </span>
                          <div className="w-3 h-3 rounded-sm bg-emerald-500 ml-2" />
                          <span className="text-[9px] font-black text-slate-500 uppercase">
                            Optimized
                          </span>
                        </div>
                        <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      <div className="flex-1 rounded-[32px] overflow-hidden border border-white/5 relative bg-black/40">
                        {/* The background map is already visible, here we could add an overlay or a more focused map */}
                        <div className="absolute inset-x-0 bottom-0 p-8 bg-linear-to-t from-black to-transparent z-10">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                              <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
                                Global Network Overlay
                              </h4>
                              <span className="text-[9px] font-mono text-emerald-500 font-black uppercase tracking-[0.2em]">
                                Real-time Comparison Mode Active
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="text-[8px] font-black text-slate-600 uppercase block">
                                  Total Impact Score
                                </span>
                                <span className="text-2xl font-black text-emerald-500 italic">
                                  +12.4% EFFICIENCY
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                          <Waves className="w-96 h-96 text-orange-500/20 animate-pulse" />
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'config' && !optimizationResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-24 h-24 rounded-[40px] bg-white/5 border border-dashed border-white/10 flex items-center justify-center">
                  <Route className="w-12 h-12 text-slate-700" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">
                    System Ready for Simulation
                  </h4>
                  <p className="text-slate-600 text-xs font-bold uppercase max-w-sm mx-auto leading-relaxed">
                    Configurez vos contraintes et choisissez une stratégie pour lancer l'algorithme
                    de dispatch intelligent.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 🌊 RIPPLE EFFECT MONITOR (BOTTOM BAR) */}
      <footer className="h-20 shrink-0 relative z-10 flex items-center px-8 bg-slate-950/60 backdrop-blur-3xl border border-white/5 rounded-[32px] gap-8">
        <div className="flex items-center gap-4 shrink-0 pr-8 border-r border-white/5">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <ActivityPulse />
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
              Network Status
            </span>
            <span className="text-[11px] font-black text-emerald-500 uppercase italic">
              All Systems Operational
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-6 overflow-hidden">
          <div className="flex items-center gap-3 shrink-0">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-[10px] font-mono text-slate-400">11:02:45 AM</span>
          </div>
          <div className="h-4 w-px bg-white/5" />
          <div className="flex-1 relative overflow-hidden whitespace-nowrap">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="flex items-center gap-12 text-[9px] font-black text-white/30 uppercase tracking-widest"
            >
              <span>• Météo Korhogo: Risque d'averses (impact v-max -20%)</span>
              <span>• Mission #MS-9041: Retard possible car bouchons Zone Industrielle</span>
              <span>• Chauffeur Moussa: Zone de repos détectée OK</span>
              <span>• Alerte: Prix carburant station San-Pedro +5%</span>
              <span>• Optimization Engine: Nouvelle solution disponible pour Tournée B</span>
            </motion.div>
          </div>
        </div>

        <button className="h-10 px-6 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 hover:text-white transition-all">
          SOS Operator
        </button>
      </footer>
    </div>
  );
}

function NavTab({ active, onClick, label, icon: Icon }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-6 py-2.5 rounded-xl flex items-center gap-2.5 transition-all relative overflow-hidden',
        active ? 'text-orange-500' : 'text-slate-500 hover:text-white'
      )}
    >
      {active && <motion.div layoutId="nav-bg" className="absolute inset-0 bg-white/5" />}
      <Icon className="w-4 h-4" />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function MetricCard({ label, value, icon: Icon, color, delta }: any) {
  const colorClasses = {
    emerald: 'text-emerald-500 bg-emerald-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    orange: 'text-orange-500 bg-orange-500/10',
  }[color as 'emerald' | 'blue' | 'orange'];

  return (
    <Card className="bg-slate-950/60 border-white/5 backdrop-blur-2xl p-6 rounded-[32px] flex flex-col gap-4 group hover:border-white/10 transition-all">
      <div className="flex items-center justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorClasses)}>
          <Icon className="w-5 h-5" />
        </div>
        {delta && <span className="text-[10px] font-black text-emerald-500">{delta}</span>}
      </div>
      <div>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">
          {label}
        </span>
        <span className="text-2xl font-black text-white italic tracking-tighter uppercase">
          {value}
        </span>
      </div>
    </Card>
  );
}

function ActivityPulse() {
  return (
    <div className="relative w-4 h-4">
      <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20" />
      <div className="absolute inset-1 bg-orange-500 rounded-full" />
    </div>
  );
}
