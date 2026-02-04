'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  Settings,
  Wrench,
  ShieldCheck,
  History,
  Activity,
  Plus,
  ArrowUpRight,
  MapPin,
  Calendar,
  Fuel,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const FLEET_DATA = [
  {
    id: 'T-001',
    name: 'Volvo FH16',
    plate: 'CI-8472-AB',
    type: 'Réfrigéré',
    status: 'ACTIVE',
    health: 98,
    lastService: '20 Jan 2026',
    fuel: 75,
  },
  {
    id: 'T-002',
    name: 'Mercedes Actros',
    plate: 'CI-1290-BB',
    type: 'Standard',
    status: 'ACTIVE',
    health: 92,
    lastService: '12 Jan 2026',
    fuel: 45,
  },
  {
    id: 'T-003',
    name: 'Scania R500',
    plate: 'CI-3341-CC',
    type: 'Réfrigéré',
    status: 'MAINTENANCE',
    health: 65,
    lastService: '05 Jan 2026',
    fuel: 10,
  },
  {
    id: 'T-004',
    name: 'Iveco S-Way',
    plate: 'CI-5562-DD',
    type: 'Bétail',
    status: 'ACTIVE',
    health: 88,
    lastService: '18 Jan 2026',
    fuel: 60,
  },
];

export default function FleetManagementPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Truck className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Gestion de Flotte
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            Monitoring Technique • Maintenance Prédictive • Optimisation Carburant
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="h-10 px-4 bg-white/5 border border-white/10 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            <History className="w-4 h-4" />
            Historique Maintenance
          </button>
          <button className="h-10 px-6 bg-indigo-600 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4" />
            Ajouter Véhicule
          </button>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-6 shrink-0">
        <FleetStat
          label="Total Véhicules"
          value="48"
          delta="+2"
          trend="up"
          icon={Truck}
          color="indigo"
        />
        <FleetStat
          label="Santé Moyenne"
          value="94.2%"
          delta="+0.5%"
          trend="up"
          icon={ShieldCheck}
          color="emerald"
        />
        <FleetStat label="En Maintenance" value="3" icon={Wrench} color="amber" badge="CRITICAL" />
        <FleetStat
          label="Consom. Moyenne"
          value="32L/100"
          delta="-2.1%"
          trend="down"
          icon={Fuel}
          color="blue"
        />
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic">
              Inventaire Flotte
            </h3>
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-600 uppercase">
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Active
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Maintenance
              </span>
            </div>
          </div>

          <ScrollArea className="flex-1 bg-slate-900/20 rounded-[40px] border border-white/5 p-6">
            <div className="grid grid-cols-2 gap-6">
              {FLEET_DATA.map((truck) => (
                <TruckCard key={truck.id} truck={truck} />
              ))}
            </div>
          </ScrollArea>
        </div>

        <aside className="w-[350px] flex flex-col gap-6 shrink-0">
          <Card className="p-6 bg-white/2 border-white/5 rounded-[32px] space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Alertes Maintenance
            </h4>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 bg-white/2 border border-white/5 rounded-2xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase text-white">
                      T-003 : Plaquettes Freins
                    </p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">
                      Usure prononcée détectée via télémétrie.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[8px] font-black bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded uppercase">
                        Urgent
                      </span>
                      <span className="text-[8px] font-black text-slate-600 uppercase">
                        Aujourd'hui, 09:41
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full h-10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              Voir toutes les alertes
            </button>
          </Card>

          <Card className="p-6 bg-indigo-600 border-none rounded-[32px] relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
            <div className="absolute top-0 right-0 p-6 opacity-20 rotate-12 group-hover:scale-125 transition-all">
              <Settings className="w-24 h-24 text-white" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xl font-black italic uppercase tracking-tighter text-white">
                Prochaine Maintenance
              </h4>
              <p className="text-[11px] text-indigo-100 font-bold uppercase opacity-80 leading-relaxed">
                Optimisez vos arrêts techniques avec le planning intelligent synchronisé avec vos
                missions.
              </p>
              <button className="w-full h-12 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all mt-2">
                Planifier Routine
              </button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function FleetStat({ label, value, delta, trend, icon: Icon, color, badge }: any) {
  const colorClasses =
    {
      indigo: 'text-indigo-500 bg-indigo-500/10',
      emerald: 'text-emerald-500 bg-emerald-500/10',
      amber: 'text-amber-500 bg-amber-500/10',
      blue: 'text-blue-500 bg-blue-500/10',
    }[color as string] || 'text-white bg-white/10';

  return (
    <Card className="bg-[#05070a] border-white/5 p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group hover:border-white/10 transition-all">
      <div className="flex items-center justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorClasses)}>
          <Icon className="w-5 h-5" />
        </div>
        {delta && (
          <div
            className={cn(
              'flex items-center gap-1 text-[10px] font-black tracking-tighter',
              trend === 'up' ? 'text-emerald-500' : 'text-amber-500'
            )}
          >
            <ArrowUpRight className={cn('w-3 h-3', trend === 'down' && 'rotate-180')} />
            {delta}
          </div>
        )}
        {badge && (
          <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/20 text-[8px] font-black text-amber-500 tracking-widest uppercase">
            {badge}
          </span>
        )}
      </div>
      <div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
          {label}
        </span>
        <span className="text-3xl font-black text-white italic tracking-tighter uppercase">
          {value}
        </span>
      </div>
    </Card>
  );
}

function TruckCard({ truck }: { truck: any }) {
  return (
    <div className="bg-black/30 border border-white/5 p-6 rounded-[32px] group hover:border-indigo-500/30 transition-all space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-indigo-500 uppercase">{truck.id}</span>
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                truck.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'
              )}
            />
          </div>
          <h4 className="text-lg font-black italic uppercase tracking-tighter text-white">
            {truck.name}
          </h4>
          <p className="text-[10px] font-black text-slate-600 uppercase tabular-nums">
            {truck.plate}
          </p>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
          <Settings className="w-4 h-4 text-slate-500 group-hover:rotate-90 transition-all duration-700" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 min-w-0">
            <Activity className="w-3 h-3 shrink-0" />
            Santé Moteur
          </span>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${truck.health}%` }}
                className={cn('h-full', truck.health > 80 ? 'bg-emerald-500' : 'bg-amber-500')}
              />
            </div>
            <span className="text-[10px] font-black text-white tabular-nums">{truck.health}%</span>
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 min-w-0">
            <Fuel className="w-3 h-3 shrink-0" />
            Fuel Level
          </span>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${truck.fuel}%` }}
                className={cn('h-full', truck.fuel > 30 ? 'bg-blue-500' : 'bg-red-500')}
              />
            </div>
            <span className="text-[10px] font-black text-white tabular-nums">{truck.fuel}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[9px] font-black uppercase text-slate-500 tracking-tight">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-white">
            <Calendar className="w-3 h-3" />
            {truck.lastService}
          </span>
          <span className="flex items-center gap-1 border border-white/5 px-2 py-1 rounded-lg">
            <MapPin className="w-3 h-3" />
            Route #451
          </span>
        </div>
        <button className="text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
          Détails →
        </button>
      </div>
    </div>
  );
}
