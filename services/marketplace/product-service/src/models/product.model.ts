export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  category: string;
  subCategory: string | null;
  price: number;
  originalPrice: number | null;
  unit: string;
  stock: number;
  lowStockThreshold: number;
  sku: string;
  images: string[];
  tags: string[];
  specifications: Record<string, any>;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  status: 'active' | 'inactive' | 'out_of_stock' | 'discontinued';
  featured: boolean;
  organic: boolean;
  certifications: string[];
  origin: string | null;
  harvestDate: Date | null;
  expiryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  lowStockThreshold?: number;
  sku: string;
  images?: string[];
  tags?: string[];
  specifications?: Record<string, any>;
  sellerId: string;
  sellerName: string;
  featured?: boolean;
  organic?: boolean;
  certifications?: string[];
  origin?: string;
  harvestDate?: Date;
  expiryDate?: Date;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  subCategory?: string;
  price?: number;
  originalPrice?: number;
  unit?: string;
  stock?: number;
  lowStockThreshold?: number;
  images?: string[];
  tags?: string[];
  specifications?: Record<string, any>;
  status?: 'active' | 'inactive' | 'out_of_stock' | 'discontinued';
  featured?: boolean;
  organic?: boolean;
  certifications?: string[];
  origin?: string;
  harvestDate?: Date;
  expiryDate?: Date;
}

export interface ProductSearchQuery {
  query?: string;
  category?: string;
  subCategory?: string;
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

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  icon: string | null;
  displayOrder: number;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}
