import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Target, Dumbbell, Zap, ChevronRight, Activity, RotateCcw, Eye, ZoomIn, ZoomOut, MessageSquare } from 'lucide-react';
import { MUSCLE_GROUPS, MuscleInfo } from '../data/gymData';

interface MuscleMapSectionProps {
  onOpenWorkoutModal: (muscle: MuscleInfo) => void;
}

// Comfortable, balanced camera zoom targets (NOT macro extreme zoom)
const CAMERA_ZOOM_TARGETS: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  // Front Upper Torso (Upper, Mid, Lower Chest)
  'upper-chest': { pos: [0, 0.7, 3.2], target: [0, 0.65, 0] },
  'mid-chest': { pos: [0, 0.55, 3.2], target: [0, 0.55, 0] },
  'lower-chest': { pos: [0, 0.45, 3.2], target: [0, 0.45, 0] },
  // Core
  'abs': { pos: [0, 0.15, 3.2], target: [0, 0.15, 0] },
  'obliques': { pos: [0.25, 0.15, 3.2], target: [0.2, 0.15, 0] },
  // Shoulders & Arms
  'front-delts': { pos: [-0.45, 0.75, 3.0], target: [-0.4, 0.7, 0] },
  'side-delts': { pos: [-0.65, 0.75, 3.0], target: [-0.6, 0.7, 0] },
  'biceps': { pos: [-0.65, 0.45, 3.0], target: [-0.6, 0.4, 0] },
  'forearms': { pos: [-0.75, 0.05, 3.0], target: [-0.7, 0.0, 0] },
  // Legs Front
  'quads': { pos: [0, -0.65, 3.3], target: [0, -0.65, 0] },
  'calves': { pos: [0, -1.25, 3.1], target: [0, -1.25, 0] },
  // Posterior / Back Muscles
  'glutes': { pos: [0, -0.15, -3.2], target: [0, -0.15, 0] },
  'hamstrings': { pos: [0, -0.65, -3.3], target: [0, -0.65, 0] },
  'lats': { pos: [0, 0.55, -3.3], target: [0, 0.55, 0] },
  'traps': { pos: [0, 0.9, -3.2], target: [0, 0.85, 0] },
  'lower-back': { pos: [0, 0.15, -3.2], target: [0, 0.15, 0] },
  'rear-delts': { pos: [-0.5, 0.75, -3.0], target: [-0.45, 0.7, 0] },
  'triceps': { pos: [-0.65, 0.45, -3.0], target: [-0.6, 0.4, 0] },
  // Default Full Body View (comfortable distance with full headroom & leg room)
  'default': { pos: [0, -0.05, 4.6], target: [0, -0.1, 0] },
};

// Smooth Camera Controller
function CameraController({
  selectedId,
  isZoomed,
  isBackView,
  manualControlsRef,
}: {
  selectedId: string;
  isZoomed: boolean;
  isBackView: boolean;
  manualControlsRef: React.RefObject<any>;
}) {
  useFrame((state, delta) => {
    // If not zoomed in, stay in full body overview
    let config = isZoomed
      ? CAMERA_ZOOM_TARGETS[selectedId] || CAMERA_ZOOM_TARGETS['default']
      : CAMERA_ZOOM_TARGETS['default'];

    let targetPos = new THREE.Vector3(...config.pos);
    let lookTarget = new THREE.Vector3(...config.target);

    // If back view and full body, flip to rear
    if (isBackView && !isZoomed) {
      targetPos.set(0, -0.05, -4.6);
    }

    state.camera.position.lerp(targetPos, delta * 3.2);

    if (manualControlsRef.current) {
      manualControlsRef.current.target.lerp(lookTarget, delta * 3.2);
      manualControlsRef.current.update();
    }
  });

  return null;
}

// Individual Anatomical Muscle Component with high-contrast metallic shader
function AnatomicalMuscle({
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
    if (isSelected && meshRef.current) {
      const pulse = Math.sin(state.clock.getElapsedTime() * 4.5) * 0.4 + 1.4;
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
        color={isSelected ? '#FF1122' : hovered ? '#FF4455' : '#4E5568'}
        emissive={isSelected ? '#FF1122' : hovered ? '#FF2233' : '#000000'}
        emissiveIntensity={isSelected ? 1.5 : hovered ? 0.5 : 0}
        metalness={0.7}
        roughness={0.3}
      />
    </mesh>
  );
}

// Realistic Sculpted Human Athletic Figure
function SculptedHumanModel({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  // Neutral high-contrast slate for non-muscle joints and structure
  const structureColor = '#3A4050';

  return (
    <group position={[0, 0, 0]}>
      {/* ===== 1. HEAD, JAW & NECK ===== */}
      <mesh position={[0, 1.46, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color={structureColor} metalness={0.75} roughness={0.3} />
      </mesh>
      {/* Jawline definition */}
      <mesh position={[0, 1.34, 0.05]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[0.13, 0.15, 16]} />
        <meshStandardMaterial color={structureColor} metalness={0.75} roughness={0.3} />
      </mesh>
      {/* Neck & Sternocleidomastoid */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.18, 16]} />
        <meshStandardMaterial color={structureColor} metalness={0.75} roughness={0.3} />
      </mesh>

      {/* ===== 2. TRAPEZIUS (Neck to Upper Back Mantle) ===== */}
      <AnatomicalMuscle
        muscleId="traps"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0, 1.14, -0.08]}
        rotation={[-0.1, 0, 0]}
        scale={[1.3, 0.9, 0.8]}
        geometry={<boxGeometry args={[0.48, 0.22, 0.18]} />}
      />

      {/* ===== 3. SHOULDERS (DELTOIDS: Front, Side, Rear) ===== */}
      {/* Left Front Delt (Anterior) */}
      <AnatomicalMuscle
        muscleId="front-delts"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.52, 0.98, 0.12]}
        geometry={<sphereGeometry args={[0.15, 24, 24]} />}
      />
      {/* Right Front Delt (Anterior) */}
      <AnatomicalMuscle
        muscleId="front-delts"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.52, 0.98, 0.12]}
        geometry={<sphereGeometry args={[0.15, 24, 24]} />}
      />
      {/* Left Side Delt (Lateral - 3D Cap) */}
      <AnatomicalMuscle
        muscleId="side-delts"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.64, 0.96, 0]}
        scale={[0.9, 1.2, 1]}
        geometry={<sphereGeometry args={[0.16, 24, 24]} />}
      />
      {/* Right Side Delt (Lateral - 3D Cap) */}
      <AnatomicalMuscle
        muscleId="side-delts"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.64, 0.96, 0]}
        scale={[0.9, 1.2, 1]}
        geometry={<sphereGeometry args={[0.16, 24, 24]} />}
      />
      {/* Left Rear Delt (Posterior) */}
      <AnatomicalMuscle
        muscleId="rear-delts"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.52, 0.98, -0.12]}
        geometry={<sphereGeometry args={[0.15, 24, 24]} />}
      />
      {/* Right Rear Delt (Posterior) */}
      <AnatomicalMuscle
        muscleId="rear-delts"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.52, 0.98, -0.12]}
        geometry={<sphereGeometry args={[0.15, 24, 24]} />}
      />

      {/* ===== 4. UPPER CHEST (Clavicular Head) ===== */}
      <AnatomicalMuscle
        muscleId="upper-chest"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.19, 0.9, 0.15]}
        rotation={[0.1, 0, 0.18]}
        scale={[1.4, 0.7, 0.9]}
        geometry={<boxGeometry args={[0.25, 0.16, 0.16]} />}
      />
      <AnatomicalMuscle
        muscleId="upper-chest"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.19, 0.9, 0.15]}
        rotation={[0.1, 0, -0.18]}
        scale={[1.4, 0.7, 0.9]}
        geometry={<boxGeometry args={[0.25, 0.16, 0.16]} />}
      />

      {/* ===== 5. MIDDLE CHEST (Sternal Head) ===== */}
      <AnatomicalMuscle
        muscleId="mid-chest"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.2, 0.75, 0.16]}
        scale={[1.3, 0.9, 1]}
        geometry={<boxGeometry args={[0.28, 0.18, 0.16]} />}
      />
      <AnatomicalMuscle
        muscleId="mid-chest"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.2, 0.75, 0.16]}
        scale={[1.3, 0.9, 1]}
        geometry={<boxGeometry args={[0.28, 0.18, 0.16]} />}
      />

      {/* ===== 6. LOWER CHEST (Abdominal Head) — USER FOCUS ===== */}
      <AnatomicalMuscle
        muscleId="lower-chest"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.18, 0.62, 0.14]}
        rotation={[-0.05, 0, -0.12]}
        scale={[1.4, 0.6, 0.9]}
        geometry={<boxGeometry args={[0.26, 0.13, 0.15]} />}
      />
      <AnatomicalMuscle
        muscleId="lower-chest"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.18, 0.62, 0.14]}
        rotation={[-0.05, 0, 0.12]}
        scale={[1.4, 0.6, 0.9]}
        geometry={<boxGeometry args={[0.26, 0.13, 0.15]} />}
      />

      {/* ===== 7. LATS (Latissimus Dorsi - V-Taper Wings) ===== */}
      <AnatomicalMuscle
        muscleId="lats"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.35, 0.66, -0.1]}
        rotation={[0, 0, 0.22]}
        scale={[1.1, 1.6, 1]}
        geometry={<boxGeometry args={[0.24, 0.35, 0.18]} />}
      />
      <AnatomicalMuscle
        muscleId="lats"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.35, 0.66, -0.1]}
        rotation={[0, 0, -0.22]}
        scale={[1.1, 1.6, 1]}
        geometry={<boxGeometry args={[0.24, 0.35, 0.18]} />}
      />

      {/* ===== 8. LOWER BACK (Erector Spinae) ===== */}
      <AnatomicalMuscle
        muscleId="lower-back"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.09, 0.28, -0.12]}
        geometry={<cylinderGeometry args={[0.07, 0.08, 0.36, 16]} />}
      />
      <AnatomicalMuscle
        muscleId="lower-back"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.09, 0.28, -0.12]}
        geometry={<cylinderGeometry args={[0.07, 0.08, 0.36, 16]} />}
      />

      {/* ===== 9. ABDOMINALS (Rectus Abdominis - 6-Pack) ===== */}
      {/* Upper Abs */}
      <AnatomicalMuscle
        muscleId="abs"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.08, 0.46, 0.13]}
        geometry={<boxGeometry args={[0.13, 0.11, 0.12]} />}
      />
      <AnatomicalMuscle
        muscleId="abs"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.08, 0.46, 0.13]}
        geometry={<boxGeometry args={[0.13, 0.11, 0.12]} />}
      />
      {/* Mid Abs */}
      <AnatomicalMuscle
        muscleId="abs"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.08, 0.32, 0.12]}
        geometry={<boxGeometry args={[0.13, 0.11, 0.12]} />}
      />
      <AnatomicalMuscle
        muscleId="abs"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.08, 0.32, 0.12]}
        geometry={<boxGeometry args={[0.13, 0.11, 0.12]} />}
      />
      {/* Lower Abs */}
      <AnatomicalMuscle
        muscleId="abs"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.08, 0.18, 0.11]}
        geometry={<boxGeometry args={[0.13, 0.11, 0.12]} />}
      />
      <AnatomicalMuscle
        muscleId="abs"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.08, 0.18, 0.11]}
        geometry={<boxGeometry args={[0.13, 0.11, 0.12]} />}
      />

      {/* ===== 10. OBLIQUES (Flanks & Serratus) ===== */}
      <AnatomicalMuscle
        muscleId="obliques"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.28, 0.32, 0.05]}
        rotation={[0, 0, 0.14]}
        scale={[1, 1.4, 1]}
        geometry={<boxGeometry args={[0.15, 0.32, 0.16]} />}
      />
      <AnatomicalMuscle
        muscleId="obliques"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.28, 0.32, 0.05]}
        rotation={[0, 0, -0.14]}
        scale={[1, 1.4, 1]}
        geometry={<boxGeometry args={[0.15, 0.32, 0.16]} />}
      />

      {/* ===== 11. ARMS: BICEPS & TRICEPS ===== */}
      {/* Left Bicep (Anterior Peak) */}
      <AnatomicalMuscle
        muscleId="biceps"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.66, 0.62, 0.07]}
        scale={[1, 1.3, 1]}
        geometry={<sphereGeometry args={[0.11, 20, 20]} />}
      />
      {/* Right Bicep (Anterior Peak) */}
      <AnatomicalMuscle
        muscleId="biceps"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.66, 0.62, 0.07]}
        scale={[1, 1.3, 1]}
        geometry={<sphereGeometry args={[0.11, 20, 20]} />}
      />
      {/* Left Tricep (Posterior Horseshoe) */}
      <AnatomicalMuscle
        muscleId="triceps"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.66, 0.62, -0.07]}
        scale={[1.1, 1.4, 1]}
        geometry={<sphereGeometry args={[0.12, 20, 20]} />}
      />
      {/* Right Tricep (Posterior Horseshoe) */}
      <AnatomicalMuscle
        muscleId="triceps"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.66, 0.62, -0.07]}
        scale={[1.1, 1.4, 1]}
        geometry={<sphereGeometry args={[0.12, 20, 20]} />}
      />

      {/* ===== 12. FOREARMS (Brachioradialis Taper) ===== */}
      <AnatomicalMuscle
        muscleId="forearms"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.78, 0.14, 0]}
        rotation={[0, 0, 0.08]}
        geometry={<cylinderGeometry args={[0.08, 0.05, 0.44, 16]} />}
      />
      <AnatomicalMuscle
        muscleId="forearms"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.78, 0.14, 0]}
        rotation={[0, 0, -0.08]}
        geometry={<cylinderGeometry args={[0.08, 0.05, 0.44, 16]} />}
      />

      {/* ===== 13. GLUTES (Gluteus Maximus & Medius) — USER FOCUS ===== */}
      <AnatomicalMuscle
        muscleId="glutes"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.18, -0.08, -0.14]}
        scale={[1.2, 1.1, 1.2]}
        geometry={<sphereGeometry args={[0.22, 24, 24]} />}
      />
      <AnatomicalMuscle
        muscleId="glutes"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.18, -0.08, -0.14]}
        scale={[1.2, 1.1, 1.2]}
        geometry={<sphereGeometry args={[0.22, 24, 24]} />}
      />

      {/* Pelvis Front Base */}
      <mesh position={[0, -0.06, 0.06]}>
        <boxGeometry args={[0.38, 0.18, 0.2]} />
        <meshStandardMaterial color={structureColor} metalness={0.75} roughness={0.3} />
      </mesh>

      {/* ===== 14. QUADS (Front Thigh Sweep) ===== */}
      <AnatomicalMuscle
        muscleId="quads"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.2, -0.62, 0.1]}
        scale={[1.1, 1.5, 1]}
        geometry={<cylinderGeometry args={[0.15, 0.11, 0.54, 20]} />}
      />
      <AnatomicalMuscle
        muscleId="quads"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.2, -0.62, 0.1]}
        scale={[1.1, 1.5, 1]}
        geometry={<cylinderGeometry args={[0.15, 0.11, 0.54, 20]} />}
      />

      {/* ===== 15. HAMSTRINGS (Rear Thigh Columns) ===== */}
      <AnatomicalMuscle
        muscleId="hamstrings"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.2, -0.62, -0.1]}
        scale={[1.1, 1.5, 1]}
        geometry={<cylinderGeometry args={[0.14, 0.11, 0.54, 20]} />}
      />
      <AnatomicalMuscle
        muscleId="hamstrings"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.2, -0.62, -0.1]}
        scale={[1.1, 1.5, 1]}
        geometry={<cylinderGeometry args={[0.14, 0.11, 0.54, 20]} />}
      />

      {/* Knee Joints */}
      <mesh position={[-0.2, -0.98, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={structureColor} metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0.2, -0.98, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={structureColor} metalness={0.8} roughness={0.25} />
      </mesh>

      {/* ===== 16. CALVES (Diamond Gastrocnemius Heads) ===== */}
      <AnatomicalMuscle
        muscleId="calves"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[-0.22, -1.34, -0.04]}
        scale={[1.2, 1.4, 1.2]}
        geometry={<sphereGeometry args={[0.12, 20, 20]} />}
      />
      <AnatomicalMuscle
        muscleId="calves"
        selectedId={selectedId}
        onSelect={onSelect}
        position={[0.22, -1.34, -0.04]}
        scale={[1.2, 1.4, 1.2]}
        geometry={<sphereGeometry args={[0.12, 20, 20]} />}
      />
      {/* Lower Shin / Achilles */}
      <mesh position={[-0.22, -1.52, 0]}>
        <cylinderGeometry args={[0.06, 0.05, 0.25, 16]} />
        <meshStandardMaterial color={structureColor} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.22, -1.52, 0]}>
        <cylinderGeometry args={[0.06, 0.05, 0.25, 16]} />
        <meshStandardMaterial color={structureColor} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Feet & Pedestal Ring */}
      <mesh position={[-0.22, -1.68, 0.05]}>
        <boxGeometry args={[0.12, 0.06, 0.24]} />
        <meshStandardMaterial color={structureColor} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.22, -1.68, 0.05]}>
        <boxGeometry args={[0.12, 0.06, 0.24]} />
        <meshStandardMaterial color={structureColor} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Athletic Telemetry Platform Ring */}
      <mesh position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.85, 32]} />
        <meshStandardMaterial color="#222838" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 0.88, 32]} />
        <meshStandardMaterial color="#E50914" emissive="#E50914" emissiveIntensity={0.6} />
      </mesh>
    </group>
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

  // Start with lower-chest selected for exercises, but isZoomed: false so camera stays comfortably in FULL BODY overview!
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>('lower-chest');
  const [activeCategory, setActiveCategory] = useState<string>('chest');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isBackView, setIsBackView] = useState<boolean>(false);
  const orbitControlsRef = useRef<any>(null);

  const selectedMuscle = useMemo(() => {
    return MUSCLE_GROUPS.find((m) => m.id === selectedMuscleId) || MUSCLE_GROUPS[0];
  }, [selectedMuscleId]);

  const selectMuscle = (id: string) => {
    setSelectedMuscleId(id);
    setIsZoomed(true); // Smoothly focus zoom on clicked muscle

    // Auto switch front/back view if posterior muscle is clicked
    const posteriorMuscles = ['glutes', 'hamstrings', 'lats', 'traps', 'lower-back', 'rear-delts', 'triceps'];
    if (posteriorMuscles.includes(id)) {
      setIsBackView(true);
    } else {
      setIsBackView(false);
    }
  };

  const handleResetFullBody = () => {
    setIsZoomed(false);
    setIsBackView(false);
  };

  const handleToggleBackView = () => {
    setIsBackView(!isBackView);
  };

  return (
    <section
      id="muscle-map"
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-[#060608] text-white border-b border-white/10 overflow-hidden"
    >
      {/* Background Studio Lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-950/20 rounded-full blur-[180px] pointer-events-none" />
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
            Inspect the 3D athletic physique in real time. Click any muscle group — including Lower Chest, Glutes, Quads, Lats, and Arms — to zoom in and see elite workout routines.
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
                  handleResetFullBody();
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

        {/* Main Stage Grid: 3D High-Contrast Canvas on Left, Exercise Panel on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: 3D High-Contrast Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-6 relative h-[540px] sm:h-[640px] rounded-3xl border border-white/20 overflow-hidden shadow-2xl flex flex-col bg-gradient-to-b from-[#141824] via-[#0E111A] to-[#080A10]"
          >
            {/* Top Canvas Controls Bar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[11px] font-mono text-gray-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>3D CONTROLS • DRAG TO ROTATE</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Front / Back Flip Button */}
                <button
                  onClick={handleToggleBackView}
                  className="px-3 py-1.5 rounded-xl bg-black/70 hover:bg-white/15 backdrop-blur-md border border-white/20 text-[11px] font-mono text-gray-100 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Flip Front / Back View"
                >
                  <Eye className="w-3.5 h-3.5 text-red-400" />
                  <span>{isBackView ? 'FRONT VIEW' : 'BACK VIEW'}</span>
                </button>

                {/* Reset Full Body Zoom */}
                <button
                  onClick={handleResetFullBody}
                  className={`px-3 py-1.5 rounded-xl backdrop-blur-md border text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                    !isZoomed
                      ? 'bg-red-600/30 border-red-500/50 text-white'
                      : 'bg-black/70 hover:bg-white/15 border-white/20 text-gray-200'
                  }`}
                  title="Reset to Full Body"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gray-300" />
                  <span>FULL BODY</span>
                </button>
              </div>
            </div>

            {/* Three.js 3D Viewport with High-Contrast Lighting */}
            <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
              <Canvas>
                {/* Bright studio ambient light so model is never too dark */}
                <ambientLight intensity={1.2} color="#E2E8F0" />
                
                {/* Key front light */}
                <directionalLight position={[0, 4, 6]} intensity={2.0} color="#ffffff" />
                
                {/* Back Rim Light — creates glowing silhouette edge to separate body from background! */}
                <directionalLight position={[0, 3, -5]} intensity={3.0} color="#60A5FA" />
                
                {/* Left & Right Accent fill lights */}
                <directionalLight position={[-5, 0, 3]} intensity={1.2} color="#ffffff" />
                <directionalLight position={[5, 0, 3]} intensity={1.2} color="#ffffff" />

                <PerspectiveCamera makeDefault position={[0, -0.05, 4.6]} fov={45} />

                <OrbitControls
                  ref={orbitControlsRef}
                  enableZoom={true}
                  minDistance={2.2}
                  maxDistance={6.5}
                  enablePan={true}
                  dampingFactor={0.06}
                />

                <CameraController
                  selectedId={selectedMuscleId}
                  isZoomed={isZoomed}
                  isBackView={isBackView}
                  manualControlsRef={orbitControlsRef}
                />

                <SculptedHumanModel
                  selectedId={selectedMuscleId}
                  onSelect={(id) => selectMuscle(id)}
                />
              </Canvas>
            </div>

            {/* Bottom 3D Guidance Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <span className="text-[11px] font-mono text-gray-300 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15">
                CLICK ANY MUSCLE TO ZOOM
              </span>
              <span className="text-[11px] font-mono font-bold text-red-400 bg-red-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-red-500/40">
                ACTIVE: {selectedMuscle.name.split('(')[0].trim()}
              </span>
            </div>
          </motion.div>

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
    </section>
  );
};
