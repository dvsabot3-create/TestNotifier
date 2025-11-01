import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced logging for debugging SSL/HTTPS issues
app.use((req, res, next) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  console.log(`[${new Date().toISOString()}] ${req.method} ${protocol}://${host}${req.originalUrl}`);
  console.log(`[${new Date().toISOString()}] Headers:`, JSON.stringify(req.headers, null, 2));
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle redirect logic based on Render configuration
// testnotifier.co.uk → www.testnotifier.co.uk (Render's configuration)
app.use((req, res, next) => {
  const host = req.get('host');
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;

  console.log(`[Redirect Check] Host: ${host}, Protocol: ${protocol}, Original: ${req.originalUrl}`);

  // Only redirect if it's the root domain (not www)
  if (host && !host.startsWith('www.') && host === 'testnotifier.co.uk') {
    const newUrl = `${protocol}://www.${host}${req.originalUrl}`;
    console.log(`[Redirect] root → www: ${newUrl}`);
    return res.redirect(301, newUrl);
  }

  // If it's already www, don't redirect - serve content normally
  next();
});

// Import API handlers dynamically
const apiHandler = await import('./api/index.js');
const authHandler = await import('./api/auth/index.js');

// API Routes
app.use('/api', apiHandler.default);
app.use('/api/auth', authHandler.default);

// Health check endpoint with SSL debugging (supports both /health and /healthz)
app.get(['/health', '/healthz'], (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  const userAgent = req.get('user-agent');

  console.log(`[Health Check] ${protocol}://${host}${req.path} - User-Agent: ${userAgent}`);
  console.log(`[Health Check] Headers:`, JSON.stringify(req.headers, null, 2));

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL,
    protocol: protocol,
    host: host,
    userAgent: userAgent,
    headers: req.headers,
    ssl: {
      secure: req.secure,
      tls: false, // Modern Express doesn't expose connection.encrypted
      forwardedProto: req.headers['x-forwarded-proto'],
      forwardedFor: req.headers['x-forwarded-for']
    }
  });
});

// Serve static files from dist (frontend build)
const distPath = join(__dirname, 'dist');
app.use(express.static(distPath));

// Serve index.html for all other routes (SPA support)
app.get('/', (_req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

// Catch-all route for SPA support - must be last
app.use((req, res, _next) => {
  // Don't serve index.html for API routes only (health should work)
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(join(distPath, 'index.html'));
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TestNotifier server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🔐 Auth endpoints: /api/auth/*`);
  console.log(`💳 Billing endpoints: /api/billing/*`);
  console.log(`📁 Static files from: ${distPath}`);
});