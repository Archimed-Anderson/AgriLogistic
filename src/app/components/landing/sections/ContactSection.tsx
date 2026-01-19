import { Mail, MessageSquare, User, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import contactImg from '../../../assets/landing/contact.webp';
import { apiClient } from '../../../../infrastructure/api/rest/api-client';
import { useCSRFToken } from '../../../../presentation/hooks/use-csrf-token';
import { trackEvent } from '../../../lib/analytics/ga';

export default function ContactSection() {
  // Initialise un token CSRF côté client (sera envoyé par apiClient)
  useCSRFToken();
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    // Honeypot (doit rester vide)
    company: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.message.trim().length < 10) {
        toast.error('Votre message est trop court (minimum 10 caractères).');
        return;
      }

      await apiClient.post('/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        company: formData.company, // honeypot
      });

      trackEvent(gaMeasurementId, 'contact_submit', { source: 'landing' });
      toast.success('Message envoyé avec succès! Nous vous répondrons dans les plus brefs délais.');
      setFormData({ name: '', email: '', subject: '', message: '', company: '' });
    } catch (error: any) {
      toast.error(error?.message || 'Erreur lors de l’envoi du message. Réessayez plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contactez-Nous
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une question ? Un projet ? N'hésitez pas à nous contacter, 
            notre équipe vous répondra rapidement.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left: Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px] bg-gradient-to-br from-green-100 to-emerald-200">
            <img
              src={contactImg}
              alt="Agriculteur utilisant une tablette pour gérer son exploitation"
              className="w-full h-full object-cover"
              width={900}
              height={1050}
              decoding="async"
              loading="lazy"
            />
          </div>

          {/* Right: Form */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot anti-spam (doit rester vide) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 bg-white"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 bg-white"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Sujet
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 bg-white"
                    placeholder="Objet de votre message"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 resize-none bg-white"
                  placeholder="Décrivez votre demande..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le message
                    <Send className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
