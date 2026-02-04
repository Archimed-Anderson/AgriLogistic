import dynamic from 'next/dynamic';

const FleetCommander = dynamic(() => import('@/components/admin/FleetCommander'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] flex items-center justify-center text-slate-500 text-sm">
      Chargement Fleet Commander...
    </div>
  ),
});

export const metadata = {
  title: 'Fleet Commander | Mission Control | AgroDeep',
  description: 'Gestion de flotte avancée, monitoring IoT en temps réel et optimisation du dispatch.',
};

export default function FleetCommanderPage() {
  return (
    <div className="h-full">
      <FleetCommander />
    </div>
  );
}
