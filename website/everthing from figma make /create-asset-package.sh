#!/bin/bash

# TestNotifier Asset Package Creator
# This script creates a complete asset package for deployment

echo "🎨 Creating TestNotifier Asset Package..."

# Create temporary directory
TEMP_DIR="testnotifier-assets-export"
mkdir -p "$TEMP_DIR"

# Copy all created assets
echo "📦 Copying SVG assets..."
cp -r assets/ "$TEMP_DIR/"

# Create checksums
echo "🔐 Generating checksums..."
cd "$TEMP_DIR/assets"
find . -type f -name "*.svg" -exec sha256sum {} \; > ../CHECKSUMS.txt
cd ../..

# Create asset inventory
echo "📋 Creating asset inventory..."
cat > "$TEMP_DIR/ASSET_INVENTORY.md" << 'EOF'
# TestNotifier Asset Inventory

## Created SVG Assets (Ready to Use)

### Hero (1 file)
- ✅ hero-bg.svg - 1920x1080 gradient background

### Logos (2 files)
- ✅ testnotifier-logo.svg - Full logo with text
- ✅ testnotifier-icon.svg - Icon only with pulse animation

### Illustrations (6 files - 400x400)
- ✅ monitoring.svg - 24/7 monitoring clock
- ✅ notification.svg - Instant notification phone
- ✅ centers.svg - Multiple centers map
- ✅ filtering.svg - Smart filtering funnel
- ✅ setup.svg - 5-minute setup timer
- ✅ compliance.svg - DVSA compliance shield

### Backgrounds (3 files)
- ✅ pattern-dots.svg - Dot grid (tileable 100x100)
- ✅ pattern-grid.svg - Line grid (tileable 100x100)
- ✅ gradient-blur.svg - Gradient blobs (1200x800)

### Icons (3 files)
- ✅ step-1.svg - Install step icon
- ✅ step-2.svg - Configure step icon
- ✅ step-3.svg - Monitor step icon

**Total SVG Files:** 15
**Total File Size:** ~50-75KB (all files combined)
**All files:** Optimized, brand-colored, production-ready

## Assets to Add (Optional)

### Device Mockups (PNG)
- ⏳ chrome-extension.png - Extension screenshot
- ⏳ mobile-notification.png - Mobile mockup
- ⏳ desktop-dashboard.png - Dashboard screenshot

### Textures (PNG)
- ⏳ noise.png - Subtle grain texture (512x512)

### Testimonial Logos (SVG - Optional)
- ⏳ Company logos if using real testimonials

## Quick Stats
- Format: SVG (vector, scalable)
- Colors: Brand palette (#1d70b8, #28a745, #ffc107)
- Optimization: Yes, < 5KB per file
- Animations: Included where appropriate
- Browser support: All modern browsers
- Accessibility: Proper viewBox and semantic structure

## Usage

### In React/TSX:
```tsx
import HeroBg from '@/assets/hero/hero-bg.svg';
import Logo from '@/assets/logos/testnotifier-logo.svg';
```

### In CSS:
```css
.hero {
  background-image: url('/assets/hero/hero-bg.svg');
}
```

### Inline SVG:
Copy the SVG code directly into your React component for maximum control.
EOF

# Create README
cat > "$TEMP_DIR/README.md" << 'EOF'
# TestNotifier Production Assets

This package contains all production-ready SVG assets for the TestNotifier landing page.

## 📦 Package Contents

- **15 optimized SVG files**
- Complete asset inventory
- Download & usage guide
- File checksums for verification

## 🚀 Quick Start

1. Extract this package to your project root
2. Assets will be in `/assets/` directory
3. Import in React: `import Logo from '@/assets/logos/testnotifier-logo.svg'`
4. Use in CSS: `background-image: url('/assets/hero/hero-bg.svg')`

## 📁 Directory Structure

```
assets/
├── hero/               Hero backgrounds
├── logos/              Brand logos
├── illustrations/      Feature illustrations
├── backgrounds/        Patterns and gradients
└── icons/
    └── steps/          Step-by-step icons
```

## ✨ Features

- ✅ All files optimized (< 5KB each)
- ✅ Brand colors applied
- ✅ Animations included
- ✅ Scalable (vector format)
- ✅ Production-ready
- ✅ No dependencies

## 📖 Documentation

See `DOWNLOAD_GUIDE.md` for complete usage instructions and examples.

---

**Created:** $(date)
**Version:** 1.0.0
**License:** Proprietary - TestNotifier.co.uk
EOF

# Copy documentation
cp assets/README.md "$TEMP_DIR/FULL_ASSET_GUIDE.md" 2>/dev/null || true
cp assets/DOWNLOAD_GUIDE.md "$TEMP_DIR/" 2>/dev/null || true

# Create zip archive
echo "🗜️  Creating zip archive..."
zip -r testnotifier-assets.zip "$TEMP_DIR/" -q

# Clean up
echo "🧹 Cleaning up..."
rm -rf "$TEMP_DIR"

# Report
echo ""
echo "✅ Asset package created successfully!"
echo ""
echo "📦 Package: testnotifier-assets.zip"
echo "📊 Contains: 15 SVG files + documentation"
echo "💾 Size: ~$(du -h testnotifier-assets.zip | cut -f1)"
echo ""
echo "🎯 Next steps:"
echo "  1. Extract testnotifier-assets.zip to your project"
echo "  2. Verify assets in /assets/ directory"
echo "  3. Import in your React components"
echo "  4. Optional: Add device mockup screenshots"
echo ""
echo "📖 See DOWNLOAD_GUIDE.md for usage examples"
echo ""
echo "🚀 Ready for production!"
