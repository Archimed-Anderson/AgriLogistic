import dotenv from 'dotenv';
import { Database } from '../src/config/database';

// Load test environment variables
dotenv.config({ path: '.env.test' });

process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || 'test_access_secret_key_for_jwt_tokens';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'test_refresh_secret_key_for_jwt_tokens';
process.env.JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
process.env.JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
process.env.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || '10';

// By default, run integration/security tests against the local Docker Compose stack.
// If you want to use a custom test database, set USE_DOCKER_DEFAULTS=false and provide DB_* env vars.
const useDockerDefaults =
  (process.env.USE_DOCKER_DEFAULTS || 'true').toLowerCase() !== 'false';
if (useDockerDefaults) {
  process.env.DB_HOST = 'localhost';
  // Docker maps container 5432 -> host POSTGRES_PORT (default 5435 in our compose)
  process.env.DB_PORT = process.env.DB_PORT || '5435';
  process.env.DB_NAME = 'AgriLogistic_auth';
  process.env.DB_USER = 'AgriLogistic';
  process.env.DB_PASSWORD = 'AgriLogistic_secure_2026';

  process.env.REDIS_HOST = 'localhost';
  process.env.REDIS_PORT = '6379';
  process.env.REDIS_PASSWORD = 'redis_secure_2026';
  process.env.REDIS_USE_PASSWORD = 'true';
} else {
  process.env.DB_HOST = process.env.DB_HOST || 'localhost';
  process.env.DB_PORT = process.env.DB_PORT || '5432';
  process.env.DB_NAME = process.env.DB_NAME || 'AgriLogistic_auth';
  process.env.DB_USER = process.env.DB_USER || 'AgriLogistic';
  process.env.DB_PASSWORD =
    process.env.DB_PASSWORD || 'AgriLogistic_secure_2026';
  process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
  process.env.REDIS_PORT = process.env.REDIS_PORT || '6379';
  process.env.REDIS_PASSWORD =
    process.env.REDIS_PASSWORD || 'redis_secure_2026';
  process.env.REDIS_USE_PASSWORD = process.env.REDIS_USE_PASSWORD || 'true';
}

// Global test timeout
jest.setTimeout(10000);

// Prevent open handle leaks from pooled connections in unit tests.
afterAll(async () => {
  await Database.close();
});

// Suppress console logs during tests (optional)
if (process.env.SUPPRESS_LOGS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}
