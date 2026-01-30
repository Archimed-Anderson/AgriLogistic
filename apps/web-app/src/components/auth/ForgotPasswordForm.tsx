"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validation/auth-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

interface ForgotPasswordFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ForgotPasswordForm({
  open,
  onOpenChange,
}: ForgotPasswordFormProps) {
  const { forgotPassword, error: authError, clearError } = useAuth()
  const [isSuccess, setIsSuccess] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  })

  // Réinitialiser le formulaire quand le dialog s'ouvre/ferme
  React.useEffect(() => {
    if (!open) {
      reset()
      setIsSuccess(false)
      clearError()
      clearErrors()
    }
  }, [open, reset, clearError, clearErrors])

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearError()
    clearErrors()
    setIsSuccess(false)

    try {
      await forgotPassword(data)
      setIsSuccess(true)
    } catch (error) {
      // Les erreurs sont gérées par le hook useAuth
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="forgot-password-description">
        <DialogHeader>
          <DialogTitle>Mot de passe oublié</DialogTitle>
          <DialogDescription id="forgot-password-description">
            Entrez votre adresse email et nous vous enverrons un lien pour
            réinitialiser votre mot de passe.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-4">
            <Alert variant="success" className="animate-in fade-in-0 slide-in-from-top-1">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Un email de réinitialisation a été envoyé à votre adresse. Veuillez
                vérifier votre boîte de réception et suivre les instructions.
              </AlertDescription>
            </Alert>
            <Button onClick={handleClose} className="w-full">
              Fermer
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
            aria-label="Formulaire de réinitialisation de mot de passe"
          >
            {/* Message d'erreur global */}
            {authError && (
              <Alert
                variant="destructive"
                role="alert"
                className="animate-in fade-in-0 slide-in-from-top-1"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            {/* Champ Email */}
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Identifiant de récupération</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="votre@email.com"
                icon={<Mail className="h-4 w-4" />}
                iconPosition="left"
                error={!!errors.email}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "forgot-email-error" : undefined}
                {...register("email", {
                  onChange: () => {
                    if (errors.email) {
                      clearErrors("email")
                    }
                  },
                })}
              />
              {errors.email && (
                <p
                  id="forgot-email-error"
                  className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Boutons */}
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" variant="default" />
                    <span>Envoi...</span>
                  </>
                ) : (
                  "Envoyer"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
