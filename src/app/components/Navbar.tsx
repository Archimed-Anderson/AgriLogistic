import { Bell, Sun, Moon, User, ShoppingCart, Menu, Search, Settings, LogOut, UserCircle, ChevronDown, X, Sparkles, Truck, Phone } from "lucide-react";
import { useState, useRef, useEffect } from "react";
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
  showSidebarToggle?: boolean;
  onSidebarToggle?: () => void;
}

// Quick search suggestions
const SEARCH_SUGGESTIONS = [
  { label: "Tomates bio", category: "Produits" },
  { label: "Transport réfrigéré", category: "Services" },
  { label: "Commande #1234", category: "Commandes" },
  { label: "Ferme Dupont", category: "Vendeurs" },
];

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
  showSidebarToggle = false,
  onSidebarToggle,
}: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartItemCount = 3; // Mock data

  // Close search on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSearch(false);
        setSearchQuery("");
      }
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const filteredSuggestions = searchQuery
    ? SEARCH_SUGGESTIONS.filter(s => 
        s.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_SUGGESTIONS;

  const navLinks = [
    { path: "/admin/marketplace", label: "Marketplace" },
    { path: "/admin/chat", label: "Chat" },
    { path: "/admin/analytics", label: "Analytics" },
    { path: "/admin/blog", label: "Blog" },
    { path: "/admin/academy", label: "Académie" },
    { path: "/admin/rental", label: "Loueur" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {/* Left Side - Logo & Nav */}
          <div className="flex items-center gap-6">
            {showSidebarToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onSidebarToggle}
                className="h-9 w-9 md:hidden hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            {/* Modern Logo */}
            <button
              onClick={() => onNavigate(isAuthenticated ? "/admin/overview" : "/")}
              className="flex items-center gap-3 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B7A4B] to-[#059669] shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                >
                  <path
                    d="M12 3C7.03 3 3 7.03 3 12c0 3.5 2 6.5 5 8"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
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
              <span className="text-xl font-bold bg-gradient-to-r from-[#0B7A4B] to-[#059669] bg-clip-text text-transparent hidden sm:block">
                AgroLogistic
              </span>
            </button>

            {/* Main Navigation */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = currentRoute.includes(link.path.split("/").pop() || "");
                  return (
                    <button
                      key={link.path}
                      onClick={() => onNavigate(link.path)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "text-[#0B7A4B] bg-emerald-50 dark:bg-emerald-900/20"
                          : "text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="h-9 w-9 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Button>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onThemeToggle}
              className="h-9 w-9 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200"
              aria-label={theme === "light" ? "Mode sombre" : "Mode clair"}
            >
              {theme === "light" ? (
                <Sun className="h-5 w-5 text-amber-500 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="h-5 w-5 text-blue-400 transition-transform hover:-rotate-12" />
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
                    className="h-9 w-9 relative hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200"
                    aria-label="Panier"
                  >
                    <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-[#0B7A4B] to-[#059669] text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
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
                    className="h-9 w-9 relative hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-[#0B7A4B] to-[#059669] text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                  {showNotifications && (
                    <NotificationsDropdown onClose={() => setShowNotifications(false)} />
                  )}
                </div>

                {/* User Menu - Enhanced */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-10 px-3 gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 rounded-xl"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0B7A4B] to-[#059669] shadow-sm">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                        {userLabel || "Compte"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 p-2">
                    {/* User Info Header */}
                    <div className="px-3 py-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B7A4B] to-[#059669] shadow-md">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {userLabel || "Utilisateur"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            Administrateur
                          </p>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-800/30 rounded-full">
                          <Sparkles className="h-3 w-3 text-emerald-600" />
                          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Pro</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-3 gap-1 mb-2">
                      <button 
                        onClick={() => onNavigate(currentRoute.startsWith("/customer") ? "/customer/orders" : "/admin/orders")}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Commandes</span>
                      </button>
                      <button 
                        onClick={() => onNavigate(currentRoute.startsWith("/customer") ? "/customer/tracking" : "/admin/tracking")}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                      >
                        <Truck className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Livraisons</span>
                      </button>
                      <button 
                        onClick={() => onNavigate(currentRoute.startsWith("/customer") ? "/customer/help" : "/admin/help")}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                      >
                        <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Support</span>
                      </button>
                    </div>

                    <DropdownMenuSeparator />

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
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0B7A4B]/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0B7A4B]"></div>
                            </div>
                          </label>
                        </div>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DropdownMenuItem
                      onClick={() =>
                        onNavigate(currentRoute.startsWith("/customer") ? "/customer/profile" : "/admin/profile")
                      }
                      className="gap-3 py-2.5 rounded-lg cursor-pointer"
                    >
                      <UserCircle className="h-4 w-4 text-gray-500" />
                      <span>Mon Profil</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem
                      onClick={() =>
                        onNavigate(currentRoute.startsWith("/customer") ? "/customer/settings" : "/admin/settings")
                      }
                      className="gap-3 py-2.5 rounded-lg cursor-pointer"
                    >
                      <Settings className="h-4 w-4 text-gray-500" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={() => setShowSignOutModal(true)}
                      className="gap-3 py-2.5 rounded-lg cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!isAuthenticated && (
              <Button 
                onClick={() => onNavigate("/auth")} 
                className="bg-gradient-to-r from-[#0B7A4B] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30"
              >
                Connexion
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
          <div 
            className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b dark:border-gray-800">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher produits, vendeurs, commandes..."
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400"
              />
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-500">
                ESC
              </kbd>
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Search Suggestions */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredSuggestions.length > 0 ? (
                <div className="space-y-1">
                  {filteredSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery("");
                        // Navigate to search results
                        onNavigate(`/admin/marketplace?search=${encodeURIComponent(suggestion.label)}`);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-left"
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="flex-1 text-gray-700 dark:text-gray-300">{suggestion.label}</span>
                      <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {suggestion.category}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucun résultat pour "{searchQuery}"
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="border-t dark:border-gray-800 px-4 py-3 flex items-center justify-between text-xs text-gray-500">
              <span>⌘K pour ouvrir la recherche</span>
              <span>Appuyez sur Entrée pour rechercher</span>
            </div>
          </div>
          {/* Click outside to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setShowSearch(false)} />
        </div>
      )}

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
    </>
  );
}
