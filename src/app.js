/**
 * ALIVE Host UI - Main Application
 * 
 * Wires input, output, and system connection.
 * This is a dumb terminal. No intelligence here.
 */

import { connect } from './services/system-client.js';
import { initInputPanel } from './services/input-panel.js';
import { initOutputPanel, handleMessage } from './services/output-panel.js';

/**
 * Initialize the application.
 */
function init() {
  console.log('[app] Initializing ALIVE Host UI');
  
  // Initialize panels
  initOutputPanel();
  initInputPanel();
  
  // Connect to alive-system
  connect(handleMessage);
  
  console.log('[app] Ready');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
