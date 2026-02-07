# 📖 GUIDE PROMPT 8 : Documentation API Vivante (Swagger/OpenAPI)

Une documentation à jour est cruciale pour la collaboration Frontend/Backend. Nous utilisons Swaggger (OpenAPI 3.0) généré automatiquement.

## 1. Activation dans un Service NestJS

Le package `@agrologistic/common` fournit un helper standardisé.

### Dans `main.ts` :

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from '@agrologistic/common'; // Importez le helper

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ... configuration existante (CORS, Pipes) ...

  // 📖 Activer la Documentation API
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app, {
      title: 'Nom du Service (ex: Auth Service)',
      description: 'Description courte du service',
      version: '1.0',
      path: 'api/docs', // URL d'accès: /api/docs
    });
  }

  await app.listen(3000);
}
bootstrap();
```

## 2. Documenter les DTOs et Contrôleurs

Utilisez les décorateurs `@nestjs/swagger` pour enrichir la doc.

### Dans vos DTOs :

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Email unique' })
  email: string;

  @ApiProperty({ minLength: 8, description: 'Mot de passe sécurisé' })
  password: string;
}
```

### Dans vos Contrôleurs :

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

  @ApiOperation({ summary: 'Login utilisateur' })
  @ApiResponse({ status: 200, description: 'Succès, retourne le JWT.' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
  @Post('login')
  login(@Body() dto: LoginDto) { ... }
  
  @ApiBearerAuth('access-token') // Nécessite authentification
  @Get('profile')
  getProfile() { ... }
}
```

## 3. Accès

Une fois le service démarré, accédez à :
`http://localhost:<PORT>/api/docs`
