import { create } from 'zustand'
import { 
  mockLoads, 
  mockTrucks, 
  mockMatches, 
  mockAnalytics,
  Load,
  Truck,
  LogisticsMatch,
  LogisticsAnalytics,
  mockIoTAlerts,
  mockPredictiveData,
  IoTAlert,
  PredictiveData,
} from '@/data/logistics-operations'

interface LogisticsState {
  loads: Load[]
  trucks: Truck[]
  matches: LogisticsMatch[]
  analytics: LogisticsAnalytics
  alerts: IoTAlert[]
  predictiveData: PredictiveData[]
  
  // Actions
  bookLoad: (loadId: string) => void
  validateMatch: (matchId: string) => void
  rejectMatch: (matchId: string) => void
  deleteLoad: (loadId: string) => void
  addLoad: (load: Load) => void
  resolveAlert: (alertId: string) => void
  updateTruckStatus: (truckId: string, status: Truck['status']) => void
}

export const useLogisticsStore = create<LogisticsState>((set) => ({
  loads: mockLoads,
  trucks: mockTrucks,
  matches: mockMatches,
  analytics: mockAnalytics,
  alerts: mockIoTAlerts,
  predictiveData: mockPredictiveData,

  bookLoad: (loadId) => set((state) => {
    const load = state.loads.find(l => l.id === loadId)
    if (!load) return state

    // 1. Find best truck (simple mock logic: first available)
    const truck = state.trucks.find(t => t.status === 'Available')
    
    if (!truck) {
      alert("Aucun camion disponible pour ce chargement !")
      return state
    }

    // 2. Create Match
    const estimatedCost = load.priceOffer;
    const distance = 150; // Mock

    const newMatch: LogisticsMatch = {
      id: `MATCH-${Date.now()}`,
      loadId: load.id,
      truckId: truck.id,
      matchScore: load.aiMatchScore || 85, // Fallback score
      distance: distance, 
      estimatedDuration: 3,
      estimatedCost: estimatedCost,
      
      // New Metrics
      platformMargin: estimatedCost * 0.12, 
      carrierRevenue: estimatedCost * 0.88,
      co2Saved: distance * 0.15,

      matchFactors: {
        capacityMatch: 20,
        locationProximity: 15,
        timeAvailability: 15,
        specialRequirements: 10,
        priceCompatibility: 8,
        driverRating: 4.5
      },
      status: 'Suggested',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString()
    }

    // 3. Update Load Status
    const updatedLoads = state.loads.map(l => 
      l.id === loadId ? { ...l, status: 'Matched' as const } : l
    )

    // 4. Update Truck Status
    const updatedTrucks = state.trucks.map(t =>
      t.id === truck.id ? { ...t, status: 'Assigned' as const } : t
    )

    return {
      loads: updatedLoads,
      trucks: updatedTrucks,
      matches: [newMatch, ...state.matches],
      analytics: {
        ...state.analytics,
        activeLoads: state.analytics.activeLoads - 1,
        matchRate: ((state.matches.length + 1) / state.loads.length) * 100
      }
    }
  }),

  validateMatch: (matchId) => set((state) => ({
    matches: state.matches.map(m => 
      m.id === matchId ? { ...m, status: 'Accepted' } : m
    )
  })),

  rejectMatch: (matchId) => set((state) => ({
    matches: state.matches.map(m => 
      m.id === matchId ? { ...m, status: 'Rejected' } : m
    )
  })),

  deleteLoad: (loadId) => set((state) => ({
    loads: state.loads.filter(l => l.id !== loadId)
  })),

  addLoad: (load) => set((state) => ({
    loads: [load, ...state.loads]
  })),

  resolveAlert: (alertId) => set((state) => ({
    alerts: state.alerts.map(a => 
      a.id === alertId ? { ...a, status: 'Resolved' } : a
    )
  })),

  updateTruckStatus: (truckId, status) => set((state) => ({
    trucks: state.trucks.map(t => 
      t.id === truckId ? { ...t, status } : t
    )
  }))
}))
