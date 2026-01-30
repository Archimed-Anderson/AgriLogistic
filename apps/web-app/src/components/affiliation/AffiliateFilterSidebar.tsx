'use client'

import { AffiliateCategory, AffiliatePlatform } from '@/types/affiliate'
import { Filter, ChevronRight, Check, Globe, ShoppingBag, Box, Zap, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AffiliateFilterSidebarProps {
  selectedCategory: AffiliateCategory | 'ALL'
  onSelectCategory: (cat: AffiliateCategory | 'ALL') => void
  selectedPlatform: AffiliatePlatform | 'ALL'
  onSelectPlatform: (platform: AffiliatePlatform | 'ALL') => void
  counts: {
    categories: Record<string, number>
    platforms: Record<string, number>
  }
}

export function AffiliateFilterSidebar({
  selectedCategory,
  onSelectCategory,
  selectedPlatform,
  onSelectPlatform,
  counts
}: AffiliateFilterSidebarProps) {
  const categories: { id: AffiliateCategory | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'Tous les produits' },
    { id: 'OUTILLAGE', label: 'Outillage' },
    { id: 'ELECTRONIQUE', label: 'Électronique' },
    { id: 'GROS_EQUIPEMENTS', label: 'Gros Équipements' }
  ]

  const platforms: { id: AffiliatePlatform | 'ALL'; label: string; icon: LucideIcon }[] = [
    { id: 'ALL', label: 'Toutes plateformes', icon: Globe },
    { id: 'AMAZON', label: 'Amazon', icon: ShoppingBag },
    { id: 'ALIBABA', label: 'Alibaba', icon: Box },
    { id: 'DIRECT', label: 'Vente Directe', icon: Zap }
  ]

  return (
    <div className="space-y-8 bg-[#1a1a1a] backdrop-blur-xl border-2 border-white/5 p-6 rounded-2xl">
      <div className="flex items-center gap-2 mb-2 p-2 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-lg">
        <Filter className="h-5 w-5 text-yellow-500" />
        <h3 className="font-black text-white uppercase tracking-wider text-sm">Filtres Industriels</h3>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 mb-2">Catégories</div>
        <div className="grid gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "group flex items-center justify-between p-3 rounded-xl transition-all border-2",
                selectedCategory === cat.id 
                  ? "bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/20" 
                  : "bg-white/5 border-white/10 text-slate-400 hover:border-yellow-500/30 hover:text-white"
              )}
            >
              <span className="font-bold text-xs uppercase">{cat.label}</span>
              <div className={cn(
                "px-2 py-0.5 rounded-lg text-[10px] font-black",
                selectedCategory === cat.id ? "bg-black/20" : "bg-white/10"
              )}>
                {counts.categories[cat.id] || 0}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/5 mx-2" />

      {/* Platforms */}
      <div className="space-y-4">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 mb-2">Marketplace</div>
        <div className="grid gap-2">
          {platforms.map((plat) => {
            const Icon = plat.icon
            return (
              <button
                key={plat.id}
                onClick={() => onSelectPlatform(plat.id)}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-xl transition-all border-2",
                  selectedPlatform === plat.id 
                    ? "bg-white/10 border-yellow-500 text-yellow-500 shadow-lg" 
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-yellow-500/30 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4", selectedPlatform === plat.id ? "text-yellow-500" : "text-slate-500 group-hover:text-yellow-500")} />
                  <span className="font-bold text-xs uppercase">{plat.label}</span>
                </div>
                {selectedPlatform === plat.id && <Check className="h-4 w-4" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Promotional Banner in Sidebar */}
      <div className="relative mt-8 group cursor-pointer hover:scale-105 transition-transform duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-2xl blur-lg opacity-25 group-hover:opacity-100 transition-opacity" />
        <div className="relative p-5 bg-[#242424] border-2 border-white/5 group-hover:border-yellow-500/50 rounded-2xl text-center overflow-hidden">
          {/* Animated background element */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-16 h-16 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-colors" />
          
          <div className="bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded-full w-fit mx-auto mb-3 uppercase shadow-lg shadow-yellow-500/20">Offre Premium</div>
          <p className="text-white text-xs font-black uppercase mb-2">Devenez Partenaire</p>
          <p className="text-slate-400 text-[10px] font-bold mb-4">Gagnez jusqu'à 15% de commission sur vos recommandations.</p>
          <div className="text-yellow-500 font-black text-[10px] uppercase flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
            En savoir plus <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  )
}
