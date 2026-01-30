"use client"

import React from 'react'
import { cn } from "@/lib/utils"
import { 
  Satellite, 
  Brain, 
  Droplets, 
  Bug, 
  Users, 
  ShoppingCart, 
  Truck, 
  Leaf,
  LineChart,
  CloudSun
} from 'lucide-react'

interface NodeProps {
  icon: React.ElementType
  label: string
  angle: number
  distance: number
  color: string
  delay?: string
  pulse?: boolean
  size?: number
}

const CircularNode = ({ icon: Icon, label, angle, distance, color, delay = "0s", pulse = false, size = 72 }: NodeProps) => {
  const x = Math.cos((angle * Math.PI) / 180) * distance
  const y = Math.sin((angle * Math.PI) / 180) * distance

  return (
    <div 
      className="absolute transition-all duration-700 ease-out group/node"
      style={{ 
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        left: '50%',
        top: '50%',
        animationDelay: delay
      }}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Modern Label - Always Visible */}
        <div className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-primary/10 shadow-sm transition-all duration-300 group-hover/node:bg-primary group-hover/node:text-white group-hover/node:scale-110 group-hover/node:border-transparent">
          <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
            {label}
          </span>
        </div>

        {/* Node Circle */}
        <div 
          className={cn(
            "relative rounded-full flex items-center justify-center border-2 backdrop-blur-xl shadow-lg transition-transform duration-500 group-hover/node:scale-110 group-hover/node:rotate-[12deg]",
            color,
            pulse && "animate-bounce-slow"
          )}
          style={{ width: size, height: size }}
        >
          <Icon className="h-7 w-7" />
          <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function CircularAIHub() {
  const orbitalDistance = 220 
  
  const nodes = [
    { icon: Satellite, label: "Satellite", angle: -90, distance: orbitalDistance, color: "bg-blue-50 text-blue-600 border-blue-200", delay: "0s" },
    { icon: CloudSun, label: "Météo", angle: -45, distance: orbitalDistance, color: "bg-sky-50 text-sky-600 border-sky-200", delay: "0.2s" },
    { icon: ShoppingCart, label: "Marché", angle: 0, distance: orbitalDistance, color: "bg-orange-50 text-orange-600 border-orange-200", delay: "0.4s" },
    { icon: Truck, label: "Logistique", angle: 45, distance: orbitalDistance, color: "bg-purple-50 text-purple-600 border-purple-200", delay: "0.6s" },
    { icon: Users, label: "Coopératives", angle: 135, distance: orbitalDistance, color: "bg-indigo-50 text-indigo-600 border-indigo-200", delay: "0.8s" },
    { icon: Droplets, label: "Irrigation", angle: 180, distance: orbitalDistance, color: "bg-cyan-50 text-cyan-600 border-cyan-200", delay: "1s" },
    { icon: Bug, label: "Pest Control", angle: 225, distance: orbitalDistance, color: "bg-rose-50 text-rose-600 border-rose-200", delay: "1.2s" },
  ]

  return (
    <div className="relative w-full aspect-square max-w-[650px] mx-auto flex items-center justify-center p-4">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[450px] h-[450px] rounded-full border border-primary/5 animate-spin-very-slow" />
        <div className="w-[440px] h-[440px] rounded-full border border-dashed border-primary/10 animate-spin-slow-reverse" />
        <div className="w-[220px] h-[220px] rounded-full border border-primary/5" />
      </div>

      <svg viewBox="0 0 600 600" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {nodes.map((node, i) => {
          const x2 = 300 + Math.cos((node.angle * Math.PI) / 180) * node.distance
          const y2 = 300 + Math.sin((node.angle * Math.PI) / 180) * node.distance
          return (
            <g key={i} className="text-emerald-500/20">
              <line 
                x1="300" y1="300" x2={x2} y2={y2} 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeDasharray="6 6"
                className="animate-pulse"
              />
              <circle cx={x2} cy={y2} r="4" fill="currentColor" className="animate-ping" />
            </g>
          )
        })}
      </svg>

      <div className="relative z-10">
        <div className="relative group">
          <div className="absolute inset-[-30px] bg-emerald-400/20 blur-3xl rounded-full animate-pulse group-hover:bg-emerald-400/40 transition-colors" />
          <div className="relative w-36 h-36 rounded-[40px] bg-primary flex flex-col items-center justify-center shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-110 transition-transform duration-700">
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
            
            <div className="relative flex flex-col items-center text-white">
              <Brain className="h-14 w-14 mb-2 animate-pulse" />
              <span className="text-[12px] font-black tracking-[0.2em] uppercase opacity-90">AI Core</span>
            </div>

            <div className="absolute top-0 bottom-0 left-[-100%] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />
          </div>
        </div>
      </div>

      {nodes.map((node, i) => (
        <CircularNode key={i} {...node} />
      ))}

      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-6">
        <div className="px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[12px] font-black uppercase tracking-wider flex items-center gap-2 shadow-lg animate-float">
          <LineChart className="h-4 w-4" />
          Production +24%
        </div>
        <div className="px-5 py-2.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[12px] font-black uppercase tracking-wider flex items-center gap-2 shadow-lg animate-float" style={{ animationDelay: "1.5s" }}>
          <Leaf className="h-4 w-4" />
          Pertes -15%
        </div>
      </div>
    </div>
  )
}
