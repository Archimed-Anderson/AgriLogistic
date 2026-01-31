"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LineChart, 
  Globe, 
  Gavel, 
  FileText, 
  Truck, 
  PieChart, 
  Search, 
  Bell, 
  Wallet, 
  Settings, 
  LogOut, 
  Menu, 
  ChevronLeft,
  ChevronDown,
  User 
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const menuItems = [
  { icon: Globe, label: "Sourcing Global", href: "/dashboard/buyer", badge: "Live" },
  { icon: FileText, label: "Mes RFQ", href: "/dashboard/buyer/rfq", badge: "2 Active" },
  { icon: Gavel, label: "Négociations", href: "/dashboard/buyer/negotiations", badge: "HOT" },
  { icon: FileText, label: "Smart Contracts", href: "/dashboard/buyer/contracts", badge: null },
  { icon: Truck, label: "Tracking Supply", href: "/dashboard/buyer/tracking", badge: null },
  { icon: PieChart, label: "Market Analytics", href: "/dashboard/buyer/analytics", badge: null },
  { icon: Gavel, label: "Quality Audit", href: "/dashboard/buyer/suppliers", badge: "New" },
]

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-mono overflow-hidden">
      {/* Sidebar - Terminal Style */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 70 }}
        className="relative flex flex-col h-screen border-r border-slate-800 bg-slate-900/50 backdrop-blur-md z-50"
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-4 border-b border-slate-800">
           <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center font-black text-white text-xs shrink-0">
                 AS
              </div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col"
                  >
                     <span className="font-bold text-white tracking-widest text-xs uppercase">AgriSource</span>
                     <span className="text-[10px] text-amber-500 font-mono">COMMAND CENTER</span>
                  </motion.div>
                )}
              </AnimatePresence>
           </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-2 space-y-1 overflow-y-auto custom-scrollbar">
           {menuItems.map((item) => {
             const isActive = pathname === item.href
             return (
               <Link
                 key={item.href}
                 href={item.href}
                 className={cn(
                   "flex items-center px-3 py-2 rounded-md transition-all group relative",
                   isActive 
                     ? "bg-blue-600/10 text-blue-400 border-l-2 border-blue-500" 
                     : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
                 )}
               >
                 <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-blue-400" : "group-hover:text-slate-300")} />
                 
                 <AnimatePresence>
                   {isSidebarOpen && (
                     <motion.span
                       initial={{ opacity: 0, x: -5 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -5 }}
                       className="ml-3 text-xs font-bold uppercase tracking-wider truncate"
                     >
                       {item.label}
                     </motion.span>
                   )}
                 </AnimatePresence>

                 {isSidebarOpen && item.badge && (
                    <Badge variant="outline" className={cn(
                      "ml-auto text-[9px] h-4 px-1 border-none",
                      item.badge === "Live" ? "bg-red-500/20 text-red-500 animate-pulse" :
                      item.badge === "HOT" ? "bg-amber-500/20 text-amber-500" :
                      "bg-blue-500/20 text-blue-500"
                    )}>
                       {item.badge}
                    </Badge>
                 )}
               </Link>
             )
           })}
        </nav>

        {/* Footer Toggle */}
        <div className="p-2 border-t border-slate-800">
           <Button 
             variant="ghost" 
             size="sm" 
             className="w-full text-slate-500 hover:text-slate-300"
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
           >
              {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
           </Button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[url('/grid-pattern.svg')]">
         {/* Top Data Bar */}
         <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur flex items-center justify-between px-6 z-40">
            {/* Search */}
            <div className="flex-1 max-w-xl">
               <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                  <Input 
                    placeholder="CMD: find commodity:corn volatility:>2%" 
                    className="pl-10 h-9 bg-slate-900 border-slate-800 text-slate-300 text-xs font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-700"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                     <span className="text-[10px] bg-slate-800 text-slate-500 px-1 rounded">CTRL+K</span>
                  </div>
               </div>
            </div>

            {/* Right Status */}
            <div className="flex items-center gap-6 ml-4">
               {/* Market Ticker */}
               <div className="hidden lg:flex items-center gap-4 text-xs font-mono border-r border-slate-800 pr-6">
                  <div className="flex flex-col">
                     <span className="text-slate-500">BTC/USD</span>
                     <span className="text-emerald-500 font-bold">42,394 ▲</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-slate-500">CORN (CBOT)</span>
                     <span className="text-red-500 font-bold">452.3 ▼</span>
                  </div>
               </div>

               {/* Notifications */}
               <Button variant="ghost" size="icon" className="relative hover:bg-slate-800 text-slate-400">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" />
               </Button>

               {/* Wallet */}
               <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <div className="h-8 w-8 bg-amber-500/10 rounded flex items-center justify-center text-amber-500">
                     <Wallet className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] text-slate-500 font-bold uppercase">Escrow Wallet</span>
                     <span className="text-xs font-mono font-bold text-white">$ 2,4M</span>
                  </div>
               </div>

               {/* User Profile */}
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 hover:bg-slate-800 rounded-lg">
                        <Avatar className="h-7 w-7 border border-slate-700">
                           <AvatarImage src="/avatars/buyer-01.png" />
                           <AvatarFallback className="bg-slate-800 text-slate-400 text-xs">TR</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start hidden sm:flex">
                           <span className="text-xs font-bold text-slate-300">Thomas R.</span>
                           <span className="text-[9px] text-blue-500 font-bold uppercase">Head Trader</span>
                        </div>
                        <ChevronDown className="h-3 w-3 text-slate-500" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-300">
                     <DropdownMenuLabel className="text-xs text-slate-500 uppercase">My Account</DropdownMenuLabel>
                     <DropdownMenuSeparator className="bg-slate-800" />
                     <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">
                        <User className="mr-2 h-4 w-4" /> Profile
                     </DropdownMenuItem>
                     <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" /> Preferences
                     </DropdownMenuItem>
                     <DropdownMenuSeparator className="bg-slate-800" />
                     <DropdownMenuItem className="focus:bg-red-900/20 focus:text-red-400 text-red-500 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </header>

         {/* Content Scrollable */}
         <main className="flex-1 overflow-auto p-6 scroll-smooth custom-scrollbar">
            {children}
         </main>
      </div>
    </div>
  )
}
