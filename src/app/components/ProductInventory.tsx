import { useState, useMemo, useRef, ChangeEvent } from "react";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Plus,
  Search,
  Download,
  RefreshCw,
  Upload,
  Edit,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  History,
  Check,
  Minus,
  BarChart3,
  Truck 
} from "lucide-react";
import { AgriLogisticLink } from "./AgriLogisticLink";
import { toast } from "sonner";
import { downloadTextFile, parseCsvToObjects, toCsv } from "../../shared/utils/csv";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Types
export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unitPrice: number;
  image?: string;
  supplier?: string;
  description?: string;
}

interface StockMovement {
  id: number;
  productId: number;
  type: "Réception" | "Vente" | "Ajustement manuel" | "Perte";
  quantity: number;
  date: string;
  user: string;
  reason?: string;
}

// Import/Export helpers
export function mapInventoryRowToProduct(row: any, id: number) {
  const name = (row.name ?? row.Nom ?? row["Nom"] ?? "").toString().trim();
  const sku = (row.sku ?? row.SKU ?? "").toString().trim();
  const category = (
    row.category ??
    row.Catégorie ??
    row["Categorie"] ??
    row["Catégorie"] ??
    ""
  )
    .toString()
    .trim();

  const currentStockRaw =
    row.currentStock ??
    row["Stock actuel"] ??
    row.Stock ??
    row.Quantité ??
    row["Quantite"];
  const reorderPointRaw =
    row.reorderPoint ??
    row["Point de réapprovisionnement"] ??
    row["Point de réappro"] ??
    row["Seuil d'alerte"];
  const maxStockRaw =
    row.maxStock ??
    row["Stock maximum"] ??
    row["Stock max"];
  const unitPriceRaw =
    row.unitPrice ??
    row["Prix unitaire"] ??
    row["Prix"];

  const supplierValue = (row.supplier ?? row.Fournisseur ?? "").toString().trim();
  const descriptionValue = (row.description ?? row.Description ?? "").toString().trim();

  const supplier = supplierValue || undefined;
  const description = descriptionValue || undefined;

  const hasNumericValues =
    currentStockRaw !== undefined &&
    currentStockRaw !== null &&
    currentStockRaw !== "" &&
    reorderPointRaw !== undefined &&
    reorderPointRaw !== null &&
    reorderPointRaw !== "" &&
    maxStockRaw !== undefined &&
    maxStockRaw !== null &&
    maxStockRaw !== "" &&
    unitPriceRaw !== undefined &&
    unitPriceRaw !== null &&
    unitPriceRaw !== "";

  if (!name || !sku || !category) {
    return { error: "Champs obligatoires manquants" };
  }

  if (!hasNumericValues) {
    return { error: "Valeurs numériques manquantes" };
  }

  const currentStock = Number(currentStockRaw);
  const reorderPoint = Number(reorderPointRaw);
  const maxStock = Number(maxStockRaw);
  const unitPrice = Number(unitPriceRaw);

  if (
    Number.isNaN(currentStock) ||
    Number.isNaN(reorderPoint) ||
    Number.isNaN(maxStock) ||
    Number.isNaN(unitPrice)
  ) {
    return { error: "Valeurs numériques invalides" };
  }

  if (currentStock < 0 || reorderPoint < 0 || maxStock <= 0 || unitPrice < 0) {
    return { error: "Valeurs numériques négatives ou nulles interdites" };
  }

  const product: Product = {
    id,
    name,
    sku,
    category,
    currentStock,
    reorderPoint,
    maxStock,
    unitPrice,
    supplier,
    description,
  };

  return { product };
}

export function buildInventoryExportData(products: Product[]) {
  return products.map((product) => ({
    ID: product.id,
    Nom: product.name,
    SKU: product.sku,
    Catégorie: product.category,
    "Stock actuel": product.currentStock,
    "Point de réapprovisionnement": product.reorderPoint,
    "Stock maximum": product.maxStock,
    "Prix unitaire (€)": product.unitPrice,
    Fournisseur: product.supplier || "",
    Description: product.description || "",
  }));
}

// Mock data - 12 produits agricoles
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Tomates Bio",
    sku: "VEG-TOM-001",
    category: "Légumes",
    currentStock: 45,
    reorderPoint: 20,
    maxStock: 100,
    unitPrice: 3.5,
    supplier: "Ferme Martin",
    description: "Tomates bio cultivées localement",
  },
  {
    id: 2,
    name: "Laitue Frisée",
    sku: "VEG-LAI-002",
    category: "Légumes",
    currentStock: 8,
    reorderPoint: 15,
    maxStock: 50,
    unitPrice: 2.0,
    supplier: "Ferme Dubois",
    description: "Laitue fraîche du jour",
  },
  {
    id: 3,
    name: "Pommes Golden",
    sku: "FRU-POM-001",
    category: "Fruits",
    currentStock: 120,
    reorderPoint: 30,
    maxStock: 200,
    unitPrice: 2.8,
    supplier: "Verger des Collines",
    description: "Pommes golden de qualité premium",
  },
  {
    id: 4,
    name: "Fromage de Chèvre",
    sku: "DAI-FRO-001",
    category: "Produits Laitiers",
    currentStock: 12,
    reorderPoint: 10,
    maxStock: 40,
    unitPrice: 8.5,
    supplier: "Fromagerie Leroy",
    description: "Fromage de chèvre artisanal",
  },
  {
    id: 5,
    name: "Carottes Bio",
    sku: "VEG-CAR-003",
    category: "Légumes",
    currentStock: 0,
    reorderPoint: 25,
    maxStock: 80,
    unitPrice: 1.8,
    supplier: "Ferme Martin",
    description: "Carottes bio en vrac",
  },
  {
    id: 6,
    name: "Œufs Plein Air",
    sku: "DAI-OEU-002",
    category: "Produits Laitiers",
    currentStock: 65,
    reorderPoint: 30,
    maxStock: 120,
    unitPrice: 0.5,
    supplier: "Élevage Rousseau",
    description: "Œufs de poules élevées en plein air",
  },
  {
    id: 7,
    name: "Fraises du Périgord",
    sku: "FRU-FRA-002",
    category: "Fruits",
    currentStock: 15,
    reorderPoint: 20,
    maxStock: 60,
    unitPrice: 6.0,
    supplier: "Verger des Collines",
    description: "Fraises fraîches de saison",
  },
  {
    id: 8,
    name: "Miel d'Acacia",
    sku: "AUT-MIE-001",
    category: "Autres",
    currentStock: 28,
    reorderPoint: 10,
    maxStock: 50,
    unitPrice: 12.0,
    supplier: "Rucher Laurent",
    description: "Miel d'acacia 100% naturel",
  },
  {
    id: 9,
    name: "Courgettes",
    sku: "VEG-COU-004",
    category: "Légumes",
    currentStock: 32,
    reorderPoint: 20,
    maxStock: 80,
    unitPrice: 2.2,
    supplier: "Ferme Dubois",
    description: "Courgettes fraîches",
  },
  {
    id: 10,
    name: "Yaourt Nature Bio",
    sku: "DAI-YAO-003",
    category: "Produits Laitiers",
    currentStock: 5,
    reorderPoint: 20,
    maxStock: 60,
    unitPrice: 1.5,
    supplier: "Fromagerie Leroy",
    description: "Yaourt nature bio sans sucre ajouté",
  },
  {
    id: 11,
    name: "Raisins Blancs",
    sku: "FRU-RAI-003",
    category: "Fruits",
    currentStock: 40,
    reorderPoint: 15,
    maxStock: 70,
    unitPrice: 4.5,
    supplier: "Verger des Collines",
    description: "Raisins blancs sans pépins",
  },
  {
    id: 12,
    name: "Huile d'Olive",
    sku: "AUT-HUI-002",
    category: "Autres",
    currentStock: 18,
    reorderPoint: 12,
    maxStock: 40,
    unitPrice: 15.0,
    supplier: "Moulin Provençal",
    description: "Huile d'olive extra vierge",
  },
];

const mockStockHistory = [
  { date: "01/12", stock: 150 },
  { date: "05/12", stock: 142 },
  { date: "10/12", stock: 138 },
  { date: "15/12", stock: 145 },
  { date: "20/12", stock: 152 },
  { date: "25/12", stock: 148 },
  { date: "30/12", stock: 155 },
  { date: "05/01", stock: 160 },
  { date: "10/01", stock: 158 },
];

const mockTopProducts = [
  { name: "Tomates Bio", sales: 245 },
  { name: "Pommes Golden", sales: 198 },
  { name: "Œufs Plein Air", sales: 176 },
  { name: "Fromage de Chèvre", sales: 142 },
  { name: "Laitue Frisée", sales: 128 },
  { name: "Carottes Bio", sales: 115 },
  { name: "Courgettes", sales: 98 },
  { name: "Fraises", sales: 87 },
  { name: "Raisins", sales: 76 },
  { name: "Miel", sales: 65 },
];

export function ProductInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState<"all" | "low" | "analytics" | "logistics">("all");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showStockAdjustModal, setShowStockAdjustModal] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("Réception");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Calcul des KPIs
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.currentStock * p.unitPrice, 0);
  const lowStockCount = products.filter((p) => p.currentStock > 0 && p.currentStock <= p.reorderPoint).length;
  const outOfStockCount = products.filter((p) => p.currentStock === 0).length;

  // Filtrage
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Filtre par statut
    if (statusFilter !== "all") {
      if (statusFilter === "in-stock") {
        filtered = filtered.filter((p) => p.currentStock > p.reorderPoint);
      } else if (statusFilter === "low") {
        filtered = filtered.filter((p) => p.currentStock > 0 && p.currentStock <= p.reorderPoint);
      } else if (statusFilter === "out") {
        filtered = filtered.filter((p) => p.currentStock === 0);
      }
    }

    // Filtre par onglet
    if (currentTab === "low") {
      filtered = filtered.filter((p) => p.currentStock <= p.reorderPoint);
    }

    return filtered;
  }, [products, searchQuery, categoryFilter, statusFilter, currentTab]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0) return "out";
    if (product.currentStock <= product.reorderPoint) return "low";
    return "good";
  };

  const getStockPercentage = (product: Product) => {
    return Math.min((product.currentStock / product.maxStock) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Légumes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Fruits: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      "Produits Laitiers": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Autres: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const handleAdjustStock = () => {
    if (!selectedProduct || adjustmentQuantity === 0) return;

    const updatedProducts = products.map((p) => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          currentStock: Math.max(0, p.currentStock + adjustmentQuantity),
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    toast.success(
      `Stock de ${selectedProduct.name} ${adjustmentQuantity > 0 ? "augmenté" : "diminué"} de ${Math.abs(adjustmentQuantity)} unités`
    );
    setShowStockAdjustModal(false);
    setAdjustmentQuantity(0);
    setSelectedProduct(null);
  };

  const handleRefresh = () => {
    toast.success("Données de stock actualisées");
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleImportChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = (e.target?.result ?? "").toString();
        if (!data) {
          toast.error("Fichier vide ou illisible");
          return;
        }

        const jsonData = parseCsvToObjects(data);

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          toast.error("Aucune donnée trouvée dans le fichier");
          return;
        }

        const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
        let nextId = maxId + 1;
        const importedProducts: Product[] = [];
        let errorCount = 0;

        jsonData.forEach((row, index) => {
          const result = mapInventoryRowToProduct(row, nextId);
          if (result.product) {
            importedProducts.push(result.product);
            nextId += 1;
          } else {
            errorCount += 1;
          }
        });

        if (importedProducts.length === 0) {
          toast.error("Aucun produit valide trouvé dans le fichier");
          if (errorCount > 0) {
            toast.info(`${errorCount} ligne(s) ignorée(s) pour cause d'erreur`);
          }
          return;
        }

        setProducts([...products, ...importedProducts]);
        toast.success(`${importedProducts.length} produit(s) importé(s) avec succès`);
        if (errorCount > 0) {
          toast.info(`${errorCount} ligne(s) ignorée(s) pour cause d'erreur`);
        }
      } catch (error) {
        toast.error("Erreur lors de la lecture du fichier");
      }
    };

    reader.onerror = () => {
      toast.error("Erreur lors de la lecture du fichier");
    };

    reader.readAsText(file);
  };

  const handleExport = () => {
    if (products.length === 0) {
      toast.info("Aucun produit à exporter");
      return;
    }

    const exportData = buildInventoryExportData(products);
    const headers = Object.keys(exportData[0] || {});
    const rows = exportData.map((row) => headers.map((h) => (row as any)[h]));
    const csvContent = toCsv(headers, rows);

    const filename = `AgroLogistic_Inventaire_${new Date().toISOString().split("T")[0]}.csv`;
    downloadTextFile(filename, csvContent, "text/csv;charset=utf-8;");

    toast.success(`Export CSV réussi : ${products.length} produit(s)`);
  };

  const categories = ["Légumes", "Fruits", "Produits Laitiers", "Autres"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Stocks</h1>
          <p className="text-muted-foreground mt-2">
            Suivez et gérez vos stocks en temps réel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImportChange}
          />
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span className="font-medium">Import en masse</span>
          </button>
          <button
            onClick={() => setShowAddProductModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">Ajouter un Produit</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Produits Totaux</p>
              <p className="text-3xl font-bold">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valeur du Stock</p>
              <p className="text-3xl font-bold">{totalValue.toFixed(0)}€</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Stock Faible</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">{lowStockCount}</p>
                {lowStockCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">
                    Alerte
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En Rupture</p>
              <p className="text-3xl font-bold">{outOfStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-6">
          <button
            onClick={() => {
              setCurrentTab("all");
              setCurrentPage(1);
            }}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              currentTab === "all"
                ? "border-[#2563eb] text-[#2563eb] font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Tous les Produits
          </button>
          <button
            onClick={() => {
              setCurrentTab("low");
              setCurrentPage(1);
            }}
            className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              currentTab === "low"
                ? "border-[#2563eb] text-[#2563eb] font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Stock Faible & Alerte
            {(lowStockCount + outOfStockCount) > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">
                {lowStockCount + outOfStockCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab("analytics")}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              currentTab === "analytics"
                ? "border-[#2563eb] text-[#2563eb] font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Analytiques
          </button>
          <button
            onClick={() => setCurrentTab("logistics")}
            className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              currentTab === "logistics"
                ? "border-[#2563eb] text-[#2563eb] font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Truck className="h-4 w-4" />
            AgriLogistic Link
          </button>
        </div>
      </div>

      {/* Alert Banner for Low Stock Tab */}
      {currentTab === "low" && (lowStockCount + outOfStockCount) > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-900 dark:text-red-200">
              {lowStockCount + outOfStockCount} produits nécessitent une attention immédiate
            </h4>
            <p className="text-sm text-red-800 dark:text-red-300 mt-1">
              {lowStockCount} produits en stock faible et {outOfStockCount} en rupture de stock
            </p>
          </div>
          <button
            onClick={() => setShowReorderModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Commander
          </button>
        </div>
      )}

      {/* Analytics View */}
      {currentTab === "analytics" ? (
        <div className="space-y-6">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products Bar Chart */}
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Top 10 Produits les plus Vendus</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockTopProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stock Value Line Chart */}
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Valeur Totale du Stock (30 derniers jours)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockStockHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="stock" stroke="#2563eb" strokeWidth={2} name="Stock (unités)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Taux de Rotation Moyen</h4>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.72} ${2 * Math.PI * 40}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">72%</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">Très bon taux de rotation</p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm col-span-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Mouvements Récents</h4>
              <div className="space-y-3">
                {[
                  { product: "Tomates Bio", type: "Vente", quantity: -15, date: "10/01/2026 14:23" },
                  { product: "Pommes Golden", type: "Réception", quantity: +50, date: "10/01/2026 10:15" },
                  { product: "Fromage de Chèvre", type: "Vente", quantity: -8, date: "09/01/2026 16:45" },
                  { product: "Laitue Frisée", type: "Ajustement manuel", quantity: -3, date: "09/01/2026 09:30" },
                ].map((movement, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{movement.product}</p>
                      <p className="text-sm text-muted-foreground">{movement.type}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${movement.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                        {movement.quantity > 0 ? "+" : ""}{movement.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground">{movement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Control Bar */}
          <div className="bg-card border rounded-lg p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, SKU ou catégorie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
              >
                <option value="all">Tous les statuts</option>
                <option value="in-stock">En Stock</option>
                <option value="low">Stock Faible</option>
                <option value="out">Rupture</option>
              </select>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
                  title="Exporter"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
                  title="Actualiser"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Produit</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Catégorie</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Stock Actuel</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Point de Réappro.</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Valeur du Stock</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
                          <p className="text-muted-foreground">
                            Essayez de modifier vos filtres de recherche
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => {
                      const status = getStockStatus(product);
                      const percentage = getStockPercentage(product);

                      return (
                        <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {status === "low" || status === "out" ? (
                                <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                              ) : null}
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {product.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">{product.sku}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                              {product.category}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-2">
                              <div className="font-semibold">{product.currentStock} unités</div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${getProgressColor(percentage)}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">{product.reorderPoint}</td>
                          <td className="px-4 py-4">
                            {status === "out" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                Rupture
                              </span>
                            )}
                            {status === "low" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                Stock Faible
                              </span>
                            )}
                            {status === "good" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                En Stock
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 font-semibold">
                            {(product.currentStock * product.unitPrice).toFixed(2)}€
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowStockAdjustModal(true);
                                }}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                title="Ajuster le Stock"
                              >
                                <BarChart3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowEditProductModal(true);
                                }}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                title="Éditer"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <div className="relative group">
                                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                                <div className="absolute right-0 top-full mt-1 w-48 bg-card border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                  <button
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setShowHistoryPanel(true);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 rounded-t-lg"
                                  >
                                    <History className="h-4 w-4" />
                                    Voir les Mouvements
                                  </button>
                                  <button
                                    onClick={() => toast.info(`${product.name} désactivé`)}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 rounded-b-lg"
                                  >
                                    <X className="h-4 w-4" />
                                    Désactiver
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
            {paginatedProducts.length > 0 && (
              <div className="px-4 py-3 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
                  {Math.min(currentPage * itemsPerPage, filteredProducts.length)} sur{" "}
                  {filteredProducts.length} produits
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
                            currentPage === pageNum
                              ? "bg-[#2563eb] text-white"
                              : "hover:bg-accent"
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
        </>
      )}

      {/* Stock Adjustment Modal */}
      {showStockAdjustModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Ajuster le Stock</h2>
              <p className="text-sm text-muted-foreground mt-1">{selectedProduct.name}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stock Actuel</label>
                <div className="text-2xl font-bold">{selectedProduct.currentStock} unités</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ajustement</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdjustmentQuantity((q) => q - 1)}
                    className="p-2 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <input
                    type="number"
                    value={adjustmentQuantity}
                    onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                    className="flex-1 px-4 py-2 border rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                  <button
                    onClick={() => setAdjustmentQuantity((q) => q + 1)}
                    className="p-2 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Raison</label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                >
                  <option value="Réception">Réception</option>
                  <option value="Vente">Vente</option>
                  <option value="Ajustement manuel">Ajustement manuel</option>
                  <option value="Perte">Perte</option>
                </select>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Nouveau Stock</p>
                <p className="text-xl font-bold">
                  {Math.max(0, selectedProduct.currentStock + adjustmentQuantity)} unités
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowStockAdjustModal(false);
                  setAdjustmentQuantity(0);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAdjustStock}
                disabled={adjustmentQuantity === 0}
                className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {(showAddProductModal || showEditProductModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {showEditProductModal ? `Éditer - ${selectedProduct?.name}` : "Ajouter un Produit"}
              </h2>
              <button
                onClick={() => {
                  setShowAddProductModal(false);
                  setShowEditProductModal(false);
                  setSelectedProduct(null);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex gap-1 border-b mb-6">
                <button className="px-4 py-2 border-b-2 border-[#2563eb] text-[#2563eb] font-medium">
                  Informations Générales
                </button>
                <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
                  Gestion du Stock
                </button>
                <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
                  Livraison & Taxes
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom du Produit *</label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.name || ""}
                      placeholder="Ex: Tomates Bio"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SKU *</label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.sku || ""}
                      placeholder="Ex: VEG-TOM-001"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Catégorie *</label>
                    <select
                      defaultValue={selectedProduct?.category || "Légumes"}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Prix Unitaire (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={selectedProduct?.unitPrice || ""}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    defaultValue={selectedProduct?.description || ""}
                    rows={3}
                    placeholder="Description détaillée du produit..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddProductModal(false);
                  setShowEditProductModal(false);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  toast.success(showEditProductModal ? "Produit modifié avec succès" : "Produit ajouté avec succès");
                  setShowAddProductModal(false);
                  setShowEditProductModal(false);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                {showEditProductModal ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Panel */}
      {showHistoryPanel && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
          <div className="bg-card w-full max-w-2xl h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Détails & Historique</h2>
              <button
                onClick={() => {
                  setShowHistoryPanel(false);
                  setSelectedProduct(null);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">{selectedProduct.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">SKU:</span>
                    <span className="ml-2 font-medium">{selectedProduct.sku}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stock:</span>
                    <span className="ml-2 font-medium">{selectedProduct.currentStock} unités</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Prix:</span>
                    <span className="ml-2 font-medium">{selectedProduct.unitPrice.toFixed(2)}€</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valeur:</span>
                    <span className="ml-2 font-medium">
                      {(selectedProduct.currentStock * selectedProduct.unitPrice).toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Historique des Niveaux de Stock (30 jours)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={mockStockHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="stock" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Journal des Mouvements</h4>
                <div className="space-y-3">
                  {[
                    {
                      type: "Vente",
                      quantity: -15,
                      date: "10/01/2026 14:23",
                      user: "Sophie Leroy",
                      reason: "Commande client #2301",
                    },
                    {
                      type: "Réception",
                      quantity: +50,
                      date: "08/01/2026 10:15",
                      user: "Marc Dubois",
                      reason: "Livraison fournisseur",
                    },
                    {
                      type: "Ajustement manuel",
                      quantity: -3,
                      date: "05/01/2026 16:30",
                      user: "Julie Moreau",
                      reason: "Produits endommagés",
                    },
                    {
                      type: "Vente",
                      quantity: -8,
                      date: "03/01/2026 11:45",
                      user: "Sophie Leroy",
                      reason: "Commande client #2256",
                    },
                  ].map((movement, idx) => (
                    <div key={idx} className="flex gap-3 p-3 border rounded-lg">
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          movement.quantity > 0
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}
                      >
                        {movement.quantity > 0 ? (
                          <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <Minus className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <p className="font-medium">{movement.type}</p>
                            <p className="text-sm text-muted-foreground">{movement.reason}</p>
                          </div>
                          <p
                            className={`font-semibold ${
                              movement.quantity > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {movement.quantity > 0 ? "+" : ""}
                            {movement.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{movement.date}</span>
                          <span>•</span>
                          <span>{movement.user}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reorder Modal */}
      {showReorderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b px-6 py-4">
              <h2 className="text-xl font-bold">Commande de Réapprovisionnement</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Générer un bon de commande pour les produits en stock faible
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fournisseur</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background">
                  <option>Ferme Martin</option>
                  <option>Ferme Dubois</option>
                  <option>Verger des Collines</option>
                  <option>Fromagerie Leroy</option>
                  <option>Élevage Rousseau</option>
                </select>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left">Produit</th>
                      <th className="px-4 py-2 text-left">Stock Actuel</th>
                      <th className="px-4 py-2 text-left">Quantité à Commander</th>
                      <th className="px-4 py-2 text-right">Sous-total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products
                      .filter((p) => p.currentStock <= p.reorderPoint)
                      .map((product) => (
                        <tr key={product.id}>
                          <td className="px-4 py-3 font-medium">{product.name}</td>
                          <td className="px-4 py-3">{product.currentStock}</td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              defaultValue={product.maxStock - product.currentStock}
                              className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {((product.maxStock - product.currentStock) * product.unitPrice).toFixed(2)}€
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span className="font-semibold">Total de la Commande</span>
                <span className="text-2xl font-bold">
                  {products
                    .filter((p) => p.currentStock <= p.reorderPoint)
                    .reduce((sum, p) => sum + (p.maxStock - p.currentStock) * p.unitPrice, 0)
                    .toFixed(2)}
                  €
                </span>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowReorderModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  toast.success("Bon de commande généré avec succès");
                  setShowReorderModal(false);
                }}
                className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                Générer le Bon de Commande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
