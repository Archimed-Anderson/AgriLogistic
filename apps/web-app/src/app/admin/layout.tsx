import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { ThemeProvider } from '@/context/ThemeContext';

// Avoid static prerender: admin uses client context (Theme, Auth) which can break during build.
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div
        className="flex min-h-screen transition-colors duration-500"
        style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)' }}
      >
        {/* Fixed Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminNavbar />
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="container mx-auto p-4 md:p-8">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
