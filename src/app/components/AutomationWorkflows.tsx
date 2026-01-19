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
  Sparkles,
  Brain,
  Target,
  ArrowRight,
  Save,
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

// Advanced Rule Engine Interfaces
interface RuleTrigger {
  type: "sensor" | "schedule" | "manual" | "event" | "threshold";
  condition: string;
  value?: any;
  operator?: "=" | ">" | "<" | ">=" | "<=" | "!=" | "contains";
}

interface RuleCondition {
  id: string;
  type: "if" | "else_if" | "else";
  field: string;
  operator: "=" | ">" | "<" | ">=" | "<=" | "!=" | "contains" | "between";
  value: any;
  logicGate?: "AND" | "OR";
}

interface RuleAction {
  id: string;
  type: "notification" | "command" | "api_call" | "data_log" | "alert";
  target: string;
  parameters: Record<string, any>;
  delay?: number;
}

interface AdvancedRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: "low" | "medium" | "high" | "critical";
  trigger: RuleTrigger;
  conditions: RuleCondition[];
  actions: RuleAction[];
  createdAt: string;
  lastExecuted?: string;
  executionCount: number;
  successRate: number;
}

export function AutomationWorkflows() {
  const [activeView, setActiveView] = useState<"overview" | "builder" | "scheduled" | "triggers" | "logs">("overview");
  const [showBuilder, setShowBuilder] = useState(false);
  
  // Advanced Rule Engine State
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [advancedRules, setAdvancedRules] = useState<AdvancedRule[]>([]);
  const [selectedRule, setSelectedRule] = useState<AdvancedRule | null>(null);
  const [ruleEngineEnabled, setRuleEngineEnabled] = useState(true);

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

  // Sample Advanced Rules
  const sampleRules: AdvancedRule[] = [
    {
      id: "RULE-001",
      name: "Irrigation Intelligente Multi-Conditions",
      description: "Déclenche l'irrigation si humidité < 30% ET température > 25°C ET pas de pluie prévue",
      enabled: true,
      priority: "high",
      trigger: {
        type: "sensor",
        condition: "Humidité Sol",
        value: 30,
        operator: "<",
      },
      conditions: [
        {
          id: "COND-001",
          type: "if",
          field: "temperature",
          operator: ">",
          value: 25,
          logicGate: "AND",
        },
        {
          id: "COND-002",
          type: "if",
          field: "rain_forecast",
          operator: "=",
          value: false,
          logicGate: "AND",
        },
      ],
      actions: [
        {
          id: "ACT-001",
          type: "command",
          target: "Système Irrigation Parcelle Nord",
          parameters: { duration: 60, intensity: "medium" },
        },
        {
          id: "ACT-002",
          type: "notification",
          target: "Responsable Agricole",
          parameters: { channel: "sms", message: "Irrigation démarrée" },
          delay: 2,
        },
      ],
      createdAt: "2025-01-10",
      lastExecuted: "Il y a 3h",
      executionCount: 24,
      successRate: 100,
    },
    {
      id: "RULE-002",
      name: "Alerte Maladie avec IA",
      description: "Si IA détecte maladie avec confiance > 85% ALORS notifier + créer ticket",
      enabled: true,
      priority: "critical",
      trigger: {
        type: "event",
        condition: "AI Disease Detection",
      },
      conditions: [
        {
          id: "COND-003",
          type: "if",
          field: "confidence",
          operator: ">=",
          value: 85,
        },
      ],
      actions: [
        {
          id: "ACT-003",
          type: "alert",
          target: "Dashboard Principal",
          parameters: { severity: "high", sound: true },
        },
        {
          id: "ACT-004",
          type: "api_call",
          target: "Ticket System API",
          parameters: { endpoint: "/tickets/create", method: "POST" },
          delay: 1,
        },
        {
          id: "ACT-005",
          type: "notification",
          target: "Agronome Chef",
          parameters: { channel: "email", priority: "urgent" },
          delay: 2,
        },
      ],
      createdAt: "2025-01-08",
      lastExecuted: "Il y a 5h",
      executionCount: 7,
      successRate: 100,
    },
    {
      id: "RULE-003",
      name: "Optimisation Coûts Énergie",
      description: "Active équipements énergivores pendant heures creuses (22h-6h)",
      enabled: true,
      priority: "medium",
      trigger: {
        type: "schedule",
        condition: "Tous les jours 22:00",
      },
      conditions: [
        {
          id: "COND-004",
          type: "if",
          field: "electricity_rate",
          operator: "<",
          value: 0.15,
        },
      ],
      actions: [
        {
          id: "ACT-006",
          type: "command",
          target: "Pompes Irrigation",
          parameters: { action: "start", mode: "eco" },
        },
        {
          id: "ACT-007",
          type: "data_log",
          target: "Energy Database",
          parameters: { metrics: ["consumption", "cost", "savings"] },
        },
      ],
      createdAt: "2025-01-05",
      lastExecuted: "Hier 22:00",
      executionCount: 11,
      successRate: 100,
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

  // Rule Engine Functions
  const getPriorityConfig = (priority: string) => {
    const configs: { [key: string]: { bg: string; text: string; border: string } } = {
      low: { bg: "bg-gray-100 dark:bg-gray-900/20", text: "text-gray-700", border: "border-gray-300" },
      medium: { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-700", border: "border-blue-300" },
      high: { bg: "bg-orange-100 dark:bg-orange-900/20", text: "text-orange-700", border: "border-orange-300" },
      critical: { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-700", border: "border-red-300" },
    };
    return configs[priority] || configs.medium;
  };

  const getTriggerTypeIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      sensor: Activity,
      schedule: Clock,
      manual: Target,
      event: Zap,
      threshold: AlertCircle,
    };
    return icons[type] || Zap;
  };

  const toggleRuleStatus = (ruleId: string) => {
    const rule = [...sampleRules, ...advancedRules].find((r) => r.id === ruleId);
    if (!rule) return;

    toast.success(`Règle "${rule.name}" ${rule.enabled ? "désactivée" : "activée"}`);
  };

  const executeRule = async (ruleId: string) => {
    const rule = [...sampleRules, ...advancedRules].find((r) => r.id === ruleId);
    if (!rule) return;

    toast.info(`Exécution de la règle "${rule.name}"...`);

    // Simulate rule execution
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(`Règle exécutée avec succès!`, {
      description: `${rule.actions.length} actions effectuées`,
    });
  };

  const duplicateRule = (ruleId: string) => {
    const rule = [...sampleRules, ...advancedRules].find((r) => r.id === ruleId);
    if (!rule) return;

    const newRule: AdvancedRule = {
      ...rule,
      id: `RULE-${Date.now()}`,
      name: `${rule.name} (copie)`,
      enabled: false,
      executionCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setAdvancedRules((prev) => [newRule, ...prev]);
    toast.success(`Règle dupliquée: ${newRule.name}`);
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
      {/* Header with Rule Engine Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Moteur de Règles Avancé</h2>
          <p className="text-muted-foreground">Créez des automatisations intelligentes avec conditions complexes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRuleBuilder(true)}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nouvelle Règle
          </button>
          <button
            onClick={() => setRuleEngineEnabled(!ruleEngineEnabled)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              ruleEngineEnabled
                ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800"
            }`}
          >
            {ruleEngineEnabled ? "Moteur Actif" : "Moteur Inactif"}
          </button>
        </div>
      </div>

      {/* Rule Engine Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
            <Brain className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Moteur de Règles Intelligent</h3>
            <p className="text-sm text-muted-foreground">
              {[...sampleRules, ...advancedRules].length} règles actives | {[...sampleRules, ...advancedRules].filter(r => r.enabled).length} activées
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-green-600 animate-pulse" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">
              Taux succès: {Math.round([...sampleRules, ...advancedRules].reduce((acc, r) => acc + r.successRate, 0) / ([...sampleRules, ...advancedRules].length || 1))}%
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Rules List */}
      <div className="space-y-4">
        {[...sampleRules, ...advancedRules].map((rule) => {
          const priorityConfig = getPriorityConfig(rule.priority);
          const TriggerIcon = getTriggerTypeIcon(rule.trigger.type);

          return (
            <div
              key={rule.id}
              className={`bg-card border-2 rounded-xl p-6 hover:shadow-lg transition-all ${priorityConfig.border}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${priorityConfig.bg}`}>
                  <TriggerIcon className={`h-6 w-6 ${priorityConfig.text}`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{rule.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${priorityConfig.text} ${priorityConfig.bg}`}>
                          Priorité: {rule.priority.toUpperCase()}
                        </span>
                        {rule.enabled ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800">
                            <Pause className="h-3 w-3 mr-1" />
                            Inactive
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {rule.lastExecuted || "Jamais exécutée"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>

                      {/* Trigger */}
                      <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-900 dark:text-blue-200">Déclencheur ({rule.trigger.type}):</span>
                        </div>
                        <div className="text-sm text-blue-800 dark:text-blue-300">
                          {rule.trigger.condition}
                          {rule.trigger.operator && rule.trigger.value !== undefined && (
                            <span> {rule.trigger.operator} {JSON.stringify(rule.trigger.value)}</span>
                          )}
                        </div>
                      </div>

                      {/* Conditions */}
                      {rule.conditions.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                            <GitBranch className="h-3 w-3" />
                            Conditions ({rule.conditions.length}):
                          </div>
                          <div className="space-y-1">
                            {rule.conditions.map((condition, idx) => (
                              <div key={condition.id} className="flex items-start gap-2 text-sm">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold flex-shrink-0">
                                  {condition.type === "if" ? "IF" : condition.type === "else_if" ? "ELSE IF" : "ELSE"}
                                </span>
                                <span>
                                  {condition.field} {condition.operator} {JSON.stringify(condition.value)}
                                  {condition.logicGate && <span className="font-bold text-purple-600"> {condition.logicGate}</span>}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          Actions ({rule.actions.length}):
                        </div>
                        <div className="space-y-2">
                          {rule.actions.map((action, idx) => (
                            <div key={action.id} className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold text-sm text-green-900 dark:text-green-100">
                                    {idx + 1}. {action.type.toUpperCase()}: {action.target}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Paramètres: {Object.keys(action.parameters).length} | {action.delay ? `Délai: ${action.delay}s` : "Immédiat"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-xs text-muted-foreground">Exécutions</div>
                          <div className="font-bold text-blue-700 dark:text-blue-400">{rule.executionCount}</div>
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-xs text-muted-foreground">Taux Succès</div>
                          <div className="font-bold text-green-700 dark:text-green-400">{rule.successRate}%</div>
                        </div>
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <div className="text-xs text-muted-foreground">Créée</div>
                          <div className="font-bold text-orange-700 dark:text-orange-400">{rule.createdAt}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => executeRule(rule.id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold text-sm flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Exécuter
                    </button>
                    <button
                      onClick={() => toggleRuleStatus(rule.id)}
                      className="px-4 py-2 border-2 border-green-200 dark:border-green-800 rounded-lg hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all font-medium text-sm flex items-center gap-2"
                    >
                      {rule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {rule.enabled ? "Désactiver" : "Activer"}
                    </button>
                    <button
                      onClick={() => duplicateRule(rule.id)}
                      className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors font-medium text-sm flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Dupliquer
                    </button>
                    <button
                      onClick={() => setSelectedRule(rule)}
                      className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors font-medium text-sm flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{sampleRules.length + advancedRules.length}</div>
              <div className="text-xs text-muted-foreground">Règles Total</div>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{[...sampleRules, ...advancedRules].filter(r => r.enabled).length}</div>
              <div className="text-xs text-muted-foreground">Règles Actives</div>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{[...sampleRules, ...advancedRules].reduce((acc, r) => acc + r.executionCount, 0)}</div>
              <div className="text-xs text-muted-foreground">Exécutions Total</div>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-orange-600" />
            <div>
              <div className="text-2xl font-bold">{[...sampleRules, ...advancedRules].reduce((acc, r) => acc + r.actions.length, 0)}</div>
              <div className="text-xs text-muted-foreground">Actions Config</div>
            </div>
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
