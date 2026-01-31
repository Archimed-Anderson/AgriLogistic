"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Badge } from "@/components/ui/badge"
import { MOCK_FLEET } from "@/data/transporter-mock-data"

// --- Custom Icon Factory ---
const createTruckIcon = (heading: number, color: string = "#10b981") => L.divIcon({
  className: "custom-truck-icon",
  html: `
    <div style="
      transform: rotate(${heading}deg);
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 2px solid white;
      box-shadow: 0 0 10px ${color};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.5s ease;
    ">
       <div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-bottom: 8px solid white; transform: translateY(-2px);"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
})

// Fix Leaflet assets
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

const HEATMAP_ZONES = [
  { lat: 14.7167, lng: -17.4677, radius: 3000, intensity: 0.6, color: "#ef4444" }, // Dakar Centre
  { lat: 14.7258, lng: -17.1853, radius: 5000, intensity: 0.3, color: "#f97316" }, // Diamniadio
]

export default function LiveFleetMap() {
  const [fleet, setFleet] = React.useState(MOCK_FLEET)

  // Simulation GPS Movement
  React.useEffect(() => {
    const interval = setInterval(() => {
      setFleet(prev => prev.map(t => ({
        ...t,
        lat: t.lat + (Math.random() - 0.5) * 0.002,
        lng: t.lng + (Math.random() - 0.5) * 0.002,
        heading: (t.heading + (Math.random() - 0.5) * 10) % 360,
        speed: t.speed > 0 ? Math.max(0, Math.min(100, t.speed + Math.floor(Math.random() * 5 - 2))) : 0
      })))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-full w-full relative z-0">
       <MapContainer 
          center={[14.7167, -17.3500]} 
          zoom={11} 
          style={{ height: '100%', width: '100%', background: '#020617' }}
          zoomControl={false}
       >
          {/* Dark Matter Tiles */}
          <TileLayer
             url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
             attribution='&copy; CARTO'
          />

          {/* Zones de Demande (Heatmap Simplifiée) */}
          {HEATMAP_ZONES.map((zone, i) => (
             <Circle 
               key={i} 
               center={[zone.lat, zone.lng]} 
               radius={zone.radius}
               pathOptions={{ 
                 fillColor: zone.color, 
                 fillOpacity: 0.1, 
                 stroke: false 
               }} 
             />
          ))}

          {/* Véhicules */}
          {fleet.map(t => (
             <Marker 
               key={t.id} 
               position={[t.lat, t.lng]} 
               icon={createTruckIcon(t.heading, t.status === "Maintenance" ? "#ef4444" : t.id.includes("FL-03") ? "#64748b" : "#10b981")}
             >
                <Popup className="custom-popup bg-slate-950 border border-white/10 text-white rounded-xl">
                    <div className="p-1 min-w-[150px]">
                       <div className="flex justify-between items-center mb-2">
                          <span className="font-black text-xs">{t.id}</span>
                          <Badge className="text-[8px] h-4 px-1">{t.status}</Badge>
                       </div>
                       <div className="space-y-1">
                          <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                            <span>Chauffeur:</span>
                            <span className="text-white font-bold">{t.driver}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                             <span>Vitesse:</span>
                             <span className="text-white font-bold">{t.speed} km/h</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                             <span>Cap:</span>
                             <span className="text-white font-bold">{Math.round(t.heading)}°</span>
                          </div>
                       </div>
                    </div>
                </Popup>
             </Marker>
          ))}
       </MapContainer>

       {/* Map UI Overlay */}
       <div className="absolute top-4 left-4 z-[9999] pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur border border-white/5 p-2 rounded-xl flex flex-col gap-2 pointer-events-auto">
             <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                <span className="text-[9px] font-bold text-slate-300 uppercase">Actif</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border-2 border-white bg-red-500" />
                <span className="text-[9px] font-bold text-slate-300 uppercase">Maintenance</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border-2 border-white bg-slate-500" />
                <span className="text-[9px] font-bold text-slate-300 uppercase">Vide</span>
             </div>
          </div>
       </div>

       {/* Time-Travel Control */}
       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md bg-slate-950/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-700">
          <div className="flex justify-between items-center mb-2">
             <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Tracking
             </span>
             <span className="text-[10px] font-bold text-slate-400 uppercase">Prédiction IA: +0h</span>
          </div>
          <input 
             type="range" 
             min="0" 
             max="120" 
             defaultValue="0" 
             className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
             onChange={(e) => {
                const minutes = parseInt(e.target.value)
                const newFleet = MOCK_FLEET.map(t => ({
                   ...t,
                   lat: t.lat + (t.speed * minutes / 60) * 0.01 * Math.cos(t.heading * Math.PI / 180),
                   lng: t.lng + (t.speed * minutes / 60) * 0.01 * Math.sin(t.heading * Math.PI / 180),
                   status: minutes > 0 ? "Predicted" : t.status
                }))
                setFleet(newFleet)
             }}
          />
          <div className="flex justify-between mt-1 text-[8px] font-bold text-slate-600 uppercase">
             <span>Maintenant</span>
             <span>+1h</span>
             <span>+2h</span>
          </div>
       </div>
    </div>
  )
}
