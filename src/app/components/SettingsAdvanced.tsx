import { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  CreditCard,
  Monitor,
  Keyboard,
  Zap,
  Smartphone,
  MapPin,
  X,
  Check,
  Download,
  Trash2,
  Copy,
  QrCode,
  Key,
  AlertTriangle,
  Mail,
  MessageSquare,
  TrendingUp,
  DollarSign,
  FileText,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export function SettingsAdvanced() {
  const [activeTab, setActiveTab] = useState('general');
  const [density, setDensity] = useState('comfortable');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');

  // Notifications matrix
  const [notifications, setNotifications] = useState({
    messages: { email: true, push: true, inApp: true },
    security: { email: true, push: true, inApp: false },
    promotions: { email: false, push: false, inApp: false },
  });

  const [silentHours, setSilentHours] = useState({ start: 22, end: 8 });

  // Mock data
  const activeSessions = [
    {
      id: '1',
      device: 'Chrome - Windows',
      location: 'Lyon, France',
      ip: '192.168.1.1',
      date: 'Il y a 2 minutes',
      current: true,
    },
    {
      id: '2',
      device: 'Safari - iPhone 14',
      location: 'Paris, France',
      ip: '92.154.23.45',
      date: 'Il y a 3 heures',
      current: false,
    },
    {
      id: '3',
      device: 'Firefox - MacBook Pro',
      location: 'Marseille, France',
      ip: '176.32.98.12',
      date: 'Il y a 2 jours',
      current: false,
    },
  ];

  const loginHistory = [
    { date: '10 Jan 2026, 14:32', ip: '192.168.1.1', location: 'Lyon, FR', status: 'success' },
    { date: '09 Jan 2026, 09:15', ip: '92.154.23.45', location: 'Paris, FR', status: 'success' },
    {
      date: '08 Jan 2026, 22:47',
      ip: '176.32.98.12',
      location: 'Marseille, FR',
      status: 'success',
    },
    { date: '07 Jan 2026, 18:20', ip: '45.67.89.123', location: 'Unknown', status: 'failed' },
  ];

  const backupCodes = [
    '8K9L-M3N4-P7Q2',
    'R5S6-T9U1-V4W8',
    'X2Y3-Z7A4-B1C9',
    'D6E8-F2G5-H3J7',
    'K1L9-M4N6-P8Q3',
    'R7S2-T5U9-V1W4',
    'X8Y6-Z3A1-B9C5',
    'D4E7-F1G8-H6J2',
    'K9L3-M7N2-P5Q8',
    'R4S1-T6U3-V9W7',
  ];

  const invoices = [
    { id: 'INV-001', date: '01 Jan 2026', amount: 49.99, status: 'paid' },
    { id: 'INV-002', date: '01 Déc 2025', amount: 49.99, status: 'paid' },
    { id: 'INV-003', date: '01 Nov 2025', amount: 49.99, status: 'paid' },
  ];

  const shortcuts = [
    { key: 'Ctrl + K', action: 'Recherche rapide' },
    { key: 'Ctrl + N', action: 'Nouveau produit' },
    { key: 'Ctrl + S', action: 'Sauvegarder' },
    { key: 'Ctrl + /', action: 'Raccourcis clavier' },
  ];

  const handleTerminateSession = (sessionId: string) => {
    toast.success('Session terminée');
  };

  const handleEnable2FA = () => {
    setShow2FASetup(true);
    setTwoFactorStep(1);
  };

  const handleNextStep = () => {
    if (twoFactorStep < 4) {
      setTwoFactorStep(twoFactorStep + 1);
    } else {
      setTwoFactorEnabled(true);
      setShow2FASetup(false);
      toast.success('Authentification à deux facteurs activée');
    }
  };

  const handleDownloadCodes = () => {
    toast.success('Codes de secours téléchargés');
  };

  const handleToggleNotification = (type: string, channel: string) => {
    setNotifications({
      ...notifications,
      [type]: {
        ...notifications[type as keyof typeof notifications],
        [channel]:
          !notifications[type as keyof typeof notifications][
            channel as keyof typeof notifications.messages
          ],
      },
    });
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Facturation', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos préférences et la sécurité de votre compte
        </p>
      </div>

      {/* Tabs Layout */}
      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-card border rounded-lg p-2 sticky top-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id ? 'bg-[#2563eb] text-white' : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <>
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Densité d'affichage</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'compact', label: 'Compact', desc: "Plus d'infos à l'écran" },
                    { value: 'comfortable', label: 'Confortable', desc: 'Équilibré' },
                    { value: 'spacious', label: 'Espacé', desc: "Plus d'espace" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDensity(option.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        density === option.value
                          ? 'border-[#2563eb] bg-[#2563eb]/10'
                          : 'hover:border-muted-foreground'
                      }`}
                    >
                      <div className="font-medium mb-1">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Keyboard className="h-5 w-5 text-[#2563eb]" />
                  Raccourcis clavier
                </h2>
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <span className="text-sm">{shortcut.action}</span>
                      <kbd className="px-3 py-1 bg-muted border rounded text-xs font-mono">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#2563eb]" />
                  Performance
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Qualité des images</div>
                      <div className="text-sm text-muted-foreground">
                        Ajuster pour une meilleure performance
                      </div>
                    </div>
                    <select className="px-3 py-2 border rounded-lg bg-background">
                      <option>Haute</option>
                      <option>Moyenne</option>
                      <option>Basse</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Cache navigateur</div>
                      <div className="text-sm text-muted-foreground">
                        Stocker des données localement
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2563eb]/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2563eb]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <>
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Authentification à deux facteurs</h2>

                {!twoFactorEnabled ? (
                  <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
                    <Shield className="h-6 w-6 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Sécurisez votre compte
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                        Ajoutez une couche de sécurité supplémentaire avec l'authentification à deux
                        facteurs.
                      </p>
                      <button
                        onClick={handleEnable2FA}
                        className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
                      >
                        Activer 2FA
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Check className="h-6 w-6 text-green-600 mt-1" />
                    <div className="flex-1">
                      <div className="font-medium text-green-900 dark:text-green-100 mb-1">
                        2FA Activée
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Votre compte est protégé par l'authentification à deux facteurs.
                      </p>
                    </div>
                    <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/40 transition-colors">
                      Désactiver
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Sessions actives</h2>
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <Smartphone className="h-5 w-5 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{session.device}</span>
                          {session.current && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">
                              Session actuelle
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            {session.location}
                          </div>
                          <div>IP: {session.ip}</div>
                          <div>{session.date}</div>
                        </div>
                      </div>
                      {!session.current && (
                        <button
                          onClick={() => handleTerminateSession(session.id)}
                          className="px-3 py-1.5 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Terminer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Historique des connexions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">IP</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Localisation</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginHistory.map((entry, index) => (
                        <tr key={index} className="border-b last:border-b-0 hover:bg-muted/50">
                          <td className="px-4 py-3 text-sm">{entry.date}</td>
                          <td className="px-4 py-3 text-sm font-mono">{entry.ip}</td>
                          <td className="px-4 py-3 text-sm">{entry.location}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                entry.status === 'success'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}
                            >
                              {entry.status === 'success' ? 'Réussie' : 'Échouée'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <>
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Préférences de notification</h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">
                          <Mail className="h-4 w-4 mx-auto" />
                          <div className="text-xs">Email</div>
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium">
                          <Smartphone className="h-4 w-4 mx-auto" />
                          <div className="text-xs">Push</div>
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium">
                          <MessageSquare className="h-4 w-4 mx-auto" />
                          <div className="text-xs">In-App</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: 'messages', label: 'Messages' },
                        { key: 'security', label: 'Sécurité' },
                        { key: 'promotions', label: 'Promotions' },
                      ].map((type) => (
                        <tr key={type.key} className="border-b last:border-b-0">
                          <td className="px-4 py-4 font-medium">{type.label}</td>
                          {['email', 'push', 'inApp'].map((channel) => (
                            <td key={channel} className="px-4 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={
                                  notifications[type.key as keyof typeof notifications][
                                    channel as keyof typeof notifications.messages
                                  ]
                                }
                                onChange={() => handleToggleNotification(type.key, channel)}
                                className="h-5 w-5 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Période de silence</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Définissez les heures pendant lesquelles vous ne souhaitez pas recevoir de
                  notifications
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">Début</label>
                      <input
                        type="time"
                        value={`${silentHours.start.toString().padStart(2, '0')}:00`}
                        onChange={(e) => {
                          const hours = parseInt(e.target.value.split(':')[0]);
                          setSilentHours({ ...silentHours, start: hours });
                        }}
                        className="w-full px-4 py-2 border rounded-lg bg-background"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">Fin</label>
                      <input
                        type="time"
                        value={`${silentHours.end.toString().padStart(2, '0')}:00`}
                        onChange={(e) => {
                          const hours = parseInt(e.target.value.split(':')[0]);
                          setSilentHours({ ...silentHours, end: hours });
                        }}
                        className="w-full px-4 py-2 border rounded-lg bg-background"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Clock className="h-5 w-5 text-[#2563eb] mb-2" />
                    <div className="text-sm">
                      Les notifications seront silencieuses de <strong>{silentHours.start}h</strong>{' '}
                      à <strong>{silentHours.end}h</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Aperçu notification</h2>
                <div className="border rounded-lg p-4 max-w-md">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-[#2563eb] rounded-full flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">AgroLogistic</span>
                        <span className="text-xs text-muted-foreground">Il y a 2 min</span>
                      </div>
                      <p className="text-sm">Vous avez reçu un nouveau message</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <>
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Moyen de paiement</h2>

                <div className="bg-gradient-to-r from-[#2563eb] to-blue-600 rounded-xl p-6 text-white mb-4">
                  <div className="flex justify-between items-start mb-8">
                    <CreditCard className="h-8 w-8" />
                    <span className="text-sm">Visa</span>
                  </div>
                  <div className="space-y-4">
                    <div className="font-mono text-xl tracking-wider">•••• •••• •••• 4242</div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <div className="text-xs opacity-75">Titulaire</div>
                        <div>Admin User</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-75">Expire</div>
                        <div>12/27</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                    Modifier
                  </button>
                  <button className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Utilisation</h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Stockage utilisé</span>
                      <span className="font-medium">85 Go / 100 Go</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-[#2563eb] w-[85%]"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-[#2563eb]" />
                      <div className="text-2xl font-bold">1,234</div>
                      <div className="text-xs text-muted-foreground">Transactions</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <FileText className="h-6 w-6 mx-auto mb-2 text-[#2563eb]" />
                      <div className="text-2xl font-bold">567</div>
                      <div className="text-xs text-muted-foreground">Documents</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <DollarSign className="h-6 w-6 mx-auto mb-2 text-[#2563eb]" />
                      <div className="text-2xl font-bold">49.99€</div>
                      <div className="text-xs text-muted-foreground">Abonnement</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Historique des factures</h2>
                  <button className="text-sm text-[#2563eb] hover:underline">Voir tout</button>
                </div>

                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{invoice.id}</div>
                          <div className="text-sm text-muted-foreground">{invoice.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">{invoice.amount}€</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">
                          Payé
                        </span>
                        <button className="p-2 hover:bg-muted rounded transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FASetup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b">
              <h2 className="text-2xl font-bold">Configuration 2FA</h2>
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2 flex-1 rounded-full ${
                      step <= twoFactorStep ? 'bg-[#2563eb]' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-6">
              {twoFactorStep === 1 && (
                <div className="text-center space-y-4">
                  <Shield className="h-16 w-16 mx-auto text-[#2563eb]" />
                  <h3 className="text-xl font-semibold">Choisissez votre méthode</h3>
                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {[
                      { value: 'app', label: 'Application', icon: Smartphone },
                      { value: 'sms', label: 'SMS', icon: MessageSquare },
                      { value: 'email', label: 'Email', icon: Mail },
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.value}
                          className="p-6 border-2 rounded-lg hover:border-[#2563eb] transition-all"
                        >
                          <Icon className="h-8 w-8 mx-auto mb-2" />
                          <div className="font-medium">{method.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {twoFactorStep === 2 && (
                <div className="text-center space-y-6">
                  <h3 className="text-xl font-semibold">Scannez le QR code</h3>
                  <div className="bg-white p-8 rounded-lg inline-block">
                    <QrCode className="h-48 w-48 text-gray-900" />
                  </div>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Utilisez une application d'authentification comme Google Authenticator ou Authy
                    pour scanner ce code
                  </p>
                </div>
              )}

              {twoFactorStep === 3 && (
                <div className="text-center space-y-6">
                  <h3 className="text-xl font-semibold">Entrez le code de vérification</h3>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Entrez le code à 6 chiffres de votre application
                  </p>
                </div>
              )}

              {twoFactorStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-center">Codes de secours</h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Sauvegardez ces codes en lieu sûr. Chaque code ne peut être utilisé qu'une
                        fois.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 font-mono text-sm bg-muted p-6 rounded-lg">
                    {backupCodes.map((code, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-muted-foreground">{i + 1}.</span>
                        <span>{code}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleDownloadCodes}
                    className="w-full px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger les codes
                  </button>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t flex justify-between">
              <button
                onClick={() => {
                  if (twoFactorStep === 1) {
                    setShow2FASetup(false);
                  } else {
                    setTwoFactorStep(twoFactorStep - 1);
                  }
                }}
                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                {twoFactorStep === 1 ? 'Annuler' : 'Retour'}
              </button>
              <button
                onClick={handleNextStep}
                className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                {twoFactorStep === 4 ? 'Terminer' : 'Suivant'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
