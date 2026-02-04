import { SupplyChainTracker } from '@/components/dashboard/buyer/SupplyChainTracker';

export default function TrackingPage() {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Supply Chain Tracking</h1>
          <p className="text-slate-400 text-sm">
            Traçabilité complète de "la fourche à la fourchette".
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <SupplyChainTracker />
      </div>
    </div>
  );
}
