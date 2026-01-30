"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Mail, Lock, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { loginSchema, type LoginFormData } from "@/lib/validation/auth-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ForgotPasswordForm } from "./ForgotPasswordForm"
import { RoleSelector } from "./RoleSelector"
import { UserRole } from "@/types/auth"

export function LoginForm() {
  const { login, error: authError, clearError, isLoading } = useAuth()
  const [showForgotPassword, setShowForgotPassword] = React.useState(false)
  const [selectedRole, setSelectedRole] = React.useState<UserRole | undefined>(UserRole.FARMER)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  })

  // Synchroniser le rôle sélectionné avec le formulaire (facultatif côté client)
  React.useEffect(() => {
    if (selectedRole) {
      // Le type de react-hook-form ne connaît que les champs avec defaultValues,
      // on caste donc ici pour enregistrer le rôle en restant rétrocompatible.
      setValue("role" as any, selectedRole)
    }
  }, [selectedRole, setValue])

  const onSubmit = async (data: LoginFormData) => {
    clearError()
    try {
      // S'assurer que le rôle est inclus dans les données de connexion
      const loginData = { ...data, role: selectedRole }
      await login(loginData as any)
    } catch (error) {
      // Les erreurs sont gérées par le hook useAuth
    }
  }

  // Gestion de la navigation au clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      clearError()
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        className="space-y-5"
        noValidate
        aria-label="Formulaire de connexion"
      >
        {/* Message d'erreur global */}
        {authError && (
          <Alert variant="destructive" role="alert" className="animate-in fade-in-0 slide-in-from-top-1 border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">{authError}</AlertDescription>
          </Alert>
        )}

        {/* Sélection du type de compte */}
        <RoleSelector
          value={selectedRole}
          onChange={setSelectedRole}
          // Le type de react-hook-form ne connaît pas le champ `role` ici,
          // on caste donc pour rester compatible sans casser la validation existante.
          error={!!(errors as any)?.role}
        />

        {/* Champ Email */}
        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-sm font-semibold text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            icon={<Mail className="h-4 w-4" />}
            iconPosition="left"
            error={!!errors.email}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Champ Mot de passe */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold text-foreground">
              Mot de passe
            </Label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-xs sm:text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
            >
              Mot de passe oublié ?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            iconPosition="left"
            error={!!errors.password}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          {errors.password && (
            <p
              id="password-error"
              className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Bouton de soumission */}
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={isSubmitting || isLoading}
            aria-busy={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <>
                <LoadingSpinner size="sm" variant="default" />
                <span>Connexion en cours...</span>
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </div>
      </form>

      {/* Dialog pour mot de passe oublié */}
      <ForgotPasswordForm
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </>
  )
}
