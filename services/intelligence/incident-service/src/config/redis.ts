import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;
let subscriber: RedisClientType | null = null;

const REDIS_URL = `redis://:${process.env.REDIS_PASSWORD || 'redis_secure_2026'}@${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

export class RedisClient {
  static async initialize(): Promise<boolean> {
    try {
      client = createClient({ url: REDIS_URL });
      client.on('error', (err) => console.error('Redis Error:', err));
      await client.connect();
      console.log('✅ Redis connected');
      return true;
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      return false;
    }
  }

  static async initSubscriber(): Promise<RedisClientType | null> {
    try {
      subscriber = createClient({ url: REDIS_URL });
      subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));
      await subscriber.connect();
      console.log('✅ Redis Subscriber connected');
      return subscriber;
    } catch (error) {
      console.error('❌ Redis Subscriber failed:', error);
      return null;
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

  static getClient(): RedisClientType | null {
    return client;
  }

  static getSubscriber(): RedisClientType | null {
    return subscriber;
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

  static async publish(channel: string, message: string): Promise<number> {
    if (!client) return 0;
    return client.publish(channel, message);
  }

  static async close(): Promise<void> {
    if (subscriber) {
      await subscriber.quit();
      subscriber = null;
    }
    if (client) {
      await client.quit();
      client = null;
    }
    console.log('Redis closed');
  }
}
