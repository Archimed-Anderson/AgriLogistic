import { AffiliateProduct } from '@/types/affiliate'
import { Star, ShieldCheck, Award, Zap, ExternalLink, ShoppingBag } from 'lucide-react'
import { AffiliateRedirectButton } from './AffiliateRedirectButton'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AffiliateProductCardProps {
  product: AffiliateProduct
  className?: string
}

export function AffiliateProductCard({ product, className }: AffiliateProductCardProps) {
  const isFlash = product.discount && product.discount > 15
  
  return (
    <div className={cn(
      "group relative flex flex-col bg-[#242424] backdrop-blur-md border-2 border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 hover:scale-105",
      className
    )}>
      {/* Platform Badge */}
      <div className={cn(
        "absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-black/50",
        product.platform === 'AMAZON' ? "bg-orange-500 text-black font-black" : 
        product.platform === 'ALIBABA' ? "bg-yellow-500 text-black font-black" : "bg-emerald-500 text-white"
      )}>
        <ShoppingBag className="h-3 w-3" />
        {product.platform}
      </div>

      {/* Social Proof Badge */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
        {product.rating >= 4.7 && (
          <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-lg shadow-black/50">
            <ShieldCheck className="h-3 w-3" />
            Top Fiabilité
          </div>
        )}
        {isFlash && (
          <div className="bg-orange-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 animate-pulse shadow-lg shadow-black/50 border border-white/20">
            <Zap className="h-3 w-3 fill-current" />
            Promo Flash
          </div>
        )}
      </div>

      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-[#1a1a1a]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col bg-gradient-to-b from-[#1a1a1a]/50 to-[#1a1a1a]">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "h-3 w-3", 
                  i < Math.floor(product.rating) ? "fill-current" : "opacity-30"
                )} 
              />
            ))}
            <span className="ml-2 text-xs font-black">{product.rating}</span>
          </div>
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">({product.reviewCount} avis)</span>
        </div>

        <h3 className="text-xl font-black text-white mb-2 line-clamp-2 uppercase tracking-tighter leading-tight italic group-hover:text-yellow-500 transition-colors">
          {product.name}
        </h3>

        <p className="text-slate-400 text-xs font-bold mb-6 line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Pricing */}
        <div className="mt-auto mb-6 flex items-end gap-3">
          <div className="text-4xl font-black text-white italic tracking-tighter">
            {product.price.toLocaleString()}€
          </div>
          {product.originalPrice && (
            <div className="text-slate-600 line-through text-lg font-bold mb-1 opacity-50">
              {product.originalPrice.toLocaleString()}€
            </div>
          )}
          {product.discount && (
            <div className="bg-orange-500 text-black px-2 py-0.5 rounded text-[10px] font-black mb-1.5 border border-white/10 shadow-lg shadow-orange-500/10">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* CTA */}
        <AffiliateRedirectButton 
          url={product.affiliateUrl} 
          platform={product.platform} 
          productId={product.id}
          className="hover:scale-105 active:scale-95 transition-transform"
        />
      </div>
    </div>
  )
}
