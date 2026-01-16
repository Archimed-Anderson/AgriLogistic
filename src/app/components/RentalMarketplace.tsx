import { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Calendar,
  Tractor,
  Settings,
  Filter,
  SlidersHorizontal,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  FolderTree,
} from "lucide-react";
import { RentalDetail } from "./RentalDetail";
import { AddAssetModal } from "./AddAssetModal";
import { ManageAssets } from "./ManageAssets";
import { CategoryManagement } from "./CategoryManagement";

interface Equipment {
  id: string;
  name: string;
  model: string;
  category: "Tracteur" | "Couveuse" | "Remorque" | "Scie" | "Pulvérisateur" | "Outil";
  image: string;
  pricePerDay: number;
  location: string;
  distance: number;
  rating: number;
  totalRentals: number;
  status: "available" | "reserved" | "maintenance";
  owner: string;
  description: string;
}

interface Reservation {
  id: string;
  equipmentId: string;
  equipmentName: string;
  renterName: string;
  startDate: Date;
  endDate: Date;
  days: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  requestDate: Date;
}

export function RentalMarketplace() {
  const [activeTab, setActiveTab] = useState<"find" | "manage" | "categories">("find");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Mock data - 6 équipements variés
  const equipments: Equipment[] = [
    {
      id: "EQ-001",
      name: "Tracteur John Deere 6250R",
      model: "6250R - 250 CV",
      category: "Tracteur",
      image: "tractor",
      pricePerDay: 450,
      location: "Ferme du Soleil Levant, Lyon",
      distance: 12.5,
      rating: 4.8,
      totalRentals: 23,
      status: "available",
      owner: "Pierre Moreau",
      description: "Tracteur récent équipé GPS, idéal pour grandes surfaces",
    },
    {
      id: "EQ-002",
      name: "Tracteur Massey Ferguson 7718",
      model: "7718 S - 180 CV",
      category: "Tracteur",
      image: "tractor",
      pricePerDay: 380,
      location: "Coopérative Agricole, Bordeaux",
      distance: 8.2,
      rating: 4.6,
      totalRentals: 31,
      status: "reserved",
      owner: "Sophie Laurent",
      description: "Tracteur polyvalent avec chargeur frontal",
    },
    {
      id: "EQ-003",
      name: "Couveuse Automatique 500 Œufs",
      model: "Borotto REAL 49 Plus",
      category: "Couveuse",
      image: "incubator",
      pricePerDay: 35,
      location: "Les Jardins de Provence, Marseille",
      distance: 25.0,
      rating: 4.9,
      totalRentals: 12,
      status: "available",
      owner: "Jean Dupont",
      description: "Couveuse professionnelle avec retournement automatique",
    },
    {
      id: "EQ-004",
      name: "Remorque Benne Agricole 12T",
      model: "Joskin Trans-Space 7000",
      category: "Remorque",
      image: "trailer",
      pricePerDay: 85,
      location: "Bio Terre Aquitaine, Bordeaux",
      distance: 15.8,
      rating: 4.7,
      totalRentals: 18,
      status: "available",
      owner: "Marie Petit",
      description: "Remorque benne avec système de déchargement hydraulique",
    },
    {
      id: "EQ-005",
      name: "Tronçonneuse Professionnelle",
      model: "Stihl MS 661 C-M",
      category: "Scie",
      image: "chainsaw",
      pricePerDay: 45,
      location: "Ferme du Val de Loire, Tours",
      distance: 5.3,
      rating: 5.0,
      totalRentals: 8,
      status: "available",
      owner: "Luc Bernard",
      description: "Tronçonneuse thermique puissante pour abattage",
    },
    {
      id: "EQ-006",
      name: "Pulvérisateur Trainé 2500L",
      model: "Amazone UX 5200",
      category: "Pulvérisateur",
      image: "sprayer",
      pricePerDay: 220,
      location: "Maraîchers de Bretagne, Rennes",
      distance: 42.0,
      rating: 4.5,
      totalRentals: 15,
      status: "available",
      owner: "Antoine Rousseau",
      description: "Pulvérisateur 18m avec régulation électronique",
    },
  ];

  const categories = [
    { value: "all", label: "Toutes catégories", icon: Package },
    { value: "Tracteur", label: "Tracteurs", icon: Tractor },
    { value: "Couveuse", label: "Couveuses", icon: Settings },
    { value: "Remorque", label: "Remorques", icon: Package },
    { value: "Scie", label: "Scies & Outils", icon: Settings },
    { value: "Pulvérisateur", label: "Pulvérisateurs", icon: Settings },
  ];

  const filteredEquipments = equipments.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || eq.category === selectedCategory;
    const matchesPrice = eq.pricePerDay >= priceRange[0] && eq.pricePerDay <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const getStatusBadge = (status: Equipment["status"]) => {
    switch (status) {
      case "available":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            Disponible maintenant
          </span>
        );
      case "reserved":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-medium rounded-full">
            <Clock className="h-3 w-3" />
            Réservé cette semaine
          </span>
        );
      case "maintenance":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">
            <AlertCircle className="h-3 w-3" />
            En maintenance
          </span>
        );
    }
  };

  const getEquipmentIcon = (category: Equipment["category"]) => {
    const icons: Record<Equipment["category"], string> = {
      Tracteur: "🚜",
      Couveuse: "🥚",
      Remorque: "🚛",
      Scie: "🪚",
      Pulvérisateur: "💧",
      Outil: "🔧",
    };
    return icons[category] || "📦";
  };

  const handleEquipmentClick = (equipmentId: string) => {
    setSelectedEquipmentId(equipmentId);
  };

  const handleBackToList = () => {
    setSelectedEquipmentId(null);
  };

  const handleReservationRequest = (
    equipmentId: string,
    startDate: Date,
    endDate: Date,
    totalPrice: number
  ) => {
    const equipment = equipments.find((e) => e.id === equipmentId);
    if (!equipment) return;

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newReservation: Reservation = {
      id: `RES-${Date.now()}`,
      equipmentId,
      equipmentName: equipment.name,
      renterName: "Utilisateur Actuel", // In real app, would be current user
      startDate,
      endDate,
      days,
      totalPrice,
      status: "pending",
      requestDate: new Date(),
    };

    setReservations([...reservations, newReservation]);
    setSelectedEquipmentId(null);
    setActiveTab("manage"); // Switch to manage tab to see the reservation
  };

  const handleAcceptReservation = (reservationId: string) => {
    setReservations(
      reservations.map((r) => (r.id === reservationId ? { ...r, status: "confirmed" as const } : r))
    );
  };

  const handleRejectReservation = (reservationId: string) => {
    setReservations(
      reservations.map((r) => (r.id === reservationId ? { ...r, status: "cancelled" as const } : r))
    );
  };

  const handleSaveAsset = (asset: any) => {
    // In real app, would save to backend
    console.log("New asset:", asset);
  };

  // If an equipment is selected, show detail view
  if (selectedEquipmentId) {
    return (
      <RentalDetail
        equipmentId={selectedEquipmentId}
        onBack={handleBackToList}
        onReservationRequest={handleReservationRequest}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Location d'Équipements Agricoles</h1>
        <p className="text-muted-foreground mt-2">
          Louez ou proposez vos équipements entre agriculteurs
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("find")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === "find"
                ? "border-[#2563eb] text-[#2563eb] font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="h-5 w-5" />
            Trouver un Équipement
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === "manage"
                ? "border-[#2563eb] text-[#2563eb] font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="h-5 w-5" />
            Gérer mes Actifs
            {reservations.filter((r) => r.status === "pending").length > 0 && (
              <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs rounded-full">
                {reservations.filter((r) => r.status === "pending").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === "categories"
                ? "border-[#2563eb] text-[#2563eb] font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderTree className="h-5 w-5" />
            Gérer les Catégories
          </button>
        </nav>
      </div>

      {/* Find Equipment Tab */}
      {activeTab === "find" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border rounded-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-[#2563eb]" />
                  Filtres
                </h2>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, 1000]);
                  }}
                  className="text-xs text-[#2563eb] hover:underline"
                >
                  Réinitialiser
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Catégorie</label>
                  <div className="space-y-2">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.value}
                          onClick={() => setSelectedCategory(cat.value)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            selectedCategory === cat.value
                              ? "bg-[#2563eb] text-white"
                              : "hover:bg-muted"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Prix par jour</label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">0€</span>
                      <span className="font-medium text-[#2563eb]">jusqu'à {priceRange[1]}€</span>
                    </div>
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Localisation</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Ville ou code postal"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background text-sm"
                    />
                  </div>
                  <div className="mt-3">
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Rayon de recherche : 50 km
                    </label>
                    <input type="range" min="5" max="100" defaultValue="50" className="w-full" />
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Disponibilité</label>
                  <button className="w-full px-3 py-2 border rounded-lg hover:bg-muted transition-colors text-sm flex items-center justify-between">
                    <span>Sélectionner des dates</span>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Note minimale</label>
                  <div className="space-y-2">
                    {[5, 4, 3].map((rating) => (
                      <button
                        key={rating}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                      >
                        <div className="flex">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-muted-foreground">et plus</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Equipment Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="bg-card border rounded-lg p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher un équipement, une marque..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredEquipments.length}</span>{" "}
                équipement(s) disponible(s)
              </p>
              <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background text-sm">
                <option>Trier par : Pertinence</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
                <option>Distance</option>
                <option>Mieux notés</option>
              </select>
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEquipments.map((equipment) => (
                <div
                  key={equipment.id}
                  onClick={() => handleEquipmentClick(equipment.id)}
                  className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
                    <div className="text-8xl opacity-20 group-hover:scale-110 transition-transform">
                      {getEquipmentIcon(equipment.category)}
                    </div>
                    <div className="absolute top-3 right-3">{getStatusBadge(equipment.status)}</div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                        {equipment.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    {/* Title */}
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-[#2563eb] transition-colors">
                        {equipment.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{equipment.model}</p>
                    </div>

                    {/* Location & Distance */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{equipment.location.split(",")[1]}</span>
                      <span className="text-xs">• {equipment.distance} km</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(equipment.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{equipment.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({equipment.totalRentals} locations)
                      </span>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <div className="text-2xl font-bold text-[#2563eb]">
                          {equipment.pricePerDay}€
                        </div>
                        <div className="text-xs text-muted-foreground">par jour</div>
                      </div>
                      <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2 text-sm font-medium">
                        Voir détails
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredEquipments.length === 0 && (
              <div className="bg-card border rounded-lg p-12 text-center">
                <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-lg mb-2">Aucun équipement trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez d'ajuster vos filtres pour voir plus de résultats
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, 1000]);
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manage Assets Tab */}
      {activeTab === "manage" && (
        <ManageAssets
          onAddAsset={() => setShowAddAssetModal(true)}
          reservations={reservations}
          onAcceptReservation={handleAcceptReservation}
          onRejectReservation={handleRejectReservation}
        />
      )}

      {/* Add Asset Modal */}
      {showAddAssetModal && (
        <AddAssetModal onClose={() => setShowAddAssetModal(false)} onSave={handleSaveAsset} />
      )}

      {/* Category Management Tab */}
      {activeTab === "categories" && <CategoryManagement />}
    </div>
  );
}