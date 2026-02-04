'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Plus,
  Search,
  Filter,
  Truck,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Camera,
  Signature,
  ArrowRight,
  MoreVertical,
  ChevronRight,
  Calendar,
  DollarSign,
  Navigation,
  ShieldCheck,
  Package,
  X,
  Zap,
  TrendingUp,
  Scale,
  Activity,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { missionsApi, CreateMissionDto } from '@/lib/api/missions';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

// --- CONSTANTS & HELPERS ---

const MOCK_PARTNERS = {
  farmers: [
    { id: 'F-1', name: 'Coop Nord-Korbogho', location: 'Korbogho', lat: 9.45, lng: -5.63 },
    { id: 'F-2', name: 'Ferme Kouassi', location: 'Agboville', lat: 5.93, lng: -4.22 },
    { id: 'F-3', name: 'Union Bio CI', location: 'Man', lat: 7.41, lng: -7.55 },
  ],
  buyers: [
    { id: 'B-1', name: 'SOCOPA Abidjan', location: 'Abidjan Port', lat: 5.31, lng: -4.01 },
    { id: 'B-2', name: 'DistriAgro', location: 'Bouaké', lat: 7.69, lng: -5.03 },
    { id: 'B-3', name: 'Export-Plus San Pedro', location: 'San Pedro', lat: 4.75, lng: -6.64 },
  ],
};

const getStatusProgress = (status: string) => {
  switch (status) {
    case 'CREATED':
      return 10;
    case 'ASSIGNED':
      return 30;
    case 'PICKUP':
      return 50;
    case 'IN_TRANSIT':
      return 75;
    case 'DELIVERED':
      return 100;
    default:
      return 0;
  }
};

// --- COMPONENTS ---

export default function MissionManagementPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('active');
  const [missions, setMissions] = useState<any[]>([]);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [creationStep, setCreationStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MISSION_SERVICE_URL =
    process.env.NEXT_PUBLIC_MISSION_SERVICE_URL || 'http://localhost:3006';

  // Socket Connection
  useEffect(() => {
    const socket = io(MISSION_SERVICE_URL);

    socket.on('connect', () => {
      console.log('📡 Connected to Real-time Notification Service');
    });

    socket.on('mission_update', (data) => {
      toast.success(`UPDATE MISSION: ${data.order}`, {
        description: data.message,
        duration: 5000,
      });
      // Refresh list to show new status
      fetchMissions();
    });

    return () => {
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only: socket setup, fetchMissions stable
  }, []);

  const [formData, setFormData] = useState<Partial<CreateMissionDto>>({
    shipperId: '',
    receiverId: '',
    productName: '',
    quantity: 0,
    unit: 'kg',
    priority: 'NORMAL',
    originName: '',
    destinationName: '',
    driverId: '',
  });

  // Driver Suggestions State
  const [driverSuggestions, setDriverSuggestions] = useState<any[]>([]);

  const fetchMissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await missionsApi.getMissions();
      setMissions(data);
    } catch (error) {
      console.error('Failed to fetch missions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const handleCreateMission = async () => {
    try {
      setIsSubmitting(true);

      // Automatic data enrichment from simulation for UX
      const shipper = MOCK_PARTNERS.farmers.find((f) => f.id === formData.shipperId);
      const receiver = MOCK_PARTNERS.buyers.find((b) => b.id === formData.receiverId);

      const payload: CreateMissionDto = {
        ...(formData as CreateMissionDto),
        originName: shipper?.name || 'Unknown',
        originLat: shipper?.lat,
        originLng: shipper?.lng,
        destinationName: receiver?.name || 'Unknown',
        destinationLat: receiver?.lat,
        destinationLng: receiver?.lng,
      };

      await missionsApi.createMission(payload);
      setIsCreating(false);
      fetchMissions();
      setFormData({
        shipperId: '',
        receiverId: '',
        productName: '',
        quantity: 0,
        unit: 'kg',
        priority: 'NORMAL',
      });
    } catch (error) {
      console.error('Failed to create mission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-[#020408] text-white p-6 relative">
      {/* 🚀 HEADER */}
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Radio className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">
              Mission Orchestration
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1 italic">
            Assignation Haute-Précision • Suivi Blockchain • e-CMR International
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl">
            {['all', 'active', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-500 hover:text-white'
                )}
              >
                {tab === 'all' ? 'Explorer' : tab === 'active' ? 'En Route' : 'Historique'}
              </button>
            ))}
          </div>

          <div className="h-10 w-px bg-white/10 mx-2" />

          <button
            onClick={() => {
              setIsCreating(true);
              setCreationStep(1);
            }}
            className="h-10 px-6 bg-white text-black rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
          >
            <Plus className="w-4 h-4" />
            Démarrer Nouvelle Mission
          </button>
        </div>
      </header>

      {/* 📊 MAIN CONTENT */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* LEFT: MISSION LIST */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="RECHERCHER PAR ID, CHAUFFEUR, PRODUIT..."
                className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-[10px] font-bold placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all uppercase tracking-widest"
              />
            </div>
            <button
              onClick={() => fetchMissions()}
              className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
              ) : (
                <Filter className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-4">
              {missions.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-slate-600">
                  <Package className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Aucune mission en cours
                  </p>
                </div>
              )}
              {missions.map((mission) => (
                <MissionListItem
                  key={mission.id}
                  mission={mission}
                  isSelected={selectedMission?.id === mission.id}
                  onClick={() => setSelectedMission(mission)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT: MISSION DETAIL HUD */}
        <aside className="w-[500px] shrink-0">
          <AnimatePresence mode="wait">
            {selectedMission ? (
              <motion.div
                key={selectedMission.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col"
              >
                <Card className="h-full bg-slate-900/40 border border-white/5 rounded-[48px] flex flex-col overflow-hidden backdrop-blur-3xl shadow-2xl">
                  {/* DETAIL HEADER */}
                  <div className="p-10 border-b border-white/5 shrink-0 bg-slate-950/20">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] italic">
                          Live Tracking Active
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedMission(null)}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                      >
                        <X className="w-5 h-5 text-slate-500" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <h2 className="text-4xl font-black italic tracking-tighter uppercase tabular-nums">
                        #{selectedMission.orderNumber}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">
                        ORDRE: {new Date(selectedMission.createdAt).toLocaleDateString()}
                      </span>
                      <div className="h-4 w-px bg-white/10" />
                      <span className="text-[9px] font-black text-indigo-500 uppercase italic">
                        ETA:{' '}
                        {selectedMission.estimatedEta
                          ? new Date(selectedMission.estimatedEta).toLocaleTimeString()
                          : '--:--'}
                      </span>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-10">
                    {/* WORKFLOW TRACKER */}
                    <div className="mb-12">
                      <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-8 italic">
                        Audit Trail & Workflow
                      </h4>
                      <div className="space-y-10 relative before:content-[''] before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-white/5">
                        {selectedMission.checkpoints.map((cp: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-8 relative">
                            <div
                              className={cn(
                                'w-8 h-8 rounded-full border-2 flex items-center justify-center relative z-10 transition-all',
                                'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                              )}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="flex justify-between items-center mb-1">
                                <p className="text-[11px] font-black uppercase tracking-widest text-white">
                                  {cp.status}
                                </p>
                                <span className="text-[9px] font-bold text-slate-600 tabular-nums">
                                  {new Date(cp.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              {cp.evidenceUrl && (
                                <div className="mt-3 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group cursor-pointer overflow-hidden relative">
                                  <img
                                    src={cp.evidenceUrl}
                                    alt="POD"
                                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                                  />
                                  <Camera className="w-4 h-4 text-white relative z-10" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* MISSION ENTITIES */}
                    <div className="space-y-10">
                      <div className="p-8 bg-white/2 border border-white/5 rounded-[32px] space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                          <MapPin className="w-32 h-32" />
                        </div>
                        <div className="grid grid-cols-2 gap-8 relative z-10">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-emerald-500">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="text-[9px] font-black uppercase tracking-widest">
                                Origine
                              </span>
                            </div>
                            <p className="text-xs font-black uppercase text-white leading-tight">
                              {selectedMission.originName}
                            </p>
                            <p className="text-[9px] font-bold text-slate-600 uppercase">
                              Coordonnées: {selectedMission.originLat?.toFixed(2)}°N,{' '}
                              {selectedMission.originLng?.toFixed(2)}°W
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-indigo-500">
                              <Navigation className="w-3.5 h-3.5" />
                              <span className="text-[9px] font-black uppercase tracking-widest">
                                Destination
                              </span>
                            </div>
                            <p className="text-xs font-black uppercase text-white leading-tight">
                              {selectedMission.destinationName}
                            </p>
                            <p className="text-[9px] font-bold text-slate-600 uppercase">
                              Arrivée Prévue
                            </p>
                          </div>
                        </div>

                        <div className="h-px bg-white/5 w-full" />

                        <div className="flex justify-between items-center relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                              <Package className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase text-white">
                                {selectedMission.productName}
                              </p>
                              <p className="text-[9px] font-bold text-slate-600 uppercase">
                                {selectedMission.quantity} {selectedMission.unit} • Fragile
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* DRIVER / TRUCK INFOS */}
                      {selectedMission.driverId ? (
                        <div className="p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-[32px] flex items-center gap-6">
                          <div className="w-14 h-14 rounded-[20px] bg-slate-900 border border-white/10 flex items-center justify-center shadow-xl">
                            <User className="w-6 h-6 text-indigo-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 italic">
                              Chauffeur Assigné
                            </p>
                            <h4 className="text-lg font-black uppercase italic tracking-tighter text-white">
                              {selectedMission.driverId}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">
                              {selectedMission.truckId || 'ID TRUCK'}
                            </p>
                          </div>
                          <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 shadow-lg">
                            <Activity className="w-5 h-5 text-indigo-500" />
                          </button>
                        </div>
                      ) : (
                        <div className="p-8 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center text-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                            <User className="w-6 h-6 text-slate-700" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">
                              En attente d'assignation
                            </p>
                            <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">
                              Assignez un transporteur pour démarrer le flux
                            </p>
                          </div>
                          <button className="h-10 px-6 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">
                            Assigner Maintenant
                          </button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="p-10 bg-slate-950/40 border-t border-white/5 space-y-4">
                    <div className="flex gap-4">
                      <button className="flex-1 h-14 bg-white text-black rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5">
                        <FileText className="w-4 h-4" />
                        Générer e-CMR Digital
                      </button>
                      <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-[20px] flex items-center justify-center hover:bg-white/10 transition-all group">
                        <MoreVertical className="w-5 h-5 text-slate-500 group-hover:text-white" />
                      </button>
                    </div>
                    <button className="w-full h-12 bg-red-600/10 border border-red-500/20 text-red-500 rounded-[18px] text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5">
                      Signaler Anomalie / Alerte SOS
                    </button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[64px] p-16 text-center bg-slate-950/10"
              >
                <div className="w-24 h-24 rounded-[40px] bg-white/5 flex items-center justify-center mb-8 border border-white/5">
                  <Navigation className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-500 leading-tight">
                  Aucun Ordre
                  <br />
                  Sélectionné
                </h3>
                <p className="text-[10px] font-bold text-slate-600 uppercase max-w-[220px] mt-4 leading-relaxed tracking-widest">
                  Choisissez un flux logistique dans la liste de gauche pour initier la supervision
                  complète.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      {/* 🔮 FULLSCREEN CREATION OVERLAY */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-5000 flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              className="w-full max-w-6xl h-[85vh] bg-[#05070a] border border-white/10 rounded-[64px] overflow-hidden shadow-2xl flex relative"
            >
              {/* CREATION SIDEBAR (PROGRESS) */}
              <div className="w-[350px] bg-indigo-600 p-16 flex flex-col justify-between shrink-0 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <Zap className="w-96 h-96 -translate-x-20 -translate-y-20 rotate-12" />
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center mb-10 border border-white/30">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-[1.1]">
                    Inertia Intelligent
                    <br />
                    Dispatch
                  </h2>
                  <p className="text-[12px] text-indigo-100 font-bold uppercase opacity-80 mt-6 leading-relaxed italic">
                    Orchestration automatique des flux agricoles • Algorithme de suggestion
                    prédictive.
                  </p>
                </div>

                <div className="space-y-6 relative z-10">
                  {[
                    { step: 1, label: 'Entities & Origin', desc: 'Shipper / Receiver info' },
                    { step: 2, label: 'Smart Assignation', desc: 'AI Driver Suggestion' },
                    { step: 3, label: 'Audit & Finalize', desc: 'e-CMR Generation' },
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-6 group">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-2xl flex items-center justify-center transition-all border font-black text-xs',
                          creationStep === s.step
                            ? 'bg-white text-indigo-600 border-white scale-110 shadow-lg shadow-white/20'
                            : creationStep > s.step
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-transparent text-white/40 border-white/10'
                        )}
                      >
                        {creationStep > s.step ? <CheckCircle2 className="w-5 h-5" /> : s.step}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            'text-[10px] font-black uppercase tracking-widest',
                            creationStep === s.step ? 'text-white' : 'text-white/40'
                          )}
                        >
                          {s.label}
                        </span>
                        <span className="text-[9px] font-bold uppercase text-white/30 tracking-wider font-jakarta">
                          {s.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CREATION CONTENT PANEL */}
              <div className="flex-1 flex flex-col p-20 overflow-hidden relative">
                {/* CLOSE BUTTON */}
                <button
                  onClick={() => setIsCreating(false)}
                  className="absolute top-12 right-12 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>

                <ScrollArea className="flex-1 pr-6">
                  {creationStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-12 pb-10"
                    >
                      <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Type de Flux
                          </label>
                          <div className="flex gap-4">
                            {['EXPORT', 'LOCAL', 'TRANSIT'].map((type) => (
                              <button
                                key={type}
                                className="flex-1 h-12 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:border-indigo-500 transition-all"
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Urgence
                          </label>
                          <div className="flex gap-4">
                            {['NORMAL', 'HIGH', 'CRITICAL'].map((ur) => (
                              <button
                                key={ur}
                                onClick={() => setFormData({ ...formData, priority: ur as any })}
                                className={cn(
                                  'flex-1 h-12 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:border-red-500 transition-all',
                                  formData.priority === ur &&
                                    'border-indigo-500 bg-indigo-500/10 text-white',
                                  ur === 'CRITICAL' &&
                                    'text-red-500 border-red-500/20 bg-red-500/5',
                                  formData.priority === 'CRITICAL' &&
                                    ur === 'CRITICAL' &&
                                    'border-red-500 bg-red-500/20 text-white'
                                )}
                              >
                                {ur}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Expéditeur (Shipper)
                          </label>
                          <select
                            value={formData.shipperId}
                            onChange={(e) =>
                              setFormData({ ...formData, shipperId: e.target.value })
                            }
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-3xl px-8 text-[11px] font-black text-white uppercase focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                          >
                            <option value="">Sélectionnez un partenaire...</option>
                            {MOCK_PARTNERS.farmers.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name} ({f.location})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Destinataire (Receiver)
                          </label>
                          <select
                            value={formData.receiverId}
                            onChange={(e) =>
                              setFormData({ ...formData, receiverId: e.target.value })
                            }
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-3xl px-8 text-[11px] font-black text-white uppercase focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                          >
                            <option value="">Sélectionnez un acheteur...</option>
                            {MOCK_PARTNERS.buyers.map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.name} ({b.location})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Détail Marchandise
                          </label>
                          <input
                            type="text"
                            placeholder="EX: CACAO CERTIFIÉ UTZ"
                            value={formData.productName}
                            onChange={(e) =>
                              setFormData({ ...formData, productName: e.target.value })
                            }
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-3xl px-8 text-[11px] font-black text-white uppercase focus:outline-none focus:border-indigo-500 transition-all"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Poids Total (Est.)
                          </label>
                          <input
                            type="number"
                            placeholder="EX: 25,000"
                            value={formData.quantity || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, quantity: parseFloat(e.target.value) })
                            }
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-3xl px-8 text-[11px] font-black text-white uppercase focus:outline-none focus:border-indigo-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-[40px] flex items-center justify-between group">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-indigo-500" />
                            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                              Estimation PredictCost™
                            </h4>
                          </div>
                          <p className="text-4xl font-black italic text-white tracking-tighter">
                            € 1,240.50 - 1,350.00
                          </p>
                          <p className="text-[9px] font-bold text-slate-600 uppercase">
                            Basé sur distance + cours gasoil actuel.
                          </p>
                        </div>
                        <TrendingUp className="w-16 h-16 text-indigo-500 opacity-10 group-hover:scale-110 transition-transform" />
                      </div>
                    </motion.div>
                  )}

                  {creationStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-10 pb-10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">
                          Recommendations Algorithmiques
                        </h4>
                        <span className="text-[10px] font-black text-indigo-500 uppercase flex items-center gap-2">
                          <Activity className="w-4 h-4 animate-pulse" /> Optimisation en cours...
                        </span>
                      </div>

                      <div className="space-y-4">
                        {[
                          {
                            id: 'D-1',
                            name: 'Moussa Sylla',
                            truck: 'Volvo FH16 (T-001)',
                            score: 98,
                            distance: '5km',
                          },
                          {
                            id: 'D-2',
                            name: 'Ismael Diakité',
                            truck: 'Mercedes (T-002)',
                            score: 92,
                            distance: '12km',
                          },
                        ].map((d, i) => (
                          <div
                            key={d.id}
                            onClick={() => setFormData({ ...formData, driverId: d.id })}
                            className={cn(
                              'p-8 bg-white/2 border border-white/10 rounded-[32px] flex items-center gap-8 cursor-pointer hover:border-indigo-500 transition-all group',
                              formData.driverId === d.id &&
                                'ring-2 ring-indigo-500/50 bg-indigo-500/10 border-indigo-500/50'
                            )}
                          >
                            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-lg italic text-white shadow-2xl relative">
                              {d.score}%
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-black uppercase italic tracking-tighter text-white">
                                {d.name}
                              </h4>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                                  <Truck className="w-3 h-3" /> {d.truck}
                                </span>
                                <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {d.distance} PROXIMITÉ
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2 text-right">
                              <div className="inline-flex px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-white uppercase tracking-widest border border-white/5">
                                Fiabilité: {d.score}/100
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </ScrollArea>

                {/* ACTIONS FOOTER */}
                <div className="pt-12 border-t border-white/5 flex justify-between items-center bg-[#05070a]/80 backdrop-blur-xl">
                  <button
                    onClick={() => {
                      if (creationStep > 1) setCreationStep(creationStep - 1);
                    }}
                    className={cn(
                      'px-10 h-16 border rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all gap-3 flex items-center',
                      creationStep === 1
                        ? 'opacity-0 pointer-events-none'
                        : 'border-white/10 text-slate-400 hover:text-white'
                    )}
                  >
                    <ArrowLeft className="w-4 h-4" /> Retour
                  </button>

                  <div className="flex gap-6">
                    <button
                      onClick={() => setIsCreating(false)}
                      className="px-10 h-16 bg-white/5 text-slate-500 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                    >
                      Abandonner Ordre
                    </button>
                    <button
                      disabled={isSubmitting}
                      onClick={() => {
                        if (creationStep < 3) setCreationStep(creationStep + 1);
                        else handleCreateMission();
                      }}
                      className="px-14 h-16 bg-white text-black rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-2xl shadow-white/5 flex items-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : creationStep === 3 ? (
                        'Finaliser & Publier'
                      ) : (
                        'Confirmer & Continuer'
                      )}{' '}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        select option {
          background: #0f172a;
          color: white;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}

function MissionListItem({
  mission,
  isSelected,
  onClick,
}: {
  mission: any;
  isSelected: boolean;
  onClick: () => void;
}) {
  const statusColors: any = {
    IN_TRANSIT: 'text-blue-500 bg-blue-500/10 border-blue-500/10',
    PICKUP: 'text-amber-500 bg-amber-500/10 border-amber-500/10',
    DELIVERED: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10',
    CREATED: 'text-slate-400 bg-white/5 border-white/10',
    ASSIGNED: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/10',
  };

  const progress = getStatusProgress(mission.status);

  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-8 bg-slate-900/10 border border-white/5 rounded-[40px] cursor-pointer transition-all hover:bg-slate-900/30 relative overflow-hidden group',
        isSelected &&
          'border-indigo-500/50 bg-indigo-500/5 ring-1 ring-indigo-500/20 shadow-2xl scale-[1.02]'
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-[13px] font-black text-indigo-500 uppercase tracking-widest italic tabular-nums">
            #{mission.orderNumber}
          </span>
          <div
            className={cn(
              'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border',
              statusColors[mission.status]
            )}
          >
            {mission.status}
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tabular-nums">
            {mission.estimatedEta
              ? new Date(mission.estimatedEta).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '--:--'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-10 mb-8">
        <div className="flex-1">
          <h4 className="text-xl font-black uppercase italic tracking-tighter text-white line-clamp-1 mb-2">
            {mission.productName}
          </h4>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
            <MapPin className="w-3 h-3" />
            {mission.originName} ➔ {mission.destinationName}
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0 px-6 py-3 bg-white/2 border border-white/5 rounded-2xl">
          <div className="text-right">
            <p className="text-[10px] font-black text-white uppercase italic">
              {mission.driverId || 'A assigner'}
            </p>
            <p className="text-[9px] font-bold text-slate-600 uppercase tabular-nums">
              {mission.truckId || '--'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight text-slate-500 italic">
          <span>Sync Progression</span>
          <span className="text-white tabular-nums">{progress}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={cn(
              'h-full',
              progress === 100
                ? 'bg-emerald-500'
                : 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]'
            )}
          />
        </div>
      </div>

      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-6 h-6 text-indigo-500" />
      </div>
    </Card>
  );
}
