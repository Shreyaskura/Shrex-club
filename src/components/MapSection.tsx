import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Navigation, Compass, Clock, Phone } from 'lucide-react';

export const MapSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const openDirections = () => {
    window.open(
      'https://www.google.com/maps/search/Pragathi+Nagar+Hyderabad',
      '_blank'
    );
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 bg-[#08080C] text-white border-b border-white/10 overflow-hidden"
    >
      <div className="w-[92%] max-w-7xl mx-auto">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Ambient Dark Radar Canvas / Map Background Visual */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(#1f1f2e_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

          {/* Left Side Info */}
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-widest mb-4">
              <Compass className="w-3.5 h-3.5 text-red-500" />
              HEADQUARTERS LOCATION
            </div>

            <h2 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-white mb-4">
              FIND YOUR <span className="text-gradient-red">CLUB</span>
            </h2>

            <div className="space-y-4 mb-8 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                <div>
                  <strong className="text-white block font-heading text-base">SHREX CLUB SANCTUARY</strong>
                  <span>Main Boulevard, Pragathi Nagar, Kukatpally, Hyderabad, Telangana 500090</span>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-emerald-400">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>OPEN 24 HOURS • 7 DAYS A WEEK</span>
              </div>
            </div>

            <button
              onClick={openDirections}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-heading font-extrabold text-xs uppercase tracking-widest border border-red-400/40 shadow-[0_0_20px_rgba(229,9,20,0.5)] flex items-center gap-2 transition-transform active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>GET DIRECTIONS ON MAP</span>
            </button>
          </div>

          {/* Right Side Map Canvas Placeholder Card */}
          <div className="relative z-10 w-full lg:w-1/2 h-[300px] rounded-2xl overflow-hidden border border-white/15 bg-black/60 flex items-center justify-center shadow-inner group">
            {/* Dark Styled Map Grid Overlay */}
            <div className="absolute inset-0 bg-[#0c0c12] opacity-90 flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center mb-3 animate-pulse">
                  <MapPin className="w-8 h-8 text-red-500" />
                </div>
                <span className="font-heading font-extrabold text-lg text-white">
                  SHREX CLUB HYDERABAD
                </span>
                <span className="text-xs font-mono text-gray-400">
                  Latitude: 17.5142° N, Longitude: 78.3980° E
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-gray-300">Pragathi Nagar HQ</span>
              <span className="text-red-400 font-bold">NAVIGATION READY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
