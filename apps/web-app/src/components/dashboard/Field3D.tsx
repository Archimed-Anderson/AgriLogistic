"use client"

import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Grid, Stars, Float } from "@react-three/drei"
import * as THREE from "three"

interface Field3DProps {
  width?: number | string
  height?: number | string
  className?: string
}

function DigitalField() {
  const meshRef = React.useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.01
    }
  })

  return (
    <group>
      {/* Main Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#1B4D3E" 
          roughness={0.8} 
          metalness={0.2}
          emissive="#000000"
        />
      </mesh>

      {/* Grid Overlay */}
      <Grid 
        infiniteGrid 
        fadeDistance={25} 
        fadeStrength={5} 
        cellSize={1} 
        sectionSize={5} 
        sectionColor="#D4A017" 
        sectionThickness={1.5}
        cellColor="#666"
        cellThickness={0.5}
      />

      {/* Modern Parcel Marker */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[2, 0.5, 2]}>
          <boxGeometry args={[4, 0.1, 4]} />
          <meshStandardMaterial color="#22c55e" opacity={0.6} transparent />
        </mesh>
        
        {/* Holographic Border */}
        <mesh position={[2, 0.5, 2]}>
          <boxGeometry args={[4.1, 0.15, 4.1]} />
          <meshBasicMaterial color="#D4A017" wireframe />
        </mesh>
      </Float>

      {/* Data Points / Sensors */}
      <SensorPoint position={[-3, 0.2, -4]} active />
      <SensorPoint position={[4, 0.2, 1]} />
      <SensorPoint position={[-1, 0.2, 5]} active />
    </group>
  )
}

function SensorPoint({ position, active = false }: { position: [number, number, number], active?: boolean }) {
  const lightRef = React.useRef<THREE.PointLight>(null)
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = active ? Math.sin(state.clock.elapsedTime * 4) * 0.5 + 0.5 : 0
    }
  })

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 0.5]} />
        <meshStandardMaterial color={active ? "#D4A017" : "#666"} />
      </mesh>
      {active && (
        <pointLight ref={lightRef} color="#D4A017" distance={2} intensity={1} />
      )}
    </group>
  )
}

export function Field3D({ width = "100%", height = "100%", className }: Field3DProps) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        camera={{ position: [10, 10, 10], fov: 45 }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 10, 40]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#D4A017" />
        <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <React.Suspense fallback={null}>
          <DigitalField />
        </React.Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={25}
        />
      </Canvas>
      
      {/* UI Overlay on Canvas */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Sync Active</span>
        </div>
      </div>
    </div>
  )
}
