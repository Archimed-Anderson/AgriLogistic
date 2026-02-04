'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Zap,
  Activity,
  ShieldCheck,
  BrainCircuit,
  Gavel,
  Scale,
  Tag,
  Image as ImageIcon,
  Flag,
  Ban,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useMarketplaceStore,
  MarketOffer,
} from '@/store/marketplaceStore';
import { Card } from '@/components/ui/card';
import type { MarketCategory, PriceTrend } from '@/store/marketplaceStore';

const MarketplaceGrid = dynamic(
  () => import('@/components/admin/operations/MarketplaceGrid').then((m) => ({ default: m.MarketplaceGrid })),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Chargement grille...</div> }
);

export default function MarketplaceSupervisionPage() {
  const {
    offers,
    trends,
    selectedOffer,
    selectOffer,
    updateOfferStatus,
    crisisMode,
    toggleCrisisMode,
  } = useMarketplaceStore();
  const [activeTab, setActiveTab] = useState<'mod' | 'matching' | 'economics'>('mod');

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      {/* 🚀 MARKET VITALS HUD */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <MarketStatCard
          label="Live Offers"
          value={offers.filter((o) => o.status === 'active').length}
          sub="Active Listings"
          icon={ShoppingBag}
          color="text-blue-500"
        />
        <MarketStatCard
          label="Avg Price Flow"
          value="+5.2%"
          sub="Weekly Deviation"
          icon={TrendingUp}
          color="text-emerald-500"
        />
        <MarketStatCard
          label="Anomalies Detected"
          value={offers.filter((o) => o.anomalies?.length).length}
          sub="Moderation Required"
          icon={AlertCircle}
          color="text-amber-500"
        />
        <MarketStatCard
          label="Match Rate"
          value="88%"
          sub="AI Optimization"
          icon={Zap}
          color="text-purple-500"
        />
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* LEFT STAGE: MODERATION & TRENDS */}
        <main className="flex-1 flex flex-col gap-6 overflow-hidden">
          <header className="flex items-center justify-between shrink-0">
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
              {[
                { id: 'mod', label: 'Offer Moderation', icon: Scale },
                { id: 'matching', label: 'Matching Engine', icon: BrainCircuit },
                { id: 'economics', label: 'Market Controls', icon: Gavel },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2',
                    activeTab === tab.id
                      ? 'bg-white/10 text-white shadow-lg'
                      : 'text-slate-500 hover:text-white'
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleCrisisMode}
                className={cn(
                  'h-10 px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all border',
                  crisisMode
                    ? 'bg-red-600 border-red-500 text-white animate-pulse shadow-lg shadow-red-500/20'
                    : 'bg-white/5 border-white/10 text-slate-500'
                )}
              >
                <AlertCircle className="w-4 h-4" />
                Crisis Mode: {crisisMode ? 'ACTIVE' : 'OFF'}
              </button>
              <button className="h-10 px-4 bg-emerald-500 text-black rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                <Activity className="w-4 h-4" />
                Live Tape
              </button>
            </div>
          </header>

          {/* TAB CONTENT */}
          <div className="flex-1 bg-[#05070a] rounded-[40px] border border-white/5 overflow-hidden flex flex-col relative">
            {activeTab === 'mod' && (
              <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-black italic tracking-tighter text-white uppercase italic">
                      Active Listings Queue
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      Verifying product quality & price integrity
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white">
                      <Filter className="w-4 h-4" />
                    </button>
                    <button className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                  <MarketplaceGrid offers={offers} onRowClicked={selectOffer} />
                </div>
              </div>
            )}

            {activeTab === 'matching' && (
              <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                    className="w-48 h-48 rounded-full border border-dashed border-indigo-500/30 flex items-center justify-center"
                  >
                    <div className="w-32 h-32 rounded-full border border-indigo-500/50 flex items-center justify-center">
                      <BrainCircuit className="w-16 h-16 text-indigo-500 animate-pulse" />
                    </div>
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-64 h-64 text-indigo-500/10" />
                  </div>
                </div>
                <div className="space-y-4 max-w-sm">
                  <h4 className="text-sm font-black uppercase tracking-[0.4em] text-indigo-400 italic">
                    Neural Matching Engine v2
                  </h4>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                    AI is currently analyzing supply nodes vs demand clusters.
                    <span className="block mt-2 text-white italic">
                      Current efficiency: 0.94 Match Score
                    </span>
                  </p>
                  <button className="h-12 px-8 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20">
                    Optimize Handshake
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'economics' && (
              <div className="flex-1 p-8 grid grid-cols-2 gap-8 overflow-y-auto no-scrollbar">
                {trends.map((trend) => (
                  <Card
                    key={trend.product}
                    className="p-6 bg-slate-950/40 border-white/5 rounded-3xl space-y-6 group hover:border-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                          <Tag className="w-6 h-6 text-slate-500" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black italic tracking-tighter uppercase leading-none">
                            {trend.product}
                          </h4>
                          <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest italic">
                            {trend.region}
                          </span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase italic',
                          trend.change > 0
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                        )}
                      >
                        {trend.change > 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {Math.abs(trend.change)}%
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-600 uppercase font-black mb-1">
                          Current Equilibrium
                        </span>
                        <span className="text-2xl font-black font-mono tracking-tighter text-white">
                          {trend.currentPrice}{' '}
                          <span className="text-[10px] text-slate-500 font-bold tracking-normal italic uppercase">
                            XOF/KG
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button className="h-8 px-4 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all">
                          Set Cap
                        </button>
                        <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest">
                          History: {trend.previousPrice} XOF
                        </span>
                      </div>
                    </div>

                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${60 + trend.change}%` }}
                        className={cn('h-full', trend.change > 0 ? 'bg-emerald-500' : 'bg-red-500')}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* RIGHT STAGE: OFFER INSPECTOR */}
        <aside className="w-[420px] xl:w-[480px] flex flex-col gap-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedOffer ? (
              <motion.div
                key={selectedOffer.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex-1 flex flex-col gap-6 overflow-hidden"
              >
                <Card className="flex-1 p-8 bg-slate-950/40 backdrop-blur-2xl border-white/5 rounded-[40px] flex flex-col gap-8 shadow-2xl overflow-y-auto no-scrollbar">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">
                          Moderation Active
                        </span>
                        <p className="text-[9px] font-mono text-slate-500 uppercase font-black italic">
                          NLP Sentiment: {selectedOffer.sentiment}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => selectOffer(null)}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-600"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="aspect-video bg-slate-900 rounded-[32px] border border-white/5 relative overflow-hidden group">
                      <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity">
                        <ImageIcon className="w-12 h-12 text-slate-500" />
                      </div>
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <span className="px-2 py-1 rounded bg-black/60 border border-white/5 text-[8px] font-black uppercase text-white backdrop-blur-md">
                          IMG_9918.RAW
                        </span>
                        <span className="px-2 py-1 rounded bg-emerald-500/80 text-black text-[8px] font-black uppercase backdrop-blur-md">
                          CV VERIFIED
                        </span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                        {selectedOffer.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-2">
                        <User className="w-3 h-3 text-slate-600" />
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                          {selectedOffer.farmerName} • {selectedOffer.location}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-white/5 border border-white/5 rounded-3xl">
                        <span className="text-[8px] text-slate-600 uppercase font-black">
                          Quantity Unit
                        </span>
                        <p className="text-xl font-black text-white italic leading-none mt-1">
                          {selectedOffer.quantity}{' '}
                          <span className="text-xs uppercase opacity-30">{selectedOffer.unit}</span>
                        </p>
                      </div>
                      <div className="p-5 bg-white/5 border border-white/5 rounded-3xl">
                        <span className="text-[8px] text-slate-600 uppercase font-black">
                          Unit Price
                        </span>
                        <p className="text-xl font-black text-emerald-500 italic leading-none mt-1">
                          {selectedOffer.price}{' '}
                          <span className="text-xs text-slate-500 tracking-normal uppercase opacity-60">
                            XOF
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedOffer.anomalies && selectedOffer.anomalies.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                        Security Red-Flags
                      </h3>
                      <div className="space-y-2">
                        {selectedOffer.anomalies.map((an, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center gap-3"
                          >
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-[10px] font-black text-red-500/80 uppercase">
                              {an}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                      Matching Diagnostics
                    </h3>
                    <div className="bg-slate-900/50 p-6 rounded-[32px] border border-white/5 space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Best Buyer Match</span>
                        <span className="text-white italic">Global Foods CI (0.97)</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Sentiment Score</span>
                        <span className="text-emerald-500 italic">Positive Analysis</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">History Reliability</span>
                        <span className="text-white italic">14 Deals / 0 Claims</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => updateOfferStatus(selectedOffer.id, 'active')}
                        className="h-14 bg-emerald-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve Offer
                      </button>
                      <button
                        onClick={() => updateOfferStatus(selectedOffer.id, 'rejected')}
                        className="h-14 bg-white/5 border border-white/10 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Ban className="w-4 h-4" />
                        Reject Listing
                      </button>
                    </div>
                    <button className="h-12 bg-red-600/10 border border-red-500/20 text-red-500 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-red-600/20 transition-all flex items-center justify-center gap-2">
                      <Flag className="w-4 h-4" />
                      Flag for Investigation
                    </button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-900/10 rounded-[40px] border border-dashed border-white/5 space-y-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-24 h-24 rounded-[40px] bg-slate-900/50 border border-white/10 flex items-center justify-center"
                  >
                    <ShoppingBag className="w-10 h-10 text-slate-800" />
                  </motion.div>
                  <div className="absolute -right-2 -top-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-[#020408]">
                    <Activity className="w-3 h-3 text-black" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-[0.4em] text-slate-600 italic">
                    Market Insight Idle
                  </h4>
                  <p className="text-[11px] text-slate-700 uppercase font-black tracking-widest mt-3 max-w-[280px]">
                    Select an offer from the queue to perform AI diagnostic and economic audit.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-[280px]">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase">
                      Top Product
                    </span>
                    <span className="text-xs font-black text-white italic">Cacao CI</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase">
                      Daily Vol
                    </span>
                    <span className="text-xs font-black text-white italic">4.2M XOF</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}

function MarketStatCard({ label, value, sub, icon: Icon, color }: any) {
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

function User({ className }: { className?: string }) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );
}
