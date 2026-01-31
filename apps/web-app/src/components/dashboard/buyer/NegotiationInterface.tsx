"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Send, 
  Bot, 
  FileSignature, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Gavel,
  History,
  TrendingDown
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SmartContractBuilder } from "./SmartContractBuilder"

// Mock Data
const OFFERS = [
  { id: 1, price: 245, volume: "50T", source: "Coopérative Vallée", status: "active", time: "2m ago" },
  { id: 2, price: 242, volume: "50T", source: "AgriSud", status: "pending", time: "5m ago" },
  { id: 3, price: 238, volume: "50T", source: "Market Avg", status: "market", time: "Live" },
]

const MESSAGES = [
  { id: 1, sender: "Coopérative Vallée", text: "Bonjour, nous pouvons fournir les 50T de Maïs Grade A.", time: "10:30", type: "received" },
  { id: 2, sender: "Me", text: "Le prix de 245$/T est un peu au-dessus du marché (238$).", time: "10:32", type: "sent" },
  { id: 3, sender: "Coopérative Vallée", text: "Nous garantissons une livraison en 48h et un taux d'humidité <12%.", time: "10:33", type: "received" },
]

export function NegotiationInterface() {
  const [showContract, setShowContract] = React.useState(false)
  const [messages, setMessages] = React.useState(MESSAGES)
  const [input, setInput] = React.useState("")
  const [aiSuggestion, setAiSuggestion] = React.useState({
    text: "Proposer 242$/T avec paiement immédiat (Escrow)",
    prob: 78,
    saving: "150$"
  })

  const handleSendMessage = () => {
    if (!input) return
    setMessages([...messages, { id: Date.now(), sender: "Me", text: input, time: "Now", type: "sent" }])
    setInput("")
  }

  const useAiSuggestion = () => {
    setInput(aiSuggestion.text)
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-[750px]">
      
      {/* LEFT: Trading Floor & Chat */}
      <div className={`col-span-12 lg:col-span-8 flex flex-col gap-4 transition-all duration-500 ${showContract ? 'lg:col-span-4' : ''}`}>
         {/* Live Order Book Ticker */}
         <Card className="bg-slate-900/50 border-slate-800 shrink-0">
             <div className="flex items-center overflow-x-auto p-2 gap-4 custom-scrollbar">
                <div className="flex items-center gap-2 px-3 border-r border-slate-800">
                    <History className="h-4 w-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Order Book</span>
                </div>
                {OFFERS.map(offer => (
                   <div key={offer.id} className="flex items-center gap-3 px-3 py-1 bg-slate-800/50 rounded border border-slate-700/50 min-w-fit">
                       <span className="text-xs font-bold text-white">{offer.source}</span>
                       <span className="font-mono text-xs text-blue-400 font-bold">${offer.price}</span>
                       <Badge variant="outline" className="text-[9px] h-4 px-1 border-slate-600 text-slate-400">{offer.volume}</Badge>
                   </div>
                ))}
             </div>
         </Card>

         {/* Chat Interface */}
         <Card className="flex-1 bg-slate-900/50 border-slate-800 flex flex-col overflow-hidden">
             <CardHeader className="py-3 px-4 border-b border-slate-800 bg-slate-900/80 flex flex-row justify-between items-center">
                 <div className="flex items-center gap-3">
                     <Avatar className="h-8 w-8 border border-emerald-500/50">
                         <AvatarImage src="/avatars/seller.png" />
                         <AvatarFallback className="bg-emerald-900 text-emerald-200 text-xs">CV</AvatarFallback>
                     </Avatar>
                     <div>
                         <h4 className="text-sm font-bold text-white">Coopérative de la Vallée</h4>
                         <span className="flex items-center gap-1 text-[10px] text-emerald-500">
                             <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> En ligne
                         </span>
                     </div>
                 </div>
                 {!showContract && (
                   <Button size="sm" onClick={() => setShowContract(true)} className="bg-blue-600 hover:bg-blue-500 text-xs gap-2">
                       <FileSignature className="h-3 w-3" /> Préparer Contrat
                   </Button>
                 )}
             </CardHeader>
             
             <ScrollArea className="flex-1 p-4">
                 <div className="space-y-4">
                     {messages.map((msg) => (
                         <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                                 msg.type === 'sent' 
                                 ? 'bg-blue-600 text-white rounded-br-none' 
                                 : 'bg-slate-800 text-slate-200 rounded-bl-none'
                             }`}>
                                 <p>{msg.text}</p>
                                 <span className="text-[9px] opacity-50 block text-right mt-1">{msg.time}</span>
                             </div>
                         </div>
                     ))}
                 </div>
             </ScrollArea>

             <div className="p-3 bg-slate-900 border-t border-slate-800">
                 <div className="relative">
                     <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Tapez votre message ou utilisez l'assistant..." 
                        className="bg-slate-950 border-slate-700 text-slate-200 pr-12 focus-visible:ring-blue-600"
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                     />
                     <Button 
                        size="icon" 
                        className="absolute right-1 top-1 h-7 w-7 bg-blue-600 hover:bg-blue-500"
                        onClick={handleSendMessage}
                     >
                         <Send className="h-3 w-3" />
                     </Button>
                 </div>
             </div>
         </Card>
      </div>

      {/* RIGHT/CENTER: AI Assistant or Contract Builder */}
      <div className={`col-span-12 lg:col-span-4 flex flex-col gap-4 transition-all duration-500 ${showContract ? 'lg:col-span-8' : ''}`}>
          
          <AnimatePresence mode="wait">
             {showContract ? (
                 <SmartContractBuilder onClose={() => setShowContract(false)} />
             ) : (
                // AI Assistant Panel
                <Card className="h-full bg-slate-950 border-l border-slate-800 shadow-2xl">
                    <CardHeader className="bg-purple-900/10 border-b border-purple-500/20 pb-4">
                        <div className="flex items-center gap-2 text-purple-400">
                           <Bot className="h-5 w-5" />
                           <h3 className="text-sm font-black uppercase tracking-widest">AI Negotiator</h3>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 space-y-6">
                        {/* Insight */}
                        <div className="space-y-2">
                             <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                                 <span>Analyse du Vendeur</span>
                                 <span className="text-emerald-500">Très Motivé</span>
                             </div>
                             <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    className="h-full bg-gradient-to-r from-purple-500 to-emerald-500"
                                 />
                             </div>
                             <p className="text-xs text-slate-400 italic">
                                "Le vendeur a un stock périssable dans 72h. Il acceptera probablement une baisse de prix contre un paiement rapide."
                             </p>
                        </div>

                        {/* Suggestion Card */}
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 relative group hover:bg-purple-500/20 transition-colors cursor-pointer" onClick={useAiSuggestion}>
                             <div className="absolute -top-3 left-4 bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">
                                 Strategie Recommandée
                             </div>
                             
                             <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                 Contre-Proposition
                                 <TrendingDown className="h-3 w-3 text-emerald-400" />
                             </h4>
                             <p className="text-sm text-slate-300 mb-3">
                                 "{aiSuggestion.text}"
                             </p>
                             
                             <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
                                 <div className="flex flex-col">
                                     <span className="text-[9px] text-slate-500 uppercase font-bold">Probabilité</span>
                                     <span className="text-emerald-400 font-bold text-xs">{aiSuggestion.prob}% Success</span>
                                 </div>
                                 <div className="flex flex-col items-end">
                                     <span className="text-[9px] text-slate-500 uppercase font-bold">Economie</span>
                                     <span className="text-white font-bold text-xs">{aiSuggestion.saving}</span>
                                 </div>
                             </div>
                             
                             <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Button size="icon" variant="ghost" className="h-6 w-6 text-purple-400">
                                     <ArrowRight className="h-4 w-4" />
                                 </Button>
                             </div>
                        </div>

                        {/* Market Data */}
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                             <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2">Market Context</span>
                             <div className="space-y-2">
                                 <div className="flex justify-between text-xs">
                                     <span className="text-slate-400">Prix Moyen (Régional)</span>
                                     <span className="text-white font-mono">$238.00</span>
                                 </div>
                                 <div className="flex justify-between text-xs">
                                     <span className="text-slate-400">Volatilité (24h)</span>
                                     <span className="text-red-400 font-mono">+2.4%</span>
                                 </div>
                             </div>
                        </div>
                    </CardContent>
                </Card>
             )}
          </AnimatePresence>
      </div>

    </div>
  )
}
