# Google OAuth Setup Guide - Real User Authentication

## 🚀 **Configuration Required**

To see real user data instead of demo accounts, you need to configure Google OAuth credentials.

## 📋 **Step 1: Google Cloud Console Setup**

### **1. Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### **2. Configure OAuth Consent Screen**
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in required fields:
   - **App name**: TestNotifier
   - **User support email**: your-email@domain.com
   - **Developer contact**: your-email@domain.com
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your email addresses)

### **3. Create OAuth Credentials**
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `https://testnotifier.co.uk/auth/callback`
   - `http://localhost:3000/auth/callback` (for local development)
5. Copy the **Client ID** and **Client Secret**

## 🔧 **Step 2: Environment Variables**

Create a `.env.local` file in your website directory:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here

# Application URLs
FRONTEND_URL=https://testnotifier.co.uk
VITE_APP_URL=https://testnotifier.co.uk
```

## 🎯 **Step 3: What Changed**

### **Before (Demo Mode)**
- Hardcoded demo user data
- `demo@testnotifier.co.uk` email
- `demo_user_123` user ID
- "This is a demo account" message

### **After (Real OAuth)**
- Real Google user data
- Actual user email addresses
- Real Google user IDs
- Professional account information

## ✅ **Step 4: Testing**

1. **Set up environment variables** with your Google OAuth credentials
2. **Restart your development server**
3. **Click "Continue with Google"** in the sign-in modal
4. **You'll be redirected to Google** for real authentication
5. **After Google login**, you'll see your real user data

## 🔍 **Expected Result**

After configuration, users will see:
- **Real email address** (e.g., `john.smith@gmail.com`)
- **Real name** (e.g., "Welcome back, John!")
- **Actual Google user ID**
- **Professional account information**
- **Real subscription data**

## 🚨 **Important Notes**

### **Security**
- Never commit OAuth credentials to version control
- Use environment variables for all sensitive data
- Configure proper redirect URIs for security

### **Production Deployment**
- Update redirect URIs in Google Console for production
- Use production URLs in environment variables
- Test thoroughly before going live

## 🎉 **Result**

Once configured, your sign-in will:
- ✅ Redirect to real Google OAuth
- ✅ Show actual user information
- ✅ Display real email addresses
- ✅ Provide professional user experience
- ✅ Ready for production launch

The system is now configured for real user authentication! 🚀
