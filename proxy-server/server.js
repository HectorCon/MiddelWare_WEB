const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const TARGET_URL = process.env.TARGET_URL || 'http://134.209.74.19:8080';

// Configure CORS to accept all origins
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
};

// Enable CORS with specific options
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests
app.options('*', cors(corsOptions));

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
    // Add CORS headers to the proxy response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    proxyRes.headers['Access-Control-Expose-Headers'] = 'Authorization';

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

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});