import { useState, useMemo } from "react";
import {
  ShoppingCart,
  DollarSign,
  Package,
  Truck,
  Search,
  Download,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  FileText,
  Mail,
  AlertCircle,
  Plus,
  Check,
  Clock,
  MapPin,
  User,
  CreditCard,
  Copy,
  LayoutGrid,
  List,
} from "lucide-react";
import { toast } from "sonner";

// Types
interface Order {
  id: string;
  date: string;
  customerName: string;
  customerAvatar?: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed";
  paymentMethod: string;
  trackingNumber?: string;
  deliveryMode: "standard" | "express" | "pickup";
  items: OrderItem[];
  shippingAddress: string;
  billingAddress: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

// Mock data - 15 commandes
const mockOrders: Order[] = [
  {
    id: "CMD-2026-001",
    date: "2026-01-10 14:32",
    customerName: "Sophie Leroy",
    customerAvatar: "SL",
    totalAmount: 45.80,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "Carte bancaire",
    deliveryMode: "standard",
    items: [
      { name: "Tomates Bio", quantity: 3, unitPrice: 3.50 },
      { name: "Laitue Frisée", quantity: 2, unitPrice: 2.00 },
    ],
    shippingAddress: "25 rue de la République, 69001 Lyon",
    billingAddress: "25 rue de la République, 69001 Lyon",
    customerEmail: "sophie.leroy@email.fr",
    customerPhone: "+33 6 12 34 56 78",
  },
  {
    id: "CMD-2026-002",
    date: "2026-01-10 11:15",
    customerName: "Marc Dubois",
    customerAvatar: "MD",
    totalAmount: 127.50,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    deliveryMode: "express",
    trackingNumber: "TRK-FR-2026-45872",
    items: [
      { name: "Pommes Golden", quantity: 5, unitPrice: 2.80 },
      { name: "Fromage de Chèvre", quantity: 3, unitPrice: 8.50 },
      { name: "Miel d'Acacia", quantity: 2, unitPrice: 12.00 },
    ],
    shippingAddress: "Ferme du Chêne Vert, 33000 Bordeaux",
    billingAddress: "Ferme du Chêne Vert, 33000 Bordeaux",
    customerEmail: "marc.dubois@fermier.fr",
    customerPhone: "+33 6 23 45 67 89",
  },
  {
    id: "CMD-2026-003",
    date: "2026-01-10 09:45",
    customerName: "Camille Bernard",
    customerAvatar: "CB",
    totalAmount: 68.20,
    status: "preparing",
    paymentStatus: "paid",
    paymentMethod: "Carte bancaire",
    deliveryMode: "standard",
    items: [
      { name: "Courgettes", quantity: 4, unitPrice: 2.20 },
      { name: "Œufs Plein Air", quantity: 12, unitPrice: 0.50 },
      { name: "Yaourt Nature Bio", quantity: 6, unitPrice: 1.50 },
    ],
    shippingAddress: "14 avenue des Lilas, 75016 Paris",
    billingAddress: "14 avenue des Lilas, 75016 Paris",
    customerEmail: "camille.bernard@client.com",
    customerPhone: "+33 6 34 56 78 90",
  },
  {
    id: "CMD-2026-004",
    date: "2026-01-09 16:22",
    customerName: "Thomas Martin",
    customerAvatar: "TM",
    totalAmount: 89.90,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Virement",
    deliveryMode: "express",
    trackingNumber: "TRK-FR-2026-45801",
    items: [
      { name: "Fraises du Périgord", quantity: 3, unitPrice: 6.00 },
      { name: "Raisins Blancs", quantity: 2, unitPrice: 4.50 },
      { name: "Huile d'Olive", quantity: 1, unitPrice: 15.00 },
    ],
    shippingAddress: "Zone industrielle Nord, 59000 Lille",
    billingAddress: "Zone industrielle Nord, 59000 Lille",
    customerEmail: "thomas.martin@logistique.fr",
    customerPhone: "+33 6 45 67 89 01",
  },
  {
    id: "CMD-2026-005",
    date: "2026-01-09 14:10",
    customerName: "Émilie Rousseau",
    customerAvatar: "ER",
    totalAmount: 156.70,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Carte bancaire",
    deliveryMode: "standard",
    trackingNumber: "TRK-FR-2026-45789",
    items: [
      { name: "Carottes Bio", quantity: 10, unitPrice: 1.80 },
      { name: "Tomates Bio", quantity: 8, unitPrice: 3.50 },
      { name: "Fromage de Chèvre", quantity: 5, unitPrice: 8.50 },
    ],
    shippingAddress: "La Ferme des Collines, 31000 Toulouse",
    billingAddress: "La Ferme des Collines, 31000 Toulouse",
    customerEmail: "emilie.rousseau@fermier.fr",
    customerPhone: "+33 6 56 78 90 12",
  },
  {
    id: "CMD-2026-006",
    date: "2026-01-09 10:33",
    customerName: "Lucas Petit",
    customerAvatar: "LP",
    totalAmount: 32.50,
    status: "cancelled",
    paymentStatus: "failed",
    paymentMethod: "Carte bancaire",
    deliveryMode: "standard",
    items: [
      { name: "Laitue Frisée", quantity: 3, unitPrice: 2.00 },
      { name: "Courgettes", quantity: 5, unitPrice: 2.20 },
    ],
    shippingAddress: "8 rue du Commerce, 13001 Marseille",
    billingAddress: "8 rue du Commerce, 13001 Marseille",
    customerEmail: "lucas.petit@client.com",
    customerPhone: "+33 6 67 89 01 23",
    notes: "Paiement refusé par la banque",
  },
  {
    id: "CMD-2026-007",
    date: "2026-01-08 18:45",
    customerName: "Julie Moreau",
    customerAvatar: "JM",
    totalAmount: 95.30,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    deliveryMode: "express",
    trackingNumber: "TRK-FR-2026-45756",
    items: [
      { name: "Pommes Golden", quantity: 6, unitPrice: 2.80 },
      { name: "Miel d'Acacia", quantity: 3, unitPrice: 12.00 },
    ],
    shippingAddress: "12 boulevard Haussmann, 75009 Paris",
    billingAddress: "12 boulevard Haussmann, 75009 Paris",
    customerEmail: "julie.moreau@AgroLogistic.fr",
    customerPhone: "+33 6 78 90 12 34",
  },
  {
    id: "CMD-2026-008",
    date: "2026-01-08 15:20",
    customerName: "Antoine Laurent",
    customerAvatar: "AL",
    totalAmount: 78.40,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Carte bancaire",
    deliveryMode: "standard",
    trackingNumber: "TRK-FR-2026-45723",
    items: [
      { name: "Œufs Plein Air", quantity: 24, unitPrice: 0.50 },
      { name: "Yaourt Nature Bio", quantity: 10, unitPrice: 1.50 },
    ],
    shippingAddress: "Domaine Saint-Antoine, 44000 Nantes",
    billingAddress: "Domaine Saint-Antoine, 44000 Nantes",
    customerEmail: "antoine.laurent@fermier.fr",
    customerPhone: "+33 6 89 01 23 45",
  },
  {
    id: "CMD-2026-009",
    date: "2026-01-07 12:05",
    customerName: "Chloé Bonnet",
    customerAvatar: "CB2",
    totalAmount: 142.80,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Virement",
    deliveryMode: "express",
    trackingNumber: "TRK-FR-2026-45690",
    items: [
      { name: "Tomates Bio", quantity: 10, unitPrice: 3.50 },
      { name: "Fraises du Périgord", quantity: 5, unitPrice: 6.00 },
      { name: "Huile d'Olive", quantity: 2, unitPrice: 15.00 },
    ],
    shippingAddress: "45 rue Voltaire, 67000 Strasbourg",
    billingAddress: "45 rue Voltaire, 67000 Strasbourg",
    customerEmail: "chloe.bonnet@client.com",
    customerPhone: "+33 6 90 12 34 56",
  },
  {
    id: "CMD-2026-010",
    date: "2026-01-06 16:40",
    customerName: "Pierre Garnier",
    customerAvatar: "PG",
    totalAmount: 54.60,
    status: "preparing",
    paymentStatus: "paid",
    paymentMethod: "Carte bancaire",
    deliveryMode: "pickup",
    items: [
      { name: "Courgettes", quantity: 8, unitPrice: 2.20 },
      { name: "Laitue Frisée", quantity: 6, unitPrice: 2.00 },
    ],
    shippingAddress: "Parc logistique Sud, 34000 Montpellier",
    billingAddress: "Parc logistique Sud, 34000 Montpellier",
    customerEmail: "pierre.garnier@logistique.fr",
    customerPhone: "+33 6 01 23 45 67",
  },
  {
    id: "CMD-2026-011",
    date: "2026-01-05 09:15",
    customerName: "Marie Dubois",
    customerAvatar: "MD2",
    totalAmount: 103.20,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    deliveryMode: "standard",
    trackingNumber: "TRK-FR-2026-45623",
    items: [
      { name: "Fromage de Chèvre", quantity: 6, unitPrice: 8.50 },
      { name: "Miel d'Acacia", quantity: 2, unitPrice: 12.00 },
    ],
    shippingAddress: "18 rue des Oliviers, 06000 Nice",
    billingAddress: "18 rue des Oliviers, 06000 Nice",
    customerEmail: "marie.dubois@email.fr",
    customerPhone: "+33 6 11 22 33 44",
  },
  {
    id: "CMD-2026-012",
    date: "2026-01-04 14:50",
    customerName: "Nicolas Bernard",
    customerAvatar: "NB",
    totalAmount: 67.90,
    status: "preparing",
    paymentStatus: "paid",
    paymentMethod: "Carte bancaire",
    deliveryMode: "express",
    items: [
      { name: "Pommes Golden", quantity: 8, unitPrice: 2.80 },
      { name: "Raisins Blancs", quantity: 6, unitPrice: 4.50 },
    ],
    shippingAddress: "33 avenue de la Liberté, 69003 Lyon",
    billingAddress: "33 avenue de la Liberté, 69003 Lyon",
    customerEmail: "nicolas.bernard@client.com",
    customerPhone: "+33 6 55 66 77 88",
  },
  {
    id: "CMD-2026-013",
    date: "2026-01-03 11:22",
    customerName: "Isabelle Martin",
    customerAvatar: "IM",
    totalAmount: 38.70,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "Virement",
    deliveryMode: "standard",
    items: [
      { name: "Yaourt Nature Bio", quantity: 12, unitPrice: 1.50 },
      { name: "Œufs Plein Air", quantity: 18, unitPrice: 0.50 },
    ],
    shippingAddress: "7 place de la Mairie, 35000 Rennes",
    billingAddress: "7 place de la Mairie, 35000 Rennes",
    customerEmail: "isabelle.martin@email.fr",
    customerPhone: "+33 6 99 88 77 66",
  },
  {
    id: "CMD-2026-014",
    date: "2026-01-02 16:08",
    customerName: "François Leroy",
    customerAvatar: "FL",
    totalAmount: 118.50,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Carte bancaire",
    deliveryMode: "express",
    trackingNumber: "TRK-FR-2026-45567",
    items: [
      { name: "Tomates Bio", quantity: 12, unitPrice: 3.50 },
      { name: "Fromage de Chèvre", quantity: 4, unitPrice: 8.50 },
      { name: "Huile d'Olive", quantity: 1, unitPrice: 15.00 },
    ],
    shippingAddress: "55 cours Mirabeau, 13100 Aix-en-Provence",
    billingAddress: "55 cours Mirabeau, 13100 Aix-en-Provence",
    customerEmail: "francois.leroy@client.com",
    customerPhone: "+33 6 44 55 66 77",
  },
  {
    id: "CMD-2025-015",
    date: "2025-12-28 10:30",
    customerName: "Sandrine Petit",
    customerAvatar: "SP",
    totalAmount: 25.40,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "Carte bancaire",
    deliveryMode: "pickup",
    items: [
      { name: "Laitue Frisée", quantity: 4, unitPrice: 2.00 },
      { name: "Courgettes", quantity: 3, unitPrice: 2.20 },
    ],
    shippingAddress: "Point de retrait AgroLogistic, 31000 Toulouse",
    billingAddress: "22 rue Jean Jaurès, 31000 Toulouse",
    customerEmail: "sandrine.petit@email.fr",
    customerPhone: "+33 6 33 22 11 00",
  },
];

export function OrdersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [bulkAction, setBulkAction] = useState("");

  // Calcul des KPIs
  const today = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter((o) => o.date.startsWith(today)).length;
  const pendingValue = orders
    .filter((o) => o.status === "pending" || o.status === "confirmed")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const shippingCount = orders.filter((o) => o.status === "shipped").length;

  // Filtrage
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Recherche
    if (searchQuery) {
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Filtre période
    if (periodFilter !== "all") {
      const now = new Date();
      if (periodFilter === "today") {
        filtered = filtered.filter((o) => o.date.startsWith(today));
      } else if (periodFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((o) => new Date(o.date) >= weekAgo);
      } else if (periodFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((o) => new Date(o.date) >= monthAgo);
      }
    }

    // Filtre mode de livraison
    if (deliveryFilter !== "all") {
      filtered = filtered.filter((o) => o.deliveryMode === deliveryFilter);
    }

    return filtered;
  }, [orders, searchQuery, statusFilter, periodFilter, deliveryFilter, today]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const getStatusBadge = (status: Order["status"]) => {
    const badges = {
      pending: { label: "En attente", class: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400", icon: Clock },
      confirmed: { label: "Confirmée", class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Check },
      preparing: { label: "En préparation", class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Package },
      shipped: { label: "Expédiée", class: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: Truck },
      delivered: { label: "Livrée", class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: Check },
      cancelled: { label: "Annulée", class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: X },
    };
    return badges[status];
  };

  const getPaymentBadge = (status: Order["paymentStatus"]) => {
    const badges = {
      paid: { label: "Payé", class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
      pending: { label: "En attente", class: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
      failed: { label: "Échoué", class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    };
    return badges[status];
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(new Set(paginatedOrders.map((o) => o.id)));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    const newSelected = new Set(selectedOrders);
    if (checked) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleBulkAction = (action: string) => {
    setBulkAction(action);
    setShowBulkModal(true);
  };

  const confirmBulkAction = () => {
    if (bulkAction === "Marquer comme expédiées") {
      const updatedOrders = orders.map((order) => {
        if (selectedOrders.has(order.id)) {
          return { ...order, status: "shipped" as const };
        }
        return order;
      });
      setOrders(updatedOrders);
      toast.success(`${selectedOrders.size} commande(s) marquée(s) comme expédiée(s)`);
    } else if (bulkAction === "Générer des étiquettes") {
      toast.success(`${selectedOrders.size} étiquette(s) d'expédition générée(s)`);
    } else if (bulkAction === "Exporter la sélection") {
      toast.success(`${selectedOrders.size} commande(s) exportée(s)`);
    }

    setShowBulkModal(false);
    setSelectedOrders(new Set());
  };

  const handleChangeStatus = (orderId: string, newStatus: Order["status"]) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updatedOrders);
    toast.success(`Statut de la commande ${orderId} mis à jour`);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailPanel(true);
  };

  const handleCopyTracking = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber);
    toast.success("Numéro de suivi copié");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPeriodFilter("all");
    setDeliveryFilter("all");
    toast.success("Filtres réinitialisés");
  };

  const allSelected = paginatedOrders.length > 0 && selectedOrders.size === paginatedOrders.length;
  const someSelected = selectedOrders.size > 0 && selectedOrders.size < paginatedOrders.length;

  // Kanban columns
  const kanbanColumns = {
    pending: orders.filter((o) => o.status === "pending"),
    preparing: orders.filter((o) => o.status === "preparing"),
    shipped: orders.filter((o) => o.status === "shipped"),
    delivered: orders.filter((o) => o.status === "delivered"),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Commandes</h1>
          <p className="text-muted-foreground mt-2">
            <span className="font-medium text-[#2563eb]">{preparingCount + shippingCount}</span> commandes à traiter aujourd'hui
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="font-medium">Créer une commande manuelle</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Commandes du jour</p>
              <p className="text-3xl font-bold">{todayOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valeur en attente</p>
              <p className="text-3xl font-bold">{pendingValue.toFixed(0)}€</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Package className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En préparation</p>
              <p className="text-3xl font-bold">{preparingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Truck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En livraison</p>
              <p className="text-3xl font-bold">{shippingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar - Sticky */}
      <div className="sticky top-0 z-10 bg-card border rounded-lg p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {/* Search */}
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher par ID ou client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 flex items-center gap-2 transition-colors ${
                    viewMode === "table" ? "bg-[#2563eb] text-white" : "hover:bg-accent"
                  }`}
                  title="Vue Tableau"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-3 py-2 flex items-center gap-2 transition-colors border-l ${
                    viewMode === "kanban" ? "bg-[#2563eb] text-white" : "hover:bg-accent"
                  }`}
                  title="Vue Kanban"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="preparing">En préparation</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>

            {/* Period Filter */}
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
            >
              <option value="all">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">7 derniers jours</option>
              <option value="month">Ce mois</option>
            </select>

            {/* Delivery Mode Filter */}
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
            >
              <option value="all">Tous les modes</option>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="pickup">Retrait</option>
            </select>

            {/* Export */}
            <button
              onClick={() => toast.success("Export Excel lancé")}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </button>

            {/* Bulk Actions */}
            {selectedOrders.size > 0 && (
              <div className="relative group">
                <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors">
                  Actions groupées ({selectedOrders.size})
                </button>
                <div className="absolute left-0 top-full mt-1 w-56 bg-card border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  <button
                    onClick={() => handleBulkAction("Marquer comme expédiées")}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted rounded-t-lg"
                  >
                    Marquer comme expédiées
                  </button>
                  <button
                    onClick={() => handleBulkAction("Générer des étiquettes")}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted"
                  >
                    Générer des étiquettes
                  </button>
                  <button
                    onClick={() => handleBulkAction("Exporter la sélection")}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted rounded-b-lg"
                  >
                    Exporter la sélection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" ? (
        <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = someSelected;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Commande</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Montant</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Paiement</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Logistique</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Aucune commande trouvée</h3>
                        <p className="text-muted-foreground mb-4">
                          Aucune commande ne correspond à vos critères de recherche
                        </p>
                        <button
                          onClick={handleResetFilters}
                          className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
                        >
                          Réinitialiser les filtres
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => {
                    const statusBadge = getStatusBadge(order.status);
                    const paymentBadge = getPaymentBadge(order.paymentStatus);
                    const StatusIcon = statusBadge.icon;

                    return (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedOrders.has(order.id)}
                            onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                            className="rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="text-[#2563eb] hover:underline font-medium"
                          >
                            {order.id}
                          </button>
                          <div className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleString("fr-FR")}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                              {order.customerAvatar}
                            </div>
                            <span className="font-medium">{order.customerName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold">{order.totalAmount.toFixed(2)}€</td>
                        <td className="px-4 py-4">
                          <div className="relative group/status">
                            <button className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.class}`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusBadge.label}
                            </button>
                            <div className="absolute left-0 top-full mt-1 w-40 bg-card border rounded-lg shadow-lg opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-10">
                              {(["pending", "confirmed", "preparing", "shipped", "delivered"] as const).map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleChangeStatus(order.id, status)}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted first:rounded-t-lg last:rounded-b-lg"
                                >
                                  {getStatusBadge(status).label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentBadge.class}`}>
                              {paymentBadge.label}
                            </span>
                            <div className="text-xs text-muted-foreground">{order.paymentMethod}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {order.trackingNumber ? (
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {order.trackingNumber}
                              </code>
                              <button
                                onClick={() => handleCopyTracking(order.trackingNumber!)}
                                className="p-1 hover:bg-muted rounded"
                                title="Copier"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              {order.status === "shipped" && (
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowTrackingModal(true);
                                  }}
                                  className="text-xs text-[#2563eb] hover:underline"
                                >
                                  Suivre
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end">
                            <div className="relative group">
                              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-56 bg-card border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                <button
                                  onClick={() => handleViewDetails(order)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 rounded-t-lg"
                                >
                                  <Eye className="h-4 w-4" />
                                  Voir les détails
                                </button>
                                <button
                                  onClick={() => toast.success("Facture téléchargée")}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                                >
                                  <FileText className="h-4 w-4" />
                                  Télécharger la facture
                                </button>
                                <button
                                  onClick={() => toast.info(`Email envoyé à ${order.customerName}`)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                                >
                                  <Mail className="h-4 w-4" />
                                  Contacter le client
                                </button>
                                <button
                                  onClick={() => {
                                    handleChangeStatus(order.id, "cancelled");
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-red-600 rounded-b-lg"
                                >
                                  <X className="h-4 w-4" />
                                  Annuler la commande
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {paginatedOrders.length > 0 && (
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)} sur{" "}
                {filteredOrders.length} commandes
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 rounded-lg transition-colors ${
                          currentPage === pageNum ? "bg-[#2563eb] text-white" : "hover:bg-accent"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries({
            pending: { title: "À traiter", orders: kanbanColumns.pending },
            preparing: { title: "En préparation", orders: kanbanColumns.preparing },
            shipped: { title: "Expédiées", orders: kanbanColumns.shipped },
            delivered: { title: "Livrées", orders: kanbanColumns.delivered },
          }).map(([status, { title, orders: columnOrders }]) => (
            <div key={status} className="flex flex-col">
              <div className="bg-muted/50 rounded-t-lg px-4 py-3 border-b">
                <h3 className="font-semibold flex items-center justify-between">
                  <span>{title}</span>
                  <span className="text-sm bg-background px-2 py-0.5 rounded-full">
                    {columnOrders.length}
                  </span>
                </h3>
              </div>
              <div className="bg-muted/20 rounded-b-lg p-3 space-y-3 min-h-[400px]">
                {columnOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <div
                      key={order.id}
                      className="bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewDetails(order)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-sm text-[#2563eb]">{order.id}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.class}`}>
                          <StatusIcon className="h-3 w-3" />
                        </span>
                      </div>
                      <div className="text-sm font-medium mb-1">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {order.items.length} produit(s)
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">{order.totalAmount.toFixed(2)}€</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getPaymentBadge(order.paymentStatus).class}`}>
                          {getPaymentBadge(order.paymentStatus).label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Panel */}
      {showDetailPanel && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
          <div className="bg-card w-full max-w-2xl h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Détails de la commande</h2>
              <button
                onClick={() => {
                  setShowDetailPanel(false);
                  setSelectedOrder(null);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{selectedOrder.id}</h3>
                  <p className="text-muted-foreground">
                    {new Date(selectedOrder.date).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Montant total</p>
                  <p className="text-3xl font-bold">{selectedOrder.totalAmount.toFixed(2)}€</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline de la commande
                </h4>
                <div className="space-y-4">
                  {[
                    { label: "Commande créée", status: "pending", icon: ShoppingCart, completed: true, date: selectedOrder.date },
                    { label: "Paiement validé", status: "confirmed", icon: CreditCard, completed: selectedOrder.paymentStatus === "paid", date: selectedOrder.date },
                    { label: "En préparation", status: "preparing", icon: Package, completed: ["preparing", "shipped", "delivered"].includes(selectedOrder.status) },
                    { label: "Expédiée", status: "shipped", icon: Truck, completed: ["shipped", "delivered"].includes(selectedOrder.status) },
                    { label: "Livrée", status: "delivered", icon: Check, completed: selectedOrder.status === "delivered" },
                  ].map((step, idx) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              step.completed
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <StepIcon className="h-5 w-5" />
                          </div>
                          {idx < 4 && (
                            <div className={`w-0.5 h-8 ${step.completed ? "bg-green-500" : "bg-muted"}`} />
                          )}
                        </div>
                        <div className="flex-1 pt-2">
                          <p className={`font-medium ${step.completed ? "" : "text-muted-foreground"}`}>
                            {step.label}
                          </p>
                          {step.date && step.completed && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(step.date).toLocaleString("fr-FR")}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-semibold mb-4">Produits commandés</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {item.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × {item.unitPrice.toFixed(2)}€
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">{(item.quantity * item.unitPrice).toFixed(2)}€</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sous-total</span>
                    <span>{selectedOrder.totalAmount.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Frais de livraison</span>
                    <span>0.00€</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{selectedOrder.totalAmount.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informations client
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                      <p className="text-muted-foreground">{selectedOrder.customerEmail}</p>
                      <p className="text-muted-foreground">{selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Adresse de livraison</p>
                      <p className="text-muted-foreground">{selectedOrder.shippingAddress}</p>
                    </div>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="flex items-start gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Numéro de suivi</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{selectedOrder.trackingNumber}</code>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Confirmer l'action groupée</h2>
            </div>
            
            <div className="p-6">
              <p className="text-muted-foreground">
                Voulez-vous vraiment appliquer l'action <strong>"{bulkAction}"</strong> à{" "}
                <strong>{selectedOrders.size}</strong> commande(s) sélectionnée(s) ?
              </p>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmBulkAction}
                className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Créer une commande manuelle</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-center text-muted-foreground py-8">
                Formulaire de création de commande manuelle - Fonctionnalité à venir
              </p>
            </div>

            <div className="sticky bottom-0 bg-card border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  toast.success("Commande créée avec succès");
                  setShowCreateModal(false);
                }}
                className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                Créer la commande
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Suivi de livraison</h2>
              <button
                onClick={() => {
                  setShowTrackingModal(false);
                  setSelectedOrder(null);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Numéro de suivi</p>
                <code className="text-lg font-mono bg-muted px-3 py-2 rounded">{selectedOrder.trackingNumber}</code>
              </div>

              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Carte de suivi interactive - Simulation
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Le colis est en cours de livraison vers {selectedOrder.shippingAddress}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => {
                  setShowTrackingModal(false);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
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
