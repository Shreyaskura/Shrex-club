import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const STORY_STEPS = [
  {
    title: 'THIS IS NOT JUST A GYM.',
    subtitle: 'IT IS AN INCUBATOR FOR ATHLETIC MASTERY.',
    badge: 'MANIFESTO 01',
    bg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=2000'
  },
  {
    title: 'DISCIPLINE.',
    subtitle: 'FORGED THROUGH DAILY UNCOMPROMISING STANDARDS.',
    badge: 'MANIFESTO 02',
    bg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000'
  },
  {
    title: 'CONSISTENCY.',
    subtitle: 'REPETITION IS THE MOTHER OF LEGENDARY RESULTS.',
    badge: 'MANIFESTO 03',
    bg: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=2000'
  },
  {
    title: 'STRENGTH.',
    subtitle: 'MEASURED IN POWER, RESILIENCE, AND UNYIELDING GRIT.',
    badge: 'MANIFESTO 04',
    bg: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=2000'
  },
  {
    title: 'TRANSFORMATION.',
    subtitle: 'REWRITE YOUR LIMITS AND BECOME UNSTOPPABLE.',
    badge: 'MANIFESTO 05',
    bg: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=2000'
  }
];

export const ScrollStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      if (totalHeight <= 0) return;

      if (rect.top >= 0) {
        setActiveStepIndex(0);
      } else if (rect.bottom <= window.innerHeight) {
        setActiveStepIndex(STORY_STEPS.length - 1);
      } else {
        const scrolledPercent = Math.min(1, Math.max(0, -rect.top / totalHeight));
        const step = Math.min(
          Math.floor(scrolledPercent * STORY_STEPS.length),
          STORY_STEPS.length - 1
        );
        setActiveStepIndex(step);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToStep = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const totalHeight = el.offsetHeight - window.innerHeight;
    const targetScrollY = el.offsetTop + (index / (STORY_STEPS.length - 1)) * totalHeight;

    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(targetScrollY, { duration: 0.8 });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
    setActiveStepIndex(index);
  };

  const nextStep = () => {
    if (activeStepIndex < STORY_STEPS.length - 1) {
      goToStep(activeStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (activeStepIndex > 0) {
      goToStep(activeStepIndex - 1);
    }
  };

  const scrollToPrograms = () => {
    const el = document.getElementById('programs');
    if (el) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(el, { offset: -30, duration: 1 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const currentStep = STORY_STEPS[activeStepIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[220vh] bg-[#060608] border-b border-white/10"
    >
      {/* Sticky Fullscreen Canvas Stage */}
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-between overflow-hidden pt-24 pb-8 sm:pt-28 sm:pb-10 select-none">
        
        {/* Layered Background Images for zero-blank crossfade */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {STORY_STEPS.map((step, idx) => (
            <div
              key={step.bg}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                idx === activeStepIndex
                  ? 'opacity-40 scale-100'
                  : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={step.bg}
                alt={step.title}
                className="w-full h-full object-cover filter brightness-50 contrast-125 saturate-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/60 to-[#060608]/90" />
            </div>
          ))}
        </div>

        {/* Ambient Dark Overlay Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none z-0" />

        {/* Top Header Tag */}
        <div className="relative z-10 w-[92%] max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-red-500">
              PHILOSOPHY & CODE OF HONOR
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevStep}
              disabled={activeStepIndex === 0}
              data-cursor="PREV"
              className={`p-2 rounded-full border transition-all ${
                activeStepIndex === 0
                  ? 'border-white/5 text-gray-600 cursor-not-allowed'
                  : 'border-white/15 text-white hover:bg-white/10 hover:border-red-500'
              }`}
              aria-label="Previous story step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextStep}
              disabled={activeStepIndex === STORY_STEPS.length - 1}
              data-cursor="NEXT"
              className={`p-2 rounded-full border transition-all ${
                activeStepIndex === STORY_STEPS.length - 1
                  ? 'border-white/5 text-gray-600 cursor-not-allowed'
                  : 'border-white/15 text-white hover:bg-white/10 hover:border-red-500'
              }`}
              aria-label="Next story step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Typography Reveal */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center my-auto">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentStep.title}
              initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <span className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-red-400 mb-4 bg-red-950/60 px-4 py-1.5 rounded-full border border-red-500/40">
                {currentStep.badge} • STEP 0{activeStepIndex + 1} / 05
              </span>

              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight text-white mb-6 uppercase leading-none metallic-text">
                {currentStep.title.includes('TRANSFORMATION') ? (
                  <span className="text-gradient-red">{currentStep.title}</span>
                ) : (
                  currentStep.title
                )}
              </h2>

              <p className="text-sm sm:text-xl font-light text-gray-300 max-w-2xl tracking-widest uppercase">
                {currentStep.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Step Progress Indicators */}
          <div className="flex items-center gap-3 mt-12 sm:mt-16">
            {STORY_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToStep(idx)}
                data-cursor={`0${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeStepIndex
                    ? 'w-12 bg-red-600 shadow-[0_0_15px_#E50914]'
                    : 'w-3.5 bg-white/25 hover:bg-white/50'
                }`}
                aria-label={`Jump to manifesto step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Hint / Skip link */}
        <div className="relative z-10 w-[92%] max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono tracking-widest text-gray-400 uppercase">
          <span className="hidden sm:inline">SCROLL TO ADVANCE • CLICK INDICATORS TO JUMP</span>
          <button
            onClick={scrollToPrograms}
            data-cursor="SKIP"
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors ml-auto group"
          >
            <span>EXPLORE TRAINING PROGRAMS</span>
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
