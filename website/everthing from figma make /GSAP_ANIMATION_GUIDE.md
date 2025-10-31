# GSAP Animation Reference Guide
## TestNotifier.co.uk

Complete documentation of all GSAP animations, effects, and interactions implemented across the landing page.

---

## Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [Hero Section Animations](#hero-section-animations)
3. [Scroll-Triggered Animations by Section](#scroll-triggered-animations-by-section)
4. [Interactive Hover Effects](#interactive-hover-effects)
5. [Counter Animations](#counter-animations)
6. [Animation Parameters Reference](#animation-parameters-reference)
7. [Best Practices & Guidelines](#best-practices--guidelines)

---

## Setup & Configuration

### File Location
**Primary Animation File:** `/App.tsx`

### GSAP Imports
```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

### Accessibility: Reduced Motion Support
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) return;
```
**Location:** Lines 22-23 in `/App.tsx`

All animations are disabled if user has enabled "Reduce Motion" in their system preferences.

---

## Hero Section Animations

### 1. Background Floating Elements

#### Hero Background Element 1
```typescript
gsap.to('.hero-bg-1', {
  x: 100,
  y: -100,
  scale: 1.2,
  duration: 20,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut'
});
```
**Location:** Lines 31-39  
**Element:** `.hero-bg-1`  
**Effect:** Continuous floating diagonal movement  
**Duration:** 20 seconds per cycle  
**Repeat:** Infinite loop with yoyo (returns to start)  
**Purpose:** Adds life and movement to hero background

#### Hero Background Element 2
```typescript
gsap.to('.hero-bg-2', {
  x: -100,
  y: 100,
  scale: 1.3,
  duration: 25,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut'
});
```
**Location:** Lines 41-49  
**Element:** `.hero-bg-2`  
**Effect:** Opposite diagonal movement (creates parallax feel)  
**Duration:** 25 seconds (different from bg-1 for organic feel)  
**Scale:** Grows to 1.3x original size

#### Hero Background Element 3
```typescript
gsap.to('.hero-bg-3', {
  scale: 1.1,
  duration: 15,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut'
});
```
**Location:** Lines 51-57  
**Element:** `.hero-bg-3`  
**Effect:** Gentle breathing/pulsing scale animation  
**Duration:** 15 seconds (fastest of the three)  
**Purpose:** Adds subtle depth without positional movement

---

### 2. Hero Entrance Sequence

#### Timeline Configuration
```typescript
const heroTl = gsap.timeline({ delay: 0.3 });
```
**Type:** Sequential timeline animation  
**Initial Delay:** 0.3 seconds  
**Purpose:** Coordinated entrance of hero elements in sequence

#### Hero Badge Animation
```typescript
heroTl.from('.hero-badge', {
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out'
})
```
**Location:** Lines 63-68  
**Element:** `.hero-badge` ("🚗 Trusted by 500+ UK Learners")  
**Movement:** Slides up 30px while fading in  
**Duration:** 0.8 seconds  
**Easing:** power3.out (strong deceleration)  
**Purpose:** First element to appear, draws attention

#### Hero Title Animation
```typescript
.from('.hero-title h1', {
  y: 60,
  opacity: 0,
  duration: 1,
  ease: 'power3.out'
}, '-=0.4')
```
**Location:** Lines 69-74  
**Element:** `.hero-title h1` (Main headline)  
**Movement:** Slides up 60px while fading in  
**Duration:** 1 second (longest for emphasis)  
**Overlap:** Starts 0.4s before previous animation ends  
**Purpose:** Main headline with impactful entrance

#### Hero Subtitle Animation
```typescript
.from('.hero-title p', {
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: 'power2.out'
}, '-=0.6')
```
**Location:** Lines 75-80  
**Element:** `.hero-title p` (Supporting text)  
**Movement:** Slides up 30px while fading in  
**Overlap:** Starts 0.6s before previous animation ends  
**Purpose:** Supporting text follows quickly

#### Hero CTA Buttons Animation
```typescript
.from('.hero-cta button', {
  y: 20,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: 'back.out(1.7)'
}, '-=0.4')
```
**Location:** Lines 81-87  
**Element:** `.hero-cta button` (Both CTA buttons)  
**Movement:** Slides up 20px with bounce effect  
**Stagger:** 0.1s delay between each button  
**Easing:** back.out(1.7) creates bounce/elastic effect  
**Purpose:** Bouncy entrance draws attention to CTAs

#### Hero Stats Animation
```typescript
.from('.hero-stats > div', {
  y: 20,
  opacity: 0,
  duration: 0.5,
  stagger: 0.1,
  ease: 'power2.out'
}, '-=0.3')
```
**Location:** Lines 88-94  
**Element:** `.hero-stats > div` (3 stat cards)  
**Movement:** Slides up 20px while fading in  
**Stagger:** 0.1s between each stat  
**Purpose:** Final elements in hero entrance sequence

---

### 3. Extension Window & Visual Elements

#### Extension Window
```typescript
gsap.from('.extension-window', {
  x: 100,
  opacity: 0,
  duration: 1.2,
  ease: 'power3.out',
  delay: 0.8
});
```
**Location:** Lines 97-103  
**Element:** `.extension-window` (Right side demo UI)  
**Movement:** Slides in from right 100px  
**Delay:** 0.8s (appears after hero text)  
**Duration:** 1.2s (slower for smoothness)  
**Purpose:** Main visual demo element entrance

#### Monitor Cards
```typescript
gsap.from('.monitor-card', {
  y: 20,
  opacity: 0,
  duration: 0.6,
  stagger: 0.15,
  ease: 'power2.out',
  delay: 1.5
});
```
**Location:** Lines 105-112  
**Element:** `.monitor-card` (Test centre monitoring cards)  
**Movement:** Slides up 20px while fading in  
**Stagger:** 0.15s between each card  
**Delay:** 1.5s (appears after extension window)  
**Purpose:** Displays monitoring activity

#### Notification Card
```typescript
gsap.from('.notification-card', {
  scale: 0.9,
  opacity: 0,
  duration: 0.6,
  ease: 'back.out(1.7)',
  delay: 2
});
```
**Location:** Lines 114-120  
**Element:** `.notification-card` (SMS/Email notification)  
**Effect:** Pops in with scale + bounce  
**Delay:** 2s (final element in sequence)  
**Easing:** back.out creates bounce effect  
**Purpose:** Shows notification delivery

---

### 4. Floating & Continuous Animations

#### Floating Notification 1
```typescript
gsap.to('.floating-notification-1', {
  y: -20,
  duration: 3,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut'
});
```
**Location:** Lines 123-129  
**Element:** `.floating-notification-1`  
**Movement:** Floats up/down 20px  
**Duration:** 3 seconds per cycle  
**Repeat:** Infinite loop  
**Purpose:** Creates floating effect on notification cards

#### Floating Notification 2
```typescript
gsap.to('.floating-notification-2', {
  y: -15,
  duration: 2.5,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut',
  delay: 0.5
});
```
**Location:** Lines 131-138  
**Element:** `.floating-notification-2`  
**Movement:** Floats up/down 15px (slightly less)  
**Duration:** 2.5s (different timing for organic feel)  
**Delay:** 0.5s offset from notification-1  
**Purpose:** Creates staggered floating pattern

#### Notification Pulse
```typescript
gsap.to('.notification-pulse', {
  scale: 1.5,
  opacity: 0,
  duration: 1.5,
  repeat: -1,
  ease: 'power2.out'
});
```
**Location:** Lines 141-147  
**Element:** `.notification-pulse`  
**Effect:** Expanding ripple/pulse effect  
**Scale:** Grows from 1 to 1.5x  
**Opacity:** Fades from 1 to 0  
**Purpose:** Attention-grabbing pulse indicator

---

## Scroll-Triggered Animations by Section

### PROBLEM SECTION

#### Parallax Subtitle Movement
```typescript
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
```
**Location:** Lines 152-161  
**Element:** `.problem-subtitle`  
**Effect:** Horizontal parallax movement  
**Movement:** Moves 50px to the right as user scrolls  
**Scrub:** 1 (smooth 1-second lag for parallax feel)  
**Purpose:** Creates depth with horizontal movement

#### Problem Badge (Spinning Entrance)
```typescript
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
```
**Location:** Lines 163-173  
**Element:** `.problem-badge` ("The Problem")  
**Effect:** Spins in from 0 scale with -180° rotation  
**Easing:** back.out creates bounce/overshoot  
**Toggle Actions:** Plays on enter, reverses on scroll back up  
**Purpose:** Dramatic attention-grabbing entrance

#### Problem Title
```typescript
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
```
**Location:** Lines 175-186  
**Element:** `.problem-title`  
**Movement:** Slides up 100px while fading in  
**ImmediateRender:** false (prevents initial opacity: 0)  
**Purpose:** Main section title entrance

#### Problem Description
```typescript
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
```
**Location:** Lines 188-200  
**Element:** `.problem-description`  
**Movement:** Slides up 60px with fade  
**Delay:** 0.2s after title  
**Purpose:** Supporting text follows title

#### Problem Cards (Staggered)
```typescript
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
```
**Location:** Lines 202-215  
**Element:** `.problem-card` (4 problem cards)  
**Movement:** Slides up 80px with slight rotation  
**Stagger:** 0.15s between each card  
**Rotation:** 3° adds playful tilt during entrance  
**Purpose:** Cards appear one after another

---

### BRIDGE SECTION

#### Bridge Title
```typescript
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
```
**Location:** Lines 218-229  
**Element:** `.bridge-title`  
**Movement:** Slides up 60px with fade  
**Purpose:** Section title entrance

#### Bridge Description
```typescript
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
```
**Location:** Lines 231-243  
**Element:** `.bridge-description`  
**Movement:** Slides up 40px with fade  
**Delay:** 0.2s after title  
**Purpose:** Supporting text

#### Bridge Cards (Scale + Fade)
```typescript
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
```
**Location:** Lines 245-258  
**Element:** `.bridge-card` (4 value prop cards)  
**Movement:** Slides up + scales from 0.9 to 1  
**Stagger:** 0.1s between cards  
**Easing:** back.out creates subtle bounce  
**Purpose:** Cards pop in with emphasis

---

### SOLUTION SECTION (Features)

#### Solution Badge (Spinning)
```typescript
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
```
**Location:** Lines 261-272  
**Element:** `.solution-badge` ("The Solution")  
**Effect:** Spins in from 0 scale with full 360° rotation  
**Purpose:** Dramatic badge entrance

#### Solution Title
```typescript
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
```
**Location:** Lines 274-285  
**Element:** `.solution-title`  
**Movement:** Slides up 100px with fade  
**Purpose:** Main section title

#### Parallax Subtitle (Opposite Direction)
```typescript
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
```
**Location:** Lines 288-297  
**Element:** `.solution-subtitle`  
**Movement:** Moves 50px to the LEFT (opposite of problem section)  
**Scrub:** Smooth parallax effect  
**Purpose:** Creates visual variation and depth

#### Solution Description
```typescript
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
```
**Location:** Lines 299-311  
**Element:** `.solution-description`  
**Movement:** Slides up 60px with fade  
**Delay:** 0.2s after title

#### Feature Cards (3D Rotation)
```typescript
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
```
**Location:** Lines 314-327  
**Element:** `.feature-card` (6 feature cards)  
**Effect:** Slides up + 3D flip rotation (rotateX: 45°)  
**Stagger:** 0.1s between each card  
**Purpose:** Creates impressive 3D flip-in effect

#### Feature Icon Parallax
```typescript
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
```
**Location:** Lines 330-344  
**Element:** Icons inside `.feature-card`  
**Effect:** Moves up 40px + full 360° rotation as user scrolls  
**Scrub:** Tied directly to scroll position  
**Purpose:** Individual parallax on each icon for extra polish

---

### HOW IT WORKS SECTION

#### How Badge (Spinning)
```typescript
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
```
**Location:** Lines 347-358  
**Element:** `.how-badge` ("Simple Process")  
**Effect:** Spins in with -360° rotation (opposite direction)  
**Purpose:** Badge entrance with rotation variety

#### How Title
```typescript
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
```
**Location:** Lines 360-371  
**Element:** `.how-title`  
**Movement:** Slides up 100px with fade

#### Parallax Subtitle (Right Movement)
```typescript
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
```
**Location:** Lines 374-383  
**Element:** `.how-subtitle`  
**Movement:** Moves 80px to the RIGHT  
**Purpose:** Alternating parallax direction pattern

#### How Description
```typescript
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
```
**Location:** Lines 385-397  
**Element:** `.how-description`  
**Movement:** Slides up 60px with fade

#### Step Items (Rotate + Scale)
```typescript
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
```
**Location:** Lines 399-412  
**Element:** `.step-item` (3 steps)  
**Effect:** Scales from 0.5 + rotates from -15°  
**Stagger:** 0.15s between each step  
**Easing:** back.out creates bounce effect  
**Purpose:** Steps appear with playful rotation

---

### DEMO SECTION

#### Demo Badge (Spinning)
```typescript
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
```
**Location:** Lines 415-426  
**Element:** `.demo-badge` ("See It In Action")  
**Effect:** Spins in with 360° rotation

#### Demo Title
```typescript
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
```
**Location:** Lines 428-439  
**Element:** `.demo-title`  
**Movement:** Slides up 100px with fade

#### Parallax Subtitle (Left Movement)
```typescript
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
```
**Location:** Lines 442-451  
**Element:** `.demo-subtitle`  
**Movement:** Moves 60px to the LEFT  
**Purpose:** Continues alternating parallax pattern

#### Demo Description
```typescript
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
```
**Location:** Lines 453-465  
**Element:** `.demo-description`  
**Movement:** Slides up 60px with fade

---

### PRICING SECTION

#### Pricing Badge
```typescript
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
```
**Location:** Lines 468-479  
**Element:** `.pricing-badge` ("Simple Pricing")  
**Effect:** Spins in with 180° rotation (half rotation variation)

#### Pricing Title
```typescript
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
```
**Location:** Lines 481-492  
**Element:** `.pricing-title`  
**Movement:** Slides up 100px with fade

#### Pricing Description
```typescript
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
```
**Location:** Lines 494-506  
**Element:** `.pricing-description`  
**Movement:** Slides up 60px with fade

#### Pricing Cards (Scale Effect)
```typescript
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
```
**Location:** Lines 508-521  
**Element:** `.pricing-card` (3 pricing tiers)  
**Effect:** Slides up + scales from 0.8 to 1  
**Stagger:** 0.15s between each card  
**Easing:** back.out creates bounce  
**Purpose:** Cards pop in with emphasis

---

### SOCIAL PROOF SECTION (Testimonials)

#### Testimonial Cards
```typescript
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
```
**Location:** Lines 554-567  
**Element:** `.testimonial-card` (6 testimonials)  
**Movement:** Slides up 60px with slight 2° rotation  
**Stagger:** 0.15s between each card  
**Purpose:** Testimonials appear one by one

---

## Counter Animations

### Stats Counter Function

#### Counter Animation Logic
```typescript
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
```
**Location:** Lines 525-543  
**Element:** `.counter` elements with `data-target` attribute  
**Effect:** Animates numbers from 0 to target value  
**Duration:** 2.5 seconds  
**Snap:** Ensures integer values only  
**Purpose:** Impressive counting animation for stats

#### Counter Trigger
```typescript
ScrollTrigger.create({
  trigger: '.stats-section',
  start: 'top 80%',
  onEnter: animateCounters,
  once: true
});
```
**Location:** Lines 545-550  
**Trigger:** `.stats-section`  
**Fires:** When section enters viewport  
**Once:** Only plays once (doesn't repeat on scroll up/down)  
**Purpose:** Triggers counter animation when stats become visible

---

## Interactive Hover Effects

All hover animations use `mouseenter` and `mouseleave` event listeners.

### 1. Feature Cards Hover

```typescript
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
```
**Location:** Lines 572-590  
**Element:** `.feature-card`  
**Hover Effect:**  
- Lifts 12px upward  
- Scales to 1.02x (subtle growth)  
**Duration:** 0.4 seconds  
**Purpose:** Strong lift effect for emphasis

---

### 2. Problem Cards Hover

```typescript
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
```
**Location:** Lines 593-611  
**Element:** `.problem-card`  
**Hover Effect:**  
- Scales to 1.03x  
- Lifts 5px upward (subtle)  
**Duration:** 0.3 seconds  
**Purpose:** Gentle hover feedback

---

### 3. Bridge Cards Hover

```typescript
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
```
**Location:** Lines 614-632  
**Element:** `.bridge-card`  
**Hover Effect:**  
- Lifts 8px upward  
- Scales to 1.02x  
**Duration:** 0.3 seconds  
**Purpose:** Medium lift effect

---

### 4. Step Items Hover (Bounce)

```typescript
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
```
**Location:** Lines 635-651  
**Element:** `.step-item`  
**Hover Effect:**  
- Bounces up 10px  
- Uses elastic back.out(1.7) easing  
**Purpose:** Playful bounce effect for steps

---

### 5. Monitor Cards Hover (Slide)

```typescript
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
```
**Location:** Lines 654-670  
**Element:** `.monitor-card`  
**Hover Effect:**  
- Slides 5px to the right  
- No vertical movement  
**Purpose:** Subtle horizontal slide (unique from other cards)

---

### 6. Pricing Cards Hover (Pop)

```typescript
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
```
**Location:** Lines 673-691  
**Element:** `.pricing-card`  
**Hover Effect:**  
- Lifts 8px upward  
- Scales to 1.05x (strongest scale)  
- Uses elastic back.out(1.4) for bounce  
**Purpose:** Strong pop effect for CTAs

---

## CSS-Based Animations (In Components)

### Header Scroll Effect

**File:** `/components/Header.tsx`  
**Location:** Lines 18-22

```typescript
className={`header fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
  scrolled 
    ? 'bg-white/80 backdrop-blur-xl shadow-lg py-3' 
    : 'bg-transparent py-6'
}`}
```

**Effect:** Header transitions when scrolling past 50px:
- Background: transparent → white/80 with blur
- Shadow appears
- Padding reduces: py-6 → py-3
- Duration: 500ms
- Uses React state + CSS transitions (not GSAP)

### Logo Hover Effect

**File:** `/components/Header.tsx`  
**Location:** Lines 28-32

```typescript
<div className="absolute inset-0 bg-gradient-to-br from-[#1d70b8] to-[#2e8bc0] rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
<div className="relative w-11 h-11 bg-gradient-to-br from-[#1d70b8] to-[#2e8bc0] rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
```

**Effect:** Logo glow and scale on hover:
- Glow opacity: 50% → 75%
- Scale: 1 → 1.1
- Uses CSS transitions (not GSAP)

---

## Animation Parameters Reference

### Easing Functions Used

| Easing | Use Case | Feel |
|--------|----------|------|
| `power3.out` | Titles, large movements | Strong deceleration, impactful |
| `power2.out` | Descriptions, cards | Smooth deceleration |
| `back.out(1.7)` | Badges, buttons, CTAs | Elastic bounce, playful |
| `back.out(1.4)` | Steps, pricing cards | Subtle bounce |
| `back.out(1.2)` | Bridge cards | Very subtle bounce |
| `sine.inOut` | Continuous loops | Smooth oscillation |
| `none` | Parallax scrolling | Linear movement |

### Duration Patterns

| Duration | Usage |
|----------|-------|
| 0.3s | Quick hover effects |
| 0.4s | Standard hover effects |
| 0.6s | Fast entrance animations |
| 0.8s | Standard entrance animations |
| 1.0s - 1.2s | Major title/hero elements |
| 2.5s | Counter animations |
| 15s - 25s | Background floating elements |

### Stagger Timings

| Stagger | Usage |
|---------|-------|
| 0.1s | Buttons, stats, bridge cards |
| 0.15s | Feature cards, problem cards, steps |

### Movement Distances

| Distance | Element Type |
|----------|--------------|
| 20-30px | Small elements (badges, buttons) |
| 40-60px | Descriptions, supporting text |
| 80-100px | Main titles, headlines |

---

## ScrollTrigger Configuration Patterns

### Standard ScrollTrigger
```typescript
scrollTrigger: {
  trigger: '.section-name',
  start: 'top 80%',
  toggleActions: 'play none none reverse'
}
```
**Start:** Animation begins when section top hits 80% down viewport  
**Toggle Actions:** `play none none reverse`
- Play on enter
- Nothing on leave
- Nothing on enter back
- Reverse on leave back

### Parallax ScrollTrigger
```typescript
scrollTrigger: {
  trigger: '.section-name',
  start: 'top 80%',
  end: 'bottom 20%',
  scrub: 1
}
```
**Scrub:** Animation tied to scroll position with 1s smooth lag  
**End:** Defines range for parallax effect

### Once-Only Trigger (Counters)
```typescript
ScrollTrigger.create({
  trigger: '.stats-section',
  start: 'top 80%',
  onEnter: animateCounters,
  once: true
});
```
**Once:** Animation only plays first time, won't repeat

---

## Component-Level Animation Classes

Components must include these classes for animations to work:

### Required Class Names by Section

**Hero Section:**
- `.hero-badge`
- `.hero-title h1`
- `.hero-title p`
- `.hero-cta button`
- `.hero-stats > div`
- `.hero-bg-1`, `.hero-bg-2`, `.hero-bg-3`
- `.extension-window`
- `.monitor-card`
- `.notification-card`
- `.floating-notification-1`, `.floating-notification-2`
- `.notification-pulse`

**Problem Section:**
- `.problem-section`
- `.problem-badge`
- `.problem-title`
- `.problem-subtitle`
- `.problem-description`
- `.problem-card`

**Bridge Section:**
- `.bridge-section`
- `.bridge-title`
- `.bridge-description`
- `.bridge-card`

**Solution Section:**
- `.features-section`
- `.solution-badge`
- `.solution-title`
- `.solution-subtitle`
- `.solution-description`
- `.feature-card`

**Demo Section:**
- `.demo-section`
- `.demo-badge`
- `.demo-title`
- `.demo-subtitle`
- `.demo-description`

**How It Works:**
- `.how-it-works`
- `.how-badge`
- `.how-title`
- `.how-subtitle`
- `.how-description`
- `.step-item`

**Pricing:**
- `.pricing-section`
- `.pricing-badge`
- `.pricing-title`
- `.pricing-description`
- `.pricing-card`

**Social Proof:**
- `.social-proof-section`
- `.testimonial-card`

**Stats/Counters:**
- `.stats-section`
- `.counter` (with `data-target="500+"` attribute)

---

## Best Practices & Guidelines

### 1. Accessibility First
✅ **DO:**
- Always check for `prefers-reduced-motion`
- Disable all animations if user preference is set
- Provide full functionality without animations

### 2. Performance Optimization
✅ **DO:**
- Use GSAP's `will-change` optimization (automatic)
- Keep animations under 1s for entrance effects
- Use `immediateRender: false` on scroll-triggered `.from()` animations

❌ **DON'T:**
- Animate too many properties simultaneously
- Create hundreds of ScrollTriggers without cleanup

### 3. Cleanup
✅ **DO:**
```typescript
return () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  heroTl.kill();
};
```
Always cleanup ScrollTriggers and timelines in `useEffect` return

### 4. Toggle Actions Pattern
```
'play none none reverse'
```
- **Enter:** play
- **Leave:** none
- **Enter Back:** none  
- **Leave Back:** reverse

This creates smooth forward/backward scroll behavior.

### 5. Stagger for Lists
When animating multiple similar elements:
```typescript
stagger: 0.1 - 0.15
```
Creates sequential appearance, not overwhelming

### 6. Parallax Alternating Pattern
Alternate parallax directions across sections:
- Problem: right (+50px)
- Solution: left (-50px)
- How It Works: right (+80px)
- Demo: left (-60px)

Creates visual rhythm and prevents monotony.

### 7. Consistent Movement Distances
- Badges/Small: 20-30px
- Text/Medium: 40-60px
- Titles/Large: 80-100px

### 8. Bounce Intensity
```
back.out(1.2) - subtle bounce
back.out(1.4) - medium bounce
back.out(1.7) - strong bounce
```
Use stronger bounce for CTAs and important elements.

---

## Debugging Tips

### 1. Check if ScrollTrigger is firing
```typescript
scrollTrigger: {
  trigger: '.my-section',
  start: 'top 80%',
  markers: true  // ADD THIS to see trigger points
}
```

### 2. Test single animation
Comment out all other animations and test one at a time.

### 3. Verify class names
Use browser DevTools to confirm elements have correct classes.

### 4. Check immediateRender
If elements flash visible then animate, ensure:
```typescript
immediateRender: false
```

### 5. Timeline debugging
```typescript
const tl = gsap.timeline({ delay: 0.3 });
console.log(tl.duration()); // Check total duration
```

---

## Adding New Animations

### Template for Scroll Animation
```typescript
gsap.from('.my-element', {
  scrollTrigger: {
    trigger: '.my-section',
    start: 'top 75%',
    toggleActions: 'play none none reverse'
  },
  y: 60,
  opacity: 0,
  duration: 0.8,
  ease: 'power2.out',
  immediateRender: false
});
```

### Template for Hover Effect
```typescript
document.querySelectorAll('.my-card').forEach((card) => {
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
```

### Template for Continuous Loop
```typescript
gsap.to('.my-floating-element', {
  y: -20,
  duration: 3,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut'
});
```

---

## Animation Performance Metrics

### Typical Frame Rates
- **Hero Animations:** 60fps (smooth entrance)
- **Scroll Animations:** 60fps (GSAP optimization)
- **Hover Effects:** 60fps (hardware accelerated)
- **Parallax Scrub:** 60fps (smooth scrolling)

### Properties That Animate Well (Hardware Accelerated)
✅ `transform` (x, y, scale, rotation)  
✅ `opacity`  
✅ `filter` (blur, brightness)

### Properties to Avoid
❌ `width`, `height` (causes layout reflow)  
❌ `top`, `left` (not hardware accelerated)  
❌ `margin`, `padding` (causes layout reflow)

---

## Summary Statistics

### Total Animations Implemented

| Category | Count |
|----------|-------|
| Hero entrance animations | 9 |
| Continuous floating/pulse animations | 6 |
| Scroll-triggered section animations | 35+ |
| Hover effects | 6 types |
| Counter animations | 1 function |
| Parallax effects | 5 |
| **TOTAL** | **60+ unique animations** |

### Animation Distribution by Section

| Section | Animations |
|---------|------------|
| Hero | 15 (entrance + continuous) |
| Problem | 5 |
| Bridge | 3 |
| Solution | 6 (including parallax) |
| Demo | 4 |
| How It Works | 5 |
| Pricing | 4 |
| Social Proof | 1 |
| Counters | 1 |
| Hover Effects | 6 |

---

## Version History

**v1.0** - October 17, 2025
- Initial comprehensive GSAP animation system
- 60+ animations across 12 sections
- Full ScrollTrigger integration
- Interactive hover effects
- Reduced motion support

---

*For questions about animations, refer to `/App.tsx` lines 21-698*  
*Last Updated: October 17, 2025*
