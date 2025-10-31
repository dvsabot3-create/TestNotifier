# 🚀 TONIGHT'S TODO - TestNotifier Launch Prep
**Target:** Deploy website by end of tonight  
**Domain:** testnotifier.co.uk  
**Time:** ~6-8 hours remaining work

---

## ✅ COMPLETED (Great Progress!)

- [x] **DNS configured** - A record points to Vercel (76.76.21.21)
- [x] **Stripe account set up** - API keys retrieved
- [x] **Environment variables created** - `.env.local` file ready
- [x] **Website builds successfully** - No errors (383 KB bundle)
- [x] **Preview server running** - http://localhost:4173

---

## 🎯 PRIORITY 1: DEPLOY TO VERCEL (Next 1-2 hours)

### Step 1: Create Vercel Account (5 min)
- [ ] Go to: https://vercel.com/signup
- [ ] Sign up with GitHub (recommended) or email
- [ ] Verify email if needed

### Step 2: Install Vercel CLI (2 min)
```bash
npm install -g vercel
vercel login
```

### Step 3: Deploy Website (10 min)
```bash
cd /Users/mosman/Documents/DVLA\ BOT/website
vercel
```
**Answer prompts:**
- Set up and deploy? → **Y**
- Which scope? → **Your account**
- Link to existing project? → **N**
- Project name? → **testnotifier**
- In which directory is your code? → **./ (current)**
- Override settings? → **N**

### Step 4: Add Environment Variables to Vercel (15 min)
```bash
# Add Stripe keys
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_SECRET_KEY production

# Add other vars
vercel env add JWT_SECRET production
vercel env add SESSION_SECRET production
```

### Step 5: Production Deploy (5 min)
```bash
vercel --prod
```

### Step 6: Add Custom Domain (10 min)
```bash
vercel domains add testnotifier.co.uk
vercel domains add www.testnotifier.co.uk
```

**Expected Result:** Website live at testnotifier.co.uk (DNS takes 1-2 hours to propagate)

---

## 🎯 PRIORITY 2: FINISH WWW CNAME RECORD (5 min)

### Action Needed:
1. Go back to GoDaddy DNS Management
2. Find the existing **CNAME** record where **Name = www**
3. Click **Edit** (pencil icon)
4. Change **Value** from `testnotifier.co.uk` to: `cname.vercel-dns.com`
5. Click **Save**

**Why:** This ensures www.testnotifier.co.uk redirects properly

---

## 🎯 PRIORITY 3: CREATE MISSING PAGES (2-3 hours)

### Pages Needed:

#### 1. Privacy Policy Page (30 min)
File: `/website/pages/privacy.html` or component

**Content sections:**
- [ ] What data we collect
- [ ] How we use data
- [ ] Data storage & security
- [ ] User rights (GDPR compliance)
- [ ] Cookies policy
- [ ] Contact information

#### 2. Terms of Service Page (30 min)
File: `/website/pages/terms.html` or component

**Content sections:**
- [ ] Service description
- [ ] User obligations
- [ ] Payment terms
- [ ] Refund policy
- [ ] Limitation of liability
- [ ] Termination clause

#### 3. Contact Page (Optional - 30 min)
- [ ] Contact form
- [ ] Email: support@testnotifier.co.uk
- [ ] Social media links

**Quick Option:** Use a legal page generator:
- https://www.termsfeed.com/
- https://www.iubenda.com/
- Customize for TestNotifier

---

## 🎯 PRIORITY 4: PAYMENT BUTTON IMPLEMENTATION (2-3 hours)

### Option A: Stripe Checkout (Simple - Recommended)

Update `/website/components/figma/PricingSection.tsx`:

```typescript
const handleSelectPlan = async (planName: string, price: string) => {
  try {
    // For now, show "Coming Soon" modal
    alert(`Thank you for your interest in ${planName}! 
    
Payment integration coming soon.
    
For early access, email: support@testnotifier.co.uk`);
    
    // TODO: Later implement actual Stripe checkout
    // const stripe = await getStripe();
    // const response = await fetch('/api/create-checkout-session', {...});
  } catch (error) {
    console.error('Error:', error);
  }
};
```

Add to each pricing button:
```typescript
<Button onClick={() => handleSelectPlan(plan.name, plan.price)}>
  {plan.cta}
</Button>
```

### Option B: Full Integration (Tomorrow)
- [ ] Create Stripe products in dashboard
- [ ] Get Price IDs
- [ ] Create `/api/create-checkout-session` endpoint
- [ ] Implement success/cancel pages
- [ ] Test full flow

**Recommendation:** Do Option A tonight (5 minutes), Option B tomorrow

---

## 🎯 PRIORITY 5: AUTH SYSTEM (OPTIONAL - Can Skip for Tonight)

### If Time Permits:

- [ ] Create LoginModal component
- [ ] Create RegisterModal component
- [ ] Wire up Header "Login" button
- [ ] Mock auth (just store in localStorage for now)
- [ ] Backend auth can be added tomorrow

**Recommendation:** Skip tonight, add as Day 2 feature

---

## 🎯 PRIORITY 6: EXTENSION DOWNLOAD (30 min)

### Steps:

1. **Zip the extension:**
```bash
cd /Users/mosman/Documents/DVLA\ BOT/dvsa-queen-extension
zip -r testnotifier-extension.zip . -x "*.git*" -x "node_modules/*"
mv testnotifier-extension.zip ../website/public/downloads/
```

2. **Create download page or add to CTA:**

Update CTASection or create download button:
```typescript
<Button onClick={() => window.location.href='/downloads/testnotifier-extension.zip'}>
  Download Chrome Extension
</Button>
```

3. **Create installation guide:**
- [ ] Add to FAQ or create separate page
- [ ] Screenshots of installation steps
- [ ] Link from website

---

## 🎯 PRIORITY 7: FINAL TESTING (1 hour)

### Pre-Launch Checklist:

#### Functionality:
- [ ] Homepage loads without errors
- [ ] All animations work on scroll
- [ ] Mobile responsive (test on phone)
- [ ] All links work (no 404s)
- [ ] Pricing section displays correctly
- [ ] Footer links work (once pages created)
- [ ] Extension downloads successfully

#### Performance:
- [ ] Run Lighthouse audit (target: 90+ score)
- [ ] Check load time < 3 seconds
- [ ] No console errors
- [ ] Images load properly

#### SEO:
- [ ] Page title set
- [ ] Meta description present
- [ ] OG tags for social sharing
- [ ] Sitemap exists

#### Security:
- [ ] HTTPS works
- [ ] No mixed content warnings
- [ ] Security headers present

---

## 🎯 PRIORITY 8: GO LIVE! (5 min)

### Final Steps:

1. **Verify DNS propagated:**
   - Visit: https://testnotifier.co.uk
   - Should load your website

2. **Test on multiple devices:**
   - Desktop browser
   - Mobile phone
   - Tablet

3. **Check all critical paths:**
   - Homepage → Pricing → Download
   - Homepage → FAQ
   - All footer links

4. **Monitor for errors:**
   - Check Vercel dashboard for errors
   - Check browser console
   - Check Stripe dashboard (if payments enabled)

5. **Announce launch:**
   - [ ] Update LinkedIn/social media
   - [ ] Email any waitlist
   - [ ] Post in relevant communities

---

## ⏰ TIME ESTIMATES

| Task | Time | Priority |
|------|------|----------|
| Deploy to Vercel | 1-2 hours | 🔴 CRITICAL |
| Fix WWW CNAME | 5 min | 🔴 CRITICAL |
| Payment buttons (temp) | 5 min | 🟡 HIGH |
| Privacy/Terms pages | 1 hour | 🟡 HIGH |
| Extension download | 30 min | 🟡 HIGH |
| Testing | 1 hour | 🟡 HIGH |
| Auth system | 2-3 hours | 🟢 OPTIONAL |
| Full Stripe integration | 2-3 hours | 🟢 TOMORROW |

**TOTAL CRITICAL PATH:** 3-4 hours  
**TOTAL WITH OPTIONAL:** 6-8 hours

---

## 🚨 IF SHORT ON TIME

### Minimum Viable Launch (3 hours):
1. ✅ Deploy to Vercel
2. ✅ Fix WWW CNAME
3. ✅ Add "Contact Us" on pricing buttons
4. ✅ Basic Privacy/Terms pages (use generator)
5. ✅ Extension download working
6. ✅ Quick smoke test

### Add Tomorrow:
- Full Stripe integration
- Auth system
- Contact form
- Blog/resources
- Analytics tracking

---

## 📞 NEXT IMMEDIATE ACTION

**RIGHT NOW (choose one):**

**Option 1: Continue with Vercel Deploy** (Recommended)
```bash
npm install -g vercel
vercel login
cd /Users/mosman/Documents/DVLA\ BOT/website
vercel
```

**Option 2: Finish DNS First**
- Go to GoDaddy
- Edit WWW CNAME record
- Change to: cname.vercel-dns.com

**Option 3: Add Temporary Payment Buttons**
- Quick 5-minute fix
- Makes pricing section functional
- Shows "Contact us" for now

**Which would you like to do first?** 🚀

---

**Status:** Ready to deploy  
**Next Step:** Tell me which option you want to tackle first!

