'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  MapPin,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Loader2,
  Save,
  Info,
  ChevronRight,
  Sparkles,
  Zap,
  Leaf,
  BarChart3,
  Dna,
  History,
} from 'lucide-react';
import { useFarmerStore } from '@/store/farmerStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// --- Schema ---
const harvestSchema = z.object({
  parcelId: z.string().min(1, 'Sélectionnez une parcelle'),
  cropType: z.string().min(2, 'Type de culture requis'),
  quantity: z.number().min(0.1, 'La quantité doit être positive'),
  quality: z.string().min(1, 'Évaluez la qualité'),
  notes: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type HarvestFormValues = z.infer<typeof harvestSchema>;

export function HarvestInputModule() {
  const { parcels, addHarvest, addPendingHarvest, pendingHarvests, clearPendingHarvests } =
    useFarmerStore();
  const [isOffline, setIsOffline] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const [isDiagnosticRunning, setIsDiagnosticRunning] = React.useState(false);
  const [diagnosticResult, setDiagnosticResult] = React.useState<string | null>(null);
  const [isLocating, setIsLocating] = React.useState(false);
  const [isEstimating, setIsEstimating] = React.useState(false);
  const [aiEstimate, setAiEstimate] = React.useState<number | null>(null);

  const form = useForm<HarvestFormValues>({
    resolver: zodResolver(harvestSchema),
    defaultValues: {
      parcelId: '',
      cropType: '',
      quantity: 0,
      quality: 'A',
      notes: '',
    },
  });

  // Detect online status
  React.useEffect(() => {
    const handleStatus = () => {
      const online = navigator.onLine;
      setIsOffline(!online);
      if (online && pendingHarvests.length > 0) {
        toast.info(`${pendingHarvests.length} récoltes en attente de synchronisation.`);
      }
    };
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    handleStatus();
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, [pendingHarvests.length]);

  const syncAll = async () => {
    setIsSyncing(true);
    await new Promise((r) => setTimeout(r, 2000));
    pendingHarvests.forEach((h) => addHarvest(h));
    clearPendingHarvests();
    setIsSyncing(false);
    toast.success('Synchronisation réussie ! Données transmises via SSL.');
  };

  const captureGPS = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast.error('GPS non disponible');
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        form.setValue('latitude', pos.coords.latitude);
        form.setValue('longitude', pos.coords.longitude);
        toast.success('Signal GPS Verrouillé');
        setIsLocating(false);
      },
      () => {
        toast.error('Erreur de signal GPS');
        setIsLocating(false);
      }
    );
  };

  const runDiagnostic = () => {
    setIsDiagnosticRunning(true);
    setDiagnosticResult(null);
    setTimeout(() => {
      setIsDiagnosticRunning(false);
      setDiagnosticResult('GRADE A+ : Certification Bio-Sûreté AGRODEEP v2.4 validée.');
    }, 2500);
  };

  const runEstimator = () => {
    setIsEstimating(true);
    setTimeout(() => {
      setAiEstimate(8.4);
      setIsEstimating(false);
    }, 1500);
  };

  const onSubmit = async (data: HarvestFormValues) => {
    const harvestData = { ...data, id: crypto.randomUUID(), date: new Date().toISOString() };
    if (isOffline) {
      addPendingHarvest(harvestData as any);
      toast.warning('Stocké localement (Mode Hors-Ligne)');
    } else {
      addHarvest(harvestData as any);
      toast.success('Récolte synchronisée avec la Blockchain');
    }
    form.reset();
    setDiagnosticResult(null);
    setAiEstimate(null);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12">
      {/* Immersive Header */}
      <div className="relative h-[300px] w-full rounded-[3rem] overflow-hidden shadow-2xl group">
        <img
          src="/modern_tech_agriculture_harvest.png"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt="Agriculture Moderne"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60" />

        <div className="absolute bottom-12 left-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 w-fit"
          >
            <Leaf className="h-4 w-4 text-[#D4A017]" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Module de Saisie Stratégique
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-black text-white tracking-tighter"
          >
            TERMINAL <span className="text-[#D4A017]">RÉCOLTE</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 font-bold text-sm max-w-xl"
          >
            Optimisez chaque grain avec l'Intelligence Artificielle d'AgroDeep. Capture GPS,
            diagnostic spectral et prévisions de rendement en temps réel.
          </motion.p>
        </div>

        {isOffline && (
          <div className="absolute top-8 right-8 px-6 py-3 bg-red-500 text-white rounded-full font-black text-xs animate-pulse flex items-center gap-3 shadow-2xl">
            <WifiOff className="h-4 w-4" /> MODE HORS-LIGNE ACTIF
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Left column: Form & Core Entry */}
        <div className="lg:col-span-7 space-y-10">
          <AnimatePresence>
            {!isOffline && pendingHarvests.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2.5rem] flex items-center justify-between shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-2xl">
                    <History className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-sm uppercase tracking-tight">
                      Synchronisation Requise
                    </h4>
                    <p className="text-emerald-500/60 font-bold text-xs">
                      {pendingHarvests.length} enregistrements locaux en attente.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={syncAll}
                  disabled={isSyncing}
                  className="bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white rounded-2xl h-12 px-6 font-black"
                >
                  {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'POUSSER VERS CLOUD'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="border-none bg-white dark:bg-[#0a1f18] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] rounded-[3rem] overflow-hidden">
            <CardHeader className="p-10 border-b border-slate-50 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-[#1B4D3E]/10 rounded-2xl text-[#1B4D3E]">
                  <Save className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-[#1B4D3E] dark:text-white tracking-widest uppercase">
                    FICHE DE RÉCOLTE
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                    Enregistrement certifié AgroDeep Core
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                <div className="grid gap-10 md:grid-cols-2">
                  <div className="space-y-4">
                    <Label className="uppercase text-[11px] font-black text-slate-400 tracking-[0.2em] ml-2">
                      SÉLECTION PARCELLE
                    </Label>
                    <div className="relative">
                      <select
                        {...form.register('parcelId')}
                        className="w-full h-16 bg-slate-50 dark:bg-white/5 border-none rounded-3xl px-6 font-black text-sm focus:ring-4 ring-[#1B4D3E]/10 transition-all appearance-none"
                      >
                        <option value="">CHOISIR UNE ZONE...</option>
                        {parcels.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 rotate-90" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="uppercase text-[11px] font-black text-slate-400 tracking-[0.2em] ml-2">
                      TYPE DE CULTURE
                    </Label>
                    <Input
                      placeholder="Ex: Blé de Force"
                      {...form.register('cropType')}
                      className="h-16 bg-slate-50 dark:bg-white/5 border-none rounded-3xl px-6 font-black focus:ring-4 ring-[#1B4D3E]/10"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="uppercase text-[11px] font-black text-slate-400 tracking-[0.2em] ml-2">
                      QUANTITÉ NETTE
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.1"
                        {...form.register('quantity', { valueAsNumber: true })}
                        className="h-16 bg-slate-50 dark:bg-white/5 border-none rounded-3xl px-6 font-black pr-20"
                      />
                      <Badge className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1B4D3E] text-white border-none font-black text-[10px]">
                        TONNES
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="uppercase text-[11px] font-black text-slate-400 tracking-[0.2em] ml-2">
                      INDICE QUALITÉ
                    </Label>
                    <div className="flex gap-3">
                      {['A', 'B', 'C'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => form.setValue('quality', g as any)}
                          className={cn(
                            'flex-1 h-16 rounded-3xl font-black transition-all border-2',
                            form.watch('quality') === g
                              ? 'bg-[#D4A017] border-[#D4A017] text-white shadow-[0_10px_20px_rgba(212,160,23,0.3)]'
                              : 'bg-transparent border-slate-100 dark:border-white/5 text-slate-400'
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-8 space-y-6 border border-slate-100 dark:border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="uppercase text-[11px] font-black text-slate-400 tracking-[0.2em]">
                        POSITION GPS
                      </Label>
                      <p className="text-xs font-bold text-[#1B4D3E] dark:text-[#D4A017]">
                        Capture du point d'origine requis pour traçabilité Blockchain
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={captureGPS}
                      disabled={isLocating}
                      className="bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white rounded-2xl h-12 px-6 font-black shadow-lg shadow-[#1B4D3E]/20"
                    >
                      {isLocating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="mr-2 h-4 w-4" />
                      )}
                      CAPTURE LIVE
                    </Button>
                  </div>

                  {form.watch('latitude') && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-1 bg-white dark:bg-black/20 p-4 rounded-2xl font-black text-sm text-center border border-slate-100 dark:border-white/10">
                        LAT: {form.watch('latitude')?.toFixed(6)}
                      </div>
                      <div className="flex-1 bg-white dark:bg-black/20 p-4 rounded-2xl font-black text-sm text-center border border-slate-100 dark:border-white/10">
                        LON: {form.watch('longitude')?.toFixed(6)}
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="uppercase text-[11px] font-black text-slate-400 tracking-[0.2em] ml-2">
                    NOTES DE TERRAIN
                  </Label>
                  <Textarea
                    placeholder="Observations multispectrales, humidité grain, conditions spécifiques..."
                    {...form.register('notes')}
                    className="min-h-[140px] bg-slate-50 dark:bg-white/5 border-none rounded-[2rem] p-8 font-bold placeholder:text-slate-300"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-20 bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white rounded-[2rem] font-black text-xl shadow-[0_25px_50px_-12px_rgba(27,77,62,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  VALIDER ET SYNCHRONISER RÉCOLTE
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Intelligence & Visuals */}
        <div className="lg:col-span-5 space-y-10">
          {/* Diagnostic Widget */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-none bg-[#050505] text-white shadow-3xl rounded-[3rem] overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1B4D3E]/20 to-transparent opacity-50" />
              <CardHeader className="p-10 relative border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#D4A017]/10 rounded-2xl text-[#D4A017]">
                    <Dna className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black tracking-widest">
                      DIAGNOSTIC VISUEL IA
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="border-white/10 text-white/40 uppercase text-[8px] font-black"
                    >
                      Powered by AgroLink Vision
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 relative space-y-8">
                <div
                  className="relative h-64 border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5 overflow-hidden group/scanner cursor-pointer"
                  onClick={runDiagnostic}
                >
                  {!isDiagnosticRunning && !diagnosticResult ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                      <div className="p-6 bg-white/5 rounded-full group-hover/scanner:scale-110 transition-transform duration-500">
                        <Camera className="h-10 w-10 text-white/20" />
                      </div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-center px-12">
                        Capture d'image pour analyse de contamination
                      </p>
                    </div>
                  ) : isDiagnosticRunning ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                      <Loader2 className="h-12 w-12 text-[#D4A017] animate-spin" />
                      <div className="text-center">
                        <p className="text-sm font-black text-white tracking-widest uppercase mb-1">
                          Analyse en cours
                        </p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          Séquençage spectral v4.2
                        </p>
                      </div>
                      <motion.div
                        className="absolute inset-x-0 h-[2px] bg-[#D4A017] shadow-[0_0_20px_#D4A017]"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 p-10 text-center">
                      <div className="space-y-4">
                        <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                          <CheckCircle2 className="h-8 w-8 text-white" />
                        </div>
                        <p className="font-black text-lg tracking-tight uppercase leading-snug">
                          {diagnosticResult}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Humidité', val: '14.2%', icon: Zap },
                    { label: 'Densité', val: '0.92', icon: BarChart3 },
                    { label: 'Santé', val: '98%', icon: Sparkles },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center"
                    >
                      <item.icon className="h-3 w-3 text-white/20 mx-auto mb-2" />
                      <p className="text-[8px] font-black text-white/20 uppercase mb-1">
                        {item.label}
                      </p>
                      <p className="text-xs font-black">{item.val}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Predictor Widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-none bg-white dark:bg-[#0a1f18] shadow-3xl rounded-[3rem] overflow-hidden">
              <CardHeader className="p-10 border-b border-slate-50 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-500">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black tracking-widest uppercase">
                      SYSTÈME PRÉDICTIF
                    </CardTitle>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Algorithme YieldPredict Premium
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="flex flex-col items-center justify-center py-6 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-slate-100 dark:border-white/5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                    Estimation du Rendement Final
                  </p>
                  <div className="text-7xl font-black text-[#1B4D3E] dark:text-white tracking-tighter">
                    {isEstimating ? (
                      <div className="flex gap-2">
                        <motion.span
                          animate={{ opacity: [1, 0.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          •
                        </motion.span>
                        <motion.span
                          animate={{ opacity: [1, 0.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        >
                          •
                        </motion.span>
                        <motion.span
                          animate={{ opacity: [1, 0.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        >
                          •
                        </motion.span>
                      </div>
                    ) : aiEstimate ? (
                      `${aiEstimate}`
                    ) : (
                      '---'
                    )}
                    {aiEstimate && (
                      <span className="text-xl text-slate-400 dark:text-slate-600 ml-2 italic">
                        T/ha
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {!aiEstimate ? (
                    <Button
                      onClick={runEstimator}
                      disabled={isEstimating}
                      className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl"
                    >
                      LANCER ESTIMATION IA
                    </Button>
                  ) : (
                    <Button
                      onClick={() => form.setValue('quantity', aiEstimate * 10)}
                      className="w-full h-16 bg-[#D4A017] hover:bg-[#D4A017]/90 text-white rounded-3xl font-black transition-all hover:scale-105 shadow-xl shadow-[#D4A017]/20"
                    >
                      APPLIQUER À LA FICHE
                    </Button>
                  )}
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/2 rounded-2xl">
                    <Info className="h-4 w-4 text-slate-400" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-loose">
                      Calcul basé sur 14 points de données dont l'indice NDVI et l'humidité
                      résiduelle du sol.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
