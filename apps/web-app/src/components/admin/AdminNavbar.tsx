'use client';

import Link from 'next/link';
import { Bell, Search, User, ArrowUpRight, Activity, Palette } from 'lucide-react';
import { AdminThemeSwitcher } from './AdminThemeSwitcher';

export function AdminNavbar() {
  return (
    <header
      className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b transition-colors duration-500 px-6 shadow-2xl"
      style={{
        backgroundColor: 'var(--admin-bg)',
        borderColor: 'var(--admin-border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm group">
          <Search
            className="absolute left-3 top-2.5 h-4 w-4 transition-colors"
            style={{ color: 'var(--admin-text-secondary)' }}
          />
          <input
            type="text"
            placeholder="Search mission parameters..."
            className="h-10 w-full rounded-xl border pl-10 text-sm italic font-medium outline-none focus:ring-1 transition-all placeholder:text-slate-600"
            style={{
              backgroundColor: 'var(--admin-bg-secondary)',
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text)',
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--admin-border)' }}
        >
          <Activity className="h-3 w-3 animate-pulse" style={{ color: 'var(--admin-accent)' }} />
          <span
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: 'var(--admin-accent)' }}
          >
            Live Sync: Active
          </span>
        </div>

        <AdminThemeSwitcher />

        <div className="h-4 w-px mx-2" style={{ backgroundColor: 'var(--admin-border)' }} />

        <button
          className="relative rounded-xl p-2.5 hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
          style={{ color: 'var(--admin-text-secondary)' }}
        >
          <Bell className="h-5 w-5" />
          <span
            className="absolute top-2 right-2 h-2 w-2 rounded-full border-2 shadow-[0_0_10px_var(--admin-accent)]"
            style={{ backgroundColor: 'var(--admin-accent)', borderColor: 'var(--admin-bg)' }}
          />
        </button>

        <button className="group flex items-center gap-3 pl-1 pr-1 py-1 rounded-2xl transition-all">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg transition-transform"
            style={{ background: 'var(--admin-accent)', color: 'var(--admin-accent-foreground)' }}
          >
            <User className="h-5 w-5 font-black" />
          </div>
          <div className="hidden xl:flex flex-col items-start leading-none mr-3">
            <span
              className="text-[10px] font-black uppercase tracking-widest mb-1"
              style={{ color: 'var(--admin-text-secondary)' }}
            >
              Commander
            </span>
            <span className="text-xs font-bold" style={{ color: 'var(--admin-text)' }}>
              Admin_Alpha
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
