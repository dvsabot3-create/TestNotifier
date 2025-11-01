# TestNotifier.co.uk - Complete Production Code Export

This document contains all production-ready React + Tailwind code for the TestNotifier.co.uk landing page.

---

## Table of Contents

1. [Main App Component](#main-app-component)
2. [Styles](#styles)
3. [Page Components](#page-components)
   - [Header](#header)
   - [Hero Section](#hero-section)
   - [Problem Section](#problem-section)
   - [Bridge Section](#bridge-section)
   - [Solution Section](#solution-section)
   - [Demo Section](#demo-section)
   - [How It Works Section](#how-it-works-section)
   - [Pricing Section](#pricing-section)
   - [Compliance Section](#compliance-section)
   - [Social Proof Section](#social-proof-section)
   - [FAQ Section](#faq-section)
   - [CTA Section](#cta-section)
   - [Footer](#footer)
4. [UI Components](#ui-components)
5. [Utility Components](#utility-components)

---

## Project Structure

```
testnotifier/
├── App.tsx                          # Main application with GSAP animations
├── styles/
│   └── globals.css                  # Global styles, tokens, typography
├── components/
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── ProblemSection.tsx
│   ├── BridgeSection.tsx
│   ├── SolutionSection.tsx
│   ├── DemoSection.tsx
│   ├── HowItWorksSection.tsx
│   ├── PricingSection.tsx
│   ├── ComplianceSection.tsx
│   ├── SocialProofSection.tsx
│   ├── FAQSection.tsx
│   ├── CTASection.tsx
│   ├── Footer.tsx
│   ├── figma/
│   │   └── ImageWithFallback.tsx
│   └── ui/
│       ├── button.tsx
│       ├── badge.tsx
│       ├── card.tsx
│       ├── accordion.tsx
│       └── ... (other shadcn components)
└── package.json
```

---

## Installation & Dependencies

### package.json

```json
{
  "name": "testnotifier-landing",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "gsap": "^3.12.5",
    "lucide-react": "^0.344.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.2.0",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.18"
  }
}
```

### Installation Commands

```bash
npm install
# or
yarn install
# or
pnpm install
```

---

## Main App Component

### `/App.tsx`

```tsx
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { BridgeSection } from './components/BridgeSection';
import { SolutionSection } from './components/SolutionSection';
import { DemoSection } from './components/DemoSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PricingSection } from './components/PricingSection';
import { ComplianceSection } from './components/ComplianceSection';
import { SocialProofSection } from './components/SocialProofSection';
import { FAQSection } from './components/FAQSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
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
```

---

## Styles

### `/styles/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@custom-variant dark (&:is(.dark *));

:root {
  --font-family: 'Inter', sans-serif;
  --font-size: 16px;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --card: #ffffff;
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: #030213;
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.0058 264.53);
  --secondary-foreground: #030213;
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --accent-foreground: #030213;
  --destructive: #d4183d;
  --destructive-foreground: #ffffff;
  --border: rgba(0, 0, 0, 0.1);
  --input: transparent;
  --input-background: #f3f3f5;
  --switch-background: #cbced4;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: #030213;
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-input-background: var(--input-background);
  --color-switch-background: var(--switch-background);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }
}

/**
 * Base typography. This is not applied to elements which have an ancestor with a Tailwind text class.
 */
@layer base {
  :where(:not(:has([class*=" text-"]), :not(:has([class^="text-"])))) {
    h1 {
      font-size: var(--text-2xl);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    h2 {
      font-size: var(--text-xl);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    h3 {
      font-size: var(--text-lg);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    h4 {
      font-size: var(--text-base);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    p {
      font-size: var(--text-base);
      font-weight: var(--font-weight-normal);
      line-height: 1.5;
    }

    label {
      font-size: var(--text-base);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    button {
      font-size: var(--text-base);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    input {
      font-size: var(--text-base);
      font-weight: var(--font-weight-normal);
      line-height: 1.5;
    }
  }
}

html {
  font-size: var(--font-size);
  font-family: var(--font-family);
  scroll-behavior: smooth;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  html {
    scroll-behavior: auto;
  }
}
```

---

**NOTE:** Due to the message length limit, I'll continue in the next message with all component code. This export document already contains:
- Complete App.tsx with all GSAP animations
- Complete globals.css with all styling
- Package.json and installation instructions
- Project structure

Would you like me to continue with all the remaining components (Header, HeroSection, ProblemSection, etc.)?
