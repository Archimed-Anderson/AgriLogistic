import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export class RedisClient {
  static async initialize(): Promise<boolean> {
    try {
      client = createClient({
        url: `redis://:${process.env.REDIS_PASSWORD || 'redis_secure_2026'}@${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
      });

      client.on('error', (err) => console.error('Redis Client Error:', err));
      await client.connect();
      console.log('✅ Redis connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      return false;
    }
  }

  static async isHealthy(): Promise<boolean> {
    try {
      if (!client) return false;
      await client.ping();
      return true;
    } catch {
      return false;
    }
  }

  static async get(key: string): Promise<string | null> {
    if (!client) return null;
    return client.get(key);
  }

  static async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!client) return;
    if (ttlSeconds) await client.setEx(key, ttlSeconds, value);
    else await client.set(key, value);
  }

  static async del(key: string): Promise<void> {
    if (!client) return;
    await client.del(key);
  }

  static async close(): Promise<void> {
    if (!client) return;
    await client.quit();
    console.log('Redis connection closed');
  }
}

export default RedisClient;

