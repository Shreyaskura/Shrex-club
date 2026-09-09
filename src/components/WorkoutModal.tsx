import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Clock, Flame, CheckCircle2, ShieldCheck } from 'lucide-react';
import { MuscleInfo } from '../data/gymData';

interface WorkoutModalProps {
  muscle: MuscleInfo | null;
  onClose: () => void;
}

export const WorkoutModal: React.FC<WorkoutModalProps> = ({ muscle, onClose }) => {
  if (!muscle) return null;

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
          className="relative w-full max-w-2xl max-h-[90vh] glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl bg-[#0C0C12] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3.5 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 shadow-lg">
              <Dumbbell className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest block">
                SHREX HYPERTROPHY PROTOCOL
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
                {muscle.name}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 font-light mb-6 leading-relaxed">
            {muscle.description}
          </p>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-6">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
              BIOMECHANICAL FOCUS
            </span>
            <span className="text-xs text-amber-400 font-bold">
              {muscle.biomechanics}
            </span>
          </div>

          {/* Exercises List */}
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-3">
            COMPLETE EXERCISE ROUTINE
          </h3>

          <div className="space-y-3 mb-8">
            {muscle.recommendedExercises.map((ex, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-extrabold text-red-500 bg-red-950/60 w-7 h-7 rounded-lg flex items-center justify-center border border-red-500/30">
                    0{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-white">
                      {ex.name}
                    </h4>
                    <span className="text-[11px] font-mono text-gray-400">
                      Target: {ex.target}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30">
                  {ex.sets}
                </span>
              </div>
            ))}
          </div>

          {/* Warmup & Rest Note */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-gray-300">
            <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
            <span>
              Rest 90–120 seconds between working sets. Execute 2 light warm-up sets prior to working sets.
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
