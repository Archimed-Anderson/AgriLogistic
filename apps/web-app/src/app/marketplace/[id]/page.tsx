"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { marketplaceProducts } from '@/data/marketplace-products'
import { useCart } from '@/context/CartContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  Star, 
  ArrowLeft, 
  CheckCircle2, 
  Globe2, 
  ShieldCheck,
  Package,
  ArrowRight,
  Truck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addToCart, updateQuantity, cart } = useCart()
  const [qty, setQty] = useState(1)

  const product = marketplaceProducts.find(p => p.id === id)
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Produit non trouvé</h1>
          <Link href="/marketplace" className="text-primary font-bold hover:underline flex items-center gap-2 justify-center">
            <ArrowLeft className="h-4 w-4" /> Retour au marché
          </Link>
        </div>
      </div>
    )
  }

  const relatedProducts = marketplaceProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    // Basic logic: add one by one or implement quantity in addToCart
    for(let i=0; i<qty; i++) {
        addToCart(product)
    }
    // Alternatively, I should probably update Context to handle quantity in addToCart
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container px-6 mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm font-bold text-muted-foreground/60">
            <Link href="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
            <span>/</span>
            <span className="text-primary">{product.category}</span>
            <span>/</span>
            <span className="text-muted-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Product Image */}
            <div className="space-y-6">
              <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl shadow-primary/5 group">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Float Badges */}
                <div className="absolute top-8 left-8 flex flex-col gap-3">
                    <div className="px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-white shadow-xl flex items-center gap-2 animate-float">
                        <Globe2 className="h-4 w-4 text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Origine Certifiée</span>
                    </div>
                </div>
              </div>

              {/* Grid of gallery/details (Mock) */}
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                    <Package className="h-6 w-6 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col h-full">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[11px] font-black uppercase tracking-[0.2em] border border-primary/10">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50/50 px-3 py-1.5 rounded-full border border-amber-100">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs font-black">{product.rating}</span>
                    <span className="text-[10px] text-muted-foreground/60 ml-1 font-bold">(128 avis)</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 tracking-tight leading-none">
                  {product.name}
                </h1>
                
                <div className="flex items-end gap-3 mb-8">
                  <span className="text-4xl font-black text-orange-600">
                    {product.price} {product.currency}
                  </span>
                  <span className="text-muted-foreground text-lg font-bold mb-1">
                    / {product.unit}
                  </span>
                </div>

                <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-10">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-12">
                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                     <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                       <ShieldCheck className="h-5 w-5 text-emerald-600" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Sécurité</p>
                       <p className="text-sm font-bold text-primary">Qualité Garantie</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                     <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                       <Truck className="h-5 w-5 text-blue-600" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Livraison</p>
                       <p className="text-sm font-bold text-primary">24h - 48h</p>
                     </div>
                   </div>
                </div>
              </div>

              {/* Purchase Section */}
              <div className="mt-auto space-y-6">
                <div className="flex items-center gap-8">
                  <div className="flex items-center bg-slate-100 rounded-2xl p-1 h-14 w-40">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="flex-1 flex items-center justify-center h-full text-primary hover:bg-white rounded-xl transition-all active:scale-90"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="w-12 text-center text-lg font-black text-primary">{qty}</span>
                    <button 
                      onClick={() => setQty(qty + 1)}
                      className="flex-1 flex items-center justify-center h-full text-primary hover:bg-white rounded-xl transition-all active:scale-90"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <Button 
                      onClick={handleAddToCart}
                      className="w-full h-14 bg-primary text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Ajouter au panier
                    </Button>
                  </div>
                </div>

                <p className="text-center text-xs font-bold text-muted-foreground px-4">
                  Paiement sécurisé via AgriLogistic Pay. Stock disponible : <span className="text-primary">{product.stock} {product.unit}s</span>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info Section (Tabs-like) */}
          <div className="mt-24 bg-slate-50/50 rounded-[4rem] p-12 border border-slate-100">
            <div className="max-w-4xl mx-auto">
               <h2 className="text-3xl font-black text-primary mb-8 text-center">Valeurs Nutritionnelles & Infos</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 {[
                   { label: "Calories", value: "342 kcal" },
                   { label: "Protéines", value: "9.4g" },
                   { label: "Glucides", value: "74.3g" },
                   { label: "Fibres", value: "2.4g" }
                 ].map(stat => (
                   <div key={stat.label} className="text-center">
                     <p className="text-sm font-black text-primary mb-1">{stat.value}</p>
                     <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                   </div>
                 ))}
               </div>
               <div className="mt-12 pt-12 border-t border-slate-200/60">
                 <p className="text-muted-foreground font-medium text-center">
                   Ce produit est récolté localement et traité dans le respect des normes d'hygiène les plus strictes. Traçabilité blockchain disponible via AgriLogistic Trace.
                 </p>
               </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-primary">Produits Similaires</h2>
              <Link href="/marketplace" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Voir tout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <div key={p.id} className="group cursor-pointer">
                  <div className="aspect-square rounded-[2rem] overflow-hidden border border-slate-100 mb-4 bg-slate-50 transition-transform group-hover:-translate-y-2">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-black text-primary text-lg group-hover:text-orange-500 transition-colors">{p.name}</h3>
                  <p className="font-bold text-orange-600">{p.price} {p.currency}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
