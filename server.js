/**
 * ALIVE Host UI - Launcher Server
 *
 * Starts alive-system, then serves the UI files.
 */
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const SYSTEM_PATH = process.env.SYSTEM_PATH || '../alive-system';

const app = express();
let systemProcess = null;

// Start alive-system
function startSystem() {
  return new Promise((resolve, reject) => {
    console.log('[HOST-UI] Starting alive-system...');
    
    systemProcess = spawn('npm', ['start'], {
      cwd: path.join(__dirname, SYSTEM_PATH),
      stdio: 'inherit',
      shell: true
    });

    systemProcess.on('error', reject);
    
    setTimeout(() => {
      if (systemProcess && !systemProcess.killed) {
        console.log('[HOST-UI] ? System started');
        resolve();
      }
    }, 3000);
  });
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', systemRunning: systemProcess && !systemProcess.killed });
});

async function main() {
  try {
    await startSystem();
    app.listen(PORT, HOST, () => {
      console.log(`
+-------------------------------------------------------+
¦                  ALIVE HOST UI                        ¦
¦-------------------------------------------------------¦
¦  UI:    http://localhost:${PORT}                          ¦
¦  System: ws://localhost:7070                          ¦
¦  Mode:   Launcher + Server                            ¦
+-------------------------------------------------------+
      `);
    });
  } catch (err) {
    console.error('Failed to start:', err.message);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.log('Shutting down...');
  if (systemProcess) systemProcess.kill();
  process.exit(0);
});

main();
