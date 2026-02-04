/**
 * Marketplace Pro Page
 * Complete marketplace management with products, pricing, and orders
 */
import React, { useState } from 'react';
import { ProductCatalog } from '@/components/farmer/marketplace/ProductCatalog';
import { DynamicPricing } from '@/components/farmer/marketplace/DynamicPricing';
import { OrderDashboard } from '@/components/farmer/marketplace/OrderDashboard';
import { useMarketplace } from '@/hooks/farmer/useMarketplace';
import { ArrowLeft, Download, Settings, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MarketplaceProPage() {
  const { products, orders, reviews, marketAnalysis, flashSales, isLoading } = useMarketplace();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(
    products && products.length > 0 ? products[0].id : null
  );

  const currentProduct = products?.find((p) => p.id === selectedProduct);
  const currentAnalysis = marketAnalysis?.find((a) => a.productId === selectedProduct);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/farmer/dashboard"
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🛒 Marketplace Pro</h1>
                <p className="text-sm text-gray-600">Gestion avancée de vos ventes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Analytics</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Exporter</span>
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Produits actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {products?.filter((p) => p.status === 'available').length || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Commandes en cours</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders?.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
                  .length || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Ventes ce mois</p>
              <p className="text-2xl font-bold text-gray-900">
                {products?.reduce((sum, p) => sum + p.sales, 0) || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-900">
                {products && products.length > 0
                  ? (
                      products.reduce((sum, p) => sum + p.ratings.average, 0) / products.length
                    ).toFixed(1)
                  : '0.0'}
                <span className="text-lg text-yellow-500 ml-1">⭐</span>
              </p>
            </div>
          </div>

          {/* Product Catalog */}
          <section>
            <ProductCatalog products={products || []} isLoading={isLoading} />
          </section>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dynamic Pricing */}
            {currentProduct && currentAnalysis && (
              <section>
                <DynamicPricing
                  product={currentProduct}
                  analysis={currentAnalysis}
                  isLoading={isLoading}
                />
              </section>
            )}

            {/* Order Dashboard */}
            <section className={currentProduct && currentAnalysis ? '' : 'lg:col-span-2'}>
              <OrderDashboard orders={orders || []} isLoading={isLoading} />
            </section>
          </div>

          {/* Quick Actions */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <span className="text-3xl mb-2">📦</span>
                <span className="text-sm font-medium text-gray-900">Nouveau Produit</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                <span className="text-3xl mb-2">⚡</span>
                <span className="text-sm font-medium text-gray-900">Vente Flash</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <span className="text-3xl mb-2">💬</span>
                <span className="text-sm font-medium text-gray-900">Avis Clients</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <span className="text-3xl mb-2">📊</span>
                <span className="text-sm font-medium text-gray-900">Rapport Ventes</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
