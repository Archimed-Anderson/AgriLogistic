import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { NotificationQueue } from '../services/queue.service';

const router = Router();

/**
 * Public contact endpoint.
 * Security notes:
 * - Validation stricte côté serveur (Joi)
 * - Honeypot "company" pour filtrer une partie du spam automatisé
 * - Le rate limiting est appliqué au niveau API Gateway (Kong)
 */
const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().max(254).required(),
  subject: Joi.string().trim().min(3).max(120).required(),
  message: Joi.string().trim().min(10).max(2000).required(),
  // Honeypot: ce champ doit rester vide (bot trap)
  company: Joi.string().allow('').max(120).optional(),
});

const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, error: error.details[0].message });
  next();
};

router.post('/', validate(contactSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message, company } = req.body as {
      name: string;
      email: string;
      subject: string;
      message: string;
      company?: string;
    };

    // Honeypot: répondre "OK" mais ne rien traiter
    if (company && company.trim().length > 0) {
      return res.status(202).json({ success: true, data: { status: 'queued' } });
    }

    const recipient = process.env.CONTACT_RECIPIENT_EMAIL || 'contact@AgroLogistic.com';
    const cleanSubject = `[Contact] ${subject} — ${name} <${email}>`;
    const meta = [
      '---',
      `From: ${name} <${email}>`,
      `IP: ${req.ip}`,
      `UA: ${req.get('user-agent') || ''}`,
      `At: ${new Date().toISOString()}`,
    ].join('\n');

    const jobId = await NotificationQueue.add({
      type: 'email',
      recipient,
      subject: cleanSubject,
      message: `${message}\n\n${meta}`,
      priority: 2,
      data: { name, email, subject },
    });

    return res.status(202).json({ success: true, data: { jobId, status: 'queued' } });
  } catch (error) {
    return next(error);
  }
});

export default router;

