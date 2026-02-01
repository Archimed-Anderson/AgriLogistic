import FleetCommander from '@/components/admin/FleetCommander';

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
