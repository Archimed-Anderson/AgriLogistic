import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Globe, Users, Database, ShieldCheck, Settings, Cpu } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'War Room', path: '/admin/dashboard' },
  { icon: Globe, label: 'Ecosystem', path: '/admin/ecosystem' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Database, label: 'Data', path: '/admin/data' },
  { icon: Cpu, label: 'AI', path: '/admin/ai' },
  { icon: ShieldCheck, label: 'Security', path: '/admin/security' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-20 flex-col items-center border-r border-white/10 bg-[#0A0A0A] py-8 shadow-2xl">
      <div className="flex flex-col gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.label}
            className={({ isActive }) =>
              cn(
                'flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/5',
                isActive
                  ? 'bg-white/5 text-primary shadow-[0_0_15px_rgba(0,102,255,0.4)]'
                  : 'text-muted-foreground hover:text-primary'
              )
            }
          >
            <item.icon size={24} />
          </NavLink>
        ))}
      </div>

      <div className="mt-auto">
        <NavLink
          to="/admin/settings"
          title="Settings"
          className={({ isActive }) =>
            cn(
              'flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/5 text-muted-foreground hover:text-primary',
              isActive && 'bg-white/5 text-primary shadow-[0_0_15px_rgba(0,102,255,0.4)]'
            )
          }
        >
          <Settings size={24} />
        </NavLink>
      </div>
    </aside>
  );
}
