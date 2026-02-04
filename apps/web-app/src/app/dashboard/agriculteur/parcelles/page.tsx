'use client';

import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';

const Parcel3DViewer = dynamic(() => import('@/components/dashboard/Parcel3DViewer'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#050505] text-white">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#1B4D3E] border-t-[#D4A017] mb-4" />
      <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
        Initialisation du Jumeau Numérique...
      </p>
    </div>
  ),
});

export default function ParcellesPage() {
  return (
    <div className="h-[calc(100vh-200px)] w-full rounded-[3.5rem] overflow-hidden shadow-3xl relative border border-slate-100 dark:border-white/5 bg-[#050505]">
      <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 dark:border-white/2 rounded-[3.5rem] z-20" />
      <div className="absolute top-10 left-10 z-30 pointer-events-none">
        <Badge className="bg-[#D4A017] text-white px-6 py-2 rounded-full font-black text-xs tracking-widest shadow-2xl">
          VUE SATELLITE 3D ACTIVE
        </Badge>
      </div>
      <Parcel3DViewer />
    </div>
  );
}
