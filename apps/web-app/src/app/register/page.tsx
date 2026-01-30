"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sprout, ArrowLeft, ShoppingCart, Truck, User, ArrowRight } from "lucide-react"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { AuthTabs } from "@/components/auth/AuthTabs"
import { UserRole } from "@/types/auth"

export default function RegisterPage() {
  const [step, setStep] = React.useState<1 | 2>(1)
  const [selectedRole, setSelectedRole] = React.useState<UserRole>(UserRole.FARMER)

  const accountTypes = [
    {
      role: UserRole.FARMER,
      label: "Agriculteur",
      description: "Vendez vos produits directement aux acheteurs",
      icon: User,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      role: UserRole.BUYER,
      label: "Acheteur",
      description: "Achetez des produits agricoles de qualité",
      icon: ShoppingCart,
      color: "from-blue-500 to-indigo-600",
    },
    {
      role: UserRole.TRANSPORTER,
      label: "Transporteur",
      description: "Proposez vos services de transport logistique",
      icon: Truck,
      color: "from-orange-500 to-amber-600",
    },
  ]

  return (
    <div className="flex min-h-screen w-full flex-row overflow-hidden bg-background">
      {/* --- Left Side: Immersive Banner --- */}
      <div className="relative hidden w-0 lg:flex lg:w-[60%] xl:w-[65%]">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0VjIySDI0djEySDEydjEySDI0djEySDM2VjM0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/90 via-emerald-900/40 to-transparent" />
        </div>

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => (window.location.href = "/")}>
            <div className="rounded-xl bg-white/10 p-2 backdrop-blur-md ring-1 ring-white/20 transition-all group-hover:bg-white/20">
              <Sprout className="h-8 w-8 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              AgriLogistic <span className="text-emerald-400">V3</span>
            </span>
          </div>

          <div className="max-w-xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
            <h2 className="text-5xl font-extrabold leading-tight tracking-tight">
              Rejoignez notre <br />
              <span className="bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text text-transparent">
                communauté agricole
              </span>
            </h2>
            <p className="text-lg text-emerald-50/80 leading-relaxed">
              Créez votre compte et commencez à transformer votre exploitation agricole avec des outils modernes et intelligents.
            </p>
          </div>

          <div className="text-sm text-emerald-100/40">
            Â© 2026 AgriLogistic Platform. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* --- Right Side: Register Form --- */}
      <div className="flex w-full flex-col items-center justify-center p-6 sm:p-12 lg:w-[40%] xl:w-[35%]">
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
              <Sprout className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold">AgriLogistic</span>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {step === 1 ? "Choisissez votre" : "Créez votre"} <span className="text-primary italic">{step === 1 ? "type d'activité" : "compte sécurisé"}</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {step === 1 
                  ? "Sélectionnez le rôle qui correspond le mieux à votre utilisation de la plateforme."
                  : "Finalisez votre inscription pour accéder à vos outils personnalisés."}
              </p>
            </div>
          </div>

          {/* Form Container */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-orange-500/20 opacity-0 blur-lg transition duration-500 group-hover:opacity-100" />
            
            <Card className="relative overflow-hidden border-border/50 bg-card/50 shadow-xl backdrop-blur-sm transition-all duration-500 min-h-[400px]">
              <AuthTabs />
              {step === 1 ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <CardHeader>
                    <CardTitle>Type de compte</CardTitle>
                    <CardDescription>
                      Sélectionnez votre profil
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      {accountTypes.map((type) => {
                        const Icon = type.icon
                        const isSelected = selectedRole === type.role
                        return (
                          <button
                            key={type.role}
                            type="button"
                            onClick={() => setSelectedRole(type.role)}
                            className={`p-4 rounded-xl border-2 transition-all text-left group/btn ${
                              isSelected
                                ? "border-primary bg-primary/5 ring-4 ring-primary/10 shadow-sm"
                                : "border-border hover:border-primary/50 hover:bg-accent/50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2.5 rounded-xl bg-gradient-to-br transition-transform group-hover/btn:scale-110 ${type.color} text-white shadow-lg`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-sm">{type.label}</h3>
                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{type.description}</p>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    <div className="pt-4">
                      <Button
                        className="w-full h-11 font-bold group"
                        onClick={() => setStep(2)}
                      >
                        Continuer
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <CardTitle>Vos informations</CardTitle>
                      <CardDescription>Compte {accountTypes.find(t => t.role === selectedRole)?.label}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RegisterForm initialRole={selectedRole} />
                  </CardContent>
                </div>
              )}
            </Card>
          </div>

          {/* Footer links */}
          <div className="text-center space-y-6">
            <div className="flex justify-center gap-4 text-xs text-muted-foreground/60">
              <Link href="#" className="hover:text-foreground transition-colors">Conditions</Link>
              <span className="text-border">â€¢</span>
              <Link href="#" className="hover:text-foreground transition-colors">Confidentialité</Link>
              <span className="text-border">â€¢</span>
              <Link href="#" className="hover:text-foreground transition-colors">Aide</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



