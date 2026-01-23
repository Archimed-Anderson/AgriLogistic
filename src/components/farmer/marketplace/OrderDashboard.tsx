/**
 * Order Dashboard Component
 * Manage and track customer orders
 */
'use client';

import React, { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Phone, Mail } from 'lucide-react';
import type { Order } from '@/types/farmer/marketplace';

interface OrderDashboardProps {
  orders: Order[];
  isLoading?: boolean;
}

export function OrderDashboard({ orders, isLoading }: OrderDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all');

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      pending: { icon: Clock, color: 'text-orange-600 bg-orange-50', label: 'En attente' },
      confirmed: { icon: CheckCircle, color: 'text-blue-600 bg-blue-50', label: 'Confirmée' },
      preparing: { icon: Package, color: 'text-purple-600 bg-purple-50', label: 'En préparation' },
      shipped: { icon: Truck, color: 'text-indigo-600 bg-indigo-50', label: 'Expédiée' },
      delivered: { icon: CheckCircle, color: 'text-green-600 bg-green-50', label: 'Livrée' },
      cancelled: { icon: XCircle, color: 'text-red-600 bg-red-50', label: 'Annulée' },
    };
    return configs[status];
  };

  const getPaymentStatusBadge = (status: Order['paymentStatus']) => {
    const badges = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700',
      refunded: 'bg-gray-100 text-gray-700',
      failed: 'bg-red-100 text-red-700',
    };
    return badges[status];
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Gestion des Commandes</h2>
        <span className="text-sm text-gray-600">
          {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'pending', 'confirmed', 'preparing', 'shipped', 'delivered'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              filterStatus === status
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Toutes' : getStatusConfig(status as Order['status']).label}
            <span className="ml-2 font-semibold">
              ({status === 'all' ? statusCounts.all : statusCounts[status as keyof typeof statusCounts]})
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">Aucune commande</p>
          <p className="text-sm mt-1">Les nouvelles commandes apparaîtront ici</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                      <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusBadge(order.paymentStatus)}`}>
                        {order.paymentStatus === 'paid' ? 'Payé' : order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {(order.total / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-gray-500">XOF</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold">
                      {order.customer.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{order.customer.name}</p>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {order.customer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {order.customer.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {order.customer.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Articles ({order.items.length})</p>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl">
                            🥬
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} × {(item.price / 1000).toFixed(1)}K XOF
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {(item.total / 1000).toFixed(1)}K
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Adresse de livraison</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.postalCode} {order.shippingAddress.city}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                      Confirmer
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button className="flex-1 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
                      Préparer
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                      Expédier
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                    Détails
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
