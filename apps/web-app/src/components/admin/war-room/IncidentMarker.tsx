'use client';

import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Incident, IncidentType } from '@/store/warRoomStore';

/** Couleurs par type (cahier des charges): rouge=fraude, orange=retard, jaune=IoT offline */
const TYPE_HEX: Record<IncidentType, string> = {
  fraud_detected: '#ef4444',
  delay_risk: '#f97316',
  iot_failure: '#eab308',
  quality_alert: '#f59e0b',
};

interface IncidentMarkerProps {
  incident: Incident;
  onSelect: () => void;
}

/**
 * Marker animé par type d'incident - conforme cahier des charges
 */
export function IncidentMarker({ incident, onSelect }: IncidentMarkerProps) {
  const { type, severity } = incident;
  const hex = TYPE_HEX[type] ?? '#f59e0b';
  const isCritical = severity > 90;

  const icon = useMemo(() => {
    return L.divIcon({
      className: 'war-room-marker bg-transparent border-0',
      html: `
        <div style="
          width: 24px; height: 24px;
          border-radius: 50%;
          background: ${hex};
          border: 2px solid rgba(255,255,255,0.9);
          box-shadow: 0 0 ${isCritical ? 14 : 8}px ${hex};
          display: flex; align-items: center; justify-content: center;
          animation: ${isCritical ? 'war-room-pulse 1.5s ease-in-out infinite' : 'none'};
        ">
          <span style="font-size: 10px; font-weight: 900; color: white; text-shadow: 0 1px 2px #000;">${severity > 80 ? '!' : '•'}</span>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  }, [severity, isCritical, hex]);

  return (
    <Marker
      position={incident.location}
      icon={icon}
      eventHandlers={{ click: onSelect }}
    >
      <Popup className="custom-popup">
        <div className="min-w-[180px]">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: hex }}
            />
            <span className="text-[10px] font-mono text-slate-500 uppercase">#{incident.id}</span>
          </div>
          <p className="font-bold text-sm text-white mb-1">{incident.title}</p>
          <p className="text-xs text-slate-400">{incident.region}</p>
          <p className="text-[10px] font-mono text-red-500 mt-1">SEV: {incident.severity}</p>
        </div>
      </Popup>
    </Marker>
  );
}
