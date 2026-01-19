import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { DeliveryController } from '../controllers/delivery.controller';

const router = Router();
const controller = new DeliveryController();

const createDeliverySchema = Joi.object({
  orderId: Joi.string().uuid().required(),
  pickupAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
  }).required(),
  deliveryAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
  }).required(),
  customerId: Joi.string().uuid().required(),
  scheduledAt: Joi.date().iso().optional(),
  notes: Joi.string().optional(),
  priority: Joi.string().valid('low', 'normal', 'high', 'urgent').default('normal'),
});

const assignDriverSchema = Joi.object({
  driverId: Joi.string().uuid().required(),
});

const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });
    next();
  };
};

// Routes
router.get('/', (req, res, next) => controller.getDeliveries(req, res).catch(next));
router.get('/:id', (req, res, next) => controller.getDeliveryById(req, res).catch(next));
router.get('/order/:orderId', (req, res, next) => controller.getDeliveryByOrder(req, res).catch(next));
router.post('/', validate(createDeliverySchema), (req, res, next) => controller.createDelivery(req, res).catch(next));
router.patch('/:id/assign', validate(assignDriverSchema), (req, res, next) => controller.assignDriver(req, res).catch(next));
router.patch('/:id/status', (req, res, next) => controller.updateStatus(req, res).catch(next));
router.get('/:id/route', (req, res, next) => controller.getOptimizedRoute(req, res).catch(next));

export default router;
