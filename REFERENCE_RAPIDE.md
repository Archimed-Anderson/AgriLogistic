# ⚡ RÉFÉRENCE RAPIDE - AGRODEEP v2.1

## 🗺️ **CARTE DES ROUTES**

### **Routes Publiques**
```
/                    → LandingPageInteractive
/login               → LoginScreen
/register            → RegisterScreen
```

### **Routes Admin** (Préfixe: `/admin`)
```
/admin/dashboard              → AdminDashboard ⭐
/admin/analytics              → AnalyticsDashboard
/admin/chat                   → ChatInterface
/admin/marketplace            → MarketplaceModern
/admin/rental                 → RentalMarketplace (Loueur)
/admin/blog                   → BlogHome
/admin/blog/article           → BlogArticle
/admin/blog/manage            → BlogAdmin
/admin/academy                → AcademyPortal
/admin/users                  → UserManagement
/admin/products               → ProductInventory
/admin/orders                 → OrdersManagement
/admin/categories             → CategoryManagement
/admin/reports                → ReportEngine
/admin/logistics              → LogisticsTracking
/admin/transport-calculator   → TransportCalculator 🆕
/admin/tracking               → ShippingTracker 🆕
/admin/carrier-dashboard      → CarrierDashboard 🆕
/admin/b2b-chat               → B2BChat 🆕
/admin/iot                    → IoTDeviceHub
/admin/automation             → AutomationWorkflows
/admin/ai-insights            → AIInsights
/admin/finance                → FinancialSuite
/admin/crops                  → CropIntelligence
/admin/settings               → Settings
/admin/profile                → ProfilePage
/admin/notifications          → NotificationsPage
```

### **Routes Customer** (Préfixe: `/customer`)
```
/customer/dashboard           → CustomerDashboard ⭐
/customer/analytics           → AnalyticsDashboard
/customer/chat                → ChatInterface
/customer/marketplace         → MarketplaceModern
/customer/rental              → RentalMarketplace
/customer/blog                → BlogHome
/customer/academy             → AcademyPortal
/customer/orders              → OrdersManagement
/customer/transport-calculator → TransportCalculator 🆕
/customer/tracking            → ShippingTracker 🆕
/customer/b2b-chat            → B2BChat 🆕
/customer/iot                 → IoTDeviceHub
/customer/ai-insights         → AIInsights
/customer/finance             → FinancialSuite
/customer/crops               → CropIntelligence
/customer/payments            → (À créer)
/customer/settings            → Settings
/customer/profile             → ProfilePage
/customer/notifications       → NotificationsPage
```

---

## 📂 **STRUCTURE DES COMPOSANTS**

### **Localisation**
```
/src/app/components/
├── Core/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── LandingPageInteractive.tsx
│   ├── LoginScreen.tsx
│   └── RegisterScreen.tsx
│
├── Dashboards/
│   ├── AdminDashboard.tsx ⭐
│   ├── CustomerDashboard.tsx ⭐
│   └── AnalyticsDashboard.tsx
│
├── Features/
│   ├── ChatInterface.tsx
│   ├── MarketplaceModern.tsx
│   ├── RentalMarketplace.tsx (Loueur)
│   ├── Settings.tsx
│   ├── ProfilePage.tsx
│   └── NotificationsPage.tsx
│
├── Blog/
│   ├── BlogHome.tsx
│   ├── BlogArticle.tsx
│   └── BlogAdmin.tsx
│
├── Academy/
│   └── AcademyPortal.tsx
│
├── Admin/
│   ├── UserManagement.tsx
│   ├── ProductInventory.tsx
│   ├── OrdersManagement.tsx
│   ├── CategoryManagement.tsx
│   └── ReportEngine.tsx
│
├── Advanced/
│   ├── IoTDeviceHub.tsx
│   ├── AutomationWorkflows.tsx
│   ├── AIInsights.tsx
│   ├── FinancialSuite.tsx
│   ├── LogisticsTracking.tsx
│   └── CropIntelligence.tsx
│
├── B2B/ 🆕
│   ├── TransportCalculator.tsx
│   ├── ShippingTracker.tsx
│   ├── PriceNegotiator.tsx
│   ├── B2BChat.tsx
│   └── CarrierDashboard.tsx
│
└── ui/
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── ...
```

---

## 🎨 **PALETTE DE COULEURS**

### **Primaires**
```css
AgroDeep Green: #0B7A4B
Tech Blue:      #1A5F7A
```

### **Secondaires**
```css
Success:  #10B981 (green-500)
Warning:  #F59E0B (orange-500)
Error:    #EF4444 (red-500)
Info:     #3B82F6 (blue-500)
```

### **Gradients**
```css
Green:  from-green-600 to-emerald-600
Blue:   from-blue-600 to-indigo-700
Purple: from-purple-600 to-pink-600
```

### **Neutrals**
```css
Gray-50:  #F9FAFB
Gray-100: #F3F4F6
Gray-200: #E5E7EB
Gray-700: #374151
Gray-800: #1F2937
Gray-900: #111827
```

---

## 🔤 **TYPOGRAPHIE**

### **Police**
```css
Font Family: Inter
Fallback: ui-sans-serif, system-ui, sans-serif
```

### **Tailles**
```css
text-xs:   0.75rem (12px)
text-sm:   0.875rem (14px)
text-base: 1rem (16px)
text-lg:   1.125rem (18px)
text-xl:   1.25rem (20px)
text-2xl:  1.5rem (24px)
text-3xl:  1.875rem (30px)
text-4xl:  2.25rem (36px)
```

### **Poids**
```css
font-normal:    400
font-medium:    500
font-semibold:  600
font-bold:      700
```

---

## 🧩 **COMPOSANTS UI RÉUTILISABLES**

### **Button**
```typescript
import { Button } from "./components/ui/button";

<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### **Card**
```typescript
import { Card } from "./components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>Contenu</CardContent>
</Card>
```

### **Input**
```typescript
import { Input } from "./components/ui/input";

<Input 
  type="text" 
  placeholder="Placeholder"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

## 📦 **PROPS COMMUNES**

### **Navigation**
```typescript
interface NavigationProps {
  onNavigate: (route: string) => void;
}

// Usage
<Component onNavigate={handleNavigate} />
```

### **Theme**
```typescript
interface ThemeProps {
  theme: "light" | "dark";
  onThemeToggle?: () => void;
}
```

### **Data**
```typescript
interface DataProps {
  items: Item[];
  onSelect?: (item: Item) => void;
  onDelete?: (id: string) => void;
}
```

---

## 🎯 **HOOKS PERSONNALISÉS**

### **useNavigation**
```typescript
const { navigate, currentRoute } = useNavigation();

navigate("/admin/dashboard");
```

### **useTheme**
```typescript
const { theme, toggleTheme } = useTheme();

toggleTheme(); // Light ⇄ Dark
```

### **useAuth**
```typescript
const { user, isAuthenticated, login, logout } = useAuth();

if (isAuthenticated) {
  // Afficher contenu protégé
}
```

---

## 🔔 **NOTIFICATIONS (Sonner)**

### **Usage**
```typescript
import { toast } from "sonner";

// Success
toast.success("Opération réussie !");

// Error
toast.error("Une erreur s'est produite");

// Info
toast.info("Information importante");

// Warning
toast.warning("Attention !");

// Loading
toast.loading("Chargement en cours...");

// Custom
toast("Message personnalisé", {
  duration: 3000,
  position: "top-right"
});
```

---

## 🎨 **CLASSES TAILWIND FRÉQUENTES**

### **Layout**
```css
/* Container */
container mx-auto px-4 max-w-7xl

/* Flex */
flex items-center justify-between gap-4

/* Grid */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

/* Responsive */
hidden md:block
w-full md:w-1/2 lg:w-1/3
```

### **Boutons**
```css
/* Primary */
bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg

/* Secondary */
bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg

/* Outline */
border-2 border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg

/* Ghost */
text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg
```

### **Cards**
```css
bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm
```

### **Text**
```css
/* Heading */
text-2xl font-bold text-gray-900 dark:text-white

/* Body */
text-sm text-gray-600 dark:text-gray-400

/* Muted */
text-xs text-gray-500 dark:text-gray-500
```

---

## 🔐 **AUTHENTIFICATION**

### **Routes Protégées**
```typescript
// Dans App.tsx
const isAuthenticated = !["/", "/login", "/register"].includes(currentRoute);

// Afficher Navbar/Sidebar seulement si authentifié
{isAuthenticated && <Navbar />}
```

### **Credentials de Test**
```
Admin:
  Email: admin@agrodeep.com
  Password: admin123

User:
  Email: user@agrodeep.com
  Password: user123
```

---

## 📊 **DONNÉES MOCKÉES**

### **Localisation**
```
/src/app/data/mockData.ts
```

### **Types Disponibles**
```typescript
- chatConversations
- messages
- analyticsData
- products
- rentalEquipment
- blogPosts
- courses
- users
- orders
- categories
```

### **Usage**
```typescript
import { products } from "../data/mockData";

const [items, setItems] = useState(products);
```

---

## 🚀 **COMMANDES UTILES**

### **Développement**
```bash
# Démarrer le serveur dev
npm run dev

# Build production
npm run build

# Preview production
npm run preview

# Linter
npm run lint

# Tests (si configurés)
npm test
```

### **Git**
```bash
# Commit
git add .
git commit -m "feat: ajout fonctionnalité X"

# Push
git push origin main

# Pull
git pull origin main
```

---

## 🐛 **DÉBOGAGE RAPIDE**

### **Console Logs**
```typescript
console.log("🔵 Debug:", variable);
console.error("🔴 Erreur:", error);
console.warn("⚠️ Warning:", warning);
console.table(array); // Pour tableaux/objets
```

### **React DevTools**
```
1. F12 → Onglet "Components"
2. Inspecter props/state
3. Vérifier re-renders
```

### **Breakpoints**
```typescript
debugger; // Le code s'arrêtera ici
```

---

## 📝 **CONVENTIONS DE CODE**

### **Nommage**
```typescript
// Composants : PascalCase
function MyComponent() {}

// Fonctions : camelCase
const handleClick = () => {};

// Constantes : UPPER_SNAKE_CASE
const API_URL = "https://api.example.com";

// Fichiers : PascalCase pour composants, kebab-case pour utils
MyComponent.tsx
my-utility.ts
```

### **Structure de Composant**
```typescript
// 1. Imports
import { useState } from "react";
import { Icon } from "lucide-react";

// 2. Interface
interface Props {
  name: string;
  onAction: () => void;
}

// 3. Composant
export function MyComponent({ name, onAction }: Props) {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Handlers
  const handleClick = () => {
    // ...
  };

  // 6. Render
  return (
    <div>...</div>
  );
}
```

---

## ✅ **CHECKLIST NOUVELLE FEATURE**

```
☐ Créer le composant dans /src/app/components/
☐ Définir l'interface Props
☐ Implémenter la logique
☐ Ajouter les styles Tailwind
☐ Importer dans App.tsx
☐ Ajouter la route dans renderContent()
☐ Ajouter l'item dans Sidebar.tsx
☐ Tester la navigation
☐ Tester l'interactivité
☐ Vérifier responsive
☐ Vérifier dark mode
☐ Documenter dans README
☐ Commit et push
```

---

## 🔗 **LIENS UTILES**

### **Documentation**
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev
- Sonner Toast: https://sonner.emilkowal.ski

### **Outils**
- VS Code: https://code.visualstudio.com
- Git: https://git-scm.com
- Node.js: https://nodejs.org

---

## 📞 **SUPPORT**

### **Problème d'interactivité ?**
```
1. Consulter /DEBUG_GUIDE.md
2. Vérifier /CORRECTION_INTERACTIVITE.md
3. Suivre /GUIDE_TEST_RAPIDE.md
```

### **Nouvelle feature B2B ?**
```
1. Consulter /NOUVELLES_FONCTIONNALITES_B2B.md
2. Exemples d'utilisation fournis
3. Intégration documentée
```

---

## 🎓 **FORMATION RAPIDE**

### **Nouveau développeur ?**
```
1. Lire ce fichier (REFERENCE_RAPIDE.md)
2. Explorer /src/app/components/
3. Tester l'application localement
4. Suivre GUIDE_TEST_RAPIDE.md
5. Consulter DEBUG_GUIDE.md si problème
```

### **Premier commit ?**
```
1. Clone le repo
2. npm install
3. npm run dev
4. Créer une branche: git checkout -b feature/ma-feature
5. Développer
6. Tester
7. Commit: git commit -m "feat: description"
8. Push: git push origin feature/ma-feature
9. Créer Pull Request
```

---

**Version :** AgroDeep v2.1  
**Dernière mise à jour :** 14 Janvier 2026  
**Statut :** ✅ Production Ready
