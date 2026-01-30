"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Shield, Sprout, ShoppingCart, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

import { UserRole } from "@/types/auth"

interface RoleOption {
  value: UserRole
  label: string
  description: string
  icon: React.ReactNode
  color: string
}

const roleOptions: RoleOption[] = [
  {
    value: UserRole.ADMIN,
    label: "Administrateur",
    description: "Gestion complète de la plateforme",
    icon: <Shield className="h-5 w-5" />,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    value: UserRole.FARMER,
    label: "Agriculteur",
    description: "Gestion de votre exploitation",
    icon: <Sprout className="h-5 w-5" />,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    value: UserRole.BUYER,
    label: "Acheteur",
    description: "Accès au marketplace et commandes",
    icon: <ShoppingCart className="h-5 w-5" />,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    value: UserRole.TRANSPORTER,
    label: "Transporteur",
    description: "Gestion des livraisons et flotte",
    icon: <Truck className="h-5 w-5" />,
    color: "text-orange-600 dark:text-orange-400",
  },
]

interface RoleSelectorProps {
  value?: UserRole
  onChange: (role: UserRole) => void
  error?: boolean
  className?: string
}

export function RoleSelector({
  value,
  onChange,
  error,
  className,
}: RoleSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-semibold text-foreground">
        Type de compte
      </Label>
      <RadioGroup
        value={value}
        onValueChange={(newValue) => onChange(newValue as UserRole)}
        className="grid grid-cols-2 gap-3"
      >
        {roleOptions.map((option) => (
          <div key={option.value}>
            <RadioGroupItem
              value={option.value}
              id={option.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={option.value}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 border-input bg-card p-4 cursor-pointer transition-all duration-200",
                "hover:border-primary hover:bg-accent/50",
                value === option.value && "border-primary bg-primary/5",
                error && "border-destructive",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              )}
            >
              <div className={cn("mb-2", option.color)}>{option.icon}</div>
              <span className="text-sm font-semibold text-center">
                {option.label}
              </span>
              <span className="text-xs text-muted-foreground text-center mt-1">
                {option.description}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
      {error && (
        <p className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1">
          Veuillez sélectionner un type de compte
        </p>
      )}
    </div>
  )
}
