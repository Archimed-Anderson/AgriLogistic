import { z } from 'zod';
import { UserRole } from '@/types/auth';

// Schéma de validation pour la connexion
export const loginSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  role: z.nativeEnum(UserRole).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Schéma de validation pour la réinitialisation de mot de passe (oublié)
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Schéma de validation pour la réinitialisation de mot de passe (avec token)
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Le token de réinitialisation est requis'),
    password: z
      .string()
      .min(1, 'Le mot de passe est requis')
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
      ),
    confirmPassword: z.string().min(1, 'La confirmation du mot de passe est requise'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Schéma de validation pour l'inscription
export const registerSchema = z
  .object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
      ),
    confirmPassword: z.string().min(1, 'La confirmation est requise'),
    role: z.nativeEnum(UserRole, {
      required_error: 'Veuillez sélectionner un type de compte',
    }),
    // Champs optionnels basés sur le rôle
    farmName: z.string().min(2, "Le nom de l'exploitation est requis").optional(),
    licenseNumber: z.string().min(5, 'Le numéro de permis/immatriculation est requis').optional(),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'Vous devez accepter les conditions générales' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Fonction helper pour valider un champ individuel
export function validateField<T extends z.ZodObject<any>>(
  schema: T,
  field: keyof z.infer<T>,
  value: unknown
): string | null {
  try {
    const fieldSchema = (schema as any).shape?.[field as string];
    if (fieldSchema) {
      fieldSchema.parse(value);
    }
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || null;
    }
    return null;
  }
}
