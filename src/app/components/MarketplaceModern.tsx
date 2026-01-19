import { useState, useEffect, useMemo } from "react";
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
  TrendingUp,
  Clock,
  MessageCircle,
  Check,
  Minus,
  Plus,
  ArrowUpDown,
  Sparkles,
  Package,
  Edit,
  Trash2,
  MoreVertical,
  Settings as SettingsIcon,
  Archive,
  Move,
  History,
  AlertTriangle,
  FolderPlus,
  Leaf,
  Apple,
  Milk,
  Beef,
  Egg,
  Package as PackageBox,
  Sprout,
  Eye,
  Sun,
  CloudRain,
  Droplet,
  Wind,
} from "lucide-react";
import { toast } from "sonner";
import { MarketplaceHero } from "./marketplace/hero/MarketplaceHero";
import { ProductFilterSidebar } from "./marketplace/filters/ProductFilterSidebar";
import type { PriceRange } from "./marketplace/filters/ProductFilterSidebar";
import { ProductGrid } from "./marketplace/grid/ProductGrid";

type ProductHistoryChange = {
  field: keyof Product;
  from: unknown;
  to: unknown;
};

type ProductHistoryEntry = {
  id: string;
  timestamp: string;
  author: string;
  changes: ProductHistoryChange[];
};

type ProductMediaItem = {
  id: string;
  url: string;
  type: "image" | "video";
  alt?: string;
  isPrimary?: boolean;
};

type ProductPromotion = {
  type: "percentage" | "fixed";
  value: number;
  startsAt?: string;
  endsAt?: string;
  label?: string;
};

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
  media?: ProductMediaItem[];
  promotion?: ProductPromotion;
  history?: ProductHistoryEntry[];
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  children?: Category[];
}

const DEFAULT_PRICE_RANGE: PriceRange = [0, 100];

const marketplaceWeatherData = {
  current: { temp: 22, humidity: 64, wind: 12, rain: 0 },
  forecast: [
    { day: "Lun", temp: 24, rain: 10, icon: Sun },
    { day: "Mar", temp: 23, rain: 20, icon: CloudRain },
    { day: "Mer", temp: 21, rain: 40, icon: CloudRain },
    { day: "Jeu", temp: 25, rain: 5, icon: Sun },
  ],
};

export function isPromotionActive(promotion?: ProductPromotion | null, now: Date = new Date()) {
  if (!promotion || !promotion.value) return false;
  if (promotion.startsAt && new Date(promotion.startsAt) > now) return false;
  if (promotion.endsAt && new Date(promotion.endsAt) < now) return false;
  return true;
}

export function computePromotionPrice(
  basePrice: number,
  promotion?: ProductPromotion | null,
  now: Date = new Date()
) {
  if (!isPromotionActive(promotion, now)) return null;
  const value = promotion!.value;
  let discounted = basePrice;
  if (promotion!.type === "percentage") {
    discounted = basePrice * (1 - value / 100);
  } else if (promotion!.type === "fixed") {
    discounted = Math.max(0, basePrice - value);
  }
  const savings = basePrice > 0 ? ((basePrice - discounted) / basePrice) * 100 : 0;
  return {
    discountedPrice: discounted,
    savingsPercentage: savings,
  };
}

export function MarketplaceModern({ adminMode = false, onAdminModeChange }: { adminMode?: boolean; onAdminModeChange?: (value: boolean) => void }) {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
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
  const [priceRange, setPriceRange] = useState<PriceRange>(DEFAULT_PRICE_RANGE);
  const [maxDistance, setMaxDistance] = useState(50);
  const [minRating, setMinRating] = useState(0);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // Smart Filters State
  const [savedFilterPresets, setSavedFilterPresets] = useState<Array<{
    id: string;
    name: string;
    filters: {
      categories: string[];
      priceRange: PriceRange;
      maxDistance: number;
      minRating: number;
      labels: string[];
    };
  }>>([]);
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);
  const [filterPresetName, setFilterPresetName] = useState("");

  // Price & Availability Alerts State
  const [priceAlerts, setPriceAlerts] = useState<Array<{
    id: string;
    productId: string;
    productName: string;
    type: "price_drop" | "back_in_stock" | "price_target";
    targetPrice?: number;
    currentPrice: number;
    createdAt: string;
    active: boolean;
  }>>([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertProduct, setAlertProduct] = useState<Product | null>(null);
  const [alertType, setAlertType] = useState<"price_drop" | "back_in_stock" | "price_target">("price_drop");
  const [targetPrice, setTargetPrice] = useState("");
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);

  // Browse History & Recommendations State
  const [browseHistory, setBrowseHistory] = useState<Array<{
    productId: string;
    productName: string;
    category: string;
    price: number;
    viewedAt: string;
    viewDuration?: number;
  }>>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const handle = setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const matches = products
        .filter((product) => {
          if (product.archived) {
            return false;
          }
          const nameMatch = product.name.toLowerCase().includes(q);
          const sellerMatch = product.seller.name.toLowerCase().includes(q);
          const categoryMatch = product.category.toLowerCase().includes(q);
          return nameMatch || sellerMatch || categoryMatch;
        })
        .slice(0, 6);

      setSearchSuggestions(matches);
    }, 200);

    return () => clearTimeout(handle);
  }, [searchQuery, products]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("AgroLogistic-favorites");
    if (saved) setFavorites(JSON.parse(saved));
    
    const savedSort = localStorage.getItem("AgroLogistic-sort-preference");
    if (savedSort) setSortBy(savedSort);

    // Load saved filter presets
    const savedPresets = localStorage.getItem("AgroLogistic-filter-presets");
    if (savedPresets) {
      try {
        setSavedFilterPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error("Failed to parse filter presets", e);
      }
    }

    // Load last used filters
    const lastFilters = localStorage.getItem("AgroLogistic-last-filters");
    if (lastFilters) {
      try {
        const filters = JSON.parse(lastFilters);
        setSelectedCategories(filters.categories || []);
        setPriceRange(
          Array.isArray(filters.priceRange) && filters.priceRange.length === 2
            ? filters.priceRange
            : [0, 100]
        );
        setMaxDistance(filters.maxDistance || 50);
        setMinRating(filters.minRating || 0);
        setSelectedLabels(filters.labels || []);
      } catch (e) {
        console.error("Failed to parse last filters", e);
      }
    }

    // Load saved price alerts
    const savedAlerts = localStorage.getItem("AgroLogistic-price-alerts");
    if (savedAlerts) {
      try {
        setPriceAlerts(JSON.parse(savedAlerts));
      } catch (e) {
        console.error("Failed to parse price alerts", e);
      }
    }

    // Load browse history
    const savedHistory = localStorage.getItem("AgroLogistic-browse-history");
    if (savedHistory) {
      try {
        setBrowseHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse browse history", e);
      }
    }
  }, []);

  // Save sort preference
  useEffect(() => {
    localStorage.setItem("AgroLogistic-sort-preference", sortBy);
  }, [sortBy]);

  // Auto-save current filters (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentFilters = {
        categories: selectedCategories,
        priceRange,
        maxDistance,
        minRating,
        labels: selectedLabels,
      };
      localStorage.setItem("AgroLogistic-last-filters", JSON.stringify(currentFilters));
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timer);
  }, [selectedCategories, priceRange, maxDistance, minRating, selectedLabels]);

  // Monitor price alerts and trigger notifications
  useEffect(() => {
    if (priceAlerts.length === 0) return;

    const checkAlerts = () => {
      const triggeredAlerts: typeof priceAlerts = [];
      const updatedAlerts = priceAlerts.map((alert) => {
        if (!alert.active) return alert;

        const product = products.find((p) => p.id === alert.productId);
        if (!product) return alert;

        let shouldTrigger = false;
        let message = "";

        switch (alert.type) {
          case "price_drop":
            if (product.price < alert.currentPrice) {
              shouldTrigger = true;
              message = `Le prix de "${product.name}" a baissé à ${product.price.toFixed(2)}€ (était ${alert.currentPrice.toFixed(2)}€)`;
            }
            break;
          case "back_in_stock":
            if (product.stock === "in-stock" && alert.currentPrice === 0) {
              shouldTrigger = true;
              message = `"${product.name}" est de nouveau en stock !`;
            }
            break;
          case "price_target":
            if (alert.targetPrice && product.price <= alert.targetPrice) {
              shouldTrigger = true;
              message = `"${product.name}" a atteint votre prix cible de ${alert.targetPrice.toFixed(2)}€ !`;
            }
            break;
        }

        if (shouldTrigger) {
          triggeredAlerts.push(alert);
          toast.success(message, {
            duration: 8000,
            action: {
              label: "Voir",
              onClick: () => setSelectedProduct(product),
            },
          });
          // Deactivate alert after triggering
          return { ...alert, active: false };
        }

        return alert;
      });

      if (triggeredAlerts.length > 0) {
        setPriceAlerts(updatedAlerts);
        localStorage.setItem("AgroLogistic-price-alerts", JSON.stringify(updatedAlerts));
      }
    };

    // Check alerts every 10 seconds (simulating real-time updates)
    const interval = setInterval(checkAlerts, 10000);
    // Also check immediately
    checkAlerts();

    return () => clearInterval(interval);
  }, [priceAlerts, products]);

  // Sync admin mode with prop
  useEffect(() => {
    setIsAdminMode(adminMode);
  }, [adminMode]);

  // Generate personalized recommendations based on browse history
  useEffect(() => {
    if (browseHistory.length === 0) {
      setRecommendations([]);
      return;
    }

    // Analyze browsing patterns
    const categoryFrequency: Record<string, number> = {};
    const labelPreferences: Record<string, number> = {};
    const priceRanges: number[] = [];

    browseHistory.forEach((item) => {
      // Count category views
      categoryFrequency[item.category] = (categoryFrequency[item.category] || 0) + 1;
      priceRanges.push(item.price);

      // Find product to get labels
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        product.labels.forEach((label) => {
          labelPreferences[label] = (labelPreferences[label] || 0) + 1;
        });
      }
    });

    // Calculate average price range
    const avgPrice = priceRanges.reduce((a, b) => a + b, 0) / priceRanges.length;
    const priceMargin = avgPrice * 0.3; // 30% margin

    // Get most viewed categories
    const topCategories = Object.entries(categoryFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => cat);

    // Get preferred labels
    const preferredLabels = Object.entries(labelPreferences)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([label]) => label);

    // Get IDs of already viewed products
    const viewedIds = new Set(browseHistory.map((h) => h.productId));

    // Score products based on preferences
    const scoredProducts = products
      .filter((p) => !p.archived && !viewedIds.has(p.id)) // Exclude viewed and archived
      .map((product) => {
        let score = 0;

        // Category match (highest weight)
        if (topCategories.includes(product.category)) {
          score += 10;
        }

        // Label match
        const matchingLabels = product.labels.filter((l) => preferredLabels.includes(l));
        score += matchingLabels.length * 5;

        // Price similarity
        const priceDiff = Math.abs(product.price - avgPrice);
        if (priceDiff <= priceMargin) {
          score += 8 - (priceDiff / priceMargin) * 3; // Higher score for closer prices
        }

        // Rating bonus
        score += product.rating;

        // Stock availability
        if (product.stock === "in-stock") score += 2;

        // Fast delivery bonus
        if (product.fastDelivery) score += 1;

        return { product, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8) // Top 8 recommendations
      .map(({ product }) => product);

    setRecommendations(scoredProducts);
  }, [browseHistory, products]);

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
    localStorage.setItem("AgroLogistic-favorites", JSON.stringify(newFavorites));
    toast.success(
      favorites.includes(productId) ? "Retiré des favoris" : "Ajouté aux favoris"
    );
  };

  const [showCompareModal, setShowCompareModal] = useState(false);

  const toggleCompare = (productId: string) => {
    if (compareProducts.includes(productId)) {
      setCompareProducts(compareProducts.filter((id) => id !== productId));
      toast.success("Produit retiré de la comparaison");
    } else if (compareProducts.length < 3) {
      setCompareProducts([...compareProducts, productId]);
      toast.success("Produit ajouté à la comparaison");
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
    setProducts(
      products.map((p) => {
        if (p.id !== productId) return p;
        const changes: ProductHistoryChange[] = [];
        Object.keys(updates).forEach((key) => {
          const k = key as keyof Product;
          const previous = p[k];
          const next = updates[k];
          if (previous === next) return;
          changes.push({
            field: k,
            from: previous,
            to: next,
          });
        });
        const hasChanges = changes.length > 0;
        const historyEntry: ProductHistoryEntry | null = hasChanges
          ? {
              id: `HIST-${Date.now()}`,
              timestamp: new Date().toISOString(),
              author: "Admin",
              changes,
            }
          : null;
        const nextHistory = historyEntry ? [...(p.history || []), historyEntry] : p.history;
        return {
          ...p,
          ...updates,
          history: nextHistory,
        };
      })
    );
    toast.success("✅ Produit mis à jour avec succès");
  };

  const handleAddProduct = (newProduct: Partial<Product>) => {
    const baseId = `PROD-${Date.now()}`;
    const historyEntry: ProductHistoryEntry = {
      id: `HIST-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: "Admin",
      changes: [
        {
          field: "name",
          from: "",
          to: newProduct.name || "Nouveau produit",
        },
      ],
    };
    const media = newProduct.media && newProduct.media.length > 0 ? newProduct.media : undefined;
    const primaryMedia = media && media.length > 0 ? media.find((m) => m.isPrimary) || media[0] : undefined;
    const product: Product = {
      id: newProduct.id || baseId,
      name: newProduct.name || "Nouveau produit",
      category: newProduct.category || "Autres",
      price: newProduct.price || 0,
      unit: newProduct.unit || "unité",
      image:
        primaryMedia?.url ||
        newProduct.image ||
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=400&fit=crop",
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
      variants: newProduct.variants,
      media,
      promotion: newProduct.promotion,
      history: [historyEntry],
    };
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
    toast.success("Filtres réinitialisés");
  };

  // Filter Preset Management
  const saveCurrentFilters = () => {
    if (!filterPresetName.trim()) {
      toast.error("Veuillez entrer un nom pour ce filtre");
      return;
    }

    const newPreset = {
      id: `preset-${Date.now()}`,
      name: filterPresetName,
      filters: {
        categories: selectedCategories,
        priceRange,
        maxDistance,
        minRating,
        labels: selectedLabels,
      },
    };

    const updatedPresets = [...savedFilterPresets, newPreset];
    setSavedFilterPresets(updatedPresets);
    localStorage.setItem("AgroLogistic-filter-presets", JSON.stringify(updatedPresets));
    
    setShowSaveFilterModal(false);
    setFilterPresetName("");
    toast.success(`Filtre "${filterPresetName}" enregistré`);
  };

  const loadFilterPreset = (preset: typeof savedFilterPresets[0]) => {
    setSelectedCategories(preset.filters.categories);
    setPriceRange(preset.filters.priceRange);
    setMaxDistance(preset.filters.maxDistance);
    setMinRating(preset.filters.minRating);
    setSelectedLabels(preset.filters.labels);
    toast.success(`Filtre "${preset.name}" appliqué`);
  };

  const deleteFilterPreset = (presetId: string) => {
    const updatedPresets = savedFilterPresets.filter((p) => p.id !== presetId);
    setSavedFilterPresets(updatedPresets);
    localStorage.setItem("AgroLogistic-filter-presets", JSON.stringify(updatedPresets));
    toast.success("Filtre supprimé");
  };

  // Quick Filter Presets
  const quickFilters = [
    {
      id: "bio-local",
      name: "Bio & Local",
      icon: Leaf,
      description: "Produits bio et locaux",
      apply: () => {
        setSelectedLabels(["Bio", "Local"]);
        setMaxDistance(20);
        toast.success("Filtre Bio & Local appliqué");
      },
    },
    {
      id: "nearby",
      name: "📍 À proximité",
      description: "Moins de 10 km",
      apply: () => {
        setMaxDistance(10);
        toast.success("Filtre proximité appliqué");
      },
    },
    {
      id: "best-rated",
      name: "⭐ Meilleures notes",
      description: "4 étoiles et plus",
      apply: () => {
        setMinRating(4);
        setSortBy("rating");
        toast.success("Filtre meilleures notes appliqué");
      },
    },
    {
      id: "budget",
      name: "💰 Petit budget",
      description: "Prix inférieur à 10€",
      apply: () => {
        setPriceRange([0, 10]);
        setSortBy("price-asc");
        toast.success("Filtre petit budget appliqué");
      },
    },
  ];

  // Price Alert Management
  const createPriceAlert = () => {
    if (!alertProduct) return;

    // Validate target price for price_target type
    if (alertType === "price_target") {
      const price = parseFloat(targetPrice);
      if (isNaN(price) || price <= 0) {
        toast.error("Veuillez entrer un prix valide");
        return;
      }
      if (price >= alertProduct.price) {
        toast.error("Le prix cible doit être inférieur au prix actuel");
        return;
      }
    }

    const newAlert = {
      id: `alert-${Date.now()}`,
      productId: alertProduct.id,
      productName: alertProduct.name,
      type: alertType,
      targetPrice: alertType === "price_target" ? parseFloat(targetPrice) : undefined,
      currentPrice: alertProduct.price,
      createdAt: new Date().toISOString(),
      active: true,
    };

    const updatedAlerts = [...priceAlerts, newAlert];
    setPriceAlerts(updatedAlerts);
    localStorage.setItem("AgroLogistic-price-alerts", JSON.stringify(updatedAlerts));

    setShowAlertModal(false);
    setAlertProduct(null);
    setTargetPrice("");

    const alertTypeMessages = {
      price_drop: "Vous serez alerté si le prix baisse",
      back_in_stock: "Vous serez alerté quand le produit sera disponible",
      price_target: `Vous serez alerté quand le prix atteindra ${parseFloat(targetPrice).toFixed(2)}€`,
    };

    toast.success(alertTypeMessages[alertType]);
  };

  const deleteAlert = (alertId: string) => {
    const updatedAlerts = priceAlerts.filter((a) => a.id !== alertId);
    setPriceAlerts(updatedAlerts);
    localStorage.setItem("AgroLogistic-price-alerts", JSON.stringify(updatedAlerts));
    toast.success("Alerte supprimée");
  };

  const openAlertModal = (product: Product, type: typeof alertType) => {
    setAlertProduct(product);
    setAlertType(type);
    setTargetPrice("");
    setShowAlertModal(true);
  };

  // Browse History & Recommendations Management
  const trackProductView = (product: Product) => {
    const viewEntry = {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      viewedAt: new Date().toISOString(),
    };

    // Avoid duplicates - keep only most recent view of each product
    const updatedHistory = [
      viewEntry,
      ...browseHistory.filter((h) => h.productId !== product.id),
    ].slice(0, 50); // Keep last 50 views

    setBrowseHistory(updatedHistory);
    localStorage.setItem("AgroLogistic-browse-history", JSON.stringify(updatedHistory));
  };

  const clearBrowseHistory = () => {
    setBrowseHistory([]);
    localStorage.removeItem("AgroLogistic-browse-history");
    toast.success("Historique de navigation effacé");
  };

  const removeFromHistory = (productId: string) => {
    const updatedHistory = browseHistory.filter((h) => h.productId !== productId);
    setBrowseHistory(updatedHistory);
    localStorage.setItem("AgroLogistic-browse-history", JSON.stringify(updatedHistory));
    toast.success("Produit retiré de l'historique");
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    trackProductView(product);
    setShowSearchSuggestions(false);
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-6 sm:px-6 lg:px-8 transition-colors">
      {/* Admin Banner */}
      {isAdminMode && (
        <div
          className="bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-lg p-4 flex items-center justify-between"
          data-testid="admin-banner"
        >
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-5 w-5 text-[#2563eb]" />
            <span className="font-semibold text-[#2563eb]">⚙️ Mode Édition Admin Actif</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium flex items-center gap-2"
              data-testid="add-product-button"
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

      <MarketplaceHero />

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Left Sidebar - Filters */}
        {showFilters && (
          <div className="w-80 flex-shrink-0">
            <ProductFilterSidebar
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
              // Smart Filters Props
              savedFilterPresets={savedFilterPresets}
              quickFilters={quickFilters}
              onLoadPreset={loadFilterPreset}
              onDeletePreset={deleteFilterPreset}
              onSaveCurrentFilters={() => setShowSaveFilterModal(true)}
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
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowSearchSuggestions(false), 100);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
                {showSearchSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 z-20 bg-card border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {searchSuggestions.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleProductClick(product)}
                        className="w-full px-3 py-2 text-left hover:bg-muted/60 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded bg-muted flex items-center justify-center text-sm">
                            <span className="truncate max-w-[2rem]">
                              {product.name.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium truncate">
                              {product.name}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">
                                {product.seller.location}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm font-semibold text-[#2563eb]">
                            {product.price.toFixed(2)}€
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
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
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 transition-colors ${
                    viewMode === "map" ? "bg-[#2563eb] text-white" : "hover:bg-muted"
                  }`}
                >
                  <MapPin className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 ml-3">
                {isAdminMode && (
                  <>
                    <button
                      onClick={() => {
                        const allIds = filteredProducts.map((product) => product.id);
                        setSelectedForEdit(allIds);
                      }}
                      className="px-3 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
                      data-testid="select-all-products"
                    >
                      Tout sélectionner
                    </button>
                    <button
                      onClick={() => setSelectedForEdit([])}
                      className="px-3 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
                      data-testid="deselect-all-products"
                    >
                      Tout désélectionner
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    const nextMode = !isAdminMode;
                    setIsAdminMode(nextMode);
                    onAdminModeChange?.(nextMode);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                    isAdminMode
                      ? "bg-[#2563eb] text-white border-[#2563eb]"
                      : "bg-background hover:bg-muted"
                  }`}
                  data-testid="admin-toggle"
                >
                  Mode admin
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

            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredProducts.length}</span>{" "}
              produit(s) trouvé(s)
            </div>
          </div>

          <div className="mt-4">
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <div className="md:col-span-2 hidden md:block text-sm text-muted-foreground">
                Les conditions météo influencent les prix et la disponibilité des produits frais.
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Météo locale</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Aujourd'hui</span>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-3xl font-bold">
                    {marketplaceWeatherData.current.temp}°C
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Droplet className="h-3 w-3" />
                      <span>{marketplaceWeatherData.current.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-3 w-3" />
                      <span>{marketplaceWeatherData.current.wind} km/h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CloudRain className="h-3 w-3" />
                      <span>{marketplaceWeatherData.current.rain} mm</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between gap-2 text-xs">
                  {marketplaceWeatherData.forecast.map((day) => {
                    const Icon = day.icon;
                    return (
                      <div key={day.day} className="flex flex-col items-center gap-1">
                        <span className="text-muted-foreground">{day.day}</span>
                        <Icon className="h-3 w-3 text-blue-500" />
                        <span className="font-medium">{day.temp}°</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <ProductGrid
              products={filteredProducts}
              viewMode={viewMode}
              favorites={favorites}
              compareProducts={compareProducts}
              selectedForEdit={selectedForEdit}
              isAdminMode={isAdminMode}
              onToggleFavorite={toggleFavorite}
              onToggleCompare={toggleCompare}
              onAddToCart={addToCart}
              onProductClick={handleProductClick}
              onToggleSelect={(productId) => {
                if (selectedForEdit.includes(productId)) {
                  setSelectedForEdit(selectedForEdit.filter((id) => id !== productId));
                } else {
                  setSelectedForEdit([...selectedForEdit, productId]);
                }
              }}
              onEditProduct={(product) => setSelectedProduct(product)}
              onArchiveProduct={(productId) => setShowArchiveConfirm(productId)}
            />
          </div>

          {/* Personalized Recommendations */}
          {recommendations.length > 0 && showRecommendations && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                    Recommandé pour vous
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Basé sur vos {browseHistory.length} produit(s) consulté(s)
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const historySection = document.getElementById("browse-history-section");
                      historySection?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm font-medium"
                  >
                    <History className="h-4 w-4 inline mr-1" />
                    Voir l'historique
                  </button>
                  <button
                    onClick={() => setShowRecommendations(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendations.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      trackProductView(product);
                    }}
                    className="bg-card border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="text-center mb-3">
                      <div className="text-5xl mb-2">{product.image}</div>
                      <div className="font-medium text-sm line-clamp-2">{product.name}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-[#2563eb]">
                        {product.price.toFixed(2)}€
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {product.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Browse History Section */}
          {browseHistory.length > 0 && (
            <div id="browse-history-section" className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <History className="h-6 w-6 text-[#2563eb]" />
                    Historique de navigation
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Les {browseHistory.length} derniers produits consultés
                  </p>
                </div>
                <button
                  onClick={clearBrowseHistory}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                >
                  <Trash2 className="h-4 w-4 inline mr-1" />
                  Effacer tout
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {browseHistory.slice(0, 8).map((historyItem) => {
                  const product = products.find((p) => p.id === historyItem.productId);
                  if (!product) return null;

                  const timeSince = () => {
                    const diff = Date.now() - new Date(historyItem.viewedAt).getTime();
                    const minutes = Math.floor(diff / 60000);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);

                    if (days > 0) return `Il y a ${days}j`;
                    if (hours > 0) return `Il y a ${hours}h`;
                    if (minutes > 0) return `Il y a ${minutes}min`;
                    return "A l'instant";
                  };

                  return (
                    <div
                      key={historyItem.productId}
                      className="bg-muted/30 border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer group relative"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(historyItem.productId);
                        }}
                        className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div
                        onClick={() => {
                          setSelectedProduct(product);
                          trackProductView(product);
                        }}
                      >
                        <div className="text-center mb-3">
                          <div className="text-5xl mb-2">{product.image}</div>
                          <div className="font-medium text-sm line-clamp-2">{product.name}</div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span><Clock className="h-3 w-3 inline mr-1" />{timeSince()}</span>
                          <span>{product.category}</span>
                        </div>
                        <div className="text-lg font-bold text-[#2563eb] text-center">
                          {product.price.toFixed(2)}€
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compare Floating Button */}
      {compareProducts.length > 0 && (
        <button
          className="fixed bottom-6 right-6 px-6 py-3 bg-[#2563eb] text-white rounded-full shadow-lg hover:bg-[#1d4ed8] transition-all flex items-center gap-2 z-40 hover:scale-105"
          onClick={() => setShowCompareModal(true)}
        >
          <ArrowUpDown className="h-5 w-5" />
          Comparer ({compareProducts.length})
        </button>
      )}

      {/* Price Alerts Floating Button */}
      {priceAlerts.length > 0 && (
        <button
          className="fixed bottom-6 right-48 px-6 py-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all flex items-center gap-2 z-40 hover:scale-105"
          onClick={() => setShowAlertsPanel(true)}
        >
          <AlertTriangle className="h-5 w-5" />
          Alertes ({priceAlerts.filter((a) => a.active).length})
        </button>
      )}

      {/* Bulk Actions Bar (Admin) */}
      {isAdminMode && selectedForEdit.length > 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border-2 border-[#2563eb] rounded-lg shadow-xl p-4 flex items-center gap-4 z-40"
          data-testid="bulk-actions-menu"
        >
          <span
            className="font-semibold text-[#2563eb]"
            data-testid="selection-counter"
          >
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
          onCreateAlert={(type) => openAlertModal(selectedProduct, type)}
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

      {/* Product Comparison Modal */}
      {showCompareModal && compareProducts.length > 0 && (
        <ProductComparisonModal
          products={products.filter((p) => compareProducts.includes(p.id))}
          onClose={() => setShowCompareModal(false)}
          onRemoveProduct={(productId) => toggleCompare(productId)}
          onAddToCart={(productId) => addToCart(productId)}
        />
      )}

      {/* Save Filter Preset Modal */}
      {showSaveFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Enregistrer ce filtre</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Donnez un nom à cette configuration de filtres
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom du filtre</label>
                <input
                  type="text"
                  value={filterPresetName}
                  onChange={(e) => setFilterPresetName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveCurrentFilters();
                  }}
                  placeholder="Ex: Produits bio locaux"
                  autoFocus
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="font-medium">Filtres actuels :</div>
                {selectedCategories.length > 0 && (
                  <div>• Catégories : {selectedCategories.join(", ")}</div>
                )}
                {(priceRange[0] !== 0 || priceRange[1] !== 100) && (
                  <div>• Prix : {priceRange[0]}€ - {priceRange[1]}€</div>
                )}
                {maxDistance !== 50 && <div>• Distance : {maxDistance} km</div>}
                {minRating > 0 && <div>• Note minimale : {minRating}⭐</div>}
                {selectedLabels.length > 0 && (
                  <div>• Labels : {selectedLabels.join(", ")}</div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowSaveFilterModal(false);
                  setFilterPresetName("");
                }}
                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveCurrentFilters}
                disabled={!filterPresetName.trim()}
                className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Price Alert Modal */}
      {showAlertModal && alertProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Créer une alerte</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Recevez une notification pour "{alertProduct.name}"
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-4">
                <div className="text-4xl">{alertProduct.image}</div>
                <div className="flex-1">
                  <div className="font-medium">{alertProduct.name}</div>
                  <div className="text-2xl font-bold text-[#2563eb] mt-1">
                    {alertProduct.price.toFixed(2)}€
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Type d'alerte</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setAlertType("price_drop")}
                    className={`w-full p-3 border rounded-lg text-left transition-all ${
                      alertType === "price_drop"
                        ? "border-[#2563eb] bg-[#2563eb]/10"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Baisse de prix
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Être alerté dès que le prix baisse
                    </div>
                  </button>

                  <button
                    onClick={() => setAlertType("price_target")}
                    className={`w-full p-3 border rounded-lg text-left transition-all ${
                      alertType === "price_target"
                        ? "border-[#2563eb] bg-[#2563eb]/10"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Prix cible
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Définir un prix souhaité
                    </div>
                  </button>

                  {alertProduct.stock === "out-of-stock" && (
                    <button
                      onClick={() => setAlertType("back_in_stock")}
                      className={`w-full p-3 border rounded-lg text-left transition-all ${
                        alertType === "back_in_stock"
                          ? "border-[#2563eb] bg-[#2563eb]/10"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="font-medium flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Retour en stock
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Être alerté quand le produit est disponible
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {alertType === "price_target" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Prix cible (€)
                  </label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder={`Moins de ${alertProduct.price.toFixed(2)}€`}
                    step="0.01"
                    min="0"
                    max={alertProduct.price}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Vous serez alerté quand le prix atteint ou passe en dessous de ce montant
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAlertModal(false);
                  setAlertProduct(null);
                  setTargetPrice("");
                }}
                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={createPriceAlert}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Créer l'alerte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Price Alerts Panel */}
      {showAlertsPanel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-orange-600 to-orange-700 text-white">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  Mes alertes prix
                </h2>
                <p className="text-sm opacity-90 mt-1">
                  {priceAlerts.filter((a) => a.active).length} alerte(s) active(s)
                </p>
              </div>
              <button
                onClick={() => setShowAlertsPanel(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {priceAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Vous n'avez pas encore d'alertes prix
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Créez des alertes depuis les pages produits
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {priceAlerts.map((alert) => {
                    const product = products.find((p) => p.id === alert.productId);
                    return (
                      <div
                        key={alert.id}
                        className={`border rounded-lg p-4 ${
                          alert.active ? "" : "opacity-60"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">
                            {product?.image || "📦"}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{alert.productName}</div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Prix actuel:</span>
                                <span className="font-bold text-[#2563eb] ml-1">
                                  {product?.price.toFixed(2) || alert.currentPrice.toFixed(2)}€
                                </span>
                              </div>
                              {alert.type === "price_target" && alert.targetPrice && (
                                <div>
                                  <span className="text-muted-foreground">Prix cible:</span>
                                  <span className="font-bold text-orange-600 ml-1">
                                    {alert.targetPrice.toFixed(2)}€
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  alert.active
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                                }`}
                              >
                                {alert.active ? "✅ Active" : "⏸️ Déclenchée"}
                              </span>
                              <span className="px-2 py-1 bg-muted rounded-full text-xs">
                                {alert.type === "price_drop" && "📉 Baisse de prix"}
                                {alert.type === "price_target" && "🎯 Prix cible"}
                                {alert.type === "back_in_stock" && (
                                  <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    <span>Retour stock</span>
                                  </div>
                                )}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Supprimer l'alerte"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
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
      IconComponent: Apple,
    },
    {
      title: "Nouveaux Producteurs",
      subtitle: "Soutenez les agriculteurs locaux",
      color: "from-green-500 to-emerald-500",
      IconComponent: Leaf,
    },
    {
      title: "Produits Bio",
      subtitle: "100% certifiés agriculture biologique",
      color: "from-blue-500 to-cyan-500",
      IconComponent: Sprout,
    },
  ];

  const categories = [
    { name: "Légumes", IconComponent: Leaf, count: 45 },
    { name: "Fruits", IconComponent: Apple, count: 38 },
    { name: "Produits Laitiers", IconComponent: Milk, count: 22 },
    { name: "Viandes", IconComponent: Beef, count: 18 },
    { name: "Œufs", IconComponent: Egg, count: 12 },
  ];

  return (
    <div className="space-y-4">
      {/* Modern Gradient Hero Carousel */}
      <div className="relative h-80 bg-gradient-to-br from-[#2563eb] via-blue-500 to-cyan-400 rounded-2xl overflow-hidden shadow-2xl">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        
        {/* Glassmorphism Content Container */}
        <div className="absolute inset-0 backdrop-blur-[2px]">
          <div className="absolute inset-0 flex items-center justify-center text-white px-8">
            <div className="text-center space-y-6 max-w-3xl">
              {/* Icon with Modern Glow Effect */}
              <div className="inline-flex p-6 bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 hover:scale-110 transition-transform duration-300">
                {(() => {
                  const Icon = slides[currentSlide].IconComponent;
                  return <Icon className="h-24 w-24 text-white drop-shadow-2xl" strokeWidth={1.5} />;
                })()}
              </div>
              
              {/* Modern Typography */}
              <div className="space-y-3">
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight drop-shadow-lg">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-xl md:text-2xl font-light opacity-95 tracking-wide">
                  {slides[currentSlide].subtitle}
                </p>
              </div>
              
              {/* Modern CTA Button */}
              <button className="group px-8 py-4 bg-white text-[#2563eb] rounded-full font-semibold text-lg hover:bg-opacity-95 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105 flex items-center gap-2 mx-auto">
                Découvrir
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
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

      {/* Modern Category Cards with Hover Effects */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <button
            key={category.name}
            className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-2xl hover:scale-105 hover:border-[#2563eb] transition-all duration-300 text-center overflow-hidden"
          >
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb]/0 to-blue-500/0 group-hover:from-[#2563eb]/5 group-hover:to-blue-500/5 transition-all duration-300 rounded-2xl"></div>
            
            {/* Icon Container with Modern Animation */}
            <div className="relative mb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#2563eb]/10 via-blue-500/10 to-cyan-400/10 rounded-2xl flex items-center justify-center group-hover:from-[#2563eb]/20 group-hover:via-blue-500/20 group-hover:to-cyan-400/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                {(() => {
                  const Icon = category.IconComponent;
                  return <Icon className="h-10 w-10 text-[#2563eb] group-hover:text-blue-600 transition-colors" strokeWidth={1.5} />;
                })()}
              </div>
            </div>
            
            {/* Text Content */}
            <div className="relative">
              <div className="font-semibold text-gray-900 dark:text-white text-base group-hover:text-[#2563eb] transition-colors">
                {category.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {category.count} produits
              </div>
            </div>
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
  // Smart Filters Props
  savedFilterPresets,
  quickFilters,
  onLoadPreset,
  onDeletePreset,
  onSaveCurrentFilters,
}: any) {
  const labels = ["Bio", "Local", "Primeur", "Fermier", "AOP"];
  const [categoryRename, setCategoryRename] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 100 ||
    maxDistance !== 50 ||
    minRating > 0 ||
    selectedLabels.length > 0;

  return (
    <div className="bg-card border rounded-lg p-6 sticky top-6 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-[#2563eb]" />
          Filtres
        </h2>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={onSaveCurrentFilters}
              className="p-2 text-[#2563eb] hover:bg-[#2563eb]/10 rounded-lg transition-colors"
              title="Enregistrer ces filtres"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClearAll}
            className="text-xs text-[#2563eb] hover:underline"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <div className="text-sm font-medium mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#2563eb]" />
          Filtres rapides
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickFilters.map((filter: any) => (
            <button
              key={filter.id}
              onClick={filter.apply}
              className="p-3 border rounded-lg hover:border-[#2563eb] hover:bg-[#2563eb]/5 transition-all text-left group"
              title={filter.description}
            >
              <div className="text-sm font-medium">{filter.name}</div>
              <div className="text-xs text-muted-foreground group-hover:text-[#2563eb] transition-colors">
                {filter.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Saved Presets */}
      {savedFilterPresets.length > 0 && (
        <div>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="w-full flex items-center justify-between text-sm font-medium mb-3 hover:text-[#2563eb] transition-colors"
          >
            <span className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Mes filtres enregistrés ({savedFilterPresets.length})
            </span>
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                showPresets ? "rotate-90" : ""
              }`}
            />
          </button>
          {showPresets && (
            <div className="space-y-2">
              {savedFilterPresets.map((preset: any) => (
                <div
                  key={preset.id}
                  className="flex items-center gap-2 p-2 border rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <button
                    onClick={() => onLoadPreset(preset)}
                    className="flex-1 text-left text-sm font-medium"
                  >
                    {preset.name}
                  </button>
                  <button
                    onClick={() => onDeletePreset(preset.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all"
                    title="Supprimer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
  const promotionInfo = useMemo(
    () => computePromotionPrice(product.price, product.promotion),
    [product.price, product.promotion]
  );
  const primaryMedia =
    product.media && product.media.length > 0
      ? product.media.find((m: ProductMediaItem) => m.isPrimary) || product.media[0]
      : null;
  const imageUrl = primaryMedia?.url || product.image;

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

        <div className="relative h-24 w-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
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
              {promotionInfo ? (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-emerald-600">
                    Promotion
                  </div>
                  <div className="flex items-baseline gap-2 justify-end">
                    <div className="text-2xl font-bold text-emerald-600">
                      {promotionInfo.discountedPrice.toFixed(2)}€
                    </div>
                    <div className="text-sm line-through text-gray-400">
                      {product.price.toFixed(2)}€
                    </div>
                  </div>
                  <div className="text-xs text-emerald-600">
                    ~{Math.round(promotionInfo.savingsPercentage)}% de réduction /{product.unit}
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-[#2563eb]">
                  {product.price}€<span className="text-sm font-normal">/{product.unit}</span>
                </div>
              )}
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
      className={`group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] hover:border-[#2563eb] transition-all duration-300 cursor-pointer ${
        product.archived ? "opacity-60" : ""
      } ${isSelected ? "ring-2 ring-[#2563eb] shadow-lg" : ""}`}
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

      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden group-hover:shadow-inner">
        <img
          src={imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? "scale-110 brightness-105" : "scale-100"
          }`}
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.src = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=400&fit=crop';
          }}
        />
        
        {/* Gradient Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>

        {/* Modern Top Badges with Glassmorphism */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {getStockBadge()}
          {product.fastDelivery && !product.archived && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-[#2563eb] to-blue-600 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
              <Truck className="h-3.5 w-3.5" />
              Livré demain
            </span>
          )}
          {product.isNew && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm animate-pulse">
              Nouveau
            </span>
          )}
        </div>

        {/* Modern Labels with Enhanced Styling */}
        {product.labels.length > 0 && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            {product.labels.slice(0, 2).map((label) => (
              <span
                key={label}
                className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm"
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

        {/* Modern Hover Actions with Glassmorphism */}
        {!isAdminMode && isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent backdrop-blur-[2px] flex items-center justify-center gap-3 transition-all duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="px-6 py-3 bg-white/95 backdrop-blur-md text-[#2563eb] rounded-full font-semibold hover:bg-white transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Voir détails
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              className="p-3 bg-[#2563eb] text-white rounded-full hover:bg-[#1d4ed8] transition-all duration-300 shadow-xl hover:scale-110"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Modern Favorite Button */}
        {!isAdminMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="absolute top-4 left-4 p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full hover:scale-110 transition-all duration-300 shadow-lg z-10 border border-white/20"
          >
            <Heart
              className={`h-5 w-5 transition-all ${
                isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-gray-600 dark:text-gray-400"
              }`}
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

      {/* Modern Product Content */}
      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-[#2563eb] transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {product.seller.name}
          </p>
        </div>

        {/* Rating and Distance */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 font-bold text-gray-900 dark:text-white">{product.rating}</span>
            <span className="text-gray-500 dark:text-gray-400">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 font-medium">
            <MapPin className="h-4 w-4" />
            <span className="text-xs">{product.seller.distance}km</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            {promotionInfo ? (
              <>
                <div className="text-xs font-semibold text-emerald-600 mb-1">
                  Promotion
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-emerald-600">
                    {promotionInfo.discountedPrice.toFixed(2)}€
                  </div>
                  <div className="text-sm line-through text-gray-400 dark:text-gray-500">
                    {product.price.toFixed(2)}€
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-600">
                  Économie ~{Math.round(promotionInfo.savingsPercentage)}%
                </span>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  /{product.unit}
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#2563eb] to-blue-600 bg-clip-text text-transparent">
                  {product.price}€
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/{product.unit}</span>
              </>
            )}
          </div>
          {!isAdminMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              className="p-3 bg-gradient-to-r from-[#2563eb] to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300"
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

export function ProductDetailPanel({ product, onClose, onAddToCart, isFavorite, onToggleFavorite, isAdminMode, onUpdate, onCreateAlert }: any) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const promotionInfo = useMemo(
    () => computePromotionPrice(product.price, product.promotion),
    [product.price, product.promotion]
  );
  const primaryMedia =
    product.media && product.media.length > 0
      ? product.media.find((m: ProductMediaItem) => m.isPrimary) || product.media[0]
      : null;
  
  const [adminFields, setAdminFields] = useState({
    category: product.category,
    visible: product.visible !== false,
    sku: product.sku || "",
  });
  const [adminErrors, setAdminErrors] = useState<Record<string, string>>({});
  const [adminVariants, setAdminVariants] = useState<
    Array<{ id: string; name: string; price: number; unit: string }>
  >(
    (product.variants || []).map((variant, index) => ({
      id: `VAR-EDIT-${product.id}-${index}`,
      name: variant.name,
      price: variant.price,
      unit: variant.unit,
    }))
  );
  const [adminMedia, setAdminMedia] = useState<ProductMediaItem[]>(product.media || []);
  const [draggedMediaIndex, setDraggedMediaIndex] = useState<number | null>(null);
  const initialPromotion = product.promotion || {
    type: "percentage" as ProductPromotion["type"],
    value: 0,
    startsAt: "",
    endsAt: "",
  };
  const [promotionEnabled, setPromotionEnabled] = useState(
    !!product.promotion && !!product.promotion.value
  );
  const [adminPromotion, setAdminPromotion] = useState<{
    type: ProductPromotion["type"];
    value: number;
    startsAt: string;
    endsAt: string;
  }>({
    type: initialPromotion.type,
    value: initialPromotion.value,
    startsAt: initialPromotion.startsAt || "",
    endsAt: initialPromotion.endsAt || "",
  });

  const tabs = [
    { id: "details", label: "Détails", icon: Package },
    { id: "reviews", label: "Avis", icon: MessageCircle },
    ...(isAdminMode ? [{ id: "admin", label: "Administration", icon: SettingsIcon }] : []),
  ];

  const handleAdminSave = () => {
    const nextErrors: Record<string, string> = {};
    if (!adminFields.category) nextErrors.category = "Catégorie obligatoire";
    if (!adminFields.sku.trim()) nextErrors.sku = "SKU obligatoire";
    if (promotionEnabled && (!adminPromotion.value || adminPromotion.value <= 0)) {
      nextErrors.promotion = "Valeur de promotion invalide";
    }
    setAdminErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }

    let promotionPayload: ProductPromotion | undefined;
    if (promotionEnabled && adminPromotion.value > 0) {
      promotionPayload = {
        type: adminPromotion.type,
        value: adminPromotion.value,
        startsAt: adminPromotion.startsAt || undefined,
        endsAt: adminPromotion.endsAt || undefined,
      };
    }

    const variantsPayload =
      adminVariants.length > 0
        ? adminVariants.map((variant) => ({
            name: variant.name,
            price: variant.price,
            unit: variant.unit,
          }))
        : undefined;

    const mediaPayload = adminMedia.length > 0 ? adminMedia : undefined;

    onUpdate({
      category: adminFields.category,
      visible: adminFields.visible,
      sku: adminFields.sku,
      variants: variantsPayload,
      media: mediaPayload,
      promotion: promotionPayload,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-end"
      data-testid="product-detail-panel"
    >
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
                    data-testid={`product-tab-${tab.id}`}
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
              <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={primaryMedia?.url || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
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
              {product.media && product.media.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {product.media.map((item: ProductMediaItem) => (
                    <img
                      key={item.id}
                      src={item.url}
                      alt={item.alt || product.name}
                      className={`h-16 w-16 rounded-lg object-cover border ${
                        primaryMedia && primaryMedia.id === item.id
                          ? "border-[#2563eb]"
                          : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              )}

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
                    {promotionInfo ? (
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold">
                          <Sparkles className="h-3 w-3" />
                          Promotion active
                        </div>
                        <div className="flex items-baseline gap-2 justify-end">
                          <div className="text-4xl font-bold text-emerald-600">
                            {promotionInfo.discountedPrice.toFixed(2)}€
                          </div>
                          <div className="text-lg line-through text-gray-400">
                            {product.price.toFixed(2)}€
                          </div>
                        </div>
                        <div className="text-sm text-emerald-600">
                          ~{Math.round(promotionInfo.savingsPercentage)}% de réduction /{product.unit}
                        </div>
                        {product.promotion && (product.promotion.startsAt || product.promotion.endsAt) && (
                          <div className="text-xs text-muted-foreground">
                            {product.promotion.startsAt && (
                              <span>
                                Dès le{" "}
                                {new Date(product.promotion.startsAt).toLocaleDateString()}
                              </span>
                            )}
                            {product.promotion.startsAt && product.promotion.endsAt && " • "}
                            {product.promotion.endsAt && (
                              <span>
                                Jusqu&apos;au{" "}
                                {new Date(product.promotion.endsAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-[#2563eb]">
                        {product.price}€
                        <span className="text-lg font-normal text-muted-foreground">
                          /{product.unit}
                        </span>
                      </div>
                    )}
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
                  <>
                    <button
                      onClick={() => {
                        onAddToCart();
                      }}
                      className="w-full px-6 py-4 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      Ajouter au panier - {((promotionInfo?.discountedPrice ?? product.price) * quantity).toFixed(2)}€
                    </button>

                    {/* Price Alert Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <button
                        onClick={() => onCreateAlert("price_drop")}
                        className="px-4 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Alerter baisse prix
                      </button>
                      {product.stock === "out-of-stock" ? (
                        <button
                          onClick={() => onCreateAlert("back_in_stock")}
                          className="px-4 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <Package className="h-4 w-4" />
                          Alerter retour stock
                        </button>
                      ) : (
                        <button
                          onClick={() => onCreateAlert("price_target")}
                          className="px-4 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <TrendingUp className="h-4 w-4" />
                          Définir prix cible
                        </button>
                      )}
                    </div>
                  </>
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
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Paramètres administrateur</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Catégorie principale *
                      </label>
                      <select
                        value={adminFields.category}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAdminFields({ ...adminFields, category: value });
                          setAdminErrors((prev) => {
                            const next = { ...prev };
                            if (!value) {
                              next.category = "Catégorie obligatoire";
                            } else {
                              delete next.category;
                            }
                            return next;
                          });
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                        data-testid="admin-category-select"
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Légumes">Légumes</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Produits Laitiers">Produits Laitiers</option>
                        <option value="Viandes">Viandes</option>
                        <option value="Œufs">Œufs</option>
                        <option value="Autres">Autres</option>
                      </select>
                      {adminErrors.category && (
                        <p className="mt-1 text-xs text-red-600">{adminErrors.category}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        SKU / Référence *
                      </label>
                      <input
                        type="text"
                        value={adminFields.sku}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAdminFields({ ...adminFields, sku: value });
                          setAdminErrors((prev) => {
                            const next = { ...prev };
                            if (!value.trim()) {
                              next.sku = "SKU obligatoire";
                            } else {
                              delete next.sku;
                            }
                            return next;
                          });
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                        placeholder="Ex: PROD-001"
                        data-testid="admin-sku-input"
                      />
                      {adminErrors.sku && (
                        <p className="mt-1 text-xs text-red-600">{adminErrors.sku}</p>
                      )}
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
                          data-testid="admin-visible-toggle"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2563eb]/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2563eb]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Variantes du produit</span>
                    <button
                      type="button"
                      onClick={() =>
                        setAdminVariants([
                          ...adminVariants,
                          {
                            id: `VAR-EDIT-${product.id}-${adminVariants.length}`,
                            name: "",
                            price: product.price,
                            unit: product.unit,
                          },
                        ])
                      }
                      className="px-3 py-1 text-xs rounded-lg border hover:bg-muted"
                      data-testid="admin-add-variant"
                    >
                      Ajouter une variante
                    </button>
                  </div>
                  {adminVariants.length > 0 && (
                    <div className="space-y-2">
                      {adminVariants.map((variant, index) => (
                        <div
                          key={variant.id}
                          className="grid grid-cols-3 gap-2 items-center rounded-lg border bg-muted/40 px-3 py-2"
                        >
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => {
                              const value = e.target.value;
                              setAdminVariants(
                                adminVariants.map((v, i) =>
                                  i === index ? { ...v, name: value } : v
                                )
                              );
                            }}
                            placeholder="Nom"
                            className="px-3 py-2 border rounded-lg text-sm bg-background"
                            data-testid={`admin-variant-name-${index}`}
                          />
                          <input
                            type="number"
                            value={variant.price}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              setAdminVariants(
                                adminVariants.map((v, i) =>
                                  i === index ? { ...v, price: value } : v
                                )
                              );
                            }}
                            placeholder="Prix"
                            className="px-3 py-2 border rounded-lg text-sm bg-background"
                            data-testid={`admin-variant-price-${index}`}
                          />
                          <div className="flex items-center gap-2">
                            <select
                              value={variant.unit}
                              onChange={(e) =>
                                setAdminVariants(
                                  adminVariants.map((v, i) =>
                                    i === index ? { ...v, unit: e.target.value } : v
                                  )
                                )
                              }
                              className="px-3 py-2 border rounded-lg text-sm flex-1 bg-background"
                              data-testid={`admin-variant-unit-${index}`}
                            >
                              <option value="kg">kg</option>
                              <option value="pièce">pièce</option>
                              <option value="litre">litre</option>
                              <option value="barquette">barquette</option>
                              <option value="boîte">boîte</option>
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                setAdminVariants(
                                  adminVariants.filter((_, i) => i !== index)
                                )
                              }
                              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                              data-testid={`admin-variant-remove-${index}`}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Médias du produit</span>
                    <span className="text-xs text-muted-foreground">
                      Glisser-déposer pour réordonner
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => {
                      const files = event.target.files;
                      if (!files) return;
                      const added: ProductMediaItem[] = [];
                      Array.from(files).forEach((file) => {
                        const url = getCachedMediaUrl(file);
                        added.push({
                          id: `${file.name}-${file.size}-${file.lastModified}`,
                          url,
                          type: "image",
                          alt: product.name || file.name,
                        });
                      });
                      setAdminMedia((prev) => {
                        const next = [...prev, ...added];
                        if (next.length > 0 && !next.some((m) => m.isPrimary)) {
                          next[0] = { ...next[0], isPrimary: true };
                        }
                        return next;
                      });
                    }}
                    className="w-full text-sm"
                    data-testid="admin-media-input"
                  />
                  {adminMedia.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {adminMedia.map((item, index) => (
                        <div
                          key={item.id}
                          className="relative flex flex-col items-center gap-1 cursor-move"
                          draggable
                          onDragStart={() => setDraggedMediaIndex(index)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={() => {
                            if (draggedMediaIndex === null || draggedMediaIndex === index) {
                              return;
                            }
                            setAdminMedia((prev) => {
                              const copy = [...prev];
                              const [moved] = copy.splice(draggedMediaIndex, 1);
                              copy.splice(index, 0, moved);
                              return copy;
                            });
                            setDraggedMediaIndex(null);
                          }}
                          data-testid="admin-media-thumb"
                          data-media-id={item.id}
                        >
                          <img
                            src={item.url}
                            alt={item.alt}
                            className={`h-16 w-16 rounded-lg object-cover border shadow-sm ${
                              item.isPrimary ? "border-[#2563eb]" : "border-transparent"
                            }`}
                          />
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setAdminMedia(
                                  adminMedia.map((m) => ({
                                    ...m,
                                    isPrimary: m.id === item.id,
                                  }))
                                )
                              }
                              className="px-2 py-0.5 text-[10px] rounded-full border text-xs bg-background"
                            >
                              Principal
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const copy = [...adminMedia];
                                copy.splice(index, 1);
                                setAdminMedia(copy);
                              }}
                              className="px-2 py-0.5 text-[10px] text-red-600 hover:bg-red-50 rounded-full"
                            >
                              Retirer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Promotion</span>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={promotionEnabled}
                        onChange={(e) => setPromotionEnabled(e.target.checked)}
                        className="rounded border-gray-300"
                        data-testid="admin-promo-toggle"
                      />
                      Activer
                    </label>
                  </div>
                  {promotionEnabled && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <select
                          value={adminPromotion.type}
                          onChange={(e) =>
                            setAdminPromotion({
                              ...adminPromotion,
                              type: e.target.value as ProductPromotion["type"],
                            })
                          }
                          className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                          data-testid="admin-promo-type"
                        >
                          <option value="percentage">Réduction en %</option>
                          <option value="fixed">Montant fixe</option>
                        </select>
                        <input
                          type="number"
                          value={adminPromotion.value}
                          onChange={(e) =>
                            setAdminPromotion({
                              ...adminPromotion,
                              value: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="Valeur"
                          className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                          data-testid="admin-promo-value"
                        />
                        {adminErrors.promotion && (
                          <p className="mt-1 text-xs text-red-600">
                            {adminErrors.promotion}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="date"
                          value={adminPromotion.startsAt}
                          onChange={(e) =>
                            setAdminPromotion({
                              ...adminPromotion,
                              startsAt: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                          data-testid="admin-promo-start"
                        />
                        <input
                          type="date"
                          value={adminPromotion.endsAt}
                          onChange={(e) =>
                            setAdminPromotion({
                              ...adminPromotion,
                              endsAt: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                          data-testid="admin-promo-end"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Historique des modifications
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.history && product.history.length > 0
                        ? `${product.history.length} événement(s)`
                        : "Aucune modification enregistrée"}
                    </span>
                  </div>
                  <div
                    className="max-h-40 border rounded-lg overflow-y-auto bg-muted/40"
                    data-testid="admin-history-list"
                  >
                    {product.history && product.history.length > 0 ? (
                      product.history
                        .slice()
                        .reverse()
                        .map((entry: ProductHistoryEntry) => (
                          <div
                            key={entry.id}
                            className="px-3 py-2 border-b last:border-b-0 text-xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{entry.author}</span>
                              <span className="text-muted-foreground">
                                {new Date(entry.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <ul className="space-y-0.5 text-muted-foreground">
                              {entry.changes.map((change, index) => (
                                <li key={index}>
                                  <span className="font-semibold">{change.field}:</span>{" "}
                                  <span className="line-through opacity-70">
                                    {String(change.from)}
                                  </span>{" "}
                                  → <span>{String(change.to)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))
                    ) : (
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        Aucun changement historique pour ce produit.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleAdminSave}
                className="w-full px-6 py-4 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                data-testid="admin-save"
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

const mediaUrlCache = new Map<string, string>();

function getMediaCacheKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function getCachedMediaUrl(file: File) {
  const key = getMediaCacheKey(file);
  const existing = mediaUrlCache.get(key);
  if (existing) return existing;
  const url = URL.createObjectURL(file);
  mediaUrlCache.set(key, url);
  return url;
}

function AddProductModal({ onClose, onSave, categories }: any) {
  const [step, setStep] = useState(1);
  const [productType, setProductType] = useState<"simple" | "advanced" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=400&fit=crop",
    description: "",
    labels: [] as string[],
    sku: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [variants, setVariants] = useState<Array<{ id: string; name: string; price: number; unit: string }>>([]);
  const [media, setMedia] = useState<ProductMediaItem[]>([]);
  const [promotionEnabled, setPromotionEnabled] = useState(false);
  const [promotion, setPromotion] = useState<{
    type: ProductPromotion["type"];
    value: number;
    startsAt: string;
    endsAt: string;
  }>({
    type: "percentage",
    value: 0,
    startsAt: "",
    endsAt: "",
  });

  const imageOptions = [
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop", // Tomatoes
    "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=400&fit=crop", // Lettuce
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop", // Apples
    "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=400&fit=crop", // Cheese
    "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop", // Meat
    "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=400&fit=crop", // Eggs
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=400&fit=crop", // Package/Generic
  ];

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = "Nom obligatoire";
    if (!formData.category) nextErrors.category = "Catégorie obligatoire";
    if (!formData.sku.trim()) nextErrors.sku = "SKU obligatoire";
    if (!formData.price || formData.price <= 0) nextErrors.price = "Prix invalide";
    if (promotionEnabled) {
      if (!promotion.value || promotion.value <= 0) nextErrors.promotion = "Valeur de promotion invalide";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }
    let promotionPayload: ProductPromotion | undefined;
    if (promotionEnabled) {
      promotionPayload = {
        type: promotion.type,
        value: promotion.value,
        startsAt: promotion.startsAt || undefined,
        endsAt: promotion.endsAt || undefined,
      };
    }
    const payload: Partial<Product> = {
      ...formData,
      variants: variants.map((v) => ({
        name: v.name,
        price: v.price,
        unit: v.unit,
      })),
      media,
      promotion: promotionPayload,
    };
    onSave(payload);
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
                    setStep(2);
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

          {step === 2 && productType && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom du produit *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, name: value });
                    setErrors((prev) => {
                      const next = { ...prev };
                      if (!value.trim()) {
                        next.name = "Nom obligatoire";
                      } else {
                        delete next.name;
                      }
                      return next;
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  placeholder="Ex: Tomates Bio"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, category: value });
                      setErrors((prev) => {
                        const next = { ...prev };
                        if (!value) {
                          next.category = "Catégorie obligatoire";
                        } else {
                          delete next.category;
                        }
                        return next;
                      });
                    }}
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
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, price: value });
                      setErrors((prev) => {
                        const next = { ...prev };
                        if (!value || value <= 0) {
                          next.price = "Prix invalide";
                        } else {
                          delete next.price;
                        }
                        return next;
                      });
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    placeholder="4.50"
                    step="0.1"
                  />
                  {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
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
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {imageOptions.map((imageUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFormData({ ...formData, image: imageUrl })}
                      className={`p-2 border-2 rounded-lg hover:border-[#2563eb] transition-colors ${
                        formData.image === imageUrl ? "border-[#2563eb] bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      <img src={imageUrl} alt="Option" className="w-full h-16 object-cover rounded" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Ou entrez une URL d'image personnalisée"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
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

              <div>
                <label className="block text-sm font-medium mb-2">SKU / Référence *</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, sku: value });
                    setErrors((prev) => {
                      const next = { ...prev };
                      if (!value.trim()) {
                        next.sku = "SKU obligatoire";
                      } else {
                        delete next.sku;
                      }
                      return next;
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  placeholder="Ex: PROD-001"
                />
                {errors.sku && <p className="mt-1 text-xs text-red-600">{errors.sku}</p>}
              </div>

              {productType === "advanced" && (
                <div className="space-y-6 pt-2 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Variantes</span>
                      <button
                        type="button"
                        onClick={() =>
                          setVariants([
                            ...variants,
                            { id: `VAR-${Date.now()}-${variants.length}`, name: "", price: formData.price, unit: formData.unit },
                          ])
                        }
                        className="px-3 py-1 text-xs rounded-lg border hover:bg-muted"
                      >
                        Ajouter une variante
                      </button>
                    </div>
                    {variants.length > 0 && (
                      <div className="space-y-2">
                        {variants.map((variant, index) => (
                          <div key={variant.id} className="grid grid-cols-3 gap-2 items-center">
                            <input
                              type="text"
                              value={variant.name}
                              onChange={(e) => {
                                const value = e.target.value;
                                setVariants(
                                  variants.map((v, i) =>
                                    i === index ? { ...v, name: value } : v
                                  )
                                );
                              }}
                              placeholder="Nom"
                              className="px-3 py-2 border rounded-lg text-sm"
                            />
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setVariants(
                                  variants.map((v, i) =>
                                    i === index ? { ...v, price: value } : v
                                  )
                                );
                              }}
                              placeholder="Prix"
                              className="px-3 py-2 border rounded-lg text-sm"
                            />
                            <div className="flex items-center gap-2">
                              <select
                                value={variant.unit}
                                onChange={(e) =>
                                  setVariants(
                                    variants.map((v, i) =>
                                      i === index ? { ...v, unit: e.target.value } : v
                                    )
                                  )
                                }
                                className="px-3 py-2 border rounded-lg text-sm flex-1"
                              >
                                <option value="kg">kg</option>
                                <option value="pièce">pièce</option>
                                <option value="litre">litre</option>
                                <option value="barquette">barquette</option>
                                <option value="boîte">boîte</option>
                              </select>
                              <button
                                type="button"
                                onClick={() =>
                                  setVariants(variants.filter((_, i) => i !== index))
                                }
                                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <span className="text-sm font-medium">Médias du produit</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => {
                        const files = event.target.files;
                        if (!files) return;
                        const added: ProductMediaItem[] = [];
                        Array.from(files).forEach((file) => {
                          const url = getCachedMediaUrl(file);
                          added.push({
                            id: `${file.name}-${file.size}-${file.lastModified}`,
                            url,
                            type: "image",
                            alt: formData.name || file.name,
                          });
                        });
                        setMedia((prev) => {
                          const next = [...prev, ...added];
                          if (next.length > 0 && !next.some((m) => m.isPrimary)) {
                            next[0] = { ...next[0], isPrimary: true };
                          }
                          return next;
                        });
                      }}
                      className="w-full text-sm"
                    />
                    {media.length > 0 && (
                      <div className="flex gap-3 overflow-x-auto pb-1">
                        {media.map((item, index) => (
                          <div key={item.id} className="relative flex flex-col items-center gap-1">
                            <img
                              src={item.url}
                              alt={item.alt}
                              className={`h-16 w-16 rounded-lg object-cover border ${
                                item.isPrimary ? "border-[#2563eb]" : "border-transparent"
                              }`}
                            />
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setMedia(
                                    media.map((m) => ({
                                      ...m,
                                      isPrimary: m.id === item.id,
                                    }))
                                  )
                                }
                                className="px-2 py-0.5 text-[10px] rounded-full border text-xs"
                              >
                                Principal
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...media];
                                  copy.splice(index, 1);
                                  setMedia(copy);
                                }}
                                className="px-2 py-0.5 text-[10px] text-red-600 hover:bg-red-50 rounded-full"
                              >
                                Retirer
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Promotion</span>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={promotionEnabled}
                          onChange={(e) => setPromotionEnabled(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        Activer
                      </label>
                    </div>
                    {promotionEnabled && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <select
                            value={promotion.type}
                            onChange={(e) =>
                              setPromotion({ ...promotion, type: e.target.value as ProductPromotion["type"] })
                            }
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          >
                            <option value="percentage">Réduction en %</option>
                            <option value="fixed">Montant fixe</option>
                          </select>
                          <input
                            type="number"
                            value={promotion.value}
                            onChange={(e) =>
                              setPromotion({
                                ...promotion,
                                value: parseFloat(e.target.value) || 0,
                              })
                            }
                            placeholder="Valeur"
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                          {errors.promotion && (
                            <p className="mt-1 text-xs text-red-600">{errors.promotion}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <input
                            type="date"
                            value={promotion.startsAt}
                            onChange={(e) =>
                              setPromotion({ ...promotion, startsAt: e.target.value })
                            }
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                          <input
                            type="date"
                            value={promotion.endsAt}
                            onChange={(e) =>
                              setPromotion({ ...promotion, endsAt: e.target.value })
                            }
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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

// Product Comparison Modal
function ProductComparisonModal({ products, onClose, onRemoveProduct, onAddToCart }: {
  products: Product[];
  onClose: () => void;
  onRemoveProduct: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-[#2563eb] to-blue-600 text-white">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ArrowUpDown className="h-6 w-6" />
              Comparaison de produits
            </h2>
            <p className="text-sm opacity-90 mt-1">
              {products.length} produit{products.length > 1 ? 's' : ''} sélectionné{products.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-4 bg-muted/50 font-semibold sticky left-0 z-10">
                  Caractéristiques
                </th>
                {products.map((product) => (
                  <th key={product.id} className="p-4 text-center min-w-[250px]">
                    <div className="space-y-3">
                      <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-bold text-lg">{product.name}</div>
                      <div className="flex items-center justify-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-muted-foreground text-sm">({product.reviewCount})</span>
                      </div>
                      <button
                        onClick={() => onRemoveProduct(product.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Retirer
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Prix */}
              <tr className="border-b hover:bg-muted/30">
                <td className="p-4 font-medium bg-muted/50 sticky left-0 z-10">Prix</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    <div className="text-2xl font-bold text-[#2563eb]">
                      {product.price.toFixed(2)}€
                    </div>
                    <div className="text-sm text-muted-foreground">{product.unit}</div>
                  </td>
                ))}
              </tr>

              {/* Vendeur */}
              <tr className="border-b hover:bg-muted/30">
                <td className="p-4 font-medium bg-muted/50 sticky left-0 z-10">Vendeur</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    <div className="font-medium">{product.seller.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {product.seller.location}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      À {product.seller.distance} km
                    </div>
                  </td>
                ))}
              </tr>

              {/* Catégorie */}
              <tr className="border-b hover:bg-muted/30">
                <td className="p-4 font-medium bg-muted/50 sticky left-0 z-10">Catégorie</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                      {product.category}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Disponibilité */}
              <tr className="border-b hover:bg-muted/30">
                <td className="p-4 font-medium bg-muted/50 sticky left-0 z-10">Disponibilité</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      product.stock === 'in-stock' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      product.stock === 'limited' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                      product.stock === 'pre-order' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {product.stock === 'in-stock' ? 'En stock' :
                       product.stock === 'limited' ? 'Stock limité' :
                       product.stock === 'pre-order' ? 'Pré-commande' :
                       'Rupture'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Labels */}
              <tr className="border-b hover:bg-muted/30">
                <td className="p-4 font-medium bg-muted/50 sticky left-0 z-10">Labels</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {product.labels.map((label, idx) => (
                        <span key={idx} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded text-xs">
                          {label}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Livraison rapide */}
              <tr className="border-b hover:bg-muted/30">
                <td className="p-4 font-medium bg-muted/50 sticky left-0 z-10">Livraison rapide</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    {product.fastDelivery ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Check className="h-5 w-5" />
                        <span className="font-medium">Oui</span>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Standard</div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Description */}
              <tr className="border-b hover:bg-muted/30">
                <td className="p-4 font-medium bg-muted/50 sticky left-0 z-10">Description</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4">
                    <div className="text-sm text-muted-foreground text-left">
                      {product.description}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Spécifications */}
              {Object.keys(products[0]?.specifications || {}).length > 0 && (
                <tr className="border-b">
                  <td colSpan={products.length + 1} className="p-4 bg-muted/20">
                    <div className="font-semibold text-lg mb-3">Spécifications techniques</div>
                    <div className="space-y-2">
                      {Object.keys(products[0].specifications).map((specKey) => (
                        <div key={specKey} className="grid" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
                          <div className="p-2 font-medium bg-muted/50">{specKey}</div>
                          {products.map((product) => (
                            <div key={product.id} className="p-2 text-center">
                              {product.specifications[specKey] || '-'}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Actions */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <div className="grid gap-3" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
            <div className="p-2 font-semibold">Actions</div>
            {products.map((product) => (
              <div key={product.id} className="p-2">
                <button
                  onClick={() => {
                    onAddToCart(product.id);
                    toast.success(`${product.name} ajouté au panier`);
                  }}
                  className="w-full px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Initial data
const initialCategories: Category[] = [
  { id: "CAT-001", name: "Légumes", icon: "Leaf" },
  { id: "CAT-002", name: "Fruits", icon: "Apple" },
  { id: "CAT-003", name: "Produits Laitiers", icon: "Milk" },
  { id: "CAT-004", name: "Viandes", icon: "Beef" },
  { id: "CAT-005", name: "Œufs", icon: "Egg" },
  { id: "CAT-006", name: "Autres", icon: "PackageBox" },
];

const initialProducts: Product[] = [
  {
    id: "PROD-001",
    name: "Tomates Bio",
    category: "Légumes",
    subcategory: "Tomates",
    price: 4.5,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1464226066583-1bc946947204?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784f3c?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
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
