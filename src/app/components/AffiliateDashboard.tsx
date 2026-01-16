import { useState } from "react";
import {
  TrendingUp,
  Link2,
  DollarSign,
  Users,
  Package,
  Zap,
  Copy,
  ExternalLink,
  Eye,
  MousePointerClick,
  ShoppingCart,
  Award,
  Percent,
  Calendar,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Share2,
  BarChart3,
  Target,
  Wrench,
  Tractor,
  Lightbulb,
  Plug
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface AffiliateLink {
  id: string;
  productName: string;
  category: string;
  affiliateUrl: string;
  commission: number;
  clicks: number;
  conversions: number;
  revenue: number;
  status: "active" | "paused" | "pending";
  createdAt: string;
}

interface Partner {
  id: string;
  name: string;
  logo: string;
  category: string;
  commissionRate: number;
  activeLinks: number;
  totalRevenue: number;
  status: "active" | "inactive";
}

export function AffiliateDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [showLinkModal, setShowLinkModal] = useState(false);

  // Mock data
  const stats = {
    totalRevenue: 45890,
    monthlyGrowth: 23,
    activeLinks: 127,
    totalClicks: 15420,
    conversions: 892,
    conversionRate: 5.8,
    pendingCommissions: 12450,
    paidCommissions: 33440
  };

  const affiliateLinks: AffiliateLink[] = [
    {
      id: "1",
      productName: "Tracteur John Deere 6M Series",
      category: "Engins Agricoles",
      affiliateUrl: "https://agrodeep.com/aff/jd-6m-abc123",
      commission: 8.5,
      clicks: 1234,
      conversions: 45,
      revenue: 8900,
      status: "active",
      createdAt: "2026-01-10"
    },
    {
      id: "2",
      productName: "Pièces Détachées Moissonneuse",
      category: "Pièces Détachées",
      affiliateUrl: "https://agrodeep.com/aff/spare-parts-xyz789",
      commission: 12,
      clicks: 890,
      conversions: 67,
      revenue: 6700,
      status: "active",
      createdAt: "2026-01-08"
    },
    {
      id: "3",
      productName: "Électro-Pompe Irrigation",
      category: "Électroménager Agricole",
      affiliateUrl: "https://agrodeep.com/aff/pump-def456",
      commission: 10,
      clicks: 567,
      conversions: 34,
      revenue: 4200,
      status: "active",
      createdAt: "2026-01-05"
    },
    {
      id: "4",
      productName: "Système d'Irrigation Automatique",
      category: "Produits Industriels",
      affiliateUrl: "https://agrodeep.com/aff/irrigation-ghi789",
      commission: 15,
      clicks: 2100,
      conversions: 89,
      revenue: 15600,
      status: "active",
      createdAt: "2025-12-28"
    },
    {
      id: "5",
      productName: "Kit Capteurs IoT Agriculture",
      category: "Produits Industriels",
      affiliateUrl: "https://agrodeep.com/aff/iot-sensors-jkl012",
      commission: 18,
      clicks: 1450,
      conversions: 56,
      revenue: 10080,
      status: "paused",
      createdAt: "2025-12-20"
    }
  ];

  const partners: Partner[] = [
    {
      id: "1",
      name: "John Deere",
      logo: "🚜",
      category: "Engins Agricoles",
      commissionRate: 8.5,
      activeLinks: 23,
      totalRevenue: 18900,
      status: "active"
    },
    {
      id: "2",
      name: "AgriParts Pro",
      logo: "⚙️",
      category: "Pièces Détachées",
      commissionRate: 12,
      activeLinks: 45,
      totalRevenue: 12450,
      status: "active"
    },
    {
      id: "3",
      name: "AgroTech Solutions",
      logo: "💡",
      category: "Produits Industriels",
      commissionRate: 15,
      activeLinks: 34,
      totalRevenue: 8900,
      status: "active"
    },
    {
      id: "4",
      name: "FarmElectro",
      logo: "🔌",
      category: "Électroménager Agricole",
      commissionRate: 10,
      activeLinks: 25,
      totalRevenue: 5640,
      status: "active"
    }
  ];

  const categories = [
    { id: "all", name: "Toutes Catégories", icon: Package, color: "gray" },
    { id: "tractors", name: "Engins Agricoles", icon: Tractor, color: "green" },
    { id: "parts", name: "Pièces Détachées", icon: Wrench, color: "orange" },
    { id: "industrial", name: "Produits Industriels", icon: Lightbulb, color: "purple" },
    { id: "appliances", name: "Électroménager Agricole", icon: Plug, color: "blue" }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast notification would go here
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      paused: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      inactive: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Programme d'Affiliation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Générez des revenus passifs avec nos liens d'affiliation
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button className="gap-2 bg-[#0B7A4B] hover:bg-[#095839]">
            <Plus className="h-4 w-4" />
            Nouveau Lien
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400 px-2 py-1 rounded-full">
              +{stats.monthlyGrowth}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Revenus Totaux</p>
          <p className="text-2xl font-bold mt-1">€{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Ce mois</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Link2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Liens Actifs</p>
          <p className="text-2xl font-bold mt-1">{stats.activeLinks}</p>
          <p className="text-xs text-gray-500 mt-2">Sur 4 partenaires</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <MousePointerClick className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Total Clics</p>
          <p className="text-2xl font-bold mt-1">{stats.totalClicks.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">{stats.conversions} conversions</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <Percent className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Taux Conversion</p>
          <p className="text-2xl font-bold mt-1">{stats.conversionRate}%</p>
          <p className="text-xs text-gray-500 mt-2">Moyenne du secteur: 3.2%</p>
        </Card>
      </div>

      {/* Commissions Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Commissions en Attente</h3>
            <Award className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            €{stats.pendingCommissions.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Disponibles dans 15 jours
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-500">Progression</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">72%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "72%" }}></div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Commissions Payées</h3>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            €{stats.paidCommissions.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Total depuis le début
          </p>
          <Button className="mt-4 w-full" variant="outline">
            Voir Historique
          </Button>
        </Card>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Catégories de Produits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <Card
                key={category.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? "ring-2 ring-[#0B7A4B] bg-green-50 dark:bg-green-900/20" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`h-12 w-12 rounded-full bg-${category.color}-100 dark:bg-${category.color}-900 flex items-center justify-center mb-3`}>
                    <Icon className={`h-6 w-6 text-${category.color}-600 dark:text-${category.color}-400`} />
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {category.name}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Partners */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Partenaires Affiliés
          </h2>
          <Button variant="outline" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            Voir Tous
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {partners.map((partner) => (
            <Card key={partner.id} className="p-4 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">
                    {partner.logo}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {partner.name}
                    </p>
                    <p className="text-xs text-gray-500">{partner.category}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Commission</span>
                  <span className="text-sm font-semibold text-green-600">{partner.commissionRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Liens actifs</span>
                  <span className="text-sm font-medium">{partner.activeLinks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Revenu total</span>
                  <span className="text-sm font-semibold">€{partner.totalRevenue.toLocaleString()}</span>
                </div>
              </div>
              <Button className="w-full mt-3" size="sm" variant="outline">
                Gérer
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Affiliate Links Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Liens d'Affiliation Actifs
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              {selectedPeriod === "month" ? "Ce mois" : "Cette année"}
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Clics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Conversions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Revenu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {affiliateLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {link.productName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {link.affiliateUrl.slice(0, 35)}...
                          </code>
                          <button
                            onClick={() => copyToClipboard(link.affiliateUrl)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {link.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {link.commission}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{link.clicks.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{link.conversions}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        €{link.revenue.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(link.status)}`}>
                        {link.status === "active" ? "Actif" : link.status === "paused" ? "Pause" : "En attente"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-blue-600">
                          <BarChart3 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-green-600">
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-yellow-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#0B7A4B]" />
            Top 5 Produits par Revenu
          </h3>
          <div className="space-y-4">
            {affiliateLinks.slice(0, 5).map((link, index) => (
              <div key={link.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {index + 1}. {link.productName.slice(0, 30)}...
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    €{link.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#0B7A4B] to-green-400 h-2 rounded-full"
                    style={{ width: `${(link.revenue / 15600) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#0B7A4B]" />
            Conseils pour Optimiser vos Revenus
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Zap className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Partagez sur les réseaux sociaux
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Augmentez vos clics de 45% en partageant vos liens
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Target className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Ciblez les produits à forte demande
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Les engins agricoles ont un taux de conversion de 8.2%
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Award className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Créez du contenu de qualité
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Les articles détaillés convertissent 3x plus
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="p-6 bg-gradient-to-r from-[#0B7A4B] to-[#1A5F7A] text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">
              🚀 Programme Ambassadeur Premium
            </h3>
            <p className="text-green-100 mb-4">
              Débloquez des commissions jusqu'à 25% et des bonus exclusifs en devenant Ambassadeur Premium AgroDeep
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4" />
                Commissions majorées sur tous les produits
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4" />
                Support prioritaire et outils marketing exclusifs
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                Accès anticipé aux nouveaux partenariats
              </li>
            </ul>
            <Button className="bg-white text-[#0B7A4B] hover:bg-gray-100">
              Devenir Ambassadeur Premium
            </Button>
          </div>
          <div className="hidden lg:block ml-6">
            <div className="h-32 w-32 rounded-full bg-white/10 flex items-center justify-center">
              <Award className="h-16 w-16 text-yellow-300" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
