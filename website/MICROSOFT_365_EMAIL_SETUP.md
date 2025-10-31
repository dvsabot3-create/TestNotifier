# 📧 Setup Microsoft 365 Email for testnotifier.co.uk

## 🎯 **DNS Records You Need to Add**

GoDaddy has provided you with the exact DNS records needed. Here's what to add:

### **Step 1: Go to Your Domain DNS Settings**

1. Go to: https://www.godaddy.com/
2. Sign in to your GoDaddy account
3. Go to **"My Products"**
4. Find **testnotifier.co.uk**
5. Click **"DNS"** or **"Manage DNS"**

### **Step 2: Add These DNS Records**

You need to add **4 records** (3 types):

---

## 📝 **Record Type 1: TXT Records (2 records)**

### **TXT Record 1:**
- **Name**: `@` (or leave blank)
- **Type**: `TXT`
- **Value**: `NETORGFT19838409.onmicrosoft.com`
- **TTL**: `3600` (or default)

### **TXT Record 2:**
- **Name**: `@` (or leave blank)
- **Type**: `TXT`
- **Value**: `v=spf1 include:secureserver.net -all`
- **TTL**: `3600` (or default)

---

## 📝 **Record Type 2: CNAME Records (2 records)**

### **CNAME Record 1:**
- **Name/Host**: `autodiscover`
- **Type**: `CNAME`
- **Value/Target**: `autodiscover.outlook.com`
- **TTL**: `3600` (or default)

### **CNAME Record 2:**
- **Name/Host**: `email`
- **Type**: `CNAME`
- **Value/Target**: `email.secureserver.net`
- **TTL**: `3600` (or default)

---

## 📝 **Record Type 3: MX Record (1 record)**

### **MX Record:**
- **Name/Host**: `@` (or leave blank)
- **Type**: `MX`
- **Priority**: `0`
- **Value/Target**: `testnotifier-co-uk.mail.protection.outlook.com`
- **TTL**: `3600` (or default)

---

## ⚠️ **IMPORTANT:**

### **Before Adding MX Record:**

⚠️ **REMOVE any existing MX records FIRST!**

GoDaddy warns:
> "If you have any existing MX records on your domain, you need to remove them before your email will start working."

**How to remove:**
1. In GoDaddy DNS settings
2. Find any existing **MX records**
3. Click **"Delete"** or **"Remove"**
4. Then add the new MX record above

---

## 📋 **Adding Records in GoDaddy:**

1. **In GoDaddy DNS settings**, click **"Add"** or **"+ Add Record"**
2. **For each record:**
   - Select the **Type** (TXT, CNAME, or MX)
   - Enter the **Name** (e.g., `@` or `autodiscover`)
   - Enter the **Value/Target**
   - For MX: Enter **Priority** (0)
   - Click **"Save"**

3. **Repeat** for all 5 records:
   - 2 TXT records
   - 2 CNAME records
   - 1 MX record

---

## ⏱️ **After Adding Records:**

### **Wait 5-30 minutes** for DNS to propagate

Then check if it's working:
1. Go to Microsoft 365 Admin Center
2. Check domain verification status
3. Look for ✅ green checkmarks

---

## ✅ **Verification Checklist:**

After adding records, verify:
- ✅ All 5 records added successfully
- ✅ Old MX records removed
- ✅ Domain verified in Microsoft 365
- ✅ Email address working

---

## 🎯 **Quick Summary:**

**Add these 5 records:**
1. TXT: `@` → `NETORGFT19838409.onmicrosoft.com`
2. TXT: `@` → `v=spf1 include:secureserver.net -all`
3. CNAME: `autodiscover` → `autodiscover.outlook.com`
4. CNAME: `email` → `email.secureserver.net`
5. MX: `@` → `testnotifier-co-uk.mail.protection.outlook.com` (Priority: 0)

**Remove:** Any existing MX records first!

Let me know once you've added all the records! 🚀
