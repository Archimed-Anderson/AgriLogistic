import { Router, Request, Response } from 'express';
import { pool } from '../config/database';
import { getWeatherForecast } from '../services/weather.service';
import { publishOfferToMarketplace } from '../services/marketplace.service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { crop, region, calendar } = req.query;
    let q = 'SELECT * FROM productions ORDER BY expected_harvest_date ASC';
    const params: any[] = [];
    const conds: string[] = [];
    if (crop && crop !== 'all') {
      params.push(crop);
      conds.push(`crop_type = $${params.length}`);
    }
    if (region && region !== 'all') {
      params.push(region);
      conds.push(`region = $${params.length}`);
    }
    if (calendar === 'week') {
      conds.push(`expected_harvest_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'`);
    } else if (calendar === 'month') {
      conds.push(`expected_harvest_date BETWEEN NOW() AND NOW() + INTERVAL '30 days'`);
    }
    if (conds.length) {
      q = `SELECT * FROM productions WHERE ${conds.join(' AND ')} ORDER BY expected_harvest_date ASC`;
    }
    const { rows } = await pool.query(q, params);
    res.json({ success: true, data: rows });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM productions WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Not found' });
    const prod = rows[0];

    const { rows: telemetry } = await pool.query(
      'SELECT time, temp, humidity, light FROM production_telemetry WHERE production_id = $1 ORDER BY time DESC LIMIT 7',
      [id]
    );

    const { rows: alerts } = await pool.query(
      'SELECT * FROM production_alerts WHERE production_id = $1 ORDER BY created_at DESC LIMIT 10',
      [id]
    );

    const weather = await getWeatherForecast(
      (prod as any).location_lat ?? 6.82,
      (prod as any).location_lng ?? -5.25
    );

    res.json({
      success: true,
      data: {
        ...prod,
        telemetry: telemetry.reverse().map((t) => ({
          timestamp: t.time,
          temp: parseFloat(t.temp),
          humidity: parseFloat(t.humidity),
          light: parseFloat(t.light),
        })),
        alerts,
        weatherForecast: weather,
      },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/:id/stage', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    const allowed = ['Semis', 'Croissance', 'Floraison', 'Maturité', 'Récolte'];
    if (!stage || !allowed.includes(stage)) {
      return res.status(400).json({ success: false, error: 'Invalid stage' });
    }

    const { rows } = await pool.query('SELECT * FROM productions WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Not found' });
    const prev = rows[0] as any;

    await pool.query(
      'UPDATE productions SET stage = $1, updated_at = NOW() WHERE id = $2',
      [stage, id]
    );

    if (stage === 'Récolte' && prev.stage !== 'Récolte') {
      const published = await publishOfferToMarketplace({
        productionId: id,
        parcelName: prev.parcel_name,
        farmerName: prev.farmer_name,
        cropType: prev.crop_type,
        estimatedTonnage: parseFloat(prev.estimated_tonnage) || 0,
        region: prev.region,
      });
      return res.json({
        success: true,
        data: { stage },
        marketplacePublished: published,
      });
    }

    res.json({ success: true, data: { stage } });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/:id/telemetry', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { temp, humidity, light } = req.body;
    await pool.query(
      'INSERT INTO production_telemetry (production_id, time, temp, humidity, light) VALUES ($1, NOW(), $2, $3, $4)',
      [id, temp ?? 0, humidity ?? 0, light ?? 0]
    );
    res.status(201).json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
