import React, { useState, useEffect, useCallback, useRef } from 'react';
import Map, {
  Source,
  Layer,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  MapRef,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { FeatureCollection, Point } from 'geojson';
import { Navigation2, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

// Coordinates for Dakar, Thiès, Tambacounda
const ports = {
  Dakar: [-17.4467, 14.6937],
  Thies: [-16.9359, 14.791],
  Tambacounda: [-13.6703, 13.7707],
  SaintLouis: [-16.5015, 16.0179],
};

const INITIAL_VIEW_STATE = {
  longitude: -14.7,
  latitude: 14.7,
  zoom: 6,
  bearing: 0,
  pitch: 30,
};

import { useTheme } from '@/shared/providers/ThemeProvider';

export function LogisticsMap() {
  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const [truckPositions, setTruckPositions] = useState<FeatureCollection<Point> | null>(null);

  // Simple animation for "trucks"
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const t = (frame % 300) / 300;

      const geojson: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: [
          // Dakar -> Thies
          {
            type: 'Feature',
            properties: { id: 'TRK-001', status: 'moving' },
            geometry: {
              type: 'Point',
              coordinates: [
                ports.Dakar[0] + (ports.Thies[0] - ports.Dakar[0]) * t,
                ports.Dakar[1] + (ports.Thies[1] - ports.Dakar[1]) * t,
              ],
            },
          },
          // Thies -> Tambacounda
          {
            type: 'Feature',
            properties: { id: 'TRK-002', status: 'moving' },
            geometry: {
              type: 'Point',
              coordinates: [
                ports.Thies[0] + (ports.Tambacounda[0] - ports.Thies[0]) * ((t + 0.3) % 1),
                ports.Thies[1] + (ports.Tambacounda[1] - ports.Thies[1]) * ((t + 0.3) % 1),
              ],
            },
          },
          // Tambacounda -> Thies
          {
            type: 'Feature',
            properties: { id: 'TRK-003', status: 'moving' },
            geometry: {
              type: 'Point',
              coordinates: [
                ports.Tambacounda[0] + (ports.Thies[0] - ports.Tambacounda[0]) * ((t + 0.6) % 1),
                ports.Tambacounda[1] + (ports.Thies[1] - ports.Tambacounda[1]) * ((t + 0.6) % 1),
              ],
            },
          },
        ],
      };
      setTruckPositions(geojson);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleRecenter = useCallback(() => {
    mapRef.current?.flyTo({
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      duration: 2000,
    });
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-card shadow-2xl transition-colors duration-500">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: '100%', height: '100%' }}
        mapStyle={
          theme === 'dark'
            ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
            : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
        }
        terrain={{ source: 'raster-dem', exaggeration: 1.5 }}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <ScaleControl position="bottom-left" />

        {truckPositions && (
          <Source id="trucks" type="geojson" data={truckPositions}>
            <Layer
              id="truck-glow"
              type="circle"
              paint={{
                'circle-radius': 12,
                'circle-color': '#0066FF',
                'circle-opacity': 0.15,
                'circle-blur': 1.5,
              }}
            />
            <Layer
              id="truck-points"
              type="circle"
              paint={{
                'circle-radius': 4,
                'circle-color': '#0066FF',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
              }}
            />
          </Source>
        )}
      </Map>

      {/* Custom Overlay Controls */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-4">
        <div className="p-4 bg-card/80 backdrop-blur-xl rounded-2xl border border-border shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_var(--success-glow)]" />
            <p className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground font-black">
              Logistics Core
            </p>
          </div>
          <h3 className="text-sm font-black text-foreground mb-1 uppercase tracking-tighter">
            Flux Logistiques
          </h3>
          <p className="text-[11px] text-muted-foreground italic font-medium">
            3 flottes actives • Sénégal Ouest
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="bg-card/60 backdrop-blur-md border-border hover:bg-primary/10 text-foreground rounded-xl shadow-xl transition-all hover:scale-110 active:scale-95"
          onClick={handleRecenter}
          title="Recentrer la carte"
        >
          <Navigation2 className="w-4 h-4 text-primary" />
        </Button>
      </div>

      <div className="absolute bottom-6 right-6 z-10 p-3 bg-card/60 backdrop-blur-md rounded-xl border border-border shadow-lg text-[9px] font-black text-muted-foreground flex items-center gap-2 uppercase tracking-widest">
        <RefreshCw className="w-3 h-3 animate-spin-slow text-primary" />
        Live Tracking Active
      </div>
    </div>
  );
}
