import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';



interface FooterSectionProps {
  onNavigate?: (route: string) => void;
}

export default function FooterSection({ onNavigate }: FooterSectionProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 shadow-lg shadow-emerald-900/20 overflow-hidden">
                <img
                  src="/images/branding/logo.png"
                  alt="Logo AgroLogistic"
                  className="w-full h-full object-contain transform scale-125"
                  width={48}
                  height={48}
                  decoding="async"
                  loading="lazy"
                />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                AgroLogistic
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-8 text-sm">
              La plateforme de confiance qui connecte producteurs, acheteurs et transporteurs 
              pour une agriculture locale, durable et rentable.
            </p>
            {/* Social Media */}
            <div className="flex gap-4">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Linkedin, label: 'LinkedIn' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-10 h-10 bg-gray-800/50 hover:bg-emerald-600/90 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group border border-gray-700 hover:border-emerald-500"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-lg font-bold mb-4">Explorer</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onNavigate?.('/marketplace')}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                >
                  Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('/blog')}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('/academy')}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                >
                  Academy
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                >
                  À propos
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  E-commerce
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  IoT Monitoring
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Farming
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Agriculture Durable
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Rue de l'Agriculture<br />
                  75001 Paris, France
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <a href="tel:+33123456789" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <a href="mailto:contact@AgroLogistic.com" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  contact@AgroLogistic.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} AgroLogistic. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-300">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-300">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-300">
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
