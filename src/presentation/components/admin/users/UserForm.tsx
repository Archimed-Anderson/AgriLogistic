import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminRole } from '@/domain/admin/permissions';
import { useCreateUser } from '@/application/hooks/admin/useAdminUsers';
import { useNavigate } from 'react-router-dom';

const userSchema = z
  .object({
    email: z.string().email('Email invalide'),
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    role: z.nativeEnum(AdminRole),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserForm({ onSuccess, onCancel }: UserFormProps) {
  const navigate = useNavigate();
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: AdminRole.SUPPORT,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: UserFormData) => {
    try {
      await createUser.mutateAsync({
        email: data.email,
        name: data.name,
        role: data.role,
        password: data.password,
        phone: data.phone,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/admin/users');
      }
    } catch (error) {
      // Error is handled by the mutation hook (toast)
      console.error('Failed to create user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="utilisateur@example.com"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Jean Dupont"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role">Rôle *</Label>
        <Select
          value={selectedRole}
          onValueChange={(value) => setValue('role', value as AdminRole)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AdminRole.SUPER_ADMIN}>Super Admin</SelectItem>
            <SelectItem value={AdminRole.ADMIN}>Admin</SelectItem>
            <SelectItem value={AdminRole.MANAGER}>Manager</SelectItem>
            <SelectItem value={AdminRole.SUPPORT}>Support</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" type="tel" {...register('phone')} placeholder="+33 6 12 34 56 78" />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe *</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          placeholder="••••••••"
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          placeholder="••••••••"
          className={errors.confirmPassword ? 'border-red-500' : ''}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel || (() => navigate('/admin/users'))}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Création...' : "Créer l'utilisateur"}
        </Button>
      </div>
    </form>
  );
}
