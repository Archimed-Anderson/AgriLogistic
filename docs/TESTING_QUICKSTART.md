# 🧪 Testing & QA - Quick Start Guide

## ✅ Tests Successfully Configured!

All 21 unit tests passing ✓

```
✓ src/lib/utils.test.ts (21)
  ✓ Formatters (11)
    ✓ formatCurrency (5)
    ✓ formatDate (2)
    ✓ formatWeight (4)
  ✓ Validators (10)
    ✓ validateEmail (3)
    ✓ validatePassword (7)
```

---

## 🚀 Quick Commands

### Run Tests

```bash
# Unit tests (watch mode)
pnpm test

# Run once
pnpm test:unit

# With UI
pnpm test:unit:ui

# Coverage report
pnpm test:coverage

# E2E tests
pnpm test:e2e

# All tests
pnpm test:all
```

### View Results

```bash
# Open coverage report
start coverage/index.html

# Open Playwright report
pnpm test:e2e:report
```

---

## 📊 Current Test Coverage

| Category | Tests | Status |
|----------|-------|--------|
| **Formatters** | 11 | ✅ 100% |
| **Validators** | 10 | ✅ 100% |
| **Total** | 21 | ✅ Passing |

---

## 📁 Test Files Structure

```
apps/web-app/
├── tests/
│   ├── setup.ts                    # Vitest configuration
│   └── e2e/                        # E2E tests (Playwright)
│       ├── admin-dashboard.spec.ts
│       ├── auth.spec.ts
│       └── marketplace-validation.spec.ts
├── src/
│   └── lib/
│       └── utils.test.ts           # ✅ Unit tests (21 passing)
├── vitest.config.ts                # Vitest config
└── playwright.config.ts            # Playwright config
```

---

## 🎯 Next Steps

### 1. Add More Unit Tests

Create tests for:
- [ ] Components (`src/components/**/*.test.tsx`)
- [ ] Hooks (`src/hooks/**/*.test.ts`)
- [ ] API clients (`src/lib/api/**/*.test.ts`)
- [ ] Store/State management

### 2. Run E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install --with-deps

# Run E2E tests
pnpm test:e2e

# Debug mode
pnpm test:e2e:debug
```

### 3. Set Up CI/CD

Add to `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test:unit
      - run: pnpm test:coverage
      
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## 📚 Documentation

- **[Testing Strategy](TESTING_STRATEGY.md)** - Complete testing guide
- **[Implementation Summary](TESTING_IMPLEMENTATION.md)** - What was implemented

---

## 🔧 Troubleshooting

### Tests not running?

```bash
# Reinstall dependencies
pnpm install

# Clear cache
rm -rf node_modules/.vite
```

### Coverage not generating?

```bash
# Install coverage provider
pnpm add -D @vitest/coverage-v8
```

### Playwright errors?

```bash
# Install browsers
npx playwright install --with-deps
```

---

## 💡 Best Practices

### Writing Tests

1. **Follow AAA Pattern**
   ```typescript
   it('should do something', () => {
     // Arrange - Set up test data
     const input = 'test';
     
     // Act - Execute the function
     const result = myFunction(input);
     
     // Assert - Verify the result
     expect(result).toBe('expected');
   });
   ```

2. **Test Edge Cases**
   - Empty values
   - Null/undefined
   - Boundary values
   - Error conditions

3. **Keep Tests Isolated**
   - Each test should be independent
   - Use `beforeEach` for setup
   - Use `afterEach` for cleanup

4. **Use Descriptive Names**
   ```typescript
   // ❌ Bad
   it('test 1', () => { ... });
   
   // ✅ Good
   it('formats currency with proper spacing', () => { ... });
   ```

### Running Tests

1. **Watch Mode** - During development
   ```bash
   pnpm test
   ```

2. **CI Mode** - Before committing
   ```bash
   pnpm test:unit && pnpm test:e2e
   ```

3. **Coverage** - Check gaps
   ```bash
   pnpm test:coverage
   ```

---

## 🎉 Success!

Your testing infrastructure is ready! Start writing tests and aim for 80%+ coverage.

**Current Status:**
- ✅ Vitest configured
- ✅ Playwright configured
- ✅ 21 unit tests passing
- ✅ Test scripts ready
- ✅ Coverage reporting enabled

**Happy Testing! 🧪**
