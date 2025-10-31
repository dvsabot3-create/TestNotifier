# Website White Screen Diagnosis - TestNotifier

## 🔍 Issue Analysis

**Problem**: Website at https://testnotifier.co.uk/ shows white/blank screen
**Build Status**: ✅ Successful (no build errors)
**Local Preview**: ✅ Running on http://localhost:4174/

## 🚨 Common Causes of White Screen

### 1. **Server/Deployment Issues** (Most Likely)

#### 1.1 File Not Found (404 Error)
**Symptoms**:
- White screen with no content
- Console shows 404 errors
- Network tab shows failed requests

**Diagnosis Steps**:
```bash
# Check if files exist on server
ssh your-user@testnotifier.co.uk "ls -la /var/www/testnotifier/"

# Check nginx error logs
ssh your-user@testnotifier.co.uk "sudo tail -f /var/log/nginx/error.log"

# Check access logs
ssh your-user@testnotifier.co.uk "sudo tail -f /var/log/nginx/access.log"
```

#### 1.2 Incorrect File Paths
**Symptoms**:
- Console shows 404 errors for CSS/JS files
- Network tab shows failed asset requests

**Diagnosis Steps**:
```bash
# Check nginx configuration
ssh your-user@testnotifier.co.uk "sudo nginx -t"

# Check if index.html exists
ssh your-user@testnotifier.co.uk "ls -la /var/www/testnotifier/index.html"

# Check if assets are accessible
curl -I https://testnotifier.co.uk/assets/css/index-b820503a.css
curl -I https://testnotifier.co.uk/assets/index-6ff1b5a0.js
```

#### 1.3 Permission Issues
**Symptoms**:
- 403 Forbidden errors
- Cannot access files

**Diagnosis Steps**:
```bash
# Check file permissions
ssh your-user@testnotifier.co.uk "ls -la /var/www/testnotifier/"
ssh your-user@testnotifier.co.uk "sudo chown -R www-data:www-data /var/www/testnotifier"
ssh your-user@testnotifier.co.uk "sudo chmod -R 755 /var/www/testnotifier"
```

### 2. **SSL/Certificate Issues**

#### 2.1 SSL Certificate Problems
**Symptoms**:
- Browser shows certificate warnings
- HTTPS not working properly
- Mixed content errors

**Diagnosis Steps**:
```bash
# Check SSL certificate
openssl s_client -servername testnotifier.co.uk -connect testnotifier.co.uk:443

# Check certificate expiry
echo | openssl s_client -servername testnotifier.co.uk -connect testnotifier.co.uk:443 | openssl x509 -noout -dates

# Check for mixed content errors
curl -s -I https://testnotifier.co.uk | grep -i "content-type"
```

### 3. **Nginx Configuration Issues**

#### 3.1 Incorrect Nginx Configuration
**Symptoms**:
- 502 Bad Gateway errors
- Wrong file paths
- Missing security headers

**Diagnosis Steps**:
```bash
# Test nginx configuration
ssh your-user@testnotifier.co.uk "sudo nginx -t"

# Check nginx status
ssh your-user@testnotifier.co.uk "sudo systemctl status nginx"

# Check nginx error logs
ssh your-user@testnotifier.co.uk "sudo tail -n 50 /var/log/nginx/error.log"
```

#### 3.2 Missing Security Headers
**Symptoms**:
- Browser console shows security warnings
- Content blocked by browser
- CSP violations

**Diagnosis Steps**:
```bash
# Check security headers
curl -s -I https://testnotifier.co.uk | grep -i "content-security-policy\|x-frame-options\|x-content-type-options"

# Check for CSP violations
curl -s https://testnotifier.co.uk | grep -i "content-security-policy"
```

### 4. **JavaScript/CSS Loading Issues**

#### 4.1 JavaScript Errors
**Symptoms**:
- Console shows JavaScript errors
- Page loads but functionality doesn't work
- Assets not loading

**Diagnosis Steps**:
```bash
# Check browser console (open DevTools)
# Go to Console tab in browser

# Check if JavaScript files are accessible
curl -s https://testnotifier.co.uk/assets/index-6ff1b5a0.js | head -10

# Check if CSS files are accessible
curl -s https://testnotifier.co.uk/assets/css/index-b820503a.css | head -10
```

#### 4.2 Content Security Policy (CSP) Issues
**Symptoms**:
- Console shows CSP violations
- Scripts/styles blocked
- Mixed content warnings

**Diagnosis Steps**:
```bash
# Check CSP headers
curl -s -I https://testnotifier.co.uk | grep -i "content-security-policy"

# Check for mixed content
curl -s https://testnotifier.co.uk | grep -i "http://"
```

## 🔧 Immediate Troubleshooting Steps

### Step 1: Check Basic Connectivity
```bash
# Test if website is accessible
curl -I https://testnotifier.co.uk

# Check HTTP status code
curl -s -o /dev/null -w "%{http_code}" https://testnotifier.co.uk

# Check if it's redirecting
curl -s -o /dev/null -w "%{redirect_url}" https://testnotifier.co.uk
```

### Step 2: Check Browser Console
1. Open https://testnotifier.co.uk in browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for any error messages
5. Go to Network tab
6. Check for failed requests (red entries)

### Step 3: Check Server Status
```bash
# Check if server is running
ssh your-user@testnotifier.co.uk "sudo systemctl status nginx"

# Check if web server is listening
ssh your-user@testnotifier.co.uk "sudo netstat -tlnp | grep :80"

# Check disk space
ssh your-user@testnotifier.co.uk "df -h"
```

### Step 4: Verify Files Are Deployed
```bash
# Check if index.html exists
ssh your-user@testnotifier.co.uk "ls -la /var/www/testnotifier/index.html"

# Check if assets exist
ssh your-user@testnotifier.co.uk "ls -la /var/www/testnotifier/assets/"

# Check file permissions
ssh your-user@testnotifier.co.uk "ls -la /var/www/testnotifier/"
```

## 🚨 Emergency Recovery Steps

### If Website is Completely Down:

1. **Check Server Status**
```bash
ssh your-user@testnotifier.co.uk "sudo systemctl status nginx"
# If nginx is down: sudo systemctl start nginx
```

2. **Check Recent Deployments**
```bash
# Check last deployment
ssh your-user@testnotifier.co.uk "ls -la /var/www/testnotifier/ | head -10"

# Check deployment logs
ssh your-user@testnotifier.co.uk "tail -n 50 /var/log/testnotifier/deployment-*.log"
```

3. **Restore from Backup if Needed**
```bash
# List available backups
ssh your-user@testnotifier.co.uk "ls -la /backups/testnotifier/daily/"

# Restore from backup (if critical)
# Follow backup recovery procedures
```

## 📊 Common White Screen Causes & Solutions

### Cause 1: Missing index.html
**Solution**: Ensure index.html is deployed
```bash
ssh your-user@testnotifier.co.uk "ls -la /var/www/testnotifier/index.html"
# If missing: Redeploy using deploy-website.sh
```

### Cause 2: Wrong Document Root
**Solution**: Update nginx configuration
```bash
# Check nginx root directory
ssh your-user@testnotifier.co.uk "grep 'root' /etc/nginx/sites-available/testnotifier"
# Should be: root /var/www/testnotifier;
```

### Cause 3: JavaScript Loading Issues
**Solution**: Check asset paths and CSP headers
```bash
# Check if assets are accessible
curl -I https://testnotifier.co.uk/assets/index-6ff1b5a0.js
```

### Cause 4: SSL Certificate Issues
**Solution**: Check certificate validity
```bash
# Check certificate expiry
openssl s_client -servername testnotifier.co.uk -connect testnotifier.co.uk:443 | openssl x509 -noout -dates
```

## 🎯 Quick Diagnostic Commands

Run these commands to quickly identify the issue:

```bash
# 1. Check if website responds
curl -I https://testnotifier.co.uk

# 2. Check server status
ssh your-user@testnotifier.co.uk "sudo systemctl status nginx"

# 3. Check nginx configuration
ssh your-user@testnotifier.co.uk "sudo nginx -t"

# 4. Check recent logs
ssh your-user@testnotifier.co.uk "sudo tail -n 20 /var/log/nginx/error.log"

# 5. Check if files exist
ssh your-user@testnotifier.co.uk "ls -la /var/www/testnotifier/"

# 6. Check SSL certificate
openssl s_client -servername testnotifier.co.uk -connect testnotifier.co.uk:443 -showcerts
```

## 📞 Emergency Contacts

If you need immediate help:
1. **Check your server provider's status page**
2. **Contact your hosting provider support**
3. **Check Stripe status** (if payment-related): https://status.stripe.com/
4. **Check domain registrar status** (if DNS-related)

---

**Next Steps**:
1. **Run the diagnostic commands above**
2. **Check the specific error messages**
3. **Apply the appropriate solution**
4. **Test the fix**
5. **Monitor for 24 hours**

**Emergency Contact**: Your server/hosting provider support team
**Documentation**: Keep this guide handy for future reference

**Status**: Ready to help you resolve this issue! 🚀**