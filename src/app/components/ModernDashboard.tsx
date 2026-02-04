import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Leaf,
  DollarSign,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  MapPin,
  Calendar,
  Users,
  Truck,
  Sprout,
  BarChart3,
  LineChart,
  Download,
  Share2,
  Sparkles,
  Battery,
  Signal,
  Tractor,
  Shield,
  Award,
  Clock,
  ArrowRight,
  Zap,
  Droplet,
  Sun,
  Wind,
  Package,
  ShoppingCart,
  Warehouse,
  Bell,
  Settings,
  Eye,
  ChevronRight,
  Check,
  Mail,
  Phone,
  Send,
  MessageSquare,
  MapPinned,
  Headphones,
  ThermometerSun,
  CloudRain,
  Heart,
  Star,
  MoveRight,
  Boxes,
  Store,
  CreditCard,
  FileText,
  Building2,
  Smartphone,
  Globe,
  Wifi,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export function ModernDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
  };

  // Stats principales
  const stats = {
    revenue: {
      value: 45890,
      change: 23,
      label: 'Revenus Mensuels',
      icon: DollarSign,
      color: 'green',
    },
    orders: {
      value: 127,
      change: 12,
      label: 'Commandes Actives',
      icon: ShoppingCart,
      color: 'blue',
    },
    products: {
      value: 1234,
      change: 8,
      label: 'Produits en Stock',
      icon: Package,
      color: 'purple',
    },
    users: { value: 245, change: 15, label: 'Utilisateurs Actifs', icon: Users, color: 'orange' },
  };

  // Activités récentes
  const recentActivities = [
    {
      id: '1',
      type: 'order',
      icon: ShoppingCart,
      title: 'Nouvelle commande #1245',
      description: 'Tracteur John Deere - €45,000',
      time: 'Il y a 5 min',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      id: '2',
      type: 'alert',
      icon: AlertTriangle,
      title: 'Stock faible - Pièces détachées',
      description: '15 articles nécessitent réapprovisionnement',
      time: 'Il y a 15 min',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      id: '3',
      type: 'user',
      icon: Users,
      title: '5 nouveaux utilisateurs',
      description: 'Inscription via la marketplace',
      time: 'Il y a 1h',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      id: '4',
      type: 'delivery',
      icon: Truck,
      title: 'Livraison effectuée',
      description: "Système d'irrigation automatique",
      time: 'Il y a 2h',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  // Top produits
  const topProducts = [
    {
      id: '1',
      name: 'Tracteur John Deere 6M',
      sales: 45,
      revenue: 890000,
      trend: 12,
      icon: Tractor,
    },
    {
      id: '2',
      name: 'Système Irrigation Automatique',
      sales: 89,
      revenue: 456000,
      trend: 23,
      icon: Droplet,
    },
    {
      id: '3',
      name: 'Kit Capteurs IoT Agriculture',
      sales: 156,
      revenue: 234000,
      trend: -5,
      icon: Wifi,
    },
    {
      id: '4',
      name: 'Pièces Détachées Moissonneuse',
      sales: 234,
      revenue: 189000,
      trend: 8,
      icon: Settings,
    },
  ];

  // Métriques météo
  const weatherMetrics = {
    temp: 24,
    condition: 'Ensoleillé',
    wind: 12,
    humidity: 65,
    precipitation: 0,
  };

  // Quick actions
  const quickActions = [
    {
      id: '1',
      label: 'Nouvelle Commande',
      icon: ShoppingCart,
      color: 'bg-green-500',
      route: '/admin/orders',
    },
    {
      id: '2',
      label: 'Ajouter Produit',
      icon: Package,
      color: 'bg-blue-500',
      route: '/admin/products',
    },
    {
      id: '3',
      label: 'Gérer Stock',
      icon: Warehouse,
      color: 'bg-purple-500',
      route: '/admin/logistics',
    },
    {
      id: '4',
      label: 'Voir Rapports',
      icon: BarChart3,
      color: 'bg-orange-500',
      route: '/admin/reports',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header avec image de fond */}
      <div className="relative h-72 rounded-2xl overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1724048413085-1c8d81b3ffa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhZ3JpY3VsdHVyZSUyMGZhcm0lMjBhZXJpYWx8ZW58MXx8fHwxNzY4NDI3MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Agriculture moderne - Vue aérienne"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <Sprout className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Bienvenue sur AgroLogistic</h1>
                  <p className="text-white/90 text-lg mt-1">
                    Votre plateforme intelligente pour l'agriculture moderne
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {new Date().toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>

          {/* Météo en direct */}
          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md rounded-xl p-5 w-fit border border-white/20">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <Sun className="h-8 w-8 text-yellow-300" />
              </div>
              <div>
                <p className="text-white/70 text-sm flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  Conditions Actuelles
                </p>
                <p className="text-white text-2xl font-bold">
                  {weatherMetrics.temp}°C • {weatherMetrics.condition}
                </p>
              </div>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div className="flex gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                <div>
                  <p className="text-xs text-white/70">Vent</p>
                  <p className="font-semibold">{weatherMetrics.wind} km/h</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5" />
                <div>
                  <p className="text-xs text-white/70">Humidité</p>
                  <p className="font-semibold">{weatherMetrics.humidity}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(stats).map((stat, index) => {
          const Icon = stat.icon;
          const colorClass = {
            green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
            blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
            purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
            orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
          }[stat.color];
          const badgeColor = {
            green: 'text-green-600 bg-green-100 dark:bg-green-900/20',
            blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
            purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
            orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
          }[stat.color];

          return (
            <Card key={index} className="p-6 hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`h-12 w-12 rounded-full ${colorClass} flex items-center justify-center`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span
                  className={`text-xs font-semibold ${badgeColor} px-2 py-1 rounded-full flex items-center gap-1`}
                >
                  <TrendingUp className="h-3 w-3" />+{stat.change}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {typeof stat.value === 'number' && stat.value > 1000
                  ? `€${stat.value.toLocaleString()}`
                  : stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <MoveRight className="h-3 w-3" />
                vs mois dernier
              </p>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Actions Rapides
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className={`p-6 ${action.color} text-white rounded-xl hover:opacity-90 hover:scale-105 transition-all text-left group shadow-lg`}
              >
                <Icon className="h-8 w-8 mb-3" />
                <p className="font-semibold text-lg">{action.label}</p>
                <ArrowRight className="h-5 w-5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Produits */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-[#0B7A4B]" />
                Top Produits
              </h2>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Voir Tout
              </Button>
            </div>

            <div className="space-y-4">
              {topProducts.map((product, index) => {
                const ProductIcon = product.icon;
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0B7A4B] to-[#1A5F7A] flex items-center justify-center text-white shadow-lg">
                        <ProductIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          {product.sales} ventes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        €{product.revenue.toLocaleString()}
                      </p>
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          product.trend > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {product.trend > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(product.trend)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="relative h-52 rounded-xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjB0cmFjdG9yJTIwbW9kZXJufGVufDF8fHx8MTc2ODQyODM4OXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Équipements agricoles modernes"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="h-5 w-5 text-white" />
                    <span className="text-white/90 text-sm">Catalogue Premium</span>
                  </div>
                  <p className="text-white font-bold text-xl mb-3">
                    Découvrez notre gamme d'équipements professionnels
                  </p>
                  <Button className="bg-white text-gray-900 hover:bg-gray-100">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir le catalogue
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Activités Récentes */}
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#1A5F7A]" />
                Activités Récentes
              </h2>
              <Button variant="ghost" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex gap-3 group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-colors"
                  >
                    <div
                      className={`h-10 w-10 rounded-full ${activity.bgColor} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button variant="outline" className="w-full mt-4">
              Voir Toutes les Activités
            </Button>
          </Card>
        </div>
      </div>

      {/* Featured Sections avec Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agriculture Intelligente */}
        <Card className="overflow-hidden hover:shadow-2xl transition-all group">
          <div className="relative h-56">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1744230673231-865d54a0aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGZhcm1pbmclMjB0ZWNobm9sb2d5JTIwZmllbGR8ZW58MXx8fHwxNzY4NDI4MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Smart Farming - Agriculture Intelligente"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
                  Intelligence Artificielle
                </span>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Agriculture Intelligente</h3>
              <p className="text-white/90 text-sm mb-4">
                Optimisez vos rendements avec nos outils IA et IoT de dernière génération
              </p>
              <Button className="bg-[#0B7A4B] hover:bg-[#095839] text-white">
                En savoir plus
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Agriculture Durable */}
        <Card className="overflow-hidden hover:shadow-2xl transition-all group">
          <div className="relative h-56">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1757525473930-0b82237e55ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGFncmljdWx0dXJlJTIwZ3JlZW4lMjBjcm9wc3xlbnwxfHx8fDE3Njg0MjgzOTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Agriculture durable - Développement durable"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-5 w-5 text-green-400" />
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                  Développement Durable
                </span>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Agriculture Durable</h3>
              <p className="text-white/90 text-sm mb-4">
                Solutions écologiques pour un avenir agricole respectueux de l'environnement
              </p>
              <Button className="bg-[#1A5F7A] hover:bg-[#144A5A] text-white">
                Découvrir
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Call to Action - Programme Affiliation */}
      <Card className="p-8 bg-gradient-to-r from-[#0B7A4B] to-[#1A5F7A] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10">
          <Award className="h-64 w-64" />
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-6 w-6 text-yellow-300" />
              <span className="text-sm font-semibold text-yellow-300 uppercase tracking-wider">
                Nouveau
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-3">Programme d'Affiliation AgroLogistic</h3>
            <p className="text-white/90 mb-6 max-w-2xl text-lg">
              Générez des revenus passifs en partageant nos produits agricoles de qualité.
              Commissions jusqu'à 25% sur chaque vente !
            </p>
            <div className="flex gap-3">
              <Button className="bg-white text-[#0B7A4B] hover:bg-gray-100 shadow-lg">
                <Award className="h-4 w-4 mr-2" />
                Rejoindre le Programme
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                En savoir plus
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="h-40 w-40 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl">
              <Award className="h-20 w-20 text-yellow-300" />
            </div>
          </div>
        </div>
      </Card>

      {/* Section Tarifs Transparents */}
      <div>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <DollarSign className="h-8 w-8 text-[#0B7A4B]" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tarifs Transparents
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Des prix adaptés à vos besoins, sans frais cachés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan Starter */}
          <Card className="p-8 hover:shadow-xl transition-all hover:scale-105">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Sprout className="h-7 w-7 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">€49</span>
                <span className="text-gray-600 dark:text-gray-400">/mois</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Parfait pour débuter</p>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Jusqu'à 10 utilisateurs",
                'Marketplace complète',
                'Support email',
                '5 Go de stockage',
                'Rapports basiques',
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">Commencer</Button>
          </Card>

          {/* Plan Pro (Recommandé) */}
          <Card className="p-8 relative border-2 border-[#0B7A4B] hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-b from-green-50 to-white dark:from-green-900/10 dark:to-gray-900">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-[#0B7A4B] text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                <Star className="h-4 w-4" />
                Recommandé
              </span>
            </div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <Tractor className="h-7 w-7 text-[#0B7A4B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-[#0B7A4B]">€99</span>
                <span className="text-gray-600 dark:text-gray-400">/mois</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Pour les professionnels
              </p>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                'Utilisateurs illimités',
                'Toutes les fonctionnalités Starter',
                'IoT Device Hub',
                'AI Insights avancés',
                'Support prioritaire 24/7',
                '50 Go de stockage',
                'Rapports personnalisés',
                'Automatisation workflows',
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#0B7A4B] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-[#0B7A4B] hover:bg-[#095839] text-white shadow-lg">
              Essayer Pro
            </Button>
          </Card>

          {/* Plan Enterprise */}
          <Card className="p-8 hover:shadow-xl transition-all hover:scale-105">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                <Building2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">Sur mesure</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Pour les grandes exploitations
              </p>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                'Tout du plan Pro',
                'Crop Intelligence illimité',
                'API dédiée',
                'Gestionnaire de compte dédié',
                'Stockage illimité',
                'Formation personnalisée',
                'SLA garanti 99.9%',
                'Intégrations sur mesure',
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-[#1A5F7A] hover:bg-[#144A5A] text-white">
              Nous contacter
            </Button>
          </Card>
        </div>
      </div>

      {/* Section Formulaire de Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Formulaire */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-[#0B7A4B]/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-[#0B7A4B]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contactez-nous</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Nous sommes là pour répondre à toutes vos questions
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitContact} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Nom complet
              </label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#0B7A4B] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Jean Dupont"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#0B7A4B] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="jean.dupont@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Téléphone
              </label>
              <input
                type="tel"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#0B7A4B] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Message
              </label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#0B7A4B] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                placeholder="Comment pouvons-nous vous aider ?"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-[#0B7A4B] hover:bg-[#095839] text-white">
              <Send className="h-4 w-4 mr-2" />
              Envoyer le message
            </Button>
          </form>
        </Card>

        {/* Informations de contact */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#0B7A4B]" />
              Autres moyens de nous contacter
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    contact@AgroLogistic.com
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    support@AgroLogistic.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Téléphone</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">+33 1 23 45 67 89</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Lundi - Vendredi, 9h - 18h
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <MapPinned className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Adresse</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    123 Avenue de l'Agriculture
                    <br />
                    75001 Paris, France
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#0B7A4B] to-[#1A5F7A] text-white">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Support 24/7
            </h3>
            <p className="text-white/90 text-sm mb-4">
              Notre équipe est disponible pour vous accompagner à tout moment. Support technique,
              questions commerciales ou simples demandes d'information.
            </p>
            <Button className="w-full bg-white text-[#0B7A4B] hover:bg-gray-100">
              <MessageSquare className="h-4 w-4 mr-2" />
              Démarrer un chat
            </Button>
          </Card>

          {/* Image Support Team */}
          <div className="relative h-48 rounded-xl overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1609554259810-ad331c1a9519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtaW5nJTIwdGVhbXdvcmslMjBmYXJtZXJzfGVufDF8fHx8MTc2ODQyODM5MHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Équipe agricole professionnelle"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Une équipe passionnée à votre service
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo et Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#0B7A4B] to-[#1A5F7A] flex items-center justify-center">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">AgroLogistic</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              La plateforme complète pour l'agriculture intelligente et durable
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-[#0B7A4B] hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-[#0B7A4B] hover:text-white transition-colors"
              >
                <Smartphone className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Produits */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Produits
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  Crop Intelligence
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  IoT Device Hub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  AI Insights
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  Automation
                </a>
              </li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Entreprise
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  Comment ça marche
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  Tarifs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Ressources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  Académie
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  Documentation API
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Shield className="h-4 w-4" />© 2026 AgroLogistic. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors"
              >
                Politique de confidentialité
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors"
              >
                Conditions d'utilisation
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-[#0B7A4B] transition-colors"
              >
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
