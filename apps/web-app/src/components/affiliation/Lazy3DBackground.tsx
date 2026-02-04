'use client';

import dynamic from 'next/dynamic';

export const Lazy3DBackground = dynamic(
  () => import('./Dynamic3DBackground').then((m) => ({ default: m.Dynamic3DBackground })),
  { ssr: false, loading: () => <div className="absolute inset-0 w-full h-full bg-slate-950 min-h-screen" /> }
);
