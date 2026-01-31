"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Lock, 
  Star, 
  Award, 
  Video, 
  NotebookPen, 
  ChevronRight, 
  Trophy, 
  Zap,
  Clock,
  ArrowLeft,
  Share2,
  Download
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// --- Mock Data ---

const COURSES = [
  {
    id: "semis",
    title: "Optimisation des Semis Précision",
    description: "Apprenez à calibrer vos semoirs pour une densité parfaite selon le type de sol.",
    duration: "45 min",
    level: "Intermédiaire",
    thumbnail: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800",
    modules: [
      { id: 1, title: "Analyse du sol avant semis", completed: true },
      { id: 2, title: "Calibration du matériel", completed: false },
      { id: 3, title: "Profondeur et espacement", completed: false },
    ]
  },
  {
    id: "irrigation",
    title: "Irrigation Intelligente & Spectre",
    description: "Utilisation des données satellites pour une gestion hydrique zéro gaspillage.",
    duration: "1h 20min",
    level: "Avancé",
    thumbnail: "https://images.unsplash.com/photo-1542332213-31f873480a71?auto=format&fit=crop&q=80&w=800",
    modules: [
      { id: 1, title: "Indices NDVI et besoin en eau", completed: true },
      { id: 2, title: "Programmation des pivots IA", completed: true },
      { id: 3, title: "Maintenance des systèmes", completed: false },
    ]
  },
  {
    id: "commerce",
    title: "Maîtrise de la Commercialisation B2B",
    description: "Stratégies de négociation pour les contrats à terme et marchés mondiaux.",
    duration: "2h 00min",
    level: "Stratégique",
    thumbnail: "https://images.unsplash.com/photo-1454165833767-027ffea7028c?auto=format&fit=crop&q=80&w=800",
    modules: [
      { id: 1, title: "Comprendre les marchés à terme", completed: false },
      { id: 2, title: "Négociation avec les grossistes", completed: false },
      { id: 3, title: "Gestion des risques de prix", completed: false },
    ]
  }
]

// --- Sub-Components ---

/**
 * LearningPathViewer: Duolingo-style node path
 */
function LearningPathViewer({ onSelectNode }: { onSelectNode: (course: any) => void }) {
  return (
    <div className="relative py-20 overflow-hidden">
      {/* Background Path Line */}
      <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-full pointer-events-none opacity-10" viewBox="0 0 400 1000">
         <path 
           d="M200,0 Q350,250 200,500 T200,1000" 
           fill="none" 
           stroke="currentColor" 
           strokeWidth="8" 
           strokeDasharray="20 20"
           className="text-[#D4A017]"
         />
      </svg>

      <div className="relative flex flex-col items-center gap-40">
        {COURSES.map((course, idx) => {
          const isLocked = idx > 1 // Simulation
          const progress = idx === 0 ? 100 : idx === 1 ? 66 : 0
          
          return (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                "relative group",
                idx % 2 === 0 ? "translate-x-[-100px]" : "translate-x-[100px]"
              )}
            >
              {/* Node Circle */}
              <button 
                onClick={() => !isLocked && onSelectNode(course)}
                disabled={isLocked}
                className={cn(
                  "h-32 w-32 rounded-full flex items-center justify-center relative transition-all duration-500",
                  "shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-110",
                  isLocked 
                    ? "bg-slate-800 border-4 border-slate-700 cursor-not-allowed" 
                    : "bg-[#1B4D3E] border-4 border-[#D4A017] cursor-pointer"
                )}
              >
                {isLocked ? (
                  <Lock className="text-slate-500 h-10 w-10" />
                ) : (
                   <div className="relative">
                      <BookOpen className="text-white h-10 w-10" />
                      <div className="absolute -top-10 -right-10">
                        <Badge className="bg-[#D4A017] text-white border-none text-[8px] font-black">{progress}%</Badge>
                      </div>
                   </div>
                )}
                
                {/* SVG Progress Ring */}
                {!isLocked && (
                  <svg className="absolute inset-0 -rotate-90 pointer-events-none" viewBox="0 0 128 128">
                    <circle 
                      cx="64" cy="64" r="60" 
                      fill="none" 
                      stroke="rgba(212, 160, 23, 0.2)" 
                      strokeWidth="4" 
                    />
                    <motion.circle 
                      cx="64" cy="64" r="60" 
                      fill="none" 
                      stroke="#D4A017" 
                      strokeWidth="4" 
                      strokeDasharray="377"
                      initial={{ strokeDashoffset: 377 }}
                      whileInView={{ strokeDashoffset: 377 - (377 * progress / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                )}
              </button>

              {/* Course Info Label */}
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 w-80 space-y-2",
                idx % 2 === 0 ? "left-40" : "right-40 text-right"
              )}>
                 <Badge variant="outline" className="border-[#D4A017]/30 text-[#D4A017] uppercase text-[9px] tracking-widest leading-none px-3 py-1 font-black bg-[#D4A017]/5">{course.level}</Badge>
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">{course.title}</h3>
                 <p className="text-slate-500 text-xs font-bold leading-relaxed">{course.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * VideoPlayerPro: HTML5 Custom Player with Bookmarks
 */
function VideoPlayerPro({ course }: { course: any }) {
  const [bookmarks, setBookmarks] = React.useState<{ time: number, text: string }[]>([])
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const addBookmark = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime
      setBookmarks([...bookmarks, { time, text: `Note à ${Math.floor(time)}s` }])
      toast.success("Bookmark ajouté", {
        description: `Note enregistrée à la timeline ${Math.floor(time)}s.`
      })
    }
  }

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      <div className="lg:col-span-8 space-y-8">
        <div className="relative rounded-[3rem] overflow-hidden shadow-3xl bg-black aspect-video group border border-white/5">
           <video 
             ref={videoRef}
             className="w-full h-full object-cover"
             poster={course.thumbnail}
             controls
           >
             <source src="https://assets.mixkit.co/videos/preview/mixkit-farmer-walking-in-a-field-at-sunset-1200-preview.mp4" type="video/mp4" />
           </video>
           
           <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
             <Button onClick={addBookmark} className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white rounded-2xl flex gap-2 font-black text-xs uppercase">
                <NotebookPen size={14} /> POSER UNE NOTE
             </Button>
           </div>
        </div>

        <div className="flex items-center justify-between p-10 bg-white/2 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-2xl">
           <div className="space-y-2">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{course.title}</h2>
              <div className="flex gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
                 <span className="flex items-center gap-2 text-[#D4A017]"><Clock size={14} /> {course.duration}</span>
                 <span className="flex items-center gap-2"><Video size={14} /> 12 Modules</span>
                 <span className="flex items-center gap-2"><Star size={14} className="fill-[#D4A017] text-[#D4A017]" /> 4.9/5</span>
              </div>
           </div>
           <Button className="bg-[#1B4D3E] hover:bg-[#D4A017] text-white rounded-2xl h-16 px-10 font-black shadow-2xl transition-all">
              VALIDER LE MODULE
           </Button>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <Card className="bg-white/2 backdrop-blur-3xl border-white/5 border-none shadow-3xl rounded-[3rem] overflow-hidden">
           <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter text-white">
                 <NotebookPen className="text-[#D4A017]" /> VOS NOTES
              </CardTitle>
           </CardHeader>
           <CardContent className="p-8 space-y-4">
              {bookmarks.length === 0 ? (
                <p className="text-slate-500 text-sm italic font-bold">Aucune note pour le moment...</p>
              ) : (
                bookmarks.map((bm, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#D4A017]/30 transition-all cursor-pointer group"
                    onClick={() => { if(videoRef.current) videoRef.current.currentTime = bm.time }}
                  >
                     <span className="text-xs font-black text-white">{bm.text}</span>
                     <Play size={10} className="text-[#D4A017] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))
              )}
           </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#1B4D3E] to-[#0a1f18] border-none shadow-3xl rounded-[3rem] overflow-hidden p-8">
           <div className="space-y-6">
              <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                <Award className="text-[#D4A017] h-8 w-8" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-xl font-black text-white uppercase tracking-tighter">CERTIFICATION</h4>
                 <p className="text-white/60 text-sm font-bold leading-relaxed">
                   Terminez ce cours à 100% pour débloquer votre certificat NFT vérifiable sur la blockchain AgriLogistic.
                 </p>
              </div>
              {/* @ts-ignore */}
              <Progress value={course.modules.filter((m: any) => m.completed).length / course.modules.length * 100} className="h-2 bg-black/20" />
           </div>
        </Card>
      </div>
    </div>
  )
}

/**
 * CertificationCenter: Quiz & Certificate
 */
function CertificationCenter() {
  const [showCertificate, setShowCertificate] = React.useState(false)

  const handleCompleteQuiz = () => {
    toast.success("EXAMEN RÉUSSI !", {
      description: "Vous avez obtenu un score de 100%. Certification débloquée."
    })
    setShowCertificate(true)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
       <div className="text-center space-y-4">
          <Badge className="bg-[#D4A017] text-white px-6 py-2 rounded-full font-black text-xs tracking-widest uppercase">Examen de Certification</Badge>
          <h2 className="text-6xl font-black text-white tracking-tighter leading-none uppercase">PROUVEZ VOTRE <span className="text-[#D4A017]">MAÎTRISE</span></h2>
          <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.4em]">Validation des acquis par intelligence artificielle</p>
       </div>

       <Card className="bg-white/2 backdrop-blur-3xl border-white/10 border-none shadow-3xl rounded-[4rem] overflow-hidden p-16 space-y-12">
          <div className="space-y-8">
             <div className="flex justify-between items-end border-b border-white/10 pb-8">
                <div className="space-y-2">
                   <p className="text-[#D4A017] font-black text-xs uppercase tracking-widest">Question 1 sur 3</p>
                   <h3 className="text-3xl font-black text-white tracking-tighter">Quel est l'indice NDVI optimal pour déclencher une irrigation de précision sur le blé au stade floraison ?</h3>
                </div>
                <div className="text-right">
                   <Zap className="text-amber-500 h-10 w-10 animate-pulse" />
                </div>
             </div>
             
             <div className="grid gap-6">
                {[
                  "Inférieur à 0.40",
                  "Compris entre 0.65 et 0.85",
                  "Supérieur à 1.0 (Saturation)",
                  "Peu importe l'indice NDVI"
                ].map((opt, i) => (
                  <button 
                    key={i} 
                    className="group flex items-center justify-between p-8 bg-white/5 border-2 border-transparent hover:border-[#D4A017]/40 rounded-[2.5rem] transition-all text-left"
                    onClick={handleCompleteQuiz}
                  >
                     <span className="text-lg font-black text-white group-hover:text-[#D4A017] transition-colors">{opt}</span>
                     <div className="h-6 w-6 rounded-full border-4 border-white/20 group-hover:border-[#D4A017] transition-all" />
                  </button>
                ))}
             </div>
          </div>
       </Card>

       <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
          <DialogContent className="max-w-[800px] p-0 border-none bg-white dark:bg-[#0a0a0a] rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
             <div className="relative p-20 text-center space-y-12 overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#000]">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-[#D4A017]/10 to-transparent pointer-events-none" />
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#1B4D3E]/30 blur-[150px] rounded-full" />
                
                <div className="space-y-6 relative z-10">
                   <Trophy className="h-24 w-24 text-[#D4A017] mx-auto animate-bounce" />
                   <div className="space-y-2">
                      <p className="text-[#D4A017] font-black text-sm uppercase tracking-[0.6em]">CERTIFICAT DE RÉUSSITE</p>
                      <h3 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">MAÎTRE <span className="text-[#D4A017]">IRRIGUANT</span></h3>
                   </div>
                </div>

                <div className="space-y-8 relative z-10">
                   <p className="text-slate-400 font-bold text-xl leading-relaxed">
                     Ce document atteste que <span className="text-white underline decoration-[#D4A017] decoration-4 underline-offset-8">Jean Dupont</span> a complété avec succès le module expert sur <br/> 
                     <span className="text-white">l'Irrigation Intelligente & Analyse Spectrale.</span>
                   </p>
                   
                   <div className="flex justify-center gap-12 pt-8">
                      <div className="text-center">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">ID CERTIFICAT</p>
                         <p className="text-white font-black text-xs bg-white/5 py-2 px-6 rounded-full border border-white/10 tracking-widest uppercase">AD-7742-BL-2024</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Statut Blockchain</p>
                         <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-6 py-2 rounded-full font-black text-[10px] uppercase">
                            NFT Minted OK
                         </Badge>
                      </div>
                   </div>
                </div>

                <div className="pt-12 flex gap-4 relative z-10">
                   <Button className="flex-1 bg-[#1B4D3E] hover:bg-emerald-700 text-white rounded-2xl h-16 font-black gap-3 shadow-2xl transition-all">
                      <Download size={20} /> TÉLÉCHARGER LE CERTIFICAT
                   </Button>
                   <Button variant="outline" className="h-16 w-16 rounded-2xl border-white/10 hover:bg-white/5 text-white shadow-2xl transition-all">
                      <Share2 size={20} />
                   </Button>
                </div>
             </div>
          </DialogContent>
       </Dialog>
    </div>
  )
}

// --- Mock Data Expanded ---

const ARTICLES = [
  {
    id: 1,
    title: "L'IA au service de la régénération des sols",
    category: "Technologie",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Contrats de carbone : Nouveau revenu pour les céréaliers",
    category: "Économie",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Optimiser son rendement en période de sécheresse",
    category: "Agronomie",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800"
  }
]

const LEADERBOARD = [
  { rank: 1, name: "Marc A.", points: 45200, avatar: "MA" },
  { rank: 2, name: "Sophie L.", points: 42100, avatar: "SL" },
  { rank: 3, name: "Jean D.", points: 38900, avatar: "JD" },
]

// --- Main Module ---

export function AgriAcademyModule() {
  const [selectedCourse, setSelectedCourse] = React.useState<any>(null)
  const [view, setView] = React.useState<"path" | "player" | "quiz">("path")

  const handleStartCourse = (course: any) => {
    setSelectedCourse(course)
    setView("player")
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-12">
      {/* Immersive Dark Header */}
      <div className="relative rounded-[4rem] overflow-hidden p-12 lg:p-20 bg-[#050505] border border-white/5 shadow-3xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1B4D3E]/20 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4A017]/10 blur-[120px] rounded-full" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
               <Badge className="bg-[#1B4D3E] text-[#D4A017] px-6 py-2 rounded-full font-black text-xs tracking-[0.3em] border border-[#D4A017]/20 uppercase mb-4">ACADÉMIE_PLATINIUM v2.0</Badge>
            </motion.div>
            <h1 className="text-7xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">
              AGRI<span className="text-[#D4A017]">ACADEMY</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[13px] tracking-[0.5em] mt-4 flex items-center gap-4">
              <span className="h-1.5 w-12 bg-[#D4A017] rounded-full" /> 
              Propulser l'agriculture par le savoir
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] text-center min-w-[160px]">
               <p className="text-[#D4A017] text-3xl font-black tabular-nums">1.2k</p>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Élèves Actifs</p>
            </div>
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] text-center min-w-[160px]">
               <p className="text-emerald-500 text-3xl font-black tabular-nums">98%</p>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Taux de Réussite</p>
            </div>
          </div>
        </div>

        {view !== "path" && (
          <Button 
            onClick={() => setView("path")}
            className="mt-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl h-14 px-8 font-black uppercase text-xs flex gap-3 tracking-[0.2em] border border-white/10"
          >
            <ArrowLeft size={16} /> Retour au Hub
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === "path" && (
          <motion.div 
            key="path" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-12 gap-10"
          >
            {/* Left Content: The Path & Articles */}
            <div className="lg:col-span-8 space-y-12">
               {/* Main Path Section */}
               <Card className="bg-[#050505] border-white/5 shadow-3xl rounded-[3.5rem] relative overflow-hidden min-h-[800px]">
                  <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
                  <div className="relative z-10 p-12">
                     <div className="flex items-center justify-between mb-20">
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">PARCOURS <span className="text-[#D4A017]">CERTIFIANT</span></h2>
                        <div className="flex items-center gap-4">
                           <div className="flex -space-x-4">
                              {[1,2,3].map(v => (
                                 <div key={v} className="h-10 w-10 rounded-full border-4 border-[#050505] bg-slate-800" />
                              ))}
                           </div>
                           <p className="text-[10px] font-black text-slate-500 uppercase">+150 collègues apprennent ici</p>
                        </div>
                     </div>
                     <LearningPathViewer onSelectNode={handleStartCourse} />
                  </div>
               </Card>

               {/* Articles Section */}
               <div className="space-y-8">
                  <div className="flex items-center justify-between px-6">
                     <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                        <Zap className="text-[#D4A017] h-8 w-8" /> DERNIÈRES PUBLICATIONS
                     </h3>
                     <Button variant="link" className="text-[#D4A017] font-black text-xs uppercase tracking-widest">Tout voir</Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                     {ARTICLES.map((article) => (
                        <Card key={article.id} className="bg-[#050505] border-white/5 overflow-hidden group hover:border-[#D4A017]/30 transition-all cursor-pointer rounded-[2.5rem]">
                           <div className="h-48 overflow-hidden relative">
                              <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <Badge className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white border-none font-black text-[9px] px-3">{article.category}</Badge>
                           </div>
                           <CardHeader className="p-6">
                              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2">
                                 <Clock size={12} /> {article.readTime}
                              </div>
                              <CardTitle className="text-lg font-black text-white leading-tight group-hover:text-[#D4A017] transition-colors">{article.title}</CardTitle>
                           </CardHeader>
                        </Card>
                     ))}
                  </div>
               </div>
            </div>

            {/* Right Sidebar: Stats, Leaderboard, Masterclass */}
            <div className="lg:col-span-4 space-y-10 h-fit lg:sticky lg:top-10">
               {/* User Dashboard Mini */}
               <Card className="bg-gradient-to-br from-[#1B4D3E] to-[#0a1f18] border-none shadow-3xl rounded-[3.5rem] p-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                     <Trophy size={150} />
                  </div>
                  <div className="relative z-10 space-y-8">
                     <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-3xl bg-[#D4A017] flex items-center justify-center text-black shadow-2xl">
                           <Trophy size={32} />
                        </div>
                        <div>
                           <p className="text-[#D4A017] font-black text-xs uppercase tracking-[0.2em]">STATUT_EXPERT</p>
                           <h4 className="text-3xl font-black text-white tracking-tighter uppercase">NV. 24</h4>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                           <span className="text-white/60">XP RÉCOLTÉ</span>
                           <span className="text-[#D4A017]">12,450 / 15,000</span>
                        </div>
                        {/* @ts-ignore */}
                        <Progress value={82} className="h-3 bg-black/30" />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/5 text-center">
                           <p className="text-[10px] font-black text-white/40 uppercase mb-1">Badges NFT</p>
                           <p className="text-2xl font-black text-white">12</p>
                        </div>
                        <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/5 text-center">
                           <p className="text-[10px] font-black text-white/40 uppercase mb-1">Certificats</p>
                           <p className="text-2xl font-black text-white">03</p>
                        </div>
                     </div>

                     <Button onClick={() => setView("quiz")} className="w-full bg-white text-black hover:bg-[#D4A017] transition-all rounded-2xl h-16 font-black uppercase text-xs tracking-widest shadow-2xl">
                        VALIDER UN EXAMEN
                     </Button>
                  </div>
               </Card>

               {/* Leaderboard */}
               <Card className="bg-[#050505] border-white/5 shadow-3xl rounded-[3rem] p-8 space-y-6">
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                     <Star className="text-[#D4A017] h-5 w-5 fill-[#D4A017]" /> TOP AGRO-STRATÈGES
                  </h4>
                  <div className="space-y-4">
                     {LEADERBOARD.map((user) => (
                        <div key={user.rank} className="flex items-center justify-between p-4 bg-white/2 rounded-2xl border border-white/5 group hover:bg-white/5 transition-all">
                           <div className="flex items-center gap-4">
                              <span className={cn(
                                 "text-xs font-black w-6",
                                 user.rank === 1 ? "text-[#D4A017]" : "text-slate-500"
                              )}>0{user.rank}</span>
                              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-white overflow-hidden border border-white/10 group-hover:border-[#D4A017]/50">
                                 {user.avatar}
                              </div>
                              <span className="text-sm font-black text-white">{user.name}</span>
                           </div>
                           <span className="text-[10px] font-black text-[#D4A017] tabular-nums">{user.points.toLocaleString()} XP</span>
                        </div>
                     ))}
                  </div>
                  <Button variant="ghost" className="w-full text-slate-500 hover:text-white font-black text-[10px] uppercase">Voir le classement complet</Button>
               </Card>

               {/* Masterclass Highlight */}
               <div className="relative group overflow-hidden rounded-[3.5rem] border border-white/5 aspect-[4/5]">
                  <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" alt="Masterclass" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10 space-y-6">
                     <Badge className="bg-[#D4A017] text-black border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5">LIVE_MASTERCLASS</Badge>
                     <div>
                        <h4 className="text-3xl font-black text-white tracking-tighter uppercase leading-[0.9]">SOLS VIVANTS AVEC DR. ARIS</h4>
                        <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Demain à 18:00 (CET)</p>
                     </div>
                     <Button className="w-full bg-[#1B4D3E] hover:bg-emerald-700 text-white rounded-2xl h-14 font-black text-xs uppercase tracking-widest transition-all shadow-2xl">RÉSERVER MA PLACE</Button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {view === "player" && selectedCourse && (
          <motion.div 
            key="player" 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -50 }}
          >
             <VideoPlayerPro course={selectedCourse} />
          </motion.div>
        )}

        {view === "quiz" && (
          <motion.div 
            key="quiz" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
          >
             <CertificationCenter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
