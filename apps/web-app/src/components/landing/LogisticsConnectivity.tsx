'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Truck, MapPin, Zap, Globe, Package, Loader2 } from 'lucide-react';

export function LogisticsConnectivity() {
  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto flex items-center justify-center p-8 bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Pulsing Core */}
      <div className="relative z-10 w-32 h-32 rounded-3xl bg-blue-600 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] border border-blue-400/20">
        <Globe className="h-12 w-12 text-white animate-pulse" />
        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest mt-2">
          Link Hub
        </span>
      </div>

      {/* Orbital Connections */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[450px] h-[450px] rounded-full border border-blue-500/10 animate-spin-very-slow" />
        <div className="w-[300px] h-[300px] rounded-full border border-dashed border-blue-500/20 animate-spin-slow-reverse" />
      </div>

      {/* Floating Truck Nodes */}
      <div className="absolute top-[15%] left-[20%] animate-float">
        <div className="glass px-4 py-2 rounded-2xl flex items-center gap-3 border border-blue-500/20 shadow-xl bg-slate-900/90">
          <Truck className="h-4 w-4 text-blue-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white uppercase">TRK-294</span>
            <span className="text-[8px] text-emerald-400 font-bold uppercase">En Route</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[20%] right-[15%] animate-float-delayed">
        <div className="glass px-4 py-2 rounded-2xl flex items-center gap-3 border border-orange-500/20 shadow-xl bg-slate-900/90">
          <Package className="h-4 w-4 text-orange-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white uppercase">Fret-88</span>
            <span className="text-[8px] text-blue-400 font-bold uppercase">Appairage...</span>
          </div>
        </div>
      </div>

      {/* AI Matching Lines Visual */}
      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      >
        <path
          d="M 120 150 Q 300 300 480 450"
          stroke="url(#grad1)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5 5"
          className="animate-[dash_3s_linear_infinite]"
        />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      {/* Bottom Status Card */}
      <div className="absolute bottom-10 left-10 right-10 p-5 glass rounded-2xl border border-white/5 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Zap className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">
                Matching Optimisé
              </p>
              <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">
                IA v4.2 Active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />
            <span className="text-[8px] font-black text-blue-500 uppercase">Analyse Dynamique</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-spin-very-slow {
          animation: spin 30s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin 20s linear infinite reverse;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
