import { Pool, PoolConfig } from 'pg';

export class Database {
  private static instance: Pool;

  static getInstance(): Pool {
    if (!Database.instance) {
      const config: PoolConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'AgroLogistic_products',
        user: process.env.DB_USER || 'AgroLogistic',
        password: process.env.DB_PASSWORD,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };

      Database.instance = new Pool(config);

      Database.instance.on('error', (err) => {
        console.error('Unexpected database error:', err);
      });

      Database.instance.on('connect', () => {
        console.log('✅ Database connected successfully');
      });
    }

    return Database.instance;
  }

  static async close(): Promise<void> {
    if (Database.instance) {
      await Database.instance.end();
      console.log('Database connection closed');
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      const pool = Database.getInstance();
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Database connection test successful:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      return false;
    }
  }
}
