'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, AlertCircle, Loader2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

// Schema with Honeypot protection
const demoSchema = z.object({
  firstName: z.string().min(2, 'Le prénom est requis'),
  lastName: z.string().min(2, 'Le nom est requis'),
  email: z
    .string()
    .email('Email invalide')
    .refine(
      (email) => {
        const forbidden = [
          'gmail.com',
          'outlook.com',
          'hotmail.com',
          'yahoo.com',
          'live.com',
          'icloud.com',
          'aol.com',
        ];
        const domain = email.split('@')[1];
        return !forbidden.includes(domain?.toLowerCase());
      },
      { message: 'Veuillez utiliser un email professionnel' }
    ),
  company: z.string().min(2, "Le nom de l'entreprise est requis"),
  actorType: z.string().min(1, 'Veuillez sélectionner votre profil'),
  message: z.string().min(10, 'Veuillez préciser votre besoin (min. 10 caractères)'),
  // Honeypot field - must be empty
  website: z.string().max(0, { message: 'Bot detected' }).optional(),
});

type DemoValues = z.infer<typeof demoSchema>;

export function DemoForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemoValues>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      actorType: '',
      message: '',
      website: '',
    },
  });

  async function onSubmit(data: DemoValues) {
    // Check honeypot manually just in case
    if (data.website) return;

    setIsSubmitting(true);

    try {
      // Simulation API Route call - Fluid UX (no page reload)
      await new Promise((resolve) => setTimeout(resolve, 1800));

      // Data is sent securely to the server (simulated)
      // We do NOT log the clear data on the client for production safety
      setIsSuccess(true);
    } catch (error) {
      console.error('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 md:p-14 text-center space-y-8 animate-in fade-in zoom-in duration-700 bg-white rounded-[40px] shadow-2xl border border-emerald-50">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25" />
          <div className="relative h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-[#0A2619] tracking-tight">Demande reçue !</h1>
          <p className="max-w-[320px] text-slate-500 font-medium leading-relaxed">
            Nous avons bien enregistré votre demande. Un expert AgriLogistic vous contactera sous{' '}
            <span className="text-primary font-bold">24h</span>.
          </p>
        </div>
        <div className="pt-4">
          <Button
            variant="ghost"
            onClick={() => setIsSuccess(false)}
            className="rounded-xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
          >
            Nouveau formulaire
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-8 md:p-12 rounded-[40px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-100/50 animate-fade-in-up relative overflow-hidden">
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-emerald-500 to-accent" />

      <div className="mb-10 space-y-2">
        <h2 className="text-3xl font-black text-[#0A2619] tracking-tight leading-tight">
          L'intelligence AgriLogistic,
          <br />
          <span className="text-primary italic">à votre service.</span>
        </h2>
        <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-[90%]">
          Rejoignez l'élite technologique agricole. Nos experts configurent votre environnement de
          test sous 24h.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Honeypot Field - Hidden from humans */}
        <div className="hidden" aria-hidden="true">
          <Input tabIndex={-1} {...register('website')} />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] ml-1"
            >
              Prénom
            </Label>
            <Input
              id="firstName"
              placeholder="Prénom"
              className={cn(
                'h-14 bg-slate-50/50 border-slate-200/60 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium',
                errors.firstName && 'border-red-300 bg-red-50/10 focus:ring-red-50'
              )}
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] ml-1"
            >
              Nom
            </Label>
            <Input
              id="lastName"
              placeholder="Nom"
              className={cn(
                'h-14 bg-slate-50/50 border-slate-200/60 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium',
                errors.lastName && 'border-red-300 bg-red-50/10 focus:ring-red-50'
              )}
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] ml-1"
          >
            Email Professionnel
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="nom.prenom@entreprise.com"
            className={cn(
              'h-14 bg-slate-50/50 border-slate-200/60 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium',
              errors.email && 'border-red-300 bg-red-50/10 focus:ring-red-50'
            )}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="company"
            className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] ml-1"
          >
            Organisation / Structure
          </Label>
          <Input
            id="company"
            placeholder="Nom de votre structure"
            className={cn(
              'h-14 bg-slate-50/50 border-slate-200/60 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium',
              errors.company && 'border-red-300 bg-red-50/10 focus:ring-red-50'
            )}
            {...register('company')}
          />
          {errors.company && (
            <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1">
              {errors.company.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="actorType"
            className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] ml-1"
          >
            Secteur d'activité
          </Label>
          <div className="relative">
            <select
              id="actorType"
              className={cn(
                'w-full h-14 px-5 rounded-2xl bg-slate-50/50 border border-slate-200/60 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all appearance-none',
                errors.actorType && 'border-red-300 bg-red-50/10 focus:ring-red-50'
              )}
              {...register('actorType')}
            >
              <option value="" disabled>
                Sélectionner votre secteur
              </option>
              <option value="buyer">Coopérative / Grossiste</option>
              <option value="transporter">Logistique / Transport</option>
              <option value="finance">Banque / Assurance</option>
              <option value="government">Gouvernement / Agence Public</option>
              <option value="industry">Industriel Agro-alimentaire</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          {errors.actorType && (
            <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1">
              {errors.actorType.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="message"
            className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] ml-1"
          >
            Votre Objectif
          </Label>
          <textarea
            id="message"
            rows={3}
            placeholder="Ex: Optimisation de la traçabilité pour l'export..."
            className={cn(
              'w-full p-5 rounded-2xl bg-slate-50/50 border border-slate-200/60 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all resize-none',
              errors.message && 'border-red-300 bg-red-50/10 focus:ring-red-50'
            )}
            {...register('message')}
          />
          {errors.message && (
            <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-[0_15px_30px_-5px_rgba(45,90,39,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_20px_40px_-5px_rgba(45,90,39,0.4)] active:scale-95 disabled:opacity-70 mt-4 group"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Envoi en cours...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Demander ma Démo</span>
              <Shield className="h-5 w-5 opacity-40 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
            </div>
          )}
        </Button>

        <div className="pt-6 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#0A2619]">
            RGPD COMPLIANT
          </p>
          <div className="h-3 w-px bg-slate-300" />
          <p className="text-[9px] font-black uppercase tracking-widest text-[#0A2619]">
            SSL SECURED
          </p>
          <div className="h-3 w-px bg-slate-300" />
          <p className="text-[9px] font-black uppercase tracking-widest text-[#0A2619]">
            DATA PRIVACY
          </p>
        </div>
      </form>
    </div>
  );
}
