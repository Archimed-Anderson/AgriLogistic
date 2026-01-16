import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Leaf,
  Droplet,
  CloudRain,
  Sun,
  Wind,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Share2,
  RefreshCw,
  Filter,
  Calendar,
  MapPin,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Target,
  Zap,
  Eye,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  X,
  ThermometerSun,
  Sprout,
  Bug,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

export function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedParcels, setSelectedParcels] = useState<string[]>(["P1", "P2"]);
  const [activeLayer, setActiveLayer] = useState("ndvi");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAlertConfig, setShowAlertConfig] = useState(false);
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);

  // Current date and time
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  // KPI Data
  const kpis = [
    {
      id: "yield",
      label: "Rendement Estimé",
      value: "68,4",
      unit: "t/ha",
      trend: 12.5,
      positive: true,
      icon: Leaf,
      color: "green",
    },
    {
      id: "cost",
      label: "Coût de Production",
      value: "1.240",
      unit: "€/ha",
      trend: -3.2,
      positive: true,
      icon: DollarSign,
      color: "blue",
    },
    {
      id: "margin",
      label: "Marge Brute",
      value: "3.450",
      unit: "€/ha",
      trend: 8.4,
      positive: true,
      icon: TrendingUp,
      color: "emerald",
    },
    {
      id: "health",
      label: "Indice de Santé",
      value: "92",
      unit: "/100",
      trend: 2.1,
      positive: true,
      icon: Activity,
      color: "green",
    },
    {
      id: "carbon",
      label: "GES Économisés",
      value: "4,2",
      unit: "t CO2e",
      trend: 15.3,
      positive: true,
      icon: Leaf,
      color: "emerald",
    },
  ];

  // Parcel data
  const parcels = [
    { id: "P1", name: "Parcelle Nord", area: 12.5, crop: "Blé", ndvi: 0.78, health: 94 },
    { id: "P2", name: "Parcelle Sud", area: 8.3, crop: "Maïs", ndvi: 0.82, health: 91 },
    { id: "P3", name: "Parcelle Est", area: 15.2, crop: "Tournesol", ndvi: 0.68, health: 87 },
    { id: "P4", name: "Parcelle Ouest", area: 10.8, crop: "Colza", ndvi: 0.75, health: 89 },
  ];

  // Map layers
  const mapLayers = [
    { id: "ndvi", name: "NDVI (Santé)", icon: Leaf, color: "green" },
    { id: "moisture", name: "Humidité Sol", icon: Droplet, color: "blue" },
    { id: "temperature", name: "Température", icon: ThermometerSun, color: "orange" },
    { id: "biomass", name: "Biomasse", icon: Sprout, color: "emerald" },
    { id: "stress", name: "Stress Hydrique", icon: AlertTriangle, color: "red" },
  ];

  // Weather data
  const weatherData = {
    current: { temp: 22, humidity: 65, wind: 12, rain: 0 },
    forecast: [
      { day: "Lun", temp: 24, rain: 10, icon: Sun },
      { day: "Mar", temp: 23, rain: 20, icon: CloudRain },
      { day: "Mer", temp: 21, rain: 60, icon: CloudRain },
      { day: "Jeu", temp: 25, rain: 5, icon: Sun },
      { day: "Ven", temp: 26, rain: 0, icon: Sun },
      { day: "Sam", temp: 27, rain: 15, icon: Sun },
      { day: "Dim", temp: 25, rain: 30, icon: CloudRain },
    ],
  };

  // Alerts
  const alerts = [
    {
      id: "1",
      type: "critical",
      title: "Risque de mildiou détecté",
      message: "Conditions favorables au développement - Parcelle Nord",
      time: "Il y a 2h",
    },
    {
      id: "2",
      type: "warning",
      title: "Stress hydrique modéré",
      message: "Envisager irrigation - Parcelle Est",
      time: "Il y a 5h",
    },
    {
      id: "3",
      type: "info",
      title: "Fenêtre de traitement optimale",
      message: "Conditions idéales pour traitement fongicide - Demain 6h-10h",
      time: "Il y a 1h",
    },
  ];

  // Disease risk data
  const diseaseRisks = [
    { name: "Mildiou", risk: 8, parcels: ["P1"], treatment: "Fongicide curatif", cost: 45 },
    { name: "Oïdium", risk: 4, parcels: ["P2"], treatment: "Soufre", cost: 28 },
    { name: "Rouille", risk: 3, parcels: ["P3", "P4"], treatment: "Triazole", cost: 38 },
  ];

  // Yield prediction data
  const yieldPrediction = [
    { month: "Jan", actual: null, predicted: 45, min: 40, max: 50 },
    { month: "Fév", actual: null, predicted: 48, min: 43, max: 53 },
    { month: "Mar", actual: null, predicted: 52, min: 47, max: 57 },
    { month: "Avr", actual: null, predicted: 58, min: 52, max: 64 },
    { month: "Mai", actual: null, predicted: 64, min: 58, max: 70 },
    { month: "Juin", actual: null, predicted: 68.4, min: 62, max: 75 },
  ];

  // ROI data
  const roiData = [
    { intervention: "Fertilisation", cost: 120, gain: 340, roi: 183 },
    { intervention: "Traitement", cost: 65, gain: 180, roi: 177 },
    { intervention: "Irrigation", cost: 85, gain: 210, roi: 147 },
    { intervention: "Semences Premium", cost: 95, gain: 245, roi: 158 },
  ];

  // Correlation matrix
  const correlationMatrix = [
    { var1: "Rendement", var2: "Rendement", value: 1.0 },
    { var1: "Rendement", var2: "Humidité", value: 0.76 },
    { var1: "Rendement", var2: "Température", value: -0.32 },
    { var1: "Humidité", var2: "Rendement", value: 0.76 },
    { var1: "Humidité", var2: "Humidité", value: 1.0 },
    { var1: "Humidité", var2: "Température", value: -0.45 },
    { var1: "Température", var2: "Rendement", value: -0.32 },
    { var1: "Température", var2: "Humidité", value: -0.45 },
    { var1: "Température", var2: "Température", value: 1.0 },
  ];

  const handleRefreshData = () => {
    toast.success("Données mises à jour");
  };

  const handleExport = (format: string) => {
    toast.success(`Export ${format.toUpperCase()} en cours...`);
    setShowExportModal(false);
  };

  const toggleVariable = (variable: string) => {
    if (selectedVariables.includes(variable)) {
      setSelectedVariables(selectedVariables.filter((v) => v !== variable));
    } else {
      setSelectedVariables([...selectedVariables, variable]);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#27AE60] to-[#2ECC71] rounded-lg">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            Tableau de Bord AgroDeep
          </h1>
          <p className="text-muted-foreground mt-2">
            {currentDate} • {currentTime}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshData}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Partager
          </button>
          <button
            onClick={() => setShowAlertConfig(true)}
            className="px-4 py-2 bg-[#27AE60] text-white rounded-lg hover:bg-[#229954] transition-colors flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Alertes
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Période :</span>
          </div>
          <div className="flex gap-2">
            {[
              { value: "today", label: "Aujourd'hui" },
              { value: "7d", label: "7 jours" },
              { value: "30d", label: "30 jours" },
              { value: "season", label: "Saison" },
              { value: "custom", label: "Personnalisé" },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period.value
                    ? "bg-[#27AE60] text-white"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="bg-card border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setExpandedWidget(kpi.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-${kpi.color}-100 dark:bg-${kpi.color}-900/20 rounded-lg`}>
                  <Icon className={`h-6 w-6 text-${kpi.color}-600`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    kpi.positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpi.positive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {Math.abs(kpi.trend)}%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-3xl font-bold">
                  {kpi.value}
                  <span className="text-lg text-muted-foreground ml-1">{kpi.unit}</span>
                </p>
              </div>
              <button className="mt-3 text-xs text-[#27AE60] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Détails
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#27AE60]" />
              Alertes Actives ({alerts.length})
            </h3>
            <button className="text-sm text-[#27AE60] hover:underline">Tout voir</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 border rounded-lg ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Map */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#27AE60]" />
                Carte Interactive des Parcelles
              </h2>
              <div className="flex items-center gap-2">
                <select className="px-3 py-1.5 text-sm border rounded-lg bg-background">
                  <option>Vue Satellite</option>
                  <option>Vue Carte</option>
                  <option>Vue Hybride</option>
                </select>
              </div>
            </div>

            {/* Map Layers */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {mapLayers.map((layer) => {
                const Icon = layer.icon;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                      activeLayer === layer.id
                        ? `bg-${layer.color}-600 text-white`
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {layer.name}
                  </button>
                );
              })}
            </div>

            {/* Map Visualization */}
            <div className="relative h-96 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 rounded-lg overflow-hidden border-2 border-dashed">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-semibold mb-2">Carte Interactive</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Visualisation {activeLayer.toUpperCase()}
                  </p>
                  {/* Simulated parcels */}
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {parcels.map((parcel) => (
                      <button
                        key={parcel.id}
                        onClick={() => {
                          if (selectedParcels.includes(parcel.id)) {
                            setSelectedParcels(selectedParcels.filter((p) => p !== parcel.id));
                          } else {
                            setSelectedParcels([...selectedParcels, parcel.id]);
                          }
                        }}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          selectedParcels.includes(parcel.id)
                            ? "border-[#27AE60] bg-green-50 dark:bg-green-900/20"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{parcel.name}</span>
                          {selectedParcels.includes(parcel.id) && (
                            <CheckCircle className="h-4 w-4 text-[#27AE60]" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Surface: {parcel.area} ha</div>
                          <div>Culture: {parcel.crop}</div>
                          <div className="flex items-center gap-2">
                            NDVI:
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-600"
                                style={{ width: `${parcel.ndvi * 100}%` }}
                              />
                            </div>
                            <span>{parcel.ndvi}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-card border rounded-lg p-3 shadow-lg">
                <div className="text-xs font-semibold mb-2">Légende</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                    <span>Excellent (0.8-1.0)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                    <span>Moyen (0.6-0.8)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    <span>Faible (&lt;0.6)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Yield Prediction */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <LineChart className="h-5 w-5 text-[#27AE60]" />
                Prévisions de Rendement IA
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
                  Confiance: 87%
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className="relative h-64">
              <svg className="w-full h-full">
                {/* Y-axis labels */}
                {[0, 20, 40, 60, 80].map((value, i) => (
                  <g key={value}>
                    <text
                      x="20"
                      y={256 - (value / 80) * 240}
                      className="text-xs fill-muted-foreground"
                    >
                      {value}
                    </text>
                    <line
                      x1="40"
                      y1={256 - (value / 80) * 240}
                      x2="100%"
                      y2={256 - (value / 80) * 240}
                      className="stroke-muted"
                      strokeWidth="1"
                      strokeDasharray="4"
                    />
                  </g>
                ))}

                {/* Prediction line with confidence interval */}
                <path
                  d={yieldPrediction
                    .map(
                      (d, i) =>
                        `${i === 0 ? "M" : "L"} ${50 + i * 100} ${256 - (d.predicted / 80) * 240}`
                    )
                    .join(" ")}
                  className="stroke-[#27AE60] fill-none"
                  strokeWidth="3"
                />

                {/* Points */}
                {yieldPrediction.map((d, i) => (
                  <g key={i}>
                    <circle
                      cx={50 + i * 100}
                      cy={256 - (d.predicted / 80) * 240}
                      r="5"
                      className="fill-[#27AE60]"
                    />
                    <text
                      x={50 + i * 100}
                      y={270}
                      className="text-xs fill-muted-foreground text-anchor-middle"
                      textAnchor="middle"
                    >
                      {d.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Influencing Factors */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold mb-3">Facteurs influents</h3>
              <div className="space-y-2">
                {[
                  { name: "Météo", value: 40, color: "blue" },
                  { name: "Fertilisation", value: 35, color: "green" },
                  { name: "Irrigation", value: 25, color: "cyan" },
                ].map((factor) => (
                  <div key={factor.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{factor.name}</span>
                      <span className="font-medium">{factor.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${factor.color}-600`}
                        style={{ width: `${factor.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Economic Analysis */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <DollarSign className="h-5 w-5 text-[#27AE60]" />
              Analyse Économique - ROI par Intervention
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Intervention</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Coût (€/ha)</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Gain (€/ha)</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">ROI (%)</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {roiData.map((row, index) => (
                    <tr key={index} className="border-b last:border-b-0 hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{row.intervention}</td>
                      <td className="px-4 py-3 text-right">{row.cost}€</td>
                      <td className="px-4 py-3 text-right text-green-600 font-medium">
                        +{row.gain}€
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`px-2 py-1 rounded text-sm font-bold ${
                            row.roi > 150
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          }`}
                        >
                          {row.roi}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="px-3 py-1 text-sm bg-[#27AE60] text-white rounded hover:bg-[#229954] transition-colors">
                          Planifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Scenario Simulation */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold mb-4">Simulation de Scénarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Prix de vente", value: 180, unit: "€/t", min: 150, max: 250 },
                  { label: "Coût engrais", value: 120, unit: "€/ha", min: 80, max: 180 },
                  { label: "Rendement cible", value: 68, unit: "t/ha", min: 50, max: 90 },
                ].map((slider) => (
                  <div key={slider.label}>
                    <label className="block text-sm font-medium mb-2">{slider.label}</label>
                    <input
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      defaultValue={slider.value}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-[#27AE60]"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{slider.min}</span>
                      <span className="font-bold text-foreground">
                        {slider.value} {slider.unit}
                      </span>
                      <span>{slider.max}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Weather Widget */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Sun className="h-5 w-5 text-orange-500" />
              Météo
            </h2>

            {/* Current Weather */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-4xl font-bold">{weatherData.current.temp}°C</div>
                  <div className="text-sm opacity-90">Conditions actuelles</div>
                </div>
                <Sun className="h-12 w-12 opacity-90" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Droplet className="h-4 w-4" />
                  {weatherData.current.humidity}%
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="h-4 w-4" />
                  {weatherData.current.wind} km/h
                </div>
                <div className="flex items-center gap-1">
                  <CloudRain className="h-4 w-4" />
                  {weatherData.current.rain} mm
                </div>
              </div>
            </div>

            {/* Forecast */}
            <div className="space-y-2">
              {weatherData.forecast.map((day, i) => {
                const Icon = day.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                    <span className="text-sm font-medium w-12">{day.day}</span>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{day.temp}°C</span>
                    <div className="flex items-center gap-1 text-sm text-blue-600">
                      <Droplet className="h-3 w-3" />
                      {day.rain}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disease Risk */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Bug className="h-5 w-5 text-red-500" />
              Risque Maladies
            </h2>

            <div className="space-y-4">
              {diseaseRisks.map((disease, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">{disease.name}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        disease.risk >= 7
                          ? "bg-red-100 text-red-700 dark:bg-red-900/20"
                          : disease.risk >= 4
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20"
                          : "bg-green-100 text-green-700 dark:bg-green-900/20"
                      }`}
                    >
                      Risque: {disease.risk}/10
                    </span>
                  </div>

                  <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full ${
                        disease.risk >= 7
                          ? "bg-red-600"
                          : disease.risk >= 4
                          ? "bg-orange-600"
                          : "bg-green-600"
                      }`}
                      style={{ width: `${disease.risk * 10}%` }}
                    />
                  </div>

                  <div className="text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>Parcelles: {disease.parcels.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-muted-foreground" />
                      <span>{disease.treatment}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span>Coût: {disease.cost}€/ha</span>
                    </div>
                  </div>

                  {disease.risk >= 7 && (
                    <button className="w-full mt-3 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
                      Action urgente
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sensor Data */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Activity className="h-5 w-5 text-[#27AE60]" />
              Capteurs IoT
            </h2>

            <div className="space-y-4">
              {[
                {
                  name: "Humidité Sol",
                  value: "42%",
                  status: "optimal",
                  icon: Droplet,
                  color: "blue",
                },
                {
                  name: "Température Sol",
                  value: "18°C",
                  status: "optimal",
                  icon: ThermometerSun,
                  color: "orange",
                },
                {
                  name: "Luminosité (PAR)",
                  value: "850 μmol",
                  status: "optimal",
                  icon: Sun,
                  color: "yellow",
                },
                {
                  name: "Pluviométrie",
                  value: "2.4 mm",
                  status: "faible",
                  icon: CloudRain,
                  color: "blue",
                },
              ].map((sensor, i) => {
                const Icon = sensor.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-${sensor.color}-100 dark:bg-${sensor.color}-900/20 rounded`}>
                        <Icon className={`h-4 w-4 text-${sensor.color}-600`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{sensor.name}</div>
                        <div className="text-xs text-muted-foreground">Temps réel</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{sensor.value}</div>
                      <div
                        className={`text-xs ${
                          sensor.status === "optimal" ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {sensor.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="w-full mt-4 px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm flex items-center justify-center gap-2">
              <Eye className="h-4 w-4" />
              Voir tous les capteurs
            </button>
          </div>

          {/* Data Basket */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <ShoppingCart className="h-5 w-5 text-[#27AE60]" />
              Panier d'Analyse
              {selectedVariables.length > 0 && (
                <span className="px-2 py-0.5 bg-[#27AE60] text-white text-xs rounded-full">
                  {selectedVariables.length}
                </span>
              )}
            </h2>

            <div className="space-y-2 mb-4">
              {["Rendement", "Humidité", "Température", "NDVI", "Biomasse"].map((variable) => (
                <label
                  key={variable}
                  className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedVariables.includes(variable)}
                    onChange={() => toggleVariable(variable)}
                    className="h-4 w-4 rounded border-gray-300 text-[#27AE60] focus:ring-[#27AE60]"
                  />
                  <span className="text-sm">{variable}</span>
                </label>
              ))}
            </div>

            {selectedVariables.length >= 2 && (
              <button className="w-full px-4 py-2 bg-[#27AE60] text-white rounded-lg hover:bg-[#229954] transition-colors text-sm">
                Générer analyse croisée
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Correlation Matrix - Full Width */}
      {selectedVariables.length >= 2 && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-[#27AE60]" />
            Matrice de Corrélation
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border"></th>
                  <th className="p-2 border text-sm">Rendement</th>
                  <th className="p-2 border text-sm">Humidité</th>
                  <th className="p-2 border text-sm">Température</th>
                </tr>
              </thead>
              <tbody>
                {["Rendement", "Humidité", "Température"].map((row) => (
                  <tr key={row}>
                    <th className="p-2 border text-sm font-medium text-left">{row}</th>
                    {["Rendement", "Humidité", "Température"].map((col) => {
                      const cell = correlationMatrix.find(
                        (c) => c.var1 === row && c.var2 === col
                      );
                      const value = cell?.value || 0;
                      const intensity = Math.abs(value);
                      return (
                        <td
                          key={col}
                          className="p-4 border text-center font-bold"
                          style={{
                            backgroundColor:
                              value > 0
                                ? `rgba(39, 174, 96, ${intensity})`
                                : `rgba(231, 76, 60, ${intensity})`,
                            color: intensity > 0.5 ? "white" : "inherit",
                          }}
                        >
                          {value.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            💡 Les valeurs proches de 1 ou -1 indiquent une forte corrélation (positive ou négative)
          </p>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Exporter le Rapport</h2>
              <button onClick={() => setShowExportModal(false)} className="p-1 hover:bg-muted rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {["PDF", "Excel", "PowerPoint", "CSV"].map((format) => (
                    <button
                      key={format}
                      onClick={() => handleExport(format.toLowerCase())}
                      className="px-4 py-3 border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contenu</label>
                <div className="space-y-2">
                  {["KPIs", "Carte des parcelles", "Prévisions", "Analyse économique", "Données capteurs"].map(
                    (item) => (
                      <label key={item} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-[#27AE60] focus:ring-[#27AE60]"
                        />
                        {item}
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="px-6 py-2 bg-[#27AE60] text-white rounded-lg hover:bg-[#229954] transition-colors"
              >
                Exporter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Config Modal */}
      {showAlertConfig && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Configuration des Alertes</h2>
              <button onClick={() => setShowAlertConfig(false)} className="p-1 hover:bg-muted rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {[
                { name: "Stress hydrique", threshold: 30, unit: "%" },
                { name: "Température critique", threshold: 35, unit: "°C" },
                { name: "Risque maladie", threshold: 7, unit: "/10" },
                { name: "NDVI faible", threshold: 0.6, unit: "" },
              ].map((alert) => (
                <div key={alert.name} className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-medium">{alert.name}</label>
                    <span className="text-sm text-muted-foreground">
                      Seuil: {alert.threshold} {alert.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue={alert.threshold}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-[#27AE60]"
                  />
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      Email
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      SMS
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      In-App
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowAlertConfig(false)}
                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  toast.success("Alertes configurées");
                  setShowAlertConfig(false);
                }}
                className="px-6 py-2 bg-[#27AE60] text-white rounded-lg hover:bg-[#229954] transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
