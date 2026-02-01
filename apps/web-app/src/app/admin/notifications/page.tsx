import NotificationCenter from '@/components/admin/NotificationCenter';

export const metadata = {
  title: 'Notifications | Command Center | AgroDeep',
  description: 'Gérez les communications temps réel, les campagnes et le monitoring des flux de notifications.',
};

export default function NotificationsPage() {
  return (
    <div className="h-full">
      <NotificationCenter />
    </div>
  );
}
