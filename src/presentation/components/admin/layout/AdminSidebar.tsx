import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart, 
  Settings, 
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission, AdminPermission } from '@/domain/admin/permissions';
import { cn } from '@/shared/utils/cn';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: AdminPermission;
  badge?: number;
}

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Utilisateurs',
      href: '/admin/users',
      icon: Users,
      permission: AdminPermission.USERS_VIEW,
    },
    {
      label: 'Produits',
      href: '/admin/products',
      icon: Package,
      permission: AdminPermission.PRODUCTS_VIEW,
    },
    {
      label: 'Commandes',
      href: '/admin/orders',
      icon: ShoppingCart,
      permission: AdminPermission.ORDERS_VIEW,
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart,
      permission: AdminPermission.ANALYTICS_VIEW_DASHBOARD,
    },
    {
      label: 'Système',
      href: '/admin/system',
      icon: Settings,
      permission: AdminPermission.SYSTEM_VIEW_HEALTH,
    },
    {
      label: 'Sécurité',
      href: '/admin/security',
      icon: Shield,
      permission: AdminPermission.SECURITY_VIEW_AUDIT_LOGS,
    },
  ];
  
  // Filter items based on permissions
  const visibleItems = navItems.filter(item => 
    !item.permission || (user?.adminRole && hasPermission(user.adminRole, item.permission))
  );
  
  return (
    <aside 
      className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 px-4">
        {collapsed ? (
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              AgroLogistic
            </span>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
                          location.pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Toggle button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
