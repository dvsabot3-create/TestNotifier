# 🌐 DNS Setup Guide for testnotifier.co.uk → Vercel

## Current Status
- Domain: **testnotifier.co.uk**
- Registrar: **GoDaddy**
- Current State: **Parked**
- Target: **Point to Vercel**

---

## ⚡ QUICK SETUP (1-2 Hours Propagation)

### Step 1: Edit A Record

1. In GoDaddy DNS Management, find the row:
   - **Type:** A
   - **Name:** @ 
   - **Data:** Parked

2. Click the **pencil icon (Edit)** on that row

3. Change the values to:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 600 seconds (or 1 Hour)
   ```

4. Click **Save**

---

### Step 2: Edit WWW CNAME Record

1. Scroll down to find the row:
   - **Type:** CNAME
   - **Name:** www
   - **Data:** testnotifier.co.uk

2. Click the **pencil icon (Edit)** on that row

3. Change the values to:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 1 Hour
   ```

4. Click **Save**

---

### Step 3: Add Domain in Vercel

After DNS changes are saved in GoDaddy:

1. Deploy your website to Vercel first:
   ```bash
   cd /Users/mosman/Documents/DVLA\ BOT/website
   vercel
   ```

2. Once deployed, add your custom domain:
   ```bash
   vercel domains add testnotifier.co.uk
   vercel domains add www.testnotifier.co.uk
   ```

   **OR via Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard
   - Select your project
   - Settings → Domains
   - Click "Add"
   - Enter: `testnotifier.co.uk`
   - Click "Add"
   - Repeat for: `www.testnotifier.co.uk`

3. Vercel will automatically verify the DNS records

4. SSL certificate will be issued automatically (may take 5-10 minutes)

---

## ✅ Verification

After 1-2 hours, test these URLs:
- https://testnotifier.co.uk (should work)
- https://www.testnotifier.co.uk (should redirect to above)
- http://testnotifier.co.uk (should redirect to HTTPS)

Check DNS propagation:
- Visit: https://dnschecker.org
- Enter: testnotifier.co.uk
- Should show: 76.76.21.21 globally

---

## 🚨 Troubleshooting

### DNS Not Propagating
- Wait longer (can take up to 48 hours, but usually 1-2 hours)
- Clear your browser cache
- Try incognito/private mode
- Try different device/network

### Vercel Shows "Invalid Configuration"
- Double-check DNS records in GoDaddy
- Make sure you didn't add extra spaces
- Verify the IP is exactly: 76.76.21.21
- Verify CNAME is exactly: cname.vercel-dns.com

### SSL Certificate Not Issued
- Wait 10-15 minutes after DNS propagates
- Vercel auto-issues Let's Encrypt certificates
- Check Vercel dashboard for certificate status

---

## 📋 Final DNS Configuration

After setup, your DNS should look like:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 1 Hour |
| CNAME | www | cname.vercel-dns.com | 1 Hour |
| NS | @ | ns63.domaincontrol.com | 1 Hour |
| NS | @ | ns64.domaincontrol.com | 1 Hour |

(Keep the existing NS, CNAME records for email, autodiscover, etc.)

---

## 🎯 Next Steps

Once DNS is configured:
1. ✅ Deploy website to Vercel
2. ✅ Add custom domain in Vercel
3. ✅ Wait for DNS propagation
4. ✅ Verify SSL certificate issued
5. ✅ Test website loads at testnotifier.co.uk
6. ✅ Move to next checklist item (Auth Implementation)

---

**Status:** Ready to configure  
**Estimated Time:** 10 minutes to update DNS + 1-2 hours propagation  
**Current Step:** Edit DNS records in GoDaddy

