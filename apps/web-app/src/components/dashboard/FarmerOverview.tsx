'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Truck,
  Map as MapIcon,
  CloudSun,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BrainCircuit,
  Loader2,
  Zap,
  ShieldCheck,
  Cpu,
  Globe,
  Bell,
  Waves,
  Sun,
  Wind,
  Droplets,
  Thermometer,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { useFarmerStore } from '@/store/farmerStore';
import { farmApi } from '@/services/farmApi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// --- Mock Data ---
const forecastData = [
  { day: 'LUN', temp: 22, rain: 10, humidity: 45 },
  { day: 'MAR', temp: 24, rain: 5, humidity: 42 },
  { day: 'MER', temp: 19, rain: 45, humidity: 65 },
  { day: 'JEU', temp: 18, rain: 80, humidity: 85 },
  { day: 'VEN', temp: 21, rain: 20, humidity: 55 },
  { day: 'SAM', temp: 25, rain: 0, humidity: 38 },
  { day: 'DIM', temp: 27, rain: 0, humidity: 35 },
];

export function FarmerOverview() {
  const { parcels, setActiveTab } = useFarmerStore();
  const [prediction, setPrediction] = React.useState<{ yield: number; confidence: number } | null>(
    null
  );
  const [isPredicting, setIsPredicting] = React.useState(false);

  const avgHealth = parcels.reduce((acc, p) => acc + p.healthScore, 0) / (parcels.length || 1);

  const handlePredict = async () => {
    setIsPredicting(true);
    setTimeout(() => {
      setPrediction({ yield: 8.4, confidence: 0.94 });
      setIsPredicting(false);
      toast.success('AGRO-AI : Analyse Prédictive Terminée', {
        description: "Optimisation des récoltes calculée pour l'ensemble du domaine.",
      });
    }, 2500);
  };

  return (
    <div className="space-y-12">
      {/* Top Status Bar - Mission Control Style */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white dark:bg-[#050505] rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-50 pointer-events-none" />

        <div className="flex items-center gap-6 relative z-10">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-full border-4 border-white dark:border-[#050505] bg-slate-100 dark:bg-white/10 flex items-center justify-center overflow-hidden"
              >
                <img
                  src={`https://i.pravatar.cc/150?u=${i}`}
                  alt="user"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            ))}
            <div className="h-10 w-10 rounded-full border-4 border-white dark:border-[#050505] bg-[#1B4D3E] text-white flex items-center justify-center text-[10px] font-black">
              +12
            </div>
          </div>
          <div className="h-10 w-[1px] bg-slate-100 dark:bg-white/10" />
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Opérateurs Connectés
            </p>
            <p className="text-sm font-black text-[#1B4D3E] dark:text-emerald-500 uppercase">
              Synchronisation Satellite Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10 relative z-10">
          <div className="hidden lg:flex items-center gap-3">
            <Bell className="h-4 w-4 text-amber-500 animate-bounce" />
            <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-none">
              Alerte Humidité : Parcelle Sud-A1 <span className="text-amber-500">(Niveau Bas)</span>
            </p>
          </div>
          <div className="flex gap-4">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-2 rounded-full font-black text-[10px] uppercase">
              AgriLink OK
            </Badge>
            <Badge className="bg-blue-500/10 text-blue-600 border-none px-4 py-2 rounded-full font-black text-[10px] uppercase">
              Blockchain SYNC
            </Badge>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <KPIItem
          title="REVENUS ESTIMÉS"
          value="42,850"
          unit="€"
          description="Basé sur prix marché temps réel"
          icon={<TrendingUp className="text-[#D4A017]" />}
          trend="up"
          percentage="+12.4%"
          color="gold"
        />
        <KPIItem
          title="LOGISTIQUE ACTIVE"
          value="03"
          unit="FLUX"
          description="3 Camions en approche Hub A1"
          icon={<Truck className="text-emerald-500" />}
          trend="stable"
          percentage="NORMAL"
          color="emerald"
        />
        <KPIItem
          title="INDICE VITALITÉ"
          value={avgHealth.toFixed(1)}
          unit="%"
          description="Santé biométrique moyenne"
          icon={<Waves className="text-blue-500" />}
          trend="up"
          percentage="+2.1%"
          color="blue"
        />
        <motion.div whileHover={{ scale: 1.02 }} className="group">
          <Card
            className="h-full border-none bg-gradient-to-br from-purple-600 to-indigo-900 text-white shadow-3xl rounded-[3rem] overflow-hidden relative cursor-pointer"
            onClick={handlePredict}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <BrainCircuit className="h-24 w-24" />
            </div>
            <CardContent className="p-10 space-y-8 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                    {isPredicting ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Cpu className="h-6 w-6" />
                    )}
                  </div>
                  <Badge className="bg-white/10 text-white border-none font-black text-[8px] tracking-[0.2em] uppercase">
                    Moteur Neural v4
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                    Rendement Prédit
                  </h4>
                  <p className="text-4xl font-black tracking-tighter">
                    {prediction ? `${prediction.yield}` : '---'}{' '}
                    <span className="text-lg text-white/40">T/HA</span>
                  </p>
                </div>
              </div>

              <Button className="w-full bg-white text-indigo-900 hover:bg-[#D4A017] hover:text-white rounded-2xl h-14 font-black transition-all">
                {isPredicting ? 'ANALYSANT...' : prediction ? 'ACTUALISER IA' : 'LANCER PRÉDICTION'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Weather Intelligence Widget */}
        <Card className="lg:col-span-8 border-none bg-white dark:bg-[#0a1f18] shadow-3xl rounded-[3rem] overflow-hidden border border-slate-100 dark:border-white/5">
          <CardHeader className="p-10 border-b border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black text-[#1B4D3E] dark:text-white flex items-center gap-4 tracking-tighter uppercase">
                  <CloudSun className="h-8 w-8 text-[#D4A017]" />
                  INTEL <span className="text-[#D4A017]">CLIMATIQUE</span>
                </CardTitle>
                <CardDescription className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                  Analyse Spectral-Météo // 7 Jours
                </CardDescription>
              </div>
              <div className="flex gap-3">
                {[
                  { icon: Thermometer, val: '24°C' },
                  { icon: Wind, val: '12km/h' },
                  { icon: Droplets, val: '58%' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm"
                  >
                    <stat.icon size={14} className="text-[#D4A017]" />
                    <span className="text-[10px] font-black">{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A017" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#D4A017" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4D3E" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1B4D3E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  dy={15}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ stroke: '#D4A017', strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-3xl space-y-2">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                            {payload[0].payload.day}
                          </p>
                          <div className="flex gap-4">
                            <div className="space-y-1">
                              <p className="text-[8px] font-black text-[#D4A017] uppercase">
                                Température
                              </p>
                              <p className="text-xl font-black text-white">{payload[0].value}°C</p>
                            </div>
                            <div className="space-y-1 text-right">
                              <p className="text-[8px] font-black text-emerald-500 uppercase">
                                Humidité
                              </p>
                              <p className="text-xl font-black text-white">{payload[1].value}%</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="#D4A017"
                  strokeWidth={4}
                  fill="url(#colorTemp)"
                  dot={{ r: 4, fill: '#D4A017', strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="humidity"
                  stroke="#1B4D3E"
                  strokeWidth={4}
                  fill="url(#colorHum)"
                  dot={{ r: 4, fill: '#1B4D3E', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vitality Hub */}
        <Card className="lg:col-span-4 border-none bg-[#050505] text-white shadow-3xl rounded-[3rem] overflow-hidden relative border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1B4D3E]/5 to-transparent opacity-50" />
          <CardHeader className="p-10 border-b border-white/5 relative z-10">
            <CardTitle className="text-xl font-black tracking-widest flex items-center gap-3 uppercase">
              <ShieldCheck className="h-6 w-6 text-[#D4A017]" /> STATUT VITAL
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-10 relative z-10">
            {parcels.slice(0, 3).map((parcel) => (
              <div key={parcel.id} className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-lg font-black tracking-tighter uppercase">{parcel.name}</p>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">
                      {parcel.cropType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#D4A017] tracking-tighter">
                      {parcel.healthScore}%
                    </p>
                    <p className="text-[8px] font-black text-emerald-500 uppercase">Optimal</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  {/* @ts-ignore */}
                  <Progress
                    value={parcel.healthScore}
                    className="h-full bg-gradient-to-r from-emerald-900 via-emerald-500 to-[#D4A017]"
                  />
                </div>
              </div>
            ))}

            <div className="pt-10 border-t border-white/5">
              <div className="flex items-center gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-[#D4A017]/30 transition-all cursor-pointer group">
                <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <Zap className="h-7 w-7 text-amber-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                    IA STRATÉGIQUE
                  </p>
                  <p className="text-xs font-bold text-amber-500 leading-tight uppercase">
                    Irritation recommandée : Zone Sud-02 (Urgence faible)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPIItem({ title, value, unit, description, icon, trend, percentage, color }: any) {
  const accentColor = {
    emerald: 'bg-emerald-500/10 text-emerald-500',
    gold: 'bg-[#D4A017]/10 text-[#D4A017]',
    blue: 'bg-blue-500/10 text-blue-500',
  }[color as 'emerald' | 'gold' | 'blue'];

  const trendIcon =
    trend === 'up' ? (
      <ArrowUpRight className="h-3 w-3" />
    ) : trend === 'down' ? (
      <ArrowDownRight className="h-3 w-3" />
    ) : (
      <Activity className="h-3 w-3" />
    );

  return (
    <motion.div whileHover={{ y: -8 }}>
      <Card className="border-none bg-white dark:bg-[#0a1f18] shadow-3xl rounded-[3rem] overflow-hidden group hover:border-[#D4A017]/50 border border-slate-100 dark:border-white/5 transition-all duration-300 h-full">
        <CardContent className="p-10 space-y-8 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div
              className={cn(
                'p-4 rounded-2xl shadow-xl transition-transform group-hover:scale-110',
                accentColor
              )}
            >
              {icon}
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {title}
              </p>
              <Badge className={cn('border-none px-3 py-1 font-black shadow-sm', accentColor)}>
                {trendIcon} <span className="ml-1 text-[8px]">{percentage}</span>
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[#1B4D3E] dark:text-white tracking-tighter leading-none">
                {value}
              </span>
              <span className="text-xl font-black text-slate-300 dark:text-slate-600 uppercase">
                {unit}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide leading-relaxed">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
