# 📱 HOW TO GET YOUR TWILIO CREDENTIALS

**You need to get these from YOUR Twilio account**

---

## 🎯 STEP-BY-STEP GUIDE

### Step 1: Go to Twilio Console

**Open:** https://console.twilio.com

**Sign in** with your Twilio account

---

### Step 2: Get Account SID & Auth Token

**On the Twilio Console homepage, you'll see:**

```
┌─────────────────────────────────────┐
│  Account Info                       │
├─────────────────────────────────────┤
│  Account SID:  ACxxxxxxxxxxxxxxx    │  ← Copy this
│  [Show] Auth Token                  │  ← Click "Show" then copy
└─────────────────────────────────────┘
```

**Copy these two values:**

1. **TWILIO_ACCOUNT_SID**
   - Starts with `AC`
   - Example: `AC1234567890abcdef1234567890abcd`

2. **TWILIO_AUTH_TOKEN**
   - Click "Show" or "Reveal" to see it
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

---

### Step 3: Get Phone Number

**Method 1: From Console Homepage**

Look for "Phone Numbers" section or navigate to:

**Phone Numbers** → **Manage** → **Active numbers**

**Method 2: Direct Link**

Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming

**You'll see your phone number(s) listed:**
```
+1 (555) 123-4567  ← Your Twilio number
```

**Copy the number in E.164 format** (with + and country code):
```
+15551234567  ← For US
+441234567890 ← For UK
```

---

### Step 4: (Optional) Get WhatsApp Number

**If you want WhatsApp notifications:**

Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

**Your WhatsApp number will be in format:**
```
whatsapp:+14155238886  ← Twilio's WhatsApp Sandbox
```

**Or if you have a registered WhatsApp Business number:**
```
whatsapp:+441234567890
```

---

## 📋 WHAT TO COPY

After following the steps above, you should have:

```
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcd
TWILIO_AUTH_TOKEN=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
TWILIO_PHONE_NUMBER=+441234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

---

## 🚀 ADD TO RENDER

**Go back to:** https://dashboard.render.com/web/srv-d42iob6r433s73dmlpt0/env

**Click:** "+ Add Environment Variable" or "Edit"

**Add each one:**

### 1. TWILIO_ACCOUNT_SID
```
Key:   TWILIO_ACCOUNT_SID
Value: AC1234567890abcdef1234567890abcd
```

### 2. TWILIO_AUTH_TOKEN
```
Key:   TWILIO_AUTH_TOKEN
Value: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 3. TWILIO_PHONE_NUMBER
```
Key:   TWILIO_PHONE_NUMBER
Value: +441234567890
```

### 4. TWILIO_WHATSAPP_NUMBER (Optional)
```
Key:   TWILIO_WHATSAPP_NUMBER
Value: whatsapp:+14155238886
```

**Click "Save"** → Render will restart automatically

---

## 🔍 VISUAL GUIDE

### Finding Account SID & Auth Token:

**Twilio Console Homepage:**
```
┌───────────────────────────────────────────────┐
│ 🏠 Twilio Console                             │
├───────────────────────────────────────────────┤
│                                               │
│  📊 Account Info                              │
│  ┌─────────────────────────────────────────┐ │
│  │ Account SID                             │ │
│  │ AC1234567890abcdef1234567890abcd       │ │ ← COPY THIS
│  │                                         │ │
│  │ Auth Token                              │ │
│  │ ••••••••••••••••••  [Show]              │ │ ← Click Show, then copy
│  └─────────────────────────────────────────┘ │
│                                               │
└───────────────────────────────────────────────┘
```

### Finding Phone Number:

**Phone Numbers → Active Numbers:**
```
┌───────────────────────────────────────────────┐
│ Active Phone Numbers                          │
├───────────────────────────────────────────────┤
│                                               │
│  📱 +1 (555) 123-4567                         │ ← Your number
│     Voice, SMS                                │
│     [Configure]                               │
│                                               │
└───────────────────────────────────────────────┘

Format for Render: +15551234567 (no spaces, no dashes)
```

---

## ⚠️ IMPORTANT NOTES

### Phone Number Format:

**❌ WRONG:**
```
(555) 123-4567
1-555-123-4567
```

**✅ CORRECT:**
```
+15551234567    (US)
+441234567890   (UK)
```

### WhatsApp Format:

**✅ CORRECT:**
```
whatsapp:+14155238886
whatsapp:+441234567890
```

**Always include:**
- `whatsapp:` prefix
- `+` country code
- No spaces or dashes

---

## 🔐 SECURITY

**Keep these secret!**
- Never share in public repos
- Never commit to GitHub
- Only add to Render environment variables
- Treat like passwords

---

## ❓ DON'T HAVE A TWILIO ACCOUNT?

**If you haven't set up Twilio yet:**

1. **Sign up:** https://www.twilio.com/try-twilio
2. **Get a free trial number**
3. **Get $15 free credit**
4. **Copy credentials from console**

**Trial limitations:**
- Can only send to verified numbers
- Shows "Sent from Twilio trial account" message
- Enough for testing!

**For production:**
- Upgrade to paid account
- Buy a phone number (~$1/month)
- No limitations

---

## 📞 QUICK REFERENCE

**Where to find everything:**

| What | Where |
|------|-------|
| Account SID | Console home → Account Info |
| Auth Token | Console home → Account Info → Show |
| Phone Number | Phone Numbers → Manage → Active |
| WhatsApp | Messaging → Try it out → WhatsApp |
| Documentation | https://www.twilio.com/docs |

---

## ✅ AFTER ADDING TO RENDER

**Your environment should have:**
```
✅ TWILIO_ACCOUNT_SID (starts with AC)
✅ TWILIO_AUTH_TOKEN (32 characters)
✅ TWILIO_PHONE_NUMBER (starts with +)
✅ TWILIO_WHATSAPP_NUMBER (starts with whatsapp:)
```

**Then SMS/WhatsApp notifications will work!** 📱

---

**Go to https://console.twilio.com now to get your credentials!** 🚀

