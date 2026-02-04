/**
 * Buyer Deliveries Page
 * Incoming deliveries tracking and schedule
 */
'use client';

import React, { useState } from 'react';
import { useDeliveries, Delivery } from '@/hooks/buyer/useDeliveries';
import {
  Truck,
  MapPin,
  Clock,
  Calendar,
  Package,
  CheckCircle,
  AlertTriangle,
  Navigation,
  X,
  Phone,
  ChevronRight,
} from 'lucide-react';

const statusConfig = {
  scheduled: {
    label: 'Planifiée',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: 'bg-slate-400',
  },
  in_transit: {
    label: 'En transit',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-500',
  },
  arriving: {
    label: 'Arrivée imminente',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
  },
  delivered: {
    label: 'Livrée',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  delayed: {
    label: 'Retardée',
    color: 'bg-red-100 text-red-700 border-red-200',
    dotColor: 'bg-red-500',
  },
};

export default function BuyerDeliveriesPage() {
  const { deliveries, todayDeliveries, inTransitDeliveries, delayedDeliveries, isLoading } =
    useDeliveries();
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredDeliveries = deliveries.filter(
    (d) => filterStatus === 'all' || d.status === filterStatus
  );

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
          <h1 className="text-2xl font-bold text-slate-900">Suivi des Livraisons</h1>
          <p className="text-slate-600">{deliveries.length} livraisons</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Aujourd'hui</span>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{todayDeliveries.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">En transit</span>
            <Truck className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{inTransitDeliveries.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Retardées</span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{delayedDeliveries.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Livrées ce mois</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {deliveries.filter((d) => d.status === 'delivered').length}
          </p>
        </div>
      </div>

      {/* Delayed Alert */}
      {delayedDeliveries.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-800">Livraisons retardées</span>
          </div>
          <div className="space-y-2">
            {delayedDeliveries.map((d) => (
              <div key={d.id} className="flex items-center justify-between text-sm">
                <span className="text-red-700">
                  {d.orderNumber} - {d.supplierName}
                </span>
                <span className="text-red-600">{d.notes}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'scheduled', 'in_transit', 'arriving', 'delivered', 'delayed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status === 'all' ? 'Toutes' : statusConfig[status as keyof typeof statusConfig].label}
          </button>
        ))}
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {filteredDeliveries.map((delivery) => {
          const config = statusConfig[delivery.status];

          return (
            <div
              key={delivery.id}
              onClick={() => setSelectedDelivery(delivery)}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color}`}
                  >
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{delivery.orderNumber}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-lg border ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{delivery.supplierName}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(delivery.scheduledDate)}
                      </span>
                      {delivery.currentLocation && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {delivery.currentLocation}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(delivery.totalValue)}
                    </p>
                    <p className="text-sm text-slate-500">{delivery.items.length} produit(s)</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>

              {/* Progress Bar for in_transit */}
              {(delivery.status === 'in_transit' || delivery.status === 'arriving') && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-500">Progression</span>
                    {delivery.estimatedArrival && (
                      <span className="text-slate-700">
                        ETA: {formatDate(delivery.estimatedArrival)}
                      </span>
                    )}
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        delivery.status === 'arriving'
                          ? 'bg-amber-500 w-[90%]'
                          : 'bg-blue-500 w-[60%]'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      statusConfig[selectedDelivery.status].color
                    }`}
                  >
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedDelivery.orderNumber}
                    </h2>
                    <p className="text-slate-500">{selectedDelivery.supplierName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-center">
                <span
                  className={`px-4 py-2 text-sm font-medium rounded-xl border ${
                    statusConfig[selectedDelivery.status].color
                  }`}
                >
                  {statusConfig[selectedDelivery.status].label}
                </span>
              </div>

              {/* Tracking */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">Code de suivi</p>
                <p className="font-mono text-lg font-semibold text-slate-900">
                  {selectedDelivery.trackingCode}
                </p>
              </div>

              {/* Current Location */}
              {selectedDelivery.currentLocation && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Navigation className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600">Position actuelle</p>
                    <p className="font-medium text-blue-800">{selectedDelivery.currentLocation}</p>
                  </div>
                </div>
              )}

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Date prévue</p>
                  <p className="font-semibold text-slate-900">
                    {formatDate(selectedDelivery.scheduledDate)}
                  </p>
                </div>
                {selectedDelivery.estimatedArrival && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Arrivée estimée</p>
                    <p className="font-semibold text-slate-900">
                      {formatDate(selectedDelivery.estimatedArrival)}
                    </p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Produits</h3>
                <div className="space-y-2">
                  {selectedDelivery.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                    >
                      <span className="text-slate-700">{item.name}</span>
                      <span className="font-mono text-slate-900">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transporter */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Transporteur</h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="font-medium text-slate-900">{selectedDelivery.transporterName}</p>
                  <p className="text-sm text-slate-500">{selectedDelivery.vehicleInfo}</p>
                </div>
              </div>

              {/* Notes */}
              {selectedDelivery.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-600">Note</p>
                  <p className="text-amber-800">{selectedDelivery.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contacter transporteur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
