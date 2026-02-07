# 🤝 Contributing to AgriLogistic

First off, thank you for considering contributing to AgriLogistic! It's people like you that make AgriLogistic such a great platform for African agriculture.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to creating a positive environment include:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior include:**

- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 11, macOS 14]
 - Browser: [e.g. Chrome 120, Safari 17]
 - Node Version: [e.g. 20.10.0]
 - Version: [e.g. 5.0.0]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

**Feature Request Template:**

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Your First Code Contribution

Unsure where to begin contributing? You can start by looking through these `good-first-issue` and `help-wanted` issues:

- **Good first issues** - issues which should only require a few lines of code
- **Help wanted issues** - issues which should be a bit more involved

---

## 💻 Development Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js**: 20.x LTS
- **pnpm**: 9.x
- **Python**: 3.11+
- **PostgreSQL**: 16+ (or Neon account)
- **Redis**: 7.2+
- **Docker**: Latest (optional)

### Fork & Clone

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/agrilogistic.git
cd AgroDeep

# 3. Add upstream remote
git remote add upstream https://github.com/original-org/agrilogistic.git

# 4. Verify remotes
git remote -v
```

### Install Dependencies

```bash
# Install all dependencies
pnpm install

# Generate Prisma Client
cd packages/database
npx prisma generate
cd ../..
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your local credentials
# Minimum required:
# - DATABASE_URL (local PostgreSQL or Neon)
# - REDIS_URL (local Redis)
# - JWT_SECRET (any random string)
```

### Start Development

```bash
# Start all services
pnpm dev

# Or start services individually
pnpm dev:web      # Frontend only
pnpm dev:api      # Backend API only
pnpm dev:ai       # AI service only
```

### Verify Setup

Visit:
- Frontend: http://localhost:3000
- API: http://localhost:3001/api
- AI Service: http://localhost:8000/docs

---

## 📝 Coding Standards

### TypeScript/JavaScript

We use **ESLint** and **Prettier** for code quality and formatting.

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

**Key Standards:**

- ✅ Use TypeScript strict mode
- ✅ Prefer `const` over `let`, avoid `var`
- ✅ Use meaningful variable names
- ✅ Add JSDoc comments for public APIs
- ✅ Follow functional programming principles
- ✅ Avoid `any` type, use proper typing

**Example:**

```typescript
// ❌ Bad
function calc(a: any, b: any) {
  return a + b;
}

// ✅ Good
/**
 * Calculates the sum of two numbers
 * @param a - First number
 * @param b - Second number
 * @returns Sum of a and b
 */
function calculateSum(a: number, b: number): number {
  return a + b;
}
```

### Python

We follow **PEP 8** style guide.

```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .
```

**Key Standards:**

- ✅ Use type hints
- ✅ Follow PEP 8 naming conventions
- ✅ Add docstrings for functions/classes
- ✅ Maximum line length: 88 characters (Black default)
- ✅ Use f-strings for formatting

**Example:**

```python
# ❌ Bad
def calc(a, b):
    return a + b

# ✅ Good
def calculate_sum(a: float, b: float) -> float:
    """
    Calculate the sum of two numbers.
    
    Args:
        a: First number
        b: Second number
        
    Returns:
        Sum of a and b
    """
    return a + b
```

### React Components

**Key Standards:**

- ✅ Use functional components with hooks
- ✅ Prefer named exports
- ✅ Use TypeScript interfaces for props
- ✅ Extract complex logic into custom hooks
- ✅ Keep components small and focused

**Example:**

```typescript
// ❌ Bad
export default function Component(props: any) {
  return <div>{props.text}</div>;
}

// ✅ Good
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ text, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
```

### File Naming

- **Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `formatDate.ts`)
- **Hooks**: `use*.ts` (e.g., `useAuth.ts`)
- **Tests**: `*.test.ts` or `*.spec.ts`
- **Types**: `*.types.ts` or `types.ts`

---

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```bash
# Feature
feat(auth): add Google OAuth integration

# Bug fix
fix(api): resolve CORS issue on production

# Documentation
docs(readme): update deployment instructions

# Refactoring
refactor(components): extract Button component logic

# Performance
perf(ai): optimize model loading time by 47%

# Test
test(auth): add unit tests for login flow
```

### Commit Best Practices

- ✅ Use present tense ("add feature" not "added feature")
- ✅ Use imperative mood ("move cursor to..." not "moves cursor to...")
- ✅ Limit first line to 72 characters
- ✅ Reference issues and pull requests after the first line
- ✅ Consider starting the commit message with an emoji (optional)

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update your fork**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, tested code
   - Follow coding standards
   - Update documentation if needed

4. **Test your changes**
   ```bash
   pnpm test
   pnpm lint
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): your commit message"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting the PR

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template:

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Related Issues
Closes #123
```

### PR Review Process

1. **Automated Checks**: CI/CD pipeline will run automatically
   - Linting
   - Type checking
   - Unit tests
   - Integration tests
   - Build verification

2. **Code Review**: At least one maintainer will review your PR
   - Code quality
   - Test coverage
   - Documentation
   - Performance impact

3. **Feedback**: Address any requested changes
   ```bash
   # Make changes
   git add .
   git commit -m "fix: address review comments"
   git push origin feature/your-feature-name
   ```

4. **Approval**: Once approved, a maintainer will merge your PR

---

## 🧪 Testing Requirements

All contributions must include appropriate tests.

### Test Coverage Requirements

- **Minimum Coverage**: 80% for new code
- **Critical Paths**: 100% coverage required

### Writing Tests

**Unit Tests (Vitest/Jest)**

```typescript
import { describe, it, expect } from 'vitest';
import { calculateSum } from './math';

describe('calculateSum', () => {
  it('should add two positive numbers', () => {
    expect(calculateSum(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(calculateSum(-2, 3)).toBe(1);
  });

  it('should handle zero', () => {
    expect(calculateSum(0, 5)).toBe(5);
  });
});
```

**Integration Tests (Supertest)**

```typescript
import request from 'supertest';
import { app } from '../src/app';

describe('POST /api/auth/login', () => {
  it('should return JWT token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
  });
});
```

**E2E Tests (Playwright)**

```typescript
import { test, expect } from '@playwright/test';

test('user can login successfully', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'SecurePass123!');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
});
```

### Running Tests

```bash
# All tests
pnpm test

# Unit tests only
pnpm test:unit

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# With coverage
pnpm test:coverage
```

---

## 📚 Documentation

### Code Documentation

- **JSDoc/TSDoc**: Document all public APIs
- **Inline Comments**: Explain complex logic
- **README**: Update if adding new features

### Documentation Updates

If your PR includes:

- **New Feature**: Update relevant documentation
- **API Changes**: Update API documentation
- **Configuration Changes**: Update environment variables guide
- **Breaking Changes**: Add migration guide

### Documentation Style

```typescript
/**
 * Authenticates a user with email and password
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to JWT token
 * @throws {UnauthorizedException} If credentials are invalid
 * 
 * @example
 * ```typescript
 * const token = await authenticateUser('user@example.com', 'password123');
 * ```
 */
async function authenticateUser(email: string, password: string): Promise<string> {
  // Implementation
}
```

---

## 🏆 Recognition

Contributors will be recognized in:

- **README.md**: Contributors section
- **CHANGELOG.md**: Release notes
- **GitHub**: Contributor badge

---

## 📞 Getting Help

If you need help:

- **Discord**: [Join our Discord](https://discord.gg/agrilogistic)
- **GitHub Discussions**: [Start a discussion](https://github.com/your-org/agrilogistic/discussions)
- **Email**: dev@agrilogistic.com

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to AgriLogistic! 🌾**

*Together, we're building the future of African agriculture.*
