import { Check, X, Star, ThumbsUp, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { AffiliateRedirectButton } from './AffiliateRedirectButton'
import { AffiliateProduct } from '@/types/affiliate'

interface ComparisonTableProps {
  products: AffiliateProduct[]
}

export function ComparisonTable({ products }: ComparisonTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border-2 border-white/5 bg-[#1a1a1a] shadow-2xl">
      <div className="p-6 border-b border-white/5 bg-[#242424]/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-yellow-500" />
          <h3 className="text-2xl font-black text-white uppercase tracking-wider">Top Picks Comparatif</h3>
        </div>
        <div className="hidden md:block text-slate-500 text-xs font-black uppercase tracking-widest">
          Sélectionné par AgriLogistic Expert Team
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#141414]">
              <th className="p-6 text-left text-slate-400 font-black uppercase text-xs tracking-widest border-r border-white/5 w-1/4">Critères</th>
              {products.map((p, i) => (
                <th key={p.id} className={cn(
                  "p-6 border-white/5 min-w-[280px]",
                  i !== products.length - 1 && "border-r"
                )}>
                  <div className="flex flex-col items-center group">
                    <div className="relative w-24 h-24 mb-4">
                      <Image 
                        src={p.images[0]} 
                        alt={p.name} 
                        fill
                        className="object-cover rounded-xl border-2 border-white/10 group-hover:border-yellow-500/50 transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="text-yellow-500 text-[10px] font-black uppercase mb-1">{p.category}</div>
                    <div className="text-white font-black text-center text-sm line-clamp-1 uppercase px-4">{p.name}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {/* Note */}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="p-6 font-black text-slate-300 uppercase text-xs border-r border-white/5">Score Global</td>
              {products.map((p, i) => (
                <td key={p.id} className={cn(
                  "p-6 text-center border-white/5",
                  i !== products.length - 1 && "border-r"
                )}>
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star 
                        key={j} 
                        className={cn(
                          "h-4 w-4", 
                          j < Math.floor(p.rating) ? "text-yellow-500 fill-current" : "text-white/10"
                        )} 
                      />
                    ))}
                    <span className="ml-2 text-white font-black">{p.rating}</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Pros */}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="p-6 font-black text-emerald-500 uppercase text-xs border-r border-white/5">Points Forts</td>
              {products.map((p, i) => (
                <td key={p.id} className={cn(
                  "p-6 border-white/5",
                  i !== products.length - 1 && "border-r"
                )}>
                  <ul className="space-y-2">
                    {p.pros.slice(0, 3).map((pro, j) => (
                      <li key={j} className="flex items-start gap-2 text-[11px] text-slate-300 font-bold leading-tight">
                        <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Cons */}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="p-6 font-black text-red-500 uppercase text-xs border-r border-white/5">Points Faibles</td>
              {products.map((p, i) => (
                <td key={p.id} className={cn(
                  "p-6 border-white/5",
                  i !== products.length - 1 && "border-r"
                )}>
                  <ul className="space-y-2">
                    {p.cons.slice(0, 2).map((con, j) => (
                      <li key={j} className="flex items-start gap-2 text-[11px] text-slate-300 font-bold leading-tight">
                        <X className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Price */}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="p-6 font-black text-slate-300 uppercase text-xs border-r border-white/5">Meilleur Prix</td>
              {products.map((p, i) => (
                <td key={p.id} className={cn(
                  "p-6 text-center border-white/5",
                  i !== products.length - 1 && "border-r"
                )}>
                  <div className="text-2xl font-black text-white">{p.price.toLocaleString()}€</div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{p.platform}</div>
                </td>
              ))}
            </tr>

            {/* CTA */}
            <tr className="bg-[#141414]">
              <td className="p-6 border-r border-white/5"></td>
              {products.map((p, i) => (
                <td key={p.id} className={cn(
                  "p-6 border-white/5",
                  i !== products.length - 1 && "border-r"
                )}>
                  <AffiliateRedirectButton 
                    url={p.affiliateUrl} 
                    platform={p.platform} 
                    productId={p.id} 
                    className="hover:scale-105"
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
