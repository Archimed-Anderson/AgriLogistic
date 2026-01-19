import { Router, Request, Response, NextFunction } from 'express';
import { ClickHouseClient } from '../config/clickhouse';
import { RedisClient } from '../config/redis';

const router = Router();

// Dashboard overview
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = 'analytics:dashboard';
    const cached = await RedisClient.get(cacheKey);
    if (cached) return res.json({ success: true, data: JSON.parse(cached), cached: true });

    // Get key metrics
    const [sales, views, users] = await Promise.all([
      ClickHouseClient.query(`
        SELECT sum(total_revenue) as revenue, sum(order_count) as orders
        FROM sales_daily WHERE date >= today() - 30
      `),
      ClickHouseClient.query(`
        SELECT sum(views) as total_views FROM product_views_daily WHERE date >= today() - 30
      `),
      ClickHouseClient.query(`
        SELECT uniq(user_id) as unique_users FROM user_events WHERE created_at >= now() - INTERVAL 30 DAY
      `),
    ]);

    const dashboard = {
      revenue: (await sales.json()).data[0]?.revenue || 0,
      orders: (await sales.json()).data[0]?.orders || 0,
      views: (await views.json()).data[0]?.total_views || 0,
      uniqueUsers: (await users.json()).data[0]?.unique_users || 0,
      period: '30 days',
    };

    await RedisClient.set(cacheKey, JSON.stringify(dashboard), 300);
    res.json({ success: true, data: dashboard });
  } catch (error) { next(error); }
});

// Top products
router.get('/products/top', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const period = parseInt(req.query.days as string) || 30;

    const result = await ClickHouseClient.query(`
      SELECT product_id, sum(total_quantity) as quantity, sum(total_revenue) as revenue
      FROM sales_daily
      WHERE date >= today() - ${period}
      GROUP BY product_id
      ORDER BY revenue DESC
      LIMIT ${limit}
    `);

    const data = await result.json();
    res.json({ success: true, data: data.data });
  } catch (error) { next(error); }
});

// Sales trends
router.get('/sales/trends', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = parseInt(req.query.days as string) || 30;
    const groupBy = req.query.groupBy === 'week' ? 'toMonday(date)' : 'date';

    const result = await ClickHouseClient.query(`
      SELECT ${groupBy} as period, sum(total_revenue) as revenue, sum(order_count) as orders
      FROM sales_daily
      WHERE date >= today() - ${period}
      GROUP BY period
      ORDER BY period
    `);

    const data = await result.json();
    res.json({ success: true, data: data.data });
  } catch (error) { next(error); }
});

// User activity
router.get('/users/activity', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = parseInt(req.query.days as string) || 7;

    const result = await ClickHouseClient.query(`
      SELECT toDate(created_at) as date, 
             event_type,
             count() as count,
             uniq(user_id) as unique_users
      FROM user_events
      WHERE created_at >= now() - INTERVAL ${period} DAY
      GROUP BY date, event_type
      ORDER BY date, count DESC
    `);

    const data = await result.json();
    res.json({ success: true, data: data.data });
  } catch (error) { next(error); }
});

// Category performance
router.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = parseInt(req.query.days as string) || 30;

    const result = await ClickHouseClient.query(`
      SELECT category, 
             sum(total_quantity) as quantity,
             sum(total_revenue) as revenue,
             sum(order_count) as orders
      FROM sales_daily
      WHERE date >= today() - ${period}
      GROUP BY category
      ORDER BY revenue DESC
    `);

    const data = await result.json();
    res.json({ success: true, data: data.data });
  } catch (error) { next(error); }
});

export default router;
