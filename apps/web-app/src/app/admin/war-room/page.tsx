'use client';

import { MissionControl } from '@/components/admin/war-room/MissionControl';

export default function WarRoomPage() {
  return (
    <div className="min-h-screen bg-[#020408] p-8 space-y-8 overflow-hidden">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Mission Control Center</h1>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          Tactical Command • Neural Stream v5.2 Active
        </p>
      </header>
      
      <MissionControl />
    </div>
  );
}
