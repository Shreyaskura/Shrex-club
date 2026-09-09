import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Target, Dumbbell, Zap, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { MUSCLE_GROUPS, MuscleInfo } from '../data/gymData';

interface MuscleMapSectionProps {
  onOpenWorkoutModal: (muscle: MuscleInfo) => void;
}

export const MuscleMapSection: React.FC<MuscleMapSectionProps> = ({ onOpenWorkoutModal }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>('chest');

  const selectedMuscle = MUSCLE_GROUPS.find((m) => m.id === selectedMuscleId) || MUSCLE_GROUPS[0];

  const targetPoints = [
    { id: 'shoulders', label: 'SHOULDERS', top: '24%', left: '32%', mobileTop: '22%', mobileLeft: '30%' },
    { id: 'chest', label: 'CHEST', top: '28%', left: '50%', mobileTop: '27%', mobileLeft: '50%' },
    { id: 'arms', label: 'ARMS', top: '35%', left: '26%', mobileTop: '34%', mobileLeft: '24%' },
    { id: 'core', label: 'CORE', top: '42%', left: '50%', mobileTop: '42%', mobileLeft: '50%' },
    { id: 'back', label: 'BACK', top: '32%', left: '72%', mobileTop: '31%', mobileLeft: '76%' },
    { id: 'legs', label: 'LEGS', top: '65%', left: '44%', mobileTop: '66%', mobileLeft: '44%' },
  ];

  return (
    <section
      id="muscle-map"
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 bg-[#060608] text-white border-b border-white/10 overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="w-[92%] max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Target className="w-3.5 h-3.5 text-red-500" />
            INTERACTIVE BIOMECHANICS VISUALIZER
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight mb-4"
          >
            TARGET <span className="text-gradient-red">MUSCLE MAP</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 font-light text-base sm:text-lg"
          >
            Select any muscle group on the athletic mannequin to explore optimal exercise targeting and hypertrophy mechanics.
          </motion.p>
        </div>

        {/* Main Stage Grid: SVG Body on Left, Info Panel on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Interactive Body Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-6 relative h-[520px] sm:h-[600px] rounded-3xl glass-panel border border-white/10 p-6 flex items-center justify-center overflow-hidden shadow-2xl"
          >
            {/* Athletic Silhouetted Mannequin Graphic */}
            <div className="relative w-full h-full max-w-xs mx-auto flex items-center justify-center">
              <svg
                viewBox="0 0 300 600"
                className="w-full h-full filter drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              >
                <defs>
                  <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1C1C24" />
                    <stop offset="100%" stopColor="#0B0B0E" />
                  </linearGradient>
                  <filter id="glowRed">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Head */}
                <ellipse cx="150" cy="65" rx="28" ry="36" fill="url(#bodyGrad)" stroke="#333344" strokeWidth="2" />

                {/* Torso & Shoulders */}
                <path
                  d="M 90 120 L 210 120 L 195 270 L 105 270 Z"
                  fill="url(#bodyGrad)"
                  stroke={['chest', 'core', 'shoulders'].includes(selectedMuscleId) ? '#E50914' : '#333344'}
                  strokeWidth="2.5"
                  filter={['chest', 'core', 'shoulders'].includes(selectedMuscleId) ? 'url(#glowRed)' : undefined}
                />

                {/* Left Arm */}
                <path
                  d="M 85 125 L 50 250 L 68 255 L 95 145 Z"
                  fill="url(#bodyGrad)"
                  stroke={selectedMuscleId === 'arms' ? '#E50914' : '#333344'}
                  strokeWidth="2"
                  filter={selectedMuscleId === 'arms' ? 'url(#glowRed)' : undefined}
                />

                {/* Right Arm */}
                <path
                  d="M 215 125 L 250 250 L 232 255 L 205 145 Z"
                  fill="url(#bodyGrad)"
                  stroke={selectedMuscleId === 'arms' ? '#E50914' : '#333344'}
                  strokeWidth="2"
                  filter={selectedMuscleId === 'arms' ? 'url(#glowRed)' : undefined}
                />

                {/* Legs Left & Right */}
                <path
                  d="M 105 275 L 140 520 L 110 520 L 95 275 Z"
                  fill="url(#bodyGrad)"
                  stroke={selectedMuscleId === 'legs' ? '#E50914' : '#333344'}
                  strokeWidth="2"
                  filter={selectedMuscleId === 'legs' ? 'url(#glowRed)' : undefined}
                />
                <path
                  d="M 195 275 L 160 520 L 190 520 L 205 275 Z"
                  fill="url(#bodyGrad)"
                  stroke={selectedMuscleId === 'legs' ? '#E50914' : '#333344'}
                  strokeWidth="2"
                  filter={selectedMuscleId === 'legs' ? 'url(#glowRed)' : undefined}
                />
              </svg>

              {/* Clickable Muscle Target Points */}
              {targetPoints.map((pt) => {
                const isSelected = selectedMuscleId === pt.id;
                return (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedMuscleId(pt.id)}
                    style={{ top: pt.top, left: pt.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group flex items-center gap-2 z-20 focus:outline-none transition-transform active:scale-90`}
                  >
                    <span className="relative flex h-5 w-5 items-center justify-center">
                      {isSelected && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-3.5 w-3.5 border transition-all ${
                          isSelected
                            ? 'bg-red-600 border-white shadow-[0_0_15px_#E50914]'
                            : 'bg-gray-800 border-gray-500 group-hover:border-red-400 group-hover:bg-red-950'
                        }`}
                      />
                    </span>
                    <span
                      className={`text-[10px] font-mono font-extrabold tracking-widest px-2 py-0.5 rounded-md backdrop-blur-md border transition-all ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-400 shadow-lg'
                          : 'bg-black/70 text-gray-400 border-white/10 group-hover:text-white group-hover:border-white/30'
                      }`}
                    >
                      {pt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Dynamic Workout Details Panel */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMuscle.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative"
              >
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-red-600/10 border border-red-500/30 text-red-500">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">
                        SELECTED MUSCLE GROUP
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
                        {selectedMuscle.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-300 font-light mb-4 leading-relaxed">
                  {selectedMuscle.description}
                </p>

                <div className="mb-6 bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    BIOMECHANICAL FOCUS
                  </span>
                  <span className="text-xs text-white font-medium flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    {selectedMuscle.biomechanics}
                  </span>
                </div>

                {/* Recommended Exercises Breakdown */}
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-3">
                  RECOMMENDED HIGH-IMPACT EXERCISES
                </h4>

                <div className="space-y-3 mb-8">
                  {selectedMuscle.recommendedExercises.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-red-500/30 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                        <div>
                          <span className="font-heading font-extrabold text-sm text-white block">
                            {ex.name}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono">
                            {ex.target}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-500/30">
                        {ex.sets}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => onOpenWorkoutModal(selectedMuscle)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 font-heading font-extrabold text-xs sm:text-sm uppercase tracking-widest text-white shadow-[0_0_20px_rgba(229,9,20,0.4)] border border-red-400/40 flex items-center justify-center gap-2 transition-transform active:scale-98"
                >
                  <span>VIEW FULL WORKOUT ROUTINE</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
