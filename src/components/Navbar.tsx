import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Zap, Shield, Dumbbell, Sparkles } from 'lucide-react';

interface NavbarProps {
  onJoinClick: () => void;
  onOpenAdmin: () => void;
  activeView: 'home' | 'training';
  onNavigate: (view: 'home' | 'training', targetSectionId?: string) => void;
}

const HOME_NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Transformations', href: '#transformations' },
  { label: 'Membership', href: '#membership' },
  { label: 'Nutrition', href: '#nutrition' },
  { label: 'Contact', href: '#contact' },
];

const TRAINING_NAV_ITEMS = [
  { label: 'Protocols', href: '#programs' },
  { label: '3D Muscle Map', href: '#muscle-map' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Coaches', href: '#trainers' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onJoinClick,
  onOpenAdmin,
  activeView,
  onNavigate,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  const currentNavItems = activeView === 'home' ? HOME_NAV_ITEMS : TRAINING_NAV_ITEMS;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollYRef.current;

      // Close mobile drawer menu on scroll
      if (Math.abs(currentScrollY - prevScrollY) > 15) {
        setMobileMenuOpen(false);
      }

      if (currentScrollY <= 40) {
        setScrolled(false);
        setVisible(true);
      } else {
        setScrolled(true);
        // If scrolling down, hide navbar so it doesn't block mobile screen
        if (currentScrollY > prevScrollY && currentScrollY > 80) {
          setVisible(false);
        } else {
          // If scrolling up, show navbar
          setVisible(true);
        }
      }

      lastScrollYRef.current = currentScrollY;

      // Detect active section
      const sections = currentNavItems.map((item) => item.href.substring(1));
      const scrollPosition = currentScrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentNavItems]);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.substring(1);
    onNavigate(activeView, targetId);
  };

  const handleSwitchView = (view: 'home' | 'training', targetSection?: string) => {
    setMobileMenuOpen(false);
    onNavigate(view, targetSection);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex justify-center pointer-events-none ${
          scrolled ? 'py-2 sm:py-2.5' : 'py-3 sm:py-5'
        }`}
      >
        <div
          className={`w-[95%] max-w-7xl mx-auto rounded-2xl transition-all duration-300 flex items-center justify-between px-3 sm:px-6 pointer-events-auto ${
            scrolled
              ? 'glass-nav py-2 sm:py-3 shadow-[0_10px_30px_rgba(0,0,0,0.85)] border border-white/10'
              : 'bg-[#09090D]/80 backdrop-blur-md py-2.5 sm:py-3.5 border border-white/10 shadow-xl'
          }`}
        >
          {/* Logo */}
          <div
            onClick={() => handleSwitchView('home')}
            className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-950 p-[1px] shadow-lg shadow-red-600/20 group-hover:shadow-red-600/40 transition-all duration-300">
              <div className="w-full h-full bg-[#09090D] rounded-[11px] flex items-center justify-center border border-white/10 group-hover:scale-95 transition-transform duration-300">
                <span className="font-heading font-black text-lg sm:text-xl text-gradient-red">S</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-lg sm:text-xl tracking-wider text-white group-hover:text-red-500 transition-colors">
                SHREX <span className="text-gradient-red">CLUB</span>
              </span>
              <span className="text-[8px] tracking-[0.25em] text-gray-400 font-mono font-semibold uppercase -mt-0.5 hidden sm:block">
                LUXURY FITNESS
              </span>
            </div>
          </div>

          {/* Center: View Switcher + Contextual Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Primary View Segmented Pills */}
            <div className="flex items-center p-1 rounded-full bg-black/60 border border-white/15 shadow-inner">
              <button
                onClick={() => handleSwitchView('home')}
                data-cursor="CLUB"
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-heading font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  activeView === 'home'
                    ? 'text-white bg-gradient-to-r from-red-600 to-red-800 shadow-[0_0_15px_rgba(229,9,20,0.5)] border border-red-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>CLUB</span>
              </button>

              <button
                onClick={() => handleSwitchView('training')}
                data-cursor="TRAINING"
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-heading font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  activeView === 'training'
                    ? 'text-white bg-gradient-to-r from-red-600 to-red-800 shadow-[0_0_15px_rgba(229,9,20,0.5)] border border-red-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Dumbbell className="w-3 h-3 text-red-400" />
                <span>TRAINING</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              </button>
            </div>

            {/* Contextual Sub-Links for Active View */}
            <nav className="flex items-center gap-1 bg-white/[0.03] backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
              {currentNavItems.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleSectionClick(e, item.href)}
                    className={`relative px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 rounded-full ${
                      isActive ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBg"
                        className="absolute inset-0 bg-red-600/30 border border-red-500/50 rounded-full -z-10 shadow-[0_0_10px_rgba(229,9,20,0.4)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Switch to Other View Quick Button */}
            {activeView === 'home' ? (
              <button
                onClick={() => handleSwitchView('training')}
                data-cursor="TRAIN"
                className="px-3.5 py-1.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 flex items-center gap-1.5 transition-all"
              >
                <Dumbbell className="w-3.5 h-3.5 text-red-500" />
                <span>OPEN TRAINING SUITE →</span>
              </button>
            ) : (
              <button
                onClick={() => handleSwitchView('home')}
                data-cursor="CLUB"
                className="px-3.5 py-1.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/15 flex items-center gap-1.5 transition-all"
              >
                <span>← CLUB SANCTUARY</span>
              </button>
            )}

            {/* Admin Panel Trigger */}
            <button
              onClick={onOpenAdmin}
              data-cursor="ADMIN"
              className="p-2 sm:px-3 sm:py-2 rounded-full font-mono text-[11px] font-extrabold uppercase tracking-wider text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/15 backdrop-blur-md flex items-center gap-1.5 transition-all"
              title="Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden md:inline">ADMIN</span>
            </button>

            {/* Join Now CTA */}
            <button
              onClick={onJoinClick}
              data-cursor="JOIN"
              className="relative group overflow-hidden px-5 py-2 sm:py-2.5 rounded-full font-heading font-bold text-xs uppercase tracking-widest text-white bg-gradient-to-r from-red-600 to-red-800 shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_30px_rgba(229,9,20,0.8)] transition-all duration-300 border border-red-500/50 active:scale-95 flex items-center gap-1.5"
            >
              <span className="relative z-10">JOIN NOW</span>
              <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-red-500" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#060608]/98 backdrop-blur-2xl lg:hidden flex flex-col justify-between pt-24 pb-8 px-6 border-b border-white/10 overflow-y-auto"
          >
            <div className="flex flex-col gap-4">
              {/* Primary View Switcher for Mobile */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 mb-2">
                <button
                  onClick={() => handleSwitchView('home')}
                  className={`py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    activeView === 'home'
                      ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-600/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>CLUB SANCTUARY</span>
                </button>

                <button
                  onClick={() => handleSwitchView('training')}
                  className={`py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    activeView === 'training'
                      ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-600/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>TRAINING SUITE</span>
                </button>
              </div>

              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gray-500">
                {activeView === 'home' ? 'CLUB SECTIONS' : 'TRAINING PROTOCOLS & TOOLS'}
              </span>

              {/* Navigation Links for Active View */}
              {currentNavItems.map((item, idx) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleSectionClick(e, item.href)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`flex items-center justify-between py-2.5 px-4 rounded-xl text-base font-heading font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-gray-600'}`} />
                  </motion.a>
                );
              })}

              {/* View Switcher Shortcut Link */}
              <div className="pt-2">
                {activeView === 'home' ? (
                  <button
                    onClick={() => handleSwitchView('training')}
                    className="w-full py-3 px-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-between hover:bg-red-900/40 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-red-400" />
                      <span>Switch to Dedicated Training Page</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-red-400" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSwitchView('home')}
                    className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-between hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span>Return to Club Sanctuary Page</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-widest text-white bg-white/10 border border-white/20 flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-red-500" />
                <span>OPEN ADMIN DASHBOARD</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onJoinClick();
                }}
                className="w-full py-3.5 rounded-xl font-heading font-extrabold text-sm uppercase tracking-widest text-white bg-gradient-to-r from-red-600 to-red-800 shadow-[0_0_25px_rgba(229,9,20,0.5)] border border-red-500/50 flex items-center justify-center gap-2"
              >
                <span>JOIN THE CLUB NOW</span>
                <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              </button>
              <div className="text-center text-[10px] tracking-[0.2em] text-gray-500 uppercase font-mono">
                PRAGATHI NAGAR • HYDERABAD
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
