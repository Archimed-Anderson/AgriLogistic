"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  TrendingUp, 
  MousePointerClick, 
  ShoppingCart, 
  Eye, 
  Trash2, 
  Edit3, 
  BarChart3, 
  Zap,
  Globe,
  Share2,
  AlertCircle,
  ExternalLink,
  Ban
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { affiliateProducts } from "@/data/affiliate-products"
import { AffiliateProduct, AffiliatePlatform } from "@/types/affiliate"
import { cn } from "@/lib/utils"

// Mock Analytics Data
const analyticsData = [
  { name: 'Lun', clicks: 450, conversions: 12, revenue: 1200 },
  { name: 'Mar', clicks: 620, conversions: 18, revenue: 1850 },
  { name: 'Mer', clicks: 580, conversions: 15, revenue: 1500 },
  { name: 'Jeu', clicks: 840, conversions: 25, revenue: 2900 },
  { name: 'Ven', clicks: 950, conversions: 32, revenue: 4100 },
  { name: 'Sam', clicks: 1200, conversions: 45, revenue: 5800 },
  { name: 'Dim', clicks: 1100, conversions: 38, revenue: 4900 },
]

const productPerformance = affiliateProducts.map(p => ({
  name: p.name.substring(0, 20) + '...',
  clicks: Math.floor(Math.random() * 500) + 100,
  conversions: Math.floor(Math.random() * 50) + 5,
}))

export default function AffiliationManagerPage() {
  const [products, setProducts] = React.useState<AffiliateProduct[]>(affiliateProducts)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<AffiliateProduct | null>(null)
  const [bannerScript, setBannerScript] = React.useState('<div id="agri-ads-banner"></div>\n<script src="https://ads.agrilogistic.com/v1/loader.js"></script>')
  const [globalConfig, setGlobalConfig] = React.useState({
    storeName: "Boutique Partenaires AgroDeep",
    trackingId: "agrodeep-21",
    defaultCommission: 8
  })

  // CRUD Logic
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated save logic
    setIsAddModalOpen(false)
    setEditingProduct(null)
    // In a real app, this would be an API call
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  const handleTogglePromo = (id: string) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, discount: p.discount ? 0 : 20 } : p
    ))
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white p-8 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-3">
            <Share2 className="h-10 w-10 text-yellow-500" />
            Affiliation <span className="text-yellow-500">Manager</span>
          </h1>
          <p className="text-slate-400 font-bold mt-2 uppercase text-xs tracking-widest">
            Gestion du catalogue partenaires & Monitoring des revenus
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase">Revenu Est. (30j)</div>
              <div className="text-2xl font-black text-white">4,850.00 €</div>
            </div>
          </div>
          <Button 
            onClick={() => {
              setEditingProduct(null)
              setIsAddModalOpen(true)
            }}
            className="h-16 px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-yellow-500/10"
          >
            <Plus className="mr-2 h-6 w-6" /> Nouveau Produit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-8">
        <TabsList className="bg-slate-900/50 border border-slate-800 p-1 rounded-2xl h-14 w-fit">
          <TabsTrigger value="inventory" className="rounded-xl px-8 font-black uppercase text-xs tracking-widest data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
            Inventaire
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-xl px-8 font-black uppercase text-xs tracking-widest data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="marketing" className="rounded-xl px-8 font-black uppercase text-xs tracking-widest data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
            Marketing
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl px-8 font-black uppercase text-xs tracking-widest data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
            Configuration
          </TabsTrigger>
        </TabsList>

        {/* INVENTORY TAB */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <Input 
                placeholder="Rechercher un produit, une catégorie..." 
                className="h-14 pl-12 bg-slate-900/50 border-slate-800 rounded-2xl text-lg focus:ring-yellow-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md">
            <Table>
              <TableHeader className="bg-slate-800/30">
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="w-[80px] text-slate-500 font-black uppercase text-[10px] tracking-widest">Image</TableHead>
                  <TableHead className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Produit</TableHead>
                  <TableHead className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Plateforme</TableHead>
                  <TableHead className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Prix</TableHead>
                  <TableHead className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Commission</TableHead>
                  <TableHead className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="text-right text-slate-500 font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-slate-800 hover:bg-white/5 transition-colors group">
                    <TableCell>
                      <img src={product.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-800" />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-black text-sm uppercase tracking-tight">{product.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">{product.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        product.platform === 'AMAZON' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : 
                        product.platform === 'ALIBABA' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : 
                        "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      )}>
                        {product.platform}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{product.price.toLocaleString()} €</TableCell>
                    <TableCell>
                      <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-xl font-black text-xs">
                        {product.commission}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Promo</span>
                          <Switch 
                            checked={(product.discount || 0) > 0} 
                            onCheckedChange={() => handleTogglePromo(product.id)}
                            className="data-[state=checked]:bg-yellow-500"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-10 w-10 p-0 text-slate-500 hover:text-white">
                            <MoreHorizontal className="h-6 w-6" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white w-48 rounded-2xl p-2 shadow-2xl">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-500 px-2 py-2">Options</DropdownMenuLabel>
                          <DropdownMenuItem className="rounded-xl focus:bg-yellow-500 focus:text-black font-bold cursor-pointer transition-colors" onClick={() => {
                            setEditingProduct(product)
                            setIsAddModalOpen(true)
                          }}>
                            <Edit3 className="mr-2 h-4 w-4" /> Éditer
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl focus:bg-blue-500 focus:text-white font-bold cursor-pointer transition-colors" asChild>
                            <a href={`/affiliation/${product.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" /> Voir public
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          <DropdownMenuItem 
                            className="rounded-xl focus:bg-red-500 focus:text-white font-bold cursor-pointer transition-colors text-red-400"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard label="Clics Totaux" value="12,450" change="+15%" icon={MousePointerClick} color="yellow" />
            <StatsCard label="Conversions" value="482" change="+8.2%" icon={ShoppingCart} color="emerald" />
            <StatsCard label="Taux de Conv." value="3.87%" change="+0.5%" icon={Zap} color="blue" />
            <StatsCard label="EPC Moyen" value="1.24 €" change="+2.4%" icon={TrendingUp} color="orange" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-md">
              <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-yellow-500" />
                Performance <span className="text-yellow-500">Hebdomadaire</span>
              </h3>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#475569" 
                      fontSize={10} 
                      fontWeight="bold" 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={10} 
                      fontWeight="bold" 
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}
                      itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="clicks" stroke="#fbbf24" strokeWidth={4} fillOpacity={1} fill="url(#colorClicks)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-md">
              <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
                Top Produits <span className="text-emerald-500">Performance</span>
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      stroke="#475569" 
                      fontSize={8} 
                      fontWeight="heavy" 
                      width={120}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }}
                      itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="conversions" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* MARKETING TAB content... */}
        
        {/* SETTINGS TAB */}
        <TabsContent value="settings" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-md">
              <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
                <Globe className="h-6 w-6 text-yellow-500" />
                Paramètres <span className="text-yellow-500">Généraux</span>
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nom Public de la Boutique</Label>
                  <Input defaultValue="Boutique Partenaires AgriLogistic" className="bg-slate-800/50 border-slate-700 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">ID Tracking Amazon Associé</Label>
                  <Input defaultValue="agrilogistic-21" className="bg-slate-800/50 border-slate-700 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Commission Moyenne (%)</Label>
                  <Input type="number" defaultValue="8" className="bg-slate-800/50 border-slate-700 rounded-xl" />
                </div>
                <Button className="w-full h-14 bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest rounded-xl">
                  Enregistrer la config
                </Button>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-md">
              <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
                <Ban className="h-6 w-6 text-red-500" />
                Zone <span className="text-red-500">Danger</span>
              </h3>
              <p className="text-slate-400 text-sm font-bold mb-6">Actions irréversibles sur le module d'affiliation.</p>
              <div className="space-y-4">
                <Button variant="outline" className="w-full h-14 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase tracking-widest rounded-xl transition-all">
                  Réinitialiser tous les clics
                </Button>
                <Button variant="outline" className="w-full h-14 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase tracking-widest rounded-xl transition-all">
                  Désactiver le module Affiliation
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ADD/EDIT MODAL */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl rounded-3xl overflow-hidden p-0 shadow-2xl">
          <form onSubmit={handleSaveProduct}>
            <div className="bg-slate-800/50 p-8 border-b border-slate-700">
              <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                {editingProduct ? <Edit3 className="h-8 w-8 text-yellow-500" /> : <Plus className="h-8 w-8 text-yellow-500" />}
                {editingProduct ? "Éditer le" : "Nouveau"} <span className="text-yellow-500">Produit</span>
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">
                Remplissez les informations pour référencer un nouveau partenaire.
              </DialogDescription>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nom du produit</Label>
                  <Input defaultValue={editingProduct?.name} className="bg-slate-800/50 border-slate-700 rounded-xl py-6" placeholder="ex: Drone DJI Agras T30" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Catégorie</Label>
                  <select className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/20 font-bold uppercase tracking-tight" defaultValue={editingProduct?.category}>
                     <option>Outillage</option>
                     <option>Électronique</option>
                     <option>Gros Équipements</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Plateforme</Label>
                  <select className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/20 font-bold uppercase tracking-tight" defaultValue={editingProduct?.platform}>
                     <option value="AMAZON">Amazon</option>
                     <option value="ALIBABA">Alibaba</option>
                     <option value="DIRECT">Vente Directe</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Prix (€)</Label>
                  <Input type="number" defaultValue={editingProduct?.price} className="bg-slate-800/50 border-slate-700 rounded-xl py-6" placeholder="0.00" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Lien Affilié (Target URL)</Label>
                <div className="flex gap-2">
                  <Input defaultValue={editingProduct?.affiliateUrl} className="bg-slate-800/50 border-slate-700 rounded-xl py-6" placeholder="https://..." required />
                  <Button type="button" variant="outline" className="h-12 border-slate-700 text-slate-500">
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">URL Image</Label>
                <Input defaultValue={editingProduct?.images[0]} className="bg-slate-800/50 border-slate-700 rounded-xl py-6" placeholder="https://unsplash..." required />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Description Courte</Label>
                <Textarea defaultValue={editingProduct?.shortDescription} className="bg-slate-800/50 border-slate-700 rounded-xl" rows={3} required />
              </div>

              {/* SEO & METADATA SECTION */}
              <div className="pt-6 border-t border-slate-800 space-y-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-yellow-500/50 flex items-center gap-2">
                  <Globe className="h-4 w-4" /> SEO & Métadonnées
                </h4>
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Titre SEO (Pagetitle)</Label>
                  <Input defaultValue={editingProduct?.seo?.title} className="bg-slate-800/50 border-slate-700 rounded-xl py-6" placeholder="Titre optimisé pour Google..." />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Meta Description</Label>
                  <Textarea defaultValue={editingProduct?.seo?.metaDescription} className="bg-slate-800/50 border-slate-700 rounded-xl" rows={2} placeholder="Description pour les résultats de recherche..." />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Mots-clés (séparés par virgules)</Label>
                    <Input defaultValue={editingProduct?.seo?.keywords?.join(', ')} className="bg-slate-800/50 border-slate-700 rounded-xl py-6" placeholder="robotique, drone, agritech..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">ID Tracking Spécifique</Label>
                    <Input defaultValue={editingProduct?.trackingId} className="bg-slate-800/50 border-slate-700 rounded-xl py-6" placeholder="ex: tag-21" />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="bg-slate-800/50 p-8 border-t border-slate-700 mt-0">
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="h-14 px-8 font-black uppercase tracking-widest text-slate-500 hover:text-white">Annuler</Button>
              <Button type="submit" className="h-14 px-12 bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-yellow-500/20">
                {editingProduct ? "Mettre à jour" : "Confirmer l'ajout"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface StatsCardProps {
  label: string
  value: string
  change: string
  icon: any
  color: 'yellow' | 'emerald' | 'blue' | 'orange'
}

function StatsCard({ label, value, change, icon: Icon, color }: StatsCardProps) {
  const colors = {
    yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    orange: "text-orange-500 bg-orange-500/10 border-orange-500/20"
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl group hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border", colors[color])}>
          <Icon className="h-6 w-6" />
        </div>
        <span className={cn("text-[10px] font-black px-2 py-1 rounded-lg bg-white/5", change.startsWith('+') ? "text-emerald-500" : "text-red-500")}>
          {change}
        </span>
      </div>
      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
      <div className="text-3xl font-black mt-1">{value}</div>
    </div>
  )
}
