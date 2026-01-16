import { Entity } from './entity';
import { Price } from '../value-objects/price.vo';
import { ProductCategory } from '../enums/product-category.enum';

export interface ProductProps {
  name: string;
  sku: string;
  category: ProductCategory;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  price: Price;
  supplier?: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends Entity<ProductProps> {
  private constructor(props: ProductProps, id?: string) {
    super(props, id);
  }

  public static create(
    props: Omit<ProductProps, 'createdAt' | 'updatedAt' | 'isActive'>,
    id?: string
  ): Product {
    return new Product(
      {
        ...props,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id
    );
  }

  get name(): string {
    return this.props.name;
  }

  get sku(): string {
    return this.props.sku;
  }

  get category(): ProductCategory {
    return this.props.category;
  }

  get currentStock(): number {
    return this.props.currentStock;
  }

  get price(): Price {
    return this.props.price;
  }
  
  get isActive(): boolean {
    return this.props.isActive;
  }

  public isLowStock(): boolean {
    return this.props.currentStock > 0 && this.props.currentStock <= this.props.reorderPoint;
  }

  public isOutOfStock(): boolean {
    return this.props.currentStock <= 0;
  }

  public updateStock(quantityChange: number): void {
    const newStock = this.props.currentStock + quantityChange;
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }
    this.props.currentStock = newStock;
    this.props.updatedAt = new Date();
  }

  public updatePrice(newPrice: Price): void {
    this.props.price = newPrice;
    this.props.updatedAt = new Date();
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  public activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }
}
