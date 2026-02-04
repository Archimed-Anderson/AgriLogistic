import { describe, it, expect } from 'vitest';
import { Product } from './product.entity';
import { Price } from '../value-objects/price.vo';
import { ProductCategory } from '../enums/product-category.enum';

describe('Product Entity', () => {
  it('should create a valid product', () => {
    const product = Product.create({
      name: 'Tomates Bio',
      sku: 'TOM-001',
      category: ProductCategory.VEGETABLES,
      currentStock: 100,
      reorderPoint: 20,
      maxStock: 200,
      price: new Price(3.5, 'EUR'),
    });

    expect(product.name).toBe('Tomates Bio');
    expect(product.currentStock).toBe(100);
    expect(product.isActive).toBe(true);
  });

  it('should manage stock correctly', () => {
    const product = Product.create({
      name: 'Test Product',
      sku: 'TEST-001',
      category: ProductCategory.OTHER,
      currentStock: 10,
      reorderPoint: 5,
      maxStock: 50,
      price: new Price(10),
    });

    product.updateStock(-5);
    expect(product.currentStock).toBe(5);
    expect(product.isLowStock()).toBe(true);

    product.updateStock(-5);
    expect(product.currentStock).toBe(0);
    expect(product.isOutOfStock()).toBe(true);

    expect(() => product.updateStock(-1)).toThrow('Stock cannot be negative');
  });

  it('should update price', () => {
    const product = Product.create({
      name: 'Test Product',
      sku: 'TEST-001',
      category: ProductCategory.OTHER,
      currentStock: 10,
      reorderPoint: 5,
      maxStock: 50,
      price: new Price(10),
    });

    const newPrice = new Price(12.5);
    product.updatePrice(newPrice);

    expect(product.price.amount).toBe(12.5);
  });
});
