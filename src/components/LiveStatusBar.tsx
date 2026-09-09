import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Calendar, Award, Activity } from 'lucide-react';

export const LiveStatusBar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const [members, setMembers] = useState(0);
  const [classes, setClasses] = useState(0);
  const [trainers, setTrainers] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    // Counter animation logic
    const duration = 1500;
    const steps = 40;
    const intervalTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setMembers(Math.floor(progress * 128));
      setClasses(Math.floor(progress * 12));
      setTrainers(Math.floor(progress * 8));

      if (step >= steps) {
        setMembers(128);
        setClasses(12);
        setTrainers(8);
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <section ref={ref} className="relative z-30 w-full py-8 bg-[#08080C] border-y border-white/10">
      <div className="w-[92%] max-w-7xl mx-auto">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border border-white/10">
          {/* Subtle Ambient Red Light Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Live Badge & Title */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="font-mono font-bold text-xs sm:text-sm text-emerald-400 tracking-wider">
                OPEN NOW
              </span>
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-xs font-mono tracking-widest text-gray-400 uppercase">
                LIVE CLUB METRICS
              </span>
              <span className="font-heading font-extrabold text-sm text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                Pragathi Nagar Headquarters
              </span>
            </div>
          </div>

          {/* Center / Right Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:w-auto">
            {/* Stat Item 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-red-500/30 transition-colors"
            >
              <div className="p-3 rounded-lg bg-red-600/10 border border-red-500/20 text-red-500">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {members < 10 ? `0${members}` : members}
                </span>
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                  Members Training Now
                </span>
              </div>
            </motion.div>

            {/* Stat Item 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-red-500/30 transition-colors"
            >
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {classes < 10 ? `0${classes}` : classes}
                </span>
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                  Classes Scheduled Today
                </span>
              </div>
            </motion.div>

            {/* Stat Item 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-red-500/30 transition-colors"
            >
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {trainers < 10 ? `0${trainers}` : trainers}
                </span>
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                  Master Trainers On Floor
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
