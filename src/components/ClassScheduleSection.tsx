import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Calendar, Flame, ChevronRight } from 'lucide-react';
import { CLASS_SCHEDULE, type ClassSession } from '../data/gymData';

interface ClassScheduleSectionProps {
  onJoinClassModal: (session: ClassSession) => void;
}

export const ClassScheduleSection: React.FC<ClassScheduleSectionProps> = ({ onJoinClassModal }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Countdown state for next class (e.g. 24 mins 18 secs)
  const [secondsLeft, setSecondsLeft] = useState(24 * 60 + 18);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 24 * 60 + 18));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return {
      hh: hours < 10 ? `0${hours}` : `${hours}`,
      mm: mins < 10 ? `0${mins}` : `${mins}`,
      ss: secs < 10 ? `0${secs}` : `${secs}`,
    };
  };

  const timerDisplay = formatCountdown(secondsLeft);
  const liveSession = CLASS_SCHEDULE[0];

  return (
    <section
      id="schedule"
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 bg-[#08080C] text-white border-b border-white/10 overflow-hidden"
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
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            REAL-TIME CLUB TELEMETRY
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight mb-4"
          >
            CLASS <span className="text-gradient-red">SCHEDULE</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 font-light text-base sm:text-lg"
          >
            Live session tracking, capacity monitors, and instant spot reservation for high-intensity group classes.
          </motion.p>
        </div>

        {/* Top Hero Banner: LIVE NOW + NEXT CLASS COUNTDOWN */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl mb-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden bg-gradient-to-r from-[#18080C] via-[#0E0B12] to-[#0A0A0F]"
        >
          {/* Ambient Glowing Light */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Left Live Session Details */}
          <div className="flex flex-col items-start z-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <span className="font-mono font-bold text-xs text-red-500 tracking-widest uppercase bg-red-950/60 px-3 py-1 rounded-full border border-red-500/30">
                ● LIVE ON FLOOR NOW
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-white mb-2">
              {liveSession.title}
            </h3>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-300 mb-6">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Clock className="w-4 h-4" />
                {liveSession.time}
              </span>
              <span>•</span>
              <span className="text-gray-300">Trainer: <strong className="text-white">{liveSession.trainer}</strong></span>
              <span>•</span>
              <span className="text-gray-300">Capacity: <strong className="text-emerald-400">{liveSession.capacity}</strong></span>
            </div>

            <button
              onClick={() => onJoinClassModal(liveSession)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-heading font-extrabold text-xs uppercase tracking-widest border border-red-400/40 shadow-lg flex items-center gap-2 transition-transform active:scale-95"
            >
              <span>RESERVE LIVE CLASS SPOT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Live Countdown Dashboard */}
          <div className="z-10 flex flex-col items-center bg-white/[0.03] border border-white/10 p-6 rounded-2xl w-full lg:w-auto">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-3">
              NEXT CLASS STARTS IN
            </span>
            <div className="flex items-center gap-3 font-mono font-black text-3xl sm:text-4xl text-white">
              <div className="bg-black/60 px-3.5 py-2 rounded-xl border border-white/10 text-red-500 shadow-inner">
                {timerDisplay.hh}
              </div>
              <span className="text-red-500 font-normal animate-pulse">:</span>
              <div className="bg-black/60 px-3.5 py-2 rounded-xl border border-white/10 text-red-500 shadow-inner">
                {timerDisplay.mm}
              </div>
              <span className="text-red-500 font-normal animate-pulse">:</span>
              <div className="bg-black/60 px-3.5 py-2 rounded-xl border border-white/10 text-red-500 shadow-inner">
                {timerDisplay.ss}
              </div>
            </div>
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-3">
              HOURS : MINUTES : SECONDS
            </span>
          </div>
        </motion.div>

        {/* Schedule Grid Table */}
        <div className="space-y-4">
          {CLASS_SCHEDULE.map((session, idx) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + idx * 0.08 }}
              className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-red-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-extrabold text-base text-white">
                      {session.title}
                    </h4>
                    {session.isLive && (
                      <span className="text-[9px] font-mono bg-red-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                        LIVE NOW
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-gray-400">
                    Trainer: {session.trainer} • {session.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {session.time}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    Slots: {session.capacity}
                  </span>
                </div>
                <button
                  onClick={() => onJoinClassModal(session)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-red-600 text-white font-mono text-xs font-bold uppercase transition-all"
                >
                  BOOK
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
