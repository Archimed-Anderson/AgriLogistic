/**
 * Farmer Layout - Premium Modernized Version
 * Modern emerald green theme with agricultural-focused navigation
 */
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Sprout,
  BarChart3,
  ShoppingCart,
  Truck,
  Box,
  Calendar,
  Cloud,
  Settings,
  Menu,
  X,
  Bell,
  User,
  ChevronRight,
  Sun,
  Droplets,
  Thermometer,
  Tractor,
  MapPin,
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/farmer/dashboard', icon: BarChart3 },
  { name: 'Mes Cultures', href: '/farmer/farm', icon: Sprout },
  { name: 'Marketplace', href: '/farmer/marketplace', icon: ShoppingCart },
  { name: 'Logistique', href: '/farmer/logistics', icon: Truck },
  { name: 'Location Matériel', href: '/farmer/rental', icon: Tractor },
  { name: 'Stock', href: '/farmer/operations', icon: Box },
];

// Mock weather data
const currentWeather = {
  temp: 28,
  condition: 'Ensoleillé',
  humidity: 65,
  icon: Sun,
};

export default function FarmerLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(5);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AgroLogistic</h1>
            <p className="text-xs text-emerald-200">Espace Agriculteur</p>
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      <div className="px-6 pb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-emerald-200 uppercase tracking-wide">Météo</span>
            <Cloud className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{currentWeather.temp}°C</p>
                <p className="text-xs text-emerald-200">{currentWeather.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-emerald-200 text-sm">
                <Droplets className="w-4 h-4" />
                <span>{currentWeather.humidity}%</span>
              </div>
            </div>
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
                  ? 'bg-white text-emerald-700 shadow-lg shadow-emerald-900/20'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'text-emerald-600' : 'text-emerald-300 group-hover:text-white'
                }`}
              />
              <span className="font-medium">{item.name}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto text-emerald-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Farm Status */}
      <div className="p-4">
        <div className="bg-white/10 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-emerald-300" />
            <span className="text-sm text-emerald-200">Ma Ferme</span>
          </div>
          <p className="text-white font-medium">Ferme Diallo</p>
          <p className="text-sm text-emerald-200">Thiès, Sénégal • 15 ha</p>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Ibrahima Diallo</p>
            <p className="text-xs text-emerald-300">Agriculteur Premium</p>
          </div>
          <Link
            to="/farmer/settings"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-emerald-300" />
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900 shadow-2xl flex flex-col">
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
        <div className="flex flex-col flex-grow bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Date & Season */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  {new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl">
                <Sun className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Saison sèche</span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                <Thermometer className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">{currentWeather.temp}°C</span>
              </div>

              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              <Link
                to="/farmer/marketplace"
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-600/20 font-medium text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                Vendre
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
