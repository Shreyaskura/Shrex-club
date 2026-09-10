import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, Activity, Users, Calendar, Sparkles, ChevronDown } from 'lucide-react';

interface TrainingHeroProps {
  onBackToClub: () => void;
  onJumpToSection: (id: string) => void;
}

export const TrainingHero: React.FC<TrainingHeroProps> = ({ onBackToClub, onJumpToSection }) => {
  const quickLinks = [
    { label: 'Protocols', icon: Flame, id: 'programs' },
    { label: '3D Muscle Map', icon: Activity, id: 'muscle-map' },
    { label: 'Class Schedule', icon: Calendar, id: 'schedule' },
    { label: 'Elite Coaches', icon: Users, id: 'trainers' },
  ];

  return (
    <section className="relative w-full pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-hidden bg-[#060608] border-b border-white/10">
      {/* Ambient Cyber Red Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-[92%] max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Top Breadcrumb & Return Action */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={onBackToClub}
            data-cursor="CLUB"
            className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-red-500 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Club Sanctuary</span>
          </button>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-red-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>DEDICATED TRAINING SUITE</span>
          </div>
        </div>

        {/* Main Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight text-white mb-6 leading-none max-w-5xl"
        >
          ENGINEERED <span className="text-gradient-red">ATHLETIC</span> PROTOCOLS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed mb-10"
        >
          Explore dedicated strength and hypertrophy programs, interactive 3D anatomical muscle mapping, live group classes, and elite 1-on-1 coaching.
        </motion.p>

        {/* Quick Jump Sub-Navigation Pills */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-2 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl mb-12"
        >
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onJumpToSection(item.id)}
                data-cursor="SELECT"
                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/40 text-gray-300 hover:text-white transition-all text-xs font-mono font-bold uppercase tracking-wider"
              >
                <Icon className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                <span>{item.label}</span>
                <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-red-400 transition-colors" />
              </button>
            );
          })}
        </motion.div>

        {/* Training Metrics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl"
        >
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col items-center">
            <span className="font-heading font-black text-2xl sm:text-3xl text-gradient-red">6 PROTOCOLS</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-1">Hypertrophy & Strength</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col items-center">
            <span className="font-heading font-black text-2xl sm:text-3xl text-white">3D ANATOMY</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-1">Biomechanical Targeting</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col items-center">
            <span className="font-heading font-black text-2xl sm:text-3xl text-gradient-red">14+ CLASSES</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-1">Weekly Live Roster</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col items-center">
            <span className="font-heading font-black text-2xl sm:text-3xl text-white">ELITE COACHES</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-1">Certified Masters</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
