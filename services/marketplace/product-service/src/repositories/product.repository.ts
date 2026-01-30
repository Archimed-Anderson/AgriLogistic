import { Pool } from 'pg';
import { Database } from '../config/database';
import { Product, CreateProductDTO, UpdateProductDTO, ProductSearchQuery, ProductCategory } from '../models/product.model';
import slugify from 'slugify';

export class ProductRepository {
  private db: Pool;

  constructor() {
    this.db = Database.getInstance();
  }

  /**
   * Find product by ID
   */
  async findById(productId: string): Promise<Product | null> {
    const query = `
      SELECT 
        p.id, p.name, p.slug, p.description, p.short_description as "shortDescription",
        c.name as category, sc.name as "subCategory",
        p.price, p.original_price as "originalPrice", p.unit, p.stock,
        p.low_stock_threshold as "lowStockThreshold", p.sku, p.images, p.tags,
        p.specifications, p.seller_id as "sellerId", p.seller_name as "sellerName",
        p.rating, p.review_count as "reviewCount", p.status, p.featured, p.organic,
        p.certifications, p.origin, p.harvest_date as "harvestDate",
        p.expiry_date as "expiryDate", p.created_at as "createdAt",
        p.updated_at as "updatedAt", p.deleted_at as "deletedAt"
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN categories sc ON p.sub_category_id = sc.id
      WHERE p.id = $1 AND p.deleted_at IS NULL
    `;
    
    const result = await this.db.query(query, [productId]);
    return result.rows[0] || null;
  }

  /**
   * Find product by slug
   */
  async findBySlug(slug: string): Promise<Product | null> {
    const query = `
      SELECT 
        p.id, p.name, p.slug, p.description, p.short_description as "shortDescription",
        c.name as category, sc.name as "subCategory",
        p.price, p.original_price as "originalPrice", p.unit, p.stock,
        p.low_stock_threshold as "lowStockThreshold", p.sku, p.images, p.tags,
        p.specifications, p.seller_id as "sellerId", p.seller_name as "sellerName",
        p.rating, p.review_count as "reviewCount", p.status, p.featured, p.organic,
        p.certifications, p.origin, p.harvest_date as "harvestDate",
        p.expiry_date as "expiryDate", p.created_at as "createdAt",
        p.updated_at as "updatedAt", p.deleted_at as "deletedAt"
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN categories sc ON p.sub_category_id = sc.id
      WHERE p.slug = $1 AND p.deleted_at IS NULL
    `;
    
    const result = await this.db.query(query, [slug]);
    return result.rows[0] || null;
  }

  /**
   * Create new product
   */
  async create(productData: CreateProductDTO): Promise<Product> {
    const slug = slugify(productData.name, { lower: true, strict: true });
    
    const query = `
      INSERT INTO products (
        name, slug, description, short_description, category_id, sub_category_id,
        price, original_price, unit, stock, low_stock_threshold, sku, images,
        tags, specifications, seller_id, seller_name, featured, organic,
        certifications, origin, harvest_date, expiry_date
      ) VALUES ($1, $2, $3, $4, 
        (SELECT id FROM categories WHERE name = $5),
        (SELECT id FROM categories WHERE name = $6),
        $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      )
      RETURNING id, name, slug, description, short_description as "shortDescription",
                $5 as category, $6 as "subCategory", price, original_price as "originalPrice",
                unit, stock, low_stock_threshold as "lowStockThreshold", sku, images, tags,
                specifications, seller_id as "sellerId", seller_name as "sellerName",
                rating, review_count as "reviewCount", status, featured, organic,
                certifications, origin, harvest_date as "harvestDate",
                expiry_date as "expiryDate", created_at as "createdAt",
                updated_at as "updatedAt", deleted_at as "deletedAt"
    `;

    const values = [
      productData.name,
      slug,
      productData.description,
      productData.shortDescription || null,
      productData.category,
      productData.subCategory || null,
      productData.price,
      productData.originalPrice || null,
      productData.unit,
      productData.stock,
      productData.lowStockThreshold || 10,
      productData.sku,
      productData.images || [],
      productData.tags || [],
      JSON.stringify(productData.specifications || {}),
      productData.sellerId,
      productData.sellerName,
      productData.featured || false,
      productData.organic || false,
      productData.certifications || [],
      productData.origin || null,
      productData.harvestDate || null,
      productData.expiryDate || null,
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  /**
   * Update product
   */
  async update(productId: string, updates: UpdateProductDTO): Promise<Product | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
      fields.push(`slug = $${paramIndex++}`);
      values.push(slugify(updates.name, { lower: true, strict: true }));
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.shortDescription !== undefined) {
      fields.push(`short_description = $${paramIndex++}`);
      values.push(updates.shortDescription);
    }
    if (updates.category !== undefined) {
      fields.push(`category_id = (SELECT id FROM categories WHERE name = $${paramIndex++})`);
      values.push(updates.category);
    }
    if (updates.price !== undefined) {
      fields.push(`price = $${paramIndex++}`);
      values.push(updates.price);
    }
    if (updates.stock !== undefined) {
      fields.push(`stock = $${paramIndex++}`);
      values.push(updates.stock);
    }
    if (updates.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    if (updates.images !== undefined) {
      fields.push(`images = $${paramIndex++}`);
      values.push(updates.images);
    }
    if (updates.tags !== undefined) {
      fields.push(`tags = $${paramIndex++}`);
      values.push(updates.tags);
    }

    if (fields.length === 0) {
      return this.findById(productId);
    }

    values.push(productId);
    const query = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    if (result.rows.length === 0) return null;
    
    return this.findById(productId);
  }

  /**
   * Soft delete product
   */
  async softDelete(productId: string): Promise<boolean> {
    const query = `
      UPDATE products
      SET deleted_at = CURRENT_TIMESTAMP, status = 'discontinued'
      WHERE id = $1 AND deleted_at IS NULL
    `;
    
    const result = await this.db.query(query, [productId]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Search products with advanced filtering
   */
  async search(searchQuery: ProductSearchQuery): Promise<{ products: Product[]; total: number; pages: number }> {
    const conditions: string[] = ['p.deleted_at IS NULL'];
    const values: any[] = [];
    let paramIndex = 1;

    // Text search
    if (searchQuery.query) {
      conditions.push(`(
        p.name ILIKE $${paramIndex} OR 
        p.description ILIKE $${paramIndex} OR 
        $${paramIndex} = ANY(p.tags)
      )`);
      values.push(`%${searchQuery.query}%`);
      paramIndex++;
    }

    // Category filter
    if (searchQuery.category) {
      conditions.push(`c.name = $${paramIndex}`);
      values.push(searchQuery.category);
      paramIndex++;
    }

    // Price range
    if (searchQuery.minPrice !== undefined) {
      conditions.push(`p.price >= $${paramIndex}`);
      values.push(searchQuery.minPrice);
      paramIndex++;
    }
    if (searchQuery.maxPrice !== undefined) {
      conditions.push(`p.price <= $${paramIndex}`);
      values.push(searchQuery.maxPrice);
      paramIndex++;
    }

    // Filters
    if (searchQuery.organic !== undefined) {
      conditions.push(`p.organic = $${paramIndex}`);
      values.push(searchQuery.organic);
      paramIndex++;
    }
    if (searchQuery.featured !== undefined) {
      conditions.push(`p.featured = $${paramIndex}`);
      values.push(searchQuery.featured);
      paramIndex++;
    }
    if (searchQuery.status) {
      conditions.push(`p.status = $${paramIndex}`);
      values.push(searchQuery.status);
      paramIndex++;
    }
    if (searchQuery.sellerId) {
      conditions.push(`p.seller_id = $${paramIndex}`);
      values.push(searchQuery.sellerId);
      paramIndex++;
    }

    // Pagination
    const page = searchQuery.page || 1;
    const limit = searchQuery.limit || 20;
    const offset = (page - 1) * limit;

    // Sorting
    const sortByMapping: { [key: string]: string } = {
      price: 'price',
      name: 'name',
      rating: 'rating',
      createdAt: 'created_at',
    };
    const sortField = sortByMapping[searchQuery.sortBy || 'createdAt'] || 'created_at';
    const sortOrder = searchQuery.sortOrder || 'desc';
    const orderBy = `ORDER BY p.${sortField} ${sortOrder.toUpperCase()}`;

    // Count total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${conditions.join(' AND ')}
    `;
    const countResult = await this.db.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total, 10);

    // Get products
    const query = `
      SELECT 
        p.id, p.name, p.slug, p.description, p.short_description as "shortDescription",
        c.name as category, sc.name as "subCategory",
        p.price, p.original_price as "originalPrice", p.unit, p.stock,
        p.low_stock_threshold as "lowStockThreshold", p.sku, p.images, p.tags,
        p.specifications, p.seller_id as "sellerId", p.seller_name as "sellerName",
        p.rating, p.review_count as "reviewCount", p.status, p.featured, p.organic,
        p.certifications, p.origin, p.harvest_date as "harvestDate",
        p.expiry_date as "expiryDate", p.created_at as "createdAt",
        p.updated_at as "updatedAt"
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN categories sc ON p.sub_category_id = sc.id
      WHERE ${conditions.join(' AND ')}
      ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);
    const result = await this.db.query(query, values);

    return {
      products: result.rows,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get categories with hierarchy
   */
  async getCategories(parentId?: string | null): Promise<ProductCategory[]> {
    const query = `
      SELECT 
        id, name, slug, description, parent_id as "parentId", icon,
        display_order as "displayOrder", product_count as "productCount",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM categories
      WHERE ${parentId !== undefined ? 'parent_id = $1' : 'parent_id IS NULL'}
      ORDER BY display_order ASC, name ASC
    `;

    const values = parentId !== undefined ? [parentId] : [];
    const result = await this.db.query(query, values);
    return result.rows;
  }

  /**
   * Update product stock
   */
  async updateStock(productId: string, quantity: number, transactionType: string): Promise<void> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');

      // Get current stock
      const stockQuery = 'SELECT stock FROM products WHERE id = $1';
      const stockResult = await client.query(stockQuery, [productId]);
      const currentStock = stockResult.rows[0].stock;
      const newStock = currentStock + quantity;

      // Update stock
      await client.query(
        'UPDATE products SET stock = $1 WHERE id = $2',
        [newStock, productId]
      );

      // Record transaction
      await client.query(
        `INSERT INTO inventory_transactions 
         (product_id, transaction_type, quantity, previous_stock, new_stock)
         VALUES ($1, $2, $3, $4, $5)`,
        [productId, transactionType, quantity, currentStock, newStock]
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get price history for a product
   */
  async getPriceHistory(productId: string, days: number = 60): Promise<any[]> {
    const query = `
      SELECT DATE(created_at) as date, AVG(price) as avg_price
      FROM product_price_history
      WHERE product_id = $1 AND created_at > NOW() - INTERVAL '$2 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `;
    const result = await this.db.query(query, [productId, days]);
    return result.rows;
  }
}
