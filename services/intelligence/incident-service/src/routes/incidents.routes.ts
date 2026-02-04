import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../config/database';
import { produceIncident } from '../config/kafka';
import { publishIncidentToRedis } from '../services/websocket.service';

const router = Router();

export interface IncidentBody {
  type: string;
  title: string;
  description?: string;
  location: [number, number];
  region: string;
  severity?: number;
  metadata?: Record<string, any>;
}

router.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await Database.query(
      `SELECT id, type, title, description, location_lat, location_lng, region, severity, status, metadata, created_at
       FROM incidents WHERE status != 'resolved' ORDER BY severity DESC, created_at DESC LIMIT 1000`
    );
    const incidents = rows.map((r: any) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.description,
      location: [r.location_lat, r.location_lng],
      region: r.region,
      severity: r.severity,
      status: r.status,
      metadata: r.metadata,
      timestamp: r.created_at,
    }));
    res.json({ incidents });
  } catch (error) {
    console.error('GET /incidents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: Request<object, object, IncidentBody>, res: Response) => {
  try {
    const { type, title, description, location, region, severity = 50, metadata } = req.body;
    if (!type || !title || !location || !region) {
      return res.status(400).json({ error: 'Missing required fields: type, title, location, region' });
    }

    const id = `INC-${uuidv4().slice(0, 8)}`;
    const [lat, lng] = location;

    await Database.query(
      `INSERT INTO incidents (id, type, title, description, location_lat, location_lng, region, severity, status, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9)`,
      [id, type, title || '', description || '', lat, lng, region, severity || 50, JSON.stringify(metadata || {})]
    );

    const event = {
      id,
      type,
      title,
      description: description || '',
      location,
      region,
      severity: severity || 50,
      timestamp: new Date().toISOString(),
      metadata,
    };

    // Kafka (pour analytics, autres consumers)
    await produceIncident(event);

    // Redis Pub/Sub → Socket.io (temps réel < 2s)
    publishIncidentToRedis(event);

    res.status(201).json({ incident: event });
  } catch (error) {
    console.error('POST /incidents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id/resolve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await Database.query(
      'UPDATE incidents SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
      ['resolved', id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    publishIncidentToRedis({ id, status: 'resolved', timestamp: new Date().toISOString() });
    res.json({ id, status: 'resolved' });
  } catch (error) {
    console.error('PATCH /incidents/:id/resolve error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
