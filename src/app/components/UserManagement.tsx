import { useState, useMemo, useRef } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Edit,
  Eye,
  Power,
  Mail,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  UserCog,
  Shield,
  MapPin,
  Calendar,
  Clock,
  Activity,
  ShoppingCart,
  LogIn,
  UserPlus,
  Upload,
  FileSpreadsheet,
  FileText,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { downloadTextFile, parseCsvToObjects, toCsv } from '../../shared/utils/csv';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Farmer' | 'Customer' | 'Logistics';
  status: 'Actif' | 'Inactif' | 'Non vérifié';
  registrationDate: string;
  lastLogin: string;
  avatar: string;
  isOnline: boolean;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  totalOrders?: number;
  totalSpent?: number;
}

interface ActivityLog {
  type: 'login' | 'order' | 'role_change' | 'registration';
  description: string;
  timestamp: string;
}

// Mock data - 10 utilisateurs fictifs
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Sophie Leroy',
    email: 'sophie.leroy@AgroLogistic.fr',
    role: 'Admin',
    status: 'Actif',
    registrationDate: '12/08/2025',
    lastLogin: '10/01/2026 14:32',
    avatar: 'SL',
    isOnline: true,
    phone: '+33 6 12 34 56 78',
    address: '25 rue de la République',
    city: 'Lyon',
    country: 'France',
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    id: 2,
    name: 'Marc Dubois',
    email: 'marc.dubois@fermier.fr',
    role: 'Farmer',
    status: 'Actif',
    registrationDate: '15/09/2025',
    lastLogin: '09/01/2026 09:15',
    avatar: 'MD',
    isOnline: false,
    phone: '+33 6 23 45 67 89',
    address: 'Ferme du Chêne Vert',
    city: 'Bordeaux',
    country: 'France',
    totalOrders: 23,
    totalSpent: 45600,
  },
  {
    id: 3,
    name: 'Camille Bernard',
    email: 'camille.bernard@client.com',
    role: 'Customer',
    status: 'Actif',
    registrationDate: '02/10/2025',
    lastLogin: '10/01/2026 11:28',
    avatar: 'CB',
    isOnline: true,
    phone: '+33 6 34 56 78 90',
    address: '14 avenue des Lilas',
    city: 'Paris',
    country: 'France',
    totalOrders: 12,
    totalSpent: 8540,
  },
  {
    id: 4,
    name: 'Thomas Martin',
    email: 'thomas.martin@logistique.fr',
    role: 'Logistics',
    status: 'Actif',
    registrationDate: '20/09/2025',
    lastLogin: '10/01/2026 08:45',
    avatar: 'TM',
    isOnline: true,
    phone: '+33 6 45 67 89 01',
    address: 'Zone industrielle Nord',
    city: 'Lille',
    country: 'France',
    totalOrders: 156,
    totalSpent: 0,
  },
  {
    id: 5,
    name: 'Émilie Rousseau',
    email: 'emilie.rousseau@fermier.fr',
    role: 'Farmer',
    status: 'Actif',
    registrationDate: '05/11/2025',
    lastLogin: '08/01/2026 16:20',
    avatar: 'ER',
    isOnline: false,
    phone: '+33 6 56 78 90 12',
    address: 'La Ferme des Collines',
    city: 'Toulouse',
    country: 'France',
    totalOrders: 31,
    totalSpent: 62300,
  },
  {
    id: 6,
    name: 'Lucas Petit',
    email: 'lucas.petit@client.com',
    role: 'Customer',
    status: 'Non vérifié',
    registrationDate: '28/12/2025',
    lastLogin: '05/01/2026 10:12',
    avatar: 'LP',
    isOnline: false,
    phone: '+33 6 67 89 01 23',
    address: '8 rue du Commerce',
    city: 'Marseille',
    country: 'France',
    totalOrders: 2,
    totalSpent: 1200,
  },
  {
    id: 7,
    name: 'Julie Moreau',
    email: 'julie.moreau@AgroLogistic.fr',
    role: 'Admin',
    status: 'Actif',
    registrationDate: '18/08/2025',
    lastLogin: '10/01/2026 13:45',
    avatar: 'JM',
    isOnline: true,
    phone: '+33 6 78 90 12 34',
    address: '12 boulevard Haussmann',
    city: 'Paris',
    country: 'France',
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    id: 8,
    name: 'Antoine Laurent',
    email: 'antoine.laurent@fermier.fr',
    role: 'Farmer',
    status: 'Inactif',
    registrationDate: '22/10/2025',
    lastLogin: '15/12/2025 18:30',
    avatar: 'AL',
    isOnline: false,
    phone: '+33 6 89 01 23 45',
    address: 'Domaine Saint-Antoine',
    city: 'Nantes',
    country: 'France',
    totalOrders: 8,
    totalSpent: 18900,
  },
  {
    id: 9,
    name: 'Chloé Bonnet',
    email: 'chloe.bonnet@client.com',
    role: 'Customer',
    status: 'Actif',
    registrationDate: '14/11/2025',
    lastLogin: '10/01/2026 07:55',
    avatar: 'CB2',
    isOnline: false,
    phone: '+33 6 90 12 34 56',
    address: '45 rue Voltaire',
    city: 'Strasbourg',
    country: 'France',
    totalOrders: 18,
    totalSpent: 14320,
  },
  {
    id: 10,
    name: 'Pierre Garnier',
    email: 'pierre.garnier@logistique.fr',
    role: 'Logistics',
    status: 'Actif',
    registrationDate: '03/12/2025',
    lastLogin: '09/01/2026 19:12',
    avatar: 'PG',
    isOnline: false,
    phone: '+33 6 01 23 45 67',
    address: 'Parc logistique Sud',
    city: 'Montpellier',
    country: 'France',
    totalOrders: 89,
    totalSpent: 0,
  },
];

const mockActivityLogs: Record<number, ActivityLog[]> = {
  1: [
    { type: 'login', description: 'Connexion depuis Paris, France', timestamp: '10/01/2026 14:32' },
    { type: 'role_change', description: 'Rôle modifié en Admin', timestamp: '12/08/2025 10:00' },
    {
      type: 'registration',
      description: 'Inscription à la plateforme',
      timestamp: '12/08/2025 09:45',
    },
  ],
  2: [
    {
      type: 'login',
      description: 'Connexion depuis Bordeaux, France',
      timestamp: '09/01/2026 09:15',
    },
    { type: 'order', description: 'Commande #2301 livrée', timestamp: '08/01/2026 14:20' },
    { type: 'order', description: 'Nouvelle commande #2301 créée', timestamp: '05/01/2026 11:30' },
    {
      type: 'registration',
      description: 'Inscription à la plateforme',
      timestamp: '15/09/2025 16:22',
    },
  ],
  3: [
    { type: 'login', description: 'Connexion depuis Paris, France', timestamp: '10/01/2026 11:28' },
    { type: 'order', description: 'Commande #1892 en cours', timestamp: '09/01/2026 15:40' },
    { type: 'order', description: 'Commande #1756 livrée', timestamp: '03/01/2026 10:15' },
    {
      type: 'registration',
      description: 'Inscription à la plateforme',
      timestamp: '02/10/2025 14:05',
    },
  ],
};

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showUserDetailPanel, setShowUserDetailPanel] = useState(false);
  const [showRoleManagementModal, setShowRoleManagementModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtrage des utilisateurs
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchQuery, roleFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Sélection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(paginatedUsers.map((u) => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    toast.success('Filtres réinitialisés');
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Nom',
      'Email',
      'Rôle',
      'Statut',
      "Date d'inscription",
      'Dernière connexion',
      'Téléphone',
      'Adresse',
      'Ville',
      'Pays',
      'Commandes totales',
      'Dépenses totales (€)',
    ];

    const csvRows = filteredUsers.map((user) => [
      user.id,
      user.name,
      user.email,
      user.role,
      user.status,
      user.registrationDate,
      user.lastLogin,
      user.phone || '',
      user.address || '',
      user.city || '',
      user.country || '',
      user.totalOrders || 0,
      user.totalSpent || 0,
    ]);

    const csvContent = toCsv(headers, csvRows);
    const filename = `AgroLogistic_Utilisateurs_${new Date().toISOString().split('T')[0]}.csv`;
    downloadTextFile(filename, csvContent, 'text/csv;charset=utf-8;');

    toast.success(`Export CSV réussi : ${filteredUsers.length} utilisateur(s) exporté(s)`);
  };

  // Import CSV (les imports Excel ont été retirés pour réduire la surface d'attaque)
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = (e.target?.result ?? '').toString();
        const jsonData = parseCsvToObjects(data);

        setImportPreview(jsonData.slice(0, 10)); // Aperçu des 10 premières lignes
        toast.success(`${jsonData.length} utilisateur(s) détecté(s) dans le fichier`);
      } catch (error) {
        toast.error('Erreur lors de la lecture du fichier');
      }
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleConfirmImport = () => {
    toast.success(`${importPreview.length} utilisateur(s) importé(s) avec succès`);
    setShowImportModal(false);
    setImportPreview([]);
  };

  // Rapports d'activité
  const handleGenerateReport = (reportType: string, format: string) => {
    const reportData = {
      title: `Rapport ${reportType} - AgroLogistic`,
      generatedAt: new Date().toLocaleString('fr-FR'),
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter((u) => u.status === 'Actif').length,
      inactiveUsers: mockUsers.filter((u) => u.status === 'Inactif').length,
      unverifiedUsers: mockUsers.filter((u) => u.status === 'Non vérifié').length,
      usersByRole: {
        Admin: mockUsers.filter((u) => u.role === 'Admin').length,
        Farmer: mockUsers.filter((u) => u.role === 'Farmer').length,
        Customer: mockUsers.filter((u) => u.role === 'Customer').length,
        Logistics: mockUsers.filter((u) => u.role === 'Logistics').length,
      },
    };

    if (format === 'excel' || format === 'csv') {
      // Export CSV (remplace Excel pour réduire la surface d'attaque)
      const summaryRows: Array<Array<string | number | null>> = [
        ["Rapport d'activité utilisateurs", ''],
        ['Date de génération', reportData.generatedAt],
        ['', ''],
        ['Total utilisateurs', reportData.totalUsers],
        ['Utilisateurs actifs', reportData.activeUsers],
        ['Utilisateurs inactifs', reportData.inactiveUsers],
        ['Utilisateurs non vérifiés', reportData.unverifiedUsers],
        ['', ''],
        ['Répartition par rôle', ''],
        ['Admin', reportData.usersByRole.Admin],
        ['Farmer', reportData.usersByRole.Farmer],
        ['Customer', reportData.usersByRole.Customer],
        ['Logistics', reportData.usersByRole.Logistics],
      ];

      const detailsHeaders = [
        'ID',
        'Nom',
        'Email',
        'Rôle',
        'Statut',
        "Date d'inscription",
        'Dernière connexion',
        'Commandes',
        'Dépenses (€)',
      ];
      const detailsRows = mockUsers.map((user) => [
        user.id,
        user.name,
        user.email,
        user.role,
        user.status,
        user.registrationDate,
        user.lastLogin,
        user.totalOrders || 0,
        user.totalSpent || 0,
      ]);

      const summaryCsv = toCsv(['Champ', 'Valeur'], summaryRows);
      const detailsCsv = toCsv(detailsHeaders, detailsRows);
      const combined = `${summaryCsv}\n\n${detailsCsv}\n`;

      const filename = `Rapport_AgroLogistic_${reportType}_${
        new Date().toISOString().split('T')[0]
      }.csv`;
      downloadTextFile(filename, combined, 'text/csv;charset=utf-8;');
      toast.success(`Rapport CSV "${reportType}" généré avec succès`);
    } else if (format === 'pdf') {
      // Simuler la génération d'un PDF
      toast.info('Génération du rapport PDF en cours...');
      setTimeout(() => {
        toast.success(`Rapport PDF "${reportType}" généré avec succès`);
      }, 1500);
    }

    setShowReportModal(false);
  };

  const handleBulkAction = (action: string) => {
    setBulkAction(action);
    setShowBulkActionModal(true);
  };

  const confirmBulkAction = () => {
    toast.success(`Action "${bulkAction}" appliquée à ${selectedUsers.size} utilisateur(s)`);
    setShowBulkActionModal(false);
    setSelectedUsers(new Set());
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetailPanel(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditUserModal(true);
  };

  const handleSaveUser = () => {
    toast.success(
      editingUser
        ? `Utilisateur ${editingUser.name} modifié avec succès`
        : 'Nouvel utilisateur créé avec succès'
    );
    setShowAddUserModal(false);
    setShowEditUserModal(false);
    setEditingUser(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Farmer':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Customer':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Logistics':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Inactif':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      case 'Non vérifié':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const allSelected = paginatedUsers.length > 0 && selectedUsers.size === paginatedUsers.length;
  const someSelected = selectedUsers.size > 0 && selectedUsers.size < paginatedUsers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground mt-2">
            Gérez tous les utilisateurs de la plateforme AgroLogistic
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="font-medium">Rapports</span>
          </button>
          <button
            onClick={() => setShowRoleManagementModal(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
          >
            <UserCog className="h-4 w-4" />
            <span className="font-medium">Gérer les rôles</span>
          </button>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">Ajouter un utilisateur</span>
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Utilisateurs</p>
              <p className="text-2xl font-bold">250</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Actifs</p>
              <p className="text-2xl font-bold">218</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Non vérifiés</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
              <Power className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactifs</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
          >
            <option value="all">Tous les rôles</option>
            <option value="Admin">Admin</option>
            <option value="Farmer">Farmer</option>
            <option value="Customer">Customer</option>
            <option value="Logistics">Logistics</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
          >
            <option value="all">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
            <option value="Non vérifié">Non vérifié</option>
          </select>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              title="Export CSV"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              title="Import CSV"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUsers.size > 0 && (
          <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-700 dark:text-blue-400">
                {selectedUsers.size} élément(s) sélectionné(s)
              </span>
              <button
                onClick={() => setSelectedUsers(new Set())}
                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
              >
                <X className="h-4 w-4 text-blue-700 dark:text-blue-400" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('Désactiver')}
                className="px-3 py-1.5 text-sm border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                Désactiver la sélection
              </button>
              <button
                onClick={() => handleBulkAction('Attribuer un rôle')}
                className="px-3 py-1.5 text-sm border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                Attribuer un rôle
              </button>
              <button
                onClick={() => handleBulkAction('Exporter')}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Exporter la sélection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
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
                <th className="px-4 py-3 text-left text-sm font-medium">Utilisateur</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Rôle</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date d'inscription</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Dernière connexion</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="h-4 w-4 bg-muted rounded"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-muted rounded"></div>
                          <div className="h-3 w-40 bg-muted rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-6 w-20 bg-muted rounded-full"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-24 bg-muted rounded"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-32 bg-muted rounded"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-6 w-20 bg-muted rounded-full"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-8 bg-muted rounded"></div>
                        <div className="h-8 w-8 bg-muted rounded"></div>
                        <div className="h-8 w-8 bg-muted rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : paginatedUsers.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={7} className="px-4 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="p-4 bg-muted rounded-full mb-4">
                        <Users className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Aucun utilisateur ne correspond à vos critères
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Essayez de modifier vos filtres de recherche
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
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                        className="rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                            {user.avatar}
                          </div>
                          {user.isOnline && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">{user.registrationDate}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{user.lastLogin}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Éditer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Voir profil"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <div className="relative group">
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-48 bg-card border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <button
                              onClick={() =>
                                toast.info(
                                  `${user.name} ${user.status === 'Actif' ? 'désactivé' : 'activé'}`
                                )
                              }
                              className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 rounded-t-lg"
                            >
                              <Power className="h-4 w-4" />
                              {user.status === 'Actif' ? 'Désactiver' : 'Activer'}
                            </button>
                            {user.status === 'Non vérifié' && (
                              <button
                                onClick={() =>
                                  toast.success(`Email de vérification envoyé à ${user.email}`)
                                }
                                className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                              >
                                <Mail className="h-4 w-4" />
                                Renvoyer l'email
                              </button>
                            )}
                            <button
                              onClick={() => toast.error(`${user.name} supprimé`)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-red-600 rounded-b-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && paginatedUsers.length > 0 && (
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)} sur{' '}
                {filteredUsers.length} utilisateurs
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border rounded-lg text-sm bg-background"
              >
                <option value={20}>20 par page</option>
                <option value={50}>50 par page</option>
                <option value={100}>100 par page</option>
              </select>
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
                        currentPage === pageNum ? 'bg-[#2563eb] text-white' : 'hover:bg-accent'
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

      {/* Import CSV/Excel Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Importer des utilisateurs</h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportPreview([]);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Upload Area */}
              {importPreview.length === 0 ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging
                      ? 'border-[#2563eb] bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Glissez-déposez un fichier ici</h3>
                  <p className="text-sm text-muted-foreground mb-4">Format accepté : CSV</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
                  >
                    Sélectionner un fichier
                  </button>
                </div>
              ) : (
                // Preview
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Aperçu ({importPreview.length} utilisateurs)</h3>
                    <button
                      onClick={() => setImportPreview([])}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Changer de fichier
                    </button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-96">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b sticky top-0">
                          <tr>
                            {Object.keys(importPreview[0] || {}).map((key) => (
                              <th key={key} className="px-4 py-2 text-left font-medium">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {importPreview.map((row, idx) => (
                            <tr key={idx} className="hover:bg-muted/30">
                              {Object.values(row).map((value: any, vidx) => (
                                <td key={vidx} className="px-4 py-2">
                                  {value?.toString() || '-'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Note :</strong> Vérifiez que les données sont correctes avant
                      d'importer. Les champs requis sont : Nom, Email, Rôle.
                    </p>
                  </div>
                </div>
              )}

              {/* Template Download */}
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Besoin d'un modèle ? Téléchargez notre template :
                </p>
                <button
                  onClick={() => {
                    const templateData = [
                      {
                        Nom: 'Jean Dupont',
                        Email: 'jean.dupont@example.com',
                        Rôle: 'Customer',
                        Téléphone: '+33 6 12 34 56 78',
                        Adresse: '123 rue Example',
                        Ville: 'Paris',
                        Pays: 'France',
                      },
                    ];
                    const headers = Object.keys(templateData[0]);
                    const rows = templateData.map((row) => headers.map((h) => (row as any)[h]));
                    const csv = toCsv(headers, rows);
                    downloadTextFile(
                      'AgroLogistic_Template_Import.csv',
                      csv,
                      'text/csv;charset=utf-8;'
                    );
                    toast.success('Template CSV téléchargé');
                  }}
                  className="text-sm text-[#2563eb] hover:underline flex items-center gap-1"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Télécharger le template CSV
                </button>
              </div>
            </div>

            {importPreview.length > 0 && (
              <div className="sticky bottom-0 bg-card border-t px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportPreview([]);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmImport}
                  className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
                >
                  Importer {importPreview.length} utilisateur(s)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Générer un rapport</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Type de rapport</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background">
                  <option value="activite">Rapport d'activité global</option>
                  <option value="utilisateurs">Rapport utilisateurs détaillé</option>
                  <option value="roles">Analyse par rôles</option>
                  <option value="croissance">Croissance et statistiques</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Période</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                      defaultValue="2025-01-01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Date de fin</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                      defaultValue="2026-01-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Format d'export</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleGenerateReport('activite', 'excel')}
                    className="p-4 border-2 rounded-lg hover:border-[#2563eb] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex flex-col items-center gap-2"
                  >
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    <span className="font-medium">Excel (.xlsx)</span>
                    <span className="text-xs text-muted-foreground">
                      Avec graphiques et mise en forme
                    </span>
                  </button>
                  <button
                    onClick={() => handleGenerateReport('activite', 'pdf')}
                    className="p-4 border-2 rounded-lg hover:border-[#2563eb] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex flex-col items-center gap-2"
                  >
                    <FileText className="h-8 w-8 text-red-600" />
                    <span className="font-medium">PDF</span>
                    <span className="text-xs text-muted-foreground">
                      Document formaté et imprimable
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Le rapport inclura :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Statistiques globales des utilisateurs</li>
                  <li>• Répartition par rôles et statuts</li>
                  <li>• Graphiques d'évolution temporelle</li>
                  <li>• Analyse des taux d'activité</li>
                  <li>• Liste détaillée des utilisateurs</li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remaining modals from previous code ... */}
      {/* Add User Modal, Edit User Modal, User Detail Panel, Role Management Modal, Bulk Action Modal */}
      {/* (keeping these as they were in the original code) */}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Ajouter un nouvel utilisateur</h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex gap-1 border-b mb-6">
                <button className="px-4 py-2 border-b-2 border-[#2563eb] text-[#2563eb] font-medium">
                  Informations
                </button>
                <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
                  Rôle & Permissions
                </button>
                <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
                  Adresse de facturation
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prénom</label>
                    <input
                      type="text"
                      placeholder="Jean"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom</label>
                    <input
                      type="text"
                      placeholder="Dupont"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    placeholder="jean.dupont@example.com"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Rôle *</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background">
                    <option>Customer</option>
                    <option>Farmer</option>
                    <option>Logistics</option>
                    <option>Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background">
                    <option>Actif</option>
                    <option>Non vérifié</option>
                    <option>Inactif</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <input type="checkbox" id="sendEmail" className="rounded" defaultChecked />
                  <label htmlFor="sendEmail" className="text-sm">
                    Envoyer un email de bienvenue avec les informations de connexion
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                Créer l'utilisateur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Éditer - {editingUser.name}</h2>
              <button
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingUser(null);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex gap-1 border-b mb-6">
                <button className="px-4 py-2 border-b-2 border-[#2563eb] text-[#2563eb] font-medium">
                  Informations
                </button>
                <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
                  Rôle & Permissions
                </button>
                <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
                  Adresse de facturation
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom complet</label>
                  <input
                    type="text"
                    defaultValue={editingUser.name}
                    className="w-full px-3 py-2 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={editingUser.email}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input
                    type="tel"
                    defaultValue={editingUser.phone}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Rôle</label>
                    <select
                      defaultValue={editingUser.role}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    >
                      <option>Customer</option>
                      <option>Farmer</option>
                      <option>Logistics</option>
                      <option>Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Statut</label>
                    <select
                      defaultValue={editingUser.status}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    >
                      <option>Actif</option>
                      <option>Non vérifié</option>
                      <option>Inactif</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Adresse</label>
                  <input
                    type="text"
                    defaultValue={editingUser.address}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Ville</label>
                    <input
                      type="text"
                      defaultValue={editingUser.city}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pays</label>
                    <input
                      type="text"
                      defaultValue={editingUser.country}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Panel */}
      {showUserDetailPanel && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
          <div className="bg-card w-full max-w-md h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Détails de l'utilisateur</h2>
              <button
                onClick={() => {
                  setShowUserDetailPanel(false);
                  setSelectedUser(null);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center pb-6 border-b">
                <div className="relative mb-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-medium">
                    {selectedUser.avatar}
                  </div>
                  {selectedUser.isOnline && (
                    <div className="absolute bottom-0 right-0 h-5 w-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1">{selectedUser.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{selectedUser.email}</p>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      selectedUser.role
                    )}`}
                  >
                    {selectedUser.role}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      selectedUser.status
                    )}`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Informations personnelles
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Téléphone</span>
                    <span className="font-medium">{selectedUser.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adresse</span>
                    <span className="font-medium text-right">{selectedUser.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ville</span>
                    <span className="font-medium">{selectedUser.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pays</span>
                    <span className="font-medium">{selectedUser.country}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pb-6 border-b">
                <h4 className="font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Statistiques
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Commandes</p>
                    <p className="text-xl font-bold">{selectedUser.totalOrders || 0}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Dépenses</p>
                    <p className="text-xl font-bold">
                      {selectedUser.totalSpent
                        ? `${(selectedUser.totalSpent / 1000).toFixed(1)}k€`
                        : '0€'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Historique d'activité
                </h4>
                <div className="space-y-3">
                  {(mockActivityLogs[selectedUser.id] || []).map((log, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            log.type === 'login'
                              ? 'bg-blue-100 dark:bg-blue-900/30'
                              : log.type === 'order'
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : log.type === 'role_change'
                              ? 'bg-purple-100 dark:bg-purple-900/30'
                              : 'bg-gray-100 dark:bg-gray-900/30'
                          }`}
                        >
                          {log.type === 'login' && (
                            <LogIn className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          )}
                          {log.type === 'order' && (
                            <ShoppingCart className="h-4 w-4 text-green-600 dark:text-green-400" />
                          )}
                          {log.type === 'role_change' && (
                            <UserCog className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          )}
                          {log.type === 'registration' && (
                            <UserPlus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{log.description}</p>
                        <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Informations du compte
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date d'inscription</span>
                    <span className="font-medium">{selectedUser.registrationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dernière connexion</span>
                    <span className="font-medium">{selectedUser.lastLogin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID Utilisateur</span>
                    <span className="font-medium font-mono">
                      #{selectedUser.id.toString().padStart(4, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Management Modal */}
      {showRoleManagementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Gestion des Rôles et Permissions</h2>
              <button
                onClick={() => setShowRoleManagementModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {[
                {
                  name: 'Admin',
                  color: 'blue',
                  permissions: [
                    'Tous les accès',
                    'Gestion utilisateurs',
                    'Configuration système',
                    'Rapports avancés',
                  ],
                },
                {
                  name: 'Farmer',
                  color: 'green',
                  permissions: [
                    'Gérer les produits',
                    'Voir les commandes',
                    'Messagerie',
                    'Statistiques de vente',
                  ],
                },
                {
                  name: 'Customer',
                  color: 'purple',
                  permissions: [
                    'Passer des commandes',
                    'Suivre les livraisons',
                    'Messagerie',
                    "Historique d'achat",
                  ],
                },
                {
                  name: 'Logistics',
                  color: 'orange',
                  permissions: [
                    'Gérer les livraisons',
                    'Voir les itinéraires',
                    'Messagerie',
                    'Rapports logistiques',
                  ],
                },
              ].map((role) => (
                <div key={role.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium bg-${role.color}-100 text-${role.color}-700 dark:bg-${role.color}-900/30 dark:text-${role.color}-400`}
                      >
                        {role.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {mockUsers.filter((u) => u.role === role.name).length} utilisateurs
                      </span>
                    </div>
                    <button className="text-sm text-[#2563eb] hover:underline">Éditer</button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Permissions :</p>
                    <div className="grid grid-cols-2 gap-2">
                      {role.permissions.map((perm) => (
                        <label key={perm} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span>{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => toast.success('Fonctionnalité de création de rôle à venir')}
                className="w-full py-3 border-2 border-dashed rounded-lg hover:border-[#2563eb] hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-[#2563eb]"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Créer un nouveau rôle</span>
              </button>
            </div>

            <div className="sticky bottom-0 bg-card border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowRoleManagementModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  toast.success('Permissions enregistrées');
                  setShowRoleManagementModal(false);
                }}
                className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Confirmation Modal */}
      {showBulkActionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Confirmer l'action</h2>
            </div>

            <div className="p-6">
              <p className="text-muted-foreground">
                Voulez-vous vraiment appliquer l'action <strong>"{bulkAction}"</strong> à{' '}
                <strong>{selectedUsers.size}</strong> utilisateur(s) sélectionné(s) ?
              </p>

              {bulkAction === 'Attribuer un rôle' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Sélectionner un rôle</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background">
                    <option>Customer</option>
                    <option>Farmer</option>
                    <option>Logistics</option>
                    <option>Admin</option>
                  </select>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowBulkActionModal(false)}
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
    </div>
  );
}
