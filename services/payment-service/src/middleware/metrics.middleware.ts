import { Request, Response, NextFunction } from 'express';

// Simple in-memory metrics
const metrics = {
  http_requests_total: new Map<string, number>(),
  http_request_duration_seconds: [] as number[],
  payments_processed_total: 0,
  payments_failed_total: 0,
  refunds_processed_total: 0,
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
    
    if (metrics.http_request_duration_seconds.length > 1000) {
      metrics.http_request_duration_seconds.shift();
    }
  });

  next();
};

export const incrementPaymentsProcessed = () => {
  metrics.payments_processed_total++;
};

export const incrementPaymentsFailed = () => {
  metrics.payments_failed_total++;
};

export const incrementRefundsProcessed = () => {
  metrics.refunds_processed_total++;
};

export const metricsEndpoint = (_req: Request, res: Response) => {
  let output = '# HELP http_requests_total Total number of HTTP requests\n';
  output += '# TYPE http_requests_total counter\n';
  
  metrics.http_requests_total.forEach((count, key) => {
    const [method, path, status] = key.split('_');
    output += `http_requests_total{method="${method}",path="${path}",status="${status}",service="payment"} ${count}\n`;
  });

  output += '\n# HELP http_request_duration_seconds HTTP request duration\n';
  output += '# TYPE http_request_duration_seconds histogram\n';
  
  if (metrics.http_request_duration_seconds.length > 0) {
    const sorted = [...metrics.http_request_duration_seconds].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)] || 0;
    const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
    const p99 = sorted[Math.floor(sorted.length * 0.99)] || 0;
    
    output += `http_request_duration_seconds{quantile="0.5",service="payment"} ${p50}\n`;
    output += `http_request_duration_seconds{quantile="0.95",service="payment"} ${p95}\n`;
    output += `http_request_duration_seconds{quantile="0.99",service="payment"} ${p99}\n`;
  }

  output += '\n# HELP payments_processed_total Total payments processed\n';
  output += '# TYPE payments_processed_total counter\n';
  output += `payments_processed_total{service="payment"} ${metrics.payments_processed_total}\n`;

  output += '\n# HELP payments_failed_total Total failed payments\n';
  output += '# TYPE payments_failed_total counter\n';
  output += `payments_failed_total{service="payment"} ${metrics.payments_failed_total}\n`;

  output += '\n# HELP refunds_processed_total Total refunds processed\n';
  output += '# TYPE refunds_processed_total counter\n';
  output += `refunds_processed_total{service="payment"} ${metrics.refunds_processed_total}\n`;

  res.set('Content-Type', 'text/plain');
  res.send(output);
};
