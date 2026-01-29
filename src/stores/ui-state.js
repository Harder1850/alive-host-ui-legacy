/**
 * UI State Store
 * 
 * Ephemeral UI state only (per UI-04 No Memory Ownership).
 * 
 * Allowed:
 *   - layout
 *   - theme
 *   - panel visibility
 * 
 * Forbidden:
 *   - long-term memory
 *   - cognition state
 *   - execution outcomes
 */

class UIStateStore {
  constructor() {
    this.state = {
      // Layout state
      layout: {
        panelVisibility: {
          input: true,
          output: true,
          logs: false,
          telemetry: false
        }
      },
      
      // Theme
      theme: 'dark',
      
      // Connection status (ephemeral)
      systemConnected: false,
      
      // Current canvas content (ephemeral, from system streams)
      canvas: null
    };
    
    this.listeners = new Set();
  }

  /**
   * Get current state
   */
  getState() {
    return this.state;
  }

  /**
   * Update state (shallow merge)
   */
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this._notify();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Convenience methods

  setSystemConnected(connected) {
    this.setState({ systemConnected: connected });
  }

  setCanvas(canvas) {
    this.setState({ canvas });
  }

  clearCanvas() {
    this.setState({ canvas: null });
  }

  togglePanel(panelName) {
    const visibility = { ...this.state.layout.panelVisibility };
    visibility[panelName] = !visibility[panelName];
    this.setState({
      layout: { ...this.state.layout, panelVisibility: visibility }
    });
  }

  setTheme(theme) {
    this.setState({ theme });
  }
}

// Export singleton
export const uiState = new UIStateStore();
export default UIStateStore;
