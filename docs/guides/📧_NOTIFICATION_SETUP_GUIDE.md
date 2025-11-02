# 📧 NOTIFICATION SERVICES SETUP GUIDE

**Complete guide to enable Email, SMS, and WhatsApp notifications**

---

## 🎯 OVERVIEW

Your TestNotifier platform now supports **3 notification channels**:
- 📧 **Email** - All tiers (via SendGrid or SMTP)
- 📱 **SMS** - Starter, Premium, Professional (via Twilio)
- 💬 **WhatsApp** - Professional only (via Twilio)

**Backend Implementation:** ✅ COMPLETE  
**Service Setup:** ⏳ REQUIRED (see below)

---

## 📧 OPTION 1: EMAIL VIA SENDGRID (Recommended)

### **Why SendGrid:**
- Easy to set up
- Free tier: 100 emails/day
- Reliable delivery
- Good reputation management

### **Setup Steps:**

1. **Create SendGrid Account:**
   - Go to: https://signup.sendgrid.com
   - Sign up (free plan)
   - Verify your email

2. **Generate API Key:**
   - Dashboard → Settings → API Keys
   - Click "Create API Key"
   - Name: "TestNotifier Production"
   - Permission: "Full Access"
   - Click "Create & View"
   - **Copy the key** (starts with `SG.`)

3. **Verify Sender Email:**
   - Dashboard → Settings → Sender Authentication
   - Click "Verify a Single Sender"
   - Enter: hello@testnotifier.co.uk
   - Fill in details
   - Click verification link in email

4. **Add to Render Environment Variables:**
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=hello@testnotifier.co.uk
   ```

5. **Test:**
   - Trigger a test notification
   - Check SendGrid dashboard for delivery stats

### **Cost:**
- Free: 100 emails/day
- Essentials: $19.95/month for 50,000 emails
- Pro: $89.95/month for 100,000 emails

---

## 📧 OPTION 2: EMAIL VIA SMTP (Alternative)

### **If You Have Email Hosting:**

Use your existing email service (Gmail, Outlook, custom domain):

### **Setup Steps:**

1. **Get SMTP Credentials from your email provider**

2. **Add to Render Environment Variables:**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=hello@testnotifier.co.uk
   SMTP_PASS=your_app_password
   SMTP_FROM=hello@testnotifier.co.uk
   ```

3. **For Gmail:**
   - Enable 2FA on your Google account
   - Generate App Password:
     - Google Account → Security → 2-Step Verification
     - App passwords → Generate → Select "Mail"
     - Copy the 16-character password
     - Use as `SMTP_PASS`

---

## 📱 SMS VIA TWILIO

### **Why Twilio:**
- Industry standard
- Pay-as-you-go pricing
- UK phone numbers available
- WhatsApp integration included

### **Setup Steps:**

1. **Create Twilio Account:**
   - Go to: https://www.twilio.com/try-twilio
   - Sign up (free trial with £20 credit)
   - Verify your email and phone

2. **Get API Credentials:**
   - Dashboard → Account Info
   - Copy:
     - Account SID
     - Auth Token

3. **Get a UK Phone Number:**
   - Dashboard → Phone Numbers → Buy a Number
   - Select: United Kingdom
   - Choose a number (costs ~£1/month)
   - Click "Buy"

4. **Add to Render Environment Variables:**
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+44XXXXXXXXXX
   ```

5. **Test:**
   - Send test SMS to your own phone
   - Check Twilio logs for delivery

### **Cost:**
- UK SMS: £0.04 per message
- Free trial: £20 credit
- Monthly number fee: ~£1

### **Scaling:**
- 100 SMS/month = £4
- 1,000 SMS/month = £40
- 10,000 SMS/month = £400

---

## 💬 WHATSAPP VIA TWILIO

### **Why Twilio for WhatsApp:**
- Same account as SMS
- Official WhatsApp Business API
- Higher engagement than SMS

### **Setup Steps:**

1. **Enable WhatsApp in Twilio:**
   - Dashboard → Messaging → Try it Out → Try WhatsApp
   - Follow the setup wizard
   - Connect your WhatsApp Business Account

2. **For Production (Business API):**
   - Dashboard → Messaging → Settings → WhatsApp
   - Apply for WhatsApp Business API access
   - Complete Facebook Business verification
   - Wait for approval (1-2 weeks)

3. **Get WhatsApp-Enabled Number:**
   - Option A: Use Twilio sandbox (for testing)
   - Option B: Apply for production WhatsApp sender

4. **Add to Render Environment Variables:**
   ```
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   (or your approved WhatsApp Business number)
   ```

5. **Test in Sandbox:**
   - Send "join <sandbox-code>" to Twilio WhatsApp number
   - Test messages

### **Cost:**
- WhatsApp: £0.005-0.016 per message (cheaper than SMS!)
- Business API review: Free (but takes time)
- Monthly: Depends on volume

---

## 🔧 QUICK START (All 3 Services)

### **1. Sign Up for Services:**

```bash
# SendGrid (Email)
https://signup.sendgrid.com → Create account → Get API key

# Twilio (SMS + WhatsApp)
https://www.twilio.com/try-twilio → Create account → Get credentials
```

### **2. Add ALL Environment Variables to Render:**

Go to: Render Dashboard → Your Service → Environment

Add these variables:

```bash
# Email (SendGrid)
SENDGRID_API_KEY=SG.your_key_here
SENDGRID_FROM_EMAIL=hello@testnotifier.co.uk

# SMS & WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+44XXXXXXXXXX
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# OR use SMTP for email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=hello@testnotifier.co.uk
SMTP_PASS=your_app_password
```

### **3. Install Dependencies:**

Already added to `package.json`:
```json
{
  "@sendgrid/mail": "^8.1.0",
  "nodemailer": "^6.9.7",
  "twilio": "^4.19.0"
}
```

Run: `npm install` (Render will do this automatically)

### **4. Deploy:**

- Git push triggers auto-deploy
- Render installs new dependencies
- Notification endpoint becomes active

### **5. Test:**

Send test notification from extension:
```javascript
// Extension will call:
POST /api/notifications/send
{
  "type": "slot_found",
  "email": "test@example.com",
  "phone": "+447123456789",
  "notificationTypes": ["email", "sms", "whatsapp"],
  "monitorName": "Test Student",
  "slot": {
    "date": "2025-02-15",
    "time": "10:30 AM",
    "centre": "London (Wood Green)"
  },
  "subscriptionTier": "professional"
}
```

---

## ⚡ PRIORITY SETUP ORDER

### **For Immediate Testing (TODAY):**
✅ **Email only** - Set up SendGrid (15 minutes)
- Most important notification channel
- Free and easy
- Works for all tiers

### **For Beta Launch (WEEK 1):**
✅ **Email + SMS** - Add Twilio (30 minutes)
- Enables Starter/Premium features
- Better engagement

### **For Full Launch (WEEK 2+):**
✅ **Email + SMS + WhatsApp** - WhatsApp Business approval (1-2 weeks)
- Professional tier exclusive
- Highest engagement rate

---

## 🧪 TESTING YOUR NOTIFICATIONS

### **Test Email (SendGrid):**
```bash
curl -X POST https://testnotifier.co.uk/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "slot_found",
    "email": "your-email@example.com",
    "notificationTypes": ["email"],
    "monitorName": "Test User",
    "slot": {
      "date": "2025-02-15",
      "time": "10:30 AM",
      "centre": "London (Wood Green)"
    },
    "subscriptionTier": "premium"
  }'
```

### **Test SMS (Twilio):**
```bash
curl -X POST https://testnotifier.co.uk/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "slot_found",
    "phone": "+447123456789",
    "notificationTypes": ["sms"],
    "monitorName": "Test User",
    "slot": {
      "date": "2025-02-15",
      "time": "10:30 AM",
      "centre": "London (Wood Green)"
    },
    "subscriptionTier": "starter"
  }'
```

---

## 💰 ESTIMATED COSTS

### **Low Volume (100 users, 10 notifications/user/month):**
- SendGrid: **FREE** (under 100/day limit)
- Twilio SMS: £40/month (1,000 messages @ £0.04 each)
- Twilio WhatsApp: £8/month (1,000 messages @ £0.008 each)
- **Total: ~£50/month**

### **Medium Volume (500 users, 20 notifications/user/month):**
- SendGrid: £20/month (Essentials plan for 50k emails)
- Twilio SMS: £400/month (10,000 messages)
- Twilio WhatsApp: £80/month (10,000 messages)
- **Total: ~£500/month**

### **Scale Efficiently:**
- WhatsApp is 5x cheaper than SMS
- Encourage Professional users to use WhatsApp
- Offer email-only discount for cost-conscious users

---

## ⚙️ CONFIGURATION STATUS

### **What's Implemented:**
✅ Backend notification endpoint (`/api/notifications/send`)  
✅ SendGrid integration (when API key provided)  
✅ SMTP fallback (when credentials provided)  
✅ Twilio SMS (when credentials provided)  
✅ Twilio WhatsApp (when credentials provided)  
✅ Tier-based permission checking  
✅ HTML email templates  
✅ Error handling and logging

### **What You Need to Do:**
⏳ Sign up for SendGrid  
⏳ Get SendGrid API key  
⏳ Verify sender email  
⏳ Sign up for Twilio  
⏳ Get Twilio credentials  
⏳ Buy UK phone number  
⏳ Add all env vars to Render  
⏳ Deploy and test

---

## 🚀 QUICKEST PATH TO WORKING NOTIFICATIONS

**15-MINUTE SETUP (Email Only):**

1. Go to: https://signup.sendgrid.com
2. Create account → Verify email
3. Settings → API Keys → Create API Key
4. Copy API key
5. Render Dashboard → Environment → Add:
   - `SENDGRID_API_KEY=SG.your_key`
   - `SENDGRID_FROM_EMAIL=hello@testnotifier.co.uk`
6. Settings → Sender Authentication → Verify hello@testnotifier.co.uk
7. Wait for Render to redeploy (auto)
8. Test: Send yourself an email notification

**DONE! Email notifications working!** ✅

---

**Backend is ready. Just add your API keys!** 🔑

---

