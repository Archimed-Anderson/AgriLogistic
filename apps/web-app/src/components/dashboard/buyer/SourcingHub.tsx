'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Search,
  MapPin,
  Timer,
  Star,
  Radar,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider-custom';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { BuyerSimulationService } from '@/services/buyer-simulation';

const MATCHES = [
  {
    id: 'PROD-2938',
    name: 'Coopérative de la Vallée',
    location: 'Saint-Louis (45km)',
    rating: 4.8,
    reliability: 98,
    price: 235,
    volume: '50T Dispo',
    matchScore: 98,
  },
  {
    id: 'PROD-1029',
    name: 'Ferme Bio Niayes',
    location: 'Thiès (120km)',
    rating: 4.9,
    reliability: 95,
    price: 245,
    volume: '12T Dispo',
    matchScore: 85,
  },
  {
    id: 'PROD-0043',
    name: 'Agro-Industrie du Sud',
    location: 'Ziguinchor (380km)',
    rating: 4.5,
    reliability: 92,
    price: 220,
    volume: '150T Dispo',
    matchScore: 78,
  },
];

export function SourcingHub() {
  const [loading, setLoading] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [results, setResults] = React.useState<any[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Simulate API Call
      const matches = await BuyerSimulationService.searchProducts('Maïs', 50);

      setLoading(false);
      setResults(matches as any[]);
      setShowResults(true);
      toast.success('AI Sourcing terminé', {
        description: `${(matches as any[]).length} producteurs compatibles trouvés dans votre zone.`,
      });
    } catch (error) {
      setLoading(false);
      toast.error('Erreur de simulation');
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* RFQ Form */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
          <CardHeader className="border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-blue-500 mb-1">
              <Rocket className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Reverse RFQ Engine
              </span>
            </div>
            <CardTitle className="text-lg font-bold text-white">Lancer un Appel d'Offres</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              L'IA ciblera automatiquement les meilleurs producteurs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400 uppercase">Produit</Label>
              <Input
                placeholder="Ex: Maïs Jaune"
                className="bg-slate-950/50 border-slate-800 text-slate-200 h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase">
                  Quantité (Tonnes)
                </Label>
                <Input
                  type="number"
                  placeholder="50"
                  className="bg-slate-950/50 border-slate-800 text-slate-200 h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase">Délai Max</Label>
                <Select>
                  <SelectTrigger className="h-9 bg-slate-950/50 border-slate-800 text-slate-200 text-xs">
                    <SelectValue placeholder="7 Jours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 Heures (Urgent)</SelectItem>
                    <SelectItem value="7d">7 Jours</SelectItem>
                    <SelectItem value="30d">30 Jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between">
                <Label className="text-xs font-bold text-slate-400 uppercase">
                  Prix Cible ($/T)
                </Label>
                <span className="text-xs font-mono font-bold text-emerald-500">220 - 260</span>
              </div>
              <Slider defaultValue={[240]} max={500} step={5} className="py-2" />
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-xs font-bold text-slate-400 uppercase">Critères Qualité</Label>
              <div className="flex flex-wrap gap-2">
                {['Grade A', 'Bio', 'FairTrade', 'Séchage <12%'].map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-[10px] border-slate-700 text-slate-400 cursor-pointer hover:border-blue-500 hover:text-blue-400 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* [NEW] Quality Predictor Upload */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <Label className="text-xs font-bold text-slate-400 uppercase flex items-center justify-between">
                <span>Qualité Ciblée (IA)</span>
                <Badge
                  variant="outline"
                  className="text-[9px] border-purple-500/30 text-purple-400"
                >
                  Quality Predictor™
                </Badge>
              </Label>
              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
                <div className="h-20 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center bg-slate-900/50 group-hover:border-blue-500 group-hover:bg-blue-900/10 transition-all">
                  <div className="flex items-center gap-2 text-slate-500 group-hover:text-blue-400">
                    <Search className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase">
                      Uploader Photo Référence
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-600 mt-1">
                    L'IA filtrera les lots similaires (Brix, Calibre)
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-xs h-10 mt-4 group"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyse AI en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Lancer Simulation{' '}
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Discovery Results */}
      <div className="col-span-12 lg:col-span-8">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full rounded-xl border border-slate-800 bg-slate-900/20 flex flex-col items-center justify-center text-center p-8 border-dashed"
            >
              <div className="h-24 w-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(37,99,235,0.1)]">
                <Search className="h-10 w-10 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-300">Sourcing Hub</h3>
              <p className="text-slate-500 text-sm max-w-md mt-2">
                Configurez votre appel d'offres à gauche pour laisser notre IA scanner le marché et
                identifier les meilleures opportunités.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  AI Discovery Results
                </h3>
                <Button
                  variant="ghost"
                  className="text-xs text-slate-500 hover:text-white"
                  onClick={() => setShowResults(false)}
                >
                  Reset
                </Button>
              </div>

              <div className="grid gap-4">
                {results.map((match, i) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all group cursor-pointer overflow-hidden relative">
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="p-4 flex flex-col md:flex-row gap-6 items-center">
                        {/* Score Radial - Simulated with generic circle */}
                        <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
                          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-slate-800"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            />
                            <path
                              className={
                                match.matchScore > 90 ? 'text-emerald-500' : 'text-blue-500'
                              }
                              strokeDasharray={`${match.matchScore}, 100`}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-xs font-black text-white">
                              {match.matchScore}%
                            </span>
                            <span className="text-[6px] uppercase font-bold text-slate-500">
                              Match
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                          <div>
                            <h4 className="font-bold text-white text-sm truncate">{match.name}</h4>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <MapPin size={10} /> {match.location}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase block">
                              Fiabilité
                            </span>
                            <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                              <ShieldCheck size={12} /> {match.reliability}/100
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase block">
                              Prix/Tonne
                            </span>
                            <span className="font-mono font-bold text-white text-sm">
                              ${match.price}
                            </span>
                          </div>

                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-500 font-bold uppercase block">
                              Volume
                            </span>
                            <Badge
                              variant="outline"
                              className="border-blue-500/20 bg-blue-500/10 text-blue-400 text-[10px] uppercase"
                            >
                              {match.volume}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 w-full md:w-auto">
                          <Button
                            size="sm"
                            className="flex-1 bg-white hover:bg-slate-200 text-slate-900 font-bold text-xs h-8"
                          >
                            Négocier
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Mini Radar Chart Simulation */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <Card className="bg-slate-900/50 border-slate-800 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-slate-800 rounded flex items-center justify-center text-blue-500">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">
                        Tendance Prix
                      </span>
                      <span className="text-xs font-bold text-white">Stable (-0.4%)</span>
                    </div>
                  </div>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-slate-800 rounded flex items-center justify-center text-emerald-500">
                      <Scale size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">
                        Qualité Moyenne
                      </span>
                      <span className="text-xs font-bold text-white">Grade A (92%)</span>
                    </div>
                  </div>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-slate-800 rounded flex items-center justify-center text-amber-500">
                      <Timer size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">
                        Délai Moyen
                      </span>
                      <span className="text-xs font-bold text-white">48 Heures</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
