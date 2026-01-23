// Product Service API Adapter
// This connects the frontend to the backend microservices via Kong Gateway

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000/api/v1'; // Kong Gateway
// const API_BASE_URL = 'http://localhost:3002'; // Direct to Product Service (fallback)

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  sku: string;
  images: string[];
  tags: string[];
  specifications: Record<string, string>;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  status: string;
  featured: boolean;
  organic: boolean;
  certifications: string[];
  origin?: string;
  harvestDate?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  icon: string;
  displayOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface ProductListResponse {
  products: Product[];
  total: number;
  pages: number;
  page?: number;
  limit?: number;
  facets?: any;
}

interface SearchParams {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  organic?: boolean;
  featured?: boolean;
  tags?: string[];
  sellerId?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'name' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

class ProductServiceApi {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Fetch all products with optional filters
  async getProducts(params: SearchParams = {}): Promise<ApiResponse<ProductListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const url = `${this.baseUrl}/products?${queryParams.toString()}`;
      console.log('Fetching products from:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: { products: [], total: 0, pages: 0 }
      };
    }
  }

  // Search products with Elasticsearch
  async searchProducts(query: string, params: Omit<SearchParams, 'q'> = {}): Promise<ApiResponse<ProductListResponse>> {
    try {
      const searchParams: SearchParams = { ...params, q: query };
      return await this.getProducts(searchParams);
    } catch (error) {
      console.error('Error searching products:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
        data: { products: [], total: 0, pages: 0 }
      };
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Product not found',
        data: {} as Product
      };
    }
  }

  // Get product by slug
  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/slug/${slug}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching product slug ${slug}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Product not found',
        data: {} as Product
      };
    }
  }

  // Get categories
  async getCategories(): Promise<ApiResponse<{ categories: Category[] }>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/categories/list`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load categories',
        data: { categories: [] }
      };
    }
  }

  // Get autocomplete suggestions
  async getAutocomplete(query: string, category?: string): Promise<ApiResponse<{ suggestions: string[] }>> {
    try {
      const params = new URLSearchParams({ q: query });
      if (category) params.append('category', category);
      
      const response = await fetch(`${this.baseUrl}/products/autocomplete?${params.toString()}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting autocomplete:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Autocomplete failed',
        data: { suggestions: [] }
      };
    }
  }

  // Get similar products (More Like This)
  async getSimilarProducts(productId: string, limit: number = 5): Promise<ApiResponse<{ products: Product[] }>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}/similar?limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching similar products for ${productId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get similar products',
        data: { products: [] }
      };
    }
  }

  // Create a new product (admin only)
  async createProduct(productData: Partial<Product>): Promise<ApiResponse<{ product: Product }>> {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create product',
        data: { product: {} as Product }
      };
    }
  }

  // Update a product (admin only)
  async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<{ product: Product }>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update product',
        data: { product: {} as Product }
      };
    }
  }

  // Delete a product (soft delete, admin only)
  async deleteProduct(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete product',
        data: false
      };
    }
  }

  // Update product stock
  async updateStock(productId: string, quantity: number, transactionType: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity, transactionType }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating stock for product ${productId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update stock',
        data: undefined
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; service: string; timestamp: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Service unavailable',
        data: { status: 'unhealthy', service: 'product-service', timestamp: new Date().toISOString() }
      };
    }
  }
}

// Export singleton instance
export const productServiceApi = new ProductServiceApi();

// Export types
export type { Product, Category, ApiResponse, ProductListResponse, SearchParams };
