'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#050505] text-white selection:bg-red-500/30">
      {/* Subtle Background Glow - Red for Error */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center px-4"
      >
        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-4 bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          System Fault
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none translate-x-[-2px]">
          Une Erreur <br />
          <span className="text-red-500">Logistique</span> est Survenue
        </h1>
        
        <p className="max-w-md text-slate-400 text-lg font-medium leading-relaxed italic mb-8">
          Le centre de contrôle a rencontré une interruption inattendue. 
          Nos ingénieurs ont été notifiés de cet incident.
        </p>

        {error.digest && (
          <div className="mb-8 font-mono text-[10px] text-slate-600 bg-white/5 px-3 py-1 rounded">
            ID de l'incident: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => reset()}
            className="group relative flex h-16 items-center justify-center gap-3 bg-white text-black font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 rounded-2xl shadow-2xl shadow-white/10 px-10"
          >
            Réinitialiser le Système
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex h-16 items-center justify-center gap-3 bg-transparent border-2 border-white/10 hover:border-white/30 text-white font-black uppercase tracking-widest text-xs transition-all rounded-2xl px-10"
          >
            Retour Accueil
          </button>
        </div>
      </motion.div>

      {/* Footer Decoration */}
      <div className="absolute bottom-8 text-[9px] font-mono text-slate-800 uppercase tracking-[0.5em] select-none">
        AgriLogistic_System_Fault_500
      </div>
    </div>
  );
}
