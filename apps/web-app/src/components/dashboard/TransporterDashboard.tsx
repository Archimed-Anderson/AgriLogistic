'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  Truck,
  MapPin,
  Clock,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  LayoutGrid,
  Search,
  Filter,
  Layers,
  Fuel,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MissionCarousel } from './transporter/MissionCarousel';

// Dynamic import for Map (No SSR)
const LiveFleetMap = dynamic(() => import('./transporter/LiveFleetMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-950 text-slate-500">
      <span className="animate-pulse font-mono text-xs">INITIALISATION SATELLITE...</span>
    </div>
  ),
});

import { toast } from 'sonner';
import { MOCK_NOTIFICATIONS } from '@/data/transporter-mock-data';
import { Sparkles, Zap, Wallet } from 'lucide-react';

export function TransporterDashboard() {
  // Simulate Random Notifications
  React.useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Notification 1: Opportunity (5s)
    timeouts.push(
      setTimeout(() => {
        toast.info('Opportunité Détectée', {
          description: MOCK_NOTIFICATIONS[0].message,
          icon: <Zap className="text-emerald-500" />,
          duration: 8000,
        });
      }, 5000)
    );

    // Notification 2: Blockchain (12s)
    timeouts.push(
      setTimeout(() => {
        toast.success('Transaction Reçue', {
          description: MOCK_NOTIFICATIONS[1].message,
          icon: <Wallet className="text-blue-500" />,
          duration: 8000,
        });
      }, 12000)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4 animate-in fade-in duration-700">
      {/* Top: Control Bar */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Rechercher chauffeur, mission, zone..."
              className="pl-10 h-10 bg-slate-950/50 border-white/10 rounded-xl text-xs font-bold text-white focus:ring-emerald-500/50"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-950/50 border-white/10 text-slate-400 hover:text-white rounded-lg h-10 text-[10px] uppercase font-bold"
            >
              <Filter className="mr-2 h-3 w-3" /> Filtres
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-950/50 border-white/10 text-slate-400 hover:text-white rounded-lg h-10 text-[10px] uppercase font-bold"
            >
              <Layers className="mr-2 h-3 w-3" /> Calques Map
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-10 px-6 font-black uppercase text-[10px] shadow-lg shadow-emerald-500/20">
            <Zap className="mr-2 h-3 w-3" /> Optimisation Auto (4)
          </Button>
        </div>
      </div>

      {/* Main: Map & Overlay */}
      <div className="flex-1 relative rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl bg-slate-950 group">
        {/* Map Layer */}
        <div className="absolute inset-0 z-0">
          <LiveFleetMap />
        </div>

        {/* Floating HUD: KPIs */}
        <div className="absolute top-6 right-6 z-10 flex flex-col gap-3 pointer-events-none">
          {[
            { label: 'Taux Remplissage', val: '84%', col: 'emerald', icon: LayoutGrid },
            { label: 'Trajets à Vide', val: '12%', col: 'orange', icon: Truck },
            { label: 'CO2 Économisé', val: '-420kg', col: 'blue', icon: Fuel },
          ].map((kpi, i) => (
            <div
              key={i}
              className="bg-slate-950/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-48 shadow-lg flex items-center justify-between pointer-events-auto hover:scale-105 transition-transform"
            >
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  {kpi.label}
                </p>
                <p className="text-xl font-black text-white">{kpi.val}</p>
              </div>
              <div
                className={`h-8 w-8 rounded-lg bg-${kpi.col}-500/10 flex items-center justify-center text-${kpi.col}-500`}
              >
                <kpi.icon size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Overlay: Mission Carousel */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-6 pt-24 pointer-events-none">
          <div className="flex items-end justify-between mb-4 pointer-events-auto">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-widest">
                Opportunités Identifiées par IA
              </span>
            </div>
          </div>
          <div className="pointer-events-auto">
            <MissionCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}
