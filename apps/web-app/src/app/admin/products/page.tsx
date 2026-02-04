'use client';

import { useState } from 'react';
import { AdminModulePlaceholder } from '@/components/admin/AdminModulePlaceholder';
import { AgriLogisticLink } from '@/components/admin/logistics/AgriLogisticLink';
import { Truck, Package } from 'lucide-react';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'logistics'>('inventory');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          ProduitInventory
        </h1>
      </div>

      <div className="border-b">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Package className="h-4 w-4" />
            Inventaire
          </button>
          <button
            onClick={() => setActiveTab('logistics')}
            className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'logistics'
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Truck className="h-4 w-4" />
            AgriLogistic Link
          </button>
        </div>
      </div>

      <div className="py-4">
        {activeTab === 'inventory' && (
          <AdminModulePlaceholder
            title="Inventaire des Produits"
            description="Gérez votre catalogue d'intrants, semences et récoltes. (Module en cours de développement)"
          />
        )}
        {activeTab === 'logistics' && <AgriLogisticLink />}
      </div>
    </div>
  );
}
