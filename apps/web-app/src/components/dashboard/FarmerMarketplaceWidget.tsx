"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShoppingBag, 
  Truck, 
  Plus, 
  ArrowRight, 
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  Settings,
  ShieldCheck,
  Link as LinkIcon,
  Search,
  ChevronRight,
  Calculator,
  MessageSquare,
  TrendingUp,
  Store,
  Box,
  CreditCard,
  Container,
  History,
  MoreVertical,
  Edit2,
  Trash2,
  Globe,
  Brain
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// --- Mock Data ---

const INITIAL_PRODUCTS = [
  { 
    id: "prod_1", 
    name: "Blé d'hiver HVE", 
    stock: 12, 
    unit: "T", 
    price: 240, 
    status: "Published",
    organic: true,
    blockchain: true,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=300&h=200&fit=crop"
  },
  { 
    id: "prod_2", 
    name: "Maïs Grain Extra", 
    stock: 45, 
    unit: "T", 
    price: 195, 
    status: "Published",
    organic: false,
    blockchain: true,
    image: "https://images.unsplash.com/photo-1551730459-92db2a308d6a?q=80&w=300&h=200&fit=crop"
  },
  { 
    id: "prod_3", 
    name: "Tournesol Bio-Sûreté", 
    stock: 8, 
    unit: "T", 
    price: 410, 
    status: "Draft",
    organic: true,
    blockchain: true,
    image: "https://images.unsplash.com/photo-1464961770159-0d283c18dc47?q=80&w=300&h=200&fit=crop"
  },
]

const ORDERS = [
  {
    id: "ORD-9921",
    customer: "Minoterie du Nord",
    product: "Blé d'hiver HVE",
    amount: "10T",
    totalPrice: 2400,
    status: "Paid", // Ordered -> Paid -> Delivered
    date: "2024-01-20",
    progress: 66,
  },
  {
    id: "ORD-9884",
    customer: "Global Agri Trade",
    product: "Maïs Grain Extra",
    amount: "20T",
    totalPrice: 3900,
    status: "Ordered",
    date: "2024-01-22",
    progress: 33,
  }
]

// --- Sub-Components ---

function ProductCard({ product, onEdit }: { product: any, onEdit: (p: any) => void }) {
  return (
    <motion.div 
      layout
      className="group relative bg-[#050505] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-[#D4A017]/50 transition-all duration-500 shadow-2xl"
    >
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
         {product.organic && (
           <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] tracking-widest px-2 py-0.5 shadow-lg">
             BIO CERTIFIÉ
           </Badge>
         )}
         {product.blockchain && (
           <Badge className="bg-blue-600 text-white border-none font-black text-[8px] tracking-widest px-2 py-0.5 shadow-lg flex items-center gap-1">
             <LinkIcon className="h-2 w-2" /> BLOCKCHAIN
           </Badge>
         )}
      </div>

      <div className="h-48 w-full overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
      </div>

      <div className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="text-white font-black text-xl tracking-tighter uppercase">{product.name}</h4>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Stock: {product.stock}{product.unit}</span>
              <span className="h-1 w-1 rounded-full bg-white/10" />
              <Badge variant="outline" className={cn(
                "text-[8px] font-black uppercase border-white/10",
                product.status === "Published" ? "text-emerald-500" : "text-slate-500"
              )}>
                {product.status}
              </Badge>
            </div>
          </div>
          <button onClick={() => onEdit(product)} className="text-white/20 hover:text-white transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-end justify-between">
           <div className="space-y-1">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Valeur Marché</p>
              <p className="text-3xl font-black text-[#D4A017] tracking-tighter">{product.price} <span className="text-xs text-[#D4A017]/40 uppercase tracking-widest">€ / {product.unit}</span></p>
           </div>
           <Button className="h-12 w-12 rounded-2xl bg-[#1B4D3E]/20 text-[#1B4D3E] dark:text-emerald-500 hover:bg-[#1B4D3E] hover:text-white border border-emerald-500/10">
              <Edit2 className="h-5 w-5" />
           </Button>
        </div>
      </div>
    </motion.div>
  )
}

function OrderTimeline({ order }: { order: any }) {
  const steps = ["COMMANDÉ", "PAYÉ", "LIVRÉ"]
  const currentStepIndex = order.status === "Ordered" ? 0 : order.status === "Paid" ? 1 : 2

  return (
    <Card className="border-none bg-white dark:bg-white/2 shadow-xl rounded-[2.5rem] p-8 border border-white/5 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
           <div className="h-14 w-14 rounded-2xl bg-[#1B4D3E] flex items-center justify-center text-white shadow-xl">
             <Box className="h-7 w-7" />
           </div>
           <div>
             <h4 className="text-lg font-black tracking-tight uppercase">{order.customer}</h4>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{order.id} // {order.product}</p>
           </div>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Montant Transaction</p>
           <p className="text-2xl font-black text-[#D4A017]">{order.totalPrice.toLocaleString()} €</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-[1.25rem] w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full" />
        <motion.div 
          className="absolute left-0 top-[1.25rem] h-1.5 bg-emerald-500 rounded-full" 
          initial={{ width: 0 }}
          animate={{ width: `${(currentStepIndex / 2) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        <div className="relative flex justify-between">
          {steps.map((step, i) => {
            const isCompleted = i <= currentStepIndex
            const isCurrent = i === currentStepIndex
            return (
              <div key={step} className="flex flex-col items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center border-4 transition-all duration-500 z-10",
                  isCompleted 
                    ? "bg-emerald-500 border-white dark:border-[#0a1f18] text-white shadow-lg shadow-emerald-500/20" 
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-300"
                )}>
                  {i === 0 && <History className="h-4 w-4" />}
                  {i === 1 && <CreditCard className="h-4 w-4" />}
                  {i === 2 && <CheckCircle2 className="h-4 w-4" />}
                </div>
                <span className={cn(
                  "text-[9px] font-black tracking-widest uppercase",
                  isCurrent ? "text-emerald-500" : isCompleted ? "text-slate-400" : "text-slate-200"
                )}>{step}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

function SmartLogisticsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isOptimizing, setIsOptimizing] = React.useState(true)

  React.useEffect(() => {
    if (isOpen) {
      setIsOptimizing(true)
      setTimeout(() => setIsOptimizing(false), 2500)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 border-none bg-white dark:bg-[#050505] rounded-[3rem] overflow-hidden shadow-3xl">
        <div className="grid md:grid-cols-2">
           <div className="p-12 space-y-8">
              <div className="space-y-2">
                <Badge className="bg-[#1B4D3E] text-white font-black text-[9px] tracking-widest px-4 py-1.5 rounded-full mb-4">AGRILINK v2.4 ENGINE</Badge>
                <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-[#1B4D3E] dark:text-white">Matching <span className="text-[#D4A017]">Logistique</span></h2>
                <p className="text-slate-400 font-bold text-sm">Optimisation multisectorielle des flux de collecte.</p>
              </div>

              {isOptimizing ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center">
                   <div className="relative">
                      <div className="h-24 w-24 border-b-4 border-t-4 border-[#D4A017] rounded-full animate-spin" />
                      <Truck className="h-10 w-10 text-[#D4A017] absolute inset-0 m-auto animate-pulse" />
                   </div>
                   <div className="space-y-1">
                      <p className="font-black uppercase tracking-widest text-xs">Calcul d'itinéraire optimal...</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Analyse de 12 transporteurs à proximité</p>
                   </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                   <div className="bg-emerald-500/10 p-8 rounded-[2rem] border border-emerald-500/20 space-y-4">
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-500 rounded-2xl text-white">
                               <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                               <p className="text-xs font-black uppercase text-emerald-900 dark:text-emerald-400 tracking-widest">TRANSPORTEUR VERROUILLÉ</p>
                               <p className="text-lg font-black">Jean Logistics & Co.</p>
                            </div>
                         </div>
                         <Badge className="bg-emerald-500 text-white font-black">CERTIFIÉ AGRODEEP</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 border-t border-emerald-200/30 pt-4">
                         <div className="space-y-1">
                            <p className="text-[8px] font-black text-emerald-900/40 uppercase">DÉLAI ESTIMÉ</p>
                            <p className="text-md font-black">45 MIN</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[8px] font-black text-emerald-900/40 uppercase">MOYEN DE TRANSPORT</p>
                            <p className="text-md font-black">POIDS LOURD 24T</p>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl space-y-1">
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Coût Carbone</p>
                         <p className="text-xl font-black text-emerald-600">-24% <span className="text-[10px] font-bold">Optimisé</span></p>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl space-y-1">
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Frais Logistiques</p>
                         <p className="text-xl font-black">124.50 €</p>
                      </div>
                   </div>

                   <Button className="w-full h-16 bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white rounded-2xl font-black text-lg shadow-2xl shadow-[#1B4D3E]/30 transition-all hover:scale-[1.02]">
                      CONFIRMER LE RAMASSAGE
                   </Button>
                </motion.div>
              )}
           </div>

           <div className="relative bg-[#0a1f18] h-[400px] md:h-auto overflow-hidden">
              {/* Simulated Map */}
              <div className="absolute inset-0 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-0.118092,51.509865,11/800x800?access_token=pk.eyJ1IjoiYW50aWdyYXZpdHkiLCJhIjoiY202azU5ZmNnMGNrajJqcXo4N2Y1NmtzdyJ9.xxx')] bg-cover grayscale" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f18] via-transparent to-transparent" />
              
              {!isOptimizing && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 600">
                  <motion.path 
                    d="M 50 100 Q 150 150 200 300 T 350 500" 
                    fill="none" 
                    stroke="#D4A017" 
                    strokeWidth="4" 
                    strokeDasharray="8 8" 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <circle cx="50" cy="100" r="6" fill="#1B4D3E" />
                  <circle cx="350" cy="500" r="10" fill="#D4A017" />
                  <foreignObject x="60" y="80" width="100" height="40">
                    <div className="bg-white px-2 py-1 rounded-lg text-[8px] font-black uppercase text-black">VOTRE FERME</div>
                  </foreignObject>
                  <foreignObject x="250" y="520" width="100" height="40">
                    <div className="bg-[#D4A017] px-2 py-1 rounded-lg text-[8px] font-black uppercase text-white shadow-xl">CENTRE COLLECTE</div>
                  </foreignObject>
                </svg>
              )}
              
              <div className="absolute bottom-8 right-8 p-6 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 text-white space-y-1">
                 <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">Statut GPS</p>
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-xs font-black">Liaison Satellite Verrouillée</p>
                 </div>
              </div>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function GrossisteMode() {
  const [qty, setQty] = React.useState(100)
  const [targetPrice, setTargetPrice] = React.useState(180)

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
       <div className="space-y-10">
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[2rem] bg-[#050505] flex items-center justify-center text-[#D4A017] border border-[#D4A017]/30 shadow-2xl">
                   <Container className="h-8 w-8" />
                </div>
                <div>
                   <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Canal <span className="text-[#D4A017]">Grossiste</span></h2>
                   <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Négociation de volumes industriels (20T+)</p>
                </div>
             </div>
          </div>

          <Card className="border-none bg-white dark:bg-[#0a1f18] shadow-3xl rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                <Globe className="h-64 w-64 text-[#1B4D3E]" />
             </div>
             
             <CardContent className="p-0 space-y-10">
                <div className="space-y-6">
                   <Label className="uppercase text-[11px] font-black text-slate-400 tracking-[0.3em] ml-2">QUANTITÉ SOUHAITÉE (TONNES)</Label>
                   <div className="flex items-center gap-6">
                      <div className="text-6xl font-black text-[#1B4D3E] dark:text-white tracking-widest">{qty}</div>
                      <input 
                         type="range" min="20" max="500" step="10" value={qty}
                         onChange={(e) => setQty(parseInt(e.target.value))}
                         className="flex-1 h-3 bg-slate-100 dark:bg-white/10 rounded-full appearance-none accent-[#D4A017] cursor-pointer"
                      />
                   </div>
                </div>

                <div className="space-y-6">
                   <Label className="uppercase text-[11px] font-black text-slate-400 tracking-[0.3em] ml-2">PRIX CIBLE NÉGOCIÉ (€/T)</Label>
                   <div className="flex items-center gap-6">
                      <div className="text-6xl font-black text-[#D4A017] tracking-widest">{targetPrice}</div>
                      <input 
                         type="range" min="150" max="400" step="5" value={targetPrice}
                         onChange={(e) => setTargetPrice(parseInt(e.target.value))}
                         className="flex-1 h-3 bg-slate-100 dark:bg-white/10 rounded-full appearance-none accent-[#1B4D3E] cursor-pointer"
                      />
                   </div>
                </div>

                <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-8 space-y-4">
                   <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                      <span className="text-slate-400">VALEUR DU CONTRAT</span>
                      <span className="text-xl font-black text-[#1B4D3E] dark:text-white">{(qty * targetPrice).toLocaleString()} €</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                      <span className="text-slate-400">RÉDUCTION VOLUME IA</span>
                      <span className="text-xl font-black text-emerald-500">-8.5 %</span>
                   </div>
                </div>

                <Button className="w-full h-20 bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white rounded-[2rem] font-black text-2xl shadow-3xl transition-all hover:scale-[1.02]">
                   SOUMETTRE OFFRE GROSSISTE
                </Button>
             </CardContent>
          </Card>
       </div>

       <div className="space-y-10">
          <Card className="border-none bg-[#050505] text-white shadow-3xl rounded-[3rem] p-10 overflow-hidden relative group">
             <div className="absolute inset-0 bg-gradient-to-br from-[#1B4D3E]/20 to-transparent opacity-50" />
             <CardHeader className="p-0 mb-10 relative">
                <CardTitle className="text-xl font-black tracking-widest flex items-center gap-3">
                   <TrendingUp className="h-6 w-6 text-[#D4A017]" /> OFFRES DU MOMENT
                </CardTitle>
                <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">Flux haute-fréquence du Hub Régional</p>
             </CardHeader>
             <CardContent className="p-0 space-y-6 relative">
                {[
                  { buyer: "AgriCorp France", need: "Blé Panifiable", qty: "200T", price: "242€", reliability: "98%" },
                  { buyer: "DistriBio SA", need: "Tournesol Bio", qty: "45T", price: "415€", reliability: "95%" },
                  { buyer: "Millers Group", need: "Blé de Force", qty: "120T", price: "258€", reliability: "99%" },
                ].map((offer, i) => (
                  <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group/offer">
                     <div className="space-y-1">
                        <p className="text-lg font-black tracking-tight">{offer.buyer}</p>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{offer.need} // {offer.qty}</p>
                     </div>
                     <div className="text-right space-y-2">
                        <p className="text-xl font-black text-[#D4A017]">{offer.price}</p>
                        <Button variant="ghost" className="h-8 px-4 border border-white/10 rounded-full text-[9px] font-black text-white group-hover/offer:bg-[#D4A017] group-hover/offer:text-black transition-all">
                           NÉGOCIER
                        </Button>
                     </div>
                  </div>
                ))}
             </CardContent>
          </Card>

          <div className="bg-[#1B4D3E]/10 border border-[#1B4D3E]/20 p-8 rounded-[3rem] space-y-4">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-[#1B4D3E] rounded-2xl text-[#D4A017]">
                   <Calculator className="h-6 w-6" />
                </div>
                <h4 className="font-black text-lg tracking-tight uppercase">Index des Prix Régionaux</h4>
             </div>
             <p className="text-sm font-bold text-[#1B4D3E]/60 leading-relaxed uppercase">
                Le maïs grain est en hausse de +2.4% cette semaine sur votre zone. 
                L'IA recommande d'attendre Mardi pour les volumes &gt; 50T.
             </p>
          </div>
       </div>
    </div>
  )
}

// --- Listing Wizard Component ---

function AddProductWizard({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = React.useState(1)
  const [formData, setFormData] = React.useState({
    crop: "",
    quantity: 0,
    price: 0,
    quality: "Standard",
    blockchain: true,
    bio: false
  })
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)

  const handleNext = () => {
    if (step === 2) {
      setIsAnalyzing(true)
      setTimeout(() => {
        setIsAnalyzing(false)
        setStep(3)
      }, 2500)
    } else {
      setStep(s => s + 1)
    }
  }

  const handleFinish = () => {
    toast.success("PRODUIT MIS EN VENTE", {
      description: `${formData.crop} (${formData.quantity}T) est maintenant visible sur le marketplace B2B.`,
      icon: <Globe className="h-4 w-4 text-emerald-500" />
    })
    onClose()
    setStep(1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[700px] p-0 border-none bg-white dark:bg-[#050505] rounded-[3rem] overflow-hidden shadow-3xl">
        <div className="bg-[#1B4D3E] p-10 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
              <Plus size={150} />
           </div>
           <div className="relative z-10 flex justify-between items-end">
              <div className="space-y-2">
                <Badge className="bg-white/10 text-white border-white/20 font-black text-[9px] tracking-widest px-3 py-1 mb-2">AGRO-LISTING ENGINE v4.0</Badge>
                <DialogTitle className="text-4xl font-black tracking-tighter uppercase leading-none">NOUVELLE <span className="text-[#D4A017]">VENTE</span></DialogTitle>
                <DialogDescription className="text-white/60 font-bold">Certification et mise sur le marché synchronisées.</DialogDescription>
              </div>
              <div className="flex gap-2">
                 {[1, 2, 3, 4].map(s => (
                   <div key={s} className={cn("h-1.5 w-8 rounded-full transition-all", step >= s ? "bg-[#D4A017]" : "bg-white/10")} />
                 ))}
              </div>
           </div>
        </div>

        <div className="p-10 min-h-[450px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                 <div className="grid gap-6">
                    <div className="space-y-3">
                       <Label className="uppercase text-[10px] font-black text-slate-400 tracking-widest ml-2">Type de Culture</Label>
                       <div className="grid grid-cols-3 gap-4">
                          {["Blé", "Maïs", "Soja", "Tournesol", "Riz", "Coton"].map(c => (
                            <button 
                              key={c} 
                              onClick={() => setFormData({...formData, crop: c})}
                              className={cn(
                                "h-14 rounded-2xl font-black text-xs uppercase border-2 transition-all",
                                formData.crop === c ? "bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-xl" : "bg-slate-50 dark:bg-white/5 border-transparent text-slate-400"
                              )}
                            >
                              {c}
                            </button>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-3">
                       <Label className="uppercase text-[10px] font-black text-slate-400 tracking-widest ml-2">Quantité à Vendre (Tonnes)</Label>
                       <div className="flex items-center gap-6">
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            className="text-4xl h-20 font-black bg-slate-50 dark:bg-white/5 border-none rounded-3xl px-8 shadow-inner"
                            onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                          />
                          <div className="h-20 w-32 bg-[#D4A017] flex items-center justify-center rounded-3xl shadow-xl">
                             <span className="text-2xl font-black text-black">T</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                 <div className="space-y-6">
                    <Label className="uppercase text-[10px] font-black text-slate-400 tracking-widest ml-2">Certification Qualité & Traçabilité</Label>
                    <div className="grid gap-4">
                       <div className={cn(
                         "p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between",
                         formData.bio ? "bg-emerald-500/10 border-emerald-500" : "bg-slate-50 dark:bg-white/5 border-transparent"
                       )} onClick={() => setFormData({...formData, bio: !formData.bio})}>
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center">
                                <ShieldCheck className="h-6 w-6" />
                             </div>
                             <div>
                                <p className="font-black uppercase text-sm">Produit Certifié Bio (AB)</p>
                                <p className="text-[10px] font-bold text-slate-400">Ajoute une plus-value de +20% sur le marché.</p>
                             </div>
                          </div>
                          <div className={cn("h-6 w-6 rounded-full border-4 flex items-center justify-center", formData.bio ? "border-emerald-500 bg-emerald-500" : "border-slate-200")}>
                             {formData.bio && <CheckCircle2 className="h-3 w-3 text-white" />}
                          </div>
                       </div>

                       <div className={cn(
                         "p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between",
                         formData.blockchain ? "bg-blue-500/10 border-blue-500" : "bg-slate-50 dark:bg-white/5 border-transparent"
                       )} onClick={() => setFormData({...formData, blockchain: !formData.blockchain})}>
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center">
                                <LinkIcon className="h-6 w-6" />
                             </div>
                             <div>
                                <p className="font-black uppercase text-sm">Traçabilité Blockchain Active</p>
                                <p className="text-[10px] font-bold text-slate-400">Garantit l’origine et les conditions de stockage.</p>
                             </div>
                          </div>
                          <div className={cn("h-6 w-6 rounded-full border-4 flex items-center justify-center", formData.blockchain ? "border-blue-500 bg-blue-500" : "border-slate-200")}>
                             {formData.blockchain && <CheckCircle2 className="h-3 w-3 text-white" />}
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center justify-center space-y-8 text-center">
                 <div className="relative">
                    <div className="h-24 w-24 border-t-4 border-b-4 border-[#D4A017] rounded-full animate-spin" />
                    <Brain className="h-10 w-10 text-[#D4A017] absolute inset-0 m-auto animate-pulse" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">ANALYSE PRÉDICTIVE DU PRIX</h3>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">L'IA AgroDeep scanne les flux mondiaux pour vous...</p>
                 </div>
              </motion.div>
            )}

            {step === 3 && !isAnalyzing && (
              <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                 <div className="bg-[#D4A017]/10 p-10 rounded-[3rem] border border-[#D4A017]/20 text-center space-y-4">
                    <p className="text-xs font-black text-[#D4A017] uppercase tracking-[0.4em]">PRIX SUGGÉRÉ PAR L'IA</p>
                    <div className="flex justify-center items-baseline gap-2">
                       <span className="text-8xl font-black text-black dark:text-white tracking-tighter">245</span>
                       <span className="text-3xl font-black text-[#D4A017]">€/T</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-emerald-500 font-black text-xs uppercase">
                       <TrendingUp className="h-4 w-4" /> PERFORMANCE +14% AUJOURD'HUI
                    </div>
                 </div>

                 <div className="space-y-4">
                    <Label className="uppercase text-[10px] font-black text-slate-400 tracking-widest ml-2">Votre Prix de Mise en Vente</Label>
                    <div className="relative">
                       <Input 
                        type="number" 
                        defaultValue={245}
                        className="h-20 bg-slate-50 dark:bg-white/5 border-none rounded-3xl text-3xl font-black px-8"
                       />
                       <Button variant="ghost" className="absolute right-4 top-1/2 -translate-y-1/2 h-12 px-6 rounded-2xl bg-[#D4A017] text-black font-black">ADOPTER SUGGESTION</Button>
                    </div>
                 </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                 <div className="bg-[#0a1f18] p-10 rounded-[3rem] border border-white/5 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                       <CheckCircle2 className="h-32 w-32 text-emerald-500" />
                    </div>
                    <div className="space-y-2 relative z-10 text-center">
                       <p className="text-[#D4A017] font-black text-xs uppercase tracking-[0.5em]">RÉSUMÉ DU LISTING</p>
                       <h3 className="text-5xl font-black text-white tracking-tighter uppercase">{formData.crop} PREMIUM</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6 relative z-10">
                       <div className="bg-white/5 p-6 rounded-2xl space-y-1">
                          <p className="text-[10px] font-black text-white/30 uppercase">Volume Total</p>
                          <p className="text-2xl font-black text-white">{formData.quantity} T</p>
                       </div>
                       <div className="bg-white/5 p-6 rounded-2xl space-y-1">
                          <p className="text-[10px] font-black text-white/30 uppercase">Valorisation</p>
                          <p className="text-2xl font-black text-[#D4A017]">{(formData.quantity * 245).toLocaleString()} €</p>
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center relative z-10">
                       {formData.bio && <Badge className="bg-emerald-500 text-white font-black px-4 py-2 rounded-full">CERTIFIÉ BIO</Badge>}
                       {formData.blockchain && <Badge className="bg-blue-600 text-white font-black px-4 py-2 rounded-full">BLOCKCHAIN SYNC</Badge>}
                       <Badge className="bg-white/10 text-white font-black px-4 py-2 rounded-full">AUDIT AGRODEEP OK</Badge>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-10 pt-0 flex justify-between gap-4">
           {step > 1 && !isAnalyzing && (
              <Button variant="ghost" onClick={() => setStep(step - 1)} className="text-slate-400 font-black h-16 px-8 rounded-2xl">RETOUR</Button>
           )}
           {step < 4 ? (
              !isAnalyzing && (
                <Button 
                  disabled={step === 1 && (!formData.crop || formData.quantity <= 0)}
                  onClick={handleNext} 
                  className="flex-1 bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white rounded-2xl h-16 font-black text-xl shadow-2xl transition-all"
                >
                  {step === 3 ? "FINALISER LE DOSSIER" : "CONTINUER"} <ChevronRight className="ml-2 h-6 w-6" />
                </Button>
              )
           ) : (
              <Button 
                onClick={handleFinish} 
                className="flex-1 bg-[#D4A017] hover:bg-[#B8860B] text-black rounded-2xl h-16 font-black text-xl shadow-2xl transition-all flex gap-3"
              >
                <Globe className="h-6 w-6" /> PUBLIER SUR LE MARCHÉ MONDIAL
              </Button>
           )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- Main Module ---

export function FarmerMarketplaceWidget() {
  const [activeTab, setActiveTab] = React.useState("inventory")
  const [isLogisticsOpen, setIsLogisticsOpen] = React.useState(false)
  const [isListingOpen, setIsListingOpen] = React.useState(false)

  return (
    <div className="max-w-[1600px] mx-auto space-y-12">
      {/* Immersive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
        <div className="space-y-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <Badge className="bg-[#D4A017] text-white px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest mb-4">ESPACE B2B CERTIFIÉ</Badge>
          </motion.div>
          <h1 className="text-6xl font-black text-[#1B4D3E] dark:text-white tracking-tighter uppercase leading-none">
            MARKET<span className="text-[#D4A017]">PLACE</span> AGRODEEP
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.4em] mt-2">Gestion Commerciale & Logistique Haute-Précision</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setIsLogisticsOpen(true)} className="bg-black text-white hover:bg-slate-900 rounded-2xl h-16 px-8 font-black shadow-2xl transition-all hover:scale-105 flex gap-3">
             <Truck className="h-5 w-5 text-[#D4A017]" /> LOGISTIQUE OPTIMISÉE
          </Button>
          <Button onClick={() => setIsListingOpen(true)} className="bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white rounded-2xl h-16 px-8 font-black shadow-2xl transition-all hover:scale-105 flex gap-3">
             <Plus className="h-5 w-5 text-[#D4A017]" /> METTRE EN VENTE
          </Button>
        </div>
      </div>
      {/* ... previous tabs content ... */}
      <Tabs defaultValue="inventory" onValueChange={setActiveTab} className="space-y-12">
        <TabsList className="bg-slate-50 dark:bg-white/2 p-2 rounded-[2.5rem] h-20 mb-8 border border-slate-100 dark:border-white/5 gap-2 shadow-inner">
          {[
            { id: "inventory", label: "MON INVENTAIRE", icon: Store },
            { id: "orders", label: "COMMANDES EN COURS", icon: Package },
            { id: "wholesale", label: "MODE GROSSISTE", icon: Container },
          ].map(tab => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className={cn(
                "flex-1 h-full rounded-[2rem] font-black text-xs tracking-widest transition-all gap-3",
                activeTab === tab.id 
                  ? "bg-white dark:bg-[#1B4D3E] text-[#1B4D3E] dark:text-white shadow-xl" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="inventory" key="inventory">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
               <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {INITIAL_PRODUCTS.map(p => (
                    <ProductCard key={p.id} product={p} onEdit={() => {}} />
                  ))}
               </div>
               
               <Card onClick={() => setIsListingOpen(true)} className="bg-slate-50 dark:bg-white/2 border-dashed border-2 border-slate-200 dark:border-white/10 rounded-[3rem] p-12 text-center group cursor-pointer hover:border-[#D4A017]/40 transition-all">
                  <div className="max-w-md mx-auto space-y-6">
                     <div className="h-24 w-24 bg-white dark:bg-black/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <Plus className="h-10 w-10 text-[#D4A017]" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-2xl font-black uppercase tracking-tight">AJOUTER UN PRODUIT</h4>
                        <p className="text-slate-400 font-bold text-sm">Référencez vos nouvelles récoltes certifiées par AgroDeep.</p>
                     </div>
                  </div>
               </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="orders" key="orders">
            <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-10"
            >
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">SUIVI DES <span className="text-[#D4A017]">FLUX</span> D'EXPÉDITION</h3>
                  <div className="flex gap-4">
                     <Badge className="bg-slate-100 dark:bg-white/5 text-slate-500 font-black px-4 py-2 rounded-full">EN COURS: 2</Badge>
                     <Badge className="bg-emerald-100 text-emerald-700 font-black px-4 py-2 rounded-full">TERMINÉES: 142</Badge>
                  </div>
               </div>
               <div className="grid gap-10">
                  {ORDERS.map(order => (
                    <OrderTimeline key={order.id} order={order} />
                  ))}
               </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="wholesale" key="wholesale">
            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }} 
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
            >
               <GrossisteMode />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>

      <SmartLogisticsModal isOpen={isLogisticsOpen} onClose={() => setIsLogisticsOpen(false)} />
      <AddProductWizard isOpen={isListingOpen} onClose={() => setIsListingOpen(false)} />
    </div>
  )
}
