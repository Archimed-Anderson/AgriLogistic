import { Client } from '@elastic/elasticsearch';
import { ElasticsearchService } from '../config/elasticsearch';
import { Product, ProductSearchQuery } from '../models/product.model';

interface ElasticsearchProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  sku: string;
  images: string[];
  tags: string[];
  specifications: Record<string, any>;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  status: string;
  featured: boolean;
  organic: boolean;
  certifications: string[];
  origin?: string;
  harvestDate?: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class SearchService {
  private client: Client;
  private indexName = 'products';

  constructor() {
    this.client = ElasticsearchService.getInstance();
  }

  /**
   * Index a product for search
   */
  async indexProduct(product: Product): Promise<void> {
    try {
      await this.client.index({
        index: this.indexName,
        id: product.id,
        body: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          category: product.category,
          subCategory: product.subCategory,
          price: product.price,
          originalPrice: product.originalPrice,
          unit: product.unit,
          stock: product.stock,
          sku: product.sku,
          images: product.images,
          tags: product.tags,
          specifications: product.specifications,
          sellerId: product.sellerId,
          sellerName: product.sellerName,
          rating: product.rating,
          reviewCount: product.reviewCount,
          status: product.status,
          featured: product.featured,
          organic: product.organic,
          certifications: product.certifications,
          origin: product.origin,
          harvestDate: product.harvestDate,
          expiryDate: product.expiryDate,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          suggest: {
            input: [product.name, ...product.tags],
            contexts: {
              category: [product.category],
            },
          },
        },
      });

      console.log(`✅ Product indexed: ${product.id}`);
    } catch (error) {
      console.error('❌ Failed to index product:', error);
      throw error;
    }
  }

  /**
   * Full-text search with fuzzy matching and facets
   */
  async search(searchQuery: ProductSearchQuery): Promise<{
    products: ElasticsearchProduct[];
    total: number;
    pages: number;
    aggregations?: any;
  }> {
    const page = searchQuery.page || 1;
    const limit = searchQuery.limit || 20;
    const from = (page - 1) * limit;

    const must: any[] = [];
    const filter: any[] = [];

    // Full-text search with fuzzy matching
    if (searchQuery.query) {
      must.push({
        multi_match: {
          query: searchQuery.query,
          fields: [
            'name^3',              // Boost name field
            'name.autocomplete^2', // Autocomplete
            'description',
            'tags^2',              // Boost tags
            'sellerName',
          ],
          type: 'best_fields',
          fuzziness: 'AUTO',       // Fuzzy matching
          prefix_length: 2,
          operator: 'or',
        },
      });
    }

    // Filters
    if (searchQuery.category) {
      filter.push({ term: { category: searchQuery.category } });
    }
    if (searchQuery.status) {
      filter.push({ term: { status: searchQuery.status } });
    }
    if (searchQuery.organic !== undefined) {
      filter.push({ term: { organic: searchQuery.organic } });
    }
    if (searchQuery.featured !== undefined) {
      filter.push({ term: { featured: searchQuery.featured } });
    }
    if (searchQuery.sellerId) {
      filter.push({ term: { sellerId: searchQuery.sellerId } });
    }

    // Price range
    if (searchQuery.minPrice || searchQuery.maxPrice) {
      const priceRange: any = { range: { price: {} } };
      if (searchQuery.minPrice) priceRange.range.price.gte = searchQuery.minPrice;
      if (searchQuery.maxPrice) priceRange.range.price.lte = searchQuery.maxPrice;
      filter.push(priceRange);
    }

    // Tags filter
    if (searchQuery.tags && searchQuery.tags.length > 0) {
      filter.push({ terms: { tags: searchQuery.tags } });
    }

    // Sorting
    const sort: any[] = [];
    if (searchQuery.sortBy) {
      const sortOrder = searchQuery.sortOrder || 'desc';
      sort.push({ [searchQuery.sortBy]: sortOrder });
    } else if (searchQuery.query) {
      sort.push({ _score: 'desc' }); // Relevance scoring
    } else {
      sort.push({ createdAt: 'desc' }); // Default sort
    }

    try {
      const response = await this.client.search({
        index: this.indexName,
        body: {
          from,
          size: limit,
          query: {
            bool: {
              must: must.length > 0 ? must : [{ match_all: {} }],
              filter,
            },
          },
          sort,
          // Faceted search aggregations
          aggs: {
            categories: {
              terms: { field: 'category', size: 50 },
            },
            price_ranges: {
              range: {
                field: 'price',
                ranges: [
                  { to: 10 },
                  { from: 10, to: 50 },
                  { from: 50, to: 100 },
                  { from: 100 },
                ],
              },
            },
            organic_count: {
              filter: { term: { organic: true } },
            },
            featured_count: {
              filter: { term: { featured: true } },
            },
            avg_rating: {
              avg: { field: 'rating' },
            },
          },
        },
      });

      const hits = response.hits.hits;
      const products = hits.map((hit: any) => hit._source as ElasticsearchProduct);
      const total = typeof response.hits.total === 'number' 
        ? response.hits.total 
        : response.hits.total?.value || 0;

      return {
        products,
        total,
        pages: Math.ceil(total / limit),
        aggregations: response.aggregations,
      };
    } catch (error) {
      console.error('❌ Search error:', error);
      throw error;
    }
  }

  /**
   * Autocomplete suggestions
   */
  async autocomplete(prefix: string, category?: string): Promise<string[]> {
    try {
      const response = await this.client.search({
        index: this.indexName,
        body: {
          suggest: {
            product_suggestions: {
              prefix,
              completion: {
                field: 'suggest',
                size: 10,
                skip_duplicates: true,
                fuzzy: {
                  fuzziness: 'AUTO',
                },
                contexts: category ? { category: [category] } : undefined,
              },
            },
          },
        },
      });

      const suggestions = response.suggest?.product_suggestions?.[0]?.options || [];
      return Array.isArray(suggestions) ? suggestions.map((option: any) => option.text) : [];
    } catch (error) {
      console.error('❌ Autocomplete error:', error);
      return [];
    }
  }

  /**
   * Find similar products using More Like This
   */
  async findSimilarProducts(productId: string, limit: number = 5): Promise<ElasticsearchProduct[]> {
    try {
      const response = await this.client.search({
        index: this.indexName,
        body: {
          size: limit,
          query: {
            more_like_this: {
              fields: ['name', 'description', 'tags', 'category'],
              like: [
                {
                  _index: this.indexName,
                  _id: productId,
                },
              ],
              min_term_freq: 1,
              min_doc_freq: 1,
              max_query_terms: 12,
            },
          },
        },
      });

      const hits = response.hits.hits;
      return hits.map((hit: any) => hit._source as ElasticsearchProduct);
    } catch (error) {
      console.error('❌ Similar products error:', error);
      return [];
    }
  }

  /**
   * Delete product from index
   */
  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.client.delete({
        index: this.indexName,
        id: productId,
      });
      console.log(`✅ Product deleted from index: ${productId}`);
    } catch (error) {
      console.error('❌ Failed to delete product from index:', error);
    }
  }

  /**
   * Bulk index products
   */
  async bulkIndex(products: Product[]): Promise<void> {
    const operations = products.flatMap((product) => [
      { index: { _index: this.indexName, _id: product.id } },
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        category: product.category,
        subCategory: product.subCategory,
        price: product.price,
        originalPrice: product.originalPrice,
        unit: product.unit,
        stock: product.stock,
        sku: product.sku,
        images: product.images,
        tags: product.tags,
        specifications: product.specifications,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        rating: product.rating,
        reviewCount: product.reviewCount,
        status: product.status,
        featured: product.featured,
        organic: product.organic,
        certifications: product.certifications,
        origin: product.origin,
        harvestDate: product.harvestDate,
        expiryDate: product.expiryDate,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        suggest: {
          input: [product.name, ...product.tags],
          contexts: {
            category: [product.category],
          },
        },
      },
    ]);

    try {
      const response = await this.client.bulk({ operations });
      console.log(`✅ Bulk indexed ${products.length} products`);
      
      if (response.errors) {
        console.error('❌ Some products failed to index');
      }
    } catch (error) {
      console.error('❌ Bulk index error:', error);
      throw error;
    }
  }
}
