/** OpenTelemetry tracing (à charger avant tout autre module applicatif) */
import '@agrologistic/microservice-core/tracing';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  
  const port = process.env.PORT || 3004;
  await app.listen(port);
  console.log(`🚀 Mission Service is running on: http://localhost:${port}`);
}
bootstrap();
