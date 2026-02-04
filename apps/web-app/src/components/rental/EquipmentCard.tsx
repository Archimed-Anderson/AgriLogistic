'use client';

import { RentalEquipment } from '@/data/rental-equipment';
import { RatingStars } from './RatingStars';
import { Badge, MapPin, Calendar, Euro, Tag } from 'lucide-react';

interface EquipmentCardProps {
  equipment: RentalEquipment;
  onClick: () => void;
}

export function EquipmentCard({ equipment, onClick }: EquipmentCardProps) {
  // Get type badge color
  const getTypeBadge = () => {
    if (equipment.type === 'LOCATION') {
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300',
        label: 'Location',
      };
    }
    if (equipment.type === 'VENTE') {
      return {
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        border: 'border-emerald-300',
        label: 'Vente',
      };
    }
    return {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
      label: 'Location & Vente',
    };
  };

  const typeBadge = getTypeBadge();

  // Get availability status
  const getAvailabilityBadge = () => {
    if (equipment.availability === 'DISPONIBLE') {
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Disponible' };
    }
    if (equipment.availability === 'LOUE') {
      return { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Loué' };
    }
    if (equipment.availability === 'VENDU') {
      return { bg: 'bg-red-50', text: 'text-red-700', label: 'Vendu' };
    }
    return { bg: 'bg-slate-50', text: 'text-slate-700', label: 'Maintenance' };
  };

  const availabilityBadge = getAvailabilityBadge();

  // Get price display
  const getPriceDisplay = () => {
    if (equipment.price && equipment.dailyRate) {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#0A2619]">{equipment.dailyRate}€</span>
            <span className="text-sm text-slate-500">/jour</span>
          </div>
          <div className="text-sm text-slate-600">
            ou <span className="font-bold">{equipment.price.toLocaleString()}€</span> à l'achat
          </div>
        </div>
      );
    }
    if (equipment.dailyRate) {
      return (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-[#0A2619]">{equipment.dailyRate}€</span>
          <span className="text-sm text-slate-500">/jour</span>
        </div>
      );
    }
    if (equipment.price) {
      return (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-emerald-600">
            {equipment.price.toLocaleString()}€
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-3xl overflow-hidden border-2 border-slate-200 hover:border-sky-400 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Type badge */}
        <div
          className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl ${typeBadge.bg} ${typeBadge.text} border-2 ${typeBadge.border} backdrop-blur-sm`}
        >
          <span className="text-xs font-black uppercase tracking-wide">{typeBadge.label}</span>
        </div>

        {/* Featured badge */}
        {equipment.featured && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-2 border-white/20 backdrop-blur-sm">
            <span className="text-xs font-black uppercase tracking-wide flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Vedette
            </span>
          </div>
        )}

        {/* Equipment name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-black text-white mb-1 line-clamp-2">{equipment.name}</h3>
        </div>
      </div>

      {/* Card body */}
      <div className="p-6">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
            {equipment.specs.brand || 'Professionnel'}
          </span>
          {equipment.specs.power && (
            <span className="px-3 py-1 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold">
              {equipment.specs.power}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{equipment.description}</p>

        {/* Rating */}
        {equipment.rating && (
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
            <RatingStars rating={equipment.rating} size="sm" showNumber={true} />
            <span className="text-xs text-slate-500">({equipment.reviews} avis)</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">{getPriceDisplay()}</div>

        {/* Availability */}
        <div
          className={`px-4 py-2 rounded-xl ${availabilityBadge.bg} ${availabilityBadge.text} text-center`}
        >
          <span className="text-sm font-bold">{availabilityBadge.label}</span>
          {equipment.nextAvailableDate && equipment.availability === 'LOUE' && (
            <span className="text-xs block mt-1">
              Retour prévu: {new Date(equipment.nextAvailableDate).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>

        {/* Specs preview */}
        {equipment.specs.capacity && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>Capacité: {equipment.specs.capacity}</span>
          </div>
        )}

        {/* Discount badge */}
        {equipment.discount && equipment.discount > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-red-500 text-white shadow-xl">
            <span className="text-sm font-black">-{equipment.discount}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
