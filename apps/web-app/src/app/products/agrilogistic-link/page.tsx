'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';
import { useLogisticsStore } from '@/store/useLogisticsStore';
import {
  ArrowLeft,
  MapPin,
  Package,
  Truck,
  Filter,
  Search,
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
  Menu,
  X,
  Leaf,
  MessageCircle,
  Timer,
  Navigation,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Dynamically import the map to avoid SSR issues
const LogisticsMap = dynamic(() => import('@/components/maps/LogisticsMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-sm uppercase tracking-widest text-emerald-500">
          Connexion Satellite...
        </p>
      </div>
    </div>
  ),
});

export default function CommandCenterPage() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Smart & Interaction States
  const [calculatingId, setCalculatingId] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState<{
    origin: [number, number];
    destination: [number, number];
    mode: 'fast' | 'eco';
  } | null>(null);

  const [routeMode, setRouteMode] = useState<'fast' | 'eco'>('fast');

  const [chatOpen, setChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState<string | null>(null);

  // Global State from Store
  const loads = useLogisticsStore((state) => state.loads);
  const trucks = useLogisticsStore((state) => state.trucks);
  const bookLoad = useLogisticsStore((state) => state.bookLoad);

  // Client-side only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeLoads = useMemo(() => loads.filter((l) => l.status === 'Pending'), [loads]);
  const availableTrucks = useMemo(() => trucks.filter((t) => t.status === 'Available'), [trucks]);

  const handleBookLoad = (loadId: string) => {
    bookLoad(loadId);
    window.alert('✅ Demande validée ! Le système contacte le chauffeur.');
  };

  const handleSmartMatch = (load: any) => {
    setCalculatingId(load.id);

    // Reset previous route
    setActiveRoute(null);

    // Simulate AI Calculation
    setTimeout(() => {
      setCalculatingId(null);

      // Find a mock destination (truck) - simplistic logic for demo
      // In real app, we'd use the actual matched truck coordinates
      const mockTruckLocation: [number, number] = [
        load.origin[0] + (Math.random() - 0.5) * 0.5,
        load.origin[1] + (Math.random() - 0.5) * 0.5,
      ];

      setActiveRoute({
        origin: load.origin,
        destination: mockTruckLocation,
        mode: routeMode,
      });

      // Show temporary badge notification logic could trigger here
    }, 1500);
  };

  const openChat = (truckName: string) => {
    setChatTarget(truckName);
    setChatOpen(true);
  };

  if (!isMounted) return null;

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-950 font-sans">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <LogisticsMap activeRoute={activeRoute ? { ...activeRoute, mode: routeMode } : null} />
      </div>

      {/* BRAND LOGO - RETOUR LANDING PAGE */}
      <Link
        href="/"
        className="absolute top-4 left-16 md:top-6 md:left-6 z-50 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group pointer-events-auto"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/20 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all">
          <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-xl font-black text-white tracking-tighter leading-none group-hover:text-emerald-400 transition-colors drop-shadow-md text-shadow">
            Agri<span className="text-emerald-500">Logistic</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
            Link
          </span>
        </div>
      </Link>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-slate-950/80 via-transparent to-transparent h-40"></div>

      {/* INTELLIGENT HUD */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
        <div className="glass px-6 py-2.5 rounded-full flex items-center gap-6 pointer-events-auto border border-emerald-500/20 bg-slate-900/80 backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all hover:bg-slate-900/90 group">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-20"></div>
            </div>
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] text-shadow-sm group-hover:text-emerald-400 transition-colors">
              AgriLogistic AI <span className="text-emerald-500">ONLINE</span>
            </span>
          </div>

          <div className="h-5 w-px bg-white/10"></div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-orange-400" />
              <span className="group-hover:text-white transition-colors">
                {activeLoads.length} Chargements
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span className="group-hover:text-white transition-colors">
                {availableTrucks.length} Camions
              </span>
            </div>
          </div>
        </div>

        {/* Route Comparator Toggle (Visible anytime or only when route active) */}
        <div className="pointer-events-auto glass px-1.5 py-1.5 rounded-full bg-slate-900/90 border border-white/10 flex items-center gap-1 shadow-xl transform scale-90 opacity-90 hover:scale-100 hover:opacity-100 transition-all">
          <button
            onClick={() => setRouteMode('fast')}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              routeMode === 'fast'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Timer className="w-3 h-3" /> Rapide
          </button>
          <button
            onClick={() => setRouteMode('eco')}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              routeMode === 'eco'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Leaf className="w-3 h-3" /> Écologique {-15}%
          </button>
        </div>
      </div>

      {/* CHAT MODULE - FLOATING */}
      {chatOpen && (
        <div className="absolute bottom-20 right-80 z-50 w-80 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="glass rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-96">
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                    <Truck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">{chatTarget || 'Chauffeur'}</h4>
                  <p className="text-[10px] text-green-400 font-medium">En ligne</p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-slate-400 hover:text-white"
                onClick={() => setChatOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat Body (Simulator) */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-[10px] text-slate-400">
                    AI
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 text-xs text-slate-300 max-w-[85%]">
                    Bonjour ! Je suis l'assistant IA. Vous êtes en relation directe pour négocier le
                    transport.
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-900/50 flex-shrink-0 flex items-center justify-center text-[10px] text-blue-400">
                    CH
                  </div>
                  <div className="bg-blue-600/20 border border-blue-500/20 rounded-2xl rounded-tl-none p-3 text-xs text-blue-100 max-w-[85%]">
                    Salut, je suis disponible sur le secteur avec un camion vide. Je peux prendre
                    votre chargement dans 2h.
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-3 border-t border-white/5 bg-white/5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Écrivez un message..."
                  className="w-full bg-slate-950/50 border border-white/10 rounded-full py-2 pl-4 pr-10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
                />
                <button className="absolute right-1 top-1 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-colors">
                  <Navigation className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Toggles */}
      {/* ... (Keep existing mobile toggles) ... */}
      <div className="absolute top-4 left-4 z-20 md:hidden">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
        >
          {leftSidebarOpen ? <X className="w-4 h-4" /> : <Package className="w-4 h-4" />}
        </Button>
      </div>
      <div className="absolute top-4 right-4 z-20 md:hidden">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
        >
          {rightSidebarOpen ? <X className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
        </Button>
      </div>

      {/* LEFT SIDEBAR - LOAD BOARD */}
      <aside
        className={`
          absolute top-24 bottom-4 left-4 w-96 z-10 
          transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          flex flex-col gap-4
          ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
        `}
      >
        <div className="glass flex-1 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-black text-lg flex items-center gap-3 tracking-tight">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20">
                  <Package className="w-5 h-5 text-red-500" />
                </div>
                Marketplace
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-red-400 text-[10px] font-bold uppercase tracking-wider">
                  Live Feed
                </span>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un fret..."
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/30 transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* List */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {activeLoads.slice(0, 10).map((load) => (
                <div
                  key={load.id}
                  className="relative group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-500/30 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-sm font-bold text-slate-100 block mb-0.5">
                          {load.productType}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-white/5">
                            {load.quantity} {load.unit}
                          </span>
                          {calculatingId === load.id && (
                            <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                              Analyses...
                            </span>
                          )}
                          {activeRoute?.origin === load.origin && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold border border-emerald-500/30">
                              MATCHÉ {98}%
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-mono text-red-300 font-bold bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/10">
                        {load.priceOffer.toLocaleString()} FCFA
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                      {/* Timeline / Route Visual */}
                      <div className="relative pl-3 border-l border-slate-700 space-y-3 py-1">
                        <div className="relative">
                          <div className="absolute -left-[16.5px] top-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                          <p className="text-xs text-slate-300 font-medium leading-none">
                            {load.originCity}
                          </p>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[16.5px] top-1 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                          <p className="text-xs text-slate-300 font-medium leading-none">
                            {load.destinationCity}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Smart Match Button */}
                      <Button
                        size="sm"
                        className={`
                           flex-1 h-8 text-[10px] font-bold uppercase tracking-wider border-0 transition-all duration-300
                           ${
                             calculatingId === load.id
                               ? 'bg-slate-800 text-emerald-400 cursor-wait'
                               : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-900/40'
                           }
                         `}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSmartMatch(load);
                        }}
                        disabled={!!calculatingId}
                      >
                        {calculatingId === load.id ? (
                          <>
                            <Timer className="w-3 h-3 mr-2 animate-spin" /> Calcul...
                          </>
                        ) : (
                          <>
                            <Zap className="w-3 h-3 mr-2 fill-current" /> Smart Match IA
                          </>
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookLoad(load.id);
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* RIGHT SIDEBAR - FLEET */}
      <aside
        className={`
          absolute top-24 bottom-4 right-4 w-80 z-10 
          transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          flex flex-col gap-4
          ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-[120%]'}
        `}
      >
        <div className="glass flex-1 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-black text-lg flex items-center gap-3 tracking-tight">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20">
                  <Truck className="w-5 h-5 text-blue-500" />
                </div>
                Flotte
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                  {availableTrucks.length} Dispo
                </span>
              </div>
            </div>
          </div>

          {/* List */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {availableTrucks.slice(0, 10).map((truck) => (
                <div
                  key={truck.id}
                  className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-bold text-slate-200">{truck.truckType}</span>
                    {truck.aiMatchScore > 80 && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                        <Zap className="w-2.5 h-2.5 fill-current" />
                        IA {truck.aiMatchScore}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-xs text-slate-400 bg-black/20 p-2 rounded-lg">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span className="truncate">{truck.currentLocationCity}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5 text-center">
                      <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">
                        Capacité
                      </div>
                      <div className="text-xs font-black text-white">{truck.capacity}T</div>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5 text-center">
                      <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">
                        Avis
                      </div>
                      <div className="text-xs font-black text-yellow-500 flex items-center justify-center gap-1">
                        ★ {truck.driverRating}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full h-8 text-[10px] uppercase font-bold bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/20 hover:border-blue-600 transition-all shadow-lg shadow-blue-900/0 hover:shadow-blue-900/40"
                    onClick={() => openChat(truck.driverName)}
                  >
                    <MessageCircle className="w-3 h-3 mr-2" />
                    Contacter Chauffeur
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>
    </div>
  );
}
