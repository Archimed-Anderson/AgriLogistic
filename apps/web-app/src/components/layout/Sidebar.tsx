'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Truck,
  Settings,
  LogOut,
  X,
  User as UserIcon,
  ShoppingCart,
  Map as MapIcon,
  Sprout,
  Calendar,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/use-auth';
import { UserRole, type User } from '@/types/auth';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

type MenuItem = {
  icon: any;
  label: string;
  href: string;
};

const roleMenus: Record<string, MenuItem[]> = {
  admin: [
    { icon: LayoutDashboard, label: "Vue d'ensemble", href: '/dashboard/admin' },
    { icon: UserIcon, label: 'Utilisateurs', href: '/dashboard/admin/users' },
    { icon: BarChart3, label: 'Rapports', href: '/dashboard/admin/reports' },
    { icon: Settings, label: 'Configuration', href: '/dashboard/admin/settings' },
  ],
  farmer: [
    { icon: LayoutDashboard, label: 'Ma Ferme', href: '/dashboard/farmer' },
    { icon: MapIcon, label: 'Mes Parcelles', href: '/dashboard/farmer/parcels' },
    { icon: Sprout, label: 'Récoltes', href: '/dashboard/farmer/harvests' },
    { icon: Wallet, label: 'Mes Ventes', href: '/dashboard/farmer/sales' },
  ],
  transporter: [
    { icon: LayoutDashboard, label: 'Ma Flotte', href: '/dashboard/transporter' },
    { icon: Truck, label: 'Courses Dispo', href: '/dashboard/transporter/jobs' },
    { icon: Calendar, label: 'Planning', href: '/dashboard/transporter/schedule' },
    { icon: Settings, label: 'Véhicules', href: '/dashboard/transporter/fleet' },
  ],
  buyer: [
    { icon: LayoutDashboard, label: 'Mes Achats', href: '/dashboard/buyer' },
    { icon: ShoppingCart, label: 'Marketplace', href: '/dashboard/buyer/marketplace' },
    { icon: Package, label: 'Commandes', href: '/dashboard/buyer/orders' },
    { icon: Wallet, label: 'Factures', href: '/dashboard/buyer/invoices' },
  ],
};

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const role = user?.role?.toLowerCase() || 'farmer';
  const menuItems = roleMenus[role] || roleMenus.farmer;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 transform border-r bg-card transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-bold tracking-tight">AgriLogistic</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onToggle} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            <div className="mb-4 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Menu{' '}
              {role === 'admin'
                ? 'Administrateur'
                : role === 'farmer'
                  ? 'Agriculteur'
                  : role === 'transporter'
                    ? 'Transporteur'
                    : 'Acheteur'}
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                      : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Separator className="opacity-50" />

          {/* Footer */}
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{user?.name || 'Utilisateur'}</p>
                <p className="text-[10px] text-muted-foreground truncate uppercase">{role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-xl hover:bg-destructive/10 hover:text-destructive group"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-semibold">Déconnexion</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
