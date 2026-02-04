import { useState, useRef, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Palette,
  Users,
  Bell,
  CreditCard,
  Shield,
  Code,
  FileText,
  Upload,
  X,
  Copy,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ChevronRight,
  Globe,
  Lock,
  Smartphone,
  Monitor,
  Database,
  Activity,
  UserCheck,
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface SettingsProps {
  isClientView?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  adminOnly?: boolean;
}

export function Settings({ isClientView = false }: SettingsProps) {
  // Navigation
  const [activeSection, setActiveSection] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // General Settings
  const [platformName, setPlatformName] = useState('AgroLogistic Pro');
  const [timezone, setTimezone] = useState('Europe/Paris');
  const [currency, setCurrency] = useState('EUR');
  const [unitSystem, setUnitSystem] = useState('metric');

  // Appearance Settings
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [themeMode, setThemeMode] = useState('light');
  const [customCSS, setCustomCSS] = useState('');

  // Security Settings
  const [force2FA, setForce2FA] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('medium');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState('sk_live_4242424242424242');

  // Notifications
  const [notifications, setNotifications] = useState({
    newOrder: { email: true, inApp: true },
    deliveryDelay: { email: true, inApp: true },
    lowStock: { email: false, inApp: true },
    newUser: { email: true, inApp: false },
  });

  // Modals
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  // Refs for scrolling
  const generalRef = useRef<HTMLDivElement>(null);
  const appearanceRef = useRef<HTMLDivElement>(null);
  const usersRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const billingRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<HTMLDivElement>(null);
  const auditRef = useRef<HTMLDivElement>(null);
  const governanceRef = useRef<HTMLDivElement>(null);
  const rgpdRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { id: 'general', label: 'Général', icon: SettingsIcon },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'users', label: 'Utilisateurs & Rôles', icon: Users, adminOnly: true },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: isClientView ? 'Compte' : 'Facturation', icon: CreditCard },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'governance', label: 'Data Governance', icon: Database, adminOnly: true },
    { id: 'audit', label: 'Audit Trails', icon: Activity, adminOnly: true },
    { id: 'rgpd', label: 'RGPD Compliance', icon: UserCheck, adminOnly: true },
    { id: 'api', label: 'API & Intégrations', icon: Code, adminOnly: true },
  ];

  const visibleNavItems = isClientView ? navItems.filter((item) => !item.adminOnly) : navItems;

  const scrollToSection = (sectionId: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      general: generalRef,
      appearance: appearanceRef,
      users: usersRef,
      notifications: notificationsRef,
      billing: billingRef,
      security: securityRef,
      api: apiRef,
      audit: auditRef,
      governance: governanceRef,
      rgpd: rgpdRef,
    };

    const ref = refs[sectionId];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveSection(sectionId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simuler une sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSaving(false);
    setHasChanges(false);
    toast.success('Paramètres enregistrés avec succès');
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('Clé API copiée dans le presse-papier');
  };

  const handleRegenerateApiKey = () => {
    setShowRegenerateModal(false);
    toast.success('Nouvelle clé API générée');
  };

  const predefinedColors = [
    { name: 'Bleu AgroLogistic', value: '#2563eb' },
    { name: 'Vert Nature', value: '#10b981' },
    { name: 'Orange Récolte', value: '#f97316' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Rose', value: '#ec4899' },
  ];

  const activeSessions = [
    {
      device: 'Chrome • Windows',
      location: 'Paris, France',
      lastActive: 'Maintenant',
      current: true,
    },
    {
      device: 'Safari • iPhone',
      location: 'Lyon, France',
      lastActive: 'Il y a 2h',
      current: false,
    },
    {
      device: 'Firefox • MacOS',
      location: 'Bordeaux, France',
      lastActive: 'Il y a 1j',
      current: false,
    },
  ];

  const auditLogs = [
    {
      date: '10/01/2026 15:30',
      user: 'Pierre Moreau',
      action: 'Modifié les paramètres de livraison',
      ip: '192.168.1.1',
    },
    {
      date: '10/01/2026 14:15',
      user: 'Sophie Laurent',
      action: 'Connexion depuis un nouvel appareil',
      ip: '192.168.1.45',
    },
    { date: '10/01/2026 10:22', user: 'Admin', action: 'Régénéré la clé API', ip: '192.168.1.1' },
    {
      date: '09/01/2026 18:45',
      user: 'Jean Dupont',
      action: 'Modifié les rôles utilisateurs',
      ip: '192.168.1.78',
    },
  ];

  const invoices = [
    { id: 'INV-2026-001', date: '01/01/2026', amount: '299€', status: 'Payée' },
    { id: 'INV-2025-012', date: '01/12/2025', amount: '299€', status: 'Payée' },
    { id: 'INV-2025-011', date: '01/11/2025', amount: '299€', status: 'Payée' },
  ];

  return (
    <div className="flex gap-6">
      {/* Left Navigation Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-6 bg-card border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Paramètres</h2>
          <nav className="space-y-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#2563eb] text-white'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* General Settings */}
        <div ref={generalRef} className="scroll-mt-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Général</h1>
            <p className="text-muted-foreground">
              Configurez les paramètres principaux de votre plateforme
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nom de la Plateforme</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => {
                  setPlatformName(e.target.value);
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Logo de l'Application</label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-[#2563eb] transition-colors cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">
                  Glissez-déposez votre logo ici ou cliquez pour parcourir
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG ou SVG (max. 2MB)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fuseau Horaire</label>
                <select
                  value={timezone}
                  onChange={(e) => {
                    setTimezone(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                >
                  <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                  <option value="America/New_York">America/New York (GMT-5)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Devise Par Défaut</label>
                <select
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                >
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">Dollar US (USD)</option>
                  <option value="GBP">Livre Sterling (GBP)</option>
                  <option value="JPY">Yen Japonais (JPY)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Unités de Mesure</label>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setUnitSystem('metric');
                    setHasChanges(true);
                  }}
                  className={`flex-1 px-4 py-3 border rounded-lg transition-colors ${
                    unitSystem === 'metric'
                      ? 'border-[#2563eb] bg-[#2563eb]/10 text-[#2563eb]'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="font-medium">Système Métrique</div>
                  <div className="text-xs text-muted-foreground">Kilogrammes, Mètres, Litres</div>
                </button>
                <button
                  onClick={() => {
                    setUnitSystem('imperial');
                    setHasChanges(true);
                  }}
                  className={`flex-1 px-4 py-3 border rounded-lg transition-colors ${
                    unitSystem === 'imperial'
                      ? 'border-[#2563eb] bg-[#2563eb]/10 text-[#2563eb]'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="font-medium">Système Impérial</div>
                  <div className="text-xs text-muted-foreground">Livres, Pieds, Gallons</div>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  hasChanges && !isSaving
                    ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer les Modifications'}
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div ref={appearanceRef} className="scroll-mt-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Apparence</h1>
            <p className="text-muted-foreground">
              Personnalisez le thème et le branding de votre plateforme
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border rounded-lg p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Couleur Principale</label>
                <div className="flex gap-3 mb-3">
                  {predefinedColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        setPrimaryColor(color.value);
                        setHasChanges(true);
                      }}
                      className={`h-12 w-12 rounded-lg transition-all ${
                        primaryColor === color.value
                          ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => {
                      setPrimaryColor(e.target.value);
                      setHasChanges(true);
                    }}
                    className="h-10 w-20 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => {
                      setPrimaryColor(e.target.value);
                      setHasChanges(true);
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Mode de Thème</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Clair', icon: Globe },
                    { value: 'dark', label: 'Sombre', icon: Monitor },
                    { value: 'auto', label: 'Automatique', icon: Smartphone },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.value}
                        onClick={() => {
                          setThemeMode(mode.value);
                          setHasChanges(true);
                        }}
                        className={`px-4 py-3 border rounded-lg transition-colors flex flex-col items-center gap-2 ${
                          themeMode === mode.value
                            ? 'border-[#2563eb] bg-[#2563eb]/10 text-[#2563eb]'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">CSS Personnalisé (Avancé)</label>
                  <button
                    onClick={() => {
                      setCustomCSS('');
                      setHasChanges(true);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Réinitialiser
                  </button>
                </div>
                <textarea
                  value={customCSS}
                  onChange={(e) => {
                    setCustomCSS(e.target.value);
                    setHasChanges(true);
                  }}
                  placeholder="/* Votre CSS personnalisé */&#10;.custom-button {&#10;  border-radius: 8px;&#10;}"
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background font-mono text-sm resize-none"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Email Branding</h3>
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">En-tête personnalisé</span>
                    <button className="text-xs text-[#2563eb] hover:underline">Modifier</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pied de page</span>
                    <button className="text-xs text-[#2563eb] hover:underline">Modifier</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Couleur des boutons</span>
                    <div
                      className="h-6 w-16 rounded border"
                      style={{ backgroundColor: primaryColor }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    hasChanges && !isSaving
                      ? 'text-white hover:opacity-90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                  style={{
                    backgroundColor: hasChanges && !isSaving ? primaryColor : undefined,
                  }}
                >
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-sm font-semibold mb-4">Aperçu</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-3 bg-background">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded" style={{ backgroundColor: primaryColor }} />
                    <span className="font-semibold">{platformName}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-muted rounded w-3/4" />
                    <div className="h-2 bg-muted rounded w-1/2" />
                  </div>
                  <button
                    className="w-full mt-3 py-2 rounded text-white text-sm font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Bouton Principal
                  </button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Navbar avec nouveau logo</p>
                  <p>• Boutons avec couleur personnalisée</p>
                  <p>
                    • Thème :{' '}
                    {themeMode === 'light' ? 'Clair' : themeMode === 'dark' ? 'Sombre' : 'Auto'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users & Roles (Admin only) */}
        {!isClientView && (
          <div ref={usersRef} className="scroll-mt-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">Utilisateurs & Rôles</h1>
              <p className="text-muted-foreground">
                Gérez les permissions et les politiques utilisateurs
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rôle par Défaut des Nouveaux Utilisateurs
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background">
                    <option value="client">Client</option>
                    <option value="vendeur">Vendeur</option>
                    <option value="livreur">Livreur</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-medium mb-2">
                    Gestionnaire de Rôles Avancé
                  </label>
                  <button
                    onClick={() => setShowRoleModal(true)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Gérer les Rôles
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Modération des Inscriptions</p>
                    <p className="text-sm text-muted-foreground">
                      Activer l'approbation manuelle des nouveaux vendeurs
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2563eb]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Invitations</p>
                    <p className="text-sm text-muted-foreground">
                      Autoriser les utilisateurs à inviter des membres
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2563eb]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        <div ref={notificationsRef} className="scroll-mt-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Configurez vos préférences de notifications</p>
          </div>

          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">Événement</th>
                    <th className="px-6 py-3 text-center text-sm font-medium">Email</th>
                    <th className="px-6 py-3 text-center text-sm font-medium">
                      Notification In-App
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-6 py-4">
                      <div className="font-medium">Nouvelle Commande</div>
                      <div className="text-sm text-muted-foreground">
                        Quand une nouvelle commande est créée
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <div className="font-medium">Retard de Livraison</div>
                      <div className="text-sm text-muted-foreground">
                        Alerte en cas de retard détecté
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <div className="font-medium">Stock Faible</div>
                      <div className="text-sm text-muted-foreground">
                        Quand un produit atteint le seuil minimum
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <div className="font-medium">Nouvel Utilisateur</div>
                      <div className="text-sm text-muted-foreground">
                        Quand un utilisateur s'inscrit
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-muted/30 border-t flex gap-3">
              <button className="px-4 py-2 text-sm border rounded-lg hover:bg-background transition-colors">
                Tout Désactiver
              </button>
              <button className="px-4 py-2 text-sm border rounded-lg hover:bg-background transition-colors">
                Rétablir les Paramètres par Défaut
              </button>
            </div>
          </div>
        </div>

        {/* Billing / Account */}
        <div ref={billingRef} className="scroll-mt-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">
              {isClientView ? 'Compte' : 'Facturation & Abonnement'}
            </h1>
            <p className="text-muted-foreground">
              {isClientView
                ? 'Gérez vos méthodes de paiement'
                : 'Gérez votre abonnement et vos factures'}
            </p>
          </div>

          <div className="space-y-4">
            {!isClientView && (
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Plan Entreprise</h3>
                    <p className="text-sm text-muted-foreground">
                      Pour les équipes professionnelles et entreprises
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">499€</div>
                    <div className="text-sm text-muted-foreground">par mois</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors">
                    Gérer l'Abonnement
                  </button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                    Changer de Plan
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t text-sm">
                  <p className="text-muted-foreground">
                    Prochain renouvellement :{' '}
                    <span className="font-medium text-foreground">25 janvier 2026</span>
                  </p>
                </div>
              </div>
            )}

            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Méthodes de Paiement</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Visa •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expire 12/2026</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-muted-foreground hover:text-foreground">
                      Modifier
                    </button>
                    <button className="text-sm text-red-600 hover:text-red-700">Supprimer</button>
                  </div>
                </div>

                <button className="w-full px-4 py-3 border-2 border-dashed rounded-lg hover:border-[#2563eb] hover:bg-[#2563eb]/5 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                  <Plus className="h-4 w-4" />
                  Ajouter une Méthode de Paiement
                </button>
              </div>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold">Historique des Factures</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">N° Facture</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Montant</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Statut</th>
                      <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 font-mono text-sm">{invoice.id}</td>
                        <td className="px-6 py-4 text-sm">{invoice.date}</td>
                        <td className="px-6 py-4 text-sm font-semibold">{invoice.amount}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-sm text-[#2563eb] hover:underline">
                            Télécharger
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div ref={securityRef} className="scroll-mt-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Sécurité</h1>
            <p className="text-muted-foreground">
              Protégez votre compte avec des paramètres de sécurité avancés
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-card border rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Authentification à Deux Facteurs (2FA)</p>
                  <p className="text-sm text-muted-foreground">
                    Forcer la 2FA pour tous les administrateurs
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={force2FA}
                    onChange={(e) => setForce2FA(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                </label>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() => setShow2FAModal(true)}
                  className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Configurer la 2FA
                </button>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Sessions Actives</h3>
              <div className="space-y-3">
                {activeSessions.map((session, idx) => (
                  <div key={idx} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex gap-3">
                      <Monitor className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {session.device}
                          {session.current && (
                            <span className="ml-2 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                              Session actuelle
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{session.location}</p>
                        <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="text-sm text-red-600 hover:text-red-700">
                        Déconnecter
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Politique de Mot de Passe</label>
                <select
                  value={passwordStrength}
                  onChange={(e) => setPasswordStrength(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                >
                  <option value="weak">Faible (8 caractères minimum)</option>
                  <option value="medium">Moyenne (10 caractères, lettres + chiffres)</option>
                  <option value="strong">
                    Forte (12 caractères, lettres + chiffres + symboles)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Adresses IP Bloquées</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="192.168.1.1"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                  <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors">
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API & Integrations (Admin only) */}
        {!isClientView && (
          <div ref={apiRef} className="scroll-mt-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">API & Intégrations</h1>
              <p className="text-muted-foreground">Gérez vos clés API et vos webhooks</p>
            </div>

            <div className="space-y-4">
              <div className="bg-card border rounded-lg p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Clé API</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        readOnly
                        className="w-full px-3 py-2 pr-10 border rounded-lg bg-muted font-mono text-sm"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-background rounded"
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <button
                      onClick={handleCopyApiKey}
                      className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copier
                    </button>
                    <button
                      onClick={() => setShowRegenerateModal(true)}
                      className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Régénérer
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    ⚠️ Ne partagez jamais votre clé API. Elle donne un accès complet à votre compte.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">Webhooks</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">
                          https://api.exemple.com/webhooks/orders
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Événements : order.created, order.updated
                        </p>
                      </div>
                      <button className="text-sm text-red-600 hover:text-red-700">Supprimer</button>
                    </div>

                    <button className="w-full px-4 py-3 border-2 border-dashed rounded-lg hover:border-[#2563eb] hover:bg-[#2563eb]/5 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                      <Plus className="h-4 w-4" />
                      Ajouter un Webhook
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button className="text-sm text-[#2563eb] hover:underline flex items-center gap-1">
                    Journal des Appels API
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Log (Admin only) */}
        {!isClientView && (
          <div ref={auditRef} className="scroll-mt-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">Journal d'Audit</h1>
              <p className="text-muted-foreground">
                Consultez l'historique de toutes les actions importantes
              </p>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Rechercher une action..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
                <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background">
                  <option>Tous les utilisateurs</option>
                  <option>Pierre Moreau</option>
                  <option>Sophie Laurent</option>
                  <option>Admin</option>
                </select>
                <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background">
                  <option>Derniers 7 jours</option>
                  <option>Derniers 30 jours</option>
                  <option>Derniers 90 jours</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Utilisateur</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Action</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Adresse IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {auditLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        <td className="px-6 py-4 text-sm">{log.date}</td>
                        <td className="px-6 py-4 text-sm font-medium">{log.user}</td>
                        <td className="px-6 py-4 text-sm">{log.action}</td>
                        <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                          {log.ip}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Data Governance Section (Admin only) - Phase 7 Feature 1 */}
        {!isClientView && (
          <div ref={governanceRef} className="scroll-mt-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Database className="h-7 w-7 text-[#2563eb]" />
                Data Governance
              </h1>
              <p className="text-muted-foreground">
                Gestion de la qualité, traçabilité et classification des données
              </p>
            </div>

            {/* Data Quality Dashboard */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Qualité des Données
              </h2>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">94.2%</div>
                  <div className="text-sm text-green-600">Score de Qualité Global</div>
                  <div className="text-xs text-green-500 mt-1">↑ +2.3% vs mois dernier</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700">98.7%</div>
                  <div className="text-sm text-blue-600">Complétude</div>
                  <div className="text-xs text-blue-500 mt-1">Champs requis remplis</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-700">96.1%</div>
                  <div className="text-sm text-purple-600">Exactitude</div>
                  <div className="text-xs text-purple-500 mt-1">Données validées</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-700">89.4%</div>
                  <div className="text-sm text-orange-600">Fraîcheur</div>
                  <div className="text-xs text-orange-500 mt-1">Données à jour (&lt; 30j)</div>
                </div>
              </div>

              {/* Data Quality Issues */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Problèmes de Qualité Détectés (12)
                </h3>
                {[
                  {
                    severity: 'high',
                    count: 3,
                    issue: 'Doublons dans la table produits',
                    table: 'products',
                    impact: 'Haut',
                  },
                  {
                    severity: 'medium',
                    count: 5,
                    issue: 'Valeurs manquantes dans descriptions',
                    table: 'products',
                    impact: 'Moyen',
                  },
                  {
                    severity: 'low',
                    count: 4,
                    issue: 'Format téléphone non standardisé',
                    table: 'users',
                    impact: 'Faible',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.severity === 'high' && <XCircle className="h-5 w-5 text-red-500" />}
                      {item.severity === 'medium' && (
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                      )}
                      {item.severity === 'low' && (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <div className="font-medium">{item.issue}</div>
                        <div className="text-xs text-muted-foreground">
                          Table: {item.table} • Impact: {item.impact}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">
                        {item.count} occurrences
                      </span>
                      <button className="px-3 py-1.5 text-xs font-medium bg-[#2563eb] text-white rounded hover:bg-[#1d4ed8] transition-colors">
                        Corriger
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Lineage Tracking */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#2563eb]" />
                Traçabilité des Données (Data Lineage)
              </h2>
              <div className="space-y-4">
                {[
                  {
                    dataSet: 'product_sales_analytics',
                    source: 'orders, products, users',
                    transformations: 3,
                    lastUpdate: '10/01/2026 14:30',
                    owner: 'Data Team',
                  },
                  {
                    dataSet: 'customer_360_view',
                    source: 'users, orders, reviews, support_tickets',
                    transformations: 5,
                    lastUpdate: '10/01/2026 12:15',
                    owner: 'Marketing Team',
                  },
                  {
                    dataSet: 'inventory_forecasting',
                    source: 'products, orders, suppliers',
                    transformations: 4,
                    lastUpdate: '10/01/2026 09:00',
                    owner: 'Operations Team',
                  },
                ].map((lineage, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 hover:border-[#2563eb] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-[#2563eb]">{lineage.dataSet}</div>
                      <button className="text-xs px-2 py-1 border rounded hover:bg-muted transition-colors">
                        Voir le graphe
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Sources: </span>
                        <span className="font-medium">{lineage.source}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Propriétaire: </span>
                        <span className="font-medium">{lineage.owner}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Transformations: </span>
                        <span className="font-medium">{lineage.transformations} étapes</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Dernière MAJ: </span>
                        <span className="font-medium">{lineage.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Classification */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Classification des Données
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-5 w-5 text-red-600" />
                    <div className="font-semibold text-red-700">Confidentielles</div>
                  </div>
                  <div className="text-2xl font-bold text-red-700">8,342</div>
                  <div className="text-xs text-red-600 mt-1">enregistrements</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Données personnelles, finances
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div className="font-semibold text-orange-700">Internes</div>
                  </div>
                  <div className="text-2xl font-bold text-orange-700">24,891</div>
                  <div className="text-xs text-orange-600 mt-1">enregistrements</div>
                  <div className="mt-2 text-xs text-muted-foreground">Opérations, stratégie</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="font-semibold text-green-700">Publiques</div>
                  </div>
                  <div className="text-2xl font-bold text-green-700">156,723</div>
                  <div className="text-xs text-green-600 mt-1">enregistrements</div>
                  <div className="mt-2 text-xs text-muted-foreground">Catalogue, documentation</div>
                </div>
              </div>

              {/* Classification Rules */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Règles de Classification Actives (6)
                </h3>
                {[
                  {
                    rule: 'Données bancaires → Confidentiel',
                    scope: 'billing, payments',
                    auto: true,
                  },
                  {
                    rule: 'Informations personnelles → Confidentiel',
                    scope: 'users, profiles',
                    auto: true,
                  },
                  { rule: 'Prix de vente → Interne', scope: 'products, orders', auto: true },
                  { rule: 'Descriptions produits → Public', scope: 'products', auto: true },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{item.rule}</div>
                      <div className="text-xs text-muted-foreground">Scope: {item.scope}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.auto && (
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                          Auto
                        </span>
                      )}
                      <button className="text-xs text-[#2563eb] hover:underline">Éditer</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RGPD Compliance Section (Admin only) - Phase 7 Feature 3 */}
        {!isClientView && (
          <div ref={rgpdRef} className="scroll-mt-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <UserCheck className="h-7 w-7 text-green-600" />
                RGPD Compliance
              </h1>
              <p className="text-muted-foreground">
                Gestion des droits des personnes concernées et conformité RGPD
              </p>
            </div>

            {/* RGPD Overview */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Statut de Conformité</h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-700">Conforme RGPD</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700">2,847</div>
                  <div className="text-sm text-blue-600">Utilisateurs Enregistrés</div>
                  <div className="text-xs text-blue-500 mt-1">Tous avec consentement</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">98.4%</div>
                  <div className="text-sm text-green-600">Taux de Consentement</div>
                  <div className="text-xs text-green-500 mt-1">↑ +1.2% vs mois dernier</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-700">143</div>
                  <div className="text-sm text-purple-600">Demandes RGPD Traitées</div>
                  <div className="text-xs text-purple-500 mt-1">Depuis le lancement</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-700">2.4j</div>
                  <div className="text-sm text-orange-600">Délai Moyen de Réponse</div>
                  <div className="text-xs text-orange-500 mt-1">Objectif: &lt; 30 jours</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors">
                  <Download className="h-4 w-4" />
                  Registre des Traitements
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                  <FileText className="h-4 w-4" />
                  Politique de Confidentialité
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                  <Shield className="h-4 w-4" />
                  Analyse d'Impact (DPIA)
                </button>
              </div>
            </div>

            {/* Data Subject Rights Management */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Gestion des Droits des Personnes Concernées
              </h2>
              <div className="space-y-4">
                {[
                  {
                    id: 'REQ-2026-0143',
                    type: "Droit d'accès",
                    user: 'marie.durand@email.fr',
                    date: '08/01/2026',
                    status: 'pending',
                    deadline: '07/02/2026',
                    daysLeft: 28,
                  },
                  {
                    id: 'REQ-2026-0142',
                    type: "Droit à l'effacement",
                    user: 'jean.martin@email.fr',
                    date: '05/01/2026',
                    status: 'in_progress',
                    deadline: '04/02/2026',
                    daysLeft: 25,
                  },
                  {
                    id: 'REQ-2026-0141',
                    type: 'Droit à la rectification',
                    user: 'paul.bernard@email.fr',
                    date: '03/01/2026',
                    status: 'completed',
                    deadline: '02/02/2026',
                    daysLeft: null,
                  },
                  {
                    id: 'REQ-2026-0140',
                    type: 'Droit à la portabilité',
                    user: 'sophie.petit@email.fr',
                    date: '01/01/2026',
                    status: 'completed',
                    deadline: '31/01/2026',
                    daysLeft: null,
                  },
                ].map((request, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-lg hover:border-[#2563eb] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          request.status === 'completed'
                            ? 'bg-green-500'
                            : request.status === 'in_progress'
                            ? 'bg-blue-500'
                            : 'bg-orange-500'
                        }`}
                      />
                      <div>
                        <div className="font-semibold">{request.id}</div>
                        <div className="text-sm text-muted-foreground">{request.user}</div>
                      </div>
                      <div className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                        {request.type}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-sm">
                        <div className="text-muted-foreground">Date de demande</div>
                        <div className="font-medium">{request.date}</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-muted-foreground">Échéance</div>
                        <div className="font-medium">
                          {request.status === 'completed' ? (
                            <span className="text-green-600">✓ Traitée</span>
                          ) : (
                            <span className={request.daysLeft! < 7 ? 'text-red-600' : ''}>
                              {request.deadline} ({request.daysLeft}j)
                            </span>
                          )}
                        </div>
                      </div>
                      {request.status !== 'completed' && (
                        <button className="px-3 py-1.5 text-xs font-medium bg-[#2563eb] text-white rounded hover:bg-[#1d4ed8] transition-colors">
                          Traiter
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consent Management */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Gestion des Consentements</h2>
              <div className="space-y-4">
                {[
                  {
                    purpose: 'Marketing électronique',
                    description: 'Envoi de newsletters et offres promotionnelles',
                    consented: 2453,
                    refused: 394,
                    rate: 86.2,
                  },
                  {
                    purpose: 'Analyse et statistiques',
                    description: "Collecte de données d'utilisation pour améliorer le service",
                    consented: 2687,
                    refused: 160,
                    rate: 94.4,
                  },
                  {
                    purpose: 'Personnalisation',
                    description: "Adaptation de l'expérience utilisateur",
                    consented: 2591,
                    refused: 256,
                    rate: 91.0,
                  },
                  {
                    purpose: 'Partage avec partenaires',
                    description: 'Transmission de données à des partenaires commerciaux',
                    consented: 1423,
                    refused: 1424,
                    rate: 50.0,
                  },
                ].map((consent, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold">{consent.purpose}</div>
                        <div className="text-xs text-muted-foreground">{consent.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#2563eb]">{consent.rate}%</div>
                        <div className="text-xs text-muted-foreground">Taux de consentement</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                          style={{ width: `${consent.rate}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                        <span>✓ {consent.consented.toLocaleString()} acceptés</span>
                        <span>✗ {consent.refused.toLocaleString()} refusés</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Controls */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Contrôles de Confidentialité</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">Anonymisation Automatique</div>
                    <div className="text-sm text-muted-foreground">
                      Anonymiser automatiquement les données des comptes inactifs &gt; 3 ans
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">Chiffrement des Données Sensibles</div>
                    <div className="text-sm text-muted-foreground">
                      Chiffrer toutes les données personnelles en base de données (AES-256)
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">Demandes de Consentement Double Opt-In</div>
                    <div className="text-sm text-muted-foreground">
                      Exiger une confirmation par email pour tous les consentements
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">Durée de Conservation des Données</div>
                    <div className="text-sm text-muted-foreground">
                      Suppression automatique après la durée légale
                    </div>
                  </div>
                  <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background">
                    <option>2 ans</option>
                    <option selected>3 ans</option>
                    <option>5 ans</option>
                    <option>10 ans</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">Notifications de Violation</div>
                    <div className="text-sm text-muted-foreground">
                      Notifier automatiquement la CNIL et les utilisateurs en cas de violation &lt;
                      72h
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                  </label>
                </div>
              </div>

              {/* Export User Data */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Outils d'Export de Données</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="email"
                    placeholder="Email de l'utilisateur"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                  <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors">
                    <Download className="h-4 w-4 inline mr-2" />
                    Exporter Données JSON
                  </button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                    <Trash2 className="h-4 w-4 inline mr-2 text-red-600" />
                    Supprimer Compte
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  L'export inclut toutes les données personnelles, commandes, interactions et
                  consentements de l'utilisateur.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Regenerate API Key Modal */}
      {showRegenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h2 className="text-xl font-bold">Régénérer la Clé API</h2>
            </div>

            <div className="p-6">
              <p className="text-red-600 font-medium mb-2">
                ⚠️ Attention : Cette action est irréversible
              </p>
              <p className="text-sm text-muted-foreground">
                La régénération de votre clé API invalidera immédiatement l'ancienne clé. Tous les
                services utilisant l'ancienne clé cesseront de fonctionner.
              </p>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowRegenerateModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleRegenerateApiKey}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirmer la Régénération
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Configuration 2FA</h2>
              <button
                onClick={() => setShow2FAModal(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 text-center">
              <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                <div className="text-muted-foreground">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 ${
                          Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Scannez ce code QR avec votre application d'authentification (Google Authenticator,
                Authy, etc.)
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code à 6 chiffres"
                  maxLength={6}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background text-center font-mono text-lg"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShow2FAModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShow2FAModal(false);
                  toast.success('2FA activée avec succès');
                }}
                className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                Activer la 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Manager Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex">
            {/* Left side - Roles List */}
            <div
              className={`${editingRole ? 'w-1/3' : 'w-full'} border-r transition-all duration-300`}
            >
              <div className="sticky top-0 bg-card px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold">Gestionnaire de Rôles</h2>
                {!editingRole && (
                  <button
                    onClick={() => {
                      setShowRoleModal(false);
                      setEditingRole(null);
                    }}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-4">
                  {['Admin', 'Gestionnaire de Stock', 'Vendeur'].map((role) => (
                    <div
                      key={role}
                      className={`border rounded-lg p-4 transition-all ${
                        editingRole === role ? 'border-[#2563eb] bg-[#2563eb]/5' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{role}</h3>
                        <button
                          onClick={() => setEditingRole(role)}
                          className="text-sm text-[#2563eb] hover:underline"
                        >
                          Éditer
                        </button>
                      </div>
                      {!editingRole && (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              defaultChecked={role === 'Admin'}
                              className="rounded"
                              disabled
                            />
                            <span className="text-muted-foreground">Voir le stock</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              defaultChecked={['Admin', 'Gestionnaire de Stock'].includes(role)}
                              className="rounded"
                              disabled
                            />
                            <span className="text-muted-foreground">Gérer les commandes</span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {!editingRole && (
                <div className="sticky bottom-0 bg-card px-6 py-4 border-t flex justify-end">
                  <button
                    onClick={() => {
                      setShowRoleModal(false);
                      toast.success('Permissions mises à jour');
                    }}
                    className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              )}
            </div>

            {/* Right side - Edit Panel */}
            {editingRole && (
              <div className="w-2/3 flex flex-col">
                <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
                  <div>
                    <h3 className="font-bold text-lg">Édition : {editingRole}</h3>
                    <p className="text-sm text-muted-foreground">
                      Configurez les permissions pour ce rôle
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingRole(null)}
                    className="p-1 hover:bg-background rounded transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Permissions détaillées pour Admin */}
                    {editingRole === 'Admin' && (
                      <>
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-[#2563eb]" />
                            Permissions Système
                          </h4>
                          <div className="space-y-3 pl-6">
                            <label className="flex items-start gap-3">
                              <input type="checkbox" defaultChecked className="rounded mt-1" />
                              <div>
                                <div className="font-medium">Supprimer des utilisateurs</div>
                                <div className="text-xs text-muted-foreground">
                                  Permet de supprimer définitivement des comptes utilisateurs
                                </div>
                              </div>
                            </label>
                            <label className="flex items-start gap-3">
                              <input type="checkbox" defaultChecked className="rounded mt-1" />
                              <div>
                                <div className="font-medium">Changer les paramètres système</div>
                                <div className="text-xs text-muted-foreground">
                                  Accès complet aux paramètres de la plateforme
                                </div>
                              </div>
                            </label>
                            <label className="flex items-start gap-3">
                              <input type="checkbox" defaultChecked className="rounded mt-1" />
                              <div>
                                <div className="font-medium">Gérer les rôles et permissions</div>
                                <div className="text-xs text-muted-foreground">
                                  Créer et modifier les rôles d'autres utilisateurs
                                </div>
                              </div>
                            </label>
                            <label className="flex items-start gap-3">
                              <input type="checkbox" defaultChecked className="rounded mt-1" />
                              <div>
                                <div className="font-medium">Accès aux logs d'audit</div>
                                <div className="text-xs text-muted-foreground">
                                  Consulter l'historique de toutes les actions système
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Gestion des Stocks</h4>
                          <div className="space-y-3 pl-6">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Voir le stock</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Modifier le stock</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Supprimer des produits</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Commandes & Livraisons</h4>
                          <div className="space-y-3 pl-6">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Gérer toutes les commandes</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Annuler des commandes</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Suivre la logistique</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Permissions pour Gestionnaire de Stock */}
                    {editingRole === 'Gestionnaire de Stock' && (
                      <>
                        <div>
                          <h4 className="font-semibold mb-3">Gestion des Stocks</h4>
                          <div className="space-y-3 pl-6">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Voir le stock</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Modifier le stock</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" className="rounded" />
                              <span>Supprimer des produits</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Créer des alertes de stock</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Commandes</h4>
                          <div className="space-y-3 pl-6">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Voir les commandes</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Modifier le statut des commandes</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Permissions pour Vendeur */}
                    {editingRole === 'Vendeur' && (
                      <>
                        <div>
                          <h4 className="font-semibold mb-3">Produits</h4>
                          <div className="space-y-3 pl-6">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Voir les produits</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Créer des produits</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Modifier ses propres produits</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Commandes</h4>
                          <div className="space-y-3 pl-6">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Voir ses commandes</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Accepter/Refuser des commandes</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 border-t bg-muted/10 flex justify-between">
                  <button
                    onClick={() => setEditingRole(null)}
                    className="px-4 py-2 border rounded-lg hover:bg-background transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => {
                      setEditingRole(null);
                      toast.success(`Permissions du rôle "${editingRole}" mises à jour`);
                    }}
                    className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
                  >
                    Enregistrer les Modifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
