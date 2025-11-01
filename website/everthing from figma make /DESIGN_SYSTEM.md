# TestNotifier.co.uk Design System

## Color Palette

### Primary Colors
```css
Primary Blue:    #1d70b8  /* Main brand color - CTA buttons, headings, links */
Success Green:   #28a745  /* Success states, positive indicators */
Warning Orange:  #ffc107  /* Alerts, warnings, highlights */
```

### Secondary Colors
```css
Dark Blue:       #2e8bc0  /* Gradient variations, hover states */
Light Blue:      #f0f7ff  /* Backgrounds, subtle highlights */
Blue 50:         #f8f9fa  /* Section backgrounds */
```

### Neutral Colors
```css
Gray 900:        #1a1a1a  /* Primary text, dark headings */
Gray 800:        #2c2c2c  /* Secondary headings */
Gray 700:        #4a4a4a  /* Body text */
Gray 600:        #6c757d  /* Muted text, descriptions */
Gray 500:        #adb5bd  /* Disabled text */
Gray 400:        #ced4da  /* Borders */
Gray 300:        #dee2e6  /* Light borders */
Gray 200:        #e9ecef  /* Card borders, dividers */
Gray 100:        #f1f3f5  /* Light backgrounds */
Gray 50:         #f8f9fa  /* Section backgrounds */
White:           #ffffff  /* Cards, primary backgrounds */
```

### Status Colors
```css
Error Red:       #dc3545  /* Error states, destructive actions */
Info Blue:       #17a2b8  /* Informational messages */
Yellow:          #ffc107  /* Warnings, pending states */
Green Light:     #d4edda  /* Success backgrounds */
Red Light:       #f8d7da  /* Error backgrounds */
Blue Light:      #d1ecf1  /* Info backgrounds */
```

### Gradients
```css
/* Primary Gradient */
background: linear-gradient(135deg, #1d70b8 0%, #2e8bc0 100%);

/* Success Gradient */
background: linear-gradient(135deg, #28a745 0%, #20c997 100%);

/* Warm Gradient */
background: linear-gradient(135deg, #1d70b8 0%, #28a745 100%);

/* Subtle Background Gradient */
background: linear-gradient(to bottom right, #ffffff, #f8f9fa, #ffffff);

/* Dark Gradient */
background: linear-gradient(to bottom right, #1a1a1a, #2c2c2c);

/* Section Transition Gradient */
background: linear-gradient(to bottom, #ffffff, #f0f7ff);
```

---

## Typography

### Font Family
```css
Font Stack: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Weight Range: 400, 500, 600, 700, 800
```

### Heading Styles

#### Heading 1 (Hero/Main)
```css
Font Size: 56px (3.5rem)
Desktop: text-5xl lg:text-6xl (48px / 60px)
Tablet: text-4xl (36px)
Mobile: text-3xl (30px)
Font Weight: 800 (font-extrabold)
Line Height: 1.1
Letter Spacing: -0.02em (tight)
Color: #1d70b8 or #1a1a1a
```

#### Heading 2 (Section Titles)
```css
Font Size: 48px (3rem)
Desktop: text-4xl lg:text-5xl (36px / 48px)
Tablet: text-3xl (30px)
Mobile: text-2xl (24px)
Font Weight: 700 (font-bold)
Line Height: 1.2
Color: #1d70b8 or #1a1a1a
```

#### Heading 3 (Card Titles)
```css
Font Size: 28px (1.75rem)
Desktop: text-2xl lg:text-3xl (24px / 30px)
Tablet: text-xl (20px)
Mobile: text-lg (18px)
Font Weight: 700 (font-bold)
Line Height: 1.3
Color: #1a1a1a or #1d70b8
```

#### Heading 4 (Small Headings)
```css
Font Size: 20px (1.25rem)
Desktop: text-xl (20px)
Tablet: text-lg (18px)
Mobile: text-base (16px)
Font Weight: 600 (font-semibold)
Line Height: 1.4
Color: #1a1a1a
```

### Body Text

#### Body Large (Intro/Lead)
```css
Font Size: 20px (1.25rem)
Desktop: text-xl (20px)
Tablet: text-lg (18px)
Mobile: text-base (16px)
Font Weight: 400 (font-normal)
Line Height: 1.7 (leading-relaxed)
Color: #6c757d
```

#### Body Regular
```css
Font Size: 16px (1rem)
Desktop: text-base (16px)
Tablet: text-base (16px)
Mobile: text-sm (14px)
Font Weight: 400 (font-normal)
Line Height: 1.6 (leading-normal)
Color: #4a4a4a or #6c757d
```

#### Body Small
```css
Font Size: 14px (0.875rem)
Desktop: text-sm (14px)
Tablet: text-sm (14px)
Mobile: text-xs (12px)
Font Weight: 400 (font-normal)
Line Height: 1.5
Color: #6c757d
```

#### Caption/Fine Print
```css
Font Size: 12px (0.75rem)
Desktop: text-xs (12px)
Font Weight: 400 (font-normal)
Line Height: 1.4
Color: #adb5bd
```

### Special Text Styles

#### Badges/Labels
```css
Font Size: 14px (0.875rem)
Font Weight: 500 (font-medium)
Text Transform: none
Padding: 8px 16px (px-4 py-2)
Border Radius: 9999px (rounded-full)
```

#### Buttons
```css
Font Size: 16px (1rem)
Font Weight: 600 (font-semibold)
Letter Spacing: 0.01em
Text Transform: none
```

#### Links
```css
Font Size: Inherit
Font Weight: 500 (font-medium)
Color: #1d70b8
Text Decoration: none
Hover: underline, color: #2e8bc0
Transition: all 0.2s ease
```

---

## Spacing System

### Section Spacing
```css
/* Large Sections (Hero, Main Features) */
Padding Top/Bottom: 80px (py-20)
Desktop: py-20 (80px)
Tablet: py-16 (64px)
Mobile: py-12 (48px)

/* Medium Sections (Standard) */
Padding Top/Bottom: 64px (py-16)
Desktop: py-16 (64px)
Tablet: py-12 (48px)
Mobile: py-8 (32px)

/* Small Sections (Compact) */
Padding Top/Bottom: 48px (py-12)
Desktop: py-12 (48px)
Tablet: py-8 (32px)
Mobile: py-6 (24px)

/* Section Horizontal Padding */
Padding Left/Right: 16px (px-4) on mobile
Padding Left/Right: 24px (px-6) on tablet
```

### Card Spacing
```css
/* Large Cards */
Padding: 32px (p-8)
Desktop: p-8 (32px)
Tablet: p-6 (24px)
Mobile: p-4 (16px)

/* Medium Cards */
Padding: 24px (p-6)
Desktop: p-6 (24px)
Tablet: p-5 (20px)
Mobile: p-4 (16px)

/* Small Cards */
Padding: 16px (p-4)
All Sizes: p-4 (16px)

/* Card Border Radius */
Large: 24px (rounded-3xl)
Medium: 16px (rounded-2xl)
Small: 12px (rounded-xl)
```

### Gap Between Elements
```css
/* Section Element Gaps */
Large Gap: 48px (gap-12)
Medium Gap: 32px (gap-8)
Small Gap: 24px (gap-6)
Compact Gap: 16px (gap-4)

/* Grid Gaps */
Default Grid Gap: 24px (gap-6)
Dense Grid Gap: 16px (gap-4)
Loose Grid Gap: 32px (gap-8)

/* Stack Gaps (Vertical) */
Title to Subtitle: 24px (mb-6)
Subtitle to Description: 16px (mb-4)
Description to CTA: 32px (mb-8)
Between Paragraphs: 16px (mb-4)

/* Inline Gaps (Horizontal) */
Icon to Text: 12px (gap-3)
Button Group: 16px (gap-4)
Badge Group: 8px (gap-2)
```

### Margins
```css
/* Bottom Margins */
Section Title: 64px (mb-16)
Card Title: 24px (mb-6)
Paragraph: 16px (mb-4)
List Item: 16px (mb-4)

/* Top Margins */
After Divider: 48px (mt-12)
Section Break: 32px (mt-8)
```

---

## Layout System

### Container Widths
```css
/* Maximum Widths */
Extra Large Container: 1280px (max-w-7xl)  /* Most sections */
Large Container: 1152px (max-w-6xl)        /* Pricing, testimonials */
Medium Container: 1024px (max-w-5xl)       /* Content sections */
Small Container: 896px (max-w-4xl)         /* FAQ, narrow content */
Narrow Container: 768px (max-w-3xl)        /* Text-heavy sections */
Extra Narrow: 640px (max-w-2xl)            /* Forms, single column */

/* Centered Layout */
margin: 0 auto (mx-auto)
```

### Grid System

#### Common Grid Configurations
```css
/* 2-Column Grid */
grid-template-columns: repeat(2, 1fr)
Class: md:grid-cols-2
Gap: 24px (gap-6)
Breakpoint: md (768px)

/* 3-Column Grid */
grid-template-columns: repeat(3, 1fr)
Class: md:grid-cols-3
Gap: 24px (gap-6)
Breakpoint: md (768px)

/* 4-Column Grid */
grid-template-columns: repeat(4, 1fr)
Class: md:grid-cols-4
Gap: 24px (gap-6)
Breakpoint: md (768px)

/* Auto-Fit Grid (Responsive) */
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
Gap: 24px (gap-6)
```

#### Specific Grid Patterns
```css
/* Feature Cards */
Mobile: 1 column
Tablet: 2 columns (md:grid-cols-2)
Desktop: 3 columns (lg:grid-cols-3)

/* Pricing Cards */
Mobile: 1 column
Tablet: 1 column
Desktop: 3 columns (md:grid-cols-3)

/* Stats/Metrics */
Mobile: 1 column
Tablet: 2 columns (md:grid-cols-2)
Desktop: 3-4 columns (lg:grid-cols-3 or lg:grid-cols-4)

/* Testimonials */
Mobile: 1 column
Tablet: 2 columns (md:grid-cols-2)
Desktop: 3 columns (lg:grid-cols-3)
```

### Breakpoints (Tailwind Defaults)
```css
/* Mobile First Approach */
Base (xs):    0px - 639px    /* Default, mobile styles */
sm:           640px+         /* Small tablets */
md:           768px+         /* Tablets */
lg:           1024px+        /* Small laptops */
xl:           1280px+        /* Desktops */
2xl:          1536px+        /* Large desktops */
```

### Flex Layouts
```css
/* Centered Content */
display: flex
justify-content: center
align-items: center
Class: flex items-center justify-center

/* Space Between */
display: flex
justify-content: space-between
align-items: center
Class: flex items-center justify-between

/* Start Aligned */
display: flex
justify-content: flex-start
align-items: start
Class: flex items-start

/* Column Layout */
display: flex
flex-direction: column
gap: 24px
Class: flex flex-col gap-6
```

---

## Component Specifications

### Buttons

#### Primary Button
```css
Background: #1d70b8
Color: #ffffff
Padding: 14px 32px (px-8 py-3.5)
Font Size: 16px (text-base)
Font Weight: 600 (font-semibold)
Border Radius: 12px (rounded-xl)
Border: none
Box Shadow: 0 4px 12px rgba(29, 112, 184, 0.3)
Transition: all 0.3s ease

/* Hover State */
Background: #2e8bc0
Transform: translateY(-2px)
Box Shadow: 0 6px 20px rgba(29, 112, 184, 0.4)

/* Active State */
Transform: translateY(0)
Box Shadow: 0 2px 8px rgba(29, 112, 184, 0.3)

/* Large Size */
Padding: 16px 40px (px-10 py-4)
Font Size: 18px (text-lg)

/* Small Size */
Padding: 10px 24px (px-6 py-2.5)
Font Size: 14px (text-sm)
```

#### Secondary Button
```css
Background: transparent
Color: #1d70b8
Padding: 14px 32px (px-8 py-3.5)
Font Size: 16px (text-base)
Font Weight: 600 (font-semibold)
Border Radius: 12px (rounded-xl)
Border: 2px solid #1d70b8
Transition: all 0.3s ease

/* Hover State */
Background: #1d70b8
Color: #ffffff
Transform: translateY(-2px)
```

#### Ghost Button
```css
Background: transparent
Color: #1d70b8
Padding: 14px 32px (px-8 py-3.5)
Font Size: 16px (text-base)
Font Weight: 500 (font-medium)
Border: none
Transition: all 0.2s ease

/* Hover State */
Background: rgba(29, 112, 184, 0.1)
Color: #2e8bc0
```

### Cards

#### Standard Card
```css
Background: #ffffff
Padding: 32px (p-8)
Border Radius: 24px (rounded-3xl)
Border: 1px solid #e9ecef
Box Shadow: 0 2px 8px rgba(0, 0, 0, 0.04)
Transition: all 0.3s ease

/* Hover State */
Border Color: rgba(29, 112, 184, 0.3)
Box Shadow: 0 8px 24px rgba(0, 0, 0, 0.08)
Transform: translateY(-4px)
```

#### Glassmorphism Card
```css
Background: rgba(255, 255, 255, 0.7)
Backdrop Filter: blur(20px)
Border: 1px solid rgba(255, 255, 255, 0.3)
Border Radius: 24px (rounded-3xl)
Box Shadow: 0 8px 32px rgba(0, 0, 0, 0.1)
```

#### Highlighted Card (Pricing "Most Popular")
```css
Background: linear-gradient(135deg, rgba(29, 112, 184, 0.05), rgba(46, 139, 192, 0.05))
Padding: 32px (p-8)
Border Radius: 24px (rounded-3xl)
Border: 4px solid #1d70b8
Box Shadow: 0 12px 32px rgba(29, 112, 184, 0.2)
Transform: scale(1.05) on desktop
```

### Badges

#### Default Badge
```css
Background: #f8f9fa
Color: #6c757d
Padding: 8px 16px (px-4 py-2)
Font Size: 14px (text-sm)
Font Weight: 500 (font-medium)
Border Radius: 9999px (rounded-full)
Border: 1px solid #e9ecef
```

#### Success Badge
```css
Background: #d4edda
Color: #28a745
Border: 1px solid #c3e6cb
```

#### Warning Badge
```css
Background: #fff3cd
Color: #ffc107
Border: 1px solid #ffeeba
```

#### Primary Badge
```css
Background: #d1ecf1
Color: #1d70b8
Border: 1px solid #bee5eb
```

### Form Elements

#### Input Field
```css
Background: #ffffff
Color: #1a1a1a
Padding: 14px 16px (px-4 py-3.5)
Font Size: 16px (text-base)
Border Radius: 12px (rounded-xl)
Border: 2px solid #e9ecef
Transition: all 0.2s ease

/* Focus State */
Border Color: #1d70b8
Box Shadow: 0 0 0 3px rgba(29, 112, 184, 0.1)
Outline: none

/* Error State */
Border Color: #dc3545
```

#### Textarea
```css
Same as Input Field
Min Height: 120px
Resize: vertical
```

#### Select Dropdown
```css
Same as Input Field
Padding Right: 40px (for icon)
```

### Icons
```css
/* Default Icon Size */
Width: 24px (w-6 h-6)
Height: 24px

/* Small Icon */
Width: 16px (w-4 h-4)
Height: 16px

/* Large Icon */
Width: 32px (w-8 h-8)
Height: 32px

/* Extra Large Icon */
Width: 48px (w-12 h-12)
Height: 48px

/* Icon Colors */
Primary: #1d70b8
Success: #28a745
Warning: #ffc107
Error: #dc3545
Muted: #6c757d
```

---

## Animation & Transitions

### Standard Transitions
```css
Default: all 0.3s ease
Fast: all 0.2s ease
Slow: all 0.5s ease
Transform Only: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)
Opacity Only: opacity 0.3s ease
```

### GSAP Animation Durations
```css
Quick Fade: 0.4s - 0.6s
Standard Animation: 0.8s
Slow Animation: 1s - 1.2s
Stagger Delay: 0.1s - 0.15s
```

### Hover Effects
```css
/* Lift Effect */
Transform: translateY(-4px) to translateY(-12px)
Box Shadow: increased by 2-3x
Duration: 0.3s ease

/* Scale Effect */
Transform: scale(1.02) to scale(1.05)
Duration: 0.3s ease

/* Glow Effect */
Box Shadow: 0 0 20px rgba(29, 112, 184, 0.3)
Duration: 0.3s ease
```

### Scroll Animations (GSAP)
```css
/* Fade In Up */
Initial: { y: 60-100px, opacity: 0 }
Final: { y: 0, opacity: 1 }
Duration: 0.8s - 1s
Easing: power3.out

/* Scale In */
Initial: { scale: 0.8-0.9, opacity: 0 }
Final: { scale: 1, opacity: 1 }
Duration: 0.8s
Easing: back.out(1.2)

/* Rotate In */
Initial: { rotation: 180-360deg, scale: 0 }
Final: { rotation: 0, scale: 1 }
Duration: 0.8s
Easing: back.out(1.7)
```

---

## Shadows

### Card Shadows
```css
/* Light Shadow (Default) */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

/* Medium Shadow */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

/* Heavy Shadow (Hover) */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

/* Extra Heavy Shadow */
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
```

### Colored Shadows
```css
/* Primary Blue Shadow */
box-shadow: 0 4px 12px rgba(29, 112, 184, 0.3);

/* Primary Blue Shadow (Hover) */
box-shadow: 0 8px 24px rgba(29, 112, 184, 0.4);

/* Success Green Shadow */
box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);

/* Warning Orange Shadow */
box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
```

### Inner Shadows
```css
/* Inset Shadow (Pressed State) */
box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
```

---

## Border Radius

```css
/* Standard Sizes */
None: 0px (rounded-none)
Small: 8px (rounded-lg)
Medium: 12px (rounded-xl)
Large: 16px (rounded-2xl)
Extra Large: 24px (rounded-3xl)
Full: 9999px (rounded-full)

/* Component Usage */
Buttons: 12px (rounded-xl)
Cards: 16px - 24px (rounded-2xl to rounded-3xl)
Badges: 9999px (rounded-full)
Input Fields: 12px (rounded-xl)
Images: 16px (rounded-2xl)
Icons Container: 16px (rounded-2xl)
```

---

## Z-Index Scale

```css
/* Layering System */
Base: 0                    /* Default layer */
Dropdown: 10               /* Dropdowns, popovers */
Sticky: 20                 /* Sticky headers */
Fixed: 30                  /* Fixed elements */
Modal Backdrop: 40         /* Modal backgrounds */
Modal: 50                  /* Modal content */
Popover: 60                /* Popovers, tooltips */
Toast: 70                  /* Toast notifications */
```

---

## Opacity Scale

```css
/* Standard Opacities */
Fully Transparent: 0
Very Light: 0.05
Light: 0.1
Subtle: 0.2
Moderate: 0.3
Medium: 0.5
Strong: 0.7
Very Strong: 0.9
Fully Opaque: 1

/* Common Uses */
Disabled State: 0.5
Hover Overlay: 0.1
Backdrop: 0.7
Glassmorphism: 0.7
```

---

## Accessibility

### Focus States
```css
/* Focus Ring */
outline: 2px solid #1d70b8
outline-offset: 2px
border-radius: inherit

/* Alternative Focus (Better Visibility) */
box-shadow: 0 0 0 3px rgba(29, 112, 184, 0.3)
```

### Color Contrast Ratios
```css
/* WCAG AA Compliance */
Body Text on White: 4.5:1 minimum
Large Text on White: 3:1 minimum
Primary Blue (#1d70b8) on White: 4.51:1 ✓
Gray 600 (#6c757d) on White: 4.54:1 ✓
```

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Design Patterns

### Mobile-First Approach
```css
/* Start with mobile styles */
.element {
  padding: 16px;
  font-size: 14px;
}

/* Add tablet styles */
@media (min-width: 768px) {
  .element {
    padding: 24px;
    font-size: 16px;
  }
}

/* Add desktop styles */
@media (min-width: 1024px) {
  .element {
    padding: 32px;
    font-size: 18px;
  }
}
```

### Common Responsive Patterns
```css
/* Stack to Row */
Mobile: flex flex-col
Desktop: md:flex-row

/* 1 to 2 Columns */
Mobile: grid-cols-1
Desktop: md:grid-cols-2

/* 1 to 3 Columns */
Mobile: grid-cols-1
Tablet: md:grid-cols-2
Desktop: lg:grid-cols-3

/* Hide on Mobile */
Mobile: hidden
Desktop: md:block

/* Show on Mobile Only */
Mobile: block
Desktop: md:hidden
```

---

## Implementation Notes

### Tailwind Configuration
The design system uses **Tailwind CSS v4.0** with custom CSS variables defined in `/styles/globals.css`.

### Key Tailwind Classes Used
- Spacing: `p-{n}`, `m-{n}`, `gap-{n}` (where n = 4px increments)
- Colors: Direct hex values or custom CSS variables
- Typography: `text-{size}`, `font-{weight}`, `leading-{height}`
- Layout: `flex`, `grid`, `max-w-{size}`
- Borders: `rounded-{size}`, `border-{width}`
- Effects: `shadow-{size}`, `blur-{size}`

### Custom CSS Variables
Located in `/styles/globals.css`:
- `--font-family: 'Inter', sans-serif`
- `--font-size: 16px`
- Color variables for theming
- Radius variables for consistency

### Animation Library
GSAP (GreenSock Animation Platform) with ScrollTrigger plugin for:
- Scroll-triggered animations
- Smooth transitions between sections
- Interactive hover effects
- Counter animations
- Parallax effects

---

## File References

### Main Files
- `/styles/globals.css` - Global styles and CSS variables
- `/App.tsx` - GSAP animation definitions
- All component files in `/components/` - Individual component styles

### Utility Components
- `/components/ui/button.tsx` - Button component
- `/components/ui/card.tsx` - Card component
- `/components/ui/badge.tsx` - Badge component

---

## Design Principles

1. **Consistency** - Use the same spacing, colors, and typography throughout
2. **Hierarchy** - Clear visual hierarchy using size, weight, and color
3. **Whitespace** - Generous spacing for breathing room
4. **Accessibility** - WCAG AA compliant, keyboard navigable
5. **Performance** - Optimized animations, reduced motion support
6. **Mobile-First** - Design for mobile, enhance for desktop
7. **Brand Identity** - Professional, trustworthy, modern UK aesthetic

---

*Last Updated: October 17, 2025*
