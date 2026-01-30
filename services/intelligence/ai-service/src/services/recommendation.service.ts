import { Database } from '../config/database';
import { RedisClient } from '../config/redis';

interface ProductSimilarity {
  productId: string;
  score: number;
  reason: string;
}

let isInitialized = false;
const productVectors: Map<string, number[]> = new Map();

export class RecommendationService {
  static async initialize(): Promise<void> {
    try {
      // Load product embeddings from cache or compute
      const cachedVectors = await RedisClient.get('product:vectors');
      if (cachedVectors) {
        const parsed = JSON.parse(cachedVectors);
        Object.entries(parsed).forEach(([k, v]) => productVectors.set(k, v as number[]));
      }
      
      isInitialized = true;
      console.log('✅ Recommendation engine initialized');
    } catch (error) {
      console.error('Failed to initialize recommendation engine:', error);
    }
  }

  static isReady(): boolean {
    return isInitialized;
  }

  /**
   * Get personalized product recommendations for a user
   */
  static async getRecommendations(userId: string, limit = 10): Promise<any[]> {
    // Check cache first
    const cacheKey = `recommendations:${userId}`;
    const cached = await RedisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
      // Get user's purchase and view history
      const historyResult = await Database.query(
        `SELECT p.id, p.name, p.category, p.tags, COUNT(*) as interaction_count
         FROM user_product_interactions upi
         JOIN products p ON upi.product_id = p.id
         WHERE upi.user_id = $1
         GROUP BY p.id, p.name, p.category, p.tags
         ORDER BY interaction_count DESC
         LIMIT 20`,
        [userId]
      );

      const history = historyResult.rows;
      
      if (history.length === 0) {
        // Cold start: return popular products
        return await this.getPopularProducts(limit);
      }

      // Extract categories and tags from user history
      const categories = new Set(history.map(h => h.category));
      const allTags = history.flatMap(h => h.tags || []);

      // Find similar products
      const recommendedResult = await Database.query(
        `SELECT DISTINCT p.id, p.name, p.price, p.image_url, p.category, p.rating,
                CASE WHEN p.category = ANY($2) THEN 2 ELSE 0 END +
                CASE WHEN p.tags && $3 THEN 1 ELSE 0 END as relevance_score
         FROM products p
         WHERE p.id NOT IN (SELECT product_id FROM user_product_interactions WHERE user_id = $1)
         AND p.is_active = true
         ORDER BY relevance_score DESC, p.rating DESC
         LIMIT $4`,
        [userId, Array.from(categories), allTags, limit]
      );

      const recommendations = recommendedResult.rows;

      // Cache for 15 minutes
      await RedisClient.set(cacheKey, JSON.stringify(recommendations), 900);

      return recommendations;
    } catch (error) {
      console.error('Recommendation error:', error);
      return await this.getPopularProducts(limit);
    }
  }

  /**
   * Get similar products based on collaborative filtering
   */
  static async getSimilarProducts(productId: string, limit = 6): Promise<ProductSimilarity[]> {
    const cacheKey = `similar:${productId}`;
    const cached = await RedisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
      // Find products bought/viewed by users who also viewed this product
      const result = await Database.query(
        `SELECT p.id as "productId", p.name, p.price, p.image_url,
                COUNT(DISTINCT upi2.user_id) as co_occurrence,
                'Users also viewed' as reason
         FROM user_product_interactions upi1
         JOIN user_product_interactions upi2 ON upi1.user_id = upi2.user_id AND upi1.product_id != upi2.product_id
         JOIN products p ON upi2.product_id = p.id
         WHERE upi1.product_id = $1 AND p.is_active = true
         GROUP BY p.id, p.name, p.price, p.image_url
         ORDER BY co_occurrence DESC
         LIMIT $2`,
        [productId, limit]
      );

      const similar = result.rows.map((r, i) => ({
        productId: r.productId,
        name: r.name,
        price: r.price,
        imageUrl: r.image_url,
        score: 1 - (i * 0.1),
        reason: r.reason,
      }));

      await RedisClient.set(cacheKey, JSON.stringify(similar), 3600);
      return similar;
    } catch (error) {
      console.error('Similar products error:', error);
      return [];
    }
  }

  /**
   * Record user-product interaction
   */
  static async recordInteraction(userId: string, productId: string, action: string): Promise<void> {
    try {
      await Database.query(
        `INSERT INTO user_product_interactions (user_id, product_id, action, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [userId, productId, action]
      );
      
      // Invalidate user's recommendation cache
      await RedisClient.del(`recommendations:${userId}`);
    } catch (error) {
      console.error('Record interaction error:', error);
    }
  }

  private static async getPopularProducts(limit: number): Promise<any[]> {
    const result = await Database.query(
      `SELECT id, name, price, image_url, category, rating
       FROM products
       WHERE is_active = true
       ORDER BY rating DESC, created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
}

export default RecommendationService;
