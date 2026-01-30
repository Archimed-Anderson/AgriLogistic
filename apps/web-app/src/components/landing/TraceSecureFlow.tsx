"use client"

import React from 'react'
import { cn } from "@/lib/utils"
import { 
  ShieldCheck, 
  QrCode, 
  ClipboardCheck, 
  Truck, 
  Globe,
  Lock,
  Zap,
  Check
} from 'lucide-react'

const TraceBlock = ({ icon: Icon, label, status, delay = "0s", color = "bg-orange-500" }: any) => (
  <div 
    className="group relative"
    style={{ animationDelay: delay }}
  >
    {/* Block Body - Isometric feel */}
    <div className="relative w-72 h-32 transform transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-2">
      {/* 3D Sides */}
      <div className={cn("absolute inset-0 rounded-2xl border-2 border-white/20 backdrop-blur-2xl shadow-2xl overflow-hidden", status === 'active' ? color : "bg-white/10")}>
        {/* Glass Reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 p-6 flex items-center gap-6">
          <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shadow-lg", status === 'active' ? "bg-white text-orange-600" : "bg-white/20 text-white/40")}>
            <Icon className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h5 className={cn("text-xs font-black uppercase tracking-[0.2em] mb-1", status === 'active' ? "text-white" : "text-white/40")}>
              {label}
            </h5>
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", status === 'active' ? "bg-white animate-pulse" : "bg-white/20")} />
              <span className={cn("text-[10px] font-bold", status === 'active' ? "text-white/80 italic" : "text-white/20 italic")}>
                {status === 'active' ? "Immuable & Vérifié" : "En attente"}
              </span>
            </div>
          </div>
          {status === 'active' && <Check className="h-6 w-6 text-white opacity-40" />}
        </div>

        {/* Shimmer Effect */}
        <div className="absolute top-0 bottom-0 left-[-100%] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-30deg] animate-shimmer" />
      </div>
    </div>
  </div>
)

export function TraceSecureFlow() {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center p-12 overflow-visible">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-400/10 blur-[120px] rounded-full" />

      {/* Vertical Connection Line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-1 bg-gradient-to-b from-orange-500/0 via-orange-500/40 to-orange-500/0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-20 bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.8)] rounded-full animate-[slideDown_4s_infinite_linear]" />
      </div>

      {/* Blocks Stacked Offset */}
      <div className="relative flex flex-col gap-10">
        <div className="ml-[-40px]">
          <TraceBlock icon={ShieldCheck} label="Origine Champ" status="active" delay="0s" color="bg-emerald-600" />
        </div>
        <div className="ml-[40px]">
          <TraceBlock icon={QrCode} label="Smart QR Label" status="active" delay="0.5s" color="bg-orange-600" />
        </div>
        <div className="ml-[-40px]">
          <TraceBlock icon={Lock} label="Blockchain Proof" status="active" delay="1s" color="bg-blue-600" />
        </div>
        <div className="ml-[40px]">
          <TraceBlock icon={Globe} label="Export Ready" status="active" delay="1.5s" color="bg-orange-700" />
        </div>
      </div>

      {/* Floating Verification Badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-3">
        <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-xl animate-float">
          <Zap className="h-3 w-3" />
          Real-time Audit
        </div>
        <div className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-xl animate-float" style={{ animationDelay: "2s" }}>
          <ClipboardCheck className="h-3 w-3" />
          HACCP Certified
        </div>
      </div>
    </div>
  )
}
