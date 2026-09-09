import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Clock, Flame, CheckCircle2 } from 'lucide-react';
import { PROGRAMS, Program } from '../data/gymData';

interface ProgramsSectionProps {
  onSelectProgram: (program: Program) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ onSelectProgram }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState('ALL');

  return (
    <section
      id="programs"
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 bg-[#08080C] text-white border-b border-white/10"
    >
      {/* Subtle Ambient Red Glow */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-[92%] max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-widest mb-4"
            >
              ● SYSTEM PROTOCOLS
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight"
            >
              TRAINING <span className="text-gradient-red">PROGRAMS</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 font-light max-w-md text-sm sm:text-base leading-relaxed"
          >
            Engineered workouts designed for peak hypertrophy, raw strength, endurance, and athletic longevity.
          </motion.p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((program, idx) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + idx * 0.1 }}
              data-cursor="EXPLORE"
              className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 glass-panel-hover flex flex-col justify-between h-[480px] cursor-pointer"
              onClick={() => onSelectProgram(program)}
            >
              {/* Background Image with Zoom on Hover */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover filter brightness-[0.4] group-hover:brightness-[0.55] group-hover:scale-110 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/60 to-transparent" />
              </div>

              {/* Card Header Tag */}
              <div className="relative z-10 p-6 flex items-center justify-between">
                <span className="font-mono font-black text-2xl text-white/40 group-hover:text-red-500 transition-colors">
                  {program.number}
                </span>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-gray-300">
                  <Flame className="w-3 h-3 text-red-500" />
                  {program.intensity}
                </div>
              </div>

              {/* Card Bottom Body Content */}
              <div className="relative z-10 p-6 flex flex-col justify-end">
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-[0.25em] mb-1">
                  {program.subtitle}
                </span>
                <h3 className="text-2xl font-black font-heading tracking-tight text-white mb-3 group-hover:text-red-400 transition-colors">
                  {program.title}
                </h3>
                <p className="text-xs text-gray-300 font-light line-clamp-2 mb-6 group-hover:text-white transition-colors leading-relaxed">
                  {program.description}
                </p>

                {/* Features Pill Tags */}
                <div className="flex flex-wrap gap-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {program.features.slice(0, 2).map((feat, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-red-950/60 border border-red-500/30 text-red-300 px-2.5 py-1 rounded-md flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-red-500" />
                      {feat}
                    </span>
                  ))}
                </div>

                {/* Card Action Link */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-red-500" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 font-heading font-extrabold text-xs uppercase tracking-widest text-white group-hover:text-red-400 transition-colors">
                    <span>EXPLORE PROTOCOL</span>
                    <div className="p-2 rounded-full bg-white/10 group-hover:bg-red-600 text-white transition-all duration-300 group-hover:translate-x-1">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
