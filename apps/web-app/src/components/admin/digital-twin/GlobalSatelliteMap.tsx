'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useDigitalTwinStore } from '@/store/digitalTwinStore';

// Helper: couleur parcelle selon couche active
function getParcelColor(
  parcel: { status: string; predictedYield: number },
  activeLayers: string[],
  selectedParcelId: string | null,
  parcelId: string
) {
  if (activeLayers.includes('yield')) {
    // Heatmap rendements: vert=élevé, ambre=moyen, rouge=faible
    if (parcel.predictedYield >= 1.0) return '#10b981';
    if (parcel.predictedYield >= 0.7) return '#f59e0b';
    return '#ef4444';
  }
  if (activeLayers.includes('diseases') && parcel.status === 'diseased') {
    return '#ef4444';
  }
  return parcel.status === 'healthy' ? '#10b981' : parcel.status === 'diseased' ? '#ef4444' : '#f59e0b';
}

export default function GlobalSatelliteMap() {
  const { parcels, activeLayers, selectParcel, selectedParcel, diseaseZones } = useDigitalTwinStore();

  return (
    <div className="w-full h-full relative cursor-crosshair">
      <MapContainer
        center={[6.82, -5.25]}
        zoom={13}
        className="w-full h-full bg-[#020408]"
        zoomControl={false}
        attributionControl={false}
      >
        {/* BASE SATELLITE LAYER */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          className="grayscale-[0.5] opacity-80"
        />

        {/* NDVI OVERLAY (SIMULATED WITH TILE FILTER) */}
        {activeLayers.includes('ndvi') && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            opacity={0.3}
            className="hue-rotate-[120deg] saturate-[2] brightness-[0.8]"
          />
        )}

        {/* WEATHER OVERLAY - RainViewer (free) ou OpenWeatherMap (si clé configurée) */}
        {activeLayers.includes('weather') && <WeatherOverlay />}

        {/* YIELD HEATMAP OVERLAY - Parcels colorés par rendement attendu */}
        {activeLayers.includes('yield') && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            opacity={0.15}
            className="opacity-20"
          />
        )}

        {/* DISEASE ZONES - Cercles IA Computer Vision */}
        {activeLayers.includes('diseases') &&
          diseaseZones.map((zone) => (
            <Circle
              key={zone.id}
              center={zone.center}
              radius={zone.radius}
              pathOptions={{
                fillColor: zone.severity === 'high' ? '#ef4444' : zone.severity === 'medium' ? '#f59e0b' : '#eab308',
                fillOpacity: 0.35,
                color: zone.severity === 'high' ? '#dc2626' : '#d97706',
                weight: 2,
                dashArray: '5, 5',
              }}
            >
              <Popup>
                <div className="p-2 bg-slate-900 text-white rounded-lg border border-red-500/30 min-w-[140px]">
                  <p className="text-[10px] font-black uppercase text-red-500">Zone Maladie IA</p>
                  <p className="text-xs font-bold">{zone.disease}</p>
                  <p className="text-[9px] text-slate-400 mt-1">Sévérité: {zone.severity}</p>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* PARCEL POLYGONS */}
        {parcels.map((parcel) => (
          <Polygon
            key={parcel.id}
            positions={parcel.coordinates as [number, number][]}
            pathOptions={{
              fillColor: getParcelColor(parcel, activeLayers, selectedParcel?.id ?? null, parcel.id),
              fillOpacity: selectedParcel?.id === parcel.id ? 0.6 : 0.35,
              color: selectedParcel?.id === parcel.id ? '#10b981' : parcel.status === 'diseased' ? '#ef4444' : 'white',
              weight: selectedParcel?.id === parcel.id ? 3 : activeLayers.includes('diseases') && parcel.status === 'diseased' ? 2 : 1,
              dashArray: selectedParcel?.id === parcel.id ? '' : parcel.status === 'diseased' ? '3, 3' : '5, 5',
            }}
            eventHandlers={{
              click: () => selectParcel(parcel),
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({ fillOpacity: 0.8, weight: 2 });
              },
              mouseout: (e) => {
                const layer = e.target;
                if (selectedParcel?.id !== parcel.id) {
                  layer.setStyle({ fillOpacity: 0.3, weight: 1 });
                }
              },
            }}
          >
            <Popup>
              <div className="p-2 bg-slate-900 text-white rounded-lg border border-white/10 min-w-[140px]">
                <p className="text-[10px] font-black uppercase text-emerald-500">{parcel.cropType}</p>
                <p className="text-xs font-bold">{parcel.owner}</p>
                <p className="text-[9px] text-slate-400 mt-1">NDVI: {parcel.ndvi}</p>
                <p className="text-[9px] text-amber-500 mt-0.5">
                  Rendement: {parcel.predictedYield} T/ha
                </p>
                {parcel.status === 'diseased' && (
                  <p className="text-[9px] text-red-500 font-black mt-1 uppercase">Maladie détectée</p>
                )}
              </div>
            </Popup>
          </Polygon>
        ))}

        <MapEffects />
      </MapContainer>

      {/* VIGNETTE EFFECT OVER MAP */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-[400]" />
    </div>
  );
}

function MapEffects() {
  return null;
}

/** Overlay précipitations: RainViewer (gratuit) ou OpenWeatherMap (si clé) */
function WeatherOverlay() {
  const [rainViewerUrl, setRainViewerUrl] = useState<string | null>(null);
  const owmKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY : undefined;

  useEffect(() => {
    if (owmKey) return;
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then((r) => r.json())
      .then((data) => {
        const host = data?.host || 'https://tilecache.rainviewer.com';
        const radar = data?.radar?.past?.[data.radar.past.length - 1];
        if (radar?.path) {
          setRainViewerUrl(`${host}${radar.path}/256/{z}/{x}/{y}/1_0.png`);
        }
      })
      .catch(() => {});
  }, [owmKey]);

  if (owmKey) {
    return (
      <TileLayer
        url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${owmKey}`}
        opacity={0.5}
      />
    );
  }
  if (rainViewerUrl) {
    return <TileLayer url={rainViewerUrl} opacity={0.6} />;
  }
  return null;
}
