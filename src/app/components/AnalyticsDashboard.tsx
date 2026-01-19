import { useState, useEffect } from "react";
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
  EyeOff,
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
  const [forecastHorizon, setForecastHorizon] = useState<"3m" | "6m" | "12m">("6m");
  const [showForecastDetails, setShowForecastDetails] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<"pdf" | "excel" | "csv" | "ppt" | null>(null);
  const [exportContent, setExportContent] = useState({
    kpis: true,
    map: true,
    forecasts: true,
    economic: true,
    sensors: true,
    weather: true,
    diseases: true,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState<{
    widgets: Array<{
      id: string;
      type: "kpi" | "forecast" | "weather" | "sensors" | "map" | "economic" | "alerts";
      title: string;
      visible: boolean;
      position: { x: number; y: number; w: number; h: number };
    }>;
  }>(() => {
    // Load saved layout from localStorage or use default
    const saved = localStorage.getItem("AgroLogistic-dashboard-layout");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse dashboard layout", e);
      }
    }
    // Default layout
    return {
      widgets: [
        { id: "w1", type: "kpi", title: "KPIs Principaux", visible: true, position: { x: 0, y: 0, w: 12, h: 2 } },
        { id: "w2", type: "forecast", title: "Prévisions IA", visible: true, position: { x: 0, y: 2, w: 8, h: 4 } },
        { id: "w3", type: "weather", title: "Météo", visible: true, position: { x: 8, y: 2, w: 4, h: 4 } },
        { id: "w4", type: "sensors", title: "Capteurs IoT", visible: true, position: { x: 0, y: 6, w: 6, h: 3 } },
        { id: "w5", type: "map", title: "Carte Parcelles", visible: true, position: { x: 6, y: 6, w: 6, h: 3 } },
        { id: "w6", type: "economic", title: "Analyse ROI", visible: false, position: { x: 0, y: 9, w: 12, h: 3 } },
        { id: "w7", type: "alerts", title: "Alertes Actives", visible: false, position: { x: 0, y: 12, w: 12, h: 2 } },
      ],
    };
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<Array<{
    id: string;
    type: "critical" | "warning" | "info";
    title: string;
    message: string;
    timestamp: string;
    threshold: { metric: string; value: number; actual: number };
    read: boolean;
    dismissed: boolean;
  }>>([]);
  const [alertThresholds, setAlertThresholds] = useState(() => {
    const saved = localStorage.getItem("AgroLogistic-alert-thresholds");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse alert thresholds", e);
      }
    }
    return {
      stressHydrique: { enabled: true, value: 30, unit: "%" },
      temperatureCritique: { enabled: true, value: 35, unit: "°C" },
      risqueMaladie: { enabled: true, value: 7, unit: "/10" },
      ndviFaible: { enabled: true, value: 0.6, unit: "" },
    };
  });
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

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

  // Enhanced AI forecasts with confidence intervals for different horizons
  const forecastData = {
    "3m": {
      confidence: 92,
      predictions: [
        { month: "Mois 1", value: 68.4, lower: 65.2, upper: 71.6, confidence: 92 },
        { month: "Mois 2", value: 70.1, lower: 66.3, upper: 73.9, confidence: 89 },
        { month: "Mois 3", value: 72.5, lower: 67.8, upper: 77.2, confidence: 85 },
      ],
      keyFactors: [
        { name: "Météo prévue", impact: 45, trend: "positive" },
        { name: "Tendance marché", impact: 30, trend: "stable" },
        { name: "Pratiques culturales", impact: 25, trend: "positive" },
      ],
    },
    "6m": {
      confidence: 87,
      predictions: [
        { month: "Mois 1", value: 68.4, lower: 65.2, upper: 71.6, confidence: 92 },
        { month: "Mois 2", value: 70.1, lower: 66.3, upper: 73.9, confidence: 89 },
        { month: "Mois 3", value: 72.5, lower: 67.8, upper: 77.2, confidence: 85 },
        { month: "Mois 4", value: 75.3, lower: 69.1, upper: 81.5, confidence: 82 },
        { month: "Mois 5", value: 78.8, lower: 71.2, upper: 86.4, confidence: 78 },
        { month: "Mois 6", value: 82.1, lower: 73.5, upper: 90.7, confidence: 74 },
      ],
      keyFactors: [
        { name: "Météo saisonnière", impact: 40, trend: "positive" },
        { name: "Prix marché", impact: 25, trend: "stable" },
        { name: "Rotation cultures", impact: 20, trend: "positive" },
        { name: "Stress climatique", impact: 15, trend: "neutral" },
      ],
    },
    "12m": {
      confidence: 78,
      predictions: [
        { month: "Mois 1", value: 68.4, lower: 65.2, upper: 71.6, confidence: 92 },
        { month: "Mois 2", value: 70.1, lower: 66.3, upper: 73.9, confidence: 89 },
        { month: "Mois 3", value: 72.5, lower: 67.8, upper: 77.2, confidence: 85 },
        { month: "Mois 4", value: 75.3, lower: 69.1, upper: 81.5, confidence: 82 },
        { month: "Mois 5", value: 78.8, lower: 71.2, upper: 86.4, confidence: 78 },
        { month: "Mois 6", value: 82.1, lower: 73.5, upper: 90.7, confidence: 74 },
        { month: "Mois 7", value: 85.6, lower: 75.3, upper: 95.9, confidence: 70 },
        { month: "Mois 8", value: 88.2, lower: 76.8, upper: 99.6, confidence: 67 },
        { month: "Mois 9", value: 90.5, lower: 77.9, upper: 103.1, confidence: 63 },
        { month: "Mois 10", value: 92.1, lower: 78.2, upper: 106.0, confidence: 60 },
        { month: "Mois 11", value: 93.8, lower: 78.5, upper: 109.1, confidence: 57 },
        { month: "Mois 12", value: 95.2, lower: 78.6, upper: 111.8, confidence: 54 },
      ],
      keyFactors: [
        { name: "Climat annuel", impact: 35, trend: "neutral" },
        { name: "Marchés internationaux", impact: 25, trend: "volatile" },
        { name: "Innovation technologique", impact: 20, trend: "positive" },
        { name: "Réglementation", impact: 12, trend: "neutral" },
        { name: "Disponibilité intrants", impact: 8, trend: "stable" },
      ],
    },
  };

  const currentForecast = forecastData[forecastHorizon];

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

  // Enhanced export functionality with format-specific handling
  const generateExportData = () => {
    const data: any = {
      metadata: {
        title: "Tableau de Bord AgroLogistic - Analyse Complète",
        date: new Date().toISOString(),
        period: selectedPeriod,
        generatedBy: "AgroLogistic Analytics Engine v2.0",
      },
    };

    if (exportContent.kpis) {
      data.kpis = kpis.map((kpi) => ({
        label: kpi.label,
        value: kpi.value,
        unit: kpi.unit,
        trend: kpi.trend,
        positive: kpi.positive,
      }));
    }

    if (exportContent.forecasts) {
      data.forecasts = {
        horizon: forecastHorizon,
        confidence: currentForecast.confidence,
        predictions: currentForecast.predictions,
        keyFactors: currentForecast.keyFactors,
      };
    }

    if (exportContent.economic) {
      data.roiAnalysis = roiData;
    }

    if (exportContent.sensors) {
      data.sensors = [
        { name: "Humidité Sol", value: "42%", status: "optimal" },
        { name: "Température Sol", value: "18°C", status: "optimal" },
        { name: "Luminosité (PAR)", value: "850 μmol", status: "optimal" },
        { name: "Pluviométrie", value: "2.4 mm", status: "faible" },
      ];
    }

    if (exportContent.weather) {
      data.weather = {
        current: weatherData.current,
        forecast: weatherData.forecast,
      };
    }

    if (exportContent.diseases) {
      data.diseaseRisks = diseaseRisks;
    }

    if (exportContent.map) {
      data.parcels = parcels.map((p) => ({
        id: p.id,
        name: p.name,
        area: p.area,
        crop: p.crop,
        ndvi: p.ndvi,
        health: p.health,
      }));
    }

    return data;
  };

  const handleAdvancedExport = async (format: "pdf" | "excel" | "csv" | "ppt") => {
    setIsExporting(true);
    setSelectedExportFormat(format);

    try {
      const data = generateExportData();
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const formatName = format.toUpperCase();
      const sections = Object.keys(data).length;

      if (format === "pdf") {
        toast.success(`Rapport PDF genere avec succes! ${sections} sections incluses`, { duration: 4000 });
        console.log("PDF Export Data:", data);
      } else if (format === "excel") {
        const sheetNames: string[] = [];
        if (exportContent.kpis) sheetNames.push("KPIs");
        if (exportContent.forecasts) sheetNames.push("Previsions");
        if (exportContent.economic) sheetNames.push("Analyse ROI");
        toast.success(`Fichier Excel genere! ${sheetNames.length} feuilles creees`, { duration: 4000 });
        console.log("Excel Export Data:", data);
      } else if (format === "csv") {
        const rowCount = data.kpis ? data.kpis.length : 0;
        toast.success(`Fichier CSV genere! ${rowCount} lignes exportees`, { duration: 4000 });
        console.log("CSV Export Data:", data);
      } else if (format === "ppt") {
        toast.success(`Presentation PowerPoint generee avec succes!`, { duration: 4000 });
        console.log("PowerPoint Export Data:", data);
      }

      setShowExportModal(false);
    } catch (error) {
      toast.error(`Erreur lors de l export ${format}`);
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
      setSelectedExportFormat(null);
    }
  };

  const toggleExportContent = (key: keyof typeof exportContent) => {
    setExportContent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Dashboard customization functions
  const toggleWidget = (widgetId: string) => {
    setDashboardLayout((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === widgetId ? { ...w, visible: !w.visible } : w
      ),
    }));
  };

  const saveDashboardLayout = () => {
    localStorage.setItem("AgroLogistic-dashboard-layout", JSON.stringify(dashboardLayout));
    toast.success("Configuration du tableau de bord sauvegardee");
    setIsEditMode(false);
  };

  const resetDashboardLayout = () => {
    const defaultLayout = {
      widgets: [
        { id: "w1", type: "kpi" as const, title: "KPIs Principaux", visible: true, position: { x: 0, y: 0, w: 12, h: 2 } },
        { id: "w2", type: "forecast" as const, title: "Previsions IA", visible: true, position: { x: 0, y: 2, w: 8, h: 4 } },
        { id: "w3", type: "weather" as const, title: "Meteo", visible: true, position: { x: 8, y: 2, w: 4, h: 4 } },
        { id: "w4", type: "sensors" as const, title: "Capteurs IoT", visible: true, position: { x: 0, y: 6, w: 6, h: 3 } },
        { id: "w5", type: "map" as const, title: "Carte Parcelles", visible: true, position: { x: 6, y: 6, w: 6, h: 3 } },
        { id: "w6", type: "economic" as const, title: "Analyse ROI", visible: false, position: { x: 0, y: 9, w: 12, h: 3 } },
        { id: "w7", type: "alerts" as const, title: "Alertes Actives", visible: false, position: { x: 0, y: 12, w: 12, h: 2 } },
      ],
    };
    setDashboardLayout(defaultLayout);
    localStorage.setItem("AgroLogistic-dashboard-layout", JSON.stringify(defaultLayout));
    toast.success("Configuration reinitialis ee par defaut");
  };

  // Alert management functions
  const checkThresholds = () => {
    const newAlerts: typeof activeAlerts = [];

    // Check stress hydrique (from weather humidity)
    if (alertThresholds.stressHydrique.enabled) {
      const actualHumidity = weatherData.current.humidity;
      if (actualHumidity < alertThresholds.stressHydrique.value) {
        newAlerts.push({
          id: `alert-sh-${Date.now()}`,
          type: "warning",
          title: "Stress hydrique detecte",
          message: `Humidite actuelle ${actualHumidity}% inferieure au seuil de ${alertThresholds.stressHydrique.value}%`,
          timestamp: new Date().toISOString(),
          threshold: { metric: "Stress Hydrique", value: alertThresholds.stressHydrique.value, actual: actualHumidity },
          read: false,
          dismissed: false,
        });
      }
    }

    // Check temperature critique
    if (alertThresholds.temperatureCritique.enabled) {
      const actualTemp = weatherData.current.temp;
      if (actualTemp > alertThresholds.temperatureCritique.value) {
        newAlerts.push({
          id: `alert-tc-${Date.now()}`,
          type: "critical",
          title: "Temperature critique atteinte",
          message: `Temperature actuelle ${actualTemp}C depasse le seuil de ${alertThresholds.temperatureCritique.value}C`,
          timestamp: new Date().toISOString(),
          threshold: { metric: "Temperature", value: alertThresholds.temperatureCritique.value, actual: actualTemp },
          read: false,
          dismissed: false,
        });
      }
    }

    // Check risque maladie
    if (alertThresholds.risqueMaladie.enabled) {
      diseaseRisks.forEach((disease) => {
        if (disease.risk >= alertThresholds.risqueMaladie.value) {
          newAlerts.push({
            id: `alert-rm-${disease.name}-${Date.now()}`,
            type: disease.risk >= 8 ? "critical" : "warning",
            title: `Risque maladie eleve: ${disease.name}`,
            message: `Risque de ${disease.name} a ${disease.risk}/10 sur parcelles ${disease.parcels.join(", ")}`,
            timestamp: new Date().toISOString(),
            threshold: { metric: "Risque Maladie", value: alertThresholds.risqueMaladie.value, actual: disease.risk },
            read: false,
            dismissed: false,
          });
        }
      });
    }

    // Check NDVI faible
    if (alertThresholds.ndviFaible.enabled) {
      parcels.forEach((parcel) => {
        if (parcel.ndvi < alertThresholds.ndviFaible.value) {
          newAlerts.push({
            id: `alert-ndvi-${parcel.id}-${Date.now()}`,
            type: "warning",
            title: `NDVI faible detecte: ${parcel.name}`,
            message: `NDVI de ${parcel.ndvi} inferieur au seuil de ${alertThresholds.ndviFaible.value}`,
            timestamp: new Date().toISOString(),
            threshold: { metric: "NDVI", value: alertThresholds.ndviFaible.value, actual: parcel.ndvi },
            read: false,
            dismissed: false,
          });
        }
      });
    }

    return newAlerts;
  };

  const markAlertAsRead = (alertId: string) => {
    setActiveAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert))
    );
    updateNotificationCount();
  };

  const dismissAlert = (alertId: string) => {
    setActiveAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, dismissed: true } : alert))
    );
    updateNotificationCount();
  };

  const clearAllAlerts = () => {
    setActiveAlerts([]);
    setNotificationCount(0);
    toast.success("Toutes les alertes ont ete effacees");
  };

  const updateNotificationCount = () => {
    const unreadCount = activeAlerts.filter((a) => !a.read && !a.dismissed).length;
    setNotificationCount(unreadCount);
  };

  const saveAlertThresholds = (newThresholds: typeof alertThresholds) => {
    setAlertThresholds(newThresholds);
    localStorage.setItem("AgroLogistic-alert-thresholds", JSON.stringify(newThresholds));
    toast.success("Seuils d alertes sauvegardes");
  };

  const toggleVariable = (variable: string) => {
    if (selectedVariables.includes(variable)) {
      setSelectedVariables(selectedVariables.filter((v) => v !== variable));
    } else {
      setSelectedVariables([...selectedVariables, variable]);
    }
  };

  // Automatic alert monitoring useEffect
  useEffect(() => {
    // Check thresholds every 30 seconds
    const checkInterval = setInterval(() => {
      const newAlerts = checkThresholds();
      if (newAlerts.length > 0) {
        setActiveAlerts((prev) => {
          // Avoid duplicate alerts (check by title and metric)
          const existingTitles = new Set(prev.map((a) => a.title));
          const uniqueNewAlerts = newAlerts.filter((alert) => !existingTitles.has(alert.title));
          return [...prev, ...uniqueNewAlerts];
        });

        // Show toast for critical alerts
        newAlerts.forEach((alert) => {
          if (alert.type === "critical") {
            toast.error(alert.title, {
              description: alert.message,
              duration: 8000,
            });
          } else if (alert.type === "warning") {
            toast.warning(alert.title, {
              description: alert.message,
              duration: 6000,
            });
          }
        });
      }
    }, 30000); // Check every 30 seconds

    // Initial check
    const initialAlerts = checkThresholds();
    if (initialAlerts.length > 0) {
      setActiveAlerts(initialAlerts);
    }

    return () => clearInterval(checkInterval);
  }, [alertThresholds]);

  // Update notification count when alerts change
  useEffect(() => {
    updateNotificationCount();
  }, [activeAlerts]);

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
            Tableau de Bord AgroLogistic
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
            onClick={() => setShowCustomizeModal(true)}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Personnaliser
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
            onClick={() => setShowNotificationsPanel(true)}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2 relative"
          >
            <Bell className="h-4 w-4" />
            Notifications
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {notificationCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowAlertConfig(true)}
            className="px-4 py-2 bg-[#27AE60] text-white rounded-lg hover:bg-[#229954] transition-colors flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Config Alertes
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
                  Confiance: {currentForecast.confidence}%
                </span>
              </div>
            </div>

            {/* Forecast Horizon Selector */}
            <div className="flex gap-2 mb-6">
              {[
                { value: "3m" as const, label: "3 mois", desc: "Court terme" },
                { value: "6m" as const, label: "6 mois", desc: "Moyen terme" },
                { value: "12m" as const, label: "12 mois", desc: "Long terme" },
              ].map((horizon) => (
                <button
                  key={horizon.value}
                  onClick={() => setForecastHorizon(horizon.value)}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    forecastHorizon === horizon.value
                      ? "border-[#27AE60] bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-sm font-bold">{horizon.label}</div>
                  <div className="text-xs text-muted-foreground">{horizon.desc}</div>
                  <div className="text-xs font-medium mt-1">
                    {forecastData[horizon.value].confidence}% confiance
                  </div>
                </button>
              ))}
            </div>

            {/* Enhanced Chart with Confidence Intervals */}
            <div className="relative h-80 bg-muted/20 rounded-lg p-4">
              <svg className="w-full h-full" viewBox="0 0 800 320">
                <defs>
                  <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#27AE60" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#27AE60" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Y-axis labels */}
                {[0, 25, 50, 75, 100, 125].map((value) => (
                  <g key={value}>
                    <text
                      x="30"
                      y={300 - (value / 125) * 260}
                      className="text-xs fill-muted-foreground"
                      textAnchor="end"
                    >
                      {value}
                    </text>
                    <line
                      x1="50"
                      y1={300 - (value / 125) * 260}
                      x2="780"
                      y2={300 - (value / 125) * 260}
                      className="stroke-muted"
                      strokeWidth="1"
                      strokeDasharray="4"
                    />
                  </g>
                ))}

                {/* Confidence interval area */}
                <path
                  d={[
                    // Upper bound
                    ...currentForecast.predictions.map(
                      (d, i) =>
                        `${i === 0 ? "M" : "L"} ${60 + i * (720 / (currentForecast.predictions.length - 1))} ${300 - (d.upper / 125) * 260}`
                    ),
                    // Lower bound (reversed)
                    ...currentForecast.predictions
                      .slice()
                      .reverse()
                      .map(
                        (d, i) =>
                          `L ${60 + (currentForecast.predictions.length - 1 - i) * (720 / (currentForecast.predictions.length - 1))} ${300 - (d.lower / 125) * 260}`
                      ),
                    "Z",
                  ].join(" ")}
                  fill="url(#confidenceGradient)"
                  className="opacity-70"
                />

                {/* Upper bound line */}
                <path
                  d={currentForecast.predictions
                    .map(
                      (d, i) =>
                        `${i === 0 ? "M" : "L"} ${60 + i * (720 / (currentForecast.predictions.length - 1))} ${300 - (d.upper / 125) * 260}`
                    )
                    .join(" ")}
                  className="stroke-[#27AE60]"
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                  fill="none"
                  opacity="0.6"
                />

                {/* Lower bound line */}
                <path
                  d={currentForecast.predictions
                    .map(
                      (d, i) =>
                        `${i === 0 ? "M" : "L"} ${60 + i * (720 / (currentForecast.predictions.length - 1))} ${300 - (d.lower / 125) * 260}`
                    )
                    .join(" ")}
                  className="stroke-[#27AE60]"
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                  fill="none"
                  opacity="0.6"
                />

                {/* Main prediction line */}
                <path
                  d={currentForecast.predictions
                    .map(
                      (d, i) =>
                        `${i === 0 ? "M" : "L"} ${60 + i * (720 / (currentForecast.predictions.length - 1))} ${300 - (d.value / 125) * 260}`
                    )
                    .join(" ")}
                  className="stroke-[#27AE60]"
                  strokeWidth="3"
                  fill="none"
                />

                {/* Data points with confidence badges */}
                {currentForecast.predictions.map((d, i) => {
                  const x = 60 + i * (720 / (currentForecast.predictions.length - 1));
                  const y = 300 - (d.value / 125) * 260;
                  return (
                    <g key={i}>
                      {/* Point */}
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        className="fill-[#27AE60] stroke-white"
                        strokeWidth="2"
                      />
                      {/* Value label */}
                      <text
                        x={x}
                        y={y - 15}
                        className="text-xs font-bold fill-foreground"
                        textAnchor="middle"
                      >
                        {d.value.toFixed(1)}
                      </text>
                      {/* Month label */}
                      <text
                        x={x}
                        y={315}
                        className="text-xs fill-muted-foreground"
                        textAnchor="middle"
                      >
                        {d.month}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur border rounded-lg p-2 text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-[#27AE60]"></div>
                  <span>Prévision</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 bg-[#27AE60] opacity-30"></div>
                  <span>Intervalle confiance</span>
                </div>
              </div>
            </div>

            {/* Forecast Details Button */}
            <button
              onClick={() => setShowForecastDetails(true)}
              className="w-full mt-4 px-4 py-2 border border-[#27AE60] text-[#27AE60] rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Target className="h-4 w-4" />
              Voir les détails de prévision
            </button>

            {/* Influencing Factors */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#27AE60]" />
                Facteurs influents (Horizon {forecastHorizon.toUpperCase()})
              </h3>
              <div className="space-y-2">
                {currentForecast.keyFactors.map((factor) => {
                  const trendColors = {
                    positive: "text-green-600",
                    negative: "text-red-600",
                    neutral: "text-gray-600",
                    stable: "text-blue-600",
                    volatile: "text-orange-600",
                  };
                  const trendIcons = {
                    positive: <TrendingUp className="h-3 w-3" />,
                    negative: <TrendingDown className="h-3 w-3" />,
                    neutral: <Minus className="h-3 w-3" />,
                    stable: <CheckCircle className="h-3 w-3" />,
                    volatile: <AlertTriangle className="h-3 w-3" />,
                  };
                  return (
                    <div key={factor.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          {factor.name}
                          <span className={`flex items-center gap-1 text-xs ${trendColors[factor.trend as keyof typeof trendColors]}`}>
                            {trendIcons[factor.trend as keyof typeof trendIcons]}
                          </span>
                        </span>
                        <span className="font-medium">{factor.impact}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#27AE60]"
                          style={{ width: `${factor.impact}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
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

      {/* Notifications Panel - Sliding from right */}
      {showNotificationsPanel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowNotificationsPanel(false)}
          />

          {/* Sliding Panel */}
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l shadow-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#27AE60]" />
                Notifications ({activeAlerts.filter((a) => !a.dismissed).length})
              </h2>
              <button
                onClick={() => setShowNotificationsPanel(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={clearAllAlerts}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm flex items-center justify-center gap-2"
                  disabled={activeAlerts.length === 0}
                >
                  <X className="h-4 w-4" />
                  Tout effacer
                </button>
              </div>

              {/* Alerts List */}
              {activeAlerts.filter((a) => !a.dismissed).length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <h3 className="font-semibold mb-2">Aucune alerte active</h3>
                  <p className="text-sm text-muted-foreground">
                    Tous les indicateurs sont dans les normes
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeAlerts
                    .filter((a) => !a.dismissed)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((alert) => (
                      <div
                        key={alert.id}
                        className={`border rounded-lg p-4 transition-all ${
                          alert.read ? "bg-muted/30" : "bg-card"
                        } ${
                          alert.type === "critical"
                            ? "border-red-300 dark:border-red-800"
                            : alert.type === "warning"
                            ? "border-orange-300 dark:border-orange-800"
                            : "border-blue-300 dark:border-blue-800"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {alert.type === "critical" ? (
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            ) : alert.type === "warning" ? (
                              <AlertTriangle className="h-5 w-5 text-orange-600" />
                            ) : (
                              <Info className="h-5 w-5 text-blue-600" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{alert.title}</h4>
                              {!alert.read && (
                                <span className="h-2 w-2 bg-red-500 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>

                            {/* Threshold Info */}
                            <div className="bg-muted/50 rounded px-2 py-1 text-xs space-y-1 mb-2">
                              <div className="flex justify-between">
                                <span>Metrique:</span>
                                <span className="font-medium">{alert.threshold.metric}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Seuil:</span>
                                <span className="font-medium">{alert.threshold.value}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Actuel:</span>
                                <span className="font-bold text-red-600">{alert.threshold.actual}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {new Date(alert.timestamp).toLocaleString("fr-FR")}
                              </span>

                              <div className="flex gap-2">
                                {!alert.read && (
                                  <button
                                    onClick={() => markAlertAsRead(alert.id)}
                                    className="text-xs text-[#27AE60] hover:underline"
                                  >
                                    Marquer lu
                                  </button>
                                )}
                                <button
                                  onClick={() => dismissAlert(alert.id)}
                                  className="text-xs text-red-600 hover:underline"
                                >
                                  Ignorer
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Dashboard Customization Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#27AE60]" />
                Personnaliser le Tableau de Bord
              </h2>
              <button onClick={() => setShowCustomizeModal(false)} className="p-1 hover:bg-muted rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Widget Visibility */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[#27AE60]" />
                  Widgets Affich es
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Selectionnez les widgets a afficher sur votre tableau de bord
                </p>
                <div className="space-y-2">
                  {dashboardLayout.widgets.map((widget) => (
                    <label
                      key={widget.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={widget.visible}
                          onChange={() => toggleWidget(widget.id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#27AE60] focus:ring-[#27AE60]"
                        />
                        <div>
                          <div className="font-medium">{widget.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Type: {widget.type} | Position: {widget.position.w}x{widget.position.h}
                          </div>
                        </div>
                      </div>
                      {widget.visible ? (
                        <CheckCircle className="h-5 w-5 text-[#27AE60]" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Layout Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Personnalisation Avancee
                    </div>
                    <p className="text-blue-800 dark:text-blue-200">
                      Votre configuration est automatiquement sauvegardee localement. 
                      Pour reorganiser les widgets, activez le mode edition avec le bouton en haut.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visible Widgets Summary */}
              <div>
                <h3 className="font-semibold mb-2">Resume</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-[#27AE60] text-white rounded-full font-medium">
                    {dashboardLayout.widgets.filter((w) => w.visible).length}
                  </span>
                  <span className="text-muted-foreground">
                    widgets actifs sur {dashboardLayout.widgets.length} disponibles
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex gap-3 justify-between">
              <button
                onClick={resetDashboardLayout}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reinitialiser
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCustomizeModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={saveDashboardLayout}
                  className="px-6 py-2 bg-[#27AE60] text-white rounded-lg hover:bg-[#229954] transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
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

      {/* Forecast Details Modal */}
      {showForecastDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-4xl my-8">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-[#27AE60]" />
                Détails des Prévisions IA - {forecastHorizon.toUpperCase()}
              </h2>
              <button onClick={() => setShowForecastDetails(false)} className="p-1 hover:bg-muted rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Overall Confidence Score */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Indice de Confiance Global</div>
                    <div className="text-3xl font-bold text-[#27AE60]">{currentForecast.confidence}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Horizon de prévision</div>
                    <div className="text-2xl font-bold">
                      {forecastHorizon === "3m" ? "3 mois" : forecastHorizon === "6m" ? "6 mois" : "12 mois"}
                    </div>
                  </div>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#27AE60] to-[#2ECC71]"
                    style={{ width: `${currentForecast.confidence}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  🎯 Basé sur {forecastHorizon === "3m" ? "120" : forecastHorizon === "6m" ? "240" : "480"} points de données historiques et {forecastHorizon === "3m" ? "15" : forecastHorizon === "6m" ? "28" : "48"} variables contextuelles
                </p>
              </div>

              {/* Detailed Predictions Table */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-[#27AE60]" />
                  Prévisions détaillées par mois
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Période</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Prévision</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Borne Inf.</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Borne Sup.</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Écart</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">Confiance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentForecast.predictions.map((pred, index) => {
                          const spread = pred.upper - pred.lower;
                          return (
                            <tr key={index} className="border-t hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3 font-medium">{pred.month}</td>
                              <td className="px-4 py-3 text-right font-bold text-[#27AE60]">
                                {pred.value.toFixed(1)} t/ha
                              </td>
                              <td className="px-4 py-3 text-right text-sm">{pred.lower.toFixed(1)} t/ha</td>
                              <td className="px-4 py-3 text-right text-sm">{pred.upper.toFixed(1)} t/ha</td>
                              <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                                ±{(spread / 2).toFixed(1)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-bold ${
                                    pred.confidence >= 85
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/20"
                                      : pred.confidence >= 70
                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20"
                                      : "bg-orange-100 text-orange-700 dark:bg-orange-900/20"
                                  }`}
                                >
                                  {pred.confidence}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Key Factors Analysis */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#27AE60]" />
                  Analyse des facteurs clés
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentForecast.keyFactors.map((factor, index) => {
                    const trendConfig = {
                      positive: { color: "green", icon: TrendingUp, label: "Positif", bg: "bg-green-50 dark:bg-green-900/20" },
                      negative: { color: "red", icon: TrendingDown, label: "Négatif", bg: "bg-red-50 dark:bg-red-900/20" },
                      neutral: { color: "gray", icon: Minus, label: "Neutre", bg: "bg-gray-50 dark:bg-gray-900/20" },
                      stable: { color: "blue", icon: CheckCircle, label: "Stable", bg: "bg-blue-50 dark:bg-blue-900/20" },
                      volatile: { color: "orange", icon: AlertTriangle, label: "Volatil", bg: "bg-orange-50 dark:bg-orange-900/20" },
                    };
                    const config = trendConfig[factor.trend as keyof typeof trendConfig];
                    const Icon = config.icon;

                    return (
                      <div key={index} className={`border rounded-lg p-4 ${config.bg}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-medium">{factor.name}</div>
                          <div className={`flex items-center gap-1 text-xs text-${config.color}-600`}>
                            <Icon className="h-3 w-3" />
                            {config.label}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Impact sur prévision</span>
                            <span className="font-bold">{factor.impact}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-${config.color}-600`}
                              style={{ width: `${factor.impact}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Methodology Note */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Méthodologie IA
                    </div>
                    <p className="text-blue-800 dark:text-blue-200">
                      Ces prévisions sont générées par un modèle d'apprentissage automatique (ensemble de réseaux neuronaux) entraîné sur {forecastHorizon === "3m" ? "5 ans" : forecastHorizon === "6m" ? "8 ans" : "15 ans"} de données historiques. 
                      Les intervalles de confiance représentent une probabilité de 95% que la valeur réelle se situe dans la plage indiquée.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex gap-3 justify-between">
              <button
                onClick={() => {
                  toast.success("Export des prévisions lancé");
                }}
                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exporter (PDF)
              </button>
              <button
                onClick={() => setShowForecastDetails(false)}
                className="px-6 py-2 bg-[#27AE60] text-white rounded-lg hover:bg-[#229954] transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
