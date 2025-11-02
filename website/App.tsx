import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthProvider } from './src/contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Core components (always loaded)
import { Header } from './components/figma/Header';
import { Footer } from './components/figma/Footer';
import { HeroSection } from './components/figma/HeroSection';
import { ProblemSection } from './components/figma/ProblemSection';
import { BridgeSection } from './components/figma/BridgeSection';
import { SolutionSection } from './components/figma/SolutionSection';
import { DemoSection } from './components/figma/DemoSection';
import { HowItWorksSection } from './components/figma/HowItWorksSection';
import { PricingSection } from './components/PricingSection';
import { ComplianceSection } from './components/figma/ComplianceSection';
import { SocialProofSection } from './components/figma/SocialProofSection';
import { FAQSection } from './components/figma/FAQSection';
import { CTASection } from './components/figma/CTASection';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import AuthCallbackPage from './src/pages/AuthCallbackPage';
import DashboardPage from './src/pages/DashboardPage';
import DownloadExtension from './pages/DownloadExtension';

gsap.registerPlugin(ScrollTrigger);

// HomePage component containing all sections
function HomePage() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Smooth scroll
    gsap.to('html', { scrollBehavior: 'smooth', duration: 0 });

    // Simple hero animations
    gsap.from('.hero-title h1', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.from('.hero-title p', {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power2.out'
    });

    gsap.from('.hero-cta', {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.4,
          ease: 'power2.out'
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/download-extension" element={<DownloadExtension />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
