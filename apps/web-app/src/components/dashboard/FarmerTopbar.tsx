"use client"

import * as React from "react"
import { 
  Bell, 
  Search, 
  Cloud, 
  Droplets, 
  Thermometer,
  ChevronDown
} from "lucide-react"
import { useFarmerStore } from "@/store/farmerStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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

export function FarmerTopbar() {
  const { weather, notifications } = useFarmerStore()
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1B4D3E]/10 bg-white/70 backdrop-blur-xl dark:bg-[#0a1f18]/70">
      <div className="flex h-16 items-center justify-between px-8">
        {/* Left: Weather Widget (Mock) */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 dark:bg-white/5 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-[#D4A017]" />
              <span className="text-xs font-bold">{weather?.temp || 24}°C</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10" />
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-bold">{weather?.humidity || 65}%</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10" />
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-bold">Sol Opt.</span>
            </div>
          </div>

          <div className="relative w-64 hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher une parcelle..." 
              className="pl-10 h-9 bg-slate-50 border-none rounded-full text-xs"
            />
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-[#1B4D3E]/5">
            <Bell className="h-5 w-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 px-2 py-1.5 rounded-full hover:bg-[#1B4D3E]/5">
                <Avatar className="h-8 w-8 border-2 border-[#D4A017]">
                  <AvatarImage src="/avatars/farmer.png" />
                  <AvatarFallback className="bg-[#1B4D3E] text-white font-bold">JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-[#1B4D3E] dark:text-white leading-tight">Jean Dupont</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Exploitant Agricole</p>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border-[#1B4D3E]/10">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profil</DropdownMenuItem>
              <DropdownMenuItem>Paramètres</DropdownMenuItem>
              <DropdownMenuItem>Abonnement Premium</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">Déconnexion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
