"use client"

import Link from "next/link"
import { Bell, Search, User, ArrowUpRight } from "lucide-react"

export function AdminNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-white px-6 shadow-sm">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Rechercher..." 
             className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
           />
        </div>
      </div>
      <div className="flex items-center gap-4">
         <Link href="/" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-primary transition-colors">
            Retour au site <ArrowUpRight className="h-3.5 w-3.5" />
         </Link>
         <div className="h-4 w-px bg-slate-200 mx-2" />
         <button className="relative rounded-full p-2 hover:bg-slate-100 text-slate-500 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
         </button>
         <button className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-primary hover:text-white transition-colors">
            <User className="h-4 w-4" />
         </button>
      </div>
    </header>
  )
}
