'use client';

import { Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ConstructionPage() {
  const pathname = usePathname();
  const moduleName = pathname.split('/').pop()?.replace(/-/g, ' ');

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
      <div className="relative">
        <Construction className="h-24 w-24 text-orange-500 animate-pulse" />
        <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-10 animate-pulse" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
          Module <span className="text-orange-500 italic">"{moduleName}"</span> en Construction
        </h1>
        <p className="text-slate-500 max-w-md mx-auto font-medium">
          Ce module du centre de contrôle est actuellement en cours de développement par nos
          ingénieurs système. Il sera disponible dans la prochaine mise à jour v3.2.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-black font-black uppercase text-xs tracking-widest hover:bg-orange-400 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au Dashboard
        </Link>
      </div>

      <div className="pt-12">
        <div className="inline-flex items-center gap-8 px-8 py-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">
              Status
            </span>
            <span className="text-sm font-bold text-orange-400">DEVELOPMENT</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">
              ETA
            </span>
            <span className="text-sm font-bold text-slate-300">Q2 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
