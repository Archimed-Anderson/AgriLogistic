import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  Heart,
  Grid3x3,
  List,
  MapPin,
  Truck,
  ArrowUpDown,
  X,
  TrendingUp,
  Clock,
  Package,
  Sparkles,
  Eye,
  Plus,
  Filter,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  ArrowLeftRight,
  Download,
  Share2,
  Bookmark,
  BarChart3,
  Settings,
  Edit,
  Trash2,
  Archive,
  Bell,
  Target,
  Zap,
  TrendingDown,
  DollarSign,
  Award,
  MessageSquare,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  XCircle,
} from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { products as initialProductsData } from '../data/mockData';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  description: string;
  specifications: Record<string, string>;
  stock: number;
  seller?: {
    name: string;
    location: string;
    rating: number;
    verified: boolean;
  };
  labels?: string[];
  fastDelivery?: boolean;
  trending?: boolean;
  discount?: number;
  newArrival?: boolean;
}

interface MarketplaceProps {
  onNavigate: (route: string, productId?: number) => void;
  adminMode?: boolean;
}

export function Marketplace({ onNavigate, adminMode = false }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  // Advanced Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock'>('all');
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);

  // Admin Features
  const [isAdminMode, setIsAdminMode] = useState(adminMode);
  const [selectedForBulk, setSelectedForBulk] = useState<number[]>([]);

  // Products state with extended data
  const [products] = useState<Product[]>(
    initialProductsData.map((p) => ({
      ...p,
      seller: {
        name: 'AgroLogistic Verified',
        location: p.specifications.origin || 'France',
        rating: 4.5 + Math.random() * 0.5,
        verified: true,
      },
      labels: [
        p.specifications.certification?.includes('Organic') ? 'Bio' : null,
        Math.random() > 0.5 ? 'Local' : null,
        Math.random() > 0.7 ? 'Fresh' : null,
      ].filter(Boolean) as string[],
      fastDelivery: Math.random() > 0.5,
      trending: Math.random() > 0.7,
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0,
      newArrival: Math.random() > 0.8,
    }))
  );

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('AgroLogistic-marketplace-favorites');
    if (saved) setFavorites(JSON.parse(saved));

    const savedWishlist = localStorage.getItem('AgroLogistic-marketplace-wishlist');
    if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));

    const savedCart = localStorage.getItem('AgroLogistic-marketplace-cart-count');
    if (savedCart) setCartCount(parseInt(savedCart, 10));
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('AgroLogistic-marketplace-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save wishlist
  useEffect(() => {
    localStorage.setItem('AgroLogistic-marketplace-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Save cart count
  useEffect(() => {
    localStorage.setItem('AgroLogistic-marketplace-cart-count', cartCount.toString());
  }, [cartCount]);

  const categories = [
    { id: 'all', name: 'All', icon: Package },
    { id: 'vegetables', name: 'Vegetables', icon: Sparkles },
    { id: 'grains', name: 'Grains', icon: Package },
    { id: 'fruits', name: 'Fruits', icon: Award },
    { id: 'dairy', name: 'Dairy', icon: ShoppingBag },
  ];

  const availableLabels = ['Bio', 'Local', 'Fresh', 'Premium', 'Organic'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.seller?.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        const matchesRating = product.rating >= minRating;
        const matchesLabels =
          selectedLabels.length === 0 ||
          selectedLabels.some((label) => product.labels?.includes(label));
        const matchesStock =
          stockFilter === 'all' ||
          (stockFilter === 'in-stock' && product.stock >= 100) ||
          (stockFilter === 'low-stock' && product.stock < 100);
        const matchesFastDelivery = !fastDeliveryOnly || product.fastDelivery;

        return (
          matchesCategory &&
          matchesSearch &&
          matchesPrice &&
          matchesRating &&
          matchesLabels &&
          matchesStock &&
          matchesFastDelivery
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'popular':
            return b.reviews - a.reviews;
          case 'newest':
            return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
          default:
            return 0;
        }
      });
  }, [
    products,
    selectedCategory,
    searchQuery,
    priceRange,
    minRating,
    selectedLabels,
    stockFilter,
    fastDeliveryOnly,
    sortBy,
  ]);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    toast.success(favorites.includes(productId) ? 'Removed from favorites' : 'Added to favorites');
  };

  const toggleCompare = (productId: number) => {
    if (compareList.includes(productId)) {
      setCompareList(compareList.filter((id) => id !== productId));
      toast.success('Removed from comparison');
    } else if (compareList.length < 4) {
      setCompareList([...compareList, productId]);
      toast.success('Added to comparison');
    } else {
      toast.error('Maximum 4 products for comparison');
    }
  };

  const toggleWishlist = (productId: number) => {
    setWishlistItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    toast.success(
      wishlistItems.includes(productId) ? 'Removed from wishlist' : 'Added to wishlist'
    );
  };

  const handleAddToCart = (productName: string, productId: number) => {
    setCartCount((prev) => prev + 1);
    toast.success(`${productName} added to cart!`);
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange([0, 100]);
    setMinRating(0);
    setSelectedLabels([]);
    setStockFilter('all');
    setFastDeliveryOnly(false);
    toast.success('Filters cleared');
  };

  const activeFiltersCount = [
    selectedCategory !== 'All' ? 1 : 0,
    priceRange[0] !== 0 || priceRange[1] !== 100 ? 1 : 0,
    minRating > 0 ? 1 : 0,
    selectedLabels.length,
    stockFilter !== 'all' ? 1 : 0,
    fastDeliveryOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Admin Mode Banner */}
      {isAdminMode && (
        <div className="bg-orange-100 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-orange-600" />
            <span className="font-semibold text-orange-900 dark:text-orange-100">
              Admin Mode Active
            </span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsAdminMode(false)}>
              Exit Admin Mode
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Agricultural Marketplace</h1>
              <p className="text-lg text-blue-100">
                Discover quality agricultural products at competitive prices
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompareModal(true)}
                className="relative p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeftRight className="h-6 w-6" />
                {compareList.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {compareList.length}
                  </span>
                )}
              </button>
              <button className="relative p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Heart
                  className={`h-6 w-6 ${favorites.length > 0 ? 'fill-red-400 text-red-400' : ''}`}
                />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
              <button className="relative p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4" />
                <span className="text-white/80 text-sm">Products</span>
              </div>
              <div className="text-2xl font-bold">{products.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-white/80 text-sm">Trending</span>
              </div>
              <div className="text-2xl font-bold">{products.filter((p) => p.trending).length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4" />
                <span className="text-white/80 text-sm">New Arrivals</span>
              </div>
              <div className="text-2xl font-bold">
                {products.filter((p) => p.newArrival).length}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4" />
                <span className="text-white/80 text-sm">Top Rated</span>
              </div>
              <div className="text-2xl font-bold">
                {products.filter((p) => p.rating >= 4.5).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        selectedCategory === category.name
                          ? 'bg-[#2563eb] text-white'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} products
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden transition-all hover:shadow-lg cursor-pointer"
              >
                <div
                  onClick={() => onNavigate('/market/product', product.id)}
                  className="relative aspect-square overflow-hidden bg-gray-100"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {product.stock < 100 && (
                    <Badge className="absolute top-2 right-2 bg-red-500">Low Stock</Badge>
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3
                      onClick={() => onNavigate('/market/product', product.id)}
                      className="font-semibold hover:text-[#2563eb] transition-colors"
                    >
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#2563eb]">${product.price}</span>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.name, product.id);
                      }}
                      className="bg-[#2563eb] hover:bg-[#1d4ed8]"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
