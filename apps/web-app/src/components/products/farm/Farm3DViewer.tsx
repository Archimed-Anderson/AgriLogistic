"use client"

import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, Html, Stars } from '@react-three/drei'
import { Sprout, Droplets, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FarmPlot } from '@/data/farm-data'

function FarmModel({ plot, onClick }: { plot: FarmPlot | null, onClick: () => void }) {
  if (!plot) return null

  // Code couleur dynamique selon l'humidité ou NDVI
  const floorColor = plot.status === 'optimal' ? '#166534' : 
                     plot.status === 'warning' ? '#ca8a04' : '#991b1b'

  return (
    <group>
      {/* Sol Parcellaire avec Effet Digital */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} onClick={onClick}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial 
          color={floorColor} 
          opacity={0.3} 
          transparent 
          wireframe={false} 
        />
      </mesh>
      
      {/* Grid Cyberpunk */}
      <Grid 
        position={[0, -0.05, 0]} 
        args={[12.5, 12.5]} 
        cellColor={plot.status === 'optimal' ? "#4ade80" : "#fbbf24"} 
        sectionColor="white" 
        fadeDistance={25} 
        fadeStrength={1} 
        cellThickness={0.5}
      />

      {/* Capteurs / Crops Interactifs */}
      {Array.from({ length: 8 }).map((_, i) => (
        <React.Fragment key={i}>
            {Array.from({ length: 8 }).map((_, j) => {
                const height = 0.5 + Math.random() * 0.8
                const x = (i - 3.5) * 1.2
                const z = (j - 3.5) * 1.2
                
                return (
                    <mesh 
                      key={`${i}-${j}`} 
                      position={[x, height/2, z]}
                      onClick={(e) => {
                        e.stopPropagation()
                        onClick()
                      }}
                    >
                        <boxGeometry args={[0.3, height, 0.3]} />
                        <meshStandardMaterial 
                          color={plot.status === 'optimal' ? "#22c55e" : "#f59e0b"} 
                          emissive={plot.status === 'optimal' ? "#15803d" : "#b45309"}
                          emissiveIntensity={0.5}
                        />
                    </mesh>
                )
            })}
        </React.Fragment>
      ))}

      {/* Label Flottant 3D Cyber */}
      <Html position={[0, 2.5, 0]} center zIndexRange={[100, 0]}>
         <div className="bg-black/80 backdrop-blur-md p-4 rounded-xl shadow-2xl min-w-[180px] text-center pointer-events-none border border-green-500/30 animate-in fade-in zoom-in duration-500">
             <div className="flex items-center justify-center gap-2 mb-2 pb-2 border-b border-white/10">
                 <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                 <span className="font-black text-sm text-green-400 tracking-wider uppercase">Live Sensor</span>
             </div>
             <div className="grid grid-cols-2 gap-3 text-xs">
                 <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-white/60 mb-1 text-[10px] uppercase">Moisture</span>
                    <span className="text-blue-400 font-bold text-lg">{plot.moisture}%</span>
                 </div>
                 <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-white/60 mb-1 text-[10px] uppercase">NDVI</span>
                    <span className="text-green-400 font-bold text-lg">{plot.healthScore}</span>
                 </div>
             </div>
         </div>
      </Html>
    </group>
  )
}

interface Farm3DViewerProps {
  selectedPlot: FarmPlot | null
}

export function Farm3DViewer({ selectedPlot }: Farm3DViewerProps) {
  const [interacted, setInteracted] = useState(false)

  const handleInteraction = () => {
    setInteracted(true)
    setTimeout(() => setInteracted(false), 200) // Simple feedback effect generic
  }

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-950 rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl group">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Badge variant="outline" className="bg-black/60 text-cyan-400 border-cyan-500/30 backdrop-blur">
          <Activity className="w-3 h-3 mr-1 animate-pulse" />
          Twin-01: Online
        </Badge>
        <Badge variant="outline" className="bg-black/60 text-white border-white/10 backdrop-blur">
          WebGL Active
        </Badge>
      </div>

      <Canvas camera={{ position: [8, 8, 8], fov: 50 }} shadows>
        <Suspense fallback={<Html center><span className="text-cyan-500 font-mono tracking-widest text-xs animate-pulse">INITIALIZING SENSORS...</span></Html>}>
            <color attach="background" args={['#020617']} />
            <fog attach="fog" args={['#020617', 5, 30]} />
            
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#4ade80" />
            <pointLight position={[-10, 5, -10]} intensity={0.5} color="#3b82f6" />
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="night" background={false} />

            <OrbitControls 
                autoRotate={true} 
                autoRotateSpeed={0.8}
                enableZoom={true} 
                maxPolarAngle={Math.PI / 2.1} 
                minDistance={4}
                maxDistance={25}
            />

            <FarmModel plot={selectedPlot} onClick={handleInteraction} />
            
            {/* Effet visuel lors du clic */}
            {interacted && (
              <mesh position={[0,0,0]}>
                 <sphereGeometry args={[8, 32, 32]} />
                 <meshBasicMaterial color="#ffffff" transparent opacity={0.1} wireframe />
              </mesh>
            )}
        </Suspense>
      </Canvas>

      {!selectedPlot && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 backdrop-blur-sm">
             <div className="text-center">
                <Activity className="h-12 w-12 text-cyan-500 mx-auto mb-4 animate-bounce" />
                <p className="text-cyan-400 text-lg font-mono tracking-widest uppercase">Select Sector</p>
             </div>
        </div>
      )}
    </div>
  )
}
