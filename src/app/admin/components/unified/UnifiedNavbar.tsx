import { Bell, HelpCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

export function UnifiedNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card/40 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 3C7 3 3 7 3 12c0 3.5 2 6.5 5 8" />
              <path d="M14 9l6 3-6 3" />
              <path d="M8 12h12" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-foreground uppercase leading-none">
              AgroLogistic
            </h1>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              Admin Console
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex gap-2 h-8 text-xs font-bold border-primary/20 hover:bg-primary/5 hover:text-primary"
          onClick={() => (window.location.href = '/admin/dashboard')}
        >
          <LayoutDashboard className="w-3 h-3" />
          Retour au Panel
        </Button>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground hover:text-foreground relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-background" />
        </Button>

        <div className="h-6 w-px bg-border mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="pl-2 pr-4 py-1 h-auto rounded-full hover:bg-foreground/5 gap-3"
            >
              <Avatar className="w-8 h-8 border border-border">
                <AvatarImage />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-black">
                  {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-xs font-black text-foreground">
                  {user?.name || 'Administrateur'}
                </p>
                <p className="text-[9px] font-medium text-muted-foreground uppercase">
                  {user?.roles?.[0] || 'Super Admin'}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
            <DropdownMenuItem
              className="rounded-lg text-xs font-medium cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-600"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
