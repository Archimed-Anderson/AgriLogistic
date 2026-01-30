'use client'

import { useState } from 'react'
import { EquipmentCategory } from '@/data/rental-equipment'
import { Tractor, Settings, Wrench, Building } from 'lucide-react'

interface CategoryFilterProps {
  selectedCategory: EquipmentCategory | 'ALL'
  onSelectCategory: (category: EquipmentCategory | 'ALL') => void
  counts?: Record<EquipmentCategory | 'ALL', number>
}

export function CategoryFilter({ selectedCategory, onSelectCategory, counts }: CategoryFilterProps) {
  const categories = [
    { 
      id: 'ALL' as const, 
      label: 'Tous', 
      icon: Settings,
      color: 'from-slate-500 to-slate-700'
    },
    { 
      id: 'TRACTEURS_ENGINS' as EquipmentCategory, 
      label: 'Tracteurs & Engins', 
      icon: Tractor,
      color: 'from-green-500 to-emerald-600'
    },
    { 
      id: 'MACHINES_TRAITEMENT' as EquipmentCategory, 
      label: 'Machines de Traitement', 
      icon: Settings,
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      id: 'MAINTENANCE_NETTOYAGE' as EquipmentCategory, 
      label: 'Maintenance & Nettoyage', 
      icon: Wrench,
      color: 'from-purple-500 to-pink-600'
    },
    { 
      id: 'MATERIAUX_CONSTRUCTION' as EquipmentCategory, 
      label: 'Construction', 
      icon: Building,
      color: 'from-orange-500 to-amber-600'
    }
  ]
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {categories.map(category => {
        const Icon = category.icon
        const isSelected = selectedCategory === category.id
        const count = counts?.[category.id] || 0
        
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`
              relative p-6 rounded-2xl border-2 transition-all duration-300
              ${isSelected 
                ? `bg-gradient-to-br ${category.color} text-white border-white shadow-2xl scale-105` 
                : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:shadow-xl hover:scale-105'
              }
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
                <Icon className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
              </div>
              <div className="text-center">
                <p className={`text-sm font-black ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                  {category.label}
                </p>
                {counts && (
                  <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                    {count} équipement{count > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
