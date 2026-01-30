/**
 * Shared Metrics Middleware for Microservices
 * Provides Prometheus-compatible metrics for all services
 * 
 * Features:
 * - HTTP request counters with labels
 * - Request duration histograms
 * - Custom business metrics support
 * - Prometheus exposition format
 */

import { Request, Response, NextFunction } from 'express';

// Types
interface HttpMetric {
  method: string;
  path: string;
  status: number;
  count: number;
  totalDuration: number;
}

interface HistogramBucket {
  le: number;
  count: number;
}

interface MetricsConfig {
  serviceName: string;
  customMetrics?: Record<string, number>;
}

// Metrics storage
class MetricsRegistry {
  private serviceName: string;
  private httpRequests: Map<string, HttpMetric> = new Map();
  private requestDurations: Map<string, HistogramBucket[]> = new Map();
  private customCounters: Map<string, number> = new Map();
  private customGauges: Map<string, number> = new Map();
  private startTime: number;
  
  // Histogram buckets for request duration (in seconds)
  private readonly durationBuckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];
  
  constructor(config: MetricsConfig) {
    this.serviceName = config.serviceName;
    this.startTime = Date.now();
    
    // Initialize custom metrics
    if (config.customMetrics) {
      Object.entries(config.customMetrics).forEach(([name, value]) => {
        this.customCounters.set(name, value);
      });
    }
  }
  
  recordRequest(method: string, path: string, statusCode: number, durationMs: number): void {
    const key = `${method}:${path}:${statusCode}`;
    
    // Update request counter
    const existing = this.httpRequests.get(key) || {
      method,
      path: this.normalizePath(path),
      status: statusCode,
      count: 0,
      totalDuration: 0,
    };
    
    existing.count++;
    existing.totalDuration += durationMs;
    this.httpRequests.set(key, existing);
    
    // Update histogram
    const histKey = `${method}:${this.normalizePath(path)}`;
    if (!this.requestDurations.has(histKey)) {
      this.requestDurations.set(histKey, this.durationBuckets.map(le => ({ le, count: 0 })));
    }
    
    const durationSec = durationMs / 1000;
    const buckets = this.requestDurations.get(histKey)!;
    buckets.forEach(bucket => {
      if (durationSec <= bucket.le) {
        bucket.count++;
      }
    });
  }
  
  incrementCounter(name: string, value: number = 1): void {
    this.customCounters.set(name, (this.customCounters.get(name) || 0) + value);
  }
  
  setGauge(name: string, value: number): void {
    this.customGauges.set(name, value);
  }
  
  private normalizePath(path: string): string {
    // Normalize paths with IDs to be grouped
    return path
      .replace(/\/[0-9a-f]{24}/gi, '/:id')  // MongoDB ObjectIDs
      .replace(/\/[0-9a-f-]{36}/gi, '/:uuid')  // UUIDs
      .replace(/\/\d+/g, '/:id');  // Numeric IDs
  }
  
  toPrometheusFormat(): string {
    const lines: string[] = [];
    
    // Process uptime
    const uptimeSeconds = (Date.now() - this.startTime) / 1000;
    lines.push(`# HELP process_uptime_seconds Process uptime in seconds`);
    lines.push(`# TYPE process_uptime_seconds gauge`);
    lines.push(`process_uptime_seconds{service="${this.serviceName}"} ${uptimeSeconds}`);
    lines.push('');
    
    // HTTP requests total
    lines.push('# HELP http_requests_total Total number of HTTP requests');
    lines.push('# TYPE http_requests_total counter');
    this.httpRequests.forEach((metric) => {
      const statusClass = Math.floor(metric.status / 100) + 'xx';
      lines.push(
        `http_requests_total{service="${this.serviceName}",method="${metric.method}",path="${metric.path}",status="${metric.status}",status_class="${statusClass}"} ${metric.count}`
      );
    });
    lines.push('');
    
    // Request duration histogram
    lines.push('# HELP http_request_duration_seconds HTTP request latency in seconds');
    lines.push('# TYPE http_request_duration_seconds histogram');
    this.requestDurations.forEach((buckets, key) => {
      const [method, path] = key.split(':');
      let cumulative = 0;
      
      buckets.forEach(bucket => {
        cumulative += bucket.count;
        lines.push(
          `http_request_duration_seconds_bucket{service="${this.serviceName}",method="${method}",path="${path}",le="${bucket.le}"} ${cumulative}`
        );
      });
      lines.push(
        `http_request_duration_seconds_bucket{service="${this.serviceName}",method="${method}",path="${path}",le="+Inf"} ${cumulative}`
      );
      
      // Calculate sum and count
      const metric = Array.from(this.httpRequests.values())
        .find(m => m.method === method && m.path === path);
      if (metric) {
        lines.push(
          `http_request_duration_seconds_sum{service="${this.serviceName}",method="${method}",path="${path}"} ${metric.totalDuration / 1000}`
        );
        lines.push(
          `http_request_duration_seconds_count{service="${this.serviceName}",method="${method}",path="${path}"} ${metric.count}`
        );
      }
    });
    lines.push('');
    
    // Custom counters
    if (this.customCounters.size > 0) {
      lines.push('# Custom business metrics');
      this.customCounters.forEach((value, name) => {
        lines.push(`# HELP ${name} Custom counter metric`);
        lines.push(`# TYPE ${name} counter`);
        lines.push(`${name}{service="${this.serviceName}"} ${value}`);
      });
      lines.push('');
    }
    
    // Custom gauges
    if (this.customGauges.size > 0) {
      this.customGauges.forEach((value, name) => {
        lines.push(`# HELP ${name} Custom gauge metric`);
        lines.push(`# TYPE ${name} gauge`);
        lines.push(`${name}{service="${this.serviceName}"} ${value}`);
      });
      lines.push('');
    }
    
    // Node.js process metrics
    const memUsage = process.memoryUsage();
    lines.push('# HELP nodejs_heap_size_bytes Node.js heap size');
    lines.push('# TYPE nodejs_heap_size_bytes gauge');
    lines.push(`nodejs_heap_size_bytes{service="${this.serviceName}",type="used"} ${memUsage.heapUsed}`);
    lines.push(`nodejs_heap_size_bytes{service="${this.serviceName}",type="total"} ${memUsage.heapTotal}`);
    
    return lines.join('\n');
  }
}

// Singleton registry instance
let registry: MetricsRegistry | null = null;

export function initializeMetrics(config: MetricsConfig): MetricsRegistry {
  registry = new MetricsRegistry(config);
  return registry;
}

export function getMetricsRegistry(): MetricsRegistry | null {
  return registry;
}

// Express middleware
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!registry) {
    return next();
  }
  
  const startTime = Date.now();
  
  // Override res.end to capture metrics
  const originalEnd = res.end.bind(res);
  res.end = function(this: Response, ...args: any[]): Response {
    const duration = Date.now() - startTime;
    registry!.recordRequest(req.method, req.route?.path || req.path, res.statusCode, duration);
    return originalEnd(...args);
  } as any;
  
  next();
}

// Metrics endpoint handler
export function metricsEndpoint(_req: Request, res: Response): void {
  if (!registry) {
    res.status(503).send('Metrics not initialized');
    return;
  }
  
  res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.send(registry.toPrometheusFormat());
}

// Utility functions for business metrics
export function incrementMetric(name: string, value: number = 1): void {
  registry?.incrementCounter(name, value);
}

export function setMetricGauge(name: string, value: number): void {
  registry?.setGauge(name, value);
}
