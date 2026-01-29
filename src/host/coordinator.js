/**
 * Host Coordinator
 * 
 * Wires together panels, services, and state.
 * No intelligence. Pure coordination.
 * 
 * Per HOST_UI_ARCHITECTURE.md:
 *   - Panels are passive
 *   - Requests are explicit
 *   - Power is downstream
 *   - UI is disposable
 */

import { systemClient } from '../services/system-client.js';
import { uiState } from '../stores/ui-state.js';
import InputPanel from '../panels/input-panel.js';
import OutputPanel from '../panels/output-panel.js';

class HostCoordinator {
  constructor() {
    this.inputPanel = null;
    this.outputPanel = null;
    this.initialized = false;
  }

  /**
   * Initialize the host UI
   */
  init() {
    if (this.initialized) return;
    
    // Get containers
    const inputContainer = document.getElementById('input-container');
    const outputContainer = document.getElementById('output-container');
    
    if (!inputContainer || !outputContainer) {
      console.error('[Host] Missing required containers');
      return;
    }

    // Initialize panels
    this.inputPanel = new InputPanel(inputContainer);
    this.outputPanel = new OutputPanel(outputContainer);

    // Wire up system client events
    this._wireSystemEvents();

    // Connect to alive-system
    systemClient.connect();

    this.initialized = true;
    console.log('[Host] Initialized');
  }

  _wireSystemEvents() {
    // Connection status
    systemClient.on('status', (data) => {
      const connected = data.connected;
      uiState.setSystemConnected(connected);
      this.inputPanel?.setEnabled(connected);
    });

    // Render instructions from alive-system (via Body)
    // NOTE: System is authority for content. Sanitization is System's
    // responsibility, not Host's. Host renders what System instructs.
    systemClient.on('render', (data) => {
      uiState.setCanvas(data);
    });
  }
}

// Export singleton
export const host = new HostCoordinator();
export default HostCoordinator;
