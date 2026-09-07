const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const uploadRoutes = require('./routes/upload');

const app = express();

// Enable CORS for client
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for uploaded files (avatars, resumes)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const uploadsPath = isServerless ? '/tmp/uploads' : path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  try {
    fs.mkdirSync(uploadsPath, { recursive: true });
  } catch (e) {
    // Ignore in read-only environments
  }
}
app.use('/uploads', express.static(uploadsPath));

// Normalize URL if /api was stripped by serverless router
app.use((req, res, next) => {
  if (!req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
    const apiRoutes = ['/auth', '/portfolio', '/admin', '/public', '/upload', '/health'];
    if (apiRoutes.some(route => req.url.startsWith(route))) {
      req.url = '/api' + req.url;
    }
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Portfolio Builder & Publishing Platform API',
    timestamp: new Date().toISOString()
  });
});

// Static serving for production client build (when run standalone)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // SPA catch-all route (serves index.html for non-API routes)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
