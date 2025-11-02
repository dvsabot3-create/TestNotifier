import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from './components/figma/Header';
import { HeroSection } from './components/figma/HeroSection';
import { ProblemSection } from './components/figma/ProblemSection';
import { BridgeSection } from './components/figma/BridgeSection';
import { SolutionSection } from './components/figma/SolutionSection';
import { DemoSection } from './components/figma/DemoSection';
import { HowItWorksSection } from './components/figma/HowItWorksSection';
import { PricingSection } from './components/figma/PricingSection';
import { ComplianceSection } from './components/figma/ComplianceSection';
import { SocialProofSection } from './components/figma/SocialProofSection';
import { FAQSection } from './components/figma/FAQSection';
import { CTASection } from './components/figma/CTASection';
import { Footer } from './components/figma/Footer';
import { InstallationGuide } from './components/figma/InstallationGuide';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { CookiePolicy } from './pages/CookiePolicy';
import { HelpCenter } from './pages/HelpCenter';
import { ContactSupport } from './pages/ContactSupport';
import { SystemStatus } from './pages/SystemStatus';

gsap.registerPlugin(ScrollTrigger);

// HomePage component containing all sections
function HomePage() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Smooth scroll
    gsap.to('html', { scrollBehavior: 'smooth', duration: 0 });

    // ========== HERO ANIMATIONS ==========
    
    // Animated background elements - continuous floating
    gsap.to('.hero-bg-1', {
      x: 100,
      y: -100,
      scale: 1.2,
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.hero-bg-2', {
      x: -100,
      y: 100,
      scale: 1.3,
      duration: 25,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.hero-bg-3', {
      scale: 1.1,
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Hero entrance sequence
    const heroTl = gsap.timeline({ delay: 0.3 });
    
    // Ensure hero text is visible even if timeline doesn't run
    gsap.set(['.hero-title h1', '.hero-title p', '.hero-cta button', '.hero-stats > div'], { opacity: 1 });

    heroTl
      .from('.hero-badge', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
      .from('.hero-title h1', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.4')
      .from('.hero-title p', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.6')
      .from('.hero-cta button', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }, '-=0.4')
      .from('.hero-stats > div', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      }, '-=0.3');

    // Extension window animation
    gsap.from('.extension-window', {
      x: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.8
    });

    gsap.from('.monitor-card', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 1.5
    });

    gsap.from('.notification-card', {
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 2
    });

    // Floating notifications
    gsap.to('.floating-notification-1', {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.floating-notification-2', {
      y: -15,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.5
    });

    // Notification pulse
    gsap.to('.notification-pulse', {
      scale: 1.5,
      opacity: 0,
      duration: 1.5,
      repeat: -1,
      ease: 'power2.out'
    });

    // ========== CREATIVE SCROLL ANIMATIONS ==========

    // PROBLEM SECTION - Parallax text movement
    gsap.to('.problem-subtitle', {
      scrollTrigger: {
        trigger: '.problem-section',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      x: 50,
      ease: 'none'
    });

    gsap.from('.problem-badge', {
      scrollTrigger: {
        trigger: '.problem-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      rotation: -180,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });

    gsap.from('.problem-title', {
      scrollTrigger: {
        trigger: '.problem-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      immediateRender: false
    });

    gsap.from('.problem-description', {
      scrollTrigger: {
        trigger: '.problem-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
      immediateRender: false
    });
    
    gsap.from('.problem-card', {
      scrollTrigger: {
        trigger: '.problem-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 80,
      opacity: 0,
      rotation: 3,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      immediateRender: false
    });

    // BRIDGE SECTION - Smooth transition animations
    gsap.from('.bridge-title', {
      scrollTrigger: {
        trigger: '.bridge-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      immediateRender: false
    });

    gsap.from('.bridge-description', {
      scrollTrigger: {
        trigger: '.bridge-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
      immediateRender: false
    });

    gsap.from('.bridge-card', {
      scrollTrigger: {
        trigger: '.bridge-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.2)',
      immediateRender: false
    });

    // SOLUTION SECTION - Scale and fade with parallax
    gsap.from('.solution-badge', {
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      rotation: 360,
      duration: 0.8,
      ease: 'back.out(1.7)',
      immediateRender: false
    });

    gsap.from('.solution-title', {
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      immediateRender: false
    });

    // Parallax subtitle moving opposite direction
    gsap.to('.solution-subtitle', {
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      x: -50,
      ease: 'none'
    });

    gsap.from('.solution-description', {
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
      immediateRender: false
    });
    
    // Feature cards with 3D rotation effect
    gsap.from('.feature-card', {
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      rotateX: 45,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      immediateRender: false
    });

    // Parallax effect on feature icons
    gsap.utils.toArray<HTMLElement>('.feature-card').forEach((card) => {
      const icon = card.querySelector('.relative.inline-block');
      if (icon) {
        gsap.to(icon, {
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          },
          y: -40,
          rotation: 360
        });
      }
    });

    // HOW IT WORKS - Wave entrance
    gsap.from('.how-badge', {
      scrollTrigger: {
        trigger: '.how-it-works',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      rotation: -360,
      duration: 0.8,
      ease: 'back.out(1.7)',
      immediateRender: false
    });

    gsap.from('.how-title', {
      scrollTrigger: {
        trigger: '.how-it-works',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      immediateRender: false
    });

    // Horizontal parallax for subtitle
    gsap.to('.how-subtitle', {
      scrollTrigger: {
        trigger: '.how-it-works',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      x: 80,
      ease: 'none'
    });

    gsap.from('.how-description', {
      scrollTrigger: {
        trigger: '.how-it-works',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
      immediateRender: false
    });
    
    gsap.from('.step-item', {
      scrollTrigger: {
        trigger: '.how-it-works',
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      },
      scale: 0.5,
      opacity: 0,
      rotation: -15,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.4)',
      immediateRender: false
    });

    // DEMO SECTION - Creative animations
    gsap.from('.demo-badge', {
      scrollTrigger: {
        trigger: '.demo-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      rotation: 360,
      duration: 0.8,
      ease: 'back.out(1.7)',
      immediateRender: false
    });

    gsap.from('.demo-title', {
      scrollTrigger: {
        trigger: '.demo-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      immediateRender: false
    });

    // Parallax subtitle with opposite movement
    gsap.to('.demo-subtitle', {
      scrollTrigger: {
        trigger: '.demo-section',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      x: -60,
      ease: 'none'
    });

    gsap.from('.demo-description', {
      scrollTrigger: {
        trigger: '.demo-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
      immediateRender: false
    });

    // PRICING - Bounce in effect
    gsap.from('.pricing-badge', {
      scrollTrigger: {
        trigger: '.pricing-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      rotation: 180,
      duration: 0.8,
      ease: 'back.out(1.7)',
      immediateRender: false
    });

    gsap.from('.pricing-title', {
      scrollTrigger: {
        trigger: '.pricing-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      immediateRender: false
    });

    gsap.from('.pricing-description', {
      scrollTrigger: {
        trigger: '.pricing-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
      immediateRender: false
    });
    
    gsap.from('.pricing-card', {
      scrollTrigger: {
        trigger: '.pricing-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 80,
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.2)',
      immediateRender: false
    });

    // ========== STATS COUNTER ==========
    
    const animateCounters = () => {
      const counters = document.querySelectorAll('.counter');
      counters.forEach((counter) => {
        const target = counter.getAttribute('data-target') || '';
        const value = parseInt(target.replace(/[^\d]/g, '')) || 0;
        const suffix = target.replace(/\d/g, '');
        
        gsap.to(counter, {
          textContent: value,
          duration: 2.5,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function() {
            const current = Math.round(parseFloat((counter as HTMLElement).textContent || '0'));
            (counter as HTMLElement).textContent = current + suffix;
          }
        });
      });
    };

    ScrollTrigger.create({
      trigger: '.stats-section',
      start: 'top 80%',
      onEnter: animateCounters,
      once: true
    });

    // ========== TESTIMONIALS ==========
    
    gsap.from('.testimonial-card', {
      scrollTrigger: {
        trigger: '.social-proof-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      rotation: 2,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      immediateRender: false
    });

    // ========== INTERACTIVE HOVER EFFECTS ==========
    
    // Feature cards - lift and glow
    document.querySelectorAll('.feature-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -12,
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    });

    // Problem cards - subtle scale
    document.querySelectorAll('.problem-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.03,
          y: -5,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Bridge cards - subtle lift
    document.querySelectorAll('.bridge-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Step items - bounce
    document.querySelectorAll('.step-item').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          y: -10,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });
      });
      
      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Monitor cards
    document.querySelectorAll('.monitor-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          x: 5,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Pricing cards - pop effect
    document.querySelectorAll('.pricing-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          scale: 1.05,
          duration: 0.3,
          ease: 'back.out(1.4)'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      heroTl.kill();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ProblemSection />
      <BridgeSection />
      <SolutionSection />
      <DemoSection />
      <HowItWorksSection />
      <PricingSection />
      <ComplianceSection />
      <SocialProofSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}

// Main App component with routing
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/install" element={
          <>
            <Header />
            <InstallationGuide />
            <Footer />
          </>
        } />
        <Route path="/privacy" element={
          <>
            <Header />
            <PrivacyPolicy />
            <Footer />
          </>
        } />
        <Route path="/terms" element={
          <>
            <Header />
            <TermsOfService />
            <Footer />
          </>
        } />
        <Route path="/cookies" element={
          <>
            <Header />
            <CookiePolicy />
            <Footer />
          </>
        } />
        <Route path="/help" element={
          <>
            <Header />
            <HelpCenter />
            <Footer />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Header />
            <ContactSupport />
            <Footer />
          </>
        } />
        <Route path="/status" element={
          <>
            <Header />
            <SystemStatus />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}