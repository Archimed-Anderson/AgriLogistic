import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * Prisma Configuration for Auth Service
 * 
 * In Prisma 7+, database connection URLs must be configured here
 * instead of in schema.prisma. This allows for better environment
 * variable management and flexibility.
 * 
 * The configuration supports both:
 * - Direct DATABASE_URL environment variable
 * - Individual DB_* variables (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
 */

/**
 * Builds DATABASE_URL from individual environment variables
 * Falls back to DATABASE_URL if provided directly
 */
function getDatabaseUrl(): string {
  // If DATABASE_URL is explicitly set, use it
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Otherwise, construct it from individual variables
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME || 'AgriLogistic_auth';
  const user = process.env.DB_USER || 'AgriLogistic';
  const password = process.env.DB_PASSWORD || 'AgriLogistic_secure_2026';

  // Construct PostgreSQL connection URL
  return `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;
}

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: getDatabaseUrl(),
  },
});


