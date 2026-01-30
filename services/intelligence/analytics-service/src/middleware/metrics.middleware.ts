import { Request, Response, NextFunction } from 'express';

const metrics = {
  http_requests_total: new Map<string, number>(),
  events_ingested_total: 0,
  queries_total: 0,
};

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    const key = `${req.method}_${req.route?.path || req.path}_${res.statusCode}`;
    metrics.http_requests_total.set(key, (metrics.http_requests_total.get(key) || 0) + 1);
  });
  next();
};

export const incrementEventsIngested = (count = 1) => { metrics.events_ingested_total += count; };
export const incrementQueries = () => { metrics.queries_total++; };

export const metricsEndpoint = (_req: Request, res: Response) => {
  let output = '# HELP http_requests_total Total HTTP requests\n# TYPE http_requests_total counter\n';
  metrics.http_requests_total.forEach((count, key) => {
    output += `http_requests_total{key="${key}",service="analytics"} ${count}\n`;
  });
  output += `\nevents_ingested_total{service="analytics"} ${metrics.events_ingested_total}\n`;
  output += `queries_total{service="analytics"} ${metrics.queries_total}\n`;
  res.set('Content-Type', 'text/plain').send(output);
};
