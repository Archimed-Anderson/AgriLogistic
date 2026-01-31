"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  FileInput, 
  Cpu, 
  ShoppingBag, 
  GraduationCap, 
  Truck,
  ChevronLeft,
  Menu,
  Leaf,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"

// --- Menu Items ---
const menuItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", href: "/dashboard/agriculteur" },
  { icon: MapIcon, label: "Parcelles 3D", href: "/dashboard/agriculteur/parcelles" },
  { icon: FileInput, label: "Saisie", href: "/dashboard/agriculteur/saisie" },
  { icon: Cpu, label: "IA", href: "/dashboard/agriculteur/ai" },
  { icon: ShoppingBag, label: "Marketplace", href: "/dashboard/agriculteur/marketplace" },
  { icon: GraduationCap, label: "Formation", href: "/dashboard/agriculteur/formation" },
  { icon: Truck, label: "Logistique", href: "/dashboard/agriculteur/logistique" },
]

export default function FarmerDashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-[#F8FAF9] dark:bg-[#050505] overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className={cn(
          "relative flex flex-col h-screen border-r border-[#1B4D3E]/10 bg-white dark:bg-[#0a1f18] transition-all duration-300 ease-in-out z-50",
          !isSidebarOpen && "items-center"
        )}
      >
        {/* Logo */}

        <Link href="/" className="flex items-center gap-3 p-6 mb-8 group cursor-pointer">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B4D3E] text-[#D4A017] shadow-lg shadow-[#1B4D3E]/20 shrink-0 group-hover:bg-[#1B4D3E]/90 transition-colors">
            <Leaf className="h-6 w-6" />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-black tracking-tight text-[#1B4D3E] dark:text-white whitespace-nowrap"
              >
                Agri<span className="text-[#D4A017]">Logistic</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center w-full p-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-[#1B4D3E] text-white shadow-lg shadow-[#1B4D3E]/20" 
                    : "text-slate-500 hover:bg-[#1B4D3E]/5 dark:hover:bg-white/5"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-[#D4A017]" : "group-hover:text-[#1B4D3E]"
                )} />
                
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-3 font-bold text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && isSidebarOpen && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute right-2 h-1.5 w-1.5 rounded-full bg-[#D4A017]"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer Toggle */}
        <div className="p-4 border-t border-[#1B4D3E]/10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center hover:bg-[#1B4D3E]/5 text-[#1B4D3E]"
          >
            {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-[#1B4D3E]/10 bg-white dark:bg-[#0a1f18] flex items-center justify-between px-8 z-40 shrink-0">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative w-64 hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input 
                 placeholder="Rechercher..." 
                 className="pl-10 h-10 bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-xs font-bold"
               />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-[#1B4D3E]/5 relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
            </Button>

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10 hidden sm:block" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 px-2 rounded-2xl hover:bg-[#1B4D3E]/5">
                  <Avatar className="h-9 w-9 border-2 border-[#D4A017]">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-black text-[#1B4D3E] dark:text-white leading-tight">Jean Dupont</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Exploitant Premium</p>
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-[#1B4D3E]/10">
                <DropdownMenuLabel className="font-black text-[10px] uppercase text-slate-500 px-3 py-2">Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#1B4D3E]/5" />
                <DropdownMenuItem className="rounded-xl flex gap-3 p-3 font-bold text-sm cursor-pointer">
                  <User className="h-4 w-4 text-[#D4A017]" /> Profil Expert
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl flex gap-3 p-3 font-bold text-sm cursor-pointer">
                  <Settings className="h-4 w-4 text-[#D4A017]" /> Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#1B4D3E]/5" />
                <DropdownMenuItem className="rounded-xl flex gap-3 p-3 font-bold text-sm text-red-500 cursor-pointer">
                  <LogOut className="h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#F8FAF9] dark:bg-[#050505] p-8 custom-scrollbar">
           {children}
        </main>
      </div>
    </div>
  )
}
