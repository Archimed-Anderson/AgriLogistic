/**
 * Transporter Shipments Page - Premium Modernized Version
 * Complete shipment management with filters and detail view
 */
'use client';

import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  MapPin,
  Clock,
  ChevronRight,
  CheckCircle,
  Truck,
  AlertTriangle,
  Phone,
  Navigation,
  X,
  Calendar,
  User,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

interface Shipment {
  id: string;
  orderNumber: string;
  client: {
    name: string;
    phone: string;
    company: string;
  };
  pickup: {
    address: string;
    city: string;
    contact: string;
    time: string;
  };
  delivery: {
    address: string;
    city: string;
    contact: string;
    time: string;
  };
  status: 'pending' | 'pickup' | 'in_transit' | 'delivered' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  items: { name: string; quantity: number; unit: string }[];
  distance: number;
  value: number;
  commission: number;
  date: Date;
  notes?: string;
}

const mockShipments: Shipment[] = [
  {
    id: 'shp-001',
    orderNumber: 'SHP-2026-0042',
    client: { name: 'Amadou Diallo', phone: '+221 77 123 45 67', company: 'Restaurant Le Teranga' },
    pickup: {
      address: 'Ferme Bio Casamance',
      city: 'Ziguinchor',
      contact: 'Ibrahima Fall',
      time: '08:00',
    },
    delivery: {
      address: '45 Rue Félix Faure, Plateau',
      city: 'Dakar',
      contact: 'Chef Diallo',
      time: '14:00',
    },
    status: 'in_transit',
    priority: 'high',
    items: [
      { name: 'Tomates Bio', quantity: 100, unit: 'kg' },
      { name: 'Herbes aromatiques', quantity: 20, unit: 'kg' },
    ],
    distance: 485,
    value: 92500,
    commission: 18500,
    date: new Date('2026-01-23'),
  },
  {
    id: 'shp-002',
    orderNumber: 'SHP-2026-0043',
    client: { name: 'Marie Seck', phone: '+221 76 987 65 43', company: 'Hôtel Terrou-Bi' },
    pickup: {
      address: 'Coopérative Niayes',
      city: 'Thiès',
      contact: 'Moussa Ndiaye',
      time: '09:30',
    },
    delivery: {
      address: 'Corniche Ouest',
      city: 'Dakar',
      contact: 'Réception Hôtel',
      time: '12:00',
    },
    status: 'pickup',
    priority: 'normal',
    items: [
      { name: 'Carottes Niayes', quantity: 150, unit: 'kg' },
      { name: 'Pommes de terre', quantity: 200, unit: 'kg' },
    ],
    distance: 72,
    value: 160000,
    commission: 24000,
    date: new Date('2026-01-23'),
  },
  {
    id: 'shp-003',
    orderNumber: 'SHP-2026-0044',
    client: { name: 'Pierre Gomez', phone: '+221 78 456 78 90', company: 'Supermarché City Dia' },
    pickup: { address: 'Ferme Kolda', city: 'Kolda', contact: 'Aliou Ba', time: '07:00' },
    delivery: {
      address: 'Centre Commercial Almadies',
      city: 'Dakar',
      contact: 'Responsable Stock',
      time: '16:00',
    },
    status: 'pending',
    priority: 'normal',
    items: [{ name: 'Arachides', quantity: 500, unit: 'kg' }],
    distance: 620,
    value: 600000,
    commission: 72000,
    date: new Date('2026-01-23'),
  },
  {
    id: 'shp-004',
    orderNumber: 'SHP-2026-0041',
    client: { name: 'Fatou Diop', phone: '+221 77 111 22 33', company: 'Marché Sandaga' },
    pickup: {
      address: 'Verger du Fleuve',
      city: 'Saint-Louis',
      contact: 'Oumar Sy',
      time: '06:00',
    },
    delivery: { address: 'Marché Sandaga', city: 'Dakar', contact: 'Fatou Diop', time: '11:00' },
    status: 'delivered',
    priority: 'normal',
    items: [{ name: 'Mangues Kent', quantity: 300, unit: 'kg' }],
    distance: 265,
    value: 750000,
    commission: 90000,
    date: new Date('2026-01-22'),
  },
];

const statusConfig = {
  pending: {
    label: 'En attente',
    color: 'bg-slate-100 text-slate-700',
    dotColor: 'bg-slate-400',
    icon: Clock,
  },
  pickup: {
    label: 'Enlèvement',
    color: 'bg-amber-100 text-amber-700',
    dotColor: 'bg-amber-500',
    icon: Package,
  },
  in_transit: {
    label: 'En transit',
    color: 'bg-blue-100 text-blue-700',
    dotColor: 'bg-blue-500',
    icon: Truck,
  },
  delivered: {
    label: 'Livré',
    color: 'bg-emerald-100 text-emerald-700',
    dotColor: 'bg-emerald-500',
    icon: CheckCircle,
  },
  failed: {
    label: 'Échoué',
    color: 'bg-red-100 text-red-700',
    dotColor: 'bg-red-500',
    icon: AlertTriangle,
  },
};

const priorityConfig = {
  low: { label: 'Basse', color: 'text-slate-500' },
  normal: { label: 'Normale', color: 'text-slate-700' },
  high: { label: 'Haute', color: 'text-amber-600' },
  urgent: { label: 'Urgente', color: 'text-red-600' },
};

export default function TransporterShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const filteredShipments = mockShipments.filter((s) => {
    const matchesSearch =
      s.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.client.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockShipments.length,
    pending: mockShipments.filter((s) => s.status === 'pending').length,
    inProgress: mockShipments.filter((s) => ['pickup', 'in_transit'].includes(s.status)).length,
    completed: mockShipments.filter((s) => s.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes Livraisons</h1>
          <p className="text-slate-600">
            {stats.total} livraisons • {stats.inProgress} en cours
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Total</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <p className="text-sm text-amber-600">En attente</p>
          <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <p className="text-sm text-blue-600">En cours</p>
          <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
          <p className="text-sm text-emerald-600">Livrées</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.completed}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une livraison..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'pending', 'pickup', 'in_transit', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status === 'all'
                ? 'Toutes'
                : statusConfig[status as keyof typeof statusConfig].label}
            </button>
          ))}
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.map((shipment) => {
          const config = statusConfig[shipment.status];
          const StatusIcon = config.icon;

          return (
            <div
              key={shipment.id}
              onClick={() => setSelectedShipment(shipment)}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color}`}
                  >
                    <StatusIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-900">
                        {shipment.orderNumber}
                      </span>
                      {shipment.priority === 'high' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg">
                          Prioritaire
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600">{shipment.client.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">
                    +{formatCurrency(shipment.commission)} FCFA
                  </p>
                  <p className="text-sm text-slate-500">{shipment.distance} km</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Enlèvement</p>
                  <p className="text-sm font-medium text-slate-900">{shipment.pickup.address}</p>
                  <p className="text-xs text-slate-500">
                    {shipment.pickup.city} • {shipment.pickup.time}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Livraison</p>
                  <p className="text-sm font-medium text-slate-900">{shipment.delivery.address}</p>
                  <p className="text-xs text-slate-500">
                    {shipment.delivery.city} • {shipment.delivery.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedShipment.orderNumber}</h2>
                <p className="text-slate-500">{selectedShipment.client.company}</p>
              </div>
              <button
                onClick={() => setSelectedShipment(null)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-center">
                <span
                  className={`px-4 py-2 rounded-xl font-medium ${
                    statusConfig[selectedShipment.status].color
                  }`}
                >
                  {statusConfig[selectedShipment.status].label}
                </span>
              </div>

              {/* Route */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-emerald-900">
                      {selectedShipment.pickup.address}
                    </p>
                    <p className="text-sm text-emerald-700">
                      {selectedShipment.pickup.city} • {selectedShipment.pickup.time}
                    </p>
                    <p className="text-sm text-emerald-600">
                      Contact: {selectedShipment.pickup.contact}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">{selectedShipment.delivery.address}</p>
                    <p className="text-sm text-blue-700">
                      {selectedShipment.delivery.city} • {selectedShipment.delivery.time}
                    </p>
                    <p className="text-sm text-blue-600">
                      Contact: {selectedShipment.delivery.contact}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Articles</h3>
                <div className="space-y-2">
                  {selectedShipment.items.map((item, i) => (
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

              {/* Financials */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">Valeur marchandise</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatCurrency(selectedShipment.value)} FCFA
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <p className="text-sm text-emerald-600">Votre commission</p>
                  <p className="text-xl font-bold text-emerald-700">
                    {formatCurrency(selectedShipment.commission)} FCFA
                  </p>
                </div>
              </div>

              {/* Client */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{selectedShipment.client.name}</p>
                    <p className="text-sm text-slate-500">{selectedShipment.client.phone}</p>
                  </div>
                </div>
                <button className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600">
                  <Phone className="w-5 h-5" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Naviguer
                </button>
                <button className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600">
                  Confirmer livraison
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
