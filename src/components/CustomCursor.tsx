import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on fine-pointer devices (desktops/laptops with mouse)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const interactiveEl = target?.closest('[data-cursor], button, a, input, select');
      
      if (interactiveEl) {
        setIsHovered(true);
        const customText = interactiveEl.getAttribute('data-cursor');
        if (customText) {
          setCursorText(customText);
        } else {
          setCursorText('');
        }
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Ultra-Fast Central Pointer Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_10px_#E50914] pointer-events-none"
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          scale: isHovered ? 0.5 : 1,
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 1000, mass: 0.02 }}
      />

      {/* Responsive Snapping Outer Ring */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full flex items-center justify-center border transition-colors duration-200 pointer-events-none ${
          isHovered
            ? 'border-red-500/90 bg-red-600/15 backdrop-blur-[2px]'
            : 'border-white/30 bg-transparent'
        }`}
        animate={{
          x: mousePosition.x - (isHovered ? 32 : 18),
          y: mousePosition.y - (isHovered ? 32 : 18),
          width: isHovered ? 64 : 36,
          height: isHovered ? 64 : 36,
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 550, mass: 0.05 }}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] font-extrabold uppercase font-mono tracking-widest text-white text-center px-1 pointer-events-none"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </div>
  );
};
