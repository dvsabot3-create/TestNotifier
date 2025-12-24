# 📧 Mac Mail Setup for hello@testnotifier.co.uk

## 🎯 **Correct Settings for Microsoft 365/Exchange**

From the GoDaddy DNS records, you're using **Microsoft 365** (Exchange Online).

### **What to Enter in Mac Mail:**

**Email Address:**
```
hello@testnotifier.co.uk
```

**Username:**
```
hello@testnotifier.co.uk
```
(Or just: `hello`)

**Password:**
```
[Your Microsoft 365 password]
```

**Internal URL/Server:**
```
outlook.office365.com
```

**External URL/Server:**
```
outlook.office365.com
```
(Same as internal - Microsoft 365 uses same URL for both)

---

## 🔧 **Alternative Auto-Discover Method:**

Since you've set up the **autodiscover** DNS record:
```
autodiscover → autodiscover.outlook.com
```

Mac Mail should **automatically discover** the settings!

### **Try This First:**

1. **In Mac Mail**, choose:
   - **Account Type**: Exchange or Microsoft 365
   - **Email**: `hello@testnotifier.co.uk`
   - **Password**: Your password
2. Click **"Sign In"**
3. Mac Mail should **auto-discover** the server settings!

---

## 📋 **Manual Setup (If Auto-Discover Fails):**

If you need to manually enter:

**Server Settings:**
- **Server**: `outlook.office365.com`
- **Port**: `993` (IMAP) or `587` (SMTP)
- **Use SSL**: ✅ Yes
- **Authentication**: Modern Authentication (OAuth 2.0)

**OR**

- **Exchange Server**: `outlook.office365.com`
- **Domain**: `testnotifier.co.uk`
- **Username**: `hello@testnotifier.co.uk`

---

## 🎯 **Common Issues:**

### **"Unable to verify account name or password"**

**Possible causes:**
1. ❌ DNS records not propagated yet (wait 5-30 minutes)
2. ❌ Wrong password
3. ❌ Account not active in Microsoft 365

**Solutions:**
- ✅ Wait for DNS to propagate
- ✅ Check password is correct
- ✅ Verify email is active in Microsoft 365 admin center

---

## ✅ **Recommended Approach:**

### **Use Outlook App (Easier):**

Instead of Mac Mail, use:
- **Microsoft Outlook** (Mac app)
- **Web version**: https://outlook.office.com

These work better with Microsoft 365!

---

## 🔗 **Where to Find Info:**

From your GoDaddy page, you have:

**Email Server:**
- `testnotifier-co-uk.mail.protection.outlook.com`

**Auto-Discover:**
- `autodiscover.outlook.com`

**Email Host:**
- `email.secureserver.net`

---

## 📝 **Quick Setup Steps:**

**Option 1: Auto-Discover (Easiest)**
1. Type: `hello@testnotifier.co.uk`
2. Password: Your Microsoft 365 password
3. Let Mac Mail auto-discover settings
4. Should work automatically!

**Option 2: Manual**
1. Server: `outlook.office365.com`
2. Email: `hello@testnotifier.co.uk`
3. Password: Your password

---

## ⏱️ **If Not Working:**

**DNS needs time to propagate:**
- Wait 5-30 minutes after adding DNS records
- Check DNS has propagated: https://dnschecker.org
- Verify Microsoft 365 admin center shows domain as verified

**Try the Outlook Web App:**
- Go to: https://outlook.office.com
- Login with `hello@testnotifier.co.uk`

Let me know if Mac Mail works with these settings! 🚀
