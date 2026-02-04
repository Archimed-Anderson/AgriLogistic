'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Command } from 'cmdk';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  Zap,
  Search,
  UserCheck,
  FileBox,
  Settings,
  ShieldAlert,
  Truck,
  Landmark,
  ClipboardList,
  CloudLightning,
  Map,
  Link,
  Ban,
  MoveHorizontal,
  BellRing,
  LayoutDashboard,
  Home,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getAccessToken } from '@/lib/api/auth';
import {
  executeQuickAction,
  persistAudit,
  emergencyStop,
  rerouteFleet,
} from '@/lib/api/admin-quick-actions';

// 8 actions max (cahier des charges)
const frequentActions = [
  { id: 'kyc', icon: UserCheck, label: 'Validation KYC Rapide', shortcut: 'K', color: 'text-emerald-500', keywords: 'kyc agriculteur file attente' },
  { id: 'report', icon: ClipboardList, label: 'Générer Rapport Journalier', shortcut: 'R', color: 'text-blue-500', keywords: 'rapport journalier' },
  { id: 'maint', icon: Settings, label: 'Mode Maintenance', shortcut: 'M', color: 'text-orange-500', keywords: 'maintenance' },
  { id: 'broadcast', icon: BellRing, label: 'Broadcast Zone Transporteurs', shortcut: 'B', color: 'text-purple-500', keywords: 'broadcast notification push transporteurs zone' },
  { id: 'chain', icon: Link, label: 'Force Chain Sync', shortcut: 'S', color: 'text-cyan-500', keywords: 'blockchain sync' },
  { id: 'suspend', icon: Ban, label: 'Suspendre Compte', shortcut: 'U', color: 'text-red-500', keywords: 'suspendre bloquer compte' },
  { id: 'warroom', icon: Zap, label: 'Ouvrir War Room', shortcut: 'W', color: 'text-amber-500', keywords: 'war room incidents' },
  { id: 'export', icon: FileBox, label: 'Export Compliance OHADA', shortcut: 'E', color: 'text-slate-400', keywords: 'export compliance ohada' },
];

const workflows = [
  { id: 'emergency_stop', icon: CloudLightning, label: 'Emergency Stop', desc: 'Suspension temporaire corridor logistique', color: 'bg-red-600', keywords: 'emergency stop corridor' },
  { id: 'reroute', icon: Map, label: 'Reroute Fleet', desc: 'Recalcul VRP pour éviter zone météo dangereuse', color: 'bg-orange-600', keywords: 'reroute vrp météo' },
];

export function QuickCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Audit trail (qui a fait quoi, quand) - POST /api/v1/admin/audit
  const logAudit = async (action: string, target?: string, metadata?: object) => {
    const token = getAccessToken();
    try {
      await persistAudit({ action, target: target ?? null, metadata }, token);
    } catch (e) {
      console.warn('[AUDIT] persist failed:', e);
    }
  };

  // Toggle palette
  // Ouvrir/Fermer palette (Ctrl+K / Cmd+K)
  useHotkeys('ctrl+k, cmd+k', (e) => {
    e.preventDefault();
    setOpen((prev) => !prev);
  });

  // Fermer avec Esc (cahier des charges)
  useHotkeys('escape', () => setOpen(false), {}, [open]);

  // Raccourcis mnémoniques K/T/F : ouvrir palette + pré-remplir recherche (cahier des charges)
  // Désactivés quand focus sur input (pour permettre la recherche)
  useHotkeys('k', () => {
    if (!open) { setOpen(true); setSearch('KYC'); void logAudit('Shortkey: K → KYC'); }
  }, { enableOnFormTags: [] }, [open]);
  useHotkeys('t', () => {
    if (!open) { setOpen(true); setSearch('Transport'); void logAudit('Shortkey: T → Transport'); }
  }, { enableOnFormTags: [] }, [open]);
  useHotkeys('f', () => {
    if (!open) { setOpen(true); setSearch('Finance'); void logAudit('Shortkey: F → Finance'); }
  }, { enableOnFormTags: [] }, [open]);

  // Feedback haptique mobile (cahier des charges)
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleAction = async (id: string, label: string) => {
    triggerHaptic();
    const token = getAccessToken();

    try {
      // POST /api/v1/admin/quick-actions/:action (bypass cache)
      await executeQuickAction(id, token);
      toast.success(`Action lancée: ${label}`);
    } catch (e) {
      toast.error(`Action échouée: ${label}`);
    }
    void logAudit(`QuickAction: ${label}`, id);
    setOpen(false);

    if (id === 'warroom') router.push('/admin/war-room');
    else if (id === 'kyc') router.push('/admin/governance/kyc');
    else if (id === 'report') router.push('/admin/reports');
    else if (id === 'export') router.push('/admin/reports/compliance');
  };

  const handleWorkflow = async (id: string, label: string) => {
    triggerHaptic();
    const token = getAccessToken();

    try {
      if (id === 'emergency_stop') {
        await emergencyStop(token);
        toast.error(`Workflow CRITIQUE: ${label}`);
      } else if (id === 'reroute') {
        await rerouteFleet(token);
        toast.error(`Workflow CRITIQUE: ${label}`);
      } else {
        toast.error(`Workflow CRITIQUE: ${label}`);
      }
    } catch (e) {
      toast.error(`Workflow échoué: ${label}`);
    }
    void logAudit(`Workflow: ${label}`, id);
    setOpen(false);
  };

  return (
    <>
      {/* ⚡ Original Single Sidebar Hub Button */}
      <button
        onClick={() => setOpen(true)}
        className="group relative flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-lg shadow-emerald-500/5 mt-auto mb-2 overflow-hidden"
      >
        <Zap className="h-5 w-5 text-emerald-500 group-hover:scale-125 transition-transform" />
        <div className="absolute inset-0 bg-linear-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="sr-only">Quick Actions Hub</span>
      </button>

      {/* COMMAND PALETTE */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-[#0a0c14] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <Command className="flex flex-col h-full">
                <div className="flex items-center border-b border-white/5 px-6">
                  <Search className="h-5 w-5 text-slate-500 shrink-0" />
                  <Command.Input
                    autoFocus
                    placeholder="Recherche floue: Kofi, TR-89, Litige #4521..."
                    className="flex h-16 w-full bg-transparent px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 font-medium"
                    value={search}
                    onValueChange={setSearch}
                  />
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-[10px] text-slate-500 font-black">ESC</span>
                  </div>
                </div>

                <Command.List className="max-h-[500px] overflow-y-auto overflow-x-hidden p-6 custom-scrollbar">
                  <Command.Empty className="py-12 text-center text-slate-500 text-sm italic font-medium">
                    Aucun résultat pour &quot;{search}&quot;. Essayez Kofi, TR-89, Litige #4521
                  </Command.Empty>

                  {/* DASHBOARD LINK INSIDE PALETTE */}
                  <Command.Group heading="Navigation Système">
                    <Command.Item
                      onSelect={() => {
                        router.push('/admin');
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl aria-selected:bg-white/5 cursor-pointer text-slate-400 aria-selected:text-white group/dash"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-bold uppercase tracking-tight">
                        Retour au Dashboard Principal
                      </span>
                      <div className="ml-auto px-1.5 py-0.5 rounded border border-white/10 text-[8px] bg-white/5 font-black uppercase tracking-tighter opacity-0 group-hover/dash:opacity-100 transition-opacity">
                        Mission Center Home
                      </div>
                    </Command.Item>
                  </Command.Group>

                  {/* FREQUENT ACTIONS TILES */}
                  {!search && (
                    <div className="mb-8 mt-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 px-2">
                        Actions Fréquentes
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {frequentActions.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => handleAction(action.id, action.label)}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                          >
                            <action.icon
                              className={cn(
                                'h-6 w-6 mb-2 group-hover:scale-110 transition-transform',
                                action.color
                              )}
                            />
                            <span className="text-[10px] font-bold text-slate-300 text-center uppercase tracking-tight">
                              {action.label}
                            </span>
                            <span className="mt-2 text-[8px] font-black text-slate-600 border border-white/5 px-1.5 rounded">
                              {action.shortcut}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WORKFLOWS */}
                  {!search && (
                    <div className="mb-8">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 px-2">
                        Workflows Automatisés
                      </h4>
                      <div className="space-y-2">
                        {workflows.map((wf) => (
                          <button
                            key={wf.id}
                            onClick={() => handleWorkflow(wf.id, wf.label)}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
                          >
                            <div
                              className={cn(
                                'h-10 w-10 rounded-xl flex items-center justify-center shrink-0',
                                wf.color
                              )}
                            >
                              <wf.icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-black uppercase text-white tracking-tight">
                                {wf.label}
                              </p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase">
                                {wf.desc}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Résultats recherche floue : Kofi, TR-89, Litige #4521 (cahier des charges) */}
                  <Command.Group heading="Résultats recherche">
                    <Command.Item
                      value="Bloquer agriculteur Kofi Annan 4421 Côte Ivoire"
                      onSelect={() => handleAction('u1', 'Bloquer agriculteur Kofi')}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl aria-selected:bg-white/5 cursor-pointer text-slate-400 aria-selected:text-white"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span className="text-sm font-medium">Bloquer agriculteur Kofi Annan (Côte d&apos;Ivoire)</span>
                      <span className="ml-auto text-[10px] text-slate-600">ID: #4421</span>
                    </Command.Item>
                    <Command.Item
                      value="Camion TR-89 Convoi logistique Sénégambie"
                      onSelect={() => handleAction('t1', 'Camion TR-89')}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl aria-selected:bg-white/5 cursor-pointer text-slate-400 aria-selected:text-white"
                    >
                      <Truck className="w-4 h-4" />
                      <span className="text-sm font-medium">Camion TR-89 (Sénégambie)</span>
                      <span className="ml-auto text-[10px] text-slate-600">LIVE: 42km/h</span>
                    </Command.Item>
                    <Command.Item
                      value="Litige 4521 Escrow Qualité Cacao"
                      onSelect={() => handleAction('l1', 'Litige #4521')}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl aria-selected:bg-white/5 cursor-pointer text-slate-400 aria-selected:text-white"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium">Litige #4521 (Qualité Cacao)</span>
                      <span className="ml-auto text-[10px] text-slate-600">$4,200</span>
                    </Command.Item>
                  </Command.Group>
                </Command.List>

                <div className="bg-[#05070a] px-6 py-4 flex items-center gap-6 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">
                      Alpha Logic Engine Active
                    </span>
                  </div>
                  <div className="ml-auto flex items-center gap-4 text-[9px] text-slate-600 font-black uppercase">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3" /> Ctrl+K
                    </span>
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-3 h-3" /> K=KYC
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3 h-3" /> T=Transport
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Landmark className="w-3 h-3" /> F=Finance
                    </span>
                  </div>
                </div>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        [cmdk-group-heading] {
          padding: 8px 16px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-weight: 900;
          color: #475569;
        }
      `}</style>
    </>
  );
}
