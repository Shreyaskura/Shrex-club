import React, { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Target, Dumbbell, Zap, ChevronRight, Activity, RotateCcw, Eye, ZoomIn, ZoomOut, Maximize2, Minimize2, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { MUSCLE_GROUPS, MuscleInfo } from '../data/gymData';

interface MuscleMapSectionProps {
  onOpenWorkoutModal: (muscle: MuscleInfo) => void;
}

// Preload the real human body model asset
useGLTF.preload('/geometries/human_body.glb');

// Camera framing configurations — comfortable full-body & upper/lower body framing (NO jarring macro zoom)
const CAMERA_PRESETS: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  // Chest
  'upper-chest': { pos: [0, 0.35, 4.4], target: [0, 0.35, 0] },
  'mid-chest': { pos: [0, 0.3, 4.4], target: [0, 0.3, 0] },
  'lower-chest': { pos: [0, 0.25, 4.4], target: [0, 0.25, 0] },
  // Core
  'abs': { pos: [0, 0.05, 4.4], target: [0, 0.05, 0] },
  'obliques': { pos: [0.2, 0.05, 4.4], target: [0.1, 0.05, 0] },
  // Shoulders & Arms
  'front-delts': { pos: [-0.25, 0.45, 4.4], target: [-0.15, 0.45, 0] },
  'side-delts': { pos: [-0.3, 0.45, 4.4], target: [-0.2, 0.45, 0] },
  'biceps': { pos: [-0.35, 0.3, 4.4], target: [-0.25, 0.3, 0] },
  'forearms': { pos: [-0.4, 0.1, 4.4], target: [-0.3, 0.1, 0] },
  // Legs
  'quads': { pos: [0, -0.35, 4.4], target: [0, -0.35, 0] },
  'calves': { pos: [0, -0.7, 4.4], target: [0, -0.7, 0] },
  // Posterior Muscles (Camera automatically views from the back with negative Z)
  'glutes': { pos: [0, -0.05, -4.4], target: [0, -0.05, 0] },
  'hamstrings': { pos: [0, -0.35, -4.4], target: [0, -0.35, 0] },
  'lats': { pos: [0, 0.3, -4.4], target: [0, 0.3, 0] },
  'traps': { pos: [0, 0.55, -4.4], target: [0, 0.55, 0] },
  'lower-back': { pos: [0, 0.1, -4.4], target: [0, 0.1, 0] },
  'rear-delts': { pos: [-0.25, 0.45, -4.4], target: [-0.15, 0.45, 0] },
  'triceps': { pos: [-0.35, 0.3, -4.4], target: [-0.25, 0.3, 0] },
  // Full Body Default View (comfortable overview showing full head to toe)
  'default': { pos: [0, -0.05, 4.7], target: [0, -0.05, 0] },
};

// Smooth Camera Controller that only animates on user selection, then releases control to user
function CameraRig({
  animTrigger,
  targetConfig,
  orbitControlsRef,
}: {
  animTrigger: number;
  targetConfig: { pos: [number, number, number]; target: [number, number, number] };
  orbitControlsRef: React.RefObject<any>;
}) {
  const isAnimating = useRef(false);
  const targetPos = useRef(new THREE.Vector3(...targetConfig.pos));
  const lookTarget = useRef(new THREE.Vector3(...targetConfig.target));

  useEffect(() => {
    targetPos.current.set(...targetConfig.pos);
    lookTarget.current.set(...targetConfig.target);
    isAnimating.current = true;
  }, [animTrigger, targetConfig]);

  useFrame((state, delta) => {
    if (!isAnimating.current) return;

    state.camera.position.lerp(targetPos.current, delta * 3.2);

    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.lerp(lookTarget.current, delta * 3.2);
      orbitControlsRef.current.update();
    }

    if (state.camera.position.distanceTo(targetPos.current) < 0.04) {
      isAnimating.current = false;
    }
  });

  return null;
}

// Glowing anatomical muscle highlight overlay component
function MuscleHighlightMesh({
  muscleId,
  selectedId,
  onSelect,
  position,
  rotation,
  scale = [1, 1, 1],
  geometry,
}: {
  muscleId: string;
  selectedId: string;
  onSelect: (id: string) => void;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  geometry: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const isSelected = selectedId === muscleId;
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        if (isSelected) {
          const pulse = Math.sin(state.clock.getElapsedTime() * 5.0) * 0.4 + 1.8;
          mat.emissiveIntensity = pulse;
          mat.opacity = 0.88;
        } else if (hovered) {
          mat.emissiveIntensity = 0.8;
          mat.opacity = 0.65;
        } else {
          mat.emissiveIntensity = 0;
          mat.opacity = 0;
        }
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
        color={isSelected ? '#FF1122' : '#FF4455'}
        emissive={isSelected ? '#FF0011' : '#FF3344'}
        emissiveIntensity={isSelected ? 1.8 : 0}
        transparent={true}
        opacity={isSelected ? 0.88 : 0}
        roughness={0.3}
        metalness={0.1}
        depthWrite={false}
      />
    </mesh>
  );
}

// Seamless Real 3D Athletic Human Model with sculpted digital clay aesthetic
function RealAthleticHumanModel({
  selectedMuscleId,
  onSelectMuscle,
}: {
  selectedMuscleId: string;
  onSelectMuscle: (id: string) => void;
}) {
  const { scene } = useGLTF('/geometries/human_body.glb');
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);

  // Apply smooth digital clay sculpture material matching user reference image
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.material = new THREE.MeshStandardMaterial({
          color: '#D2DBE8',
          roughness: 0.44,
          metalness: 0.05,
        });
      }
    });
    return clone;
  }, [scene]);

  // Click on the 3D human body surface directly to detect and select the muscle!
  const handleBodyClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!e.point || !groupRef.current) return;
    const local = groupRef.current.worldToLocal(e.point.clone());
    const { x, y, z } = local;

    // Detect muscle by anatomical coordinate bounds
    if (y > 0.85) {
      onSelectMuscle('traps');
    } else if (y > 0.65 && y <= 0.85) {
      if (z < -0.05) {
        if (Math.abs(x) > 0.25) onSelectMuscle('rear-delts');
        else onSelectMuscle('traps');
      } else {
        if (Math.abs(x) > 0.28) onSelectMuscle('front-delts');
        else onSelectMuscle('upper-chest');
      }
    } else if (y > 0.45 && y <= 0.65) {
      if (z < -0.05) {
        if (Math.abs(x) > 0.3) onSelectMuscle('triceps');
        else onSelectMuscle('lats');
      } else {
        if (Math.abs(x) > 0.3) onSelectMuscle('biceps');
        else if (y > 0.58) onSelectMuscle('mid-chest');
        else onSelectMuscle('lower-chest');
      }
    } else if (y > 0.15 && y <= 0.45) {
      if (z < -0.05) {
        onSelectMuscle('lower-back');
      } else {
        if (Math.abs(x) > 0.18) onSelectMuscle('obliques');
        else onSelectMuscle('abs');
      }
    } else if (y > -0.15 && y <= 0.15) {
      if (z < -0.02) onSelectMuscle('glutes');
      else onSelectMuscle('quads');
    } else if (y > -0.65 && y <= -0.15) {
      if (z < -0.02) onSelectMuscle('hamstrings');
      else onSelectMuscle('quads');
    } else {
      onSelectMuscle('calves');
    }
  };

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      {/* 1. Real Continuous 3D Human Body Sculpt (ZERO Gaps, ZERO Primitive Mannequin Parts!) */}
      <group
        ref={modelRef}
        scale={[2.55, 2.55, 2.55]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={handleBodyClick}
      >
        <primitive object={clonedScene} />
      </group>

      {/* 2. Anatomical Interactive Highlight Glow Layers (Conforming smoothly to the body) */}

      {/* --- UPPER CHEST (Clavicular Head) --- */}
      <MuscleHighlightMesh
        muscleId="upper-chest"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.10, 0.69, 0.14]}
        rotation={[0.1, 0, 0.15]}
        scale={[1.0, 0.45, 0.35]}
        geometry={<sphereGeometry args={[0.11, 24, 24]} />}
      />
      <MuscleHighlightMesh
        muscleId="upper-chest"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.10, 0.69, 0.14]}
        rotation={[0.1, 0, -0.15]}
        scale={[1.0, 0.45, 0.35]}
        geometry={<sphereGeometry args={[0.11, 24, 24]} />}
      />

      {/* --- MID CHEST (Sternal Head) --- */}
      <MuscleHighlightMesh
        muscleId="mid-chest"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.11, 0.61, 0.15]}
        rotation={[0.04, 0, 0]}
        scale={[1.05, 0.5, 0.35]}
        geometry={<sphereGeometry args={[0.12, 24, 24]} />}
      />
      <MuscleHighlightMesh
        muscleId="mid-chest"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.11, 0.61, 0.15]}
        rotation={[0.04, 0, 0]}
        scale={[1.05, 0.5, 0.35]}
        geometry={<sphereGeometry args={[0.12, 24, 24]} />}
      />

      {/* --- LOWER CHEST (Abdominal Head Underline) --- */}
      <MuscleHighlightMesh
        muscleId="lower-chest"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.10, 0.53, 0.15]}
        rotation={[-0.08, 0, -0.1]}
        scale={[1.0, 0.35, 0.3]}
        geometry={<sphereGeometry args={[0.11, 24, 24]} />}
      />
      <MuscleHighlightMesh
        muscleId="lower-chest"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.10, 0.53, 0.15]}
        rotation={[-0.08, 0, 0.1]}
        scale={[1.0, 0.35, 0.3]}
        geometry={<sphereGeometry args={[0.11, 24, 24]} />}
      />

      {/* --- ABDOMINALS (6-Pack Rectus Abdominis) --- */}
      <MuscleHighlightMesh
        muscleId="abs"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0, 0.35, 0.13]}
        scale={[0.85, 1.4, 0.35]}
        geometry={<boxGeometry args={[0.20, 0.26, 0.06]} />}
      />

      {/* --- OBLIQUES (Flank Core) --- */}
      <MuscleHighlightMesh
        muscleId="obliques"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.19, 0.33, 0.07]}
        rotation={[0, 0, 0.12]}
        scale={[0.7, 1.3, 0.6]}
        geometry={<sphereGeometry args={[0.11, 20, 20]} />}
      />
      <MuscleHighlightMesh
        muscleId="obliques"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.19, 0.33, 0.07]}
        rotation={[0, 0, -0.12]}
        scale={[0.7, 1.3, 0.6]}
        geometry={<sphereGeometry args={[0.11, 20, 20]} />}
      />

      {/* --- SHOULDERS: FRONT, SIDE, REAR DELTS --- */}
      <MuscleHighlightMesh
        muscleId="front-delts"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.28, 0.72, 0.08]}
        scale={[0.9, 0.9, 0.7]}
        geometry={<sphereGeometry args={[0.11, 20, 20]} />}
      />
      <MuscleHighlightMesh
        muscleId="front-delts"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.28, 0.72, 0.08]}
        scale={[0.9, 0.9, 0.7]}
        geometry={<sphereGeometry args={[0.11, 20, 20]} />}
      />
      <MuscleHighlightMesh
        muscleId="side-delts"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.32, 0.70, 0.01]}
        scale={[0.9, 1.1, 0.7]}
        geometry={<sphereGeometry args={[0.10, 20, 20]} />}
      />
      <MuscleHighlightMesh
        muscleId="side-delts"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.32, 0.70, 0.01]}
        scale={[0.9, 1.1, 0.7]}
        geometry={<sphereGeometry args={[0.10, 20, 20]} />}
      />
      <MuscleHighlightMesh
        muscleId="rear-delts"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.28, 0.72, -0.07]}
        scale={[0.9, 0.9, 0.7]}
        geometry={<sphereGeometry args={[0.11, 20, 20]} />}
      />
      <MuscleHighlightMesh
        muscleId="rear-delts"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.28, 0.72, -0.07]}
        scale={[0.9, 0.9, 0.7]}
        geometry={<sphereGeometry args={[0.11, 20, 20]} />}
      />

      {/* --- ARMS: BICEPS & TRICEPS --- */}
      <MuscleHighlightMesh
        muscleId="biceps"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.35, 0.52, 0.04]}
        rotation={[0, 0, 0.3]}
        scale={[0.7, 1.2, 0.7]}
        geometry={<sphereGeometry args={[0.08, 18, 18]} />}
      />
      <MuscleHighlightMesh
        muscleId="biceps"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.35, 0.52, 0.04]}
        rotation={[0, 0, -0.3]}
        scale={[0.7, 1.2, 0.7]}
        geometry={<sphereGeometry args={[0.08, 18, 18]} />}
      />
      <MuscleHighlightMesh
        muscleId="triceps"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.35, 0.52, -0.05]}
        rotation={[0, 0, 0.3]}
        scale={[0.8, 1.3, 0.7]}
        geometry={<sphereGeometry args={[0.09, 18, 18]} />}
      />
      <MuscleHighlightMesh
        muscleId="triceps"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.35, 0.52, -0.05]}
        rotation={[0, 0, -0.3]}
        scale={[0.8, 1.3, 0.7]}
        geometry={<sphereGeometry args={[0.09, 18, 18]} />}
      />

      {/* --- FOREARMS --- */}
      <MuscleHighlightMesh
        muscleId="forearms"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.43, 0.28, 0.02]}
        rotation={[0, 0, 0.22]}
        scale={[0.6, 1.3, 0.6]}
        geometry={<sphereGeometry args={[0.07, 16, 16]} />}
      />
      <MuscleHighlightMesh
        muscleId="forearms"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.43, 0.28, 0.02]}
        rotation={[0, 0, -0.22]}
        scale={[0.6, 1.3, 0.6]}
        geometry={<sphereGeometry args={[0.07, 16, 16]} />}
      />

      {/* --- POSTERIOR: TRAPS & LATS & LOWER BACK --- */}
      <MuscleHighlightMesh
        muscleId="traps"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0, 0.78, -0.06]}
        rotation={[-0.08, 0, 0]}
        scale={[1.3, 0.8, 0.5]}
        geometry={<sphereGeometry args={[0.16, 24, 24]} />}
      />
      <MuscleHighlightMesh
        muscleId="lats"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.18, 0.50, -0.07]}
        rotation={[0, 0, 0.18]}
        scale={[0.8, 1.4, 0.5]}
        geometry={<sphereGeometry args={[0.14, 24, 24]} />}
      />
      <MuscleHighlightMesh
        muscleId="lats"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.18, 0.50, -0.07]}
        rotation={[0, 0, -0.18]}
        scale={[0.8, 1.4, 0.5]}
        geometry={<sphereGeometry args={[0.14, 24, 24]} />}
      />
      <MuscleHighlightMesh
        muscleId="lower-back"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0, 0.28, -0.08]}
        scale={[0.9, 1.3, 0.4]}
        geometry={<boxGeometry args={[0.16, 0.22, 0.06]} />}
      />

      {/* --- GLUTES (Gluteus Maximus — Posterior Hips) --- */}
      <MuscleHighlightMesh
        muscleId="glutes"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.12, 0.06, -0.11]}
        scale={[1.05, 1.0, 1.05]}
        geometry={<sphereGeometry args={[0.15, 24, 24]} />}
      />
      <MuscleHighlightMesh
        muscleId="glutes"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.12, 0.06, -0.11]}
        scale={[1.05, 1.0, 1.05]}
        geometry={<sphereGeometry args={[0.15, 24, 24]} />}
      />

      {/* --- QUADS (Front Thighs) --- */}
      <MuscleHighlightMesh
        muscleId="quads"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.14, -0.32, 0.10]}
        scale={[0.9, 1.6, 0.8]}
        geometry={<sphereGeometry args={[0.13, 24, 24]} />}
      />
      <MuscleHighlightMesh
        muscleId="quads"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.14, -0.32, 0.10]}
        scale={[0.9, 1.6, 0.8]}
        geometry={<sphereGeometry args={[0.13, 24, 24]} />}
      />

      {/* --- HAMSTRINGS (Rear Thighs) --- */}
      <MuscleHighlightMesh
        muscleId="hamstrings"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.14, -0.32, -0.08]}
        scale={[0.9, 1.6, 0.8]}
        geometry={<sphereGeometry args={[0.12, 24, 24]} />}
      />
      <MuscleHighlightMesh
        muscleId="hamstrings"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.14, -0.32, -0.08]}
        scale={[0.9, 1.6, 0.8]}
        geometry={<sphereGeometry args={[0.12, 24, 24]} />}
      />

      {/* --- CALVES (Diamond Gastrocnemius Heads) --- */}
      <MuscleHighlightMesh
        muscleId="calves"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[-0.14, -0.74, -0.05]}
        scale={[0.9, 1.4, 0.9]}
        geometry={<sphereGeometry args={[0.10, 20, 20]} />}
      />
      <MuscleHighlightMesh
        muscleId="calves"
        selectedId={selectedMuscleId}
        onSelect={onSelectMuscle}
        position={[0.14, -0.74, -0.05]}
        scale={[0.9, 1.4, 0.9]}
        geometry={<sphereGeometry args={[0.10, 20, 20]} />}
      />
    </group>
  );
}

// Loading fallback spinner for 3D canvas
function CanvasLoader() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#333A48" wireframe />
    </mesh>
  );
}

// Category tabs
const CATEGORIES = [
  { id: 'all', label: 'ALL BODY PARTS' },
  { id: 'chest', label: 'CHEST', subIds: ['upper-chest', 'mid-chest', 'lower-chest'] },
  { id: 'legs', label: 'LEGS & GLUTES', subIds: ['glutes', 'quads', 'hamstrings', 'calves'] },
  { id: 'back', label: 'BACK & TRAPS', subIds: ['lats', 'traps', 'lower-back'] },
  { id: 'arms', label: 'ARMS', subIds: ['biceps', 'triceps', 'forearms'] },
  { id: 'shoulders', label: 'SHOULDERS', subIds: ['front-delts', 'side-delts', 'rear-delts'] },
  { id: 'core', label: 'CORE', subIds: ['abs', 'obliques'] },
];

export const MuscleMapSection: React.FC<MuscleMapSectionProps> = ({ onOpenWorkoutModal }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Initial muscle selected for info display
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>('lower-chest');
  const [activeCategory, setActiveCategory] = useState<string>('chest');

  // Camera animation trigger & state
  const [animTrigger, setAnimTrigger] = useState(0);
  const [isBackView, setIsBackView] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const orbitControlsRef = useRef<any>(null);

  // Default to full body view initially so user sees the complete model immediately
  const [cameraConfig, setCameraConfig] = useState(CAMERA_PRESETS['default']);

  const selectedMuscle = useMemo(() => {
    return MUSCLE_GROUPS.find((m) => m.id === selectedMuscleId) || MUSCLE_GROUPS[0];
  }, [selectedMuscleId]);

  // Handle muscle selection with gentle framing
  const selectMuscle = (id: string) => {
    setSelectedMuscleId(id);

    const posteriorMuscles = ['glutes', 'hamstrings', 'lats', 'traps', 'lower-back', 'rear-delts', 'triceps'];
    const isPosterior = posteriorMuscles.includes(id);
    setIsBackView(isPosterior);

    const preset = CAMERA_PRESETS[id] || CAMERA_PRESETS['default'];
    setCameraConfig(preset);
    setAnimTrigger((prev) => prev + 1);
  };

  // Full body overview
  const handleFullBody = () => {
    setIsBackView(false);
    setCameraConfig(CAMERA_PRESETS['default']);
    setAnimTrigger((prev) => prev + 1);
  };

  // Flip Front / Back
  const handleToggleBackView = () => {
    const nextBack = !isBackView;
    setIsBackView(nextBack);
    setCameraConfig({
      pos: [0, 0.05, nextBack ? -4.4 : 4.4],
      target: [0, 0, 0],
    });
    setAnimTrigger((prev) => prev + 1);
  };

  // Manual zoom in/out steps
  const handleZoomStep = (direction: 'in' | 'out') => {
    if (!orbitControlsRef.current) return;
    const factor = direction === 'in' ? 0.85 : 1.18;
    const camera = orbitControlsRef.current.object;
    if (camera) {
      camera.position.multiplyScalar(factor);
      orbitControlsRef.current.update();
    }
  };

  // Close fullscreen on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Shared 3D Viewport component (used in embedded card and full-screen modal)
  const render3DCanvas = () => (
    <Canvas>
      {/* Studio Lighting Rig matching Blender / ZBrush digital clay render */}
      <ambientLight intensity={1.2} color="#E8F0FE" />
      <directionalLight position={[0, 4, 6]} intensity={2.0} color="#ffffff" />
      {/* Cool Rim / Backlight catching the muscular silhouettes */}
      <directionalLight position={[0, 3, -5]} intensity={3.0} color="#8BB0E0" />
      <directionalLight position={[-4, 1, 2]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[4, 1, 2]} intensity={1.0} color="#ffffff" />

      <PerspectiveCamera makeDefault position={[0, 0.05, 4.4]} fov={45} />

      <OrbitControls
        ref={orbitControlsRef}
        enableZoom={true}
        minDistance={2.0}
        maxDistance={7.0}
        enablePan={true}
        dampingFactor={0.06}
      />

      <CameraRig
        animTrigger={animTrigger}
        targetConfig={cameraConfig}
        orbitControlsRef={orbitControlsRef}
      />

      <Suspense fallback={<CanvasLoader />}>
        <RealAthleticHumanModel
          selectedMuscleId={selectedMuscleId}
          onSelectMuscle={(id) => selectMuscle(id)}
        />
      </Suspense>
    </Canvas>
  );

  return (
    <section
      id="muscle-map"
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-[#060608] text-white border-b border-white/10 overflow-hidden"
    >
      {/* Ambient Atmospheric Backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-950/15 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-[92%] max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/15 border border-red-500/40 text-red-400 font-mono text-xs font-bold uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(229,9,20,0.2)]"
          >
            <Target className="w-3.5 h-3.5 text-red-500" />
            3D HUMAN ANATOMY VISUALIZER
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight mb-4 text-white"
          >
            TARGET <span className="text-gradient-red">3D MUSCLE MAP</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 font-light text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Seamless 3D athletic human sculpture. Rotate 360°, inspect all muscle groups — from Lower Chest to Glutes and Calves — and explore high-performance exercises.
          </motion.p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                if (cat.subIds && cat.subIds.length > 0) {
                  selectMuscle(cat.subIds[0]);
                } else {
                  handleFullBody();
                }
              }}
              className={`shrink-0 px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white border-red-500 shadow-[0_0_20px_rgba(229,9,20,0.5)] scale-105'
                  : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sub-Muscle Selection Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white border border-red-400 shadow-[0_0_15px_rgba(229,9,20,0.6)] scale-105'
                    : 'bg-[#151824] text-gray-200 hover:text-white border border-white/15 hover:border-red-500/50'
                }`}
              >
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping" />}
                <span>{m.name.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Main Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: 3D Stage Card */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-[540px] sm:h-[620px] rounded-3xl border border-white/20 overflow-hidden shadow-2xl flex flex-col bg-gradient-to-b from-[#0F121C] via-[#0A0C13] to-[#040508]"
            >
              {/* Top Controls Bar */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[11px] font-mono text-gray-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>3D ORBIT • TOUCH / DRAG</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Front / Back Flip Button */}
                  <button
                    onClick={handleToggleBackView}
                    className="px-3 py-1.5 rounded-xl bg-black/70 hover:bg-white/15 backdrop-blur-md border border-white/20 text-[11px] font-mono text-gray-100 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Flip Front / Back View"
                  >
                    <Eye className="w-3.5 h-3.5 text-red-400" />
                    <span>{isBackView ? 'FRONT' : 'BACK'}</span>
                  </button>

                  {/* Zoom Controls */}
                  <button
                    onClick={() => handleZoomStep('in')}
                    className="p-2 rounded-xl bg-black/70 hover:bg-white/15 backdrop-blur-md border border-white/20 text-gray-200 hover:text-white transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleZoomStep('out')}
                    className="p-2 rounded-xl bg-black/70 hover:bg-white/15 backdrop-blur-md border border-white/20 text-gray-200 hover:text-white transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>

                  {/* Reset Full Body */}
                  <button
                    onClick={handleFullBody}
                    className="p-2 rounded-xl bg-black/70 hover:bg-white/15 backdrop-blur-md border border-white/20 text-gray-200 hover:text-white transition-colors cursor-pointer"
                    title="Full Body View"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>

              {/* 3D Canvas Viewport */}
              <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                {render3DCanvas()}
              </div>

              {/* Bottom Info Banner */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                <span className="text-[11px] font-mono text-gray-300 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15">
                  TAP BODY PART TO FOCUS
                </span>
                <span className="text-[11px] font-mono font-bold text-red-400 bg-red-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-red-500/40">
                  {selectedMuscle.name.split('(')[0].trim()}
                </span>
              </div>
            </motion.div>

            {/* FULL SCREEN MODE BUTTON (BELOW THE 3D MODEL — AS REQUESTED) */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="w-full py-3.5 rounded-2xl bg-[#0E121E] hover:bg-[#161C30] border border-white/20 hover:border-red-500/50 text-white font-heading font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer group"
            >
              <Maximize2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
              <span>ENTER FULL SCREEN 3D MODE</span>
            </button>
          </div>

          {/* Right Column: Dynamic Exercise & Hypertrophy Protocols Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-6 flex flex-col justify-between glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative bg-[#0C0C12]/95 backdrop-blur-xl"
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
                {/* Muscle Badge & Title */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest mb-1">
                      <Activity className="w-3.5 h-3.5 animate-pulse" />
                      <span>TARGET BIOMECHANICS & PROTOCOL</span>
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
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
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

                {/* 4 Recommended Exercises */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300">
                      OPTIMAL EXERCISE MOVEMENTS (4 EXERCISES)
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

            {/* Bottom Actions */}
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

      {/* ===== IMMERSIVE FULL SCREEN 3D LABORATORY MODAL ===== */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] bg-[#05060A] flex flex-col justify-between"
          >
            {/* Fullscreen Header Controls */}
            <div className="p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/60 to-transparent border-b border-white/10 flex items-center justify-between z-30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base sm:text-lg text-white flex items-center gap-2">
                    <span>3D ANATOMY LABORATORY</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">
                    FULL SCREEN INTERACTIVE MODE • ESC TO EXIT
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleBackView}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-red-400" />
                  <span>{isBackView ? 'FRONT VIEW' : 'BACK VIEW'}</span>
                </button>

                <button
                  onClick={handleFullBody}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-gray-300" />
                  <span className="hidden sm:inline">RESET</span>
                </button>

                <button
                  onClick={() => handleZoomStep('in')}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleZoomStep('out')}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>EXIT</span>
                </button>
              </div>
            </div>

            {/* Fullscreen 3D Viewport */}
            <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing">
              {render3DCanvas()}
            </div>

            {/* Fullscreen Bottom Drawer: Muscle Info Card */}
            <div className="p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent border-t border-white/10 z-30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-red-600 text-white shadow-lg">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-red-400 font-bold uppercase block">
                    ACTIVE SELECTION
                  </span>
                  <h4 className="text-lg sm:text-xl font-heading font-black text-white">
                    {selectedMuscle.name}
                  </h4>
                </div>
              </div>

              {/* Quick Exercise Chips in Fullscreen */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-xl scrollbar-none py-1">
                {selectedMuscle.recommendedExercises.slice(0, 3).map((ex, idx) => (
                  <span
                    key={idx}
                    className="shrink-0 px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-[11px] font-mono text-gray-200"
                  >
                    {ex.name}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsFullscreen(false);
                  onOpenWorkoutModal(selectedMuscle);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-heading font-bold text-xs uppercase tracking-widest transition-transform active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(229,9,20,0.5)]"
              >
                OPEN WORKOUT PROTOCOL
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
