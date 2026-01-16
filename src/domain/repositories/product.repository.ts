import { Product } from '../entities/product.entity';
import { ProductCategory } from '../enums/product-category.enum';

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findByCategory(category: ProductCategory): Promise<Product[]>;
  findLowStock(): Promise<Product[]>;
  save(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(filters?: {
    category?: ProductCategory;
    minStock?: number;
    isActive?: boolean;
    search?: string;
  }): Promise<Product[]>;
}
