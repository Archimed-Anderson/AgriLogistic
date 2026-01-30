import { Pool, PoolConfig } from 'pg';

export class Database {
  private static instance: Pool | undefined;

  static getInstance(): Pool {
    if (!Database.instance) {
      let password = process.env.DB_PASSWORD;
      
      if (!password || password.trim() === '' || password === 'your_secure_db_password') {
        if (process.env.NODE_ENV === 'production') {
          console.error('âŒ DB_PASSWORD is not set or is a placeholder value');
          console.error('ðŸ’¡ Please set DB_PASSWORD in your .env file');
          console.error('ðŸ’¡ Or use Docker Compose: docker-compose up -d');
          throw new Error('Database password is not configured. Please set DB_PASSWORD in .env file.');
        }

        // Developer-friendly fallback: allow service to start without a configured DB password.
        // The connection will fail until proper env vars are provided (health will reflect it).
        console.warn(
          '[auth-service] DB_PASSWORD missing; using a development fallback password. ' +
            'Set DB_PASSWORD (and DB_HOST/DB_USER/DB_NAME) in your .env to connect to Postgres.'
        );
        password = 'dev_password';
      }

      const config: PoolConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'AgriLogistic_auth',
        user: process.env.DB_USER || 'AgriLogistic',
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
        console.log('âœ… Database connected successfully');
      });
    }

    return Database.instance;
  }

  static async close(): Promise<void> {
    if (Database.instance) {
      const instance = Database.instance;
      Database.instance = undefined;
      await instance.end();
      console.log('Database connection closed');
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      const pool = Database.getInstance();
      const result = await pool.query('SELECT NOW()');
      console.log('âœ… Database connection test successful:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('âŒ Database connection test failed:', error);
      return false;
    }
  }
}


