import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  BarChart3,
  PieChart,
  FileText,
  Download,
  Send,
  Plus,
  Search,
  Filter,
  Calendar,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  Wallet,
  Calculator,
  Building2,
  Brain,
  Sparkles,
  Target,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  dueDate: string;
  issueDate: string;
  items: number;
}

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
}

interface FinancialForecast {
  period: string;
  revenue: {
    predicted: number;
    confidence: number;
    min: number;
    max: number;
  };
  costs: {
    predicted: number;
    confidence: number;
    min: number;
    max: number;
  };
  profit: {
    predicted: number;
    margin: number;
  };
  insights: string[];
}

interface ScenarioAnalysis {
  name: string;
  probability: number;
  revenue: number;
  costs: number;
  profit: number;
  roi: number;
}

interface CropProfitability {
  crop: string;
  area: number;
  revenue: number;
  costs: {
    seeds: number;
    fertilizer: number;
    labor: number;
    equipment: number;
    other: number;
  };
  profit: number;
  margin: number;
  breakEven: {
    units: number;
    price: number;
    reached: boolean;
  };
  trend: number;
}

interface ComparativeAnalysis {
  period: string;
  crops: {
    name: string;
    profit: number;
    margin: number;
  }[];
}

interface TaxReport {
  year: number;
  period: string;
  revenue: number;
  deductibleExpenses: number;
  taxableIncome: number;
  taxRate: number;
  taxDue: number;
  credits: number;
  netTax: number;
  status: 'draft' | 'filed' | 'paid' | 'overdue';
  dueDate: string;
}

interface TaxCategory {
  category: string;
  amount: number;
  deductible: boolean;
  percentage: number;
}

interface CashFlowEntry {
  id: string;
  date: string;
  type: 'inflow' | 'outflow';
  category: string;
  amount: number;
  balance: number;
  status: 'completed' | 'pending' | 'scheduled';
  description: string;
}

interface LiquidityAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  threshold: number;
  currentValue: number;
  date: string;
  action: string;
}

export function FinancialSuite() {
  const [activeView, setActiveView] = useState<
    | 'overview'
    | 'billing'
    | 'costs'
    | 'revenue'
    | 'roi'
    | 'reports'
    | 'forecast'
    | 'profitability'
    | 'tax'
    | 'cashflow'
  >('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [forecastHorizon, setForecastHorizon] = useState<'3months' | '6months' | '12months'>(
    '6months'
  );
  const [generatingForecast, setGeneratingForecast] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [selectedTaxYear, setSelectedTaxYear] = useState(2024);
  const [generatingTaxReport, setGeneratingTaxReport] = useState(false);

  // KPIs Data
  const kpis = [
    {
      id: 'revenue',
      label: "Chiffre d'Affaires",
      value: '245,850€',
      change: 15,
      icon: DollarSign,
      color: 'green',
      trend: 'up',
      subtitle: 'Ce mois',
    },
    {
      id: 'costs',
      label: 'Coûts Opérationnels',
      value: '128,430€',
      change: -3,
      icon: TrendingDown,
      color: 'red',
      trend: 'down',
      subtitle: 'Réduction de 3%',
    },
    {
      id: 'margin',
      label: 'Marge Brute',
      value: '47.8%',
      change: 2.1,
      icon: PieChart,
      color: 'blue',
      trend: 'up',
      subtitle: '+2.1 points',
    },
    {
      id: 'cash',
      label: 'Trésorerie',
      value: '89,240€',
      change: 8,
      icon: Wallet,
      color: 'purple',
      trend: 'up',
      subtitle: 'Disponible',
    },
  ];

  // Invoices Data
  const invoices: Invoice[] = [
    {
      id: 'INV-2025-001',
      client: 'Ferme Dupont SARL',
      amount: 12500,
      status: 'paid',
      dueDate: '2025-01-10',
      issueDate: '2025-01-01',
      items: 5,
    },
    {
      id: 'INV-2025-002',
      client: 'Coopérative Nord Agriculture',
      amount: 8750,
      status: 'pending',
      dueDate: '2025-02-15',
      issueDate: '2025-01-15',
      items: 3,
    },
    {
      id: 'INV-2025-003',
      client: 'AgriTech Solutions',
      amount: 5200,
      status: 'overdue',
      dueDate: '2025-01-05',
      issueDate: '2024-12-20',
      items: 2,
    },
    {
      id: 'INV-2025-004',
      client: 'Exploitation Martin',
      amount: 15800,
      status: 'draft',
      dueDate: '2025-02-28',
      issueDate: '2025-01-20',
      items: 7,
    },
  ];

  // Cost Categories
  const costCategories = [
    { category: 'Personnel', budget: 45000, actual: 43200, variance: -4 },
    { category: 'Équipement', budget: 28000, actual: 31500, variance: 12.5 },
    { category: 'Intrants', budget: 35000, actual: 33800, variance: -3.4 },
    { category: 'Maintenance', budget: 12000, actual: 11200, variance: -6.7 },
    { category: 'Logistique', budget: 8500, actual: 8730, variance: 2.7 },
  ];

  // Revenue Sources
  const revenueSources = [
    { source: 'Abonnements', amount: 95400, percentage: 38.8, trend: 12 },
    { source: 'Commissions', amount: 78200, percentage: 31.8, trend: 18 },
    { source: 'Ventes', amount: 52100, percentage: 21.2, trend: 8 },
    { source: 'Services', amount: 20150, percentage: 8.2, trend: 25 },
  ];

  // Financial Forecasts
  const forecasts: FinancialForecast[] = [
    {
      period: 'Fév 2025',
      revenue: { predicted: 258400, confidence: 89, min: 242000, max: 275000 },
      costs: { predicted: 131200, confidence: 92, min: 125000, max: 138000 },
      profit: { predicted: 127200, margin: 49.2 },
      insights: [
        'Croissance soutenue des abonnements (+12%)',
        'Réduction des coûts logistiques attendue',
        'Nouvelles opportunités marché identifiées',
      ],
    },
    {
      period: 'Mar 2025',
      revenue: { predicted: 272100, confidence: 87, min: 254000, max: 290000 },
      costs: { predicted: 135800, confidence: 90, min: 129000, max: 143000 },
      profit: { predicted: 136300, margin: 50.1 },
      insights: [
        'Pic saisonnier prévu pour la période',
        'Augmentation commissions marché (+8%)',
        'Investissements planifiés en équipement',
      ],
    },
    {
      period: 'Avr 2025',
      revenue: { predicted: 285600, confidence: 85, min: 268000, max: 303000 },
      costs: { predicted: 139500, confidence: 88, min: 132000, max: 147000 },
      profit: { predicted: 146100, margin: 51.2 },
      insights: [
        'Expansion géographique impactant positivement',
        'Partenariats stratégiques en développement',
        'Optimisation processus opérationnels',
      ],
    },
    {
      period: 'Mai 2025',
      revenue: { predicted: 298800, confidence: 83, min: 280000, max: 318000 },
      costs: { predicted: 143200, confidence: 86, min: 136000, max: 151000 },
      profit: { predicted: 155600, margin: 52.1 },
      insights: [
        'Forte demande services additionnels',
        "Économies d'échelle commencent à opérer",
        'Nouveaux produits lancés avec succès',
      ],
    },
    {
      period: 'Juin 2025',
      revenue: { predicted: 312400, confidence: 81, min: 293000, max: 332000 },
      costs: { predicted: 147100, confidence: 84, min: 140000, max: 155000 },
      profit: { predicted: 165300, margin: 52.9 },
      insights: [
        'Consolidation position marché attendue',
        'Automatisation réduisant coûts variables',
        'ROI investissements précédents visible',
      ],
    },
    {
      period: 'Juil 2025',
      revenue: { predicted: 326200, confidence: 79, min: 306000, max: 347000 },
      costs: { predicted: 151400, confidence: 82, min: 144000, max: 159000 },
      profit: { predicted: 174800, margin: 53.6 },
      insights: [
        "Tendance haussière confirmée sur l'année",
        'Marges brutes améliorées significativement',
        'Trésorerie solide pour nouveaux projets',
      ],
    },
  ];

  // Scenario Analysis
  const scenarios: ScenarioAnalysis[] = [
    {
      name: 'Scénario Optimiste',
      probability: 25,
      revenue: 1950000,
      costs: 890000,
      profit: 1060000,
      roi: 54.4,
    },
    {
      name: 'Scénario Réaliste',
      probability: 55,
      revenue: 1753000,
      costs: 850000,
      profit: 903000,
      roi: 51.5,
    },
    {
      name: 'Scénario Prudent',
      probability: 20,
      revenue: 1580000,
      costs: 820000,
      profit: 760000,
      roi: 48.1,
    },
  ];

  // Crop Profitability Analysis
  const cropProfitability: CropProfitability[] = [
    {
      crop: 'Maïs',
      area: 45,
      revenue: 125400,
      costs: {
        seeds: 12500,
        fertilizer: 18200,
        labor: 22000,
        equipment: 15800,
        other: 8500,
      },
      profit: 48400,
      margin: 38.6,
      breakEven: { units: 1850, price: 41.5, reached: true },
      trend: 12,
    },
    {
      crop: 'Blé',
      area: 38,
      revenue: 98600,
      costs: {
        seeds: 9800,
        fertilizer: 14500,
        labor: 18500,
        equipment: 13200,
        other: 6800,
      },
      profit: 35800,
      margin: 36.3,
      breakEven: { units: 1650, price: 38.2, reached: true },
      trend: 8,
    },
    {
      crop: 'Tomates',
      area: 12,
      revenue: 156800,
      costs: {
        seeds: 8200,
        fertilizer: 22500,
        labor: 45000,
        equipment: 18000,
        other: 12300,
      },
      profit: 50800,
      margin: 32.4,
      breakEven: { units: 3280, price: 32.5, reached: true },
      trend: 18,
    },
    {
      crop: 'Soja',
      area: 28,
      revenue: 72400,
      costs: {
        seeds: 7800,
        fertilizer: 12000,
        labor: 15500,
        equipment: 11200,
        other: 5500,
      },
      profit: 20400,
      margin: 28.2,
      breakEven: { units: 1420, price: 36.6, reached: true },
      trend: -3,
    },
  ];

  // Comparative Analysis Data
  const comparativeAnalysis: ComparativeAnalysis[] = [
    {
      period: 'Jan 2025',
      crops: [
        { name: 'Maïs', profit: 42000, margin: 36.5 },
        { name: 'Blé', profit: 31200, margin: 34.8 },
        { name: 'Tomates', profit: 45600, margin: 30.2 },
        { name: 'Soja', profit: 18500, margin: 26.8 },
      ],
    },
    {
      period: 'Fév 2025',
      crops: [
        { name: 'Maïs', profit: 44800, margin: 37.2 },
        { name: 'Blé', profit: 33100, margin: 35.5 },
        { name: 'Tomates', profit: 47200, margin: 31.1 },
        { name: 'Soja', profit: 19800, margin: 27.5 },
      ],
    },
    {
      period: 'Mar 2025',
      crops: [
        { name: 'Maïs', profit: 48400, margin: 38.6 },
        { name: 'Blé', profit: 35800, margin: 36.3 },
        { name: 'Tomates', profit: 50800, margin: 32.4 },
        { name: 'Soja', profit: 20400, margin: 28.2 },
      ],
    },
  ];

  // Tax Reports Data
  const taxReports: TaxReport[] = [
    {
      year: 2024,
      period: 'Année Fiscale 2024',
      revenue: 2945000,
      deductibleExpenses: 1540000,
      taxableIncome: 1405000,
      taxRate: 25,
      taxDue: 351250,
      credits: 18500,
      netTax: 332750,
      status: 'filed',
      dueDate: '2025-03-15',
    },
    {
      year: 2023,
      period: 'Année Fiscale 2023',
      revenue: 2680000,
      deductibleExpenses: 1420000,
      taxableIncome: 1260000,
      taxRate: 25,
      taxDue: 315000,
      credits: 15200,
      netTax: 299800,
      status: 'paid',
      dueDate: '2024-03-15',
    },
    {
      year: 2025,
      period: 'Année Fiscale 2025 (Prévisionnel)',
      revenue: 3150000,
      deductibleExpenses: 1620000,
      taxableIncome: 1530000,
      taxRate: 25,
      taxDue: 382500,
      credits: 21000,
      netTax: 361500,
      status: 'draft',
      dueDate: '2026-03-15',
    },
  ];

  // Tax Categories
  const taxCategories: TaxCategory[] = [
    { category: 'Coûts Opérationnels', amount: 854000, deductible: true, percentage: 55.5 },
    { category: 'Salaires & Charges', amount: 420000, deductible: true, percentage: 27.3 },
    { category: 'Amortissements', amount: 186000, deductible: true, percentage: 12.1 },
    { category: "Intérêts d'Emprunt", amount: 52000, deductible: true, percentage: 3.4 },
    { category: 'Autres Déductions', amount: 28000, deductible: true, percentage: 1.8 },
  ];

  // Cash Flow Entries
  const cashFlowEntries: CashFlowEntry[] = [
    {
      id: 'CF-001',
      date: '2025-01-16',
      type: 'inflow',
      category: 'Vente Produits',
      amount: 45800,
      balance: 89240,
      status: 'completed',
      description: 'Vente céréales - Coopérative Nord',
    },
    {
      id: 'CF-002',
      date: '2025-01-15',
      type: 'outflow',
      category: 'Fournisseurs',
      amount: -12500,
      balance: 43440,
      status: 'completed',
      description: 'Achat engrais - AgriSupply',
    },
    {
      id: 'CF-003',
      date: '2025-01-14',
      type: 'inflow',
      category: 'Subventions',
      amount: 28000,
      balance: 55940,
      status: 'completed',
      description: 'Aide PAC - Aides directes',
    },
    {
      id: 'CF-004',
      date: '2025-01-13',
      type: 'outflow',
      category: 'Salaires',
      amount: -35000,
      balance: 27940,
      status: 'completed',
      description: 'Paie mensuelle personnel',
    },
    {
      id: 'CF-005',
      date: '2025-01-18',
      type: 'inflow',
      category: 'Services',
      amount: 8500,
      balance: 97740,
      status: 'pending',
      description: 'Prestation conseil - AgroTech',
    },
    {
      id: 'CF-006',
      date: '2025-01-20',
      type: 'outflow',
      category: 'Équipement',
      amount: -18200,
      balance: 79540,
      status: 'scheduled',
      description: 'Maintenance tracteur - MaintenanceAgri',
    },
  ];

  // Liquidity Alerts
  const liquidityAlerts: LiquidityAlert[] = [
    {
      id: 'ALERT-001',
      type: 'info',
      message: 'Trésorerie en bonne santé',
      threshold: 50000,
      currentValue: 89240,
      date: "Aujourd'hui",
      action: 'Aucune action requise',
    },
    {
      id: 'ALERT-002',
      type: 'warning',
      message: 'Échéance importante dans 7 jours',
      threshold: 35000,
      currentValue: 35000,
      date: '23 Jan 2025',
      action: 'Prévoir paiement salaires',
    },
    {
      id: 'ALERT-003',
      type: 'info',
      message: 'Rentrée de fonds prévue sous 3 jours',
      threshold: 0,
      currentValue: 45800,
      date: '19 Jan 2025',
      action: 'Facture INV-2025-002 à encaisser',
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: { icon: any; label: string; color: string; bgColor: string } } =
      {
        paid: {
          icon: CheckCircle,
          label: 'Payée',
          color: 'text-green-700',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
        },
        pending: {
          icon: Clock,
          label: 'En attente',
          color: 'text-orange-700',
          bgColor: 'bg-orange-100 dark:bg-orange-900/20',
        },
        overdue: {
          icon: AlertCircle,
          label: 'En retard',
          color: 'text-red-700',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
        },
        draft: {
          icon: FileText,
          label: 'Brouillon',
          color: 'text-gray-700',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
        },
      };
    return configs[status];
  };

  const generateNewForecast = async () => {
    setGeneratingForecast(true);
    toast.info('Génération de prévisions financières IA...');

    // Simulate AI forecast generation (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setGeneratingForecast(false);
    toast.success('Prévisions financières générées avec succès!', {
      description: `${forecasts.length} périodes analysées avec confiance moyenne de 85%`,
    });
  };

  const generateTaxReport = async () => {
    setGeneratingTaxReport(true);
    toast.info(`Génération du rapport fiscal ${selectedTaxYear}...`);

    // Simulate tax report generation (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setGeneratingTaxReport(false);
    toast.success('Rapport fiscal généré avec succès!', {
      description: 'Calculs fiscaux validés et prêts pour export',
    });
  };

  const getTaxStatusConfig = (status: string) => {
    const configs: { [key: string]: { icon: any; label: string; color: string; bgColor: string } } =
      {
        draft: {
          icon: FileText,
          label: 'Brouillon',
          color: 'text-gray-700',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
        },
        filed: {
          icon: Send,
          label: 'Déclaré',
          color: 'text-blue-700',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        },
        paid: {
          icon: CheckCircle,
          label: 'Payé',
          color: 'text-green-700',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
        },
        overdue: {
          icon: AlertCircle,
          label: 'En retard',
          color: 'text-red-700',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
        },
      };
    return configs[status];
  };

  const renderOverview = () => (
    <div className="space-y-6">
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
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    (kpi.trend === 'up' && kpi.id !== 'costs') ||
                    (kpi.trend === 'down' && kpi.id === 'costs')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(kpi.change)}%
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">{kpi.label}</div>
                <div className="text-3xl font-bold">{kpi.value}</div>
                <div className="text-xs text-muted-foreground">{kpi.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue vs Expenses Chart */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Revenus vs Dépenses - 6 Derniers Mois</h3>
        <div className="h-64 flex items-end justify-around gap-3">
          {[
            { month: 'Juil', revenue: 82, expense: 65 },
            { month: 'Août', revenue: 88, expense: 62 },
            { month: 'Sep', revenue: 78, expense: 68 },
            { month: 'Oct', revenue: 92, expense: 64 },
            { month: 'Nov', revenue: 85, expense: 66 },
            { month: 'Déc', revenue: 95, expense: 58 },
          ].map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex gap-1">
                <div
                  className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all hover:opacity-80 cursor-pointer"
                  style={{ height: `${data.revenue * 2.5}px` }}
                  title={`Revenus: ${data.revenue}k€`}
                />
                <div
                  className="flex-1 bg-gradient-to-t from-red-500 to-red-400 rounded-t transition-all hover:opacity-80 cursor-pointer"
                  style={{ height: `${data.expense * 2.5}px` }}
                  title={`Dépenses: ${data.expense}k€`}
                />
              </div>
              <div className="text-xs font-medium text-muted-foreground">{data.month}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-muted-foreground">Revenus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-muted-foreground">Dépenses</span>
          </div>
        </div>
      </div>

      {/* Cash Flow & Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Cash Flow Mensuel</h3>
          <div className="space-y-3">
            {[
              { label: 'Solde initial', value: 65240, type: 'neutral' },
              { label: 'Entrées', value: 95850, type: 'positive' },
              { label: 'Sorties', value: -71850, type: 'negative' },
              { label: 'Solde final', value: 89240, type: 'neutral' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <span className="font-medium">{item.label}</span>
                <span
                  className={`text-lg font-bold ${
                    item.type === 'positive'
                      ? 'text-green-600'
                      : item.type === 'negative'
                      ? 'text-red-600'
                      : 'text-foreground'
                  }`}
                >
                  {item.value.toLocaleString()}€
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Répartition des Coûts</h3>
          <div className="space-y-3">
            {costCategories.map((cat, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className="text-sm font-bold">{cat.actual.toLocaleString()}€</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.variance < 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${(cat.actual / cat.budget) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Budget: {cat.budget.toLocaleString()}€ • Variance:{' '}
                  <span className={cat.variance < 0 ? 'text-green-600' : 'text-red-600'}>
                    {cat.variance > 0 ? '+' : ''}
                    {cat.variance}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Facturation & Paiements</h2>
          <p className="text-muted-foreground">Gérez vos factures et encaissements</p>
        </div>
        <button className="px-6 py-2 bg-[#C0392B] text-white rounded-lg hover:bg-[#A93226] transition-colors font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouvelle Facture
        </button>
      </div>

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total à recevoir', value: '24,500€', color: 'blue' },
          { label: 'En retard', value: '5,200€', color: 'red' },
          { label: 'Encaissé ce mois', value: '12,500€', color: 'green' },
          { label: 'Factures en attente', value: '3', color: 'orange' },
        ].map((stat, index) => (
          <div key={index} className="bg-card border rounded-xl p-4">
            <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
            <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Factures Récentes</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-background"
                />
              </div>
              <button className="p-2 border rounded-lg hover:bg-muted">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Numéro</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Client</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Montant</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date Émission</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Échéance</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const statusConfig = getStatusConfig(invoice.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={invoice.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{invoice.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{invoice.client}</div>
                      <div className="text-xs text-muted-foreground">{invoice.items} articles</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold">{invoice.amount.toLocaleString()}€</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${statusConfig.color} ${statusConfig.bgColor}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{invoice.issueDate}</td>
                    <td className="px-4 py-3 text-sm">{invoice.dueDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-muted rounded" title="Voir">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Éditer">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Envoyer">
                          <Send className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Télécharger">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCosts = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analyse des Coûts</h2>
        <p className="text-muted-foreground">Optimisez vos dépenses opérationnelles</p>
      </div>

      {/* Cost Analysis */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Budget vs Réel par Catégorie</h3>
        <div className="space-y-4">
          {costCategories.map((cat, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold">{cat.category}</div>
                  <div className="text-sm text-muted-foreground">
                    Variance:{' '}
                    <span
                      className={
                        cat.variance < 0
                          ? 'text-green-600 font-semibold'
                          : 'text-red-600 font-semibold'
                      }
                    >
                      {cat.variance > 0 ? '+' : ''}
                      {cat.variance}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{cat.actual.toLocaleString()}€</div>
                  <div className="text-sm text-muted-foreground">
                    Budget: {cat.budget.toLocaleString()}€
                  </div>
                </div>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gray-300 rounded-full"
                  style={{ width: '100%' }}
                />
                <div
                  className={`absolute top-0 left-0 h-full rounded-full ${
                    cat.variance < 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(cat.actual / cat.budget) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Simulator */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Simulateur d'Optimisation</h3>
        <div className="space-y-4">
          {costCategories.map((cat, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{cat.category}</span>
                <span className="text-sm font-bold">-10%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                defaultValue="10"
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#C0392B] [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-800 dark:text-green-200">
                Économies Potentielles
              </div>
              <div className="text-2xl font-bold text-green-600">-12,843€/mois</div>
            </div>
            <button className="px-4 py-2 bg-[#C0392B] text-white rounded-lg hover:bg-[#A93226] transition-colors font-semibold">
              Appliquer Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRevenue = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Suivi des Revenus</h2>
        <p className="text-muted-foreground">Analysez vos sources de revenus</p>
      </div>

      {/* Revenue Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueSources.map((source, index) => (
          <div key={index} className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <TrendingUp className="h-3 w-3" />
                {source.trend}%
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">{source.source}</div>
              <div className="text-2xl font-bold">{source.amount.toLocaleString()}€</div>
              <div className="text-xs text-muted-foreground">{source.percentage}% du total</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Trend */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Évolution des Revenus par Source</h3>
        <div className="h-64 flex items-end justify-around gap-2">
          {Array.from({ length: 12 }, (_, i) => {
            const values = revenueSources.map((s) => Math.random() * 30 + 50);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full space-y-0.5">
                  {values.map((val, idx) => (
                    <div
                      key={idx}
                      className="w-full bg-gradient-to-r from-green-500 to-green-400 rounded transition-all hover:opacity-80 cursor-pointer"
                      style={{ height: `${val}px` }}
                    />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">M{i + 1}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Clients */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Top 5 Clients</h3>
        <div className="space-y-3">
          {[
            { name: 'Coopérative Nord', revenue: 45800, orders: 23 },
            { name: 'Ferme Dupont', revenue: 38200, orders: 18 },
            { name: 'AgriTech Solutions', revenue: 32100, orders: 15 },
            { name: 'Exploitation Martin', revenue: 28500, orders: 12 },
            { name: 'BioFarm Corp', revenue: 24300, orders: 10 },
          ].map((client, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-xs text-muted-foreground">{client.orders} commandes</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{client.revenue.toLocaleString()}€</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderROI = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Calculateur de ROI</h2>
        <p className="text-muted-foreground">Évaluez la rentabilité de vos investissements</p>
      </div>

      {/* ROI Calculator */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Nouveau Calcul ROI</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Investissement Initial</label>
            <input
              type="number"
              defaultValue="50000"
              className="w-full px-3 py-2 border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Horizon (années)</label>
            <input
              type="number"
              defaultValue="3"
              className="w-full px-3 py-2 border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Retours Annuels Estimés</label>
            <input
              type="number"
              defaultValue="22000"
              className="w-full px-3 py-2 border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Taux d'Actualisation (%)</label>
            <input
              type="number"
              defaultValue="5"
              step="0.1"
              className="w-full px-3 py-2 border rounded-lg bg-background"
            />
          </div>
        </div>
        <button className="mt-6 w-full px-6 py-3 bg-[#C0392B] text-white rounded-lg hover:bg-[#A93226] transition-colors font-semibold flex items-center justify-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculer le ROI
        </button>
      </div>

      {/* ROI Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="text-sm opacity-90 mb-2">ROI Total</div>
          <div className="text-4xl font-bold mb-2">32%</div>
          <div className="text-sm opacity-90">Sur 3 ans</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="text-sm opacity-90 mb-2">Période de Récupération</div>
          <div className="text-4xl font-bold mb-2">2.3</div>
          <div className="text-sm opacity-90">Années</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="text-sm opacity-90 mb-2">TRI</div>
          <div className="text-4xl font-bold mb-2">18.5%</div>
          <div className="text-sm opacity-90">Taux Rentabilité Interne</div>
        </div>
      </div>

      {/* Cash Flow Projection */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Flux de Trésorerie Projeté</h3>
        <div className="h-64 flex items-end justify-around gap-2">
          {[-50, -28, -6, 16, 38, 60].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full h-full flex items-end">
                <div
                  className={`w-full rounded-t transition-all hover:opacity-80 cursor-pointer ${
                    value < 0 ? 'bg-red-500 self-end' : 'bg-green-500'
                  }`}
                  style={{
                    height: `${Math.abs(value) * 4}px`,
                    marginTop: value < 0 ? 'auto' : '0',
                  }}
                  title={`${value}k€`}
                />
              </div>
              <div className="text-xs font-medium text-muted-foreground mt-2">
                An {index === 0 ? '0' : index}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rapports Financiers</h2>
          <p className="text-muted-foreground">Générez et consultez vos rapports</p>
        </div>
        <button className="px-6 py-2 bg-[#C0392B] text-white rounded-lg hover:bg-[#A93226] transition-colors font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouveau Rapport
        </button>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Compte de Résultat', type: 'P&L', frequency: 'Mensuel' },
          { name: 'Bilan Comptable', type: 'Balance Sheet', frequency: 'Trimestriel' },
          { name: 'Tableau de Flux', type: 'Cash Flow', frequency: 'Mensuel' },
          { name: 'Rapport Fiscal', type: 'Tax Report', frequency: 'Annuel' },
          { name: 'Rapport Investisseurs', type: 'Investor Report', frequency: 'Trimestriel' },
          { name: 'Analyse Rentabilité', type: 'Profitability', frequency: 'Mensuel' },
        ].map((report, index) => (
          <div
            key={index}
            className="p-6 bg-card border-2 border-dashed rounded-xl hover:border-[#C0392B] hover:bg-red-50 dark:hover:bg-red-900/10 transition-all cursor-pointer"
          >
            <FileText className="h-10 w-10 text-[#C0392B] mb-3" />
            <h3 className="font-semibold text-lg mb-1">{report.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{report.type}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{report.frequency}</span>
              <button className="px-3 py-1 bg-[#C0392B] text-white rounded text-xs font-semibold hover:bg-[#A93226] transition-colors">
                Générer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Rapports Récents</h3>
        <div className="space-y-3">
          {[
            { name: 'P&L Décembre 2024', date: '2025-01-05', size: '245 KB' },
            { name: 'Cash Flow Q4 2024', date: '2025-01-02', size: '189 KB' },
            { name: 'Bilan 2024', date: '2024-12-31', size: '512 KB' },
          ].map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded">
                  <FileText className="h-5 w-5 text-[#C0392B]" />
                </div>
                <div>
                  <div className="font-medium">{report.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {report.date} • {report.size}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 border rounded hover:bg-muted">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 border rounded hover:bg-muted">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderForecast = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-7 w-7 text-purple-600" />
            Prévisions Financières IA
          </h2>
          <p className="text-muted-foreground">
            Projections basées sur l'analyse prédictive avancée
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={forecastHorizon}
            onChange={(e) => setForecastHorizon(e.target.value as any)}
            className="px-4 py-2 border rounded-lg bg-background"
          >
            <option value="3months">3 Mois</option>
            <option value="6months">6 Mois</option>
            <option value="12months">12 Mois</option>
          </select>
          <button
            onClick={generateNewForecast}
            disabled={generatingForecast}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className={`h-5 w-5 ${generatingForecast ? 'animate-spin' : ''}`} />
            {generatingForecast ? 'Génération...' : 'Nouvelle Prévision'}
          </button>
        </div>
      </div>

      {/* AI Forecast Banner */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-purple-900 dark:text-purple-100">
                Moteur de Prévision IA
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Analyse de 18 mois de données historiques • Confiance moyenne: 85% • Dernière mise à
                jour: Aujourd'hui
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Précision historique</div>
            <div className="text-3xl font-bold text-purple-600">92%</div>
          </div>
        </div>
      </div>

      {/* Forecast Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="h-5 w-5" />
            <span className="text-sm opacity-90">Revenus Prévus (6 mois)</span>
          </div>
          <div className="text-4xl font-bold mb-2">
            {forecasts.reduce((sum, f) => sum + f.revenue.predicted, 0).toLocaleString()}€
          </div>
          <div className="text-sm opacity-90">Confiance moyenne: 85%</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight className="h-5 w-5" />
            <span className="text-sm opacity-90">Coûts Prévus (6 mois)</span>
          </div>
          <div className="text-4xl font-bold mb-2">
            {forecasts.reduce((sum, f) => sum + f.costs.predicted, 0).toLocaleString()}€
          </div>
          <div className="text-sm opacity-90">Confiance moyenne: 88%</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm opacity-90">Profit Prévu (6 mois)</span>
          </div>
          <div className="text-4xl font-bold mb-2">
            {forecasts.reduce((sum, f) => sum + f.profit.predicted, 0).toLocaleString()}€
          </div>
          <div className="text-sm opacity-90">
            Marge:{' '}
            {(forecasts.reduce((sum, f) => sum + f.profit.margin, 0) / forecasts.length).toFixed(1)}
            %
          </div>
        </div>
      </div>

      {/* Detailed Forecasts */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Projections Détaillées par Période</h3>
        </div>
        <div className="divide-y">
          {forecasts.map((forecast, index) => (
            <div key={index} className="p-6 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold">{forecast.period}</h4>
                  <p className="text-sm text-muted-foreground">
                    Marge prévue: {forecast.profit.margin}%
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {forecast.profit.predicted.toLocaleString()}€
                  </div>
                  <div className="text-xs text-muted-foreground">Profit estimé</div>
                </div>
              </div>

              {/* Revenue & Costs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-900 dark:text-green-100">
                      Revenus
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded">
                      {forecast.revenue.confidence}% confiance
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400 mb-1">
                    {forecast.revenue.predicted.toLocaleString()}€
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Fourchette: {forecast.revenue.min.toLocaleString()}€ -{' '}
                    {forecast.revenue.max.toLocaleString()}€
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-900 dark:text-red-100">
                      Coûts
                    </span>
                    <span className="text-xs px-2 py-1 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded">
                      {forecast.costs.confidence}% confiance
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-400 mb-1">
                    {forecast.costs.predicted.toLocaleString()}€
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Fourchette: {forecast.costs.min.toLocaleString()}€ -{' '}
                    {forecast.costs.max.toLocaleString()}€
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="space-y-2">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Insights IA
                </div>
                <ul className="space-y-1">
                  {forecast.insights.map((insight, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Analysis */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <LineChart className="h-5 w-5 text-blue-600" />
          Analyse par Scénario (6 mois)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => (
            <div
              key={index}
              className={`p-6 border-2 rounded-xl ${
                scenario.name.includes('Réaliste')
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold">{scenario.name}</h4>
                <span className="text-xs px-2 py-1 bg-muted rounded">{scenario.probability}%</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Revenus</div>
                  <div className="text-xl font-bold text-green-600">
                    {scenario.revenue.toLocaleString()}€
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Coûts</div>
                  <div className="text-xl font-bold text-red-600">
                    {scenario.costs.toLocaleString()}€
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-xs text-muted-foreground mb-1">Profit Net</div>
                  <div className="text-2xl font-bold">{scenario.profit.toLocaleString()}€</div>
                  <div className="text-sm text-muted-foreground mt-1">ROI: {scenario.roi}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfitability = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analyse de Rentabilité par Culture</h2>
        <p className="text-muted-foreground">Marges, coûts détaillés et seuils de rentabilité</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cropProfitability.map((crop, index) => (
          <div
            key={index}
            onClick={() => setSelectedCrop(crop.crop)}
            className={`bg-card border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedCrop === crop.crop ? 'border-[#C0392B] bg-red-50 dark:bg-red-900/10' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{crop.crop}</h3>
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${
                  crop.trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {crop.trend >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(crop.trend)}%
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-muted-foreground">Profit</div>
                <div className="text-2xl font-bold text-green-600">
                  {crop.profit.toLocaleString()}€
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Marge</div>
                <div className="text-xl font-bold">{crop.margin}%</div>
              </div>
              <div className="text-xs text-muted-foreground">{crop.area} hectares</div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Analysis */}
      {selectedCrop && (
        <div className="bg-card border-2 border-[#C0392B] rounded-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{selectedCrop} - Analyse Détaillée</h3>
                <p className="text-muted-foreground">
                  {cropProfitability.find((c) => c.crop === selectedCrop)?.area} hectares
                </p>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>

          {cropProfitability
            .filter((c) => c.crop === selectedCrop)
            .map((crop, idx) => (
              <div key={idx} className="p-6 space-y-6">
                {/* Revenue & Costs Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="text-sm text-green-800 dark:text-green-200 mb-1">
                      Revenus Totaux
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {crop.revenue.toLocaleString()}€
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(crop.revenue / crop.area).toFixed(0)}€/ha
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="text-sm text-red-800 dark:text-red-200 mb-1">Coûts Totaux</div>
                    <div className="text-3xl font-bold text-red-600">
                      {Object.values(crop.costs)
                        .reduce((sum, val) => sum + val, 0)
                        .toLocaleString()}
                      €
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(
                        Object.values(crop.costs).reduce((sum, val) => sum + val, 0) / crop.area
                      ).toFixed(0)}
                      €/ha
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="text-sm text-blue-800 dark:text-blue-200 mb-1">Profit Net</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {crop.profit.toLocaleString()}€
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Marge: {crop.margin}%</div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div>
                  <h4 className="font-semibold mb-4">Répartition des Coûts</h4>
                  <div className="space-y-3">
                    {Object.entries(crop.costs).map(([category, amount]) => {
                      const totalCosts = Object.values(crop.costs).reduce(
                        (sum, val) => sum + val,
                        0
                      );
                      const percentage = ((amount / totalCosts) * 100).toFixed(1);
                      const categoryLabels: { [key: string]: string } = {
                        seeds: 'Semences',
                        fertilizer: 'Engrais',
                        labor: "Main-d'œuvre",
                        equipment: 'Équipement',
                        other: 'Autres',
                      };

                      return (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{categoryLabels[category]}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold">{amount.toLocaleString()}€</span>
                              <span className="text-xs text-muted-foreground">{percentage}%</span>
                            </div>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#C0392B] rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Break-Even Analysis */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-2 border-purple-200 dark:border-purple-800 rounded-lg">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Analyse du Seuil de Rentabilité
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Unités nécessaires</div>
                      <div className="text-2xl font-bold">
                        {crop.breakEven.units.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">unités</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Prix minimum</div>
                      <div className="text-2xl font-bold">{crop.breakEven.price}€</div>
                      <div className="text-xs text-muted-foreground mt-1">par unité</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Statut</div>
                      <div className="flex items-center gap-2">
                        {crop.breakEven.reached ? (
                          <>
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <span className="text-xl font-bold text-green-600">Atteint</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-6 w-6 text-orange-600" />
                            <span className="text-xl font-bold text-orange-600">En cours</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Comparative Analysis */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Analyse Comparative - Évolution 3 Mois</h3>
        <div className="h-80 flex items-end justify-around gap-6">
          {comparativeAnalysis.map((period, periodIdx) => (
            <div key={periodIdx} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full space-y-2">
                {period.crops.map((crop, cropIdx) => {
                  const colors = ['bg-green-500', 'bg-blue-500', 'bg-red-500', 'bg-purple-500'];
                  return (
                    <div
                      key={cropIdx}
                      className={`w-full ${colors[cropIdx]} rounded transition-all hover:opacity-80 cursor-pointer`}
                      style={{ height: `${(crop.profit / 1000) * 2}px` }}
                      title={`${crop.name}: ${crop.profit.toLocaleString()}€ (${crop.margin}%)`}
                    />
                  );
                })}
              </div>
              <div className="text-xs font-medium text-muted-foreground">{period.period}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm flex-wrap">
          {['Maïs', 'Blé', 'Tomates', 'Soja'].map((name, idx) => {
            const colors = ['bg-green-500', 'bg-blue-500', 'bg-red-500', 'bg-purple-500'];
            return (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-3 h-3 ${colors[idx]} rounded`}></div>
                <span className="text-muted-foreground">{name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderTax = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rapports Fiscaux & Conformité</h2>
          <p className="text-muted-foreground">Calculs fiscaux, déclarations et optimisation</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTaxYear}
            onChange={(e) => setSelectedTaxYear(Number(e.target.value))}
            className="px-4 py-2 border rounded-lg bg-background"
          >
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025 (Prévisionnel)</option>
          </select>
          <button
            onClick={generateTaxReport}
            disabled={generatingTaxReport}
            className="px-6 py-2 bg-[#C0392B] text-white rounded-lg hover:bg-[#A93226] transition-colors font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <FileText className={`h-5 w-5 ${generatingTaxReport ? 'animate-pulse' : ''}`} />
            {generatingTaxReport ? 'Génération...' : 'Générer Rapport'}
          </button>
        </div>
      </div>

      {/* Tax Summary Cards */}
      {taxReports
        .filter((r) => r.year === selectedTaxYear)
        .map((report, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-2 border-[#C0392B] rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">{report.period}</h3>
                <p className="text-muted-foreground mt-1">Échéance: {report.dueDate}</p>
              </div>
              <div>
                {(() => {
                  const statusConfig = getTaxStatusConfig(report.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${statusConfig.color} ${statusConfig.bgColor}`}
                    >
                      <StatusIcon className="h-5 w-5" />
                      {statusConfig.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="p-4 bg-white dark:bg-gray-900 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Revenus Totaux</div>
                <div className="text-2xl font-bold">{report.revenue.toLocaleString()}€</div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Déductions</div>
                <div className="text-2xl font-bold text-green-600">
                  -{report.deductibleExpenses.toLocaleString()}€
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Revenu Imposable</div>
                <div className="text-2xl font-bold text-blue-600">
                  {report.taxableIncome.toLocaleString()}€
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-[#C0392B] to-[#E74C3C] text-white rounded-lg">
                <div className="text-sm opacity-90 mb-1">Impôt Net à Payer</div>
                <div className="text-2xl font-bold">{report.netTax.toLocaleString()}€</div>
              </div>
            </div>

            {/* Tax Calculation Breakdown */}
            <div className="p-6 bg-white dark:bg-gray-900 border rounded-lg">
              <h4 className="font-semibold mb-4">Calcul Détaillé de l'Impôt</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">Revenu imposable</span>
                  <span className="font-bold">{report.taxableIncome.toLocaleString()}€</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">Taux d'imposition</span>
                  <span className="font-bold">{report.taxRate}%</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t">
                  <span className="text-sm">Impôt brut</span>
                  <span className="font-bold">{report.taxDue.toLocaleString()}€</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-green-600">Crédits d'impôt</span>
                  <span className="font-bold text-green-600">
                    -{report.credits.toLocaleString()}€
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-t-2 border-[#C0392B]">
                  <span className="font-bold">Impôt net à payer</span>
                  <span className="text-2xl font-bold text-[#C0392B]">
                    {report.netTax.toLocaleString()}€
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Deductible Expenses Breakdown */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Répartition des Dépenses Déductibles</h3>
        <div className="space-y-4">
          {taxCategories.map((category, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      category.deductible
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700'
                    }`}
                  >
                    {category.deductible ? 'Déductible' : 'Non-déductible'}
                  </div>
                  <span className="font-medium">{category.category}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold">{category.amount.toLocaleString()}€</span>
                  <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                </div>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-full"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Actions */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Exporter les Documents Fiscaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed rounded-lg hover:border-[#C0392B] hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center gap-3">
            <FileText className="h-8 w-8 text-[#C0392B]" />
            <div className="text-left">
              <div className="font-semibold">Déclaration PDF</div>
              <div className="text-xs text-muted-foreground">Rapport complet</div>
            </div>
          </button>
          <button className="p-4 border-2 border-dashed rounded-lg hover:border-[#C0392B] hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center gap-3">
            <Download className="h-8 w-8 text-[#C0392B]" />
            <div className="text-left">
              <div className="font-semibold">Excel Détaillé</div>
              <div className="text-xs text-muted-foreground">Tous les calculs</div>
            </div>
          </button>
          <button className="p-4 border-2 border-dashed rounded-lg hover:border-[#C0392B] hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center gap-3">
            <Send className="h-8 w-8 text-[#C0392B]" />
            <div className="text-left">
              <div className="font-semibold">Envoi Direct</div>
              <div className="text-xs text-muted-foreground">Télédéclaration</div>
            </div>
          </button>
        </div>
      </div>

      {/* Tax Optimization Tips */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Conseils d'Optimisation Fiscale
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span className="text-sm">
              Maximisez vos amortissements sur équipements agricoles pour réduire l'assiette
              imposable
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span className="text-sm">
              Considérez le régime micro-BA si votre CA est inférieur à 85,800€ pour simplifier
              votre déclaration
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-1">•</span>
            <span className="text-sm">
              Planifiez vos investissements en fin d'année pour optimiser les déductions fiscales
            </span>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderCashFlow = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestion de Trésorerie</h2>
        <p className="text-muted-foreground">
          Suivi en temps réel des flux financiers et alertes de liquidité
        </p>
      </div>

      {/* Current Balance & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="text-sm opacity-90 mb-2">Solde Actuel</div>
          <div className="text-4xl font-bold mb-2">89,240€</div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>+8% ce mois</span>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-3">
            {liquidityAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg flex items-start gap-3 ${
                  alert.type === 'critical'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : alert.type === 'warning'
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <AlertCircle
                  className={`h-5 w-5 mt-0.5 ${
                    alert.type === 'critical'
                      ? 'text-red-600'
                      : alert.type === 'warning'
                      ? 'text-orange-600'
                      : 'text-blue-600'
                  }`}
                />
                <div className="flex-1">
                  <div className="font-semibold mb-1">{alert.message}</div>
                  <div className="text-xs text-muted-foreground">
                    {alert.action} • {alert.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{alert.currentValue.toLocaleString()}€</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cash Flow Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Entrées (7j)</div>
              <div className="text-2xl font-bold text-green-600">82,300€</div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Sorties (7j)</div>
              <div className="text-2xl font-bold text-red-600">65,700€</div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Flux Net</div>
              <div className="text-2xl font-bold text-blue-600">+16,600€</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Historique des Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Catégorie</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Montant</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Solde</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {cashFlowEntries.map((entry) => (
                <tr key={entry.id} className="border-t hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-sm">{entry.date}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{entry.description}</div>
                    <div className="text-xs text-muted-foreground">{entry.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-muted rounded text-xs">{entry.category}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-bold ${
                        entry.type === 'inflow' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {entry.type === 'inflow' ? '+' : ''}
                      {entry.amount.toLocaleString()}€
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold">
                    {entry.balance.toLocaleString()}€
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                        entry.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700'
                          : entry.status === 'pending'
                          ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700'
                          : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700'
                      }`}
                    >
                      {entry.status === 'completed'
                        ? 'Terminé'
                        : entry.status === 'pending'
                        ? 'En attente'
                        : 'Planifié'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Paiements à Recevoir</h3>
          <div className="space-y-3">
            {[
              { client: 'Coopérative Nord', amount: 24500, date: '2025-02-15', days: 30 },
              { client: 'AgriTech Solutions', amount: 5200, date: '2025-01-05', days: -11 },
            ].map((payment, idx) => (
              <div key={idx} className="p-3 border rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium">{payment.client}</div>
                  <div className="text-xs text-muted-foreground">Échéance: {payment.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{payment.amount.toLocaleString()}€</div>
                  <div
                    className={`text-xs ${
                      payment.days < 0 ? 'text-red-600' : 'text-muted-foreground'
                    }`}
                  >
                    {payment.days < 0
                      ? `En retard ${Math.abs(payment.days)}j`
                      : `Dans ${payment.days}j`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Paiements à Effectuer</h3>
          <div className="space-y-3">
            {[
              { vendor: 'AgriSupply', amount: 12500, date: '2025-01-20', days: 4 },
              { vendor: 'Salaires Personnel', amount: 35000, date: '2025-01-31', days: 15 },
            ].map((payment, idx) => (
              <div key={idx} className="p-3 border rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium">{payment.vendor}</div>
                  <div className="text-xs text-muted-foreground">Échéance: {payment.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">-{payment.amount.toLocaleString()}€</div>
                  <div className="text-xs text-muted-foreground">Dans {payment.days}j</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Financial Suite</h1>
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
              GESTION FINANCIÈRE
            </span>
          </div>
          <p className="text-muted-foreground">Pilotez votre comptabilité et rentabilité</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-background"
          >
            <option value="month">Mois en cours</option>
            <option value="quarter">Trimestre</option>
            <option value="year">Année</option>
          </select>

          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-background"
          >
            <option value="EUR">€ (EUR)</option>
            <option value="USD">$ (USD)</option>
            <option value="XAF">XAF</option>
            <option value="XOF">XOF</option>
          </select>

          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card border rounded-xl p-2 flex gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: "Vue d'ensemble", icon: BarChart3 },
          { id: 'forecast', label: 'Prévisions IA', icon: Brain },
          { id: 'profitability', label: 'Rentabilité', icon: PieChart },
          { id: 'tax', label: 'Fiscalité', icon: Receipt },
          { id: 'cashflow', label: 'Trésorerie', icon: Wallet },
          { id: 'billing', label: 'Facturation', icon: FileText },
          { id: 'costs', label: 'Coûts', icon: TrendingDown },
          { id: 'revenue', label: 'Revenus', icon: TrendingUp },
          { id: 'roi', label: 'ROI', icon: Calculator },
          { id: 'reports', label: 'Rapports', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeView === tab.id ? 'bg-[#C0392B] text-white' : 'hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeView === 'overview' && renderOverview()}
      {activeView === 'forecast' && renderForecast()}
      {activeView === 'profitability' && renderProfitability()}
      {activeView === 'tax' && renderTax()}
      {activeView === 'cashflow' && renderCashFlow()}
      {activeView === 'billing' && renderBilling()}
      {activeView === 'costs' && renderCosts()}
      {activeView === 'revenue' && renderRevenue()}
      {activeView === 'roi' && renderROI()}
      {activeView === 'reports' && renderReports()}
    </div>
  );
}
