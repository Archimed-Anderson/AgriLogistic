'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import { HeatmapLayer } from './WarRoomMap';
import { IncidentMarker } from './IncidentMarker';
import type { Incident } from '@/store/warRoomStore';

interface WarRoomMapViewProps {
  incidents: Incident[];
  heatmapEnabled: boolean;
  onSelectIncident: (incident: Incident) => void;
}

/**
 * Vue carte complète - MapContainer + TileLayer + HeatmapLayer + IncidentMarker.
 * Tous les composants Leaflet doivent être dans le même arbre pour le contexte useMap().
 */
export function WarRoomMapView({
  incidents,
  heatmapEnabled,
  onSelectIncident,
}: WarRoomMapViewProps) {
  return (
    <MapContainer
      center={[9.082, 8.6753]}
      zoom={5}
      style={{
        height: '100%',
        width: '100%',
        filter: 'invert(100%) hue-rotate(180deg) contrast(1.1) brightness(0.9)',
      }}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <HeatmapLayer incidents={incidents} enabled={heatmapEnabled} />
      {incidents.map((inc) => (
        <IncidentMarker key={inc.id} incident={inc} onSelect={() => onSelectIncident(inc)} />
      ))}
    </MapContainer>
  );
}
