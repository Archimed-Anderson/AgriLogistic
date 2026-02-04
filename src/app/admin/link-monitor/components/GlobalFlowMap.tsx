/**
 * GLOBAL FLOW MAP COMPONENT (ADMIN)
 * Visualisation God-Mode des flux logistiques mondiaux
 * Affiche des arcs animés entre les points d'origine et de destination
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Map, Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import { type Load } from '../../../data/logistics-operations';

// Token Mapbox (Utilise la variable d'env)
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface GlobalFlowMapProps {
  loads: Load[];
}

const GlobalFlowMap: React.FC<GlobalFlowMapProps> = ({ loads }) => {
  const [viewState, setViewState] = useState({
    longitude: 20,
    latitude: 10,
    zoom: 2,
    pitch: 0,
    bearing: 0,
  });

  const [dashOffset, setDashOffset] = useState(0);
  const requestRef = useRef<number>();

  // Animation loop pour le dash offset (traveling particles)
  useEffect(() => {
    const animate = () => {
      setDashOffset((prev) => (prev - 0.05) % 4);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Génération des Arcs (Great Circle paths)
  const flowsGeoJson = useMemo(() => {
    const features = loads.flatMap((load) => {
      try {
        const start = [load.origin[1], load.origin[0]];
        const end = [load.destination[1], load.destination[0]];

        // Créer une ligne "Great Circle" (Arc)
        const line = turf.greatCircle(start, end, { npoints: 50 });

        return [
          {
            ...line,
            properties: {
              id: load.id,
              status: load.status,
              product: load.productType,
              quantity: load.quantity,
            },
          },
        ];
      } catch (err) {
        return [];
      }
    });

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [loads]);

  // Points (Origine et Destination)
  const pointsGeoJson = useMemo(() => {
    const features = loads.flatMap((load) => [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [load.origin[1], load.origin[0]] },
        properties: { type: 'origin', id: load.id },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [load.destination[1], load.destination[0]] },
        properties: { type: 'destination', id: load.id },
      },
    ]);

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [loads]);

  return (
    <div className="global-map-wrapper shadow-2xl rounded-2xl overflow-hidden border border-white/5 bg-black">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '500px' }}
      >
        <Source id="flows" type="geojson" data={flowsGeoJson}>
          <Layer
            id="flow-lines"
            type="line"
            paint={{
              'line-color': [
                'match',
                ['get', 'status'],
                'Pending',
                '#00f2ff',
                'Matched',
                '#00ff41',
                'In Transit',
                '#ff00d9',
                'Delivered',
                '#94a3b8',
                '#ff00d9', // Default
              ],
              'line-width': 2,
              'line-opacity': 0.6,
              'line-dasharray': [2, 2],
              'line-dashoffset': dashOffset,
            }}
          />
        </Source>

        <Source id="points" type="geojson" data={pointsGeoJson}>
          <Layer
            id="flow-points"
            type="circle"
            paint={{
              'circle-radius': 4,
              'circle-color': [
                'match',
                ['get', 'type'],
                'origin',
                '#ff00d9',
                'destination',
                '#00f2ff',
                '#ffffff',
              ],
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
              'circle-opacity': 0.8,
            }}
          />
        </Source>

        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />

        {/* Overlay God Mode Overlay */}
        <div className="map-overlay-pulse">
          <div className="pulse-text">SYSTEM LIVE TRACKING</div>
        </div>
      </Map>
    </div>
  );
};

export default GlobalFlowMap;
