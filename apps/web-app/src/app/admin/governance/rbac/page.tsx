'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  Lock,
  Key,
  Eye,
  Trash2,
  Plus,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Database,
  Fingerprint,
  History,
  ShieldAlert,
  Search,
  Settings,
  Globe,
  Map,
  UserPlus,
  ArrowRightCircle,
  Clock,
  Activity,
  UserCog,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRbacStore, Role, Resource, Action, Scope } from '@/store/rbacStore';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const RESOURCES: Resource[] = [
  'Parcels',
  'Offers',
  'Contracts',
  'Trucks',
  'Users',
  'Financial_Transactions',
  'System_Config',
];
const ACTIONS: Action[] = ['create', 'read', 'update', 'delete', 'approve', 'export', 'assign'];
const SCOPES: Scope[] = ['Own', 'Team', 'Region', 'Global'];

export default function RbacManagementPage() {
  const { roles, selectedRole, selectRole, impersonatingAs, setImpersonation, auditLogs } =
    useRbacStore();
  const [activeTab, setActiveTab] = useState<'matrix' | 'audit'>('matrix');

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      {/* 🛡️ RBAC HEADER */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-purple-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Governance: RBAC Center
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            Advanced Role-Based Access Control • CASL.js Engine
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('matrix')}
              className={cn(
                'px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                activeTab === 'matrix'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                  : 'text-slate-500 hover:text-white'
              )}
            >
              Permissions Matrix
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={cn(
                'px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                activeTab === 'audit'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                  : 'text-slate-500 hover:text-white'
              )}
            >
              Access Audit Logs
            </button>
          </div>

          <button className="h-10 px-4 bg-purple-500 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-purple-500/10">
            <UserPlus className="w-4 h-4" />
            New Role
          </button>
        </div>
      </header>

      {/* 🚀 MAIN CONTENT AREA */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {activeTab === 'matrix' ? (
          <>
            {/* ROLE SIDEBAR */}
            <aside className="w-80 flex flex-col gap-4 bg-slate-900/20 rounded-[32px] border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    Security Roles
                  </h3>
                  <span className="text-[10px] font-mono text-purple-500 font-black">
                    {roles.length} ROLES
                  </span>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    placeholder="Find role..."
                    className="w-full h-10 bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 text-xs text-white placeholder:text-slate-700 outline-none"
                  />
                </div>
              </div>

              <ScrollArea className="flex-1 px-4 py-2">
                <div className="space-y-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => selectRole(role)}
                      className={cn(
                        'w-full p-4 rounded-2xl border text-left transition-all relative overflow-hidden group',
                        selectedRole?.id === role.id
                          ? 'bg-purple-600/10 border-purple-500/30 ring-1 ring-purple-500/20 shadow-xl'
                          : 'bg-transparent border-transparent hover:bg-white/5'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={cn(
                            'text-[10px] font-black uppercase tracking-tighter',
                            selectedRole?.id === role.id ? 'text-purple-400' : 'text-slate-500'
                          )}
                        >
                          {role.name}
                        </span>
                        {role.isSystem && <Fingerprint className="w-3 h-3 text-emerald-500/50" />}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium leading-tight line-clamp-2">
                        {role.description}
                      </p>

                      {selectedRole?.id === role.id && (
                        <motion.div
                          layoutId="active-role"
                          className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-purple-500 rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-6 bg-slate-950/50 border-t border-white/5">
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">
                      RBAC Engine Active
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase leading-tight italic">
                    Permissions are cached in Redis with 1h TTL for performance.
                  </p>
                </div>
              </div>
            </aside>

            {/* PERMISSIONS MATRIX (EXCEL-LIKE) */}
            <main className="flex-1 flex flex-col gap-6 overflow-hidden">
              {selectedRole ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedRole.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col h-full gap-6"
                  >
                    {/* ROLE HEADER ACTIONS */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                          {selectedRole.name}
                        </h2>
                        <div className="h-8 w-px bg-white/10" />
                        <button
                          onClick={() => {
                            setImpersonation(selectedRole.id);
                            toast.info(`Impersonation active: Testing as ${selectedRole.name}`);
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          Simulator Mode
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="p-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 hover:bg-red-600/20 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="h-12 px-8 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-purple-400 transition-all">
                          Apply Changes
                        </button>
                      </div>
                    </div>

                    {/* MATRIX CONTENT */}
                    <div className="flex-1 bg-[#05070a] rounded-[40px] border border-white/5 overflow-hidden flex flex-col">
                      <div className="flex-1 overflow-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                          <thead className="sticky top-0 z-20 bg-[#05070a]">
                            <tr className="border-b border-white/5">
                              <th className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-600 bg-slate-900/10">
                                Resource
                              </th>
                              {ACTIONS.map((action) => (
                                <th
                                  key={action}
                                  className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 text-center"
                                >
                                  {action}
                                </th>
                              ))}
                              <th className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-purple-500 text-right">
                                Scope
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {RESOURCES.map((res) => (
                              <ResourceRow key={res} resource={res} role={selectedRole} />
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="p-6 bg-slate-950/50 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                            <span className="text-[10px] font-black text-red-500 uppercase">
                              Warning: Risky modifications detected
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-600 font-bold italic">
                            Modifying 'System_Config' delete requires Admin 2FA.
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-500" /> Inherited
                          </span>
                          <span className="flex items-center gap-1.5">
                            <X className="w-3.5 h-3.5 text-red-500" /> Denied
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                  <div className="w-24 h-24 rounded-[32px] bg-slate-900/50 border border-dashed border-white/10 flex items-center justify-center">
                    <UserCog className="w-12 h-12 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 italic">
                      Select role for editing
                    </h3>
                    <p className="text-[11px] text-slate-700 uppercase font-black tracking-widest mt-2 max-w-[280px] leading-relaxed">
                      Neural access nodes idling. Choose a security tier to adjust granularity.
                    </p>
                  </div>
                </div>
              )}
            </main>
          </>
        ) : (
          /* 📜 AUDIT LOGS VIEW */
          <div className="flex-1 flex flex-col gap-6 bg-[#05070a] rounded-[40px] border border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-950/20">
              <div>
                <h4 className="text-xl font-black italic uppercase italic tracking-tighter">
                  Security Access Audit
                </h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 italic">
                  Real-time tracking of resource authorization events
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                <History className="w-4 h-4" />
                Clear Trail
              </button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-8">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 px-4">
                      <th className="pb-4 pl-4">Timestamp</th>
                      <th className="pb-4">Operator</th>
                      <th className="pb-4">Access Event</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 pr-4 text-right">Diagnostic</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="group bg-white/5 hover:bg-white/10 transition-all rounded-2xl overflow-hidden"
                      >
                        <td className="p-5 pl-8 rounded-l-2xl">
                          <div className="flex flex-col">
                            <span className="text-xs font-mono text-slate-400 font-black">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="text-[9px] text-slate-600 font-bold uppercase">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                              <Users className="w-4 h-4 text-indigo-500" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-white italic">
                                {log.userName}
                              </span>
                              <span className="text-[9px] text-slate-500 uppercase font-black">
                                {log.roleName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase font-mono">
                              {log.action}
                            </span>
                            <ArrowRightCircle className="w-3 h-3 text-slate-700" />
                            <span className="text-xs font-black text-slate-300 uppercase tracking-tighter">
                              {log.resource}
                            </span>
                          </div>
                        </td>
                        <td className="p-5">
                          <div
                            className={cn(
                              'flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest w-fit',
                              log.status === 'allowed'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                            )}
                          >
                            {log.status === 'allowed' ? (
                              <CheckCircle className="w-3.5 h-3.5" />
                            ) : (
                              <ShieldAlert className="w-3.5 h-3.5" />
                            )}
                            {log.status}
                          </div>
                        </td>
                        <td className="p-5 pr-8 rounded-r-2xl text-right">
                          <span className="text-[10px] text-slate-500 font-bold uppercase italic leading-none">
                            {log.metadata?.reason || 'Success validation'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceRow({ resource, role }: { resource: Resource; role: Role }) {
  const { updatePermission, updateScope } = useRbacStore();
  const currentPerm = role.permissions.find((p) => p.resource === resource);
  const currentScope = currentPerm?.scope || 'Own';

  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
      <td className="p-8">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-purple-500/20 rounded-full group-hover:bg-purple-500 transition-colors" />
          <div>
            <h5 className="text-sm font-black text-white uppercase italic tracking-tighter">
              {resource.replace('_', ' ')}
            </h5>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5 italic">
              API Endpoint Sync active
            </p>
          </div>
        </div>
      </td>
      {ACTIONS.map((action) => {
        const isEnabled = currentPerm?.actions.includes(action);
        return (
          <td key={action} className="p-8 text-center">
            <button
              onClick={() => updatePermission(role.id, resource, action, !isEnabled)}
              className={cn(
                'mx-auto w-10 h-10 rounded-xl flex items-center justify-center transition-all border',
                isEnabled
                  ? 'bg-purple-500 border-purple-400 shadow-[0_4px_12px_rgba(168,85,247,0.3)] text-white'
                  : 'bg-black/40 border-white/5 text-slate-800 hover:border-white/20'
              )}
            >
              {isEnabled ? (
                <Check className="w-5 h-5 font-black" />
              ) : (
                <Lock className="w-4 h-4 opacity-30" />
              )}
            </button>
          </td>
        );
      })}
      <td className="p-8 text-right">
        <div className="flex flex-col items-end gap-2">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            {SCOPES.map((s) => (
              <button
                key={s}
                onClick={() => updateScope(role.id, resource, s)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all',
                  currentScope === s
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-600 hover:text-slate-400'
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
            <Globe className="w-3 h-3 text-slate-500" />
            <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest italic">
              {currentScope} Scope effective
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}
