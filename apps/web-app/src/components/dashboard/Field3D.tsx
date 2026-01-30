"use client"

import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"

interface Field3DProps {
  width?: number
  height?: number
  className?: string
}

function FieldPlane({ hovered, setHovered }: { hovered: boolean; setHovered: (value: boolean) => void }) {
  const meshRef = React.useRef<THREE.Mesh>(null)
  const [color, setColor] = React.useState("#22c55e")

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle animation
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.02
    }
  })

  React.useEffect(() => {
    setColor(hovered ? "#16a34a" : "#22c55e")
  }, [hovered])

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[10, 10, 32, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        metalness={0.2}
        wireframe={false}
      />
    </mesh>
  )
}

export function Field3D({ width = 600, height = 400, className }: Field3DProps) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      className={`relative rounded-lg border bg-card ${className}`}
      style={{ width, height }}
    >
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <PerspectiveCamera makeDefault position={[0, 8, 8]} fov={50} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <FieldPlane hovered={hovered} setHovered={setHovered} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
      {hovered && (
        <div className="absolute bottom-4 left-4 rounded-md bg-primary/90 px-3 py-1.5 text-sm text-primary-foreground">
          Terrain interactif - Survolez pour voir les détails
        </div>
      )}
    </div>
  )
}
