/**
 * Buyer Settings Page
 * Profile, notifications, and preferences management
 */
'use client';

import React, { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Smartphone,
  Mail,
  Building,
  MapPin,
  Camera,
  Save,
  Check,
  Toggle,
} from 'lucide-react';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const defaultNotifications: NotificationSetting[] = [
  { id: 'orders', label: 'Commandes', description: 'Mises à jour sur vos commandes', email: true, push: true, sms: false },
  { id: 'deliveries', label: 'Livraisons', description: 'Alertes de livraison et tracking', email: true, push: true, sms: true },
  { id: 'prices', label: 'Prix', description: 'Alertes de baisse de prix', email: true, push: true, sms: false },
  { id: 'quality', label: 'Qualité', description: 'Rapports d\'inspection', email: true, push: false, sms: false },
  { id: 'community', label: 'Communauté', description: 'Nouvelles discussions et réponses', email: false, push: true, sms: false },
];

export default function BuyerSettingsPage() {
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'security' | 'preferences'>('profile');
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleNotification = (id: string, channel: 'email' | 'push' | 'sms') => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, [channel]: !n[channel] } : n
      )
    );
  };

  const sections = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'preferences', label: 'Préférences', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
          <p className="text-slate-600">Gérez votre compte et préférences</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-amber-500 text-white hover:bg-amber-600'
          }`}
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as typeof activeSection)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Informations personnelles</h3>
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-3xl font-bold text-amber-700">
                      AC
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Acheteur Pro</h4>
                    <p className="text-slate-500">Premium</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom complet</label>
                    <input
                      type="text"
                      defaultValue="Amadou Diallo"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="buyer@agrologic.sn"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      defaultValue="+221 77 123 45 67"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Langue</label>
                    <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm">
                      <option>Français</option>
                      <option>English</option>
                      <option>Wolof</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <Building className="w-5 h-5 text-amber-500" />
                  Informations entreprise
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'entreprise</label>
                    <input
                      type="text"
                      defaultValue="Restaurant Le Teranga"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">NINEA</label>
                    <input
                      type="text"
                      defaultValue="005847125 2C3"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Adresse</label>
                    <input
                      type="text"
                      defaultValue="123 Rue Félix Faure, Plateau, Dakar"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Préférences de notifications</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Type</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">
                        <Mail className="w-4 h-4 inline" /> Email
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">
                        <Bell className="w-4 h-4 inline" /> Push
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">
                        <Smartphone className="w-4 h-4 inline" /> SMS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((notif) => (
                      <tr key={notif.id} className="border-b border-slate-100">
                        <td className="py-4 px-4">
                          <p className="font-medium text-slate-900">{notif.label}</p>
                          <p className="text-sm text-slate-500">{notif.description}</p>
                        </td>
                        <td className="text-center py-4 px-4">
                          <button
                            onClick={() => toggleNotification(notif.id, 'email')}
                            className={`w-10 h-6 rounded-full transition-colors ${
                              notif.email ? 'bg-amber-500' : 'bg-slate-200'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                                notif.email ? 'translate-x-4' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="text-center py-4 px-4">
                          <button
                            onClick={() => toggleNotification(notif.id, 'push')}
                            className={`w-10 h-6 rounded-full transition-colors ${
                              notif.push ? 'bg-amber-500' : 'bg-slate-200'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                                notif.push ? 'translate-x-4' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="text-center py-4 px-4">
                          <button
                            onClick={() => toggleNotification(notif.id, 'sms')}
                            className={`w-10 h-6 rounded-full transition-colors ${
                              notif.sms ? 'bg-amber-500' : 'bg-slate-200'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                                notif.sms ? 'translate-x-4' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Mot de passe</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe actuel</label>
                    <input type="password" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nouveau mot de passe</label>
                    <input type="password" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirmer le mot de passe</label>
                    <input type="password" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" />
                  </div>
                  <button className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600">
                    Mettre à jour
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Authentification à deux facteurs</h3>
                <p className="text-slate-600 mb-4">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600">
                  Activer 2FA
                </button>
              </div>
            </div>
          )}

          {/* Preferences Section */}
          {activeSection === 'preferences' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Préférences d'affichage</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Mode sombre</p>
                    <p className="text-sm text-slate-500">Activer le thème sombre</p>
                  </div>
                  <button className="w-10 h-6 bg-slate-200 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-0.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Devise par défaut</p>
                    <p className="text-sm text-slate-500">Devise utilisée pour l'affichage des prix</p>
                  </div>
                  <select className="px-4 py-2 border border-slate-200 rounded-xl text-sm">
                    <option>FCFA (XOF)</option>
                    <option>EUR (€)</option>
                    <option>USD ($)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Fuseau horaire</p>
                    <p className="text-sm text-slate-500">Pour les dates et heures</p>
                  </div>
                  <select className="px-4 py-2 border border-slate-200 rounded-xl text-sm">
                    <option>Africa/Dakar (GMT+0)</option>
                    <option>Europe/Paris (GMT+1)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
