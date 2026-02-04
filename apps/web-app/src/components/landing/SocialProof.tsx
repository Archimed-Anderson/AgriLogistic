'use client';

import React from 'react';
import { ShieldCheck, Globe, Zap, Leaf, Landmark, Factory } from 'lucide-react';
import { cn } from '@/lib/utils';

const partners = [
  {
    name: 'AgriSupply',
    logo: <Landmark className="h-6 w-6" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    name: 'GlobalFarm',
    logo: <Globe className="h-6 w-6" />,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    name: 'EcoLogistics',
    logo: <Leaf className="h-6 w-6" />,
    color: 'text-lime-600',
    bg: 'bg-lime-50',
  },
  {
    name: 'SmartMarket',
    logo: <Zap className="h-6 w-6" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    name: 'TechHarvest',
    logo: <Landmark className="h-6 w-6" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    name: 'BioTrade',
    logo: <Factory className="h-6 w-6" />,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
];

export function SocialProof() {
  return (
    <section className="py-24 relative overflow-hidden bg-white/30 backdrop-blur-sm border-y border-slate-100">
      <div className="container px-6 mx-auto relative z-10">
        {/* Header with Trust Badge */}
        <div className="flex flex-col items-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-emerald-100/50">
            <ShieldCheck className="h-3 w-3" />
            Écosystème de Confiance
          </div>
          <p className="text-center text-slate-400 font-bold max-w-lg leading-relaxed">
            Ils nous font confiance pour sécuriser et optimiser leur chaîne d'approvisionnement
            agricole à l'échelle mondiale.
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative flex overflow-hidden group">
          <div className="flex animate-marquee whitespace-nowrap gap-12 items-center py-4">
            {[...partners, ...partners].map((partner, idx) => (
              <div
                key={`${partner.name}-${idx}`}
                className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 group/item"
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover/item:scale-110',
                    partner.bg,
                    partner.color
                  )}
                >
                  {partner.logo}
                </div>
                <div className="flex flex-col mt-0.5">
                  <span className="text-lg font-black text-slate-900 tracking-tight">
                    {partner.name}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Partenaire Certifié
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Fades for smooth edge transition */}
          <div className="absolute top-0 left-0 h-full w-40 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-40 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
