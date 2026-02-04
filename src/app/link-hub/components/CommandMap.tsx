/**
 * COMMAND MAP COMPONENT
 * Fond de carte interactif 3D utilisant Mapbox GL JS
 */

import React, { useState, useMemo } from 'react';
import {
  Map,
  Source,
  Layer,
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { type Load, type Truck } from '../../data/logistics-operations';

// Note: Un token Mapbox est requis pour le fonctionnement réel
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface CommandMapProps {
  loads: Load[];
  trucks: Truck[];
  selectedLoad: Load | null;
  selectedTruck: Truck | null;
  onMarkerClick: (type: 'load' | 'truck', data: Load | Truck) => void;
  showEcoRoute?: boolean;
}

const CommandMap: React.FC<CommandMapProps> = ({
  loads,
  trucks,
  selectedLoad,
  selectedTruck,
  onMarkerClick,
  showEcoRoute,
}) => {
  const [viewState, setViewState] = useState({
    longitude: -4.0083,
    latitude: 5.36,
    zoom: 6,
    pitch: 45,
    bearing: 0,
  });

  const [hoverInfo, setHoverInfo] = useState<{
    longitude: number;
    latitude: number;
    title: string;
    details: string;
    type: 'load' | 'truck';
  } | null>(null);

  // Données pour le heatmap des chargements (Rouge)
  const loadsGeoJson = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: loads.map((load) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [load.origin[1], load.origin[0]],
        },
        properties: {
          id: load.id,
          weight: load.quantity / 10,
        },
      })),
    }),
    [loads]
  );

  // Données pour le heatmap des camions (Bleu)
  const trucksGeoJson = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: trucks.map((truck) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [truck.currentPosition[1], truck.currentPosition[0]],
        },
        properties: {
          id: truck.id,
          weight: 1,
        },
      })),
    }),
    [trucks]
  );

  // Couche Heatmap - Chargements
  const loadHeatmapLayer = {
    id: 'loads-heatmap',
    type: 'heatmap' as const,
    source: 'loads',
    maxzoom: 9,
    paint: {
      'heatmap-weight': ['get', 'weight'],
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(255,0,0,0)',
        0.2,
        'rgba(255,100,0,0.5)',
        0.4,
        'rgba(255,50,0,0.8)',
        0.6,
        'rgba(255,0,0,0.9)',
        1,
        'rgba(255,0,0,1)',
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
      'heatmap-opacity': 0.6,
    },
  };

  // Couche Heatmap - Camions
  const truckHeatmapLayer = {
    id: 'trucks-heatmap',
    type: 'heatmap' as const,
    source: 'trucks',
    maxzoom: 9,
    paint: {
      'heatmap-weight': 1,
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(0,0,255,0)',
        0.2,
        'rgba(0,100,255,0.5)',
        0.4,
        'rgba(0,50,255,0.8)',
        0.6,
        'rgba(0,0,255,0.9)',
        1,
        'rgba(0,0,255,1)',
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
      'heatmap-opacity': 0.6,
    },
  };

  return (
    <div className="map-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
      >
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />

        {/* Heatmaps */}
        <Source id="loads" type="geojson" data={loadsGeoJson}>
          <Layer {...loadHeatmapLayer} />
        </Source>

        <Source id="trucks" type="geojson" data={trucksGeoJson}>
          <Layer {...truckHeatmapLayer} />
        </Source>

        {/* Marqueurs Chargements */}
        {loads.map((load) => (
          <Marker
            key={load.id}
            longitude={load.origin[1]}
            latitude={load.origin[0]}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onMarkerClick('load', load);
            }}
          >
            <div
              className={`map-marker load-marker pulse-agri ${
                selectedLoad?.id === load.id ? 'selected scale-125' : ''
              }`}
              onMouseEnter={() =>
                setHoverInfo({
                  longitude: load.origin[1],
                  latitude: load.origin[0],
                  title: load.productType,
                  details: `${load.quantity}t → ${
                    load.destinationCity ?? '-'
                  } | ${load.priceOffer.toLocaleString()} F`,
                  type: 'load',
                })
              }
              onMouseLeave={() => setHoverInfo(null)}
            >
              🌱
            </div>
          </Marker>
        ))}

        {/* Marqueurs Camions */}
        {trucks.map((truck) => (
          <Marker
            key={truck.id}
            longitude={truck.currentPosition[1]}
            latitude={truck.currentPosition[0]}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onMarkerClick('truck', truck);
            }}
          >
            <div
              className={`map-marker truck-marker pulse-logistics ${
                selectedTruck?.id === truck.id ? 'selected scale-125' : ''
              }`}
              onMouseEnter={() =>
                setHoverInfo({
                  longitude: truck.currentPosition[1],
                  latitude: truck.currentPosition[0],
                  title: truck.driverName,
                  details: `${truck.truckType} | ⭐ ${truck.driverRating} | ${truck.status}`,
                  type: 'truck',
                })
              }
              onMouseLeave={() => setHoverInfo(null)}
            >
              🚛
            </div>
          </Marker>
        ))}

        {/* Tooltip Popup */}
        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            anchor="top"
            onClose={() => setHoverInfo(null)}
            closeButton={false}
            className="neon-tooltip"
          >
            <div
              className={`p-1 font-mono text-[10px] ${
                hoverInfo.type === 'load' ? 'text-agri-neon' : 'text-logistics-neon'
              }`}
            >
              <div className="font-black uppercase border-b border-white/10 mb-1 pb-1">
                {hoverInfo.title}
              </div>
              <div className="text-white/80">{hoverInfo.details}</div>
            </div>
          </Popup>
        )}

        {/* Ligne de Match (si un match est actif) */}
        {selectedLoad && selectedTruck && (
          <>
            <Source
              id="match-route"
              type="geojson"
              data={{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [selectedTruck.currentPosition[1], selectedTruck.currentPosition[0]],
                    [selectedLoad.origin[1], selectedLoad.origin[0]],
                  ],
                },
                properties: {},
              }}
            >
              <Layer
                id="match-line"
                type="line"
                paint={{
                  'line-color': '#4facfe',
                  'line-width': 3,
                  'line-dasharray': [2, 1],
                  'line-opacity': 0.8,
                }}
              />
            </Source>

            {/* Eco Route Line (légèrement décalée pour la visibilité ou courbe) */}
            {showEcoRoute && (
              <Source
                id="eco-route"
                type="geojson"
                data={{
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    // On simule une route différente pour l'éco-route
                    coordinates: [
                      [selectedTruck.currentPosition[1], selectedTruck.currentPosition[0]],
                      [
                        (selectedTruck.currentPosition[1] + selectedLoad.origin[1]) / 2 + 0.1,
                        (selectedTruck.currentPosition[0] + selectedLoad.origin[0]) / 2 + 0.1,
                      ],
                      [selectedLoad.origin[1], selectedLoad.origin[0]],
                    ],
                  },
                  properties: {},
                }}
              >
                <Layer
                  id="eco-line"
                  type="line"
                  paint={{
                    'line-color': '#4CAF50',
                    'line-width': 5,
                    'line-opacity': 0.9,
                    'line-blur': 2,
                  }}
                />
              </Source>
            )}
          </>
        )}

        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
      </Map>

      {/* Légende de la carte */}
      <div className="map-legend-overlay">
        <div className="legend-item">
          <span className="dot load"></span>
          <span>Chargements (Rouge)</span>
        </div>
        <div className="legend-item">
          <span className="dot truck"></span>
          <span>Camions (Bleu)</span>
        </div>
      </div>
    </div>
  );
};

export default CommandMap;
