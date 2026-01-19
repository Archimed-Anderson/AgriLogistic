import { Request, Response } from 'express';
import { ProductRepository } from '../repositories/product.repository';
import { SearchService } from '../services/search.service';
import { CreateProductDTO, UpdateProductDTO, ProductSearchQuery } from '../models/product.model';

export class ProductController {
  private productRepository: ProductRepository;
  private searchService: SearchService;

  constructor() {
    this.productRepository = new ProductRepository();
    this.searchService = new SearchService();
  }

  /**
   * GET /products
   * List all products with filtering
   */
  listProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const searchQuery: ProductSearchQuery = {
        query: req.query.q as string,
        category: req.query.category as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        organic: req.query.organic === 'true',
        featured: req.query.featured === 'true',
        status: (req.query.status as string) || 'active',
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        sortBy: req.query.sortBy as 'price' | 'name' | 'rating' | 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await this.productRepository.search(searchQuery);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('List products error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * GET /products/search
   * Advanced search with Elasticsearch
   */
  searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const searchQuery: ProductSearchQuery = {
        query: req.query.q as string,
        category: req.query.category as string,
        subCategory: req.query.subCategory as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        organic: req.query.organic === 'true',
        featured: req.query.featured === 'true',
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        sellerId: req.query.sellerId as string,
        status: (req.query.status as string) || 'active',
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        sortBy: req.query.sortBy as 'price' | 'name' | 'rating' | 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await this.searchService.search(searchQuery);

      res.status(200).json({
        success: true,
        data: {
          products: result.products,
          total: result.total,
          pages: result.pages,
          page: searchQuery.page,
          limit: searchQuery.limit,
          facets: result.aggregations,
        },
      });
    } catch (error) {
      console.error('Search products error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search products',
      });
    }
  };

  /**
   * GET /products/autocomplete
   * Autocomplete suggestions
   */
  autocomplete = async (req: Request, res: Response): Promise<void> => {
    try {
      const prefix = req.query.q as string;
      const category = req.query.category as string;

      if (!prefix || prefix.length < 2) {
        res.status(400).json({
          success: false,
          error: 'Query must be at least 2 characters',
        });
        return;
      }

      const suggestions = await this.searchService.autocomplete(prefix, category);

      res.status(200).json({
        success: true,
        data: { suggestions },
      });
    } catch (error) {
      console.error('Autocomplete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get suggestions',
      });
    }
  };

  /**
   * GET /products/:id
   * Get product by ID
   */
  getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const product = await this.productRepository.findById(id);

      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { product },
      });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * GET /products/slug/:slug
   * Get product by slug
   */
  getProductBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;

      const product = await this.productRepository.findBySlug(slug);

      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { product },
      });
    } catch (error) {
      console.error('Get product by slug error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * GET /products/:id/similar
   * Get similar products
   */
  getSimilarProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;

      const similarProducts = await this.searchService.findSimilarProducts(id, limit);

      res.status(200).json({
        success: true,
        data: { products: similarProducts },
      });
    } catch (error) {
      console.error('Get similar products error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get similar products',
      });
    }
  };

  /**
   * POST /products
   * Create new product
   */
  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productData: CreateProductDTO = req.body;

      // Validation
      if (!productData.name || !productData.description || !productData.category || 
          !productData.price || !productData.unit || !productData.sku ||
          !productData.sellerId || !productData.sellerName) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
        return;
      }

      // Create product
      const product = await this.productRepository.create(productData);

      // Index in Elasticsearch
      await this.searchService.indexProduct(product);

      res.status(201).json({
        success: true,
        data: { product },
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create product',
      });
    }
  };

  /**
   * PUT /products/:id
   * Update product
   */
  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates: UpdateProductDTO = req.body;

      const product = await this.productRepository.update(id, updates);

      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found',
        });
        return;
      }

      // Re-index in Elasticsearch
      await this.searchService.indexProduct(product);

      res.status(200).json({
        success: true,
        data: { product },
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update product',
      });
    }
  };

  /**
   * DELETE /products/:id
   * Delete product (soft delete)
   */
  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const deleted = await this.productRepository.softDelete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Product not found',
        });
        return;
      }

      // Remove from Elasticsearch
      await this.searchService.deleteProduct(id);

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete product',
      });
    }
  };

  /**
   * POST /products/:id/stock
   * Update product stock
   */
  updateStock = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { quantity, type } = req.body;

      if (!quantity || !type) {
        res.status(400).json({
          success: false,
          error: 'Quantity and type are required',
        });
        return;
      }

      await this.productRepository.updateStock(id, quantity, type);

      const product = await this.productRepository.findById(id);

      res.status(200).json({
        success: true,
        data: { product },
      });
    } catch (error) {
      console.error('Update stock error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update stock',
      });
    }
  };

  /**
   * GET /categories
   * Get product categories
   */
  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentId = req.query.parentId as string | undefined;

      const categories = await this.productRepository.getCategories(parentId);

      res.status(200).json({
        success: true,
        data: { categories },
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get categories',
      });
    }
  };
}
