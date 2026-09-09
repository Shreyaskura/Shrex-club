import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, ShieldCheck, Quote, Sliders } from 'lucide-react';
import { TRANSFORMATIONS } from '../data/gymData';

export const TransformationsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeTransIndex, setActiveTransIndex] = useState(0);

  const activeTrans = TRANSFORMATIONS[activeTransIndex];

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <section
      id="transformations"
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 bg-[#060608] text-white border-b border-white/10 overflow-hidden"
    >
      <div className="w-[92%] max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-widest mb-4"
          >
            <TrendingUp className="w-3.5 h-3.5 text-red-500" />
            PROVEN ATHLETIC PROGRESS
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight mb-4"
          >
            MEMBER <span className="text-gradient-red">TRANSFORMATIONS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 font-light text-base sm:text-lg"
          >
            Real results rooted in scientific strength protocols, metabolic adaptation, and unwavering consistency.
          </motion.p>
        </div>

        {/* Main Interactive Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Interactive Draggable Image Comparison Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7 relative h-[420px] sm:h-[500px] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl select-none cursor-ew-resize"
            onMouseMove={handleSliderMove}
            onTouchMove={handleSliderMove}
          >
            {/* After Image (Full Base) */}
            <img
              src={activeTrans.afterImg}
              alt="After Transformation"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.8]"
            />
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-red-600/80 backdrop-blur-md text-[10px] font-mono font-bold tracking-widest text-white uppercase border border-red-400">
              AFTER PHASE
            </div>

            {/* Before Image (Clipped Overlay) */}
            <div
              className="absolute inset-0 z-10 overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <img
                src={activeTrans.beforeImg}
                alt="Before Transformation"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] grayscale-[40%]"
              />
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold tracking-widest text-gray-300 uppercase border border-white/10">
                BEFORE PHASE
              </div>
            </div>

            {/* Draggable Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_15px_#ffffff]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white shadow-2xl">
                <Sliders className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Slider Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-[10px] font-mono tracking-widest text-gray-300 uppercase bg-black/70 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              ◄ DRAG SLIDER TO COMPARE ►
            </div>
          </motion.div>

          {/* Right Side: Performance Metrics & Testimonial Excerpt */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-widest mb-3">
                {activeTrans.duration}
              </span>

              <h3 className="text-3xl font-black font-heading tracking-tight text-white mb-2">
                {activeTrans.name}
              </h3>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-6">
                PROGRAM: {activeTrans.program}
              </p>

              {/* Performance Growth Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    STRENGTH GAIN ↑
                  </span>
                  <span className="font-heading font-extrabold text-xl text-emerald-400">
                    {activeTrans.metrics.strength}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    ENDURANCE VO2 ↑
                  </span>
                  <span className="font-heading font-extrabold text-xl text-blue-400">
                    {activeTrans.metrics.endurance}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    CONSISTENCY RATE
                  </span>
                  <span className="font-heading font-extrabold text-xl text-amber-400">
                    {activeTrans.metrics.consistency}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                    BODY COMPOSITION
                  </span>
                  <span className="font-heading font-extrabold text-xl text-red-500">
                    {activeTrans.metrics.bodyFatChange}
                  </span>
                </div>
              </div>

              {/* Quote Card */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 mb-6 relative">
                <Quote className="w-6 h-6 text-red-500/40 absolute top-4 right-4" />
                <p className="text-xs sm:text-sm text-gray-300 font-light italic leading-relaxed">
                  "{activeTrans.quote}"
                </p>
              </div>
            </div>

            {/* Selector Tabs for Multiple Transformations */}
            <div className="flex items-center gap-3">
              {TRANSFORMATIONS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTransIndex(idx);
                    setSliderPosition(50);
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                    idx === activeTransIndex
                      ? 'bg-red-600 text-white border border-red-500 shadow-[0_0_15px_#E50914]'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  STORY 0{idx + 1}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
