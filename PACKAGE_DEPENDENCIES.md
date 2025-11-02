# 📦 Required Package Dependencies

The audit fixes require these npm packages. Ensure they're installed:

## Required for CSRF Protection
```bash
npm install express-session
```

## Already Installed (Verify)
```bash
# Should already be in package.json
- express
- express-rate-limit
- helmet
- cors
- bcryptjs
- jsonwebtoken
- nodemailer
- sanitize-html
- express-validator
```

## Add to package.json if missing:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.7",
    "sanitize-html": "^2.11.0",
    "express-validator": "^7.0.1"
  }
}
```

## Installation Command
```bash
cd /Users/mosman/Documents/DVLA\ BOT/website
npm install
```

