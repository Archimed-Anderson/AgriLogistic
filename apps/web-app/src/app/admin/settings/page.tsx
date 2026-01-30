import { Settings as SettingsIcon, Shield, Bell, Database, Globe } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Paramètres</h1>
        <p className="text-slate-500 text-lg">Gérez vos préférences système et configurations globales.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[
          { icon: SettingsIcon, title: "Général", desc: "Langue, fuseau horaire, format des dates." },
          { icon: Shield, title: "Sécurité", desc: "Politiques de mot de passe, authentification 2FA." },
          { icon: Bell, title: "Notifications", desc: "Alertes e-mail, SMS et notifications internes." },
          { icon: Database, title: "Stockage & API", desc: "Clés API, intégrations tierces et sauvegarde." },
          { icon: Globe, title: "Branding", desc: "Logos, couleurs et thèmes personnalisables." },
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-[32px] bg-white border border-slate-100 hover:border-primary/20 transition-all cursor-pointer group shadow-sm">
             <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                   <item.icon className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <div>
                   <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                   <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
             </div>
          </div>
        ))}
      </div>
      
      <div className="p-8 rounded-[40px] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <h4 className="text-xl font-black mb-1">Passer à la Version Enterprise</h4>
            <p className="text-slate-400 text-sm">Débloquez des fonctionnalités avancées de gestion multi-fermes.</p>
         </div>
         <button className="px-8 py-4 bg-emerald-500 text-slate-900 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20">
            Mettre à jour
         </button>
      </div>
    </div>
  )
}
