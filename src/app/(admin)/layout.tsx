import { ReactNode } from 'react';
import { AdminSidebar } from '@/presentation/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/presentation/components/admin/layout/AdminHeader';
import { RequireAdminRole } from '@/router/guards/RequireAdminRole';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Main layout for admin dashboard
 * Includes sidebar navigation and header
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RequireAdminRole>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </RequireAdminRole>
  );
}
