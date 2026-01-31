"use client"

import * as React from "react"
import { 
  Settings, 
  Bell, 
  Shield, 
  Smartphone, 
  Globe, 
  Truck, 
  Save,
  Database
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function SettingsPage() {
  const [loading, setLoading] = React.useState(false)

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    toast.success("Configuration sauvegardée", {
      description: "Les paramètres du système ont été mis à jour avec succès."
    })
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">CONFIGURATION <span className="text-emerald-500">SYSTÈME</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Paramètres du Command Center & Intégrations</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-12 px-8 font-black uppercase text-xs flex gap-2 shadow-xl shadow-emerald-500/20"
        >
          {loading ? "Sauvegarde..." : <><Save size={16} /> Enregistrer Modifications</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Latérale Settings */}
        <div className="lg:col-span-3 space-y-2">
            {[
              { id: "general", label: "Général", icon: Settings },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "integrations", label: "API & Blockchain", icon: Database },
              { id: "security", label: "Sécurité", icon: Shield },
            ].map((item, i) => (
              <Button key={i} variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 data-[active=true]:bg-emerald-500/10 data-[active=true]:text-emerald-500 font-bold">
                 <item.icon size={18} />
                 {item.label}
              </Button>
            ))}
        </div>

        {/* Main Settings Content */}
        <div className="lg:col-span-9 space-y-6">
           {/* Section Integrations (Priority for Command Center) */}
           <Card className="bg-slate-950/40 border-white/5 shadow-2xl rounded-3xl p-8 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Database size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Intégrations Externes</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Connecteurs API & Nœuds Blockchain</p>
                 </div>
              </div>
              
              <div className="space-y-6">
                 <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/20 uppercase text-[9px] font-black">OR-Tools</Badge>
                          <span className="font-bold text-white text-sm">Google Optimization API</span>
                       </div>
                       <Switch checked={true} />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-bold text-slate-500">API Key</Label>
                       <div className="flex gap-2">
                          <Input type="password" value="************************" className="bg-black/50 border-white/10 font-mono text-xs" readOnly />
                          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-slate-400">Regenerate</Button>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/20 uppercase text-[9px] font-black">Hyperledger</Badge>
                          <span className="font-bold text-white text-sm">Nœud Blockchain Logistique</span>
                       </div>
                       <Switch checked={true} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-mono bg-black/50 p-3 rounded-lg border border-white/5">
                       <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                       Status: CONNECTED (Block #1928492)
                    </div>
                 </div>
              </div>
           </Card>

           {/* Section Notifications */}
           <Card className="bg-slate-950/40 border-white/5 shadow-2xl rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Bell size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Alertes Temps-Réel</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Seuils de déclenchement & canaux</p>
                 </div>
              </div>

              <div className="space-y-6">
                 {[
                   { label: "Alertes Météo Majeures (Grêle, Orage)", desc: "Envoyer SMS aux chauffeurs concernés", active: true },
                   { label: "Déviation Itinéraire > 10%", desc: "Notifier le centre de commande", active: true },
                   { label: "Maintenance Critique Véhicule", desc: "Créer ticket automatique atelier", active: false },
                 ].map((opt, i) => (
                   <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                      <div className="space-y-1">
                         <p className="font-bold text-white text-sm">{opt.label}</p>
                         <p className="text-xs text-slate-500">{opt.desc}</p>
                      </div>
                      <Switch checked={opt.active} />
                   </div>
                 ))}
              </div>
           </Card>

           {/* Section Units & Regional */}
           <Card className="bg-slate-950/40 border-white/5 shadow-2xl rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Globe size={20} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Préférences Régionales</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Unités & Localisation</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label className="text-white font-bold">Système d'Unités</Label>
                    <div className="flex gap-2">
                       <Button variant="outline" className="flex-1 border-emerald-500 text-emerald-500 bg-emerald-500/10 font-bold">Métrique (km, kg)</Button>
                       <Button variant="outline" className="flex-1 border-white/10 text-slate-500 font-bold hover:bg-white/5">Impérial (mi, lbs)</Button>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-white font-bold">Fuseau Horaire</Label>
                    <Input value="Europe/Paris (UTC+01:00)" className="bg-slate-900 border-white/10" readOnly />
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
