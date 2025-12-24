# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TestNotifier is a professional driving test cancellation notification service for UK learner drivers, consisting of:
- **Website Application** (`/website/`) - React-based web application with Express backend
- **Chrome Browser Extension** (`/READY_TO_DEPLOY_EXTENSION/`) - Chrome extension for DVSA integration

## Development Commands

### Website Development
```bash
cd website
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm run build:check  # Type check and build
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Running a Single Test
```bash
npm test -- path/to/test.js
npm test -- --testNamePattern="test name"
```

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + MongoDB + Mongoose
- **Authentication**: Passport.js with Google OAuth 2.0
- **Payments**: Stripe integration
- **Styling**: Tailwind CSS v4 + Radix UI components
- **Notifications**: Twilio (SMS/WhatsApp) + SendGrid (Email)

### Key Directory Structure
```
website/
├── src/                    # React application source
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── pages/             # Page components
│   └── lib/               # Utility libraries
├── config/                # Configuration files
├── middleware/            # Express middleware
├── server.js              # Express server entry point
└── package.json           # Dependencies and scripts

READY_TO_DEPLOY_EXTENSION/
├── manifest.json          # Chrome extension configuration
├── background.js          # Service worker
├── content-script.js      # Content scripts for DVSA
└── popup.html            # Extension popup interface
```

### Security Configuration
The application implements comprehensive security measures:
- Content Security Policy (CSP) headers
- CSRF protection
- Rate limiting
- JWT authentication
- Secure session management
- Input validation with express-validator

### Environment Variables
Critical environment variables are defined in `website/.env.template`. Key variables include:
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (generate with `openssl rand -base64 64`)
- `SESSION_SECRET` - Session encryption secret
- `STRIPE_SECRET_KEY` - Stripe payment processing
- `TWILIO_*` - SMS/WhatsApp notification settings
- `EMAIL_SMTP_*` - Email service configuration

### Subscription Tiers
- One-Off: £30 once
- Starter: £25/month
- Premium: £45/month
- Professional: £80/month

## Key Implementation Details

### Authentication Flow
1. Google OAuth 2.0 integration via Passport.js
2. JWT token generation for API authentication
3. Session management with express-session
4. CSRF token validation for state-changing operations

### Payment Processing
1. Stripe integration for subscription management
2. Webhook handling for payment events
3. Automatic subscription tier updates
4. Secure payment form integration

### Notification System
1. Real-time test cancellation monitoring
2. Multi-channel notifications (SMS, WhatsApp, Email)
3. Twilio integration for mobile notifications
4. SendGrid for email delivery

### Chrome Extension
1. Manifest V3 architecture
2. Content scripts for DVSA website integration
3. Background service worker for notifications
4. Stealth mode capabilities for automated checking

## Development Guidelines

### Code Quality
- Always run `npm run lint` and `npm run typecheck` before committing
- Follow existing code patterns and component structure
- Use Radix UI components for consistent UI elements
- Implement proper error handling and user feedback

### Security Practices
- Never commit environment variables or secrets
- Validate all user inputs with express-validator
- Use secure headers with Helmet.js
- Implement proper CORS configuration
- Follow JWT best practices for authentication

### Database Operations
- Use Mongoose models for all database operations
- Implement proper indexing for performance
- Validate data before saving to database
- Handle MongoDB connection errors gracefully

### Testing
- Write unit tests for new utilities and components
- Test authentication flows thoroughly
- Validate payment processing edge cases
- Ensure notification delivery reliability