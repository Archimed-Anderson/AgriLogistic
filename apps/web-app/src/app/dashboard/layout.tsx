// Avoid static prerender: dashboard pages use client context (Auth, etc.) which can break during build.
export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
