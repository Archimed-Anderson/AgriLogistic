import { NegotiationInterface } from "@/components/dashboard/buyer/NegotiationInterface"

export default function NegotiationsPage() {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Trading Floor</h1>
            <p className="text-slate-400 text-sm">Négociations en temps réel et signature de contrats</p>
         </div>
      </div>
      
      <NegotiationInterface />
    </div>
  )
}
