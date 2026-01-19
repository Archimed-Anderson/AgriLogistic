/**
 * =======================================================
 * OWNER DASHBOARD - Equipment Analytics & Management
 * =======================================================
 * Comprehensive dashboard for equipment owners with:
 * - Key performance metrics (occupancy, revenue, costs)
 * - Interactive charts and graphs
 * - Equipment utilization analytics
 * - Revenue forecasting
 * - Performance alerts
 * - Optimization recommendations
 */

import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Users,
  Wrench,
  Star,
  Package,
  BarChart3,
  LineChart,
  PieChart,
  Zap,
  Bell,
  Settings,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Target,
  Lightbulb,
  Award,
  Clock,
} from "lucide-react";
import type { Equipment } from "../types";
import { generateMockAvailability } from "../data/mockAvailability";

interface OwnerDashboardProps {
  ownerId: string;
  ownerName: string;
  equipment: Equipment[];
}

interface PerformanceMetric {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: any;
  color: string;
  target?: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  costs: number;
  profit: number;
}

interface Alert {
  id: string;
  type: "warning" | "success" | "info" | "error";
  title: string;
  message: string;
  equipmentId?: string;
  timestamp: Date;
}

interface Recommendation {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  potentialGain: number;
}

export function OwnerDashboard({ ownerId, ownerName, equipment }: OwnerDashboardProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month");
  const [selectedEquipment, setSelectedEquipment] = useState<string | "all">("all");

  // Calculate comprehensive metrics
  const metrics = useMemo((): PerformanceMetric[] => {
    const totalEquipment = equipment.length;
    
    // Calculate occupancy rate
    const totalDays = 30 * totalEquipment; // Last 30 days
    const occupiedDays = Math.round(totalDays * 0.68); // 68% occupancy
    const occupancyRate = Math.round((occupiedDays / totalDays) * 100);

    // Calculate revenue
    const avgDailyRate = equipment.reduce((sum, eq) => sum + eq.pricePerDay, 0) / totalEquipment;
    const monthlyRevenue = occupiedDays * avgDailyRate;
    
    // Calculate maintenance costs (15% of revenue)
    const maintenanceCosts = Math.round(monthlyRevenue * 0.15);
    
    // Calculate customer satisfaction (based on ratings)
    const avgRating = equipment.reduce((sum, eq) => sum + eq.rating, 0) / totalEquipment;
    const satisfactionScore = Math.round((avgRating / 5) * 100);

    return [
      {
        label: "Taux d'Occupation",
        value: `${occupancyRate}%`,
        change: 8.5,
        changeLabel: "vs mois dernier",
        icon: Activity,
        color: "blue",
        target: 75,
      },
      {
        label: "Revenus Mensuels",
        value: `€${monthlyRevenue.toLocaleString()}`,
        change: 15.3,
        changeLabel: "vs mois dernier",
        icon: DollarSign,
        color: "green",
      },
      {
        label: "Coûts Maintenance",
        value: `€${maintenanceCosts.toLocaleString()}`,
        change: -5.2,
        changeLabel: "vs mois dernier",
        icon: Wrench,
        color: "orange",
      },
      {
        label: "Satisfaction Client",
        value: `${satisfactionScore}%`,
        change: 3.8,
        changeLabel: "vs mois dernier",
        icon: Star,
        color: "purple",
        target: 90,
      },
    ];
  }, [equipment, timeRange]);

  // Generate revenue data for chart
  const revenueData = useMemo((): RevenueData[] => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"];
    return months.map((month, index) => {
      const baseRevenue = 25000 + Math.random() * 10000;
      const seasonalFactor = index >= 2 && index <= 4 ? 1.3 : 1.0; // Peak season
      const revenue = Math.round(baseRevenue * seasonalFactor);
      const costs = Math.round(revenue * 0.15);
      const profit = revenue - costs;
      
      return {
        month,
        revenue,
        costs,
        profit,
      };
    });
  }, [timeRange]);

  // Equipment utilization analysis
  const equipmentUtilization = useMemo(() => {
    return equipment.map((eq) => {
      const availability = generateMockAvailability(eq.id);
      const totalDays = availability.length;
      const reservedDays = availability.filter((slot) => slot.status === "reserved").length;
      const utilizationRate = Math.round((reservedDays / totalDays) * 100);
      
      const revenuePerDay = eq.pricePerDay;
      const actualRevenue = reservedDays * revenuePerDay;
      const potentialRevenue = totalDays * revenuePerDay;
      const missedRevenue = potentialRevenue - actualRevenue;

      return {
        equipment: eq,
        utilizationRate,
        reservedDays,
        totalDays,
        actualRevenue,
        potentialRevenue,
        missedRevenue,
      };
    }).sort((a, b) => a.utilizationRate - b.utilizationRate); // Sort by utilization (lowest first)
  }, [equipment]);

  // Performance alerts
  const alerts = useMemo((): Alert[] => {
    const alertsList: Alert[] = [];

    // Low utilization alerts
    equipmentUtilization.forEach((util) => {
      if (util.utilizationRate < 50) {
        alertsList.push({
          id: `low-util-${util.equipment.id}`,
          type: "warning",
          title: "Faible Taux d'Utilisation",
          message: `${util.equipment.name} a un taux d'utilisation de ${util.utilizationRate}%. Considérez une réduction de prix.`,
          equipmentId: util.equipment.id,
          timestamp: new Date(),
        });
      }
    });

    // High performer alerts
    equipmentUtilization.forEach((util) => {
      if (util.utilizationRate > 85) {
        alertsList.push({
          id: `high-util-${util.equipment.id}`,
          type: "success",
          title: "Performance Excellente",
          message: `${util.equipment.name} a un taux d'utilisation de ${util.utilizationRate}%. Envisagez une augmentation de prix.`,
          equipmentId: util.equipment.id,
          timestamp: new Date(),
        });
      }
    });

    // Maintenance due alerts
    equipment.forEach((eq) => {
      if (eq.iotData?.currentData?.engineHours && eq.iotData.currentData.engineHours > 450) {
        alertsList.push({
          id: `maint-due-${eq.id}`,
          type: "error",
          title: "Maintenance Requise",
          message: `${eq.name} nécessite une maintenance préventive (${eq.iotData.currentData.engineHours}h d'utilisation).`,
          equipmentId: eq.id,
          timestamp: new Date(),
        });
      }
    });

    return alertsList;
  }, [equipment, equipmentUtilization]);

  // Optimization recommendations
  const recommendations = useMemo((): Recommendation[] => {
    const recs: Recommendation[] = [];

    // Pricing recommendations
    const lowUtilEquipment = equipmentUtilization.filter((u) => u.utilizationRate < 60);
    if (lowUtilEquipment.length > 0) {
      recs.push({
        title: "Optimisation des Prix",
        description: `${lowUtilEquipment.length} équipement(s) ont un faible taux d'utilisation. Réduire les prix de 10-15% pourrait augmenter les réservations.`,
        impact: "high",
        potentialGain: lowUtilEquipment.reduce((sum, u) => sum + (u.missedRevenue * 0.3), 0),
      });
    }

    // Peak season strategy
    recs.push({
      title: "Stratégie Haute Saison",
      description: "Les mois de mars-mai montrent une forte demande. Augmentez les prix de 20-25% pendant ces périodes.",
      impact: "medium",
      potentialGain: 8500,
    });

    // Bundle offers
    recs.push({
      title: "Offres Groupées",
      description: "Créez des packages combinant plusieurs équipements pour augmenter la valeur moyenne des réservations.",
      impact: "medium",
      potentialGain: 5200,
    });

    // Long-term rentals
    const highUtilEquipment = equipmentUtilization.filter((u) => u.utilizationRate > 80);
    if (highUtilEquipment.length > 0) {
      recs.push({
        title: "Locations Long Terme",
        description: `${highUtilEquipment.length} équipement(s) très demandé(s). Proposez des contrats mensuels avec remise pour garantir un revenu stable.`,
        impact: "high",
        potentialGain: 12000,
      });
    }

    return recs;
  }, [equipmentUtilization]);

  // Revenue forecast (next 3 months)
  const forecast = useMemo(() => {
    const lastMonthRevenue = revenueData[revenueData.length - 1].revenue;
    const growthRate = 1.08; // 8% monthly growth
    
    return [
      {
        month: "Jul",
        projected: Math.round(lastMonthRevenue * growthRate),
        confidence: 85,
      },
      {
        month: "Aoû",
        projected: Math.round(lastMonthRevenue * Math.pow(growthRate, 2)),
        confidence: 75,
      },
      {
        month: "Sep",
        projected: Math.round(lastMonthRevenue * Math.pow(growthRate, 3)),
        confidence: 65,
      },
    ];
  }, [revenueData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-[#2563eb]" />
            Tableau de Bord Propriétaire
          </h2>
          <p className="text-muted-foreground mt-1">
            {ownerName} • {equipment.length} équipement(s)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-900"
          >
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
            <option value="quarter">90 derniers jours</option>
            <option value="year">12 derniers mois</option>
          </select>

          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </button>

          <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change > 0;
          
          return (
            <div
              key={index}
              className="p-6 bg-white dark:bg-gray-900 border rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`h-12 w-12 rounded-xl bg-${metric.color}-100 dark:bg-${metric.color}-900/20 flex items-center justify-center`}
                >
                  <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    isPositive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {Math.abs(metric.change)}%
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-3xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.changeLabel}</p>
              </div>

              {metric.target && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Objectif</span>
                    <span className="font-semibold">{metric.target}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-${metric.color}-500 rounded-full transition-all`}
                      style={{
                        width: `${Math.min(
                          (parseInt(metric.value.toString()) / metric.target) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="p-6 bg-white dark:bg-gray-900 border rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <LineChart className="h-5 w-5 text-[#2563eb]" />
              Évolution des Revenus
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Revenus</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded" />
                <span>Coûts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span>Profit</span>
              </div>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {revenueData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{data.month}</span>
                  <span className="text-muted-foreground">
                    €{data.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-1 h-8">
                  <div
                    className="bg-green-500 rounded"
                    style={{ width: `${(data.revenue / 40000) * 100}%` }}
                    title={`Revenus: €${data.revenue.toLocaleString()}`}
                  />
                  <div
                    className="bg-orange-500 rounded"
                    style={{ width: `${(data.costs / 40000) * 100}%` }}
                    title={`Coûts: €${data.costs.toLocaleString()}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Utilization */}
        <div className="p-6 bg-white dark:bg-gray-900 border rounded-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-[#2563eb]" />
            Utilisation par Équipement
          </h3>

          <div className="space-y-4">
            {equipmentUtilization.slice(0, 5).map((util, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate flex-1">
                    {util.equipment.name}
                  </span>
                  <span
                    className={`font-bold ${
                      util.utilizationRate >= 75
                        ? "text-green-600"
                        : util.utilizationRate >= 50
                        ? "text-blue-600"
                        : "text-orange-600"
                    }`}
                  >
                    {util.utilizationRate}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      util.utilizationRate >= 75
                        ? "bg-green-500"
                        : util.utilizationRate >= 50
                        ? "bg-blue-500"
                        : "bg-orange-500"
                    }`}
                    style={{ width: `${util.utilizationRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{util.reservedDays} jours réservés</span>
                  <span>€{util.actualRevenue.toLocaleString()} généré</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Forecast */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-4">Prévisions de Revenus</h3>
            <div className="grid grid-cols-3 gap-4">
              {forecast.map((f, index) => (
                <div
                  key={index}
                  className="p-4 bg-white dark:bg-gray-900/50 rounded-lg"
                >
                  <div className="text-sm text-muted-foreground mb-1">{f.month}</div>
                  <div className="text-2xl font-bold text-blue-600">
                    €{f.projected.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Target className="h-3 w-3" />
                    Confiance: {f.confidence}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Recommendations */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Alerts */}
        <div className="p-6 bg-white dark:bg-gray-900 border rounded-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#2563eb]" />
            Alertes de Performance
          </h3>

          <div className="space-y-3">
            {alerts.map((alert) => {
              const typeColors = {
                warning: "orange",
                success: "green",
                info: "blue",
                error: "red",
              };
              const color = typeColors[alert.type];

              return (
                <div
                  key={alert.id}
                  className={`p-4 bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-800 rounded-lg`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`h-5 w-5 text-${color}-600 flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                      <div className={`font-semibold text-${color}-900 dark:text-${color}-100`}>
                        {alert.title}
                      </div>
                      <div className={`text-sm text-${color}-700 dark:text-${color}-300 mt-1`}>
                        {alert.message}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optimization Recommendations */}
        <div className="p-6 bg-white dark:bg-gray-900 border rounded-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[#2563eb]" />
            Recommandations
          </h3>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-purple-900 dark:text-purple-100">
                        {rec.title}
                      </div>
                      <span className="px-2 py-0.5 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded text-xs font-medium">
                        {rec.impact}
                      </span>
                    </div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">
                      {rec.description}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-purple-600 dark:text-purple-400 mt-2">
                      <DollarSign className="h-4 w-4" />
                      Gain potentiel: €{rec.potentialGain.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
