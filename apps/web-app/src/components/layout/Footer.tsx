'use client';

import Link from 'next/link';
import { Sprout, Facebook, Twitter, Linkedin, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-24 pb-12 border-t border-white/5">
      <div className="container px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg transition-transform hover:scale-110">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">AgriLogistic</span>
            </Link>
            <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-sm font-medium">
              L'écosystème AgTech leader en Afrique, unifiant la chaîne de valeur agricole par l'IA
              et la Blockchain depuis le champ jusqu'à l'assiette.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <a
                href="#"
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all hover:scale-110"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all hover:scale-110"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-lg font-black mb-8 border-b border-white/10 pb-2">Produits</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/solutions/core"
                  className="text-primary-foreground/60 hover:text-white transition-colors font-medium"
                >
                  AgriLogistic Core
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/farmers"
                  className="text-primary-foreground/60 hover:text-white transition-colors font-medium"
                >
                  AgriLogistic Farm
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/traceability"
                  className="text-primary-foreground/60 hover:text-white transition-colors font-medium"
                >
                  AgriLogistic Trace
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/analytics"
                  className="text-primary-foreground/60 hover:text-white transition-colors font-medium"
                >
                  AgriLogistic Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliation"
                  className="text-primary-foreground/60 hover:text-white transition-colors font-medium font-bold text-yellow-500"
                >
                  Boutique Partenaires
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black mb-8 border-b border-white/10 pb-2">Solutions</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/solutions/cooperatives"
                  className="text-primary-foreground/60 hover:text-white transition-colors font-medium"
                >
                  Coopératives
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/industrials"
                  className="text-primary-foreground/60 hover:text-white transition-colors font-medium"
                >
                  Industriels
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/governments"
                  className="text-primary-foreground/60 hover:text-white transition-colors font-medium"
                >
                  Gouvernements
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/finance"
                  className="text-primary-foreground/60 hover:text-white transition-colors font-medium"
                >
                  Finances & Assurances
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black mb-8 border-b border-white/10 pb-2">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-3 text-primary-foreground/60">
                <MapPin className="h-5 w-5 shrink-0 text-accent" />
                <span className="font-medium text-sm">Siège Social, Dakar, Sénégal</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/60">
                <Mail className="h-5 w-5 shrink-0 text-accent" />
                <span className="font-medium text-sm">contact@AgriLogistic.com</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/60">
                <Phone className="h-5 w-5 shrink-0 text-accent" />
                <span className="font-medium text-sm">+221 33 000 00 00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-primary-foreground/40 text-sm font-medium">
            &copy; {new Date().getFullYear()} AgriLogistic Technologies. Tous droits réservés.
          </p>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-primary-foreground/40">
            <Link href="/legal" className="hover:text-white transition-colors">
              Mentions Légales
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
