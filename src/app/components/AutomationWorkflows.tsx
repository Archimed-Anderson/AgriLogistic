import { useState } from "react";
import {
  Zap,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Calendar,
  GitBranch,
  Mail,
  Webhook,
  Database,
  AlertCircle,
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  Settings,
  Activity,
  RefreshCw,
  ChevronRight,
  Code,
  FileText,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

interface Workflow {
  id: string;
  name: string;
  status: "active" | "paused" | "draft" | "error";
  trigger: string;
  actions: number;
  executions: number;
  successRate: number;
  lastRun: string;
  nextRun: string;
}

interface ExecutionLog {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "success" | "failed" | "running";
  startTime: string;
  endTime: string;
  duration: number;
}

export function AutomationWorkflows() {
  const [activeView, setActiveView] = useState<"overview" | "builder" | "scheduled" | "triggers" | "logs">("overview");
  const [showBuilder, setShowBuilder] = useState(false);

  // KPIs Data
  const kpis = [
    {
      id: "active",
      label: "Workflows Actifs",
      value: "18",
      change: 3,
      icon: Zap,
      color: "green",
      trend: "up",
      subtitle: "Sur 22 total",
    },
    {
      id: "executions",
      label: "Exécutions Aujourd'hui",
      value: "342",
      change: 15,
      icon: Activity,
      color: "blue",
      trend: "up",
      subtitle: "+15% vs hier",
    },
    {
      id: "success",
      label: "Taux de Réussite",
      value: "98.7%",
      change: 0.5,
      icon: CheckCircle,
      color: "green",
      trend: "up",
      subtitle: "1,245 réussies",
    },
    {
      id: "next",
      label: "Prochain Déclenchement",
      value: "14:30",
      change: 0,
      icon: Clock,
      color: "orange",
      trend: "neutral",
      subtitle: "Dans 2h 15min",
    },
  ];

  // Workflows Data
  const workflows: Workflow[] = [
    {
      id: "WF-001",
      name: "Alerte Irrigation Automatique",
      status: "active",
      trigger: "Humidité < 30%",
      actions: 3,
      executions: 145,
      successRate: 99.3,
      lastRun: "Il y a 2h",
      nextRun: "Dans 4h",
    },
    {
      id: "WF-002",
      name: "Rapport Hebdomadaire Automatisé",
      status: "active",
      trigger: "Chaque lundi 9h",
      actions: 5,
      executions: 48,
      successRate: 100,
      lastRun: "Il y a 2 jours",
      nextRun: "Lundi 9h",
    },
    {
      id: "WF-003",
      name: "Notification Facture Impayée",
      status: "active",
      trigger: "Échéance +7 jours",
      actions: 2,
      executions: 23,
      successRate: 95.7,
      lastRun: "Hier",
      nextRun: "Dans 3 jours",
    },
    {
      id: "WF-004",
      name: "Backup Données Quotidien",
      status: "paused",
      trigger: "Tous les jours 2h",
      actions: 4,
      executions: 305,
      successRate: 99.7,
      lastRun: "Il y a 12h",
      nextRun: "Pausé",
    },
  ];

  // Execution Logs
  const executionLogs: ExecutionLog[] = [
    {
      id: "EX-001",
      workflowId: "WF-001",
      workflowName: "Alerte Irrigation Automatique",
      status: "success",
      startTime: "2025-01-13 12:30:45",
      endTime: "2025-01-13 12:31:12",
      duration: 27,
    },
    {
      id: "EX-002",
      workflowId: "WF-002",
      workflowName: "Rapport Hebdomadaire",
      status: "success",
      startTime: "2025-01-13 09:00:00",
      endTime: "2025-01-13 09:02:34",
      duration: 154,
    },
    {
      id: "EX-003",
      workflowId: "WF-003",
      workflowName: "Notification Facture",
      status: "failed",
      startTime: "2025-01-12 14:15:00",
      endTime: "2025-01-12 14:15:08",
      duration: 8,
    },
    {
      id: "EX-004",
      workflowId: "WF-001",
      workflowName: "Alerte Irrigation",
      status: "running",
      startTime: "2025-01-13 14:30:00",
      endTime: "",
      duration: 0,
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: { icon: any; label: string; color: string; bgColor: string } } = {
      active: { icon: CheckCircle, label: "Actif", color: "text-green-700", bgColor: "bg-green-100 dark:bg-green-900/20" },
      paused: { icon: Pause, label: "Pausé", color: "text-orange-700", bgColor: "bg-orange-100 dark:bg-orange-900/20" },
      draft: { icon: Edit, label: "Brouillon", color: "text-gray-700", bgColor: "bg-gray-100 dark:bg-gray-800" },
      error: { icon: XCircle, label: "Erreur", color: "text-red-700", bgColor: "bg-red-100 dark:bg-red-900/20" },
      success: { icon: CheckCircle, label: "Réussi", color: "text-green-700", bgColor: "bg-green-100 dark:bg-green-900/20" },
      failed: { icon: XCircle, label: "Échoué", color: "text-red-700", bgColor: "bg-red-100 dark:bg-red-900/20" },
      running: { icon: Activity, label: "En cours", color: "text-blue-700", bgColor: "bg-blue-100 dark:bg-blue-900/20" },
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
                {kpi.trend !== "neutral" && (
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

      {/* Workflow Status Grid */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">État des Workflows en Temps Réel</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {workflows.map((workflow) => {
            const statusConfig = getStatusConfig(workflow.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={workflow.id}
                className="p-4 border-2 rounded-lg hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <Zap className="h-5 w-5 text-[#16A085]" />
                  <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                </div>
                <div className="text-xs font-medium mb-1 truncate" title={workflow.name}>
                  {workflow.id}
                </div>
                <div className="text-xs text-muted-foreground truncate">{workflow.name}</div>
                <div className="flex items-center gap-1 mt-2">
                  <Activity className={`h-3 w-3 ${workflow.successRate > 95 ? "text-green-600" : "text-orange-600"}`} />
                  <span className="text-xs font-semibold">{workflow.successRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Timeline */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Timeline des Exécutions - Aujourd'hui</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
          <div className="space-y-4">
            {executionLogs.slice(0, 5).map((log, index) => {
              const statusConfig = getStatusConfig(log.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={log.id} className="relative pl-12">
                  <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${statusConfig.bgColor}`}>
                    <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{log.workflowName}</div>
                        <div className="text-sm text-muted-foreground">{log.workflowId}</div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${statusConfig.color} ${statusConfig.bgColor}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Début: {log.startTime}</span>
                      {log.duration > 0 && <span>Durée: {log.duration}s</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Performance des Workflows - 7 Derniers Jours</h3>
        <div className="h-64 flex items-end justify-around gap-2">
          {[95, 98, 97, 99, 98, 99, 98].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-[#16A085] to-[#1ABC9C] rounded-t transition-all hover:opacity-80 cursor-pointer"
                style={{ height: `${value * 2.5}px` }}
                title={`${value}%`}
              />
              <div className="text-xs font-medium text-muted-foreground mt-2">
                J{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBuilder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workflow Builder</h2>
          <p className="text-muted-foreground">Créez des automatisations drag & drop</p>
        </div>
        <button className="px-6 py-2 bg-[#16A085] text-white rounded-lg hover:bg-[#138D75] transition-colors font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouveau Workflow
        </button>
      </div>

      {/* Builder Canvas */}
      <div className="bg-card border rounded-xl p-6 min-h-[600px]">
        <div className="grid grid-cols-4 gap-6 h-full">
          {/* Actions Palette */}
          <div className="border-r pr-6">
            <h3 className="font-semibold mb-4">Actions Disponibles</h3>
            <div className="space-y-2">
              {[
                { icon: Mail, label: "Envoyer Email", color: "blue" },
                { icon: Webhook, label: "Appeler Webhook", color: "purple" },
                { icon: Database, label: "Mise à jour BDD", color: "green" },
                { icon: GitBranch, label: "Condition IF/ELSE", color: "orange" },
                { icon: Clock, label: "Délai", color: "gray" },
                { icon: Code, label: "Script Custom", color: "red" },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <div
                    key={index}
                    draggable
                    className={`p-3 border-2 border-dashed rounded-lg cursor-move hover:border-[#16A085] transition-colors`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded bg-${action.color}-100 dark:bg-${action.color}-900/20`}>
                        <Icon className={`h-4 w-4 text-${action.color}-600`} />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Canvas */}
          <div className="col-span-3 bg-muted/30 rounded-lg p-8 relative">
            <div className="text-center text-muted-foreground">
              <GitBranch className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Glissez des actions ici</p>
              <p className="text-sm">Construisez votre workflow visuellement</p>
            </div>

            {/* Example Flow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-card border-2 border-[#16A085] rounded-lg shadow-lg">
                  <Zap className="h-8 w-8 text-[#16A085]" />
                  <div className="text-xs mt-2">Déclencheur</div>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
                <div className="p-4 bg-card border-2 rounded-lg shadow">
                  <Mail className="h-8 w-8 text-blue-600" />
                  <div className="text-xs mt-2">Action 1</div>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
                <div className="p-4 bg-card border-2 rounded-lg shadow">
                  <Database className="h-8 w-8 text-green-600" />
                  <div className="text-xs mt-2">Action 2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Configuration du Workflow</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom du Workflow</label>
            <input
              type="text"
              placeholder="Ex: Alerte Irrigation Automatique"
              className="w-full px-3 py-2 border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              placeholder="Description courte..."
              className="w-full px-3 py-2 border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Gestion des Erreurs</label>
            <select className="w-full px-3 py-2 border rounded-lg bg-background">
              <option>Retry 3 fois</option>
              <option>Arrêter immédiatement</option>
              <option>Continuer malgré erreurs</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Niveau de Logging</label>
            <select className="w-full px-3 py-2 border rounded-lg bg-background">
              <option>Détaillé</option>
              <option>Normal</option>
              <option>Minimal</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScheduled = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tâches Planifiées</h2>
        <p className="text-muted-foreground">Gérez vos automatisations programmées</p>
      </div>

      {/* Calendar View */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Calendrier des Tâches</h3>
        <div className="grid grid-cols-7 gap-2">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 0;
            const hasTask = [1, 8, 15, 22, 29].includes(day);
            return (
              <div
                key={i}
                className={`aspect-square border rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer ${
                  day === 13 ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500" : ""
                }`}
              >
                <div className="text-sm font-medium">{day > 0 && day <= 31 ? day : ""}</div>
                {hasTask && day > 0 && day <= 31 && (
                  <div className="mt-1">
                    <div className="w-full h-1 bg-[#16A085] rounded mb-0.5" />
                    <div className="w-full h-1 bg-blue-500 rounded" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Prochaines 7 Exécutions</h3>
        <div className="space-y-3">
          {[
            { workflow: "Rapport Hebdomadaire", time: "Demain, 09:00", frequency: "Hebdomadaire" },
            { workflow: "Backup Données", time: "Aujourd'hui, 02:00", frequency: "Quotidien" },
            { workflow: "Alerte Irrigation", time: "Dans 4h", frequency: "Temps réel" },
            { workflow: "Facturation Mensuelle", time: "1er Février, 10:00", frequency: "Mensuel" },
          ].map((task, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#16A085]/10 rounded">
                    <Calendar className="h-5 w-5 text-[#16A085]" />
                  </div>
                  <div>
                    <div className="font-medium">{task.workflow}</div>
                    <div className="text-sm text-muted-foreground">{task.frequency}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{task.time}</div>
                  <button className="text-xs text-[#16A085] hover:underline">Modifier</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTriggers = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Déclencheurs d'Événements</h2>
        <p className="text-muted-foreground">Configurez les conditions d'activation</p>
      </div>

      {/* Event Sources */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { source: "IoT Hub", events: 145, icon: Activity, color: "blue" },
          { source: "Crop Intelligence", events: 89, icon: AlertCircle, color: "green" },
          { source: "Financial Suite", events: 56, icon: DollarSign, color: "red" },
          { source: "API Webhook", events: 234, icon: Webhook, color: "purple" },
        ].map((src, index) => {
          const Icon = src.icon;
          return (
            <div key={index} className="bg-card border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 bg-${src.color}-100 dark:bg-${src.color}-900/20 rounded`}>
                  <Icon className={`h-5 w-5 text-${src.color}-600`} />
                </div>
                <div className="text-sm text-muted-foreground">{src.source}</div>
              </div>
              <div className="text-2xl font-bold">{src.events}</div>
              <div className="text-xs text-muted-foreground">événements ce mois</div>
            </div>
          );
        })}
      </div>

      {/* Trigger Configuration */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Configurer un Nouveau Déclencheur</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Source</label>
              <select className="w-full px-3 py-2 border rounded-lg bg-background">
                <option>IoT Hub</option>
                <option>Crop Intelligence</option>
                <option>Financial Suite</option>
                <option>API Webhook</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Événement</label>
              <select className="w-full px-3 py-2 border rounded-lg bg-background">
                <option>Alerte capteur</option>
                <option>Seuil dépassé</option>
                <option>Paiement reçu</option>
                <option>Nouveau client</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Condition</label>
              <select className="w-full px-3 py-2 border rounded-lg bg-background">
                <option>Température {">"} 35°C</option>
                <option>Humidité {"<"} 30%</option>
                <option>Batterie {"<"} 20%</option>
              </select>
            </div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Aperçu du Déclencheur
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  SI [IoT Hub] → [Alerte capteur] → [Température {">"} 35°C] ALORS [Workflow]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Logs d'Exécution</h2>
          <p className="text-muted-foreground">Historique détaillé des workflows</p>
        </div>
        <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </button>
      </div>

      {/* Execution Logs Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Dernières Exécutions</h3>
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
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Workflow</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Début</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Fin</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Durée</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {executionLogs.map((log) => {
                const statusConfig = getStatusConfig(log.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={log.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {log.id}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{log.workflowName}</div>
                      <div className="text-xs text-muted-foreground">{log.workflowId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${statusConfig.color} ${statusConfig.bgColor}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{log.startTime}</td>
                    <td className="px-4 py-3 text-sm">{log.endTime || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-sm">
                        {log.duration > 0 ? `${log.duration}s` : "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-muted rounded" title="Voir détails">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Relancer">
                          <RefreshCw className="h-4 w-4" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Automation Workflows</h1>
            <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-bold rounded-full">
              AUTOMATISATION
            </span>
          </div>
          <p className="text-muted-foreground">
            Créez et gérez des workflows automatisés intelligents
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Import/Export
          </button>

          <button className="px-6 py-2 bg-[#16A085] text-white rounded-lg hover:bg-[#138D75] transition-colors font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nouveau Workflow
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card border rounded-xl p-2 flex gap-2 overflow-x-auto">
        {[
          { id: "overview", label: "Vue d'ensemble", icon: Activity },
          { id: "builder", label: "Builder", icon: GitBranch },
          { id: "scheduled", label: "Planifiées", icon: Calendar },
          { id: "triggers", label: "Déclencheurs", icon: Zap },
          { id: "logs", label: "Logs", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeView === tab.id
                  ? "bg-[#16A085] text-white"
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
      {activeView === "builder" && renderBuilder()}
      {activeView === "scheduled" && renderScheduled()}
      {activeView === "triggers" && renderTriggers()}
      {activeView === "logs" && renderLogs()}
    </div>
  );
}