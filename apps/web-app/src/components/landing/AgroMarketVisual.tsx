'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ShoppingCart, TrendingUp, Briefcase, ShieldCheck, Globe, Store } from 'lucide-react';
import Image from 'next/image';

export function AgroMarketVisual() {
  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto flex items-center justify-center p-4 bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
      {/* Background Trading Image */}
      <div className="absolute inset-0 opacity-40">
        <Image
          src="/images/landing/market-visual.png"
          alt="Trading Floor"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
      </div>

      {/* Floating Price Ticker Labels */}
      <div className="absolute top-10 left-10 animate-float">
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border border-emerald-500/20 bg-slate-900/80">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white uppercase">CACAO</span>
            <span className="text-[8px] text-emerald-400 font-bold">+2.4%</span>
          </div>
        </div>
      </div>

      <div className="absolute top-20 right-10 animate-float-delayed">
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border border-orange-500/20 bg-slate-900/80">
          <TrendingUp className="h-4 w-4 text-orange-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white uppercase">MAIS</span>
            <span className="text-[8px] text-orange-400 font-bold">-0.8%</span>
          </div>
        </div>
      </div>

      {/* Central Interactive Module */}
      <div className="relative z-10 w-48 h-48 rounded-[2.5rem] bg-white flex flex-col items-center justify-center shadow-3xl border border-slate-100 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50 opacity-50" />
        <Store className="h-16 w-16 text-primary mb-3 animate-pulse" />
        <span className="text-[12px] font-black text-primary uppercase tracking-[0.2em]">
          Storefront
        </span>
        
        {/* Animated Order Lines */}
        <div className="absolute bottom-4 flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-8 h-1 bg-primary/10 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-primary animate-shimmer"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Participant Avatars */}
      <div className="absolute bottom-[20%] left-[15%] group">
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
             <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white">
               {String.fromCharCode(64 + i)}
             </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
            +12
          </div>
        </div>
        <p className="mt-2 text-[10px] font-bold text-white/60 uppercase tracking-widest text-center">
          Active Buyers
        </p>
      </div>

      {/* Secure Transaction Badge */}
      <div className="absolute bottom-10 right-10 p-4 glass rounded-2xl border border-white/10 bg-emerald-500/10 backdrop-blur-xl shadow-2xl animate-bounce-slow">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-[10px] font-black text-white uppercase">Escrow Secure</p>
            <p className="text-[8px] text-emerald-400 font-bold">100% GARANTI</p>
          </div>
        </div>
      </div>

      {/* Decorative Connection lines */}
      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
      >
        <circle cx="300" cy="300" r="250" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 8" className="animate-spin-very-slow" />
      </svg>
    </div>
  );
}
