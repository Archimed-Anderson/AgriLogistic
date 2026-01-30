import { Request, Response, NextFunction } from 'express';

// Simple in-memory metrics (in production, use prom-client)
const metrics = {
  http_requests_total: new Map<string, number>(),
  http_request_duration_seconds: [] as number[],
  orders_created_total: 0,
  orders_failed_total: 0,
  orders_completed_total: 0,
};

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const key = `${req.method}_${req.route?.path || req.path}_${res.statusCode}`;
    
    metrics.http_requests_total.set(
      key,
      (metrics.http_requests_total.get(key) || 0) + 1
    );
    metrics.http_request_duration_seconds.push(duration);
    
    // Keep only last 1000 measurements
    if (metrics.http_request_duration_seconds.length > 1000) {
      metrics.http_request_duration_seconds.shift();
    }
  });

  next();
};

export const incrementOrdersCreated = () => {
  metrics.orders_created_total++;
};

export const incrementOrdersFailed = () => {
  metrics.orders_failed_total++;
};

export const incrementOrdersCompleted = () => {
  metrics.orders_completed_total++;
};

export const metricsEndpoint = (_req: Request, res: Response) => {
  let output = '# HELP http_requests_total Total number of HTTP requests\n';
  output += '# TYPE http_requests_total counter\n';
  
  metrics.http_requests_total.forEach((count, key) => {
    const [method, path, status] = key.split('_');
    output += `http_requests_total{method="${method}",path="${path}",status="${status}",service="order"} ${count}\n`;
  });

  output += '\n# HELP http_request_duration_seconds HTTP request duration in seconds\n';
  output += '# TYPE http_request_duration_seconds histogram\n';
  
  if (metrics.http_request_duration_seconds.length > 0) {
    const sorted = [...metrics.http_request_duration_seconds].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)] || 0;
    const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
    const p99 = sorted[Math.floor(sorted.length * 0.99)] || 0;
    
    output += `http_request_duration_seconds{quantile="0.5",service="order"} ${p50}\n`;
    output += `http_request_duration_seconds{quantile="0.95",service="order"} ${p95}\n`;
    output += `http_request_duration_seconds{quantile="0.99",service="order"} ${p99}\n`;
  }

  output += '\n# HELP orders_created_total Total number of orders created\n';
  output += '# TYPE orders_created_total counter\n';
  output += `orders_created_total{service="order"} ${metrics.orders_created_total}\n`;

  output += '\n# HELP orders_failed_total Total number of failed orders\n';
  output += '# TYPE orders_failed_total counter\n';
  output += `orders_failed_total{service="order"} ${metrics.orders_failed_total}\n`;

  output += '\n# HELP orders_completed_total Total number of completed orders\n';
  output += '# TYPE orders_completed_total counter\n';
  output += `orders_completed_total{service="order"} ${metrics.orders_completed_total}\n`;

  res.set('Content-Type', 'text/plain');
  res.send(output);
};
