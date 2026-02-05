'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#050505] text-white selection:bg-emerald-500/30">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center px-4"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
          Erreur 404
        </span>
        
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-none translate-x-[-2px]">
          Page Introuvable
        </h1>
        
        <p className="max-w-md text-slate-400 text-lg font-medium leading-relaxed italic mb-12">
          L'adresse que vous avez saisie n'existe pas ou a été déplacée. 
          Vérifiez l'URL ou retournez au centre de contrôle.
        </p>

        <Link
          href="/"
          className="group relative flex h-16 items-center justify-center gap-3 bg-emerald-500 px-10 text-black font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 rounded-2xl shadow-2xl shadow-emerald-500/20"
        >
          Retour au Dashboard
          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </motion.div>

      {/* Footer Decoration */}
      <div className="absolute bottom-8 text-[9px] font-mono text-slate-800 uppercase tracking-[0.5em] select-none">
        AgriLogistic_System_Runtime_404
      </div>
    </div>
  );
}
