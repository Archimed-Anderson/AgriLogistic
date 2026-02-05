import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AgriLogistic - Révolutionnez votre agriculture',
  description: "Plateforme IA & Blockchain pour la chaîne d'approvisionnement agricole",
};

// Note: We removed force-dynamic here to allow SEO on public pages (Landing/Blog).
// Dashboard pages remain dynamic via their respective layout.tsx files.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-jakarta antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
