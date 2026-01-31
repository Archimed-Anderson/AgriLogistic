"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in Leaflet + Next.js
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

export default function LiveMap({ trucks, route }: { trucks: any[], route: [number, number][] }) {
  if (typeof window === 'undefined') return null;

  return (
    <MapContainer 
      center={[48.8566, 2.3522]} 
      zoom={9} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
         url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
         attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      
      {trucks.map(truck => (
         <Marker key={truck.id} position={[truck.lat, truck.lng]}>
            <Popup>
              <div className="p-2 space-y-1">
                <p className="font-black text-xs uppercase text-[#1B4D3E]">{truck.id} — {truck.driver}</p>
                <p className="text-[10px] font-bold">Modèle : {truck.model}</p>
                <hr className="my-1" />
                <p className="text-[10px] text-emerald-600 font-bold">Arrivée estimée : 14h30</p>
              </div>
            </Popup>
         </Marker>
      ))}

      {route.length > 0 && (
         <Polyline positions={route} color="#D4A017" weight={4} dashArray="10, 10" />
      )}
    </MapContainer>
  )
}
