/**
 * Buyer Orders Page
 * Order management with Kanban board and timeline
 */
'use client';

import React, { useState } from 'react';
import { useOrders } from '@/hooks/buyer/useOrders';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
  AlertCircle,
  ChevronRight,
  Calendar,
  MapPin,
  User,
  CreditCard,
  X,
  MessageCircle,
} from 'lucide-react';
import type { Order, OrderStatus } from '@/types/buyer';

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; icon: React.ElementType }
> = {
  pending: {
    label: 'En attente',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmée',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    icon: CheckCircle,
  },
  preparing: {
    label: 'En préparation',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    icon: Package,
  },
  shipped: {
    label: 'En transit',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200',
    icon: Truck,
  },
  delivered: {
    label: 'Livrée',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    icon: PackageCheck,
  },
  cancelled: {
    label: 'Annulée',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    icon: X,
  },
  refunded: {
    label: 'Remboursée',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 border-gray-200',
    icon: CreditCard,
  },
};

const kanbanColumns: { status: OrderStatus; title: string }[] = [
  { status: 'pending', title: 'En attente' },
  { status: 'confirmed', title: 'Confirmées' },
  { status: 'preparing', title: 'En préparation' },
  { status: 'shipped', title: 'En transit' },
  { status: 'delivered', title: 'Livrées' },
];

export default function BuyerOrdersPage() {
  const { orders, isLoading } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

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
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter((o) => o.status === status);
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Commandes</h1>
          <p className="text-slate-600">{orders.length} commandes au total</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Liste
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((column) => {
            const columnOrders = getOrdersByStatus(column.status);
            const config = statusConfig[column.status];
            const Icon = config.icon;

            return (
              <div key={column.status} className="flex-shrink-0 w-80">
                <div className={`rounded-t-xl px-4 py-3 ${config.bgColor} border`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                      <span className="font-semibold text-slate-900">{column.title}</span>
                    </div>
                    <span className="px-2 py-1 bg-white rounded-lg text-sm font-medium text-slate-600">
                      {columnOrders.length}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-100 rounded-b-xl p-3 min-h-[400px] space-y-3">
                  {columnOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="bg-white rounded-xl p-4 border border-slate-200 cursor-pointer hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-slate-900">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {order.supplier.name}
                          </p>
                          <p className="text-xs text-slate-500">{order.supplier.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-slate-900">
                          {formatCurrency(order.totalAmount)}
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Commande
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Fournisseur
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Statut</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Livraison
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                  Montant
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                const config = statusConfig[order.status];
                const Icon = config.icon;
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                      <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{order.supplier.name}</p>
                      <p className="text-sm text-slate-500">{order.supplier.location}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}
                      >
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900">
                        {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
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
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedOrder.orderNumber}</h2>
                  <p className="text-sm text-slate-500">
                    Créée le {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-4">
                {(() => {
                  const config = statusConfig[selectedOrder.status];
                  const Icon = config.icon;
                  return (
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${config.bgColor} ${config.color}`}
                    >
                      <Icon className="w-5 h-5" />
                      {config.label}
                    </span>
                  );
                })()}
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    selectedOrder.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {selectedOrder.paymentStatus === 'paid' ? 'Payé' : 'En attente de paiement'}
                </span>
              </div>

              {/* Supplier */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Fournisseur</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <User className="w-6 h-6 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{selectedOrder.supplier.name}</p>
                    <p className="text-sm text-slate-500">{selectedOrder.supplier.location}</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contacter
                  </button>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Livraison</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">
                      {selectedOrder.deliveryAddress.street}
                    </p>
                    <p className="text-sm text-slate-500">
                      {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <p className="text-sm text-slate-700">
                    Livraison prévue le{' '}
                    <span className="font-medium">
                      {new Date(selectedOrder.deliveryDate).toLocaleDateString('fr-FR')}
                    </span>
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Historique</h3>
                <div className="space-y-4">
                  {selectedOrder.timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === selectedOrder.timeline.length - 1
                              ? 'bg-amber-500'
                              : 'bg-slate-300'
                          }`}
                        />
                        {index < selectedOrder.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 mt-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-slate-900">{event.description}</p>
                        <p className="text-sm text-slate-500">{formatDate(event.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
