/**
 * =======================================================
 * RENTAL MARKETPLACE 2.0 - Everything-as-a-Service
 * =======================================================
 * Architecture modulaire avec fonctionnalités avancées:
 * - Marketplace intelligent avec IA
 * - Réservation smart avec pricing dynamique
 * - Tracking IoT temps réel
 * - Maintenance prédictive
 * - Livraison/logistique intégrée
 * - Contrats intelligents et paiements fractionnés
 * - Communauté de partage
 * - Analytics avancés
 */

import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  TrendingUp,
  BarChart3,
  Package,
  Users,
  Wrench,
  Truck,
  Shield,
  MessageSquare,
  Bell,
  Settings,
  Star,
  Filter,
  Sparkles,
  Map,
  Activity,
} from "lucide-react";
import { EquipmentCard2 } from "../../modules/loueur/marketplace/EquipmentCard2";
import { EquipmentDetail } from "../../modules/loueur/marketplace/EquipmentDetail";
import { OwnerDashboard } from "../../modules/loueur/analytics/OwnerDashboard";
import { RenterAnalytics } from "../../modules/loueur/analytics/RenterAnalytics";
import { MyReservations } from "../../modules/loueur/reservations/MyReservations";
import { MyEquipment } from "../../modules/loueur/equipment/MyEquipment";
import { Community } from "../../modules/loueur/community/Community";
import { BookingData } from "../../modules/loueur/reservation/BookingWizard";
import type { Equipment, SearchFilters, AIRecommendation } from "../../modules/loueur/types";
import { mockEquipments, getFeaturedEquipments } from "../../modules/loueur/data/mockEquipments";

type TabType = "marketplace" | "reservations" | "analytics" | "manage" | "community";

export function RentalMarketplace2() {
  const [activeTab, setActiveTab] = useState<TabType>("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");

  // Use realistic mock data
  const allEquipments = mockEquipments;

  // AI Recommendations
  const aiRecommendations: AIRecommendation[] = [
    {
      equipmentId: "EQ-001",
      score: 95,
      reasons: [
        "Correspond à votre historique de locations",
        "Excellent rapport qualité/prix",
        "Disponible sur vos dates préférées",
        "Propriétaire très bien noté",
      ],
      matchFactors: {
        cropType: 0.9,
        landSize: 0.95,
        budget: 0.92,
        experience: 0.98,
        season: 0.88,
      },
    },
  ];

  // Filtered and sorted equipment
  const filteredEquipments = useMemo(() => {
    let result = allEquipments;

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (eq) =>
          eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          eq.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          eq.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter((eq) => eq.category === filters.category);
    }

    // Price range filter
    if (filters.priceRange) {
      result = result.filter(
        (eq) =>
          eq.pricePerDay >= filters.priceRange!.min && eq.pricePerDay <= filters.priceRange!.max
      );
    }

    // IoT filter
    if (filters.iotEnabled !== undefined) {
      result = result.filter((eq) => eq.iotEnabled === filters.iotEnabled);
    }

    // Rating filter
    if (filters.minRating) {
      result = result.filter((eq) => eq.rating >= filters.minRating!);
    }

    // Sorting
    switch (filters.sortBy) {
      case "price_asc":
        result.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case "price_desc":
        result.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case "distance":
        result.sort((a, b) => (a.distance || 999) - (b.distance || 999));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Relevance (AI-powered)
        break;
    }

    return result;
  }, [allEquipments, searchQuery, filters]);

  const handleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]));
  };

  const handleEquipmentClick = (id: string) => {
    setSelectedEquipmentId(id);
  };

  const handleBookingComplete = (booking: BookingData) => {
    // In full implementation, would save to backend and show confirmation
    console.log("Booking completed:", booking);
    alert(`Réservation confirmée pour ${booking.days} jours!\nTotal: ${booking.totalPrice.toFixed(2)} €`);
    setSelectedEquipmentId(null);
  };

  // If equipment is selected, show detail view
  if (selectedEquipmentId) {
    const equipment = allEquipments.find((eq) => eq.id === selectedEquipmentId);
    if (equipment) {
      return (
        <EquipmentDetail
          equipment={equipment}
          onBack={() => setSelectedEquipmentId(null)}
          onBookingComplete={handleBookingComplete}
        />
      );
    }
  }

  const tabs = [
    {
      id: "marketplace" as TabType,
      label: "Marketplace",
      icon: Package,
      badge: filteredEquipments.length,
    },
    { id: "reservations" as TabType, label: "Mes Réservations", icon: Calendar, badge: 3 },
    { id: "analytics" as TabType, label: "Analytics", icon: BarChart3 },
    { id: "manage" as TabType, label: "Mes Équipements", icon: Wrench, badge: 2 },
    { id: "community" as TabType, label: "Communauté", icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2563eb] via-blue-600 to-blue-700 p-8">
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Location d'Équipements 2.0</h1>
              <p className="text-white/90 text-lg mt-1">Everything-as-a-Service pour l'agriculture</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Équipements", value: "500+", icon: Package },
              { label: "Locations actives", value: "127", icon: Activity },
              { label: "Satisfaction", value: "98%", icon: Star },
              { label: "Économies moy.", value: "45%", icon: TrendingUp },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-white/80" />
                    <span className="text-white/80 text-sm">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mb-24" />
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#2563eb] text-[#2563eb] font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
                {tab.badge !== undefined && (
                  <span className="px-2 py-0.5 bg-[#2563eb] text-white text-xs rounded-full font-medium">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Marketplace Tab Content */}
      {activeTab === "marketplace" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          {showFilters && (
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border rounded-lg p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-[#2563eb]" />
                    Filtres Avancés
                  </h2>
                  <button
                    onClick={() => setFilters({})}
                    className="text-xs text-[#2563eb] hover:underline"
                  >
                    Réinitialiser
                  </button>
                </div>

                {/* AI Recommendations */}
                <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                      Recommandations IA
                    </span>
                  </div>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    {aiRecommendations.length} équipements parfaits pour vous
                  </p>
                </div>

                {/* Category Filter - Add actual filter UI here */}
                <div className="space-y-4">
                  {/* More filters... */}
                </div>
              </div>
            </div>
          )}

          {/* Main Content - Equipment Grid */}
          <div className={`${showFilters ? "lg:col-span-3" : "lg:col-span-4"} space-y-6`}>
            {/* Search & View Controls */}
            <div className="bg-card border rounded-lg p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher un équipement, marque, modèle..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-3 border rounded-lg hover:bg-muted transition-colors"
                    title="Toggle filters"
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`px-4 py-3 border rounded-lg transition-colors ${
                      viewMode === "map" ? "bg-[#2563eb] text-white" : "hover:bg-muted"
                    }`}
                  >
                    <Map className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredEquipments.length}</span>{" "}
                équipement(s) disponible(s)
              </p>
              <select
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background text-sm"
                value={filters.sortBy || "relevance"}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value as SearchFilters["sortBy"] })
                }
              >
                <option value="relevance">Tri : Pertinence (IA)</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="distance">Distance</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEquipments.map((equipment) => (
                <EquipmentCard2
                  key={equipment.id}
                  equipment={equipment}
                  onClick={() => handleEquipmentClick(equipment.id)}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.includes(equipment.id)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredEquipments.length === 0 && (
              <div className="bg-card border rounded-lg p-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold text-lg mb-2">Aucun équipement trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez d'ajuster vos filtres pour voir plus de résultats
                </p>
                <button
                  onClick={() => {
                    setFilters({});
                    setSearchQuery("");
                  }}
                  className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other Tab Contents */}
      {activeTab === "reservations" && (
        <MyReservations />
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Owner Analytics */}
          <OwnerDashboard
            ownerId="owner-001"
            ownerName="Jean Dupont"
            equipment={allEquipments.slice(0, 3)}
          />
          
          {/* Renter Analytics */}
          <div className="border-t pt-6">
            <RenterAnalytics
              userId="user-001"
              userName="Jean Dupont"
              timeRange="month"
            />
          </div>
        </div>
      )}

      {activeTab === "manage" && (
        <MyEquipment ownerId="owner-001" ownerName="Jean Dupont" />
      )}

      {activeTab === "community" && (
        <Community userId="user-001" userName="Jean Dupont" />
      )}
    </div>
  );
}
