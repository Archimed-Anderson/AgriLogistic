import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

/**
 * Bootstrap the AgriCredit application
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create NestJS application
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    cors: true, // Will be configured below
  });

  // Get configuration service
  const configService = app.get(ConfigService);

  // ============================================================================
  // Global Prefix
  // ============================================================================
  app.setGlobalPrefix('api/v1');

  // ============================================================================
  // Security Middleware
  // ============================================================================
  if (configService.get<boolean>('HELMET_ENABLED', true)) {
    app.use(helmet());
    logger.log('✅ Helmet security enabled');
  }

  // ============================================================================
  // Compression
  // ============================================================================
  if (configService.get<boolean>('COMPRESSION_ENABLED', true)) {
    app.use(compression());
    logger.log('✅ Response compression enabled');
  }

  // ============================================================================
  // CORS Configuration
  // ============================================================================
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');
  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: configService.get<boolean>('CORS_CREDENTIALS', true),
    methods: configService.get<string>('CORS_METHODS', 'GET,POST,PUT,DELETE,OPTIONS').split(','),
    allowedHeaders: configService.get<string>('CORS_HEADERS', 'Content-Type,Authorization').split(','),
  });
  logger.log(`✅ CORS enabled for: ${corsOrigin}`);

  // ============================================================================
  // Request Logging
  // ============================================================================
  const logFormat = configService.get<string>('LOG_FORMAT', 'combined');
  app.use(morgan(logFormat));

  // ============================================================================
  // Global Validation Pipe
  // ============================================================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: configService.get<string>('NODE_ENV') === 'production',
    }),
  );
  logger.log('✅ Global validation pipe configured');

  // ============================================================================
  // Swagger API Documentation
  // ============================================================================
  if (configService.get<boolean>('SWAGGER_ENABLED', true)) {
    const config = new DocumentBuilder()
      .setTitle('AgriCredit API')
      .setDescription('ML-based credit scoring system for farmers')
      .setVersion('1.0.0')
      .addTag('credit', 'Credit scoring endpoints')
      .addTag('loans', 'Loan management endpoints')
      .addTag('health', 'Health check endpoints')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addApiKey(
        {
          type: 'apiKey',
          name: 'X-API-Key',
          in: 'header',
          description: 'API Key for authentication',
        },
        'API-Key',
      )
      .addServer('http://localhost:3008', 'Local Development')
      .addServer('https://api.agrilogistic.com', 'Production')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
      },
    });

    logger.log('✅ Swagger documentation available at /api/docs');
  }

  // ============================================================================
  // Graceful Shutdown
  // ============================================================================
  app.enableShutdownHooks();

  process.on('SIGTERM', async () => {
    logger.log('⚠️  SIGTERM signal received: closing HTTP server');
    await app.close();
    logger.log('✅ HTTP server closed');
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.log('⚠️  SIGINT signal received: closing HTTP server');
    await app.close();
    logger.log('✅ HTTP server closed');
    process.exit(0);
  });

  // ============================================================================
  // Start Server
  // ============================================================================
  const port = configService.get<number>('PORT', 3008);
  const host = configService.get<string>('HOST', '0.0.0.0');

  await app.listen(port, host);

  // ============================================================================
  // Startup Banner
  // ============================================================================
  const appUrl = await app.getUrl();
  
  logger.log('');
  logger.log('═══════════════════════════════════════════════════════════');
  logger.log('🏦  AgriCredit Service Started Successfully');
  logger.log('═══════════════════════════════════════════════════════════');
  logger.log(`🌍  Environment: ${configService.get<string>('NODE_ENV')}`);
  logger.log(`🚀  Application URL: ${appUrl}`);
  logger.log(`📚  API Documentation: ${appUrl}/api/docs`);
  logger.log(`❤️   Health Check: ${appUrl}/api/v1/credit/health`);
  logger.log(`🤖  ML Model Version: ${configService.get<string>('ML_MODEL_VERSION')}`);
  logger.log('═══════════════════════════════════════════════════════════');
  logger.log('');

  // ============================================================================
  // Environment Warnings
  // ============================================================================
  if (configService.get<string>('NODE_ENV') === 'production') {
    if (configService.get<string>('JWT_SECRET') === 'your-super-secret-jwt-key-change-this-in-production') {
      logger.warn('⚠️  WARNING: Using default JWT_SECRET in production!');
    }
    if (!configService.get<string>('SENTRY_DSN')) {
      logger.warn('⚠️  WARNING: Sentry DSN not configured - error tracking disabled');
    }
  }

  // ============================================================================
  // Feature Flags Status
  // ============================================================================
  logger.log('📋 Feature Flags:');
  logger.log(`   Batch Scoring: ${configService.get<boolean>('FEATURE_BATCH_SCORING', true) ? '✅' : '❌'}`);
  logger.log(`   Auto Recalculate: ${configService.get<boolean>('FEATURE_AUTO_RECALCULATE', true) ? '✅' : '❌'}`);
  logger.log(`   Loan Recommendations: ${configService.get<boolean>('FEATURE_LOAN_RECOMMENDATIONS', true) ? '✅' : '❌'}`);
  logger.log(`   Analytics: ${configService.get<boolean>('FEATURE_ANALYTICS', true) ? '✅' : '❌'}`);
  logger.log('');
}

// ============================================================================
// Error Handling
// ============================================================================
bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('❌ Failed to start application:', error);
  process.exit(1);
});
