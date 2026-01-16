import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Grid3x3,
  List,
  MapPin,
  Star,
  Heart,
  ShoppingCart,
  Truck,
  ChevronRight,
  ChevronLeft,
  X,
  Filter,
  TrendingUp,
  Leaf,
  Award,
  Clock,
  User,
  MessageCircle,
  Share2,
  Check,
  Minus,
  Plus,
  ArrowUpDown,
  Sparkles,
  Package,
  ThumbsUp,
  Calendar,
  Edit,
  Trash2,
  MoreVertical,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  Archive,
  Move,
  Copy,
  History,
  Loader2,
  AlertTriangle,
  FolderPlus,
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  unit: string;
  image: string;
  seller: {
    name: string;
    location: string;
    distance: number;
    rating: number;
    totalSales: number;
  };
  stock: "in-stock" | "limited" | "pre-order" | "out-of-stock";
  rating: number;
  reviewCount: number;
  labels: string[];
  fastDelivery: boolean;
  description: string;
  variants?: Array<{ name: string; price: number; unit: string }>;
  specifications: Record<string, string>;
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
  }>;
  // Admin fields
  sku?: string;
  visible?: boolean;
  isNew?: boolean;
  archived?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  children?: Category[];
}

export function MarketplaceModern({ adminMode = false, onAdminModeChange }: { adminMode?: boolean; onAdminModeChange?: (value: boolean) => void }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareProducts, setCompareProducts] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  
  // Admin states
  const [isAdminMode, setIsAdminMode] = useState(adminMode);
  const [selectedForEdit, setSelectedForEdit] = useState<string[]>([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState<string | null>(null);
  
  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [maxDistance, setMaxDistance] = useState(50);
  const [minRating, setMinRating] = useState(0);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("agrodeep-favorites");
    if (saved) setFavorites(JSON.parse(saved));
    
    const savedSort = localStorage.getItem("agrodeep-sort-preference");
    if (savedSort) setSortBy(savedSort);
  }, []);

  // Save sort preference
  useEffect(() => {
    localStorage.setItem("agrodeep-sort-preference", sortBy);
  }, [sortBy]);

  // Sync admin mode with prop
  useEffect(() => {
    setIsAdminMode(adminMode);
  }, [adminMode]);

  // Filtered & Sorted Products
  const filteredProducts = products
    .filter((product) => {
      // In admin mode, show archived if needed
      if (!isAdminMode && product.archived) return false;
      
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seller.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesDistance = product.seller.distance <= maxDistance;
      const matchesRating = product.rating >= minRating;
      const matchesLabels =
        selectedLabels.length === 0 ||
        selectedLabels.some((label) => product.labels.includes(label));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesDistance &&
        matchesRating &&
        matchesLabels
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "distance":
          return a.seller.distance - b.seller.distance;
        default:
          return 0;
      }
    });

  const toggleFavorite = (productId: string) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];
    setFavorites(newFavorites);
    localStorage.setItem("agrodeep-favorites", JSON.stringify(newFavorites));
    toast.success(
      favorites.includes(productId) ? "Retiré des favoris" : "Ajouté aux favoris"
    );
  };

  const toggleCompare = (productId: string) => {
    if (compareProducts.includes(productId)) {
      setCompareProducts(compareProducts.filter((id) => id !== productId));
    } else if (compareProducts.length < 3) {
      setCompareProducts([...compareProducts, productId]);
    } else {
      toast.error("Maximum 3 produits pour la comparaison");
    }
  };

  const addToCart = (productId: string) => {
    setCartItems([...cartItems, productId]);
    toast.success("✅ Produit ajouté au panier");
  };

  // Admin functions
  const handleArchiveProduct = (productId: string) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, archived: !p.archived } : p
      )
    );
    const product = products.find((p) => p.id === productId);
    toast.success(
      `✅ "${product?.name}" ${product?.archived ? "restauré" : "archivé"}`
    );
    setShowArchiveConfirm(null);
  };

  const handleUpdateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(products.map((p) => (p.id === productId ? { ...p, ...updates } : p)));
    toast.success("✅ Produit mis à jour avec succès");
  };

  const handleAddProduct = (newProduct: Partial<Product>) => {
    const product: Product = {
      id: `PROD-${Date.now()}`,
      name: newProduct.name || "Nouveau produit",
      category: newProduct.category || "Autres",
      price: newProduct.price || 0,
      unit: newProduct.unit || "unité",
      image: newProduct.image || "📦",
      seller: newProduct.seller || {
        name: "Vendeur",
        location: "France",
        distance: 10,
        rating: 4.5,
        totalSales: 0,
      },
      stock: "in-stock",
      rating: 0,
      reviewCount: 0,
      labels: newProduct.labels || [],
      fastDelivery: false,
      description: newProduct.description || "",
      specifications: {},
      reviews: [],
      sku: newProduct.sku || `SKU-${Date.now()}`,
      visible: true,
      isNew: true,
    };
    
    // Add to beginning of array
    setProducts([product, ...products]);
    toast.success(`✅ "${product.name}" ajouté au marketplace`);
    setShowAddProductModal(false);
  };

  const handleBulkAction = (action: "archive" | "publish" | "move") => {
    if (selectedForEdit.length === 0) {
      toast.error("Sélectionnez au moins un produit");
      return;
    }

    switch (action) {
      case "archive":
        setProducts(
          products.map((p) =>
            selectedForEdit.includes(p.id) ? { ...p, archived: true } : p
          )
        );
        toast.success(`✅ ${selectedForEdit.length} produit(s) archivé(s)`);
        break;
      case "publish":
        setProducts(
          products.map((p) =>
            selectedForEdit.includes(p.id) ? { ...p, visible: true, archived: false } : p
          )
        );
        toast.success(`✅ ${selectedForEdit.length} produit(s) publié(s)`);
        break;
      case "move":
        toast.info("Fonctionnalité de déplacement (à implémenter)");
        break;
    }
    setSelectedForEdit([]);
  };

  const handleRenameCategory = (categoryId: string, newName: string) => {
    // Update category name
    toast.success(`✅ Catégorie renommée en "${newName}"`);
    setEditingCategory(null);
  };

  const activeFilters = [
    ...(selectedCategories.length > 0
      ? [`Catégorie: ${selectedCategories.join(", ")}`]
      : []),
    ...(priceRange[0] !== 0 || priceRange[1] !== 100
      ? [`Prix: ${priceRange[0]}€-${priceRange[1]}€`]
      : []),
    ...(maxDistance !== 50 ? [`Distance: ≤${maxDistance}km`] : []),
    ...(minRating > 0 ? [`Note: ≥${minRating}★`] : []),
    ...selectedLabels.map((label) => `Label: ${label}`),
  ];

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setMaxDistance(50);
    setMinRating(0);
    setSelectedLabels([]);
  };

  return (
    <div className="space-y-6">
      {/* Admin Banner */}
      {isAdminMode && (
        <div className="bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-5 w-5 text-[#2563eb]" />
            <span className="font-semibold text-[#2563eb]">⚙️ Mode Édition Admin Actif</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un produit
            </button>
            <button
              onClick={() => toast.info("Ouverture de la gestion des catégories")}
              className="px-4 py-2 border border-[#2563eb] text-[#2563eb] rounded-lg hover:bg-[#2563eb]/10 transition-colors font-medium"
            >
              Gérer toutes les catégories
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection />

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Left Sidebar - Filters */}
        {showFilters && (
          <div className="w-80 flex-shrink-0">
            <FiltersPanel
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              maxDistance={maxDistance}
              onMaxDistanceChange={setMaxDistance}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              selectedLabels={selectedLabels}
              onLabelsChange={setSelectedLabels}
              onClearAll={clearFilters}
              categories={categories}
              isAdminMode={isAdminMode}
              editingCategory={editingCategory}
              onEditCategory={setEditingCategory}
              categoryMenuOpen={categoryMenuOpen}
              onCategoryMenuOpen={setCategoryMenuOpen}
              onRenameCategory={handleRenameCategory}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Toolbar */}
          <div className="bg-card border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-3">
              {/* Toggle Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 border rounded-lg hover:bg-muted transition-colors lg:hidden"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>

              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
              >
                <option value="relevance">Pertinence</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
                <option value="distance">Plus proches</option>
              </select>

              {/* View Toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${
                    viewMode === "grid" ? "bg-[#2563eb] text-white" : "hover:bg-muted"
                  }`}
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${
                    viewMode === "list" ? "bg-[#2563eb] text-white" : "hover:bg-muted"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Filtres actifs:</span>
                {activeFilters.map((filter, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (filter.startsWith("Catégorie:")) {
                        setSelectedCategories([]);
                      } else if (filter.startsWith("Prix:")) {
                        setPriceRange([0, 100]);
                      } else if (filter.startsWith("Distance:")) {
                        setMaxDistance(50);
                      } else if (filter.startsWith("Note:")) {
                        setMinRating(0);
                      } else if (filter.startsWith("Label:")) {
                        const label = filter.split(": ")[1];
                        setSelectedLabels(selectedLabels.filter((l) => l !== label));
                      }
                    }}
                    className="px-3 py-1 bg-[#2563eb]/10 text-[#2563eb] rounded-full text-sm flex items-center gap-1 hover:bg-[#2563eb]/20 transition-colors"
                  >
                    {filter}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Tout effacer
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredProducts.length}</span>{" "}
              produit(s) trouvé(s)
            </div>
          </div>

          {/* Products Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                isFavorite={favorites.includes(product.id)}
                isComparing={compareProducts.includes(product.id)}
                onToggleFavorite={() => toggleFavorite(product.id)}
                onToggleCompare={() => toggleCompare(product.id)}
                onAddToCart={() => addToCart(product.id)}
                onClick={() => setSelectedProduct(product)}
                // Admin props
                isAdminMode={isAdminMode}
                isSelected={selectedForEdit.includes(product.id)}
                onToggleSelect={() => {
                  if (selectedForEdit.includes(product.id)) {
                    setSelectedForEdit(selectedForEdit.filter((id) => id !== product.id));
                  } else {
                    setSelectedForEdit([...selectedForEdit, product.id]);
                  }
                }}
                onEdit={() => setSelectedProduct(product)}
                onArchive={() => setShowArchiveConfirm(product.id)}
              />
            ))}
          </div>

          {/* Inspired For You Section */}
          {filteredProducts.length > 0 && (
            <InspiredForYouSection products={products.slice(0, 4)} />
          )}
        </div>
      </div>

      {/* Compare Floating Button */}
      {compareProducts.length > 0 && (
        <button
          className="fixed bottom-6 right-6 px-6 py-3 bg-[#2563eb] text-white rounded-full shadow-lg hover:bg-[#1d4ed8] transition-all flex items-center gap-2 z-40"
          onClick={() => toast.info("Fonctionnalité de comparaison (à implémenter)")}
        >
          <ArrowUpDown className="h-5 w-5" />
          Comparer ({compareProducts.length})
        </button>
      )}

      {/* Bulk Actions Bar (Admin) */}
      {isAdminMode && selectedForEdit.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border-2 border-[#2563eb] rounded-lg shadow-xl p-4 flex items-center gap-4 z-40">
          <span className="font-semibold text-[#2563eb]">
            {selectedForEdit.length} sélectionné(s)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction("publish")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Publier la sélection
            </button>
            <button
              onClick={() => handleBulkAction("archive")}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              Archiver
            </button>
            <button
              onClick={() => handleBulkAction("move")}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              Déplacer...
            </button>
            <button
              onClick={() => setSelectedForEdit([])}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Product Detail Panel */}
      {selectedProduct && (
        <ProductDetailPanel
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={() => addToCart(selectedProduct.id)}
          isFavorite={favorites.includes(selectedProduct.id)}
          onToggleFavorite={() => toggleFavorite(selectedProduct.id)}
          isAdminMode={isAdminMode}
          onUpdate={(updates) => handleUpdateProduct(selectedProduct.id, updates)}
        />
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <AddProductModal
          onClose={() => setShowAddProductModal(false)}
          onSave={handleAddProduct}
          categories={categories}
        />
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveConfirm && (
        <ArchiveConfirmModal
          product={products.find((p) => p.id === showArchiveConfirm)!}
          onConfirm={() => handleArchiveProduct(showArchiveConfirm)}
          onCancel={() => setShowArchiveConfirm(null)}
        />
      )}
    </div>
  );
}

// Hero Section Component (unchanged)
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Fruits de Saison",
      subtitle: "Découvrez notre sélection de fruits frais",
      color: "from-orange-500 to-red-500",
      icon: "🍎",
    },
    {
      title: "Nouveaux Producteurs",
      subtitle: "Soutenez les agriculteurs locaux",
      color: "from-green-500 to-emerald-500",
      icon: "🌱",
    },
    {
      title: "Produits Bio",
      subtitle: "100% certifiés agriculture biologique",
      color: "from-blue-500 to-cyan-500",
      icon: "🌿",
    },
  ];

  const categories = [
    { name: "Légumes", icon: "🥬", count: 45 },
    { name: "Fruits", icon: "🍎", count: 38 },
    { name: "Produits Laitiers", icon: "🧀", count: 22 },
    { name: "Viandes", icon: "🥩", count: 18 },
    { name: "Œufs", icon: "🥚", count: 12 },
  ];

  return (
    <div className="space-y-4">
      {/* Carousel */}
      <div className="relative h-64 bg-gradient-to-r from-[#2563eb] to-blue-400 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center space-y-4">
            <div className="text-7xl">{slides[currentSlide].icon}</div>
            <h2 className="text-4xl font-bold">{slides[currentSlide].title}</h2>
            <p className="text-xl opacity-90">{slides[currentSlide].subtitle}</p>
            <button className="px-6 py-3 bg-white text-[#2563eb] rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Découvrir
            </button>
          </div>
        </div>

        <button
          onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Category Access */}
      <div className="grid grid-cols-5 gap-4">
        {categories.map((category) => (
          <button
            key={category.name}
            className="bg-card border rounded-lg p-4 hover:shadow-md transition-all text-center group"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
              {category.icon}
            </div>
            <div className="font-medium">{category.name}</div>
            <div className="text-xs text-muted-foreground">{category.count} produits</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Filters Panel Component with Admin controls
function FiltersPanel({
  selectedCategories,
  onCategoriesChange,
  priceRange,
  onPriceRangeChange,
  maxDistance,
  onMaxDistanceChange,
  minRating,
  onMinRatingChange,
  selectedLabels,
  onLabelsChange,
  onClearAll,
  categories,
  isAdminMode,
  editingCategory,
  onEditCategory,
  categoryMenuOpen,
  onCategoryMenuOpen,
  onRenameCategory,
}: any) {
  const labels = ["Bio", "Local", "Primeur", "Fermier", "AOP"];
  const [categoryRename, setCategoryRename] = useState("");

  return (
    <div className="bg-card border rounded-lg p-6 sticky top-6 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-[#2563eb]" />
          Filtres
        </h2>
        <button
          onClick={onClearAll}
          className="text-xs text-[#2563eb] hover:underline"
        >
          Réinitialiser
        </button>
      </div>

      {/* Categories with Admin Controls */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium">Catégories</label>
          {isAdminMode && (
            <button
              onClick={() => toast.info("Ajouter une catégorie")}
              className="p-1 text-[#2563eb] hover:bg-[#2563eb]/10 rounded transition-colors"
              title="Ajouter une catégorie"
            >
              <FolderPlus className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="space-y-2">
          {categories.map((category: Category) => (
            <div
              key={category.id}
              className="group relative"
              onMouseLeave={() => onCategoryMenuOpen(null)}
            >
              <label className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onCategoriesChange([...selectedCategories, category.name]);
                    } else {
                      onCategoriesChange(
                        selectedCategories.filter((c: string) => c !== category.name)
                      );
                    }
                  }}
                  className="rounded border-gray-300"
                />
                {editingCategory === category.id ? (
                  <input
                    type="text"
                    defaultValue={category.name}
                    value={categoryRename}
                    onChange={(e) => setCategoryRename(e.target.value)}
                    onBlur={() => {
                      if (categoryRename) {
                        onRenameCategory(category.id, categoryRename);
                      }
                      onEditCategory(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (categoryRename) {
                          onRenameCategory(category.id, categoryRename);
                        }
                        onEditCategory(null);
                      }
                    }}
                    autoFocus
                    className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  />
                ) : (
                  <span
                    className="text-sm flex-1"
                    onDoubleClick={() => {
                      if (isAdminMode) {
                        setCategoryRename(category.name);
                        onEditCategory(category.id);
                      }
                    }}
                  >
                    {category.icon} {category.name}
                  </span>
                )}
                {isAdminMode && editingCategory !== category.id && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onCategoryMenuOpen(
                        categoryMenuOpen === category.id ? null : category.id
                      );
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                )}
              </label>

              {/* Category Context Menu */}
              {isAdminMode && categoryMenuOpen === category.id && (
                <div className="absolute right-0 top-8 bg-card border rounded-lg shadow-xl p-1 z-10 min-w-[180px]">
                  <button
                    onClick={() => {
                      toast.info("Ajouter sous-catégorie");
                      onCategoryMenuOpen(null);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-muted rounded text-sm flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter sous-catégorie
                  </button>
                  <button
                    onClick={() => {
                      setCategoryRename(category.name);
                      onEditCategory(category.id);
                      onCategoryMenuOpen(null);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-muted rounded text-sm flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Renommer
                  </button>
                  <button
                    onClick={() => {
                      toast.info("Déplacer catégorie");
                      onCategoryMenuOpen(null);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-muted rounded text-sm flex items-center gap-2"
                  >
                    <Move className="h-4 w-4" />
                    Déplacer
                  </button>
                  <button
                    onClick={() => {
                      toast.success("Catégorie archivée");
                      onCategoryMenuOpen(null);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-muted rounded text-sm flex items-center gap-2 text-red-600"
                  >
                    <Archive className="h-4 w-4" />
                    Archiver
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-medium mb-3 block">
          Prix (€) : {priceRange[0]}€ - {priceRange[1]}€
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([0, parseInt(e.target.value)])}
            className="w-full"
          />
        </div>
      </div>

      {/* Distance */}
      <div>
        <label className="text-sm font-medium mb-3 block">
          Distance maximale : {maxDistance} km
        </label>
        <input
          type="range"
          min="5"
          max="100"
          value={maxDistance}
          onChange={(e) => onMaxDistanceChange(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Rating */}
      <div>
        <label className="text-sm font-medium mb-3 block">Note minimale</label>
        <div className="space-y-2">
          {[5, 4, 3, 2].map((rating) => (
            <button
              key={rating}
              onClick={() => onMinRatingChange(rating)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                minRating === rating ? "bg-[#2563eb] text-white" : "hover:bg-muted"
              }`}
            >
              <div className="flex">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span>et plus</span>
            </button>
          ))}
        </div>
      </div>

      {/* Labels */}
      <div>
        <label className="text-sm font-medium mb-3 block">Labels</label>
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <button
              key={label}
              onClick={() => {
                if (selectedLabels.includes(label)) {
                  onLabelsChange(selectedLabels.filter((l: string) => l !== label));
                } else {
                  onLabelsChange([...selectedLabels, label]);
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedLabels.includes(label)
                  ? "bg-green-600 text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Product Card Component with Admin controls
function ProductCard({
  product,
  viewMode,
  isFavorite,
  isComparing,
  onToggleFavorite,
  onToggleCompare,
  onAddToCart,
  onClick,
  isAdminMode,
  isSelected,
  onToggleSelect,
  onEdit,
  onArchive,
}: any) {
  const [isHovered, setIsHovered] = useState(false);

  const getStockBadge = () => {
    if (product.archived) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">
          Archivé
        </span>
      );
    }
    
    switch (product.stock) {
      case "in-stock":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">
            En stock
          </span>
        );
      case "limited":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-medium rounded-full">
            Stock limité
          </span>
        );
      case "pre-order":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium rounded-full">
            Pré-commande
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">
            Rupture
          </span>
        );
    }
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        className={`bg-card border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer flex gap-4 relative ${
          product.archived ? "opacity-60" : ""
        }`}
      >
        {/* Admin Checkbox */}
        {isAdminMode && (
          <div
            className="absolute top-4 left-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              className="h-5 w-5 rounded border-gray-300"
            />
          </div>
        )}

        <div className="relative h-24 w-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
          {product.image}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg">
                {product.name}
                {product.isNew && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-medium rounded-full">
                    Nouveau
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">{product.seller.name}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#2563eb]">
                {product.price}€<span className="text-sm font-normal">/{product.unit}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {product.seller.distance} km
            </div>
            {getStockBadge()}
          </div>
        </div>

        {/* Admin Controls */}
        {isAdminMode && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
              title="Éditer"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive();
              }}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="Archiver"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group relative ${
        product.archived ? "opacity-60" : ""
      } ${isSelected ? "ring-2 ring-[#2563eb]" : ""}`}
    >
      {/* Admin Checkbox */}
      {isAdminMode && (
        <div
          className="absolute top-3 left-3 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="h-5 w-5 rounded border-gray-300 bg-white shadow-sm"
          />
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
        <div
          className={`text-8xl transition-transform duration-300 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        >
          {product.image}
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {getStockBadge()}
          {product.fastDelivery && !product.archived && (
            <span className="px-2 py-1 bg-[#2563eb] text-white text-xs font-medium rounded-full flex items-center gap-1">
              <Truck className="h-3 w-3" />
              Livré demain
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
              Nouveau
            </span>
          )}
        </div>

        {/* Labels */}
        {product.labels.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {product.labels.slice(0, 2).map((label) => (
              <span
                key={label}
                className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Admin Edit Controls */}
        {isAdminMode && isHovered && (
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-lg"
              title="✏️ Éditer"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive();
              }}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
              title="🗑️ Archiver"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Hover Actions (Public) */}
        {!isAdminMode && isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="px-4 py-2 bg-white text-[#2563eb] rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Voir détails
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              className="p-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Favorite */}
        {!isAdminMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="absolute top-3 left-3 p-2 bg-white dark:bg-gray-800 rounded-full hover:scale-110 transition-transform z-10"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>
        )}

        {/* Compare checkbox */}
        {!isAdminMode && (
          <div className="absolute bottom-3 right-3">
            <input
              type="checkbox"
              checked={isComparing}
              onChange={(e) => {
                e.stopPropagation();
                onToggleCompare();
              }}
              className="rounded border-gray-300 h-5 w-5"
              title="Comparer"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg group-hover:text-[#2563eb] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.seller.name}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-1 font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {product.seller.distance} km
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <div className="text-2xl font-bold text-[#2563eb]">
              {product.price}€
              <span className="text-sm font-normal text-muted-foreground">/{product.unit}</span>
            </div>
          </div>
          {!isAdminMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              className="p-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Inspired For You Section (unchanged)
function InspiredForYouSection({ products }: { products: Product[] }) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-6 w-6 text-purple-600" />
        <h2 className="text-xl font-bold">Inspiré pour vous</h2>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-card border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="text-5xl mb-2 text-center">{product.image}</div>
            <h3 className="font-medium text-sm text-center">{product.name}</h3>
            <p className="text-[#2563eb] font-bold text-center mt-2">
              {product.price}€/{product.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Product Detail Panel with Admin tab
function ProductDetailPanel({ product, onClose, onAddToCart, isFavorite, onToggleFavorite, isAdminMode, onUpdate }: any) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  
  // Admin fields
  const [adminFields, setAdminFields] = useState({
    category: product.category,
    visible: product.visible !== false,
    sku: product.sku || "",
  });

  const tabs = [
    { id: "details", label: "Détails", icon: Package },
    { id: "reviews", label: "Avis", icon: MessageCircle },
    ...(isAdminMode ? [{ id: "admin", label: "Administration", icon: SettingsIcon }] : []),
  ];

  const handleAdminSave = () => {
    onUpdate(adminFields);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full max-w-2xl bg-card h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">
            {isAdminMode ? "Édition produit" : "Détails du produit"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        {isAdminMode && (
          <div className="border-b bg-muted/30">
            <nav className="flex px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 border-b-2 transition-colors text-sm font-medium flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-[#2563eb] text-[#2563eb]"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === "details" && (
            <>
              {/* Image Gallery */}
              <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-9xl">{product.image}</div>
                <button
                  onClick={onToggleFavorite}
                  className="absolute top-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-full hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`h-6 w-6 ${
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 font-medium">{product.rating}</span>
                        <span className="text-muted-foreground">({product.reviewCount} avis)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-[#2563eb]">
                      {product.price}€
                      <span className="text-lg font-normal text-muted-foreground">
                        /{product.unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Labels */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.labels.map((label: string) => (
                    <span
                      key={label}
                      className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full"
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Variantes</h3>
                    <div className="flex gap-2">
                      {product.variants.map((variant: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedVariant(index)}
                          className={`px-4 py-2 border rounded-lg transition-colors ${
                            selectedVariant === index
                              ? "border-[#2563eb] bg-[#2563eb]/10 text-[#2563eb]"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="font-medium">{variant.name}</div>
                          <div className="text-sm">
                            {variant.price}€/{variant.unit}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Quantité</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="text-xl font-semibold min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                {!isAdminMode && (
                  <button
                    onClick={() => {
                      onAddToCart();
                    }}
                    className="w-full px-6 py-4 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    Ajouter au panier - {(product.price * quantity).toFixed(2)}€
                  </button>
                )}
              </div>

              {/* Seller Info */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">À propos du vendeur</h3>
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="h-16 w-16 bg-gradient-to-br from-[#2563eb] to-blue-400 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                    {product.seller.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{product.seller.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {product.seller.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {product.seller.rating}
                      </div>
                      <div>{product.seller.totalSales} ventes</div>
                    </div>
                    <button className="mt-3 px-4 py-2 border rounded-lg hover:bg-background transition-colors text-sm font-medium">
                      Voir la boutique
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "reviews" && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Avis clients</h3>
              <div className="space-y-4">
                {product.reviews.slice(0, 3).map((review: any) => (
                  <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.author}</span>
                          {review.verified && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Achat vérifié
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "admin" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Paramètres administrateur</h3>
                
                {/* Category selector */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Catégorie principale</label>
                    <select
                      value={adminFields.category}
                      onChange={(e) =>
                        setAdminFields({ ...adminFields, category: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    >
                      <option value="Légumes">Légumes</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Produits Laitiers">Produits Laitiers</option>
                      <option value="Viandes">Viandes</option>
                      <option value="Œufs">Œufs</option>
                      <option value="Autres">Autres</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">SKU / Référence</label>
                    <input
                      type="text"
                      value={adminFields.sku}
                      onChange={(e) =>
                        setAdminFields({ ...adminFields, sku: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                      placeholder="Ex: PROD-001"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Visible sur le marketplace</div>
                      <div className="text-sm text-muted-foreground">
                        Le produit est accessible aux clients
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={adminFields.visible}
                        onChange={(e) =>
                          setAdminFields({ ...adminFields, visible: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2563eb]/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2563eb]"></div>
                    </label>
                  </div>

                  <button
                    onClick={() => toast.info("Historique des modifications")}
                    className="w-full px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
                  >
                    <History className="h-4 w-4" />
                    Historique des modifications
                  </button>
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleAdminSave}
                className="w-full px-6 py-4 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-semibold text-lg flex items-center justify-center gap-2"
              >
                <Check className="h-6 w-6" />
                Sauvegarder les changements
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add Product Modal
function AddProductModal({ onClose, onSave, categories }: any) {
  const [step, setStep] = useState(1);
  const [productType, setProductType] = useState<"simple" | "advanced" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    unit: "kg",
    image: "📦",
    description: "",
    labels: [] as string[],
    sku: "",
  });

  const emojiOptions = ["🍅", "🥬", "🍎", "🧀", "🥩", "🥚", "🍓", "🍯", "🥕", "🍞", "🥛", "🍗"];

  const handleSubmit = () => {
    if (productType === "simple") {
      onSave(formData);
    } else {
      toast.info("Ouverture de l'assistant complet");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-xl w-full max-w-2xl">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Ajouter un nouveau produit</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Choisissez le type de création qui vous convient :
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setProductType("simple");
                    setStep(2);
                  }}
                  className="p-6 border-2 rounded-lg hover:border-[#2563eb] hover:bg-[#2563eb]/5 transition-all text-left"
                >
                  <Package className="h-8 w-8 text-[#2563eb] mb-3" />
                  <h3 className="font-semibold mb-2">Produit simple</h3>
                  <p className="text-sm text-muted-foreground">
                    Formulaire rapide pour un produit basique
                  </p>
                </button>
                <button
                  onClick={() => {
                    setProductType("advanced");
                    handleSubmit();
                  }}
                  className="p-6 border-2 rounded-lg hover:border-[#2563eb] hover:bg-[#2563eb]/5 transition-all text-left"
                >
                  <SettingsIcon className="h-8 w-8 text-[#2563eb] mb-3" />
                  <h3 className="font-semibold mb-2">Assistant complet</h3>
                  <p className="text-sm text-muted-foreground">
                    Formulaire détaillé avec toutes les options
                  </p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && productType === "simple" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom du produit *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  placeholder="Ex: Tomates Bio"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map((cat: Category) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prix (€) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    placeholder="4.50"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Unité</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                >
                  <option value="kg">kg</option>
                  <option value="pièce">pièce</option>
                  <option value="litre">litre</option>
                  <option value="barquette">barquette</option>
                  <option value="boîte">boîte</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image (emoji)</label>
                <div className="grid grid-cols-12 gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setFormData({ ...formData, image: emoji })}
                      className={`text-3xl p-2 border rounded hover:bg-muted transition-colors ${
                        formData.image === emoji ? "ring-2 ring-[#2563eb]" : ""
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background resize-none"
                  placeholder="Description du produit..."
                />
              </div>
            </div>
          )}
        </div>

        {step === 2 && (
          <div className="px-6 py-4 border-t flex gap-3 justify-end">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Retour
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.category}
              className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Archive Confirmation Modal
function ArchiveConfirmModal({ product, onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-orange-600" />
          <h2 className="text-xl font-bold">Archiver ce produit ?</h2>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-muted-foreground">
            Le produit <strong>"{product.name}"</strong> ne sera plus visible sur le marketplace.
            Vous pourrez le restaurer à tout moment.
          </p>
        </div>

        <div className="px-6 py-4 border-t flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Archiver
          </button>
        </div>
      </div>
    </div>
  );
}

// Initial data
const initialCategories: Category[] = [
  { id: "CAT-001", name: "Légumes", icon: "🥬" },
  { id: "CAT-002", name: "Fruits", icon: "🍎" },
  { id: "CAT-003", name: "Produits Laitiers", icon: "🧀" },
  { id: "CAT-004", name: "Viandes", icon: "🥩" },
  { id: "CAT-005", name: "Œufs", icon: "🥚" },
  { id: "CAT-006", name: "Autres", icon: "📦" },
];

const initialProducts: Product[] = [
  {
    id: "PROD-001",
    name: "Tomates Bio",
    category: "Légumes",
    subcategory: "Tomates",
    price: 4.5,
    unit: "kg",
    image: "🍅",
    seller: {
      name: "Ferme du Soleil Levant",
      location: "Lyon, Rhône",
      distance: 8.5,
      rating: 4.9,
      totalSales: 245,
    },
    stock: "in-stock",
    rating: 4.8,
    reviewCount: 34,
    labels: ["Bio", "Local"],
    fastDelivery: true,
    description:
      "Tomates cerises cultivées en plein air, récoltées à maturité. Saveur sucrée et parfumée.",
    variants: [
      { name: "500g", price: 2.5, unit: "sachet" },
      { name: "1kg", price: 4.5, unit: "kg" },
      { name: "2kg", price: 8.5, unit: "caisse" },
    ],
    specifications: {
      Origine: "France - Rhône",
      Calibre: "Petit",
      Conservation: "3-5 jours",
    },
    reviews: [
      {
        id: "R1",
        author: "Marie D.",
        rating: 5,
        date: "Il y a 3 jours",
        comment: "Tomates délicieuses, vraiment goûteuses ! Je recommande.",
        verified: true,
      },
      {
        id: "R2",
        author: "Pierre M.",
        rating: 4,
        date: "Il y a 1 semaine",
        comment: "Bonne qualité, livrées rapidement.",
        verified: true,
      },
    ],
    sku: "TOM-BIO-001",
    visible: true,
  },
  {
    id: "PROD-002",
    name: "Laitue Batavia",
    category: "Légumes",
    price: 2.2,
    unit: "pièce",
    image: "🥬",
    seller: {
      name: "Les Jardins de Provence",
      location: "Marseille, Bouches-du-Rhône",
      distance: 15.2,
      rating: 4.7,
      totalSales: 189,
    },
    stock: "in-stock",
    rating: 4.6,
    reviewCount: 22,
    labels: ["Bio", "Primeur"],
    fastDelivery: false,
    description: "Laitue fraîche et croquante, cultivée sans pesticides.",
    specifications: {
      Origine: "France - Provence",
      Variété: "Batavia",
    },
    reviews: [
      {
        id: "R3",
        author: "Sophie L.",
        rating: 5,
        date: "Il y a 2 jours",
        comment: "Très fraîche, parfaite pour mes salades !",
        verified: true,
      },
    ],
    sku: "LAI-BAT-001",
    visible: true,
  },
  {
    id: "PROD-003",
    name: "Pommes Golden",
    category: "Fruits",
    price: 3.8,
    unit: "kg",
    image: "🍎",
    seller: {
      name: "Verger des Alpes",
      location: "Grenoble, Isère",
      distance: 12.0,
      rating: 4.8,
      totalSales: 312,
    },
    stock: "in-stock",
    rating: 4.9,
    reviewCount: 67,
    labels: ["Local", "Fermier"],
    fastDelivery: true,
    description: "Pommes Golden croquantes et sucrées, idéales pour le goûter.",
    specifications: {
      Origine: "France - Savoie",
      Calibre: "Moyen",
      Conservation: "2 semaines",
    },
    reviews: [
      {
        id: "R4",
        author: "Jean C.",
        rating: 5,
        date: "Il y a 5 jours",
        comment: "Excellentes pommes, très sucrées et juteuses !",
        verified: true,
      },
    ],
    sku: "POM-GOL-001",
    visible: true,
  },
  {
    id: "PROD-004",
    name: "Fromage de Chèvre",
    category: "Produits Laitiers",
    price: 6.5,
    unit: "pièce",
    image: "🧀",
    seller: {
      name: "Chèvrerie du Mont Blanc",
      location: "Annecy, Haute-Savoie",
      distance: 22.5,
      rating: 4.9,
      totalSales: 156,
    },
    stock: "limited",
    rating: 5.0,
    reviewCount: 45,
    labels: ["Bio", "AOP", "Fermier"],
    fastDelivery: false,
    description: "Fromage de chèvre au lait cru, affiné 3 semaines. Texture fondante.",
    specifications: {
      Lait: "Chèvre - cru",
      Affinage: "3 semaines",
      Poids: "200g",
    },
    reviews: [
      {
        id: "R5",
        author: "Claire B.",
        rating: 5,
        date: "Il y a 1 semaine",
        comment: "Un délice ! Texture parfaite et goût authentique.",
        verified: true,
      },
    ],
    sku: "FRO-CHE-001",
    visible: true,
  },
  {
    id: "PROD-005",
    name: "Steak Haché Pur Bœuf",
    category: "Viandes",
    price: 12.9,
    unit: "kg",
    image: "🥩",
    seller: {
      name: "Boucherie Traditionnelle Dupont",
      location: "Lyon, Rhône",
      distance: 5.8,
      rating: 4.8,
      totalSales: 278,
    },
    stock: "in-stock",
    rating: 4.7,
    reviewCount: 89,
    labels: ["Local", "Fermier"],
    fastDelivery: true,
    description: "Steaks hachés 100% pur bœuf, viande française. Haché du jour.",
    variants: [
      { name: "5% MG", price: 13.9, unit: "kg" },
      { name: "15% MG", price: 12.9, unit: "kg" },
    ],
    specifications: {
      Origine: "France - Charolais",
      "Matière grasse": "15%",
      Conservation: "2-3 jours",
    },
    reviews: [
      {
        id: "R6",
        author: "Thomas R.",
        rating: 5,
        date: "Il y a 4 jours",
        comment: "Viande de qualité, très tendre !",
        verified: true,
      },
    ],
    sku: "VIA-BOE-001",
    visible: true,
  },
  {
    id: "PROD-006",
    name: "Œufs Fermiers Bio",
    category: "Œufs",
    price: 4.2,
    unit: "boîte de 6",
    image: "🥚",
    seller: {
      name: "Ferme Avicole des Monts",
      location: "Chambéry, Savoie",
      distance: 18.3,
      rating: 4.9,
      totalSales: 423,
    },
    stock: "in-stock",
    rating: 4.9,
    reviewCount: 112,
    labels: ["Bio", "Fermier"],
    fastDelivery: true,
    description: "Œufs extra-frais de poules élevées en plein air. Jaune orangé.",
    variants: [
      { name: "Boîte de 6", price: 4.2, unit: "boîte" },
      { name: "Boîte de 12", price: 7.9, unit: "boîte" },
    ],
    specifications: {
      Catégorie: "Code 0 (Bio)",
      Calibre: "Moyen",
      Fraîcheur: "Extra-frais",
    },
    reviews: [
      {
        id: "R7",
        author: "Anne F.",
        rating: 5,
        date: "Il y a 2 jours",
        comment: "Meilleurs œufs que j'ai mangés ! Jaunes magnifiques.",
        verified: true,
      },
    ],
    sku: "OEU-FER-001",
    visible: true,
  },
  {
    id: "PROD-007",
    name: "Fraises Gariguette",
    category: "Fruits",
    price: 8.5,
    unit: "barquette 500g",
    image: "🍓",
    seller: {
      name: "Maraîchers de Provence",
      location: "Avignon, Vaucluse",
      distance: 35.0,
      rating: 4.6,
      totalSales: 198,
    },
    stock: "limited",
    rating: 4.7,
    reviewCount: 56,
    labels: ["Primeur", "Local"],
    fastDelivery: false,
    description: "Fraises Gariguette parfumées, cueillies le matin même.",
    specifications: {
      Origine: "France - Provence",
      Variété: "Gariguette",
      Conservation: "2-3 jours",
    },
    reviews: [
      {
        id: "R8",
        author: "Lucie M.",
        rating: 5,
        date: "Il y a 3 jours",
        comment: "Fraises incroyablement parfumées et sucrées !",
        verified: true,
      },
    ],
    sku: "FRU-FRA-001",
    visible: true,
  },
  {
    id: "PROD-008",
    name: "Miel de Lavande",
    category: "Autres",
    price: 9.8,
    unit: "pot 250g",
    image: "🍯",
    seller: {
      name: "Rucher des Hautes Alpes",
      location: "Gap, Hautes-Alpes",
      distance: 42.0,
      rating: 5.0,
      totalSales: 89,
    },
    stock: "in-stock",
    rating: 5.0,
    reviewCount: 38,
    labels: ["Bio", "Fermier"],
    fastDelivery: false,
    description: "Miel de lavande pur, récolté en altitude. Cristallisation naturelle.",
    specifications: {
      Origine: "France - Alpes",
      Type: "Lavande",
      Récolte: "2025",
    },
    reviews: [
      {
        id: "R9",
        author: "David L.",
        rating: 5,
        date: "Il y a 1 semaine",
        comment: "Miel exceptionnel, parfum subtil de lavande.",
        verified: true,
      },
    ],
    sku: "MIE-LAV-001",
    visible: true,
  },
  {
    id: "PROD-009",
    name: "Carottes Bio",
    category: "Légumes",
    price: 2.9,
    unit: "kg",
    image: "🥕",
    seller: {
      name: "Bio Terre Aquitaine",
      location: "Bordeaux, Gironde",
      distance: 28.0,
      rating: 4.7,
      totalSales: 267,
    },
    stock: "in-stock",
    rating: 4.6,
    reviewCount: 41,
    labels: ["Bio", "Local"],
    fastDelivery: true,
    description: "Carottes bio croquantes et sucrées, cultivées sans pesticides.",
    specifications: {
      Origine: "France - Nouvelle-Aquitaine",
      Conservation: "1 semaine",
    },
    reviews: [
      {
        id: "R10",
        author: "Emma D.",
        rating: 4,
        date: "Il y a 6 jours",
        comment: "Bonnes carottes, bien croquantes.",
        verified: true,
      },
    ],
    sku: "LEG-CAR-001",
    visible: true,
  },
  {
    id: "PROD-010",
    name: "Pain au Levain",
    category: "Autres",
    price: 5.2,
    unit: "pièce",
    image: "🍞",
    seller: {
      name: "Boulangerie Artisanale Martin",
      location: "Lyon, Rhône",
      distance: 6.2,
      rating: 4.9,
      totalSales: 534,
    },
    stock: "in-stock",
    rating: 4.9,
    reviewCount: 156,
    labels: ["Fermier"],
    fastDelivery: true,
    description: "Pain au levain naturel, cuit au feu de bois. Croûte épaisse.",
    specifications: {
      Poids: "800g",
      Cuisson: "Feu de bois",
      Conservation: "3-4 jours",
    },
    reviews: [
      {
        id: "R11",
        author: "François B.",
        rating: 5,
        date: "Il y a 1 jour",
        comment: "Meilleur pain de Lyon ! Croûte parfaite.",
        verified: true,
      },
    ],
    sku: "PAI-LEV-001",
    visible: true,
  },
  {
    id: "PROD-011",
    name: "Yaourt Nature Fermier",
    category: "Produits Laitiers",
    price: 3.8,
    unit: "pot 500g",
    image: "🥛",
    seller: {
      name: "Ferme Laitière du Vercors",
      location: "Grenoble, Isère",
      distance: 14.5,
      rating: 4.8,
      totalSales: 398,
    },
    stock: "in-stock",
    rating: 4.8,
    reviewCount: 78,
    labels: ["Bio", "Fermier"],
    fastDelivery: true,
    description: "Yaourt au lait entier, texture onctueuse. Fabrication artisanale.",
    specifications: {
      Lait: "Vache - entier",
      "Matière grasse": "3.5%",
      Conservation: "15 jours",
    },
    reviews: [
      {
        id: "R12",
        author: "Isabelle P.",
        rating: 5,
        date: "Il y a 2 jours",
        comment: "Yaourt délicieux, très onctueux !",
        verified: true,
      },
    ],
    sku: "LAI-YAO-001",
    visible: true,
  },
  {
    id: "PROD-012",
    name: "Poulet Fermier Label Rouge",
    category: "Viandes",
    price: 14.5,
    unit: "kg",
    image: "🍗",
    seller: {
      name: "Élevage de la Plaine",
      location: "Valence, Drôme",
      distance: 25.8,
      rating: 4.9,
      totalSales: 187,
    },
    stock: "pre-order",
    rating: 4.9,
    reviewCount: 93,
    labels: ["Fermier", "Label Rouge"],
    fastDelivery: false,
    description: "Poulet élevé en plein air pendant 81 jours minimum. Chair ferme et savoureuse.",
    specifications: {
      Label: "Label Rouge",
      Élevage: "Plein air",
      "Âge abattage": "81 jours minimum",
    },
    reviews: [
      {
        id: "R13",
        author: "Michel T.",
        rating: 5,
        date: "Il y a 1 semaine",
        comment: "Poulet exceptionnel, vrai goût de poulet fermier !",
        verified: true,
      },
    ],
    sku: "VIA-POU-001",
    visible: true,
  },
];
