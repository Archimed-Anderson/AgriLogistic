import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Leaf, DollarSign, Activity, Download, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="pl-0 hover:bg-transparent hover:text-primary gap-2 text-muted-foreground transition-colors font-semibold"
            onClick={() => window.location.href = '/admin/dashboard'}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la console
          </Button>
          
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase leading-tight">
              Tableau de Bord <span className="text-primary italic">AgroLogistic</span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Samedi 24 Janvier 2026 • 23:45
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-border bg-card/40 h-11 px-6 gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-accent transition-all">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
          <Button className="rounded-xl h-11 px-8 gap-2 shadow-lg shadow-primary/20 text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 transition-all">
            <AlertTriangle className="w-4 h-4" />
            Config Alertes
          </Button>
        </div>
      </div>
      
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Rendement Estimé', value: '68,4', unit: 't/ha', trend: '+12.5%', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Coût de Production', value: '1.240', unit: '€/ha', trend: '-3.2%', icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Marge Brute', value: '3.450', unit: '€/ha', trend: '+8.4%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Indice de Santé', value: '92', unit: '/100', trend: '+2.1%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'GES Économisés', value: '4,2', unit: 't CO2e', trend: '+15.3%', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border bg-card/40 backdrop-blur-xl rounded-[20px] overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <span className={`text-[10px] font-bold ${kpi.trend.startsWith('+') ? 'text-emerald-500' : 'text-blue-500'}`}>
                  {kpi.trend}
                </span>
              </div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.1em] mb-1">{kpi.label}</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-black tracking-tighter text-foreground">{kpi.value}</h3>
                <span className="text-[10px] font-bold text-muted-foreground">{kpi.unit}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border bg-card/40 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground">Utilisateurs Actifs (30 jours)</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="h-[350px] w-full rounded-2xl bg-muted/20 border border-border/50 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-6 h-6 border-b-2 border-primary animate-spin rounded-full" />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Initialisation des Graphiques...</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card/40 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground">Répartition des Revenus par Catégorie</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="h-[350px] w-full rounded-2xl bg-muted/20 border border-border/50 flex flex-col items-center justify-center space-y-4">
               <div className="flex items-center gap-1">
                 {[40, 70, 45, 90, 65].map((h, i) => (
                   <div key={i} className="w-3 bg-primary/40 rounded-t-sm animate-pulse" style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }} />
                 ))}
               </div>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Chargement des données sectorielles</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border bg-card/40 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground">Top Produits & Performance</CardTitle>
            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase underline decoration-primary underline-offset-4">Voir Rapport</Button>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-6">
              {[
                { name: 'Tomates Cerises Premium', count: 1234, growth: '+14%', status: 'In Stock' },
                { name: 'Carottes Bio Sables', count: 987, growth: '+8%', status: 'Low Stock' },
                { name: 'Pommes Gala Export', count: 856, growth: '-2%', status: 'In Stock' },
                { name: 'Salades Batavias Fraîches', count: 743, growth: '+22%', status: 'In Stock' },
                { name: 'Oignons Jaunes 5kg', count: 621, growth: '+5%', status: 'Out of Stock' },
              ].map((product, index) => (
                <div key={product.name} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-muted-foreground/50 w-4">
                      0{index + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase">{product.growth} de croissance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-black text-foreground">{product.count}</p>
                      <p className="text-[9px] font-black text-muted-foreground uppercase">Ventes</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      product.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      product.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card/40 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground">Distribution Revenus</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-8">
              {[
                { category: 'Production Légumière', percentage: 45, color: 'bg-primary' },
                { category: 'Arboriculture Fruitière', percentage: 30, color: 'bg-emerald-500' },
                { category: 'Céréaliculture', percentage: 25, color: 'bg-blue-500' },
              ].map((item) => (
                <div key={item.category} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-black text-foreground uppercase tracking-tight">
                      {item.category}
                    </span>
                    <span className="text-xl font-black text-primary tabular-nums">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-border/30 rounded-full h-3 overflow-hidden p-0.5 border border-border/20">
                    <div 
                      className={`${item.color} h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary),0.3)]`} 
                      style={{ width: `${item.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
              
              <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Observation IA</p>
                 <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                   La production légumière maintient une croissance constante de <span className="text-primary font-bold">12%</span> ce mois-ci. Optimisation logistique recommandée pour le secteur arboriculture.
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
