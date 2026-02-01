import {
  LayoutDashboard,
  Zap,
  Bell,
  Users,
  UserCheck,
  ShieldCheck,
  Sprout,
  Cuboid as DigitalTwin,
  Droplets,
  CloudSun,
  Truck,
  Car,
  Radio,
  Landmark,
  Lock,
  BrainCircuit,
  Cpu,
  Server,
  Monitor,
  FileBarChart,
  BarChart3,
  ShoppingBag,
  Wrench,
  Share2,
  Newspaper,
  Settings,
  Tractor,
  ClipboardCheck,
  UsersRound,
  Package,
  Layout,
  QrCode,
  Leaf,
  Globe,
  FileCheck2,
  BaggageClaim,
  Banknote,
  Coins,
  History,
  CreditCard,
  TrendingUp,
  Satellite,
  Handshake,
  Code,
  Megaphone,
  LifeBuoy,
  Shield,
  HardDrive,
  ToggleLeft,
} from 'lucide-react';

export interface AdminRoute {
  label: string;
  icon: any;
  path: string;
  badge?: string;
  subItems?: AdminRoute[];
  priority?: boolean;
}

export interface AdminGroup {
  group: string;
  items: AdminRoute[];
}

export const adminRoutes: AdminGroup[] = [
  {
    group: '🎯 COMMAND CENTER',
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'War Room', path: '/admin/war-room', icon: Zap, priority: true, badge: 'LIVE' },
      {
        label: 'Digital Twin Global',
        path: '/admin/digital-twin',
        icon: DigitalTwin,
        priority: true,
      },
      { label: 'Notifications', path: '/admin/notifications', icon: Bell, badge: '12' },
    ],
  },
  {
    group: '🚜 OPÉRATIONS',
    items: [
      {
        label: 'Suivi des Récoltes',
        path: '/admin/operations/productions',
        icon: Sprout,
        badge: 'NEW',
      },
      {
        label: 'Supervision Marketplace',
        path: '/admin/operations/marketplace',
        icon: ShoppingBag,
      },
      { label: 'Fleet Commander', path: '/admin/operations/fleet', icon: Truck },
    ],
  },
  {
    group: '👥 GOUVERNANCE',
    items: [
      { label: 'Utilisateurs', path: '/admin/users', icon: Users },
      { label: 'Vérification KYC', path: '/admin/governance/kyc', icon: UserCheck, badge: '5' },
      { label: 'Rôles & Permissions', path: '/admin/governance/rbac', icon: ShieldCheck },
      { label: 'Blockchain Explorer', path: '/admin/governance/blockchain', icon: Landmark },
      { label: 'Data Quality / Integrity', path: '/admin/data-quality', icon: FileCheck2 },
      {
        label: 'Fraud Detection',
        path: '/admin/fraud-detection',
        icon: ShieldCheck,
        badge: 'ALERT',
      },
      { label: 'Support & Litiges', path: '/admin/support', icon: Bell, badge: '12' },
    ],
  },
  {
    group: '🌾 ÉCOSYSTÈME AGRICOLE',
    items: [
      { label: 'Crop Intelligence', path: '/admin/crop-intelligence', icon: Sprout },
      {
        label: 'Satellite Imagery',
        path: '/admin/satellite-imagery',
        icon: Satellite,
        badge: 'NEW',
      },
      { label: 'Digital Twin', path: '/admin/construction', icon: DigitalTwin },
      { label: 'Sol & Eau', path: '/admin/soil-water', icon: Droplets },
      { label: 'Météo', path: '/admin/weather', icon: CloudSun },
      { label: 'Équipements', path: '/admin/equipment', icon: Tractor },
      { label: 'Gestion des tâches', path: '/admin/task-management', icon: ClipboardCheck },
      { label: "Main-d'oeuvre", path: '/admin/labor-management', icon: UsersRound },
    ],
  },
  {
    group: '🚚 LOGISTIQUE & TRANSPORT',
    items: [
      {
        label: 'Command Center',
        path: '/admin/logistics/command-center',
        icon: Zap,
        priority: true,
        badge: 'LIVE',
      },
      {
        label: 'Gestion des Missions',
        path: '/admin/logistics/missions',
        icon: Radio,
        priority: true,
      },
      { label: 'Gestion de Flotte', path: '/admin/logistics/fleet', icon: Truck },
      { label: 'Bourse de Fret', path: '/admin/logistics/freight', icon: Radio },
      { label: 'IoT Real-time', path: '/admin/logistics/iot', icon: Radio },
      {
        label: 'Optimisation VRP',
        path: '/admin/logistics/vrp',
        icon: BrainCircuit,
        badge: 'AI',
        priority: true,
      },
    ],
  },
  {
    group: '💰 FINANCE & AGRI-SCORE',
    items: [
      {
        label: 'Agri-Score Dashboard',
        path: '/admin/finance/agri-score',
        icon: BaggageClaim,
        badge: 'AI',
        priority: true,
      },
      { label: 'Gestion des Prêts', path: '/admin/finance/loans', icon: Banknote },
      { label: 'Analyse des Risques', path: '/admin/finance/risk-analysis', icon: ShieldCheck },
      { label: 'Supervision Globale', path: '/admin/finance', icon: Landmark },
      {
        label: 'Hub de Paiements',
        path: '/admin/finance/payments',
        icon: CreditCard,
        badge: 'NEW',
      },
      {
        label: 'Commissions & Revenus',
        path: '/admin/finance/monetization',
        icon: Banknote,
        badge: 'PRO',
      },
      { label: 'Tarifs Dynamiques', path: '/admin/finance/pricing', icon: Zap, badge: 'AI' },
      { label: 'Escrow & Garanties', path: '/admin/finance/escrow', icon: Lock },
      { label: 'Historique Crédit', path: '/admin/finance/credit-history', icon: History },
    ],
  },
  {
    group: '🤖 INTELLIGENCE ARTIFICIELLE',
    items: [
      { label: 'IA Insights', path: '/admin/ai-insights', icon: BrainCircuit },
      { label: 'IA Models MGMT', path: '/admin/ai-models', icon: Cpu },
      { label: 'Predictive Hub', path: '/admin/ai-predictions', icon: TrendingUp, badge: 'AI' },
    ],
  },
  {
    group: '📡 INFRASTRUCTURE',
    items: [
      { label: 'IoT Hub', path: '/admin/iot-hub', icon: Server },
      { label: 'Device Management', path: '/admin/device-management', icon: Monitor },
      { label: 'Network Health', path: '/admin/network-health', icon: Radio, badge: 'LIVE' },
    ],
  },
  {
    group: '📊 ANALYTICS',
    items: [
      { label: 'Global Explorer', path: '/admin/analytics/global', icon: BarChart3, badge: 'OLAP' },
      { label: 'Flux Map 3D', path: '/admin/analytics/flux-map', icon: Globe, badge: 'LIVE' },
      { label: 'Performance & SLA', path: '/admin/analytics/performance', icon: Zap, badge: 'KPI' },
      { label: 'Compliance Exports', path: '/admin/reports/compliance', icon: FileCheck2 },
      { label: 'Rapports', path: '/admin/reports', icon: FileBarChart },
      { label: 'KPIs Temps Réel', path: '/admin/construction', icon: BarChart3 },
    ],
  },
  {
    group: '🌍 EXPANSION',
    items: [
      { label: 'Marketplace Manager', path: '/admin/marketplace', icon: ShoppingBag },
      {
        label: 'Global Footprint',
        path: '/admin/expansion/global-footprint',
        icon: Globe,
        badge: 'OPS',
      },
      {
        label: 'Partnerships CRM',
        path: '/admin/expansion/partnerships',
        icon: Handshake,
        badge: 'NEXUS',
      },
      { label: 'Gestion Loueur', path: '/admin/loueur-manager', icon: Wrench },
      { label: 'Affiliation Hub', path: '/admin/affiliation-manager', icon: Share2 },
      { label: 'Inventory Global', path: '/admin/products', icon: Package },
    ],
  },
  {
    group: '🛠️ DEVELOPER & API',
    items: [
      { label: 'Developer Studio', path: '/admin/developer/platform', icon: Code, badge: 'API' },
    ],
  },
  {
    group: '📣 COMMUNICATION & CRM',
    items: [
      {
        label: 'Notification Center',
        path: '/admin/communication/notifications',
        icon: Megaphone,
        badge: 'PUSH',
      },
    ],
  },
  {
    group: '🤝 COMMUNITY & SOCIAL',
    items: [{ label: 'Farmers Forum', path: '/admin/community/forum', icon: Users, badge: 'NEW' }],
  },
  {
    group: '🛡️ SYSTEM & SECURITY',
    items: [
      { label: 'Security SOC', path: '/admin/security/soc', icon: Shield, badge: 'SEC' },
      { label: 'Backups & DR', path: '/admin/security/backups', icon: HardDrive },
      { label: 'Feature Flags', path: '/admin/system/feature-flags', icon: ToggleLeft },
      { label: 'Multi-Tenancy', path: '/admin/system/tenants', icon: Globe },
      { label: 'Maintenance & Ops', path: '/admin/system/maintenance', icon: Wrench },
    ],
  },
  {
    group: '🎓 SUPPORT & ACADEMY',
    items: [
      {
        label: 'Knowledge Base',
        path: '/admin/support/help-center',
        icon: LifeBuoy,
        badge: 'HELP',
      },
    ],
  },
  {
    group: '🔗 TRAÇABILITÉ & ESG',
    items: [
      { label: 'Certifications', path: '/admin/traceability/certifications', icon: FileCheck2 },
      {
        label: 'Suivi des Lots',
        path: '/admin/traceability/lots',
        icon: QrCode,
        badge: 'BLOCKCHAIN',
      },
      { label: 'Dashboard ESG', path: '/admin/traceability/esg', icon: Leaf },
      { label: 'Vérification Globale', path: '/admin/traceability/verification', icon: Globe },
    ],
  },
  {
    group: '📝 CONTENU',
    items: [{ label: 'Blog & Events', path: '/admin/blog-events', icon: Newspaper, badge: 'BETA' }],
  },
  {
    group: '⚙️ SYSTÈME',
    items: [{ label: 'Paramètres', path: '/admin/settings', icon: Settings }],
  },
];
