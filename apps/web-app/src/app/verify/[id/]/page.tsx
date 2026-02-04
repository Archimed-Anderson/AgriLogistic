'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Leaf,
  Users,
  Wind,
  ExternalLink,
  ChevronRight,
  QrCode,
  CheckCircle2,
  Info,
  ArrowRight,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicVerifyPage({ params }: { params: { id: string } }) {
  const lotId = params.id;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-12">
      {/* 🌟 PREMIUM HEADER */}
      <nav className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 italic uppercase">
            AgroDeep <span className="text-emerald-500">Trace</span>
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50/50 border border-emerald-100 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            Verified on Blockchain
          </span>
        </div>
      </nav>

      {/* 📱 HERO SECTION */}
      <section className="relative px-6 py-12 flex flex-col items-center text-center gap-8 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-50/50 via-transparent to-transparent opacity-50" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10">
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 block">
            Batch Integrity Confirmed
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">
            Tomates Cerises <br />{' '}
            <span className="text-emerald-500 decoration-4 underline-offset-4">
              Bio & Équitable
            </span>
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto">
            Découvrez le parcours complet de votre produit, de la semence à votre panier.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm aspect-square bg-slate-100 rounded-[48px] overflow-hidden shadow-2xl relative group"
        >
          <img
            src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop"
            alt="Product"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex justify-between items-end">
              <div className="text-white">
                <p className="text-[10px] font-bold uppercase opacity-60">Origine</p>
                <p className="text-lg font-black uppercase italic">Ferme du Soleil</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <QrCode className="w-6 h-6 text-slate-900" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 📊 ESG PERFORMANCE */}
      <section className="px-6 -mt-10 mb-12 relative z-10 flex flex-col gap-4 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Empreinte CO2
              </p>
              <p className="text-xl font-black text-slate-900 tracking-tight">
                0.8kg <span className="text-xs text-slate-400">/ Unité</span>
              </p>
            </div>
            <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[9px] font-black inline-flex items-center gap-1 w-fit">
              <CheckCircle2 className="w-3 h-3" /> FAIBLE
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Score Éthique
              </p>
              <p className="text-xl font-black text-slate-900 tracking-tight">
                9.5 <span className="text-xs text-slate-400">/ 10</span>
              </p>
            </div>
            <div className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-[9px] font-black inline-flex items-center gap-1 w-fit">
              <Award className="w-3 h-3" /> PREMIUM
            </div>
          </div>
        </div>
      </section>

      {/* 🛤️ TIMELINE JOURNEY */}
      <section className="px-6 py-12 bg-white border-y border-slate-100 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">
            Le Parcours du Lot
          </h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Lot ID: {lotId}
          </span>
        </div>

        <div className="space-y-12 relative">
          {/* LINE */}
          <div className="absolute left-[27px] top-2 bottom-12 w-1 bg-slate-100" />

          <PublicTimelineItem
            icon={MapPin}
            title="La Parcelle"
            date="12 Jan 2025"
            location="Secteur Nord, Ferme du Soleil"
            desc="Cultivé sans intrants chimiques sur un sol vivant et régénéré."
          />

          <PublicTimelineItem
            icon={Leaf}
            title="La Récolte"
            date="28 Jan 2025"
            location="Récolté à la main"
            desc="Sélection à maturité optimale pour garantir le goût et les nutriments."
          />

          <PublicTimelineItem
            icon={Wind}
            title="La Livraison"
            date="30 Jan 2025"
            location="Transport Logistique Bio"
            desc="Maintenu à une température stable de 4°C pour une fraîcheur maximum."
            isActive
          />
        </div>
      </section>

      {/* 🔐 BLOCKCHAIN PROOF */}
      <section className="px-6 py-12 max-w-2xl mx-auto w-full">
        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />

          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black italic tracking-tighter uppercase">
                  Preuve Immuable
                </h3>
                <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest leading-none">
                  Ancré sur Hyperledger Fabric
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              Chaque étape de la vie de ce produit a été enregistrée de manière permanente et
              cryptographiquement sécurisée. Aucune donnée ne peut être modifiée rétroactivement.
            </p>

            <div className="flex flex-col gap-3">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    Hash de Transaction
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500 truncate max-w-[180px]">
                    0x3e18a20d4f...b921
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </div>

            <button className="h-14 w-full bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3">
              Voir sur l'Explorateur Blockchain
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 👣 FOOTER */}
      <footer className="px-6 py-12 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
          Powered by AgroDeep Intelligence
        </p>
      </footer>
    </div>
  );
}

function PublicTimelineItem({ icon: Icon, title, date, location, desc, isActive }: any) {
  return (
    <div className="relative pl-20 transition-all">
      <div
        className={cn(
          'absolute left-0 top-0 w-14 h-14 rounded-[22px] flex items-center justify-center z-20 shadow-lg transition-all',
          isActive
            ? 'bg-emerald-500 text-white scale-110'
            : 'bg-white border border-slate-100 text-slate-400'
        )}
      >
        <Icon className="w-6 h-6" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
            {date}
          </span>
          {isActive && (
            <div className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[8px] font-black">
              EN COURS
            </div>
          )}
        </div>
        <h3 className="text-xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">
          {title}
        </h3>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
          {location}
        </p>
        <p className="text-sm text-slate-500 font-medium leading-relaxed mt-2">{desc}</p>
      </div>
    </div>
  );
}
