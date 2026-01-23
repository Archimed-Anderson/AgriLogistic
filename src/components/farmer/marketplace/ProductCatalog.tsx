/**
 * Product Catalog Component
 * Display and manage product listings
 */
'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, ShoppingCart, Star, MapPin } from 'lucide-react';
import type { Product } from '@/types/farmer/marketplace';
import Image from 'next/image';

interface ProductCatalogProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductCatalog({ products, isLoading }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-xl" />
        ))}
      </div>
    );
  }

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'flash_sale':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'low_stock':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'out_of_stock':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(p => p.category))];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Catalogue Produits</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Nouveau Produit</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 text-sm rounded-lg ${
                filterCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'Tous' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">Aucun produit trouvé</p>
          <p className="text-sm mt-1">Ajoutez vos premiers produits au catalogue</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  {product.category === 'Légumes' ? '🥬' : '🌾'}
                </div>
                {product.status === 'flash_sale' && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                    FLASH SALE
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {product.certifications.map((cert, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-green-700 rounded"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 border rounded-full ${getStatusBadge(product.status)}`}>
                    {product.stock} {product.unit}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                {/* Origin */}
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{product.origin.fieldName}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.ratings.average}</span>
                  </div>
                  <span className="text-xs text-gray-500">({product.ratings.count} avis)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {(product.price / 1000).toFixed(1)}K
                    </span>
                    <span className="text-sm text-gray-500 ml-1">XOF/{product.unit}</span>
                  </div>
                  {product.suggestedPrice && product.suggestedPrice > product.price && (
                    <span className="text-xs text-green-600 font-medium">
                      +{(((product.suggestedPrice - product.price) / product.price) * 100).toFixed(0)}% suggéré
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{product.views} vues</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    <span>{product.sales} ventes</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                    Modifier
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                    Stats
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
