'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

function ParticleField() {
  const ref = useRef<THREE.Points>(null!)
  
  // Detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Generate random particles
  const [positions, colors] = useMemo(() => {
    const count = isMobile ? 800 : 2000
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    
    const agriYellow = new THREE.Color('#fbbf24')
    const agriOrange = new THREE.Color('#ea580c')
    
    for (let i = 0; i < count; i++) {
      // Wide spacing for background
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      // Randomly mix yellow and orange accents
      const mixedColor = Math.random() > 0.5 ? agriYellow : agriOrange
      col[i * 3] = mixedColor.r
      col[i * 3 + 1] = mixedColor.g
      col[i * 3 + 2] = mixedColor.b
    }
    return [pos, col]
  }, [])

  useFrame((state, delta) => {
    // Subtle rotation and drift
    ref.current.rotation.x -= delta / 15
    ref.current.rotation.y -= delta / 20
  })

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function GridTerrain() {
  const gridRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state, delta) => {
    // Simulate forward movement by scrolling the texture or offsetting
    gridRef.current.position.z += delta * 0.5
    if (gridRef.current.position.z > 2) gridRef.current.position.z = 0
  })

  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[20, 20, 40, 40]} />
      <meshStandardMaterial 
        color="#fbbf24" 
        wireframe 
        transparent 
        opacity={0.1}
        emissive="#fbbf24"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

export function Dynamic3DBackground({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 -z-10 pointer-events-none bg-[#0a0a0a]", className)}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#fbbf24" />
        <ParticleField />
        <GridTerrain />
        <fog attach="fog" args={['#0a0a0a', 5, 15]} />
      </Canvas>
    </div>
  )
}
