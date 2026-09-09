import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { TESTIMONIALS } from '../data/gymData';

export const TestimonialsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const item = TESTIMONIALS[currentIndex];

  return (
    <section
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 bg-[#060608] text-white border-b border-white/10 overflow-hidden"
    >
      <div className="w-[92%] max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Quote className="w-3.5 h-3.5 text-red-500" />
            ATHLETE REVIEWS & VOICES
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black font-heading tracking-tight mb-4"
          >
            MEMBER <span className="text-gradient-red">TESTIMONIALS</span>
          </motion.h2>
        </div>

        {/* Carousel Card Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl relative"
        >
          <Quote className="w-16 h-16 text-red-600/20 absolute top-8 right-8 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-8 z-10 relative">
            {/* Member Photo */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-red-500/40 shadow-xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover filter brightness-90"
                />
              </div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap border border-red-400">
                VERIFIED ATHLETE
              </span>
            </div>

            {/* Testimonial Content */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <p className="text-base sm:text-lg text-gray-200 font-light italic leading-relaxed mb-6">
                "{item.content}"
              </p>

              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                <h3 className="text-xl font-black font-heading tracking-tight text-white">
                  {item.name}
                </h3>
                <span className="hidden md:inline text-gray-600">•</span>
                <span className="text-xs font-mono text-gray-400">{item.role}</span>
              </div>

              {/* Achievement Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-mono font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>{item.achievement}</span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-red-600' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
