/**
 * Equipment Inventory Component
 * Manage rental equipment fleet
 */
'use client';

import React, { useState } from 'react';
import { Tractor, MapPin, Calendar, DollarSign, Wrench, Shield, Battery } from 'lucide-react';
import type { Equipment } from '@/types/farmer/rental';

interface EquipmentInventoryProps {
  equipment: Equipment[];
  isLoading?: boolean;
}

export function EquipmentInventory({ equipment, isLoading }: EquipmentInventoryProps) {
  const [filterStatus, setFilterStatus] = useState<Equipment['status'] | 'all'>('all');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-xl" />
        ))}
      </div>
    );
  }

  const getStatusConfig = (status: Equipment['status']) => {
    const configs = {
      available: { color: 'bg-green-100 text-green-700', label: 'Disponible', icon: '✓' },
      rented: { color: 'bg-blue-100 text-blue-700', label: 'Loué', icon: '🔒' },
      maintenance: { color: 'bg-orange-100 text-orange-700', label: 'Maintenance', icon: '🔧' },
      retired: { color: 'bg-gray-100 text-gray-700', label: 'Retiré', icon: '⏸' },
    };
    return configs[status];
  };

  const getConditionColor = (condition: Equipment['condition']) => {
    const colors = {
      excellent: 'text-green-600',
      good: 'text-blue-600',
      fair: 'text-orange-600',
      poor: 'text-red-600',
    };
    return colors[condition];
  };

  const getTypeIcon = (type: Equipment['type']) => {
    const icons = {
      tractor: '🚜',
      harvester: '🌾',
      planter: '🌱',
      sprayer: '💧',
      trailer: '🚛',
      other: '🔧',
    };
    return icons[type];
  };

  const filteredEquipment = filterStatus === 'all'
    ? equipment
    : equipment.filter(e => e.status === filterStatus);

  const statusCounts = {
    all: equipment.length,
    available: equipment.filter(e => e.status === 'available').length,
    rented: equipment.filter(e => e.status === 'rented').length,
    maintenance: equipment.filter(e => e.status === 'maintenance').length,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Tractor className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Inventaire Matériel</h2>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
          + Ajouter Équipement
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'available', 'rented', 'maintenance'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              filterStatus === status
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Tout' : getStatusConfig(status as Equipment['status']).label}
            <span className="ml-2 font-semibold">
              ({status === 'all' ? statusCounts.all : statusCounts[status as keyof typeof statusCounts]})
            </span>
          </button>
        ))}
      </div>

      {/* Equipment Grid */}
      {filteredEquipment.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Tractor className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">Aucun équipement</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEquipment.map((eq) => {
            const statusConfig = getStatusConfig(eq.status);
            const hoursUntilService = eq.usage.serviceInterval - (eq.usage.totalHours % eq.usage.serviceInterval);

            return (
              <div
                key={eq.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="relative h-40 bg-gradient-to-br from-green-50 to-blue-50">
                  <div className="absolute inset-0 flex items-center justify-center text-7xl">
                    {getTypeIcon(eq.type)}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
                      {statusConfig.icon} {statusConfig.label}
                    </span>
                  </div>
                  {eq.currentRental && (
                    <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                      <p className="text-xs font-medium text-gray-900">
                        Loué à: {eq.currentRental.renterName}
                      </p>
                      <p className="text-xs text-gray-600">
                        Jusqu'au {new Date(eq.currentRental.endDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{eq.name}</h3>
                    <p className="text-sm text-gray-600">
                      {eq.brand} {eq.model} • {eq.year}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-600">
                    {eq.specifications.power && (
                      <div className="flex items-center gap-1">
                        <Battery className="w-3 h-3" />
                        <span>{eq.specifications.power}</span>
                      </div>
                    )}
                    {eq.specifications.capacity && (
                      <div className="flex items-center gap-1">
                        <span>📦 {eq.specifications.capacity}</span>
                      </div>
                    )}
                  </div>

                  {/* Condition & Usage */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b">
                    <div>
                      <p className="text-xs text-gray-600">État</p>
                      <p className={`text-sm font-semibold capitalize ${getConditionColor(eq.condition)}`}>
                        {eq.condition}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Heures</p>
                      <p className="text-sm font-semibold text-gray-900">{eq.usage.totalHours}h</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">Tarifs</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Jour:</span>
                        <span className="ml-1 font-semibold">{(eq.pricing.daily / 1000).toFixed(0)}K</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Semaine:</span>
                        <span className="ml-1 font-semibold">{(eq.pricing.weekly / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance Alert */}
                  {hoursUntilService < 50 && (
                    <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg mb-3">
                      <Wrench className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-orange-700">
                        Maintenance dans {hoursUntilService}h
                      </span>
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{eq.location.address}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {eq.status === 'available' && (
                      <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                        Louer
                      </button>
                    )}
                    <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
