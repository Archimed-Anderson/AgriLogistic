# Testing Strategy - AgriLogistic Cloud Native

## Overview

Comprehensive testing strategy for AgriLogistic v5.0 Cloud Native architecture with 80%+ code coverage target.

---

## Testing Pyramid

```
                    ┌─────────────┐
                    │   E2E Tests │  (10%)
                    │  Playwright │
                    └─────────────┘
                  ┌───────────────────┐
                  │ Integration Tests │  (30%)
                  │   Jest + Supertest│
                  └───────────────────┘
              ┌─────────────────────────────┐
              │      Unit Tests             │  (60%)
              │  Jest + Vitest + Pytest     │
              └─────────────────────────────┘
```

---

## 1. Unit Tests (60% of test suite)

### Frontend (Next.js - Vitest)

**Target Coverage**: 80%+

#### Components
```typescript
// apps/web-app/src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

#### Hooks
```typescript
// apps/web-app/src/hooks/__tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuth } from '../useAuth';

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs in user successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });

  it('handles login error gracefully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('invalid@example.com', 'wrong');
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

#### Utils
```typescript
// apps/web-app/src/utils/__tests__/formatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatWeight } from '../formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('formats XOF currency correctly', () => {
      expect(formatCurrency(1000, 'XOF')).toBe('1 000 FCFA');
    });

    it('handles zero values', () => {
      expect(formatCurrency(0, 'XOF')).toBe('0 FCFA');
    });

    it('handles negative values', () => {
      expect(formatCurrency(-500, 'XOF')).toBe('-500 FCFA');
    });
  });

  describe('formatDate', () => {
    it('formats date in French locale', () => {
      const date = new Date('2026-02-07');
      expect(formatDate(date)).toBe('7 février 2026');
    });
  });

  describe('formatWeight', () => {
    it('converts kg to tons when > 1000kg', () => {
      expect(formatWeight(2500)).toBe('2.5 tonnes');
    });

    it('keeps kg for values < 1000kg', () => {
      expect(formatWeight(500)).toBe('500 kg');
    });
  });
});
```

### Backend (NestJS - Jest)

**Target Coverage**: 85%+

#### Services
```typescript
// services/auth/src/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@agrologistic/database';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('returns user when credentials are valid', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({ id: user.id, email: user.email });
    });

    it('throws UnauthorizedException for invalid password', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);

      await expect(
        service.validateUser('test@example.com', 'wrong-password')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for non-existent user', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistent@example.com', 'password')
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('returns access token for valid user', async () => {
      const user = { id: '1', email: 'test@example.com' };
      const token = 'jwt-token';

      jest.spyOn(jwt, 'sign').mockReturnValue(token);

      const result = await service.login(user);
      expect(result).toEqual({ access_token: token });
      expect(jwt.sign).toHaveBeenCalledWith({ sub: user.id, email: user.email });
    });
  });
});
```

#### Controllers
```typescript
// services/auth/src/auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('returns access token on successful login', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const result = { access_token: 'token' };

      jest.spyOn(service, 'login').mockResolvedValue(result);

      expect(await controller.login(loginDto)).toEqual(result);
    });
  });
});
```

### AI Service (Python - Pytest)

**Target Coverage**: 75%+

```python
# services/ai-service/llm-service/tests/test_prediction.py
import pytest
from fastapi.testclient import TestClient
from main import app
from services.prediction_service import PredictionService

client = TestClient(app)

@pytest.fixture
def prediction_service():
    return PredictionService()

class TestPredictionService:
    """Unit tests for PredictionService"""
    
    def test_preprocess_image_valid(self, prediction_service):
        """Test image preprocessing with valid input"""
        # Arrange
        image_bytes = b"fake_image_data"
        
        # Act
        result = prediction_service.preprocess_image(image_bytes)
        
        # Assert
        assert result is not None
        assert result.shape == (224, 224, 3)
    
    def test_preprocess_image_invalid(self, prediction_service):
        """Test image preprocessing with invalid input"""
        # Arrange
        invalid_data = b"not_an_image"
        
        # Act & Assert
        with pytest.raises(ValueError):
            prediction_service.preprocess_image(invalid_data)
    
    def test_predict_disease_success(self, prediction_service, mocker):
        """Test disease prediction with valid image"""
        # Arrange
        mock_model = mocker.patch.object(prediction_service, 'model')
        mock_model.predict.return_value = [[0.1, 0.8, 0.1]]
        image_bytes = b"fake_image_data"
        
        # Act
        result = prediction_service.predict_disease(image_bytes)
        
        # Assert
        assert result['disease'] == 'late_blight'
        assert result['confidence'] > 0.7
        assert 'recommendations' in result
    
    def test_predict_disease_low_confidence(self, prediction_service, mocker):
        """Test disease prediction with low confidence"""
        # Arrange
        mock_model = mocker.patch.object(prediction_service, 'model')
        mock_model.predict.return_value = [[0.3, 0.3, 0.4]]
        image_bytes = b"fake_image_data"
        
        # Act
        result = prediction_service.predict_disease(image_bytes)
        
        # Assert
        assert result['confidence'] < 0.5
        assert result['disease'] == 'unknown'

class TestPredictionAPI:
    """Integration tests for prediction API endpoints"""
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
    
    def test_predict_endpoint_success(self, mocker):
        """Test prediction endpoint with valid image"""
        # Arrange
        mock_service = mocker.patch('main.prediction_service')
        mock_service.predict_disease.return_value = {
            'disease': 'late_blight',
            'confidence': 0.85,
            'recommendations': ['Apply fungicide']
        }
        
        # Act
        response = client.post(
            "/predict/disease",
            files={"file": ("test.jpg", b"fake_image", "image/jpeg")}
        )
        
        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data['disease'] == 'late_blight'
        assert data['confidence'] == 0.85
    
    def test_predict_endpoint_invalid_file(self):
        """Test prediction endpoint with invalid file"""
        response = client.post(
            "/predict/disease",
            files={"file": ("test.txt", b"not_an_image", "text/plain")}
        )
        assert response.status_code == 400
```

---

## 2. Integration Tests (30% of test suite)

### API Integration Tests (Supertest)

```typescript
// services/auth/test/auth.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '@agrologistic/database';

describe('Auth Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
  });

  describe('POST /auth/register', () => {
    it('creates new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          name: 'Test User',
          role: 'FARMER',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('rejects duplicate email', async () => {
      // Create first user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          name: 'Test User',
          role: 'FARMER',
        });

      // Attempt duplicate
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'DifferentPass123!',
          name: 'Another User',
          role: 'BUYER',
        })
        .expect(409);
    });

    it('validates email format', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123!',
          name: 'Test User',
          role: 'FARMER',
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          name: 'Test User',
          role: 'FARMER',
        });
    });

    it('returns JWT token for valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');
    });

    it('rejects invalid password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword!',
        })
        .expect(401);
    });

    it('rejects non-existent user', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SecurePass123!',
        })
        .expect(401);
    });
  });

  describe('GET /auth/profile (Protected)', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Register and login
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          name: 'Test User',
          role: 'FARMER',
        });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
        });

      accessToken = loginResponse.body.access_token;
    });

    it('returns user profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.email).toBe('test@example.com');
      expect(response.body.role).toBe('FARMER');
    });

    it('rejects request without token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });

    it('rejects request with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
```

### Database Integration Tests

```typescript
// packages/database/tests/user.integration.spec.ts
import { PrismaClient } from '@prisma/client';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

describe('User Database Integration', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL_TEST,
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('User CRUD Operations', () => {
    it('creates user with all fields', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashed_password',
          name: 'Test User',
          role: 'FARMER',
        },
      });

      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('enforces unique email constraint', async () => {
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'password',
          name: 'User 1',
          role: 'FARMER',
        },
      });

      await expect(
        prisma.user.create({
          data: {
            email: 'test@example.com',
            password: 'password',
            name: 'User 2',
            role: 'BUYER',
          },
        })
      ).rejects.toThrow();
    });

    it('cascades delete to related records', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'farmer@example.com',
          password: 'password',
          name: 'Farmer',
          role: 'FARMER',
          products: {
            create: {
              name: 'Tomatoes',
              quantity: 100,
              price: 500,
            },
          },
        },
      });

      await prisma.user.delete({ where: { id: user.id } });

      const products = await prisma.product.findMany({
        where: { userId: user.id },
      });

      expect(products).toHaveLength(0);
    });
  });

  describe('Transactions', () => {
    it('rolls back on error', async () => {
      await expect(
        prisma.$transaction(async (tx) => {
          await tx.user.create({
            data: {
              email: 'test@example.com',
              password: 'password',
              name: 'Test',
              role: 'FARMER',
            },
          });

          // Force error
          throw new Error('Rollback test');
        })
      ).rejects.toThrow('Rollback test');

      const users = await prisma.user.findMany();
      expect(users).toHaveLength(0);
    });
  });
});
```

---

## 3. End-to-End Tests (10% of test suite)

### Critical User Flows (Playwright)

```typescript
// apps/web-app/tests/e2e/user-registration-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete farmer registration flow', async ({ page }) => {
    // Navigate to registration
    await page.click('text=S\'inscrire');
    await expect(page).toHaveURL('/auth/register');

    // Fill registration form
    await page.fill('[name="email"]', 'farmer@test.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="confirmPassword"]', 'SecurePass123!');
    await page.fill('[name="name"]', 'Jean Dupont');
    await page.selectOption('[name="role"]', 'FARMER');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard/farmer');
    await expect(page.locator('h1')).toContainText('Tableau de Bord');
  });

  test('validates email format', async ({ page }) => {
    await page.goto('/auth/register');
    
    await page.fill('[name="email"]', 'invalid-email');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toContainText(
      'Email invalide'
    );
  });

  test('validates password strength', async ({ page }) => {
    await page.goto('/auth/register');
    
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'weak');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toContainText(
      'Mot de passe trop faible'
    );
  });
});

test.describe('Authentication Flow', () => {
  test('login with valid credentials', async ({ page }) => {
    // Assume user already registered
    await page.goto('/auth/login');
    
    await page.fill('[name="email"]', 'farmer@test.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard/farmer');
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('[name="email"]', 'wrong@test.com');
    await page.fill('[name="password"]', 'WrongPass123!');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toContainText(
      'Identifiants invalides'
    );
  });

  test('logout successfully', async ({ page, context }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('[name="email"]', 'farmer@test.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Déconnexion');

    await expect(page).toHaveURL('/');
    
    // Verify token cleared
    const cookies = await context.cookies();
    expect(cookies.find(c => c.name === 'access_token')).toBeUndefined();
  });
});

test.describe('Product Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as farmer
    await page.goto('/auth/login');
    await page.fill('[name="email"]', 'farmer@test.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
  });

  test('creates product with all fields', async ({ page }) => {
    await page.goto('/dashboard/farmer/products/new');

    // Fill product form
    await page.fill('[name="name"]', 'Tomates Bio');
    await page.fill('[name="quantity"]', '500');
    await page.fill('[name="unit"]', 'kg');
    await page.fill('[name="price"]', '1000');
    await page.selectOption('[name="category"]', 'VEGETABLES');
    await page.fill('[name="description"]', 'Tomates biologiques fraîches');

    // Upload image
    await page.setInputFiles('[name="image"]', 'tests/fixtures/tomato.jpg');

    // Submit
    await page.click('button[type="submit"]');

    // Verify success
    await expect(page).toHaveURL(/\/dashboard\/farmer\/products\/\d+/);
    await expect(page.locator('h1')).toContainText('Tomates Bio');
  });

  test('validates required fields', async ({ page }) => {
    await page.goto('/dashboard/farmer/products/new');
    
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toHaveCount(3); // name, quantity, price required
  });
});
```

### Multi-Browser Testing

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Test Coverage Configuration

### Frontend (Vitest)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
```

### Backend (Jest)

```javascript
// jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.module.ts',
    '!src/main.ts',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
```

### Python (Pytest)

```ini
# pytest.ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = 
    --cov=services
    --cov-report=html
    --cov-report=term-missing
    --cov-fail-under=75
    -v
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test:unit --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: frontend

  unit-tests-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test:backend --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: backend

  unit-tests-ai:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - run: pip install -r requirements.txt
      - run: pytest --cov --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
          flags: ai-service

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: pnpm test:e2e
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## Test Data Management

### Fixtures

```typescript
// tests/fixtures/users.ts
export const testUsers = {
  farmer: {
    email: 'farmer@test.com',
    password: 'SecurePass123!',
    name: 'Jean Agriculteur',
    role: 'FARMER',
  },
  buyer: {
    email: 'buyer@test.com',
    password: 'SecurePass123!',
    name: 'Marie Acheteur',
    role: 'BUYER',
  },
  transporter: {
    email: 'transporter@test.com',
    password: 'SecurePass123!',
    name: 'Pierre Transporteur',
    role: 'TRANSPORTER',
  },
  admin: {
    email: 'admin@test.com',
    password: 'AdminPass123!',
    name: 'Admin User',
    role: 'ADMIN',
  },
};

export const testProducts = {
  tomatoes: {
    name: 'Tomates Bio',
    quantity: 500,
    unit: 'kg',
    price: 1000,
    category: 'VEGETABLES',
  },
  mangoes: {
    name: 'Mangues Kent',
    quantity: 200,
    unit: 'kg',
    price: 2000,
    category: 'FRUITS',
  },
};
```

### Database Seeding

```typescript
// tests/seed.ts
import { PrismaClient } from '@prisma/client';
import { testUsers, testProducts } from './fixtures';

export async function seedTestDatabase() {
  const prisma = new PrismaClient();

  // Clean database
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  for (const userData of Object.values(testUsers)) {
    await prisma.user.create({ data: userData });
  }

  // Create test products
  const farmer = await prisma.user.findUnique({
    where: { email: testUsers.farmer.email },
  });

  for (const productData of Object.values(testProducts)) {
    await prisma.product.create({
      data: {
        ...productData,
        userId: farmer.id,
      },
    });
  }

  await prisma.$disconnect();
}
```

---

## Running Tests

### Commands

```bash
# Unit tests
pnpm test:unit                    # All unit tests
pnpm test:unit:frontend           # Frontend only
pnpm test:unit:backend            # Backend only
pnpm test:unit:watch              # Watch mode

# Integration tests
pnpm test:integration             # All integration tests
pnpm test:integration:api         # API integration tests
pnpm test:integration:db          # Database tests

# E2E tests
pnpm test:e2e                     # All E2E tests
pnpm test:e2e:headed              # With browser UI
pnpm test:e2e:debug               # Debug mode

# Coverage
pnpm test:coverage                # Generate coverage report
pnpm test:coverage:view           # Open HTML report

# All tests
pnpm test                         # Run all test suites
pnpm test:ci                      # CI mode (no watch)
```

---

## Best Practices

### AAA Pattern (Arrange-Act-Assert)

```typescript
test('example test', () => {
  // Arrange - Set up test data and conditions
  const user = { name: 'Test', age: 25 };
  
  // Act - Execute the code being tested
  const result = processUser(user);
  
  // Assert - Verify the outcome
  expect(result.isValid).toBe(true);
});
```

### Test Isolation

- Each test should be independent
- Use `beforeEach` for setup
- Use `afterEach` for cleanup
- Avoid shared state between tests

### Mocking Best Practices

- Mock external dependencies
- Don't mock what you're testing
- Use realistic mock data
- Verify mock interactions

### Performance

- Run tests in parallel when possible
- Use test.concurrent for independent tests
- Optimize database operations
- Cache expensive setup operations

---

## Monitoring & Reporting

### Coverage Reports

- HTML reports for local development
- LCOV for CI/CD integration
- Codecov for trend analysis
- Fail builds below 80% coverage

### Test Results

- JUnit XML for CI integration
- HTML reports for detailed analysis
- Screenshots on failure (E2E)
- Video recordings for debugging

---

## Next Steps

1. **Implement unit tests** for critical components
2. **Set up integration tests** for API endpoints
3. **Configure E2E tests** for user flows
4. **Integrate with CI/CD** pipeline
5. **Monitor coverage** and improve to 80%+
