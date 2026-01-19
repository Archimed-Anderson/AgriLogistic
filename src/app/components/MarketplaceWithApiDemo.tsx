// Marketplace with Real API Integration Demo
// This demonstrates how to connect the frontend to the Product Service API

import { useState, useEffect } from "react";
import { Search, ShoppingCart, Star, Filter } from "lucide-react";
import { productServiceApi, type Product } from "@shared/services/product-service-api";
import { toast } from "sonner";

export function MarketplaceWithApiDemo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "name" | "rating" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productServiceApi.getProducts({
        limit: 20,
        sortBy,
        sortOrder,
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchQuery && { q: searchQuery })
      });
      
      if (response.success) {
        setProducts(response.data.products);
        toast.success(`Loaded ${response.data.products.length} products`);
      } else {
        setError(response.error || "Failed to load products");
        toast.error(response.error || "Failed to load products");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  const handleSortChange = (field: typeof sortBy) => {
    setSortBy(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products from API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-gray-600 mt-1">
                {products.length} products from real API • Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Céréales">Céréales</option>
                <option value="Légumes">Légumes</option>
                <option value="Fruits">Fruits</option>
                <option value="Produits laitiers">Produits laitiers</option>
                <option value="Fourrage">Fourrage</option>
                <option value="Œufs">Œufs</option>
                <option value="Produits transformés">Produits transformés</option>
                <option value="Semences">Semences</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="createdAt">Date</option>
              </select>
              <span className="text-sm text-gray-500">
                ({sortOrder === "asc" ? "↑" : "↓"})
              </span>
            </div>

            <button
              onClick={loadProducts}
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">API Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {products.length === 0 && !loading ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="h-48 bg-gray-200 relative">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/400x300?text=Product+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 4h7c.55 0 1 .45 1 1s-.45 1-1 1H6v10c0 .55-.45 1-1 1s-1-.45-1-1V6c0-.55.45-1 1-1zm12 0c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1H9c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1h3zm-4 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                      </svg>
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                  
                  {/* Organic Badge */}
                  {product.organic && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Bio
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{product.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.shortDescription || product.description.substring(0, 100) + '...'}
                  </p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">{product.category}</span>
                    <span className="text-xs text-gray-500">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        €{product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          €{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
                    </div>
                    
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors">
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag} 
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Connected to Product Service API via Kong Gateway</p>
            <p className="mt-1">
              Status: {loading ? 'Loading...' : error ? 'Error' : 'Connected'} • 
              Products: {products.length} • 
              Last refresh: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
