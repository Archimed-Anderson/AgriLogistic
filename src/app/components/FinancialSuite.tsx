import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "draft";
  dueDate: string;
  issueDate: string;
  items: number;
}

interface Transaction {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
}

export function FinancialSuite() {
  const [activeView, setActiveView] = useState<"overview" | "billing" | "costs" | "revenue" | "roi" | "reports">("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");

  // KPIs Data
  const kpis = [
    {
      id: "revenue",
      label: "Chiffre d'Affaires",
      value: "245,850€",
      change: 15,
      icon: DollarSign,
      color: "green",
      trend: "up",
      subtitle: "Ce mois",
    },
    {
      id: "costs",
      label: "Coûts Opérationnels",
      value: "128,430€",
      change: -3,
      icon: TrendingDown,
      color: "red",
      trend: "down",
      subtitle: "Réduction de 3%",
    },
    {
      id: "margin",
      label: "Marge Brute",
      value: "47.8%",
      change: 2.1,
      icon: PieChart,
      color: "blue",
      trend: "up",
      subtitle: "+2.1 points",
    },
    {
      id: "cash",
      label: "Trésorerie",
      value: "89,240€",
      change: 8,
      icon: Wallet,
      color: "purple",
      trend: "up",
      subtitle: "Disponible",
    },
  ];

  // Invoices Data
  const invoices: Invoice[] = [
    {
      id: "INV-2025-001",
      client: "Ferme Dupont SARL",
      amount: 12500,
      status: "paid",
      dueDate: "2025-01-10",
      issueDate: "2025-01-01",
      items: 5,
    },
    {
      id: "INV-2025-002",
      client: "Coopérative Nord Agriculture",
      amount: 8750,
      status: "pending",
      dueDate: "2025-02-15",
      issueDate: "2025-01-15",
      items: 3,
    },
    {
      id: "INV-2025-003",
      client: "AgriTech Solutions",
      amount: 5200,
      status: "overdue",
      dueDate: "2025-01-05",
      issueDate: "2024-12-20",
      items: 2,
    },
    {
      id: "INV-2025-004",
      client: "Exploitation Martin",
      amount: 15800,
      status: "draft",
      dueDate: "2025-02-28",
      issueDate: "2025-01-20",
      items: 7,
    },
  ];

  // Cost Categories
  const costCategories = [
    { category: "Personnel", budget: 45000, actual: 43200, variance: -4 },
    { category: "Équipement", budget: 28000, actual: 31500, variance: 12.5 },
    { category: "Intrants", budget: 35000, actual: 33800, variance: -3.4 },
    { category: "Maintenance", budget: 12000, actual: 11200, variance: -6.7 },
    { category: "Logistique", budget: 8500, actual: 8730, variance: 2.7 },
  ];

  // Revenue Sources
  const revenueSources = [
    { source: "Abonnements", amount: 95400, percentage: 38.8, trend: 12 },
    { source: "Commissions", amount: 78200, percentage: 31.8, trend: 18 },
    { source: "Ventes", amount: 52100, percentage: 21.2, trend: 8 },
    { source: "Services", amount: 20150, percentage: 8.2, trend: 25 },
  ];

  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: { icon: any; label: string; color: string; bgColor: string } } = {
      paid: { icon: CheckCircle, label: "Payée", color: "text-green-700", bgColor: "bg-green-100 dark:bg-green-900/20" },
      pending: { icon: Clock, label: "En attente", color: "text-orange-700", bgColor: "bg-orange-100 dark:bg-orange-900/20" },
      overdue: { icon: AlertCircle, label: "En retard", color: "text-red-700", bgColor: "bg-red-100 dark:bg-red-900/20" },
      draft: { icon: FileText, label: "Brouillon", color: "text-gray-700", bgColor: "bg-gray-100 dark:bg-gray-800" },
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
                    (kpi.trend === "up" && kpi.id !== "costs") || (kpi.trend === "down" && kpi.id === "costs")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {kpi.trend === "up" ? (
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
            { month: "Juil", revenue: 82, expense: 65 },
            { month: "Août", revenue: 88, expense: 62 },
            { month: "Sep", revenue: 78, expense: 68 },
            { month: "Oct", revenue: 92, expense: 64 },
            { month: "Nov", revenue: 85, expense: 66 },
            { month: "Déc", revenue: 95, expense: 58 },
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
              { label: "Solde initial", value: 65240, type: "neutral" },
              { label: "Entrées", value: 95850, type: "positive" },
              { label: "Sorties", value: -71850, type: "negative" },
              { label: "Solde final", value: 89240, type: "neutral" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">{item.label}</span>
                <span
                  className={`text-lg font-bold ${
                    item.type === "positive"
                      ? "text-green-600"
                      : item.type === "negative"
                      ? "text-red-600"
                      : "text-foreground"
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
                    className={`h-full ${
                      cat.variance < 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: `${(cat.actual / cat.budget) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Budget: {cat.budget.toLocaleString()}€ • Variance:{" "}
                  <span className={cat.variance < 0 ? "text-green-600" : "text-red-600"}>
                    {cat.variance > 0 ? "+" : ""}
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
          { label: "Total à recevoir", value: "24,500€", color: "blue" },
          { label: "En retard", value: "5,200€", color: "red" },
          { label: "Encaissé ce mois", value: "12,500€", color: "green" },
          { label: "Factures en attente", value: "3", color: "orange" },
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
                    Variance:{" "}
                    <span className={cat.variance < 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                      {cat.variance > 0 ? "+" : ""}
                      {cat.variance}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{cat.actual.toLocaleString()}€</div>
                  <div className="text-sm text-muted-foreground">Budget: {cat.budget.toLocaleString()}€</div>
                </div>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gray-300 rounded-full"
                  style={{ width: "100%" }}
                />
                <div
                  className={`absolute top-0 left-0 h-full rounded-full ${
                    cat.variance < 0 ? "bg-green-500" : "bg-red-500"
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
              <div className="text-sm text-green-800 dark:text-green-200">Économies Potentielles</div>
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
            { name: "Coopérative Nord", revenue: 45800, orders: 23 },
            { name: "Ferme Dupont", revenue: 38200, orders: 18 },
            { name: "AgriTech Solutions", revenue: 32100, orders: 15 },
            { name: "Exploitation Martin", revenue: 28500, orders: 12 },
            { name: "BioFarm Corp", revenue: 24300, orders: 10 },
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
                    value < 0 ? "bg-red-500 self-end" : "bg-green-500"
                  }`}
                  style={{
                    height: `${Math.abs(value) * 4}px`,
                    marginTop: value < 0 ? "auto" : "0",
                  }}
                  title={`${value}k€`}
                />
              </div>
              <div className="text-xs font-medium text-muted-foreground mt-2">
                An {index === 0 ? "0" : index}
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
          { name: "Compte de Résultat", type: "P&L", frequency: "Mensuel" },
          { name: "Bilan Comptable", type: "Balance Sheet", frequency: "Trimestriel" },
          { name: "Tableau de Flux", type: "Cash Flow", frequency: "Mensuel" },
          { name: "Rapport Fiscal", type: "Tax Report", frequency: "Annuel" },
          { name: "Rapport Investisseurs", type: "Investor Report", frequency: "Trimestriel" },
          { name: "Analyse Rentabilité", type: "Profitability", frequency: "Mensuel" },
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
            { name: "P&L Décembre 2024", date: "2025-01-05", size: "245 KB" },
            { name: "Cash Flow Q4 2024", date: "2025-01-02", size: "189 KB" },
            { name: "Bilan 2024", date: "2024-12-31", size: "512 KB" },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
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
          <p className="text-muted-foreground">
            Pilotez votre comptabilité et rentabilité
          </p>
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
          { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
          { id: "billing", label: "Facturation", icon: Receipt },
          { id: "costs", label: "Coûts", icon: TrendingDown },
          { id: "revenue", label: "Revenus", icon: TrendingUp },
          { id: "roi", label: "ROI", icon: Calculator },
          { id: "reports", label: "Rapports", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeView === tab.id
                  ? "bg-[#C0392B] text-white"
                  : "hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeView === "overview" && renderOverview()}
      {activeView === "billing" && renderBilling()}
      {activeView === "costs" && renderCosts()}
      {activeView === "revenue" && renderRevenue()}
      {activeView === "roi" && renderROI()}
      {activeView === "reports" && renderReports()}
    </div>
  );
}
