'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  Filter,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Scale,
  Gavel,
  FileText,
  Paperclip,
  Send,
  MoreVertical,
  User,
  Users,
  Truck,
  HeartPulse,
  Ban,
  Phone,
  LayoutDashboard,
  Zap,
  Radio,
  Download,
  Link as LinkIcon,
  Image as ImageIcon,
  Cpu,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useSupportStore,
  SupportTicket,
  TicketPriority,
  TicketStatus,
  DisputeStage,
  Message,
} from '@/store/supportStore';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export default function SupportCenterPage() {
  const {
    tickets,
    selectedTicket,
    selectTicket,
    filter,
    setFilter,
    addMessage,
    updateTicketStatus,
    updateDisputeStage,
  } = useSupportStore();
  const [messageInput, setMessageInput] = useState('');

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchStatus = filter.status === 'all' || t.status === filter.status;
      const matchPriority = filter.priority === 'all' || t.priority === filter.priority;
      return matchStatus && matchPriority;
    });
  }, [tickets, filter]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedTicket) return;
    addMessage(selectedTicket.id, {
      senderId: 'A-001',
      senderName: 'Agent Direct',
      content: messageInput,
      type: 'agent',
    });
    setMessageInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      {/* 🟢 SLA & VITALS HUD */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <SupportStatCard
          label="P0 Tickets"
          value={tickets.filter((t) => t.priority === 'P0' && t.status === 'open').length}
          sub="Immediate Action"
          icon={ShieldAlert}
          color="text-red-500"
        />
        <SupportStatCard
          label="Avg Response"
          value="1h 12m"
          sub="Inside SLA Target"
          icon={Clock}
          color="text-emerald-500"
        />
        <SupportStatCard
          label="Active Disputes"
          value={tickets.filter((t) => t.type === 'Dispute' && t.status !== 'closed').length}
          sub="Arbitration Queue"
          icon={Scale}
          color="text-amber-500"
        />
        <SupportStatCard
          label="Customer CSAT"
          value="4.8/5"
          sub="Monthly Average"
          icon={CheckCircle2}
          color="text-blue-500"
        />
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* 📋 TICKETS SIDEBAR */}
        <aside className="w-80 xl:w-[380px] flex flex-col gap-4 bg-slate-900/10 rounded-[40px] border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                Inbox
              </h3>
              <div className="flex gap-2">
                <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-black border border-red-500/20">
                  {tickets.filter((t) => t.priority === 'P0').length} P0
                </span>
              </div>
            </div>
            <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
              {['all', 'open', 'pending', 'resolved'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter({ status: s as any })}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all',
                    filter.status === s
                      ? 'bg-white/10 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1 px-4 py-2">
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => selectTicket(ticket)}
                  className={cn(
                    'w-full p-4 rounded-3xl border text-left transition-all relative overflow-hidden group',
                    selectedTicket?.id === ticket.id
                      ? 'bg-white/10 border-white/20 shadow-xl scale-[1.02]'
                      : 'bg-transparent border-transparent hover:bg-white/5'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full animate-pulse',
                          ticket.priority === 'P0'
                            ? 'bg-red-500'
                            : ticket.priority === 'P1'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                        )}
                      />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                        #{ticket.id}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 font-black">
                      {ticket.createdAt.split('T')[1].slice(0, 5)}
                    </span>
                  </div>
                  <h4
                    className={cn(
                      'text-[11px] font-black uppercase tracking-tight mb-2 line-clamp-1',
                      selectedTicket?.id === ticket.id
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-white'
                    )}
                  >
                    {ticket.subject}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                      {ticket.clientName}
                    </span>
                    <div className="flex items-center gap-2">
                      {ticket.type === 'Dispute' && <Scale className="w-3 h-3 text-amber-500/50" />}
                      <ChevronRight
                        className={cn(
                          'w-4 h-4 transition-transform',
                          selectedTicket?.id === ticket.id
                            ? 'translate-x-1 text-emerald-500'
                            : 'text-slate-800'
                        )}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* 💬 CONVERSATION VIEW */}
        <main className="flex-1 flex flex-col bg-slate-950/30 rounded-[40px] border border-white/5 overflow-hidden">
          {selectedTicket ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="p-6 border-b border-white/5 bg-slate-950/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase text-white tracking-widest leading-none">
                      {selectedTicket.subject}
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">
                      {selectedTicket.clientName} • {selectedTicket.clientId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 px-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 font-mono text-[10px] font-black text-slate-400">
                    SLA:{' '}
                    <span
                      className={cn(
                        new Date() > new Date(selectedTicket.slaLimit)
                          ? 'text-red-500'
                          : 'text-emerald-500'
                      )}
                    >
                      {new Date(selectedTicket.slaLimit).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as any)}
                    className="h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase text-white outline-none cursor-pointer"
                  >
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </header>

              <ScrollArea className="flex-1 p-8">
                <div className="space-y-8 max-w-3xl mx-auto">
                  <div className="flex flex-col items-center gap-4 py-8 border-b border-white/5">
                    <div className="p-4 bg-slate-900/50 rounded-2xl text-[11px] text-slate-400 font-medium leading-relaxed italic text-center max-w-sm">
                      "{selectedTicket.description}"
                    </div>
                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">
                      Initial Request opened @ {new Date(selectedTicket.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {selectedTicket.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex flex-col gap-2',
                        msg.type === 'client'
                          ? 'items-start'
                          : msg.type === 'agent'
                            ? 'items-end'
                            : 'items-center'
                      )}
                    >
                      {msg.type === 'system' ? (
                        <div className="px-6 py-2 rounded-full bg-slate-900 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                          {msg.content}
                        </div>
                      ) : (
                        <div
                          className={cn(
                            'max-w-[80%] p-6 rounded-[32px] text-sm',
                            msg.type === 'client'
                              ? 'bg-white/5 rounded-bl-none border border-white/5'
                              : 'bg-emerald-500 text-black font-medium rounded-br-none shadow-xl shadow-emerald-500/10'
                          )}
                        >
                          {msg.content}
                          <div
                            className={cn(
                              'text-[8px] font-black uppercase mt-3 opacity-60',
                              msg.type === 'client' ? 'text-slate-500' : 'text-black'
                            )}
                          >
                            {msg.senderName} •{' '}
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <footer className="p-6 border-t border-white/5 bg-slate-950/40">
                <div className="flex gap-4 max-w-4xl mx-auto">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <Paperclip className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your strategic response..."
                      className="w-full h-12 bg-black/40 border border-white/10 rounded-2xl px-6 text-sm text-white placeholder:text-slate-700 outline-none focus:border-emerald-500/30 transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3 text-slate-600">
                      <ImageIcon className="w-4 h-4 hover:text-white cursor-pointer" />
                      <FileText className="w-4 h-4 hover:text-white cursor-pointer" />
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    className="h-12 w-12 bg-emerald-500 text-black rounded-2xl flex items-center justify-center shrink-0 hover:scale-105 transition-all shadow-lg shadow-emerald-500/10"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest hover:text-white cursor-pointer transition-colors">
                    Internal Note (Hidden)
                  </span>
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest hover:text-white cursor-pointer transition-colors">
                    Suggest AI Answer
                  </span>
                </div>
              </footer>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6 opacity-30">
              <div className="w-24 h-24 rounded-[40px] bg-slate-900/50 border border-dashed border-white/10 flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 italic">
                  Operator Standing By
                </h4>
                <p className="text-[11px] text-slate-700 uppercase font-black tracking-widest mt-3 max-w-[280px]">
                  Select a communication node to begin arbitration or support protocols.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* ⚖️ DISPUTE & AUDIT PANEL */}
        <aside className="w-[420px] xl:w-[480px] flex flex-col gap-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedTicket && selectedTicket.type === 'Dispute' ? (
              <motion.div
                key="dispute"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex-1 flex flex-col gap-6 overflow-hidden"
              >
                <Card className="flex-1 p-8 bg-slate-950/40 backdrop-blur-2xl border-white/5 rounded-[40px] flex flex-col gap-8 shadow-2xl overflow-y-auto no-scrollbar">
                  <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Gavel className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">
                          Arbitration Module
                        </h3>
                        <p className="text-[9px] font-mono text-slate-500 uppercase font-black italic">
                          Active Phase: {selectedTicket.disputeData?.stage}
                        </p>
                      </div>
                    </div>
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shrink-0">
                      <button className="p-2 text-slate-500 hover:text-white">
                        <Zap className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-500 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </header>

                  {/* Dispute Progress */}
                  <div className="relative flex justify-between px-2">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-800 -translate-y-1/2 -z-10" />
                    {['Opening', 'Mediation', 'Arbitration', 'Closed'].map((s, idx) => (
                      <div key={s} className="flex flex-col items-center gap-2">
                        <div
                          className={cn(
                            'w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black',
                            selectedTicket.disputeData?.stage === s
                              ? 'bg-amber-500 border-amber-500 text-black'
                              : 'bg-slate-950 border-slate-800 text-slate-600'
                          )}
                        >
                          {idx + 1}
                        </div>
                        <span className="text-[8px] font-black uppercase text-slate-600">{s}</span>
                      </div>
                    ))}
                  </div>

                  {/* Transaction Context */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                      Context Deep-Link
                    </h4>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-slate-600 uppercase font-black">
                            Contract Value
                          </span>
                          <span className="text-xl font-black font-mono text-white tracking-tighter italic">
                            {selectedTicket.disputeData?.claimAmount}
                          </span>
                        </div>
                        <div className="h-10 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                          <LinkIcon className="w-3 h-3 text-emerald-500" />
                          <span className="text-[9px] font-black uppercase text-emerald-500">
                            View Deal
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-slate-600 uppercase font-black">
                            Farmer Status
                          </span>
                          <span className="text-[11px] font-black text-slate-300 uppercase italic">
                            KYC Lvl 3 • Verified
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-slate-600 uppercase font-black">
                            Transport IoT
                          </span>
                          <span className="text-[11px] font-black text-emerald-500 uppercase italic">
                            Stable Temp (4°C)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Evidence Vault */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                      Evidence Vault
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedTicket.disputeData?.evidence.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-white/10 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 group-hover:text-white transition-colors uppercase truncate">
                              {ev.type}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-600 font-bold uppercase">
                            {ev.description}
                          </span>
                        </div>
                      ))}
                      <button className="p-4 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity gap-2">
                        <PlusIcon className="w-5 h-5" />
                        <span className="text-[9px] font-black uppercase">Add Evidence</span>
                      </button>
                    </div>
                  </div>

                  {/* Final Decision Tools */}
                  <div className="mt-auto space-y-4 pt-6 border-t border-white/10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                      Strategic Resolution
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="h-14 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-emerald-400 transition-all flex flex-col items-center justify-center leading-none gap-1">
                        <span>Payout Claim</span>
                        <span className="text-[8px] font-bold opacity-60">Smart Contract Auto</span>
                      </button>
                      <button className="h-14 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-red-500 transition-all flex flex-col items-center justify-center leading-none gap-1">
                        <span>Reject Claim</span>
                        <span className="text-[8px] font-bold opacity-60">
                          Requires Justification
                        </span>
                      </button>
                    </div>
                  </div>
                </Card>

                <div className="bg-slate-950/40 border border-white/5 p-5 rounded-[40px] flex items-center gap-4 shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5 italic">
                      Resolution Simulator
                    </p>
                    <p className="text-[9px] font-bold text-slate-600 truncate tracking-tight uppercase">
                      Impact analysis: -2% Trust Score for Buyer #B112
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="vitals"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col gap-6"
              >
                <Card className="p-8 bg-slate-950/40 border-white/5 rounded-[40px] flex flex-col gap-8 shadow-2xl">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    Global Service Health
                  </h3>

                  <div className="space-y-6">
                    <ProgressStat
                      label="CSAT Satisfaction"
                      value={96}
                      color="bg-blue-500"
                      sub="Goal: 95%"
                    />
                    <ProgressStat
                      label="MTTR (Resolution)"
                      value={84}
                      color="bg-emerald-500"
                      sub="Goal: < 24h"
                    />
                    <ProgressStat
                      label="SLA Compliance"
                      value={91}
                      color="bg-purple-500"
                      sub="Goal: 98%"
                    />
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                      AI Classification Feed
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
                        <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          Detecting fraud pattern in Dispute #TX-99...
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
                        <Database className="w-4 h-4 text-slate-700" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                          Syncing internal notes with MongoDB Cluster Alpha
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <button className="h-24 bg-slate-900 border border-white/5 rounded-[40px] flex items-center justify-center gap-4 group transition-all hover:bg-white/5">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Download className="w-6 h-6 text-slate-300" />
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1.5 italic">
                      UEMOA Report Engine
                    </span>
                    <span className="text-sm font-bold text-white tracking-tight">
                      Generate Regulatory Compliance Export
                    </span>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}

function SupportStatCard({ label, value, sub, icon: Icon, color }: any) {
  return (
    <Card className="p-6 bg-slate-950/40 border-white/5 rounded-3xl flex items-center gap-6 hover:border-white/10 transition-colors group relative overflow-hidden">
      <div className="absolute -right-4 -top-4 opacity-[0.02] group-hover:opacity-[0.08] transition-all">
        <Icon className="w-24 h-24 text-white" />
      </div>
      <div
        className={cn(
          'w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0',
          color
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black italic tracking-tighter text-white font-mono">
            {value}
          </span>
          <span className={cn('text-[9px] font-bold uppercase', color)}>{sub}</span>
        </div>
      </div>
    </Card>
  );
}

function ProgressStat({ label, value, color, sub }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-400">{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={cn('h-full rounded-full transition-all', color)}
        />
      </div>
      <span className="text-[8px] text-slate-600 font-bold uppercase block text-right">{sub}</span>
    </div>
  );
}

function PlusIcon({ className }: any) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
