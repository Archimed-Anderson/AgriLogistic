'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Package,
  Calendar,
  DollarSign,
  ArrowRight,
  Truck,
  Sparkles,
  Timer,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MARKET_OFFERS = [
  {
    id: 'OFF-2049',
    origin: 'Thiès, SN',
    destination: 'Dakar, SN',
    distance: '72 km',
    cargo: 'Mangues (Fragile)',
    weight: '12 Tonnes',
    price: 350000,
    vehicleType: 'Frigo',
    pickupDate: 'Auj. 14:00',
    expiresIn: '45m',
    score: 98,
  },
  {
    id: 'OFF-2055',
    origin: 'Saint-Louis, SN',
    destination: 'Louga, SN',
    distance: '58 km',
    cargo: 'Riz Cargo',
    weight: '25 Tonnes',
    price: 420000,
    vehicleType: 'Plateau',
    pickupDate: 'Demain 08:00',
    expiresIn: '2h 15m',
    score: 85,
  },
  {
    id: 'OFF-2061',
    origin: 'Ziguinchor, SN',
    destination: 'Kaolack, SN',
    distance: '280 km',
    cargo: 'Anacarde',
    weight: '18 Tonnes',
    price: 850000,
    vehicleType: 'Bâche',
    pickupDate: 'Jeu. 10:00',
    expiresIn: '1j 4h',
    score: 92,
  },
  {
    id: 'OFF-2073',
    origin: 'Touba, SN',
    destination: 'Diourbel, SN',
    distance: '45 km',
    cargo: 'Arachides',
    weight: '32 Tonnes',
    price: 290000,
    vehicleType: 'Benne',
    pickupDate: 'Ven. 06:00',
    expiresIn: '5h 30m',
    score: 78,
  },
];

export function FreightMarketplace() {
  const [offers, setOffers] = React.useState(MARKET_OFFERS);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const handleBid = async (id: string, type: 'book' | 'bid') => {
    setProcessingId(id);

    // Simulate API
    await new Promise((r) => setTimeout(r, 1500));

    toast.success(type === 'book' ? 'Réservation Confirmée !' : 'Offre Envoyée !', {
      description:
        type === 'book'
          ? "Le contrat smart-contract a été généré. Voir 'Documents'."
          : 'Le chargeur a été notifié de votre contre-proposition.',
      icon: <Sparkles className="text-emerald-500" />,
    });

    if (type === 'book') {
      const newOffers = offers.filter((o) => o.id !== id);
      setOffers(newOffers);
    }
    setProcessingId(null);
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || offer.vehicleType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
            BOURSE DE <span className="text-emerald-500">FRET</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">
            Opportunités Temps Réel & Enchères
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Ville, Cargaison..."
              className="pl-10 h-12 bg-slate-900 border-white/5 rounded-xl text-xs font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px] h-12 bg-slate-900 border-white/5 rounded-xl text-xs font-bold">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Type Véhicule" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous Types</SelectItem>
              <SelectItem value="Frigo">Frigo</SelectItem>
              <SelectItem value="Plateau">Plateau</SelectItem>
              <SelectItem value="Bâche">Bâche</SelectItem>
              <SelectItem value="Benne">Benne</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {filteredOffers.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              layout
            >
              <Card className="bg-slate-950/40 border-white/5 hover:border-emerald-500/30 transition-all duration-300 group overflow-hidden">
                <div className="p-6 flex flex-col lg:flex-row gap-6 items-center">
                  {/* Route & Cargo Info */}
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-black tracking-widest text-slate-500 border-slate-800"
                      >
                        {offer.id}
                      </Badge>
                      <div className="flex items-center gap-2 text-orange-500 text-[10px] font-bold uppercase animate-pulse">
                        <Timer className="h-3 w-3" />
                        Expure dans {offer.expiresIn}
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="space-y-1">
                        <p className="text-xl font-black text-white">{offer.origin}</p>
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold">
                          <Calendar className="h-3 w-3" /> {offer.pickupDate}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full h-[2px] bg-slate-800 relative">
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-2 text-[10px] font-bold text-slate-500">
                            {offer.distance}
                          </div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-slate-700" />
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-emerald-500" />
                        </div>
                      </div>

                      <div className="space-y-1 text-right">
                        <p className="text-xl font-black text-white">{offer.destination}</p>
                        <div className="flex items-center gap-2 justify-end text-slate-500 text-[10px] uppercase font-bold">
                          <MapPin className="h-3 w-3" /> Destination
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <Badge className="bg-white/5 hover:bg-white/10 text-slate-300 border-none rounded-lg px-3 py-1 text-[10px] uppercase font-bold flex gap-2">
                        <Package className="h-3 w-3" /> {offer.cargo}
                      </Badge>
                      <Badge className="bg-white/5 hover:bg-white/10 text-slate-300 border-none rounded-lg px-3 py-1 text-[10px] uppercase font-bold flex gap-2">
                        <Truck className="h-3 w-3" /> {offer.vehicleType}
                      </Badge>
                      <Badge className="bg-white/5 hover:bg-white/10 text-slate-300 border-none rounded-lg px-3 py-1 text-[10px] uppercase font-bold">
                        {offer.weight}
                      </Badge>
                      {offer.score > 90 && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none rounded-lg px-3 py-1 text-[10px] uppercase font-black flex gap-2">
                          <Sparkles className="h-3 w-3" /> Match {offer.score}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="lg:border-l border-white/5 lg:pl-8 flex flex-col gap-4 min-w-[200px] w-full lg:w-auto">
                    <div className="text-right lg:text-left">
                      <p className="text-slate-500 text-[10px] font-bold uppercase">Prix Offre</p>
                      <p className="text-3xl font-black text-emerald-400">
                        {offer.price.toLocaleString()} FCFA
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs h-10 rounded-xl"
                        onClick={() => handleBid(offer.id, 'book')}
                        disabled={!!processingId}
                      >
                        {processingId === offer.id
                          ? 'Validation Smart Contract...'
                          : 'Réserver (Instant)'}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-white/10 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white font-bold uppercase text-[10px] h-8 rounded-xl"
                        onClick={() => handleBid(offer.id, 'bid')}
                        disabled={!!processingId}
                      >
                        Faire une offre
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredOffers.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <p className="text-xl font-bold text-slate-500">
              Aucune offre ne correspond à vos critères.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
