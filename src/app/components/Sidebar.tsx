import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Truck,
  BarChart3,
  Settings,
  CreditCard,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Link,
  FileText,
  Sprout,
  Cpu,
  Brain,
  DollarSign,
  Zap,
  MessageCircle,
  BookOpen,
  Store,
  Home,
  GraduationCap,
  Calendar,
  TrendingUp,
  Calculator,
  Navigation2,
  Award,
} from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  type: "admin" | "customer";
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const adminMenuItems = [
  { icon: Users, label: "Gestion Utilisateurs", route: "/admin/users" },
  { icon: Package, label: "Produits", route: "/admin/products" },
  { icon: ShoppingCart, label: "Commandes", route: "/admin/orders" },
  { icon: TrendingUp, label: "Catégories", route: "/admin/categories" },
  { icon: FileText, label: "Rapports", route: "/admin/reports", badge: "Beta" },
  { icon: Truck, label: "Logistique", route: "/admin/logistics" },
  { icon: Calculator, label: "Calculateur Transport", route: "/admin/transport-calculator", badge: "New" },
  { icon: Navigation2, label: "Suivi Livraison", route: "/admin/tracking", badge: "New" },
  { icon: Award, label: "Affiliations", route: "/admin/affiliate-dashboard", badge: "💰" },
  { icon: Sprout, label: "Crop Intelligence", route: "/admin/crops" },
  { icon: Cpu, label: "IoT Hub", route: "/admin/iot" },
  { icon: Brain, label: "AI Insights", route: "/admin/ai-insights" },
  { icon: DollarSign, label: "Finance", route: "/admin/finance" },
  { icon: Zap, label: "Automation", route: "/admin/automation" },
  { icon: Settings, label: "Paramètres", route: "/admin/settings" }
];

const customerMenuItems = [
  { icon: ShoppingCart, label: "Mes Commandes", route: "/customer/orders" },
  { icon: Calculator, label: "Calculateur Transport", route: "/customer/transport-calculator", badge: "New" },
  { icon: Navigation2, label: "Suivi", route: "/customer/tracking" },
  { icon: Cpu, label: "IoT Hub", route: "/customer/iot" },
  { icon: Brain, label: "AI Insights", route: "/customer/ai-insights" },
  { icon: DollarSign, label: "Finance", route: "/customer/finance" },
  { icon: Sprout, label: "Crop Intelligence", route: "/customer/crops" },
  { icon: CreditCard, label: "Paiements", route: "/customer/payments" },
  { icon: Settings, label: "Paramètres", route: "/customer/settings" }
];

export function Sidebar({
  currentRoute,
  onNavigate,
  type,
  collapsed = false,
  onToggleCollapse
}: SidebarProps) {
  const menuItems = type === "admin" ? adminMenuItems : customerMenuItems;

  return (
    <aside
      className={`relative border-r bg-sidebar transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div className={`flex h-16 items-center border-b px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {type === "admin" ? "Admin Panel" : "Customer Portal"}
            </span>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="h-8 w-8"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;

            return (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {item.badge && (
                  <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}