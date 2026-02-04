/**
 * Inventory Tracker Component
 * Track seeds, fertilizers, and equipment stock
 */
'use client';

import React from 'react';
import { Package, AlertCircle, TrendingDown } from 'lucide-react';
import type { InventoryItem } from '@/types/farmer/operations';

interface InventoryTrackerProps {
  inventory: InventoryItem[];
  isLoading?: boolean;
}

export function InventoryTracker({ inventory, isLoading }: InventoryTrackerProps) {
  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  const getCategoryIcon = (category: InventoryItem['category']) => {
    const icons = {
      seeds: '🌱',
      fertilizer: '🧪',
      pesticide: '🛡️',
      equipment: '🔧',
      other: '📦',
    };
    return icons[category];
  };

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.quantity / item.maxStock) * 100;
    if (item.quantity <= item.minStock) {
      return { color: 'text-red-600 bg-red-50', label: 'Stock faible', icon: AlertCircle };
    }
    if (percentage < 30) {
      return { color: 'text-orange-600 bg-orange-50', label: 'À commander', icon: TrendingDown };
    }
    return { color: 'text-green-600 bg-green-50', label: 'Stock OK', icon: Package };
  };

  const lowStockItems = inventory.filter((item) => item.quantity <= item.minStock).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Gestion des Stocks</h2>
        </div>
        {lowStockItems > 0 && (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
            <AlertCircle className="w-3 h-3" />
            {lowStockItems} alerte{lowStockItems > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {inventory.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">Inventaire vide</p>
          <p className="text-sm mt-1">Commencez à suivre vos stocks d'intrants</p>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            + Ajouter un article
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {inventory.map((item) => {
              const status = getStockStatus(item);
              const StatusIcon = status.icon;
              const stockPercentage = (item.quantity / item.maxStock) * 100;

              return (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-xs text-gray-500">
                            {item.supplier} • {item.location}
                          </p>
                        </div>
                        <span
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${status.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>

                      {/* Stock Bar */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">
                            {item.quantity} {item.unit}
                          </span>
                          <span className="text-gray-500">
                            Max: {item.maxStock} {item.unit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              stockPercentage <= 20
                                ? 'bg-red-500'
                                : stockPercentage <= 50
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>
                          Dernière commande:{' '}
                          {new Date(item.lastRestocked).toLocaleDateString('fr-FR')}
                        </span>
                        {item.expiryDate && (
                          <span className="text-orange-600">
                            Expire: {new Date(item.expiryDate).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Historique des commandes →
            </button>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
              + Ajouter un article
            </button>
          </div>
        </>
      )}
    </div>
  );
}
