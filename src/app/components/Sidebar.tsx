import { useCallback, useDeferredValue, useEffect, useMemo, useState, memo } from "react";
import type { ComponentType } from "react";
import {
  Users,
  Package,
  Truck,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sprout,
  Cpu,
  Brain,
  DollarSign,
  Zap,
  TrendingUp,
  Calculator,
  Award,
  Search,
  Star,
  StarOff,
  Cloud,
  Droplets,
  Wrench,
  ClipboardList,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "./ui/button";
import type { Permission } from "../../domain/value-objects/permissions.vo";
import type { UserRole } from "../../domain/enums/user-role.enum";

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  type: "admin" | "customer";
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  onLogout?: () => void;
  userRole?: UserRole;
  userPermissions?: Permission[];
}

// Menu item type
interface MenuItem {
  icon: ComponentType<{ className?: string; strokeWidth?: string | number }>;
  label: string;
  route: string;
  badge?: string;
  badgeColor?: string;
  description?: string;
  // NOTE: on n’utilise plus ces champs pour masquer des onglets.
  // Les permissions sont appliquées côté route (App.tsx) via AccessDenied.
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
}

type MenuSection = {
  title?: string;
  items: MenuItem[];
};

// Admin menu items (terminologie unifiée FR)
// NOTE: "Paramètres" et "Settings" pointaient vers la même route (/admin/settings) → doublon supprimé.
const ADMIN_SECTIONS: MenuSection[] = [
  {
    // FarmVista core navigation (order & feel)
    items: [
      { icon: LayoutDashboard, label: "Dashboard", route: "/admin/dashboard" },
      { icon: Sprout, label: "Crop Intelligence", route: "/admin/crops" },
      { icon: Droplets, label: "Sol & Eau", route: "/admin/soil-water" },
      { icon: Cloud, label: "Météo", route: "/admin/weather" },
      { icon: Wrench, label: "Équipements", route: "/admin/equipment" },
      { icon: ClipboardList, label: "Gestion Tâches", route: "/admin/tasks" },
      { icon: Users, label: "Gestion Main-d'œuvre", route: "/admin/labor" },
      { icon: FileText, label: "Rapports", route: "/admin/reports", badge: "Beta", badgeColor: "bg-red-500" },
    ],
  },
  {
    title: "Modules",
    items: [
      // Liste “business” attendue (capture FR)
      { icon: Users, label: "Gestion Utilisateurs", route: "/admin/users" },
      { icon: Package, label: "Produits", route: "/admin/products" },
      { icon: TrendingUp, label: "Catégories", route: "/admin/categories" },
      { icon: Truck, label: "Logistique", route: "/admin/logistics" },
      { icon: Calculator, label: "Calculateur Transport", route: "/admin/transport-calculator", badge: "New", badgeColor: "bg-red-500" },
      { icon: Award, label: "Affiliations", route: "/admin/affiliate-dashboard", badge: "💰", badgeColor: "bg-red-500" },
      { icon: Cpu, label: "IoT Hub", route: "/admin/iot" },
      { icon: Brain, label: "AI Insights", route: "/admin/ai-insights" },
      { icon: DollarSign, label: "Finance", route: "/admin/finance" },
      { icon: FileText, label: "Blog & Évents", route: "/admin/blog" },
      { icon: Zap, label: "Automation", route: "/admin/automation" },
    ],
  },
];

// Customer menu items
const CUSTOMER_MENU_ITEMS: MenuItem[] = [
  // Configuration “client” minimale (à compléter si besoin)
  { icon: LayoutDashboard, label: "Dashboard", route: "/customer/dashboard" },
  { icon: Calculator, label: "Calculateur Transport", route: "/customer/transport-calculator", badge: "New", badgeColor: "bg-red-500" },
  { icon: CreditCard, label: "Paiements", route: "/customer/payments" },
];

// Memoized menu item component for performance
const SidebarMenuItem = memo(({ 
  item, 
  isActive, 
  collapsed, 
  isFavorite,
  onNavigate,
  onToggleFavorite 
}: {
  item: MenuItem;
  isActive: boolean;
  collapsed: boolean;
  isFavorite: boolean;
  onNavigate: (route: string) => void;
  onToggleFavorite: (route: string) => void;
}) => {
  const Icon = item.icon;
  
  return (
    <div className="group relative">
      <button
        onClick={() => onNavigate(item.route)}
        className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] leading-5 transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A4B]/25 ${
          isActive
            ? "bg-white text-[#0B7A4B] shadow-sm"
            : "text-[#4B5563] hover:bg-white/70"
        } ${collapsed ? "justify-center" : ""}`}
        title={collapsed ? item.label : undefined}
      >
        {/* Active indicator (FarmVista-like) */}
        {isActive && !collapsed && (
          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#0B7A4B]" />
        )}

        <Icon
          strokeWidth={1.7}
          className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-[#0B7A4B]" : "text-[#6B7280]"}`}
        />
        
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>
            
            {item.badge && (
              <span className={`ml-auto px-2 py-0.5 text-[11px] font-semibold rounded-full text-white ${
                item.badgeColor || "bg-red-500"
              }`}>
                {item.badge}
              </span>
            )}
          </>
        )}
      </button>
      
      {/* Favorite toggle (visible on hover) */}
      {!collapsed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.route);
          }}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity motion-reduce:transition-none ${
            isActive ? "text-[#0B7A4B]/70 hover:text-[#0B7A4B]" : "text-gray-400 hover:text-yellow-500"
          }`}
          title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {isFavorite ? (
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff className="w-4 h-4" />
          )}
        </button>
      )}
      
      {/* Tooltip for collapsed mode */}
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all motion-reduce:transition-none z-50 whitespace-nowrap shadow-lg">
          <div className="font-medium">{item.label}</div>
          {item.description && (
            <div className="text-xs text-gray-400">{item.description}</div>
          )}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  );
});

SidebarMenuItem.displayName = "SidebarMenuItem";

export function Sidebar({
  currentRoute,
  onNavigate,
  type,
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onMobileOpenChange,
  onLogout,
  userRole,
  userPermissions,
}: SidebarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem("sidebar-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const sections: MenuSection[] = useMemo(() => {
    if (type === "admin") return ADMIN_SECTIONS;
    return [{ items: CUSTOMER_MENU_ITEMS }];
  }, [type]);

  // IMPORTANT: on ne masque pas les onglets.
  // Les permissions sont appliquées au moment d’accéder à la page (App.tsx).
  // Ces props restent disponibles si on veut afficher des badges/états "restreint" plus tard.
  void userRole;
  void userPermissions;
  const effectiveMenuItems = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!deferredSearch.trim()) return effectiveMenuItems;
    const query = deferredSearch.toLowerCase();
    return effectiveMenuItems.filter(
      item => 
        item.label.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );
  }, [effectiveMenuItems, deferredSearch]);

  const toggleFavorite = useCallback((route: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(route)
        ? prev.filter(r => r !== route)
        : [...prev, route];
      localStorage.setItem("sidebar-favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  // Close on ESC in mobile drawer mode
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onMobileOpenChange?.(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, onMobileOpenChange]);

  // Ctrl/Cmd+K quick search (keeps sidebar layout pixel-perfect: no visible search box)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      const modifier = e.ctrlKey || e.metaKey;
      if (modifier && isK) {
        e.preventDefault();
        setSearchOpen(true);
        onMobileOpenChange?.(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onMobileOpenChange]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const footerItems: MenuItem[] = useMemo(
    () => [],
    [type]
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => onMobileOpenChange?.(false)}
        />
      )}

      {/* Quick search overlay (Ctrl/Cmd+K) */}
      {searchOpen && mobileOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-20 md:pt-24">
          <button
            type="button"
            aria-label="Fermer la recherche"
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
          />
          <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl ring-1 ring-black/10">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EEF2F7]">
              <Search className="h-4 w-4 text-[#9CA3AF]" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un module…"
                className="w-full bg-transparent text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
              />
              <kbd className="rounded-md bg-[#F3F4F6] px-2 py-1 text-[11px] text-[#6B7280]">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-auto p-2">
              {filteredItems.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-[#6B7280]">Aucun résultat</div>
              ) : (
                <div className="space-y-1">
                  {filteredItems.slice(0, 12).map((item) => (
                    <button
                      key={`search-${item.route}`}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-[#111827] hover:bg-[#F3F4F6]"
                      onClick={() => {
                        onNavigate(item.route);
                        setSearchOpen(false);
                        setSearchQuery("");
                        onMobileOpenChange?.(false);
                      }}
                    >
                      <item.icon strokeWidth={1.6} className="h-[18px] w-[18px] text-[#6B7280]" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full text-white ${item.badgeColor || "bg-red-500"}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <aside
        className={[
          // FarmVista-like shell
          "z-50 flex flex-col border-r border-[#E5E7EB] bg-[#F8FAFC] text-[#111827]",
          "transition-[transform,width] duration-200 ease-out motion-reduce:transition-none",
          "fixed inset-y-0 left-0 w-72 md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "md:w-20" : "md:w-72",
        ].join(" ")}
        role={mobileOpen ? "dialog" : undefined}
        aria-modal={mobileOpen ? true : undefined}
      >
        {/* Header */}
        <div
          className={[
            "flex h-16 items-center border-b border-[#EEF2F7] px-4",
            collapsed ? "justify-center" : "justify-between",
          ].join(" ")}
        >
          {!collapsed && (
            <button
              type="button"
              className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A4B]/30 rounded-lg"
              onClick={() => onNavigate(type === "admin" ? "/admin/dashboard" : "/customer/dashboard")}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B7A4B] to-[#059669] shadow-md">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                >
                  {/* Leaf outline */}
                  <path
                    d="M12 3C7.03 3 3 7.03 3 12c0 3.5 2 6.5 5 8"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Arrow for logistics */}
                  <path
                    d="M14 9l6 3-6 3"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M8 12h12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Inner leaf vein */}
                  <path
                    d="M9 8c-1.5 2-1.5 5 0 7"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.7"
                  />
                </svg>
              </div>
              <div className="leading-tight text-left">
                <div className="text-sm font-semibold">AgroLogistic</div>
                <div className="text-xs text-[#6B7280]">{type === "admin" ? "Admin Panel" : "Mon Espace"}</div>
              </div>
            </button>
          )}

          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="h-8 w-8 rounded-lg hover:bg-[#F3F4F6]"
              aria-label={collapsed ? "Étendre le menu" : "Réduire le menu"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-3">
          <div className="space-y-4">
            {sections.map((section, idx) => (
              <div key={`section-${idx}`}>
                {!collapsed && section.title && (
                  <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                    {section.title}
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarMenuItem
                      key={`${item.route}-${item.label}`}
                      item={item}
                      isActive={
                        item.route === "/admin/dashboard"
                          ? currentRoute === "/admin/dashboard" || currentRoute === "/admin/overview"
                          : currentRoute === item.route
                      }
                      collapsed={collapsed}
                      isFavorite={favorites.includes(item.route)}
                      onNavigate={(route) => {
                        onNavigate(route);
                        onMobileOpenChange?.(false);
                      }}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer (FarmVista-like) */}
        <div className="border-t border-[#EEF2F7] px-4 py-3">
          <div className="space-y-1">
            {footerItems.map((item) => (
              <SidebarMenuItem
                key={`footer-${item.route}`}
                item={item}
                isActive={currentRoute === item.route}
                collapsed={collapsed}
                isFavorite={favorites.includes(item.route)}
                onNavigate={(route) => {
                  onNavigate(route);
                  onMobileOpenChange?.(false);
                }}
                onToggleFavorite={toggleFavorite}
              />
            ))}

            {/* Log out */}
            <div className="group relative">
              <button
                type="button"
                className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] leading-5 transition-colors duration-200 motion-reduce:transition-none text-[#4B5563] hover:bg-[#F3F4F6] ${
                  collapsed ? "justify-center" : ""
                }`}
                onClick={() => {
                  onMobileOpenChange?.(false);
                  if (onLogout) {
                    onLogout();
                  } else {
                    onNavigate("/");
                  }
                }}
                title={collapsed ? "Déconnexion" : undefined}
              >
                <LogOut strokeWidth={1.6} className="h-[18px] w-[18px] shrink-0 text-[#6B7280]" />
                {!collapsed && <span className="flex-1 text-left truncate">Déconnexion</span>}
              </button>

              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all motion-reduce:transition-none z-50 whitespace-nowrap shadow-lg">
                  <div className="font-medium">Déconnexion</div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
