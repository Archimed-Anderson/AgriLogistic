/**
 * 🛡️ FORCE FIELD RESTORATION - Middleware de Validation Global
 * 
 * Objectif: Validation stricte de tous les inputs avec class-validator
 * Usage: Importer dans main.ts de chaque service NestJS
 */

import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

/**
 * 🔒 Configuration de validation globale
 * 
 * Utilise class-validator et class-transformer pour:
 * - Valider tous les DTOs
 * - Transformer les types automatiquement
 * - Rejeter les propriétés inconnues
 * - Fournir des messages d'erreur détaillés
 */
export const globalValidationPipe = new ValidationPipe({
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TRANSFORMATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Transforme automatiquement les payloads en instances de DTO
   * Exemple: "123" → 123 pour un @IsNumber()
   */
  transform: true,
  
  /**
   * Transforme implicitement les types primitifs
   * Exemple: query params string → number si décoré avec @Type(() => Number)
   */
  transformOptions: {
    enableImplicitConversion: true,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // VALIDATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Rejette les requêtes avec des propriétés non définies dans le DTO
   * Prévient les attaques par injection de propriétés
   */
  whitelist: true,
  
  /**
   * Lance une erreur si des propriétés non whitelistées sont présentes
   * Plus strict que whitelist seul
   */
  forbidNonWhitelisted: true,
  
  /**
   * Supprime les propriétés vides (undefined, null)
   * Utile pour les updates partiels
   */
  skipMissingProperties: false,
  
  /**
   * Valide les objets imbriqués
   * Nécessite @ValidateNested() dans le DTO
   */
  validateCustomDecorators: true,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MESSAGES D'ERREUR
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Formatte les erreurs de validation en réponse HTTP 400
   * Fournit des messages détaillés pour le debugging
   */
  exceptionFactory: (errors: ValidationError[]) => {
    const formattedErrors = formatValidationErrors(errors);
    
    return new BadRequestException({
      statusCode: 400,
      message: 'Validation failed',
      errors: formattedErrors,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Arrête à la première erreur (false) ou collecte toutes les erreurs (true)
   * true = meilleure UX (affiche toutes les erreurs en une fois)
   */
  stopAtFirstError: false,
});

/**
 * 📝 Formatte les erreurs de validation en structure lisible
 */
function formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  errors.forEach((error) => {
    const field = error.property;
    const constraints = error.constraints;

    if (constraints) {
      formatted[field] = Object.values(constraints);
    }

    // Gérer les erreurs imbriquées
    if (error.children && error.children.length > 0) {
      const childErrors = formatValidationErrors(error.children);
      Object.entries(childErrors).forEach(([childField, messages]) => {
        formatted[`${field}.${childField}`] = messages;
      });
    }
  });

  return formatted;
}

/**
 * 🎯 Exemple d'utilisation dans main.ts:
 * 
 * ```typescript
 * import { NestFactory } from '@nestjs/core';
 * import { AppModule } from './app.module';
 * import { globalValidationPipe } from '@agrologistic/common';
 * 
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *   
 *   // ✅ Appliquer la validation globale
 *   app.useGlobalPipes(globalValidationPipe);
 *   
 *   await app.listen(3000);
 * }
 * 
 * bootstrap();
 * ```
 * 
 * 📋 Exemple de DTO:
 * 
 * ```typescript
 * import { IsString, IsEmail, IsInt, Min, Max, IsOptional } from 'class-validator';
 * import { Type } from 'class-transformer';
 * 
 * export class CreateUserDto {
 *   @IsString()
 *   @MinLength(3)
 *   @MaxLength(50)
 *   name: string;
 * 
 *   @IsEmail()
 *   email: string;
 * 
 *   @IsInt()
 *   @Min(18)
 *   @Max(120)
 *   @Type(() => Number)
 *   age: number;
 * 
 *   @IsOptional()
 *   @IsString()
 *   bio?: string;
 * }
 * ```
 * 
 * 🔒 Exemple de réponse d'erreur:
 * 
 * ```json
 * {
 *   "statusCode": 400,
 *   "message": "Validation failed",
 *   "errors": {
 *     "name": ["name must be longer than or equal to 3 characters"],
 *     "email": ["email must be an email"],
 *     "age": ["age must not be less than 18"]
 *   },
 *   "timestamp": "2026-02-07T17:00:00.000Z"
 * }
 * ```
 */
