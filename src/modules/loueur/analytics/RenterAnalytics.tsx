/**
 * ============================================
 * RENTER ANALYTICS DASHBOARD
 * ============================================
 * Comprehensive analytics for equipment renters
 * - Usage statistics and trends
 * - Revenue metrics and financial analysis
 * - Equipment performance tracking
 * - User engagement metrics
 * - Occupancy rate visualizations
 * - Cost savings analysis
 */

import { useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Clock,
  Target,
  Activity,
  PieChart,
  Download,
  Filter,
  AlertCircle,
  CheckCircle,
  Zap,
  Users,
  Package,
  MapPin,
  Leaf,
  MessageSquare,
} from "lucide-react";

export interface UsageStats {
  totalRentals: number;
  activeRentals: number;
  totalHours: number;
  totalDays: number;
  averageRentalDuration: number;
  monthlyRentals: { month: string; count: number }[];
}

export interface RevenueMetrics {
  totalSpent: number;
  averageCostPerDay: number;
  savingsVsPurchase: number;
  monthlySpending: { month: string; amount: number }[];
  costBreakdown: { category: string; amount: number; percentage: number }[];
}

export interface EquipmentPerformance {
  equipmentId: string;
  equipmentName: string;
  category: string;
  timesRented: number;
  totalDays: number;
  totalSpent: number;
  averageRating: number;
  lastRented: Date;
  efficiency: number; // 0-100 score
}

export interface EngagementMetrics {
  profileViews: number;
  searchQueries: number;
  favoritesAdded: number;
  reviewsWritten: number;
  communityInteractions: number;
  responseTime: number; // hours
}

interface Props {
  userId: string;
  userName: string;
  timeRange?: "week" | "month" | "quarter" | "year";
}

export function RenterAnalytics({ userId, userName, timeRange = "month" }: Props) {
  // Mock data - in real app, fetch from API
  const usageStats: UsageStats = useMemo(
    () => ({
      totalRentals: 47,
      activeRentals: 2,
      totalHours: 1834,
      totalDays: 76,
      averageRentalDuration: 1.6,
      monthlyRentals: [
        { month: "Jan", count: 3 },
        { month: "Fév", count: 5 },
        { month: "Mar", count: 8 },
        { month: "Avr", count: 12 },
        { month: "Mai", count: 9 },
        { month: "Jun", count: 10 },
      ],
    }),
    []
  );

  const revenueMetrics: RevenueMetrics = useMemo(
    () => ({
      totalSpent: 34620,
      averageCostPerDay: 455,
      savingsVsPurchase: 187500,
      monthlySpending: [
        { month: "Jan", amount: 3200 },
        { month: "Fév", amount: 4800 },
        { month: "Mar", amount: 6300 },
        { month: "Avr", amount: 8900 },
        { month: "Mai", amount: 5620 },
        { month: "Jun", amount: 5800 },
      ],
      costBreakdown: [
        { category: "Tracteurs", amount: 18600, percentage: 53.7 },
        { category: "Moissonneuses", amount: 9900, percentage: 28.6 },
        { category: "Semoirs", amount: 3840, percentage: 11.1 },
        { category: "Pulvérisateurs", amount: 2280, percentage: 6.6 },
      ],
    }),
    []
  );

  const equipmentPerformance: EquipmentPerformance[] = useMemo(
    () => [
      {
        equipmentId: "EQ-001",
        equipmentName: "Tracteur John Deere 6250R",
        category: "Tracteurs",
        timesRented: 12,
        totalDays: 28,
        totalSpent: 10080,
        averageRating: 4.9,
        lastRented: new Date("2026-01-10"),
        efficiency: 95,
      },
      {
        equipmentId: "EQ-002",
        equipmentName: "Moissonneuse Claas Lexion 8900",
        category: "Moissonneuses",
        timesRented: 6,
        totalDays: 11,
        totalSpent: 9900,
        averageRating: 5.0,
        lastRented: new Date("2025-12-28"),
        efficiency: 98,
      },
      {
        equipmentId: "EQ-003",
        equipmentName: "Pulvérisateur Kuhn Metris 4102",
        category: "Pulvérisateurs",
        timesRented: 8,
        totalDays: 16,
        totalSpent: 3360,
        averageRating: 4.7,
        lastRented: new Date("2026-01-05"),
        efficiency: 88,
      },
      {
        equipmentId: "EQ-004",
        equipmentName: "Semoir Horsch Maestro 12.75 SW",
        category: "Semoirs",
        timesRented: 9,
        totalDays: 12,
        totalSpent: 3840,
        averageRating: 4.8,
        lastRented: new Date("2025-12-20"),
        efficiency: 92,
      },
      {
        equipmentId: "EQ-005",
        equipmentName: "Épandeur Amazone ZG-TS 10001",
        category: "Épandeurs",
        timesRented: 5,
        totalDays: 9,
        totalSpent: 1440,
        averageRating: 4.6,
        lastRented: new Date("2025-11-15"),
        efficiency: 85,
      },
    ],
    []
  );

  const engagementMetrics: EngagementMetrics = useMemo(
    () => ({
      profileViews: 342,
      searchQueries: 127,
      favoritesAdded: 23,
      reviewsWritten: 15,
      communityInteractions: 68,
      responseTime: 2.4,
    }),
    []
  );

  // Calculate max value for chart scaling
  const maxMonthlyRentals = Math.max(...usageStats.monthlyRentals.map((m) => m.count));
  const maxMonthlySpending = Math.max(...revenueMetrics.monthlySpending.map((m) => m.amount));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Vue complète de votre activité de location
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
          </button>
          <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              +12%
            </div>
          </div>
          <h3 className="text-2xl font-bold">{usageStats.totalRentals}</h3>
          <p className="text-sm text-muted-foreground mt-1">Total Locations</p>
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              {usageStats.activeRentals} en cours
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              +8%
            </div>
          </div>
          <h3 className="text-2xl font-bold">€{revenueMetrics.totalSpent.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground mt-1">Dépenses Totales</p>
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Target className="h-3 w-3" />
              €{revenueMetrics.averageCostPerDay}/jour
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              84%
            </div>
          </div>
          <h3 className="text-2xl font-bold">€{revenueMetrics.savingsVsPurchase.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground mt-1">Économies vs Achat</p>
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Leaf className="h-3 w-3" />
              ROI: 541%
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              +15%
            </div>
          </div>
          <h3 className="text-2xl font-bold">{usageStats.totalHours.toLocaleString()}h</h3>
          <p className="text-sm text-muted-foreground mt-1">Heures d'Utilisation</p>
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {usageStats.totalDays} jours
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trends */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#2563eb]" />
              Évolution des Locations
            </h3>
            <select className="px-3 py-1 border rounded-lg text-sm">
              <option>6 derniers mois</option>
              <option>3 derniers mois</option>
              <option>12 derniers mois</option>
            </select>
          </div>

          {/* Bar Chart */}
          <div className="space-y-4">
            {usageStats.monthlyRentals.map((month) => (
              <div key={month.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{month.month}</span>
                  <span className="font-semibold">{month.count} locations</span>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-500 flex items-center justify-end px-3"
                    style={{ width: `${(month.count / maxMonthlyRentals) * 100}%` }}
                  >
                    {month.count > 5 && (
                      <span className="text-white text-xs font-semibold">{month.count}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Moyenne mensuelle</span>
              <span className="font-semibold">
                {(usageStats.monthlyRentals.reduce((sum, m) => sum + m.count, 0) / usageStats.monthlyRentals.length).toFixed(1)} locations
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Trends */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Dépenses Mensuelles
            </h3>
            <select className="px-3 py-1 border rounded-lg text-sm">
              <option>6 derniers mois</option>
              <option>3 derniers mois</option>
              <option>12 derniers mois</option>
            </select>
          </div>

          {/* Line Chart (simplified as bars) */}
          <div className="space-y-4">
            {revenueMetrics.monthlySpending.map((month) => (
              <div key={month.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{month.month}</span>
                  <span className="font-semibold">€{month.amount.toLocaleString()}</span>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-lg transition-all duration-500 flex items-center justify-end px-3"
                    style={{ width: `${(month.amount / maxMonthlySpending) * 100}%` }}
                  >
                    {month.amount > 4000 && (
                      <span className="text-white text-xs font-semibold">€{month.amount.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Moyenne mensuelle</span>
              <span className="font-semibold">
                €{(revenueMetrics.monthlySpending.reduce((sum, m) => sum + m.amount, 0) / revenueMetrics.monthlySpending.length).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown & Equipment Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown by Category */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-[#2563eb]" />
            Répartition des Coûts
          </h3>

          <div className="space-y-4">
            {revenueMetrics.costBreakdown.map((item, index) => {
              const colors = [
                { bg: "bg-blue-500", text: "text-blue-500" },
                { bg: "bg-green-500", text: "text-green-500" },
                { bg: "bg-purple-500", text: "text-purple-500" },
                { bg: "bg-orange-500", text: "text-orange-500" },
              ];
              const color = colors[index % colors.length];

              return (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${color.bg}`} />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{item.percentage}%</span>
                      <span className="font-semibold">€{item.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color.bg} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-bold text-lg">€{revenueMetrics.totalSpent.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Top Equipment Performance */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Performance des Équipements
          </h3>

          <div className="space-y-4">
            {equipmentPerformance.slice(0, 4).map((eq) => (
              <div key={eq.equipmentId} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{eq.equipmentName}</h4>
                    <p className="text-xs text-muted-foreground">{eq.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">€{eq.totalSpent.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{eq.timesRented} locations</div>
                  </div>
                </div>

                {/* Efficiency Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Efficacité</span>
                    <span className="font-medium">{eq.efficiency}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        eq.efficiency >= 90
                          ? "bg-green-500"
                          : eq.efficiency >= 80
                            ? "bg-blue-500"
                            : "bg-orange-500"
                      }`}
                      style={{ width: `${eq.efficiency}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Jours</div>
                    <div className="text-sm font-semibold">{eq.totalDays}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Note</div>
                    <div className="text-sm font-semibold flex items-center justify-center gap-1">
                      {eq.averageRating}
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">€/jour</div>
                    <div className="text-sm font-semibold">{Math.round(eq.totalSpent / eq.totalDays)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <Users className="h-5 w-5 text-[#2563eb]" />
          Engagement Utilisateur
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold">{engagementMetrics.profileViews}</div>
            <div className="text-xs text-muted-foreground mt-1">Vues Profil</div>
          </div>

          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <Filter className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold">{engagementMetrics.searchQueries}</div>
            <div className="text-xs text-muted-foreground mt-1">Recherches</div>
          </div>

          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold">{engagementMetrics.favoritesAdded}</div>
            <div className="text-xs text-muted-foreground mt-1">Favoris</div>
          </div>

          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-bold">{engagementMetrics.reviewsWritten}</div>
            <div className="text-xs text-muted-foreground mt-1">Avis Écrits</div>
          </div>

          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-pink-100 dark:bg-pink-950 flex items-center justify-center">
              <Users className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="text-2xl font-bold">{engagementMetrics.communityInteractions}</div>
            <div className="text-xs text-muted-foreground mt-1">Interactions</div>
          </div>

          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-teal-100 dark:bg-teal-950 flex items-center justify-center">
              <Clock className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-2xl font-bold">{engagementMetrics.responseTime}h</div>
            <div className="text-xs text-muted-foreground mt-1">Temps Réponse</div>
          </div>
        </div>
      </div>
    </div>
  );
}
