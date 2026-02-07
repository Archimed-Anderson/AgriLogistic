# @agrologistic/api-client

🌌 **Hyper-Speed Data Link** - Client API centralisé avec retry et error handling

## 📦 Installation

```bash
pnpm add @agrologistic/api-client
```

## 🚀 Utilisation

### Configuration de base

```typescript
import { createApiClient } from '@agrologistic/api-client';

const apiClient = createApiClient({
  baseURL: 'https://api.agrodeep.com/v1',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  withCredentials: true,
  debug: process.env.NODE_ENV === 'development',
});
```

### Avec authentification JWT

```typescript
import { createApiClient } from '@agrologistic/api-client';

const apiClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  
  // Fonction pour récupérer le token
  getAuthToken: async () => {
    // Depuis localStorage, cookie, ou autre
    return localStorage.getItem('access_token');
  },
  
  // Callback en cas d'erreur 401
  onAuthError: () => {
    // Rediriger vers login, refresh token, etc.
    window.location.href = '/login';
  },
});
```

### Requêtes

```typescript
// GET
const users = await apiClient.get('/users');
const user = await apiClient.get('/users/123');

// POST
const newUser = await apiClient.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// PUT
const updatedUser = await apiClient.put('/users/123', {
  name: 'Jane Doe',
});

// PATCH
const patchedUser = await apiClient.patch('/users/123', {
  email: 'jane@example.com',
});

// DELETE
await apiClient.delete('/users/123');
```

### Options de requête

```typescript
// Headers personnalisés
const data = await apiClient.get('/users', {
  headers: {
    'X-Custom-Header': 'value',
  },
});

// Query params
const users = await apiClient.get('/users', {
  params: {
    page: 1,
    limit: 10,
    sort: 'name',
  },
});

// Timeout spécifique
const data = await apiClient.get('/slow-endpoint', {
  timeout: 60000, // 60 secondes
});

// Désactiver retry
const data = await apiClient.post('/critical-operation', data, {
  noRetry: true,
});

// Avec AbortController
const controller = new AbortController();
const data = await apiClient.get('/users', {
  signal: controller.signal,
});

// Annuler la requête
controller.abort();
```

### Gestion des erreurs

```typescript
import { ApiError } from '@agrologistic/api-client';

try {
  const user = await apiClient.get('/users/123');
} catch (error) {
  const apiError = error as ApiError;
  
  console.error('Error:', apiError.message);
  console.error('Status:', apiError.statusCode);
  console.error('Timestamp:', apiError.timestamp);
  
  // Erreurs de validation
  if (apiError.errors) {
    Object.entries(apiError.errors).forEach(([field, messages]) => {
      console.error(`${field}:`, messages);
    });
  }
}
```

### Statistiques

```typescript
// Récupérer les statistiques
const stats = apiClient.getStats();

console.log('Total requests:', stats.totalRequests);
console.log('Successful:', stats.successfulRequests);
console.log('Failed:', stats.failedRequests);
console.log('Retries:', stats.totalRetries);
console.log('Avg response time:', stats.averageResponseTime, 'ms');

// Réinitialiser les statistiques
apiClient.resetStats();
```

### Instance Axios brute

```typescript
// Pour cas avancés
const axiosInstance = apiClient.getAxiosInstance();

// Utiliser directement axios
const response = await axiosInstance.request({
  method: 'GET',
  url: '/custom-endpoint',
});
```

## ✨ Fonctionnalités

### ✅ Retry automatique

- **3 tentatives** par défaut
- **Backoff exponentiel** (1s, 2s, 4s)
- Retry sur erreurs **5xx** et **erreurs réseau**
- Configurable par requête

### ✅ Interceptors

**Request:**
- Attache automatiquement le token JWT
- Tracking du temps de réponse
- Statistiques de requêtes

**Response:**
- Extraction automatique des données
- Normalisation des erreurs
- Gestion des erreurs 401 (auth)

### ✅ Error Handling

- Erreurs normalisées avec `ApiError`
- Erreurs de validation structurées
- Callback personnalisé pour erreurs auth
- Logs de debug

### ✅ TypeScript

- Types complets pour toutes les méthodes
- Inférence de types pour les réponses
- Interfaces documentées

## 📊 Structure des réponses

### Réponse réussie

```typescript
// Le client extrait automatiquement les données
const users = await apiClient.get<User[]>('/users');
// users est directement de type User[]
```

### Erreur API

```typescript
interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
  method?: string;
}
```

## 🔧 Configuration

```typescript
interface ApiClientConfig {
  baseURL: string;                    // URL de base (requis)
  timeout?: number;                   // Timeout (défaut: 30000ms)
  retries?: number;                   // Nombre de retries (défaut: 3)
  retryDelay?: number;                // Délai entre retries (défaut: 1000ms)
  headers?: Record<string, string>;   // Headers personnalisés
  withCredentials?: boolean;          // Envoyer cookies (défaut: true)
  getAuthToken?: () => string | null | Promise<string | null>;
  onAuthError?: () => void;           // Callback erreur 401
  debug?: boolean;                    // Logs de debug (défaut: false)
}
```

## 🎯 Exemples d'utilisation

### Next.js App Router

```typescript
// lib/api-client.ts
import { createApiClient } from '@agrologistic/api-client';

export const apiClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  getAuthToken: async () => {
    const { cookies } = await import('next/headers');
    return cookies().get('access_token')?.value || null;
  },
  onAuthError: () => {
    redirect('/login');
  },
});

// app/users/page.tsx
import { apiClient } from '@/lib/api-client';

export default async function UsersPage() {
  const users = await apiClient.get('/users');
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### React avec React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Query
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => apiClient.get('/users'),
});

// Mutation
const createUser = useMutation({
  mutationFn: (data: CreateUserDto) => apiClient.post('/users', data),
  onSuccess: () => {
    queryClient.invalidateQueries(['users']);
  },
});
```

## 📝 License

Proprietary - © 2024 AgriLogistic
