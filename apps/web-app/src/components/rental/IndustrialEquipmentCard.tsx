'use client';

import { RentalEquipment } from '@/data/rental-equipment';
import { RatingStars } from './RatingStars';
import { ShoppingCart, Wrench, Zap, Tag, TrendingUp, Award, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface IndustrialEquipmentCardProps {
  equipment: RentalEquipment;
}

export function IndustrialEquipmentCard({ equipment }: IndustrialEquipmentCardProps) {
  // Determine card styling based on type
  const isRental = equipment.type === 'LOCATION' || equipment.type === 'LOCATION_VENTE';
  const isSale = equipment.type === 'VENTE' || equipment.type === 'LOCATION_VENTE';
  const isBoth = equipment.type === 'LOCATION_VENTE';

  // Primary action color
  const primaryColor =
    equipment.type === 'LOCATION' ? 'emerald' : equipment.type === 'VENTE' ? 'blue' : 'purple';

  // Get badges
  const badges = [];
  if (equipment.featured) badges.push({ label: 'VEDETTE', color: 'yellow', icon: Award });
  if (equipment.discount && equipment.discount > 0)
    badges.push({ label: `PROMO -${equipment.discount}%`, color: 'red', icon: Tag });
  if (equipment.timesRented && equipment.timesRented > 50)
    badges.push({ label: 'INDISPENSABLE', color: 'orange', icon: TrendingUp });

  return (
    <Link href={`/loueur/${equipment.id}`}>
      <div className="group bg-slate-800 rounded-2xl overflow-hidden border-4 border-slate-700 hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 cursor-pointer">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-slate-900">
          <img
            src={equipment.image}
            alt={equipment.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* Badges overlay */}
          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
            {badges.map((badge, idx) => {
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={idx}
                  className={`
                    px-3 py-1.5 rounded-lg font-black text-xs uppercase tracking-wider flex items-center gap-1.5
                    ${badge.color === 'yellow' ? 'bg-yellow-500 text-black' : ''}
                    ${badge.color === 'red' ? 'bg-red-600 text-white' : ''}
                    ${badge.color === 'orange' ? 'bg-orange-500 text-white' : ''}
                  `}
                >
                  <BadgeIcon className="h-3 w-3" />
                  {badge.label}
                </div>
              );
            })}
          </div>

          {/* Availability badge */}
          <div className="absolute bottom-3 right-3">
            {equipment.availability === 'DISPONIBLE' ? (
              <div className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-black text-sm flex items-center gap-2">
                <Zap className="h-4 w-4" />
                DISPONIBLE
              </div>
            ) : equipment.availability === 'LOUE' ? (
              <div className="px-4 py-2 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                LOUÉ
              </div>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-red-600 text-white font-black text-sm">
                {equipment.availability}
              </div>
            )}
          </div>

          {/* Equipment name overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-xl font-black text-white uppercase tracking-wide line-clamp-2">
              {equipment.name}
            </h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Brand + Power */}
          <div className="flex items-center gap-2 mb-4">
            {equipment.specs.brand && (
              <span className="px-3 py-1 rounded-lg bg-slate-700 text-slate-300 text-xs font-black uppercase">
                {equipment.specs.brand}
              </span>
            )}
            {equipment.specs.power && (
              <span className="px-3 py-1 rounded-lg bg-yellow-500 text-black text-xs font-black">
                {equipment.specs.power}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
            {equipment.description}
          </p>

          {/* Rating */}
          {equipment.rating && (
            <div className="mb-4 pb-4 border-b border-slate-700">
              <RatingStars rating={equipment.rating} size="sm" showNumber={true} />
              <span className="text-xs text-slate-500 ml-2">({equipment.reviews} avis)</span>
            </div>
          )}

          {/* Pricing Section */}
          <div className="space-y-3">
            {/* RENTAL Pricing (GREEN) */}
            {isRental && equipment.dailyRate && (
              <div
                className={`
                p-4 rounded-xl border-2
                ${
                  equipment.type === 'LOCATION'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-400'
                    : 'bg-slate-700 border-emerald-500'
                }
              `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wrench
                      className={`h-5 w-5 ${equipment.type === 'LOCATION' ? 'text-white' : 'text-emerald-400'}`}
                    />
                    <span
                      className={`text-xs font-black uppercase ${equipment.type === 'LOCATION' ? 'text-white' : 'text-emerald-400'}`}
                    >
                      Location
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-3xl font-black ${equipment.type === 'LOCATION' ? 'text-white' : 'text-emerald-400'}`}
                  >
                    {equipment.dailyRate}€
                  </span>
                  <span
                    className={`text-sm ${equipment.type === 'LOCATION' ? 'text-white/80' : 'text-slate-400'}`}
                  >
                    /jour
                  </span>
                </div>
              </div>
            )}

            {/* SALE Pricing (BLUE) */}
            {isSale && equipment.price && (
              <div
                className={`
                p-4 rounded-xl border-2
                ${
                  equipment.type === 'VENTE'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 border-blue-400'
                    : 'bg-slate-700 border-blue-500'
                }
              `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingCart
                      className={`h-5 w-5 ${equipment.type === 'VENTE' ? 'text-white' : 'text-blue-400'}`}
                    />
                    <span
                      className={`text-xs font-black uppercase ${equipment.type === 'VENTE' ? 'text-white' : 'text-blue-400'}`}
                    >
                      Vente
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-3xl font-black ${equipment.type === 'VENTE' ? 'text-white' : 'text-blue-400'}`}
                  >
                    {equipment.price.toLocaleString()}€
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="mt-4">
            {equipment.type === 'LOCATION' && (
              <button className="w-full px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-sm transition-all flex items-center justify-center gap-2">
                <Wrench className="h-5 w-5" />
                Louer Maintenant
              </button>
            )}
            {equipment.type === 'VENTE' && (
              <button className="w-full px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-sm transition-all flex items-center justify-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Acheter
              </button>
            )}
            {equipment.type === 'LOCATION_VENTE' && (
              <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black uppercase text-sm transition-all">
                Voir Détails
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
