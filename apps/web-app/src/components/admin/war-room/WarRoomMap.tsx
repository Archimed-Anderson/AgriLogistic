'use client';

import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Incident } from '@/store/warRoomStore';

interface HeatmapLayerProps {
  incidents: Incident[];
  enabled?: boolean;
}

/**
 * Heatmap des zones à risque - calculée via densité des incidents (ML Anomaly Detection ready)
 * Open source: leaflet.heat (BSD-2-Clause)
 * Chargée via script CDN (UMD incompatible avec bundler Next.js)
 */
export function HeatmapLayer({ incidents, enabled = true }: HeatmapLayerProps) {
  const map = useMap();
  const heatRef = useRef<L.Layer | null>(null);
  const [heatLoaded, setHeatLoaded] = useState(false);

  // Charger leaflet.heat via script CDN (évite erreur bundler)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as Window & { L: typeof L }).L?.heatLayer) {
      setHeatLoaded(true);
      return;
    }
    (window as Window & { L: typeof L }).L = L;
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
    script.async = true;
    script.onload = () => setHeatLoaded(true);
    script.onerror = () => console.warn('[War Room] Heatmap non disponible');
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  useEffect(() => {
    if (!heatLoaded || !enabled) return;

    const Leaflet = (window as Window & { L: typeof L }).L;
    if (!Leaflet?.heatLayer) return;

    if (heatRef.current) {
      map.removeLayer(heatRef.current);
      heatRef.current = null;
    }

    const points: [number, number, number][] = incidents.map((inc) => [
      inc.location[0],
      inc.location[1],
      inc.severity / 100,
    ]);

    if (points.length > 0) {
      const heatLayer = Leaflet.heatLayer(points, {
        radius: 35,
        blur: 25,
        maxZoom: 12,
        max: 1,
        gradient: { 0.2: 'blue', 0.5: 'yellow', 0.8: 'orange', 1: 'red' },
        minOpacity: 0.4,
      });
      heatLayer.addTo(map);
      heatRef.current = heatLayer;
    }

    return () => {
      if (heatRef.current) {
        map.removeLayer(heatRef.current);
        heatRef.current = null;
      }
    };
  }, [map, incidents, enabled, heatLoaded]);

  return null;
}
