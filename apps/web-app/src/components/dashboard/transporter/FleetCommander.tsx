'use client';

import * as React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Html,
  PresentationControls,
  Float,
  Text,
  useCursor,
} from '@react-three/drei';
import * as THREE from 'three';
import {
  AlertTriangle,
  Thermometer,
  Activity,
  Truck,
  Wrench,
  Disc,
  Info,
  Trophy,
  Star,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// --- 3D Components ---

function TruckModel({
  status,
  onPartClick,
}: {
  status: string;
  onPartClick: (part: string) => void;
}) {
  const [hovered, setHover] = React.useState<string | null>(null);

  useCursor(!!hovered);

  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.2,
    metalness: 0.8,
  });

  const trailerMaterial = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    roughness: 0.5,
    metalness: 0.2,
  });

  // Wheel Logic
  const Wheel = ({ position, name }: { position: [number, number, number]; name: string }) => (
    <mesh
      position={position}
      rotation={[Math.PI / 2, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onPartClick(name);
      }}
      onPointerOver={() => setHover(name)}
      onPointerOut={() => setHover(null)}
    >
      <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
      <meshStandardMaterial color={hovered === name ? '#10b981' : '#334155'} />
    </mesh>
  );

  return (
    <group>
      {/* Cabin */}
      <mesh
        position={[2.5, 1, 0]}
        material={bodyMaterial}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick('Moteur');
        }}
        onPointerOver={() => setHover('Moteur')}
        onPointerOut={() => setHover(null)}
      >
        <boxGeometry args={[2, 2.5, 2.2]} />
        {hovered === 'Moteur' && (
          <Html position={[0, 1.5, 0]} center distanceFactor={10}>
            <div className="bg-emerald-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
              Moteur V8 Turbo
            </div>
          </Html>
        )}
      </mesh>

      {/* Trailer */}
      <mesh position={[-1.5, 1.5, 0]} material={trailerMaterial}>
        <boxGeometry args={[5.5, 3.5, 2.4]} />
      </mesh>

      {/* Connector */}
      <mesh position={[1, 0.5, 0]} material={bodyMaterial}>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
      </mesh>

      {/* Wheels Cabin */}
      <Wheel position={[2.5, 0.5, 1.1]} name="Roue AV-G" />
      <Wheel position={[2.5, 0.5, -1.1]} name="Roue AV-D" />

      {/* Wheels Trailer */}
      <Wheel position={[-3.5, 0.5, 1.1]} name="Roue AR-G" />
      <Wheel position={[-3.5, 0.5, -1.1]} name="Roue AR-D" />
      <Wheel position={[-2, 0.5, 1.1]} name="Roue MID-G" />
      <Wheel position={[-2, 0.5, -1.1]} name="Roue MID-D" />

      {/* Status Lights */}
      <pointLight
        position={[2.5, 3, 0]}
        color={status === 'Critical' ? '#ef4444' : '#10b981'}
        intensity={2}
        distance={5}
      />
    </group>
  );
}

function Environment() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <gridHelper args={[20, 20, 0x1e293b, 0x0f172a]} position={[0, 0, 0]} />
    </>
  );
}

// --- Main Component ---

const VEHICLES = [
  { id: 'FL-01', model: 'Scania R500', status: 'Active', health: 94, nextMaintenance: '1200 km' },
  { id: 'FL-02', model: 'Volvo FH16', status: 'Critical', health: 45, nextMaintenance: 'URGENT' },
  {
    id: 'FL-03',
    model: 'Renault T-High',
    status: 'Active',
    health: 88,
    nextMaintenance: '4500 km',
  },
];

export function FleetCommander() {
  const [selectedTruck, setSelectedTruck] = React.useState(VEHICLES[0]);
  const [selectedPart, setSelectedPart] = React.useState<string | null>(null);

  return (
    <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-12rem)] min-h-[600px]">
      {/* Left: Interactive Fleet List */}
      <Card className="lg:col-span-4 bg-slate-950/40 border-white/5 shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Truck className="text-emerald-500" /> Flotte Active
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">
            {VEHICLES.length} unités connectées au réseau
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {VEHICLES.map((v) => (
            <div
              key={v.id}
              onClick={() => {
                setSelectedTruck(v);
                setSelectedPart(null);
              }}
              className={cn(
                'p-4 rounded-2xl border transition-all cursor-pointer group hover:bg-white/5',
                selectedTruck.id === v.id
                  ? 'bg-white/10 border-emerald-500/50'
                  : 'bg-transparent border-white/5'
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span
                    className={cn(
                      'text-lg font-black uppercase italic transition-colors',
                      selectedTruck.id === v.id
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-white'
                    )}
                  >
                    {v.id}
                  </span>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{v.model}</p>
                </div>
                <Badge
                  className={cn(
                    'border-none text-[9px] font-black uppercase',
                    v.status === 'Critical'
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-emerald-500/10 text-emerald-500'
                  )}
                >
                  {v.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                  <span>Santé Globale</span>
                  <span className={v.health < 50 ? 'text-red-500' : 'text-emerald-500'}>
                    {v.health}%
                  </span>
                </div>
                <Progress
                  value={v.health}
                  className={cn(
                    'h-1 bg-slate-800',
                    v.health < 50 ? 'text-red-500' : 'text-emerald-500'
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Right: Digital Twin Canvas */}
      <div className="lg:col-span-8 relative rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="absolute top-6 left-6 z-10">
          <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter opacity-20 pointer-events-none select-none">
            DIGITAL TWIN // VER 2.0
          </h3>
        </div>

        <div className="absolute top-6 right-6 z-10 flex gap-4">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-right">
            <p className="text-[9px] font-bold text-slate-500 uppercase">Maintenance</p>
            <div className="flex items-center gap-2 justify-end">
              {selectedTruck.status === 'Critical' && (
                <AlertTriangle size={14} className="text-red-500 animate-pulse" />
              )}
              <p
                className={cn(
                  'text-xl font-black',
                  selectedTruck.status === 'Critical' ? 'text-red-500' : 'text-white'
                )}
              >
                {selectedTruck.nextMaintenance}
              </p>
            </div>
          </div>
        </div>

        {/* 3D Scene */}
        <Canvas className="w-full h-full" shadows camera={{ position: [5, 5, 5], fov: 50 }}>
          <color attach="background" args={['#020617']} />
          <fog attach="fog" args={['#020617', 5, 20]} />

          <Environment />

          <PresentationControls
            global
            zoom={1}
            rotation={[0, -Math.PI / 4, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
          >
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
              <TruckModel
                status={selectedTruck.status}
                onPartClick={(part) => setSelectedPart(part)}
              />
            </Float>
          </PresentationControls>
        </Canvas>

        {/* Overlay Diagnostics Panel */}
        {selectedPart && (
          <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:w-80 bg-slate-950/90 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  {selectedPart.includes('Roue') ? <Disc size={20} /> : <Activity size={20} />}
                </div>
                <div>
                  <h4 className="font-black text-white text-sm uppercase">{selectedPart}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Diagnostic Télémétrique
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-500 hover:text-white"
                onClick={() => setSelectedPart(null)}
              >
                X
              </Button>
            </div>

            <div className="space-y-4">
              {selectedPart.includes('Roue') ? (
                <>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Pression</span>
                    <span className="text-sm font-black text-emerald-500">8.2 BAR</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Usure</span>
                    <span className="text-sm font-black text-white">12%</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Température
                    </span>
                    <span className="text-sm font-black text-white">92°C</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Vibrations
                    </span>
                    <span className="text-sm font-black text-emerald-500">Normal</span>
                  </div>
                </>
              )}

              <Button className="w-full bg-slate-100 hover:bg-white text-slate-900 font-black uppercase text-[10px] h-10 rounded-xl">
                <Wrench className="mr-2 h-3 w-3" /> Planifier Révision
              </Button>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 left-6 pointer-events-none">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
            <Info size={12} />
            <span>CLIQUEZ SUR LE VÉHICULE POUR VOIR LES DÉTAILS</span>
          </div>
        </div>
      </div>

      {/* Driver Scoreboard Section */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-950/40 border-white/5 p-6 flex items-center gap-4 group hover:bg-white/5 transition-all">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Meilleur Chauffeur
            </p>
            <h3 className="text-2xl font-black text-white">Moussa Diop</h3>
            <div className="flex items-center gap-1 text-yellow-500 text-xs font-black">
              <Star size={12} fill="currentColor" /> 4.98/5
            </div>
          </div>
        </Card>

        <Card className="bg-slate-950/40 border-white/5 p-6 flex items-center gap-4 group hover:bg-white/5 transition-all">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Eco-Conduite
            </p>
            <h3 className="text-2xl font-black text-emerald-400">98/100</h3>
            <p className="text-[10px] text-slate-400 font-bold">-14% Conso Carburant</p>
          </div>
        </Card>

        <Card className="bg-slate-950/40 border-white/5 p-6 flex items-center gap-4 group hover:bg-white/5 transition-all">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Truck size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Missions Complétées
            </p>
            <h3 className="text-2xl font-black text-white">1,248</h3>
            <p className="text-[10px] text-slate-400 font-bold">Total Flotte (Mensuel)</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
