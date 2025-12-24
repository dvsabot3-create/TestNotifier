# Configure Webhook Destination - Final Step

## 🎯 **Step 3: Configure Your Destination**

You're on the final step! Fill in these fields:

### **1. Destination Name** ✅ (Already filled)
- Keep: `inspiring-triumph`
- Or rename to: `testnotifier-payments`
- Click "Regenerate" if you want a different name

### **2. Endpoint URL** ← **IMPORTANT**
Enter this URL:
```
https://testnotifier.co.uk/api/webhooks/stripe
```

This is where Stripe will send payment notifications.

### **3. Description** (Optional)
Enter:
```
TestNotifier Payment Webhooks
```

OR leave it blank (it's optional).

## ✅ **Summary**

Fill in:
- **Endpoint URL**: `https://testnotifier.co.uk/api/webhooks/stripe`
- **Description**: `TestNotifier Payment Webhooks` (optional)

Then click **"Create destination"** button (purple button on the right).

## 🎉 **After Creating**

After you click "Create destination":
1. Your webhook will be created
2. You'll see the webhook page
3. Look for **"Signing secret"** 
4. Click **"Reveal"** to see it
5. Copy it (starts with `whsec_...`)
6. Use it as your `STRIPE_WEBHOOK_SECRET` in `.env.local`

## 🚀 **Ready?**

1. Enter: `https://testnotifier.co.uk/api/webhooks/stripe`
2. (Optional) Enter description
3. Click **"Create destination"**
4. Get your webhook secret!

Let me know when you've created it and got the secret! 🎉
