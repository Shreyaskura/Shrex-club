import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Zap, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { MEMBERSHIPS, MembershipPlan } from '../data/gymData';

interface MembershipSectionProps {
  onSelectPlan: (plan: MembershipPlan) => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({ onSelectPlan }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section
      id="membership"
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 bg-[#08080C] text-white border-b border-white/10 overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="w-[92%] max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Zap className="w-3.5 h-3.5 text-red-500" />
            UNCOMPROMISING VALUE TIERING
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight mb-4"
          >
            CLUB <span className="text-gradient-red">MEMBERSHIPS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 font-light text-base sm:text-lg mb-8"
          >
            Select the membership tier tailored to your athletic ambitions. No hidden fees. Cancel or adjust anytime.
          </motion.p>

          {/* Monthly / Annual Toggle Switch */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-3 p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md"
          >
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                !isAnnual
                  ? 'bg-red-600 text-white shadow-[0_0_15px_#E50914]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              MONTHLY PASS
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                isAnnual
                  ? 'bg-red-600 text-white shadow-[0_0_15px_#E50914]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>ANNUAL PASS</span>
              <span className="text-[9px] bg-amber-400 text-black px-2 py-0.5 rounded-full font-extrabold">
                SAVE 20%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Membership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {MEMBERSHIPS.map((plan, idx) => {
            const isHighlighted = plan.highlighted;

            // Calculate annual price discount display
            const rawPriceNumber = parseInt(plan.price.replace(/[^0-9]/g, ''), 10);
            const displayPrice = isAnnual
              ? `₹${Math.floor(rawPriceNumber * 0.8).toLocaleString()}`
              : plan.price;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + idx * 0.15 }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-500 ${
                  isHighlighted
                    ? 'bg-gradient-to-b from-[#180C10] via-[#0E0B10] to-[#0A0A0F] border-2 border-red-500 shadow-[0_0_40px_rgba(229,9,20,0.35)] md:-translate-y-4 scale-102 z-20'
                    : 'glass-panel border border-white/10 hover:border-white/20 glass-panel-hover z-10'
                }`}
              >
                {/* Highlight Badge */}
                {isHighlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white font-mono text-[10px] font-extrabold uppercase tracking-widest shadow-lg flex items-center gap-1.5 border border-amber-300/40">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Plan Name */}
                  <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.25em] block mb-2">
                    {plan.name} TIER
                  </span>

                  {/* Price Display */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-white">
                      {displayPrice}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{plan.billingPeriod}</span>
                  </div>

                  <p className="text-xs text-gray-300 font-light leading-relaxed mb-6 border-b border-white/10 pb-6">
                    {plan.description}
                  </p>

                  {/* Features Checklist */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs text-gray-200">
                        <div
                          className={`p-1 rounded-full shrink-0 mt-0.5 ${
                            isHighlighted
                              ? 'bg-red-600/30 text-red-400 border border-red-500/40'
                              : 'bg-white/10 text-gray-300'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action CTA Button */}
                <button
                  onClick={() => onSelectPlan(plan)}
                  data-cursor="JOIN"
                  className={`w-full py-4 rounded-2xl font-heading font-extrabold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isHighlighted
                      ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-[0_0_25px_rgba(229,9,20,0.6)] border border-red-400/50'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  <span>{plan.id === 'essential' ? 'GET STARTED' : plan.id === 'performance' ? 'JOIN NOW' : 'GO ELITE'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
