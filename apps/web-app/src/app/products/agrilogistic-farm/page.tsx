'use client';

import React, { useState } from 'react';

import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sprout,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Play,
  Users,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { farmPlots, farmWeather, farmArticles, farmVideos, FarmPlot } from '@/data/farm-data';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Lazy load 3D component (Client-side only)
const Farm3DViewer = dynamic(
  () => import('@/components/products/farm/Farm3DViewer').then((mod) => mod.Farm3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-slate-900 rounded-3xl animate-pulse border border-slate-700 flex items-center justify-center text-green-500 font-mono text-sm">
        LOADING DIGITAL TWIN...
      </div>
    ),
  }
);

export default function AgriLogisticFarmPage() {
  const [selectedPlot, setSelectedPlot] = useState<FarmPlot | null>(farmPlots[0]);
  const [activeTab, setActiveTab] = useState('Tous');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-green-500/30">
      {/* MINIMAL HEADER */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="container mx-auto">
          <a href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white drop-shadow-md">
              AgriLogistic
            </span>
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-green-950/90 z-0">
          <Image
            src="/assets/images/landing/hero-farm-bg.jpg"
            alt="Farm Background"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/50 to-slate-50 dark:to-slate-900" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge
            variant="outline"
            className="mb-6 border-green-500 text-green-400 uppercase tracking-widest backdrop-blur-md"
          >
            AgriLogistic Farm v3.0
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
            AgriLogistic Farm : <br />
            <span className="text-green-500">L'Agriculture 4.0</span> à portée de main
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            Optimisez vos rendements grâce à l'Intelligence Artificielle et aux jumeaux numériques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-bold bg-green-600 hover:bg-green-500 shadow-xl shadow-green-900/20 rounded-full"
            >
              Essayer la Démo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg font-bold border-white/20 text-white hover:bg-white/10 rounded-full backdrop-blur-sm"
            >
              <Play className="mr-2 h-5 w-5" /> Vidéo de présentation
            </Button>
          </div>
        </div>
      </section>

      {/* MA FERME DIGITALE (3D SECTION) */}
      <section className="container mx-auto px-4 -mt-16 relative z-20 mb-24">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <Sprout className="h-8 w-8 text-green-600" />
                Ma Ferme Digitale (Démo Interactive)
              </h2>
              <p className="text-lg text-muted-foreground mt-1">
                Visualisez vos parcelles en 3D et recevez des conseils agronomiques ciblés.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-800">
              <CloudRain className="h-6 w-6 text-blue-500" />
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-300">
                  Météo en Direct (Yamoussoukro)
                </div>
                <div className="text-lg font-black">
                  {farmWeather.current.temp}°C • {farmWeather.current.condition}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px] lg:h-[500px]">
            {/* Colonne Gauche : Liste Parcelles */}
            <div className="flex flex-col gap-4 overflow-y-auto pr-2">
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest mb-2">
                Vos Parcelles
              </h3>
              {farmPlots.map((plot) => (
                <div
                  key={plot.id}
                  onClick={() => setSelectedPlot(plot)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPlot?.id === plot.id
                      ? 'bg-green-50 border-green-500 ring-1 ring-green-500 dark:bg-green-900/20'
                      : 'bg-slate-50 border-slate-200 hover:border-green-300 dark:bg-slate-900 dark:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{plot.name}</h4>
                    <Badge
                      className={
                        plot.status === 'optimal'
                          ? 'bg-green-500'
                          : plot.status === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      }
                    >
                      {plot.healthScore}% S.
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 text-xs text-muted-foreground gap-y-1">
                    <span>
                      Culture : <span className="font-medium text-foreground">{plot.crop}</span>
                    </span>
                    <span>
                      Stade : <span className="font-medium text-foreground">{plot.stage}</span>
                    </span>
                    <span className="col-span-2 flex items-center gap-1 mt-1 text-blue-600 dark:text-blue-400">
                      <Droplets className="h-3 w-3" /> Humidité : {plot.moisture}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Colonne Milieu : 3D Viewer */}
            <div className="lg:col-span-2 relative h-full flex flex-col gap-4">
              <div className="flex-1 rounded-3xl overflow-hidden bg-slate-900 shadow-inner relative">
                <Farm3DViewer selectedPlot={selectedPlot} />

                {/* Overlay IA Suggestion */}
                {selectedPlot && (
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-green-200 dark:border-green-900 shadow-xl animate-in slide-in-from-bottom-5">
                    <div className="flex gap-4 items-start">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg shrink-0">
                        <Sprout className="h-6 w-6 text-green-700 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-green-800 dark:text-green-300 text-sm uppercase mb-1 flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          AgriBrain AI Suggestion
                        </h4>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {selectedPlot.moisture < 50
                            ? "Niveau d'humidité critique détecté. Irrigation recommandée ce soir à 19h00 pour éviter le stress hydrique."
                            : 'Conditions optimales. Aucune action requise pour le moment. Prochaine fertilisation suggérée dans 3 jours.'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white shrink-0"
                      >
                        Appliquer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESOURCES SECTION */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-2 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Académie AgriLogistic
              </h2>
              <p className="text-lg text-muted-foreground font-medium max-w-2xl">
                Accédez à notre bibliothèque de contenus : guides techniques, analyses de marché et
                tutoriels vidéo.
              </p>
            </div>
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              {['Tous', 'Innovation', 'Tutoriel', 'Marché', 'Bio'].map((filter) => (
                <Badge
                  key={filter}
                  variant={filter === activeTab ? 'default' : 'outline'}
                  onClick={() => setActiveTab(filter)}
                  className={`cursor-pointer px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                    filter === activeTab
                      ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20 scale-105'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {filter}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Column (8 cols) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Main Video Section (Only show on 'Tous' or 'Tutoriel') */}
              {(activeTab === 'Tous' || activeTab === 'Tutoriel') && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="h-5 w-5 text-red-500 fill-current" />
                    <h3 className="font-bold text-xl">Vidéo à la Une</h3>
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video relative group ring-4 ring-white dark:ring-slate-800 transition-all hover:ring-green-500/30">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${farmVideos[0].youtubeId}?rel=0&modestbranding=1`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0"
                    ></iframe>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{farmVideos[0].title}</h3>
                    <p className="text-muted-foreground">
                      Une introduction essentielle aux enjeux de la digitalisation pour les
                      exploitations agricoles modernes en Afrique.
                    </p>
                  </div>
                </div>
              )}

              {/* Articles Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <h3 className="font-bold text-xl">
                      {activeTab === 'Tous' ? 'Derniers Articles' : `Articles : ${activeTab}`}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {
                      farmArticles.filter((a) => activeTab === 'Tous' || a.category === activeTab)
                        .length
                    }{' '}
                    résultats
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {farmArticles
                    .filter((article) => activeTab === 'Tous' || article.category === activeTab)
                    .map((article) => (
                      <a
                        key={article.id}
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex flex-col gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 animate-in zoom-in-95"
                      >
                        <div className="w-full aspect-[4/3] shrink-0 rounded-xl bg-slate-200 overflow-hidden relative shadow-md">
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-green-700 dark:text-green-400">
                            {article.category}
                          </div>
                        </div>
                        <div className="flex flex-col flex-1 py-1">
                          <h3 className="text-lg font-bold mb-3 leading-snug group-hover:text-green-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-auto leading-relaxed">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-700 pt-4 mt-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                {article.author}
                              </span>
                            </div>
                            <div className="flex items-center text-xs font-black text-green-600 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                              Lire <ArrowRight className="ml-1 h-3 w-3" />
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                </div>
                {/* Empty State */}
                {farmArticles.filter((a) => activeTab === 'Tous' || a.category === activeTab)
                  .length === 0 && (
                  <div className="text-center py-20 text-muted-foreground bg-slate-100/50 rounded-3xl border border-dashed border-slate-200">
                    Aucun article trouvé dans cette catégorie.
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Column (4 cols) */}
            <div
              className={`lg:col-span-4 space-y-8 ${activeTab !== 'Tous' ? 'opacity-50 pointer-events-none grayscale transition-all' : 'transition-all'}`}
            >
              {/* Newsletter Card */}
              <div className="bg-green-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sprout className="h-32 w-32 rotate-12" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Restez Informé</h3>
                  <p className="text-green-100 mb-6 text-sm">
                    Recevez chaque semaine nos conseils agronomiques et les tendances du marché
                    directement par email.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      className="w-full h-10 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <Button className="w-full bg-white text-green-900 hover:bg-green-50 font-bold">
                      S'inscrire
                    </Button>
                  </div>
                </div>
              </div>

              {/* Trending Topics / Tags */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Wind className="h-4 w-4 text-blue-500" /> Sujets du Moment
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    '#AgriTech',
                    '#CacaoDurable',
                    '#Irrigation',
                    '#Drones',
                    '#FinTech',
                    '#Climat',
                    '#BioControls',
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-green-600 hover:bg-green-50 cursor-pointer transition-colors block"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Download Resource */}
              <a
                href="#"
                className="block bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-6 border border-blue-100 dark:border-blue-800 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                    <CloudRain className="h-6 w-6" />
                  </div>
                  <Badge className="bg-blue-600 hover:bg-blue-700">PDF Gratuit</Badge>
                </div>
                <h4 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  Calendrier Cultural 2026
                </h4>
                <p className="text-sm text-slate-500 mb-4">
                  Téléchargez le guide complet des semis et récoltes pour la zone Afrique de
                  l'Ouest.
                </p>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center">
                  Télécharger <ArrowRight className="ml-2 h-3 w-3" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-green-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/images/patterns/topography.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight">
            Prêt à digitaliser votre exploitation ?
          </h2>
          <p className="text-green-100 text-xl max-w-2xl mx-auto mb-10">
            Rejoignez plus de 5,000 agriculteurs qui utilisent AgriLogistic Farm pour sécuriser
            leurs récoltes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold">
              Créer un compte
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-10 text-lg font-bold text-white border-white/20 hover:bg-white/10"
            >
              Contacter un expert
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
