# 📍 How to Find STRIPE_WEBHOOK_SECRET

## 🔍 **Step-by-Step Location Guide**

### **Step 1: Go to Developers → Webhooks**

1. In your Stripe dashboard, scroll to the bottom of the left sidebar
2. Find **"Developers"** section (icon: square with arrow)
3. Click on **"Developers"** to expand it
4. Click on **"Webhooks"**

### **Step 2: View/Add Webhook Endpoint**

**Option A: If you already have a webhook endpoint**
- You'll see a list of webhooks
- Find your endpoint URL (should contain `testnotifier`)
- Click on it
- Look for **"Signing secret"** 
- Click **"Reveal"** to see the full secret
- Copy it (starts with `whsec_...`)

**Option B: If you need to create a webhook endpoint**

1. Click **"Add endpoint"** button
2. **Endpoint URL**: Enter `https://testnotifier.co.uk/api/webhooks/stripe`
3. **Description**: Enter "TestNotifier Payment Webhooks"
4. **Events to send**: Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Click **"Add endpoint"**
6. After creating, you'll be redirected to the endpoint page
7. Look for **"Signing secret"** section
8. Click **"Reveal"** to see the full secret (`whsec_...`)
9. Click the copy icon to copy it

### **Step 3: Copy the Secret**

The secret will look like:
```
whsec_1234567890abcdefghijklmnopqrstuvwxyz
```

It starts with `whsec_` and is about 40 characters long.

## 🎯 **Where It Appears**

After creating a webhook endpoint, you'll see:
- **Endpoint URL** (your webhook URL)
- **Status** (Enable/Disable)
- **Events** (list of events)
- **Signing secret** ← **THIS IS WHAT YOU NEED!**

The signing secret is usually in a box with a **"Reveal"** button next to it.

## ⚠️ **Important Notes**

- The secret is only shown **after you create the webhook**
- Each webhook endpoint has its own unique signing secret
- You need this secret to verify webhook authenticity
- Keep it secret (like your API keys)

## 🚀 **Quick Summary**

1. Go to **Developers** → **Webhooks**
2. If no webhook exists, click **"Add endpoint"**
3. Enter URL: `https://testnotifier.co.uk/api/webhooks/stripe`
4. Select events (checkout.session.completed, etc.)
5. Click **"Add endpoint"**
6. On the endpoint page, find **"Signing secret"**
7. Click **"Reveal"** and copy it
8. Use that as `STRIPE_WEBHOOK_SECRET` in your `.env.local`

Let me know when you have the webhook secret! 🎉
