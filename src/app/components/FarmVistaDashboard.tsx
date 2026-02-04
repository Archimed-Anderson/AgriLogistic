import { useMemo, useState } from 'react';
import {
  ChevronDown,
  Download,
  ArrowRight,
  MapPin,
  Sun,
  Cloud,
  TrendingUp,
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  MessageSquare,
  LineChart,
  BookOpen,
  Tractor,
  Bell,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

function RadialProduction() {
  // Simple SVG radial segmented chart (static, FarmVista-like).
  const segments = useMemo(
    () => [
      { color: '#22C55E', value: 40, label: 'Wheat' },
      { color: '#10B981', value: 30, label: 'Corn' },
      { color: '#3B82F6', value: 10, label: 'Rice' },
      { color: '#A855F7', value: 20, label: 'Other' },
    ],
    []
  );

  const total = segments.reduce((a, s) => a + s.value, 0);
  const radius = 52;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-semibold text-[#111827]">Production Overview</div>
        <div className="mt-1 text-xs text-[#6B7280]">Yearly</div>
      </div>
      <div className="relative h-[140px] w-[140px]">
        <svg viewBox="0 0 140 140" className="h-full w-full">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#EEF2F7" strokeWidth={stroke} />
          {segments.map((s) => {
            const len = (s.value / total) * circumference;
            const dasharray = `${len} ${circumference - len}`;
            const dashoffset = -offset;
            offset += len;
            return (
              <circle
                key={s.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={dasharray}
                strokeDashoffset={dashoffset}
                transform="rotate(-90 70 70)"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-[22px] font-semibold text-[#111827]">1,000</div>
            <div className="text-[11px] text-[#6B7280]">tons</div>
          </div>
        </div>
      </div>
    </div>
  );
}

type FarmVistaDashboardProps = {
  onNavigate?: (route: string) => void;
};

export function FarmVistaDashboard({ onNavigate }: FarmVistaDashboardProps) {
  const [period, setPeriod] = useState<'Ce mois-ci' | 'Cette semaine'>('Ce mois-ci');
  const todayLabel = useMemo(() => {
    const d = new Date();
    const weekday = d.toLocaleDateString('fr-FR', { weekday: 'long' });
    const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    return { weekday, date };
  }, []);

  const kpis = useMemo(
    () => [
      { label: 'Revenus mensuels', value: 'â‚¬45 890', delta: '+23%', icon: TrendingUp },
      { label: 'Commandes actives', value: '127', delta: '+12%', icon: ShoppingCart },
      { label: 'Produits en stock', value: '1 234', delta: '+8%', icon: Package },
      { label: 'Utilisateurs actifs', value: '245', delta: '+15%', icon: Users },
    ],
    []
  );

  const quickAccess = useMemo(
    () => [
      { label: 'Marketplace', icon: ShoppingCart, route: '/admin/marketplace' },
      { label: 'Chat', icon: MessageSquare, route: '/admin/chat' },
      { label: 'Analytics', icon: LineChart, route: '/admin/analytics' },
      { label: 'Blog', icon: BookOpen, route: '/admin/blog' },
      { label: 'Académie', icon: BookOpen, route: '/admin/academy' },
      { label: 'Loueur', icon: Tractor, route: '/admin/rental' },
    ],
    []
  );

  const recentActivity = useMemo(
    () => [
      {
        title: 'Nouvelle commande #1245',
        subtitle: 'Tracteur John Deere â€¢ â‚¬45 000',
        time: 'Il y a 5 min',
      },
      { title: 'Stock faible', subtitle: '15 articles à réapprovisionner', time: 'Il y a 15 min' },
      {
        title: 'Nouveaux utilisateurs',
        subtitle: '5 inscriptions via la marketplace',
        time: 'Il y a 1 h',
      },
      {
        title: 'Livraison effectuée',
        subtitle: "Système d'irrigation automatique",
        time: 'Il y a 2 h',
      },
    ],
    []
  );

  const importantNotifications = useMemo(
    () => [
      { level: 'info', label: 'Rappel', text: 'Pensez à exporter vos rapports hebdomadaires.' },
      { level: 'warn', label: 'Alerte', text: 'Risque de gel nocturne mercredi (module météo).' },
    ],
    []
  );

  const go = (route: string) => {
    onNavigate?.(route);
  };

  return (
    <div className="space-y-4">
      {/* Header row (FarmVista-like) */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[22px] font-semibold text-[#111827]">Bonjour !</div>
          <div className="text-[12px] text-[#6B7280]">
            Pilotez vos opérations avec des insights temps réel â€” style FarmVista, contenu
            AgriLogistic.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9 rounded-lg border-[#E5E7EB] bg-white text-[13px] text-[#111827] hover:bg-[#F3F4F6]"
            onClick={() => setPeriod(period === 'Ce mois-ci' ? 'Cette semaine' : 'Ce mois-ci')}
          >
            {period}
            <ChevronDown className="ml-2 h-4 w-4 text-[#6B7280]" />
          </Button>
          <Button className="h-9 rounded-lg bg-[#0B7A4B] text-[13px] text-white hover:bg-[#0A6B42]">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Top grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Weather card */}
        <Card className="rounded-2xl border-[#EEF2F7] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF5EE] px-3 py-1 text-[12px] font-medium text-[#0B7A4B]">
              <MapPin className="h-4 w-4" />
              Paris, France
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-2 py-1 text-[12px] text-[#111827]">
                C
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-2 py-1 text-[12px] text-[#6B7280]">
                F
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[14px] font-semibold text-[#111827]">{todayLabel.weekday}</div>
              <div className="text-[11px] text-[#6B7280]">{todayLabel.date}</div>
              <div className="mt-3 text-[34px] font-semibold text-[#111827]">24Â° C</div>
              <div className="text-[11px] text-[#6B7280]">Max 27Â° â€¢ Min 10Â°</div>
            </div>
            <div className="flex flex-col items-end justify-center">
              <div className="grid place-items-center rounded-2xl bg-[#F8FAFC] p-3">
                <Sun className="h-10 w-10 text-[#F59E0B]" />
              </div>
              <div className="mt-2 text-[13px] font-medium text-[#111827]">
                Partiellement nuageux
              </div>
              <div className="text-[11px] text-[#6B7280]">Ressenti 26</div>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              className="h-9 w-full rounded-lg border-[#E5E7EB] bg-white text-[13px] text-[#111827] hover:bg-[#F3F4F6]"
              onClick={() => go('/admin/weather')}
            >
              Ouvrir le module météo
              <ArrowRight className="ml-2 h-4 w-4 text-[#6B7280]" />
            </Button>
          </div>
        </Card>

        {/* Production overview */}
        <Card className="rounded-2xl border-[#EEF2F7] bg-white p-4 shadow-sm">
          <RadialProduction />
          <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-[#6B7280]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" /> Blé : 40%
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Maïs : 30%
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#3B82F6]" /> Riz : 10%
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#A855F7]" /> Autres : 20%
            </span>
          </div>
        </Card>

        {/* KPI column */}
        <div className="grid gap-4">
          <Card className="rounded-2xl border-[#EEF2F7] bg-white p-4 shadow-sm">
            <div className="text-[12px] text-[#6B7280]">Surface totale</div>
            <div className="mt-1 text-[20px] font-semibold text-[#111827]">1 200 acres</div>
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#0B7A4B]">
              <TrendingUp className="h-4 w-4" /> +8% vs mois précédent
            </div>
          </Card>
          <Card className="rounded-2xl border-[#EEF2F7] bg-white p-4 shadow-sm">
            <div className="text-[12px] text-[#6B7280]">Revenus</div>
            <div className="mt-1 text-[20px] font-semibold text-[#111827]">â‚¬50 000</div>
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#0B7A4B]">
              <TrendingUp className="h-4 w-4" /> +12% vs mois précédent
            </div>
          </Card>
        </div>
      </div>

      {/* KPI cards (AgriLogistic data style in FarmVista layout) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="rounded-2xl border-[#EEF2F7] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF5EE] text-[#0B7A4B]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-[#EAF5EE] px-2 py-1 text-[11px] font-semibold text-[#0B7A4B]">
                  {k.delta}
                </span>
              </div>
              <div className="mt-3 text-[12px] text-[#6B7280]">{k.label}</div>
              <div className="mt-1 text-[20px] font-semibold text-[#111827]">{k.value}</div>
            </Card>
          );
        })}
      </div>

      {/* Middle grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Monthly Yield Analysis */}
        <Card className="rounded-2xl border-[#EEF2F7] bg-white p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] font-semibold text-[#111827]">
                Analyse de rendement mensuel
              </div>
              <div className="text-[11px] text-[#6B7280]">Maïs</div>
            </div>
            <Button
              variant="outline"
              className="h-8 rounded-lg border-[#E5E7EB] bg-white text-[12px] text-[#111827] hover:bg-[#F3F4F6]"
            >
              2024
              <ChevronDown className="ml-2 h-4 w-4 text-[#6B7280]" />
            </Button>
          </div>
          {/* Lightweight â€œchartâ€ placeholder to match layout */}
          <div className="mt-4 h-[180px] rounded-xl bg-gradient-to-b from-[#F8FAFC] to-white p-4">
            <div className="h-full w-full rounded-lg border border-dashed border-[#E5E7EB] grid place-items-center text-[12px] text-[#6B7280]">
              Graphique (rendement)
            </div>
          </div>
        </Card>

        {/* Field photo card */}
        <Card className="rounded-2xl border-[#EEF2F7] bg-white p-4 shadow-sm">
          <div className="h-[180px] rounded-xl bg-gradient-to-br from-[#DCFCE7] to-[#E0F2FE] grid place-items-center">
            <Cloud className="h-10 w-10 text-[#0B7A4B]" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-[13px] font-semibold text-[#111827]">Parcelle Maïs</div>
            <Button
              variant="outline"
              className="h-8 rounded-lg border-[#E5E7EB] bg-white text-[12px] text-[#111827] hover:bg-[#F3F4F6]"
            >
              Détails
            </Button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-[#F8FAFC] p-2">
              <div className="text-[11px] text-[#6B7280]">Santé</div>
              <div className="text-[12px] font-semibold text-[#111827]">Bon</div>
            </div>
            <div className="rounded-lg bg-[#F8FAFC] p-2">
              <div className="text-[11px] text-[#6B7280]">Semis</div>
              <div className="text-[12px] font-semibold text-[#111827]">16 Mar</div>
            </div>
            <div className="rounded-lg bg-[#F8FAFC] p-2">
              <div className="text-[11px] text-[#6B7280]">Récolte</div>
              <div className="text-[12px] font-semibold text-[#111827]">6 mois</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom grid: quick access + activity + notifications */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-[#EEF2F7] bg-white p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-semibold text-[#111827]">Accès rapide</div>
            <div className="text-[11px] text-[#6B7280]">Modules principaux</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {quickAccess.map((q) => {
              const Icon = q.icon;
              return (
                <button
                  key={q.route}
                  type="button"
                  className="group flex items-center gap-3 rounded-xl border border-[#EEF2F7] bg-white px-3 py-3 text-left hover:bg-[#F8FAFC] transition-colors"
                  onClick={() => go(q.route)}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF5EE] text-[#0B7A4B]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-[#111827]">
                      {q.label}
                    </div>
                    <div className="text-[11px] text-[#6B7280]">Ouvrir</div>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-[#9CA3AF] group-hover:text-[#6B7280]" />
                </button>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="rounded-2xl border-[#EEF2F7] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-[14px] font-semibold text-[#111827]">Activité récente</div>
              <Button
                variant="outline"
                className="h-8 rounded-lg border-[#E5E7EB] bg-white text-[12px] text-[#111827] hover:bg-[#F3F4F6]"
                onClick={() => go('/admin/reports')}
              >
                Voir rapports
                <ArrowRight className="ml-2 h-4 w-4 text-[#6B7280]" />
              </Button>
            </div>
            <div className="mt-3 space-y-3">
              {recentActivity.map((a) => (
                <div key={a.title} className="flex items-start gap-3 rounded-xl bg-[#F8FAFC] p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white ring-1 ring-[#EEF2F7]">
                    <BarChart3 className="h-4 w-4 text-[#0B7A4B]" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-[#111827]">
                      {a.title}
                    </div>
                    <div className="truncate text-[11px] text-[#6B7280]">{a.subtitle}</div>
                    <div className="mt-1 text-[11px] text-[#9CA3AF]">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border-[#EEF2F7] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-[14px] font-semibold text-[#111827]">Notifications</div>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-[12px] font-medium text-[#0B7A4B] hover:underline"
                onClick={() => go('/admin/notifications')}
              >
                <Bell className="h-4 w-4" />
                Ouvrir
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {importantNotifications.map((n) => (
                <div key={n.text} className="rounded-xl bg-[#F8FAFC] p-3">
                  <div className="text-[11px] font-semibold text-[#111827]">{n.label}</div>
                  <div className="text-[12px] text-[#6B7280]">{n.text}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
