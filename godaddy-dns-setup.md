# GoDaddy DNS Records Setup for TestNotifier

## 🎯 What You'll Need

Your Render service will be available at: `https://testnotifier-website.onrender.com`

To connect your custom domain, you'll need to add DNS records to GoDaddy.

## 📋 DNS Records to Add in GoDaddy

### Option 1: Root Domain (testnotifier.co.uk)
**If you want to use testnotifier.co.uk as your main domain:**

**A Record:**
```
Type: A
Name: @
Value: [RENDER_IP_ADDRESS]
TTL: 600
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: testnotifier-website.onrender.com
TTL: 600
```

### Option 2: Subdomain (app.testnotifier.co.uk)
**If you want to use app.testnotifier.co.uk:**

**CNAME Record:**
```
Type: CNAME
Name: app
Value: testnotifier-website.onrender.com
TTL: 600
```

## 🔧 Step-by-Step GoDaddy Setup

### Step 1: Get Render IP Address
1. Go to your Render dashboard
2. Click on your service
3. Go to "Settings" tab
4. Look for "Custom Domains" section
5. Copy the IP address provided by Render

### Step 2: Configure Custom Domain in Render
1. In your Render dashboard, go to your service
2. Click "Settings" tab
3. Scroll to "Custom Domains"
4. Add your domain: `testnotifier.co.uk` or `app.testnotifier.co.uk`
5. Copy the validation CNAME if provided

### Step 3: Add DNS Records in GoDaddy
1. **Log in to GoDaddy:** https://godaddy.com
2. **Go to "My Products" → "DNS"**
3. **Find your domain and click "DNS"**
4. **Click "Add Record"**

### Step 4: Add Required Records

**For Root Domain (testnotifier.co.uk):**
```
Type: A
Name: @
Value: [RENDER_IP_ADDRESS_FROM_STEP_1]
TTL: 600
```

**For WWW redirect:**
```
Type: CNAME
Name: www
Value: testnotifier-website.onrender.com
TTL: 600
```

**For Subdomain (app.testnotifier.co.uk):**
```
Type: CNAME
Name: app
Value: testnotifier-website.onrender.com
TTL: 600
```

### Step 5: SSL Certificate (Automatic)
Render provides free SSL certificates for custom domains - this happens automatically once DNS propagates.

## 🌍 Alternative DNS Providers

If you prefer using Cloudflare (recommended for better performance):

**Cloudflare Setup:**
1. Change nameservers to Cloudflare
2. Add CNAME record pointing to Render
3. Enable Cloudflare proxy for additional features

## ⏱️ DNS Propagation

DNS changes typically take:
- **5-10 minutes** for new records
- **24-48 hours** for full global propagation

You can check propagation at: https://whatsmydns.net

## 🔍 Verification

Once DNS is set up:
1. **Test your domain:** https://testnotifier.co.uk
2. **Check SSL certificate:** Should show secure lock
3. **Verify redirect:** www.testnotifier.co.uk → testnotifier.co.uk

## 🚨 Important Notes

- **Don't delete existing MX records** if you're using email
- **TTL of 600** (10 minutes) allows quick changes
- **Render provides SSL automatically** - no need to purchase certificates
- **CNAME records are preferred** over A records for Render services

## 📞 Need Help?

If DNS isn't working:
1. Check that records are saved in GoDaddy
2. Verify domain is configured in Render dashboard
3. Wait for DNS propagation (up to 24 hours)
4. Check Render service is running properly

## ✅ Next Steps After DNS Setup

1. **Configure your environment variables** with the new domain
2. **Update FRONTEND_URL** to your custom domain
3. **Test all functionality** on the new domain
4. **Set up monitoring** for the custom domain