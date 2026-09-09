import React, { useEffect, useState } from 'react';
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

// Modals & Admin
import { WorkoutModal } from './components/WorkoutModal';
import { TrainerModal } from './components/TrainerModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';

import { Program, MuscleInfo, Trainer, MembershipPlan, ClassSession, MEMBERSHIPS } from './data/gymData';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

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

  const smoothScrollTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(el, { offset: -40, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProgramSelect = (_program: Program) => {
    smoothScrollTo('contact');
  };

  const handleJoinNowClick = () => {
    setSelectedCheckoutPlan(MEMBERSHIPS[1]);
  };

  const handleBookTrainerSession = (_trainerName: string) => {
    smoothScrollTo('contact-form');
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
          />

          {/* Main Website Flow */}
          <main className="w-full overflow-x-clip">
            {/* 1. Hero Section */}
            <Hero
              onJoinClick={handleJoinNowClick}
              onExploreClick={() => smoothScrollTo('programs')}
            />

            {/* 2. Live Gym Status Bar */}
            <LiveStatusBar />

            {/* 3. About The Club — Scroll Story */}
            <ScrollStory />

            {/* 5. Training Programs */}
            <ProgramsSection onSelectProgram={handleProgramSelect} />

            {/* 6. Interactive Muscle Map */}
            <MuscleMapSection onOpenWorkoutModal={(m) => setSelectedMuscleModal(m)} />

            {/* 7. Trainer Profiles */}
            <TrainerSection onSelectTrainer={(t) => setSelectedTrainerModal(t)} />

            {/* 8. Before & After Transformations */}
            <TransformationsSection />

            {/* 9. Membership Pricing Tiers */}
            <MembershipSection onSelectPlan={(plan) => setSelectedCheckoutPlan(plan)} />

            {/* 10. Nutrition & Macro Calculator */}
            <MacroCalculator />

            {/* 11. Real-Time Class Schedule */}
            <ClassScheduleSection onJoinClassModal={handleJoinClassModal} />

            {/* 12. Facilities Horizontal Scroll */}
            <FacilitiesSection />

            {/* 13. Gym Gallery Masonry */}
            <GallerySection />

            {/* 14. Member Testimonials */}
            <TestimonialsSection />

            {/* 15. Contact Section & Form */}
            <ContactSection onJoinClick={handleJoinNowClick} />

            {/* 16. Location Map */}
            <MapSection />
          </main>

          {/* Floating AI Fitness Assistant Widget */}
          <AIAssistantWidget />

          {/* Footer */}
          <Footer />

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
