"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { mockLoads, mockTrucks } from "@/data/logistics-operations"
import { Truck, Package, Navigation, Calendar, Phone } from "lucide-react"

// Fix for default marker icons in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

// Customizing icons using CSS filters or DivIcon would be ideal, 
// but for stability we'll start with colored default markers if possible 
// or just standard markers for now.
// Let's use custom DivIcons for a "futuristic" look as requested.

const createCustomIcon = (type: 'load' | 'truck') => {
  const color = type === 'load' ? '#ef4444' : '#3b82f6'; // Red for loads, Blue for trucks
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 10px ${color};
      position: relative;
    ">
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${color};
        opacity: 0.2;
        animation: pulse 2s infinite;
      "></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

const loadIcon = createCustomIcon('load')
const truckIcon = createCustomIcon('truck')

// Component to handle map resizing
function MapResizer() {
  const map = useMap()
  useEffect(() => {
    map.invalidateSize()
  }, [map])
  return null
}

// Mock high demand zones (Quadrilaterals/Polygons)
const highDemandZones: [number, number][][] = [
  // Zone Abidjan Extension
  [[5.3, -4.1], [5.5, -4.1], [5.5, -3.9], [5.3, -3.9]],
  // Zone Yamoussoukro Central
  [[6.7, -5.4], [6.9, -5.4], [6.9, -5.2], [6.7, -5.2]],
  // Zone San-Pedro Port
  [[4.7, -6.7], [4.9, -6.7], [4.9, -6.5], [4.7, -6.5]],
]

interface LogisticsMapProps {
  activeRoute?: {
    origin: [number, number];
    destination: [number, number];
    mode: 'fast' | 'eco';
  } | null;
}

export default function LogisticsMap({ activeRoute }: LogisticsMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Add custom styles for the pulsing animation
    const style = document.createElement('style')
    style.innerHTML = `
      @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
        100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
      }
      @keyframes radar {
         0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
         70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
         100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
      }
      .marker-radar {
         animation: radar 2s infinite;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  if (!mounted) return null

  // Center on Côte d'Ivoire / West Africa
  const center: [number, number] = [7.54, -5.55] 
  const zoom = 7

  return (
    <div className="w-full h-full bg-slate-900 relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: "100%", width: "100%", background: "#1e1e1e" }}
        closePopupOnClick={true}
        zoomControl={false}
      >
        {/* CartoDB Dark Matter Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapResizer />

        {/* DEMAND ZONES LIGHTING */}
        {highDemandZones.map((zone, idx) => (
          <Polygon 
            key={idx}
            positions={zone}
            pathOptions={{
              fillColor: '#ef4444',
              fillOpacity: 0.15,
              weight: 1,
              color: '#ef4444',
              dashArray: '5, 5'
            }}
          />
        ))}

        {/* ACTIVE SMART-MATCH ROUTE */}
        {activeRoute && (
          <Polyline 
            positions={[activeRoute.origin, activeRoute.destination]}
            pathOptions={{
              color: activeRoute.mode === 'eco' ? '#10b981' : '#3b82f6',
              weight: 4,
              opacity: 0.8,
              dashArray: '10, 10',
              lineCap: 'round'
            }}
          >
             <Popup>
                <div className="font-bold text-xs">
                   Itinéraire {activeRoute.mode === 'eco' ? 'Écologique' : 'Optimal'}
                </div>
             </Popup>
          </Polyline>
        )}

        {/* Render Loads (Red) */}
        {mockLoads.filter(l => l.status === 'Pending').map((load) => (
          <Marker 
            key={load.id} 
            position={load.origin} 
            icon={loadIcon}
          >
            <Popup className="glass-popup">
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2 text-red-500 font-bold uppercase text-xs tracking-wider">
                  <Package className="w-3 h-3" /> Chargement
                </div>
                <h3 className="font-bold text-base mb-1">{load.productType}</h3>
                <div className="text-sm text-slate-600 mb-2">
                  {load.quantity} {load.unit} • {load.priceOffer.toLocaleString()} {load.currency}
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> {load.originCity}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> {load.destinationCity}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Trucks (Blue) */}
        {mockTrucks.filter(t => t.status === 'Available').map((truck) => (
          <Marker 
            key={truck.id} 
            position={truck.currentPosition} 
            icon={truckIcon}
          >
            <Popup className="glass-popup">
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2 text-blue-500 font-bold uppercase text-xs tracking-wider">
                  <Truck className="w-3 h-3" /> Disponible
                </div>
                <h3 className="font-bold text-base mb-1">{truck.truckType}</h3>
                <div className="text-sm text-slate-600 mb-2">
                  Capacité: {truck.capacity}T • {truck.licensePlate}
                </div>
                {truck.aiMatchScore > 0 && (
                   <div className="mb-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                     IA Score: {truck.aiMatchScore}%
                   </div>
                )}
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Navigation className="w-3 h-3" /> {truck.currentLocationCity || 'En route'}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
      </MapContainer>
    </div>
  )
}
