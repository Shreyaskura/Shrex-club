import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, ChevronDown, Zap, Shield, Dumbbell, Sparkles, User, LogOut, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { AuthUser } from './AuthModal';

interface NavbarProps {
  onJoinClick: () => void;
  onOpenAdmin: () => void;
  activeView: 'home' | 'training';
  onNavigate: (view: 'home' | 'training', targetSectionId?: string) => void;
  currentUser: AuthUser | null;
  onOpenAuth: (tab?: 'login' | 'signup' | 'admin') => void;
  onLogout: () => void;
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
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  const currentNavItems = activeView === 'home' ? HOME_NAV_ITEMS : TRAINING_NAV_ITEMS;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollYRef.current;

      // Close mobile drawer and user menu on scroll
      if (Math.abs(currentScrollY - prevScrollY) > 15) {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
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
          {/* Left: Logo + Segmented View Switcher (Kept right beside Club on both Mobile & Desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-3.5 shrink-0">
            {/* Logo */}
            <div
              onClick={() => handleSwitchView('home')}
              className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-950 p-[1px] shadow-lg shadow-red-600/20 group-hover:shadow-red-600/40 transition-all duration-300 shrink-0">
                <div className="w-full h-full bg-[#09090D] rounded-[11px] flex items-center justify-center border border-white/10 group-hover:scale-95 transition-transform duration-300">
                  <span className="font-heading font-black text-base sm:text-xl text-gradient-red">S</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-sm sm:text-xl tracking-wider text-white group-hover:text-red-500 transition-colors">
                  SHREX <span className="text-gradient-red">CLUB</span>
                </span>
                <span className="text-[8px] tracking-[0.25em] text-gray-400 font-mono font-semibold uppercase -mt-0.5 hidden md:block">
                  LUXURY FITNESS
                </span>
              </div>
            </div>

            {/* Primary View Segmented Switcher (Visible on both Mobile and Desktop) */}
            <div className="flex items-center p-0.5 sm:p-1 rounded-full bg-black/60 border border-white/15 shadow-inner">
              <button
                onClick={() => handleSwitchView('home')}
                data-cursor="CLUB"
                className={`relative px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-heading font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 ${
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
                className={`relative px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-heading font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 ${
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
          </div>

          {/* Center: Contextual Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
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

          {/* Right Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

            {/* Authentication / Admin Controls */}
            {currentUser?.role === 'admin' ? (
              <>
                {/* Admin Panel Trigger (ONLY visible to Admin) */}
                <button
                  onClick={onOpenAdmin}
                  data-cursor="ADMIN"
                  className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-heading font-extrabold text-[10px] sm:text-xs uppercase tracking-wider text-white bg-red-600/25 hover:bg-red-600/40 border border-red-500/60 shadow-[0_0_15px_rgba(229,9,20,0.4)] backdrop-blur-md flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
                  title="Admin Command Center"
                >
                  <Shield className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span className="hidden sm:inline">ADMIN DASHBOARD</span>
                  <span className="sm:hidden">ADMIN</span>
                </button>

                {/* Admin Profile Pill */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono transition-all"
                  >
                    <div className="w-5 h-5 rounded-lg bg-red-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      A
                    </div>
                    <span className="text-white font-semibold hidden md:inline">Admin</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-[#0E0E14] border border-white/15 rounded-2xl p-2.5 shadow-2xl z-50 font-mono text-xs"
                      >
                        <div className="px-3 py-2 border-b border-white/10 mb-1">
                          <p className="text-[11px] font-bold text-white truncate">{currentUser.name}</p>
                          <p className="text-[10px] text-red-400 truncate">{currentUser.email}</p>
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[9px] font-bold">
                            SUPER ADMIN
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenAdmin();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-gray-200 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-red-500" />
                          <span>Admin Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 flex items-center gap-2 transition-colors mt-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : currentUser ? (() => {
              const now = Date.now();
              const memberExpiryTs = currentUser.membershipExpiryTimestamp || (now + 30 * 24 * 60 * 60 * 1000);
              const isMemberExpired = currentUser.isExpired || now > memberExpiryTs;
              const daysRemaining = Math.max(0, Math.ceil((memberExpiryTs - now) / (1000 * 60 * 60 * 24)));

              return (
                /* Regular Logged-In User Profile Pill (ADMIN OPTION IS HIDDEN) */
                <div className="relative shrink-0">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono transition-all"
                    title="Your Membership Profile"
                  >
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-red-600 to-amber-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-semibold hidden sm:inline truncate max-w-[85px]">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-bold hidden md:inline-flex items-center gap-1 ${
                      isMemberExpired
                        ? 'bg-red-950/60 text-red-400 border-red-500/40'
                        : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isMemberExpired ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                      <span>{currentUser.tier || 'MEMBER'}</span>
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-[#0E0E14] border border-white/15 rounded-2xl p-2.5 shadow-2xl z-50 font-mono text-xs"
                      >
                        <div className="px-3 py-2.5 border-b border-white/10 mb-1 space-y-2">
                          <div>
                            <p className="text-[12px] font-heading font-extrabold text-white truncate">{currentUser.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{currentUser.email}</p>
                          </div>

                          {/* Prominent Membership Validity Box */}
                          <div className={`p-2.5 rounded-xl border space-y-1.5 ${
                            isMemberExpired ? 'bg-red-950/30 border-red-500/40' : 'bg-white/[0.04] border-white/10'
                          }`}>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-gray-400 font-mono">MEMBERSHIP:</span>
                              <span className="text-white font-bold">{currentUser.tier || 'Performance'}</span>
                            </div>

                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-gray-400 font-mono">STATUS:</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                isMemberExpired
                                  ? 'bg-red-950 text-red-400 border border-red-500/40'
                                  : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              }`}>
                                {isMemberExpired ? 'EXPIRED' : 'ACTIVE PLAN'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                              <span className="text-gray-400 font-mono flex items-center gap-1">
                                <Clock className={`w-3 h-3 ${isMemberExpired ? 'text-red-400' : 'text-emerald-400'}`} />
                                <span>{isMemberExpired ? 'EXPIRED ON:' : 'EXPIRES ON:'}</span>
                              </span>
                              <span className={`font-bold font-mono ${isMemberExpired ? 'text-red-400' : 'text-emerald-400'}`}>
                                {currentUser.membershipExpiryDate || 'In 30 Days'}
                              </span>
                            </div>

                            <div className="text-[9px] font-mono text-right text-gray-400">
                              {isMemberExpired ? '⚠ Access Suspended' : `⏳ ${daysRemaining} Days Remaining`}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenAuth('login');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-gray-200 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-blue-400" />
                          <span>View Digital Pass & Dates</span>
                        </button>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 flex items-center gap-2 transition-colors mt-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })() : (
              /* Public / Guest Visitor: Top-Right Login / Sign Up Button (Square with smooth rounded edges) */
              <button
                onClick={() => onOpenAuth('login')}
                data-cursor="LOGIN"
                className="px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-white bg-white/5 hover:bg-white/15 border border-white/20 hover:border-red-500/50 backdrop-blur-md flex items-center gap-1.5 sm:gap-2 transition-all shadow-sm active:scale-95 shrink-0"
                title="Member Login & Sign Up"
              >
                <User className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">LOGIN / SIGN UP</span>
                <span className="sm:hidden">LOGIN</span>
              </button>
            )}

            {/* Join Now CTA */}
            <button
              onClick={onJoinClick}
              data-cursor="JOIN"
              className="hidden sm:flex relative group overflow-hidden px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-widest text-white bg-gradient-to-r from-red-600 to-red-800 shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_30px_rgba(229,9,20,0.8)] transition-all duration-300 border border-red-500/50 active:scale-95 items-center gap-1.5"
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
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              {currentUser?.role === 'admin' ? (
                <>
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-500" />
                      <div>
                        <p className="text-xs font-bold text-white">{currentUser.name}</p>
                        <p className="text-[10px] text-red-400 font-mono">ADMINISTRATOR</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="text-xs text-gray-400 hover:text-red-400 font-mono underline"
                    >
                      Log Out
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-widest text-white bg-red-600/30 hover:bg-red-600/40 border border-red-500/50 shadow-[0_0_15px_rgba(229,9,20,0.4)] flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-red-500" />
                    <span>OPEN ADMIN DASHBOARD</span>
                  </button>
                </>
              ) : currentUser ? (
                /* Regular Logged-In User (NO ADMIN BUTTON) */
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-amber-600 flex items-center justify-center font-bold text-xs text-white">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{currentUser.tier || 'Member'} • Active</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="text-xs text-red-400 hover:text-red-300 font-mono underline"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                /* Guest: Mobile Login / Sign Up Button (NO ADMIN BUTTON) */
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-widest text-white bg-white/10 hover:bg-white/15 border border-white/20 flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-red-400" />
                  <span>MEMBER LOGIN / SIGN UP</span>
                </button>
              )}

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
