import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { Button } from '@/app/components/ui/button';

export function ImpersonationBanner() {
  const { impersonatingId, impersonatedUser, stopImpersonation } = useAuthStore();

  return (
    <AnimatePresence>
      {impersonatingId && (
        <motion.div
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] h-14 bg-rose-600 border-b border-rose-700 shadow-xl flex items-center justify-between px-6 backdrop-blur-md bg-opacity-95"
        >
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                Mode Impersonation :
              </span>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/10">
                <UserIcon className="w-3 h-3 text-white/70" />
                <span className="text-[11px] font-black text-white tracking-tight">
                  {impersonatedUser?.name || 'Utilisateur Cible'}
                </span>
                <span className="text-[9px] font-mono text-white/50 uppercase">
                  [{impersonatedUser?.role}]
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <p className="hidden md:block text-[10px] font-black text-white/70 uppercase tracking-widest text-right">
              Toutes vos actions sont auditées comme <br />{' '}
              <span className="text-white">IMPERSONATE_SESSION</span>
            </p>
            <Button
              onClick={stopImpersonation}
              className="bg-white text-rose-600 hover:bg-rose-50 rounded-xl h-9 px-6 text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              Quitter la session
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
