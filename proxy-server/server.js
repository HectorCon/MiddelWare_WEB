const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
// Render will provide the PORT environment variable
const port = process.env.PORT || 10000;
const TARGET_URL = process.env.TARGET_URL || 'http://134.209.74.19:8080';

// CORS middleware function
const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Expose-Headers', 'Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
};

// Apply CORS middleware
app.use(corsMiddleware);

// Proxy middleware configuration
const proxyOptions = {
  target: TARGET_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // rewrite path if needed
  },
  onProxyReq: (proxyReq, req) => {
    // Forward the JWT token if present
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // Ensure CORS headers are preserved and set correctly
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Expose-Headers', 'Authorization');

    // Handle JWT token in response if needed
    if (proxyRes.headers['authorization']) {
      res.setHeader('Authorization', proxyRes.headers['authorization']);
    }
  },
  // Handle WebSocket upgrades if needed
  ws: true,
  secure: false, // Skip certificate validation for target
};

// Create proxy middleware
const apiProxy = createProxyMiddleware(proxyOptions);

// Use proxy for all /api/* routes
app.use('/api', apiProxy);

// Health check endpoint
app.get('/health', (req, res) => {
  res.send({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.header('Access-Control-Allow-Origin', '*');
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${port}`);
  console.log(`Target URL: ${TARGET_URL}`);
  console.log(`CORS configuration: Allow all origins (*)`);
  console.log(`Server is ready to handle requests`);
});