import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  FileText,
  Truck,
  Calculator,
  Navigation2,
  Sprout,
  Cpu,
  Brain,
  DollarSign,
  Zap,
  Settings,
  MessageSquare,
  BarChart3,
  Award,
  Sparkles,
} from 'lucide-react';
import { Card } from './ui/card';

interface AdminPanelHomeProps {
  onNavigate: (route: string) => void;
}

const adminFeatures = [
  {
    icon: Users,
    title: 'Gestion Utilisateurs',
    description: 'Gérer les comptes et permissions',
    route: '/admin/users',
    color: 'bg-blue-500',
    stats: '245 utilisateurs',
  },
  {
    icon: Package,
    title: 'Produits',
    description: 'Inventaire et catalogue produits',
    route: '/admin/products',
    color: 'bg-green-500',
    stats: '1,234 produits',
  },
  {
    icon: ShoppingCart,
    title: 'Commandes',
    description: 'Suivi et gestion des commandes',
    route: '/admin/orders',
    color: 'bg-orange-500',
    stats: '89 en cours',
  },
  {
    icon: TrendingUp,
    title: 'Catégories',
    description: 'Organisation des produits',
    route: '/admin/categories',
    color: 'bg-purple-500',
    stats: '24 catégories',
  },
  {
    icon: FileText,
    title: 'Rapports',
    description: 'Analytics et rapports détaillés',
    route: '/admin/reports',
    color: 'bg-indigo-500',
    stats: 'Beta',
    badge: 'Beta',
  },
  {
    icon: Truck,
    title: 'Logistique',
    description: 'Suivi des livraisons et stocks',
    route: '/admin/logistics',
    color: 'bg-cyan-500',
    stats: '12 expéditions',
  },
  {
    icon: Calculator,
    title: 'Calculateur Transport',
    description: 'Calcul de coûts de transport',
    route: '/admin/transport-calculator',
    color: 'bg-emerald-500',
    stats: 'Nouveau',
    badge: 'New',
  },
  {
    icon: Navigation2,
    title: 'Suivi Livraison 3PL',
    description: 'Tracking en temps réel',
    route: '/admin/tracking',
    color: 'bg-teal-500',
    stats: 'Nouveau',
    badge: 'New',
  },
  {
    icon: MessageSquare,
    title: 'Chat B2B',
    description: 'Messagerie professionnelle',
    route: '/admin/b2b-chat',
    color: 'bg-pink-500',
    stats: 'Nouveau',
    badge: 'New',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Transporteur',
    description: 'Gestion transporteurs',
    route: '/admin/carrier-dashboard',
    color: 'bg-violet-500',
    stats: 'Nouveau',
    badge: 'New',
  },
  {
    icon: Award,
    title: 'Affiliations',
    description: 'Revenus passifs et commissions',
    route: '/admin/affiliate-dashboard',
    color: 'bg-yellow-500',
    stats: '€45,890',
    badge: '💰',
  },
  {
    icon: Sprout,
    title: 'Crop Intelligence',
    description: 'Analyse des cultures',
    route: '/admin/crops',
    color: 'bg-lime-500',
    stats: 'AI-Powered',
  },
  {
    icon: Cpu,
    title: 'IoT Hub',
    description: 'Capteurs et appareils connectés',
    route: '/admin/iot',
    color: 'bg-sky-500',
    stats: '45 appareils',
  },
  {
    icon: Brain,
    title: 'AI Insights',
    description: 'Intelligence artificielle',
    route: '/admin/ai-insights',
    color: 'bg-fuchsia-500',
    stats: 'ML Ready',
  },
  {
    icon: DollarSign,
    title: 'Finance',
    description: 'Gestion financière complète',
    route: '/admin/finance',
    color: 'bg-amber-500',
    stats: '€45,890',
  },
  {
    icon: Zap,
    title: 'Automation',
    description: 'Workflows automatisés',
    route: '/admin/automation',
    color: 'bg-yellow-500',
    stats: '8 workflows',
  },
  {
    icon: Settings,
    title: 'Paramètres',
    description: 'Configuration système',
    route: '/admin/settings',
    color: 'bg-gray-500',
    stats: 'Système',
  },
];

export function AdminPanelHome({ onNavigate }: AdminPanelHomeProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Panel d'Administration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez tous les aspects de votre plateforme AgroLogistic
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Utilisateurs</p>
              <p className="text-2xl font-bold mt-1">245</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+12% ce mois</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Produits Actifs</p>
              <p className="text-2xl font-bold mt-1">1,234</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+8% ce mois</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Commandes Actives</p>
              <p className="text-2xl font-bold mt-1">89</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">12 en attente</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Revenu Mensuel</p>
              <p className="text-2xl font-bold mt-1">€45,890</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+23% ce mois</p>
        </Card>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Fonctionnalités Administration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {adminFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.route}
                className="p-6 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => onNavigate(feature.route)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`h-12 w-12 rounded-lg ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {feature.badge && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        feature.badge === 'New'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}
                    >
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {feature.description}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-500">
                  {feature.stats}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('/admin/users')}
            className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-left"
          >
            <Users className="h-8 w-8 mb-2" />
            <p className="font-semibold">Ajouter Utilisateur</p>
            <p className="text-xs opacity-90">Créer un nouveau compte</p>
          </button>

          <button
            onClick={() => onNavigate('/admin/products')}
            className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-left"
          >
            <Package className="h-8 w-8 mb-2" />
            <p className="font-semibold">Ajouter Produit</p>
            <p className="text-xs opacity-90">Nouveau produit au catalogue</p>
          </button>

          <button
            onClick={() => onNavigate('/admin/reports')}
            className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all text-left"
          >
            <FileText className="h-8 w-8 mb-2" />
            <p className="font-semibold">Générer Rapport</p>
            <p className="text-xs opacity-90">Analytics et statistiques</p>
          </button>

          <button
            onClick={() => onNavigate('/admin/settings')}
            className="p-4 bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all text-left"
          >
            <Settings className="h-8 w-8 mb-2" />
            <p className="font-semibold">Paramètres</p>
            <p className="text-xs opacity-90">Configuration système</p>
          </button>
        </div>
      </div>

      {/* New Features Highlight */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Nouvelles Fonctionnalités B2B Disponibles !
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Découvrez nos nouveaux outils de gestion logistique : Calculateur de transport, Suivi
              3PL, Chat B2B professionnel, et Dashboard transporteur.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('/admin/transport-calculator')}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
              >
                Calculateur Transport
              </button>
              <button
                onClick={() => onNavigate('/admin/tracking')}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium"
              >
                Suivi Livraison
              </button>
              <button
                onClick={() => onNavigate('/admin/b2b-chat')}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium"
              >
                Chat B2B
              </button>
              <button
                onClick={() => onNavigate('/admin/carrier-dashboard')}
                className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors text-sm font-medium"
              >
                Dashboard Transporteur
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
