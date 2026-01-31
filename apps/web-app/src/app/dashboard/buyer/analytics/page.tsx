import { MarketIntelligence } from "@/components/dashboard/buyer/MarketIntelligence"

export default function AnalyticsPage() {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Market Intelligence</h1>
            <p className="text-slate-400 text-sm">Analyses prédictives et tendances du marché global.</p>
         </div>
      </div>
      
      <div className="flex-1 min-h-0">
         <MarketIntelligence />
      </div>
    </div>
  )
}
