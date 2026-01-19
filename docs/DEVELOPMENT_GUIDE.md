# 🚀 AgroLogistic - Guide de Développement

## Table des Matières

1. [Setup Initial](#-setup-initial)
2. [Workflow de Développement](#-workflow-de-développement)
3. [Standards de Code](#-standards-de-code)
4. [Architecture Patterns](#-architecture-patterns)
5. [Testing](#-testing)
6. [Debugging](#-debugging)
7. [Performance](#-performance)
8. [Déploiement](#-déploiement)

---

## 🎯 Setup Initial

### Prérequis

```bash
Node.js: >= 18.0.0
pnpm: >= 8.0.0
Git: >= 2.30.0
```

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/votre-org/AgroLogistic-platform.git
cd AgroLogistic-platform

# 2. Installer les dépendances
pnpm install

# 3. Copier les variables d'environnement
cp .env.example .env

# 4. Configurer les variables d'environnement
# Éditer .env avec vos valeurs

# 5. Lancer en développement
pnpm dev
```

### Configuration VSCode (Recommandée)

#### Extensions Requises
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

#### Settings VSCode
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## 🔄 Workflow de Développement

### 1. Créer une nouvelle branche

```bash
# Feature branch
git checkout -b feature/transport-calculator

# Bugfix branch
git checkout -b fix/order-validation

# Hotfix branch
git checkout -b hotfix/payment-crash
```

### 2. Développement

```bash
# Lancer le serveur de développement
pnpm dev

# Lancer les tests en watch mode
pnpm test:watch

# Linter en mode watch
pnpm lint:watch
```

### 3. Commits Conventionnels

Format: `<type>(<scope>): <description>`

```bash
# Types autorisés
feat:     Nouvelle fonctionnalité
fix:      Correction de bug
docs:     Documentation uniquement
style:    Formatting, missing semi-colons, etc
refactor: Refactoring de code
test:     Ajout de tests
chore:    Maintenance, dependencies, etc
perf:     Performance improvements
ci:       CI/CD changes

# Exemples
git commit -m "feat(transport): add cost calculator component"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(api): update endpoint documentation"
git commit -m "refactor(domain): extract price calculation logic"
```

### 4. Pull Request

```bash
# 1. Push vers origin
git push origin feature/transport-calculator

# 2. Créer PR sur GitHub
# 3. Remplir le template de PR
# 4. Attendre review + CI checks
# 5. Merge après approbation
```

---

## 📐 Standards de Code

### TypeScript

#### Configuration Stricte
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### Types vs Interfaces

```typescript
// ✅ CORRECT: Utiliser TYPE pour unions et primitives
type Status = "pending" | "approved" | "rejected";
type ID = string | number;

// ✅ CORRECT: Utiliser INTERFACE pour objets et classes
interface User {
  id: string;
  name: string;
  email: Email; // Value Object
}

// ❌ INCORRECT: Type pour objet simple
type User = {
  id: string;
  name: string;
};
```

#### Naming Conventions

```typescript
// Classes & Interfaces: PascalCase
class UserEntity {}
interface OrderRepository {}

// Functions & Variables: camelCase
const calculateTotal = () => {};
const userCount = 10;

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = "https://api.AgroLogistic.com";
const MAX_RETRY_ATTEMPTS = 3;

// Private properties: _prefixed
class Order {
  private _items: OrderItem[];
  
  get items(): readonly OrderItem[] {
    return this._items;
  }
}

// Type Parameters: Single letter or PascalCase
type Result<T> = { data: T } | { error: Error };
type ApiResponse<TData, TError = Error> = {};
```

---

## 🏗️ Architecture Patterns

### 1. Domain Entity Pattern

```typescript
// ✅ CORRECT: Immutable entity avec méthodes métier
export class Order {
  private constructor(
    private readonly _id: string,
    private readonly _items: OrderItem[],
    private readonly _status: OrderStatus,
    private readonly _createdAt: Date
  ) {}

  static create(items: OrderItem[]): Order {
    if (items.length === 0) {
      throw new InvalidOrderException("Order must have at least one item");
    }
    
    return new Order(
      generateId(),
      items,
      OrderStatus.PENDING,
      new Date()
    );
  }

  get id(): string {
    return this._id;
  }

  get total(): Price {
    return this._items.reduce(
      (sum, item) => sum.add(item.price),
      Price.zero()
    );
  }

  approve(): Order {
    if (this._status !== OrderStatus.PENDING) {
      throw new InvalidOrderException("Only pending orders can be approved");
    }
    
    return new Order(
      this._id,
      this._items,
      OrderStatus.APPROVED,
      this._createdAt
    );
  }
}
```

### 2. Use Case Pattern

```typescript
// ✅ CORRECT: Use case avec single responsibility
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventBus: EventBus,
    private readonly pricingService: PricingService
  ) {}

  async execute(dto: CreateOrderDTO): Promise<OrderResponseDTO> {
    // 1. Validation
    this.validate(dto);

    // 2. Create domain entity
    const order = Order.create(
      dto.items.map(item => 
        OrderItem.create(item.productId, item.quantity)
      )
    );

    // 3. Apply business rules
    const finalPrice = await this.pricingService.calculateFinalPrice(
      order.total,
      dto.discountCode
    );

    // 4. Persist
    await this.orderRepository.save(order);

    // 5. Publish event
    await this.eventBus.publish(
      new OrderPlacedEvent(order.id, finalPrice)
    );

    // 6. Return DTO
    return OrderMapper.toResponseDTO(order);
  }

  private validate(dto: CreateOrderDTO): void {
    if (!dto.items || dto.items.length === 0) {
      throw new ValidationException("Order items cannot be empty");
    }
  }
}
```

### 3. Repository Pattern

```typescript
// ✅ CORRECT: Interface dans domain, implémentation dans infrastructure
// src/domain/repositories/order.repository.ts
export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  delete(id: string): Promise<void>;
}

// src/infrastructure/persistence/supabase/order.repository.impl.ts
export class SupabaseOrderRepository implements OrderRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async save(order: Order): Promise<void> {
    const dto = OrderMapper.toPersistenceDTO(order);
    
    const { error } = await this.supabase
      .from('orders')
      .insert(dto);

    if (error) {
      throw new PersistenceException(`Failed to save order: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    
    return OrderMapper.toDomain(data);
  }
}
```

### 4. React Component Pattern

```typescript
// ✅ CORRECT: Composition et séparation des responsabilités

// Container (Smart Component)
export const ProductListContainer: React.FC = () => {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <ProductList
      products={products}
      onAddToCart={addToCart}
    />
  );
};

// Presentational Component
interface ProductListProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToCart
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => onAddToCart(product.id)}
        />
      ))}
    </div>
  );
};
```

### 5. Custom Hook Pattern

```typescript
// ✅ CORRECT: Hook réutilisable avec logique encapsulée
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const searchProductsUseCase = useMemo(
    () => container.resolve(SearchProductsUseCase),
    []
  );

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const result = await searchProductsUseCase.execute({});
        setProducts(result.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchProductsUseCase]);

  return { products, loading, error };
};
```

---

## 🧪 Testing

### Structure de Tests

```
tests/
├── unit/
│   ├── domain/          # Tests des entities, VOs
│   ├── application/     # Tests des use cases
│   └── presentation/    # Tests des hooks, utils
├── integration/
│   ├── api/            # Tests API
│   └── repositories/   # Tests repositories
└── e2e/
    └── *.spec.ts       # Tests end-to-end
```

### Unit Tests (Vitest)

```typescript
// tests/unit/domain/entities/order.entity.spec.ts
describe('Order Entity', () => {
  describe('create', () => {
    it('should create order with valid items', () => {
      const items = [
        OrderItem.create('product-1', 2),
        OrderItem.create('product-2', 1)
      ];

      const order = Order.create(items);

      expect(order.items).toHaveLength(2);
      expect(order.status).toBe(OrderStatus.PENDING);
    });

    it('should throw error when items are empty', () => {
      expect(() => Order.create([])).toThrow(InvalidOrderException);
    });
  });

  describe('approve', () => {
    it('should approve pending order', () => {
      const order = Order.create([OrderItem.create('product-1', 1)]);
      
      const approvedOrder = order.approve();

      expect(approvedOrder.status).toBe(OrderStatus.APPROVED);
    });

    it('should throw error when order is not pending', () => {
      const order = Order.create([OrderItem.create('product-1', 1)])
        .approve();

      expect(() => order.approve()).toThrow(InvalidOrderException);
    });
  });
});
```

### Integration Tests

```typescript
// tests/integration/repositories/order.repository.spec.ts
describe('SupabaseOrderRepository', () => {
  let repository: OrderRepository;
  let supabase: SupabaseClient;

  beforeEach(() => {
    supabase = createTestSupabaseClient();
    repository = new SupabaseOrderRepository(supabase);
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  it('should save and retrieve order', async () => {
    const order = Order.create([
      OrderItem.create('product-1', 2)
    ]);

    await repository.save(order);
    const retrieved = await repository.findById(order.id);

    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(order.id);
  });
});
```

### Component Tests

```typescript
// tests/unit/presentation/components/ProductCard.spec.tsx
describe('ProductCard', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Tracteur',
    price: Price.create(50000, 'EUR')
  };

  it('should render product information', () => {
    render(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);

    expect(screen.getByText('Tracteur')).toBeInTheDocument();
    expect(screen.getByText('50,000 EUR')).toBeInTheDocument();
  });

  it('should call onAddToCart when button clicked', async () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/checkout.spec.ts
test.describe('Checkout Flow', () => {
  test('should complete full checkout', async ({ page }) => {
    // 1. Navigate to marketplace
    await page.goto('/marketplace');

    // 2. Add product to cart
    await page.click('[data-testid="product-1-add-to-cart"]');

    // 3. Go to cart
    await page.click('[data-testid="cart-icon"]');

    // 4. Proceed to checkout
    await page.click('[data-testid="checkout-button"]');

    // 5. Fill shipping info
    await page.fill('[name="address"]', '123 Farm Road');
    await page.fill('[name="city"]', 'Paris');

    // 6. Submit order
    await page.click('[data-testid="submit-order"]');

    // 7. Verify success
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
  });
});
```

```typescript
// tests/e2e/marketplace-modern-admin.spec.ts
test.describe('MarketplaceModern - Product Admin', () => {
  test('should configure promotion from admin tab and display it', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="admin-toggle"]');

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    await page.click('[data-testid="product-tab-admin"]');

    await page.click('[data-testid="admin-promo-toggle"]');
    await page.selectOption('[data-testid="admin-promo-type"]', 'percentage');
    await page.fill('[data-testid="admin-promo-value"]', '10');
    await page.click('[data-testid="admin-save"]');

    await firstProduct.click();
    await expect(page.locator('[data-testid="product-detail-panel"]')).toBeVisible();
    await expect(page.locator('text=Promotion active')).toBeVisible();
  });
});
```

---

## 🐛 Debugging

### VSCode Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug App",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "/@/*": "${webRoot}/*"
      }
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["test", "--run"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Console Logging Strategy

```typescript
// ✅ CORRECT: Structured logging
import { logger } from '@/infrastructure/logging/logger';

logger.info('Order created', {
  orderId: order.id,
  userId: user.id,
  totalAmount: order.total.value
});

logger.error('Payment failed', {
  orderId: order.id,
  error: error.message,
  stack: error.stack
});

// ❌ INCORRECT: console.log en production
console.log('Order created:', order);
```

---

## ⚡ Performance

### Bundle Analysis

```bash
# Analyser la taille du bundle
pnpm build
pnpm analyze
```

### Code Splitting

```typescript
// ✅ CORRECT: Lazy loading des routes
import { lazy } from 'react';

const MarketplacePage = lazy(() => import('@/presentation/pages/MarketplacePage'));
const AdminPage = lazy(() => import('@/presentation/pages/AdminPage'));

// Routes
<Route path="/marketplace" element={<Suspense fallback={<Spinner />}><MarketplacePage /></Suspense>} />
```

### Memoization

```typescript
// ✅ CORRECT: Memoization appropriée
const ExpensiveComponent: React.FC<Props> = ({ data }) => {
  const processedData = useMemo(
    () => expensiveCalculation(data),
    [data]
  );

  return <div>{processedData}</div>;
};

export default React.memo(ExpensiveComponent);
```

---

## 🚀 Déploiement

### Build Production

```bash
# Build optimisé
pnpm build

# Preview du build
pnpm preview

# Run tests avant deploy
pnpm test:ci
```

### Variables d'Environnement

```bash
# .env.production
VITE_API_URL=https://api.AgroLogistic.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ENABLE_ANALYTICS=true
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml (simplifié)
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test:ci
      - run: pnpm build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: vercel --prod
```

---

## 📚 Ressources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Folder Structure](./FOLDER_STRUCTURE.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Component Library](./COMPONENT_LIBRARY.md)

---

## 🆘 Besoin d'Aide ?

- 💬 Slack: #AgroLogistic-dev
- 📧 Email: dev@AgroLogistic.com
- 🐛 Issues: GitHub Issues
- 📖 Wiki: GitHub Wiki

---

**Happy Coding! 🚜🌾**
