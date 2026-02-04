import { Router } from 'express';
import { PricingController } from '../controllers/pricing.controller';

const router = Router();

router.post('/calculate', PricingController.calculate);
router.post('/simulate', PricingController.simulate);
router.get('/rules', PricingController.getRules);
router.get('/zones', PricingController.getZones);

export default router;
