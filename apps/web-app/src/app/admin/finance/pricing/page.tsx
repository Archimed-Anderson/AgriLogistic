'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Calculator,
  Map as MapIcon,
  Settings2,
  TrendingUp,
  AlertCircle,
  Plus,
  ChevronRight,
  Route,
  CloudRain,
  Clock,
  Truck,
  Percent,
  History,
  CheckCircle2,
  XCircle,
  BarChart3,
  ArrowRight,
  Filter,
  Layers,
  MousePointer2,
  Save,
} from 'lucide-react';

// --- MOCK DATA ---
const PRICING_RULES = [
  {
    id: 'PR-01',
    name: 'Surcharges Pistes',
    condition: 'Type route = PISTE',
    value: '+50%',
    active: true,
  },
  {
    id: 'PR-02',
    name: 'Saison des Pluies',
    condition: 'Mois ∈ [Juin, Sept]',
    value: '+30%',
    active: true,
  },
  { id: 'PR-03', name: 'Urgence Express', condition: 'Délai < 12h', value: '+25%', active: false },
  { id: 'PR-04', name: 'Volume Grossiste', condition: 'Poids > 20t', value: '-10%', active: true },
];

const GEO_ZONES = [
  { id: 'Z1', name: 'Zone Abidjan Base', coef: '1.0', color: '#3B82F6' },
  { id: 'Z2', name: 'Haut-Sassandra (Accès Difficile)', coef: '1.4', color: '#EF4444' },
  { id: 'Z3', name: 'Vallée du Bandama', coef: '1.2', color: '#F59E0B' },
];

const ACCEPTE_HISTORY = [
  { hour: '08:00', rate: 85, vol: 120 },
  { hour: '10:00', rate: 72, vol: 450 },
  { hour: '12:00', rate: 91, vol: 300 },
  { hour: '14:00', rate: 65, vol: 600 },
  { hour: '16:00', rate: 78, vol: 420 },
];

// --- COMPONENTS ---

const PricingRuleCard = ({ rule }: any) => (
  <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-4 hover:border-blue-500/30 transition-all group relative overflow-hidden">
    <div
      className={`absolute top-0 right-0 w-1 h-full ${rule.active ? 'bg-emerald-500' : 'bg-gray-700'}`}
    />
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-white font-bold text-sm">{rule.name}</h4>
      <span
        className={`text-[10px] px-2 py-0.5 rounded-full font-black ${rule.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-gray-500 border border-white/10'}`}
      >
        {rule.active ? 'ACTIF' : 'PAUSE'}
      </span>
    </div>
    <div className="bg-black/40 rounded-lg p-2 mb-3 border border-white/5">
      <code className="text-[11px] text-blue-400 font-mono italic">{rule.condition}</code>
    </div>
    <div className="flex justify-between items-center">
      <p className="text-xs text-gray-400">Impact Tarifaire</p>
      <p
        className={`text-sm font-black ${rule.value.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}
      >
        {rule.value}
      </p>
    </div>
  </div>
);

export default function DynamicPricingDashboard() {
  const [simParams, setSimParams] = useState({
    distance: 250,
    weight: 10,
    road: 'PISTE',
    isRainy: true,
    urgency: 'MEDIUM',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateEstimate = () => {
    let base = simParams.distance * 2.5 * simParams.weight;
    if (simParams.road === 'PISTE') base *= 1.5;
    if (simParams.isRainy) base *= 1.3;
    return base;
  };

  const estimated = calculateEstimate();

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 BACKGROUND NEBULA */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-600/20 blur-[130px] rounded-full" />
      </div>

      {/* ☄️ HEADER HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <Zap className="w-8 h-8 text-blue-400 fill-blue-400/20" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">
              Dynamic Pricing Engine <span className="text-blue-500">v2.4</span>
            </h1>
            <p className="text-gray-400 text-sm">
              IA-Powered Freight Algorithms & Platform Commissions Hub.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end border-r border-white/10 pr-6">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-1">
              Conversion Moyenne Today
            </p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <p className="text-2xl font-black text-white">
                74.2% <span className="text-xs text-emerald-400 ml-1">+5.1%</span>
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 italic group">
            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Publier Variantes (A/B)
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTROL CENTER */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* 📋 RULES & CONFIG (LEFT) */}
        <div className="w-[450px] flex flex-col gap-6 overflow-hidden">
          {/* RULES EDITOR HEADER */}
          <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-blue-400" />
                Éditeur Régles Métier
              </h3>
              <button className="p-1.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 text-gray-400">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {PRICING_RULES.map((rule) => (
                <PricingRuleCard key={rule.id} rule={rule} />
              ))}
            </div>
          </div>

          {/* GEOGRAPHIC ZONES MAP SIMULATOR */}
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex flex-col">
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-emerald-400" />
              Zones Géographiques Actives
            </h3>
            <div className="flex-1 relative bg-black/50 border border-white/5 rounded-2xl mb-4 overflow-hidden group">
              {/* MOCK MAP CANVAS */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none">
                <div className="grid grid-cols-12 gap-1 rotate-[15deg] scale-150">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="w-12 h-12 border border-white/10 rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="absolute top-10 left-10 w-32 h-32 border-2 border-blue-500/50 bg-blue-500/10 rounded-full blur-[1px] flex items-center justify-center">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">
                  Z1
                </span>
              </div>
              <div className="absolute bottom-20 right-10 w-40 h-24 border-2 border-rose-500/50 bg-rose-500/10 rotate-[-12deg] flex items-center justify-center">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-tighter">
                  Z2 (HORS-ROUTE)
                </span>
              </div>
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="bg-white/10 p-2 rounded-lg border border-white/20 hover:bg-white/20 text-white shadow-xl backdrop-blur-md">
                  <MousePointer2 className="w-4 h-4" />
                </button>
                <button className="bg-white/10 p-2 rounded-lg border border-white/20 hover:bg-white/20 text-white shadow-xl backdrop-blur-md">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {GEO_ZONES.map((z) => (
                <div
                  key={z.id}
                  className="flex flex-col p-2 bg-white/5 rounded-xl border border-white/5"
                >
                  <span className="text-[10px] text-gray-500 uppercase font-black">{z.name}</span>
                  <span className="text-xs text-white font-black">x{z.coef}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🧪 SIMULATOR & BUSINESS ANALYTICS (RIGHT) */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* SIMULATOR HUD */}
          <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] pointer-events-none" />
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              Simulateur de Tarification (Price Checker)
            </h3>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] text-gray-500 uppercase tracking-widest font-black">
                    Distance du Trajet (KM)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="1500"
                    value={simParams.distance}
                    onChange={(e) =>
                      setSimParams({ ...simParams, distance: parseInt(e.target.value) })
                    }
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-white font-mono text-sm">
                    <span>10km</span>
                    <span className="text-blue-400 font-black underline underline-offset-4">
                      {simParams.distance} km
                    </span>
                    <span>1500km</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-500 uppercase tracking-widest font-black">
                      Route
                    </label>
                    <div className="flex gap-2">
                      {['GOUDRON', 'PISTE'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setSimParams({ ...simParams, road: type })}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all border ${simParams.road === type ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-500 uppercase tracking-widest font-black">
                      Météo
                    </label>
                    <button
                      onClick={() => setSimParams({ ...simParams, isRainy: !simParams.isRainy })}
                      className={`w-full py-2 rounded-xl text-[10px] font-bold transition-all border flex items-center justify-center gap-2 ${simParams.isRainy ? 'bg-rose-600 border-rose-500 text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}
                    >
                      <CloudRain className="w-4 h-4" />
                      Saison Pluies
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 rounded-3xl p-6 border border-white/10 flex flex-col justify-center items-center relative gap-2">
                <div className="absolute top-4 right-4 text-[9px] text-white/20 uppercase tracking-widest font-black">
                  Est. Algorithm V2
                </div>
                <p className="text-[10px] text-gray-500 uppercase font-black">
                  Prix Transporteur Estimé
                </p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-5xl font-black text-white">
                    {mounted ? estimated.toLocaleString() : '---'}
                  </h2>
                  <span className="text-xl text-gray-500 font-bold uppercase">€</span>
                </div>
                <div className="mt-4 flex flex-col w-full gap-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500 italic">Plateforme Commission (8%)</span>
                    <span className="text-emerald-400 font-bold">
                      +{(estimated * 0.08).toFixed(2)}€
                    </span>
                  </div>
                  <div className="h-px bg-white/10 w-full my-1" />
                  <div className="flex justify-between text-sm font-black italic">
                    <span className="text-white uppercase tracking-tighter">
                      Total Client Final
                    </span>
                    <span className="text-blue-400">{(estimated * 1.08).toFixed(2)}€</span>
                  </div>
                </div>
                <button className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] text-blue-300 font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                  Voir Détail du Calcul Algorithmique
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* BUSINESS METRICS & GAIN MONITORING */}
          <div className="flex-1 flex gap-6 overflow-hidden">
            {/* CHART AREA */}
            <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Acceptation des Prix (Temps Réel)
                </h3>
                <div className="flex bg-white/5 p-1 rounded-xl gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-[10px] text-white rounded-lg font-bold">
                    24h
                  </button>
                  <button className="px-3 py-1 text-[10px] text-gray-500 rounded-lg hover:text-white transition-all font-bold">
                    7j
                  </button>
                </div>
              </div>

              <div className="flex-1 flex items-end gap-3 pb-2 px-2 relative">
                {/* MOCK GRID */}
                <div className="absolute inset-x-0 top-0 bottom-8 border-b border-white/5 flex flex-col justify-between">
                  <div className="border-t border-white/[0.02] w-full" />
                  <div className="border-t border-white/[0.02] w-full" />
                  <div className="border-t border-white/[0.02] w-full" />
                  <div className="border-t border-white/[0.02] w-full" />
                </div>
                {ACCEPTE_HISTORY.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-3 relative z-10 group"
                  >
                    <div
                      className="w-full bg-blue-500/10 border border-blue-500/20 rounded-t-xl relative overflow-hidden hover:bg-blue-500/20 transition-all cursor-pointer"
                      style={{ height: `${h.rate}%` }}
                    >
                      <div className="absolute bottom-0 w-full bg-blue-500 h-[60%]" />
                      <div className="absolute top-2 w-full text-center text-[10px] font-black text-white group-hover:block transition-all">
                        {h.rate}%
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono tracking-tighter">
                      {h.hour}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ANOMALIES & ALERTS */}
            <div className="w-[300px] flex flex-col gap-4">
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-5 relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-500/10 blur-[30px] rounded-full group-hover:scale-150 transition-all" />
                <h4 className="text-rose-400 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                  Refus Algorithme v2.4
                </h4>
                <p className="text-2xl font-black text-white mb-2 underline decoration-rose-500/50 decoration-2 underline-offset-4">
                  12% <span className="text-[10px] text-rose-400 font-normal">↑ +2.1%</span>
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed italic pr-4">
                  Hausse des refus sur l'axe Bouaké-Korhogo. Ajustement nécessaire sur coef "Piste".
                </p>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-5 flex flex-col flex-1">
                <h4 className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                  Top Performance Algo
                </h4>
                <div className="space-y-4 overflow-y-auto custom-scrollbar pr-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs italic">
                        A{i}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[11px] text-white font-bold">Variante AI_X{i}</span>
                          <span className="text-[10px] text-emerald-400 font-black">94%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[94%]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🖥️ SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-blue-500/70">
            <Route className="w-3 h-3" />
            PricingEngine Status: RE-CALCULATING... [CACHE_TTL: 54m]
          </span>
          <span className="flex items-center gap-1.5 text-emerald-500/70 italic">
            <BarChart3 className="w-3 h-3" />
            A/B Test: "Lower_Comm_Higher_Vol" - ACTIVE [Day 12/30]
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-blue-400 transition-colors cursor-pointer uppercase tracking-tighter">
            API V2.4-PRO-MAX
          </span>
          <span className="hover:text-amber-500 transition-colors cursor-pointer uppercase tracking-tighter flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            15 High-Risk Pricing Anomalies Detected
          </span>
          <span className="text-white/20 font-black tracking-widest italic">
            AGRODEEP CORE HYPERCOMPUTE
          </span>
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
        input[type='range'] {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          height: 5px;
        }
      `}</style>
    </div>
  );
}
