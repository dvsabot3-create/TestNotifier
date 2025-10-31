# 🚀 Complete Website Audit - TestNotifier Deployment Verification

## 📊 Current Status Check

### 1. Domain Configuration
- [ ] Check testnotifier.co.uk redirects properly
- [ ] Verify DNS records are configured
- [ ] Check SSL certificate status
- [ ] Test both HTTP and HTTPS versions

### 2. Service Status
- [ ] Check Render service status
- [ ] Verify service is "Live"
- [ ] Check recent deployment logs
- [ ] Confirm service URL is accessible

## 🧪 Testing Checklist

### 3. Basic Connectivity Tests
```bash
# Test main domain
curl -I https://testnotifier.co.uk

# Test health endpoint
curl https://testnotifier.co.uk/health

# Test API endpoints
curl https://testnotifier.co.uk/api/health
```

### 4. SSL Certificate Check
```bash
# Check SSL certificate
openssl s_client -connect testnotifier.co.uk:443 -servername testnotifier.co.uk < /dev/null

# Check certificate details
echo | openssl s_client -connect testnotifier.co.uk:443 2>/dev/null | openssl x509 -noout -dates
```

### 5. Authentication System Tests
```bash
# Test Google OAuth redirect
curl -I https://testnotifier.co.uk/api/auth/google

# Test auth debug endpoint
curl https://testnotifier.co.uk/api/auth/debug

# Test login endpoint
curl -X POST https://testnotifier.co.uk/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}'
```

### 6. Chrome Extension Integration
```bash
# Test extension API endpoints
curl https://testnotifier.co.uk/api/extension/status
curl https://testnotifier.co.uk/api/extension/updates
curl https://testnotifier.co.uk/api/extension/config
```

### 7. Stripe Integration Tests
```bash
# Test Stripe endpoints
curl https://testnotifier.co.uk/api/billing/status
curl https://testnotifier.co.uk/api/billing/products
curl https://testnotifier.co.uk/api/billing/subscriptions
```

### 8. Database Connectivity
```bash
# Test database connection (if applicable)
curl https://testnotifier.co.uk/api/health/database
```

### 9. Email System Tests
```bash
# Test email endpoints
curl https://testnotifier.co.uk/api/email/status
curl -X POST https://testnotifier.co.uk/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com", "subject": "Test Email"}'
```

## 📈 Performance Tests

### 10. Response Time Tests
```bash
# Test response times
time curl -s https://testnotifier.co.uk/health > /dev/null
time curl -s https://testnotifier.co.uk > /dev/null
```

### 11. Asset Loading Tests
```bash
# Test static assets
curl -I https://testnotifier.co.uk/assets/index-ca3732e6.js
curl -I https://testnotifier.co.uk/assets/index-61df5851.css
```

### 12. API Response Tests
```bash
# Test API response times
time curl -s https://testnotifier.co.uk/api/health > /dev/null
time curl -s https://testnotifier.co.uk/api/auth/debug > /dev/null
```

## 🔒 Security Tests

### 13. Security Headers Check
```bash
# Check security headers
curl -I https://testnotifier.co.uk | grep -i "security\|x-frame\|x-content\|strict-transport"
```

### 14. CORS Configuration
```bash
# Test CORS headers
curl -H "Origin: https://example.com" -I https://testnotifier.co.uk/api/health
```

### 15. Rate Limiting Test
```bash
# Test rate limiting (make multiple requests)
for i in {1..10}; do curl -s https://testnotifier.co.uk/api/health; done
```

## 🔧 Environment Variables Check

### 16. Verify Environment Variables
Use the MCP command:
"Show me all environment variables for service testnotifier-website"

### 17. Check Required Variables
Ensure these are set:
- [ ] NODE_ENV=production
- [ ] PORT=10000
- [ ] FRONTEND_URL=https://testnotifier.co.uk
- [ ] JWT_SECRET=[configured]
- [ ] GOOGLE_CLIENT_ID=[configured]
- [ ] GOOGLE_CLIENT_SECRET=[configured]
- [ ] STRIPE_SECRET_KEY=[configured]

## 📊 Monitoring Setup

### 18. Service Monitoring
Use MCP commands:
- "Show me the metrics for service testnotifier-website"
- "Show me recent logs for service testnotifier-website"
- "Is service testnotifier-website healthy?"

### 19. Performance Monitoring
- [ ] Check CPU usage
- [ ] Check memory usage
- [ ] Check response times
- [ ] Check error rates

## 🎯 Final Verification

### 20. Complete Functionality Test
- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth works
- [ ] Chrome extension connects
- [ ] Stripe payments work
- [ ] Email notifications work
- [ ] Database operations work
- [ ] All API endpoints respond
- [ ] Static assets load correctly
- [ ] SSL certificate is valid
- [ ] Custom domain works
- [ ] Mobile responsiveness works

## 🚨 Common Issues to Check

1. **404 Errors:** Check if service is live and routes are correct
2. **500 Errors:** Check environment variables and logs
3. **SSL Issues:** Check certificate validity and expiration
4. **CORS Errors:** Check CORS_ORIGIN environment variable
5. **Database Connection:** Check DATABASE_URL
6. **Authentication Errors:** Check Google OAuth credentials
7. **Payment Errors:** Check Stripe webhook configuration

## 📋 Final Checklist

After running all tests, ensure:
- [ ] All endpoints return appropriate status codes
- [ ] SSL certificate is valid and not expiring soon
- [ ] Custom domain is working with SSL
- [ ] All environment variables are configured
- [ ] Service is stable and performing well
- [ ] No error logs in recent deployment
- [ ] All integrations (Google, Stripe, email) work
- [ ] Chrome extension can connect to API
- [ ] Mobile experience is good
- [ ] Performance is acceptable

**Run these tests and let me know the results! I'll help you fix any issues found.**