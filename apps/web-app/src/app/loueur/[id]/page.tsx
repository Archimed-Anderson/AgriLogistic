'use client';

import { notFound } from 'next/navigation';
import { getEquipmentById, getRecommendedEquipment } from '@/data/rental-equipment';
import { RatingStars } from '@/components/rental/RatingStars';
import { IndustrialEquipmentCard } from '@/components/rental/IndustrialEquipmentCard';
import {
  ShoppingCart,
  Wrench,
  Package,
  TrendingUp,
  Award,
  MapPin,
  Calendar,
  Zap,
  Mail,
  Phone,
  User,
  MessageSquare,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function EquipmentDetailPage({ params }: { params: { id: string } }) {
  const equipment = getEquipmentById(params.id);

  if (!equipment) {
    notFound();
  }

  const recommended = getRecommendedEquipment(params.id, 3);

  // Pricing calc
  const pricing = equipment.dailyRate
    ? {
        daily: equipment.dailyRate,
        weekly: equipment.weeklyRate || Math.round(equipment.dailyRate * 7 * 0.85),
        monthly: equipment.monthlyRate || Math.round(equipment.dailyRate * 30 * 0.75),
        deposit: equipment.deposit || 0,
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      {/* Back Button */}
      <div className="bg-slate-800 border-b-2 border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/loueur"
            className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-bold transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Retour au catalogue
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN - Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative h-[500px] rounded-3xl overflow-hidden border-4 border-slate-700">
              <img
                src={equipment.image}
                alt={equipment.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-wrap gap-3">
                {equipment.featured && (
                  <div className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-black text-sm uppercase flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    VEDETTE
                  </div>
                )}
                {equipment.discount && equipment.discount > 0 && (
                  <div className="px-4 py-2 rounded-xl bg-red-600 text-white font-black text-sm uppercase">
                    PROMO -{equipment.discount}%
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="absolute bottom-6 right-6">
                {equipment.availability === 'DISPONIBLE' ? (
                  <div className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-black text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    DISPONIBLE
                  </div>
                ) : (
                  <div className="px-6 py-3 rounded-xl bg-orange-500 text-white font-black text-lg">
                    {equipment.availability}
                  </div>
                )}
              </div>
            </div>

            {/* Equipment Name & Info */}
            <div>
              <h1 className="text-5xl font-black uppercase tracking-wider mb-4">
                {equipment.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                {equipment.specs.brand && (
                  <span className="px-4 py-2 rounded-xl bg-slate-700 text-slate-300 font-black uppercase">
                    {equipment.specs.brand}
                  </span>
                )}
                {equipment.specs.model && (
                  <span className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-black">
                    {equipment.specs.model}
                  </span>
                )}
                {equipment.rating && (
                  <div className="flex items-center gap-2">
                    <RatingStars rating={equipment.rating} size="lg" showNumber={true} />
                    <span className="text-slate-400">({equipment.reviews} avis)</span>
                  </div>
                )}
              </div>

              <p className="text-lg text-slate-300 leading-relaxed">{equipment.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-slate-800 rounded-3xl p-8 border-2 border-slate-700">
              <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
                <Package className="h-8 w-8 text-yellow-500" />
                Spécifications Techniques
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.specs.power && (
                  <div className="p-4 rounded-xl bg-slate-700 border-2 border-slate-600">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Puissance</p>
                    <p className="text-xl font-black">{equipment.specs.power}</p>
                  </div>
                )}

                {equipment.specs.weight && (
                  <div className="p-4 rounded-xl bg-slate-700 border-2 border-slate-600">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Poids</p>
                    <p className="text-xl font-black">{equipment.specs.weight}</p>
                  </div>
                )}

                {equipment.specs.capacity && (
                  <div className="p-4 rounded-xl bg-slate-700 border-2 border-slate-600">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Capacité</p>
                    <p className="text-xl font-black">{equipment.specs.capacity}</p>
                  </div>
                )}

                {equipment.specs.dimensions && (
                  <div className="p-4 rounded-xl bg-slate-700 border-2 border-slate-600">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Dimensions</p>
                    <p className="text-xl font-black">{equipment.specs.dimensions}</p>
                  </div>
                )}

                {equipment.specs.fuelType && (
                  <div className="p-4 rounded-xl bg-slate-700 border-2 border-slate-600">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Carburant</p>
                    <p className="text-xl font-black">{equipment.specs.fuelType}</p>
                  </div>
                )}

                {equipment.specs.yearBuilt && (
                  <div className="p-4 rounded-xl bg-slate-700 border-2 border-slate-600">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Année</p>
                    <p className="text-xl font-black">{equipment.specs.yearBuilt}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Pricing & Contact */}
          <div className="lg:col-span-1 space-y-6">
            {/* RENTAL Pricing */}
            {equipment.dailyRate && pricing && (
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 border-4 border-emerald-400">
                <div className="flex items-center gap-3 mb-6">
                  <Wrench className="h-8 w-8 text-white" />
                  <h3 className="text-2xl font-black uppercase text-white">Location</h3>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-white/90 font-bold">Journalier</span>
                    <span className="text-4xl font-black text-white">{pricing.daily}€</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-white/90 font-bold">Hebdomadaire</span>
                    <span className="text-2xl font-black text-white">{pricing.weekly}€</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-white/90 font-bold">Mensuel</span>
                    <span className="text-2xl font-black text-white">{pricing.monthly}€</span>
                  </div>
                </div>

                {pricing.deposit > 0 && (
                  <div className="p-4 rounded-xl bg-white/20 mb-6">
                    <p className="text-white/90 text-sm font-bold">
                      💰 Caution: <span className="text-xl">{pricing.deposit}€</span>
                    </p>
                  </div>
                )}

                <button className="w-full px-8 py-4 rounded-xl bg-white text-emerald-600 font-black uppercase text-lg hover:bg-slate-100 transition-all">
                  Réserver Maintenant
                </button>
              </div>
            )}

            {/* SALE Pricing */}
            {equipment.price && (
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 border-4 border-blue-400">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingCart className="h-8 w-8 text-white" />
                  <h3 className="text-2xl font-black uppercase text-white">Achat</h3>
                </div>

                <div className="mb-6">
                  <p className="text-white/90 text-sm font-bold uppercase mb-2">Prix</p>
                  <p className="text-6xl font-black text-white">
                    {equipment.price.toLocaleString()}€
                  </p>
                </div>

                <button className="w-full px-8 py-4 rounded-xl bg-white text-blue-600 font-black uppercase text-lg hover:bg-slate-100 transition-all">
                  Acheter
                </button>
              </div>
            )}

            {/* Contact Form */}
            <div className="bg-slate-800 rounded-3xl p-8 border-2 border-slate-700">
              <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-yellow-500" />
                Demander un Devis
              </h3>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-700 border-2 border-slate-600 focus:border-yellow-500 focus:outline-none font-bold"
                      placeholder="Jean Dupont"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-700 border-2 border-slate-600 focus:border-yellow-500 focus:outline-none font-bold"
                      placeholder="jean@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="tel"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-700 border-2 border-slate-600 focus:border-yellow-500 focus:outline-none font-bold"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-slate-700 border-2 border-slate-600 focus:border-yellow-500 focus:outline-none font-bold resize-none"
                    placeholder="Décrivez votre besoin..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black uppercase text-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
                >
                  Envoyer la Demande
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Recommended Equipment */}
        {recommended.length > 0 && (
          <div className="mt-16">
            <h2 className="text-4xl font-black uppercase mb-8 flex items-center gap-4">
              <TrendingUp className="h-10 w-10 text-yellow-500" />
              Équipements Similaires
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommended.map((eq) => (
                <IndustrialEquipmentCard key={eq.id} equipment={eq} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
