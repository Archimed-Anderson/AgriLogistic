import { createClient, ClickHouseClient as CHClient } from '@clickhouse/client';

let client: CHClient | null = null;
let isConnected = false;

export class ClickHouseClient {
  static async initialize(): Promise<void> {
    try {
      const host = process.env.CLICKHOUSE_URL || 'http://localhost:8123';
      const database = process.env.CLICKHOUSE_DB || 'AgroLogistic_analytics';
      const username = process.env.CLICKHOUSE_USER;
      const password = process.env.CLICKHOUSE_PASSWORD;

      // ClickHouse dev containers often run without HTTP auth.
      // Passing username/password triggers an Authorization header, which can fail when auth is disabled.
      const useAuth = !!(username && password && password.length > 0);

      client = createClient({
        host,
        database,
        ...(useAuth ? { username, password } : {}),
      });

      // Test connection
      await client.query({ query: 'SELECT 1' });
      isConnected = true;
      console.log('✅ ClickHouse connected');

      // Create tables if not exist
      await this.createTables();
    } catch (error) {
      console.error('❌ ClickHouse connection failed:', error);
    }
  }

  static async isHealthy(): Promise<boolean> {
    if (!client) return false;
    try {
      await client.query({ query: 'SELECT 1' });
      return true;
    } catch { return false; }
  }

  static async query(sql: string, params?: Record<string, any>): Promise<any> {
    if (!client) throw new Error('ClickHouse not initialized');
    return client.query({ query: sql, query_params: params });
  }

  static async insert(table: string, values: any[]): Promise<void> {
    if (!client || values.length === 0) return;
    await client.insert({ table, values, format: 'JSONEachRow' });
  }

  static async close(): Promise<void> {
    if (client) {
      await client.close();
      isConnected = false;
      console.log('ClickHouse closed');
    }
  }

  private static async createTables(): Promise<void> {
    // User events table
    await client!.query({
      query: `
        CREATE TABLE IF NOT EXISTS user_events (
          event_id UUID,
          user_id String,
          session_id String,
          event_type LowCardinality(String),
          event_data String,
          page_url String,
          referrer String,
          user_agent String,
          ip_address String,
          created_at DateTime DEFAULT now()
        )
        ENGINE = MergeTree()
        PARTITION BY toYYYYMM(created_at)
        ORDER BY (user_id, created_at)
      `
    });

    // Product views aggregation
    await client!.query({
      query: `
        CREATE TABLE IF NOT EXISTS product_views_daily (
          date Date,
          product_id String,
          views UInt64,
          unique_users UInt64
        )
        ENGINE = SummingMergeTree()
        PARTITION BY toYYYYMM(date)
        ORDER BY (date, product_id)
      `
    });

    // Sales aggregation
    await client!.query({
      query: `
        CREATE TABLE IF NOT EXISTS sales_daily (
          date Date,
          product_id String,
          category String,
          total_quantity UInt64,
          total_revenue Float64,
          order_count UInt64
        )
        ENGINE = SummingMergeTree()
        PARTITION BY toYYYYMM(date)
        ORDER BY (date, product_id)
      `
    });

    // Incident events (War Room - topic Kafka incident-events)
    await client!.query({
      query: `
        CREATE TABLE IF NOT EXISTS incident_events (
          incident_id String,
          type LowCardinality(String),
          severity UInt8,
          region String,
          location_lat Float64,
          location_lng Float64,
          title String,
          created_at DateTime DEFAULT now()
        )
        ENGINE = MergeTree()
        PARTITION BY toYYYYMM(created_at)
        ORDER BY (type, created_at)
      `
    });

    console.log('✅ ClickHouse tables created');
  }
}

export default ClickHouseClient;
