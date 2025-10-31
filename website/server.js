import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import API handlers dynamically
const apiHandler = await import('./api/index.js');
const authHandler = await import('./api/auth/index.js');

// API Routes
app.use('/api', apiHandler.default);
app.use('/api/auth', authHandler.default);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL
  });
});

// Serve static files from dist (frontend build)
const distPath = join(__dirname, 'dist');
app.use(express.static(distPath));

// Serve index.html for all other routes (SPA support)
app.get('/', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

// Catch-all route for SPA support - must be last
app.use((req, res, next) => {
  // Don't serve index.html for API routes or health check
  if (req.path.startsWith('/api') || req.path === '/health') {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(join(distPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
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