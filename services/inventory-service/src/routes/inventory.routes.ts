import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { Database } from '../config/database';

const router = Router();

const upsertSchema = Joi.object({
  stock: Joi.number().integer().min(0).required(),
});

const reserveSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, error: error.details[0].message });
  next();
};

// GET /inventory (list)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    const offset = parseInt(req.query.offset as string) || 0;
    const result = await Database.query(
      `SELECT product_id, stock, reserved, updated_at
       FROM inventory_items
       ORDER BY updated_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.json({ success: true, data: result.rows, pagination: { limit, offset } });
  } catch (e) {
    next(e);
  }
});

// GET /inventory/:productId
router.get('/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const result = await Database.query(
      `SELECT product_id, stock, reserved, updated_at
       FROM inventory_items
       WHERE product_id = $1`,
      [productId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    next(e);
  }
});

// PUT/PATCH /inventory/:productId (set stock)
const setStockHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body as { stock: number };
    const result = await Database.query(
      `INSERT INTO inventory_items (product_id, stock, reserved, updated_at)
       VALUES ($1, $2, COALESCE((SELECT reserved FROM inventory_items WHERE product_id=$1), 0), NOW())
       ON CONFLICT (product_id) DO UPDATE
       SET stock = EXCLUDED.stock,
           updated_at = NOW()
       RETURNING product_id, stock, reserved, updated_at`,
      [productId, stock]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    next(e);
  }
};

router.put('/:productId', validate(upsertSchema), setStockHandler);
router.patch('/:productId', validate(upsertSchema), setStockHandler);

// POST /inventory/reserve (reserve stock)
router.post('/reserve', validate(reserveSchema), async (req: Request, res: Response, next: NextFunction) => {
  const client = await Database.getPool().connect();
  try {
    const { productId, quantity } = req.body as { productId: string; quantity: number };
    await client.query('BEGIN');
    const row = await client.query(
      `SELECT stock, reserved
       FROM inventory_items
       WHERE product_id = $1
       FOR UPDATE`,
      [productId]
    );
    if (row.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Not found' });
    }
    const stock = parseInt(row.rows[0].stock, 10);
    const reserved = parseInt(row.rows[0].reserved, 10);
    const available = stock - reserved;
    if (available < quantity) {
      await client.query('ROLLBACK');
      return res.status(409).json({ success: false, error: 'Insufficient stock', available });
    }

    const updated = await client.query(
      `UPDATE inventory_items
       SET reserved = reserved + $2, updated_at = NOW()
       WHERE product_id = $1
       RETURNING product_id, stock, reserved, updated_at`,
      [productId, quantity]
    );
    await client.query('COMMIT');
    res.status(200).json({ success: true, data: updated.rows[0] });
  } catch (e) {
    await client.query('ROLLBACK');
    next(e);
  } finally {
    client.release();
  }
});

export default router;

