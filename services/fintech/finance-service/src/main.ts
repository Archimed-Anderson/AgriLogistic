import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  
  const port = process.env.PORT || 3009;
  await app.listen(port);
  Logger.log(`🚀 Finance Service is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
