"use client"

import React from 'react'
import { Product } from '@/data/marketplace-products'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Star, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
  isNew?: boolean
}

export function ProductCard({ product, isNew }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <div className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col h-full">
      {/* Badge Nouveau */}
      {isNew && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
          Nouveau
        </div>
      )}

      {/* Image Container */}
      <Link href={`/marketplace/${product.id}`} className="relative h-56 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-1 bg-slate-50 rounded-lg">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-xs font-bold">{product.rating}</span>
          </div>
        </div>

        <Link href={`/marketplace/${product.id}`}>
          <h3 className="text-lg font-black text-primary mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
          <div>
            <span className="text-xl font-black text-primary">
              {product.price} {product.currency}
            </span>
            <span className="block text-[10px] font-bold text-muted-foreground opacity-60">
              Par {product.unit}
            </span>
          </div>
          
          <Button 
            onClick={(e) => {
              e.preventDefault()
              addToCart(product)
            }}
            size="icon"
            className="h-10 w-10 rounded-xl bg-primary hover:bg-orange-600 shadow-lg shadow-primary/10 transition-all hover:scale-110 active:scale-95"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
