import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface MissionUpdate {
  missionId: string;
  status: string;
  message: string;
  timestamp: string;
}

export interface LiveOpsStats {
  missions: {
    pending: number;
    active: number;
    completed: number;
  };
  incidents: Array<{
    id: string;
    title: string;
    severity: number;
    type: string;
    location: string;
  }>;
  networkStatus: string;
  intelMesh: string;
  timestamp: string;
}

export const useWarRoomSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [stats, setStats] = useState<LiveOpsStats | null>(null);
  const [lastEvent, setLastEvent] = useState<MissionUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Replace with your actual Mission Service URL
    const socketInstance = io('http://localhost:3006/war-room', {
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('War Room Socket Connected');
      socketInstance.emit('request_fleet_status');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('War Room Socket Disconnected');
    });

    socketInstance.on('live_ops_stats', (data: LiveOpsStats) => {
      setStats(data);
    });

    socketInstance.on('mission_event', (data: MissionUpdate) => {
      setLastEvent(data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const requestFleetStatus = useCallback(() => {
    if (socket) {
      socket.emit('request_fleet_status');
    }
  }, [socket]);

  return {
    isConnected,
    stats,
    lastEvent,
    requestFleetStatus,
  };
};
