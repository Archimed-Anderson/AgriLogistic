"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormData } from "@/lib/validation/auth-schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Mail, Lock, User, AlertCircle, CheckCircle2, Building2, Truck, Shield, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter } from "next/navigation"

interface RegisterFormProps {
  initialRole?: "farmer" | "buyer" | "transporter" | "admin"
  onSuccess?: () => void
}

export function RegisterForm({ initialRole, onSuccess }: RegisterFormProps) {
  const { register: apiRegister, error: authError, clearError, isLoading } = useAuth()
  const [isSuccess, setIsSuccess] = React.useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: initialRole as any || "farmer",
      terms: true,
      farmName: "",
      licenseNumber: "",
    },
    mode: "onBlur",
  })

  // Surveiller le rôle pour l'affichage conditionnel
  const selectedRole = useWatch({
    control,
    name: "role",
  })

  const onSubmit = async (data: RegisterFormData) => {
    clearError()
    try {
      // On passe le flag pour éviter la redirection automatique du hook
      await apiRegister(data) 
      setIsSuccess(true)
      
      // Petit délai pour laisser l'utilisateur lire le message de succès
      setTimeout(() => {
        const rolePaths: Record<string, string> = {
          admin: "/dashboard/admin",
          farmer: "/dashboard/farmer",
          buyer: "/dashboard/buyer",
          transporter: "/dashboard/transporter",
        }
        router.push(rolePaths[data.role] || "/dashboard/farmer")
        onSuccess?.()
      }, 2500)
    } catch (error) {
      // Erreur gérée par useAuth
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30 ring-8 ring-emerald-50 dark:ring-emerald-900/20">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">Compte créé avec succès !</h3>
          <p className="text-muted-foreground font-medium">
            Bienvenue chez AgriLogistic. <br />
            <span className="text-primary animate-pulse">Connexion en cours...</span>
          </p>
        </div>
        <div className="flex justify-center pt-4">
          <LoadingSpinner size="md" className="text-primary" />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {authError && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input
          id="name"
          placeholder="Jean Dupont"
          icon={<User className="h-4 w-4" />}
          error={!!errors.name}
          {...register("name")}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Identifiant de connexion</Label>
        <Input
          id="email"
          type="email"
          placeholder="jean@agri-solutions.com"
          icon={<Mail className="h-4 w-4" />}
          error={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Choix du mot d'accès</Label>
          <Input
            id="password"
            type="password"
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            icon={<Lock className="h-4 w-4" />}
            className="h-10 px-3"
            error={!!errors.password}
            {...register("password")}
          />
          {errors.password && <p className="text-[10px] text-destructive leading-tight">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            icon={<Lock className="h-4 w-4" />}
            className="h-10 px-3"
            error={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p className="text-[10px] text-destructive leading-tight">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      {/* Champs Conditionnels */}
      {selectedRole === "farmer" && (
        <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
          <Label htmlFor="farmName" className="text-primary font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Nom de l'Exploitation
          </Label>
          <Input
            id="farmName"
            placeholder="Ferme des Verts Pâturages"
            error={!!errors.farmName}
            {...register("farmName")}
          />
          {errors.farmName && <p className="text-xs text-destructive">{errors.farmName.message}</p>}
        </div>
      )}

      {selectedRole === "transporter" && (
        <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
          <Label htmlFor="licenseNumber" className="text-primary font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" /> Immatriculation / NÂ° Permis
          </Label>
          <Input
            id="licenseNumber"
            placeholder="AB-123-CD"
            error={!!errors.licenseNumber}
            {...register("licenseNumber")}
          />
          {errors.licenseNumber && <p className="text-xs text-destructive">{errors.licenseNumber.message}</p>}
        </div>
      )}

      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="terms"
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          {...register("terms")}
        />
        <label htmlFor="terms" className="text-xs text-muted-foreground">
          J'accepte les <a href="#" className="underline hover:text-primary">conditions d'utilisation</a> d'AgriLogistic.
        </label>
      </div>
      {errors.terms && <p className="text-xs text-destructive">{errors.terms.message}</p>}

      <Button
        type="submit"
        className="w-full h-11 mt-4"
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting || isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Création en cours...
          </>
        ) : (
          "Créer mon compte"
        )}
      </Button>
    </form>
  )
}


