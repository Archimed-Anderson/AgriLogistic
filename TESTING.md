# 🧪 AgroDeep Testing Documentation

## Overview
This document describes the testing strategy and manual verification procedures for the AgroDeep platform restructuring.

---

## Manual Verification Checklist

After each phase of the restructuring, manually verify the following:

### Phase 1: Landing Page
**URL**: `http://localhost:5173/`

| Item | Description | Expected Result | ✓ |
|------|-------------|-----------------|---|
| Hero Section | Main banner with call-to-action | Displays correctly with CTA buttons | |
| Navigation | Top navigation bar | All links functional (Marketplace, Dashboard, Login) | |
| Responsive Design | Mobile/tablet view | Layout adapts properly | |
| Statistics | Platform statistics cards | Numbers display correctly | |
| Footer | Footer section | All links and info visible | |

### Phase 2: Marketplace
**URL**: `/marketplace` or via "Explorer le Marketplace"

| Item | Description | Expected Result | ✓ |
|------|-------------|-----------------|---|
| Product Grid | Products display | Grid loads with product cards | |
| Category Filter | Filter by category | Products filter correctly | |
| Price Filter | Filter by price range | Products filter correctly | |
| Search | Product search | Search results appear | |
| Product Click | Click on product | Detail panel opens | |
| Add to Cart | Add product to cart | Cart updates | |

### Phase 3: Dashboard
**URL**: `/dashboard` or `/admin/overview`

| Item | Description | Expected Result | ✓ |
|------|-------------|-----------------|---|
| Stats Cards | KPI cards | Display with realistic data | |
| Charts | Analytics graphs | Charts render correctly | |
| Sidebar Navigation | Admin sidebar | All menu items functional | |
| Data Tables | Order/product tables | Tables load with data | |
| Quick Actions | Action buttons | Buttons respond correctly | |

### Phase 4: Authentication
**URL**: `/login` and `/register`

| Item | Description | Expected Result | ✓ |
|------|-------------|-----------------|---|
| Login Form | Login with credentials | Form submits, redirects on success | |
| Registration | Create new account | Form validates and submits | |
| Logout | Sign out action | Session ends, redirects to home | |
| Error Handling | Invalid credentials | Error message displays | |
| Password Reset | Forgot password flow | Email prompt appears | |

### Phase 5: Admin Panel
**URL**: `/admin/*` (e.g., `/admin/inventory`)

| Item | Description | Expected Result | ✓ |
|------|-------------|-----------------|---|
| Access Control | Admin-only access | Non-admin users redirected | |
| Product CRUD | Create/Read/Update/Delete | All operations work | |
| Category Management | Manage categories | Categories editable | |
| User Management | Manage users | User list and actions work | |
| Order Management | View/process orders | Orders manageable | |

---

## Automated Testing

### Test Stack
- **Unit Tests**: Vitest + React Testing Library
- **Component Tests**: Vitest + Testing Library
- **E2E Tests**: Playwright
- **Coverage Tool**: Vitest Coverage (c8)

### Running Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Test File Naming Conventions

```
src/
├── domain/
│   └── entities/
│       ├── user.entity.ts
│       └── user.entity.spec.ts     # Unit test
├── application/
│   └── use-cases/
│       ├── login.usecase.ts
│       └── login.usecase.spec.ts   # Unit test
├── presentation/
│   └── components/
│       ├── LoginForm.tsx
│       └── LoginForm.test.tsx      # Component test
└── tests/
    └── e2e/
        └── auth.spec.ts            # E2E test
```

### Coverage Targets

| Layer | Target Coverage |
|-------|----------------|
| Domain | ≥ 100% |
| Application | ≥ 90% |
| Infrastructure | ≥ 70% |
| Presentation | ≥ 80% |

---

## Testing by Layer

### Domain Layer Tests
Location: `src/domain/**/*.spec.ts`

```typescript
// Example: user.entity.spec.ts
import { describe, it, expect } from 'vitest';
import { User } from './user.entity';

describe('User Entity', () => {
  it('should create a valid user', () => {
    const user = User.create({
      email: 'test@example.com',
      name: 'Test User',
      role: 'customer'
    });
    
    expect(user.email).toBe('test@example.com');
    expect(user.isValid()).toBe(true);
  });
  
  it('should reject invalid email', () => {
    expect(() => User.create({
      email: 'invalid-email',
      name: 'Test',
      role: 'customer'
    })).toThrow('Invalid email format');
  });
});
```

### Application Layer Tests
Location: `src/application/**/*.spec.ts`

```typescript
// Example: login.usecase.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { LoginUseCase } from './login.usecase';

describe('LoginUseCase', () => {
  it('should authenticate valid credentials', async () => {
    const mockUserRepo = {
      findByEmail: vi.fn().mockResolvedValue({ id: '1', password: 'hashed' }),
    };
    
    const useCase = new LoginUseCase(mockUserRepo);
    const result = await useCase.execute({ email: 'test@test.com', password: 'pass' });
    
    expect(result.success).toBe(true);
  });
});
```

### Component Tests
Location: `src/presentation/**/*.test.tsx`

```typescript
// Example: LoginForm.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('should render login form', () => {
    render(<LoginForm onSubmit={() => {}} />);
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  
  it('should call onSubmit with credentials', async () => {
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password'
    });
  });
});
```

### E2E Tests
Location: `tests/e2e/*.spec.ts`

```typescript
// Example: auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'validpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });
  
  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid="email-input"]', 'wrong@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });
});
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, feat/restructure-v2]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Tests not finding components | Check import paths and aliases |
| Mock not working | Ensure `vi.mock()` is at top of file |
| Async test timeout | Increase timeout or check async operations |
| E2E selector not found | Add `data-testid` attributes to components |

---

**Last Updated**: $(date)  
**Version**: 2.0.0  
**Maintainer**: AgroDeep Team
