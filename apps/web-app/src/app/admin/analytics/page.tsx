'use client';

import React from 'react';
import { AdvancedAnalytics } from '@/components/admin/analytics/AdvancedAnalytics';
import { BarChart3, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-400 pb-20 overflow-x-hidden">
      {/* 🛸 ANALYTICS HEADER */}
      <header className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <BarChart3 className="w-8 h-8 text-black" />
              </div>
              Advanced Analytics Hub
            </h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
              Data Intelligence & Predictive Modeling • v5.0
            </p>
          </div>
        </div>
      </header>

      <main className="px-8">
        <AdvancedAnalytics />
      </main>

      {/* 🛠️ BOTTOM FLOATING STATUS BAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-8 shadow-2xl z-[50]">
         <StatusMini label="OLAP_ENGINE" status="online" />
         <div className="w-px h-4 bg-white/10" />
         <StatusMini label="PREDICT_AI" status="online" />
         <div className="w-px h-4 bg-white/10" />
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] font-black text-white uppercase italic tracking-widest">Real-time Data Stream Enabled</span>
         </div>
      </div>
    </div>
  );
}

function StatusMini({ label, status }: { label: string, status: 'online' | 'offline' }) {
  return (
    <div className="flex items-center gap-3">
       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
       <div className={cn(
         "w-2 h-2 rounded-full",
         status === 'online' ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]" : "bg-red-500"
       )} />
    </div>
  );
}
