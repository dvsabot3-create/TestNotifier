# Assets Directory

This directory contains all visual assets referenced in the TestNotifier landing page.

## Directory Structure

```
assets/
├── hero/
│   ├── hero-bg.svg              # Hero section background gradient/pattern
│   ├── noise.png                # Texture overlay for depth
│   └── hero-device-mockup.png   # Chrome extension mockup
│
├── illustrations/
│   ├── monitoring.svg           # 24/7 monitoring illustration
│   ├── notification.svg         # Instant notification illustration
│   ├── centers.svg              # Multiple centers illustration
│   ├── filtering.svg            # Smart filtering illustration
│   ├── setup.svg                # Quick setup illustration
│   └── compliance.svg           # DVSA compliance illustration
│
├── logos/
│   ├── testnotifier-logo.svg   # Main logo
│   ├── testnotifier-icon.svg   # Icon only
│   ├── dvsa-logo.svg            # DVSA compliance logo
│   └── testimonials/
│       ├── company-1.svg
│       ├── company-2.svg
│       └── company-3.svg
│
├── device-mockups/
│   ├── chrome-extension.png    # Extension screenshot
│   ├── mobile-notification.png # Mobile notification mockup
│   └── desktop-dashboard.png   # Dashboard screenshot
│
├── icons/
│   ├── steps/
│   │   ├── step-1.svg          # How it works step icons
│   │   ├── step-2.svg
│   │   └── step-3.svg
│   └── features/
│       ├── feature-1.svg
│       ├── feature-2.svg
│       └── feature-3.svg
│
└── backgrounds/
    ├── pattern-dots.svg        # Dot pattern
    ├── pattern-grid.svg        # Grid pattern
    └── gradient-blur.svg       # Gradient blur effects
```

## Asset Specifications

### Hero Assets
- **hero-bg.svg**: SVG gradient background, optimized for web
- **noise.png**: Subtle texture, 512x512px, PNG-8 with transparency
- **hero-device-mockup.png**: 1200px wide, PNG-24 with transparency

### Illustrations
- Format: SVG (vector)
- Color palette: Brand colors (#1d70b8, #28a745, #ffc107)
- Stroke width: 2px
- Size: Scalable, original artboard 400x400px

### Logos
- Format: SVG (vector)
- Variants: Full color, monochrome
- Safe area: 20px padding minimum

### Device Mockups
- Format: PNG-24 with transparency
- Resolution: 2x for retina displays
- Compression: TinyPNG or ImageOptim

### Icons
- Format: SVG
- Size: 24x24px viewport
- Stroke: 1.5-2px
- Color: Inherit from CSS

## Placeholder Images

For development, use these Unsplash image IDs:

```typescript
const PLACEHOLDER_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1551434678-e076c223a692',
  workspace: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
  person: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
  dashboard: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
};
```

## Optimization Guidelines

1. **SVGs**: Minify using SVGO
2. **PNGs**: Compress with TinyPNG (70-80% quality)
3. **JPEGs**: Use progressive encoding, 80% quality
4. **File sizes**:
   - Icons: < 5KB
   - Illustrations: < 20KB
   - Photos: < 150KB
   - Hero images: < 300KB

## Usage in Code

```tsx
// SVG Icons
import MonitoringIcon from '@/assets/illustrations/monitoring.svg';

// Images
import HeroBg from '@/assets/hero/hero-bg.svg';
import NoiseTex from '@/assets/hero/noise.png';

// Or use in CSS
.hero {
  background-image: url('@/assets/hero/hero-bg.svg');
}
```

## Export from Figma

1. Select asset in Figma
2. Export settings:
   - SVG: Outline text, Simplify stroke
   - PNG: 2x scale, Include in export
3. Run through SVGO or ImageOptim
4. Place in appropriate directory

## License

All assets are proprietary to TestNotifier.co.uk unless otherwise specified.
