'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Search,
  QrCode,
  Smartphone,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Database,
  Cpu,
  Zap,
  CheckCircle2,
  FileSearch,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default function GlobalVerificationPage() {
  const [searchId, setSearchId] = useState('');

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-8 p-12 bg-[#020408] items-center justify-center">
      {/* 🌐 BG ANIMATION */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="z-10 flex flex-col items-center gap-12 w-full max-w-4xl">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">
              Trust-as-a-Service Engine
            </span>
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
            Global Traceability <br /> <span className="text-blue-500">Explorer</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] max-w-lg mx-auto">
            Search and audit any batch, certification, or agricultural asset across the
            decentralized AgroDeep ledger.
          </p>
        </div>

        {/* SEARCH HUD */}
        <div className="w-full max-w-2xl group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-[32px] blur opacity-25 group-focus-within:opacity-50 transition-all" />
            <div className="relative flex items-center bg-slate-950 border border-white/10 rounded-[28px] p-2 pr-4 h-24">
              <div className="w-16 h-16 flex items-center justify-center text-slate-700">
                <QrCode className="w-8 h-8" />
              </div>
              <input
                type="text"
                placeholder="ENTER BATCH ID OR CERTIFICATE HASH..."
                className="flex-1 bg-transparent border-none text-white font-black italic text-xl placeholder:text-slate-800 focus:ring-0 uppercase tracking-tighter"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <button className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-3 transition-all group/btn shadow-xl shadow-blue-500/20">
                <span className="text-xs font-black uppercase tracking-widest">
                  Execute Deep Scan
                </span>
                <Search className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* QUICK LINKS / RECENT */}
        <div className="grid grid-cols-3 gap-8 w-full">
          <FeatureCard
            icon={Cpu}
            label="Public Verification"
            desc="Generate consumer-facing transparency pages."
            action="OPEN DASHBOARD"
          />
          <FeatureCard
            icon={Database}
            label="Ledger Health"
            desc="99.9% Sync across Hyperledger nodes."
            action="VIEW STATUS"
          />
          <FeatureCard
            icon={Globe}
            label="API Integration"
            desc="Third-party docs for Supermarket sync."
            action="READ DOCS"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, label, desc, action }: any) {
  return (
    <Card className="bg-black/40 border-white/5 p-8 rounded-[32px] hover:border-blue-500/30 transition-all group flex flex-col gap-6">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">{label}</h4>
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight leading-relaxed">
          {desc}
        </p>
      </div>
      <button className="mt-auto flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest group-hover:gap-4 transition-all">
        {action}
        <ArrowRight className="w-4 h-4" />
      </button>
    </Card>
  );
}
