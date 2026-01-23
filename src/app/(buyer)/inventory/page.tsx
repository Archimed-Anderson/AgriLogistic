/**
 * Buyer Inventory Page
 * Stock management and inventory alerts
 */
'use client';

import React, { useState } from 'react';
import { useInventory, InventoryItem } from '@/hooks/buyer/useInventory';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Search,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  Clock,
  ChevronRight,
  X
} from 'lucide-react';

const statusConfig = {
  optimal: { label: 'Optimal', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  low: { label: 'Stock bas', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  critical: { label: 'Critique', color: 'bg-red-100 text-red-700 border-red-200' },
  overstock: { label: 'Surstock', color: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export default function BuyerInventoryPage() {
  const { items, lowStockItems, expiringItems, totalValue, isLoading } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Stocks</h1>
          <p className="text-slate-600">{items.length} produits en inventaire</p>
        </div>
        <button className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Réapprovisionner
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Valeur totale</span>
            <Package className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Produits</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{items.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Stocks bas</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{lowStockItems.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Expirent bientôt</span>
            <Clock className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{expiringItems.length}</p>
        </div>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockItems.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-amber-800">Stocks bas ou critiques</span>
              </div>
              <div className="space-y-2">
                {lowStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-amber-700">{item.productName}</span>
                    <span className="font-mono text-amber-800">{item.currentStock} {item.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {expiringItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-800">Expiration proche (7 jours)</span>
              </div>
              <div className="space-y-2">
                {expiringItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-red-700">{item.productName}</span>
                    <span className="font-mono text-red-800">{item.expiryDate && formatDate(item.expiryDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher produit ou SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700"
        >
          <option value="all">Tous les statuts</option>
          <option value="optimal">Optimal</option>
          <option value="low">Stock bas</option>
          <option value="critical">Critique</option>
          <option value="overstock">Surstock</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Produit</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">SKU</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Stock</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Statut</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Valeur</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Fournisseur</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => {
              const config = statusConfig[item.status];
              const stockPercent = (item.currentStock / item.maxStock) * 100;

              return (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{item.productName}</p>
                      <p className="text-sm text-slate-500">{item.productCategory}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-slate-600">{item.sku}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-900">{item.currentStock} {item.unit}</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            stockPercent < 25 ? 'bg-red-500' :
                            stockPercent < 50 ? 'bg-amber-500' :
                            stockPercent > 100 ? 'bg-blue-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(stockPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-lg border ${config.color}`}>
                      {config.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">{formatCurrency(item.totalValue)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{item.supplier}</span>
                  </td>
                  <td className="px-6 py-4">
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedItem.productName}</h2>
                  <p className="text-slate-500 font-mono">{selectedItem.sku}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Stock Gauge */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Niveau de stock</h3>
                <div className="relative pt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Min: {selectedItem.minStock}</span>
                    <span>Max: {selectedItem.maxStock}</span>
                  </div>
                  <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        selectedItem.status === 'critical' ? 'bg-red-500' :
                        selectedItem.status === 'low' ? 'bg-amber-500' :
                        selectedItem.status === 'overstock' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min((selectedItem.currentStock / selectedItem.maxStock) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-center mt-2 text-2xl font-bold text-slate-900">
                    {selectedItem.currentStock} {selectedItem.unit}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Prix unitaire</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(selectedItem.unitPrice)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Valeur totale</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(selectedItem.totalValue)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Emplacement</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedItem.location}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Dernier réappro</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedItem.lastRestocked)}
                  </p>
                </div>
              </div>

              {selectedItem.expiryDate && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-600">Date d'expiration</p>
                  <p className="font-semibold text-amber-800">{formatDate(selectedItem.expiryDate)}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                  <ArrowUpCircle className="w-5 h-5" />
                  Entrée stock
                </button>
                <button className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                  <ArrowDownCircle className="w-5 h-5" />
                  Sortie stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
