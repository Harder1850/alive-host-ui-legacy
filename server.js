/**
 * ALIVE Host UI - Master Launcher
 *
 * Starts all ALIVE components:
 * 1. alive-core (reasoning, memory) ? port 7072
 * 2. alive-body (execution, sensors) ? port 7071
 * 3. alive-system (orchestrator) ? port 7070
 * Then serves the UI on port 3001
 */
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const CORE_PATH = process.env.CORE_PATH || 'C:\\Users\\mikeh\\dev\\ALIVE\\alive-repos\\alive-mind';
const BODY_PATH = process.env.BODY_PATH || 'C:\\Users\\mikeh\\dev\\ALIVE\\alive-repos\\alive-body';
const SYSTEM_PATH = process.env.SYSTEM_PATH || 'C:\\Users\\mikeh\\dev\\ALIVE\\alive-repos\\alive-runtime';

const app = express();
const processes = { core: null, body: null, system: null };

function log(component, message) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] [${component}] ${message}`);
}

function error(component, message) {
  const timestamp = new Date().toLocaleTimeString();
  console.error(`[${timestamp}] [${component}] ? ${message}`);
}

function startComponent(name, cwd, command = 'npm start') {
  return new Promise((resolve, reject) => {
    log('HOST-UI', `Starting ${name}...`);
    
    const proc = spawn(command, [], {
      cwd: path.isAbsolute(cwd) ? cwd : path.join(__dirname, cwd),
      stdio: 'inherit',
      shell: true
    });

    proc.on('error', (err) => {
      error(name, err.message);
      reject(err);
    });

    processes[name] = proc;

    setTimeout(() => {
      if (proc && !proc.killed) {
        log('HOST-UI', `? ${name} started`);
        resolve();
      } else {
        reject(new Error(`${name} failed to start`));
      }
    }, 2000);
  });
}

async function startComponents() {
  try {
    log('HOST-UI', '?? Starting all components...\n');
    
    await startComponent('core', CORE_PATH);
    await startComponent('body', BODY_PATH);
    await startComponent('system', SYSTEM_PATH);
    
    log('HOST-UI', '? All components started\n');
  } catch (err) {
    error('HOST-UI', `Failed to start components: ${err.message}`);
    process.exit(1);
  }
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    components: {
      core: processes.core && !processes.core.killed,
      body: processes.body && !processes.body.killed,
      system: processes.system && !processes.system.killed
    }
  });
});

async function main() {
  try {
    await startComponents();
    
    app.listen(PORT, HOST, () => {
      console.log(`
+-------------------------------------------------------+
�              ?? ALIVE SYSTEM RUNNING                  �
�-------------------------------------------------------�
�  ?? Open: http://localhost:${PORT}                        
�  ?? Core     ? localhost:7072                         �
�  ???  Body     ? localhost:7071                         �
�  ??  System   ? localhost:7070                         �
�  Stop: Ctrl+C                                         �
+-------------------------------------------------------+
      `);
    });
  } catch (err) {
    error('HOST-UI', `Failed to start: ${err.message}`);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  log('HOST-UI', '?? Shutting down...');
  
  Object.entries(processes).forEach(([name, proc]) => {
    if (proc && !proc.killed) {
      try {
        proc.kill();
        log('HOST-UI', `  Stopped ${name}`);
      } catch (e) {}
    }
  });
  
  process.exit(0);
});

main();
