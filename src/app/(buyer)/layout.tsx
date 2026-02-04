/**
 * Buyer Layout - Premium Enhanced Version
 * Modern amber gradient sidebar with stats and professional buyer features
 */
'use client';

import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileSearch,
  BarChart2,
  Truck,
  ShieldCheck,
  Bot,
  Wallet,
  MessageCircle,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  LogOut,
  Zap,
  TrendingUp,
  Clock,
  User,
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/buyer/dashboard', icon: LayoutDashboard },
  { name: 'Marketplace', href: '/buyer/marketplace', icon: ShoppingCart },
  { name: 'Commandes', href: '/buyer/orders', icon: Package },
  { name: 'Fournisseurs', href: '/buyer/suppliers', icon: Users },
  { name: 'Traçabilité', href: '/buyer/traceability', icon: FileSearch },
  { name: 'Stocks', href: '/buyer/inventory', icon: Package },
  { name: 'Analytics', href: '/buyer/analytics', icon: BarChart2 },
  { name: 'Livraisons', href: '/buyer/deliveries', icon: Truck },
  { name: 'Qualité', href: '/buyer/quality', icon: ShieldCheck },
  { name: 'Assistant IA', href: '/buyer/assistant', icon: Bot },
  { name: 'Finance', href: '/buyer/finance', icon: Wallet },
  { name: 'Communauté', href: '/buyer/community', icon: MessageCircle },
];

// Quick stats for sidebar
const quickStats = [
  { label: 'Commandes actives', value: '8', color: 'text-amber-400' },
  { label: 'Économies', value: '12%', color: 'text-emerald-400' },
];

export default function BuyerLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications] = useState(4);

  const isActive = (href: string) => location.pathname === href;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6">
        <Link to="/buyer/dashboard" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <ShoppingCart className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AgroLogistic</h1>
            <p className="text-xs text-amber-200">Espace Acheteur</p>
          </div>
        </Link>
      </div>

      {/* Quick Stats Widget */}
      <div className="px-6 pb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-amber-200 uppercase tracking-wide">Aperçu</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickStats.map((stat) => (
              <div key={stat.label}>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-amber-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? 'bg-white text-amber-700 shadow-lg shadow-amber-900/20 font-medium'
                  : 'text-amber-100 hover:bg-white/10'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  active ? 'text-amber-600' : 'text-amber-300 group-hover:text-white'
                }`}
              />
              <span>{item.name}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto text-amber-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Settings Link */}
      <div className="p-4 border-t border-white/10">
        <Link
          to="/buyer/settings"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-amber-100 hover:bg-white/10 transition-colors"
        >
          <Settings className="w-5 h-5 text-amber-300" />
          Paramètres
        </Link>
      </div>

      {/* User Profile Mini */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Acheteur Pro</p>
            <p className="text-xs text-amber-300">Premium</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 shadow-2xl flex flex-col">
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
        <div className="flex flex-col flex-grow bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
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
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher produits, fournisseurs..."
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Active Orders Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-700">8 commandes en cours</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-bold text-white">AC</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-900">Acheteur Pro</p>
                    <p className="text-xs text-slate-500">Premium</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                      <Link
                        to="/buyer/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Star className="w-4 h-4" />
                        Mon profil
                      </Link>
                      <Link
                        to="/buyer/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Settings className="w-4 h-4" />
                        Paramètres
                      </Link>
                      <hr className="my-2 border-slate-100" />
                      <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </Link>
                    </div>
                  </>
                )}
              </div>
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
