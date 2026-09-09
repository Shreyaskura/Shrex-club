import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { TRAINERS, type Trainer } from '../data/gymData';

interface TrainerSectionProps {
  onSelectTrainer: (trainer: Trainer) => void;
}

export const TrainerSection: React.FC<TrainerSectionProps> = ({ onSelectTrainer }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="trainers"
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 bg-[#08080C] text-white border-b border-white/10 overflow-hidden"
    >
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
              ● MASTER COACHING STAFF
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight"
            >
              ELITE <span className="text-gradient-red">TRAINERS</span>
            </motion.h2>
          </div>

          {/* Slider Arrow Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/50 text-gray-300 hover:text-white transition-all active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/50 text-gray-300 hover:text-white transition-all active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Slider Grid Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-none scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TRAINERS.map((trainer, idx) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + idx * 0.15 }}
              data-cursor="VIEW"
              className="snap-start shrink-0 w-[300px] sm:w-[350px] group relative rounded-3xl overflow-hidden glass-panel border border-white/10 glass-panel-hover flex flex-col justify-end h-[500px] cursor-pointer"
              onClick={() => onSelectTrainer(trainer)}
            >
              {/* Background Trainer Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover filter brightness-[0.5] group-hover:brightness-[0.7] group-hover:scale-110 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/40 to-transparent" />
              </div>

              {/* Experience Badge Header */}
              <div className="absolute top-5 left-5 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-amber-400">
                  <Award className="w-3 h-3 text-amber-400" />
                  {trainer.experience}
                </span>
              </div>

              {/* Card Footer Content */}
              <div className="relative z-10 p-6 flex flex-col justify-end">
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-[0.2em] mb-1">
                  {trainer.role}
                </span>

                <h3 className="text-2xl font-black font-heading tracking-tight text-white mb-3 group-hover:text-red-400 transition-colors">
                  {trainer.name}
                </h3>

                {/* Specialties Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {trainer.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-mono bg-white/10 backdrop-blur-md text-gray-200 px-2.5 py-0.5 rounded-md"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* View Profile Action */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">
                    VIEW PROFILE
                  </span>
                  <div className="p-2 rounded-full bg-white/10 group-hover:bg-red-600 text-white transition-all duration-300">
                    <ExternalLink className="w-4 h-4" />
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
