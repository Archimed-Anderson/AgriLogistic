// Avoid static prerender: dashboard pages use client context (Auth, etc.) which can break during build.
export const dynamic = 'force-dynamic';

import { MainLayout } from '@/components/layout/MainLayout';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
