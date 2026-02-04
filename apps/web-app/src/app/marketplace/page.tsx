'use client';

import React, { useState, useMemo } from 'react';
import { marketplaceProducts } from '@/data/marketplace-products';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { name: 'Tous', color: 'bg-slate-900' },
  { name: 'Céréales', color: 'bg-amber-600' },
  { name: 'Tubercules', color: 'bg-orange-700' },
  { name: 'Légumes & Légumineuses', color: 'bg-emerald-600' },
  { name: 'Fruits', color: 'bg-rose-500' },
];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularité');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    return marketplaceProducts
      .filter((p) => selectedCategory === 'Tous' || p.category === selectedCategory)
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'croissant') return a.price - b.price;
        if (sortBy === 'décroissant') return b.price - a.price;
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-primary/10">
      <Navbar />

      {/* Modern Hero Section */}
      <section className="pt-40 pb-20 overflow-hidden bg-white border-b border-slate-100">
        <div className="container px-6 mx-auto relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="h-3 w-3" />
              Directement du producteur
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Le Marché <span className="text-emerald-600 italic">Vivant.</span>
            </h1>
            <p className="text-slate-500 text-xl font-medium max-w-xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Des produits frais, certifiés et tracés par la blockchain pour une alimentation plus
              saine et plus juste.
            </p>
          </div>

          {/* Floating Category Pills */}
          <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            {categories.map((cat) => (
              <button
                key={cat.name}
                data-testid={`category-${cat.name}`}
                onClick={() => setSelectedCategory(cat.name)}
                className={cn(
                  'px-8 py-4 rounded-3xl font-black text-sm transition-all duration-300 transform active:scale-95',
                  selectedCategory === cat.name
                    ? `${cat.color} text-white shadow-2xl shadow-primary/20 -translate-y-1`
                    : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-300 hover:shadow-lg'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="py-16 container px-6 mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area */}
          <div className="flex-1 space-y-10">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="relative group flex-1 max-w-md">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  data-testid="search-input"
                  placeholder="Que recherchez-vous aujourd'hui ?"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/10 font-bold text-slate-800 placeholder:text-slate-400 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="h-14 w-[1px] bg-slate-100 hidden md:block" />

                <div className="relative group">
                  <select
                    data-testid="sort-select"
                    className="appearance-none bg-slate-50 border-none rounded-2xl pl-6 pr-12 py-4 text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500/10 cursor-pointer transition-all"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popularité">Les mieux notés</option>
                    <option value="croissant">Prix : Moins cher</option>
                    <option value="décroissant">Prix : Plus cher</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-slate-900 transition-colors" />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div
              data-testid="product-grid"
              className={cn(
                'animate-in fade-in duration-700 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10'
              )}
            >
              {filteredProducts.map((p, idx) => (
                <div key={p.id} data-testid="product-card">
                  <ProductCard product={p} isNew={idx % 10 === 0} />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-8 rotate-12">
                  <Search className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                  Oups ! Rien n'a été trouvé
                </h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                  Votre recherche n'a retourné aucun résultat.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Tous');
                  }}
                  className="mt-10 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                >
                  Tout réinitialiser
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
