'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import {
  Zap,
  ShieldAlert,
  Activity,
  AlertTriangle,
  Truck,
  HeartPulse,
  MoveHorizontal,
  PhoneCall,
  ChevronRight,
  Download,
  MoreVertical,
  FileText,
  Target,
  Globe,
  Cpu,
  Scale,
  UserX,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarRoomStore, IncidentType } from '@/store/warRoomStore';
import { useWarRoomWebSocket, type WarRoomMetrics } from '@/hooks/useWarRoomWebSocket';

// Carte chargée dynamiquement (Leaflet + useMap requièrent window + MapContainer parent)
const WarRoomMapView = dynamic(
  () => import('@/components/admin/war-room/WarRoomMapView').then((m) => ({ default: m.WarRoomMapView })),
  { ssr: false }
);

import 'leaflet/dist/leaflet.css';

const FILTER_TYPES: (IncidentType | 'all')[] = [
  'all',
  'iot_failure',
  'fraud_detected',
  'delay_risk',
  'quality_alert',
];

const DEFAULT_METRICS: WarRoomMetrics = {
  activeTransactions: 1247,
  trucksEnRoute: 89,
  escrowPending: 342,
  systemHealth: 99.98,
};

export function WarRoomClient() {
  const { incidents, selectedIncident, selectIncident, filter, setFilter, resolveIncident, addOrUpdateIncident } =
    useWarRoomStore();

  const [tickerIndex, setTickerIndex] = useState(0);
  const [metrics, setMetrics] = useState<WarRoomMetrics>(DEFAULT_METRICS);
  const [heatmapEnabled, setHeatmapEnabled] = useState(true);

  useWarRoomWebSocket({
    enabled: typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_WAR_ROOM_WS_URL,
    onIncident: (evt) => {
      addOrUpdateIncident({
        id: evt.id,
        type: evt.type as IncidentType,
        title: evt.title,
        description: '',
        location: evt.location,
        region: evt.region,
        severity: evt.severity,
        timestamp: evt.timestamp,
        status: 'pending',
      });
    },
    onMetrics: setMetrics,
  });

  const filteredIncidents = useMemo(
    () => (filter === 'all' ? incidents : incidents.filter((i) => i.type === filter)),
    [incidents, filter]
  );

  const p0Incidents = useMemo(() => incidents.filter((i) => i.severity > 80), [incidents]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % Math.max(1, p0Incidents.length));
    }, 5000);
    return () => clearInterval(timer);
  }, [p0Incidents.length]);

  const activeCrisis = useMemo(() => {
    return p0Incidents.some((i) => {
      const age = (Date.now() - new Date(i.timestamp).getTime()) / 60000;
      return i.severity > 90 && age > 15;
    });
  }, [p0Incidents]);

  const handleExportOHADAPDF = useCallback(() => {
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("RAPPORT D'INCIDENT - OHADA COMPLIANCE", 20, 20);
      doc.setFontSize(10);
      doc.text(`AgriLogistic War Room - ${new Date().toLocaleString('fr-FR')}`, 20, 30);
      if (selectedIncident) {
        doc.text(`Incident: ${selectedIncident.id}`, 20, 45);
        doc.text(`Type: ${selectedIncident.type}`, 20, 52);
        doc.text(`Titre: ${selectedIncident.title}`, 20, 59);
        doc.text(`Score: ${selectedIncident.severity}/100`, 20, 66);
        doc.text(`Région: ${selectedIncident.region}`, 20, 73);
        doc.text(`Valeur marchandise: ${selectedIncident.metadata?.cargoValue || 'N/A'}`, 20, 80);
      }
      doc.text(`Incidents actifs: ${incidents.filter((i) => i.status !== 'resolved').length}`, 20, 95);
      doc.save(`war-room-incident-${selectedIncident?.id || 'audit'}-${Date.now()}.pdf`);
    });
  }, [selectedIncident, incidents]);

  return (
    <div
      className={cn(
        'min-h-screen bg-[#020408] text-slate-200 overflow-hidden font-sans selection:bg-emerald-500/30',
        activeCrisis &&
          'before:fixed before:inset-0 before:z-50 before:pointer-events-none before:ring-[20px] before:ring-inset before:ring-red-600/30 before:animate-pulse'
      )}
    >
      <header className="h-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl flex items-center px-6 gap-6 z-40 sticky top-0">
        <div className="flex items-center gap-4 border-r border-white/10 pr-6 mr-2">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all group"
          >
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform text-slate-400 group-hover:text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-400">
              Exit War Room
            </span>
          </Link>
          <div className="flex flex-col leading-none">
            <h1 className="text-sm font-black uppercase tracking-[0.4em] text-white italic">
              War Room Alpha
            </h1>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Incident Tactical Command v3.5
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-4 bg-black/40 rounded-full px-6 h-10 border border-white/5 overflow-hidden group">
          <div className="flex items-center gap-2 shrink-0">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                activeCrisis ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'
              )}
            />
            <span className={cn('text-[9px] font-black uppercase tracking-tighter', activeCrisis ? 'text-red-500' : 'text-emerald-500')}>
              {activeCrisis ? 'CRITICAL ALERT' : 'NETWORK SYNC'}
            </span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <AnimatePresence mode="wait">
            {p0Incidents.length > 0 && (
              <motion.div
                key={tickerIndex}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex items-center gap-6"
              >
                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wide truncate max-w-md">
                  <span className="text-red-500 font-black mr-2">P0:</span> {p0Incidents[tickerIndex]?.title}
                </p>
                <span className="text-[9px] font-mono text-slate-600 bg-white/5 px-2 py-0.5 rounded uppercase font-black">
                  Area: {p0Incidents[tickerIndex]?.region} | SEV: {p0Incidents[tickerIndex]?.severity}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden xl:flex items-center gap-8 ml-4 mr-6">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Global Health</span>
            <span className="text-sm font-black text-emerald-400 font-mono italic tracking-tighter">
              {metrics.systemHealth}%
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Active Ops</span>
            <span className="text-sm font-black text-blue-400 font-mono italic tracking-tighter">
              {metrics.activeTransactions}
            </span>
          </div>
        </div>
      </header>

      <main className="flex h-[calc(100vh-64px)] p-4 gap-4 overflow-hidden">
        <aside className="w-[320px] xl:w-[380px] flex flex-col gap-4 bg-slate-900/10 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                <Activity className="w-3 h-3 text-red-500" />
                Incidents active
              </h3>
              <div className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
                <span className="text-[9px] font-black text-red-500 leading-none">{filteredIncidents.length} LIVE</span>
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
              {FILTER_TYPES.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border shrink-0',
                    filter === f ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'
                  )}
                >
                  {f === 'all' ? 'all' : f.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 custom-scrollbar">
            {filteredIncidents.map((incident) => (
              <motion.div
                layout
                key={incident.id}
                onClick={() => selectIncident(incident)}
                className={cn(
                  'group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden',
                  selectedIncident?.id === incident.id
                    ? 'bg-white/10 border-white/20 shadow-2xl scale-[1.02] z-10'
                    : 'bg-slate-900/40 border-white/5 hover:bg-slate-900/60 hover:border-white/10'
                )}
              >
                {incident.severity > 90 && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500 animate-pulse" />
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        incident.severity > 85 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-yellow-500'
                      )}
                    />
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-black">#{incident.id}</span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{incident.region}</span>
                </div>
                <h4
                  className={cn(
                    'text-xs font-black uppercase tracking-tight mb-3 transition-colors',
                    selectedIncident?.id === incident.id ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  )}
                >
                  {incident.title}
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-600 uppercase font-black">Score</span>
                      <span className={cn('text-[10px] font-black font-mono', incident.severity > 80 ? 'text-red-500' : 'text-yellow-500')}>
                        {incident.severity}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-600 uppercase font-black">Time</span>
                      <span className="text-[10px] font-black text-slate-400 font-mono">4m ago</span>
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      'w-4 h-4 transition-transform',
                      selectedIncident?.id === incident.id ? 'translate-x-1 text-emerald-500' : 'text-slate-700 opacity-0 group-hover:opacity-100'
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 bg-slate-950/50 border-t border-white/5">
            <button
              onClick={handleExportOHADAPDF}
              className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition-all group"
            >
              <Download className="w-4 h-4 text-slate-500 group-hover:text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">
                Export Audit Trail (PDF)
              </span>
            </button>
          </div>
        </aside>

        <section className="flex-1 flex flex-col gap-4">
          <div className="flex-1 bg-[#05070a] border border-white/5 rounded-[40px] overflow-hidden relative group shadow-2xl">
            <div className="absolute top-6 left-6 z-40 space-y-2 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <Target className="w-3 h-3 text-red-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Live Targeting</span>
                </div>
                <span className="text-[8px] font-mono text-slate-500 uppercase">Sector: West-Africa Delta</span>
              </div>
            </div>
            <div className="absolute top-6 right-6 z-40 flex flex-col gap-2 items-end">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex flex-col gap-0.5 items-end text-right pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 italic">
                    Sentinel v5
                  </span>
                  <Globe className="w-3 h-3 text-emerald-500" />
                </div>
                <span className="text-[8px] font-mono text-slate-500 uppercase">Res: 0.15m/px Tactical</span>
              </div>
              <button
                onClick={() => setHeatmapEnabled((v) => !v)}
                className={cn(
                  'px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border pointer-events-auto',
                  heatmapEnabled ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-black/60 border-white/10 text-slate-500 hover:text-slate-300'
                )}
              >
                Heatmap {heatmapEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="absolute bottom-6 left-6 z-40 p-5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl max-w-sm pointer-events-none">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Optical Sensor</p>
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[92%] animate-pulse" />
                      </div>
                      <span className="text-[9px] font-mono text-white">92%</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Coordonnées</p>
                    <p className="text-[11px] font-mono text-emerald-400 font-bold italic tracking-tighter">
                      14.7176° N, 17.4613° W
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-end items-end gap-2 border-l border-white/5 pl-4">
                  <Cpu className="w-6 h-6 text-slate-700" />
                  <div className="text-right">
                    <p className="text-[8px] text-slate-500 font-black uppercase">Edge Compute</p>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter italic">
                      Optimized
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-full bg-[#080a0f] relative z-0">
              {typeof window !== 'undefined' ? (
                <WarRoomMapView
                  incidents={filteredIncidents}
                  heatmapEnabled={heatmapEnabled}
                  onSelectIncident={selectIncident}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-950">
                  <Activity className="w-12 h-12 text-slate-800 animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 h-24">
            <MetricCard icon={Zap} label="TX actives" value={metrics.activeTransactions.toLocaleString()} trend="Live" color="text-emerald-500" />
            <MetricCard icon={Truck} label="Camions en route" value={metrics.trucksEnRoute.toString()} trend="En cours" color="text-blue-500" />
            <MetricCard icon={Wallet} label="Escrow en attente" value={metrics.escrowPending.toString()} trend="Pending" color="text-orange-500" />
            <MetricCard icon={HeartPulse} label="Santé système" value={`${metrics.systemHealth}%`} trend="OK" color="text-emerald-500" />
          </div>
        </section>

        <aside className="w-[420px] xl:w-[480px] flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {selectedIncident ? (
              <motion.div key="details" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }} className="flex flex-col h-full gap-4">
                <Card className="flex-1 p-8 bg-slate-950/40 backdrop-blur-2xl border border-red-500/20 rounded-[40px] overflow-hidden relative flex flex-col shadow-2xl overflow-y-auto no-scrollbar">
                  <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none rotate-12">
                    <ShieldAlert className="w-64 h-64 text-red-500" />
                  </div>
                  <div className="flex items-center justify-between mb-8 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mb-0.5">Anomaly detected</p>
                        <p className="text-[9px] font-mono text-slate-500 uppercase font-black">
                          Level {selectedIncident.severity > 80 ? 'CRITICAL' : 'HIGH'}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => selectIncident(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                      <ChevronRight className="w-5 h-5 rotate-180 text-slate-500" />
                    </button>
                  </div>
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-6 leading-[0.9] text-white">
                    {selectedIncident.title}
                  </h2>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 mb-8">
                    <p className="text-sm text-slate-400 font-medium leading-relaxed italic">"{selectedIncident.description}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-3xl bg-slate-900/40 border border-white/5">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Asset Value</p>
                      <p className="text-xl font-black font-mono text-white tracking-tighter italic">
                        {selectedIncident.metadata?.cargoValue || '$45,200'}
                      </p>
                    </div>
                    <div className="p-4 rounded-3xl bg-slate-900/40 border border-white/5">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Incident Score</p>
                      <p className="text-xl font-black font-mono text-red-500 tracking-tighter italic">{selectedIncident.severity}/100</p>
                    </div>
                  </div>
                  <div className="space-y-3 mt-auto pt-6 border-t border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 px-2">Actions 1-click</p>
                    <InterventionButton icon={UserX} label="Suspendre compte" sub="Bloquer l'accès du nœud" color="bg-red-600" />
                    <InterventionButton icon={MoveHorizontal} label="Réassigner transport" sub="Réorienter la flotte" color="bg-orange-600" />
                    <InterventionButton icon={PhoneCall} label="Contacter agriculteur" sub="Canal voix opérateur terrain" color="bg-slate-700" />
                    <InterventionButton icon={Scale} label="Escalader litige" sub="Remonter aux autorités" color="bg-amber-600" />
                    <div className="pt-4 flex gap-3">
                      <button
                        onClick={() => {
                          resolveIncident(selectedIncident.id);
                          selectIncident(null);
                        }}
                        className="flex-1 h-14 bg-emerald-500 text-black font-black uppercase text-[11px] tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
                      >
                        Resolve Incident
                      </button>
                      <button className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10">
                        <MoreVertical className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </Card>
                <button
                  onClick={handleExportOHADAPDF}
                  className="w-full bg-[#0a0c14] border border-white/5 p-5 rounded-[30px] flex items-center gap-4 group cursor-pointer hover:border-emerald-500/30 transition-all text-left"
                >
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-0.5 italic">OHADA REG-COMPLIANT</p>
                    <p className="text-xs font-bold text-slate-400 truncate tracking-tight">
                      Export PDF rapport d&apos;incident pour autorités
                    </p>
                  </div>
                  <Download className="w-4 h-4 text-slate-700 group-hover:text-white transition-colors shrink-0" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-900/10 rounded-[40px] border border-dashed border-white/5 space-y-6"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-slate-900/40 flex items-center justify-center">
                    <Activity className="w-10 h-10 text-slate-800" />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 rounded-full border border-white/5 animate-ping opacity-20" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-[0.4em] text-slate-600">Cognitive standby</h4>
                  <p className="text-[11px] text-slate-600 mt-3 max-w-[240px] font-bold uppercase tracking-tight leading-relaxed">
                    Select an anomaly for deep neural analysis and protocol execution.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </main>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: string; trend: string; color: string }) {
  return (
    <Card className="bg-slate-950/40 border-white/5 rounded-3xl p-4 flex flex-col justify-between hover:border-white/20 transition-all group overflow-hidden relative">
      <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Icon className="w-16 h-16 text-white" />
      </div>
      <div className="flex items-center gap-2">
        <div className={cn('h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center', color)}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-black italic tracking-tighter text-white font-mono">{value}</span>
        <span className={cn('text-[8px] font-black uppercase tracking-widest', color)}>{trend}</span>
      </div>
    </Card>
  );
}

function InterventionButton({ icon: Icon, label, sub, color }: { icon: any; label: string; sub: string; color: string }) {
  return (
    <button className="w-full flex items-center gap-4 p-4 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-900/60 transition-all group active:scale-[0.98]">
      <div className={cn('h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg', color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col items-start min-w-0">
        <span className="text-xs font-black uppercase text-white tracking-tight leading-none mb-1">{label}</span>
        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest truncate">{sub}</span>
      </div>
      <div className="ml-auto h-8 w-8 rounded-full border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
        <ChevronRight className="w-3 h-3 text-slate-500" />
      </div>
    </button>
  );
}
