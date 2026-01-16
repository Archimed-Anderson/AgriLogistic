import { useState } from "react";
import {
  Map,
  TrendingUp,
  Droplet,
  AlertTriangle,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  Share2,
  Calendar,
  Activity,
  Bug,
  Thermometer,
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Eye,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  Settings,
  Plus,
  BarChart3,
  LineChart,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Sprout,
  Leaf,
  Wheat,
} from "lucide-react";
import { toast } from "sonner";

interface Field {
  id: string;
  name: string;
  crop: string;
  area: number;
  healthIndex: number;
  moistureLevel: number;
  temperatureAvg: number;
  diseaseRisk: "low" | "medium" | "high";
  irrigationNeeded: boolean;
  lastUpdated: string;
}

export function CropIntelligence() {
  const [activeView, setActiveView] = useState<"overview" | "mapping" | "growth" | "disease" | "irrigation" | "weather">("overview");
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [mapLayer, setMapLayer] = useState<"satellite" | "ndvi" | "moisture" | "temperature">("ndvi");

  // KPIs Data
  const kpis = [
    {
      id: "health",
      label: "Indice de Santé Moyen",
      value: "84/100",
      change: 3,
      icon: Sprout,
      color: "green",
      trend: "up",
    },
    {
      id: "optimal",
      label: "Conditions Optimales",
      value: "78%",
      subtitle: "des parcelles",
      change: 5,
      icon: Target,
      color: "blue",
      trend: "up",
    },
    {
      id: "irrigation",
      label: "Besoins Irrigation",
      value: "12",
      subtitle: "parcelles",
      change: -2,
      icon: Droplet,
      color: "cyan",
      trend: "down",
    },
    {
      id: "disease",
      label: "Risques Maladies",
      value: "3",
      subtitle: "alertes actives",
      change: 1,
      icon: AlertTriangle,
      color: "orange",
      trend: "up",
    },
  ];

  // Fields Data
  const fields: Field[] = [
    {
      id: "F001",
      name: "Parcelle Nord A",
      crop: "Maïs",
      area: 12.5,
      healthIndex: 92,
      moistureLevel: 68,
      temperatureAvg: 24,
      diseaseRisk: "low",
      irrigationNeeded: false,
      lastUpdated: "Il y a 15 min",
    },
    {
      id: "F002",
      name: "Parcelle Nord B",
      crop: "Blé",
      area: 18.3,
      healthIndex: 78,
      moistureLevel: 42,
      temperatureAvg: 26,
      diseaseRisk: "medium",
      irrigationNeeded: true,
      lastUpdated: "Il y a 20 min",
    },
    {
      id: "F003",
      name: "Parcelle Sud",
      crop: "Soja",
      area: 15.7,
      healthIndex: 88,
      moistureLevel: 55,
      temperatureAvg: 23,
      diseaseRisk: "low",
      irrigationNeeded: false,
      lastUpdated: "Il y a 10 min",
    },
    {
      id: "F004",
      name: "Parcelle Est",
      crop: "Tournesol",
      area: 9.2,
      healthIndex: 65,
      moistureLevel: 38,
      temperatureAvg: 28,
      diseaseRisk: "high",
      irrigationNeeded: true,
      lastUpdated: "Il y a 5 min",
    },
  ];

  // Growth stages
  const growthStages = [
    { stage: "Germination", progress: 100, status: "completed" },
    { stage: "Croissance végétative", progress: 100, status: "completed" },
    { stage: "Floraison", progress: 75, status: "active" },
    { stage: "Fructification", progress: 20, status: "upcoming" },
    { stage: "Maturité", progress: 0, status: "upcoming" },
  ];

  // Diseases database
  const diseases = [
    {
      id: "D001",
      name: "Mildiou",
      severity: "high",
      affectedFields: 1,
      symptoms: "Taches jaunes sur feuilles",
      treatment: "Cuivre + Soufre",
      image: "🦠",
    },
    {
      id: "D002",
      name: "Rouille",
      severity: "medium",
      affectedFields: 2,
      symptoms: "Pustules orangées",
      treatment: "Fongicide triazole",
      image: "🔴",
    },
    {
      id: "D003",
      name: "Fusariose",
      severity: "low",
      affectedFields: 0,
      symptoms: "Pourriture des racines",
      treatment: "Rotation cultures",
      image: "🟤",
    },
  ];

  // Weather data
  const weatherData = {
    current: {
      temp: 24,
      humidity: 65,
      wind: 12,
      pressure: 1013,
      condition: "Ensoleillé",
    },
    forecast: [
      { day: "Lun", temp: 26, condition: "sunny", rain: 0 },
      { day: "Mar", temp: 24, condition: "cloudy", rain: 20 },
      { day: "Mer", temp: 22, condition: "rainy", rain: 80 },
      { day: "Jeu", temp: 23, condition: "cloudy", rain: 40 },
      { day: "Ven", temp: 25, condition: "sunny", rain: 0 },
      { day: "Sam", temp: 27, condition: "sunny", rain: 0 },
      { day: "Dim", temp: 28, condition: "sunny", rain: 5 },
    ],
  };

  const getRiskColor = (risk: string) => {
    const colors: { [key: string]: { bg: string; text: string; border: string } } = {
      low: { bg: "bg-green-100 dark:bg-green-900/20", text: "text-green-700", border: "border-green-300" },
      medium: { bg: "bg-orange-100 dark:bg-orange-900/20", text: "text-orange-700", border: "border-orange-300" },
      high: { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-700", border: "border-red-300" },
    };
    return colors[risk] || colors.low;
  };

  const getWeatherIcon = (condition: string) => {
    const icons: { [key: string]: any } = {
      sunny: Sun,
      cloudy: Cloud,
      rainy: CloudRain,
    };
    return icons[condition] || Sun;
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
                    kpi.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingUp className="h-3 w-3 rotate-180" />
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Map */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Carte Interactive des Parcelles</h3>
              <p className="text-sm text-muted-foreground">Vue {mapLayer.toUpperCase()} en temps réel</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={mapLayer}
                onChange={(e) => setMapLayer(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm bg-background"
              >
                <option value="satellite">Satellite</option>
                <option value="ndvi">NDVI (Santé végétale)</option>
                <option value="moisture">Humidité du sol</option>
                <option value="temperature">Température</option>
              </select>
              <button className="p-2 border rounded-lg hover:bg-muted">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button className="p-2 border rounded-lg hover:bg-muted">
                <ZoomOut className="h-4 w-4" />
              </button>
              <button className="p-2 border rounded-lg hover:bg-muted">
                <Maximize className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative h-[500px] bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          {/* Map Visualization */}
          <div className="absolute inset-0 p-8">
            <div className="grid grid-cols-2 gap-4 h-full">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  onClick={() => setSelectedField(field.id)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedField === field.id
                      ? "border-[#2E8B57] bg-white dark:bg-gray-800 shadow-xl scale-105"
                      : "border-gray-300 bg-white/80 dark:bg-gray-800/80 hover:border-[#3CB371]"
                  }`}
                  style={{
                    opacity: mapLayer === "ndvi" ? field.healthIndex / 100 : 1,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm">{field.name}</div>
                      <div className="text-xs text-muted-foreground">{field.crop} • {field.area} ha</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${field.healthIndex > 80 ? "bg-green-500" : field.healthIndex > 60 ? "bg-orange-500" : "bg-red-500"}`} />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Santé:</span>
                      <span className="font-semibold">{field.healthIndex}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Humidité:</span>
                      <span className="font-semibold">{field.moistureLevel}%</span>
                    </div>
                    {field.irrigationNeeded && (
                      <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs font-semibold flex items-center gap-1">
                        <Droplet className="h-3 w-3" />
                        Irrigation requise
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 border rounded-lg p-3 shadow-lg">
            <div className="text-xs font-semibold mb-2">Légende</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Excellent (&gt;80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span>Moyen (60-80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Faible (&lt;60%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fields Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">État des Parcelles</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Parcelle</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Culture</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Surface</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Santé</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Humidité</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Température</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Risque Maladie</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => {
                const riskColors = getRiskColor(field.diseaseRisk);
                return (
                  <tr key={field.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">{field.name}</div>
                      <div className="text-xs text-muted-foreground">{field.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Wheat className="h-4 w-4 text-[#2E8B57]" />
                        <span className="text-sm">{field.crop}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{field.area} ha</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[80px]">
                          <div
                            className={`h-full ${field.healthIndex > 80 ? "bg-green-500" : field.healthIndex > 60 ? "bg-orange-500" : "bg-red-500"}`}
                            style={{ width: `${field.healthIndex}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{field.healthIndex}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Droplet className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{field.moistureLevel}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">{field.temperatureAvg}°C</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${riskColors.text} ${riskColors.bg}`}
                      >
                        {field.diseaseRisk === "low" && "Faible"}
                        {field.diseaseRisk === "medium" && "Moyen"}
                        {field.diseaseRisk === "high" && "Élevé"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-muted rounded" title="Voir détails">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Analyser">
                          <BarChart3 className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Planifier irrigation">
                          <Droplet className="h-4 w-4" />
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

  const renderGrowth = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analyse de Croissance</h2>
        <p className="text-muted-foreground">Suivi des stades phénologiques et prédictions</p>
      </div>

      {/* Growth Stages */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Stades Phénologiques - Maïs</h3>
        <div className="space-y-4">
          {growthStages.map((stage, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {stage.status === "completed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {stage.status === "active" && <Activity className="h-5 w-5 text-blue-600 animate-pulse" />}
                  {stage.status === "upcoming" && <Clock className="h-5 w-5 text-gray-400" />}
                  <span className="font-medium">{stage.stage}</span>
                </div>
                <span className="text-sm font-semibold">{stage.progress}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    stage.status === "completed"
                      ? "bg-green-500"
                      : stage.status === "active"
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                  style={{ width: `${stage.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Courbe de Croissance Comparative</h3>
        <div className="h-64 flex items-end justify-around gap-2">
          {[
            { week: "S1", current: 15, previous: 12, predicted: 18 },
            { week: "S2", current: 28, previous: 24, predicted: 32 },
            { week: "S3", current: 45, previous: 38, predicted: 48 },
            { week: "S4", current: 62, previous: 55, predicted: 65 },
            { week: "S5", current: 78, previous: 70, predicted: 82 },
            { week: "S6", current: 88, previous: 82, predicted: 92 },
            { week: "S7", current: 0, previous: 90, predicted: 98 },
          ].map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              {data.current > 0 && (
                <div
                  className="w-full bg-[#2E8B57] rounded-t transition-all hover:opacity-80 cursor-pointer"
                  style={{ height: `${data.current}%` }}
                  title={`Actuel: ${data.current}%`}
                />
              )}
              {data.predicted > 0 && data.current === 0 && (
                <div
                  className="w-full bg-[#3CB371]/50 border-2 border-dashed border-[#2E8B57] rounded-t transition-all"
                  style={{ height: `${data.predicted}%` }}
                  title={`Prédiction: ${data.predicted}%`}
                />
              )}
              <div className="text-xs font-medium text-muted-foreground mt-2">{data.week}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#2E8B57] rounded"></div>
            <span className="text-muted-foreground">Saison actuelle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#3CB371]/50 border-2 border-dashed border-[#2E8B57] rounded"></div>
            <span className="text-muted-foreground">Prédiction IA</span>
          </div>
        </div>
      </div>

      {/* Yield Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-2">Rendement Estimé</div>
          <div className="text-3xl font-bold text-[#2E8B57]">8.2 t/ha</div>
          <div className="text-xs text-muted-foreground mt-1">Intervalle: 7.8 - 8.6 t/ha</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-2">Maturité Prévue</div>
          <div className="text-3xl font-bold">15 jours</div>
          <div className="text-xs text-muted-foreground mt-1">Date estimée: 28 janvier</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-2">Confiance IA</div>
          <div className="text-3xl font-bold text-blue-600">94%</div>
          <div className="text-xs text-muted-foreground mt-1">Basé sur 3 saisons</div>
        </div>
      </div>
    </div>
  );

  const renderDisease = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Surveillance des Maladies</h2>
        <p className="text-muted-foreground">Base de données et alertes précoces</p>
      </div>

      {/* Disease Risk Map */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Carte Thermique des Risques</h3>
        <div className="grid grid-cols-4 gap-2">
          {fields.map((field) => {
            const riskColors = getRiskColor(field.diseaseRisk);
            return (
              <div
                key={field.id}
                className={`p-4 rounded-lg border-2 ${riskColors.bg} ${riskColors.border}`}
              >
                <div className="text-sm font-semibold">{field.name}</div>
                <div className="text-xs text-muted-foreground">{field.crop}</div>
                <div className={`text-xs font-bold mt-2 ${riskColors.text}`}>
                  Risque: {field.diseaseRisk === "low" ? "Faible" : field.diseaseRisk === "medium" ? "Moyen" : "Élevé"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diseases Database */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Base de Données Maladies</h3>
            <button className="px-4 py-2 bg-[#2E8B57] text-white rounded-lg hover:bg-[#267049] transition-colors font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle Maladie
            </button>
          </div>
        </div>

        <div className="divide-y">
          {diseases.map((disease) => {
            const severity = disease.severity as "low" | "medium" | "high";
            const colors = getRiskColor(severity);
            return (
              <div key={disease.id} className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{disease.image}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{disease.name}</h4>
                        <p className="text-sm text-muted-foreground">{disease.symptoms}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.text} ${colors.bg}`}
                      >
                        Sévérité: {severity === "low" ? "Faible" : severity === "medium" ? "Moyenne" : "Élevée"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground">Parcelles touchées</div>
                        <div className="text-xl font-bold">{disease.affectedFields}</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground">Traitement recommandé</div>
                        <div className="text-sm font-semibold">{disease.treatment}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
                          Guide Traitement
                        </button>
                        <button className="flex-1 px-4 py-2 bg-[#2E8B57] text-white rounded-lg hover:bg-[#267049] transition-colors text-sm font-medium">
                          Appliquer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderIrrigation = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Planification de l'Irrigation</h2>
        <p className="text-muted-foreground">Optimisez vos ressources en eau</p>
      </div>

      {/* Water Needs Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <Droplet className="h-8 w-8 text-blue-500 mb-3" />
          <div className="text-sm text-muted-foreground mb-2">Besoins Totaux</div>
          <div className="text-3xl font-bold">1,240 m³</div>
          <div className="text-xs text-muted-foreground mt-1">Pour 7 prochains jours</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <Activity className="h-8 w-8 text-green-500 mb-3" />
          <div className="text-sm text-muted-foreground mb-2">Économies Potentielles</div>
          <div className="text-3xl font-bold text-green-600">18%</div>
          <div className="text-xs text-muted-foreground mt-1">Avec optimisation IA</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <Calendar className="h-8 w-8 text-purple-500 mb-3" />
          <div className="text-sm text-muted-foreground mb-2">Prochaine Irrigation</div>
          <div className="text-3xl font-bold">Demain</div>
          <div className="text-xs text-muted-foreground mt-1">Parcelle Nord B - 08:00</div>
        </div>
      </div>

      {/* Irrigation Schedule */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Calendrier d'Irrigation - 7 Jours</h3>
        <div className="space-y-3">
          {[
            { day: "Lundi 13", fields: ["Parcelle Nord B", "Parcelle Est"], volume: 450, duration: "2h 30min" },
            { day: "Mercredi 15", fields: ["Parcelle Sud"], volume: 320, duration: "1h 45min" },
            { day: "Vendredi 17", fields: ["Parcelle Nord B", "Parcelle Est"], volume: 470, duration: "2h 40min" },
          ].map((schedule, index) => (
            <div key={index} className="p-4 border-2 border-dashed rounded-lg hover:border-[#2E8B57] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{schedule.day}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{schedule.volume} m³</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{schedule.duration}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {schedule.fields.map((field, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs font-medium"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWeather = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Intégration Météo</h2>
        <p className="text-muted-foreground">Prévisions hyper-locales pour vos parcelles</p>
      </div>

      {/* Current Weather */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm opacity-90 mb-2">Conditions Actuelles</div>
            <div className="text-5xl font-bold mb-2">{weatherData.current.temp}°C</div>
            <div className="text-lg opacity-90">{weatherData.current.condition}</div>
          </div>
          <Sun className="h-20 w-20 opacity-90" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
          <div>
            <div className="text-xs opacity-75">Humidité</div>
            <div className="text-xl font-bold">{weatherData.current.humidity}%</div>
          </div>
          <div>
            <div className="text-xs opacity-75">Vent</div>
            <div className="text-xl font-bold">{weatherData.current.wind} km/h</div>
          </div>
          <div>
            <div className="text-xs opacity-75">Pression</div>
            <div className="text-xl font-bold">{weatherData.current.pressure} hPa</div>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Prévisions 7 Jours</h3>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          {weatherData.forecast.map((day, index) => {
            const WeatherIcon = getWeatherIcon(day.condition);
            return (
              <div
                key={index}
                className="p-4 border rounded-lg hover:bg-muted transition-colors text-center"
              >
                <div className="text-sm font-medium mb-2">{day.day}</div>
                <WeatherIcon className="h-10 w-10 mx-auto mb-2 text-[#2E8B57]" />
                <div className="text-2xl font-bold mb-2">{day.temp}°C</div>
                <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                  <CloudRain className="h-3 w-3" />
                  <span>{day.rain}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weather Alerts */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Alertes Météo</h3>
        <div className="space-y-3">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-orange-900 dark:text-orange-100">
                  Risque de pluie abondante - Mercredi
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                  Précipitations prévues: 25-35mm. Reportez l'irrigation et les traitements.
                </div>
              </div>
            </div>
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
            <h1 className="text-3xl font-bold tracking-tight">Crop Intelligence</h1>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
              SMART FARMING
            </span>
          </div>
          <p className="text-muted-foreground">
            Surveillance et optimisation de vos cultures en temps réel
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-background"
          >
            <option value="today">Aujourd'hui</option>
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="season">Cette saison</option>
          </select>

          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>

          <button className="px-6 py-2 bg-[#2E8B57] text-white rounded-lg hover:bg-[#267049] transition-colors font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nouvelle Analyse
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card border rounded-xl p-2 flex gap-2 overflow-x-auto">
        {[
          { id: "overview", label: "Vue d'ensemble", icon: Map },
          { id: "mapping", label: "Field Mapping", icon: Layers },
          { id: "growth", label: "Croissance", icon: TrendingUp },
          { id: "disease", label: "Maladies", icon: Bug },
          { id: "irrigation", label: "Irrigation", icon: Droplet },
          { id: "weather", label: "Météo", icon: Cloud },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeView === tab.id
                  ? "bg-[#2E8B57] text-white"
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
      {activeView === "mapping" && renderOverview()} {/* Using overview for mapping demo */}
      {activeView === "growth" && renderGrowth()}
      {activeView === "disease" && renderDisease()}
      {activeView === "irrigation" && renderIrrigation()}
      {activeView === "weather" && renderWeather()}
    </div>
  );
}
