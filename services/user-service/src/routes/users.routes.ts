import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../config/database';

const router = Router();

const upsertProfileSchema = Joi.object({
  email: Joi.string().email().optional(),
  username: Joi.string().min(3).max(64).optional(),
  fullName: Joi.string().min(1).max(120).optional(),
  role: Joi.string().valid('user', 'admin', 'manager').optional(),
}).min(1);

const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, error: error.details[0].message });
  next();
};

function getPrincipal(req: Request): { userId?: string; username?: string } {
  const username = req.header('x-consumer-username') || undefined;
  // Kong sets x-consumer-custom-id to our configured custom_id (e.g. "web-client-v1"),
  // which is NOT a UUID. For the stub, we rely on username as stable principal.
  return { username };
}

async function ensureUserForPrincipal(principal: { userId?: string; username?: string }) {
  // Fallback: identify by username (non-unique across environments; acceptable for stub)
  if (principal.username) {
    const existing = await Database.query('SELECT * FROM users WHERE username = $1', [principal.username]);
    if (existing.rows.length > 0) return existing.rows[0];
    const id = uuidv4();
    const created = await Database.query(
      `INSERT INTO users (id, email, username, full_name, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [id, `${principal.username}@local.dev`, principal.username, principal.username, 'user']
    );
    return created.rows[0];
  }

  return null;
}

// GET /users (list)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = (page - 1) * limit;
    const result = await Database.query(
      `SELECT id, email, username, full_name, role, created_at, updated_at
       FROM users
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const count = await Database.query('SELECT COUNT(*) FROM users');
    res.json({
      success: true,
      data: result.rows,
      pagination: { page, limit, total: parseInt(count.rows[0].count, 10) },
    });
  } catch (e) {
    next(e);
  }
});

// GET /users/profile (current user)
router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const principal = getPrincipal(req);
    const user = await ensureUserForPrincipal(principal);
    if (!user) return res.status(400).json({ success: false, error: 'Missing consumer identity headers' });
    res.json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
});

// PUT/PATCH /users/profile (update current user)
const updateProfileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const principal = getPrincipal(req);
    const user = await ensureUserForPrincipal(principal);
    if (!user) return res.status(400).json({ success: false, error: 'Missing consumer identity headers' });

    const { email, username, fullName, role } = req.body as any;
    const updated = await Database.query(
      `UPDATE users
       SET email = COALESCE($2, email),
           username = COALESCE($3, username),
           full_name = COALESCE($4, full_name),
           role = COALESCE($5, role),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [user.id, email || null, username || null, fullName || null, role || null]
    );
    res.json({ success: true, data: updated.rows[0] });
  } catch (e) {
    next(e);
  }
};

router.put('/profile', validate(upsertProfileSchema), updateProfileHandler);
router.patch('/profile', validate(upsertProfileSchema), updateProfileHandler);

// GET /users/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await Database.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    next(e);
  }
});

export default router;

