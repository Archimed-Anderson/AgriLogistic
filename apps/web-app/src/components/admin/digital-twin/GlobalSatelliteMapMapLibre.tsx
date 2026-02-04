'use client';

import React, { useCallback, useRef } from 'react';
import Map, { Layer, Source, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useDigitalTwinStore } from '@/store/digitalTwinStore';

const MAP_STYLE = 'https://demotiles.maplibre.org/style.json';

export default function GlobalSatelliteMapMapLibre() {
  const mapRef = useRef<MapRef>(null);
  const { parcels, activeLayers, selectParcel, selectedParcel, diseaseZones } = useDigitalTwinStore();

  const parcelFillColor = useCallback(
    (parcel: (typeof parcels)[0]) => {
      if (activeLayers.includes('yield')) {
        if (parcel.predictedYield >= 1.0) return '#10b981';
        if (parcel.predictedYield >= 0.7) return '#f59e0b';
        return '#ef4444';
      }
      if (parcel.status === 'diseased') return '#ef4444';
      if (parcel.status === 'healthy') return '#10b981';
      return '#f59e0b';
    },
    [activeLayers]
  );

  const parcelGeoJSON = {
    type: 'FeatureCollection' as const,
    features: parcels.map((p) => ({
      type: 'Feature' as const,
      properties: {
        id: p.id,
        owner: p.owner,
        cropType: p.cropType,
        ndvi: p.ndvi,
        predictedYield: p.predictedYield,
        status: p.status,
        fillColor: parcelFillColor(p),
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            ...p.coordinates.map((c) => [c[1], c[0]] as [number, number]),
            [p.coordinates[0][1], p.coordinates[0][0]],
          ],
        ],
      },
    })),
  };

  const diseaseGeoJSON = {
    type: 'FeatureCollection' as const,
    features: diseaseZones.map((z) => ({
      type: 'Feature' as const,
      properties: { id: z.id, severity: z.severity, disease: z.disease },
      geometry: {
        type: 'Point' as const,
        coordinates: [z.center[1], z.center[0]],
      },
    })),
  };

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -5.25,
          latitude: 6.82,
          zoom: 12,
        }}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        onClick={(e) => {
          const feature = e.features?.[0];
          if (feature?.properties?.id) {
            const parcel = parcels.find((p) => p.id === feature.properties!.id);
            if (parcel) selectParcel(parcel);
          }
        }}
        interactiveLayerIds={['parcels-fill']}
      >
        {/* PARCEL POLYGONS */}
        <Source id="parcels" type="geojson" data={parcelGeoJSON}>
          <Layer
            id="parcels-fill"
            type="fill"
            paint={{
              'fill-color': ['get', 'fillColor'],
              'fill-opacity': 0.4,
              'fill-outline-color': '#fff',
            }}
          />
        </Source>

        {/* DISEASE ZONES - cercles */}
        {activeLayers.includes('diseases') && (
          <Source id="diseases" type="geojson" data={diseaseGeoJSON}>
            <Layer
              id="diseases-circles"
              type="circle"
              paint={{
                'circle-radius': [
                  'match',
                  ['get', 'severity'],
                  'high',
                  20,
                  'medium',
                  14,
                  10,
                ],
                'circle-color': [
                  'match',
                  ['get', 'severity'],
                  'high',
                  '#ef4444',
                  'medium',
                  '#f59e0b',
                  '#eab308',
                ],
                'circle-opacity': 0.4,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff',
              }}
            />
          </Source>
        )}
      </Map>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-[400]" />
    </div>
  );
}
