'use client';

import dynamic from 'next/dynamic';

// War Room utilise Leaflet, leaflet.heat et Socket.io - tous requièrent window
// On force le rendu côté client uniquement pour éviter "window is not defined" pendant le build
const WarRoomClient = dynamic(() => import('./WarRoomClient').then((m) => ({ default: m.WarRoomClient })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center">
      <div className="text-slate-500 font-mono text-sm animate-pulse">Chargement War Room...</div>
    </div>
  ),
});

export default function WarRoomPage() {
  return <WarRoomClient />;
}
