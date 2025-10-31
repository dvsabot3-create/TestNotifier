# GoDaddy DNS Setup for testnotifier.co.uk (Root Domain)

## 🎯 Your Configuration
- **Domain:** testnotifier.co.uk (root domain)
- **Render Service:** testnotifier-website
- **Render URL:** https://testnotifier-website.onrender.com
- **Target:** Point testnotifier.co.uk to your Render service

## 📋 Exact DNS Records for GoDaddy

### Option A: A Record (Root Domain) - RECOMMENDED
Since Render provides an IP address for root domains:

**A Record:**
```
Type: A
Name: @
Value: [RENDER_IP_ADDRESS]
TTL: 600
```

**CNAME Record (for www redirect):**
```
Type: CNAME
Name: www
Value: testnotifier-website.onrender.com
TTL: 600
```

### Option B: ALIAS/ANAME (if GoDaddy supports it)
```
Type: ALIAS
Name: @
Value: testnotifier-website.onrender.com
TTL: 600
```

## 🔧 Step-by-Step GoDaddy Setup

### Step 1: Get Render IP Address
1. Go to https://dashboard.render.com
2. Click on your **testnotifier-website** service
3. Go to **"Settings"** tab
4. Scroll to **"Custom Domains"** section
5. Click **"Add Custom Domain"**
6. Enter: `testnotifier.co.uk`
7. **Copy the IP address** that Render provides
8. **Copy any validation records** if shown

### Step 2: Configure GoDaddy DNS
1. **Log in to GoDaddy:** https://godaddy.com
2. **Go to "My Products" → "DNS"**
3. **Find testnotifier.co.uk and click "DNS"**
4. **Click "Add Record"**

### Step 3: Add A Record for Root Domain
```
Type: A
Name: @
Value: [PASTE_RENDER_IP_HERE]
TTL: 600
```

### Step 4: Add CNAME for WWW
```
Type: CNAME
Name: www
Value: testnotifier-website.onrender.com
TTL: 600
```

### Step 5: Remove Conflicting Records
- **Remove any existing A records** for @ (root)
- **Remove any existing CNAME records** for www
- **Keep MX records** if you have email
- **Keep TXT records** unless they conflict

## 🌍 Alternative Approaches

### If Render Doesn't Provide IP (CNAME Flattening)
Some DNS providers support CNAME at root:
```
Type: CNAME
Name: @
Value: testnotifier-website.onrender.com
TTL: 600
```

### Using Cloudflare (Better Performance)
1. Change nameservers to Cloudflare
2. Add CNAME records
3. Enable Cloudflare proxy for additional features

## ⏱️ DNS Propagation Timeline

- **GoDaddy changes:** 5-10 minutes
- **Global propagation:** 24-48 hours
- **SSL certificate:** Automatic within 1-2 hours

## 🔍 Verification Steps

1. **Check DNS propagation:** https://whatsmydns.net
2. **Test your domain:** https://testnotifier.co.uk
3. **Test www redirect:** https://www.testnotifier.co.uk
4. **Check SSL certificate:** Should show secure lock

## 🚨 Important Notes

- **Don't delete MX records** if you have email service
- **TTL of 600** allows quick changes during setup
- **Render provides free SSL** automatically
- **Both root and www should work** after setup

## ✅ Next Steps After DNS

1. **Update environment variables** with new domain
2. **Test all functionality** on custom domain
3. **Set up monitoring** for the custom domain
4. **Configure email** if needed

## 📞 Troubleshooting

If DNS isn't working:
1. **Wait 10-15 minutes** for propagation
2. **Check GoDaddy DNS records** are saved
3. **Verify Render custom domain** is configured
4. **Test with online tools** like whatsmydns.net

**Once you've added these DNS records, let me know and I'll help you test the deployment!**