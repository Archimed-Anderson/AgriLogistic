import { Router, Request, Response, NextFunction } from 'express';
import { EscrowService } from '../services/escrow.service';

const router = Router();
const escrowService = new EscrowService();

// Get active escrow contracts
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const contracts = await escrowService.getActiveEscrows();
    res.json({ success: true, data: contracts });
  } catch (error) { next(error); }
});

// Get escrow stats
router.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await escrowService.getContractStats();
    res.json({ success: true, data: stats });
  } catch (error) { next(error); }
});

// Create new escrow contract
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contract = await escrowService.createEscrow(req.body);
    res.status(201).json({ success: true, data: contract });
  } catch (error) { next(error); }
});

// Release funds
router.post('/:id/release', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;
    const success = await escrowService.releaseFonds(req.params.id, reason);
    res.json({ success, message: success ? 'Funds released' : 'Contract not found' });
  } catch (error) { next(error); }
});

// Refund buyer
router.post('/:id/refund', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;
    const success = await escrowService.refundBuyer(req.params.id, reason);
    res.json({ success, message: success ? 'Funds refunded' : 'Contract not found' });
  } catch (error) { next(error); }
});

export default router;
