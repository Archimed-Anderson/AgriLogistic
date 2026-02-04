'use client';

import { useEffect, useRef, useCallback } from 'react';

export interface WarRoomMetrics {
  activeTransactions: number;
  trucksEnRoute: number;
  escrowPending: number;
  systemHealth: number;
}

export interface IncidentEvent {
  id: string;
  type: string;
  title: string;
  severity: number;
  location: [number, number];
  region: string;
  timestamp: string;
}

interface UseWarRoomWebSocketOptions {
  url?: string;
  enabled?: boolean;
  onIncident?: (incident: IncidentEvent) => void;
  onMetrics?: (metrics: WarRoomMetrics) => void;
}

const DEFAULT_WS_URL = process.env.NEXT_PUBLIC_WAR_ROOM_WS_URL || '';

/**
 * Hook préparatoire pour WebSocket War Room - temps réel incidents & métriques
 * Connexion Socket.io vers NestJS + Redis Pub/Sub (quand backend disponible)
 * Cahier des charges: Latence <2s entre détection incident et affichage
 */
export function useWarRoomWebSocket({
  url = DEFAULT_WS_URL,
  enabled = true,
  onIncident,
  onMetrics,
}: UseWarRoomWebSocketOptions = {}) {
  const socketRef = useRef<ReturnType<typeof import('socket.io-client')> | null>(null);
  const callbacksRef = useRef({ onIncident, onMetrics });
  callbacksRef.current = { onIncident, onMetrics };

  const connect = useCallback(() => {
    if (!url || !enabled || typeof window === 'undefined') return;

    import('socket.io-client').then(({ io }) => {
      // Connexion au namespace /war-room (incident-service)
      const wsUrl = url.endsWith('/war-room') ? url : `${url.replace(/\/$/, '')}/war-room`;
      const socket = io(wsUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
      });

      socket.on('connect', () => {
        socket.emit('join');
      });

      socket.on('incident:new', (data: IncidentEvent) => {
        callbacksRef.current.onIncident?.(data);
      });

      socket.on('incident:update', (data: IncidentEvent) => {
        callbacksRef.current.onIncident?.(data);
      });

      socket.on('metrics:update', (data: WarRoomMetrics) => {
        callbacksRef.current.onMetrics?.(data);
      });

      socketRef.current = socket;
    });
  }, [url, enabled]);

  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connect]);

  return { connected: !!socketRef.current?.connected };
}
