import { Router, Request, Response } from 'express';
import { pool } from '../config/database';

const router = Router();

router.post('/:productionId/activate-valve', async (req: Request, res: Response) => {
  try {
    const { productionId } = req.params;
    const { valveId } = req.body;

    await pool.query(
      'INSERT INTO irrigation_events (production_id, valve_id, action) VALUES ($1, $2, $3)',
      [productionId, valveId ?? 'default', 'activate']
    );

    res.json({
      success: true,
      message: 'Valve activation command sent',
      productionId,
      valveId: valveId ?? 'default',
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/:productionId/deactivate-valve', async (req: Request, res: Response) => {
  try {
    const { productionId } = req.params;
    const { valveId } = req.body;

    await pool.query(
      'INSERT INTO irrigation_events (production_id, valve_id, action) VALUES ($1, $2, $3)',
      [productionId, valveId ?? 'default', 'deactivate']
    );

    res.json({
      success: true,
      message: 'Valve deactivation command sent',
      productionId,
      valveId: valveId ?? 'default',
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
