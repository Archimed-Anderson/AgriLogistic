'use client'

import { useState } from 'react'
import { EquipmentType } from '@/data/rental-equipment'
import { ShoppingCart, Wrench } from 'lucide-react'

interface RentalTypeSwitchProps {
  selectedType: EquipmentType | 'ALL'
  onSelectType: (type: EquipmentType | 'ALL') => void
}

export function RentalTypeSwitch({ selectedType, onSelectType }: RentalTypeSwitchProps) {
  return (
    <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-black py-16 border-b-4 border-yellow-500">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-white text-2xl font-black uppercase tracking-wider mb-2">
            Je cherche à
          </h2>
        </div>
        
        {/* Giant Switch */}
        <div className="flex justify-center gap-6">
          {/* LOUER Button */}
          <button
            onClick={() => onSelectType('LOCATION')}
            className={`
              relative group px-16 py-8 rounded-2xl font-black text-3xl uppercase tracking-wider
              transition-all duration-300 border-4
              ${selectedType === 'LOCATION' || selectedType === 'LOCATION_VENTE'
                ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white border-emerald-400 shadow-2xl scale-110'
                : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-slate-600 hover:scale-105'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <Wrench className="h-10 w-10" />
              <span>Louer</span>
            </div>
            {(selectedType === 'LOCATION' || selectedType === 'LOCATION_VENTE') && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-black animate-pulse">
                ACTIF
              </div>
            )}
          </button>
          
          {/* ACHETER Button */}
          <button
            onClick={() => onSelectType('VENTE')}
            className={`
              relative group px-16 py-8 rounded-2xl font-black text-3xl uppercase tracking-wider
              transition-all duration-300 border-4
              ${selectedType === 'VENTE' || selectedType === 'LOCATION_VENTE'
                ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-blue-400 shadow-2xl scale-110'
                : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-slate-600 hover:scale-105'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <ShoppingCart className="h-10 w-10" />
              <span>Acheter</span>
            </div>
            {(selectedType === 'VENTE' || selectedType === 'LOCATION_VENTE') && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-black animate-pulse">
                ACTIF
              </div>
            )}
          </button>
          
          {/* RESET/ALL Button */}
          {selectedType !== 'ALL' && (
            <button
              onClick={() => onSelectType('ALL')}
              className="px-8 py-8 rounded-2xl bg-slate-600 hover:bg-slate-500 text-white font-bold text-lg border-2 border-slate-500 transition-all"
            >
              Réinitialiser
            </button>
          )}
        </div>
        
        {/* Info text */}
        <div className="text-center mt-6">
          <p className="text-slate-400 font-medium">
            {selectedType === 'LOCATION' && '✓ Filtrage: Location uniquement'}
            {selectedType === 'VENTE' && '✓ Filtrage: Vente uniquement'}
            {selectedType === 'ALL' && 'Tous les équipements (location et vente)'}
          </p>
        </div>
      </div>
    </div>
  )
}
