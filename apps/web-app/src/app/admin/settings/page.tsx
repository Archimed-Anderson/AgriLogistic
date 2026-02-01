import GlobalSettings from '@/components/admin/GlobalSettings';

export const metadata = {
  title: 'Système | Paramètres Globaux | AgroDeep',
  description: 'Panneau de configuration avancée pour la gestion de la plateforme AgriLogistic.',
};

export default function SettingsPage() {
  return (
    <div className="h-full">
      <GlobalSettings />
    </div>
  );
}
