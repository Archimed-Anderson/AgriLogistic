/**
 * Marketplace Page
 * Freight board for matching loads with carriers
 */
import React, { useState } from 'react';
import { LoadCard } from '@/components/transporter/marketplace/LoadCard';
import { LoadFilters } from '@/components/transporter/marketplace/LoadFilters';
import { useMarketplaceData } from '@/hooks/transporter/useMarketplaceData';
import { Search, Map as MapIcon, List, Bell } from 'lucide-react';
import type { Load } from '@/types/transporter';

export default function MarketplacePage() {
  const { loads, isLoading } = useMarketplaceData();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const handleViewDetails = (load: Load) => {
    console.log('View details', load);
  };

  const handleBid = (load: Load) => {
    console.log('Bid on load', load);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                📦 Bourse de Fret
              </h1>
              <p className="text-sm text-gray-600">
                {loads?.length || 0} offres disponibles
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <MapIcon className="w-5 h-5" />
                </button>
              </div>

              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <LoadFilters />
          </div>

          {/* Results Area */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par ville, marchandise..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* Load Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loads?.map((load) => (
                <LoadCard
                  key={load.id}
                  load={load}
                  onViewDetails={handleViewDetails}
                  onBid={handleBid}
                />
              ))}
            </div>

            {/* Empty State */}
            {(!loads || loads.length === 0) && (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucune offre ne correspond à vos critères.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
