const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { initDatabase, isDbOnline } = require('./config/db');
const { setupTablesAndSeed } = require('./services/dbInitService');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const contactRoutes = require('./routes/contactRoutes');
const projectRoutes = require('./routes/projectRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger Middleware
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API Request] ${req.method} ${req.url} - ${new Date().toISOString()}`);
  }
  next();
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    database: {
      online: isDbOnline(),
      type: 'MySQL'
    },
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stats', statsRoutes);

// Serve React production build if available
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Serve root static assets (images, fonts, etc.)
const frontendRoot = path.join(__dirname, '..');
app.use(express.static(frontendRoot));

// Fallback for API 404s
app.use('/api/*', notFoundHandler);

// Single-page application fallback for client routing
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  const reactIndex = path.join(distPath, 'index.html');
  if (fs.existsSync(reactIndex)) {
    return res.sendFile(reactIndex);
  }
  const staticIndex = path.join(frontendRoot, 'index.html');
  if (fs.existsSync(staticIndex)) {
    return res.sendFile(staticIndex);
  }
  next();
});

// Centralized Error Handling
app.use(errorHandler);

// Bootstrap Server & Database
async function startServer() {
  try {
    console.log('--------------------------------------------------');
    console.log(' Starting Sosna Hailu Portfolio Backend Service ');
    console.log('--------------------------------------------------');

    // Initialize MySQL Database Connection
    await initDatabase();

    // Verify / Seed Project and Contact Schema
    await setupTablesAndSeed();

    const server = app.listen(PORT, () => {
      console.log(`[Server] Live and listening at: http://localhost:${PORT}`);
      console.log(`[Server] API Health check available at: http://localhost:${PORT}/api/health`);
      console.log(`[Server] Projects API: http://localhost:${PORT}/api/projects`);
      console.log(`[Server] Contact API: http://localhost:${PORT}/api/contact`);
      console.log(`[Server] Stats API: http://localhost:${PORT}/api/stats`);
      console.log('--------------------------------------------------');
    });

    return server;
  } catch (err) {
    console.error('[Server Startup Failure]:', err.message);
    process.exit(1);
  }
}

// Start execution
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
