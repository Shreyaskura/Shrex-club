import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ChevronLeft, ChevronRight, Compass, Sparkles } from 'lucide-react';
import { FACILITIES } from '../data/gymData';

export const FacilitiesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const prevFacility = () => {
    setActiveIndex((prev) => (prev === 0 ? FACILITIES.length - 1 : prev - 1));
  };

  const nextFacility = () => {
    setActiveIndex((prev) => (prev === FACILITIES.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation when facilities section is in focus or user presses arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevFacility();
      } else if (e.key === 'ArrowRight') {
        nextFacility();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeFacility = FACILITIES[activeIndex];

  return (
    <section
      id="facilities"
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-[#060608] text-white border-b border-white/10 overflow-hidden select-none"
    >
      {/* Background Ambience Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      <div className="w-[92%] max-w-7xl mx-auto relative z-10">
        {/* Header with Title and Left/Right Cursor Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-widest mb-4">
              <Compass className="w-3.5 h-3.5 text-red-500" />
              IMMERSIVE TRAINING ENVIRONMENTS
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-white">
              WORLD-CLASS <span className="text-gradient-red">ARENAS</span>
            </h2>
          </div>

          {/* Top Controls: Left & Right Buttons + Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="font-mono text-xs font-bold text-red-400 tracking-widest">
                ZONE 0{activeIndex + 1} / 0{FACILITIES.length}
              </span>
              <div className="w-28 bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-red-600 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#E50914]"
                  style={{ width: `${((activeIndex + 1) / FACILITIES.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevFacility}
                data-cursor="PREV"
                aria-label="Previous Facility Arena"
                className="p-3.5 rounded-2xl glass-panel border border-white/15 hover:border-red-500 text-white hover:bg-red-600/20 transition-all duration-200 active:scale-95 shadow-lg group"
              >
                <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={nextFacility}
                data-cursor="NEXT"
                aria-label="Next Facility Arena"
                className="p-3.5 rounded-2xl glass-panel border border-white/15 hover:border-red-500 text-white hover:bg-red-600/20 transition-all duration-200 active:scale-95 shadow-lg group"
              >
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Zone Selector Chips Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {FACILITIES.map((facility, idx) => (
            <button
              key={facility.id}
              onClick={() => setActiveIndex(idx)}
              data-cursor={`ZONE 0${idx + 1}`}
              className={`shrink-0 px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
                idx === activeIndex
                  ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(229,9,20,0.5)] scale-105'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              <span className="text-red-400 font-extrabold">{facility.number}</span>
              <span>{facility.name}</span>
            </button>
          ))}
        </div>

        {/* Interactive Draggable Card Arena Stage */}
        <div className="relative w-full overflow-hidden rounded-3xl">
          {/* Framer Motion Drag Container for Smooth Left/Right Cursor Swiping */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_e, info) => {
              if (info.offset.x < -40 || info.velocity.x < -300) {
                nextFacility();
              } else if (info.offset.x > 40 || info.velocity.x > 300) {
                prevFacility();
              }
            }}
            data-cursor="DRAG"
            className="cursor-grab active:cursor-grabbing w-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFacility.id}
                initial={{ opacity: 0, x: 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl flex flex-col justify-end p-6 sm:p-12 lg:p-16 group"
              >
                {/* Background Image with Parallax & Hover Zoom */}
                <img
                  src={activeFacility.image}
                  alt={activeFacility.name}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.42] contrast-110 group-hover:scale-105 transition-transform duration-1000 ease-out pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

                {/* Left/Right Floating Quick Click Arrows on the sides of the card */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevFacility();
                  }}
                  data-cursor="PREV"
                  aria-label="Previous Arena"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/20 transition-all z-20 backdrop-blur-md opacity-80 hover:opacity-100 shadow-xl"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextFacility();
                  }}
                  data-cursor="NEXT"
                  aria-label="Next Arena"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/20 transition-all z-20 backdrop-blur-md opacity-80 hover:opacity-100 shadow-xl"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Content Overlay */}
                <div className="relative z-10 max-w-3xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono font-black text-2xl sm:text-4xl text-red-500 drop-shadow-[0_0_12px_rgba(229,9,20,0.8)]">
                      ZONE {activeFacility.number}
                    </span>
                    <span className="h-px w-12 bg-red-500/50" />
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-300">
                      SHREX PERFORMANCE SUITE
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-white mb-4 drop-shadow-md">
                    {activeFacility.name}
                  </h3>

                  <p className="text-sm sm:text-lg text-gray-300 font-light mb-8 leading-relaxed max-w-2xl drop-shadow-sm">
                    {activeFacility.description}
                  </p>

                  {/* Specification Badges */}
                  <div className="flex flex-wrap gap-2.5 mb-6">
                    {activeFacility.specs.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 font-mono text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-md"
                      >
                        <ShieldCheck className="w-4 h-4 text-red-400" />
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Drag / Navigation Hint */}
                  <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-gray-400 uppercase pt-2">
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                    <span>DRAG HORIZONTALLY WITH CURSOR OR USE ARROW KEYS</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom Thumbnail Strip for Fast Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-6">
          {FACILITIES.map((facility, idx) => (
            <button
              key={facility.id}
              onClick={() => setActiveIndex(idx)}
              data-cursor={`VIEW 0${idx + 1}`}
              className={`relative h-20 rounded-2xl overflow-hidden border transition-all duration-300 group text-left p-3 flex flex-col justify-end ${
                idx === activeIndex
                  ? 'border-red-500 ring-2 ring-red-500/50 scale-[1.02]'
                  : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={facility.image}
                alt={facility.name}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35] group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="relative z-10">
                <span className="text-[10px] font-mono text-red-400 font-black block">
                  {facility.number}
                </span>
                <span className="text-xs font-heading font-extrabold text-white truncate block">
                  {facility.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
