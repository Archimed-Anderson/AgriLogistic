import { useState } from "react";
import {
  Cpu,
  Wifi,
  Battery,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  Search,
  Filter,
  RefreshCw,
  Power,
  Settings,
  BarChart3,
  Zap,
  Signal,
  WifiOff,
  BatteryCharging,
  BatteryLow,
  BatteryFull,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Thermometer,
  Droplet,
  Wind,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Network,
} from "lucide-react";
import { toast } from "sonner";

interface IoTDevice {
  id: string;
  name: string;
  type: "sensor" | "station" | "controller" | "gateway";
  location: string;
  status: "online" | "offline" | "warning" | "error";
  battery: number;
  signal: number;
  lastSeen: string;
  firmware: string;
  dataRate: number;
}

export function IoTDeviceHub() {
  const [activeView, setActiveView] = useState<"overview" | "devices" | "network" | "battery" | "alerts" | "analytics">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  // KPIs Data
  const kpis = [
    {
      id: "connectivity",
      label: "Connectivité",
      value: "96.7%",
      change: 1.2,
      icon: Wifi,
      color: "blue",
      trend: "up",
      subtitle: "145/150 actifs",
    },
    {
      id: "battery",
      label: "Batterie Moyenne",
      value: "78%",
      change: -3.5,
      icon: Battery,
      color: "green",
      trend: "down",
      subtitle: "5 appareils < 20%",
    },
    {
      id: "data",
      label: "Données Reçues",
      value: "98.2%",
      change: 0.8,
      icon: Activity,
      color: "purple",
      trend: "up",
      subtitle: "1.2M points/jour",
    },
    {
      id: "maintenance",
      label: "Maintenance Requise",
      value: "5",
      change: 2,
      icon: AlertTriangle,
      color: "orange",
      trend: "up",
      subtitle: "appareils",
    },
  ];

  // Devices Data
  const devices: IoTDevice[] = [
    {
      id: "IOT-001",
      name: "Capteur Humidité Sol - Nord A",
      type: "sensor",
      location: "Parcelle Nord A",
      status: "online",
      battery: 92,
      signal: 85,
      lastSeen: "Il y a 2 min",
      firmware: "v2.1.4",
      dataRate: 98.5,
    },
    {
      id: "IOT-002",
      name: "Station Météo Principale",
      type: "station",
      location: "Centre exploitation",
      status: "online",
      battery: 100,
      signal: 95,
      lastSeen: "Il y a 1 min",
      firmware: "v3.0.2",
      dataRate: 99.8,
    },
    {
      id: "IOT-003",
      name: "Contrôleur Irrigation - Zone 1",
      type: "controller",
      location: "Parcelle Sud",
      status: "warning",
      battery: 18,
      signal: 72,
      lastSeen: "Il y a 15 min",
      firmware: "v2.0.1",
      dataRate: 95.2,
    },
    {
      id: "IOT-004",
      name: "Gateway LoRaWAN Principal",
      type: "gateway",
      location: "Bâtiment technique",
      status: "online",
      battery: 100,
      signal: 100,
      lastSeen: "Il y a 30 sec",
      firmware: "v4.1.0",
      dataRate: 99.9,
    },
    {
      id: "IOT-005",
      name: "Capteur Température - Serre 3",
      type: "sensor",
      location: "Serre 3",
      status: "error",
      battery: 5,
      signal: 0,
      lastSeen: "Il y a 2 heures",
      firmware: "v2.1.2",
      dataRate: 0,
    },
    {
      id: "IOT-006",
      name: "Capteur pH Sol - Est",
      type: "sensor",
      location: "Parcelle Est",
      status: "online",
      battery: 65,
      signal: 78,
      lastSeen: "Il y a 5 min",
      firmware: "v2.1.4",
      dataRate: 97.3,
    },
  ];

  // Alerts Data
  const alerts = [
    {
      id: "A001",
      priority: "critical",
      device: "IOT-005",
      message: "Capteur hors ligne - Batterie critique",
      time: "Il y a 2 heures",
      resolved: false,
    },
    {
      id: "A002",
      priority: "important",
      device: "IOT-003",
      message: "Niveau batterie faible - Remplacement requis",
      time: "Il y a 15 min",
      resolved: false,
    },
    {
      id: "A003",
      priority: "info",
      device: "IOT-001",
      message: "Mise à jour firmware disponible",
      time: "Il y a 1 jour",
      resolved: false,
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: { icon: any; label: string; color: string; bgColor: string } } = {
      online: { icon: CheckCircle, label: "En ligne", color: "text-green-700", bgColor: "bg-green-100 dark:bg-green-900/20" },
      offline: { icon: XCircle, label: "Hors ligne", color: "text-gray-700", bgColor: "bg-gray-100 dark:bg-gray-800" },
      warning: { icon: AlertTriangle, label: "Alerte", color: "text-orange-700", bgColor: "bg-orange-100 dark:bg-orange-900/20" },
      error: { icon: XCircle, label: "Erreur", color: "text-red-700", bgColor: "bg-red-100 dark:bg-red-900/20" },
    };
    return configs[status];
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      sensor: Thermometer,
      station: Activity,
      controller: Zap,
      gateway: Network,
    };
    return icons[type] || Cpu;
  };

  const getBatteryIcon = (level: number) => {
    if (level > 80) return BatteryFull;
    if (level > 20) return BatteryCharging;
    return BatteryLow;
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: { bg: string; text: string; border: string } } = {
      critical: { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-700", border: "border-red-500" },
      important: { bg: "bg-orange-100 dark:bg-orange-900/20", text: "text-orange-700", border: "border-orange-500" },
      info: { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-700", border: "border-blue-500" },
    };
    return colors[priority] || colors.info;
  };

  const handleSelectDevice = (id: string) => {
    if (selectedDevices.includes(id)) {
      setSelectedDevices(selectedDevices.filter(d => d !== id));
    } else {
      setSelectedDevices([...selectedDevices, id]);
    }
  };

  const handleRebootDevice = (device: IoTDevice) => {
    toast.success(`Redémarrage de ${device.name}...`);
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

      {/* Device Status Grid */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">État du Réseau en Temps Réel</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {devices.map((device) => {
            const TypeIcon = getTypeIcon(device.type);
            const statusConfig = getStatusConfig(device.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={device.id}
                className="p-4 border-2 rounded-lg hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <TypeIcon className="h-5 w-5 text-[#4682B4]" />
                  <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                </div>
                <div className="text-xs font-medium mb-1 truncate" title={device.name}>
                  {device.id}
                </div>
                <div className="text-xs text-muted-foreground">{device.location}</div>
                <div className="flex items-center gap-1 mt-2">
                  <Battery
                    className={`h-3 w-3 ${
                      device.battery > 80
                        ? "text-green-600"
                        : device.battery > 20
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  />
                  <span className="text-xs font-semibold">{device.battery}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Network Topology */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Topologie du Réseau</h3>
        <div className="relative h-80 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-8">
          {/* Gateway (center) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 border-4 border-[#4682B4] rounded-full flex items-center justify-center shadow-xl">
              <Network className="h-10 w-10 text-[#4682B4]" />
            </div>
            <div className="text-center mt-2 text-xs font-semibold">Gateway</div>
          </div>

          {/* Connected Devices (circle around) */}
          {devices.slice(0, 5).map((device, index) => {
            const angle = (index * 72 - 90) * (Math.PI / 180);
            const radius = 120;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            return (
              <div
                key={device.id}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className={`w-12 h-12 bg-white dark:bg-gray-800 border-2 rounded-full flex items-center justify-center shadow-lg ${
                    device.status === "online"
                      ? "border-green-500"
                      : device.status === "warning"
                      ? "border-orange-500"
                      : "border-red-500"
                  }`}
                >
                  <Cpu className="h-6 w-6 text-[#4682B4]" />
                </div>
                {/* Connection line */}
                <svg
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  style={{
                    width: `${radius * 2}px`,
                    height: `${radius * 2}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${50 - x + 50}%`}
                    y2={`${50 - y + 50}%`}
                    stroke={device.status === "online" ? "#4682B4" : "#ccc"}
                    strokeWidth="2"
                    strokeDasharray={device.status === "online" ? "0" : "5,5"}
                  />
                </svg>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Activité Récente</h3>
          <div className="space-y-3">
            {[
              { time: "Il y a 2 min", action: "IOT-001 - Données envoyées", status: "success" },
              { time: "Il y a 15 min", action: "IOT-003 - Alerte batterie faible", status: "warning" },
              { time: "Il y a 2h", action: "IOT-005 - Connexion perdue", status: "error" },
              { time: "Il y a 3h", action: "IOT-002 - Firmware mis à jour", status: "info" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === "success"
                      ? "bg-green-500"
                      : activity.status === "warning"
                      ? "bg-orange-500"
                      : activity.status === "error"
                      ? "bg-red-500"
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
          <h3 className="text-lg font-semibold mb-4">Performance Réseau</h3>
          <div className="space-y-4">
            {[
              { label: "Latence moyenne", value: "45 ms", status: "good" },
              { label: "Débit de données", value: "2.4 MB/s", status: "good" },
              { label: "Perte de paquets", value: "0.3%", status: "good" },
              { label: "Temps de disponibilité", value: "99.7%", status: "excellent" },
            ].map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                  <div className="text-xl font-bold">{metric.value}</div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    metric.status === "excellent"
                      ? "bg-green-100 dark:bg-green-900/20 text-green-700"
                      : "bg-blue-100 dark:bg-blue-900/20 text-blue-700"
                  }`}
                >
                  {metric.status === "excellent" ? "Excellent" : "Bon"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDevices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Appareils</h2>
          <p className="text-muted-foreground">Inventaire et configuration IoT</p>
        </div>
        <button className="px-6 py-2 bg-[#4682B4] text-white rounded-lg hover:bg-[#3A6D9E] transition-colors font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Ajouter Appareil
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 border rounded-lg bg-background"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            <option value="all">Tous les types</option>
            <option value="sensor">Capteurs</option>
            <option value="station">Stations</option>
            <option value="controller">Contrôleurs</option>
            <option value="gateway">Gateways</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            <option value="all">Tous les statuts</option>
            <option value="online">En ligne</option>
            <option value="offline">Hors ligne</option>
            <option value="warning">Alerte</option>
            <option value="error">Erreur</option>
          </select>
          <button className="px-4 py-2 bg-[#4682B4] text-white rounded-lg hover:bg-[#3A6D9E] transition-colors font-semibold">
            Filtrer
          </button>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="w-4 h-4" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Appareil</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Localisation</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Batterie</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Signal</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Dernier Signal</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => {
                const TypeIcon = getTypeIcon(device.type);
                const statusConfig = getStatusConfig(device.status);
                const StatusIcon = statusConfig.icon;
                const BatteryIcon = getBatteryIcon(device.battery);

                return (
                  <tr
                    key={device.id}
                    className={`border-t hover:bg-muted/50 transition-colors ${
                      selectedDevices.includes(device.id) ? "bg-blue-50 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedDevices.includes(device.id)}
                        onChange={() => handleSelectDevice(device.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                          <TypeIcon className="h-5 w-5 text-[#4682B4]" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{device.name}</div>
                          <div className="text-xs text-muted-foreground">{device.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-muted rounded text-xs font-medium capitalize">
                        {device.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {device.location}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${statusConfig.color} ${statusConfig.bgColor}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <BatteryIcon
                          className={`h-4 w-4 ${
                            device.battery > 80
                              ? "text-green-600"
                              : device.battery > 20
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        />
                        <span className="text-sm font-semibold">{device.battery}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Signal
                          className={`h-4 w-4 ${
                            device.signal > 70 ? "text-green-600" : "text-orange-600"
                          }`}
                        />
                        <span className="text-sm font-semibold">{device.signal}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{device.lastSeen}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-muted rounded" title="Voir détails">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Éditer">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRebootDevice(device)}
                          className="p-1 hover:bg-muted rounded"
                          title="Redémarrer"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
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

  const renderBattery = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Surveillance des Batteries</h2>
        <p className="text-muted-foreground">Optimisez la durée de vie et planifiez les remplacements</p>
      </div>

      {/* Battery Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { range: "> 80%", count: 3, color: "green", icon: BatteryFull },
          { range: "50-80%", count: 2, color: "blue", icon: BatteryCharging },
          { range: "20-50%", count: 1, color: "orange", icon: Battery },
          { range: "< 20%", count: 2, color: "red", icon: BatteryLow },
        ].map((status, index) => {
          const Icon = status.icon;
          return (
            <div key={index} className="bg-card border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${status.color}-100 dark:bg-${status.color}-900/20`}>
                  <Icon className={`h-6 w-6 text-${status.color}-600`} />
                </div>
              </div>
              <div className="text-sm text-muted-foreground mb-1">{status.range}</div>
              <div className="text-3xl font-bold">{status.count}</div>
              <div className="text-xs text-muted-foreground">appareils</div>
            </div>
          );
        })}
      </div>

      {/* Battery Levels Chart */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Niveaux de Batterie par Appareil</h3>
        <div className="space-y-3">
          {devices.map((device) => (
            <div key={device.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{device.name}</span>
                  <span className="text-xs text-muted-foreground">({device.id})</span>
                </div>
                <span className="text-sm font-bold">{device.battery}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    device.battery > 80
                      ? "bg-green-500"
                      : device.battery > 20
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${device.battery}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Replacement Schedule */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Planning de Remplacement</h3>
        <div className="space-y-3">
          {devices
            .filter((d) => d.battery < 30)
            .map((device) => (
              <div key={device.id} className="p-4 border-2 border-dashed rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{device.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Batterie: {device.battery}% • Remplacement estimé: dans{" "}
                      {Math.ceil((device.battery / 10) * 7)} jours
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#4682B4] text-white rounded-lg hover:bg-[#3A6D9E] transition-colors text-sm font-semibold">
                    Commander
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Centre d'Alertes</h2>
        <p className="text-muted-foreground">Surveillez et gérez toutes les alertes IoT</p>
      </div>

      {/* Alerts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-sm text-muted-foreground">Critiques</div>
          </div>
          <div className="text-3xl font-bold">1</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-sm text-muted-foreground">Importantes</div>
          </div>
          <div className="text-3xl font-bold">1</div>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-sm text-muted-foreground">Informations</div>
          </div>
          <div className="text-3xl font-bold">1</div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-card border rounded-xl divide-y">
        {alerts.map((alert) => {
          const colors = getPriorityColor(alert.priority);
          return (
            <div key={alert.id} className={`p-6 border-l-4 ${colors.border}`}>
              <div className="flex items-start gap-4">
                <AlertTriangle className={`h-6 w-6 ${colors.text} flex-shrink-0 mt-1`} />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold">{alert.message}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Appareil: {alert.device} • {alert.time}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.text} ${colors.bg}`}
                    >
                      {alert.priority === "critical" && "Critique"}
                      {alert.priority === "important" && "Important"}
                      {alert.priority === "info" && "Information"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
                      Accuser réception
                    </button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
                      Escalader
                    </button>
                    <button className="px-4 py-2 bg-[#4682B4] text-white rounded-lg hover:bg-[#3A6D9E] transition-colors text-sm font-medium">
                      Résoudre
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Performance Analytics</h2>
        <p className="text-muted-foreground">Analysez les performances de vos appareils</p>
      </div>

      {/* Uptime Chart */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Temps de Disponibilité - 7 Derniers Jours</h3>
        <div className="h-64 flex items-end justify-around gap-2">
          {[98.5, 99.2, 97.8, 99.8, 99.1, 98.9, 99.7].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-[#4682B4] to-[#5D8AA8] rounded-t transition-all hover:opacity-80 cursor-pointer"
                style={{ height: `${value}%` }}
                title={`${value}%`}
              />
              <div className="text-xs font-medium text-muted-foreground mt-2">
                J{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device Comparison */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Comparaison par Type</h3>
        <div className="space-y-4">
          {[
            { type: "Sensors", count: 3, uptime: 98.5, dataQuality: 97.2 },
            { type: "Stations", count: 1, uptime: 99.8, dataQuality: 99.5 },
            { type: "Controllers", count: 1, uptime: 95.2, dataQuality: 94.8 },
            { type: "Gateways", count: 1, uptime: 99.9, dataQuality: 99.9 },
          ].map((item, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold">{item.type}</div>
                  <div className="text-sm text-muted-foreground">{item.count} appareil(s)</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Uptime</div>
                  <div className="text-xl font-bold text-[#4682B4]">{item.uptime}%</div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Qualité des données</span>
                    <span className="font-semibold">{item.dataQuality}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${item.dataQuality}%` }}
                    />
                  </div>
                </div>
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
            <h1 className="text-3xl font-bold tracking-tight">IoT Device Hub</h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {devices.filter((d) => d.status === "online").length}/{devices.length} ACTIFS
            </span>
          </div>
          <p className="text-muted-foreground">
            Gérez et surveillez votre écosystème IoT agricole
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>

          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>

          <button className="px-6 py-2 bg-[#4682B4] text-white rounded-lg hover:bg-[#3A6D9E] transition-colors font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nouvel Appareil
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card border rounded-xl p-2 flex gap-2 overflow-x-auto">
        {[
          { id: "overview", label: "Vue d'ensemble", icon: Activity },
          { id: "devices", label: "Appareils", icon: Cpu },
          { id: "network", label: "Réseau", icon: Network },
          { id: "battery", label: "Batteries", icon: Battery },
          { id: "alerts", label: "Alertes", icon: AlertTriangle },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeView === tab.id
                  ? "bg-[#4682B4] text-white"
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
      {activeView === "devices" && renderDevices()}
      {activeView === "network" && renderOverview()} {/* Using overview for network demo */}
      {activeView === "battery" && renderBattery()}
      {activeView === "alerts" && renderAlerts()}
      {activeView === "analytics" && renderAnalytics()}
    </div>
  );
}
