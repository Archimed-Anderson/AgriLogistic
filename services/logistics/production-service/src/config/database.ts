import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://AgriLogistic:AgriLogistic_secure_2026@localhost:5435/productions_db',
  max: 10,
  idleTimeoutMillis: 30000,
});

export async function initDatabase(): Promise<void> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ Productions DB connected');
  } catch (err) {
    console.error('❌ Productions DB connection failed:', err);
    throw err;
  }
}
