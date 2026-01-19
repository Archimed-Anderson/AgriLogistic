import { Database } from '../config/database';
import { RedisClient } from '../config/redis';

interface ForecastResult {
  date: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

interface SeasonalPattern {
  month: number;
  factor: number;
}

let isInitialized = false;
const seasonalPatterns: Map<string, SeasonalPattern[]> = new Map();

export class ForecastService {
  static async initialize(): Promise<void> {
    try {
      // Load seasonal patterns
      const cached = await RedisClient.get('seasonal:patterns');
      if (cached) {
        const patterns = JSON.parse(cached);
        Object.entries(patterns).forEach(([k, v]) => seasonalPatterns.set(k, v as SeasonalPattern[]));
      }
      
      isInitialized = true;
      console.log('✅ Forecast service initialized');
    } catch (error) {
      console.error('Failed to initialize forecast service:', error);
    }
  }

  static isReady(): boolean {
    return isInitialized;
  }

  /**
   * Forecast demand for a product
   */
  static async forecastDemand(productId: string, days = 30): Promise<ForecastResult[]> {
    const cacheKey = `forecast:demand:${productId}:${days}`;
    const cached = await RedisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
      // Get historical sales data
      const historyResult = await Database.query(
        `SELECT DATE(created_at) as date, SUM(quantity) as total_quantity
         FROM order_items oi
         JOIN orders o ON oi.order_id = o.id
         WHERE oi.product_id = $1 AND o.status NOT IN ('cancelled', 'refunded')
         AND o.created_at > NOW() - INTERVAL '90 days'
         GROUP BY DATE(created_at)
         ORDER BY date`,
        [productId]
      );

      const history = historyResult.rows;
      
      if (history.length < 7) {
        // Not enough data, return baseline forecast
        return this.generateBaselineForecast(days);
      }

      // Calculate moving average and trend
      const values = history.map(h => parseInt(h.total_quantity));
      const avgDemand = values.reduce((a, b) => a + b, 0) / values.length;
      
      // Calculate trend (simple linear regression)
      const n = values.length;
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      values.forEach((y, x) => {
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
      });
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      
      // Calculate standard deviation for confidence intervals
      const stdDev = Math.sqrt(
        values.reduce((sum, v) => sum + Math.pow(v - avgDemand, 2), 0) / n
      );

      // Generate forecast
      const forecast: ForecastResult[] = [];
      const today = new Date();
      
      for (let i = 1; i <= days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        // Linear trend with seasonality
        const trendValue = avgDemand + slope * (n + i);
        const seasonalFactor = this.getSeasonalFactor(productId, date.getMonth() + 1);
        const predicted = Math.max(0, Math.round(trendValue * seasonalFactor));
        
        forecast.push({
          date: date.toISOString().split('T')[0],
          predicted,
          lowerBound: Math.max(0, Math.round(predicted - 1.96 * stdDev)),
          upperBound: Math.round(predicted + 1.96 * stdDev),
          confidence: 0.85 - (i * 0.01), // Confidence decreases over time
        });
      }

      // Cache for 4 hours
      await RedisClient.set(cacheKey, JSON.stringify(forecast), 14400);
      return forecast;
    } catch (error) {
      console.error('Forecast error:', error);
      return this.generateBaselineForecast(days);
    }
  }

  /**
   * Forecast price trends
   */
  static async forecastPrice(productId: string, days = 14): Promise<ForecastResult[]> {
    const cacheKey = `forecast:price:${productId}:${days}`;
    const cached = await RedisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
      const historyResult = await Database.query(
        `SELECT DATE(created_at) as date, AVG(price) as avg_price
         FROM product_price_history
         WHERE product_id = $1 AND created_at > NOW() - INTERVAL '60 days'
         GROUP BY DATE(created_at)
         ORDER BY date`,
        [productId]
      );

      const history = historyResult.rows;
      
      if (history.length < 5) {
        // Get current price and return flat forecast
        const currentResult = await Database.query(
          'SELECT price FROM products WHERE id = $1', [productId]
        );
        const currentPrice = currentResult.rows[0]?.price || 0;
        return this.generateFlatForecast(currentPrice, days);
      }

      const prices = history.map(h => parseFloat(h.avg_price));
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const volatility = Math.sqrt(
        prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length
      ) / avgPrice;

      const forecast: ForecastResult[] = [];
      const today = new Date();
      const lastPrice = prices[prices.length - 1];

      for (let i = 1; i <= days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        // Random walk with mean reversion
        const reversion = 0.1 * (avgPrice - lastPrice);
        const predicted = Math.max(0, lastPrice + reversion);
        const margin = predicted * volatility * Math.sqrt(i);

        forecast.push({
          date: date.toISOString().split('T')[0],
          predicted: Math.round(predicted * 100) / 100,
          lowerBound: Math.round((predicted - 1.96 * margin) * 100) / 100,
          upperBound: Math.round((predicted + 1.96 * margin) * 100) / 100,
          confidence: 0.9 - (i * 0.02),
        });
      }

      await RedisClient.set(cacheKey, JSON.stringify(forecast), 7200);
      return forecast;
    } catch (error) {
      console.error('Price forecast error:', error);
      return [];
    }
  }

  private static getSeasonalFactor(productId: string, month: number): number {
    const patterns = seasonalPatterns.get(productId);
    if (patterns) {
      const pattern = patterns.find(p => p.month === month);
      if (pattern) return pattern.factor;
    }
    // Default seasonal factors for agriculture
    const defaultFactors: Record<number, number> = {
      1: 0.7, 2: 0.75, 3: 0.9, 4: 1.1, 5: 1.2, 6: 1.3,
      7: 1.25, 8: 1.15, 9: 1.0, 10: 0.9, 11: 0.8, 12: 0.7
    };
    return defaultFactors[month] || 1.0;
  }

  private static generateBaselineForecast(days: number): ForecastResult[] {
    const forecast: ForecastResult[] = [];
    const today = new Date();
    for (let i = 1; i <= days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      forecast.push({
        date: date.toISOString().split('T')[0],
        predicted: 10,
        lowerBound: 5,
        upperBound: 20,
        confidence: 0.5,
      });
    }
    return forecast;
  }

  private static generateFlatForecast(value: number, days: number): ForecastResult[] {
    const forecast: ForecastResult[] = [];
    const today = new Date();
    for (let i = 1; i <= days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      forecast.push({
        date: date.toISOString().split('T')[0],
        predicted: value,
        lowerBound: value * 0.9,
        upperBound: value * 1.1,
        confidence: 0.6,
      });
    }
    return forecast;
  }
}

export default ForecastService;
