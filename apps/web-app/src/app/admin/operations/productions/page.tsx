'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  Droplets,
  Sun,
  Thermometer,
  Calendar as CalendarIcon,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Filter,
  Search,
  Clock,
  MoreVertical,
  Zap,
  Leaf,
  Wind,
  Tractor,
  BarChart3,
  LineChart as LineChartIcon,
  Activity,
  User,
  MapPin,
  ShieldCheck,
  BrainCircuit,
  Settings,
  X,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { activateValve, updateProductionStage } from '@/lib/api/productions';
import {
  useProductionStore,
  ActiveProduction,
  GrowthStage,
  QualityScore,
  ProductionAlert,
} from '@/store/productionStore';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Line as RechartsLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Calendar, luxonLocalizer } from 'react-big-calendar';
import { DateTime } from 'luxon';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = luxonLocalizer(DateTime);

const STAGES: { id: GrowthStage; label: string; color: string }[] = [
  { id: 'Semis', label: 'Semis', color: 'bg-blue-500' },
  { id: 'Croissance', label: 'Croissance', color: 'bg-emerald-500' },
  { id: 'Floraison', label: 'Floraison', color: 'bg-pink-500' },
  { id: 'Maturité', label: 'Maturité', color: 'bg-amber-500' },
  { id: 'Récolte', label: 'Récolte', color: 'bg-purple-500' },
];

const CROP_OPTIONS = ['all', 'Maïs', 'Café', 'Cacao'] as const;
const REGION_OPTIONS = ['all', 'Yamoussoukro', 'Bouaké', 'Abengourou'] as const;
const CALENDAR_OPTIONS = [
  { id: 'all', label: 'Toutes' },
  { id: 'week', label: 'Cette semaine' },
  { id: 'month', label: 'Ce mois' },
] as const;

export default function ProductionsPage() {
  const { productions, selectedProduction, selectProduction, filter, setFilter, updateStage } =
    useProductionStore();
  const [irrigationLoading, setIrrigationLoading] = useState(false);
  const [stageUpdating, setStageUpdating] = useState(false);

  const handleStageChange = async (id: string, newStage: GrowthStage) => {
    setStageUpdating(true);
    try {
      await updateProductionStage(id, newStage);
      updateStage(id, newStage);
      if (newStage === 'Récolte') toast.success('Offre auto-publiée sur Marketplace');
      else toast.success('Statut mis à jour');
    } catch (e) {
      toast.error('Erreur mise à jour statut');
    } finally {
      setStageUpdating(false);
    }
  };
  const [activeTab, setActiveTab] = useState<'grid' | 'calendar'>('grid');

  const filteredProductions = useMemo(() => {
    let result = productions;
    if (filter.crop !== 'all') {
      result = result.filter((p) => p.cropType === filter.crop);
    }
    if (filter.region !== 'all') {
      result = result.filter((p) => p.region === filter.region);
    }
    if (filter.calendar !== 'all') {
      const now = new Date();
      result = result.filter((p) => {
        const harvestDate = new Date(p.expectedHarvestDate);
        if (filter.calendar === 'week') {
          const weekEnd = new Date(now);
          weekEnd.setDate(weekEnd.getDate() + 7);
          return harvestDate >= now && harvestDate <= weekEnd;
        }
        if (filter.calendar === 'month') {
          const monthEnd = new Date(now);
          monthEnd.setMonth(monthEnd.getMonth() + 1);
          return harvestDate >= now && harvestDate <= monthEnd;
        }
        return true;
      });
    }
    return result;
  }, [productions, filter]);

  const calendarEvents = useMemo(() => {
    return filteredProductions.map((p) => ({
      id: p.id,
      title: `${p.cropType} - ${p.farmerName}`,
      start: new Date(p.startDate),
      end: new Date(p.expectedHarvestDate),
      resource: p,
    }));
  }, [filteredProductions]);

  const logisticsAlert = useMemo(() => {
    const matures = filteredProductions.filter(
      (p) => p.stage === 'Maturité' || p.stage === 'Récolte'
    );
    const totalTons = matures.reduce((sum, p) => sum + (p.estimatedTonnage ?? 0), 0);
    if (totalTons > 0) {
      const regions = [...new Set(matures.map((p) => p.region))];
      return `${totalTons} tonnes prêtes dans ${regions.join(', ')} - prévoir camions`;
    }
    return null;
  }, [filteredProductions]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      {/* 🚀 OPERATIONS HUD */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sprout className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Operations: Active Productions
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            Real-time Biosphere Monitoring • AI Optimized Harvests
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filter.crop}
              onChange={(e) => setFilter({ crop: e.target.value })}
              className="h-9 px-3 bg-slate-900/50 border border-white/5 rounded-lg text-[10px] font-black uppercase text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {CROP_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'Toutes cultures' : c}
                </option>
              ))}
            </select>
            <select
              value={filter.region}
              onChange={(e) => setFilter({ region: e.target.value })}
              className="h-9 px-3 bg-slate-900/50 border border-white/5 rounded-lg text-[10px] font-black uppercase text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {REGION_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r === 'all' ? 'Toutes régions' : r}
                </option>
              ))}
            </select>
            <select
              value={filter.calendar}
              onChange={(e) => setFilter({ calendar: e.target.value as typeof filter.calendar })}
              className="h-9 px-3 bg-slate-900/50 border border-white/5 rounded-lg text-[10px] font-black uppercase text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {CALENDAR_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('grid')}
              className={cn(
                'px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                activeTab === 'grid'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-500 hover:text-white'
              )}
            >
              Status Matrix
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={cn(
                'px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                activeTab === 'calendar'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-500 hover:text-white'
              )}
            >
              Harvest Calendar
            </button>
          </div>

          <button className="h-10 px-4 bg-white/5 border border-white/10 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            <Plus className="w-4 h-4" />
            Plan Campaign
          </button>
        </div>
      </header>

      {logisticsAlert && (
        <div className="shrink-0 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
          <Tractor className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-[11px] font-black text-amber-400 uppercase tracking-tight">
            Optimisation logistique anticipée : {logisticsAlert}
          </p>
        </div>
      )}

      {/* 📊 MAIN CONTENT */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* LEFT STAGE: PRODUCTION PIPELINE */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {activeTab === 'grid' ? (
            <div className="flex gap-6 h-full overflow-x-auto no-scrollbar pb-4">
              {STAGES.map((stage) => {
                const stageProds = filteredProductions.filter((p) => p.stage === stage.id);
                return (
                  <div key={stage.id} className="w-80 shrink-0 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-full', stage.color)} />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                          {stage.label}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono font-black text-slate-600">
                        {stageProds.length} PLOTS
                      </span>
                    </div>
                    <ScrollArea className="flex-1 bg-slate-900/10 rounded-[32px] border border-white/5 p-3">
                      <div className="space-y-3">
                        {stageProds.map((prod) => (
                          <ProductionCard
                            key={prod.id}
                            production={prod}
                            onClick={() => selectProduction(prod)}
                            isSelected={selectedProduction?.id === prod.id}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="flex-1 bg-[#05070a] border-white/5 rounded-[40px] overflow-hidden p-8">
              <style>{`
                        .rbc-calendar { background: transparent; color: #94a3b8; font-family: inherit; }
                        .rbc-header { border-bottom: 1px solid rgba(255,255,255,0.05) !important; padding: 15px !important; text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.2em; color: #64748b; }
                        .rbc-month-view { border: 1px solid rgba(255,255,255,0.05) !important; border-radius: 24px; overflow: hidden; }
                        .rbc-day-bg { border-left: 1px solid rgba(255,255,255,0.05) !important; }
                        .rbc-month-row { border-top: 1px solid rgba(255,255,255,0.05) !important; }
                        .rbc-event { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2) !important; border-radius: 8px !important; color: #10b981 !important; font-size: 10px; font-weight: 800; padding: 4px 8px !important; }
                        .rbc-today { background: rgba(255,255,255,0.02) !important; }
                        .rbc-off-range-bg { background: transparent !important; opacity: 0.3; }
                    `}</style>
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={(e: any) => selectProduction(e.resource)}
                views={['month', 'week']}
              />
            </Card>
          )}
        </div>

        {/* RIGHT STAGE: DEEP INSPECTION */}
        <aside className="w-[480px] flex flex-col gap-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedProduction ? (
              <motion.div
                key={selectedProduction.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex-1 flex flex-col gap-6 overflow-hidden"
              >
                <Card className="flex-1 p-8 bg-slate-950/40 backdrop-blur-2xl border-white/5 rounded-[40px] flex flex-col gap-8 shadow-2xl overflow-y-auto no-scrollbar">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">
                          Live Telemetry
                        </span>
                        <p className="text-[9px] font-mono text-slate-500 uppercase font-black italic">
                          Source: IoT Sensor HW-99
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => selectProduction(null)}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
                          {selectedProduction.parcelName}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                          <User className="w-3 h-3 text-slate-600" />
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                            {selectedProduction.farmerName}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <select
                          value={selectedProduction.stage}
                          onChange={(e) => handleStageChange(selectedProduction.id, e.target.value as GrowthStage)}
                          disabled={stageUpdating}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase">
                          Grade {selectedProduction.qualityPrediction}
                        </div>
                        <div className="flex gap-1">
                          {selectedProduction.certifications.map((c) => (
                            <span
                              key={c}
                              className="text-[8px] px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-black uppercase tracking-tighter"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <MetricBox
                        label="Moisture"
                        value={`${selectedProduction.moistureLevel}%`}
                        icon={Droplets}
                        color="text-blue-500"
                      />
                      <MetricBox
                        label="Health"
                        value={`${selectedProduction.healthScore}/100`}
                        icon={HeartPulse}
                        color="text-emerald-500"
                      />
                      <MetricBox
                        label="Temp"
                        value="31.2°C"
                        icon={Thermometer}
                        color="text-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                      IoT Pulse (7j - Temp, Humidité, Luminosité)
                    </h3>
                    <div className="h-48 w-full bg-black/40 rounded-[32px] p-4 border border-white/5">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedProduction.telemetry}>
                          <defs>
                            <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#ffffff05"
                            vertical={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#020617',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px',
                            }}
                            formatter={(value: number, name: string) => [
                              name === 'temp' ? `${value.toFixed(1)}°C` : name === 'humidity' ? `${value.toFixed(0)}%` : `${value.toFixed(0)} lux`,
                              name === 'temp' ? 'Temp sol' : name === 'humidity' ? 'Humidité' : 'Luminosité',
                            ]}
                            labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                          />
                          <XAxis
                            dataKey="timestamp"
                            tickFormatter={(v) => new Date(v).toLocaleDateString('fr-FR', { day: '2-digit' })}
                            stroke="#64748b"
                            tick={{ fontSize: 9 }}
                          />
                          <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 9 }} />
                          <Area yAxisId="left" type="monotone" dataKey="humidity" stroke="#3b82f6" fill="url(#colorHumidity)" strokeWidth={2} name="humidity" />
                          <RechartsLine yAxisId="left" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={false} name="temp" />
                          <RechartsLine yAxisId="left" type="monotone" dataKey="light" stroke="#eab308" strokeWidth={2} dot={false} strokeDasharray="5 5" name="light" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {selectedProduction.timelinePhotos && selectedProduction.timelinePhotos.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                        Timeline Croissance (Drone / Satellite)
                      </h3>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {selectedProduction.timelinePhotos.map((photo, idx) => (
                          <div
                            key={idx}
                            className="shrink-0 w-24 h-24 rounded-2xl bg-slate-800/50 border border-white/5 flex flex-col items-center justify-center gap-1"
                          >
                            <div className="w-16 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center">
                              <LineChartIcon className="w-6 h-6 text-slate-600" />
                            </div>
                            <span className="text-[8px] font-black text-slate-500 uppercase">
                              {new Date(photo.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                            </span>
                            <span className="text-[7px] text-slate-600 uppercase font-bold">
                              {photo.source === 'drone' ? 'Drone' : 'Sentinel'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                      Suivi Qualité & Certifications
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <span className="text-[8px] text-slate-600 uppercase font-black block mb-1">Prédiction Qualité (météo fin cycle)</span>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg',
                            selectedProduction.qualityPrediction === 'A' && 'bg-emerald-500/20 text-emerald-500',
                            selectedProduction.qualityPrediction === 'B' && 'bg-amber-500/20 text-amber-500',
                            selectedProduction.qualityPrediction === 'C' && 'bg-red-500/20 text-red-500',
                          )}>
                            {selectedProduction.qualityPrediction}
                          </div>
                          <span className="text-[10px] text-slate-400">Grade {selectedProduction.qualityPrediction}</span>
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                        <span className="text-[8px] text-slate-600 uppercase font-black block">Checklist certifications</span>
                        {selectedProduction.certifications.map((c) => (
                          <div key={c} className="flex items-center gap-2">
                            {selectedProduction.certificationStatus?.[c] === 'validated' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border-2 border-amber-500 shrink-0" />
                            )}
                            <span className="text-[10px] font-bold text-white uppercase">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                      AI Agronomy Advisor
                    </h3>
                    <div className="space-y-3">
                      {selectedProduction.alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={cn(
                            'p-5 rounded-[24px] border flex items-center gap-4 transition-all',
                            alert.severity === 'high'
                              ? 'bg-red-500/5 border-red-500/20'
                              : 'bg-white/5 border-white/10'
                          )}
                        >
                          <div
                            className={cn(
                              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                              alert.severity === 'high'
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-white/10 text-slate-400'
                            )}
                          >
                            <BrainCircuit className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black text-white italic leading-tight mb-1">
                              {alert.message}
                            </p>
                            <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
                              {new Date(alert.timestamp).toLocaleTimeString()} • Recommended Action
                            </span>
                          </div>
                          <button className="h-8 px-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-all">
                            Send Push
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex flex-col gap-3">
                    <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-[32px] flex items-center gap-4">
                      <Zap className="w-6 h-6 text-indigo-500" />
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">
                          Marketplace Integration
                        </p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">
                          Auto-publish offer when stage reaches "Récolte"
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="h-14 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                        <Tractor className="w-4 h-4" />
                        Order Collection
                      </button>
                      <button
                        onClick={async () => {
                          if (!selectedProduction) return;
                          setIrrigationLoading(true);
                          try {
                            await activateValve(selectedProduction.id);
                            toast.success('Commande irrigation envoyée');
                          } catch (e) {
                            toast.error('Erreur activation vanne');
                          } finally {
                            setIrrigationLoading(false);
                          }
                        }}
                        disabled={irrigationLoading}
                        className="h-14 bg-slate-900 border border-white/5 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Droplets className="w-4 h-4" />
                        {irrigationLoading ? 'Envoi...' : 'Activate Valve'}
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-900/10 rounded-[40px] border border-dashed border-white/5 space-y-6"
              >
                <div className="w-24 h-24 rounded-[40px] bg-slate-900/50 border border-white/10 flex items-center justify-center overflow-hidden relative">
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <Sprout className="w-12 h-12 text-slate-800" />
                  </motion.div>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-[0.4em] text-slate-600 italic">
                    Operational Stream Idle
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-3 max-w-[240px] font-bold uppercase tracking-tight leading-relaxed">
                    Choose an active production cycle from the matrix or calendar to start deep-site
                    inspection.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full max-w-[280px]">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                      Total Active
                    </span>
                    <span className="text-lg font-black text-white italic">42 Plots</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                      Harvesting
                    </span>
                    <span className="text-lg font-black text-emerald-500 italic">12 Today</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}

function ProductionCard({
  production,
  onClick,
  isSelected,
}: {
  production: ActiveProduction;
  onClick: () => void;
  isSelected: boolean;
}) {
  const mainAlert = production.alerts[0];

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-3xl border text-left transition-all relative overflow-hidden group',
        isSelected
          ? 'bg-white/10 border-white/20 shadow-xl scale-[1.02]'
          : 'bg-transparent border-transparent hover:bg-white/5'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Leaf
            className={cn(
              'w-4 h-4',
              production.healthScore > 80 ? 'text-emerald-500' : 'text-amber-500'
            )}
          />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
            {production.cropType}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 border border-white/5">
          <Droplets className="w-2.5 h-2.5 text-blue-500" />
          <span className="text-[9px] font-mono text-slate-400 font-black">
            {production.moistureLevel}%
          </span>
        </div>
      </div>

      <h4
        className={cn(
          'text-[11px] font-black uppercase tracking-tight mb-1',
          isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'
        )}
      >
        {production.parcelName}
      </h4>
      <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mb-4">
        {production.farmerName}
      </p>

      {mainAlert && (
        <div
          className={cn(
            'p-2 rounded-xl mb-4 flex items-center gap-2',
            mainAlert.severity === 'high'
              ? 'bg-red-500/10 text-red-500'
              : 'bg-amber-500/10 text-amber-500'
          )}
        >
          <AlertTriangle className="w-3 h-3" />
          <span className="text-[8px] font-black uppercase italic truncate">
            {mainAlert.message}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-700 uppercase font-black">Harvest Goal</span>
          <span className="text-[10px] text-slate-400 font-black font-mono uppercase">
            {new Date(production.expectedHarvestDate).toLocaleDateString()}
          </span>
        </div>
        <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-slate-600 group-hover:text-emerald-500 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {isSelected && (
        <motion.div
          layoutId="selection-border"
          className="absolute inset-0 border-2 border-emerald-500/30 rounded-3xl pointer-events-none"
        />
      )}
    </button>
  );
}

function MetricBox({ label, value, icon: Icon, color }: any) {
  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-3xl flex flex-col gap-2 relative overflow-hidden group">
      <Icon
        className={cn(
          'w-4 h-4 absolute -right-1 -top-1 opacity-10 group-hover:opacity-30 transition-opacity',
          color
        )}
      />
      <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest">
        {label}
      </span>
      <span className={cn('text-lg font-black italic tracking-tighter leading-none', color)}>
        {value}
      </span>
    </div>
  );
}

function HeartPulse({ className }: any) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}
