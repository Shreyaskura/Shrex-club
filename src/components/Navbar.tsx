import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Zap, Shield } from 'lucide-react';

interface NavbarProps {
  onJoinClick: () => void;
  onOpenAdmin: () => void;
}

const NAV_ITEMS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Muscle Map', href: '#muscle-map' },
  { label: 'Trainers', href: '#trainers' },
  { label: 'Transformations', href: '#transformations' },
  { label: 'Membership', href: '#membership' },
  { label: 'Nutrition', href: '#nutrition' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onJoinClick, onOpenAdmin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Detect active section
      const sections = NAV_ITEMS.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetEl = document.querySelector(href) as HTMLElement | null;
    if (targetEl) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center ${
          scrolled ? 'py-3' : 'py-6'
        }`}
      >
        <div
          className={`w-[92%] max-w-7xl mx-auto rounded-2xl transition-all duration-500 flex items-center justify-between px-5 sm:px-8 ${
            scrolled
              ? 'glass-nav py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/10'
              : 'bg-transparent py-4 border border-transparent'
          }`}
        >
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-950 p-[1px] shadow-lg shadow-red-600/20 group-hover:shadow-red-600/40 transition-all duration-300">
              <div className="w-full h-full bg-[#09090D] rounded-[11px] flex items-center justify-center border border-white/10 group-hover:scale-95 transition-transform duration-300">
                <span className="font-heading font-black text-xl text-gradient-red">S</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl sm:text-2xl tracking-wider text-white group-hover:text-red-500 transition-colors">
                SHREX <span className="text-gradient-red">CLUB</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] text-gray-400 font-mono font-semibold uppercase -mt-1 hidden sm:block">
                LUXURY FITNESS
              </span>
            </div>
          </a>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 bg-white/[0.03] backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 rounded-full ${
                    isActive ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBg"
                      className="absolute inset-0 bg-red-600/30 border border-red-500/50 rounded-full -z-10 shadow-[0_0_12px_rgba(229,9,20,0.4)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Admin Panel Trigger */}
            <button
              onClick={onOpenAdmin}
              data-cursor="ADMIN"
              className="px-4 py-2 rounded-full font-mono text-[11px] font-extrabold uppercase tracking-wider text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/15 backdrop-blur-md flex items-center gap-1.5 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>ADMIN PANEL</span>
            </button>

            {/* Join Now CTA */}
            <button
              onClick={onJoinClick}
              data-cursor="JOIN"
              className="relative group overflow-hidden px-6 py-2.5 rounded-full font-heading font-bold text-xs uppercase tracking-widest text-white bg-gradient-to-r from-red-600 to-red-800 shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_30px_rgba(229,9,20,0.8)] transition-all duration-300 border border-red-500/50 active:scale-95 flex items-center gap-2"
            >
              <span className="relative z-10">JOIN NOW</span>
              <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-red-500" /> : <Menu className="w-6 h-6" />}
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
            className="fixed inset-0 z-40 bg-[#060608]/95 backdrop-blur-2xl xl:hidden flex flex-col justify-between pt-28 pb-10 px-8 border-b border-white/10 overflow-y-auto"
          >
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gray-500 mb-2">
                NAVIGATION MENU
              </span>
              {NAV_ITEMS.map((item, idx) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`flex items-center justify-between py-3 px-4 rounded-xl text-lg font-heading font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className={`w-5 h-5 ${isActive ? 'text-red-400' : 'text-gray-600'}`} />
                  </motion.a>
                );
              })}
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-widest text-white bg-white/10 border border-white/20 flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-red-500" />
                <span>OPEN ADMIN DASHBOARD</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onJoinClick();
                }}
                className="w-full py-4 rounded-xl font-heading font-extrabold text-sm uppercase tracking-widest text-white bg-gradient-to-r from-red-600 to-red-800 shadow-[0_0_25px_rgba(229,9,20,0.5)] border border-red-500/50 flex items-center justify-center gap-2"
              >
                <span>JOIN THE CLUB NOW</span>
                <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              </button>
              <div className="text-center text-[10px] tracking-[0.2em] text-gray-500 uppercase font-mono mt-1">
                PRAGATHI NAGAR • HYDERABAD
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
