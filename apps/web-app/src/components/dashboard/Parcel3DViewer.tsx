"use client"

import * as React from "react"
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Grid, Stars, Float, Html, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"
import { useFarmerStore } from "@/store/farmerStore"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Zap, 
  Activity, 
  TrendingUp, 
  Layers, 
  Sun,
  CloudRain,
  Snowflake
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip as RechartsTooltip } from "recharts"

// --- Types ---
interface SensorData {
  temp: string
  humidity: string
  npk: { n: number; p: number; k: number }
}

interface IoTSensorNodeProps {
  position: [number, number, number]
  label: string
  data: SensorData
  isActive: boolean
}

interface SeasonalColors {
  spring: string
  summer: string
  autumn: string
  winter: string
}

// --- Constants ---
const SEASON_COLORS: SeasonalColors = {
  spring: "#4ade80",
  summer: "#1B4D3E",
  autumn: "#D4A017",
  winter: "#94a3b8"
}

const MOCK_HISTORICAL_DATA = [
  { day: "Lun", yield: 7.2 },
  { day: "Mar", yield: 7.5 },
  { day: "Mer", yield: 7.1 },
  { day: "Jeu", yield: 8.2 },
  { day: "Ven", yield: 8.5 },
  { day: "Sam", yield: 8.4 },
  { day: "Dim", yield: 8.6 },
]

// --- Sub-Components ---

/**
 * IoTSensorNode: Emitting sensor nodes with interaction
 */
function IoTSensorNode({ position, label, data, isActive }: IoTSensorNodeProps) {
  const [hovered, setHovered] = React.useState(false)
  const [clicked, setClicked] = React.useState(false)
  const lightRef = React.useRef<THREE.PointLight>(null)

  useFrame((state) => {
    if (lightRef.current && isActive) {
      lightRef.current.intensity = Math.sin(state.clock.elapsedTime * 6) * 0.4 + 0.6
    }
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#222" metalness={1} roughness={0.1} />
      </mesh>
      
      <mesh 
        position={[0, 0.5, 0]} 
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer" }} 
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "default" }}
        onClick={(e) => { e.stopPropagation(); setClicked(!clicked) }}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <MeshDistortMaterial 
          color={isActive ? "#D4A017" : "#333"} 
          emissive={isActive ? "#D4A017" : "#000"}
          emissiveIntensity={isActive ? 2 : 0}
          distort={0.2}
          speed={2}
        />
      </mesh>

      {isActive && (
        <pointLight ref={lightRef} color="#D4A017" distance={3} intensity={1.5} />
      )}

      {(hovered || clicked) && (
        <Html distanceFactor={10} position={[0, 0.8, 0]} center zIndexRange={[10, 0]}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#0a1f18]/90 backdrop-blur-2xl border border-[#D4A017]/30 rounded-2xl p-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[180px]"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase text-[#D4A017] tracking-tighter">{label}</p>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[8px]">LIVE</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-white/40 flex items-center gap-1 uppercase font-bold"><Thermometer size={10} /> Temp</span>
                <span className="text-xs font-black">{data.temp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-white/40 flex items-center gap-1 uppercase font-bold"><Droplets size={10} /> Humid</span>
                <span className="text-xs font-black">{data.humidity}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-white/5 space-y-1">
                 <p className="text-[8px] font-black text-white/20 uppercase">Compo Sol (NPK)</p>
                 <div className="flex gap-2">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-orange-500" style={{ width: `${data.npk.n}%` }} />
                    </div>
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500" style={{ width: `${data.npk.p}%` }} />
                    </div>
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500" style={{ width: `${data.npk.k}%` }} />
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </Html>
      )}
    </group>
  )
}

/**
 * TerrainMesh: The parcel geometry with NDVI based color shifting
 */
function TerrainMesh({ seasonValue, ndviValue }: { seasonValue: number; ndviValue: number }) {
  const [clicked, setClicked] = React.useState(false)
  
  // Interpolate between seasons: 0: Spring, 33: Summer, 66: Autumn, 100: Winter
  const getSeasonColor = (v: number) => {
    const springArr = new THREE.Color(SEASON_COLORS.spring)
    const summerArr = new THREE.Color(SEASON_COLORS.summer)
    const autumnArr = new THREE.Color(SEASON_COLORS.autumn)
    const winterArr = new THREE.Color(SEASON_COLORS.winter)

    if (v < 33) return springArr.lerp(summerArr, v / 33)
    if (v < 66) return summerArr.lerp(autumnArr, (v - 33) / 33)
    return autumnArr.lerp(winterArr, (v - 66) / 34)
  }

  const baseColor = getSeasonColor(seasonValue)
  
  // Merge with NDVI (0: red, 100: use baseColor)
  const finalColor = new THREE.Color("#ef4444").lerp(baseColor, ndviValue / 100)

  return (
    <group>
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.01, 0]}
        onClick={(e) => { e.stopPropagation(); setClicked(!clicked) }}
        onPointerOver={() => { document.body.style.cursor = "pointer" }}
        onPointerOut={() => { document.body.style.cursor = "default" }}
      >
        <planeGeometry args={[18, 18, 128, 128]} />
        <meshStandardMaterial 
          color={finalColor} 
          roughness={0.6} 
          metalness={0.1}
          emissive={finalColor}
          emissiveIntensity={0.05}
        />
      </mesh>

      <AnimatePresence>
        {clicked && (
          <Html position={[0, 1.5, 0]} center distanceFactor={12}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-black/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 text-white shadow-[0_50px_100px_rgba(0,0,0,0.8)] min-w-[320px]"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-black tracking-tighter uppercase">PARCELLE SUD-A1</h4>
                  <p className="text-[10px] font-black text-[#D4A017] uppercase tracking-[0.2em] mt-1">Status: Productivité Élevée</p>
                </div>
                <button onClick={() => setClicked(false)} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">✕</button>
              </div>

              <div className="h-[120px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_HISTORICAL_DATA}>
                    <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                    <RechartsTooltip 
                      contentStyle={{ background: '#000', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                      itemStyle={{ color: '#D4A017' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="yield" 
                      stroke="#D4A017" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: '#D4A017', strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                    <TrendingUp className="text-emerald-400" size={16} />
                    <div>
                      <p className="text-[8px] font-black text-white/30 uppercase">Rendement Prévu</p>
                      <p className="text-sm font-black">8.6 T/ha</p>
                    </div>
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                    <Layers className="text-sky-400" size={16} />
                    <div>
                      <p className="text-[8px] font-black text-white/30 uppercase">Biomasse</p>
                      <p className="text-sm font-black">420 g/m²</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          </Html>
        )}
      </AnimatePresence>

      <Grid 
        infiniteGrid 
        fadeDistance={25} 
        fadeStrength={5} 
        cellSize={1} 
        sectionSize={5} 
        sectionColor="#D4A017" 
        sectionThickness={1.5}
        cellColor="#1B4D3E"
        cellThickness={0.5}
      />
    </group>
  )
}

/**
 * Main Scene3DViewer Component
 */
export default function Parcel3DViewer() {
  const [ndviValue, setNdviValue] = React.useState(85)
  const [seasonValue, setSeasonValue] = React.useState(33) // Default to Summer
  
  return (
    <div className="relative w-full h-full bg-[#050505] rounded-[2rem] overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        camera={{ position: [14, 14, 14], fov: 42 }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 10, 60]} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 15, 10]} intensity={2} color="#D4A017" />
        <spotLight position={[-20, 30, 20]} angle={0.25} penumbra={1} intensity={1.5} castShadow />
        
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={0.5} />
        
        <React.Suspense fallback={null}>
          <TerrainMesh seasonValue={seasonValue} ndviValue={ndviValue} />
          
          <IoTSensorNode 
            position={[5, 0, 4]} 
            label="SENSOR_NODE_01_E" 
            data={{ temp: "24.5°C", humidity: "58%", npk: { n: 80, p: 45, k: 60 } }}
            isActive={true} 
          />
          <IoTSensorNode 
            position={[-4, 0, -3]} 
            label="SENSOR_NODE_02_W" 
            data={{ temp: "23.8°C", humidity: "62%", npk: { n: 70, p: 60, k: 40 } }}
            isActive={true} 
          />
          <IoTSensorNode 
            position={[2, 0, -7]} 
            label="SENSOR_NODE_03_S" 
            data={{ temp: "25.1°C", humidity: "55%", npk: { n: 60, p: 40, k: 85 } }}
            isActive={false} 
          />
        </React.Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={10}
          maxDistance={40}
        />
      </Canvas>

      {/* SensorHUD: Top Left Glassmorphism Control Panel */}
      <div className="absolute top-8 left-8 flex flex-col gap-6 pointer-events-none w-full max-w-[320px]">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-8 py-6 bg-[#0a1f18]/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl pointer-events-auto"
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#D4A017] animate-pulse shadow-[0_0_15px_#D4A017]" />
                <span className="text-[11px] font-black uppercase text-[#D4A017] tracking-[0.3em]">ANALYSE AUGMENTÉE</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* NDVI Simulation */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Index Végétatif NDVI</span>
                  <span className={`text-sm font-black tracking-tighter ${ndviValue > 75 ? 'text-emerald-400' : ndviValue > 40 ? 'text-amber-400' : 'text-red-400'}`}>
                    {ndviValue < 100 ? `0.${ndviValue}` : '1.00'}
                  </span>
                </div>
                <input 
                  type="range" min="0" max="100" value={ndviValue} 
                  onChange={(e) => setNdviValue(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-[#D4A017] cursor-pointer"
                />
              </div>

              {/* Seasonal Morphing Simulation */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Timeline Saisonnière</span>
                      {seasonValue < 25 ? <Sun size={12} className="text-emerald-400" /> : 
                       seasonValue < 50 ? <Sun size={12} className="text-yellow-400" /> : 
                       seasonValue < 75 ? <CloudRain size={12} className="text-orange-400" /> : 
                       <Snowflake size={12} className="text-sky-400" />}
                   </div>
                   <span className="text-[10px] font-black text-white uppercase opacity-60">
                     {seasonValue < 25 ? "Printemps" : seasonValue < 50 ? "Été" : seasonValue < 75 ? "Automne" : "Hiver"}
                   </span>
                </div>
                <input 
                  type="range" min="0" max="100" value={seasonValue} 
                  onChange={(e) => setSeasonValue(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none accent-[#D4A017] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-[#D4A017]/30 transition-all">
                  <Activity size={12} className="text-emerald-400 mb-2" />
                  <p className="text-[9px] font-black text-white/30 uppercase mb-1">Chlorophylle</p>
                  <p className="text-xs font-black text-white">82% <span className="text-[10px] text-emerald-400 ml-1">↑</span></p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-[#D4A017]/30 transition-all">
                  <Zap size={12} className="text-[#D4A017] mb-2" />
                  <p className="text-[9px] font-black text-white/30 uppercase mb-1">Azote (N)</p>
                  <p className="text-xs font-black text-white">4.2 <span className="text-[10px] text-white/40 ml-1">avg</span></p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating SensorHUD (Top Right) */}
      <div className="absolute top-8 right-8 pointer-events-none">
        <motion.div 
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 text-white pointer-events-auto"
        >
           <div className="flex items-center gap-2">
              <Thermometer size={14} className="text-orange-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Air: 24.2°C</span>
           </div>
           <div className="h-4 w-[1px] bg-white/10" />
           <div className="flex items-center gap-2">
              <Wind size={14} className="text-sky-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Vent: NE 12km/h</span>
           </div>
        </motion.div>
      </div>
    </div>
  )
}
