'use client';

import dynamic from 'next/dynamic';

const RouteOptimizerAI = dynamic(
  () =>
    import('@/components/dashboard/transporter/RouteOptimizerAI').then(
      (mod) => mod.RouteOptimizerAI
    ),
  {
    ssr: false,
    loading: () => (
      <p className="text-white text-center p-10 font-mono animate-pulse">
        CHARGEMENT DU MOTEUR IA...
      </p>
    ),
  }
);

export default function OptimizerPage() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
          ROUTE <span className="text-emerald-500">OPTIMIZER AI</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">
          Simulateur de Trajets & Gestion de Retour à Vide
        </p>
      </div>

      <RouteOptimizerAI />
    </div>
  );
}
