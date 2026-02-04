'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  Zap,
  MapPin,
  AlertTriangle,
  PhoneCall,
  MessageSquare,
  Navigation,
  Thermometer,
  Filter,
  Search,
  MoreVertical,
  X,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Radio,
  BarChart3,
  TrendingUp,
  Map as MapIcon,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

// --- MOCK DATA ---

const MOCK_TRUCKS = [
  {
    id: 'T-001',
    driver: 'Moussa Sylla',
    type: 'Réfrigéré',
    status: 'LOADED',
    pos: [5.36, -4.008],
    temp: 4.2,
    cargo: 'Mangues (12T)',
    destination: 'Abidjan Port',
    eta: '14:30',
    speed: 65,
  },
  {
    id: 'T-002',
    driver: 'Ismael Diakité',
    type: 'Standard',
    status: 'EMPTY',
    pos: [5.31, -3.98],
    cargo: 'Vide',
    destination: 'Bouaké Pickup',
    eta: '16:45',
    speed: 82,
  },
  {
    id: 'T-003',
    driver: 'Jean Koné',
    type: 'Réfrigéré',
    status: 'STOPPED',
    pos: [5.45, -4.12],
    temp: 18.5,
    cargo: 'Ananas (8T)',
    destination: 'Yamoussoukro',
    eta: 'DELAYED',
    speed: 0,
  },
  {
    id: 'T-004',
    driver: 'Amadou Touré',
    type: 'Bétail',
    status: 'LOADED',
    pos: [6.82, -5.27],
    cargo: 'Bétail (25 têtes)',
    destination: 'Abidjan',
    eta: '21:00',
    speed: 55,
  },
  {
    id: 'T-005',
    driver: 'Koffi Kouamé',
    type: 'Standard',
    status: 'OFFLINE',
    pos: [5.33, -4.01],
    cargo: 'Hévéa',
    destination: 'San Pedro',
    eta: 'UNKNOWN',
    speed: 0,
  },
];

const MOCK_MISSIONS = [
  {
    id: 'MS-8910',
    driver: 'Moussa Sylla',
    product: 'Mangues',
    qty: '12,000 kg',
    from: 'Korbogho',
    to: 'Abidjan Port',
    status: 'IN_TRANSIT',
    priority: 'HIGH',
  },
  {
    id: 'MS-8911',
    driver: 'Ismael Diakité',
    product: 'Engrais',
    qty: '5,000 kg',
    from: 'Abidjan',
    to: 'Bouaké',
    status: 'PICKUP_READY',
    priority: 'MEDIUM',
  },
  {
    id: 'MS-8912',
    driver: 'Jean Koné',
    product: 'Ananas',
    qty: '8,500 kg',
    from: 'Agboville',
    to: 'Yamoussoukro',
    status: 'STOPPED_ANOMALY',
    priority: 'CRITICAL',
  },
];

const STATS = [
  { label: 'Taux Remplissage', value: '92.4%', delta: '+4.2%', icon: BarChart3, color: 'emerald' },
  { label: 'KM à Vide Évités', value: '1,240', delta: '+12%', icon: TrendingUp, color: 'blue' },
  { label: 'Efficacité Flotte', value: '88%', delta: '-2%', icon: Cpu, color: 'amber' },
  { label: 'Active Missions', value: '24', icon: Truck, color: 'indigo' },
];

// --- COMPONENTS ---

export default function LogisticCommandCenter() {
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((mod) => {
      setL(mod);
    });
  }, []);

  const customIcon = (status: string, color: string) => {
    if (!L) return null;
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative group">
          <div class="absolute -inset-2 bg-${color}-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="w-8 h-8 rounded-xl bg-slate-900 border-2 border-${color}-500 flex items-center justify-center shadow-2xl transform rotate-45">
             <div class="transform -rotate-45">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-${color}-500"><path d="M10 17h4V5H2v12h3m15 0h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle></svg>
             </div>
          </div>
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-${color}-500 rounded-full border-2 border-slate-900"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LOADED':
        return 'emerald';
      case 'EMPTY':
        return 'amber';
      case 'STOPPED':
        return 'red';
      case 'OFFLINE':
        return 'slate';
      default:
        return 'blue';
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-[#020408] text-white">
        {/* 📡 HEADER / NAV */}
        <header className="flex items-center justify-between p-6 shrink-0 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Radio className="w-6 h-6 text-indigo-500 animate-pulse" />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tighter italic">
                Command Center Logistique
              </h1>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
              Real-time Fleet Orchestration • Geo-Intelligence • IoT Monitoring
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl">
              <button
                onClick={() => setActiveTab('map')}
                className={cn(
                  'flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                  activeTab === 'map'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-500 hover:text-white'
                )}
              >
                <MapIcon className="w-3.5 h-3.5" />
                Vue Carte
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={cn(
                  'flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                  activeTab === 'list'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-500 hover:text-white'
                )}
              >
                <Navigation className="w-3.5 h-3.5" />
                Liste Missions
              </button>
            </div>

            <div className="h-10 w-px bg-white/10 mx-2" />

            <div className="flex items-center gap-2 px-4 h-10 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span className="text-[10px] font-black uppercase">2 Anomalies</span>
            </div>
          </div>
        </header>

        {/* 🚀 MAIN HUD */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: FLEET LIST & INTELLIGENCE */}
          <aside className="w-[400px] flex flex-col border-r border-white/5 bg-slate-950/30">
            <div className="p-6 space-y-6">
              {/* GLOBAL STATS */}
              <div className="grid grid-cols-2 gap-4">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4 bg-white/2 border border-white/5 rounded-2xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={cn('w-4 h-4', `text-${stat.color}-500`)} />
                      {stat.delta && (
                        <span
                          className={cn(
                            'text-[8px] font-black',
                            stat.delta.startsWith('+') ? 'text-emerald-500' : 'text-red-500'
                          )}
                        >
                          {stat.delta}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                      {stat.label}
                    </span>
                    <span className="text-xl font-black italic tracking-tighter">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* SEARCH & FILTERS */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher chauffeur, camion, mission..."
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-[11px] font-bold placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all uppercase"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1 px-6 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
                  Missions en cours
                </h3>
                <Filter className="w-4 h-4 text-slate-600" />
              </div>

              <div className="space-y-4">
                {MOCK_MISSIONS.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} onClick={() => {}} />
                ))}
              </div>

              {/* 🧠 DISPATCH INTEL SUGGESTION */}
              <div className="mt-8 p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-[32px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-all">
                  <Zap className="w-12 h-12 text-indigo-500" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                    Smart Suggestion
                  </span>
                </div>
                <h4 className="text-[11px] font-black text-white uppercase italic tracking-tight mb-2">
                  Optimisation de trajet détectée
                </h4>
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed mb-4">
                  Le camion <span className="text-white">Ismael Diakité (T-002)</span> finit sa
                  livraison dans 10 min. Un pickup de{' '}
                  <span className="text-white">Tomates (5T)</span> est disponible à 4.2km.
                </p>
                <button className="w-full h-10 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all border border-indigo-400/20">
                  Assigner Mission ?
                </button>
              </div>
            </ScrollArea>
          </aside>

          {/* CENTER: MAP / LIST VIEW */}
          <main className="flex-1 relative bg-slate-900">
            {activeTab === 'map' ? (
              <div className="w-full h-full">
                {L ? (
                  <MapContainer
                    center={[5.36, -4.0]}
                    zoom={11}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    {MOCK_TRUCKS.map((truck) => (
                      <Marker
                        key={truck.id}
                        position={truck.pos as [number, number]}
                        icon={customIcon(truck.status, getStatusColor(truck.status))}
                        eventHandlers={{
                          click: () => setSelectedTruck(truck),
                        }}
                      >
                        <Popup className="custom-popup">
                          <div className="p-1 min-w-[200px] bg-slate-900 text-white border-0">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-black uppercase text-indigo-400">
                                Truck {truck.id}
                              </span>
                              <div
                                className={cn(
                                  'px-2 py-0.5 rounded text-[8px] font-black uppercase',
                                  `bg-${getStatusColor(truck.status)}-500/20 text-${getStatusColor(truck.status)}-500`
                                )}
                              >
                                {truck.status}
                              </div>
                            </div>
                            <h4 className="font-black text-sm mb-1">{truck.driver}</h4>
                            <div className="space-y-1.5 mb-4">
                              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase">
                                <Navigation className="w-3 h-3" /> {truck.destination} (ETA:{' '}
                                {truck.eta})
                              </div>
                              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase">
                                <CheckCircle2 className="w-3 h-3" /> Cargo: {truck.cargo}
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedTruck(truck)}
                              className="w-full py-2 bg-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest"
                            >
                              Ouvrir Supervision
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-950">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        Initialisation Geo-Engine...
                      </span>
                    </div>
                  </div>
                )}

                {/* 🛡️ TRUCK DETAIL OVERLAY */}
                <AnimatePresence>
                  {selectedTruck && (
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="absolute top-6 bottom-6 right-6 w-96 bg-slate-950/90 backdrop-blur-2xl rounded-[40px] border border-white/10 shadow-2xl z-1000 overflow-hidden flex flex-col"
                    >
                      <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                            <Truck className="w-6 h-6 text-white" />
                          </div>
                          <button
                            onClick={() => setSelectedTruck(null)}
                            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-emerald-500/30">
                              {selectedTruck.status}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 uppercase">
                              ID: {selectedTruck.id}
                            </span>
                          </div>
                          <h2 className="text-3xl font-black italic tracking-tighter uppercase">
                            {selectedTruck.driver}
                          </h2>
                          <p className="text-[11px] text-slate-500 font-bold uppercase mt-1">
                            Chauffeur Senior • Côte d'Ivoire Nord
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                              Type Vehicule
                            </span>
                            <p className="text-xs font-black uppercase text-white">
                              {selectedTruck.type}
                            </p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                              Vitesse Actuelle
                            </span>
                            <p className="text-xs font-black uppercase text-white">
                              {selectedTruck.speed} km/h
                            </p>
                          </div>
                        </div>

                        {selectedTruck.type === 'Réfrigéré' && (
                          <div
                            className={cn(
                              'p-6 rounded-3xl border flex items-center justify-between transition-all',
                              selectedTruck.temp > 15
                                ? 'bg-red-500/10 border-red-500/20 text-red-500'
                                : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                            )}
                          >
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                Température Cargo
                              </span>
                              <div className="flex items-center gap-2">
                                <Thermometer className="w-5 h-5" />
                                <span className="text-2xl font-black italic">
                                  {selectedTruck.temp}°C
                                </span>
                              </div>
                            </div>
                            {selectedTruck.temp > 15 && (
                              <div className="px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase rounded-lg animate-pulse">
                                ALERTE CHAINE FROID
                              </div>
                            )}
                          </div>
                        )}

                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic mb-4">
                            Itinéraire Actif
                          </h4>
                          <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                            <div className="relative">
                              <div className="absolute -left-[27px] w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500" />
                              <div className="space-y-1">
                                <span className="text-[9px] font-black text-slate-600 uppercase">
                                  Départ
                                </span>
                                <p className="text-xs font-bold uppercase">
                                  Korbogho - Coopérative Nord
                                </p>
                              </div>
                            </div>
                            <div className="relative">
                              <div className="absolute -left-[27px] w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700" />
                              <div className="space-y-1">
                                <span className="text-[9px] font-black text-slate-600 uppercase">
                                  Destination
                                </span>
                                <p className="text-xs font-bold uppercase">
                                  {selectedTruck.destination}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1 text-[9px] font-black text-indigo-400">
                                  <Clock className="w-3 h-3" /> ETA : {selectedTruck.eta}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-black/40 border-t border-white/5 space-y-3 shrink-0">
                        <div className="flex gap-3">
                          <button className="flex-1 h-12 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                            <PhoneCall className="w-4 h-4" />
                            Contacter
                          </button>
                          <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                        <button className="w-full h-10 bg-red-600/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                          Annulation Urgence
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 💬 BROADCAST PANEL */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center gap-6 z-900 pointer-events-none">
                  <div className="flex-1 h-14 bg-slate-950/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl flex items-center px-6 pointer-events-auto">
                    <Send className="w-4 h-4 text-indigo-500 mr-4" />
                    <input
                      type="text"
                      placeholder="Message global à tous les chauffeurs (Broadcast)..."
                      className="flex-1 bg-transparent border-none text-[11px] font-bold text-white focus:outline-none uppercase placeholder:text-slate-600"
                    />
                    <div className="flex h-10 px-4 bg-indigo-500/10 rounded-xl items-center gap-2 text-indigo-500 text-[10px] font-black uppercase ml-4 cursor-pointer hover:bg-indigo-500/20 transition-all">
                      <Zap className="w-3.5 h-3.5" />
                      Broadcast
                    </div>
                  </div>

                  <div className="w-64 h-14 bg-slate-950/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center gap-4 pointer-events-auto">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-black text-slate-500 uppercase">
                        Latency
                      </span>
                      <span className="text-[10px] font-black text-emerald-500 italic">22ms</span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-black text-slate-500 uppercase">
                        Bandwidth
                      </span>
                      <span className="text-[10px] font-black text-white italic">4.2 Gbps</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full p-8 bg-slate-950/50 flex flex-col gap-6 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black italic tracking-tighter uppercase underline decoration-indigo-500 underline-offset-8">
                    Missions Actives Detail
                  </h2>
                  <button className="h-10 px-6 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">
                    Nouvelle Mission
                  </button>
                </div>

                <ScrollArea className="flex-1">
                  <div className="space-y-4">
                    {MOCK_MISSIONS.map((mission) => (
                      <div
                        key={mission.id}
                        className="p-6 bg-slate-900/50 border border-white/5 rounded-3xl grid grid-cols-6 gap-6 items-center hover:bg-slate-900 transition-all"
                      >
                        <div className="col-span-1 border-r border-white/5 pr-6">
                          <span className="text-[10px] font-black text-indigo-500 uppercase block mb-1">
                            ID Mission
                          </span>
                          <span className="text-lg font-black italic">#{mission.id}</span>
                        </div>
                        <div className="col-span-1 border-r border-white/5 pr-6">
                          <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                            Chauffeur
                          </span>
                          <span className="text-xs font-black uppercase">{mission.driver}</span>
                        </div>
                        <div className="col-span-1 border-r border-white/5 pr-6">
                          <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                            Cargaison
                          </span>
                          <span className="text-xs font-black uppercase">
                            {mission.product} ({mission.qty})
                          </span>
                        </div>
                        <div className="col-span-1 border-r border-white/5 pr-6">
                          <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                            Route
                          </span>
                          <div className="flex flex-col text-[10px] font-bold text-slate-300 uppercase">
                            <span>{mission.from} ➔</span>
                            <span className="text-white">{mission.to}</span>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">
                            Statut
                          </span>
                          <div
                            className={cn(
                              'inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border',
                              mission.status === 'STOPPED_ANOMALY'
                                ? 'bg-red-500/10 border-red-500/20 text-red-500'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                            )}
                          >
                            {mission.status}
                          </div>
                        </div>
                        <div className="col-span-1 flex justify-end gap-2">
                          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                            <Search className="w-4 h-4" />
                          </button>
                          <button className="w-10 h-10 rounded-xl bg-indigo-600 border border-indigo-400/20 flex items-center justify-center hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </main>
        </div>

        <style jsx global>{`
          .leaflet-container {
            background: #020617 !important;
          }
          .custom-popup .leaflet-popup-content-wrapper {
            background: #0f172a !important;
            color: white !important;
            border-radius: 24px !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            padding: 12px !important;
          }
          .custom-popup .leaflet-popup-tip {
            background: #0f172a !important;
          }
        `}</style>
      </div>
    </>
  );
}

function MissionCard({ mission, onClick }: { mission: any; onClick: () => void }) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-5 bg-black/40 border-white/5 rounded-3xl cursor-pointer hover:border-indigo-500/40 transition-all relative overflow-hidden group',
        mission.priority === 'CRITICAL' && 'border-red-500/20 shadow-lg shadow-red-500/5'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              mission.status === 'STOPPED_ANOMALY' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
            )}
          />
          <span className="text-[10px] font-black uppercase text-indigo-400">#{mission.id}</span>
        </div>
        <div
          className={cn(
            'px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border',
            mission.priority === 'CRITICAL'
              ? 'bg-red-500/20 border-red-500/30 text-red-500'
              : 'bg-white/5 border-white/10 text-slate-500'
          )}
        >
          {mission.priority}
        </div>
      </div>

      <h4 className="text-[13px] font-black uppercase italic tracking-tight mb-4">
        {mission.product} ({mission.qty})
      </h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase">
          <div className="flex flex-col gap-0.5">
            <span>Pickup</span>
            <span className="text-white text-[10px]">{mission.from}</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-700" />
          <div className="flex flex-col gap-0.5 items-end text-right">
            <span>Dropoff</span>
            <span className="text-white text-[10px]">{mission.to}</span>
          </div>
        </div>

        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: mission.status === 'STOPPED_ANOMALY' ? '45%' : '75%' }}
            className={cn(
              'h-full rounded-full',
              mission.status === 'STOPPED_ANOMALY' ? 'bg-red-500' : 'bg-indigo-500'
            )}
          />
        </div>

        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tight">
          <span className="text-slate-600">Chauffeur: {mission.driver}</span>
          <span className="text-indigo-400 flex items-center gap-1">
            Superviser <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {mission.status === 'STOPPED_ANOMALY' && (
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-all">
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>
      )}
    </Card>
  );
}
