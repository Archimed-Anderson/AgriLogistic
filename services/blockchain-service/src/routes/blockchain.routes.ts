import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { BlockchainService } from '../services/blockchain.service';

const router = Router();

// Validation schemas
const createProductSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  origin: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    address: Joi.string().required(),
  }).required(),
  owner: Joi.string().required(),
});

const recordEventSchema = Joi.object({
  eventType: Joi.string().valid(
    'HARVESTED', 'PROCESSED', 'PACKAGED', 'SHIPPED', 
    'RECEIVED', 'STORED', 'QUALITY_CHECK', 'CUSTOM'
  ).required(),
  description: Joi.string().required(),
  actor: Joi.string().required(),
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    address: Joi.string(),
  }).optional(),
  data: Joi.string().optional(),
});

const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, error: error.details[0].message });
  next();
};

// Create product on blockchain
router.post('/products', validate(createProductSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, category, origin, owner } = req.body;
    const result = await BlockchainService.createProduct(name, category, origin, owner);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
});

// Get product by ID
router.get('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await BlockchainService.getProduct(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) { next(error); }
});

// Get product traceability history
router.get('/products/:id/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const history = await BlockchainService.getProductHistory(req.params.id);
    res.json({ success: true, data: history });
  } catch (error) { next(error); }
});

// Record traceability event
router.post('/products/:id/events', validate(recordEventSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventType, description, actor, location, data } = req.body;
    const result = await BlockchainService.recordEvent(
      req.params.id, eventType, description, actor, location, data
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
});

// Transfer product ownership
router.post('/products/:id/transfer', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentOwner, newOwner } = req.body;
    if (!currentOwner || !newOwner) {
      return res.status(400).json({ success: false, error: 'currentOwner and newOwner required' });
    }
    const result = await BlockchainService.transferOwnership(req.params.id, currentOwner, newOwner);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// Add certification
router.post('/products/:id/certifications', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { certification, actor } = req.body;
    if (!certification || !actor) {
      return res.status(400).json({ success: false, error: 'certification and actor required' });
    }
    const result = await BlockchainService.addCertification(req.params.id, certification, actor);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
});

// Get products by owner
router.get('/owners/:owner/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await BlockchainService.getProductsByOwner(req.params.owner);
    res.json({ success: true, data: products });
  } catch (error) { next(error); }
});

// Network status
router.get('/status', async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      connected: BlockchainService.isConnected(),
      mode: BlockchainService.isConnected() ? 'hyperledger' : 'simulation',
      channel: process.env.FABRIC_CHANNEL || 'AgroLogistic-channel',
    },
  });
});

export default router;
