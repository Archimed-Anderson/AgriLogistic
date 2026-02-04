'use client';

import { useState } from 'react';
import { AffiliateProduct, AffiliateCategory, AffiliatePlatform } from '@/types/affiliate';
import { AffiliateProductCard } from './AffiliateProductCard';
import { AffiliateFilterSidebar } from './AffiliateFilterSidebar';
import { Search, Package, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AffiliationCatalogueProps {
  initialProducts: AffiliateProduct[];
}

export function AffiliationCatalogue({ initialProducts }: AffiliationCatalogueProps) {
  const [selectedCategory, setSelectedCategory] = useState<AffiliateCategory | 'ALL'>('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState<AffiliatePlatform | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Logique de filtrage
  const filteredProducts = initialProducts.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'ALL' || p.platform === selectedPlatform;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPlatform && matchesSearch;
  });

  // Calcul des compteurs
  const counts = {
    categories: {
      ALL: initialProducts.length,
      OUTILLAGE: initialProducts.filter((p) => p.category === 'OUTILLAGE').length,
      ELECTRONIQUE: initialProducts.filter((p) => p.category === 'ELECTRONIQUE').length,
      GROS_EQUIPEMENTS: initialProducts.filter((p) => p.category === 'GROS_EQUIPEMENTS').length,
    },
    platforms: {
      ALL: initialProducts.length,
      AMAZON: initialProducts.filter((p) => p.platform === 'AMAZON').length,
      ALIBABA: initialProducts.filter((p) => p.platform === 'ALIBABA').length,
      DIRECT: initialProducts.filter((p) => p.platform === 'DIRECT').length,
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar - Filtres */}
      <aside className="lg:col-span-1">
        <AffiliateFilterSidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedPlatform={selectedPlatform}
          onSelectPlatform={setSelectedPlatform}
          counts={counts}
        />
      </aside>

      {/* Main Content - Grille */}
      <main className="lg:col-span-3 space-y-6">
        {/* Toolbar */}
        <div className="bg-[#1a1a1a] backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un outil, un capteur..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-yellow-500 transition-all placeholder:text-slate-600 focus:bg-white/10 shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="hidden md:flex bg-white/5 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-all',
                  viewMode === 'grid'
                    ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                    : 'text-slate-500 hover:text-white'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-all',
                  viewMode === 'list'
                    ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                    : 'text-slate-500 hover:text-white'
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-grow md:flex-grow-0">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 rounded-full border border-white/5">
                <span className="text-yellow-500">{filteredProducts.length}</span> Solutions
              </span>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredProducts.length > 0 ? (
          <div
            className={cn(
              'grid gap-8',
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
            )}
          >
            {filteredProducts.map((product) => (
              <AffiliateProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-[#1a1a1a] rounded-3xl border-2 border-dashed border-white/5 shadow-inner">
            <div className="relative mb-6">
              <Package className="h-16 w-16 text-slate-800" />
              <div className="absolute inset-0 bg-yellow-500/5 blur-2xl rounded-full" />
            </div>
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">
              Aucun produit trouvé
            </h3>
            <p className="text-slate-600 text-xs font-bold mt-2 max-w-xs text-center">
              Votre recherche d'outillage industriel n'a retourné aucun résultat pour le moment.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedPlatform('ALL');
                setSearchQuery('');
              }}
              className="mt-8 px-8 py-4 bg-yellow-500 text-black font-black rounded-xl hover:bg-yellow-400 transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-yellow-500/20 active:scale-95"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
