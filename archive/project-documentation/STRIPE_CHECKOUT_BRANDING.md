# Stripe Checkout Branding Setup

## Overview
To make the Stripe Checkout look professional and match your website branding, you can either:
1. **Use the automated script** (recommended - sets branding programmatically)
2. **Configure manually** in Stripe Dashboard

## Quick Setup (Automated)

Run this command to automatically configure Stripe Checkout branding:

```bash
cd "/Users/mosman/Documents/DVLA BOT/website" && npm run setup-stripe-branding
```

Or directly:
```bash
node website/scripts/setup-stripe-branding.js
```

Or from the website directory:
```bash
cd "/Users/mosman/Documents/DVLA BOT/website" && node scripts/setup-stripe-branding.js
```

This will:
- ✅ Upload your logo to Stripe
- ✅ Set your brand colors (Navy #1d70b8)
- ✅ Configure payment statement descriptor
- ✅ Make checkout match your website

## Manual Setup (Alternative)

## Step-by-Step Setup

### 1. Upload Your Logo
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Settings** > **Payment Settings**
3. Scroll to **Branding** section
4. Click **Upload** next to "Logo"
5. Upload your logo (recommended: 512x512px, PNG with transparent background)
6. Logo URL should be: `https://testnotifier.co.uk/assets/logos/tn-logov2.png`

### 2. Configure Colors
**Primary Color**: `#1d70b8` (Navy Blue - matches website)
**Accent Color**: `#28a745` (Green - for success states)

1. In the **Branding** section:
2. Set **Brand Color** to: `#1d70b8`
3. Set **Background Color** to: `#ffffff` (white)

### 3. Customize Checkout Text
In **Payment Settings** > **Text** section:

**Terms of Service URL**: `https://testnotifier.co.uk/terms`
**Privacy Policy URL**: `https://testnotifier.co.uk/privacy`
**Policy URLs**: Display links

### 4. Payment Settings Configuration
1. Go to **Payment Settings** > **Payment Options**
2. Enable **Apple Pay** and **Google Pay** (optional)
3. Enable **Link** by Stripe for faster checkout (recommended)
4. Under **Security**, ensure **3D Secure** is enabled

### 5. Advanced: Custom Payment Methods
If you want to use a Payment Methods Configuration:
1. Go to **Settings** > **Payment Methods**
2. Create a new configuration
3. Set colors and styling
4. Save the configuration ID
5. Add to `.env`: `STRIPE_PAYMENT_METHOD_CONFIGURATION=pmc_xxxxx`

## Current Configuration

The checkout session is already configured with:
- ✅ Custom submit message based on plan type
- ✅ Automatic tax calculation (20% UK VAT)
- ✅ Billing address collection
- ✅ Promotion codes enabled
- ✅ UK shipping address collection

## What Gets Displayed

### Logo
Your logo appears at the top of the Stripe Checkout page

### Colors
- Button color: Navy Blue (#1d70b8)
- Accent color: Green (#28a745) for success
- Background: White

### Custom Text
- Subscription plans: "You will be charged monthly. Cancel anytime from your dashboard."
- One-time payments: "You will receive instant access after payment confirmation."

### Payment Methods
Cards, Apple Pay, Google Pay (if enabled)
Link by Stripe (if enabled)

## Testing
1. Go to https://testnotifier.co.uk/pricing
2. Click "Start Now" on any plan
3. Verify logo appears at top
4. Verify colors match website
5. Test checkout flow

## Brand Asset Requirements

### Logo
- **File**: `website/public/assets/logos/tn-logov2.png`
- **Size**: 512x512px (Stripe scales it)
- **Format**: PNG with transparency
- **URL**: `https://testnotifier.co.uk/assets/logos/tn-logov2.png`

### Colors
- **Primary**: `#1d70b8` (Navy Blue)
- **Success**: `#28a745` (Green)
- **Background**: `#ffffff` (White)
- **Text**: `#000000` (Black)

## Alternative: Payment Settings API
If you prefer to set this programmatically:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function setupBranding() {
  await stripe.settings.update({
    branding: {
      logo_url: 'https://testnotifier.co.uk/assets/logos/tn-logov2.png',
      primary_color: '#1d70b8',
      background_color: '#ffffff',
    },
    payments: {
      statement_descriptor: 'TESTNOTIFIER',
      statement_descriptor_prefix: 'TestNotifier',
    },
  });
}
```

## Current Implementation

The checkout session includes:
- Custom messaging based on plan type
- Professional styling via Payment Settings
- Logo from your website
- Brand colors matching your site

## Notes
- Changes in Stripe Dashboard take effect immediately
- Logo must be hosted on a publicly accessible HTTPS URL
- Recommended logo size is at least 128x128px
- For best results, use a square logo with transparent background

