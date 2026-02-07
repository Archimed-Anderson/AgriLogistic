'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          color="#0ea5e9"
          emissive="#0c4a6e"
          emissiveIntensity={0.5}
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
        {/* Inner solid glow */}
        <mesh>
          <sphereGeometry args={[1.9, 64, 64]} />
          <meshStandardMaterial 
            color="#082f49" 
            transparent={true}
            opacity={0.5}
          />
        </mesh>
      </mesh>
      
      {/* Tactical Points (Mock) */}
      <TacticalPoint position={[1, 1.5, 1]} color="#ef4444" label="INCIDENT #88" />
      <TacticalPoint position={[-1.2, 0.5, 1.5]} color="#10b981" label="LIVE FLEET" />
      <TacticalPoint position={[0, -2, 0]} color="#3b82f6" label="HQ HUB" />
    </group>
  );
}

function TacticalPoint({ position, color, label }: { position: [number, number, number], color: string, label: string }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        <pointLight color={color} intensity={2} distance={2} />
      </mesh>
      <Text
        position={[position[0], position[1] + 0.2, position[2]]}
        fontSize={0.12}
        color="white"
        font="https://fonts.gstatic.com/s/robotomono/v22/L0tkDFI8PLY98R7at_ozlsA.woff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </Float>
  );
}

export function ThreeDGlobe() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={['#020408']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <GlobeMesh />
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
        />
      </Canvas>
      <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none">
         <div className="bg-black/60 backdrop-blur-md border border-white/10 px-8 py-3 rounded-full flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Orbital Link Active</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">DRAG TO ROTATE • SCROLL TO ZOOM</span>
         </div>
      </div>
    </div>
  );
}
