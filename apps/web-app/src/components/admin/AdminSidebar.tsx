'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LogOut, ChevronDown, Terminal, Activity } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { adminRoutes } from '@/config/admin-routes';
import { useState } from 'react';
import { useNotificationStore } from '@/store/notificationStore';

const QuickCommand = dynamic(() => import('./QuickCommand').then((m) => ({ default: m.QuickCommand })), {
  ssr: false,
  loading: () => (
    <div className="group relative flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-500/5 border border-emerald-500/10 mb-2">
      <Activity className="h-5 w-5 text-emerald-500/50 animate-pulse" />
    </div>
  ),
});

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { unreadCount } = useNotificationStore();
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([
    '🎯 COMMAND CENTER',
    '🚚 LOGISTIQUE',
  ]);

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <div
      className="hidden border-r lg:flex w-[300px] min-h-screen flex-col overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: 'var(--admin-bg)',
        borderColor: 'var(--admin-border)',
        color: 'var(--admin-text)',
      }}
    >
      {/* Header - Mission Control Identity */}
      <div
        className="flex h-20 shrink-0 items-center px-6 border-b backdrop-blur-xl z-20"
        style={{
          backgroundColor: 'rgba(var(--admin-bg-rgb), 0.5)',
          borderColor: 'var(--admin-border)',
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-3 font-black text-2xl tracking-tighter hover:opacity-80 transition-all group"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110"
            style={{
              backgroundColor: 'rgba(var(--admin-accent-rgb), 0.1)',
              borderColor: 'rgba(var(--admin-accent-rgb), 0.2)',
              borderWidth: '1px',
            }}
          >
            <Terminal className="h-6 w-6" style={{ color: 'var(--admin-accent)' }} />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="tracking-widest text-lg font-black uppercase italic"
              style={{ color: 'var(--admin-text)' }}
            >
              Agro<span style={{ color: 'var(--admin-accent)' }}>Deep</span>
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1"
              style={{ color: 'var(--admin-text-secondary)' }}
            >
              Command v3.1
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Layer */}
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
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isItemSubOpen = openSubMenus.includes(item.label);
                const isFrequentRoute =
                  item.label === 'Dashboard' || item.label === 'War Room' || item.label === 'Support & Litiges';

                return (
                  <div key={item.path} className="space-y-1">
                    <Link
                      href={item.path}
                      prefetch={isFrequentRoute}
                      onClick={(e) => {
                        if (hasSubItems) {
                          e.preventDefault();
                          toggleSubMenu(item.label);
                        }
                      }}
                      className={cn(
                        'flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 group relative overflow-hidden border border-transparent',
                        // War Room Special Styling
                        isWarRoom && !isActive
                          ? 'bg-red-500/5 text-red-400 border-red-500/20 hover:border-red-500/40'
                          : '',
                        // Active State
                        isActive
                          ? 'bg-white/10 text-white border-white/10 shadow-lg translate-x-1'
                          : 'text-slate-500 hover:text-white hover:bg-white/5 hover:translate-x-1'
                      )}
                    >
                      {/* Red Alert pulse for War Room */}
                      {isWarRoom && !isActive && (
                        <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
                      )}

                      {/* Active Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
                      )}

                      <div className="flex items-center gap-3 z-10">
                        <item.icon
                          className={cn(
                            'h-4 w-4 transition-all duration-300',
                            isActive
                              ? 'text-emerald-500 scale-110'
                              : 'text-slate-600 group-hover:text-slate-300',
                            isWarRoom ? 'text-red-500/80 group-hover:text-red-500' : ''
                          )}
                        />
                        <span className="tracking-wide uppercase text-[12px]">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-2 z-10">
                        {(item.label === 'Notifications' || item.badge) && (
                          <span
                            className={cn(
                              'flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[9px] font-black animate-in fade-in zoom-in duration-500',
                              isWarRoom
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-emerald-500 text-black',
                              item.badge === 'LIVE'
                                ? 'rounded-sm px-2 bg-red-600 ring-2 ring-red-600/20'
                                : '',
                              item.label === 'Notifications' && unreadCount > 0
                                ? 'bg-emerald-500 text-black shadow-[0_0_8px_#10b981]'
                                : ''
                            )}
                          >
                            {item.label === 'Notifications' ? unreadCount : item.badge}
                          </span>
                        )}
                        {hasSubItems && (
                          <ChevronDown
                            className={cn(
                              'h-3 w-3 transition-transform duration-300 text-slate-600',
                              isItemSubOpen ? 'rotate-180' : ''
                            )}
                          />
                        )}
                      </div>
                    </Link>

                    {/* Sub-navigation */}
                    {hasSubItems && isItemSubOpen && (
                      <div className="pl-11 space-y-1 mt-1 border-l border-white/5 ml-6 py-2">
                        {item.subItems!.map((sub) => (
                          <Link
                            key={sub.path}
                            href={sub.path}
                            prefetch={false}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-[11px] font-bold transition-all duration-200 uppercase tracking-wider',
                              pathname === sub.path
                                ? 'text-emerald-400 bg-emerald-400/5'
                                : 'text-slate-500 hover:text-slate-200 hover:translate-x-1'
                            )}
                          >
                            <span
                              className={cn(
                                'w-1.5 h-1.5 rounded-full transition-colors',
                                pathname === sub.path ? 'bg-emerald-500' : 'bg-slate-800'
                              )}
                            />
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer - Engine Status */}
      <div
        className="p-6 border-t space-y-4"
        style={{ backgroundColor: 'var(--admin-bg)', borderColor: 'var(--admin-border)' }}
      >
        <QuickCommand />

        <div
          className="rounded-2xl p-4 border space-y-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--admin-border)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--admin-accent)' }}
                />
                <div
                  className="absolute inset-0 w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: 'var(--admin-accent)' }}
                />
              </div>
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: 'var(--admin-text-secondary)' }}
              >
                Core Engine
              </span>
            </div>
            <Activity className="h-3 w-3 opacity-50" style={{ color: 'var(--admin-accent)' }} />
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full animate-pulse"
              style={{ background: 'var(--admin-accent)', width: '85%' }}
            />
          </div>
          <div
            className="flex justify-between text-[9px] font-mono font-bold uppercase italic"
            style={{ color: 'var(--admin-text-secondary)', opacity: 0.5 }}
          >
            <span>Uptime: 2,482h</span>
            <span>v3.1.0-MC</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-xs font-black transition-all duration-500 group"
          style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text-secondary)' }}
        >
          <div className="flex items-center gap-2">
            <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            DISCONNECT SESSION
          </div>
          <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
