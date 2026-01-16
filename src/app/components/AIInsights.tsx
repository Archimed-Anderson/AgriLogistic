import { useState } from "react";
import {
  Brain,
  TrendingUp,
  Zap,
  Lightbulb,
  Target,
  BarChart3,
  LineChart,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Plus,
  Download,
  Play,
  Pause,
  Settings,
  Eye,
  Edit,
  Trash2,
  Award,
  TrendingDown,
  Cpu,
  Database,
  GitBranch,
  Layers,
  RefreshCw,
  Sparkles,
  Rocket,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface AIModel {
  id: string;
  name: string;
  type: "yield" | "disease" | "weather" | "market" | "soil";
  status: "production" | "staging" | "development";
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: string;
  predictions: number;
}

interface Recommendation {
  id: string;
  category: "urgent" | "improvement" | "opportunity";
  title: string;
  description: string;
  impact: number;
  confidence: number;
  adoptionRate: number;
  estimatedValue: string;
}

export function AIInsights() {
  const [activeView, setActiveView] = useState<"overview" | "models" | "patterns" | "recommendations" | "optimization">("overview");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // KPIs Data
  const kpis = [
    {
      id: "models",
      label: "Modèles Actifs",
      value: "12",
      change: 2,
      icon: Brain,
      color: "purple",
      trend: "up",
      subtitle: "En production",
    },
    {
      id: "accuracy",
      label: "Précision Moyenne",
      value: "94.3%",
      change: 1.5,
      icon: Target,
      color: "blue",
      trend: "up",
      subtitle: "Sur tous les modèles",
    },
    {
      id: "response",
      label: "Temps Réponse",
      value: "0.8s",
      change: -12,
      icon: Zap,
      color: "green",
      trend: "down",
      subtitle: "Moyenne",
    },
    {
      id: "recommendations",
      label: "Recommandations",
      value: "347",
      change: 23,
      icon: Lightbulb,
      color: "orange",
      trend: "up",
      subtitle: "Appliquées",
    },
  ];

  // AI Models Data
  const models: AIModel[] = [
    {
      id: "M001",
      name: "Prédiction de Rendement - Maïs",
      type: "yield",
      status: "production",
      accuracy: 96.2,
      precision: 94.8,
      recall: 95.5,
      f1Score: 95.1,
      lastTrained: "Il y a 3 jours",
      predictions: 1247,
    },
    {
      id: "M002",
      name: "Détection Maladies - Multi-cultures",
      type: "disease",
      status: "production",
      accuracy: 92.7,
      precision: 91.3,
      recall: 93.8,
      f1Score: 92.5,
      lastTrained: "Il y a 1 semaine",
      predictions: 856,
    },
    {
      id: "M003",
      name: "Prévision Météo Hyper-locale",
      type: "weather",
      status: "production",
      accuracy: 89.5,
      precision: 88.2,
      recall: 90.1,
      f1Score: 89.1,
      lastTrained: "Il y a 2 jours",
      predictions: 2134,
    },
    {
      id: "M004",
      name: "Analyse Prix Marché",
      type: "market",
      status: "staging",
      accuracy: 85.3,
      precision: 84.1,
      recall: 86.2,
      f1Score: 85.1,
      lastTrained: "Il y a 5 jours",
      predictions: 432,
    },
  ];

  // Recommendations Data
  const recommendations: Recommendation[] = [
    {
      id: "R001",
      category: "urgent",
      title: "Ajuster irrigation Parcelle Nord B",
      description: "Le modèle détecte un stress hydrique précoce. Augmenter l'irrigation de 15% dans les 24h.",
      impact: 92,
      confidence: 96,
      adoptionRate: 0,
      estimatedValue: "+2,400€",
    },
    {
      id: "R002",
      category: "improvement",
      title: "Optimiser rotation cultures",
      description: "La rotation actuelle pourrait être améliorée pour maximiser le rendement du sol.",
      impact: 78,
      confidence: 88,
      adoptionRate: 45,
      estimatedValue: "+8,500€/an",
    },
    {
      id: "R003",
      category: "opportunity",
      title: "Fenêtre optimale plantation soja",
      description: "Les conditions météo seront idéales du 18 au 22 janvier pour la plantation.",
      impact: 65,
      confidence: 82,
      adoptionRate: 0,
      estimatedValue: "+12%",
    },
  ];

  const getModelTypeConfig = (type: string) => {
    const configs: { [key: string]: { icon: any; label: string; color: string; bgColor: string } } = {
      yield: { icon: TrendingUp, label: "Rendement", color: "text-green-700", bgColor: "bg-green-100 dark:bg-green-900/20" },
      disease: { icon: AlertCircle, label: "Maladies", color: "text-red-700", bgColor: "bg-red-100 dark:bg-red-900/20" },
      weather: { icon: Activity, label: "Météo", color: "text-blue-700", bgColor: "bg-blue-100 dark:bg-blue-900/20" },
      market: { icon: BarChart3, label: "Marché", color: "text-purple-700", bgColor: "bg-purple-100 dark:bg-purple-900/20" },
      soil: { icon: Database, label: "Sol", color: "text-orange-700", bgColor: "bg-orange-100 dark:bg-orange-900/20" },
    };
    return configs[type] || configs.yield;
  };

  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: { icon: any; label: string; color: string; bgColor: string } } = {
      production: { icon: CheckCircle, label: "Production", color: "text-green-700", bgColor: "bg-green-100 dark:bg-green-900/20" },
      staging: { icon: Clock, label: "Test", color: "text-orange-700", bgColor: "bg-orange-100 dark:bg-orange-900/20" },
      development: { icon: Settings, label: "Développement", color: "text-gray-700", bgColor: "bg-gray-100 dark:bg-gray-800" },
    };
    return configs[status];
  };

  const getCategoryConfig = (category: string) => {
    const configs: { [key: string]: { icon: any; label: string; color: string; bgColor: string; border: string } } = {
      urgent: { icon: AlertCircle, label: "Urgent", color: "text-red-700", bgColor: "bg-red-100 dark:bg-red-900/20", border: "border-red-500" },
      improvement: { icon: TrendingUp, label: "Amélioration", color: "text-blue-700", bgColor: "bg-blue-100 dark:bg-blue-900/20", border: "border-blue-500" },
      opportunity: { icon: Sparkles, label: "Opportunité", color: "text-purple-700", bgColor: "bg-purple-100 dark:bg-purple-900/20", border: "border-purple-500" },
    };
    return configs[category];
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
                    (kpi.trend === "up" && kpi.id !== "response") || (kpi.trend === "down" && kpi.id === "response")
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

      {/* AI System Status */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-8 w-8" />
              <h3 className="text-2xl font-bold">Tous les Systèmes Opérationnels</h3>
            </div>
            <p className="opacity-90 mt-2">
              L'intelligence artificielle AgroDeep fonctionne à pleine capacité
            </p>
          </div>
          <Sparkles className="h-20 w-20 opacity-50" />
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
          <div>
            <div className="text-xs opacity-75">Modèles entraînés</div>
            <div className="text-2xl font-bold">18</div>
          </div>
          <div>
            <div className="text-xs opacity-75">Prédictions/jour</div>
            <div className="text-2xl font-bold">4.2k</div>
          </div>
          <div>
            <div className="text-xs opacity-75">Données traitées</div>
            <div className="text-2xl font-bold">1.8M</div>
          </div>
          <div>
            <div className="text-xs opacity-75">Économies générées</div>
            <div className="text-2xl font-bold">24k€</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveView("models")}
          className="p-6 bg-card border-2 border-dashed rounded-xl hover:border-[#9B59B6] hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group text-left"
        >
          <Brain className="h-10 w-10 text-[#9B59B6] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg mb-2">Gérer les Modèles</h3>
          <p className="text-sm text-muted-foreground">
            Entraînez et optimisez vos modèles d'IA
          </p>
        </button>

        <button
          onClick={() => setActiveView("patterns")}
          className="p-6 bg-card border-2 border-dashed rounded-xl hover:border-[#9B59B6] hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group text-left"
        >
          <GitBranch className="h-10 w-10 text-[#9B59B6] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg mb-2">Analyser les Patterns</h3>
          <p className="text-sm text-muted-foreground">
            Découvrez des insights cachés dans vos données
          </p>
        </button>

        <button
          onClick={() => setActiveView("recommendations")}
          className="p-6 bg-card border-2 border-dashed rounded-xl hover:border-[#9B59B6] hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group text-left"
        >
          <Lightbulb className="h-10 w-10 text-[#9B59B6] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg mb-2">Recommandations</h3>
          <p className="text-sm text-muted-foreground">
            Actions prioritaires basées sur l'IA
          </p>
        </button>
      </div>

      {/* Recent Insights */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Insights Récents</h3>
        <div className="space-y-3">
          {[
            {
              time: "Il y a 5 min",
              insight: "Anomalie détectée dans la croissance Parcelle Est",
              type: "warning",
            },
            {
              time: "Il y a 1h",
              insight: "Nouvelle corrélation découverte: Température/Rendement",
              type: "info",
            },
            {
              time: "Il y a 3h",
              insight: "Modèle Rendement atteint 96% de précision",
              type: "success",
            },
            {
              time: "Il y a 5h",
              insight: "Recommandation d'irrigation acceptée par 3 agriculteurs",
              type: "success",
            },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  item.type === "success"
                    ? "bg-green-500"
                    : item.type === "warning"
                    ? "bg-orange-500"
                    : "bg-blue-500"
                }`}
              />
              <div className="flex-1">
                <div className="text-sm">{item.insight}</div>
                <div className="text-xs text-muted-foreground">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModels = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Modèles Prédictifs</h2>
          <p className="text-muted-foreground">Gérez et optimisez vos modèles d'IA</p>
        </div>
        <button className="px-6 py-2 bg-[#9B59B6] text-white rounded-lg hover:bg-[#8E44AD] transition-colors font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouveau Modèle
        </button>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model) => {
          const typeConfig = getModelTypeConfig(model.type);
          const statusConfig = getStatusConfig(model.status);
          const TypeIcon = typeConfig.icon;
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`bg-card border-2 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer ${
                selectedModel === model.id ? "border-[#9B59B6]" : "border-transparent"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${typeConfig.bgColor}`}>
                    <TypeIcon className={`h-6 w-6 ${typeConfig.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{model.name}</h3>
                    <div className="text-xs text-muted-foreground">{model.id}</div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${statusConfig.color} ${statusConfig.bgColor}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig.label}
                </span>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center p-2 bg-muted rounded">
                  <div className="text-xs text-muted-foreground">Précision</div>
                  <div className="text-lg font-bold text-[#9B59B6]">{model.accuracy}%</div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="text-xs text-muted-foreground">Precision</div>
                  <div className="text-lg font-bold">{model.precision}%</div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="text-xs text-muted-foreground">Recall</div>
                  <div className="text-lg font-bold">{model.recall}%</div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="text-xs text-muted-foreground">F1-Score</div>
                  <div className="text-lg font-bold">{model.f1Score}%</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>Entraîné: {model.lastTrained}</span>
                <span>{model.predictions.toLocaleString()} prédictions</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-2 border rounded-lg hover:bg-muted transition-colors text-sm font-medium flex items-center justify-center gap-1">
                  <Play className="h-4 w-4" />
                  Tester
                </button>
                <button className="flex-1 px-3 py-2 border rounded-lg hover:bg-muted transition-colors text-sm font-medium flex items-center justify-center gap-1">
                  <RefreshCw className="h-4 w-4" />
                  Entraîner
                </button>
                <button className="px-3 py-2 border rounded-lg hover:bg-muted transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Model Comparison */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Comparaison de Performance</h3>
        <div className="space-y-4">
          {models.map((model) => (
            <div key={model.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{model.name}</span>
                <span className="text-sm font-bold text-[#9B59B6]">{model.accuracy}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#9B59B6] to-[#BB8FCE]"
                  style={{ width: `${model.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPatterns = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analyse des Patterns</h2>
        <p className="text-muted-foreground">Découvrez des corrélations et anomalies</p>
      </div>

      {/* Correlation Matrix */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Matrice de Corrélations</h3>
        <div className="grid grid-cols-5 gap-2">
          {["Température", "Humidité", "pH Sol", "Rendement", "Pluie"].map((label, i) => (
            <div key={i} className="text-center">
              <div className="text-xs font-medium mb-2 truncate" title={label}>
                {label}
              </div>
              <div className="space-y-1">
                {[0, 1, 2, 3, 4].map((j) => {
                  const correlation = Math.abs(i - j) === 0 ? 1 : 1 - Math.abs(i - j) * 0.2;
                  return (
                    <div
                      key={j}
                      className="h-8 rounded flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: `rgba(155, 89, 182, ${correlation})`,
                      }}
                      title={`${correlation.toFixed(2)}`}
                    >
                      {correlation.toFixed(2)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discovered Patterns */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Patterns Découverts</h3>
        <div className="space-y-4">
          {[
            {
              pattern: "Température > 28°C → Rendement -15%",
              confidence: 94,
              occurrences: 23,
              impact: "high",
            },
            {
              pattern: "Irrigation +20% → Croissance +12%",
              confidence: 88,
              occurrences: 45,
              impact: "medium",
            },
            {
              pattern: "pH 6.5-7.0 → Qualité optimale",
              confidence: 96,
              occurrences: 78,
              impact: "high",
            },
          ].map((item, index) => (
            <div key={index} className="p-4 border-2 border-dashed rounded-lg hover:border-[#9B59B6] transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold">{item.pattern}</div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.impact === "high"
                      ? "bg-red-100 dark:bg-red-900/20 text-red-700"
                      : "bg-orange-100 dark:bg-orange-900/20 text-orange-700"
                  }`}
                >
                  Impact {item.impact === "high" ? "Élevé" : "Moyen"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Confiance: {item.confidence}%</span>
                <span>•</span>
                <span>{item.occurrences} occurrences</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Anomalies Détectées</h3>
        <div className="space-y-3">
          {[
            { field: "Parcelle Est", metric: "Croissance", deviation: "+25%", severity: "warning" },
            { field: "Parcelle Nord B", metric: "Consommation eau", deviation: "-18%", severity: "info" },
          ].map((anomaly, index) => (
            <div key={index} className="p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-orange-900 dark:text-orange-100">
                    {anomaly.field} - {anomaly.metric}
                  </div>
                  <div className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                    Déviation de {anomaly.deviation} par rapport à la normale
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Recommandations IA</h2>
        <p className="text-muted-foreground">Actions prioritaires basées sur l'intelligence artificielle</p>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const categoryConfig = getCategoryConfig(rec.category);
          const CategoryIcon = categoryConfig.icon;

          return (
            <div
              key={rec.id}
              className={`bg-card border-2 rounded-xl p-6 ${categoryConfig.border}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${categoryConfig.bgColor}`}>
                  <CategoryIcon className={`h-6 w-6 ${categoryConfig.color}`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{rec.title}</h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${categoryConfig.color} ${categoryConfig.bgColor}`}
                        >
                          {categoryConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Valeur estimée</div>
                      <div className="text-2xl font-bold text-[#9B59B6]">{rec.estimatedValue}</div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Impact</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${rec.impact}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold">{rec.impact}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Confiance IA</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${rec.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold">{rec.confidence}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Taux d'adoption</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{ width: `${rec.adoptionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold">{rec.adoptionRate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-4 py-2 bg-[#9B59B6] text-white rounded-lg hover:bg-[#8E44AD] transition-colors font-semibold flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Appliquer
                    </button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors font-medium">
                      Détails
                    </button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors font-medium">
                      Ignorer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderOptimization = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Moteur d'Optimisation</h2>
        <p className="text-muted-foreground">Simulez des scénarios et optimisez vos décisions</p>
      </div>

      {/* Objectives */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Objectifs Multi-Critères</h3>
        <div className="space-y-4">
          {[
            { objective: "Maximiser le rendement", weight: 70, unit: "t/ha" },
            { objective: "Minimiser les coûts", weight: 50, unit: "€" },
            { objective: "Réduire impact environnemental", weight: 60, unit: "score" },
          ].map((obj, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{obj.objective}</span>
                <span className="text-sm font-bold">{obj.weight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={obj.weight}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#9B59B6] [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Simulation */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Simulation de Scénarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { name: "Scénario Conservateur", yield: 7.2, cost: 3200, env: 85 },
            { name: "Scénario Équilibré", yield: 8.1, cost: 3800, env: 78 },
            { name: "Scénario Intensif", yield: 9.3, cost: 4500, env: 65 },
          ].map((scenario, index) => (
            <div
              key={index}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                index === 1
                  ? "border-[#9B59B6] bg-purple-50 dark:bg-purple-900/10"
                  : "border-gray-200 hover:border-[#9B59B6]"
              }`}
            >
              <div className="font-semibold mb-3">{scenario.name}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rendement:</span>
                  <span className="font-semibold">{scenario.yield} t/ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coût:</span>
                  <span className="font-semibold">{scenario.cost}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Score env.:</span>
                  <span className="font-semibold">{scenario.env}/100</span>
                </div>
              </div>
              {index === 1 && (
                <div className="mt-3 px-2 py-1 bg-[#9B59B6] text-white rounded text-xs font-semibold text-center">
                  Recommandé par IA
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Plan d'Action Généré</h3>
        <div className="space-y-3">
          {[
            { action: "Ajuster irrigation à 85% de la capacité", priority: "high", deadline: "Demain" },
            { action: "Appliquer engrais NPK 15-15-15", priority: "medium", deadline: "Dans 3 jours" },
            { action: "Planifier rotation avec légumineuses", priority: "low", deadline: "Prochaine saison" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
              <div
                className={`w-2 h-2 rounded-full ${
                  item.priority === "high"
                    ? "bg-red-500"
                    : item.priority === "medium"
                    ? "bg-orange-500"
                    : "bg-blue-500"
                }`}
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{item.action}</div>
                <div className="text-xs text-muted-foreground">Échéance: {item.deadline}</div>
              </div>
              <button className="px-3 py-1 bg-[#9B59B6] text-white rounded text-xs font-semibold hover:bg-[#8E44AD] transition-colors">
                Valider
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Estimation */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm opacity-90 mb-2">ROI Estimé (Scénario Équilibré)</div>
            <div className="text-4xl font-bold mb-2">+18,400€</div>
            <div className="text-sm opacity-90">Retour sur investissement: 285%</div>
          </div>
          <Rocket className="h-16 w-16 opacity-50" />
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
            <h1 className="text-3xl font-bold tracking-tight">Intelligence Artificielle AgroDeep</h1>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-full flex items-center gap-1">
              <Brain className="h-3 w-3" />
              IA AVANCÉE
            </span>
          </div>
          <p className="text-muted-foreground">
            Prédictions, analyses et recommandations intelligentes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>

          <button className="px-6 py-2 bg-[#9B59B6] text-white rounded-lg hover:bg-[#8E44AD] transition-colors font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nouvelle Analyse
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card border rounded-xl p-2 flex gap-2 overflow-x-auto">
        {[
          { id: "overview", label: "Vue d'ensemble", icon: Brain },
          { id: "models", label: "Modèles", icon: Cpu },
          { id: "patterns", label: "Patterns", icon: GitBranch },
          { id: "recommendations", label: "Recommandations", icon: Lightbulb },
          { id: "optimization", label: "Optimisation", icon: Target },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeView === tab.id
                  ? "bg-[#9B59B6] text-white"
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
      {activeView === "models" && renderModels()}
      {activeView === "patterns" && renderPatterns()}
      {activeView === "recommendations" && renderRecommendations()}
      {activeView === "optimization" && renderOptimization()}
    </div>
  );
}
