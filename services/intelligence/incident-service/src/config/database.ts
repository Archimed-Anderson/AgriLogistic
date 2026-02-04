import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5435'),
  database: process.env.DB_NAME || 'AgriLogistic_orders',
  user: process.env.DB_USER || 'AgriLogistic',
  password: process.env.DB_PASSWORD || 'AgriLogistic_secure_2026',
  max: parseInt(process.env.DB_POOL_SIZE || '10'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export class Database {
  static async initialize(): Promise<boolean> {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('✅ Database connected');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  static async isHealthy(): Promise<boolean> {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch {
      return false;
    }
  }

  static async query(text: string, params?: any[]) {
    return pool.query(text, params);
  }

  static async close(): Promise<void> {
    await pool.end();
    console.log('Database closed');
  }
}
