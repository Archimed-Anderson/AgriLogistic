/**
 * Buyer Marketplace Page
 * Premium marketplace with advanced search and filters
 */
'use client';

import React, { useState } from 'react';
import { useMarketplaceSearch } from '@/hooks/buyer/useMarketplaceSearch';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Heart,
  ShoppingCart,
  Leaf,
  MapPin,
  ChevronDown,
  X,
  Check,
  Scale,
} from 'lucide-react';
import type { Product, ProductCategory } from '@/types/buyer';

const categoryLabels: Record<ProductCategory, string> = {
  fruits: 'Fruits',
  vegetables: 'Légumes',
  cereals: 'Céréales',
  dairy: 'Produits laitiers',
  meat: 'Viande',
  poultry: 'Volaille',
  seafood: 'Fruits de mer',
  herbs: 'Herbes',
  spices: 'Épices',
  oils: 'Huiles',
  honey: 'Miel',
  other: 'Autres',
};

export default function BuyerMarketplacePage() {
  const { products, totalCount, facets, filters, updateFilters, resetFilters, isLoading } =
    useMarketplaceSearch();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [compareList, setCompareList] = useState<Product[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, product];
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketplace Premium</h1>
          <p className="text-slate-600">{totalCount} produits disponibles</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher produits, fournisseurs, origines..."
            value={filters.query || ''}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium transition-colors ${
              showFilters
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
          </button>
          <div className="flex bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <aside className="w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-slate-900">Filtres</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-amber-600 hover:text-amber-700"
                >
                  Réinitialiser
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-900 mb-3">Catégories</h3>
                <div className="space-y-2">
                  {facets?.categories.map((cat) => (
                    <label key={cat.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories?.includes(cat.value as ProductCategory)}
                        onChange={(e) => {
                          const current = filters.categories || [];
                          if (e.target.checked) {
                            updateFilters({
                              categories: [...current, cat.value as ProductCategory],
                            });
                          } else {
                            updateFilters({ categories: current.filter((c) => c !== cat.value) });
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm text-slate-700">{cat.label}</span>
                      <span className="text-xs text-slate-400 ml-auto">({cat.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Organic Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-900 mb-3">Certifications</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isOrganic === true}
                    onChange={(e) =>
                      updateFilters({ isOrganic: e.target.checked ? true : undefined })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-slate-700">Bio uniquement</span>
                </label>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-3">Trier par</h3>
                <select
                  value={`${filters.sortBy || 'rating'}-${filters.sortOrder || 'desc'}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-') as [
                      'price' | 'rating',
                      'asc' | 'desc',
                    ];
                    updateFilters({ sortBy, sortOrder });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                >
                  <option value="rating-desc">Meilleure note</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
            </div>
          </aside>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  isInCompare={compareList.some((p) => p.id === product.id)}
                  onToggleCompare={() => toggleCompare(product)}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-amber-400" />
            <span className="font-medium">{compareList.length} produit(s) à comparer</span>
          </div>
          <div className="flex items-center gap-2">
            {compareList.map((p) => (
              <div key={p.id} className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg">
                <span className="text-sm">{p.name}</span>
                <button onClick={() => toggleCompare(p)} className="hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button className="px-4 py-2 bg-amber-500 text-slate-900 font-medium rounded-lg hover:bg-amber-400 transition-colors">
            Comparer
          </button>
        </div>
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({
  product,
  viewMode,
  isInCompare,
  onToggleCompare,
  formatCurrency,
}: {
  product: Product;
  viewMode: 'grid' | 'list';
  isInCompare: boolean;
  onToggleCompare: () => void;
  formatCurrency: (n: number) => string;
}) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-6 hover:shadow-md transition-shadow">
        <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Leaf className="w-10 h-10 text-emerald-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">{product.name}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {product.origin}
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{product.qualityScore}</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-2 line-clamp-1">{product.description}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-slate-900">
            {formatCurrency(product.pricePerKg)}
            <span className="text-sm font-normal text-slate-500">/kg</span>
          </p>
          <p className="text-xs text-slate-500">
            Min. {product.minOrderQuantity} {product.unit}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCompare}
            className={`p-2 rounded-lg border transition-colors ${
              isInCompare
                ? 'bg-amber-100 border-amber-500 text-amber-600'
                : 'border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
          >
            <Scale className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
        <Leaf className="w-16 h-16 text-emerald-500 opacity-50 group-hover:scale-110 transition-transform" />
        {product.isOrganic && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-lg flex items-center gap-1">
            <Leaf className="w-3 h-3" />
            Bio
          </span>
        )}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={onToggleCompare}
            className={`p-2 rounded-lg transition-colors ${
              isInCompare
                ? 'bg-amber-500 text-white'
                : 'bg-white/90 text-slate-600 hover:bg-amber-100'
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white/90 rounded-lg text-slate-600 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-slate-900">{product.name}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {product.origin}
            </p>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{product.qualityScore}</span>
          </div>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">{product.description}</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(product.pricePerKg)}
              <span className="text-sm font-normal text-slate-500">/kg</span>
            </p>
            <p className="text-xs text-slate-500">
              Min. {product.minOrderQuantity} {product.unit}
            </p>
          </div>
          <button className="px-4 py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
