import React, { useState } from 'react';
import { Send, ArrowUp, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: 'home' | 'training', targetSectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-[#040406] text-white pt-16 pb-12 overflow-hidden border-t border-white/5">
      {/* Animated Glowing Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16 border-b border-white/5">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2">
            <div
              onClick={() => onNavigate?.('home', 'hero')}
              className="flex items-center gap-3 mb-4 cursor-pointer group w-fit"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-950 p-[1px] shadow-lg shadow-red-600/20 group-hover:shadow-red-600/40 transition-all">
                <div className="w-full h-full bg-[#09090D] rounded-[11px] flex items-center justify-center border border-white/10 group-hover:scale-95 transition-transform">
                  <span className="font-heading font-black text-xl text-gradient-red">S</span>
                </div>
              </div>
              <span className="font-heading font-black text-2xl tracking-wider text-white group-hover:text-red-500 transition-colors">
                SHREX <span className="text-gradient-red">CLUB</span>
              </span>
            </div>

            <p className="text-xs text-gray-400 font-light max-w-sm mb-5 leading-relaxed">
              A high-performance athletic club engineering human potential through heavy steel, data telemetry, and world-class coaching.
            </p>

            {/* Quick Contact info */}
            <div className="space-y-2 mb-6 text-xs font-mono text-gray-300">
              <a
                href="https://wa.me/919014404462?text=Hello%20SHREX%20CLUB"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 flex items-center gap-2 transition-colors"
              >
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">WHATSAPP / TEL</span>
                <span>+91 90144 04462</span>
              </a>
              <a
                href="mailto:Shreyaskura@gmail.com"
                className="hover:text-amber-400 flex items-center gap-2 transition-colors"
              >
                <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">GMAIL</span>
                <span>Shreyaskura@gmail.com</span>
              </a>
              <a
                href="https://instagram.com/Shreyas__.2008"
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-400 flex items-center gap-2 transition-colors"
              >
                <span className="text-pink-400 font-bold bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-500/30">INSTAGRAM</span>
                <span>@Shreyas__.2008</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* WhatsApp */}
              <a
                href="https://wa.me/919014404462?text=Hello%20SHREX%20CLUB"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 text-emerald-400 hover:text-black transition-all flex items-center justify-center shadow-lg shadow-emerald-500/10"
                aria-label="WhatsApp"
                title="Chat on WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.541 1.942.825 2.791.825 3.182 0 5.768-2.587 5.769-5.767.001-3.182-2.584-5.81-5.77-5.81zm3.385 8.213c-.144.405-.837.774-1.17.824-.312.045-.698.077-2.12-.51-1.815-.749-2.983-2.587-3.074-2.708-.089-.12-1.748-2.327-1.748-4.437 0-2.11 1.107-3.144 1.498-3.575.392-.431.854-.539 1.14-.539.285 0 .57.003.82.015.263.013.616-.099.964.736.357.859 1.22 2.975 1.328 3.19.108.216.18.47.036.758-.143.287-.215.467-.428.718-.214.252-.451.562-.644.754-.215.216-.44.45-.19.882.251.431 1.116 1.839 2.395 2.98 1.646 1.468 3.033 1.923 3.463 2.138.43.216.68.18.932-.108.252-.288 1.077-1.258 1.363-1.689.286-.431.572-.359.964-.216.393.144 2.498 1.177 2.926 1.393.428.216.714.323.82.502.108.18.108 1.042-.036 1.447z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2 22l5.161-1.319A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.637 0-3.167-.492-4.45-1.336l-.319-.208-3.067.784.819-2.991-.225-.339A8.216 8.216 0 0 1 3.75 12c0-4.549 3.701-8.25 8.25-8.25 4.549 0 8.25 3.701 8.25 8.25 0 4.549-3.701 8.25-8.25 8.25z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/Shreyas__.2008"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-pink-400 hover:text-white transition-all flex items-center justify-center shadow-lg shadow-pink-500/10"
                aria-label="Instagram"
                title="Follow on Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              {/* Call */}
              <a
                href="tel:+919014404462"
                className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30 hover:bg-red-600 text-red-400 hover:text-white transition-all flex items-center justify-center"
                aria-label="Call Directly"
                title="Call Directly"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* Gmail */}
              <a
                href="mailto:Shreyaskura@gmail.com"
                className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500 text-amber-400 hover:text-black transition-all flex items-center justify-center"
                aria-label="Email Us"
                title="Email Us"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300 mb-4">
              CLUB SANCTUARY
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li>
                <button
                  onClick={() => onNavigate?.('home', 'hero')}
                  className="hover:text-white transition-colors text-left"
                >
                  Home / Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('home', 'about')}
                  className="hover:text-white transition-colors text-left"
                >
                  About The Club
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('home', 'membership')}
                  className="hover:text-white transition-colors text-left"
                >
                  Membership Tiers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('home', 'facilities')}
                  className="hover:text-white transition-colors text-left"
                >
                  Facility Arenas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('home', 'contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Dedicated Training Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 mb-4 flex items-center gap-1.5">
              <span>TRAINING SUITE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li>
                <button
                  onClick={() => onNavigate?.('training', 'programs')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Training Protocols
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('training', 'muscle-map')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  3D Muscle Anatomy Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('training', 'schedule')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Live Class Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('training', 'trainers')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Master Coaches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('home', 'nutrition')}
                  className="hover:text-white transition-colors text-left"
                >
                  Macro & Calorie Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Signup */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300 mb-4">
              NEWSLETTER
            </h4>
            <p className="text-xs text-gray-400 font-light mb-4">
              Get weekly training protocols & macro guides directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                required
                placeholder="Enter email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 font-heading font-extrabold text-xs uppercase tracking-widest text-white transition-colors flex items-center justify-center gap-2"
              >
                <span>{subscribed ? 'SUBSCRIBED!' : 'SUBSCRIBE'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-gray-500">
          <span>© 2026 SHREX CLUB. ALL RIGHTS RESERVED.</span>

          <div className="flex items-center gap-6">
            <span className="hover:text-gray-300 cursor-pointer">PRIVACY POLICY</span>
            <span className="hover:text-gray-300 cursor-pointer">TERMS OF SERVICE</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-1"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>TOP</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
