"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Sprout, 
  ChevronRight, 
  ChevronLeft, 
  Wallet, 
  Send,
  Sparkles,
  Target,
  BarChart3,
  Bot,
  User,
  Info,
  Layers,
  Zap,
  Leaf,
  Cpu,
  Globe,
  Activity,
  ArrowUpRight
} from "lucide-react"
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// --- Mock Data ---
const predictionData = [
  { month: "Jan", history: 400, prediction: null },
  { month: "Feb", history: 450, prediction: null },
  { month: "Mar", history: 420, prediction: null },
  { month: "Apr", history: 480, prediction: null },
  { month: "May", history: 510, prediction: 510 },
  { month: "Jun", history: null, prediction: 540, low: 510, high: 570 },
  { month: "Jul", history: null, prediction: 580, low: 530, high: 630 },
  { month: "Aug", history: null, prediction: 610, low: 550, high: 670 },
]

// --- Components ---

function DemandPredictionChart() {
  return (
    <Card className="border-none bg-[#050505] text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden group">
      <CardHeader className="p-10 border-b border-white/5 relative">
        <div className="absolute top-0 right-0 p-8">
           <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse delay-75" />
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse delay-150" />
           </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4">
              <TrendingUp className="h-6 w-6 text-[#D4A017]" /> 
              ANALYSE <span className="text-[#D4A017]">PRÉDICTIVE</span>
            </CardTitle>
            <CardDescription className="text-white/30 font-black uppercase text-[10px] tracking-[0.3em]">
              AGRODEEP NEURAL ENGINE v4.2 // STRATÉGIE DE FLUX
            </CardDescription>
          </div>
          <div className="text-right">
             <Badge className="bg-[#D4A017]/10 text-[#D4A017] border border-[#D4A017]/20 px-4 py-1.5 rounded-full font-black text-[10px]">
                ACCURACY: 98.2%
             </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-10 h-[450px] relative">
        <div className="absolute inset-x-10 top-10 flex justify-between z-10">
           <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">VOLUME ACTUEL</p>
              <p className="text-xl font-black">510.4 T</p>
           </div>
           <div className="p-4 bg-[#D4A017]/10 backdrop-blur-md rounded-2xl border border-[#D4A017]/20">
              <p className="text-[8px] font-black text-[#D4A017]/60 uppercase tracking-widest mb-1">CIBLE PRÉVUE (AUG)</p>
              <p className="text-xl font-black text-[#D4A017]">610.0 T</p>
           </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={predictionData} margin={{ top: 80, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A017" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#D4A017" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B4D3E" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#1B4D3E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#ffffff20" 
              fontSize={10} 
              fontWeight="black" 
              tickMargin={15}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#ffffff20" 
              fontSize={10} 
              fontWeight="black" 
              tickFormatter={(v) => `${v}T`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ stroke: '#D4A017', strokeWidth: 1, strokeDasharray: '4 4' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const isPrediction = data.prediction !== null && data.history === null;
                  return (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-6 bg-[#0a1f18]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-3xl space-y-4 min-w-[200px]"
                    >
                       <div className="flex justify-between items-center">
                          <p className="text-[#D4A017] uppercase text-[10px] font-black tracking-widest">{data.month}</p>
                          <Badge className={cn("text-[8px] font-black px-2", isPrediction ? "bg-[#D4A017] text-black" : "bg-white/10")}>
                             {isPrediction ? "PROJECTION" : "RÉEL"}
                          </Badge>
                       </div>
                       <div>
                          <p className="text-white text-3xl font-black tracking-tighter">
                             {isPrediction ? data.prediction : data.history} <span className="text-sm text-white/40 font-bold uppercase">Tonnes</span>
                          </p>
                       </div>
                       <div className="pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                             <ArrowUpRight className="h-3 w-3" />
                             Action : {isPrediction ? "Augmenter Stocks" : "Observation"}
                          </div>
                       </div>
                    </motion.div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey={"high" as any} 
              stroke="transparent" 
              fill="url(#colorHigh)" 
            />
            <Area 
              type="monotone" 
              dataKey={"history" as any} 
              stroke="#1B4D3E" 
              strokeWidth={4} 
              fill="url(#colorHistory)"
              dot={{ r: 6, fill: "#1B4D3E", stroke: "#050505", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#D4A017", stroke: "white", strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey={"prediction" as any} 
              stroke="#D4A017" 
              strokeWidth={4} 
              strokeDasharray="10 10" 
              fill="transparent"
              dot={{ r: 6, fill: "#D4A017", stroke: "#050505", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function AIAdvisorChat() {
  const [messages, setMessages] = React.useState([
    { role: "assistant", content: "Agent Core opérationnel. Je synchronise les données environnementales de vos 4 parcelles... Comment puis-je optimiser vos cycles aujourd'hui ?" }
  ])
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const chatEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = { role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      let response = "Analyse terminée. L'indice NDVI de la parcelle SUD indique un stress hydrique de 12%. Recommandation : Irrigation ciblée de 14h à 18h."
      if (input.toLowerCase().includes("pluie") || input.toLowerCase().includes("pleut") || input.toLowerCase().includes("météo")) {
        response = "ALERTE MÉTÉO : Orages prévus dans 45min. J'ai préventivement sécurisé les vannes de la zone B. Vérifiez l'évacuation des fossés."
      }
      setMessages(prev => [...prev, { role: "assistant", content: response }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <Card className="border-none bg-white dark:bg-[#0a1f18] shadow-3xl rounded-[3rem] flex flex-col h-[700px] overflow-hidden border border-slate-100 dark:border-white/5">
      <CardHeader className="p-10 border-b border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 relative">
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-[#1B4D3E] to-[#0a1f18] flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-105">
              <Cpu className="h-8 w-8 text-[#D4A017]" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-4 border-white dark:border-[#0a1f18] animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-xl font-black tracking-widest uppercase text-[#1B4D3E] dark:text-white">AGRO-BOT V4</CardTitle>
            <div className="flex items-center gap-2 mt-1">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Latence: 24ms // SSL Sécurisé</p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide bg-[url('/grid.svg')] bg-center">
        {messages.map((m, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: m.role === "user" ? 20 : -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "flex gap-4 max-w-[90%]",
              m.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
               "h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center shadow-lg transition-all",
               m.role === "user" ? "bg-white dark:bg-white/10" : "bg-[#1B4D3E] text-white"
            )}>
              {m.role === "user" ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
            </div>
            <div className={cn(
              "p-6 rounded-[2rem] font-bold text-sm leading-relaxed shadow-xl",
              m.role === "user" 
                ? "bg-[#D4A017] text-white rounded-tr-none" 
                : "bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white rounded-tl-none border border-slate-100 dark:border-white/5"
            )}>
              {m.content}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-4">
            <div className="h-12 w-12 bg-[#1B4D3E] rounded-2xl flex items-center justify-center text-white">
              <Bot className="h-6 w-6" />
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] rounded-tl-none flex gap-2 border border-slate-100 dark:border-white/5">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="h-2 w-2 bg-[#D4A017] rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="h-2 w-2 bg-[#D4A017] rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="h-2 w-2 bg-[#D4A017] rounded-full" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </CardContent>

      <div className="p-10 bg-slate-50/50 dark:bg-white/2 border-t border-slate-100 dark:border-white/5 space-y-6">
        <div className="flex flex-wrap gap-2">
          {["SANTÉ PARCELLES", "MÉTÉO 24H", "PRIX DU SOJA", "CONSEIL SEMIS"].map(chip => (
             <button 
                key={chip} 
                onClick={() => setInput(chip)} 
                className="px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-[9px] font-black uppercase text-slate-500 hover:text-[#D4A017] hover:border-[#D4A017] transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
               {chip}
             </button>
          ))}
        </div>
        <div className="relative group">
          <Input 
            placeholder="Interrogez le savoir agronomique d'AgroDeep..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="h-16 bg-white dark:bg-black/20 border-none rounded-3xl px-8 font-bold text-md focus:ring-4 ring-[#1B4D3E]/10 pr-20 shadow-inner"
          />
          <Button 
            onClick={handleSend}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 p-0 bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white rounded-2xl shadow-xl shadow-[#1B4D3E]/20 transition-transform active:scale-90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

function CropRecommender() {
  const [step, setStep] = React.useState(1)
  const [soilType, setSoilType] = React.useState("")
  const [budget, setBudget] = React.useState(500)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const steps = [
    { title: "GÉOLOGIE", icon: Target },
    { title: "CAPITAL", icon: Wallet },
    { title: "STRATÉGIE", icon: Sparkles }
  ]

  const next = () => {
    if (step === 2) {
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        setStep(3)
      }, 2000)
    } else {
      setStep(s => Math.min(s + 1, 3))
    }
  }
  const back = () => setStep(s => Math.max(s - 1, 1))

  return (
    <Card className="border-none bg-[#0a1f18] text-white shadow-3xl rounded-[3rem] overflow-hidden relative min-h-[600px] border border-white/5 group">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-white/5 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#1B4D3E] via-[#D4A017] to-[#1B4D3E] bg-[length:200%_100%]" 
          animate={{ 
            width: `${(step / 3) * 100}%`,
            backgroundPosition: ["0% 0%", "100% 0%"]
          }}
          transition={{ 
             width: { duration: 0.5 },
             backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
          }}
        />
      </div>

      <CardHeader className="p-12 pb-6">
        <div className="flex justify-between items-center mb-12">
          {steps.map((s, i) => (
             <div key={i} className={cn(
               "flex flex-col items-center gap-4 group/step cursor-pointer",
               i + 1 <= step ? "text-white" : "text-white/20"
             )} onClick={() => i + 1 < step && setStep(i + 1)}>
                <div className={cn(
                  "h-16 w-16 rounded-[1.5rem] flex items-center justify-center border-2 transition-all duration-500",
                  i + 1 < step ? "bg-emerald-500 border-emerald-500 shadow-xl shadow-emerald-500/20" : 
                  i + 1 === step ? "bg-[#D4A017] border-[#D4A017] shadow-2xl shadow-[#D4A017]/30 scale-110" : "border-white/10"
                )}>
                  <s.icon className={cn("h-6 w-6", i + 1 <= step ? "text-black dark:text-white" : "")} />
                </div>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase">{s.title}</span>
             </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-12 pt-0">
        <AnimatePresence mode="wait">
          {isProcessing ? (
             <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center space-y-8 py-20"
             >
                <div className="relative">
                   <div className="h-24 w-24 rounded-full border-t-4 border-[#D4A017] animate-spin" />
                   <Cpu className="h-10 w-10 text-[#D4A017] absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                   <p className="text-xl font-black uppercase tracking-tighter">SIMULATION DES CYCLES Culturels</p>
                   <p className="text-white/30 font-bold text-[10px] uppercase tracking-widest">Analyse de 1.4M de points de données environnementales...</p>
                </div>
             </motion.div>
          ) : step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-4 text-center">
                <h3 className="text-3xl font-black uppercase tracking-tighter">ANALYSE GÉOLOGIQUE</h3>
                <p className="text-white/40 font-bold text-sm">Précisez la composition du substrat pour optimiser les nutriments.</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {["SABLEUX", "ARGILEUX", "LIMONEUX", "VOLCANIQUE"].map(type => (
                  <button 
                    key={type}
                    onClick={() => setSoilType(type)}
                    className={cn(
                      "p-8 rounded-[2.5rem] border-2 font-black tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98]",
                      soilType === type 
                        ? "bg-white text-[#0a1f18] border-white shadow-3xl" 
                        : "border-white/5 bg-white/2 hover:border-white/20"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && !isProcessing && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4 text-center">
                <h3 className="text-3xl font-black uppercase tracking-tighter">ALLOCATION CAPITAL</h3>
                <p className="text-white/40 font-bold text-sm">Déterminez le budget d'intrants et de monitoring requis.</p>
              </div>
              <div className="space-y-16 py-12 px-4 bg-white/2 rounded-[3.5rem] border border-white/5 shadow-inner">
                <div className="relative">
                   <input 
                    type="range" min="100" max="5000" step="100" value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    className="w-full h-3 bg-white/10 rounded-full appearance-none accent-[#D4A017] cursor-pointer"
                   />
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#D4A017] text-black rounded-xl font-black text-xs shadow-xl">
                      BUDGET OPTIMISÉ
                   </div>
                </div>
                <div className="flex justify-between items-end">
                   <div className="text-left space-y-1">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">BASIC</p>
                      <p className="text-2xl font-black text-white">$100</p>
                   </div>
                   <div className="text-center group-hover:scale-110 transition-transform">
                      <div className="text-6xl font-black text-[#D4A017] tracking-tighter mb-2">
                        ${budget}
                      </div>
                      <Badge className="bg-[#D4A017]/10 text-[#D4A017] border-none uppercase font-black text-[9px] tracking-widest px-4 py-1">Capital / Parcelle</Badge>
                   </div>
                   <div className="text-right space-y-1">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">ELITE</p>
                      <p className="text-2xl font-black text-white">$5k</p>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10 text-center"
            >
              <div className="relative inline-block">
                 <div className="h-40 w-40 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-500 shadow-[0_0_80px_rgba(16,185,129,0.4)] animate-pulse">
                    <Leaf className="h-16 w-16 text-emerald-500" />
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-[#050505] p-4 rounded-3xl border border-white/10 shadow-2xl">
                    <Sparkles className="h-6 w-6 text-[#D4A017]" />
                 </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-5xl font-black uppercase tracking-tighter">MAÏS AG-TITAN</h3>
                <p className="text-emerald-500 font-black text-sm uppercase tracking-[0.4em]">SYNC IA: 99.8% OPTIMAL</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-1">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">ROI PRÉVU</p>
                    <p className="text-2xl font-black text-white">+240%</p>
                 </div>
                 <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-1">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">DURÉE CYCLE</p>
                    <p className="text-2xl font-black text-white">85j</p>
                 </div>
              </div>
              <Button className="w-full h-20 bg-white text-black hover:bg-slate-100 rounded-[2rem] font-black text-xl shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02]">
                 DÉPLOYER PROTOCOLE
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <div className="p-12 pt-0 absolute bottom-0 left-0 right-0 flex justify-between">
        {step > 1 && !isProcessing && (
           <Button variant="ghost" onClick={back} className="text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px]">
             <ChevronLeft className="mr-3 h-4 w-4" /> REFAIRE ANALYSE
           </Button>
        )}
        {step < 3 && !isProcessing && (
           <Button 
            disabled={step === 1 && !soilType}
            onClick={next} 
            className="ml-auto bg-[#D4A017] hover:bg-[#B8860B] text-black font-black px-12 h-14 rounded-2xl shadow-2xl shadow-[#D4A017]/20 flex gap-4 transition-all hover:scale-105"
           >
             GÉNÉRER STRATÉGIE <ChevronRight className="h-5 w-5" />
           </Button>
        )}
      </div>
    </Card>
  )
}

function PricingSimulator() {
  const [qty, setQty] = React.useState(25)
  const [price, setPrice] = React.useState(1800)
  const total = qty * price

  return (
    <Card className="border-none bg-white dark:bg-[#0a1f18] shadow-3xl rounded-[3rem] overflow-hidden group border border-slate-100 dark:border-white/5">
      <CardHeader className="p-10 border-b border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-white/1">
        <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-black flex items-center gap-4 tracking-tighter uppercase text-[#1B4D3E] dark:text-white">
              <BarChart3 className="h-7 w-7 text-[#D4A017]" /> SIMULATEUR <span className="text-[#D4A017]">DYNAMIC</span>
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
               <Activity className="h-5 w-5 text-emerald-500" />
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-10 space-y-12">
        <div className="space-y-8">
           <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <Label className="uppercase text-[11px] font-black text-slate-400 tracking-[0.2em] ml-1">STOCK DISPONIBLE</Label>
                 <p className="text-4xl font-black text-[#1B4D3E] dark:text-white tracking-tighter">{qty} <span className="text-lg text-slate-300">T</span></p>
              </div>
           </div>
           <div className="relative py-4">
              <input 
                  type="range" min="1" max="100" value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-100 dark:bg-white/10 rounded-full appearance-none accent-[#1B4D3E] cursor-pointer"
              />
              <div className="flex justify-between mt-4">
                 {[0, 25, 50, 75, 100].map(v => <span key={v} className="text-[10px] font-black text-slate-300">{v}</span>)}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <Label className="uppercase text-[11px] font-black text-slate-400 tracking-[0.2em] ml-1">VALEUR MARCHÉ ($/T)</Label>
                 <p className="text-4xl font-black text-[#D4A017] tracking-tighter">{price.toLocaleString()} <span className="text-lg text-slate-300">$</span></p>
              </div>
           </div>
           <div className="relative py-4">
              <input 
                  type="range" min="500" max="5000" step="100" value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-100 dark:bg-white/10 rounded-full appearance-none accent-[#D4A017] cursor-pointer"
              />
           </div>
        </div>

        <Card className="bg-[#1B4D3E] border-none rounded-[2.5rem] p-10 relative overflow-hidden group/revy shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/revy:scale-125 transition-transform duration-700">
              <Globe className="h-32 w-32 text-white" />
           </div>
           <div className="relative z-10 space-y-4">
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-1">REVENU BRUT CALCULÉ</p>
              <div className="flex items-baseline gap-2">
                 <p className="text-6xl font-black text-white tracking-tighter">
                   {total.toLocaleString()}
                 </p>
                 <span className="text-2xl font-black text-[#D4A017]">$</span>
              </div>
              <div className="flex items-center gap-3 pt-6">
                 <Button className="bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-black flex-1 h-14 rounded-2xl shadow-xl">
                    VENDRE MAINTENANT
                 </Button>
                 <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 w-14 rounded-2xl shadow-xl">
                    <TrendingUp className="h-5 w-5" />
                 </Button>
              </div>
           </div>
        </Card>
      </CardContent>
    </Card>
  )
}

export function AIIntelligenceModule() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-12">
      {/* Immersive AI Hero */}
      <div className="relative h-[450px] w-full rounded-[4rem] overflow-hidden shadow-3xl group">
        <img 
          src="/ai_agro_brain_hero.png" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
          alt="Intelligence Artificielle Agricole"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80" />
        
        <div className="absolute bottom-16 left-16 space-y-8 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 px-6 py-2.5 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 w-fit"
          >
            <div className="h-2 w-2 rounded-full bg-[#D4A017] animate-ping" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Système de Décision Autonome v4.2</span>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl font-black text-white tracking-tighter leading-none"
            >
              L'<span className="text-[#D4A017]">INTELLIGENCE</span><br />AU CŒUR DU CHAMP
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -50 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-300 font-bold text-lg leading-relaxed max-w-lg"
            >
              Déployez la puissance de l'IA générative et de l'analyse spectrale pour transformer vos données en récoltes records.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
             <Badge className="bg-[#1B4D3E]/80 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border border-[#1B4D3E]">
               Neural Model: AGRO-GEN-PRO
             </Badge>
             <Badge className="bg-black/80 backdrop-blur-md text-[#D4A017] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/5">
                RAG Engine: 2.1M Documents
             </Badge>
          </motion.div>
        </div>
      </div>

      {/* Structured Management Grid */}
      <div className="grid gap-12 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 space-y-12">
          {/* Main Chart Section - Framed and Structured */}
          <div className="relative p-1 bg-gradient-to-br from-[#1B4D3E]/20 to-[#D4A017]/20 rounded-[3.2rem] shadow-2xl">
             <DemandPredictionChart />
          </div>

          {/* Dual Action Section */}
          <div className="grid gap-12 md:grid-cols-2">
            <PricingSimulator />
            
            {/* Deployment Card */}
            <Card className="border-none bg-gradient-to-br from-[#1B4D3E] to-[#0a1f18] text-white shadow-3xl rounded-[3rem] p-12 flex flex-col justify-between group overflow-hidden relative">
               <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/4 -translate-y-1/4">
                  <Cpu className="h-64 w-64 text-white" />
               </div>
               <div className="relative z-10 space-y-8">
                  <div className="h-20 w-20 bg-white/10 rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl">
                    <Sparkles className="h-10 w-10 text-[#D4A017]" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black tracking-tighter leading-tight uppercase">PILOT AUTOMATISÉ</h3>
                    <p className="text-white/60 font-bold text-lg leading-relaxed">
                       Activez le mode Smart-Pilot pour synchroniser vos systèmes d'irrigation et de fertilisation avec les prévisions IA.
                    </p>
                  </div>
               </div>
               <Button className="relative z-10 mt-12 bg-white text-[#1B4D3E] hover:bg-[#D4A017] hover:text-white rounded-[2rem] h-20 font-black text-xl shadow-3xl transition-all hover:scale-[1.05] active:scale-95">
                 DÉPLOYER AGENTS IA
               </Button>
            </Card>
          </div>
        </div>

        {/* Intelligence Context Column */}
        <div className="lg:col-span-4 space-y-12 h-full">
           <AIAdvisorChat />
           <div className="sticky top-10">
              <CropRecommender />
           </div>
        </div>
      </div>

      {/* Final Tech Stats / Footer Frame */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-slate-100 dark:border-white/5">
         {[
           { label: "Modèles Actifs", val: "14", icon: Layers },
           { label: "Capacité Calcul", val: "12.4 TFLOPS", icon: Zap },
           { label: "Zone Monitorée", val: "1,240 Ha", icon: Globe },
           { label: "Alertes Précédentes", val: "03", icon: Info }
         ].map((stat, i) => (
           <div key={i} className="flex flex-col items-center text-center space-y-3">
              <stat.icon className="h-6 w-6 text-slate-300" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-[#1B4D3E] dark:text-white uppercase">{stat.val}</p>
           </div>
         ))}
      </div>
    </div>
  )
}
