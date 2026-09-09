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
            <div className="space-y-3 pt-6 border-t border-white/10 w-full max-w-md">
              <span className="text-[10px] font-mono tracking-[0.25em] text-red-400 uppercase font-bold block mb-1">
                DIRECT CONTACT CHANNELS (TAP TO OPEN)
              </span>

              {/* WhatsApp Direct */}
              <a
                href="https://wa.me/919014404462?text=Hello%20SHREX%20CLUB%2C%20I%20am%20interested%20in%20joining%20and%20would%20like%20more%20details!"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.541 1.942.825 2.791.825 3.182 0 5.768-2.587 5.769-5.767.001-3.182-2.584-5.81-5.77-5.81zm3.385 8.213c-.144.405-.837.774-1.17.824-.312.045-.698.077-2.12-.51-1.815-.749-2.983-2.587-3.074-2.708-.089-.12-1.748-2.327-1.748-4.437 0-2.11 1.107-3.144 1.498-3.575.392-.431.854-.539 1.14-.539.285 0 .57.003.82.015.263.013.616-.099.964.736.357.859 1.22 2.975 1.328 3.19.108.216.18.47.036.758-.143.287-.215.467-.428.718-.214.252-.451.562-.644.754-.215.216-.44.45-.19.882.251.431 1.116 1.839 2.395 2.98 1.646 1.468 3.033 1.923 3.463 2.138.43.216.68.18.932-.108.252-.288 1.077-1.258 1.363-1.689.286-.431.572-.359.964-.216.393.144 2.498 1.177 2.926 1.393.428.216.714.323.82.502.108.18.108 1.042-.036 1.447z"/>
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2 22l5.161-1.319A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.637 0-3.167-.492-4.45-1.336l-.319-.208-3.067.784.819-2.991-.225-.339A8.216 8.216 0 0 1 3.75 12c0-4.549 3.701-8.25 8.25-8.25 4.549 0 8.25 3.701 8.25 8.25 0 4.549-3.701 8.25-8.25 8.25z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block font-bold">WHATSAPP</span>
                    <span className="text-sm font-heading font-extrabold text-white tracking-wide">+91 90144 04462</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                  CHAT NOW ↗
                </span>
              </a>

              {/* Direct Phone Call */}
              <a
                href="tel:+919014404462"
                className="group flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-red-600/15 border border-white/10 hover:border-red-500/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">CALL NUMBER</span>
                    <span className="text-sm font-heading font-extrabold text-white tracking-wide">+91 90144 04462</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-gray-300 group-hover:text-red-400 bg-white/5 group-hover:bg-red-500/20 px-2.5 py-1 rounded-full border border-white/10 group-hover:border-red-500/30 transition-colors">
                  CALL ↗
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/Shreyas__.2008"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-2xl bg-pink-500/5 hover:bg-gradient-to-r hover:from-pink-500/15 hover:to-purple-500/15 border border-white/10 hover:border-pink-500/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 block font-bold">INSTAGRAM</span>
                    <span className="text-sm font-heading font-extrabold text-white tracking-wide">@Shreyas__.2008</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-pink-400 bg-pink-500/20 px-2.5 py-1 rounded-full border border-pink-500/30 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 group-hover:text-white transition-all">
                  VIEW IG ↗
                </span>
              </a>

              {/* Gmail */}
              <a
                href="mailto:Shreyaskura@gmail.com?subject=SHREX%20CLUB%20Inquiry&body=Hi%20Shreyas%2C%0A%0AI%20am%20interested%20in%20joining%20SHREX%20CLUB.%20Please%20share%20more%20details."
                className="group flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block font-bold">GMAIL</span>
                    <span className="text-xs sm:text-sm font-heading font-extrabold text-white tracking-wide">Shreyaskura@gmail.com</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                  GMAIL ↗
                </span>
              </a>

              {/* Location */}
              <a
                href="https://maps.google.com/?q=Pragathi+Nagar+Kukatpally+Hyderabad"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">SANCTUARY LOCATION</span>
                    <span className="text-xs font-mono text-gray-300">Pragathi Nagar, Kukatpally, Hyd</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 group-hover:text-white transition-colors">
                  MAP ↗
                </span>
              </a>
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
                      placeholder="+91 90144 04462"
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

                <div className="space-y-3">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-heading font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(229,9,20,0.4)] border border-red-400/40 flex items-center justify-center gap-2 transition-transform active:scale-98"
                  >
                    <span>SEND MESSAGE</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="h-[1px] bg-white/10 flex-1" />
                    <span className="text-[10px] font-mono text-gray-400 uppercase">OR PREFER 1-CLICK WHATSAPP</span>
                    <div className="h-[1px] bg-white/10 flex-1" />
                  </div>

                  <a
                    href={`https://wa.me/919014404462?text=${encodeURIComponent(
                      `Hi Shreyas! I would like to book a visit at SHREX CLUB.\nName: ${formData.name || 'Interested Member'}\nGoal: ${formData.goal}\nPhone: ${formData.phone || 'N/A'}\nMessage: ${formData.message || 'Please share visit & membership details.'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 font-heading font-extrabold text-xs uppercase tracking-widest border border-emerald-500/40 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.541 1.942.825 2.791.825 3.182 0 5.768-2.587 5.769-5.767.001-3.182-2.584-5.81-5.77-5.81zm3.385 8.213c-.144.405-.837.774-1.17.824-.312.045-.698.077-2.12-.51-1.815-.749-2.983-2.587-3.074-2.708-.089-.12-1.748-2.327-1.748-4.437 0-2.11 1.107-3.144 1.498-3.575.392-.431.854-.539 1.14-.539.285 0 .57.003.82.015.263.013.616-.099.964.736.357.859 1.22 2.975 1.328 3.19.108.216.18.47.036.758-.143.287-.215.467-.428.718-.214.252-.451.562-.644.754-.215.216-.44.45-.19.882.251.431 1.116 1.839 2.395 2.98 1.646 1.468 3.033 1.923 3.463 2.138.43.216.68.18.932-.108.252-.288 1.077-1.258 1.363-1.689.286-.431.572-.359.964-.216.393.144 2.498 1.177 2.926 1.393.428.216.714.323.82.502.108.18.108 1.042-.036 1.447z"/>
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2 22l5.161-1.319A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.637 0-3.167-.492-4.45-1.336l-.319-.208-3.067.784.819-2.991-.225-.339A8.216 8.216 0 0 1 3.75 12c0-4.549 3.701-8.25 8.25-8.25 4.549 0 8.25 3.701 8.25 8.25 0 4.549-3.701 8.25-8.25 8.25z"/>
                    </svg>
                    <span>CHAT DIRECTLY ON WHATSAPP</span>
                  </a>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
