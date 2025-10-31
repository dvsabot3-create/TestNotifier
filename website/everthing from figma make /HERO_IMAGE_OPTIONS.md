# Hero Section Image Options

## Current Setup

The hero section uses a **code-based UI mockup** (HTML/CSS) showing:
- Chrome extension interface
- Active monitors
- Notification cards
- All animated with GSAP

## Image Options

### ✅ Option 1: SVG Background (Just Applied!)

I've added the `hero-bg.svg` to the hero section background:

```tsx
<section 
  style={{
    backgroundImage: 'url(/assets/hero/hero-bg.svg)',
    backgroundSize: 'cover',
    backgroundBlendMode: 'overlay'
  }}
>
```

This adds the animated gradient SVG behind everything.

### 🎨 Option 2: Add Device Mockup Screenshot

Replace the code-based extension preview with a real image:

**You need to:**
1. Take a screenshot of your Chrome extension
2. Use a mockup tool to add it to a browser/device frame
3. Save as PNG in `/assets/device-mockups/chrome-extension.png`

**Recommended Tools:**
- [Mockuuups Studio](https://mockuuups.studio/) - Mac app
- [Screely](https://screely.com/) - Free browser mockups
- [Smartmockups](https://smartmockups.com/) - Device mockups
- [Figma](https://figma.com) - Custom mockup frames

**Then update HeroSection.tsx:**

```tsx
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Replace the extension-window div (lines 78-150) with:
<div className="hero-visual relative">
  <ImageWithFallback
    src="/assets/device-mockups/chrome-extension.png"
    alt="TestNotifier Chrome Extension"
    className="rounded-3xl shadow-2xl border border-white/20"
  />
  
  {/* Keep the floating notification cards */}
  <div className="floating-notification-1 absolute -top-6 -right-6...">
    {/* ... */}
  </div>
</div>
```

### 📱 Option 3: Use Unsplash Placeholder

For now, use a placeholder image:

```tsx
<ImageWithFallback
  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200"
  alt="Chrome Extension Preview"
  className="rounded-3xl shadow-2xl"
/>
```

### 🎥 Option 4: Video/GIF Demo

Show the extension in action:

```tsx
<video 
  autoPlay 
  loop 
  muted 
  playsInline
  className="rounded-3xl shadow-2xl"
>
  <source src="/assets/demo-video.mp4" type="video/mp4" />
</video>
```

Or use an animated GIF showing the extension working.

## What I Recommend

### Best Option: Combination Approach

Keep what you have (it's actually really good!) + add the SVG background:

1. ✅ **SVG Background** - Already added (`hero-bg.svg`)
2. ✅ **Code-based UI mockup** - Keeps it interactive and animated
3. 🎯 **Optional:** Add subtle noise texture overlay for depth

The current setup is **better than a static image** because:
- ✅ Fully animated with GSAP
- ✅ Shows real extension UI
- ✅ Responsive (scales perfectly)
- ✅ Fast loading (no image downloads)
- ✅ Easy to update (just code)

## Current Hero Section Breakdown

```
Hero Section
├── Background
│   ├── ✅ Gradient overlay (CSS)
│   ├── ✅ SVG background (just added)
│   ├── Animated blur circles
│   └── Grid pattern
│
├── Left Side: Content
│   ├── Badge ("Trusted by 500+...")
│   ├── Headline
│   ├── Description
│   ├── CTA Buttons
│   └── Stats (500+, 95%, 8 weeks)
│
└── Right Side: Extension Preview
    ├── Extension window (code-based UI)
    ├── Active monitors list
    ├── Notification card
    └── 2 floating notification cards
```

## If You Want a Screenshot Instead

### Step 1: Take Screenshot
1. Open your Chrome extension
2. Take screenshot (⌘+Shift+4 on Mac, Win+Shift+S on Windows)
3. Crop to just the extension popup

### Step 2: Add Mockup Frame
Use Screely or Mockuuups:
1. Upload screenshot
2. Choose browser/device frame
3. Adjust padding and background
4. Export as PNG (2x resolution)

### Step 3: Optimize Image
```bash
# Install TinyPNG CLI or use website
npx tinypng chrome-extension.png

# Or use ImageOptim (Mac)
# Or use Squoosh.app
```

### Step 4: Add to Project
Save as: `/assets/device-mockups/chrome-extension.png`

### Step 5: Update Component
Replace lines 76-150 in HeroSection.tsx with image component.

## Quick Comparison

| Approach | Pros | Cons |
|----------|------|------|
| **Current (code-based)** | Animated, fast, responsive, easy to update | Not showing real UI |
| **Screenshot mockup** | Shows real extension, looks professional | Static, larger file size |
| **Video/GIF** | Shows interaction, engaging | Large file size, harder to load |
| **Illustration** | Stylized, fast loading | Not showing actual product |

## My Recommendation

**Keep the current setup!** It's excellent because:

1. ✅ Professional mockup UI
2. ✅ Animated with GSAP (engaging)
3. ✅ Fast loading (no images)
4. ✅ Responsive (scales perfectly)
5. ✅ Shows key features (monitors, notifications)
6. ✅ Interactive feel

**Plus I just added the SVG background for extra depth!**

If you later build the actual extension and want to show a real screenshot, you can easily swap it in.

## Current Status

✅ **Hero background SVG added** - The section now has the animated gradient background
✅ **Code-based mockup working** - Shows extension interface
✅ **Fully animated** - GSAP animations on all elements
✅ **Responsive** - Works on all screen sizes

**No additional images needed** - but you have options if you want them!
