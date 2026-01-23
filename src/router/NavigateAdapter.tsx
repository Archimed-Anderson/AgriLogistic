import type { ComponentType } from "react";
import { useNavigate } from "react-router-dom";

type NavigateAdapterProps<P extends object> = {
  component: ComponentType<P & { onNavigate: (route: string) => void }>;
  props?: P;
};

/**
 * Adapter for legacy components that expect an `onNavigate(route)` prop.
 * It injects React Router's `navigate` while keeping the component API unchanged.
 */
export function NavigateAdapter<P extends object>({ component: Component, props }: NavigateAdapterProps<P>) {
  const navigate = useNavigate();
  return <Component {...(props || ({} as P))} onNavigate={(route) => navigate(route)} />;
}

