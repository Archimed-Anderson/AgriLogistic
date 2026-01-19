# 🚀 AgroLogistic Platform - Phase 1 Implementation Plan

## Overview
This document outlines the detailed implementation plan for Phase 1: Critical Foundation services. All implementations will preserve existing functionality while adding backend microservices infrastructure.

---

## 📋 Phase 1 Objectives

**Timeline:** Q1 2026 (12 weeks)  
**Goal:** Establish foundational microservices architecture with critical backend services  
**Priority:** 🔴 CRITICAL

### Success Criteria
- ✅ 4 core microservices deployed (Auth, Product, Order, Payment)
- ✅ API Gateway with authentication and rate limiting
- ✅ PostgreSQL + MongoDB + Redis operational
- ✅ Zero disruption to existing frontend features
- ✅ All existing E2E tests passing
- ✅ API documentation complete

---

## 🏗️ Service 1: API Gateway (Kong)

### **Weeks 1-2: Setup and Configuration**

#### 1.1 Infrastructure Setup

**Files to Create:**
```
/services/api-gateway/
├── docker-compose.yml
├── kong.yml                    # Kong configuration
├── kong.conf                   # Kong settings
├── plugins/
│   ├── jwt-auth.lua           # Custom JWT plugin
│   ├── rate-limiting.lua      # Custom rate limiter
│   └── logger.lua             # Request logger
├── scripts/
│   ├── setup-routes.sh        # Route configuration
│   └── setup-plugins.sh       # Plugin setup
└── README.md
```

**Implementation Steps:**

**Step 1: Docker Compose Configuration**
```yaml
# /services/api-gateway/docker-compose.yml
version: '3.8'

services:
  kong-database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: kong
      POSTGRES_USER: kong
      POSTGRES_PASSWORD: ${KONG_PG_PASSWORD}
    volumes:
      - kong-db-data:/var/lib/postgresql/data
    networks:
      - kong-net
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "kong"]
      interval: 10s
      timeout: 5s
      retries: 5

  kong-migrations:
    image: kong/kong-gateway:3.5
    command: kong migrations bootstrap
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: kong-database
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: ${KONG_PG_PASSWORD}
    depends_on:
      kong-database:
        condition: service_healthy
    networks:
      - kong-net

  kong:
    image: kong/kong-gateway:3.5
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: kong-database
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: ${KONG_PG_PASSWORD}
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 0.0.0.0:8001
      KONG_PROXY_LISTEN: 0.0.0.0:8000
      KONG_PLUGINS: bundled,jwt,rate-limiting,cors,request-transformer
    ports:
      - "8000:8000"  # Proxy
      - "8001:8001"  # Admin API
    depends_on:
      kong-migrations:
        condition: service_completed_successfully
    networks:
      - kong-net
    volumes:
      - ./plugins:/usr/local/share/lua/5.1/kong/plugins/custom
      - ./kong.yml:/etc/kong/kong.yml

  konga:
    image: pantsel/konga:latest
    environment:
      DB_ADAPTER: postgres
      DB_HOST: kong-database
      DB_USER: kong
      DB_PASSWORD: ${KONG_PG_PASSWORD}
      DB_DATABASE: konga
      NODE_ENV: production
    ports:
      - "1337:1337"
    depends_on:
      - kong-database
    networks:
      - kong-net

networks:
  kong-net:
    driver: bridge

volumes:
  kong-db-data:
```

**Step 2: Kong Declarative Configuration**
```yaml
# /services/api-gateway/kong.yml
_format_version: "3.0"

services:
  - name: auth-service
    url: http://auth-service:3001
    routes:
      - name: auth-routes
        paths:
          - /api/v1/auth
        strip_path: true
        methods:
          - GET
          - POST
          - PUT
          - DELETE
    plugins:
      - name: rate-limiting
        config:
          minute: 100
          hour: 1000
          policy: local
      - name: cors
        config:
          origins:
            - "*"
          methods:
            - GET
            - POST
            - PUT
            - DELETE
            - OPTIONS
          headers:
            - Authorization
            - Content-Type
          credentials: true

  - name: product-service
    url: http://product-service:3002
    routes:
      - name: product-routes
        paths:
          - /api/v1/products
        strip_path: true
    plugins:
      - name: jwt
        config:
          key_claim_name: kid
          secret_is_base64: false
      - name: rate-limiting
        config:
          minute: 200
          hour: 5000

  - name: order-service
    url: http://order-service:3003
    routes:
      - name: order-routes
        paths:
          - /api/v1/orders
        strip_path: true
    plugins:
      - name: jwt
        config:
          key_claim_name: kid
      - name: rate-limiting
        config:
          minute: 150
          hour: 3000

  - name: payment-service
    url: http://payment-service:3004
    routes:
      - name: payment-routes
        paths:
          - /api/v1/payments
        strip_path: true
    plugins:
      - name: jwt
        config:
          key_claim_name: kid
      - name: rate-limiting
        config:
          minute: 50
          hour: 500

consumers:
  - username: AgroLogistic-web-app
    custom_id: web-client
    jwt_secrets:
      - key: AgroLogistic-jwt-secret
        secret: ${JWT_SECRET}
        algorithm: HS256

plugins:
  - name: request-transformer
    config:
      add:
        headers:
          - X-Gateway-Version:1.0
          - X-Request-ID:$(uuid)
  
  - name: response-transformer
    config:
      add:
        headers:
          - X-Response-Time:$(latency)
```

**Step 3: Setup Scripts**
```bash
#!/bin/bash
# /services/api-gateway/scripts/setup-routes.sh

set -e

KONG_ADMIN_URL="http://localhost:8001"

echo "🚀 Setting up Kong routes and services..."

# Wait for Kong to be ready
until curl -s "${KONG_ADMIN_URL}" > /dev/null; do
  echo "⏳ Waiting for Kong..."
  sleep 2
done

echo "✅ Kong is ready!"

# Configure services via Kong Admin API
curl -i -X POST ${KONG_ADMIN_URL}/services \
  --data name=auth-service \
  --data url=http://auth-service:3001

curl -i -X POST ${KONG_ADMIN_URL}/services/auth-service/routes \
  --data paths[]=/api/v1/auth \
  --data strip_path=true

echo "✅ Routes configured successfully!"
```

#### 1.2 JWT Authentication Plugin

**Custom JWT Validation:**
```lua
-- /services/api-gateway/plugins/jwt-auth.lua
local jwt = require "resty.jwt"
local cjson = require "cjson"

local JWTAuthHandler = {}

JWTAuthHandler.PRIORITY = 1005
JWTAuthHandler.VERSION = "1.0.0"

function JWTAuthHandler:access(conf)
  local auth_header = kong.request.get_header("Authorization")
  
  if not auth_header then
    return kong.response.exit(401, {
      error = "Unauthorized",
      message = "Missing Authorization header"
    })
  end

  local token = auth_header:match("Bearer%s+(.+)")
  if not token then
    return kong.response.exit(401, {
      error = "Unauthorized",
      message = "Invalid Authorization format"
    })
  end

  local jwt_obj = jwt:verify(conf.secret, token)
  
  if not jwt_obj.verified then
    return kong.response.exit(401, {
      error = "Unauthorized",
      message = "Invalid or expired token: " .. jwt_obj.reason
    })
  end

  -- Add user info to headers for downstream services
  kong.service.request.set_header("X-User-ID", jwt_obj.payload.sub)
  kong.service.request.set_header("X-User-Role", jwt_obj.payload.role)
  kong.service.request.set_header("X-User-Email", jwt_obj.payload.email)
end

return JWTAuthHandler
```

#### 1.3 Rate Limiting Strategy

**Implementation:**
- **Anonymous users:** 50 requests/minute, 500/hour
- **Authenticated users:** 200 requests/minute, 5000/hour
- **Premium users:** 500 requests/minute, 20000/hour
- **Admin users:** Unlimited

---

## 🔐 Service 2: Authentication Service

### **Weeks 3-4: Auth Microservice**

#### 2.1 Service Structure

**Files to Create:**
```
/services/auth-service/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── oauth.controller.ts
│   │   └── session.controller.ts
│   ├── services/
│   │   ├── jwt.service.ts
│   │   ├── oauth.service.ts
│   │   ├── password.service.ts
│   │   └── session.service.ts
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   └── session.repository.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   └── session.model.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── oauth.config.ts
│   ├── utils/
│   │   ├── bcrypt.util.ts
│   │   └── token.util.ts
│   └── app.ts
├── tests/
│   ├── unit/
│   │   ├── jwt.service.test.ts
│   │   └── password.service.test.ts
│   └── integration/
│       ├── auth.test.ts
│       └── oauth.test.ts
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── .env.example
```

#### 2.2 Database Schema

**PostgreSQL Migration:**
```sql
-- /services/auth-service/migrations/001_create_users_table.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  email_verified BOOLEAN DEFAULT FALSE,
  phone VARCHAR(20),
  phone_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  CONSTRAINT role_check CHECK (role IN ('admin', 'user', 'carrier', 'owner', 'renter'))
);

CREATE TABLE oauth_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  refresh_token_hash VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_sessions (user_id),
  INDEX idx_token_hash (token_hash)
);

CREATE TABLE password_resets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_token (token_hash),
  INDEX idx_user (user_id)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_oauth_provider ON oauth_accounts(provider, provider_account_id);
```

#### 2.3 Core Service Implementation

**JWT Service:**
```typescript
// /services/auth-service/src/services/jwt.service.ts

import jwt from 'jsonwebtoken';
import { UserRole } from '../models/user.model';

interface JWTPayload {
  sub: string;        // User ID
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}

export class JWTService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET!;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET!;
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  /**
   * Generate access token (short-lived)
   */
  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'AgroLogistic-auth-service',
      audience: 'AgroLogistic-api',
    });
  }

  /**
   * Generate refresh token (long-lived)
   */
  generateRefreshToken(userId: string): string {
    return jwt.sign(
      { sub: userId, type: 'refresh' },
      this.refreshTokenSecret,
      {
        expiresIn: this.refreshTokenExpiry,
        issuer: 'AgroLogistic-auth-service',
      }
    );
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.accessTokenSecret, {
        issuer: 'AgroLogistic-auth-service',
        audience: 'AgroLogistic-api',
      }) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): { sub: string } {
    try {
      return jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'AgroLogistic-auth-service',
      }) as { sub: string };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Generate token pair
   */
  generateTokenPair(user: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
  }) {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(user.id),
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}
```

**OAuth Service (Google Provider):**
```typescript
// /services/auth-service/src/services/oauth.service.ts

import { OAuth2Client } from 'google-auth-library';
import { UserRepository } from '../repositories/user.repository';
import { OAuthAccountRepository } from '../repositories/oauth-account.repository';

export class OAuthService {
  private googleClient: OAuth2Client;
  private userRepository: UserRepository;
  private oauthAccountRepository: OAuthAccountRepository;

  constructor() {
    this.googleClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    });
    
    this.userRepository = new UserRepository();
    this.oauthAccountRepository = new OAuthAccountRepository();
  }

  /**
   * Generate Google OAuth URL
   */
  getGoogleAuthUrl(): string {
    return this.googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      prompt: 'consent',
    });
  }

  /**
   * Verify Google OAuth token and get user info
   */
  async verifyGoogleToken(code: string) {
    try {
      const { tokens } = await this.googleClient.getToken(code);
      this.googleClient.setCredentials(tokens);

      const ticket = await this.googleClient.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      return {
        providerId: payload.sub,
        email: payload.email!,
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        avatarUrl: payload.picture,
        emailVerified: payload.email_verified || false,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date 
          ? new Date(tokens.expiry_date) 
          : undefined,
      };
    } catch (error) {
      throw new Error(`Google OAuth verification failed: ${error}`);
    }
  }

  /**
   * Sign in or sign up user with OAuth
   */
  async signInWithOAuth(
    provider: 'google' | 'facebook',
    code: string
  ) {
    let userInfo;

    if (provider === 'google') {
      userInfo = await this.verifyGoogleToken(code);
    } else {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    // Check if OAuth account exists
    let oauthAccount = await this.oauthAccountRepository.findByProvider(
      provider,
      userInfo.providerId
    );

    let user;

    if (oauthAccount) {
      // Existing user - update OAuth tokens
      await this.oauthAccountRepository.updateTokens(
        oauthAccount.id,
        userInfo.accessToken!,
        userInfo.refreshToken,
        userInfo.expiresAt
      );
      
      user = await this.userRepository.findById(oauthAccount.userId);
    } else {
      // New user - check if email exists
      user = await this.userRepository.findByEmail(userInfo.email);

      if (!user) {
        // Create new user
        user = await this.userRepository.create({
          email: userInfo.email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          avatarUrl: userInfo.avatarUrl,
          emailVerified: userInfo.emailVerified,
          role: 'user',
        });
      }

      // Create OAuth account link
      await this.oauthAccountRepository.create({
        userId: user.id,
        provider,
        providerAccountId: userInfo.providerId,
        accessToken: userInfo.accessToken,
        refreshToken: userInfo.refreshToken,
        expiresAt: userInfo.expiresAt,
      });
    }

    return user;
  }
}
```

**Auth Controller:**
```typescript
// /services/auth-service/src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { JWTService } from '../services/jwt.service';
import { PasswordService } from '../services/password.service';
import { OAuthService } from '../services/oauth.service';
import { UserRepository } from '../repositories/user.repository';
import { SessionRepository } from '../repositories/session.repository';

export class AuthController {
  private jwtService: JWTService;
  private passwordService: PasswordService;
  private oauthService: OAuthService;
  private userRepository: UserRepository;
  private sessionRepository: SessionRepository;

  constructor() {
    this.jwtService = new JWTService();
    this.passwordService = new PasswordService();
    this.oauthService = new OAuthService();
    this.userRepository = new UserRepository();
    this.sessionRepository = new SessionRepository();
  }

  /**
   * POST /api/v1/auth/login
   * Email/password login
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Email and password are required',
        });
      }

      // Find user
      const user = await this.userRepository.findByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
      }

      // Verify password
      const isValid = await this.passwordService.verifyPassword(
        password,
        user.passwordHash
      );

      if (!isValid) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
      }

      // Generate tokens
      const tokens = this.jwtService.generateTokenPair(user);

      // Create session
      await this.sessionRepository.create({
        userId: user.id,
        tokenHash: await this.passwordService.hashPassword(tokens.accessToken),
        refreshTokenHash: await this.passwordService.hashPassword(tokens.refreshToken),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        ...tokens,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred during login',
      });
    }
  }

  /**
   * POST /api/v1/auth/register
   * User registration
   */
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role = 'user' } = req.body;

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'All fields are required',
        });
      }

      // Check if user exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'An account with this email already exists',
        });
      }

      // Hash password
      const passwordHash = await this.passwordService.hashPassword(password);

      // Create user
      const user = await this.userRepository.create({
        email,
        passwordHash,
        firstName,
        lastName,
        role,
      });

      // Generate tokens
      const tokens = this.jwtService.generateTokenPair(user);

      // Create session
      await this.sessionRepository.create({
        userId: user.id,
        tokenHash: await this.passwordService.hashPassword(tokens.accessToken),
        refreshTokenHash: await this.passwordService.hashPassword(tokens.refreshToken),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        ...tokens,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred during registration',
      });
    }
  }

  /**
   * POST /api/v1/auth/refresh
   * Refresh access token
   */
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Refresh token is required',
        });
      }

      // Verify refresh token
      const payload = this.jwtService.verifyRefreshToken(refreshToken);

      // Get user
      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid refresh token',
        });
      }

      // Generate new tokens
      const tokens = this.jwtService.generateTokenPair(user);

      res.json(tokens);
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired refresh token',
      });
    }
  }

  /**
   * POST /api/v1/auth/logout
   * Logout user
   */
  async logout(req: Request, res: Response) {
    try {
      const authHeader = req.get('Authorization');
      const token = authHeader?.replace('Bearer ', '');

      if (token) {
        const tokenHash = await this.passwordService.hashPassword(token);
        await this.sessionRepository.deleteByTokenHash(tokenHash);
      }

      res.status(204).send();
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred during logout',
      });
    }
  }

  /**
   * GET /api/v1/auth/oauth/google
   * Get Google OAuth URL
   */
  async getGoogleAuthUrl(req: Request, res: Response) {
    try {
      const url = this.oauthService.getGoogleAuthUrl();
      res.json({ url });
    } catch (error) {
      console.error('OAuth URL error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to generate OAuth URL',
      });
    }
  }

  /**
   * POST /api/v1/auth/oauth/google/callback
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(req: Request, res: Response) {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Authorization code is required',
        });
      }

      // Sign in with OAuth
      const user = await this.oauthService.signInWithOAuth('google', code);

      // Generate tokens
      const tokens = this.jwtService.generateTokenPair(user);

      // Create session
      await this.sessionRepository.create({
        userId: user.id,
        tokenHash: await this.passwordService.hashPassword(tokens.accessToken),
        refreshTokenHash: await this.passwordService.hashPassword(tokens.refreshToken),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        ...tokens,
      });
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'OAuth authentication failed',
      });
    }
  }
}
```

#### 2.4 Docker Configuration

```dockerfile
# /services/auth-service/Dockerfile

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/app.js"]
```

```yaml
# /services/auth-service/docker-compose.yml

version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: AgroLogistic_auth
      POSTGRES_USER: AgroLogistic
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U AgroLogistic"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  auth-service:
    build: .
    environment:
      NODE_ENV: production
      PORT: 3001
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: AgroLogistic_auth
      DB_USER: AgroLogistic
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      JWT_ACCESS_EXPIRY: 15m
      JWT_REFRESH_EXPIRY: 7d
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      GOOGLE_REDIRECT_URI: ${GOOGLE_REDIRECT_URI}
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:
```

---

## 📦 Service 3: Product Service

### **Weeks 5-6: Product Microservice**

#### 3.1 Service Structure

**Files to Create:**
```
/services/product-service/
├── src/
│   ├── controllers/
│   │   ├── product.controller.ts
│   │   ├── category.controller.ts
│   │   └── search.controller.ts
│   ├── services/
│   │   ├── product.service.ts
│   │   ├── search.service.ts
│   │   ├── inventory.service.ts
│   │   └── recommendation.service.ts
│   ├── repositories/
│   │   ├── product.repository.ts
│   │   └── category.repository.ts
│   ├── models/
│   │   ├── product.model.ts
│   │   └── category.model.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   └── elasticsearch.config.ts
│   └── app.ts
├── Dockerfile
├── docker-compose.yml
└── package.json
```

#### 3.2 Database Schema

```sql
-- /services/product-service/migrations/001_create_products_schema.sql

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  icon_name VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  seller_id UUID NOT NULL,
  
  price DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  
  images JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  labels JSONB DEFAULT '[]',
  
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  is_new BOOLEAN DEFAULT FALSE,
  fast_delivery BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  
  views_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  INDEX idx_category (category_id),
  INDEX idx_seller (seller_id),
  INDEX idx_price (price),
  INDEX idx_rating (rating),
  INDEX idx_slug (slug)
);

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  attributes JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  type VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  reference_id UUID,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL,
  
  CONSTRAINT type_check CHECK (type IN ('purchase', 'sale', 'return', 'adjustment'))
);
```

#### 3.3 Elasticsearch Integration

```typescript
// /services/product-service/src/services/search.service.ts

import { Client } from '@elastic/elasticsearch';

interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  labels?: string[];
  rating?: number;
  inStock?: boolean;
}

export class SearchService {
  private client: Client;
  private readonly indexName = 'products';

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200',
      auth: {
        username: process.env.ELASTICSEARCH_USER || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'changeme',
      },
    });
  }

  /**
   * Initialize Elasticsearch index
   */
  async initializeIndex() {
    const indexExists = await this.client.indices.exists({
      index: this.indexName,
    });

    if (!indexExists) {
      await this.client.indices.create({
        index: this.indexName,
        body: {
          settings: {
            analysis: {
              analyzer: {
                product_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'asciifolding', 'french_stop', 'french_stemmer'],
                },
              },
              filter: {
                french_stop: {
                  type: 'stop',
                  stopwords: '_french_',
                },
                french_stemmer: {
                  type: 'stemmer',
                  language: 'french',
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              name: {
                type: 'text',
                analyzer: 'product_analyzer',
                fields: {
                  keyword: { type: 'keyword' },
                  suggest: { type: 'completion' },
                },
              },
              description: {
                type: 'text',
                analyzer: 'product_analyzer',
              },
              category: {
                type: 'object',
                properties: {
                  id: { type: 'keyword' },
                  name: { type: 'keyword' },
                  slug: { type: 'keyword' },
                },
              },
              price: { type: 'float' },
              rating: { type: 'float' },
              stock_quantity: { type: 'integer' },
              labels: { type: 'keyword' },
              is_new: { type: 'boolean' },
              fast_delivery: { type: 'boolean' },
              seller: {
                type: 'object',
                properties: {
                  id: { type: 'keyword' },
                  name: { type: 'keyword' },
                },
              },
              created_at: { type: 'date' },
              updated_at: { type: 'date' },
            },
          },
        },
      });
    }
  }

  /**
   * Index a product
   */
  async indexProduct(product: any) {
    await this.client.index({
      index: this.indexName,
      id: product.id,
      document: {
        id: product.id,
        name: product.name,
        description: product.description,
        category: {
          id: product.category?.id,
          name: product.category?.name,
          slug: product.category?.slug,
        },
        price: product.price,
        rating: product.rating,
        stock_quantity: product.stockQuantity,
        labels: product.labels,
        is_new: product.isNew,
        fast_delivery: product.fastDelivery,
        seller: {
          id: product.seller.id,
          name: product.seller.name,
        },
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      },
      refresh: true,
    });
  }

  /**
   * Search products with filters
   */
  async search(query: string, filters: SearchFilters = {}, page = 1, limit = 20) {
    const must: any[] = [];
    const filter: any[] = [];

    // Full-text search
    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['name^3', 'description^2', 'category.name'],
          type: 'best_fields',
          fuzziness: 'AUTO',
        },
      });
    }

    // Category filter
    if (filters.category) {
      filter.push({
        term: { 'category.slug': filters.category },
      });
    }

    // Price range filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const priceFilter: any = { range: { price: {} } };
      if (filters.minPrice !== undefined) {
        priceFilter.range.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        priceFilter.range.price.lte = filters.maxPrice;
      }
      filter.push(priceFilter);
    }

    // Labels filter
    if (filters.labels && filters.labels.length > 0) {
      filter.push({
        terms: { labels: filters.labels },
      });
    }

    // Rating filter
    if (filters.rating) {
      filter.push({
        range: { rating: { gte: filters.rating } },
      });
    }

    // Stock filter
    if (filters.inStock) {
      filter.push({
        range: { stock_quantity: { gt: 0 } },
      });
    }

    const from = (page - 1) * limit;

    const result = await this.client.search({
      index: this.indexName,
      body: {
        from,
        size: limit,
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
            filter,
          },
        },
        sort: [
          { _score: { order: 'desc' } },
          { rating: { order: 'desc' } },
          { created_at: { order: 'desc' } },
        ],
        aggs: {
          categories: {
            terms: { field: 'category.name', size: 20 },
          },
          price_ranges: {
            range: {
              field: 'price',
              ranges: [
                { to: 50 },
                { from: 50, to: 100 },
                { from: 100, to: 200 },
                { from: 200, to: 500 },
                { from: 500 },
              ],
            },
          },
          labels: {
            terms: { field: 'labels', size: 20 },
          },
        },
      },
    });

    return {
      products: result.hits.hits.map((hit: any) => ({
        id: hit._id,
        score: hit._score,
        ...hit._source,
      })),
      total: result.hits.total,
      aggregations: result.aggregations,
      page,
      limit,
      totalPages: Math.ceil((result.hits.total as any).value / limit),
    };
  }

  /**
   * Autocomplete suggestions
   */
  async suggest(query: string) {
    const result = await this.client.search({
      index: this.indexName,
      body: {
        suggest: {
          product_suggest: {
            prefix: query,
            completion: {
              field: 'name.suggest',
              size: 10,
              fuzzy: {
                fuzziness: 'AUTO',
              },
            },
          },
        },
      },
    });

    return result.suggest?.product_suggest[0].options.map((option: any) => ({
      text: option.text,
      score: option._score,
    }));
  }

  /**
   * Similar products (More Like This)
   */
  async findSimilar(productId: string, limit = 5) {
    const result = await this.client.search({
      index: this.indexName,
      body: {
        size: limit,
        query: {
          more_like_this: {
            fields: ['name', 'description', 'category.name'],
            like: [
              {
                _index: this.indexName,
                _id: productId,
              },
            ],
            min_term_freq: 1,
            min_doc_freq: 1,
          },
        },
      },
    });

    return result.hits.hits.map((hit: any) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source,
    }));
  }
}
```

---

## 🛒 Service 4: Order Service

### **Weeks 7-8: Order Microservice with Saga Pattern**

#### 4.1 Saga Orchestration

**Saga Coordinator:**
```typescript
// /services/order-service/src/saga/order-saga.ts

import { EventEmitter } from 'events';

interface SagaStep {
  name: string;
  execute: () => Promise<any>;
  compensate: () => Promise<void>;
}

export class OrderSaga extends EventEmitter {
  private steps: SagaStep[] = [];
  private executedSteps: string[] = [];

  addStep(step: SagaStep) {
    this.steps.push(step);
    return this;
  }

  async execute() {
    try {
      for (const step of this.steps) {
        this.emit('step:start', step.name);
        
        const result = await step.execute();
        this.executedSteps.push(step.name);
        
        this.emit('step:complete', step.name, result);
      }

      this.emit('saga:complete');
      return { success: true };
    } catch (error) {
      this.emit('saga:error', error);
      await this.compensate();
      throw error;
    }
  }

  private async compensate() {
    this.emit('saga:compensating');

    // Compensate in reverse order
    for (let i = this.executedSteps.length - 1; i >= 0; i--) {
      const stepName = this.executedSteps[i];
      const step = this.steps.find(s => s.name === stepName);
      
      if (step) {
        try {
          this.emit('step:compensate', stepName);
          await step.compensate();
          this.emit('step:compensated', stepName);
        } catch (error) {
          this.emit('step:compensate:error', stepName, error);
        }
      }
    }

    this.emit('saga:compensated');
  }
}

/**
 * Create order saga workflow
 */
export function createOrderSaga(
  orderId: string,
  userId: string,
  items: any[],
  paymentMethod: string
) {
  const saga = new OrderSaga();

  // Step 1: Validate inventory
  saga.addStep({
    name: 'validate_inventory',
    execute: async () => {
      const inventoryService = new InventoryService();
      return await inventoryService.validateStock(items);
    },
    compensate: async () => {
      // No compensation needed for validation
    },
  });

  // Step 2: Reserve inventory
  saga.addStep({
    name: 'reserve_inventory',
    execute: async () => {
      const inventoryService = new InventoryService();
      return await inventoryService.reserveStock(orderId, items);
    },
    compensate: async () => {
      const inventoryService = new InventoryService();
      await inventoryService.releaseReservation(orderId);
    },
  });

  // Step 3: Process payment
  saga.addStep({
    name: 'process_payment',
    execute: async () => {
      const paymentService = new PaymentService();
      return await paymentService.charge(orderId, userId, paymentMethod);
    },
    compensate: async () => {
      const paymentService = new PaymentService();
      await paymentService.refund(orderId);
    },
  });

  // Step 4: Create order record
  saga.addStep({
    name: 'create_order',
    execute: async () => {
      const orderRepository = new OrderRepository();
      return await orderRepository.create({
        id: orderId,
        userId,
        items,
        status: 'confirmed',
      });
    },
    compensate: async () => {
      const orderRepository = new OrderRepository();
      await orderRepository.updateStatus(orderId, 'cancelled');
    },
  });

  // Step 5: Send confirmation notification
  saga.addStep({
    name: 'send_notification',
    execute: async () => {
      const notificationService = new NotificationService();
      return await notificationService.sendOrderConfirmation(orderId, userId);
    },
    compensate: async () => {
      // Notification compensation not needed
    },
  });

  return saga;
}
```

---

## 💳 Service 5: Payment Service

### **Weeks 9-10: Payment Integration**

#### 5.1 Stripe Integration

```typescript
// /services/payment-service/src/services/stripe.service.ts

import Stripe from 'stripe';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Create payment intent
   */
  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: Record<string, string>
  ) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
      status: paymentIntent.status,
    };
  }

  /**
   * Confirm payment
   */
  async confirmPayment(paymentIntentId: string) {
    const paymentIntent = await this.stripe.paymentIntents.confirm(
      paymentIntentId
    );

    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    };
  }

  /**
   * Create refund
   */
  async createRefund(paymentIntentId: string, amount?: number) {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return {
      id: refund.id,
      status: refund.status,
      amount: refund.amount / 100,
      currency: refund.currency,
    };
  }

  /**
   * Handle webhook
   */
  async handleWebhook(payload: string, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;

        case 'charge.refunded':
          await this.handleRefund(event.data.object);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  }

  private async handlePaymentSuccess(paymentIntent: any) {
    // Update order status, send confirmation, etc.
    console.log('Payment succeeded:', paymentIntent.id);
  }

  private async handlePaymentFailure(paymentIntent: any) {
    // Handle payment failure, notify customer
    console.log('Payment failed:', paymentIntent.id);
  }

  private async handleRefund(charge: any) {
    // Handle refund processing
    console.log('Refund processed:', charge.id);
  }
}
```

---

## 📱 Frontend Integration

### **Weeks 11-12: Frontend API Client**

#### 6.1 API Client Implementation

**Files to Update:**
```
/src/infrastructure/api/
├── rest/
│   ├── api-client.ts          # NEW
│   ├── auth-api.ts             # NEW
│   ├── product-api.ts          # NEW
│   ├── order-api.ts            # NEW
│   └── payment-api.ts          # NEW
└── interceptors/
    ├── auth.interceptor.ts     # NEW
    └── error.interceptor.ts    # NEW
```

**API Client:**
```typescript
// /src/infrastructure/api/rest/api-client.ts

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class APIClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await axios.post(
              `${this.client.defaults.baseURL}/auth/refresh`,
              { refreshToken }
            );

            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Create singleton instance
export const apiClient = new APIClient(
  import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000/api/v1'
);
```

**Auth API:**
```typescript
// /src/infrastructure/api/rest/auth-api.ts

import { apiClient } from './api-client';
import { AuthProvider } from '../../adapters/auth-provider.interface';
import { User } from '../../../domain/entities/user.entity';
import { RegisterRequestDTO } from '../../../application/dto/request/register-request.dto';

export class RealAuthAdapter implements AuthProvider {
  readonly name = 'real-auth-api';

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<any>('/auth/login', {
      email,
      password,
    });

    // Store tokens
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    // Convert API response to domain entity
    const user = User.create({
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      email: new Email(response.user.email),
      role: response.user.role,
      avatarUrl: response.user.avatarUrl,
    });

    return {
      user,
      token: response.accessToken,
    };
  }

  async register(request: RegisterRequestDTO): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<any>('/auth/register', request);

    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    const user = User.create({
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      email: new Email(response.user.email),
      role: response.user.role,
    });

    return {
      user,
      token: response.accessToken,
    };
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    localStorage.clear();
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<any>('/auth/me');
      
      return User.create({
        firstName: response.firstName,
        lastName: response.lastName,
        email: new Email(response.email),
        role: response.role,
        avatarUrl: response.avatarUrl,
      });
    } catch (error) {
      return null;
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    const response = await apiClient.post<{ success: boolean }>('/auth/verify-email', {
      token,
    });
    return response.success;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await apiClient.post('/auth/password-reset', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/password-reset/confirm', {
      token,
      newPassword,
    });
  }

  async isConfigured(): Promise<boolean> {
    return true;
  }
}
```

**Update Auth Provider Factory:**
```typescript
// /src/infrastructure/adapters/auth-provider.factory.ts

import { AuthProvider } from './auth-provider.interface';
import { MockAuthAdapter } from './mock-auth.adapter';
import { RealAuthAdapter } from '../api/rest/auth-api';

export enum AuthProviderType {
  MOCK = 'mock',
  REAL = 'real',
}

export class AuthProviderFactory {
  private static instance: AuthProvider | null = null;
  private static currentType: AuthProviderType = AuthProviderType.REAL; // Changed from MOCK

  static getProvider(type?: AuthProviderType): AuthProvider {
    if (type && type !== this.currentType) {
      this.instance = null;
      this.currentType = type;
    }

    if (!this.instance) {
      this.instance = this.createProvider(this.currentType);
    }

    return this.instance;
  }

  private static createProvider(type: AuthProviderType): AuthProvider {
    switch (type) {
      case AuthProviderType.MOCK:
        return new MockAuthAdapter();
      
      case AuthProviderType.REAL:
        return new RealAuthAdapter();
      
      default:
        throw new Error(`Unknown auth provider type: ${type}`);
    }
  }
}
```

---

## 🧪 Testing Strategy

### Unit Tests
```bash
# Each service should have >80% code coverage
npm run test:unit

# Example: Auth Service Tests
/services/auth-service/tests/unit/
├── jwt.service.test.ts
├── password.service.test.ts
└── oauth.service.test.ts
```

### Integration Tests
```bash
# Test service-to-service communication
npm run test:integration

# Example: Order Saga Test
/services/order-service/tests/integration/
└── order-saga.test.ts
```

### E2E Tests
```bash
# Playwright tests with real services
npm run test:e2e

# Ensure all existing tests still pass
```

---

## 📊 Deployment Strategy

### Week 12: Production Deployment

**Deployment Checklist:**
- [ ] All services containerized and tested
- [ ] Kong Gateway configured and tested
- [ ] Databases migrated and seeded
- [ ] Frontend updated to use real APIs
- [ ] All E2E tests passing
- [ ] Load testing completed
- [ ] Security audit completed
- [ ] Documentation updated

**Rollout Plan:**
1. Deploy backend services to staging
2. Run full test suite
3. Gradual rollout (10% → 50% → 100%)
4. Monitor metrics and errors
5. Rollback plan ready

---

## 🎯 Success Metrics

**Technical Metrics:**
- API Gateway response time < 100ms (p95)
- Service-to-service latency < 50ms (p95)
- Auth service: >1000 logins/minute
- Product search: <200ms response time
- Order creation success rate > 99.9%
- Zero downtime deployment
- Database query time < 50ms (p95)
- Cache hit rate > 80%

**Business Metrics:**
- User authentication success rate > 99%
- Product search accuracy > 90%
- Order completion rate > 95%
- Payment success rate > 98%
- Customer satisfaction score > 4.5/5

---

## 📝 Environment Variables

### API Gateway
```bash
KONG_PG_PASSWORD=<secure-password>
JWT_SECRET=<jwt-secret-key>
```

### Auth Service
```bash
DB_PASSWORD=<postgres-password>
REDIS_PASSWORD=<redis-password>
JWT_ACCESS_SECRET=<access-token-secret>
JWT_REFRESH_SECRET=<refresh-token-secret>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/v1/auth/oauth/google/callback
```

### Product Service
```bash
DB_PASSWORD=<postgres-password>
ELASTICSEARCH_URL=http://elasticsearch:9200
ELASTICSEARCH_USER=elastic
ELASTICSEARCH_PASSWORD=<elasticsearch-password>
```

### Order Service
```bash
DB_PASSWORD=<postgres-password>
REDIS_URL=redis://redis:6379
KAFKA_BROKERS=kafka:9092
```

### Payment Service
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=<paypal-client-id>
PAYPAL_CLIENT_SECRET=<paypal-secret>
```

---

## 🔒 Security Considerations

### 1. Authentication & Authorization
- JWT tokens with short expiry (15 minutes)
- Refresh tokens with rotation
- OAuth2 with PKCE for mobile apps
- Rate limiting per user
- Brute force protection

### 2. Data Protection
- All passwords hashed with bcrypt (cost factor 12)
- Sensitive data encrypted at rest
- TLS 1.3 for all connections
- Database connection encryption
- Secrets management (AWS Secrets Manager, HashiCorp Vault)

### 3. API Security
- CORS properly configured
- CSRF protection
- XSS prevention
- SQL injection prevention (parameterized queries)
- Input validation and sanitization
- Output encoding

### 4. Monitoring & Auditing
- All authentication attempts logged
- Failed login alerts
- Unusual activity detection
- Audit trail for sensitive operations
- GDPR compliance logging

---

## 🚀 Next Steps After Phase 1

**Phase 2 (Q2 2026):**
1. Service Mesh (Istio) implementation
2. AI/ML service with real models
3. Analytics service with ClickHouse
4. Mobile applications (Flutter)

**Phase 3 (Q3 2026):**
5. Blockchain service (Hyperledger Fabric)
6. Advanced features (notifications, recommendations)
7. Data lake and advanced analytics

**Phase 4 (Q4 2026):**
8. Observability stack (tracing, logging, monitoring)
9. DevOps automation (CI/CD, IaC)
10. Performance optimization and scaling

---

## 📞 Support & Resources

- **Technical Lead:** Available for architecture decisions
- **DevOps Team:** Infrastructure support
- **QA Team:** Testing and validation
- **Security Team:** Security review and penetration testing

**Documentation:**
- API Documentation: `/docs/api`
- Architecture Diagrams: `/docs/architecture`
- Runbooks: `/docs/runbooks`
- Troubleshooting Guide: `/docs/troubleshooting`

---

## ✅ Definition of Done

Phase 1 is considered complete when:

1. ✅ All 5 services deployed and operational
2. ✅ API Gateway routing all requests correctly
3. ✅ Real authentication with OAuth2 working
4. ✅ Product search with Elasticsearch functional
5. ✅ Order creation with Saga pattern working
6. ✅ Payment integration (Stripe) processing transactions
7. ✅ All unit tests passing (>80% coverage)
8. ✅ All integration tests passing
9. ✅ All existing E2E tests passing
10. ✅ Load testing completed successfully
11. ✅ Security audit passed
12. ✅ Documentation updated
13. ✅ Production deployment successful
14. ✅ Zero critical bugs in production
15. ✅ Team trained on new architecture

---

**Last Updated:** January 2026  
**Version:** 1.0  
**Status:** 🟢 Ready for Implementation
