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
  Leaf
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFarmerStore } from "@/store/farmerStore"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const menuItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", id: "overview" },
  { icon: MapIcon, label: "Parcelles 3D", id: "plots" },
  { icon: FileInput, label: "Saisie", id: "entry" },
  { icon: Cpu, label: "IA", id: "ai" },
  { icon: ShoppingBag, label: "Marketplace", id: "marketplace" },
  { icon: GraduationCap, label: "Formation", id: "training" },
  { icon: Truck, label: "Logistique", id: "logistics" },
]

export function FarmerSidebar() {
  const { isSidebarOpen, toggleSidebar, activeTab, setActiveTab } = useFarmerStore()

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 280 : 80 }}
      className={cn(
        "relative flex flex-col h-screen border-r border-[#1B4D3E]/10 bg-white dark:bg-[#0a1f18] transition-all duration-300 ease-in-out z-50 overflow-hidden",
        !isSidebarOpen && "items-center"
      )}
    >
      {/* Logo Section */}
      <Link href="/" className="flex items-center gap-3 p-6 mb-8 hover:opacity-80 transition-opacity cursor-pointer">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B4D3E] text-[#D4A017] shadow-lg shadow-[#1B4D3E]/20">
          <Leaf className="h-6 w-6" />
        </div>
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xl font-black tracking-tight text-[#1B4D3E] dark:text-white"
            >
              Agro<span className="text-[#D4A017]">Deep</span>
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "group relative flex items-center w-full p-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-[#1B4D3E] text-white shadow-lg shadow-[#1B4D3E]/20" 
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5"
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
                    className="ml-3 font-semibold whitespace-nowrap"
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
            </button>
          )
        })}
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-[#1B4D3E]/10">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center hover:bg-[#1B4D3E]/5 text-[#1B4D3E]"
        >
          {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
    </motion.aside>
  )
}
