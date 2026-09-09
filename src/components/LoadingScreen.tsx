import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            setTimeout(onComplete, 800);
          }, 300);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060608] text-white overflow-hidden select-none"
        >
          {/* Subtle glowing radial background */}
          <div className="absolute w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

          {/* Grid lines texture overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
            {/* Emblem / Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-red-600 to-red-950 p-[1px] shadow-2xl shadow-red-600/30"
            >
              <div className="w-full h-full bg-[#0D0D12] rounded-[15px] flex items-center justify-center border border-white/10">
                <span className="font-heading font-extrabold text-2xl text-gradient-red tracking-wider">S</span>
              </div>
            </motion.div>

            {/* Brand Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold font-heading tracking-widest text-white mb-2"
            >
              SHREX <span className="text-gradient-red">CLUB</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.7 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-400 font-medium mb-12"
            >
              INITIALIZING PERFORMANCE system...
            </motion.p>

            {/* Progress Bar Container */}
            <div className="w-full max-w-xs bg-white/5 border border-white/10 p-1 rounded-full backdrop-blur-md mb-4 shadow-inner">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 shadow-[0_0_15px_rgba(229,9,20,0.8)]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Percentage Indicator */}
            <div className="flex items-center justify-between w-full max-w-xs text-xs font-mono text-gray-400 font-semibold px-1">
              <span className="animate-pulse text-red-500 font-bold">● SYSTEM BOOT</span>
              <span className="text-white font-extrabold text-sm">{progress}%</span>
            </div>
          </div>

          {/* Bottom subtle copyright watermark */}
          <div className="absolute bottom-6 text-[10px] tracking-[0.25em] text-gray-600 uppercase font-mono">
            HYDERABAD • EST 2026 • LUXURY FITNESS CLUB
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
