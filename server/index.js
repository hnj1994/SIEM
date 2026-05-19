const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.SERVER_PORT || 4000;

// CORS
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['*'] }));

// Rate limiting
const limiter = rateLimit({ windowMs: 60000, max: 300 });
app.use(limiter);

// Wazuh Proxy
app.use('/api/wazuh', createProxyMiddleware({
  target: process.env.VITE_WAZUH_API_URL || 'https://10.0.0.4:55000',
  changeOrigin: true,
  pathRewrite: { '^/api/wazuh': '' },
  secure: false, // Allow self-signed certs
  agent: new https.Agent({ rejectUnauthorized: false }),
  on: {
    error: (err, req, res) => {
      console.error('[Wazuh Proxy Error]', err.message);
      res.status(502).json({ error: 'Wazuh API unavailable', details: err.message });
    },
  },
}));

// Ollama Proxy
app.use('/api/ollama', createProxyMiddleware({
  target: process.env.VITE_OLLAMA_API_URL || 'http://10.0.0.4:11434',
  changeOrigin: true,
  pathRewrite: { '^/api/ollama': '' },
  selfHandleResponse: false,
  on: {
    error: (err, req, res) => {
      console.error('[Ollama Proxy Error]', err.message);
      res.status(502).json({ error: 'Ollama API unavailable', details: err.message });
    },
  },
}));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => console.log(`SOC Nexus Proxy running on port ${PORT}`));
