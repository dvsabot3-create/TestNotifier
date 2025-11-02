/**
 * CSRF Protection Middleware
 * Protects against Cross-Site Request Forgery attacks
 */

const crypto = require('crypto');

// Store for CSRF tokens (in production, use Redis or database)
const csrfTokens = new Map();

// Token expiration time (15 minutes)
const TOKEN_EXPIRATION = 15 * 60 * 1000;

/**
 * Generate a CSRF token
 */
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Middleware to generate CSRF token and attach to response
 */
function csrfTokenMiddleware(req, res, next) {
  // Skip for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    // Generate token for session
    const sessionId = req.sessionID || req.ip;
    let tokenData = csrfTokens.get(sessionId);
    
    if (!tokenData || Date.now() > tokenData.expiresAt) {
      const token = generateToken();
      tokenData = {
        token,
        expiresAt: Date.now() + TOKEN_EXPIRATION
      };
      csrfTokens.set(sessionId, tokenData);
    }
    
    // Attach token to response (can be sent in cookie or header)
    res.setHeader('X-CSRF-Token', tokenData.token);
    req.csrfToken = tokenData.token;
  }
  
  next();
}

/**
 * Middleware to validate CSRF token
 */
function csrfProtection(req, res, next) {
  // Skip for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip for webhook endpoints (they use signature verification instead)
  if (req.path.includes('/webhooks/')) {
    return next();
  }

  const sessionId = req.sessionID || req.ip;
  const tokenData = csrfTokens.get(sessionId);
  
  // Get token from header or body
  const clientToken = req.headers['x-csrf-token'] || 
                      req.headers['csrf-token'] || 
                      req.body._csrf ||
                      req.body.csrfToken;

  // Validate token exists
  if (!clientToken) {
    return res.status(403).json({
      error: 'CSRF token missing',
      message: 'CSRF token is required for this request'
    });
  }

  // Validate token matches
  if (!tokenData || clientToken !== tokenData.token) {
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'CSRF token validation failed'
    });
  }

  // Validate token not expired
  if (Date.now() > tokenData.expiresAt) {
    csrfTokens.delete(sessionId);
    return res.status(403).json({
      error: 'CSRF token expired',
      message: 'CSRF token has expired. Please refresh and try again.'
    });
  }

  next();
}

/**
 * Cleanup expired tokens periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, tokenData] of csrfTokens.entries()) {
    if (now > tokenData.expiresAt) {
      csrfTokens.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

module.exports = {
  csrfTokenMiddleware,
  csrfProtection,
  generateToken
};

