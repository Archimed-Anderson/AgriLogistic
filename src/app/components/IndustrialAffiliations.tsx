import { useState } from 'react';
import {
  Package,
  DollarSign,
  MousePointer,
  Users,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Plus,
  Search,
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  BarChart3,
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  ExternalLink,
  Upload,
  FileSpreadsheet,
  QrCode,
  Link2,
  ChevronDown,
  ChevronRight,
  Star,
  Award,
  Zap,
  Building2,
  Factory,
  Wrench,
  Hammer,
  Truck,
  Tractor,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';

interface AffiliateProduct {
  id: string;
  reference: string;
  name: string;
  brand: string;
  brandLogo: string;
  sector: 'parts' | 'appliances' | 'construction' | 'agricultural' | 'other';
  status: 'active' | 'outOfStock' | 'expired' | 'pending';
  commission: number;
  commissionType: 'percentage' | 'fixed';
  clicks: number;
  conversions: number;
  revenue: number;
  image: string;
}

export function IndustrialAffiliations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('reference');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showNewPartnerModal, setShowNewPartnerModal] = useState(false);

  // KPI Data
  const kpis = [
    {
      id: 'commission',
      label: 'Commission Totale',
      value: '24,850€',
      period: 'Ce mois',
      change: 12.5,
      icon: DollarSign,
      color: 'green',
      trend: 'up',
    },
    {
      id: 'clicks',
      label: 'Clics Affiliés',
      value: '3,842',
      subtitle: 'Taux conversion: 4.2%',
      change: 8.3,
      icon: MousePointer,
      color: 'blue',
      trend: 'up',
    },
    {
      id: 'products',
      label: 'Produits Actifs',
      value: '156/200',
      subtitle: 'Rupture: 12 | Expirés: 32',
      change: -2.1,
      icon: Package,
      color: 'orange',
      trend: 'down',
    },
    {
      id: 'partners',
      label: 'Partenaires Actifs',
      value: '24',
      subtitle: 'Nouveaux ce mois: 3',
      change: 15.0,
      icon: Users,
      color: 'purple',
      trend: 'up',
    },
  ];

  // Products Data
  const products: AffiliateProduct[] = [
    {
      id: '1',
      reference: 'PDI-2024-001',
      name: 'Roulement à billes industriel SKF',
      brand: 'SKF',
      brandLogo: '🔩',
      sector: 'parts',
      status: 'active',
      commission: 8,
      commissionType: 'percentage',
      clicks: 342,
      conversions: 28,
      revenue: 2840,
      image: '⚙️',
    },
    {
      id: '2',
      reference: 'MEC-2024-045',
      name: 'Lave-linge industriel 15kg',
      brand: 'Miele Professional',
      brandLogo: '🏠',
      sector: 'appliances',
      status: 'active',
      commission: 5,
      commissionType: 'percentage',
      clicks: 567,
      conversions: 34,
      revenue: 5890,
      image: '🔄',
    },
    {
      id: '3',
      reference: 'CON-2024-128',
      name: 'Bétonnière 350L diesel',
      brand: 'IMER Group',
      brandLogo: '🏗️',
      sector: 'construction',
      status: 'active',
      commission: 12,
      commissionType: 'percentage',
      clicks: 234,
      conversions: 18,
      revenue: 4320,
      image: '🚧',
    },
    {
      id: '4',
      reference: 'AGR-2024-056',
      name: 'Pulvérisateur tracteur 2000L',
      brand: 'Berthoud',
      brandLogo: '🚜',
      sector: 'agricultural',
      status: 'active',
      commission: 10,
      commissionType: 'percentage',
      clicks: 445,
      conversions: 42,
      revenue: 8400,
      image: '💧',
    },
    {
      id: '5',
      reference: 'PDI-2024-089',
      name: 'Kit courroie de distribution',
      brand: 'Gates',
      brandLogo: '🔩',
      sector: 'parts',
      status: 'outOfStock',
      commission: 7,
      commissionType: 'percentage',
      clicks: 156,
      conversions: 0,
      revenue: 0,
      image: '⚙️',
    },
    {
      id: '6',
      reference: 'CON-2024-201',
      name: 'Marteau piqueur électrique',
      brand: 'Makita',
      brandLogo: '🔨',
      sector: 'construction',
      status: 'expired',
      commission: 8.5,
      commissionType: 'percentage',
      clicks: 89,
      conversions: 3,
      revenue: 270,
      image: '🔨',
    },
  ];

  // Partners Data
  const partners = [
    { name: 'Caterpillar', level: 'gold', products: 45, score: 98 },
    { name: 'Siemens', level: 'gold', products: 38, score: 95 },
    { name: 'Bosch Professional', level: 'gold', products: 52, score: 93 },
    { name: 'SKF', level: 'silver', products: 28, score: 88 },
    { name: 'ABB', level: 'silver', products: 31, score: 85 },
    { name: 'Schneider Electric', level: 'silver', products: 24, score: 82 },
    { name: 'Makita', level: 'bronze', products: 18, score: 78 },
    { name: 'Metabo', level: 'bronze', products: 15, score: 75 },
  ];

  const getSectorConfig = (sector: string) => {
    const configs: { [key: string]: { icon: any; label: string; color: string; bgColor: string } } =
      {
        parts: {
          icon: Wrench,
          label: 'Pièces',
          color: 'text-gray-700',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
        },
        appliances: {
          icon: Home,
          label: 'Électroménager',
          color: 'text-purple-700',
          bgColor: 'bg-purple-100 dark:bg-purple-900/20',
        },
        construction: {
          icon: Hammer,
          label: 'Construction',
          color: 'text-orange-700',
          bgColor: 'bg-orange-100 dark:bg-orange-900/20',
        },
        agricultural: {
          icon: Tractor,
          label: 'Agricole',
          color: 'text-green-700',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
        },
        other: {
          icon: Package,
          label: 'Autre',
          color: 'text-blue-700',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        },
      };
    return configs[sector] || configs.other;
  };

  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: { icon: any; label: string; color: string; bgColor: string } } =
      {
        active: {
          icon: CheckCircle,
          label: 'Actif',
          color: 'text-green-700',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
        },
        outOfStock: {
          icon: AlertTriangle,
          label: 'Rupture',
          color: 'text-orange-700',
          bgColor: 'bg-orange-100 dark:bg-orange-900/20',
        },
        expired: {
          icon: XCircle,
          label: 'Expiré',
          color: 'text-red-700',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
        },
        pending: {
          icon: Clock,
          label: 'En attente',
          color: 'text-gray-700',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
        },
      };
    return configs[status] || configs.pending;
  };

  const getPartnerLevelBadge = (level: string) => {
    const configs: { [key: string]: { icon: string; color: string; bgColor: string } } = {
      gold: {
        icon: '🥇',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      },
      silver: { icon: '🥈', color: 'text-gray-700', bgColor: 'bg-gray-100 dark:bg-gray-800' },
      bronze: {
        icon: '🥉',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      },
    };
    return configs[level] || configs.bronze;
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

  const handleSelectProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleCopyLink = (product: AffiliateProduct) => {
    toast.success(`Lien d'affiliation copié pour ${product.name}`);
  };

  const handleExport = (format: string) => {
    toast.success(`Export ${format.toUpperCase()} en cours...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground mb-2">
            Admin &gt; Affiliations Industrielles
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Partenariats Industriels
          </h1>
          <p className="text-muted-foreground mt-1">
            Tableau de bord B2B - Pièces, Machines, Construction
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2 ${
              showFilters ? 'bg-muted' : ''
            }`}
          >
            <Filter className="h-4 w-4" />
            Filtres Avancés
          </button>

          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>

          <button
            onClick={() => setShowNewPartnerModal(true)}
            className="px-6 py-2 bg-[#2A5C8B] text-white rounded-lg hover:bg-[#1F4566] transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus className="h-5 w-5" />
            Nouveau Partenariat
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher produit, marque, référence..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A5C8B] bg-background"
        />
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-card border rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sector Filter */}
            <div>
              <label className="block text-sm font-medium mb-3">Secteur Industriel</label>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'Tous les secteurs' },
                  { value: 'parts', label: 'Pièces détachées' },
                  { value: 'appliances', label: 'Électroménager' },
                  { value: 'construction', label: 'Construction' },
                  { value: 'agricultural', label: 'Agricole' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sector"
                      value={option.value}
                      checked={selectedSector === option.value}
                      onChange={(e) => setSelectedSector(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium mb-3">Statut Produit</label>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'Tous les statuts' },
                  { value: 'active', label: 'Actif' },
                  { value: 'outOfStock', label: 'En rupture' },
                  { value: 'expired', label: 'Expiré' },
                  { value: 'pending', label: 'En attente' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={selectedStatus === option.value}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Commission Filter */}
            <div>
              <label className="block text-sm font-medium mb-3">Commission</label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Minimum: 1%</label>
                  <input type="range" min="1" max="20" defaultValue="1" className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Maximum: 20%</label>
                  <input type="range" min="1" max="20" defaultValue="20" className="w-full" />
                </div>
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium mb-3">Période</label>
              <select className="w-full px-3 py-2 border rounded-lg bg-background">
                <option>Derniers 7 jours</option>
                <option>Derniers 30 jours</option>
                <option>Derniers 90 jours</option>
                <option>Personnalisée</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-6 py-2 bg-[#2A5C8B] text-white rounded-lg hover:bg-[#1F4566] transition-colors font-semibold">
              Appliquer filtres
            </button>
            <button
              onClick={() => {
                setSelectedSector('all');
                setSelectedStatus('all');
              }}
              className="px-6 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${kpi.color}-100 dark:bg-${kpi.color}-900/20`}>
                  <Icon className={`h-6 w-6 text-${kpi.color}-600`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {Math.abs(kpi.change)}%
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">{kpi.label}</div>
                <div className="text-3xl font-bold">{kpi.value}</div>
                {kpi.subtitle && (
                  <div className="text-xs text-muted-foreground">{kpi.subtitle}</div>
                )}
                {kpi.period && <div className="text-xs text-muted-foreground">{kpi.period}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Revenus Affiliations - 30 derniers jours</h3>
            <button className="text-sm text-muted-foreground hover:text-foreground">
              <Download className="h-4 w-4" />
            </button>
          </div>

          <div className="h-64 flex items-end justify-around gap-2">
            {[45, 62, 58, 73, 81, 69, 95, 88, 76, 92, 85, 78, 91, 84].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-[#2A5C8B] to-[#3A7D5F] rounded-t transition-all hover:opacity-80 cursor-pointer"
                  style={{ height: `${value}%` }}
                  title={`${value * 100}€`}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#2A5C8B] rounded"></div>
              <span className="text-muted-foreground">Revenus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#3A7D5F] rounded"></div>
              <span className="text-muted-foreground">Commissions</span>
            </div>
          </div>
        </div>

        {/* Sector Performance */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Performance par Secteur</h3>

          <div className="space-y-4">
            {[
              { sector: 'Pièces', clicks: 892, conversions: 78, revenue: 8950, color: 'gray' },
              { sector: 'Machines', clicks: 567, conversions: 34, revenue: 5890, color: 'purple' },
              {
                sector: 'Construction',
                clicks: 445,
                conversions: 42,
                revenue: 8400,
                color: 'orange',
              },
              { sector: 'Agricole', clicks: 678, conversions: 51, revenue: 12450, color: 'green' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.sector}</span>
                  <span className="text-sm font-bold">{item.revenue.toLocaleString()}€</span>
                </div>
                <div className="flex gap-2">
                  <div
                    className={`h-2 bg-${item.color}-500 rounded`}
                    style={{ width: `${(item.clicks / 1000) * 100}%` }}
                  />
                  <div
                    className={`h-2 bg-${item.color}-300 rounded`}
                    style={{ width: `${(item.conversions / 100) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span>{item.clicks} clics</span>
                  <span>{item.conversions} conversions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Produits Affiliés</h3>
            <div className="text-sm text-muted-foreground">
              {selectedProducts.length > 0 && `${selectedProducts.length} sélectionné(s)`}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Produit</th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted-foreground/10"
                  onClick={() => handleSort('reference')}
                >
                  Référence
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Marque</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Secteur</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Commission</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Clics/Conv.</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const sectorConfig = getSectorConfig(product.sector);
                const statusConfig = getStatusConfig(product.status);
                const SectorIcon = sectorConfig.icon;
                const StatusIcon = statusConfig.icon;

                return (
                  <tr
                    key={product.id}
                    className={`border-t hover:bg-muted/50 transition-colors ${
                      selectedProducts.includes(product.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-2xl">
                          {product.image}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {product.reference}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{product.brandLogo}</span>
                        <span className="text-sm font-medium">{product.brand}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${sectorConfig.color} ${sectorConfig.bgColor}`}
                      >
                        <SectorIcon className="h-3 w-3" />
                        {sectorConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${statusConfig.color} ${statusConfig.bgColor}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold">
                        {product.commission}
                        {product.commissionType === 'percentage' ? '%' : '€'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <span className="font-semibold">{product.clicks}</span>
                        <span className="text-muted-foreground"> / </span>
                        <span className="font-semibold text-green-600">{product.conversions}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((product.conversions / product.clicks) * 100).toFixed(1)}% taux
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyLink(product)}
                          className="p-1 hover:bg-muted rounded"
                          title="Copier lien"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Éditer">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Statistiques">
                          <BarChart3 className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Plus">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
          <div>Affichage de {products.length} produits</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded hover:bg-muted">Précédent</button>
            <button className="px-3 py-1 bg-[#2A5C8B] text-white rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-muted">2</button>
            <button className="px-3 py-1 border rounded hover:bg-muted">3</button>
            <button className="px-3 py-1 border rounded hover:bg-muted">Suivant</button>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Marques Partenaires</h3>
          <button className="text-sm text-[#2A5C8B] hover:underline flex items-center gap-1">
            Voir toutes les marques
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {partners.map((partner, index) => {
            const badge = getPartnerLevelBadge(partner.level);
            return (
              <div
                key={index}
                className="relative group border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="text-center">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold mb-2 ${badge.color} ${badge.bgColor}`}
                  >
                    <span>{badge.icon}</span>
                    <span className="uppercase">{partner.level}</span>
                  </div>
                  <div className="font-semibold text-sm mb-1">{partner.name}</div>
                  <div className="text-xs text-muted-foreground">{partner.products} produits</div>
                  <div className="text-xs text-muted-foreground">Score: {partner.score}/100</div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#2A5C8B] rounded-lg opacity-0 group-hover:opacity-95 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center p-3">
                    <div className="font-semibold mb-2">{partner.name}</div>
                    <div className="text-xs space-y-1">
                      <div>Niveau: {partner.level.toUpperCase()}</div>
                      <div>{partner.products} produits actifs</div>
                      <div>Performance: {partner.score}/100</div>
                    </div>
                    <button className="mt-3 px-3 py-1 bg-white text-[#2A5C8B] rounded text-xs font-semibold hover:bg-gray-100">
                      Voir détails
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Partnership Modal */}
      {showNewPartnerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-card">
              <h3 className="text-xl font-bold">Nouveau Partenariat Industriel</h3>
              <button
                onClick={() => setShowNewPartnerModal(false)}
                className="p-2 hover:bg-muted rounded"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Step 1: Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Type de partenariat</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'b2b', label: 'Partenariat B2B', icon: Building2 },
                    { value: 'product', label: 'Produit individuel', icon: Package },
                    { value: 'program', label: 'Programme affiliation', icon: Award },
                  ].map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        className="p-4 border-2 rounded-lg hover:border-[#2A5C8B] transition-colors text-center"
                      >
                        <Icon className="h-8 w-8 mx-auto mb-2 text-[#2A5C8B]" />
                        <div className="text-sm font-medium">{type.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Brand Info */}
              <div className="space-y-4">
                <h4 className="font-semibold">Informations marque</h4>

                <div>
                  <label className="block text-sm font-medium mb-2">Logo entreprise</label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Cliquez ou glissez pour uploader
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom entreprise</label>
                    <input
                      type="text"
                      placeholder="Ex: SKF, Bosch..."
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A5C8B] bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Secteur</label>
                    <select className="w-full px-3 py-2 border rounded-lg bg-background">
                      <option>Pièces détachées</option>
                      <option>Électroménager</option>
                      <option>Construction</option>
                      <option>Agricole</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Site web</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A5C8B] bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Contact commercial</label>
                    <input
                      type="email"
                      placeholder="contact@entreprise.com"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A5C8B] bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Commission */}
              <div className="space-y-4">
                <h4 className="font-semibold">Conditions de commission</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type de commission</label>
                    <select className="w-full px-3 py-2 border rounded-lg bg-background">
                      <option>Pourcentage (%)</option>
                      <option>Montant fixe (€)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Montant</label>
                    <input
                      type="number"
                      placeholder="8"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A5C8B] bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Délai de paiement</label>
                    <select className="w-full px-3 py-2 border rounded-lg bg-background">
                      <option>30 jours</option>
                      <option>60 jours</option>
                      <option>90 jours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex items-center justify-between">
              <button
                onClick={() => setShowNewPartnerModal(false)}
                className="px-6 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  toast.success('Partenariat créé avec succès !');
                  setShowNewPartnerModal(false);
                }}
                className="px-6 py-2 bg-[#2A5C8B] text-white rounded-lg hover:bg-[#1F4566] transition-colors font-semibold"
              >
                Créer le partenariat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
