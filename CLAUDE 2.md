# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This repository contains two distinct projects:

1. **Chrome Extension** (`/dvsa-queen-extension/`) - DVSA test cancellation finder
2. **Website** (`/website/`) - React landing page and web application

Each project has its own dependencies, build system, and development workflow.

## Common Development Commands

### Chrome Extension Development
```bash
cd dvsa-queen-extension
npm install
npm run dev          # Development build with watch
npm run build        # Production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm test             # Run Jest tests
```

### Website Development
```bash
cd website
npm install
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint for TypeScript
npm test             # Run Jest tests
```

## Architecture Overview

### Chrome Extension Architecture
The extension uses Manifest V3 with a modular architecture:
- **Content Scripts**: Inject into DVSA pages for automation (`src/content/`)
- **Background Service Worker**: Handles extension lifecycle (`src/background/`)
- **Popup Interface**: React-based user interface (`src/popup/`)
- **Stealth System**: Anti-detection mechanisms (`src/stealth/`)
- **Shared Utilities**: Common functions and constants (`src/shared/`)

Key architectural patterns:
- Message passing between content scripts and background worker
- Stealth technology with 6-factor risk assessment
- Human-like mouse simulation using Bezier curves
- Adaptive timing randomization
- Multi-pupil management system for instructors

### Website Architecture
The website is a modern React application with:
- **Vite Build System**: Fast development and optimized builds
- **TypeScript**: Strict typing throughout the codebase
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **GSAP Animation**: Scroll-triggered animations and transitions
- **Component Structure**: Organized by sections and features
- **Internationalization**: i18next for multi-language support

Key directories:
- `src/components/` - Reusable React components
- `src/sections/` - Page sections (Hero, Features, etc.)
- `src/lib/` - Utility functions and hooks
- `src/assets/` - Static assets and images

## Important Technical Considerations

### Chrome Extension
- Uses Manifest V3 (service workers, not background pages)
- Implements advanced stealth technology - be careful when modifying detection evasion logic
- Requires Chrome 88+ for full compatibility
- Content scripts must handle DVSA page structure changes
- Background worker manages extension lifecycle and storage

### Website
- React 18 with TypeScript strict mode
- Vite for fast development and optimized production builds
- GSAP animations require careful cleanup to prevent memory leaks
- Tailwind CSS with custom configuration for brand consistency
- PWA capabilities with service worker implementation

## Testing Approach

Both projects use Jest for testing:
- Extension tests focus on content script logic and stealth mechanisms
- Website tests cover React components and utility functions
- Run tests before committing changes to ensure compatibility

## Build and Deployment

### Extension Deployment
```bash
cd dvsa-queen-extension
npm run build        # Create production build
npm run package      # Package for Chrome Web Store
npm run deploy       # Deploy to Chrome Web Store (requires credentials)
```

### Website Deployment
```bash
cd website
npm run build        # Create production build
npm run preview      # Preview production build locally
```

The production build outputs are placed in `dist/` directories for both projects.