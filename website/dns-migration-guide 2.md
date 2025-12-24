# DNS Migration from Vercel to Railway

## Current DNS Status Analysis

You're currently transitioning from Vercel to Railway. To complete the migration, you'll need to update your DNS records to point from Vercel to your new Railway deployment.

### Current Setup (Vercel)
- **Domain**: `testnotifier.co.uk`
- **Current DNS**: Pointing to Vercel nameservers or CNAME records
- **Current Deployment**: Vercel (working)
- **New Deployment**: Railway (needs DNS update)

## Step-by-Step DNS Migration Process

### Step 1: Verify Railway Deployment is Ready

Before updating DNS, ensure your Railway deployment is fully functional:

```bash
# Test Railway deployment
curl -I https://testnotifier-production.up.railway.app

# Test authentication endpoints
curl https://testnotifier-production.up.railway.app/api/auth/debug

# Test Google OAuth
curl -I https://testnotifier-production.up.railway.app/api/auth/google
```

**All tests should pass before DNS migration!**

### Step 2: Get Railway DNS Information

Railway provides these DNS targets:
- **Primary**: `testnotifier-production.up.railway.app`
- **Alternative**: `cname.vercel-dns.com` (if using CNAME)

### Step 3: Identify Current DNS Provider

Check where your DNS is currently managed:

1. **Log into your domain registrar** (where you bought testnotifier.co.uk)
2. **Check DNS settings** - look for nameservers or DNS records
3. **Common providers**: Cloudflare, GoDaddy, Namecheap, Google Domains

### Step 4: Update DNS Records

#### Option A: CNAME Record (Recommended for subdomains)

**If you're using a subdomain** (like `www.testnotifier.co.uk`):

```
Type: CNAME
Name: www (or your subdomain)
Value: testnotifier-production.up.railway.app
TTL: 300 (5 minutes)
```

#### Option B: A Record (for root domain)

**If Railway provides an IP address** (they usually use CNAME):

```
Type: A
Name: @ (root domain)
Value: [Railway IP address - check Railway dashboard]
TTL: 300 (5 minutes)
```

#### Option C: ALIAS/ANAME Record (for root domain with CNAME-like behavior)

**If your DNS provider supports ALIAS/ANAME** (Cloudflare, DNSimple):

```
Type: ALIAS (or ANAME)
Name: @ (root domain)
Value: testnotifier-production.up.railway.app
TTL: 300 (5 minutes)
```

### Step 5: Specific Provider Instructions

#### Cloudflare Migration
1. **Log into Cloudflare**: https://dash.cloudflare.com
2. **Select your domain**: `testnotifier.co.uk`
3. **Go to DNS tab**
4. **Update these records**:

```
Type: CNAME
Name: @ (root)
Target: testnotifier-production.up.railway.app
Proxy status: DNS only (gray cloud) initially
TTL: Auto

Type: CNAME
Name: www
Target: testnotifier-production.up.railway.app
Proxy status: DNS only (gray cloud) initially
TTL: Auto
```

#### GoDaddy Migration
1. **Log into GoDaddy**: https://account.godaddy.com
2. **Go to My Products** → **DNS** next to your domain
3. **Update these records**:

```
Type: A
Name: @
Value: [Get IP from Railway dashboard if available]
TTL: 600

Type: CNAME
Name: www
Value: testnotifier-production.up.railway.app
TTL: 600
```

#### Google Domains Migration
1. **Log into Google Domains**: https://domains.google.com
2. **Click on your domain**: `testnotifier.co.uk`
3. **Go to DNS tab**
4. **Update these records**:

```
Type: CNAME
Name: www
Data: testnotifier-production.up.railway.app
TTL: 300

Type: A
Name: @
Data: [Railway IP if available]
TTL: 300
```

### Step 6: Verify DNS Changes

#### Check DNS Propagation
```bash
# Check current DNS records
dig testnotifier.co.uk

# Check CNAME records
dig CNAME testnotifier.co.uk

# Check if domain resolves to Railway
curl -I https://testnotifier.co.uk
```

#### Online DNS Checkers
- https://whatsmydns.net
- https://dnschecker.org
- https://toolbox.googleapps.com/apps/dig

### Step 7: SSL Certificate Verification

Railway automatically provisions SSL certificates, but verify:

```bash
# Check SSL certificate
curl -I https://testnotifier.co.uk

# Check certificate details
openssl s_client -connect testnotifier.co.uk:443 -servername testnotifier.co.uk
```

### Step 8: Final Verification Tests

#### Comprehensive Tests After DNS Migration:
1. **Basic accessibility**:
   ```bash
   curl -I https://testnotifier.co.uk
   curl -I https://www.testnotifier.co.uk
   ```

2. **Authentication system**:
   ```bash
   curl https://testnotifier.co.uk/api/auth/debug
   ```

3. **Google OAuth**:
   ```bash
   curl -I https://testnotifier.co.uk/api/auth/google
   ```

4. **Frontend functionality**:
   - Visit `https://testnotifier.co.uk`
   - Test sign-in flow
   - Test subscription purchase
   - Verify all features work

## DNS Migration Timeline

### Expected Timeline:
- **DNS Propagation**: 5 minutes to 48 hours (usually 15-30 minutes)
- **SSL Certificate**: 5-15 minutes after DNS propagation
- **Full Functionality**: 30-60 minutes total

### Monitoring Schedule:
- **0-15 minutes**: Check DNS propagation
- **15-30 minutes**: Verify SSL certificate
- **30-60 minutes**: Test all functionality
- **24 hours**: Final verification and monitoring

## Rollback Plan (if needed)

If issues arise during DNS migration:

### Immediate Rollback (within 5 minutes):
1. **Restore Vercel DNS records**
2. **Wait for propagation** (5-15 minutes)
3. **Verify Vercel deployment** is working
4. **Debug Railway issues** before re-attempting

### Emergency DNS Rollback:
```bash
# Point back to Vercel (example for Cloudflare)
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 300

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 300
```

## Common DNS Migration Issues

### Issue 1: DNS Not Propagating
**Symptoms**: Domain still points to Vercel after 1 hour
**Solutions**:
- Clear local DNS cache: `sudo dscacheutil -flushcache`
- Check with different DNS servers
- Verify DNS records are saved correctly
- Wait longer (up to 48 hours for full propagation)

### Issue 2: SSL Certificate Not Provisioning
**Symptoms**: HTTPS shows certificate errors
**Solutions**:
- Wait 15-30 minutes for automatic SSL
- Check Railway dashboard for SSL status
- Verify DNS is fully propagated
- Contact Railway support if SSL doesn't provision

### Issue 3: Mixed Content Errors
**Symptoms**: HTTPS page shows insecure content warnings
**Solutions**:
- Check all resources load over HTTPS
- Update any hardcoded HTTP URLs
- Verify API endpoints use HTTPS
- Check external resources (fonts, scripts, etc.)

### Issue 4: Authentication Redirect Issues
**Symptoms**: OAuth redirects to wrong domain
**Solutions**:
- Update OAuth callback URLs in Google Console
- Update Stripe webhook endpoints
- Check environment variables for correct URLs
- Verify all auth endpoints work on new domain

## Pre-Migration Checklist

Before starting DNS migration:
- [ ] Railway deployment is fully functional
- [ ] All environment variables are set correctly
- [ ] Google OAuth is updated for Railway URLs
- [ ] Stripe webhooks are updated for Railway URLs
- [ ] Authentication system works on Railway subdomain
- [ ] Subscription system works on Railway subdomain
- [ ] No critical errors in Railway logs

## Post-Migration Checklist

After DNS migration:
- [ ] Domain resolves to Railway deployment
- [ ] SSL certificate is properly provisioned
- [ ] All authentication endpoints work
- [ ] Google OAuth works on main domain
- [ ] Stripe webhooks work on main domain
- [ ] Subscription purchases work correctly
- [ ] No mixed content warnings
- [ ] All external integrations work
- [ ] Monitor for 24-48 hours for issues

## Monitoring Commands

### Continuous Monitoring:
```bash
# Check every 5 minutes during migration
watch -n 300 "curl -I https://testnotifier.co.uk && echo '---' && curl https://testnotifier.co.uk/api/auth/debug"

# Check DNS propagation
watch -n 60 "dig testnotifier.co.uk +short"

# Check Railway logs
railway logs --tail 50
```

## Final Verification

Once migration is complete:

1. **Test complete user flow**:
   - Visit website → Sign up → Subscribe → Use features

2. **Test all integrations**:
   - Google OAuth on main domain
   - Stripe payments and webhooks
   - Email notifications (if applicable)

3. **Performance check**:
   - Compare loading times vs Vercel
   - Check Railway metrics dashboard
   - Monitor for any performance degradation

**Status**: 🔄 Ready for DNS migration once Railway deployment is verified

**Expected Timeline**: 30-60 minutes for complete migration

**Need help?** Run the monitoring commands above and let me know what you find! 🎯

## Emergency Contacts

- **Railway Support**: support@railway.app
- **Your Domain Provider**: Check their support contact
- **DNS Issues**: Contact your DNS provider support

Remember: Keep your Vercel deployment running until you're 100% sure the Railway migration is successful! 🚀