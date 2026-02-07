/**
 * 🔒 Configuration Interfaces
 * Type-safe environment variables
 */

export interface DatabaseConfig {
  url: string;
  poolSize: number;
  ssl: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface AppConfig {
  nodeEnv: 'development' | 'staging' | 'production' | 'test';
  port: number;
  corsOrigin: string | string[];
  apiPrefix: string;
}

export interface CloudConfig {
  r2AccountId?: string;
  r2AccessKey?: string;
  r2SecretKey?: string;
  r2BucketName?: string;
}

export interface MonitoringConfig {
  slackWebhook?: string;
  pagerdutyKey?: string;
  sentryDsn?: string;
}

/**
 * Configuration globale complète
 */
export interface AgroDeepConfig {
  app: AppConfig;
  database: DatabaseConfig;
  redis?: RedisConfig;
  jwt: JwtConfig;
  cloud?: CloudConfig;
  monitoring?: MonitoringConfig;
}
