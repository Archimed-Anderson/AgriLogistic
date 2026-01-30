import { 
  LayoutDashboard, 
  BarChart3, 
  Sprout, 
  ClipboardList, 
  Wrench, 
  Store, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Truck, 
  Map, 
  Users, 
  ShieldCheck, 
  History, 
  Settings, 
  Cpu, 
  Radio, 
  Blocks,
  Sparkles,
  LucideIcon 
} from 'lucide-react';

export interface NavItem {
  id: string;
  title: string;
  icon: LucideIcon;
  path?: string;
  badge?: string;
  children?: NavItem[];
}

export const ADMIN_NAVIGATION: NavItem[] = [
  {
    id: 'overview',
    title: "Vue d'ensemble",
    icon: LayoutDashboard,
    children: [
      {
        id: 'war-room',
        title: 'War Room',
        icon: LayoutDashboard,
        path: '/admin',
        badge: 'Live'
      },
      {
        id: 'analytics',
        title: 'Analytics Global',
        icon: BarChart3,
        path: '/admin/analytics'
      }
    ]
  },
  {
    id: 'operations',
    title: 'Opérations',
    icon: Sprout,
    children: [
      {
        id: 'agriculture',
        title: 'Agriculture',
        icon: Sprout,
        path: '/admin/crops',
        badge: 'Suivi'
      },
      {
        id: 'tasks-labor',
        title: 'Tâches & Main d\'œuvre',
        icon: ClipboardList,
        path: '/admin/tasks'
      },
      {
        id: 'equipment',
        title: 'Equipements',
        icon: Wrench,
        path: '/admin/equipment'
      }
    ]
  },
  {
    id: 'business',
    title: 'Business',
    icon: Store,
    children: [
      {
        id: 'marketplace',
        title: 'Marketplace',
        icon: Store,
        path: '/admin/marketplace'
      },
      {
        id: 'products',
        title: 'Produits & Catalogue',
        icon: Package,
        path: '/admin/products'
      },
      {
        id: 'orders',
        title: 'Commandes',
        icon: ShoppingCart,
        path: '/admin/orders'
      },
      {
        id: 'finance',
        title: 'Finance & Revenus',
        icon: DollarSign,
        path: '/admin/finance'
      }
    ]
  },
  {
    id: 'logistics',
    title: 'Logistique',
    icon: Truck,
    children: [
      {
        id: 'tracking',
        title: 'Tracking Live',
        icon: Truck,
        path: '/admin/tracking'
      },
      {
        id: 'fleet',
        title: 'Flotte & Véhicules',
        icon: Truck,
        path: '/admin/fleet'
      },
      {
        id: 'routes',
        title: 'Calculateur Transport',
        icon: Map,
        path: '/admin/transport-calculator',
        badge: 'New'
      },
      {
        id: 'link-hub-admin',
        title: 'AgriLogistic Link Hub',
        icon: Sparkles,
        path: '/link-hub',
        badge: 'God Mode'
      },
      {
        id: 'global-monitor',
        title: 'Global Monitor Admin',
        icon: Radio,
        path: '/admin/link-monitor',
        badge: 'Admin'
      }
    ]
  },
  {
    id: 'governance',
    title: 'Gouvernance',
    icon: ShieldCheck,
    children: [
      {
        id: 'users',
        title: 'Utilisateurs',
        icon: Users,
        path: '/admin/users',
        badge: 'Prioritaire'
      },
      {
        id: 'roles',
        title: 'Rôles & Permissions',
        icon: ShieldCheck,
        path: '/admin/roles'
      },
      {
        id: 'audit',
        title: 'Audit Trail',
        icon: History,
        path: '/admin/audit'
      },
      {
        id: 'configuration',
        title: 'Configuration',
        icon: Settings,
        path: '/admin/platform'
      }
    ]
  },
  {
    id: 'innovation',
    title: 'Innovation',
    icon: Cpu,
    children: [
      {
        id: 'ai-center',
        title: 'AI Insights',
        icon: Cpu,
        path: '/admin/ai-insights'
      },
      {
        id: 'iot',
        title: 'IoT Hub',
        icon: Radio,
        path: '/admin/iot'
      },
      {
        id: 'automation',
        title: 'Automation',
        icon: Wrench, // Using Wrench as generic tool icon, could import Bot/Workflow unique icon if available
        path: '/admin/automation'
      },
      {
        id: 'blockchain',
        title: 'Blockchain Explorer',
        icon: Blocks,
        path: '/admin/blockchain'
      }
    ]
  },
  {
    id: 'extras',
    title: 'Autres Modules',
    icon: Package,
    children: [
      {
        id: 'blog',
        title: 'Blog & Évents',
        icon: ClipboardList,
        path: '/admin/blog'
      },
      {
        id: 'affiliations',
        title: 'Affiliations',
        icon: Users,
        path: '/admin/affiliate-dashboard',
        badge: '💰'
      }
    ]
  }
];
