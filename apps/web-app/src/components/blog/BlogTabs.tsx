"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star, LayoutGrid } from "lucide-react"

interface BlogTabsProps {
  activeTab: "featured" | "all";
  onChange: (tab: "featured" | "all") => void;
}

export function BlogTabs({ activeTab, onChange }: BlogTabsProps) {
  return (
    <div className="flex justify-center mb-16">
      <div className="inline-flex p-1.5 bg-slate-100/50 backdrop-blur-md rounded-[24px] border border-slate-200/60 shadow-inner">
        <TabButton 
          isActive={activeTab === "featured"} 
          onClick={() => onChange("featured")}
          icon={<Star className="h-4 w-4" />}
          label="Mise en avant"
        />
        <TabButton 
          isActive={activeTab === "all"} 
          onClick={() => onChange("all")}
          icon={<LayoutGrid className="h-4 w-4" />}
          label="Tous les articles"
        />
      </div>
    </div>
  )
}

function TabButton({ isActive, onClick, icon, label }: { isActive: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2.5 px-8 py-3.5 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300
        ${isActive ? "text-[#0A2619]" : "text-slate-400 hover:text-slate-600"}
      `}
    >
      {isActive && (
        <motion.div
          layoutId="activeTabBlog"
          className="absolute inset-0 bg-white rounded-[18px] shadow-sm z-0"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10">{label}</span>
      
      {isActive && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative z-10 h-1.5 w-1.5 rounded-full bg-accent"
        />
      )}
    </button>
  )
}
