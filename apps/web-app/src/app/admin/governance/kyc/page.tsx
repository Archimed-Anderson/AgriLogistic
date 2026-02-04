'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  Search,
  Filter,
  ChevronRight,
  FileText,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  Plus,
  Users,
  Truck,
  ShoppingBag,
  Building2,
  ScanFace,
  Globe,
  Database,
  Link as LinkIcon,
  Download,
  Eye,
  Trash2,
  Calendar,
  Phone,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useKycStore, KycApplication, KycStatus, ActorType } from '@/store/kycStore';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Colonnes Kanban : Documents reçus → En vérification → Validation auto → Validation manuelle → Approuvé/Rejeté (cahier des charges)
const COLUMNS: { id: KycStatus; label: string; color: string }[] = [
  { id: 'received', label: 'Documents Reçus', color: 'bg-blue-500' },
  { id: 'verifying', label: 'En Vérification', color: 'bg-amber-500' },
  { id: 'auto_fix', label: 'Validation Auto', color: 'bg-indigo-500' },
  { id: 'manual_review', label: 'Validation Manuelle', color: 'bg-purple-500' },
  { id: 'approved', label: 'Approuvé', color: 'bg-emerald-500' },
  { id: 'rejected', label: 'Rejeté', color: 'bg-red-500' },
];

export default function KycValidationPage() {
  const { applications, selectedApplication, selectApplication, filter, setFilter, updateStatus, batchApprove } =
    useKycStore();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const filteredApps = useMemo(() => {
    return filter === 'all' ? applications : applications.filter((a) => a.actorType === filter);
  }, [applications, filter]);

  const stats = useMemo(() => {
    return {
      farmer: applications.filter((a) => a.actorType === 'farmer').length,
      transporter: applications.filter((a) => a.actorType === 'transporter').length,
      buyer: applications.filter((a) => a.actorType === 'buyer').length,
      cooperative: applications.filter((a) => a.actorType === 'cooperative').length,
    };
  }, [applications]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      {/* 🟢 HEADER & FILTERS */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              KYC Validation Center
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            AML/CFT Compliance Monitoring • OHADA Standards
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'farmer', label: 'Agriculteurs', icon: Users, count: stats.farmer },
              { id: 'transporter', label: 'Transporteurs', icon: Truck, count: stats.transporter },
              { id: 'buyer', label: 'Acheteurs', icon: ShoppingBag, count: stats.buyer },
              {
                id: 'cooperative',
                label: 'Coopératives',
                icon: Building2,
                count: stats.cooperative,
              },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={cn(
                  'px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2',
                  filter === f.id
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'text-slate-500 hover:text-white'
                )}
              >
                {f.icon && <f.icon className="w-3 h-3" />}
                {f.label}
                {f.count !== undefined && <span className="opacity-50">({f.count})</span>}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              // Batch validation coopératives : valider plusieurs agriculteurs d'un coup (cahier des charges)
              const toApprove = applications.filter((a) => a.status === 'manual_review').map((a) => a.id);
              if (toApprove.length > 0) {
                batchApprove(toApprove);
                toast.success(`${toApprove.length} dossier(s) approuvé(s)`);
              } else {
                toast.info('Aucun dossier en validation manuelle');
              }
            }}
            className="h-10 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/20 transition-all"
          >
            <Users className="w-4 h-4" />
            Batch Validation
          </button>
        </div>
      </header>

      {/* 🚀 KANBAN BOARD */}
      <div className="flex-1 overflow-x-auto no-scrollbar pb-4">
        <div className="flex gap-6 h-full min-w-max">
          {COLUMNS.map((col) => (
            <div key={col.id} className="w-[320px] flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', col.color)} />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {col.label}
                  </h3>
                </div>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-bold border border-white/5">
                  {filteredApps.filter((a) => a.status === col.id).length}
                </span>
              </div>

              <ScrollArea className="flex-1 bg-slate-900/10 rounded-3xl border border-white/5 p-3">
                <div className="space-y-3">
                  {filteredApps
                    .filter((a) => a.status === col.id)
                    .map((app) => (
                      <KycCard
                        key={app.id}
                        application={app}
                        onClick={() => selectApplication(app)}
                      />
                    ))}
                  {filteredApps.filter((a) => a.status === col.id).length === 0 && (
                    <div className="h-40 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl opacity-20">
                      <Database className="w-8 h-8 text-slate-700 mb-2" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">
                        File vide
                      </span>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ))}
        </div>
      </div>

      {/* 📂 DOSSIER DETAIL OVERLAY */}
      <AnimatePresence>
        {selectedApplication && (
          <KycDetailView
            application={selectedApplication}
            onClose={() => selectApplication(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function KycCard({ application, onClick }: { application: KycApplication; onClick: () => void }) {
  const typeLabel = {
    farmer: {
      label: 'Agri',
      icon: Users,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    transporter: {
      label: 'Trans',
      icon: Truck,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    buyer: {
      label: 'Buyer',
      icon: ShoppingBag,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
    cooperative: {
      label: 'Coop',
      icon: Building2,
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    },
  };

  return (
    <motion.div
      layoutId={`app-${application.id}`}
      onClick={onClick}
      className="group block p-4 bg-slate-950/50 border border-white/5 rounded-2xl hover:border-emerald-500/30 hover:bg-slate-900/80 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={cn(
            'text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter flex items-center gap-1.5',
            typeLabel[application.actorType].color
          )}
        >
          {React.createElement(typeLabel[application.actorType].icon, { className: 'w-3 h-3' })}
          {typeLabel[application.actorType].label}
        </span>
        <span className="text-[9px] font-mono text-slate-600 font-bold italic">
          {application.id}
        </span>
      </div>

      <h4 className="text-sm font-black text-white uppercase italic tracking-tight mb-2 truncate">
        {application.actorName}
      </h4>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex -space-x-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center"
            >
              <FileText className="w-2.5 h-2.5 text-slate-400" />
            </div>
          ))}
        </div>
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
          {application.documents.length} Docs uploaded
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-slate-600" />
          <span className="text-[9px] text-slate-600 font-black uppercase">2h ago</span>
        </div>
        {application.faceMatchScore && (
          <div className="flex items-center gap-1">
            <ScanFace className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] font-mono font-black text-emerald-500">
              {application.faceMatchScore}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function KycDetailView({
  application,
  onClose,
}: {
  application: KycApplication;
  onClose: () => void;
}) {
  const { updateStatus } = useKycStore();
  const activeDoc = application.documents[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full h-full max-w-7xl bg-[#0a0c14] border border-white/10 rounded-[40px] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* 🏷️ MODAL HEADER */}
        <div className="h-20 border-b border-white/5 px-8 flex items-center justify-between shrink-0 bg-slate-950/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase text-white tracking-tighter italic">
                {application.actorName}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  {application.id}
                </span>
                <div className="h-1 w-1 rounded-full bg-slate-700" />
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {application.actorType}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
              <LinkIcon className="w-4 h-4 text-emerald-500" />
              <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase">
                Blockchain Verified • Hash: 0x4f...a2
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
            >
              <XCircle className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>

        {/* 🛰️ SPLIT SCREEN CONTENT */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: DOCUMENT PREVIEW */}
          <div className="flex-1 bg-black/40 p-8 overflow-hidden flex flex-col gap-4">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Preview: {activeDoc?.type || 'Waiting upload'}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-white/5 rounded-lg border border-white/10 text-slate-400 hover:text-white">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white/5 rounded-lg border border-white/10 text-slate-400 hover:text-white">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-900/50 rounded-3xl border border-white/5 border-dashed flex items-center justify-center relative overflow-hidden group">
              {activeDoc ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-800/20 p-12">
                  <div className="w-full h-full border border-white/10 rounded-2xl bg-white shadow-2xl flex flex-col p-12 text-slate-950">
                    <div className="flex justify-between items-start mb-12">
                      <div className="space-y-2">
                        <h3 className="text-4xl font-black italic">RÉPUBLIQUE</h3>
                        <h4 className="text-xl font-bold opacity-50">CÔTE D'IVOIRE</h4>
                      </div>
                      <div className="w-16 h-16 bg-slate-100 rounded-lg" />
                    </div>
                    <div className="space-y-6">
                      <div className="h-8 bg-slate-100 rounded w-2/3" />
                      <div className="h-4 bg-slate-100 rounded w-1/2" />
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="mt-12 space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-1 h-32 bg-slate-50 rounded" />
                          <div className="w-32 h-32 bg-slate-200 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <AlertCircle className="w-12 h-12 text-slate-800" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                    Aucun document chargé
                  </p>
                </div>
              )}
              <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-black text-[9px] font-black uppercase rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                OCR SCANNING: 98% Confidence
              </div>
            </div>
          </div>

          {/* RIGHT: DATA ANALYSIS & ACTIONS */}
          <aside className="w-[450px] border-l border-white/5 p-8 overflow-y-auto no-scrollbar bg-slate-950/30 flex flex-col gap-8">
            {/* Metrics & Identity Match */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">
                Analyse de conformité
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <ScanFace className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black text-slate-500 uppercase italic">
                      FaceMatch
                    </span>
                  </div>
                  <p className="text-2xl font-black font-mono text-emerald-500 italic leading-none">
                    {application.faceMatchScore || 0}%
                  </p>
                </div>
                <div className="p-4 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span className="text-[9px] font-black text-slate-500 uppercase italic">
                      Addr. Check
                    </span>
                  </div>
                  <p className="text-2xl font-black font-mono text-blue-500 italic leading-none">
                    VERIFIED
                  </p>
                </div>
              </div>
            </div>

            {/* Extracted Data (JSON Style Editor) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                  Données OCR Extraites
                </h4>
                <button className="text-[9px] font-black text-emerald-500 uppercase border-b border-emerald-500/20">
                  Edit Payload
                </button>
              </div>
              <div className="bg-black/50 border border-white/5 rounded-3xl p-6 font-mono text-xs space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-600">full_name</span>
                  <span className="text-emerald-400 font-bold">"{application.actorName}"</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-600">reg_id</span>
                  <span className="text-blue-400 font-bold">"CI-229-X01"</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-600">issuer</span>
                  <span className="text-slate-400 font-bold">"REP_COTE_DIVOIRE"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">compliance_score</span>
                  <span className="text-emerald-400 font-bold">0.9652</span>
                </div>
              </div>
            </div>

            {/* Automatic Verifications */}
            <div className="space-y-4 flex-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">
                Système de Risque
              </h4>
              <div className="space-y-2">
                <CheckItem label="Vérification Identité API" status="success" />
                <CheckItem
                  label="Vérification Mobile Money"
                  status={application.mobileMoneyVerified ? 'success' : 'warning'}
                />
                <CheckItem label="Vérification AML/CFT Watchlist" status="success" />
                <CheckItem label="Vérification Validité OHADA" status="success" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-6 border-t border-white/10 shrink-0">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    updateStatus(application.id, 'rejected');
                    onClose();
                  }}
                  className="flex-1 h-14 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Rejeter Dossier
                </button>
                <button
                  onClick={() => {
                    updateStatus(application.id, 'approved');
                    onClose();
                  }}
                  className="flex-1 h-14 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] shadow-xl shadow-emerald-500/10 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approuver KYC
                </button>
              </div>
              <button className="h-12 rounded-2xl bg-slate-900 border border-white/5 text-slate-500 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all flex items-center justify-center gap-2">
                <Plus className="w-3 h-3" />
                Demander Complément
              </button>
            </div>
          </aside>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CheckItem({ label, status }: { label: string; status: 'success' | 'warning' | 'error' }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
      <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
      {status === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      ) : status === 'warning' ? (
        <AlertCircle className="w-4 h-4 text-amber-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
    </div>
  );
}
