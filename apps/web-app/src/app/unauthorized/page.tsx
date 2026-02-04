'use client';

import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500 shadow-2xl shadow-red-500/20">
            <ShieldAlert size={48} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#1B4D3E] uppercase tracking-tighter italic">
            ACCÈS RESTREINT
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase px-12 leading-relaxed">
            Votre profil ne dispose pas des autorisations nécessaires pour accéder à cette zone
            sécurisée.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/login">
            <Button className="w-full bg-[#1B4D3E] hover:bg-[#153a2f] text-white rounded-2xl h-16 font-black uppercase text-xs tracking-widest shadow-xl flex gap-3 justify-center items-center">
              <ArrowLeft size={18} /> Retour à la connexion
            </Button>
          </Link>
        </div>

        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
          Code Erreur: SEC_AUTH_ROLE_MISMATCH
        </p>
      </div>
    </div>
  );
}
