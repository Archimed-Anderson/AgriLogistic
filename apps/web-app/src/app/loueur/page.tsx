'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  rentalEquipmentData,
  getRentalStatistics,
  type EquipmentCategory,
  type EquipmentType,
  type RentalEquipment,
} from '@/data/rental-equipment';
import { RentalTypeSwitch } from '@/components/rental/RentalTypeSwitch';
import { FilterSidebar } from '@/components/rental/FilterSidebar';
import { IndustrialEquipmentCard } from '@/components/rental/IndustrialEquipmentCard';
import { Search, Package, Sprout } from 'lucide-react';

export default function LoueurPage() {
  const stats = getRentalStatistics();

  // State
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<EquipmentType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc' | 'name'>('rating');

  // Filter equipment
  let filteredEquipment = rentalEquipmentData;

  // Category filter
  if (selectedCategory !== 'ALL') {
    filteredEquipment = filteredEquipment.filter((eq) => eq.category === selectedCategory);
  }

  // Type filter
  if (selectedType === 'LOCATION') {
    filteredEquipment = filteredEquipment.filter(
      (eq) => eq.type === 'LOCATION' || eq.type === 'LOCATION_VENTE'
    );
  } else if (selectedType === 'VENTE') {
    filteredEquipment = filteredEquipment.filter(
      (eq) => eq.type === 'VENTE' || eq.type === 'LOCATION_VENTE'
    );
  }

  // Available only filter
  if (showOnlyAvailable) {
    filteredEquipment = filteredEquipment.filter((eq) => eq.availability === 'DISPONIBLE');
  }

  // Price range filter
  filteredEquipment = filteredEquipment.filter((eq) => {
    const price = eq.price || eq.dailyRate || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  // Search filter
  if (searchQuery.trim()) {
    const lowerQuery = searchQuery.toLowerCase();
    filteredEquipment = filteredEquipment.filter(
      (eq) =>
        eq.name.toLowerCase().includes(lowerQuery) ||
        eq.description.toLowerCase().includes(lowerQuery) ||
        eq.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        eq.specs.brand?.toLowerCase().includes(lowerQuery)
    );
  }

  // Sorting
  if (sortBy === 'price-asc') {
    filteredEquipment = [...filteredEquipment].sort((a, b) => {
      const priceA = a.price || a.dailyRate || 0;
      const priceB = b.price || b.dailyRate || 0;
      return priceA - priceB;
    });
  } else if (sortBy === 'price-desc') {
    filteredEquipment = [...filteredEquipment].sort((a, b) => {
      const priceA = a.price || a.dailyRate || 0;
      const priceB = b.price || b.dailyRate || 0;
      return priceB - priceA;
    });
  } else if (sortBy === 'rating') {
    filteredEquipment = [...filteredEquipment].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'name') {
    filteredEquipment = [...filteredEquipment].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Category counts
  const categoryCounts = {
    ALL: rentalEquipmentData.length,
    TRACTEURS_ENGINS: rentalEquipmentData.filter((eq) => eq.category === 'TRACTEURS_ENGINS').length,
    MACHINES_TRAITEMENT: rentalEquipmentData.filter((eq) => eq.category === 'MACHINES_TRAITEMENT')
      .length,
    MAINTENANCE_NETTOYAGE: rentalEquipmentData.filter(
      (eq) => eq.category === 'MAINTENANCE_NETTOYAGE'
    ).length,
    MATERIAUX_CONSTRUCTION: rentalEquipmentData.filter(
      (eq) => eq.category === 'MATERIAUX_CONSTRUCTION'
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      {/* Fixed Header with Logo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-primary">AgriLogistic</span>
          </Link>
        </div>
      </header>
      {/* Add padding to account for fixed header */}
      <div className="pt-20">
        {/* Hero with Giant Switch */}
        <RentalTypeSwitch selectedType={selectedType} onSelectType={setSelectedType} />

        {/* Main Content: Sidebar + Grid Layout */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* LEFT SIDEBAR - Filters */}
            <div className="lg:col-span-1">
              <FilterSidebar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                showOnlyAvailable={showOnlyAvailable}
                onAvailabilityChange={setShowOnlyAvailable}
                categoryCounts={categoryCounts}
              />
            </div>

            {/* RIGHT GRID - Equipment Cards */}
            <div className="lg:col-span-3">
              {/* Search + Sort Bar */}
              <div className="bg-slate-800 rounded-2xl p-6 border-2 border-slate-700 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Rechercher un équipement..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-700 border-2 border-slate-600 focus:border-yellow-500 focus:outline-none text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-700 border-2 border-slate-600 focus:border-yellow-500 focus:outline-none text-white font-bold"
                    >
                      <option value="rating">Mieux notés</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                      <option value="name">Nom A-Z</option>
                    </select>
                  </div>
                </div>

                {/* Results count */}
                <div className="mt-4 text-slate-400 font-bold">
                  <span className="text-yellow-500 text-lg">{filteredEquipment.length}</span>{' '}
                  résultat{filteredEquipment.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Equipment Grid */}
              {filteredEquipment.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredEquipment.map((equipment) => (
                    <IndustrialEquipmentCard key={equipment.id} equipment={equipment} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-800 rounded-2xl border-2 border-slate-700">
                  <Package className="h-24 w-24 text-slate-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-slate-400 mb-3 uppercase">
                    Aucun équipement trouvé
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Essayez de modifier vos filtres ou votre recherche
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSelectedType('ALL');
                      setSearchQuery('');
                      setPriceRange([0, 100000]);
                      setShowOnlyAvailable(false);
                    }}
                    className="px-8 py-4 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase transition-all"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>{' '}
      {/* Close pt-20 wrapper */}
    </div>
  );
}
