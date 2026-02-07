import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export type SwaggerConfigOptions = {
  title: string;
  description: string;
  version?: string;
  path?: string; // default: 'docs'
};

/**
 * Configure et initialise Swagger UI pour un microservice
 * @param app L'instance de l'application NestJS
 * @param options Options de configuration (titre, description)
 */
export function setupSwagger(app: INestApplication, options: SwaggerConfigOptions): void {
  const config = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(options.description)
    .setVersion(options.version || '1.0')
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT',
        description: 'Enter JWT token'
      },
      'access-token', // Nom de référence interne pour @ApiBearerAuth()
    )
    .addTag('Health', 'Service Health Checks')
    .build();

  const path = options.path || 'docs'; // ex: /api/docs ou /docs
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Garde le token après refresh
      displayRequestDuration: true,
      filter: true, // Barre de recherche
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: `${options.title} API Documentation`
  });
}
