/**
 * Transporter Layout - Premium Modernized Version
 * Modern glassmorphism design with animated sidebar navigation
 */
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Truck,
  Map,
  Package,
  DollarSign,
  BarChart3,
  Settings,
  Menu,
  X,
  Phone,
  AlertTriangle,
  Battery,
  Wifi,
  WifiOff,
  Bell,
  User,
  ChevronRight,
  MapPin,
  Clock,
  Fuel,
  Search,
  Zap,
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/transporter/dashboard', icon: BarChart3 },
  { name: 'Itinéraires', href: '/transporter/routes', icon: Map },
  { name: 'Livraisons', href: '/transporter/shipments', icon: Package },
  { name: 'Ma Flotte', href: '/transporter/fleet', icon: Truck },
  { name: 'Marketplace', href: '/transporter/marketplace', icon: MapPin },
  { name: 'Finances', href: '/transporter/finance', icon: DollarSign },
  { name: 'Analytics', href: '/transporter/analytics', icon: BarChart3 },
];

const quickStats = [
  { label: 'En cours', value: '12', color: 'text-blue-400' },
  { label: 'Km aujourd\'hui', value: '245', color: 'text-emerald-400' },
];

export default function TransporterLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifications] = useState(3);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const SidebarContent = () => (
    <>
      {/* Logo & Brand */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AgroLogistic</h1>
            <p className="text-xs text-blue-200">Espace Transporteur</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 pb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-blue-200 uppercase tracking-wide">Activité du jour</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickStats.map((stat) => (
              <div key={stat.label}>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-blue-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white text-blue-700 shadow-lg shadow-blue-900/20'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-blue-300 group-hover:text-white'}`} />
              <span className="font-medium">{item.name}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Emergency Button */}
      <div className="p-4 space-y-3">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/30 font-medium">
          <AlertTriangle className="w-5 h-5" />
          <span>Urgence</span>
        </button>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors text-sm">
          <Phone className="w-4 h-4" />
          <span>Support 24/7</span>
        </button>
      </div>

      {/* Driver Profile Mini */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Mamadou Diallo</p>
            <p className="text-xs text-blue-300">Chauffeur Premium</p>
          </div>
          <Link to="/transporter/settings" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-blue-300" />
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 shadow-2xl flex flex-col">
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:bg-white/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            {/* Mobile Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher une livraison, un client..."
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isOnline ? 'bg-emerald-50' : 'bg-red-50'}`}>
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-emerald-600" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-xs font-medium hidden sm:inline ${isOnline ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isOnline ? 'Connecté' : 'Hors ligne'}
                </span>
              </div>

              {/* Fuel Status */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl">
                <Fuel className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-700">75%</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Drive Mode CTA */}
              <Link
                to="/transporter/drive-mode"
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/20 font-medium text-sm"
              >
                <Truck className="w-4 h-4" />
                Mode Conduite
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Offline Toast */}
      {!isOnline && (
        <div className="fixed bottom-6 right-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-xl max-w-sm animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <WifiOff className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">Mode hors ligne</h3>
              <p className="text-sm text-amber-700 mt-1">
                Vos données seront synchronisées automatiquement.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
