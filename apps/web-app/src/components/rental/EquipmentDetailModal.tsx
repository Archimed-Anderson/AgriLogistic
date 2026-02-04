'use client';

import {
  X,
  Package,
  Euro,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Award,
  CheckCircle,
} from 'lucide-react';
import { RentalEquipment } from '@/data/rental-equipment';
import { RatingStars } from './RatingStars';
import { useState } from 'react';

interface EquipmentDetailModalProps {
  equipment: RentalEquipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EquipmentDetailModal({ equipment, isOpen, onClose }: EquipmentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'reservation' | 'purchase'>('details');

  if (!isOpen || !equipment) return null;

  // Calculate rental pricing
  const getRentalPricing = () => {
    if (!equipment.dailyRate) return null;

    return {
      daily: equipment.dailyRate,
      weekly: equipment.weeklyRate || equipment.dailyRate * 7 * 0.85, // 15% discount
      monthly: equipment.monthlyRate || equipment.dailyRate * 30 * 0.75, // 25% discount
      deposit: equipment.deposit || 0,
    };
  };

  const pricing = getRentalPricing();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={equipment.image}
              alt={equipment.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Equipment info overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-4xl font-black text-white mb-3">{equipment.name}</h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    {equipment.specs.brand && (
                      <span className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white font-bold">
                        {equipment.specs.brand}
                      </span>
                    )}
                    {equipment.specs.model && (
                      <span className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white font-bold">
                        {equipment.specs.model}
                      </span>
                    )}
                    {equipment.featured && (
                      <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black uppercase text-sm">
                        ⭐ Vedette
                      </span>
                    )}
                  </div>
                </div>

                {equipment.rating && (
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                    <RatingStars rating={equipment.rating} size="lg" showNumber={true} />
                    <p className="text-white/80 text-sm mt-2">{equipment.reviews} avis</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 max-h-[50vh] overflow-y-auto">
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b-2 border-slate-200">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-3 font-bold transition-all ${
                  activeTab === 'details'
                    ? 'text-sky-600 border-b-4 border-sky-600 -mb-0.5'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Détails & Spécifications
              </button>
              {equipment.dailyRate && (
                <button
                  onClick={() => setActiveTab('reservation')}
                  className={`px-6 py-3 font-bold transition-all ${
                    activeTab === 'reservation'
                      ? 'text-blue-600 border-b-4 border-blue-600 -mb-0.5'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Réserver (Location)
                </button>
              )}
              {equipment.price && (
                <button
                  onClick={() => setActiveTab('purchase')}
                  className={`px-6 py-3 font-bold transition-all ${
                    activeTab === 'purchase'
                      ? 'text-emerald-600 border-b-4 border-emerald-600 -mb-0.5'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Acheter
                </button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-2xl font-black text-[#0A2619] mb-4">Description</h3>
                  <p className="text-slate-700 leading-relaxed text-lg">{equipment.description}</p>
                </div>

                {/* Specifications Table */}
                <div>
                  <h3 className="text-2xl font-black text-[#0A2619] mb-4">
                    Spécifications Techniques
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {equipment.specs.power && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="p-2 rounded-lg bg-sky-100">
                          <TrendingUp className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Puissance</p>
                          <p className="text-lg font-black text-slate-800">
                            {equipment.specs.power}
                          </p>
                        </div>
                      </div>
                    )}

                    {equipment.specs.weight && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="p-2 rounded-lg bg-purple-100">
                          <Package className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Poids</p>
                          <p className="text-lg font-black text-slate-800">
                            {equipment.specs.weight}
                          </p>
                        </div>
                      </div>
                    )}

                    {equipment.specs.capacity && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="p-2 rounded-lg bg-emerald-100">
                          <Award className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Capacité</p>
                          <p className="text-lg font-black text-slate-800">
                            {equipment.specs.capacity}
                          </p>
                        </div>
                      </div>
                    )}

                    {equipment.specs.dimensions && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="p-2 rounded-lg bg-orange-100">
                          <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Dimensions</p>
                          <p className="text-lg font-black text-slate-800">
                            {equipment.specs.dimensions}
                          </p>
                        </div>
                      </div>
                    )}

                    {equipment.specs.fuelType && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="p-2 rounded-lg bg-red-100">
                          <Calendar className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Carburant</p>
                          <p className="text-lg font-black text-slate-800">
                            {equipment.specs.fuelType}
                          </p>
                        </div>
                      </div>
                    )}

                    {equipment.specs.yearBuilt && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Année</p>
                          <p className="text-lg font-black text-slate-800">
                            {equipment.specs.yearBuilt}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {equipment.tags && equipment.tags.length > 0 && (
                  <div>
                    <h3 className="text-xl font-black text-[#0A2619] mb-4">Mots-clés</h3>
                    <div className="flex flex-wrap gap-3">
                      {equipment.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 rounded-full bg-sky-50 text-sky-700 text-sm font-bold border border-sky-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reservation' && pricing && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-[#0A2619] mb-4">Tarifs de Location</h3>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl border-2 border-blue-200 bg-blue-50">
                    <p className="text-sm font-bold text-blue-600 mb-2">JOURNALIER</p>
                    <p className="text-4xl font-black text-blue-700">{pricing.daily}€</p>
                    <p className="text-sm text-blue-600 mt-1">par jour</p>
                  </div>

                  <div className="p-6 rounded-2xl border-2 border-purple-200 bg-purple-50">
                    <p className="text-sm font-bold text-purple-600 mb-2">HEBDOMADAIRE</p>
                    <p className="text-4xl font-black text-purple-700">
                      {Math.round(pricing.weekly)}€
                    </p>
                    <p className="text-sm text-purple-600 mt-1">par semaine</p>
                  </div>

                  <div className="p-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50">
                    <p className="text-sm font-bold text-emerald-600 mb-2">MENSUEL</p>
                    <p className="text-4xl font-black text-emerald-700">
                      {Math.round(pricing.monthly)}€
                    </p>
                    <p className="text-sm text-emerald-600 mt-1">par mois</p>
                  </div>
                </div>

                {/* Deposit Info */}
                {pricing.deposit > 0 && (
                  <div className="p-4 rounded-xl bg-yellow-50 border-2 border-yellow-200">
                    <p className="text-sm font-bold text-yellow-800">
                      💰 Caution requise: <span className="text-2xl">{pricing.deposit}€</span>
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Remboursée après restitution de l'équipement
                    </p>
                  </div>
                )}

                {/* Reservation Form */}
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-slate-50">
                  <h4 className="text-xl font-black text-slate-800 mb-4">Demande de Réservation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Date de début
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Date de fin
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Vos coordonnées
                      </label>
                      <input
                        type="text"
                        placeholder="Nom complet"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none mb-3"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none mb-3"
                      />
                      <input
                        type="tel"
                        placeholder="Téléphone"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <button className="w-full mt-6 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-lg hover:shadow-2xl hover:scale-105 transition-all">
                    Envoyer la demande
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'purchase' && equipment.price && (
              <div className="space-y-6">
                <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
                  <p className="text-sm font-bold text-emerald-600 mb-2 uppercase">Prix d'Achat</p>
                  <p className="text-6xl font-black text-emerald-700 mb-4">
                    {equipment.price.toLocaleString()}€
                  </p>
                  {equipment.discount && equipment.discount > 0 && (
                    <div className="inline-block px-4 py-2 rounded-full bg-red-500 text-white font-black text-sm">
                      -{equipment.discount}% de réduction!
                    </div>
                  )}
                </div>

                {/* Purchase Form */}
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-slate-50">
                  <h4 className="text-xl font-black text-slate-800 mb-4">Demande d'Achat</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Message (optionnel)
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:outline-none"
                        placeholder="Questions, demandes spécifiques..."
                      />
                    </div>
                  </div>
                  <button className="w-full mt-6 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-lg hover:shadow-2xl hover:scale-105 transition-all">
                    Envoyer la demande d'achat
                  </button>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white border-2 border-emerald-200">
                    <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-slate-800">Garantie constructeur</p>
                      <p className="text-sm text-slate-600">Selon conditions fabricant</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white border-2 border-emerald-200">
                    <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-slate-800">Livraison possible</p>
                      <p className="text-sm text-slate-600">Devis sur demande</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
