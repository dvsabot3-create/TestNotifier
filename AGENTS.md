# DVLA BOT - Project Context

## Overview
Driving test booking automation platform with Chrome extension and web dashboard.

## Tech Stack
- **Backend**: Node.js + Express (ES Modules)
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Extension**: Chrome Manifest V3
- **Database**: MongoDB (Atlas)
- **Auth**: Google OAuth 2.0, JWT tokens
- **Payments**: Stripe (subscriptions)
- **Notifications**: Twilio SMS, Email
- **Deployment**: Render (backend), Vercel-ready (frontend)

## Project Structure
```
/website           # React frontend + Express backend
  /src             # React app source
  /server          # Express API server
/dvsa-queen-extension  # Chrome extension
/READY_TO_DEPLOY_EXTENSION  # Production extension build
```

## Key Patterns
- ES Modules (`"type": "module"` in package.json)
- JWT auth with refresh tokens
- Stripe webhook handling
- Chrome extension background service worker
- DVSA website automation/detection

## Environment Variables
Required in Render:
- `MONGODB_URI` - MongoDB Atlas connection
- `JWT_SECRET` - Token signing
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
- `TWILIO_*` - SMS notifications

## Commands
```bash
cd website && npm run dev      # Start dev server
cd website && npm run build    # Production build
```

## Important Notes
- Extension needs `https://dvsa-queen.onrender.com` as API base
- Google OAuth redirect: `https://dvsa-queen.onrender.com/auth/google/callback`
- Stripe webhooks: `https://dvsa-queen.onrender.com/api/stripe/webhook`
