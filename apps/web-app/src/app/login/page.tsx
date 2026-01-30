"use client"

import Link from "next/link"
import React from "react"
import { LoginForm } from "@/components/auth/LoginForm"
import { AuthTabs } from "@/components/auth/AuthTabs"
import { Card, CardContent } from "@/components/ui/card"
import { Sprout, Sparkles, Leaf, ShieldCheck, BarChart3, Truck, ShoppingCart, ArrowRight } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/lib/hooks/use-auth"
import { UserRole } from "@/types/auth"
import { cn } from "@/lib/utils"

function DevAccessButton({ 
  role, 
  label, 
  icon, 
  className 
}: { 
  role: UserRole; 
  label: string; 
  icon: React.ReactNode;
  className?: string
}) {
  const { devLogin, isLoading } = useAuth()
  
  return (
    <button
      onClick={() => devLogin(role)}
      disabled={isLoading}
      className={cn(
        "group flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-black transition-all duration-300 disabled:opacity-50",
        className || "bg-slate-50 border-slate-100 text-slate-600 hover:bg-primary/5 hover:border-primary/20 hover:text-primary"
      )}
    >
      <div className="flex-shrink-0">
        {isLoading ? <LoadingSpinner size="sm" /> : icon}
      </div>
      <span className="flex-1 text-left">{label}</span>
      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
    </button>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-row overflow-hidden bg-background">
      {/* --- Left Side: Immersive Banner --- */}
      <div className="relative hidden w-0 lg:flex lg:w-[60%] xl:w-[65%]">
        {/* Banner Background with gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950">
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0VjIySDI0djEySDEydjEySDI0djEySDM2VjM0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/90 via-emerald-900/40 to-transparent" />
        </div>

        {/* Content on the banner side */}
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="rounded-xl bg-white/10 p-2 backdrop-blur-md ring-1 ring-white/20 transition-all group-hover:bg-white/20">
              <Sprout className="h-8 w-8 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AgroLogistic <span className="text-emerald-400">V3</span></span>
          </div>

          <div className="max-w-xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
            <h2 className="text-5xl font-extrabold leading-tight tracking-tight">
              L'avenir de l'agriculture <br />
              <span className="bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text text-transparent">
                commence ici.
              </span>
            </h2>
            <p className="text-lg text-emerald-50/80 leading-relaxed">
              Rejoignez une communauté de producteurs innovants qui transforment la gestion de leurs exploitations grâce à la donnée et l'intelligence artificielle.
            </p>
            
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 backdrop-blur-sm ring-1 ring-orange-500/30">
                  <Leaf className="h-5 w-5 text-orange-400" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200/60">Durable</p>
              </div>
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 backdrop-blur-sm ring-1 ring-blue-500/30">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200/60">Analytique</p>
              </div>
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 backdrop-blur-sm ring-1 ring-emerald-500/30">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200/60">Sécurisé</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-emerald-100/40">
            Â© 2026 AgroLogistic Platform. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* --- Right Side: Login Form --- */}
      <div className="flex w-full flex-col items-center justify-center p-6 sm:p-12 lg:w-[40%] xl:w-[35%] overflow-y-auto">
        <div className="w-full max-w-sm space-y-8 py-12">
          {/* Header Mobile / Title */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
              <Sprout className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold">AgroLogistic</span>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Connectez-vous à votre <span className="text-primary italic">AgriLogistic</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Gérez votre exploitation avec l'IA et la Blockchain.
              </p>
            </div>
          </div>

          {/* ACCÈS RAPIDE (TEST) - NOW AT THE TOP */}
          <div className="animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  ACCÈS RAPIDE (TEST)
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <DevAccessButton 
                  role={UserRole.ADMIN} 
                  label="Se connecter en tant qu'ADMIN" 
                  icon={<ShieldCheck className="h-4 w-4" />} 
                  className="bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100/80 hover:border-purple-200"
                />
                <DevAccessButton 
                  role={UserRole.FARMER} 
                  label="Se connecter en tant qu'AGRICULTEUR" 
                  icon={<Leaf className="h-4 w-4" />} 
                  className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/80 hover:border-emerald-200"
                />
                <DevAccessButton 
                  role={UserRole.TRANSPORTER} 
                  label="Se connecter en tant que TRANSPORTEUR" 
                  icon={<Truck className="h-4 w-4" />} 
                  className="bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100/80 hover:border-orange-200"
                />
                <DevAccessButton 
                  role={UserRole.BUYER} 
                  label="Se connecter en tant qu'ACHETEUR" 
                  icon={<ShoppingCart className="h-4 w-4" />} 
                  className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100/80 hover:border-blue-200"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium">Ou utiliser vos identifiants</span>
            </div>
          </div>

          {/* Form Container */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-orange-500/20 opacity-0 blur-lg transition duration-500 group-hover:opacity-100" />
            
            <Card className="relative overflow-hidden border-border/50 bg-card/50 shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <AuthTabs />
              <CardContent className="p-8">
                <LoginForm />
              </CardContent>
            </Card>
          </div>

          {/* Footer links only */}
          <div className="flex justify-center gap-4 text-xs text-muted-foreground/60 pt-4">
            <a href="#" className="hover:text-foreground transition-colors">Conditions</a>
            <span className="text-border">â€¢</span>
            <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
            <span className="text-border">â€¢</span>
            <a href="#" className="hover:text-foreground transition-colors">Aide</a>
          </div>
        </div>
      </div>
    </div>
  )
}


