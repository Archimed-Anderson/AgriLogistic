"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Sprout, 
  Droplets, 
  CloudSun, 
  Tractor, 
  ClipboardCheck, 
  UsersRound, 
  Users, 
  Package, 
  Truck, 
  Share2, 
  Wifi, 
  BrainCircuit, 
  Landmark, 
  FileBarChart, 
  Newspaper, 
  Settings,
  LogOut,
  Wrench
} from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

const sidebarGroups = [
  {
    title: "Aperçu",
    items: [
      { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "Agriculture",
    items: [
      { title: "Crop Intelligence", href: "/admin/crop-intelligence", icon: Sprout },
      { title: "Sol & Eau", href: "/admin/soil-water", icon: Droplets },
      { title: "Météo", href: "/admin/weather", icon: CloudSun },
      { title: "Équipements", href: "/admin/equipment", icon: Tractor },
      { title: "Gestion des tâches", href: "/admin/task-management", icon: ClipboardCheck },
      { title: "Main-d'oeuvre", href: "/admin/labor-management", icon: UsersRound },
    ]
  },
  {
    title: "Opérations",
    items: [
      { title: "Utilisateurs", href: "/admin/users", icon: Users },
      { title: "ProduitInventory", href: "/admin/products", icon: Package },
      { title: "AgriLogistic Link Manager", href: "/admin/link-manager", icon: Truck },
      { title: "Calculateurs Transport", href: "/admin/transport-calculators", icon: Truck },
      { title: "Marketplace Manager", href: "/admin/marketplace", icon: Package },
      { title: "Gestion Loueur", href: "/admin/loueur-manager", icon: Wrench },
      { title: "Affiliation Hub", href: "/admin/affiliation-manager", icon: Share2 },
      { title: "IoT Hub", href: "/admin/iot-hub", icon: Wifi },
    ]
  },
  {
    title: "Analyse & Tech",
    items: [
      { title: "AI Insights", href: "/admin/ai-insights", icon: BrainCircuit },
      { title: "Finance", href: "/admin/finance", icon: Landmark },
      { title: "Rapports", href: "/admin/reports", icon: FileBarChart },
    ]
  },
  {
    title: "Contenu",
    items: [
      { title: "Blog & Events", href: "/admin/blog-events", icon: Newspaper },
    ]
  },
  {
    title: "Système",
    items: [
      { title: "Paramètres", href: "/admin/settings", icon: Settings },
    ]
  }
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="hidden border-r bg-slate-900 text-white lg:flex w-[280px] min-h-screen flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-800 bg-slate-900 z-10 sticky top-0">
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight hover:opacity-80 transition-opacity">
          <span className="text-emerald-500">Agro</span>Deep
          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded ml-2 uppercase tracking-widest font-bold">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 space-y-8">
        {sidebarGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-3 mb-3 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/25 translate-x-1"
                        : "text-slate-400 hover:text-white hover:bg-slate-800 hover:translate-x-1"
                    )}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-white" : "text-slate-500 group-hover:text-white"
                    )} />
                    {item.title}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900 sticky bottom-0 z-10">
        <button 
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </div>
  )
}
