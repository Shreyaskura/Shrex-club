import React, { useState } from 'react';
import { Send, ArrowUp, Share2, Video, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
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
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_15px_#E50914]" />

      <div className="w-[92%] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16 pb-12 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2">
            <a href="#hero" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-950 p-[1px] shadow-lg shadow-red-600/20">
                <div className="w-full h-full bg-[#09090D] rounded-[11px] flex items-center justify-center border border-white/10">
                  <span className="font-heading font-black text-xl text-gradient-red">S</span>
                </div>
              </div>
              <span className="font-heading font-black text-2xl tracking-wider text-white">
                SHREX <span className="text-gradient-red">CLUB</span>
              </span>
            </a>

            <p className="text-xs text-gray-400 font-light max-w-sm mb-6 leading-relaxed">
              A high-performance athletic club engineering human potential through heavy steel, data telemetry, and world-class coaching.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-600 text-gray-300 hover:text-white transition-all flex items-center justify-center"
                aria-label="Instagram"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-600 text-gray-300 hover:text-white transition-all flex items-center justify-center"
                aria-label="YouTube"
              >
                <Video className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-600 text-gray-300 hover:text-white transition-all flex items-center justify-center"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300 mb-4">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About The Club</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Training Programs</a></li>
              <li><a href="#muscle-map" className="hover:text-white transition-colors">Interactive Muscle Map</a></li>
              <li><a href="#trainers" className="hover:text-white transition-colors">Master Coaches</a></li>
            </ul>
          </div>

          {/* Col 3: Programs & Facilities */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300 mb-4">
              CLUB SANCTUARY
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li><a href="#membership" className="hover:text-white transition-colors">Memberships</a></li>
              <li><a href="#nutrition" className="hover:text-white transition-colors">Macro Calculator</a></li>
              <li><a href="#schedule" className="hover:text-white transition-colors">Live Schedule</a></li>
              <li><a href="#facilities" className="hover:text-white transition-colors">Facility Arenas</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Book Free Visit</a></li>
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
