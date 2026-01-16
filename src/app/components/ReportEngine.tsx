import { useState } from "react";
import {
  FileText,
  Clock,
  Users,
  TrendingUp,
  Plus,
  Calendar as CalendarIcon,
  BarChart3,
  Archive,
  Download,
  Send,
  Eye,
  Copy,
  Edit,
  Trash2,
  Play,
  Pause,
  Settings,
  Filter,
  Search,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Mail,
  MessageSquare,
  Bell,
  Smartphone,
  Zap,
  Target,
  Activity,
  Database,
  Cloud,
  Cpu,
  DollarSign,
  Layout,
  Palette,
  Code,
  Globe,
  Share2,
  Bookmark,
  Star,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";

interface Report {
  id: string;
  name: string;
  type: string;
  status: "active" | "paused" | "draft" | "error";
  frequency: string;
  nextRun: string;
  lastRun: string;
  recipients: number;
  engagement: number;
  template: string;
}

export function ReportEngine() {
  const [activeView, setActiveView] = useState<"dashboard" | "templates" | "schedule" | "analytics" | "archive">("dashboard");
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // KPIs Data
  const kpis = [
    {
      id: "active",
      label: "Rapports Actifs",
      value: "24/50",
      subtitle: "48% capacity",
      icon: FileText,
      color: "blue",
      trend: "+3 ce mois",
      trendUp: true,
    },
    {
      id: "next",
      label: "Prochain Exécution",
      value: "14:00",
      subtitle: "Aujourd'hui",
      icon: Clock,
      color: "orange",
      trend: "Dans 2h 15min",
      trendUp: false,
    },
    {
      id: "recipients",
      label: "Destinataires",
      value: "156",
      subtitle: "Agriculteurs actifs",
      icon: Users,
      color: "green",
      trend: "+12 cette semaine",
      trendUp: true,
    },
    {
      id: "engagement",
      label: "Engagement Moyen",
      value: "78%",
      subtitle: "Taux d'ouverture",
      icon: TrendingUp,
      color: "purple",
      trend: "+5% vs dernier mois",
      trendUp: true,
    },
  ];

  // Reports Data
  const reports: Report[] = [
    {
      id: "1",
      name: "Production Quotidienne - Région Nord",
      type: "daily",
      status: "active",
      frequency: "Quotidien à 08:00",
      nextRun: "Demain, 08:00",
      lastRun: "Aujourd'hui, 08:00",
      recipients: 45,
      engagement: 85,
      template: "production-daily",
    },
    {
      id: "2",
      name: "Analyse Hebdomadaire - Toutes cultures",
      type: "weekly",
      status: "active",
      frequency: "Lundi à 09:00",
      nextRun: "Lundi 15 Jan, 09:00",
      lastRun: "Lundi 8 Jan, 09:00",
      recipients: 120,
      engagement: 72,
      template: "analysis-weekly",
    },
    {
      id: "3",
      name: "Alertes Critiques - Irrigation",
      type: "alert",
      status: "active",
      frequency: "Temps réel",
      nextRun: "En attente",
      lastRun: "Il y a 2h",
      recipients: 34,
      engagement: 95,
      template: "alert-critical",
    },
    {
      id: "4",
      name: "Rapport Mensuel - Finance",
      type: "monthly",
      status: "draft",
      frequency: "1er du mois à 10:00",
      nextRun: "1 Fév, 10:00",
      lastRun: "1 Jan, 10:00",
      recipients: 8,
      engagement: 68,
      template: "financial-monthly",
    },
  ];

  // Report Types
  const reportTypes = [
    {
      id: "daily-production",
      name: "Production Quotidienne",
      description: "Suivi journalier des rendements et activités",
      icon: Activity,
      color: "blue",
      popular: true,
    },
    {
      id: "weekly-analysis",
      name: "Analyse Hebdomadaire",
      description: "Synthèse des performances sur 7 jours",
      icon: BarChart3,
      color: "green",
      popular: true,
    },
    {
      id: "monthly-complete",
      name: "Rapport Mensuel Complet",
      description: "Vue d'ensemble mensuelle détaillée",
      icon: FileText,
      color: "purple",
      popular: false,
    },
    {
      id: "critical-alerts",
      name: "Alertes Critiques",
      description: "Notifications urgentes et événements",
      icon: AlertCircle,
      color: "red",
      popular: true,
    },
    {
      id: "custom",
      name: "Personnalisé",
      description: "Créez votre propre configuration",
      icon: Settings,
      color: "orange",
      popular: false,
    },
  ];

  // Data Sources
  const dataSources = [
    { id: "iot", label: "Données capteurs IoT", icon: Cpu, checked: false },
    { id: "soil", label: "Analyses de sol", icon: Database, checked: false },
    { id: "weather", label: "Informations météo", icon: Cloud, checked: false },
    { id: "financial", label: "Données financières", icon: DollarSign, checked: false },
    { id: "users", label: "Activité utilisateurs", icon: Users, checked: false },
    { id: "equipment", label: "Performances équipements", icon: Zap, checked: false },
  ];

  // Templates
  const templates = [
    {
      id: "production-daily",
      name: "Production Quotidienne",
      category: "Production Agricole",
      description: "Rapport journalier avec métriques de rendement",
      image: "📊",
      rating: 4.8,
      downloads: 342,
      compatibility: ["Desktop", "Mobile", "Print"],
    },
    {
      id: "financial-monthly",
      name: "Synthèse Financière",
      category: "Financier",
      description: "Vue d'ensemble mensuelle des revenus et coûts",
      image: "💰",
      rating: 4.6,
      downloads: 198,
      compatibility: ["Desktop", "Print"],
    },
    {
      id: "iot-tech",
      name: "Monitoring IoT",
      category: "IoT & Technologie",
      description: "État des capteurs et données télémétrie",
      image: "📡",
      rating: 4.9,
      downloads: 256,
      compatibility: ["Desktop", "Mobile"],
    },
    {
      id: "team-performance",
      name: "Performance Équipe",
      category: "Équipe & Ressources",
      description: "Suivi des activités et productivité",
      image: "👥",
      rating: 4.5,
      downloads: 167,
      compatibility: ["Desktop"],
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: { icon: any; label: string; color: string; bgColor: string } } = {
      active: { icon: CheckCircle, label: "Actif", color: "text-green-700", bgColor: "bg-green-100 dark:bg-green-900/20" },
      paused: { icon: Pause, label: "Pausé", color: "text-orange-700", bgColor: "bg-orange-100 dark:bg-orange-900/20" },
      draft: { icon: Edit, label: "Brouillon", color: "text-gray-700", bgColor: "bg-gray-100 dark:bg-gray-800" },
      error: { icon: AlertCircle, label: "Erreur", color: "text-red-700", bgColor: "bg-red-100 dark:bg-red-900/20" },
    };
    return configs[status];
  };

  const handleCreateReport = () => {
    setShowWizard(true);
    setWizardStep(1);
  };

  const handleNextStep = () => {
    if (wizardStep < 5) {
      setWizardStep(wizardStep + 1);
    } else {
      toast.success("Rapport créé avec succès !");
      setShowWizard(false);
      setWizardStep(1);
    }
  };

  const handlePrevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const toggleDataSource = (id: string) => {
    if (selectedDataSources.includes(id)) {
      setSelectedDataSources(selectedDataSources.filter(s => s !== id));
    } else {
      setSelectedDataSources([...selectedDataSources, id]);
    }
  };

  const renderDashboard = () => (
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
                {kpi.trendUp !== undefined && (
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      kpi.trendUp ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {kpi.trendUp ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    {kpi.trend}
                  </div>
                )}
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

      {/* Quick Actions */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Nouveau Rapport", icon: Plus, color: "blue", action: handleCreateReport },
            { label: "Templates Library", icon: Layout, color: "purple", action: () => setActiveView("templates") },
            { label: "Calendrier", icon: CalendarIcon, color: "green", action: () => setActiveView("schedule") },
            { label: "Analytics", icon: BarChart3, color: "orange", action: () => setActiveView("analytics") },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`p-4 border-2 border-dashed rounded-lg hover:border-[#4A6FA5] hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group`}
              >
                <Icon className="h-8 w-8 mx-auto mb-2 text-[#4A6FA5] group-hover:scale-110 transition-transform" />
                <div className="text-sm font-medium text-center">{action.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Reports Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Rapports Actifs</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5] bg-background"
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
                <th className="px-4 py-3 text-left text-sm font-medium">Nom du Rapport</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Fréquence</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Prochaine Exéc.</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Destinataires</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Engagement</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => {
                const statusConfig = getStatusConfig(report.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={report.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">{report.name}</div>
                      <div className="text-xs text-muted-foreground">Template: {report.template}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-muted rounded text-xs font-medium capitalize">
                        {report.type}
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
                    <td className="px-4 py-3 text-sm">{report.frequency}</td>
                    <td className="px-4 py-3 text-sm">{report.nextRun}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">{report.recipients}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${report.engagement}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{report.engagement}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-muted rounded" title="Exécuter">
                          <Play className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Éditer">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Statistiques">
                          <BarChart3 className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Plus">
                          <Settings className="h-4 w-4" />
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Activité Récente</h3>
          <div className="space-y-3">
            {[
              { time: "Il y a 5 min", action: "Rapport 'Production Quotidienne' envoyé", status: "success" },
              { time: "Il y a 1h", action: "Template 'Financial Monthly' modifié", status: "info" },
              { time: "Il y a 2h", action: "Alerte critique déclenchée - Irrigation", status: "warning" },
              { time: "Il y a 4h", action: "Nouveau destinataire ajouté: Jean D.", status: "info" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === "success"
                      ? "bg-green-500"
                      : activity.status === "warning"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="text-sm">{activity.action}</div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Statistiques Rapides</h3>
          <div className="space-y-4">
            {[
              { label: "Rapports envoyés (7j)", value: "156", change: "+12%" },
              { label: "Taux d'ouverture moyen", value: "78%", change: "+5%" },
              { label: "Temps moyen de lecture", value: "4m 32s", change: "+18s" },
              { label: "Actions déclenchées", value: "42", change: "+8" },
            ].map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
                <div className="text-sm font-semibold text-green-600">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Templates Library</h2>
          <p className="text-muted-foreground">Modèles prêts à l'emploi pour vos rapports</p>
        </div>
        <button className="px-6 py-2 bg-[#4A6FA5] text-white rounded-lg hover:bg-[#3A5F95] transition-colors font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Créer Template
        </button>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {["Tous", "Production Agricole", "Financier", "IoT & Technologie", "Équipe & Ressources"].map((cat) => (
          <button
            key={cat}
            className="px-4 py-2 border rounded-lg hover:bg-muted whitespace-nowrap text-sm"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="h-40 bg-gradient-to-br from-[#4A6FA5] to-[#6A8FC5] flex items-center justify-center text-6xl">
              {template.image}
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold group-hover:text-[#4A6FA5] transition-colors">
                  {template.name}
                </h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-semibold">{template.rating}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>

              <div className="flex items-center gap-2 mb-3 text-xs">
                {template.compatibility.map((comp) => (
                  <span key={comp} className="px-2 py-1 bg-muted rounded">
                    {comp}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-xs text-muted-foreground">
                  <Download className="h-3 w-3 inline mr-1" />
                  {template.downloads}
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-muted rounded" title="Prévisualiser">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 hover:bg-muted rounded" title="Utiliser">
                    <CheckCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendrier d'Exécution</h2>
          <p className="text-muted-foreground">Planifiez et gérez vos rapports automatiques</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Janvier 2025</h3>
            <div className="flex items-center gap-2">
              <button className="p-2 border rounded hover:bg-muted">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="px-4 py-2 border rounded hover:bg-muted text-sm">
                Aujourd'hui
              </button>
              <button className="p-2 border rounded hover:bg-muted">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 0; // Adjust for month start
              const hasEvent = [1, 8, 15, 22, 29].includes(day);
              return (
                <div
                  key={i}
                  className={`aspect-square border rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer ${
                    day === 13 ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500" : ""
                  }`}
                >
                  <div className="text-sm font-medium">{day > 0 && day <= 31 ? day : ""}</div>
                  {hasEvent && day > 0 && day <= 31 && (
                    <div className="mt-1">
                      <div className="w-full h-1 bg-green-500 rounded mb-0.5" />
                      <div className="w-full h-1 bg-blue-500 rounded" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Reports */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Prochains 7 jours</h3>
          <div className="space-y-3">
            {[
              { name: "Production Daily", time: "Demain, 08:00", type: "daily" },
              { name: "Weekly Analysis", time: "Lundi, 09:00", type: "weekly" },
              { name: "IoT Status", time: "Mardi, 10:00", type: "tech" },
              { name: "Financial Report", time: "Vendredi, 14:00", type: "financial" },
            ].map((report, index) => (
              <div key={index} className="p-3 border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sm">{report.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {report.time}
                    </div>
                  </div>
                  <button className="p-1 hover:bg-muted rounded">
                    <Play className="h-4 w-4 text-green-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics d'Engagement</h2>
        <p className="text-muted-foreground">Mesurez l'impact de vos rapports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Chart */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Ouvertures par Jour</h3>
          <div className="h-64 flex items-end justify-around gap-2">
            {[65, 78, 82, 75, 88, 92, 85, 79, 86, 91, 88, 82, 87, 90].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-[#4A6FA5] to-[#6A8FC5] rounded-t transition-all hover:opacity-80 cursor-pointer"
                  style={{ height: `${value}%` }}
                  title={`${value}%`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Top Reports */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Top 5 Rapports</h3>
          <div className="space-y-3">
            {[
              { name: "Production Quotidienne", engagement: 95, opens: 342 },
              { name: "Alertes Critiques", engagement: 92, opens: 287 },
              { name: "Analyse Hebdo", engagement: 88, opens: 256 },
              { name: "IoT Monitoring", engagement: 85, opens: 234 },
              { name: "Financial Monthly", engagement: 78, opens: 198 },
            ].map((report, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{report.name}</span>
                  <span className="text-sm font-bold">{report.engagement}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4A6FA5] to-[#6A8FC5]"
                    style={{ width: `${report.engagement}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">{report.opens} ouvertures</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderArchive = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Archive & Historique</h2>
          <p className="text-muted-foreground">Accédez à tous vos rapports passés</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Stockage: <span className="font-semibold">45 Go</span> / 100 Go
          </div>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-[#4A6FA5]" style={{ width: "45%" }} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select className="px-3 py-2 border rounded-lg bg-background">
            <option>Tous les types</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Alert</option>
          </select>
          <select className="px-3 py-2 border rounded-lg bg-background">
            <option>Dernier mois</option>
            <option>3 derniers mois</option>
            <option>6 derniers mois</option>
            <option>1 an</option>
          </select>
          <select className="px-3 py-2 border rounded-lg bg-background">
            <option>Tous les statuts</option>
            <option>Réussi</option>
            <option>Échoué</option>
          </select>
          <input
            type="text"
            placeholder="Rechercher..."
            className="px-3 py-2 border rounded-lg bg-background"
          />
          <button className="px-4 py-2 bg-[#4A6FA5] text-white rounded-lg hover:bg-[#3A5F95] transition-colors font-semibold">
            Filtrer
          </button>
        </div>
      </div>

      {/* Archive List */}
      <div className="bg-card border rounded-xl divide-y">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Production Quotidienne - {13 - i} Janvier 2025</div>
                <div className="text-sm text-muted-foreground">
                  Envoyé à 45 destinataires • 38 ouvertures (84%)
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 border rounded hover:bg-muted" title="Télécharger">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 border rounded hover:bg-muted" title="Prévisualiser">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 border rounded hover:bg-muted" title="Renvoyer">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWizard = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Wizard Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Créer un Nouveau Rapport</h3>
            <button
              onClick={() => setShowWizard(false)}
              className="p-2 hover:bg-muted rounded"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Type" },
              { num: 2, label: "Sources" },
              { num: 3, label: "Template" },
              { num: 4, label: "Planification" },
              { num: 5, label: "Règles" },
            ].map((step) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      wizardStep === step.num
                        ? "bg-[#4A6FA5] text-white"
                        : wizardStep > step.num
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {wizardStep > step.num ? <CheckCircle className="h-5 w-5" /> : step.num}
                  </div>
                  <div className="text-xs mt-1 font-medium">{step.label}</div>
                </div>
                {step.num < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      wizardStep > step.num ? "bg-green-500" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {wizardStep === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">Sélectionnez le type de rapport</h4>
                <p className="text-sm text-muted-foreground">
                  Choisissez le modèle qui correspond à vos besoins
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedReportType(type.id)}
                      className={`p-6 border-2 rounded-xl text-left transition-all ${
                        selectedReportType === type.id
                          ? "border-[#4A6FA5] bg-blue-50 dark:bg-blue-900/10"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-${type.color}-100 dark:bg-${type.color}-900/20`}>
                          <Icon className={`h-8 w-8 text-${type.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-semibold">{type.name}</h5>
                            {type.popular && (
                              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs rounded font-semibold">
                                Populaire
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">Sélectionnez les sources de données</h4>
                <p className="text-sm text-muted-foreground">
                  Choisissez les données à inclure dans votre rapport
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataSources.map((source) => {
                  const Icon = source.icon;
                  const isSelected = selectedDataSources.includes(source.id);
                  return (
                    <button
                      key={source.id}
                      onClick={() => toggleDataSource(source.id)}
                      className={`p-4 border-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? "border-[#4A6FA5] bg-blue-50 dark:bg-blue-900/10"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-[#4A6FA5] text-white" : "bg-muted"}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{source.label}</div>
                        </div>
                        {isSelected && <CheckCircle className="h-5 w-5 text-[#4A6FA5]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Flux de données
                    </h5>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {selectedDataSources.length} source(s) sélectionnée(s). Les données seront
                      agrégées automatiquement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">Choisissez un template</h4>
                <p className="text-sm text-muted-foreground">
                  Personnalisez l'apparence de votre rapport
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.slice(0, 3).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`border-2 rounded-xl overflow-hidden transition-all ${
                      selectedTemplate === template.id
                        ? "border-[#4A6FA5]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <div className="h-32 bg-gradient-to-br from-[#4A6FA5] to-[#6A8FC5] flex items-center justify-center text-5xl">
                      {template.image}
                    </div>
                    <div className="p-3">
                      <div className="font-semibold text-sm">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.category}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 border-2 border-dashed rounded-xl hover:border-[#4A6FA5] transition-colors cursor-pointer">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Créer un template personnalisé</span>
                </div>
              </div>
            </div>
          )}

          {wizardStep === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">Planification & Distribution</h4>
                <p className="text-sm text-muted-foreground">
                  Configurez quand et à qui envoyer le rapport
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Fréquence</label>
                  <select className="w-full px-3 py-2 border rounded-lg bg-background">
                    <option>Immédiat</option>
                    <option>Quotidien</option>
                    <option>Hebdomadaire</option>
                    <option>Mensuel</option>
                    <option>Personnalisé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Heure d'envoi</label>
                  <input
                    type="time"
                    defaultValue="09:00"
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Méthode de distribution</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "email", label: "Email", icon: Mail },
                    { id: "sms", label: "SMS", icon: MessageSquare },
                    { id: "app", label: "In-App", icon: Bell },
                    { id: "download", label: "Download", icon: Download },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        className="p-4 border-2 border-dashed rounded-lg hover:border-[#4A6FA5] transition-colors"
                      >
                        <Icon className="h-6 w-6 mx-auto mb-2 text-[#4A6FA5]" />
                        <div className="text-sm font-medium">{method.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Destinataires</label>
                <div className="space-y-2">
                  <button className="w-full p-3 border-2 border-dashed rounded-lg hover:border-[#4A6FA5] transition-colors flex items-center justify-center gap-2">
                    <Plus className="h-5 w-5" />
                    <span>Ajouter des destinataires</span>
                  </button>
                  <div className="flex items-center gap-2 flex-wrap">
                    {["Tous les agriculteurs", "Équipe Nord", "Managers"].map((group) => (
                      <span
                        key={group}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {group}
                        <button className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {wizardStep === 5 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">Règles Avancées</h4>
                <p className="text-sm text-muted-foreground">
                  Configurez des conditions et actions automatiques
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Conditions de déclenchement</label>
                <div className="space-y-3">
                  {[
                    "Si pluie > 50mm dans les 24h",
                    "Si température < 5°C",
                    "Si rendement baisse de 10%",
                  ].map((condition, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="flex-1 text-sm">{condition}</span>
                      <button className="p-1 hover:bg-muted rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button className="w-full p-3 border-2 border-dashed rounded-lg hover:border-[#4A6FA5] transition-colors flex items-center justify-center gap-2">
                    <Plus className="h-5 w-5" />
                    <span>Ajouter une condition</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Actions supplémentaires</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Générer PDF + Excel", checked: true },
                    { label: "Archiver automatiquement", checked: true },
                    { label: "Partager sur Slack", checked: false },
                    { label: "Créer tâche de suivi", checked: false },
                  ].map((action, index) => (
                    <label key={index} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                      <input type="checkbox" defaultChecked={action.checked} className="w-4 h-4" />
                      <span className="text-sm">{action.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                      Rapport prêt à être créé
                    </h5>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Votre rapport sera configuré avec {selectedDataSources.length} sources de données et
                      envoyé selon la planification définie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer */}
        <div className="p-6 border-t flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={wizardStep === 1}
            className="px-6 py-2 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </button>

          <div className="text-sm text-muted-foreground">
            Étape {wizardStep} sur 5
          </div>

          <button
            onClick={handleNextStep}
            className="px-6 py-2 bg-[#4A6FA5] text-white rounded-lg hover:bg-[#3A5F95] transition-colors font-semibold flex items-center gap-2"
          >
            {wizardStep === 5 ? "Créer le Rapport" : "Suivant"}
            {wizardStep < 5 && <ChevronRight className="h-4 w-4" />}
          </button>
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
            <h1 className="text-3xl font-bold tracking-tight">Report Engine</h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">
              BETA
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-full flex items-center gap-1">
              <Zap className="h-3 w-3" />
              AI-Powered
            </span>
          </div>
          <p className="text-muted-foreground">
            Générez, planifiez et distribuez des rapports intelligents
          </p>
        </div>

        <button
          onClick={handleCreateReport}
          className="px-6 py-3 bg-[#4A6FA5] text-white rounded-lg hover:bg-[#3A5F95] transition-colors font-semibold flex items-center gap-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Nouveau Rapport
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card border rounded-xl p-2 flex gap-2">
        {[
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
          { id: "templates", label: "Templates", icon: Layout },
          { id: "schedule", label: "Calendrier", icon: CalendarIcon },
          { id: "analytics", label: "Analytics", icon: TrendingUp },
          { id: "archive", label: "Archive", icon: Archive },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeView === tab.id
                  ? "bg-[#4A6FA5] text-white"
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
      {activeView === "dashboard" && renderDashboard()}
      {activeView === "templates" && renderTemplates()}
      {activeView === "schedule" && renderSchedule()}
      {activeView === "analytics" && renderAnalytics()}
      {activeView === "archive" && renderArchive()}

      {/* Wizard Modal */}
      {showWizard && renderWizard()}
    </div>
  );
}
