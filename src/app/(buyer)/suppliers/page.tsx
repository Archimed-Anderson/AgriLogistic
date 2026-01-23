/**
 * Buyer Suppliers Page
 * Supplier directory with performance dashboard
 */
'use client';

import React, { useState } from 'react';
import { useSuppliers, SupplierWithPerformance } from '@/hooks/buyer/useSuppliers';
import {
  Users,
  Star,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Heart,
  Shield,
  Clock,
  TrendingUp,
  Package,
  CheckCircle,
  X,
  ChevronRight,
  Search,
  Filter,
  Leaf
} from 'lucide-react';

export default function BuyerSuppliersPage() {
  const { suppliers, isLoading } = useSuppliers();
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierWithPerformance | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = filterFavorites ? s.isFavorite : true;
    return matchesSearch && matchesFavorite;
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
          <h1 className="text-2xl font-bold text-slate-900">Mes Fournisseurs</h1>
          <p className="text-slate-600">{suppliers.length} fournisseurs partenaires</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher fournisseurs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <button
          onClick={() => setFilterFavorites(!filterFavorites)}
          className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium transition-colors ${
            filterFavorites ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${filterFavorites ? 'fill-current' : ''}`} />
          Favoris uniquement
        </button>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            onClick={() => setSelectedSupplier(supplier)}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold text-amber-700">
                      {supplier.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{supplier.name}</h3>
                      {supplier.isVerified && (
                        <Shield className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {supplier.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {supplier.isFavorite && (
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{supplier.rating}</span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-sm text-slate-600">{supplier.totalOrders} commandes</span>
                <span className="text-slate-400">•</span>
                <span className="text-sm text-slate-600">{supplier.reliabilityScore}% fiabilité</span>
              </div>
            </div>

            {/* Performance */}
            <div className="p-4 bg-slate-50">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600">{supplier.performance.deliveryOnTime}%</p>
                  <p className="text-xs text-slate-500">Ponctualité</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{supplier.performance.responseTime}h</p>
                  <p className="text-xs text-slate-500">Réponse</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{supplier.performance.orderAccuracy}%</p>
                  <p className="text-xs text-slate-500">Précision</p>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {supplier.specialties.slice(0, 3).map((spec, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Total: <span className="font-semibold text-slate-900">{formatCurrency(supplier.performance.totalSpent)}</span>
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-amber-700">
                      {selectedSupplier.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900">{selectedSupplier.name}</h2>
                      {selectedSupplier.isVerified && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedSupplier.location}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedSupplier(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Performance Dashboard */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 rounded-xl p-4 text-center">
                    <Clock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-700">{selectedSupplier.performance.deliveryOnTime}%</p>
                    <p className="text-sm text-emerald-600">Ponctualité</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-700">{selectedSupplier.performance.qualityScore}</p>
                    <p className="text-sm text-blue-600">Note qualité</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-700">{selectedSupplier.performance.orderAccuracy}%</p>
                    <p className="text-sm text-purple-600">Précision</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <MessageCircle className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-amber-700">{selectedSupplier.performance.responseTime}h</p>
                    <p className="text-sm text-amber-600">Temps réponse</p>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              {selectedSupplier.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Certifications</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedSupplier.certifications.map((cert) => (
                      <div key={cert.id} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <Leaf className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-emerald-700">{cert.name}</span>
                        {cert.verified && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-700">{selectedSupplier.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Phone className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-700">{selectedSupplier.contactPhone}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedSupplier.notes && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Notes personnelles</h3>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl">{selectedSupplier.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Contacter
                </button>
                <button className="px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <Heart className={`w-5 h-5 ${selectedSupplier.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {selectedSupplier.isFavorite ? 'Favori' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
