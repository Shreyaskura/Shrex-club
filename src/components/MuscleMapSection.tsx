import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Target, Dumbbell, Zap, CheckCircle2, ChevronRight, Activity, RotateCcw, Eye, Sparkles, MessageSquare } from 'lucide-react';
import { MUSCLE_GROUPS, MuscleInfo } from '../data/gymData';

interface MuscleMapSectionProps {
  onOpenWorkoutModal: (muscle: MuscleInfo) => void;
}

// Camera Positions & Targets for smooth 3D Zoom Animations
const CAMERA_ZOOM_TARGETS: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  'upper-chest': { pos: [0, 0.95, 1.9], target: [0, 0.9, 0] },
  'mid-chest': { pos: [0, 0.8, 1.9], target: [0, 0.78, 0] },
  'lower-chest': { pos: [0, 0.65, 1.8], target: [0, 0.62, 0] },
  'abs': { pos: [0, 0.35, 1.7], target: [0, 0.3, 0] },
  'obliques': { pos: [0.4, 0.35, 1.7], target: [0.35, 0.28, 0] },
  'front-delts': { pos: [-0.65, 1.1, 1.8], target: [-0.7, 1.02, 0] },
  'side-delts': { pos: [-0.9, 1.05, 1.7], target: [-0.85, 1.0, 0] },
  'biceps': { pos: [-0.95, 0.75, 1.7], target: [-0.9, 0.68, 0] },
  'forearms': { pos: [-1.05, 0.25, 1.6], target: [-1.0, 0.15, 0] },
  'quads': { pos: [0, -0.65, 2.0], target: [0, -0.65, 0] },
  'calves': { pos: [0, -1.35, 1.8], target: [0, -1.35, 0] },
  // Posterior / Back muscles (viewed from rear)
  'glutes': { pos: [0, -0.05, -2.1], target: [0, -0.08, 0] },
  'hamstrings': { pos: [0, -0.65, -2.0], target: [0, -0.65, 0] },
  'lats': { pos: [0, 0.75, -2.1], target: [0, 0.72, 0] },
  'traps': { pos: [0, 1.15, -2.0], target: [0, 1.1, 0] },
  'lower-back': { pos: [0, 0.35, -2.0], target: [0, 0.32, 0] },
  'rear-delts': { pos: [-0.75, 1.1, -1.8], target: [-0.7, 1.02, 0] },
  'triceps': { pos: [-0.95, 0.75, -1.7], target: [-0.9, 0.68, 0] },
  // Default Full Body
  'default': { pos: [0, 0, 4.2], target: [0, -0.1, 0] },
};

// Smooth Camera Lerper inside Canvas
function CameraController({
  selectedId,
  isBackView,
  manualControlsRef,
}: {
  selectedId: string;
  isBackView: boolean;
  manualControlsRef: React.RefObject<any>;
}) {
  useFrame((state, delta) => {
    let config = CAMERA_ZOOM_TARGETS[selectedId] || CAMERA_ZOOM_TARGETS['default'];

    let targetPos = new THREE.Vector3(...config.pos);
    let lookTarget = new THREE.Vector3(...config.target);

    // If in Back View and default view, flip camera to back
    if (isBackView && selectedId === 'default') {
      targetPos.set(0, 0, -4.2);
    }

    // Smoothly glide camera
    state.camera.position.lerp(targetPos, delta * 3.2);

    if (manualControlsRef.current) {
      manualControlsRef.current.target.lerp(lookTarget, delta * 3.2);
      manualControlsRef.current.update();
    }
  });

  return null;
}

// Single 3D Anatomical Muscle Mesh with interactive highlight & click
function MusclePartMesh({
  muscleId,
  selectedId,
  onSelect,
  position,
  rotation,
  scale = [1, 1, 1],
  geometry,
  colorOverride,
}: {
  muscleId: string;
  selectedId: string;
  onSelect: (id: string) => void;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  geometry: React.ReactNode;
  colorOverride?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const isSelected = selectedId === muscleId;
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (isSelected && meshRef.current) {
      const pulse = Math.sin(state.clock.getElapsedTime() * 5) * 0.35 + 1.15;
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = pulse;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation || [0, 0, 0]}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(muscleId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {geometry}
      <meshStandardMaterial
        color={isSelected ? '#E50914' : hovered ? '#FF333D' : colorOverride || '#1B1B24'}
        emissive={isSelected ? '#E50914' : hovered ? '#FF222A' : '#000000'}
        emissiveIntensity={isSelected ? 1.2 : hovered ? 0.4 : 0}
        metalness={0.75}
        roughness={0.25}
      />
    </mesh>
  );
}

// Complete 3D Human Anatomy Mannequin
function AnatomyMannequin({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const baseGray = '#16161E';

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Head & Neck */}
      <mesh position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={baseGray} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.38, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.22, 16]} />
        <meshStandardMaterial color={baseGray} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 2. Traps (Upper Back & Neck) */}
      <MusclePartMesh
        muscleId="traps"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0, 1.24, -0.1]}
        scale={[1.1, 0.8, 1]}
        geometry={<boxGeometry args={[0.55, 0.24, 0.2]} />}
      />

      {/* 3. Shoulders (Deltoids: Front, Side, Rear) */}
      {/* Left Front Delt */}
      <MusclePartMesh
        muscleId="front-delts"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.56, 1.08, 0.12]}
        geometry={<sphereGeometry args={[0.16, 24, 24]} />}
      />
      {/* Right Front Delt */}
      <MusclePartMesh
        muscleId="front-delts"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.56, 1.08, 0.12]}
        geometry={<sphereGeometry args={[0.16, 24, 24]} />}
      />
      {/* Left Side Delt */}
      <MusclePartMesh
        muscleId="side-delts"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.68, 1.05, 0]}
        geometry={<sphereGeometry args={[0.17, 24, 24]} />}
      />
      {/* Right Side Delt */}
      <MusclePartMesh
        muscleId="side-delts"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.68, 1.05, 0]}
        geometry={<sphereGeometry args={[0.17, 24, 24]} />}
      />
      {/* Left Rear Delt */}
      <MusclePartMesh
        muscleId="rear-delts"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.56, 1.08, -0.12]}
        geometry={<sphereGeometry args={[0.16, 24, 24]} />}
      />
      {/* Right Rear Delt */}
      <MusclePartMesh
        muscleId="rear-delts"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.56, 1.08, -0.12]}
        geometry={<sphereGeometry args={[0.16, 24, 24]} />}
      />

      {/* 4. Upper Chest (Clavicular Head) */}
      <MusclePartMesh
        muscleId="upper-chest"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.2, 0.98, 0.16]}
        rotation={[0, 0, 0.15]}
        geometry={<boxGeometry args={[0.3, 0.14, 0.16]} />}
      />
      <MusclePartMesh
        muscleId="upper-chest"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.2, 0.98, 0.16]}
        rotation={[0, 0, -0.15]}
        geometry={<boxGeometry args={[0.3, 0.14, 0.16]} />}
      />

      {/* 5. Middle Chest (Sternal Head) */}
      <MusclePartMesh
        muscleId="mid-chest"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.22, 0.82, 0.18]}
        geometry={<boxGeometry args={[0.34, 0.16, 0.17]} />}
      />
      <MusclePartMesh
        muscleId="mid-chest"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.22, 0.82, 0.18]}
        geometry={<boxGeometry args={[0.34, 0.16, 0.17]} />}
      />

      {/* 6. Lower Chest (Abdominal Head) — USER REQUEST */}
      <MusclePartMesh
        muscleId="lower-chest"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.2, 0.67, 0.17]}
        rotation={[0, 0, -0.1]}
        geometry={<boxGeometry args={[0.32, 0.12, 0.16]} />}
      />
      <MusclePartMesh
        muscleId="lower-chest"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.2, 0.67, 0.17]}
        rotation={[0, 0, 0.1]}
        geometry={<boxGeometry args={[0.32, 0.12, 0.16]} />}
      />

      {/* 7. Lats (Latissimus Dorsi - V-Taper Wings) */}
      <MusclePartMesh
        muscleId="lats"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.38, 0.74, -0.12]}
        rotation={[0, 0, 0.2]}
        geometry={<boxGeometry args={[0.26, 0.42, 0.18]} />}
      />
      <MusclePartMesh
        muscleId="lats"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.38, 0.74, -0.12]}
        rotation={[0, 0, -0.2]}
        geometry={<boxGeometry args={[0.26, 0.42, 0.18]} />}
      />

      {/* 8. Lower Back (Erector Spinae) */}
      <MusclePartMesh
        muscleId="lower-back"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0, 0.32, -0.14]}
        geometry={<boxGeometry args={[0.36, 0.36, 0.16]} />}
      />

      {/* 9. Abs (Rectus Abdominis 6-Pack) */}
      <MusclePartMesh
        muscleId="abs"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0, 0.35, 0.15]}
        geometry={<boxGeometry args={[0.3, 0.45, 0.14]} />}
      />

      {/* 10. Obliques (Side Core & Serratus) */}
      <MusclePartMesh
        muscleId="obliques"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.34, 0.35, 0.08]}
        rotation={[0, 0, 0.15]}
        geometry={<boxGeometry args={[0.16, 0.38, 0.16]} />}
      />
      <MusclePartMesh
        muscleId="obliques"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.34, 0.35, 0.08]}
        rotation={[0, 0, -0.15]}
        geometry={<boxGeometry args={[0.16, 0.38, 0.16]} />}
      />

      {/* 11. Arms — Biceps (Front) & Triceps (Back) */}
      {/* Left Bicep */}
      <MusclePartMesh
        muscleId="biceps"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.72, 0.68, 0.08]}
        geometry={<capsuleGeometry args={[0.11, 0.28, 16, 16]} />}
      />
      {/* Right Bicep */}
      <MusclePartMesh
        muscleId="biceps"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.72, 0.68, 0.08]}
        geometry={<capsuleGeometry args={[0.11, 0.28, 16, 16]} />}
      />
      {/* Left Tricep */}
      <MusclePartMesh
        muscleId="triceps"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.72, 0.68, -0.08]}
        geometry={<capsuleGeometry args={[0.12, 0.28, 16, 16]} />}
      />
      {/* Right Tricep */}
      <MusclePartMesh
        muscleId="triceps"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.72, 0.68, -0.08]}
        geometry={<capsuleGeometry args={[0.12, 0.28, 16, 16]} />}
      />

      {/* 12. Forearms */}
      <MusclePartMesh
        muscleId="forearms"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.85, 0.16, 0]}
        rotation={[0, 0, 0.08]}
        geometry={<cylinderGeometry args={[0.08, 0.06, 0.44, 16]} />}
      />
      <MusclePartMesh
        muscleId="forearms"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.85, 0.16, 0]}
        rotation={[0, 0, -0.08]}
        geometry={<cylinderGeometry args={[0.08, 0.06, 0.44, 16]} />}
      />

      {/* 13. Glutes (Gluteus Maximus) — USER REQUEST */}
      <MusclePartMesh
        muscleId="glutes"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.2, -0.06, -0.15]}
        geometry={<sphereGeometry args={[0.22, 24, 24]} />}
      />
      <MusclePartMesh
        muscleId="glutes"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.2, -0.06, -0.15]}
        geometry={<sphereGeometry args={[0.22, 24, 24]} />}
      />

      {/* Pelvis Front */}
      <mesh position={[0, -0.04, 0.08]}>
        <boxGeometry args={[0.42, 0.2, 0.22]} />
        <meshStandardMaterial color={baseGray} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 14. Quads (Front Thighs) */}
      <MusclePartMesh
        muscleId="quads"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.22, -0.65, 0.12]}
        geometry={<capsuleGeometry args={[0.16, 0.52, 16, 16]} />}
      />
      <MusclePartMesh
        muscleId="quads"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.22, -0.65, 0.12]}
        geometry={<capsuleGeometry args={[0.16, 0.52, 16, 16]} />}
      />

      {/* 15. Hamstrings (Back Thighs) */}
      <MusclePartMesh
        muscleId="hamstrings"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.22, -0.65, -0.12]}
        geometry={<capsuleGeometry args={[0.16, 0.52, 16, 16]} />}
      />
      <MusclePartMesh
        muscleId="hamstrings"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.22, -0.65, -0.12]}
        geometry={<capsuleGeometry args={[0.16, 0.52, 16, 16]} />}
      />

      {/* Knees */}
      <mesh position={[-0.22, -1.02, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={baseGray} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.22, -1.02, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={baseGray} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 16. Calves (Lower Legs) */}
      <MusclePartMesh
        muscleId="calves"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.24, -1.38, -0.04]}
        geometry={<cylinderGeometry args={[0.13, 0.08, 0.54, 16]} />}
      />
      <MusclePartMesh
        muscleId="calves"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.24, -1.38, -0.04]}
        geometry={<cylinderGeometry args={[0.13, 0.08, 0.54, 16]} />}
      />
    </group>
  );
}

// Category tabs
const CATEGORIES = [
  { id: 'all', label: 'ALL MUSCLES' },
  { id: 'chest', label: 'CHEST', subIds: ['upper-chest', 'mid-chest', 'lower-chest'] },
  { id: 'legs', label: 'LEGS & GLUTES', subIds: ['glutes', 'quads', 'hamstrings', 'calves'] },
  { id: 'back', label: 'BACK', subIds: ['lats', 'traps', 'lower-back'] },
  { id: 'arms', label: 'ARMS', subIds: ['biceps', 'triceps', 'forearms'] },
  { id: 'shoulders', label: 'SHOULDERS', subIds: ['front-delts', 'side-delts', 'rear-delts'] },
  { id: 'core', label: 'CORE', subIds: ['abs', 'obliques'] },
];

export const MuscleMapSection: React.FC<MuscleMapSectionProps> = ({ onOpenWorkoutModal }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>('lower-chest');
  const [activeCategory, setActiveCategory] = useState<string>('chest');
  const [isBackView, setIsBackView] = useState<boolean>(false);
  const orbitControlsRef = useRef<any>(null);

  const selectedMuscle = useMemo(() => {
    return MUSCLE_GROUPS.find((m) => m.id === selectedMuscleId) || MUSCLE_GROUPS[0];
  }, [selectedMuscleId]);

  const selectMuscle = (id: string) => {
    setSelectedMuscleId(id);

    // Auto switch front/back orientation hint if muscle is posterior
    const posteriorMuscles = ['glutes', 'hamstrings', 'lats', 'traps', 'lower-back', 'rear-delts', 'triceps'];
    if (posteriorMuscles.includes(id)) {
      setIsBackView(true);
    } else {
      setIsBackView(false);
    }
  };

  const handleResetView = () => {
    setSelectedMuscleId('default');
    setIsBackView(false);
  };

  const handleFlipView = () => {
    setIsBackView(!isBackView);
    setSelectedMuscleId('default');
  };

  return (
    <section
      id="muscle-map"
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-[#060608] text-white border-b border-white/10 overflow-hidden"
    >
      {/* Ambient Lighting Glows */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-red-950/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-[92%] max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Target className="w-3.5 h-3.5 text-red-500" />
            3D INTERACTIVE ANATOMY & BIOMECHANICS
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight mb-4"
          >
            TARGET <span className="text-gradient-red">3D MUSCLE MAP</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 font-light text-sm sm:text-base max-w-2xl mx-auto"
          >
            Click any 3D muscle part to trigger a target zoom animation and view science-backed exercise protocols for every small and big muscle group.
          </motion.p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                if (cat.subIds && cat.subIds.length > 0) {
                  selectMuscle(cat.subIds[0]);
                } else {
                  handleResetView();
                }
              }}
              className={`shrink-0 px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white border-red-500 shadow-[0_0_20px_rgba(229,9,20,0.4)] scale-105'
                  : 'bg-white/5 text-gray-400 hover:text-white border-white/10 hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Specific Muscle Selection Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {MUSCLE_GROUPS.filter((m) => {
            if (activeCategory === 'all') return true;
            const currentCat = CATEGORIES.find((c) => c.id === activeCategory);
            return currentCat?.subIds?.includes(m.id);
          }).map((m) => {
            const isSelected = selectedMuscleId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => selectMuscle(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white border border-red-400 shadow-[0_0_15px_rgba(229,9,20,0.5)] scale-105'
                    : 'bg-[#0E0E14] text-gray-300 hover:text-white border border-white/10 hover:border-red-500/40'
                }`}
              >
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping" />}
                <span>{m.name.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Main Stage: 3D Body Canvas on Left, Exercise Details Terminal on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Interactive 3D Canvas Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-6 relative h-[520px] sm:h-[620px] rounded-3xl glass-panel border border-white/15 overflow-hidden shadow-2xl bg-[#09090E]/90 flex flex-col"
          >
            {/* Top Canvas Controls Bar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-mono text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>INTERACTIVE 3D • DRAG TO ROTATE</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleFlipView}
                  className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono text-gray-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Flip Anterior / Posterior View"
                >
                  <Eye className="w-3.5 h-3.5 text-red-500" />
                  <span>{isBackView ? 'FRONT VIEW' : 'BACK VIEW'}</span>
                </button>

                <button
                  onClick={handleResetView}
                  className="p-2 rounded-xl bg-black/60 hover:bg-white/10 backdrop-blur-md border border-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  title="Reset Zoom & Camera"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Three.js 3D Viewport */}
            <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
              <Canvas>
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 10, 5]} intensity={1.5} />
                <directionalLight position={[-5, 5, -5]} intensity={1.0} color="#ff3333" />
                <pointLight position={[0, 0, 3]} intensity={1.2} color="#ffffff" />
                <pointLight position={[0, 0, -3]} intensity={1.0} color="#e50914" />

                <PerspectiveCamera makeDefault position={[0, 0, 4.2]} fov={45} />

                <OrbitControls
                  ref={orbitControlsRef}
                  enableZoom={true}
                  minDistance={1.4}
                  maxDistance={6.0}
                  enablePan={true}
                  dampingFactor={0.05}
                />

                <CameraController
                  selectedId={selectedMuscleId}
                  isBackView={isBackView}
                  manualControlsRef={orbitControlsRef}
                />

                <AnatomyMannequin
                  selectedId={selectedMuscleId}
                  onSelect={(id) => selectMuscle(id)}
                />
              </Canvas>
            </div>

            {/* Bottom 3D Helper Badge */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <span className="text-[10px] font-mono text-gray-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                CLICK BODY PART TO ZOOM
              </span>
              <span className="text-[10px] font-mono font-bold text-red-400 bg-red-600/10 px-2.5 py-1 rounded-lg border border-red-500/30">
                ACTIVE: {selectedMuscle.name.split('(')[0].trim()}
              </span>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Exercise & Hypertrophy Protocols Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-6 flex flex-col justify-between glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative bg-[#0C0C12]/90 backdrop-blur-xl"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMuscle.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Muscle Badge & Name */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest mb-1">
                      <Activity className="w-3.5 h-3.5 animate-pulse" />
                      <span>TARGET BIOMECHANICS IDENTIFIER</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
                      {selectedMuscle.name}
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-950 border border-red-500/40 text-white flex items-center justify-center shadow-lg shadow-red-600/30 shrink-0">
                    <Dumbbell className="w-6 h-6 text-red-200" />
                  </div>
                </div>

                {/* Description & Science */}
                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                  {selectedMuscle.description}
                </p>

                {/* Biomechanics Focus Card */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">
                      BIOMECHANICAL CUE & PATH
                    </span>
                    <span className="text-xs font-mono text-gray-200 font-medium">
                      {selectedMuscle.biomechanics}
                    </span>
                  </div>
                </div>

                {/* 4 Recommended Exercises List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">
                      OPTIMAL HYPERTROPHY MOVEMENTS (4 EXERCISES)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      ✓ PEAK RECRUITMENT
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedMuscle.recommendedExercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/40 hover:bg-white/[0.08] transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-mono text-xs font-bold">
                            0{idx + 1}
                          </div>
                          <div>
                            <strong className="block text-xs sm:text-sm font-heading font-extrabold text-white group-hover:text-red-400 transition-colors">
                              {ex.name}
                            </strong>
                            <span className="text-[11px] font-mono text-gray-400">
                              Target: <span className="text-gray-200">{ex.target}</span>
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold text-red-400 bg-red-600/10 px-2.5 py-1 rounded-full border border-red-500/20 shrink-0">
                          {ex.sets}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Action Bottom Bar */}
            <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onOpenWorkoutModal(selectedMuscle)}
                className="w-full sm:flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-heading font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(229,9,20,0.4)] border border-red-400/40 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <span>OPEN FULL PROTOCOL</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/919014404462?text=${encodeURIComponent(
                  `Hi Shreyas! I'm interested in training protocols for ${selectedMuscle.name}. Can you recommend personal training at SHREX CLUB?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 font-heading font-extrabold text-xs uppercase tracking-widest border border-emerald-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                title="Ask Shreyas on WhatsApp"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>ASK SHREYAS</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
