import { Bell, Sun, Moon, User, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { CartDropdown } from "./CartDropdown";
import { SignOutModal } from "./SignOutModal";

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
  notificationCount?: number;
  isAuthenticated?: boolean;
  adminMode?: boolean;
  onAdminModeChange?: (value: boolean) => void;
  userLabel?: string;
  onLogout?: () => void;
}

export function Navbar({
  currentRoute,
  onNavigate,
  theme,
  onThemeToggle,
  notificationCount = 3,
  isAuthenticated = false,
  adminMode = false,
  onAdminModeChange,
  userLabel,
  onLogout,
}: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const cartItemCount = 3; // Mock data

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate(isAuthenticated ? "/admin/overview" : "/")}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563eb]">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <span className="text-xl font-bold">AgroLogistic</span>
          </button>

          {/* Main Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onNavigate("/admin/marketplace")}
                className={`text-sm transition-colors hover:text-[#2563eb] ${
                  currentRoute === "/admin/marketplace" || currentRoute === "/customer/marketplace"
                    ? "text-[#2563eb] font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Marketplace
              </button>
              <button
                onClick={() => onNavigate(adminMode ? "/admin/dashboard" : "/customer/dashboard")}
                className={`text-sm transition-colors hover:text-[#2563eb] ${
                  currentRoute.includes("/dashboard")
                    ? "text-[#2563eb] font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate("/admin/chat")}
                className={`text-sm transition-colors hover:text-[#2563eb] ${
                  currentRoute.includes("/chat") && !currentRoute.includes("/b2b-chat")
                    ? "text-[#2563eb] font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => onNavigate("/admin/analytics")}
                className={`text-sm transition-colors hover:text-[#2563eb] ${
                  currentRoute.includes("/analytics")
                    ? "text-[#2563eb] font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => onNavigate("/admin/blog")}
                className={`text-sm transition-colors hover:text-[#2563eb] ${
                  currentRoute.includes("/blog")
                    ? "text-[#2563eb] font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Blog
              </button>
              <button
                onClick={() => onNavigate("/admin/academy")}
                className={`text-sm transition-colors hover:text-[#2563eb] ${
                  currentRoute.includes("/academy")
                    ? "text-[#2563eb] font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Académie
              </button>
              <button
                onClick={() => onNavigate("/admin/rental")}
                className={`text-sm transition-colors hover:text-[#2563eb] ${
                  currentRoute.includes("/rental")
                    ? "text-[#2563eb] font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Loueur
              </button>
              <button
                onClick={() => onNavigate("/admin/panel")}
                className={`text-sm transition-colors hover:text-[#0B7A4B] px-3 py-1.5 rounded-md ${
                  currentRoute.includes("/admin/users") ||
                  currentRoute.includes("/admin/products") ||
                  currentRoute.includes("/admin/orders") ||
                  currentRoute.includes("/admin/categories") ||
                  currentRoute.includes("/admin/reports") ||
                  currentRoute.includes("/admin/logistics") ||
                  currentRoute.includes("/admin/transport-calculator") ||
                  currentRoute.includes("/admin/tracking") ||
                  currentRoute.includes("/admin/carrier-dashboard") ||
                  currentRoute.includes("/admin/b2b-chat") ||
                  currentRoute.includes("/admin/crops") ||
                  currentRoute.includes("/admin/iot") ||
                  currentRoute.includes("/admin/ai-insights") ||
                  currentRoute.includes("/admin/finance") ||
                  currentRoute.includes("/admin/automation") ||
                  currentRoute === "/admin/panel"
                    ? "bg-[#0B7A4B] text-white font-medium"
                    : "text-muted-foreground bg-gray-100 dark:bg-gray-800"
                }`}
              >
                Admin Panel
              </button>
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="h-9 w-9"
          >
            {theme === "light" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {isAuthenticated && (
            <>
              {/* Shopping Cart */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCart(!showCart)}
                  className="h-9 w-9 relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#2563eb] text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
                {showCart && (
                  <CartDropdown
                    onClose={() => setShowCart(false)}
                    onNavigate={onNavigate}
                  />
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="h-9 w-9 relative"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#2563eb] text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {notificationCount}
                    </span>
                  )}
                </Button>
                {showNotifications && (
                  <NotificationsDropdown onClose={() => setShowNotifications(false)} />
                )}
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 px-3 gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline text-sm">{userLabel || "Compte"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {/* Admin Mode Toggle */}
                  {currentRoute === "/market" && onAdminModeChange && (
                    <>
                      <div className="px-2 py-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm font-medium">Mode Admin</span>
                          <div className="relative inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={adminMode}
                              onChange={(e) => onAdminModeChange(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2563eb]/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2563eb]"></div>
                          </div>
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Activer les contrôles d'édition
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => onNavigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate("/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowSignOutModal(true)}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {!isAuthenticated && (
            <Button onClick={() => onNavigate("/auth")} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              Connexion
            </Button>
          )}
        </div>
      </div>

      {/* Sign Out Modal */}
      {showSignOutModal && (
        <SignOutModal
          onClose={() => setShowSignOutModal(false)}
          onConfirm={() => {
            setShowSignOutModal(false);
            if (onLogout) {
              onLogout();
            } else {
              onNavigate("/");
            }
          }}
        />
      )}
    </nav>
  );
}
