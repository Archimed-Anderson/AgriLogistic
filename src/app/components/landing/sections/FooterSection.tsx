import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

import logoImg from '../../../assets/landing/story-1.webp';

interface FooterSectionProps {
  onNavigate: (route: string) => void;
}

export default function FooterSection({ onNavigate }: FooterSectionProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <img
                  src={logoImg}
                  alt="Logo AgroLogistic"
                  className="w-full h-full object-cover rounded-lg"
                  width={80}
                  height={80}
                  decoding="async"
                  loading="lazy"
                />
              </div>
              <span className="text-2xl font-bold">AgroLogistic</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              La plateforme qui connecte producteurs, acheteurs et transporteurs 
              pour une agriculture locale et durable.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-lg font-bold mb-4">Explorer</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onNavigate('/marketplace')}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                >
                  Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog')}
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/academy')}
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
