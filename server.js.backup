/**
 * ALIVE Host UI - Static Server
 * 
 * Serves the UI files. Browser connects directly to alive-system.
 * 
 * Architecture:
 *   Browser (host-ui) → alive-system:7070
 *   This server just serves static files.
 */

const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Serve src/ for ES modules
app.use('/src', express.static(path.join(__dirname, 'src')));

// Serve UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', role: 'host-ui-static' });
});

// Start
app.listen(PORT, HOST, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                  ALIVE HOST UI                        ║
╠═══════════════════════════════════════════════════════╣
║  UI Server:    http://localhost:${PORT}                  ║
║  Role:         Static file server only                ║
╠═══════════════════════════════════════════════════════╣
║  Browser connects directly to alive-system:           ║
║  System:       ws://localhost:7070/?type=host         ║
╚═══════════════════════════════════════════════════════╝
  `);
});
