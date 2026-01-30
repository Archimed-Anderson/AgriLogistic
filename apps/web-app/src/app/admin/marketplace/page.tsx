"use client"

import React, { useState, useEffect } from 'react'
import { marketplaceProducts, Product } from '@/data/marketplace-products'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Filter, 
  ArrowUpDown, 
  AlertCircle,
  X,
  Check,
  Package,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AdminMarketplacePage() {
  const [products, setProducts] = useState<Product[]>(marketplaceProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    category: "Céréales",
    stock: 0,
    description: "",
    image: "",
    unit: "Kg",
    currency: "FCFA"
  })

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData(product)
    } else {
      setEditingProduct(null)
      setFormData({
        id: `prod-${Date.now()}`,
        name: "",
        price: 0,
        category: "Céréales",
        stock: 0,
        description: "",
        image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076",
        unit: "Sac",
        currency: "FCFA",
        rating: 5.0
      })
    }
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } as Product : p))
    } else {
      setProducts(prev => [{ ...formData } as Product, ...prev])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Marketplace <span className="text-emerald-600">Manager</span></h1>
          <p className="text-slate-500 font-medium">Gérez votre catalogue de produits, les stocks et les prix en temps réel.</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-6 rounded-2xl shadow-xl shadow-emerald-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Ajouter un Produit
        </Button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Produits", value: products.length, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Catégories", value: 4, icon: Filter, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "En Rupture", value: products.filter(p => p.stock === 0).length, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Stock Total", value: products.reduce((acc, p) => acc + p.stock, 0), icon: ArrowUpDown, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
             <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
               <stat.icon className="h-6 w-6" />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
               <p className="text-2xl font-black text-slate-900">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou catégorie..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/10 font-medium text-slate-700 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-2xl h-12 px-6 flex items-center gap-2 font-bold border-slate-100 text-slate-600">
             <Filter className="h-4 w-4" /> Filtres
           </Button>
           <Button variant="outline" className="rounded-2xl h-12 px-6 flex items-center gap-2 font-bold border-slate-100 text-slate-600">
             <ArrowLeft className="h-4 w-4" /> Exporter
           </Button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Produit</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Catégorie</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Prix</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Stock</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">État</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm">{product.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900 text-sm">
                    {product.price} {product.currency} <span className="text-slate-400 text-[10px] font-medium italic">/{product.unit}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700 text-sm">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4">
                    {product.stock > 10 ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase">
                        <Check className="h-3 w-3" /> En Stock
                      </span>
                    ) : product.stock > 0 ? (
                      <span className="flex items-center gap-1.5 text-orange-500 text-[10px] font-black uppercase animate-pulse">
                        <AlertCircle className="h-3 w-3" /> Bas Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-600 text-[10px] font-black uppercase">
                        <X className="h-3 w-3" /> Épuisé
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                       >
                         <Edit className="h-4 w-4" />
                       </button>
                       <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
      </div>

      {/* Side Panel / Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl h-full bg-white shadow-2xl p-10 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
               <div>
                 <h3 className="text-2xl font-black text-slate-900">{editingProduct ? "Modifier le Produit" : "Nouveau Produit"}</h3>
                 <p className="text-slate-500 text-sm font-medium">Entrez les détails officiels du produit pour la marketplace.</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                 <X className="h-6 w-6 text-slate-300" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Nom du Produit</label>
                  <input 
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Ex: Maïs Jaune Selection"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Catégorie</label>
                  <select 
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 appearance-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                  >
                    <option>Céréales</option>
                    <option>Tubercules</option>
                    <option>Légumes & Légumineuses</option>
                    <option>Fruits</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Prix</label>
                  <div className="relative">
                    <input 
                      type="number"
                      required
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{formData.currency}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Stock Initial</label>
                  <input 
                    type="number"
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Ex: 500"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Image URL (Unsplash/Agro)</label>
                <input 
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Description</label>
                <textarea 
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 min-h-[120px]"
                  placeholder="Détails du produit..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="pt-8 border-t border-slate-50 flex gap-4">
                 <Button 
                   type="button" 
                   variant="outline" 
                   className="flex-1 h-14 rounded-2xl font-black border-slate-100 text-slate-400 hover:bg-slate-50"
                   onClick={() => setIsModalOpen(false)}
                 >
                   Annuler
                 </Button>
                 <Button 
                   type="submit" 
                   className="flex-[2] h-14 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700"
                 >
                   {editingProduct ? "Mettre à jour" : "Créer le Produit"}
                 </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
