'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  ArrowRight,
  Leaf,
  Fuel,
  TrendingUp,
  Package,
  Sparkles,
  Zap,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip as LeafletTooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icons
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

// Points de livraison (Dakar & région)
const LOCATIONS = [
  { id: 1, name: 'Dépôt Central (Dakar)', lat: 14.7167, lng: -17.4677, type: 'start' },
  { id: 2, name: 'Marché Tilène', lat: 14.6937, lng: -17.4477, type: 'delivery' },
  { id: 3, name: 'Rufisque Centre', lat: 14.716, lng: -17.2721, type: 'delivery' },
  { id: 4, name: 'Diamniadio Pole', lat: 14.7258, lng: -17.1853, type: 'delivery' },
  { id: 5, name: 'Ferme Touba (Returns)', lat: 14.74, lng: -17.15, type: 'return' },
];

// Routes
const UNOPTIMIZED_ROUTE: [number, number][] = [
  [LOCATIONS[0].lat, LOCATIONS[0].lng], // Start
  [LOCATIONS[3].lat, LOCATIONS[3].lng], // Diamniadio
  [LOCATIONS[1].lat, LOCATIONS[1].lng], // Tilène (Backtrack!)
  [LOCATIONS[2].lat, LOCATIONS[2].lng], // Rufisque
  [LOCATIONS[0].lat, LOCATIONS[0].lng], // Return
];

const OPTIMIZED_ROUTE: [number, number][] = [
  [LOCATIONS[0].lat, LOCATIONS[0].lng], // Start
  [LOCATIONS[1].lat, LOCATIONS[1].lng], // Tilène
  [LOCATIONS[2].lat, LOCATIONS[2].lng], // Rufisque
  [LOCATIONS[3].lat, LOCATIONS[3].lng], // Diamniadio
  [LOCATIONS[4].lat, LOCATIONS[4].lng], // Ferme Touba (Backhaul)
  [LOCATIONS[0].lat, LOCATIONS[0].lng], // Return
];

export function RouteOptimizerAI() {
  const [isOptimized, setIsOptimized] = React.useState(false);
  const [showPooling, setShowPooling] = React.useState(false);

  const handleOptimize = () => {
    setIsOptimized(true);
    setTimeout(() => setShowPooling(true), 1500);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 h-[800px]">
      {/* Sidebar Inputs */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <Card className="bg-slate-950/50 border-white/5 shadow-2xl rounded-3xl overflow-hidden flex-1">
          <div className="p-6 border-b border-white/5 bg-slate-900/50">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
              <MapPin className="text-emerald-500" /> Points de Passage
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Définissez vos arrêts pour le calcul
            </p>
          </div>
          <CardContent className="p-6 space-y-4 overflow-y-auto max-h-[400px]">
            {LOCATIONS.filter((l) => l.type !== 'return').map((loc, i) => (
              <div
                key={loc.id}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
              >
                <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                  {i === 0 ? 'S' : i}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-200">{loc.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full border-dashed border-white/10 text-slate-400 hover:text-white hover:bg-white/5 h-12 rounded-xl text-xs uppercase font-bold"
            >
              <Plus size={16} className="mr-2" /> Ajouter un point
            </Button>
          </CardContent>
          <div className="p-6 bg-slate-900/50 border-t border-white/5 mt-auto">
            <Button
              onClick={handleOptimize}
              disabled={isOptimized}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs h-14 rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              {isOptimized ? (
                <>
                  <Sparkles /> Itinéraire Optimisé
                </>
              ) : (
                <>
                  <Zap /> Lancer Optimisation AI
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Stats Before/After */}
        <AnimatePresence>
          {isOptimized && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              <Card className="bg-emerald-500/10 border-emerald-500/20 rounded-2xl p-4">
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                  Gain Distance
                </p>
                <p className="text-2xl font-black text-white">-45 km</p>
              </Card>
              <Card className="bg-orange-500/10 border-orange-500/20 rounded-2xl p-4">
                <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">
                  Carburant
                </p>
                <p className="text-2xl font-black text-white">-12 L</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Visualisation Map */}
      <div className="lg:col-span-8 relative rounded-[2.5rem] overflow-hidden border border-white/5 shadow-3xl bg-slate-950">
        <MapContainer
          center={[14.7167, -17.35]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; CARTO"
          />

          {/* Markers */}
          {LOCATIONS.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={icon}>
              <LeafletTooltip direction="top" offset={[0, -20]} opacity={1} permanent>
                <span className="font-bold text-xs">{loc.name}</span>
              </LeafletTooltip>
            </Marker>
          ))}

          {/* Unoptimized Route (Red) */}
          {!isOptimized && (
            <Polyline
              positions={UNOPTIMIZED_ROUTE}
              pathOptions={{ color: '#ef4444', weight: 4, opacity: 0.6, dashArray: '10' }}
            />
          )}

          {/* Optimized Route (Green) */}
          {isOptimized && (
            <Polyline positions={OPTIMIZED_ROUTE} pathOptions={{ color: '#10b981', weight: 6 }} />
          )}
        </MapContainer>

        {/* Freight Pooling Offer Overlay */}
        <AnimatePresence>
          {showPooling && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className="absolute top-6 right-6 z-[1000] w-80"
            >
              <Card className="bg-slate-950/90 backdrop-blur-xl border-emerald-500/50 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-emerald-500/20">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-white">
                    <Package size={18} />
                    <span className="font-black uppercase text-xs tracking-widest">
                      Opportunité Pooling
                    </span>
                  </div>
                  <Badge className="bg-white text-emerald-700 font-bold text-[9px]">
                    + 15.000 FCFA
                  </Badge>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-bold text-white text-lg">3t Riz à ramener</h4>
                    <p className="text-xs text-slate-400">
                      Disponible à <span className="text-emerald-400 font-bold">Ferme Touba</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 bg-white/5 p-3 rounded-xl">
                    <div className="flex flex-col">
                      <span className="uppercase text-[9px] text-slate-500 font-bold">Détour</span>
                      <span className="font-bold text-orange-400">+12 km</span>
                    </div>
                    <ArrowRight size={16} className="text-slate-600" />
                    <div className="flex flex-col text-right">
                      <span className="uppercase text-[9px] text-slate-500 font-bold">
                        Marge Nette
                      </span>
                      <span className="font-bold text-emerald-400">+18%</span>
                    </div>
                  </div>

                  <Button className="w-full bg-slate-100 hover:bg-white text-slate-900 font-black uppercase text-xs h-10 rounded-xl">
                    Accepter & Intégrer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend Overlay */}
        <div className="absolute bottom-6 left-6 z-[1000] bg-slate-950/80 backdrop-blur border border-white/10 p-3 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-red-500 rounded-full opacity-60" />
            <span className="text-[9px] font-bold text-slate-400 uppercase">Actuel (Manuel)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-emerald-500 rounded-full" />
            <span className="text-[9px] font-bold text-emerald-400 uppercase">Optimisé AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
