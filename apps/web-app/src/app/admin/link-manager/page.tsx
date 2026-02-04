import { AgriLogisticLink } from '@/components/admin/logistics/AgriLogisticLink';

export default function LinkManagerPage() {
  return (
    <div className="h-full p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-2">
          AgriLogistic Link Manager
        </h1>
        <p className="text-slate-500">
          Centre de contrôle des opérations logistiques et du matching IA.
        </p>
      </div>

      <AgriLogisticLink />
    </div>
  );
}
