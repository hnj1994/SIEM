const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.SERVER_PORT || 4000;
const WAZUH_URL = process.env.VITE_WAZUH_API_URL || 'https://4.188.228.167:55000';
const OLLAMA_URL = process.env.VITE_OLLAMA_API_URL || 'http://4.188.228.167:11434';

// CORS
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['*'] }));

// Rate limiting
const limiter = rateLimit({ windowMs: 60000, max: 300 });
app.use(limiter);

// Wazuh Proxy
app.use('/api/wazuh', createProxyMiddleware({
  target: WAZUH_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/wazuh': '' },
  secure: false, // Allow self-signed certs
  agent: new https.Agent({ rejectUnauthorized: false }),
  on: {
    error: (err, req, res) => {
      console.error('[Wazuh Proxy Error]', err.message);
      res.status(502).json({ 
        error: 'Wazuh API unavailable', 
        details: err.message,
        target: WAZUH_URL 
      });
    },
  },
}));

// Ollama Proxy
app.use('/api/ollama', createProxyMiddleware({
  target: OLLAMA_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/ollama': '' },
  selfHandleResponse: false,
  on: {
    error: (err, req, res) => {
      console.error('[Ollama Proxy Error]', err.message);
      res.status(502).json({ 
        error: 'Ollama API unavailable', 
        details: err.message,
        target: OLLAMA_URL 
      });
    },
  },
}));

// Health check
app.get('/health', (req, res) => res.json({ 
  status: 'ok', 
  timestamp: new Date().toISOString(),
  wazuhTarget: WAZUH_URL,
  ollamaTarget: OLLAMA_URL,
  port: PORT
}));

app.listen(PORT, () => console.log(`SOC Nexus Proxy running on port ${PORT}`));
