import React, { useEffect, useState, useCallback } from 'react';
import Lenis from 'lenis';
import { LoadingScreen } from './components/LoadingScreen';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LiveStatusBar } from './components/LiveStatusBar';
import { ScrollStory } from './components/ScrollStory';
import { ProgramsSection } from './components/ProgramsSection';
import { MuscleMapSection } from './components/MuscleMapSection';
import { TrainerSection } from './components/TrainerSection';
import { TransformationsSection } from './components/TransformationsSection';
import { MembershipSection } from './components/MembershipSection';
import { MacroCalculator } from './components/MacroCalculator';
import { ClassScheduleSection } from './components/ClassScheduleSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { GallerySection } from './components/GallerySection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { ContactSection } from './components/ContactSection';
import { MapSection } from './components/MapSection';
import { Footer } from './components/Footer';
import { TrainingHero } from './components/TrainingHero';

// Modals & Admin
import { WorkoutModal } from './components/WorkoutModal';
import { TrainerModal } from './components/TrainerModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';

import { Program, MuscleInfo, Trainer, MembershipPlan, ClassSession, MEMBERSHIPS } from './data/gymData';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Active View: 'home' for Club Sanctuary or 'training' for Dedicated Training Suite
  const [activeView, setActiveView] = useState<'home' | 'training'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('training') || hash.includes('programs') || hash.includes('muscle-map') || hash.includes('schedule') || hash.includes('trainers')) {
        return 'training';
      }
    }
    return 'home';
  });

  // Modal & Admin states
  const [selectedMuscleModal, setSelectedMuscleModal] = useState<MuscleInfo | null>(null);
  const [selectedTrainerModal, setSelectedTrainerModal] = useState<Trainer | null>(null);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<MembershipPlan | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Initialize Lenis Smooth Inertia Scrolling
  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      (window as any).lenis = null;
      lenis.destroy();
    };
  }, [isLoading]);

  const smoothScrollTo = useCallback((targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(el, { offset: -60, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Sync route hash with active view
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('training') || hash.includes('programs') || hash.includes('muscle-map') || hash.includes('schedule') || hash.includes('trainers')) {
        setActiveView('training');
      } else {
        setActiveView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((view: 'home' | 'training', targetSectionId?: string) => {
    setActiveView(view);

    if (view === 'training') {
      window.history.pushState(null, '', targetSectionId ? `#/training/${targetSectionId}` : '#/training');
    } else {
      window.history.pushState(null, '', targetSectionId ? `#${targetSectionId}` : '#/');
    }

    if (targetSectionId) {
      setTimeout(() => {
        smoothScrollTo(targetSectionId);
      }, 100);
    } else {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [smoothScrollTo]);

  const handleProgramSelect = (_program: Program) => {
    navigateTo('home', 'contact');
  };

  const handleJoinNowClick = () => {
    setSelectedCheckoutPlan(MEMBERSHIPS[1]);
  };

  const handleBookTrainerSession = (_trainerName: string) => {
    navigateTo('home', 'contact-form');
  };

  const handleJoinClassModal = (_session: ClassSession) => {
    setSelectedCheckoutPlan(MEMBERSHIPS[1]);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#060608] text-white selection:bg-red-600 selection:text-white">
      {/* 0. Preloader Screen */}
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <>
          {/* Custom Desktop Pointer Cursor */}
          <CustomCursor />

          {/* Floating Glass Navigation */}
          <Navbar
            onJoinClick={handleJoinNowClick}
            onOpenAdmin={() => setIsAdminOpen(true)}
            activeView={activeView}
            onNavigate={navigateTo}
          />

          {/* Main Website Flow */}
          <main className="w-full overflow-x-clip">
            {activeView === 'home' ? (
              /* VIEW A: MAIN CLUB SANCTUARY (Overview, About, Facilities, Memberships, Transformations, Nutrition, Contact) */
              <>
                {/* 1. Hero Section */}
                <Hero
                  onJoinClick={handleJoinNowClick}
                  onExploreClick={() => navigateTo('training')}
                />

                {/* 2. Live Gym Status Bar */}
                <LiveStatusBar />

                {/* 3. About The Club — Scroll Story */}
                <ScrollStory />

                {/* 4. Facilities & Arenas */}
                <FacilitiesSection />

                {/* 5. Before & After Transformations */}
                <TransformationsSection />

                {/* 6. Membership Pricing Tiers */}
                <MembershipSection onSelectPlan={(plan) => setSelectedCheckoutPlan(plan)} />

                {/* 7. Nutrition & Macro Calculator */}
                <MacroCalculator />

                {/* 8. Gym Gallery Masonry */}
                <GallerySection />

                {/* 9. Member Testimonials */}
                <TestimonialsSection />

                {/* 10. Contact Section & Form */}
                <ContactSection onJoinClick={handleJoinNowClick} />

                {/* 11. Location Map */}
                <MapSection />
              </>
            ) : (
              /* VIEW B: DEDICATED TRAINING SUITE & PROTOCOLS (Programs, 3D Muscle Anatomy, Schedule, Coaches) */
              <div className="relative w-full min-h-screen">
                {/* 1. Dedicated Training Suite Header */}
                <TrainingHero
                  onBackToClub={() => navigateTo('home', 'hero')}
                  onJumpToSection={(id) => smoothScrollTo(id)}
                />

                {/* 2. Training Programs */}
                <ProgramsSection onSelectProgram={handleProgramSelect} />

                {/* 3. Interactive 3D Muscle Map */}
                <MuscleMapSection onOpenWorkoutModal={(m) => setSelectedMuscleModal(m)} />

                {/* 4. Real-Time Class Schedule */}
                <ClassScheduleSection onJoinClassModal={handleJoinClassModal} />

                {/* 5. Elite Master Coaches */}
                <TrainerSection onSelectTrainer={(t) => setSelectedTrainerModal(t)} />

                {/* 6. Training Page Bottom Action Banner */}
                <section className="relative py-20 bg-gradient-to-b from-[#08080C] to-[#050507] border-t border-white/10 text-center">
                  <div className="w-[92%] max-w-4xl mx-auto px-6">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 mb-3 block">
                      START YOUR TRANSFORMATION
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight mb-6">
                      READY TO COMMIT TO <span className="text-gradient-red">EXCELLENCE</span>?
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light leading-relaxed">
                      Join the most elite athletic facility in Hyderabad. Personal coaching, bespoke nutrition protocols, and advanced biometric tracking.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <button
                        onClick={handleJoinNowClick}
                        data-cursor="JOIN"
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white font-heading font-extrabold text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(229,9,20,0.5)] hover:shadow-[0_0_35px_rgba(229,9,20,0.8)] border border-red-500/50 hover:scale-105 active:scale-95 transition-all"
                      >
                        JOIN SHREX CLUB NOW
                      </button>

                      <button
                        onClick={() => navigateTo('home', 'contact')}
                        data-cursor="CONTACT"
                        className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-heading font-bold text-sm uppercase tracking-widest border border-white/15 hover:border-white/30 transition-all"
                      >
                        BOOK COMPLIMENTARY TOUR
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </main>

          {/* Floating AI Fitness Assistant Widget */}
          <AIAssistantWidget />

          {/* Footer */}
          <Footer onNavigate={navigateTo} />

          {/* Modals */}
          <WorkoutModal
            muscle={selectedMuscleModal}
            onClose={() => setSelectedMuscleModal(null)}
          />

          <TrainerModal
            trainer={selectedTrainerModal}
            onClose={() => setSelectedTrainerModal(null)}
            onBookSession={handleBookTrainerSession}
          />

          <CheckoutModal
            plan={selectedCheckoutPlan}
            onClose={() => setSelectedCheckoutPlan(null)}
          />

          {/* Admin Command Center Dashboard */}
          <AdminDashboard
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
          />
        </>
      )}
    </div>
  );
}
