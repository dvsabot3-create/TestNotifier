# 🔒 NPM Vulnerabilities Analysis & Fix Plan

## 📊 Vulnerability Summary

From deployment logs:
- **8 vulnerabilities total** (4 low, 1 moderate, 2 high, 1 critical)
- Most are in **dev dependencies** (build-time only)
- Some in **production dependencies** (runtime)

---

## 🔍 Detailed Analysis

### Production Dependencies (Runtime - More Critical)

#### 1. `jws` (HIGH) - In `jsonwebtoken`
**Severity:** High  
**Issue:** Improperly Verifies HMAC Signature  
**Location:** `node_modules/jsonwebtoken/node_modules/jws`  
**Fix:** `npm audit fix` (should update jsonwebtoken)

**Impact:** ⚠️ **Security Risk** - JWT signature verification could be bypassed

#### 2. `nodemailer` (MODERATE)
**Severity:** Moderate  
**Issues:**
- Email to unintended domain (interpretation conflict)
- DoS via recursive calls in addressparser
**Fix:** `npm audit fix --force` (will install nodemailer@7.0.11 - breaking change)

**Impact:** ⚠️ **Medium Risk** - Email delivery issues possible

---

### Dev Dependencies (Build-Time Only - Less Critical)

#### 3. `vite-plugin-imagemin` Dependencies (HIGH)
**Severity:** High  
**Affected Packages:**
- `bin-build`
- `bin-check`
- `bin-version`
- `bin-version-check`
- `bin-wrapper`

**Fix Available:** Update `vite-plugin-imagemin` to `0.4.0` (major version)

**Impact:** ⚠️ **Low Risk** - Only affects build process, not production

#### 4. `next` (CRITICAL) - Dev Dependency
**Severity:** Critical  
**Issues:**
- RCE in React flight protocol
- Server Actions source code exposure
- DoS with Server Components

**Impact:** ✅ **No Risk** - Not used in production (only in dev/build)

#### 5. `tmp` (in stripe-cli) - Dev Dependency
**Severity:** Moderate  
**Issue:** Arbitrary file write via symbolic link

**Impact:** ✅ **No Risk** - Dev dependency only

---

## ✅ Fix Plan

### Priority 1: Production Dependencies (Fix Now)

#### Fix 1: Update `jsonwebtoken` (jws vulnerability)
```bash
cd website
npm update jsonwebtoken
npm audit fix
```

#### Fix 2: Update `nodemailer` (moderate risk)
```bash
npm audit fix --force
# This will update nodemailer to 7.0.11
# Test email functionality after update
```

### Priority 2: Dev Dependencies (Fix After Deployment)

#### Fix 3: Update `vite-plugin-imagemin`
**Option A:** Update to latest (may break build)
```bash
npm install vite-plugin-imagemin@latest --save-dev
```

**Option B:** Remove if not critical (if image optimization not needed)
```bash
npm uninstall vite-plugin-imagemin
# Remove from vite.config.ts if present
```

#### Fix 4: Update `next` (if actually used)
```bash
npm update next
```

---

## 🎯 Recommended Action Plan

### Immediate (Before Next Deploy):
1. ✅ Fix `jsonwebtoken` (jws) - **HIGH priority**
2. ✅ Fix `nodemailer` - **MEDIUM priority**

### After Deployment (Non-Critical):
3. ⏳ Update `vite-plugin-imagemin` or remove it
4. ⏳ Update `next` (if used)

---

## 🔧 Quick Fix Commands

```bash
cd website

# Fix production vulnerabilities
npm audit fix

# Force fix nodemailer (breaking change - test after)
npm audit fix --force

# Verify fixes
npm audit --production
```

---

## ⚠️ Important Notes

1. **`npm audit fix --force`** may introduce breaking changes
   - Test email functionality after updating nodemailer
   - Review changelog for breaking changes

2. **Dev dependencies** don't affect production
   - `vite-plugin-imagemin` vulnerabilities only affect build
   - `next` vulnerabilities only affect dev environment

3. **Production vulnerabilities** are more critical
   - `jws` in `jsonwebtoken` - **FIX IMMEDIATELY**
   - `nodemailer` - Fix soon, test email after

---

## 📋 Testing Checklist After Fixes

- [ ] JWT token generation/verification still works
- [ ] Email sending still works (if nodemailer updated)
- [ ] Build process completes successfully
- [ ] No new errors in deployment logs

---

**Status:** ⚠️ **Action Required** - Fix production vulnerabilities before next deploy

