import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, CheckCircle2, Calendar } from 'lucide-react';
import type { Trainer } from '../data/gymData';

interface TrainerModalProps {
  trainer: Trainer | null;
  onClose: () => void;
  onBookSession: (trainerName: string) => void;
}

export const TrainerModal: React.FC<TrainerModalProps> = ({ trainer, onClose, onBookSession }) => {
  if (!trainer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl bg-[#0C0C12] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-red-500/40 shrink-0 shadow-xl">
              <img
                src={trainer.image}
                alt={trainer.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center sm:text-left">
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase mb-1">
                <Award className="w-3 h-3 text-amber-400" />
                {trainer.experience}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
                {trainer.name}
              </h2>
              <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider block mb-2">
                {trainer.role}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-6">
            {trainer.bio}
          </p>

          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-3">
            SPECIALTIES & CERTIFICATIONS
          </h3>

          <div className="flex flex-wrap gap-2 mb-8">
            {trainer.specialties.map((spec, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 font-mono text-xs font-bold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                {spec}
              </span>
            ))}
          </div>

          {/* Action CTA */}
          <button
            onClick={() => {
              onClose();
              onBookSession(trainer.name);
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-heading font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(229,9,20,0.4)] border border-red-400/40 flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <Calendar className="w-4 h-4" />
            <span>BOOK 1-ON-1 SESSION WITH {trainer.name.split(' ')[0]}</span>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
