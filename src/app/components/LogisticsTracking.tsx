import { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  Phone,
  MessageSquare,
  Check,
  AlertTriangle,
  Eye,
  RefreshCw,
  Search,
  ZoomIn,
  ZoomOut,
  Navigation,
  Clock,
  TrendingUp,
  Package,
  Fuel,
  Activity,
  X,
  Calendar,
  User,
  FileText,
  Navigation2,
  Route,
  CheckCircle,
  Info,
  Mail,
  Send,
  Bell,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Types
interface Delivery {
  id: string;
  trackingNumber: string;
  recipientName: string;
  recipientCity: string;
  driverName: string;
  vehiclePlate: string;
  status: "collected" | "in-transit" | "delivering" | "delivered" | "delayed" | "incident";
  eta: string;
  isOnTime: boolean;
  latitude: number;
  longitude: number;
  route: { lat: number; lng: number }[];
  orderId: string;
  customerName: string;
  address: string;
  phone: string;
  driverPhone: string;
}

interface Incident {
  id: number;
  deliveryId: string;
  type: "delay" | "accident" | "damage" | "vehicle-issue";
  description: string;
  timestamp: string;
  resolved: boolean;
}

// Mock data - 6 livraisons réalistes pour AgroLogistic
const mockDeliveries: Delivery[] = [
  {
    id: "DLV-001",
    trackingNumber: "TRK-FR-2026-45872",
    recipientName: "Ferme du Soleil Levant",
    recipientCity: "Lyon",
    driverName: "Pierre Moreau",
    vehiclePlate: "AA-123-BB",
    status: "in-transit",
    eta: "14:30",
    isOnTime: true,
    latitude: 45.75,
    longitude: 4.85,
    route: [
      { lat: 48.8566, lng: 2.3522 },
      { lat: 47.2, lng: 3.5 },
      { lat: 45.75, lng: 4.85 },
    ],
    orderId: "CMD-2026-002",
    customerName: "Ferme du Soleil Levant",
    address: "125 Route des Monts d'Or, 69450 Lyon",
    phone: "+33 4 78 45 67 89",
    driverPhone: "+33 6 11 22 33 44",
  },
  {
    id: "DLV-002",
    trackingNumber: "TRK-FR-2026-45801",
    recipientName: "Les Jardins de Provence",
    recipientCity: "Marseille",
    driverName: "Sophie Laurent",
    vehiclePlate: "CC-456-DD",
    status: "delayed",
    eta: "16:45",
    isOnTime: false,
    latitude: 43.2965,
    longitude: 5.3698,
    route: [
      { lat: 48.8566, lng: 2.3522 },
      { lat: 45.5, lng: 4.2 },
      { lat: 43.2965, lng: 5.3698 },
    ],
    orderId: "CMD-2026-004",
    customerName: "Les Jardins de Provence",
    address: "88 Avenue du Prado, 13008 Marseille",
    phone: "+33 4 91 23 45 67",
    driverPhone: "+33 6 22 33 44 55",
  },
  {
    id: "DLV-003",
    trackingNumber: "TRK-FR-2026-45789",
    recipientName: "Bio Terre Aquitaine",
    recipientCity: "Bordeaux",
    driverName: "Jean Dupont",
    vehiclePlate: "EE-789-FF",
    status: "delivering",
    eta: "13:15",
    isOnTime: true,
    latitude: 44.8378,
    longitude: -0.5792,
    route: [
      { lat: 48.8566, lng: 2.3522 },
      { lat: 46.5, lng: 0.8 },
      { lat: 44.8378, lng: -0.5792 },
    ],
    orderId: "CMD-2026-005",
    customerName: "Bio Terre Aquitaine",
    address: "Domaine des Vignes, 33700 Bordeaux",
    phone: "+33 5 56 78 90 12",
    driverPhone: "+33 6 33 44 55 66",
  },
  {
    id: "DLV-004",
    trackingNumber: "TRK-FR-2026-45756",
    recipientName: "Ferme du Val de Loire",
    recipientCity: "Tours",
    driverName: "Luc Bernard",
    vehiclePlate: "GG-321-HH",
    status: "in-transit",
    eta: "15:00",
    isOnTime: true,
    latitude: 47.3941,
    longitude: 0.6848,
    route: [
      { lat: 48.8566, lng: 2.3522 },
      { lat: 48.0, lng: 1.5 },
      { lat: 47.3941, lng: 0.6848 },
    ],
    orderId: "CMD-2026-007",
    customerName: "Ferme du Val de Loire",
    address: "Château de la Loire, 37000 Tours",
    phone: "+33 2 47 89 01 23",
    driverPhone: "+33 6 44 55 66 77",
  },
  {
    id: "DLV-005",
    trackingNumber: "TRK-FR-2026-45723",
    recipientName: "Coopérative Agricole du Nord",
    recipientCity: "Lille",
    driverName: "Marie Petit",
    vehiclePlate: "II-654-JJ",
    status: "incident",
    eta: "14:00",
    isOnTime: false,
    latitude: 50.6292,
    longitude: 3.0573,
    route: [
      { lat: 48.8566, lng: 2.3522 },
      { lat: 49.8, lng: 2.8 },
      { lat: 50.6292, lng: 3.0573 },
    ],
    orderId: "CMD-2026-008",
    customerName: "Coopérative Agricole du Nord",
    address: "Zone Industrielle Nord, 59000 Lille",
    phone: "+33 3 20 12 34 56",
    driverPhone: "+33 6 55 66 77 88",
  },
  {
    id: "DLV-006",
    trackingNumber: "TRK-FR-2026-45690",
    recipientName: "Maraîchers de Bretagne",
    recipientCity: "Rennes",
    driverName: "Antoine Rousseau",
    vehiclePlate: "KK-987-LL",
    status: "collected",
    eta: "17:30",
    isOnTime: true,
    latitude: 48.1173,
    longitude: -1.6778,
    route: [
      { lat: 48.8566, lng: 2.3522 },
      { lat: 48.5, lng: 0.5 },
      { lat: 48.1173, lng: -1.6778 },
    ],
    orderId: "CMD-2026-009",
    customerName: "Maraîchers de Bretagne",
    address: "Parc des Expositions, 35000 Rennes",
    phone: "+33 2 99 87 65 43",
    driverPhone: "+33 6 66 77 88 99",
  },
];

const mockIncidents: Incident[] = [
  {
    id: 1,
    deliveryId: "DLV-002",
    type: "delay",
    description: "Retard de 2h00 dû au trafic dense sur A7 vers Marseille",
    timestamp: "10/01/2026 14:30",
    resolved: false,
  },
  {
    id: 2,
    deliveryId: "DLV-005",
    type: "vehicle-issue",
    description: "Véhicule immobilisé - panne moteur à proximité de Lille",
    timestamp: "10/01/2026 13:45",
    resolved: false,
  },
  {
    id: 3,
    deliveryId: "DLV-003",
    type: "delay",
    description: "Livraison Bio Terre Aquitaine - accès domaine viticole difficile",
    timestamp: "10/01/2026 12:20",
    resolved: true,
  },
];

const performanceData = [
  { day: "Lun", onTime: 92 },
  { day: "Mar", onTime: 88 },
  { day: "Mer", onTime: 95 },
  { day: "Jeu", onTime: 87 },
  { day: "Ven", onTime: 91 },
  { day: "Sam", onTime: 94 },
  { day: "Dim", onTime: 96 },
];

interface LogisticsTrackingProps {
  isClientView?: boolean;
}

export function LogisticsTracking({ isClientView = false }: LogisticsTrackingProps) {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [activeTab, setActiveTab] = useState<"deliveries" | "incidents" | "performance">("deliveries");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapCenter, setMapCenter] = useState({ x: 0, y: 0 });
  const [hoveredDelivery, setHoveredDelivery] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [incidentType, setIncidentType] = useState<Incident["type"]>("delay");
  const [incidentNote, setIncidentNote] = useState("");
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [wsStatus, setWsStatus] = useState<"connected" | "disconnected" | "reconnecting">("connected");
  const [showRouteOptimizer, setShowRouteOptimizer] = useState(false);
  const [selectedDeliveries, setSelectedDeliveries] = useState<string[]>([]);
  const [optimizationResult, setOptimizationResult] = useState<{
    totalDistance: number;
    estimatedFuel: number;
    fuelCost: number;
    co2Emissions: number;
    estimatedTime: number;
    optimizedRoute: Array<{ deliveryId: string; order: number; city: string; distance: number }>;
  } | null>(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState(() => {
    const saved = localStorage.getItem("AgroLogistic-notification-prefs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse notification preferences", e);
      }
    }
    return {
      smsEnabled: true,
      emailEnabled: true,
      events: {
        collected: { enabled: true, sms: true, email: true },
        inTransit: { enabled: true, sms: true, email: false },
        delivering: { enabled: true, sms: true, email: true },
        delivered: { enabled: true, sms: true, email: true },
        delayed: { enabled: true, sms: true, email: true },
        incident: { enabled: true, sms: true, email: true },
      },
    };
  });
  const [notificationHistory, setNotificationHistory] = useState<Array<{
    id: string;
    deliveryId: string;
    type: "sms" | "email";
    event: string;
    recipient: string;
    timestamp: string;
    status: "sent" | "failed" | "pending";
  }>>([]);

  const activeDeliveriesCount = deliveries.filter((d) =>
    ["collected", "in-transit", "delivering"].includes(d.status)
  ).length;

  const unresolvedIncidents = incidents.filter((i) => !i.resolved).length;

  const getStatusBadge = (status: Delivery["status"]) => {
    const badges = {
      collected: { label: "Collecté", class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
      "in-transit": { label: "En transit", class: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
      delivering: { label: "En livraison", class: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
      delivered: { label: "Livré", class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
      delayed: { label: "Retard", class: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
      incident: { label: "Incident", class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    };
    return badges[status];
  };

  const getTruckColor = (status: Delivery["status"]) => {
    if (status === "incident") return "#dc2626";
    if (status === "delayed") return "#f97316";
    if (["in-transit", "delivering"].includes(status)) return "#10b981";
    return "#9ca3af";
  };

  const handleRefresh = () => {
    const updatedDeliveries = deliveries.map((d) => {
      if (d.id === "DLV-001") {
        return { ...d, eta: "15:15", isOnTime: false, status: "delayed" as const };
      }
      return d;
    });
    setDeliveries(updatedDeliveries);
    toast.success("Carte actualisée - 1 livraison en retard détectée");
  };

  const handleSearch = () => {
    const found = deliveries.find((d) =>
      d.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (found) {
      setSelectedDelivery(found);
      setMapCenter({ x: 0, y: 0 });
      setMapZoom(1.5);
      toast.success(`Livraison ${found.trackingNumber} trouvée`);
    } else {
      toast.error("Numéro de suivi introuvable");
    }
  };

  const handleZoomToDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setMapCenter({ x: 0, y: 0 });
    setMapZoom(1.5);
  };

  const handleResolveIncident = (incidentId: number) => {
    const updatedIncidents = incidents.map((i) =>
      i.id === incidentId ? { ...i, resolved: true } : i
    );
    setIncidents(updatedIncidents);
    toast.success("Incident résolu");
  };

  const handleFilterStatus = (status: string) => {
    setStatusFilter(status);
    if (status !== "all") {
      setMapZoom(1.2);
    }
  };

  const handleCallDriver = (phone: string, name: string) => {
    toast.info(`Appel en cours vers ${name} au ${phone}...`);
  };

  const handleMessageDriver = (name: string) => {
    toast.info(`Messagerie ouverte avec ${name}`);
  };

  const handleMarkAsDelivered = (deliveryId: string) => {
    const updatedDeliveries = deliveries.map((d) =>
      d.id === deliveryId ? { ...d, status: "delivered" as const } : d
    );
    setDeliveries(updatedDeliveries);
    toast.success("Livraison marquée comme livrée");
  };

  const handleSubmitIncident = () => {
    if (!selectedDelivery) return;
    
    const newIncident: Incident = {
      id: incidents.length + 1,
      deliveryId: selectedDelivery.id,
      type: incidentType,
      description: incidentNote,
      timestamp: new Date().toLocaleString("fr-FR"),
      resolved: false,
    };
    
    setIncidents([...incidents, newIncident]);
    setShowIncidentModal(false);
    setIncidentNote("");
    toast.success("Incident signalé avec succès");
  };

  // Route optimization functions
  const toggleDeliverySelection = (deliveryId: string) => {
    setSelectedDeliveries((prev) =>
      prev.includes(deliveryId) ? prev.filter((id) => id !== deliveryId) : [...prev, deliveryId]
    );
  };

  const calculateOptimizedRoute = () => {
    if (selectedDeliveries.length < 2) {
      toast.error("Selectionnez au moins 2 livraisons pour optimiser");
      return;
    }

    // Get selected delivery objects
    const selectedDeliveryObjects = deliveries.filter((d) => selectedDeliveries.includes(d.id));

    // Simple greedy algorithm for TSP (Traveling Salesman Problem)
    // Start from depot (assumed at Paris: 48.8566, 2.3522)
    const depot = { lat: 48.8566, lng: 2.3522, city: "Depot Paris" };
    let currentPos = depot;
    const unvisited = [...selectedDeliveryObjects];
    const route: Array<{ deliveryId: string; order: number; city: string; distance: number }> = [];
    let totalDistance = 0;

    // Greedy nearest-neighbor algorithm
    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = calculateDistance(currentPos.lat, currentPos.lng, unvisited[0].latitude, unvisited[0].longitude);

      for (let i = 1; i < unvisited.length; i++) {
        const dist = calculateDistance(currentPos.lat, currentPos.lng, unvisited[i].latitude, unvisited[i].longitude);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }

      const nearest = unvisited[nearestIdx];
      route.push({
        deliveryId: nearest.id,
        order: route.length + 1,
        city: nearest.recipientCity,
        distance: Math.round(minDistance),
      });
      totalDistance += minDistance;
      currentPos = { lat: nearest.latitude, lng: nearest.longitude, city: nearest.recipientCity };
      unvisited.splice(nearestIdx, 1);
    }

    // Return to depot
    const returnDistance = calculateDistance(currentPos.lat, currentPos.lng, depot.lat, depot.lng);
    totalDistance += returnDistance;

    // Calculate fuel consumption (assuming 8.5 L/100km)
    const fuelConsumption = 8.5; // L/100km
    const fuelPrice = 1.85; // EUR per liter
    const estimatedFuel = (totalDistance * fuelConsumption) / 100;
    const fuelCost = estimatedFuel * fuelPrice;

    // Calculate CO2 emissions (2.31 kg CO2 per liter of diesel)
    const co2Emissions = estimatedFuel * 2.31;

    // Estimate time (assuming average speed of 70 km/h)
    const estimatedTime = totalDistance / 70;

    setOptimizationResult({
      totalDistance: Math.round(totalDistance),
      estimatedFuel: Math.round(estimatedFuel * 10) / 10,
      fuelCost: Math.round(fuelCost * 100) / 100,
      co2Emissions: Math.round(co2Emissions * 10) / 10,
      estimatedTime: Math.round(estimatedTime * 10) / 10,
      optimizedRoute: route,
    });

    toast.success(`Itineraire optimise! Distance totale: ${Math.round(totalDistance)} km`);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Haversine formula for distance between two coordinates
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const resetOptimization = () => {
    setSelectedDeliveries([]);
    setOptimizationResult(null);
    toast.info("Optimisation reinitialise e");
  };

  // Notification functions
  const sendNotification = (delivery: Delivery, event: string, type: "sms" | "email") => {
    const eventKey = event.toLowerCase().replace("-", "") as keyof typeof notificationPreferences.events;
    const prefs = notificationPreferences.events[eventKey];

    if (!prefs || !prefs.enabled || (type === "sms" && !prefs.sms) || (type === "email" && !prefs.email)) {
      return;
    }

    const notification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      deliveryId: delivery.id,
      type,
      event,
      recipient: type === "sms" ? delivery.phone : delivery.customerName,
      timestamp: new Date().toISOString(),
      status: Math.random() > 0.05 ? ("sent" as const) : ("failed" as const), // 95% success rate
    };

    setNotificationHistory((prev) => [notification, ...prev]);

    if (notification.status === "sent") {
      const message =
        type === "sms"
          ? `SMS envoye a ${delivery.phone}: Livraison ${delivery.trackingNumber} - ${event}`
          : `Email envoye a ${delivery.customerName}: Livraison ${delivery.trackingNumber} - ${event}`;
      toast.success(message, { duration: 3000 });
    } else {
      toast.error(`Echec envoi ${type.toUpperCase()} pour ${delivery.trackingNumber}`);
    }
  };

  const toggleNotificationEvent = (eventKey: string, field: "enabled" | "sms" | "email") => {
    setNotificationPreferences((prev: any) => ({
      ...prev,
      events: {
        ...prev.events,
        [eventKey]: {
          ...prev.events[eventKey],
          [field]: !prev.events[eventKey][field],
        },
      },
    }));
  };

  const saveNotificationPreferences = () => {
    localStorage.setItem("AgroLogistic-notification-prefs", JSON.stringify(notificationPreferences));
    toast.success("Preferences de notification sauvegardees");
    setShowNotificationSettings(false);
  };

  const simulateDeliveryStatusChange = (deliveryId: string, newStatus: Delivery["status"]) => {
    const delivery = deliveries.find((d) => d.id === deliveryId);
    if (!delivery) return;

    setDeliveries((prev) => prev.map((d) => (d.id === deliveryId ? { ...d, status: newStatus } : d)));

    // Auto-send notifications based on status change
    const eventMap: Record<Delivery["status"], string> = {
      collected: "Collectee",
      "in-transit": "En transit",
      delivering: "En livraison",
      delivered: "Livree",
      delayed: "Retard detecte",
      incident: "Incident signale",
    };

    const event = eventMap[newStatus];
    if (notificationPreferences.smsEnabled) {
      sendNotification(delivery, event, "sms");
    }
    if (notificationPreferences.emailEnabled) {
      setTimeout(() => sendNotification(delivery, event, "email"), 500);
    }

    toast.success(`Statut change: ${delivery.trackingNumber} - ${event}`);
  };

  const filteredDeliveries = deliveries.filter((d) => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (searchQuery && !d.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Real-time GPS tracking simulation (WebSocket)
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    // Simulate WebSocket connection
    const wsInterval = setInterval(() => {
      setLastUpdate(new Date());
      setWsStatus("connected");

      // Simulate random GPS position updates for active deliveries
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) => {
          if (["in-transit", "delivering"].includes(delivery.status)) {
            // Simulate GPS movement (small random changes)
            const latChange = (Math.random() - 0.5) * 0.02;
            const lngChange = (Math.random() - 0.5) * 0.02;

            return {
              ...delivery,
              latitude: delivery.latitude + latChange,
              longitude: delivery.longitude + lngChange,
            };
          }
          return delivery;
        })
      );

      // Randomly detect delays or incidents (1% chance per update)
      if (Math.random() < 0.01) {
        const activeDeliveries = deliveries.filter((d) =>
          ["in-transit", "delivering"].includes(d.status)
        );
        if (activeDeliveries.length > 0) {
          const randomDelivery = activeDeliveries[Math.floor(Math.random() * activeDeliveries.length)];
          
          if (Math.random() < 0.5) {
            // Simulate delay
            toast.warning(`Retard detecte pour ${randomDelivery.trackingNumber}`, {
              description: "Le vehicule est ralenti par le trafic",
            });
          } else {
            // Simulate incident
            toast.error(`Incident signale pour ${randomDelivery.trackingNumber}`, {
              description: "Le chauffeur a signale un probleme",
            });
          }
        }
      }
    }, 5000); // Update every 5 seconds

    // Simulate occasional reconnection
    const reconnectInterval = setInterval(() => {
      setWsStatus("reconnecting");
      setTimeout(() => {
        setWsStatus("connected");
        toast.success("Connexion GPS retablie");
      }, 1000);
    }, 120000); // Simulate reconnect every 2 minutes

    return () => {
      clearInterval(wsInterval);
      clearInterval(reconnectInterval);
    };
  }, [isRealTimeEnabled, deliveries]);

  // Client View - Simple Tracking Widget
  if (isClientView) {
    const clientDelivery = deliveries[0];
    const trackingSteps = [
      { label: "Commande préparée", completed: true, icon: Package },
      { label: "Collectée", completed: true, icon: Check },
      { label: "En transit", completed: true, icon: Truck, current: clientDelivery.status === "in-transit" },
      { label: "En livraison", completed: clientDelivery.status === "delivering", icon: MapPin, current: clientDelivery.status === "delivering" },
      { label: "Livrée", completed: clientDelivery.status === "delivered", icon: Check },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suivi de Livraison</h1>
          <p className="text-muted-foreground mt-2">Suivez vos commandes en temps réel</p>
        </div>

        {/* Search Box */}
        <div className="bg-card border rounded-lg p-4">
          <label className="block text-sm font-medium mb-2">Rechercher un numéro de suivi</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: TRK-FR-2026-45872"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Rechercher
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map - 2/3 */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#2563eb]" />
                  Suivi en Direct
                </h2>
              </div>
              <div className="p-6 h-[600px] relative bg-gray-50 dark:bg-gray-900">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <button
                    onClick={() => setMapZoom((z) => Math.min(2, z + 0.2))}
                    className="p-2 bg-card border rounded-lg shadow-sm hover:bg-accent"
                    title="Zoom +"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setMapZoom((z) => Math.max(0.5, z - 0.2))}
                    className="p-2 bg-card border rounded-lg shadow-sm hover:bg-accent"
                    title="Zoom -"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setMapCenter({ x: 0, y: 0 });
                      setMapZoom(1);
                    }}
                    className="p-2 bg-card border rounded-lg shadow-sm hover:bg-accent"
                    title="Recentrer"
                  >
                    <Navigation className="h-4 w-4" />
                  </button>
                </div>

                {/* Simplified Map */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 600"
                  className="transition-transform duration-300"
                  style={{ transform: `scale(${mapZoom}) translate(${mapCenter.x}px, ${mapCenter.y}px)` }}
                >
                  {/* Map Grid Background */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="800" height="600" fill="url(#grid)" />

                  {/* Client's Route */}
                  <polyline
                    points="150,300 400,200 650,350"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                  />

                  {/* Origin Marker */}
                  <circle cx="150" cy="300" r="8" fill="#2563eb" />
                  <text x="150" y="330" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 text-xs font-medium">
                    Entrepôt
                  </text>

                  {/* Truck Position (Animated) */}
                  <g className="animate-pulse">
                    <circle cx="400" cy="200" r="20" fill="#10b981" opacity="0.3" />
                    <circle cx="400" cy="200" r="12" fill="#10b981" />
                    <Truck
                      x="388"
                      y="188"
                      width="24"
                      height="24"
                      className="fill-white"
                    />
                  </g>
                  <text x="400" y="240" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 text-xs font-medium">
                    Votre livraison
                  </text>

                  {/* Destination Marker */}
                  <circle cx="650" cy="350" r="8" fill="#dc2626" />
                  <text x="650" y="380" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 text-xs font-medium">
                    Destination
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Tracking Widget - 1/3 */}
          <div className="space-y-4">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Statut de votre livraison</h3>
              <div className="space-y-1 mb-4">
                <p className="text-sm text-muted-foreground">Numéro de suivi</p>
                <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                  {clientDelivery.trackingNumber}
                </code>
              </div>

              {/* Vertical Timeline */}
              <div className="space-y-4">
                {trackingSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isCompleted = step.completed || false;
                  const isCurrent = step.current || false;

                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            isCurrent
                              ? "bg-[#2563eb] text-white ring-4 ring-blue-100 dark:ring-blue-900/30"
                              : isCompleted
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <StepIcon className="h-5 w-5" />
                        </div>
                        {idx < trackingSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-8 ${
                              isCompleted ? "bg-green-500" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p
                          className={`font-medium ${
                            isCurrent
                              ? "text-[#2563eb]"
                              : isCompleted
                              ? ""
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ETA: {clientDelivery.eta}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <h3 className="font-semibold mb-3">Informations de livraison</h3>
              <div className="flex items-start gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Chauffeur</p>
                  <p className="text-muted-foreground">{clientDelivery.driverName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Adresse de livraison</p>
                  <p className="text-muted-foreground">{clientDelivery.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Heure estimée</p>
                  <p className="text-muted-foreground">{clientDelivery.eta}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suivi Logistique en Direct</h1>
          <p className="text-muted-foreground mt-2">
            <span className="font-medium text-[#2563eb]">{activeDeliveriesCount}</span> livraisons actives
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Real-time Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-card">
            <div className="flex items-center gap-1.5">
              <div
                className={`h-2 w-2 rounded-full ${
                  wsStatus === "connected"
                    ? "bg-green-500 animate-pulse"
                    : wsStatus === "reconnecting"
                    ? "bg-orange-500 animate-pulse"
                    : "bg-red-500"
                }`}
              />
              <span className="text-xs font-medium">
                {wsStatus === "connected" ? "En direct" : wsStatus === "reconnecting" ? "Reconnexion..." : "Hors ligne"}
              </span>
            </div>
            <button
              onClick={() => {
                setIsRealTimeEnabled(!isRealTimeEnabled);
                toast.success(isRealTimeEnabled ? "Suivi temps reel desactive" : "Suivi temps reel active");
              }}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                isRealTimeEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
              }`}
            >
              {isRealTimeEnabled ? "ON" : "OFF"}
            </button>
          </div>
          <div className="text-xs text-muted-foreground">
            Derniere MAJ: {lastUpdate.toLocaleTimeString("fr-FR")}
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
          <button
            onClick={() => setShowRouteOptimizer(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#27AE60] text-white rounded-lg hover:bg-[#229954] transition-colors"
          >
            <Route className="h-4 w-4" />
            Optimiser Itineraire
          </button>
          <button
            onClick={() => setShowNotificationSettings(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors relative"
          >
            <Bell className="h-4 w-4" />
            Notifications
            {notificationHistory.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#27AE60] text-white text-xs rounded-full flex items-center justify-center font-bold">
                {notificationHistory.length}
              </span>
            )}
          </button>
          <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background">
            <option>Aujourd'hui</option>
            <option>Cette semaine</option>
            <option>Ce mois</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par numéro de suivi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
          >
            Rechercher
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map - 2/3 */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#2563eb]" />
                Carte Interactive
              </h2>
              <div className="flex gap-2">
                {["all", "delayed", "incident"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterStatus(filter)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      statusFilter === filter
                        ? "bg-[#2563eb] text-white"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {filter === "all" ? "Tous" : filter === "delayed" ? "Retards" : "Incidents"}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 h-[600px] relative bg-gray-50 dark:bg-gray-900 overflow-hidden">
              {/* Map Controls */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <button
                  onClick={() => setMapZoom((z) => Math.min(2, z + 0.2))}
                  className="p-2 bg-card border rounded-lg shadow-sm hover:bg-accent"
                  title="Zoom +"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setMapZoom((z) => Math.max(0.5, z - 0.2))}
                  className="p-2 bg-card border rounded-lg shadow-sm hover:bg-accent"
                  title="Zoom -"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setMapCenter({ x: 0, y: 0 });
                    setMapZoom(1);
                    setSelectedDelivery(null);
                  }}
                  className="p-2 bg-card border rounded-lg shadow-sm hover:bg-accent"
                  title="Recentrer"
                >
                  <Navigation className="h-4 w-4" />
                </button>
              </div>

              {/* Legend */}
              <div className="absolute top-4 right-4 z-10 bg-card border rounded-lg shadow-sm p-3 text-xs">
                <div className="font-semibold mb-2">Légende</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span>En route</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                    <span>En retard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span>Incident</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                    <span>Inactif</span>
                  </div>
                </div>
              </div>

              {/* Simplified Map SVG */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1000 600"
                className="transition-transform duration-300"
                style={{ transform: `scale(${mapZoom}) translate(${mapCenter.x}px, ${mapCenter.y}px)` }}
              >
                {/* Map Grid Background */}
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <rect width="1000" height="600" fill="url(#grid)" />

                {/* Zone Agricole Nord */}
                <rect x="50" y="50" width="280" height="200" fill="#22c55e" opacity="0.08" rx="8" />
                <text x="190" y="80" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 text-sm font-semibold">
                  Zone Agricole Nord
                </text>
                <rect x="50" y="50" width="280" height="200" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="8,4" rx="8" />

                {/* Dépôt Centre */}
                <rect x="420" y="250" width="160" height="100" fill="#2563eb" opacity="0.12" rx="8" />
                <text x="500" y="285" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 text-sm font-semibold">
                  Dépôt Centre
                </text>
                <circle cx="500" cy="300" r="12" fill="#2563eb" />
                <circle cx="500" cy="300" r="6" fill="white" />
                <rect x="420" y="250" width="160" height="100" fill="none" stroke="#2563eb" strokeWidth="2" rx="8" />

                {/* Route Principale (reliant Zone Nord au Dépôt) */}
                <path
                  d="M 330 150 Q 400 200 420 270"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="4"
                  opacity="0.3"
                />
                <path
                  d="M 330 150 Q 400 200 420 270"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="10,5"
                />
                <text x="360" y="180" className="fill-gray-600 dark:fill-gray-400 text-xs italic">
                  Route Principale
                </text>

                {/* Positions des 5 camions */}
                {filteredDeliveries.map((delivery, idx) => {
                  // Positionnement personnalisé pour chaque camion
                  let truckX, truckY, destX, destY;
                  
                  // Camion 1 (Vert - en route) - Lyon
                  if (idx === 0) {
                    truckX = 650;
                    truckY = 200;
                    destX = 750;
                    destY = 150;
                  }
                  // Camion 2 (Orange - retard) - Marseille
                  else if (idx === 1) {
                    truckX = 480;
                    truckY = 320;
                    destX = 800;
                    destY = 450;
                  }
                  // Camion 3 (Vert - en livraison) - Bordeaux
                  else if (idx === 2) {
                    truckX = 200;
                    truckY = 400;
                    destX = 120;
                    destY = 480;
                  }
                  // Camion 4 (Vert - en route) - Tours
                  else if (idx === 3) {
                    truckX = 350;
                    truckY = 150;
                    destX = 280;
                    destY = 80;
                  }
                  // Camion 5 (Rouge - incident isolé) - Lille
                  else if (idx === 4) {
                    truckX = 850;
                    truckY = 80;
                    destX = 920;
                    destY = 50;
                  }
                  // Camion 6 (Gris - collecté) - Rennes
                  else {
                    truckX = 150;
                    truckY = 150;
                    destX = 80;
                    destY = 200;
                  }

                  const isSelected = selectedDelivery?.id === delivery.id;
                  const isHovered = hoveredDelivery === delivery.id;

                  return (
                    <g key={delivery.id} opacity={selectedDelivery && !isSelected ? 0.3 : 1}>
                      {/* Ligne pointillée bleue du dépôt vers camions verts 1 et 4 */}
                      {(idx === 0 || idx === 3) && (
                        <path
                          d={`M 500 300 L ${truckX} ${truckY}`}
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          opacity="0.5"
                        />
                      )}

                      {/* Route vers destination */}
                      <path
                        d={`M ${truckX} ${truckY} L ${destX} ${destY}`}
                        fill="none"
                        stroke={isSelected ? "#2563eb" : "#d1d5db"}
                        strokeWidth={isSelected ? 3 : 2}
                        strokeDasharray="5,5"
                      />

                      {/* Truck Position */}
                      <g
                        transform={`translate(${truckX}, ${truckY})`}
                        onMouseEnter={() => setHoveredDelivery(delivery.id)}
                        onMouseLeave={() => setHoveredDelivery(null)}
                        onClick={() => {
                          setSelectedDelivery(delivery);
                          setShowDetailPanel(true);
                        }}
                        className="cursor-pointer"
                      >
                        {/* Pulsing Circle for Active Deliveries */}
                        {["in-transit", "delivering"].includes(delivery.status) && (
                          <circle r="20" fill={getTruckColor(delivery.status)} opacity="0.3">
                            <animate
                              attributeName="r"
                              from="15"
                              to="25"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              from="0.5"
                              to="0"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}

                        {/* Truck Circle */}
                        <circle
                          r={isHovered || isSelected ? 16 : 14}
                          fill={getTruckColor(delivery.status)}
                          filter={isHovered || isSelected ? "url(#glow)" : undefined}
                        />

                        {/* Truck Icon Simulation */}
                        <rect x="-6" y="-4" width="12" height="8" fill="white" rx="1" />
                      </g>

                      {/* Destination Point */}
                      <circle cx={destX} cy={destY} r="8" fill="#dc2626" />
                      <text
                        x={destX}
                        y={destY + 25}
                        textAnchor="middle"
                        className="fill-gray-700 dark:fill-gray-300 text-xs font-medium"
                      >
                        {delivery.recipientCity}
                      </text>

                      {/* Hover Popup */}
                      {(isHovered || isSelected) && (
                        <g transform={`translate(${truckX + 25}, ${truckY - 50})`}>
                          <rect
                            x="0"
                            y="0"
                            width="200"
                            height="90"
                            fill="white"
                            stroke="#e5e7eb"
                            strokeWidth="1"
                            rx="8"
                            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                          />
                          <text x="10" y="20" className="fill-gray-900 text-xs font-semibold">
                            {delivery.trackingNumber}
                          </text>
                          <text x="10" y="38" className="fill-gray-600 text-xs">
                            {delivery.recipientName}
                          </text>
                          <text x="10" y="56" className="fill-gray-600 text-xs">
                            ETA: {delivery.eta}
                          </text>
                          <text
                            x="10"
                            y="74"
                            className="fill-blue-600 text-xs font-medium cursor-pointer"
                          >
                            → Voir les détails
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Panel with Tabs - 1/3 */}
        {!showDetailPanel ? (
          <div className="bg-card border rounded-lg overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("deliveries")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "deliveries"
                    ? "border-b-2 border-[#2563eb] text-[#2563eb]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Livraisons
              </button>
              <button
                onClick={() => setActiveTab("incidents")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === "incidents"
                    ? "border-b-2 border-[#2563eb] text-[#2563eb]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Incidents
                {unresolvedIncidents > 0 && (
                  <span className="absolute top-2 right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unresolvedIncidents}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "performance"
                    ? "border-b-2 border-[#2563eb] text-[#2563eb]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Performances
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 overflow-y-auto max-h-[600px]">
              {activeTab === "deliveries" && (
                <div className="space-y-3">
                  {filteredDeliveries.map((delivery) => {
                    const statusBadge = getStatusBadge(delivery.status);
                    return (
                      <div
                        key={delivery.id}
                        className="border rounded-lg p-3 hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => handleZoomToDelivery(delivery)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-[#2563eb]">
                              {delivery.trackingNumber}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {delivery.recipientName} • {delivery.recipientCity}
                            </p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.class}`}>
                            {statusBadge.label}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {delivery.driverName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            {delivery.vehiclePlate}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            ETA: {delivery.eta}
                            {delivery.isOnTime ? (
                              <span className="text-green-600 ml-1">✓ Dans les temps</span>
                            ) : (
                              <span className="text-orange-600 ml-1">⚠ Retard</span>
                            )}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCallDriver(delivery.driverPhone, delivery.driverName);
                            }}
                            className="flex-1 px-2 py-1.5 text-xs border rounded hover:bg-accent transition-colors flex items-center justify-center gap-1"
                          >
                            <Phone className="h-3 w-3" />
                            Appeler
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMessageDriver(delivery.driverName);
                            }}
                            className="flex-1 px-2 py-1.5 text-xs border rounded hover:bg-accent transition-colors flex items-center justify-center gap-1"
                          >
                            <MessageSquare className="h-3 w-3" />
                            Message
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsDelivered(delivery.id);
                            }}
                            className="flex-1 px-2 py-1.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center gap-1"
                          >
                            <Check className="h-3 w-3" />
                            Livré
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "incidents" && (
                <div className="space-y-3">
                  {incidents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucun incident signalé</p>
                    </div>
                  ) : (
                    incidents.map((incident) => {
                      const delivery = deliveries.find((d) => d.id === incident.deliveryId);
                      return (
                        <div
                          key={incident.id}
                          className={`border rounded-lg p-3 ${
                            incident.resolved ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle
                                  className={`h-4 w-4 ${
                                    incident.type === "accident" || incident.type === "vehicle-issue"
                                      ? "text-red-500"
                                      : "text-orange-500"
                                  }`}
                                />
                                <span className="font-medium text-sm">
                                  {delivery?.trackingNumber}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">
                                {incident.description}
                              </p>
                              <p className="text-xs text-muted-foreground">{incident.timestamp}</p>
                            </div>
                            {incident.resolved ? (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Résolu
                              </span>
                            ) : (
                              <button
                                onClick={() => handleResolveIncident(incident.id)}
                                className="px-3 py-1 text-xs bg-[#2563eb] text-white rounded hover:bg-[#1d4ed8] transition-colors"
                              >
                                Résoudre
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === "performance" && (
                <div className="space-y-6">
                  {/* KPIs */}
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Taux de livraison dans les temps</span>
                      </div>
                      <p className="text-2xl font-bold">91.5%</p>
                      <p className="text-xs text-muted-foreground">Cette semaine</p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Km parcourus aujourd'hui</span>
                      </div>
                      <p className="text-2xl font-bold">1,847 km</p>
                      <p className="text-xs text-muted-foreground">Par 5 véhicules</p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Fuel className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Carburant moyen</span>
                      </div>
                      <p className="text-2xl font-bold">8.2 L/100km</p>
                      <p className="text-xs text-muted-foreground">Moyenne flotte</p>
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="border rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-3">Taux de ponctualité (7 jours)</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[80, 100]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="onTime"
                          stroke="#2563eb"
                          strokeWidth={2}
                          dot={{ fill: "#2563eb", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Detail Panel */
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Détails de la livraison</h2>
              <button
                onClick={() => {
                  setShowDetailPanel(false);
                  setSelectedDelivery(null);
                }}
                className="p-1.5 hover:bg-muted rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {selectedDelivery && (
              <div className="p-4 overflow-y-auto max-h-[600px] space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Numéro de suivi</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                    {selectedDelivery.trackingNumber}
                  </code>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Statut</p>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusBadge(selectedDelivery.status).class
                    }`}
                  >
                    {getStatusBadge(selectedDelivery.status).label}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations chauffeur
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nom: </span>
                      <span className="font-medium">{selectedDelivery.driverName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Véhicule: </span>
                      <span className="font-medium">{selectedDelivery.vehiclePlate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Téléphone: </span>
                      <span className="font-medium">{selectedDelivery.driverPhone}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() =>
                        handleCallDriver(selectedDelivery.driverPhone, selectedDelivery.driverName)
                      }
                      className="flex-1 px-3 py-2 border rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Appeler
                    </button>
                    <button
                      onClick={() => handleMessageDriver(selectedDelivery.driverName)}
                      className="flex-1 px-3 py-2 border rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Destinataire
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nom: </span>
                      <span className="font-medium">{selectedDelivery.recipientName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Adresse: </span>
                      <span className="font-medium">{selectedDelivery.address}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Téléphone: </span>
                      <span className="font-medium">{selectedDelivery.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Planning
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">ETA: </span>
                      <span className="font-medium">{selectedDelivery.eta}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Statut: </span>
                      {selectedDelivery.isOnTime ? (
                        <span className="text-green-600 font-medium">✓ Dans les temps</span>
                      ) : (
                        <span className="text-orange-600 font-medium">⚠ En retard</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Historique GPS</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">Position actuelle</p>
                        <p className="text-muted-foreground">
                          {selectedDelivery.latitude.toFixed(4)}, {selectedDelivery.longitude.toFixed(4)}
                        </p>
                        <p className="text-muted-foreground">Aujourd'hui à 14:30</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium">Point de passage</p>
                        <p className="text-muted-foreground">Aujourd'hui à 12:15</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                      <div>
                        <p className="font-medium">Départ entrepôt</p>
                        <p className="text-muted-foreground">Aujourd'hui à 09:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowIncidentModal(true)}
                    className="w-full px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Signaler un incident
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Incident Report Modal */}
      {showIncidentModal && selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Signaler un incident</h2>
              <button
                onClick={() => setShowIncidentModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Livraison concernée</p>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {selectedDelivery.trackingNumber}
                </code>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type d'incident</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as Incident["type"])}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                >
                  <option value="delay">Retard</option>
                  <option value="accident">Accident</option>
                  <option value="damage">Produit endommagé</option>
                  <option value="vehicle-issue">Problème véhicule</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={incidentNote}
                  onChange={(e) => setIncidentNote(e.target.value)}
                  placeholder="Décrivez l'incident..."
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowIncidentModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitIncident}
                disabled={!incidentNote.trim()}
                className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Signaler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Route Optimizer Modal */}
      {showRouteOptimizer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-4xl my-8">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Route className="h-5 w-5 text-[#27AE60]" />
                Optimisation d Itineraire
              </h2>
              <button
                onClick={() => {
                  setShowRouteOptimizer(false);
                  resetOptimization();
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Step 1: Select Deliveries */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#27AE60]" />
                  Etape 1: Selectionnez les livraisons a optimiser
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {deliveries
                    .filter((d) => ["collected", "in-transit", "delivering"].includes(d.status))
                    .map((delivery) => (
                      <label
                        key={delivery.id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedDeliveries.includes(delivery.id)
                            ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDeliveries.includes(delivery.id)}
                          onChange={() => toggleDeliverySelection(delivery.id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#27AE60] focus:ring-[#27AE60]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{delivery.recipientCity}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {delivery.trackingNumber} • {delivery.recipientName}
                          </div>
                        </div>
                        <div className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(delivery.status).class}`}>
                          {getStatusBadge(delivery.status).label}
                        </div>
                      </label>
                    ))}
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {selectedDeliveries.length} livraisons selectionnees
                </div>
              </div>

              {/* Step 2: Calculate */}
              <div className="flex gap-3">
                <button
                  onClick={calculateOptimizedRoute}
                  disabled={selectedDeliveries.length < 2}
                  className="flex-1 py-2 bg-[#27AE60] text-white rounded-lg hover:bg-[#229954] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Navigation2 className="h-4 w-4" />
                  Calculer itineraire optimal
                </button>
                {optimizationResult && (
                  <button
                    onClick={resetOptimization}
                    className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                  >
                    Reinitialiser
                  </button>
                )}
              </div>

              {/* Results */}
              {optimizationResult && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4 text-[#27AE60]" />
                      Resultats de l optimisation
                    </h3>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Distance totale</div>
                      <div className="text-lg font-bold">{optimizationResult.totalDistance} km</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Carburant</div>
                      <div className="text-lg font-bold">{optimizationResult.estimatedFuel} L</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Cout</div>
                      <div className="text-lg font-bold">{optimizationResult.fuelCost} EUR</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">CO2</div>
                      <div className="text-lg font-bold">{optimizationResult.co2Emissions} kg</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Duree</div>
                      <div className="text-lg font-bold">{optimizationResult.estimatedTime} h</div>
                    </div>
                  </div>

                  {/* Optimized Route */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Itineraire optimise (algorithme Greedy TSP)</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          D
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Depot Paris</div>
                          <div className="text-xs text-muted-foreground">Point de depart</div>
                        </div>
                      </div>
                      {optimizationResult.optimizedRoute.map((stop, idx) => (
                        <div key={stop.deliveryId}>
                          <div className="flex items-center gap-2 ml-4">
                            <Navigation className="h-4 w-4 text-muted-foreground" />
                            <div className="text-xs text-muted-foreground">{stop.distance} km</div>
                          </div>
                          <div className="flex items-center gap-3 text-sm mt-1">
                            <div className="w-8 h-8 bg-[#27AE60] text-white rounded-full flex items-center justify-center font-bold">
                              {stop.order}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{stop.city}</div>
                              <div className="text-xs text-muted-foreground">{stop.deliveryId}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 ml-4">
                        <Navigation className="h-4 w-4 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground">Retour depot</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 py-2 bg-[#27AE60] text-white rounded-lg hover:bg-[#229954] transition-colors flex items-center justify-center gap-2">
                      <FileText className="h-4 w-4" />
                      Exporter PDF
                    </button>
                    <button className="flex-1 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2">
                      <Navigation className="h-4 w-4" />
                      Envoyer au GPS
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => {
                  setShowRouteOptimizer(false);
                  resetOptimization();
                }}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      {showNotificationSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-5xl my-8">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#27AE60]" />
                Configuration des Notifications Automatiques
              </h2>
              <button
                onClick={() => setShowNotificationSettings(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Configuration */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-[#27AE60]" />
                      Parametres Generaux
                    </h3>
                    <div className="space-y-3 bg-muted/50 rounded-lg p-4">
                      <label className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Notifications SMS</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationPreferences.smsEnabled}
                          onChange={() =>
                            setNotificationPreferences((prev: any) => ({ ...prev, smsEnabled: !prev.smsEnabled }))
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[#27AE60] focus:ring-[#27AE60]"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Notifications Email</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationPreferences.emailEnabled}
                          onChange={() =>
                            setNotificationPreferences((prev: any) => ({ ...prev, emailEnabled: !prev.emailEnabled }))
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[#27AE60] focus:ring-[#27AE60]"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Evenements de Livraison</h3>
                    <div className="space-y-2">
                      {Object.entries(notificationPreferences.events).map(([key, value]: [string, any]) => (
                        <div key={key} className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value.enabled}
                                onChange={() => toggleNotificationEvent(key, "enabled")}
                                className="h-4 w-4 rounded border-gray-300 text-[#27AE60] focus:ring-[#27AE60]"
                              />
                              <span className="font-medium capitalize">
                                {key === "inTransit" ? "En Transit" : key.charAt(0).toUpperCase() + key.slice(1)}
                              </span>
                            </label>
                          </div>
                          {value.enabled && (
                            <div className="flex gap-4 ml-6 text-sm">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value.sms}
                                  onChange={() => toggleNotificationEvent(key, "sms")}
                                  className="h-3 w-3 rounded border-gray-300 text-[#27AE60] focus:ring-[#27AE60]"
                                />
                                <Phone className="h-3 w-3" />
                                SMS
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value.email}
                                  onChange={() => toggleNotificationEvent(key, "email")}
                                  className="h-3 w-3 rounded border-gray-300 text-[#27AE60] focus:ring-[#27AE60]"
                                />
                                <Mail className="h-3 w-3" />
                                Email
                              </label>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test Notifications */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-sm">Tester les notifications</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Simulez un changement de statut pour voir les notifications en action
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {deliveries.slice(0, 2).map((delivery) => (
                        <select
                          key={delivery.id}
                          onChange={(e) => simulateDeliveryStatusChange(delivery.id, e.target.value as Delivery["status"])}
                          value={delivery.status}
                          className="text-xs px-2 py-1 border rounded bg-background"
                        >
                          <option value="collected">Collectee - {delivery.recipientCity}</option>
                          <option value="in-transit">En Transit</option>
                          <option value="delivering">En Livraison</option>
                          <option value="delivered">Livree</option>
                          <option value="delayed">Retard</option>
                          <option value="incident">Incident</option>
                        </select>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Notification History */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#27AE60]" />
                    Historique des Notifications ({notificationHistory.length})
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                    {notificationHistory.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Aucune notification envoyee</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notificationHistory.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 rounded-lg border ${
                              notif.status === "sent"
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                : notif.status === "failed"
                                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5">
                                {notif.type === "sms" ? (
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="text-xs font-medium uppercase">{notif.type}</span>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      notif.status === "sent"
                                        ? "bg-green-100 text-green-700"
                                        : notif.status === "failed"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-orange-100 text-orange-700"
                                    }`}
                                  >
                                    {notif.status === "sent" ? "Envoye" : notif.status === "failed" ? "Echec" : "En cours"}
                                  </span>
                                </div>
                                <p className="text-sm font-medium">{notif.event}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {notif.deliveryId} → {notif.recipient}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(notif.timestamp).toLocaleString("fr-FR")}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-between">
              <button
                onClick={() => setNotificationHistory([])}
                disabled={notificationHistory.length === 0}
                className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Effacer historique
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNotificationSettings(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={saveNotificationPreferences}
                  className="px-4 py-2 bg-[#27AE60] text-white rounded-lg hover:bg-[#229954] transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
