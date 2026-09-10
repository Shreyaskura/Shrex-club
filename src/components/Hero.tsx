import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Dumbbell, Shield, Play } from 'lucide-react';

interface HeroProps {
  onJoinClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinClick, onExploreClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Scroll parallax effects
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const yBg = useTransform(scrollY, [0, 600], [0, 150]);
  const scaleBg = useTransform(scrollY, [0, 600], [1, 1.15]);

  // Particle canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 45 floating light particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2,
      alpha: Math.random() * 0.6 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.speedX *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 9, 20, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#E50914';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Parallax mouse tilt
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 30;
    const y = (clientY / innerHeight - 0.5) * 30;
    setMousePos({ x, y });
  };

  const titleWords = ['BUILD', 'YOUR', 'STRONGEST', 'SELF.'];

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#060608]"
    >
      {/* Background Image Container with Scroll Parallax */}
      <motion.div
        style={{ y: yBg, scale: scaleBg }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <motion.div
          animate={{
            x: mousePos.x * -0.5,
            y: mousePos.y * -0.5,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
          className="w-full h-full scale-105 transition-transform duration-1000 ease-out"
        >
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000"
            alt="SHREX CLUB Atmosphere"
            className="w-full h-full object-cover filter brightness-[0.35] contrast-125 saturate-[0.85]"
          />
        </motion.div>

        {/* Dynamic Dark Gradients & Fog */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/50 to-[#060608]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      {/* Floating Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none opacity-80" />

      {/* Hero Central Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center pt-16"
      >
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md mb-6 shadow-xl"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-gray-300 uppercase">
            THE ULTIMATE ATHLETIC SANCTUARY
          </span>
        </motion.div>

        {/* Main Brand Title */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight text-white mb-2 leading-none"
        >
          SHREX <span className="text-gradient-red">CLUB</span>
        </motion.h2>

        {/* Word by Word Title Reveal */}
        <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-5 gap-y-1 mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading text-gray-100 tracking-tight">
          {titleWords.map((word, idx) => (
            <motion.span
              key={idx}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5 + idx * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={word === 'STRONGEST' ? 'text-gradient-red metallic-text' : 'text-white'}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 0.85 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-base sm:text-xl md:text-2xl text-gray-300 font-light max-w-2xl mb-10 tracking-wide leading-relaxed"
        >
          "Train harder. Move stronger. Become unstoppable."
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
        >
          {/* JOIN THE CLUB CTA with Pulse Aura */}
          <div className="relative group w-full sm:w-auto">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500 blur-lg opacity-70 group-hover:opacity-100 animate-pulse transition duration-500" />
            <button
              onClick={onJoinClick}
              data-cursor="JOIN"
              className="relative w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-800 font-heading font-extrabold text-sm sm:text-base uppercase tracking-widest text-white border border-red-400/50 shadow-2xl flex items-center justify-center gap-3 transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <Dumbbell className="w-5 h-5 text-red-200" />
              <span>JOIN THE CLUB</span>
            </button>
          </div>

          {/* EXPLORE TRAINING HUB CTA */}
          <button
            onClick={onExploreClick}
            data-cursor="TRAIN"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.05] hover:bg-red-600/20 border border-white/20 hover:border-red-500/50 backdrop-blur-md font-heading font-bold text-sm sm:text-base uppercase tracking-widest text-gray-200 hover:text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>EXPLORE TRAINING HUB</span>
            <span className="text-red-500 font-mono text-sm">→</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 z-20 flex flex-col items-center gap-2 text-gray-500 cursor-pointer hover:text-white transition-colors"
        onClick={() => {
          const el = document.getElementById('about');
          if (el) {
            if ((window as any).lenis) {
              (window as any).lenis.scrollTo(el, { offset: -40, duration: 1.2 });
            } else {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }}
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase">SCROLL TO DISCOVER</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center"
        >
          <ChevronDown className="w-4 h-4 text-red-500" />
        </motion.div>
      </motion.div>
    </section>
  );
};
