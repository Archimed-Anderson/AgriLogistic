'use client'

import { useState } from 'react'
import { rentalEquipmentData, type RentalEquipment, type EquipmentCategory, type EquipmentType } from '@/data/rental-equipment'
import { EquipmentFormModal } from '@/components/admin/EquipmentFormModal'
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  TrendingUp,
  ShoppingCart,
  Wrench,
  Tag,
  Eye
} from 'lucide-react'

export default function LoueurManagerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | 'ALL'>('ALL')
  const [selectedType, setSelectedType] = useState<EquipmentType | 'ALL'>('ALL')
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentEquipment, setCurrentEquipment] = useState<RentalEquipment | null>(null)
  
  // Filter equipment
  let filteredEquipment = rentalEquipmentData
  
  if (selectedCategory !== 'ALL') {
    filteredEquipment = filteredEquipment.filter(eq => eq.category === selectedCategory)
  }
  
  if (selectedType !== 'ALL') {
    filteredEquipment = filteredEquipment.filter(eq => 
      eq.type === selectedType || eq.type === 'LOCATION_VENTE'
    )
  }
  
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filteredEquipment = filteredEquipment.filter(eq =>
      eq.name.toLowerCase().includes(query) ||
      eq.specs.brand?.toLowerCase().includes(query)
    )
  }
  
  // Stats
  const stats = {
    total: rentalEquipmentData.length,
    location: rentalEquipmentData.filter(eq => eq.type === 'LOCATION' || eq.type === 'LOCATION_VENTE').length,
    vente: rentalEquipmentData.filter(eq => eq.type === 'VENTE' || eq.type === 'LOCATION_VENTE').length,
    disponible: rentalEquipmentData.filter(eq => eq.availability === 'DISPONIBLE').length
  }
  
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-wide">
                Gestion Loueur
              </h1>
              <p className="text-slate-600 font-medium">
                Gérez vos équipements de location et de vente
              </p>
            </div>
            
            <button
              onClick={() => {
                setCurrentEquipment(null)
                setShowEditModal(true)
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black uppercase flex items-center gap-2 hover:shadow-2xl transition-all"
            >
              <Plus className="h-5 w-5" />
              Nouvel Équipement
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
              <Package className="h-8 w-8 text-blue-600 mb-3" />
              <p className="text-3xl font-black text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-600 font-bold uppercase">Total Équipements</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-lg">
              <Wrench className="h-8 w-8 text-emerald-600 mb-3" />
              <p className="text-3xl font-black text-slate-900">{stats.location}</p>
              <p className="text-sm text-slate-600 font-bold uppercase">À Louer</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
              <ShoppingCart className="h-8 w-8 text-blue-600 mb-3" />
              <p className="text-3xl font-black text-slate-900">{stats.vente}</p>
              <p className="text-sm text-slate-600 font-bold uppercase">À Vendre</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
              <p className="text-3xl font-black text-slate-900">{stats.disponible}</p>
              <p className="text-sm text-slate-600 font-bold uppercase">Disponibles</p>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un équipement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-bold"
                />
              </div>
            </div>
            
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-bold"
              >
                <option value="ALL">Toutes Catégories</option>
                <option value="TRACTEURS_ENGINS">Tracteurs & Engins</option>
                <option value="MACHINES_TRAITEMENT">Machines Traitement</option>
                <option value="MAINTENANCE_NETTOYAGE">Maintenance</option>
                <option value="MATERIAUX_CONSTRUCTION">Construction</option>
              </select>
            </div>
            
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-bold"
              >
                <option value="ALL">Tous Types</option>
                <option value="LOCATION">Location</option>
                <option value="VENTE">Vente</option>
                <option value="LOCATION_VENTE">Location & Vente</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Equipment Table */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-black uppercase text-sm">Équipement</th>
                  <th className="px-6 py-4 text-left font-black uppercase text-sm">Catégorie</th>
                  <th className="px-6 py-4 text-left font-black uppercase text-sm">Type</th>
                  <th className="px-6 py-4 text-left font-black uppercase text-sm">Prix/Tarif</th>
                  <th className="px-6 py-4 text-left font-black uppercase text-sm">Promo</th>
                  <th className="px-6 py-4 text-left font-black uppercase text-sm">Disponibilité</th>
                  <th className="px-6 py-4 text-center font-black uppercase text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredEquipment.map((equipment) => (
                  <tr key={equipment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={equipment.image}
                          alt={equipment.name}
                          className="w-16 h-16 rounded-lg object-cover border-2 border-slate-200"
                        />
                        <div>
                          <p className="font-black text-slate-900">{equipment.name}</p>
                          <p className="text-sm text-slate-600">{equipment.specs.brand}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
                        {equipment.category === 'TRACTEURS_ENGINS' && 'Tracteurs'}
                        {equipment.category === 'MACHINES_TRAITEMENT' && 'Machines'}
                        {equipment.category === 'MAINTENANCE_NETTOYAGE' && 'Maintenance'}
                        {equipment.category === 'MATERIAUX_CONSTRUCTION' && 'Construction'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {(equipment.type === 'LOCATION' || equipment.type === 'LOCATION_VENTE') && (
                          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1">
                            <Wrench className="h-3 w-3" />
                            Location
                          </span>
                        )}
                        {(equipment.type === 'VENTE' || equipment.type === 'LOCATION_VENTE') && (
                          <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1">
                            <ShoppingCart className="h-3 w-3" />
                            Vente
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm">
                        {equipment.dailyRate && (
                          <div className="text-emerald-700">{equipment.dailyRate}€/jour</div>
                        )}
                        {equipment.price && (
                          <div className="text-blue-700">{equipment.price.toLocaleString()}€</div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {equipment.discount && equipment.discount > 0 ? (
                        <span className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-black flex items-center gap-1 w-fit">
                          <Tag className="h-3 w-3" />
                          -{equipment.discount}%
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`
                        px-3 py-1 rounded-lg text-xs font-black uppercase
                        ${equipment.availability === 'DISPONIBLE' ? 'bg-green-100 text-green-700' : ''}
                        ${equipment.availability === 'LOUE' ? 'bg-orange-100 text-orange-700' : ''}
                        ${equipment.availability === 'VENDU' ? 'bg-red-100 text-red-700' : ''}
                        ${equipment.availability === 'MAINTENANCE' ? 'bg-slate-100 text-slate-700' : ''}
                      `}>
                        {equipment.availability}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => window.open(`/loueur/${equipment.id}`, '_blank')}
                          className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentEquipment(equipment)
                            setShowEditModal(true)
                          }}
                          className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                          title="Éditer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Êtes-vous sûr de vouloir supprimer "${equipment.name}" ?`)) {
                              // TODO: Delete logic
                              alert('Suppression à implémenter')
                            }
                          }}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredEquipment.length === 0 && (
            <div className="text-center py-16">
              <Package className="h-20 w-20 text-slate-300 mx-auto mb-4" />
              <p className="text-xl font-black text-slate-400 uppercase">Aucun équipement trouvé</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Equipment Form Modal */}
      <EquipmentFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setCurrentEquipment(null)
        }}
        equipment={currentEquipment}
        onSave={(equipmentData) => {
          if (currentEquipment) {
            console.log('Update equipment:', currentEquipment.id, equipmentData)
            alert(`Équipement "${equipmentData.name}" mis à jour! (à implémenter avec backend)`)
          } else {
            console.log('Create equipment:', equipmentData)
            alert(`Équipement "${equipmentData.name}" créé! (à implémenter avec backend)`)
          }
        }}
      />
    </div>
  )
}
