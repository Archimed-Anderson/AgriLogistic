'use client';

import { useState } from 'react';
import {
  type RentalEquipment,
  type EquipmentCategory,
  type EquipmentType,
  type EquipmentAvailability,
} from '@/data/rental-equipment';
import { X, Tag, Globe, FileText } from 'lucide-react';

interface EquipmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: RentalEquipment | null;
  onSave: (equipment: Partial<RentalEquipment>) => void;
}

export function EquipmentFormModal({
  isOpen,
  onClose,
  equipment,
  onSave,
}: EquipmentFormModalProps) {
  const [formData, setFormData] = useState<Partial<RentalEquipment>>(
    equipment || {
      name: '',
      category: 'TRACTEURS_ENGINS',
      type: 'LOCATION',
      availability: 'DISPONIBLE',
      description: '',
      image: '',
      dailyRate: undefined,
      price: undefined,
      discount: 0,
      deposit: 0,
      specs: {
        power: '',
        weight: '',
        capacity: '',
        dimensions: '',
        fuelType: '',
        yearBuilt: undefined,
        brand: '',
        model: '',
      },
      tags: [],
      // SEO Fields
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [],
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-slate-200 px-8 py-6 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-3xl font-black uppercase">
            {equipment ? 'Éditer Équipement' : 'Nouvel Équipement'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Info */}
          <div>
            <h3 className="text-2xl font-black mb-4 uppercase text-slate-800">
              Informations de Base
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Nom de l'équipement *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-bold"
                  placeholder="Ex: Tracteur John Deere 6M"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Catégorie *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as EquipmentCategory })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-bold"
                >
                  <option value="TRACTEURS_ENGINS">Tracteurs & Engins</option>
                  <option value="MACHINES_TRAITEMENT">Machines Traitement</option>
                  <option value="MAINTENANCE_NETTOYAGE">Maintenance & Nettoyage</option>
                  <option value="MATERIAUX_CONSTRUCTION">Matériaux Construction</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as EquipmentType })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-bold"
                >
                  <option value="LOCATION">Location uniquement</option>
                  <option value="VENTE">Vente uniquement</option>
                  <option value="LOCATION_VENTE">Location & Vente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Disponibilité *
                </label>
                <select
                  required
                  value={formData.availability}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availability: e.target.value as EquipmentAvailability,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-bold"
                >
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="LOUE">Loué</option>
                  <option value="VENDU">Vendu</option>
                  <option value="MAINTENANCE">En maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-medium"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-medium resize-none"
                  placeholder="Description détaillée de l'équipement..."
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-t-2 border-slate-200 pt-8">
            <h3 className="text-2xl font-black mb-4 uppercase text-slate-800 flex items-center gap-3">
              <Tag className="h-6 w-6 text-emerald-600" />
              Tarification & Promotions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(formData.type === 'LOCATION' || formData.type === 'LOCATION_VENTE') && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-emerald-700 mb-2 uppercase">
                      Tarif Journalier (€) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.dailyRate || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, dailyRate: Number(e.target.value) })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-emerald-300 focus:border-emerald-500 focus:outline-none font-bold"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-emerald-700 mb-2 uppercase">
                      Caution (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.deposit || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, deposit: Number(e.target.value) })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-emerald-300 focus:border-emerald-500 focus:outline-none font-bold"
                      placeholder="0.00"
                    />
                  </div>
                </>
              )}

              {(formData.type === 'VENTE' || formData.type === 'LOCATION_VENTE') && (
                <div>
                  <label className="block text-sm font-bold text-blue-700 mb-2 uppercase">
                    Prix de Vente (€) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none font-bold"
                    placeholder="0.00"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-red-700 mb-2 uppercase flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Promotion - Réduction (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount || 0}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-red-300 focus:border-red-500 focus:outline-none font-bold"
                  placeholder="0"
                />
                <p className="text-xs text-red-600 mt-1 font-medium">
                  Ex: 10 pour -10% de réduction
                </p>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="border-t-2 border-slate-200 pt-8">
            <h3 className="text-2xl font-black mb-4 uppercase text-slate-800">
              Spécifications Techniques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Marque
                </label>
                <input
                  type="text"
                  value={formData.specs?.brand || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: { ...formData.specs!, brand: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Modèle
                </label>
                <input
                  type="text"
                  value={formData.specs?.model || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: { ...formData.specs!, model: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Puissance
                </label>
                <input
                  type="text"
                  value={formData.specs?.power || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: { ...formData.specs!, power: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-medium"
                  placeholder="Ex: 120 CV"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Poids
                </label>
                <input
                  type="text"
                  value={formData.specs?.weight || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: { ...formData.specs!, weight: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-medium"
                  placeholder="Ex: 4800 kg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Capacité
                </label>
                <input
                  type="text"
                  value={formData.specs?.capacity || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: { ...formData.specs!, capacity: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Carburant
                </label>
                <input
                  type="text"
                  value={formData.specs?.fuelType || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: { ...formData.specs!, fuelType: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-medium"
                  placeholder="Ex: Diesel"
                />
              </div>
            </div>
          </div>

          {/* SEO Fields */}
          <div className="border-t-2 border-slate-200 pt-8 bg-blue-50 -mx-8 px-8 py-8">
            <h3 className="text-2xl font-black mb-6 uppercase text-blue-900 flex items-center gap-3">
              <Globe className="h-6 w-6" />
              Optimisation SEO (Référencement Google)
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2 uppercase flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Titre SEO
                </label>
                <input
                  type="text"
                  value={formData.seoTitle || ''}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-600 focus:outline-none font-medium"
                  placeholder="Ex: Location Tracteur John Deere 120CV - Matériel Agricole Professionnel"
                />
                <p className="text-xs text-blue-700 mt-1 font-medium">
                  Titre affiché dans les résultats Google (50-60 caractères recommandés)
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2 uppercase">
                  Description Meta
                </label>
                <textarea
                  rows={3}
                  value={formData.seoDescription || ''}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-600 focus:outline-none font-medium resize-none"
                  placeholder="Ex: Louez un tracteur John Deere 6M de 120 CV pour vos travaux agricoles. Équipement professionnel disponible à la journée, semaine ou mois. Livraison possible."
                />
                <p className="text-xs text-blue-700 mt-1 font-medium">
                  Description affichée sous le titre dans Google (150-160 caractères recommandés)
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2 uppercase">
                  Mots-clés SEO (1 par ligne)
                </label>
                <textarea
                  rows={4}
                  value={(formData.seoKeywords || []).join('\n')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seoKeywords: e.target.value.split('\n').filter((k) => k.trim()),
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-600 focus:outline-none font-medium resize-none"
                  placeholder={
                    'location tracteur\ntracteur agricole professionnel\nJohn Deere 120CV\nmatériel agricole\nloueur équipement ferme'
                  }
                />
                <p className="text-xs text-blue-700 mt-1 font-medium">
                  Mots-clés pertinents pour le référencement (1 par ligne, 5-10 mots-clés
                  recommandés)
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t-2 border-slate-200 pt-8 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-xl bg-slate-200 text-slate-700 font-black uppercase hover:bg-slate-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black uppercase hover:shadow-2xl transition-all"
            >
              {equipment ? 'Mettre à Jour' : "Créer l'Équipement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
