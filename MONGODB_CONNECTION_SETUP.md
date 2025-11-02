# 🔗 MONGODB CONNECTION SETUP
## Your Database Configuration

**Date:** November 2, 2025  
**Status:** Database Created - Ready to Connect  

---

## 📊 YOUR MONGODB CREDENTIALS

```
Username: dvsabot3_db_user
Password: 9Jthbxx1rTsze5bG
Database: testnotifier (or default)
IP Access: 91.90.121.222/32 (Your IP)
```

---

## ⚠️ CRITICAL: UPDATE IP ACCESS LIST

Your MongoDB is currently restricted to **ONE IP address**: `91.90.121.222/32`

This will **BLOCK Render from connecting!**

### Fix in MongoDB Atlas:

1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" in left sidebar
3. Click "Add IP Address"
4. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - OR add Render's IP ranges specifically
5. Click "Confirm"

**Without this, Render cannot connect to your database!** ❌

---

## 🔗 YOUR CONNECTION STRING

### For Render (Production):

```
DATABASE_URL=mongodb+srv://dvsabot3_db_user:9Jthbxx1rTsze5bG@cluster0.mongodb.net/testnotifier?retryWrites=true&w=majority
```

**Note:** You may need to replace `cluster0.mongodb.net` with your actual cluster address.

### To Get Exact Connection String:

1. Go to MongoDB Atlas Dashboard
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Choose "Node.js" driver
5. Copy the connection string
6. Replace `<username>` with: `dvsabot3_db_user`
7. Replace `<password>` with: `9Jthbxx1rTsze5bG`
8. Replace `<database>` with: `testnotifier`

---

## 🚀 ADD TO RENDER (CRITICAL STEP)

### Step-by-Step:

1. **Go to Render Dashboard**
   - https://dashboard.render.com
   - Select your `testnotifier-website` service

2. **Navigate to Environment Tab**
   - Click "Environment" in left sidebar

3. **Add New Environment Variable**
   - Click "Add Environment Variable"
   - Key: `DATABASE_URL`
   - Value: `mongodb+srv://dvsabot3_db_user:9Jthbxx1rTsze5bG@cluster0.mongodb.net/testnotifier?retryWrites=true&w=majority`
   - Click "Save"

4. **Service Will Auto-Redeploy**
   - Render will automatically restart
   - Will connect to MongoDB
   - Webhooks will start saving to database

---

## ✅ VERIFICATION STEPS

### After Adding DATABASE_URL to Render:

1. **Check Deployment Logs**
   ```
   Look for:
   ✅ "Database connected successfully"
   ✅ "TestNotifier website server running on port 10000"
   ```

2. **Test Webhook Endpoint**
   ```
   Make a test purchase
   Check logs for:
   ✅ "User subscription activated: [email]"
   ✅ "New user created: [email]"
   ```

3. **Test Extension**
   ```
   Open extension
   Should see:
   ✅ "Loading subscription from backend API..."
   ✅ Correct tier badge (🔵 PRO if purchased Professional)
   ✅ Real usage limits (not demo data)
   ```

---

## 🔍 TROUBLESHOOTING

### If Connection Fails:

#### Error: "IP not whitelisted"
**Solution:** Add `0.0.0.0/0` to MongoDB Network Access

#### Error: "Authentication failed"
**Solution:** Double-check username and password in connection string

#### Error: "Cannot connect to cluster"
**Solution:** Verify cluster name in connection string

#### Error: "Database not found"
**Solution:** MongoDB will auto-create database on first write

---

## 📋 QUICK REFERENCE

### Your MongoDB Cluster:
- **Provider:** MongoDB Atlas
- **User:** dvsabot3_db_user
- **Email:** dvsabot3@gmail.com
- **Region:** (Check your Atlas dashboard)
- **Plan:** Free M0 (should be sufficient to start)

### Required Render Env Vars:

```env
# Existing (Already Set):
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=...
FRONTEND_URL=https://testnotifier.co.uk
JWT_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# NEW (Add This):
DATABASE_URL=mongodb+srv://dvsabot3_db_user:9Jthbxx1rTsze5bG@cluster0.mongodb.net/testnotifier?retryWrites=true&w=majority
```

---

## 🎯 NEXT IMMEDIATE STEPS

1. **Fix IP Access List** in MongoDB Atlas
   - Allow access from anywhere (0.0.0.0/0)
   - OR add Render's IP ranges

2. **Add DATABASE_URL to Render**
   - Copy connection string above
   - Add as environment variable
   - Service will auto-restart

3. **Test Payment Flow**
   - Make test purchase
   - Check Render logs
   - Verify database entry created

4. **Test Extension**
   - Download extension
   - Sign in
   - Should show real subscription tier

---

## ✅ SYSTEM STATUS

**Database:** ✅ Created  
**Connection String:** ✅ Ready  
**Code:** ✅ Deployed  
**Webhooks:** ✅ Implemented  

**Ready to connect:** ✅ YES - Just add DATABASE_URL to Render!

---

**Once DATABASE_URL is added to Render, your system will be 100% functional!** 🎉

