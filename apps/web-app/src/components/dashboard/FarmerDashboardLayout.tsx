"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FarmerSidebar } from "./FarmerSidebar"
import { FarmerTopbar } from "./FarmerTopbar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/context/AuthContext"
import { UserRole } from "@/types/auth"

interface FarmerDashboardLayoutProps {
  children: React.ReactNode
}

export function FarmerDashboardLayout({ children }: FarmerDashboardLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== UserRole.FARMER)) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#050505]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1B4D3E] border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== UserRole.FARMER) {
    return null
  }

  return (
    <div className="flex h-screen bg-[#F8FAF9] dark:bg-[#050505] overflow-hidden">
      {/* Navigation Sidebar */}
      <FarmerSidebar />

      {/* Main Workspace */}
      <div className="flex flex-col flex-1 min-w-0 transition-all duration-500 ease-in-out">
        <FarmerTopbar />
        
        <main className="flex-1 relative overflow-auto bg-[#F8FAF9] dark:bg-[#050505]">
          <ScrollArea className="h-full">
            <div className="p-8 pb-16 max-w-[1600px] mx-auto">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}
