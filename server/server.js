require('dotenv').config();
const express = require('express');
const path = require('path');
const apiRoutes = require('./api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// API routes (apiRoutes already includes /api prefix)
app.use(apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Dental Clinic API is running' });
});

// Serve static files from Angular build (production)
const staticPath = path.join(__dirname, '../dist/todo/browser');
if (require('fs').existsSync(staticPath)) {
  app.use(express.static(staticPath, {
    maxAge: '1y',
    index: false
  }));
  
  // Catch-all handler: send back Angular's index.html file for all non-API routes
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(staticPath, 'index.html'));
  });
  
  console.log('📁 Serving static files from:', staticPath);
} else {
  console.log('⚠️  Static files not found. Run "npm run build:client" first.');
  console.log('   Expected path:', staticPath);
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  if (require('fs').existsSync(staticPath)) {
    console.log(`🌐 Frontend available at http://localhost:${PORT}`);
  }
});

module.exports = app;

