import { useState } from 'react';
import { ArrowRight, MapPin, Mail, Phone, Check } from 'lucide-react';
import FooterSection from '../sections/FooterSection';

/**
 * DemoInteractivePage - Clone of https://www.cropin.com/request-a-demo
 * Route: /demo ("Nos Logiciels" > "Démo interactive")
 *
 * Design Tokens:
 * - Hero BG: #002C17 (Dark Forest Green)
 * - Highlight: #79C25C (Lime Green)
 * - Form BG: #28343F (Dark Blue-Grey)
 * - Font: Montserrat (Headings), Open Sans (Body)
 */

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  region: string;
  jobRole: string;
  solutions: string[];
}

const solutionsOptions = [
  'Digitization (Numérisation)',
  'Digital Transformation (Transformation Numérique)',
  'Agri-intelligence',
  'Farmer Empowerment (Autonomisation)',
  'Sustainability (Durabilité)',
  'EUDR Compliance (Conformité EUDR)',
];

export function DemoInteractivePage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    region: '',
    jobRole: '',
    solutions: [],
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSolution = (solution: string) => {
    setFormData((prev) => {
      const exists = prev.solutions.includes(solution);
      return {
        ...prev,
        solutions: exists
          ? prev.solutions.filter((s) => s !== solution)
          : [...prev.solutions, solution],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    setSubmitted(true);
    // Here you would typically send data to backend
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6"
        style={{
          background: 'linear-gradient(180deg, #002C17 0%, #001a0e 100%)',
          color: 'white',
        }}
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="lg:sticky lg:top-32">
            <h5 className="text-[#79C25C] font-bold tracking-wider mb-4 uppercase text-sm">
              DEMANDEZ UNE DÉMO
            </h5>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-8">
              Planifiez une démo sans engagement sur nos solutions{' '}
              <span className="text-[#79C25C]">agri-tech intelligentes</span>
            </h1>

            <div className="space-y-8 mt-12">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#79C25C]/20 flex items-center justify-center shrink-0">
                  <Check className="text-[#79C25C]" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Pourquoi choisir AgroLogistic ?</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Nous permettons aux entreprises agricoles de numériser leurs opérations,
                    d'obtenir des informations exploitables et de prendre des décisions basées sur
                    les données.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#79C25C]/20 flex items-center justify-center shrink-0">
                  <Check className="text-[#79C25C]" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Impact Mesurable</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Augmentez la productivité, réduisez les coûts et assurez la durabilité de votre
                    chaîne de valeur.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div
            className="rounded-xl p-8 lg:p-10 shadow-2xl relative overflow-hidden"
            style={{ backgroundColor: '#28343F' }}
          >
            {submitted ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[#79C25C] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Merci pour votre intérêt !</h3>
                <p className="text-gray-300 mb-8">
                  Un de nos experts agri-tech vous contactera dans les plus brefs délais pour
                  planifier votre démo personnalisée.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[#79C25C] hover:underline font-semibold"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Parlez à nos experts & découvrez comment AgroLogistic peut vous aider
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:border-[#79C25C] focus:ring-1 focus:ring-[#79C25C] outline-none transition-colors"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Nom *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:border-[#79C25C] focus:ring-1 focus:ring-[#79C25C] outline-none transition-colors"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Email Professionnel *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:border-[#79C25C] focus:ring-1 focus:ring-[#79C25C] outline-none transition-colors"
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:border-[#79C25C] focus:ring-1 focus:ring-[#79C25C] outline-none transition-colors"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">
                      Région *
                    </label>
                    <select
                      name="region"
                      required
                      className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:border-[#79C25C] focus:ring-1 focus:ring-[#79C25C] outline-none transition-colors"
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="emea">Europe, Moyen-Orient & Afrique</option>
                      <option value="apac">Asie-Pacifique</option>
                      <option value="americas">Amériques</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Rôle *</label>
                    <select
                      name="jobRole"
                      required
                      className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:border-[#79C25C] focus:ring-1 focus:ring-[#79C25C] outline-none transition-colors"
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="cxo">PDG / Direction</option>
                      <option value="manager">Manager / Chef de projet</option>
                      <option value="consultant">Consultant</option>
                      <option value="farmer">Agriculteur / Producteur</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-300">
                    Je suis intéressé par (Plusieurs choix possibles)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {solutionsOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => toggleSolution(option)}
                        className={`
                          cursor-pointer p-3 rounded border text-sm transition-all duration-200 flex items-center gap-2
                          ${
                            formData.solutions.includes(option)
                              ? 'bg-[#79C25C]/20 border-[#79C25C] text-white'
                              : 'bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10'
                          }
                        `}
                      >
                        <div
                          className={`
                          w-5 h-5 rounded flex items-center justify-center border
                          ${
                            formData.solutions.includes(option)
                              ? 'bg-[#79C25C] border-[#79C25C]'
                              : 'border-gray-500'
                          }
                        `}
                        >
                          {formData.solutions.includes(option) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        {option}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 rounded font-bold text-lg text-black transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                    style={{ backgroundColor: '#79C25C' }}
                  >
                    SOUMETTRE
                  </button>
                  <p className="text-xs text-gray-400 mt-4 text-center">
                    En soumettant ce formulaire, vous acceptez notre politique de confidentialité et
                    nos conditions d'utilisation.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Regional Contact Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Nos Bureaux Régionaux</h2>
            <div className="w-20 h-1 bg-[#79C25C] mx-auto mt-6"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* EMEA Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#79C25C]">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <MapPin className="text-[#79C25C]" />
                EMEA & Afrique
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>AgroLogistic HQ</strong>
                  <br />
                  123 Avenue de l'Innovation
                  <br />
                  75001 Paris, France
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <Mail className="w-5 h-5 text-[#79C25C]" />
                  <a href="mailto:emea@agrologistic.com" className="hover:text-[#79C25C]">
                    emea@agrologistic.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#79C25C]" />
                  <a href="tel:+33123456789" className="hover:text-[#79C25C]">
                    +33 1 23 45 67 89
                  </a>
                </div>
              </div>
            </div>

            {/* APAC/India Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#79C25C]">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <MapPin className="text-[#79C25C]" />
                Afrique de l'Ouest
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Bureau régional</strong>
                  <br />
                  Quartier Plateau, Immeuble Horizon
                  <br />
                  Abidjan, Côte d'Ivoire
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <Mail className="w-5 h-5 text-[#79C25C]" />
                  <a href="mailto:africa@agrologistic.com" className="hover:text-[#79C25C]">
                    africa@agrologistic.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#79C25C]" />
                  <a href="tel:+22501020304" className="hover:text-[#79C25C]">
                    +225 01 02 03 04
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
