import { Request, Response, NextFunction } from 'express';

const metrics = {
  http_requests_total: new Map<string, number>(),
  deliveries_created_total: 0,
  deliveries_completed_total: 0,
  gps_updates_total: 0,
};

export const metricsMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const key = `${req.method}_${req.route?.path || req.path}`;
  metrics.http_requests_total.set(key, (metrics.http_requests_total.get(key) || 0) + 1);
  next();
};

export const incrementDeliveriesCreated = () => { metrics.deliveries_created_total++; };
export const incrementDeliveriesCompleted = () => { metrics.deliveries_completed_total++; };
export const incrementGpsUpdates = () => { metrics.gps_updates_total++; };

export const metricsEndpoint = (_req: Request, res: Response) => {
  let output = '# HELP http_requests_total Total HTTP requests\n# TYPE http_requests_total counter\n';
  metrics.http_requests_total.forEach((count, key) => {
    output += `http_requests_total{key="${key}",service="delivery"} ${count}\n`;
  });
  output += `\ndeliveries_created_total{service="delivery"} ${metrics.deliveries_created_total}\n`;
  output += `deliveries_completed_total{service="delivery"} ${metrics.deliveries_completed_total}\n`;
  output += `gps_updates_total{service="delivery"} ${metrics.gps_updates_total}\n`;
  res.set('Content-Type', 'text/plain').send(output);
};
