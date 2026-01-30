import { Construction, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AdminModulePlaceholderProps {
  title: string
  description?: string
}

export function AdminModulePlaceholder({ title, description }: AdminModulePlaceholderProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
        <p className="text-slate-500 text-lg mt-1">{description || "Ce module est en cours de développement."}</p>
      </div>

      <div className="min-h-[500px] rounded-[40px] border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center p-12 text-center">
        <div className="h-20 w-20 rounded-full bg-amber-50 flex items-center justify-center mb-6">
          <Construction className="h-10 w-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-4">Module en construction</h2>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-10">
          Nos ingénieurs travaillent activement sur l'interface de {title.toLowerCase()}. Revenez bientôt pour découvrir les fonctionnalités avancées.
        </p>
        
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-primary transition-all shadow-lg shadow-slate-900/10"
        >
          <ArrowLeft className="h-4 w-4" /> Retour au Dashboard
        </Link>
      </div>
    </div>
  )
}
