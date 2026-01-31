"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Eye,
  Trash2,
  Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

const DOCUMENTS = [
  {
     id: "DOC-0992",
     name: "Permis Poids Lourd (C)",
     type: "License",
     status: "Valid",
     expiry: "12 Oct 2028",
     fileSize: "2.4 MB"
  },
  {
     id: "DOC-1024",
     name: "Assurance Flotte Allianz",
     type: "Insurance",
     status: "Valid",
     expiry: "15 Jan 2027",
     fileSize: "1.8 MB"
  },
  {
     id: "DOC-0881",
     name: "Agrément Transport Matières Dangereuses",
     type: "Permit",
     status: "Expiring", // Yellow warning
     expiry: "05 Mars 2026",
     fileSize: "850 KB"
  },
  {
     id: "DOC-1102",
     name: "Visite Technique FL-02",
     type: "Report",
     status: "Expired", // Red alert
     expiry: "01 Fév 2026",
     fileSize: "4.2 MB"
  }
]

export function DocumentsPage() {
  const [docs, setDocs] = React.useState(DOCUMENTS)
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const handleUpload = () => {
    setUploading(true)
    let p = 0
    const interval = setInterval(() => {
        p += 10
        setProgress(p)
        if(p >= 100) {
            clearInterval(interval)
            setUploading(false)
            setProgress(0)
            toast.success("Document Uploadé", {
                description: "Vérification OCR en cours...",
                icon: <CheckCircle className="text-emerald-500" />
            })
            // Add fake doc
            setDocs(prev => [{
                id: `DOC-${Math.floor(Math.random()*10000)}`,
                name: "Nouveau Document Scanné",
                type: "Unknown",
                status: "Valid",
                expiry: "En attente",
                fileSize: "1.2 MB"
            }, ...prev])
        }
    }, 200)
  }

  const deleteDoc = (id: string) => {
      setDocs(prev => prev.filter(d => d.id !== id))
      toast("Document supprimé", { icon: <Trash2 className="text-slate-500" /> })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
             <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                E-DOCS <span className="text-emerald-500">SECURE</span>
             </h1>
             <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Coffre-fort Numérique & Conformité</p>
          </div>
          
          <Button 
             className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs h-12 px-6 rounded-xl flex gap-2"
             onClick={handleUpload}
             disabled={uploading}
          >
             {uploading ? (
                 <>Transfert... {progress}%</>
             ) : (
                 <><Upload className="h-4 w-4" /> Uploader</>
             )}
          </Button>
       </div>

       {uploading && (
           <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
               <motion.div 
                 className="h-full bg-emerald-500"
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
               />
           </div>
       )}

       <div className="grid gap-4">
          <AnimatePresence>
             {docs.map((doc) => (
                <motion.div
                   key={doc.id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, height: 0 }}
                   layout
                >
                   <Card className="bg-slate-950/40 border-white/5 hover:bg-white/5 transition-all duration-300 group overflow-hidden">
                      <div className="p-4 flex items-center gap-6">
                         <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                            doc.status === "Valid" ? "bg-emerald-500/10 text-emerald-500" :
                            doc.status === "Expiring" ? "bg-yellow-500/10 text-yellow-500" :
                            "bg-red-500/10 text-red-500"
                         }`}>
                            <FileText size={24} />
                         </div>

                         <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                               <h3 className="text-lg font-bold text-white truncate">{doc.name}</h3>
                               <Badge variant={doc.status === "Valid" ? "default" : "destructive"} className={`text-[9px] uppercase font-black border-none ${
                                  doc.status === "Valid" ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30" :
                                  doc.status === "Expiring" ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30" :
                                  "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                               }`}>
                                  {doc.status}
                               </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-slate-500 text-xs mt-1">
                               <span className="flex items-center gap-1 font-mono"><Calendar size={12} /> Exp: {doc.expiry}</span>
                               <span className="font-mono">{doc.fileSize}</span>
                               <span className="font-mono opacity-50">{doc.type}</span>
                            </div>
                         </div>

                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                               <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                               <Download size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10" onClick={() => deleteDoc(doc.id)}>
                               <Trash2 size={16} />
                            </Button>
                         </div>
                      </div>
                      {doc.status === "Expiring" && (
                         <div className="h-1 w-full bg-yellow-500/20">
                            <div className="h-full bg-yellow-500 w-3/4 animate-pulse relative overflow-hidden">
                               <div className="absolute inset-0 bg-white/20 -translate-x-full animate-[shimmer_2s_infinite]" />
                            </div>
                         </div>
                      )}
                      {doc.status === "Expired" && (
                         <div className="h-1 w-full bg-red-500" />
                      )}
                   </Card>
                </motion.div>
             ))}
          </AnimatePresence>
       </div>
    </div>
  )
}
