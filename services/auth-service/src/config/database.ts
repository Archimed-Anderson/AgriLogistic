import { Pool, PoolConfig } from 'pg';

export class Database {
  private static instance: Pool;

  static getInstance(): Pool {
    if (!Database.instance) {
      const password = process.env.DB_PASSWORD;
      
      if (!password || password.trim() === '' || password === 'your_secure_db_password') {
        console.error('❌ DB_PASSWORD is not set or is a placeholder value');
        console.error('💡 Please set DB_PASSWORD in your .env file');
        console.error('💡 Or use Docker Compose: docker-compose up -d');
        throw new Error('Database password is not configured. Please set DB_PASSWORD in .env file.');
      }

      const config: PoolConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'AgroLogistic_auth',
        user: process.env.DB_USER || 'AgroLogistic',
        password: password,
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
