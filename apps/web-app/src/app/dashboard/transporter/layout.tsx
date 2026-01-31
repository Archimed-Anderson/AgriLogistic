"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Navigation2, 
  Truck, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Wallet,
  CloudRain,
  Cpu,
  ChevronLeft,
  Menu,
  Activity,
  User,
  Search,
  ChevronDown,
  ShoppingBag,
  FileText
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
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"

// --- Menu Items ---
const menuItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", href: "/dashboard/transporter", badge: null },
  { icon: Navigation2, label: "Optimizer Engine", href: "/dashboard/transporter/optimizer", badge: "Live" },
  { icon: ShoppingBag, label: "Opportunités", href: "/dashboard/transporter/market", badge: "New" },
  { icon: Truck, label: "Gestion Flotte", href: "/dashboard/transporter/fleet", badge: null },
  { icon: FileText, label: "Documents", href: "/dashboard/transporter/documents", badge: null },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/transporter/analytics", badge: null },
]

export default function TransporterLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Sidebar Gauche */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className={cn(
          "relative flex flex-col h-screen border-r border-white/5 bg-slate-950/50 backdrop-blur-xl transition-all duration-300 ease-in-out z-50",
          !isSidebarOpen && "items-center"
        )}
      >
        {/* Header / Logo */}
        <Link href="/" className="flex items-center gap-3 p-6 mb-8 cursor-pointer group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/20 shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Navigation2 className="h-6 w-6" />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="text-lg font-black tracking-tighter leading-none uppercase group-hover:text-white transition-colors">
                  Agri<span className="text-emerald-500">Link</span>
                </span>
                <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-40 group-hover:opacity-100 transition-opacity text-emerald-500">Command Center</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
           <div className={cn("px-2 mb-4", !isSidebarOpen && "hidden")}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Opérations</p>
           </div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center w-full p-3 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-white/5 text-emerald-400 shadow-inner" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300",
                  isActive ? "bg-emerald-500/10 scale-110" : "group-hover:scale-105"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-3 flex items-center justify-between flex-1"
                    >
                      <span className="font-bold text-sm whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black px-1.5 py-0">
                           {item.badge}
                        </Badge>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {isActive && (
                   <motion.div 
                     layoutId="active-bar"
                     className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full"
                   />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Action Bottom */}
        <div className="p-4 space-y-2 border-t border-white/5">
           <Link href="/dashboard/transporter/settings" className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all">
              <Settings className="h-5 w-5" />
              {isSidebarOpen && <span className="text-sm font-bold">Configuration</span>}
           </Link>
           <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full h-12 flex items-center justify-center hover:bg-white/5 text-slate-400"
          >
            {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 bg-[#020617] relative">
        {/* Scanning Line Animation */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/20 shadow-[0_0_15px_emerald] animate-scan z-0 pointer-events-none" />

        {/* Topbar Pro */}
        <header className="h-20 border-b border-white/5 bg-slate-950/20 backdrop-blur-md flex items-center justify-between px-8 z-40 shrink-0">
          {/* Dashboard Stats / Indicators */}
          <div className="flex items-center gap-8 flex-1">
             <div className="flex items-center gap-4 bg-slate-900/40 p-1 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                   <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-emerald-500/60 leading-none">MQTT Status</span>
                      <span className="text-[10px] font-black text-emerald-400 tracking-wider">CONNECTED_STABLE</span>
                   </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2">
                   <CloudRain className="h-4 w-4 text-slate-400" />
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-slate-500 leading-none">Météo Trajet</span>
                      <span className="text-[10px] font-black text-slate-200">14°C // PLUIE FINE</span>
                   </div>
                </div>
             </div>

             <div className="h-10 w-[1px] bg-white/5 hidden xl:block" />

             <div className="hidden xl:flex items-center gap-4 bg-slate-900/40 px-6 py-2 rounded-2xl border border-white/5">
                <Wallet className="h-4 w-4 text-orange-500" />
                <div className="flex flex-col">
                   <span className="text-[8px] font-black uppercase text-slate-500 leading-none">Wallet Balance</span>
                   <span className="text-sm font-black text-slate- font-mono">14.829,00 <span className="text-orange-500">€</span></span>
                </div>
             </div>
          </div>

          {/* User & Notifications */}
          <div className="flex items-center gap-4">
            <div className="relative group">
               <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5 relative border border-white/5">
                 <Bell className="h-5 w-5 text-slate-400" />
                 <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-orange-500 border-2 border-slate-950" />
               </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 px-2 rounded-2xl hover:bg-white/5 border border-white/5">
                  <Avatar className="h-10 w-10 border-2 border-emerald-500/20">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                    <AvatarFallback>TX</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-black text-slate- font-tight">Commandant Felix</p>
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Opérateur Senior</p>
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-500 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 bg-slate-950 border-white/5 text-slate-200 shadow-3xl">
                <DropdownMenuLabel className="font-black text-[10px] uppercase text-slate-500 px-3 py-2">System Access</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="rounded-xl flex gap-3 p-3 font-bold text-sm hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">
                  <User className="h-4 w-4" /> Profil Pilote
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl flex gap-3 p-3 font-bold text-sm hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">
                  <Cpu className="h-4 w-4" /> Hardware Sync
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="rounded-xl flex gap-3 p-3 font-bold text-sm text-orange-500 hover:bg-orange-500/10 transition-colors cursor-pointer">
                  <LogOut className="h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-auto bg-[#020617] p-8 custom-scrollbar">
           {children}
        </main>
      </div>
      
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </div>
  )
}
