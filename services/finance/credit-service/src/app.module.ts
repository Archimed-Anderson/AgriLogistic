import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Controllers
import { CreditController } from './controllers/credit.controller';

// Services
import { ScoringService } from './services/scoring.service';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { ApiKeyGuard } from './guards/api-key.guard';

// Interceptors
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';

// Filters
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

// Validation
import { ValidationPipe } from '@nestjs/common';

/**
 * AgriCredit Application Module
 * 
 * Main module that orchestrates all application components:
 * - Configuration management
 * - Database connections
 * - Controllers and services
 * - Global guards and interceptors
 * - Error handling
 */
@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
      expandVariables: true,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),

    // Database Module (Prisma is initialized in services)
    // PrismaModule would go here if we create a separate module

    // Redis Module (for caching)
    // RedisModule would go here if we create a separate module

    // Metrics Module (Prometheus)
    // MetricsModule would go here if we create a separate module
  ],

  controllers: [
    CreditController,
    // Add more controllers here as they're created
  ],

  providers: [
    // Services
    ScoringService,

    // Global Guards (applied to all routes)
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    // JwtAuthGuard can be applied selectively with @UseGuards()

    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },

    // Global Exception Filters
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    // Validation Pipe (global)
    {
      provide: 'APP_PIPE',
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
  ],

  exports: [
    ScoringService,
    // Export services that might be used by other modules
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    this.logConfiguration();
  }

  /**
   * Log important configuration on startup
   */
  private logConfiguration() {
    const env = this.configService.get<string>('NODE_ENV');
    const port = this.configService.get<number>('PORT');
    const mlVersion = this.configService.get<string>('ML_MODEL_VERSION');

    console.log('🚀 AgriCredit Service Configuration:');
    console.log(`   Environment: ${env}`);
    console.log(`   Port: ${port}`);
    console.log(`   ML Model Version: ${mlVersion}`);
    console.log(`   Cache Enabled: ${this.configService.get<boolean>('CACHE_ENABLED')}`);
    console.log(`   Rate Limiting: ${this.configService.get<boolean>('RATE_LIMIT_ENABLED')}`);
  }
}
