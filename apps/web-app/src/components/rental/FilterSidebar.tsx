'use client';

import { EquipmentCategory } from '@/data/rental-equipment';
import { Tractor, Settings, Wrench, Building, ChevronRight } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategory: EquipmentCategory | 'ALL';
  onSelectCategory: (category: EquipmentCategory | 'ALL') => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  showOnlyAvailable: boolean;
  onAvailabilityChange: (available: boolean) => void;
  categoryCounts?: Record<EquipmentCategory | 'ALL', number>;
}

export function FilterSidebar({
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  showOnlyAvailable,
  onAvailabilityChange,
  categoryCounts,
}: FilterSidebarProps) {
  const categories = [
    { id: 'ALL' as const, label: 'Toutes Catégories', icon: Settings, color: 'slate' },
    {
      id: 'TRACTEURS_ENGINS' as EquipmentCategory,
      label: 'Tracteurs & Engins',
      icon: Tractor,
      color: 'green',
    },
    {
      id: 'MACHINES_TRAITEMENT' as EquipmentCategory,
      label: 'Machines Traitement',
      icon: Settings,
      color: 'blue',
    },
    {
      id: 'MAINTENANCE_NETTOYAGE' as EquipmentCategory,
      label: 'Maintenance',
      icon: Wrench,
      color: 'purple',
    },
    {
      id: 'MATERIAUX_CONSTRUCTION' as EquipmentCategory,
      label: 'Construction',
      icon: Building,
      color: 'orange',
    },
  ];

  return (
    <div className="bg-slate-800 text-white p-6 rounded-2xl border-2 border-slate-700 sticky top-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b-2 border-slate-700">
        <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Filtres
        </h2>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">
          Catégories
        </h3>
        <div className="space-y-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            const count = categoryCounts?.[category.id] || 0;

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`
                  w-full flex items-center justify-between p-3 rounded-xl font-bold transition-all
                  ${
                    isSelected
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg scale-105'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{category.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black">{count}</span>
                  {isSelected && <ChevronRight className="h-4 w-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">
          Prix (€/jour ou Prix total)
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400">Minimum</label>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border-2 border-slate-600 focus:border-yellow-500 focus:outline-none font-bold"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Maximum</label>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border-2 border-slate-600 focus:border-yellow-500 focus:outline-none font-bold"
              placeholder="100000"
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">
          Disponibilité
        </h3>
        <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-700 cursor-pointer hover:bg-slate-600 transition-all">
          <input
            type="checkbox"
            checked={showOnlyAvailable}
            onChange={(e) => onAvailabilityChange(e.target.checked)}
            className="w-5 h-5 rounded border-2 border-slate-500 text-emerald-500 focus:ring-emerald-500"
          />
          <span className="font-bold text-sm">Disponibles uniquement</span>
        </label>
      </div>

      {/* Reset Button */}
      <div className="mt-6 pt-6 border-t-2 border-slate-700">
        <button
          onClick={() => {
            onSelectCategory('ALL');
            onPriceChange([0, 100000]);
            onAvailabilityChange(false);
          }}
          className="w-full px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-sm transition-all"
        >
          Réinitialiser Filtres
        </button>
      </div>
    </div>
  );
}
