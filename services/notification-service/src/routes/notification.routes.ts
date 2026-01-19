import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { NotificationQueue } from '../services/queue.service';
import { Database } from '../config/database';

const router = Router();

const sendSchema = Joi.object({
  type: Joi.string().valid('email', 'sms', 'push').required(),
  recipient: Joi.string().required(),
  subject: Joi.string().when('type', { is: 'email', then: Joi.required() }),
  message: Joi.string().required(),
  template: Joi.string().optional(),
  data: Joi.object().optional(),
  userId: Joi.string().uuid().optional(),
  priority: Joi.number().min(1).max(5).default(2),
});

const bulkSchema = Joi.object({
  notifications: Joi.array().items(sendSchema).min(1).max(1000).required(),
});

const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, error: error.details[0].message });
  next();
};

// Send single notification
router.post('/send', validate(sendSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobId = await NotificationQueue.add(req.body);
    res.status(202).json({ success: true, data: { jobId, status: 'queued' } });
  } catch (error) { next(error); }
});

// Send bulk notifications
router.post('/bulk', validate(bulkSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobIds = await NotificationQueue.addBulk(req.body.notifications);
    res.status(202).json({ success: true, data: { count: jobIds.length, jobIds, status: 'queued' } });
  } catch (error) { next(error); }
});

// Get notification history for user
router.get('/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    
    const result = await Database.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [userId, limit]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) { next(error); }
});

// Get notification by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Database.query('SELECT * FROM notifications WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { next(error); }
});

export default router;
