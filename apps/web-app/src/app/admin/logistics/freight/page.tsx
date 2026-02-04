'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Radio,
  MapPin,
  Box,
  ArrowRight,
  Filter,
  TrendingUp,
  Clock,
  ShieldCheck,
  Package,
  CheckCircle2,
  BaggageClaim,
  Users,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const MARKET_DEMANDS = [
  {
    id: 'DEM-001',
    product: 'Mangues Kent',
    qty: '15,000 kg',
    pickup: 'Korbogho',
    delivery: 'Abidjan Port',
    budget: 'CI 450k',
    urgent: true,
    date: "Aujourd'hui",
    shipper: 'Coop Nord',
  },
  {
    id: 'DEM-002',
    product: 'Noix de Cajou',
    qty: '25,000 kg',
    pickup: 'Bouaké',
    delivery: 'San Pedro',
    budget: 'CI 850k',
    urgent: false,
    date: 'Demain',
    shipper: 'SICC Coast',
  },
  {
    id: 'DEM-003',
    product: 'Ananas',
    qty: '8,000 kg',
    pickup: 'Agboville',
    delivery: 'Abidjan',
    budget: 'CI 200k',
    urgent: false,
    date: '12 Fév',
    shipper: 'Fruits Ivoire',
  },
  {
    id: 'DEM-004',
    product: 'Bétail',
    qty: '40 têtes',
    pickup: 'Ouangolo',
    delivery: 'Abidjan',
    budget: 'CI 1.2M',
    urgent: true,
    date: "Aujourd'hui",
    shipper: 'Herd Master',
  },
];

export default function FreightBoardPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Radio className="w-6 h-6 text-blue-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Bourse de Fret Agricole
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            Matching Fret/Transport • Enchères Transporteurs • Optimisation Flux
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-10 px-4 bg-white/5 border border-white/10 text-white rounded-xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>84 Missions Dispo</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>24 Transporteurs actifs</span>
            </div>
          </div>
          <button className="h-10 px-6 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
            Publier une Demande
          </button>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-6 shrink-0">
        <MarketStat
          label="Offres du Jour"
          value="124"
          delta="+15%"
          trend="up"
          icon={BaggageClaim}
          color="blue"
        />
        <MarketStat
          label="Match Rate IA"
          value="88%"
          delta="+2.4%"
          trend="up"
          icon={TrendingUp}
          color="emerald"
        />
        <MarketStat label="Volume en Or" value="450T" icon={Package} color="amber" />
        <MarketStat
          label="Délai Moyen Match"
          value="14min"
          delta="-5min"
          trend="down"
          icon={Clock}
          color="indigo"
        />
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic">
              Marché en Temps Réel
            </h3>
            <div className="flex items-center gap-2">
              <button className="h-8 px-3 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-400 hover:text-white transition-all">
                <Filter className="w-3 h-3" /> Filtrer par zone
              </button>
            </div>
          </div>

          <ScrollArea className="flex-1 bg-slate-900/20 rounded-[40px] border border-white/5 p-6">
            <div className="space-y-4">
              {MARKET_DEMANDS.map((demand) => (
                <DemandCard key={demand.id} demand={demand} />
              ))}
            </div>
          </ScrollArea>
        </div>

        <aside className="w-[350px] flex flex-col gap-6 shrink-0">
          <Card className="p-6 bg-slate-950/40 border-white/5 rounded-[32px] space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Flux Recommandés
            </h4>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-white">
                      Route Korhogo-San Pedro
                    </p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase">
                      Attention: Hausse demande +18%
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 border-none rounded-[32px] relative overflow-hidden group shadow-2xl shadow-blue-500/20">
            <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 group-hover:rotate-45 transition-all duration-700">
              <TrendingUp className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                  Matching Garanti
                </h4>
                <p className="text-[11px] text-blue-100 font-bold uppercase opacity-80 leading-relaxed">
                  Notre algorithme trouve le meilleur transporteur pour vos denrées périssables en
                  moins de 30 minutes.
                </p>
              </div>
              <button className="w-full h-12 bg-white text-blue-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl">
                Activer Auto-Dispatcher
              </button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function MarketStat({ label, value, delta, trend, icon: Icon, color }: any) {
  const colorClasses =
    {
      blue: 'text-blue-500 bg-blue-500/10',
      emerald: 'text-emerald-500 bg-emerald-500/10',
      amber: 'text-amber-500 bg-amber-500/10',
      indigo: 'text-indigo-500 bg-indigo-500/10',
    }[color as string] || 'text-white bg-white/10';

  return (
    <Card className="bg-[#05070a] border-white/5 p-6 rounded-3xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorClasses)}>
          <Icon className="w-5 h-5" />
        </div>
        {delta && (
          <div
            className={cn(
              'flex items-center gap-1 text-[10px] font-black tracking-tighter',
              trend === 'up' ? 'text-emerald-500' : 'text-red-500'
            )}
          >
            {delta}
          </div>
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

function DemandCard({ demand }: { demand: any }) {
  return (
    <div className="p-6 bg-black/30 border border-white/5 rounded-[32px] grid grid-cols-5 gap-6 items-center group hover:border-blue-500/30 transition-all hover:bg-white/[0.02]">
      <div className="col-span-1 border-r border-white/5 pr-6 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
            #{demand.id}
          </span>
          {demand.urgent && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
        </div>
        <h4 className="text-lg font-black italic uppercase tracking-tighter text-white">
          {demand.product}
        </h4>
        <p className="text-[10px] font-black text-slate-600 uppercase tabular-nums">
          {demand.qty} • {demand.date}
        </p>
      </div>

      <div className="col-span-2 border-r border-white/5 pr-6 flex items-center gap-6">
        <div className="flex-1 space-y-1">
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">
            Pickup
          </span>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-black uppercase text-white">{demand.pickup}</span>
          </div>
        </div>
        <div className="shrink-0">
          <ArrowRight className="w-4 h-4 text-slate-700" />
        </div>
        <div className="flex-1 space-y-1 text-right">
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">
            Delivery
          </span>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs font-black uppercase text-white">{demand.delivery}</span>
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="col-span-1 border-r border-white/5 pr-6 space-y-1">
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">
          Budget Estimé
        </span>
        <p className="text-xl font-black italic text-emerald-500">{demand.budget}</p>
        <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase">
          <ShieldCheck className="w-3 h-3 text-emerald-500" /> Garanti par Escrow
        </div>
      </div>

      <div className="col-span-1 flex flex-col items-center gap-3">
        <button className="w-full h-11 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-2">
          Proposer Offre
        </button>
        <span className="text-[8px] font-black text-slate-600 uppercase">{demand.shipper}</span>
      </div>
    </div>
  );
}
