import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useInView } from 'framer-motion';
import { Cpu, ShieldCheck, Zap, Layers } from 'lucide-react';

// 3D Dumbbell Component rendered in Three.js
function MetallicDumbbellMesh({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Continuous slow 3D rotation + mouse tilt response
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.15;
      
      const targetScale = isHovered ? 1.15 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Central Handle Barbell Rod with knurled metallic finish */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 4.2, 32]} />
        <meshStandardMaterial
          color="#D0D5DD"
          metalness={0.95}
          roughness={0.15}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* Left Plate Stack 1 */}
      <mesh position={[-1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.2, 1.2, 0.45, 32]} />
        <meshStandardMaterial color="#1E1E24" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Left Plate Stack 2 (Outer Heavy Red Trim) */}
      <mesh position={[-1.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.35, 1.35, 0.25, 32]} />
        <meshStandardMaterial color="#E50914" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Left Lock Collar */}
      <mesh position={[-1.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
        <meshStandardMaterial color="#8A99AD" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Right Plate Stack 1 */}
      <mesh position={[1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.2, 1.2, 0.45, 32]} />
        <meshStandardMaterial color="#1E1E24" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Right Plate Stack 2 (Outer Heavy Red Trim) */}
      <mesh position={[1.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.35, 1.35, 0.25, 32]} />
        <meshStandardMaterial color="#E50914" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Right Lock Collar */}
      <mesh position={[1.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
        <meshStandardMaterial color="#8A99AD" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

export const Equipment3DSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);

  const specs = [
    { label: 'WEIGHT', value: '20 KG', detail: 'Precision Calibrated', icon: Cpu, pos: 'top-6 left-4 sm:left-10' },
    { label: 'MATERIAL', value: 'CHROME STEEL', detail: 'Industrial Grade PBR', icon: ShieldCheck, pos: 'top-10 right-4 sm:right-10' },
    { label: 'PERFORMANCE', value: '100% MAXIMUM', detail: 'Velocity Tested', icon: Zap, pos: 'bottom-10 left-4 sm:left-10' },
    { label: 'GRIP TECH', value: 'KNURLED ERGO', detail: 'Diamond Pattern', icon: Layers, pos: 'bottom-6 right-4 sm:right-10' },
  ];

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-[#060608] text-white overflow-hidden border-b border-white/10"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-[92%] max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Text Narrative */}
        <div className="w-full lg:w-1/2 flex flex-col items-start z-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-widest mb-6"
          >
            ● PRECISION ENGINEERING
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight mb-6 leading-tight"
          >
            BUILT FOR <br />
            <span className="text-gradient-red">PERFORMANCE.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-300 font-light leading-relaxed mb-8 max-w-lg"
          >
            "World-class equipment. Professional coaching. A space meticulously engineered to shatter your physical limits."
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-4 w-full max-w-md pt-4 border-t border-white/10"
          >
            <div>
              <span className="block font-mono text-xs text-gray-500 uppercase tracking-widest">
                RIG CAPACITY
              </span>
              <span className="font-heading font-extrabold text-xl text-white">
                50+ TONS STEEL
              </span>
            </div>
            <div>
              <span className="block font-mono text-xs text-gray-500 uppercase tracking-widest">
                TOLERANCE
              </span>
              <span className="font-heading font-extrabold text-xl text-red-500">
                ±0.01% MARGIN
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Interactive 3D Canvas Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full lg:w-1/2 h-[450px] sm:h-[550px] rounded-3xl glass-panel border border-white/10 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing shadow-2xl"
        >
          {/* Three.js Canvas */}
          <Canvas className="w-full h-full">
            <PerspectiveCamera makeDefault position={[0, 0, 6.5]} fov={45} />
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 10]} intensity={2.0} color="#ffffff" />
            <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#E50914" />
            <pointLight position={[0, 5, 0]} intensity={1.0} color="#FFD700" />
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
              <MetallicDumbbellMesh isHovered={isHovered} />
            </Float>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
          </Canvas>

          {/* Floating HUD Specifications */}
          {specs.map((spec, index) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
                className={`absolute ${spec.pos} z-20 pointer-events-none`}
              >
                <div className="glass-panel px-3.5 py-2 rounded-xl border border-white/15 backdrop-blur-xl flex items-center gap-3 shadow-xl hover:border-red-500/50 transition-colors">
                  <div className="p-2 rounded-lg bg-red-600/20 text-red-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                      {spec.label}
                    </span>
                    <span className="font-heading font-extrabold text-xs text-white">
                      {spec.value}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Interactive Hint Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] font-mono tracking-widest text-gray-400 uppercase bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
            ✦ DRAG TO ROTATE 3D EQUIPMENT ✦
          </div>
        </motion.div>
      </div>
    </section>
  );
};
