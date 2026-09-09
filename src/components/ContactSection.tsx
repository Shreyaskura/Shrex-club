import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, CheckCircle2, Phone, Mail, MapPin, Calendar, Dumbbell } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactSectionProps {
  onJoinClick: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onJoinClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goal: 'Hypertrophy & Strength',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        goal: 'Hypertrophy & Strength',
        message: '',
      });
    }, 4000);
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 bg-[#060608] text-white border-b border-white/10 overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="w-[92%] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-widest mb-6">
              ● INITIATE TRANSFORMATION
            </div>

            <h2 className="text-4xl sm:text-6xl font-black font-heading tracking-tight mb-4">
              READY TO <br />
              <span className="text-gradient-red">BEGIN?</span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-300 font-light mb-8 max-w-md">
              "Your strongest version starts today."
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onJoinClick}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 font-heading font-extrabold text-sm uppercase tracking-widest text-white shadow-[0_0_25px_rgba(229,9,20,0.5)] border border-red-400/50 flex items-center gap-2 transition-transform active:scale-95"
              >
                <Dumbbell className="w-4 h-4 text-red-200" />
                <span>JOIN SHREX CLUB</span>
              </button>

              <button
                onClick={() => {
                  const formEl = document.getElementById('contact-form');
                  formEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 font-heading font-bold text-sm uppercase tracking-widest text-gray-200 hover:text-white transition-all active:scale-95 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>BOOK A FREE VISIT</span>
              </button>
            </div>

            {/* Direct Contact Meta Details */}
            <div className="space-y-4 pt-8 border-t border-white/10 w-full max-w-md">
              <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-red-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Pragathi Nagar, Kukatpally, Hyderabad, TS 500090</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-red-500">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+91 98765 43210 / +91 40 2345 6789</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-red-500">
                  <Mail className="w-4 h-4" />
                </div>
                <span>concierge@shrexclub.com</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column Contact Form */}
          <motion.div
            id="contact-form"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black font-heading text-white mb-2">
                  MESSAGE TRANSMITTED!
                </h3>
                <p className="text-xs font-mono text-gray-300 max-w-xs">
                  Our concierge team will reach out within 2 hours to confirm your club pass.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-2xl font-black font-heading text-white mb-6">
                  INQUIRE / BOOK FREE VISIT
                </h3>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Arjun Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="arjun@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                    PRIMARY FITNESS GOAL
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full bg-[#0D0D12] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-gray-200 focus:outline-none focus:border-red-500"
                  >
                    <option value="Hypertrophy & Strength">Hypertrophy & Raw Strength</option>
                    <option value="Body Composition & Fat Loss">Body Composition & Fat Loss</option>
                    <option value="CrossFit & Conditioning">CrossFit & High-Intensity MetCon</option>
                    <option value="Boxing & Combat Agility">Boxing & Combat Agility</option>
                    <option value="General Health & Mobility">General Health & Mobility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                    MESSAGE / PREFERRED VISIT TIME
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your fitness background or preferred visit date..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-heading font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(229,9,20,0.4)] border border-red-400/40 flex items-center justify-center gap-2 transition-transform active:scale-98"
                >
                  <span>SEND MESSAGE</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
