import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ADMIN_NAVIGATION, NavItem } from '@/config/admin-navigation';

export function UnifiedSidebar() {
  const [search, setSearch] = useState('');
  const location = useLocation();

  // Filter items if searching, otherwise show all
  const filteredGroups = ADMIN_NAVIGATION.map((group) => {
    if (!search) return group;

    // Check if group title matches
    if (group.title.toLowerCase().includes(search.toLowerCase())) return group;

    // Check children
    const matchingChildren = group.children?.filter((child) =>
      child.title.toLowerCase().includes(search.toLowerCase())
    );

    if (matchingChildren && matchingChildren.length > 0) {
      return { ...group, children: matchingChildren };
    }

    return null;
  }).filter(Boolean) as NavItem[];

  return (
    <aside className="w-64 bg-card/40 backdrop-blur-xl border-r border-border h-[calc(100vh-64px)] flex flex-col transition-all duration-300">
      {/* Search Filter */}
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full bg-background/50 border border-border rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/70"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20">
        {filteredGroups.map((group) => (
          <div key={group.id} className="space-y-1">
            {/* Section Header */}
            <h3 className="px-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
              {group.title}
            </h3>

            {/* Links */}
            <div className="space-y-0.5">
              {group.children?.map((item) => (
                <SidebarItem key={item.id} item={item} currentPath={location.pathname} />
              ))}
            </div>
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-8 text-xs text-muted-foreground">Aucun résultat</div>
        )}
      </div>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-border/50 bg-foreground/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 blur-sm" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-foreground">Système Nominal</p>
            <p className="text-[9px] text-muted-foreground">Latence: 24ms</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const isActive = item.path ? currentPath.startsWith(item.path) : false;
  const hasChildren = item.children && item.children.length > 0;
  const [isOpen, setIsOpen] = useState(isActive);

  // Auto-expand if active
  React.useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive]);

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors',
            isActive
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-4 h-4" />
            <span>{item.title}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-3 h-3 opacity-50" />
          ) : (
            <ChevronRight className="w-3 h-3 opacity-50" />
          )}
        </button>

        {isOpen && (
          <div className="pl-4 space-y-1 border-l border-border/40 ml-4">
            {item.children!.map((child) => (
              <SidebarItem key={child.id} item={child} currentPath={currentPath} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path || '#'}
      className={({ isActive: isLinkActive }) =>
        cn(
          'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group border border-transparent',
          isLinkActive
            ? 'bg-background shadow-sm border-border text-foreground font-bold'
            : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
        )
      }
    >
      <div className="flex items-center gap-3">
        <item.icon className={cn('w-4 h-4', !item.path && 'opacity-50')} />
        <span>{item.title}</span>
      </div>
      {item.badge && (
        <span
          className={cn(
            'px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider',
            item.badge === 'Live'
              ? 'bg-emerald-500/10 text-emerald-500'
              : item.badge === 'Prioritaire'
              ? 'bg-amber-500/10 text-amber-500'
              : 'bg-primary/10 text-primary'
          )}
        >
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}
