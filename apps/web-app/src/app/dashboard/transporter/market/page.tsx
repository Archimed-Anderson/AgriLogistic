'use client';

import dynamic from 'next/dynamic';

const FreightMarketplace = dynamic(
  () =>
    import('@/components/dashboard/transporter/FreightMarketplace').then(
      (mod) => mod.FreightMarketplace
    ),
  {
    ssr: false,
    loading: () => <div>Chargement Bourse de Fret...</div>,
  }
);

export default function MarketPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <FreightMarketplace />
    </div>
  );
}
