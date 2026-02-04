import { BrowserRouter } from 'react-router-dom';
import { AuthProviderComponent } from '@presentation/contexts/AuthContext';
import { AppRoutes } from '@router/AppRoutes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

/**
 * New application root using React Router.
 *
 * The former state-based router is kept in `src/app/App.tsx` for reference,
 * but the application entrypoint now renders this component.
 */
export default function AppRouterRoot() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderComponent>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProviderComponent>
    </QueryClientProvider>
  );
}
