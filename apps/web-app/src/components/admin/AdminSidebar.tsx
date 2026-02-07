'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LogOut, ChevronDown, Activity, LayoutDashboard, Zap, Bell, ShieldCheck, Sprout, Truck, Landmark, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { adminRoutes } from '@/config/admin-routes';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useNotificationStore } from '@/store/notificationStore';

const QuickCommand = dynamic(() => import('./QuickCommand'), {
  ssr: false,
  loading: () => <div className="h-12 w-full bg-white/5 animate-pulse rounded-2xl mb-2" />
});


export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { unreadCount } = useNotificationStore();
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([
    '🎯 COMMAND CENTER',
    '🚜 OPÉRATIONS',
  ]);

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    );
  };

  return (
    <aside
      className="flex w-80 flex-col border-r transition-all duration-500 z-40 relative group"
      style={{ 
        backgroundColor: 'var(--admin-bg)', 
        borderColor: 'var(--admin-border)',
        boxShadow: '10px 0 30px rgba(0,0,0,0.5)'
      }}
    >
      {/* OS Header */}
      <div className="p-8 border-b" style={{ borderColor: 'var(--admin-border)' }}>
        <Link href="/admin/dashboard" className="flex items-center gap-4 group/logo">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-500">
            <Activity className="h-6 w-6 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-white uppercase italic leading-none">
              AgroDeep
            </span>
            <span className="text-[10px] font-black tracking-[0.3em] text-emerald-500 uppercase mt-1 opacity-70">
              Admin OS v4.2
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-1 py-8 px-4 space-y-8 overflow-y-auto custom-scrollbar scroll-smooth">
        {adminRoutes.map((group) => (
          <div key={group.group} className="space-y-4">
            <div
              className="px-4 flex items-center justify-between group/header cursor-pointer"
              onClick={() => toggleSubMenu(group.group)}
            >
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] pb-1 border-b border-white/5 w-full flex items-center justify-between group-hover/header:text-slate-300 transition-colors">
                {group.group}
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform duration-300 opacity-0 group-hover/header:opacity-100',
                    openSubMenus.includes(group.group) ? 'rotate-0' : '-rotate-90'
                  )}
                />
              </h3>
            </div>
            <div
              className={cn(
                'space-y-1 transition-all duration-300 overflow-hidden',
                openSubMenus.includes(group.group)
                  ? 'max-h-[1000px] opacity-100'
                  : 'max-h-0 opacity-0'
              )}
            >
              {group.items.map((item) => {
                const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                const isWarRoom = item.label === 'War Room' || item.priority === true;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 group relative overflow-hidden border border-transparent',
                      isActive
                        ? 'bg-white/10 text-white border-white/10 shadow-lg translate-x-1'
                        : 'text-slate-500 hover:text-white hover:bg-white/5 hover:translate-x-1',
                      isWarRoom && !isActive ? 'bg-red-500/5 text-red-400 border-red-500/20' : ''
                    )}
                  >
                    <div className="flex items-center gap-3 z-10">
                      <item.icon
                        className={cn(
                          'h-4 w-4',
                          isActive ? 'text-emerald-500' : 'text-slate-600'
                        )}
                      />
                      <span className="tracking-wide uppercase text-[12px]">{item.label}</span>
                    </div>
                    {item.badge && (
                       <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-black">
                          {item.badge}
                       </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t" style={{ backgroundColor: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }}>
        <QuickCommand />
        <button
          onClick={() => logout()}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white/5 py-4 text-sm font-black text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-500 border border-white/5 hover:border-red-500/20"
        >
          <LogOut className="h-4 w-4" />
          SESSION_TERMINATE
        </button>
      </div>
    </aside>
  );
}
