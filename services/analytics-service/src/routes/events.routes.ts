import { Router, Request, Response, NextFunction } from 'express';
import { ClickHouseClient } from '../config/clickhouse';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Track event (direct HTTP ingestion)
router.post('/track', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, sessionId, type, data, pageUrl, referrer } = req.body;

    const event = {
      event_id: uuidv4(),
      user_id: userId || 'anonymous',
      session_id: sessionId || '',
      event_type: type || 'unknown',
      event_data: JSON.stringify(data || {}),
      page_url: pageUrl || '',
      referrer: referrer || '',
      user_agent: req.get('user-agent') || '',
      ip_address: req.ip || '',
      created_at: new Date().toISOString(),
    };

    await ClickHouseClient.insert('user_events', [event]);
    res.status(202).json({ success: true, eventId: event.event_id });
  } catch (error) { next(error); }
});

// Batch track events
router.post('/track/batch', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { events } = req.body;
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ success: false, error: 'Events array required' });
    }

    const formattedEvents = events.map(e => ({
      event_id: e.eventId || uuidv4(),
      user_id: e.userId || 'anonymous',
      session_id: e.sessionId || '',
      event_type: e.type || 'unknown',
      event_data: JSON.stringify(e.data || {}),
      page_url: e.pageUrl || '',
      referrer: e.referrer || '',
      user_agent: e.userAgent || req.get('user-agent') || '',
      ip_address: e.ipAddress || req.ip || '',
      created_at: e.timestamp || new Date().toISOString(),
    }));

    await ClickHouseClient.insert('user_events', formattedEvents);
    res.status(202).json({ success: true, count: formattedEvents.length });
  } catch (error) { next(error); }
});

// Get user events
router.get('/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);

    const result = await ClickHouseClient.query(`
      SELECT * FROM user_events
      WHERE user_id = '${userId}'
      ORDER BY created_at DESC
      LIMIT ${limit}
    `);

    const data = await result.json();
    res.json({ success: true, data: data.data });
  } catch (error) { next(error); }
});

export default router;
