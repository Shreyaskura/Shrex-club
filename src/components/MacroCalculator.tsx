import React, { useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Flame, PieChart, Activity, Info, ShieldAlert, Sparkles } from 'lucide-react';

export const MacroCalculator: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Inputs state
  const [goal, setGoal] = useState<'build' | 'cut' | 'maintain'>('build');
  const [activity, setActivity] = useState<number>(1.55); // 1.2 sedentary, 1.375 light, 1.55 moderate, 1.725 heavy
  const [age, setAge] = useState<number>(26);
  const [height, setHeight] = useState<number>(178); // cm
  const [weight, setWeight] = useState<number>(75); // kg
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // BMR & Macro Calculation using Mifflin-St Jeor Formula
  const macros = useMemo(() => {
    // BMR Calculation
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr += gender === 'male' ? 5 : -161;

    let tdee = Math.round(bmr * activity);

    // Adjust for Goal
    if (goal === 'build') tdee += 450;
    else if (goal === 'cut') tdee -= 450;

    // Macro distribution:
    // Protein: 2.2g per kg bodyweight
    const proteinGrams = Math.round(weight * 2.2);
    const proteinCalories = proteinGrams * 4;

    // Fat: 25% of TDEE
    const fatCalories = Math.round(tdee * 0.25);
    const fatGrams = Math.round(fatCalories / 9);

    // Carbs: Remaining calories
    const carbCalories = Math.max(0, tdee - proteinCalories - fatCalories);
    const carbGrams = Math.round(carbCalories / 4);

    return {
      tdee,
      proteinGrams,
      fatGrams,
      carbGrams,
      proteinPct: Math.round((proteinCalories / tdee) * 100),
      fatPct: Math.round((fatCalories / tdee) * 100),
      carbPct: Math.round((carbCalories / tdee) * 100),
    };
  }, [weight, height, age, gender, activity, goal]);

  return (
    <section
      id="nutrition"
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 bg-[#060608] text-white border-b border-white/10 overflow-hidden"
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
            <Flame className="w-3.5 h-3.5 text-red-500" />
            HIGH-PERFORMANCE FUELING
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight mb-4"
          >
            FUEL YOUR <span className="text-gradient-red">PERFORMANCE.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 font-light text-base sm:text-lg"
          >
            Precision nutrition engine tailored to accelerate muscle hypertrophy, optimize recovery, and torch body fat.
          </motion.p>
        </div>

        {/* Interactive Dashboard Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: User Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-6 glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-6 border-b border-white/10 pb-3">
                1. ATHLETIC METRIC INPUTS
              </span>

              {/* Goal Selector */}
              <div className="mb-6">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-2">
                  PRIMARY GOAL
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'build', label: 'MUSCLE BUILD' },
                      { id: 'cut', label: 'FAT LOSS' },
                      { id: 'maintain', label: 'MAINTAIN' },
                    ] as const
                  ).map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={`py-2.5 rounded-xl font-mono text-[11px] font-bold uppercase transition-all ${
                        goal === g.id
                          ? 'bg-red-600 text-white border border-red-400 shadow-[0_0_15px_#E50914]'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Selector */}
              <div className="mb-6">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-2">
                  BIOLOGICAL GENDER
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setGender('male')}
                    className={`py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all ${
                      gender === 'male'
                        ? 'bg-white/15 text-white border border-white/30'
                        : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}
                  >
                    MALE
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all ${
                      gender === 'female'
                        ? 'bg-white/15 text-white border border-white/30'
                        : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}
                  >
                    FEMALE
                  </button>
                </div>
              </div>

              {/* Numeric Inputs Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                    AGE (YEARS)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-center font-heading font-extrabold text-white text-base focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                    HEIGHT (CM)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-center font-heading font-extrabold text-white text-base focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                    WEIGHT (KG)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-center font-heading font-extrabold text-white text-base focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Activity Level Dropdown */}
              <div className="mb-4">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-2">
                  DAILY ACTIVITY LEVEL
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(Number(e.target.value))}
                  className="w-full bg-[#0D0D12] border border-white/15 rounded-xl px-4 py-3 text-xs font-mono text-gray-200 focus:border-red-500 focus:outline-none cursor-pointer"
                >
                  <option value={1.2}>Sedentary (Desk job, limited exercise)</option>
                  <option value={1.375}>Lightly Active (1-3 gym sessions/week)</option>
                  <option value={1.55}>Moderately Active (3-5 intense workouts/week)</option>
                  <option value={1.725}>Heavy Athlete (6+ hard training sessions/week)</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Calculated Output Results Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-6 glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block mb-6 border-b border-white/10 pb-3 flex items-center justify-between">
                <span>2. TARGET NUTRITION RESULTS</span>
                <span className="text-red-500 font-extrabold animate-pulse">● LIVE METRICS</span>
              </span>

              {/* Central Calorie Gauge */}
              <div className="flex items-center justify-between bg-gradient-to-r from-red-950/40 via-red-900/20 to-transparent p-6 rounded-2xl border border-red-500/30 mb-6">
                <div>
                  <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest block mb-1">
                    TARGET DAILY CALORIC INTAKE
                  </span>
                  <motion.span
                    key={macros.tdee}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tight block"
                  >
                    {macros.tdee} <span className="text-xs font-mono text-gray-400 font-normal">KCAL / DAY</span>
                  </motion.span>
                </div>
                <div className="p-4 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400">
                  <Flame className="w-8 h-8" />
                </div>
              </div>

              {/* Macros 3-Column Gauges */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Protein */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-2">
                    PROTEIN (40%)
                  </span>
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-400 block mb-1">
                    {macros.proteinGrams}g
                  </span>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${macros.proteinPct}%` }} />
                  </div>
                </div>

                {/* Carbs */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-2">
                    CARBS (35%)
                  </span>
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-amber-400 block mb-1">
                    {macros.carbGrams}g
                  </span>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${macros.carbPct}%` }} />
                  </div>
                </div>

                {/* Fats */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-2">
                    FATS (25%)
                  </span>
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-blue-400 block mb-1">
                    {macros.fatGrams}g
                  </span>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-400 h-full rounded-full" style={{ width: `${macros.fatPct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer Footer Note */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-gray-400">
              <ShieldAlert className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <span>
                Disclaimer: Macro estimates are for general athletic guidance. Individual medical conditions or clinical diet plans may require consultation with a licensed nutritionist.
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
