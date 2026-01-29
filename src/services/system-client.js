/**
 * System Client Service
 * 
 * Connects Host UI to alive-system via WebSocket.
 * Pure transport. No intelligence.
 * 
 * Per contract:
 *   Host sends: observation
 *   System sends: render
 */

class SystemClient {
  constructor() {
    this.url = this._getSystemURL();
    this.ws = null;
    this.connected = false;
    this.handlers = {
      status: [],
      render: []
    };
    this.reconnectInterval = 5000;
    this.reconnectTimer = null;
  }

  _getSystemURL() {
    // In production, configure via environment or config
    // Default: alive-system runs on port 7070
    const systemHost = window.ALIVE_SYSTEM_HOST || 'localhost';
    const systemPort = window.ALIVE_SYSTEM_PORT || 7070;
    return `ws://${systemHost}:${systemPort}/?type=host`;
  }

  /**
   * Connect to alive-system
   */
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    console.log('[SystemClient] Connecting to', this.url);
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.connected = true;
      this._emit('status', { connected: true });
      console.log('[SystemClient] Connected to alive-system');
    };

    this.ws.onclose = () => {
      this.connected = false;
      this._emit('status', { connected: false });
      console.log('[SystemClient] Disconnected from alive-system');
      // NOTE: This is transport-level reconnection (maintaining the pipe),
      // not request-level retry. Per UI invariants, Host does not retry
      // failed requests - that's System's responsibility.
      this._scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error('[SystemClient] WebSocket error:', err);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this._handleMessage(message);
      } catch (err) {
        console.error('[SystemClient] Failed to parse message:', err);
      }
    };
  }

  _scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.reconnectInterval);
  }

  _handleMessage(message) {
    // Forward everything as render. Host UI is not allowed to branch on content.
    this._emit('render', message);
  }

  _emit(type, data) {
    this.handlers[type]?.forEach(handler => handler(data));
  }

  /**
   * Subscribe to message types
   * @param {string} type - 'status' | 'render'
   * @param {function} handler - Callback function
   */
  on(type, handler) {
    if (this.handlers[type]) {
      this.handlers[type].push(handler);
    }
    return () => this.off(type, handler);
  }

  off(type, handler) {
    if (this.handlers[type]) {
      this.handlers[type] = this.handlers[type].filter(h => h !== handler);
    }
  }

  /**
   * Send observation to alive-system
   * 
   * @param {string} modality - 'text' | 'voice' | 'file' | 'url'
   * @param {any} raw - Raw input data
   * @param {object} meta - Additional metadata
   */
  sendObservation(modality, raw, meta = {}) {
    this._send({
      type: 'observation',
      source: 'host-ui',
      modality,
      raw,
      meta
    });
  }

  _send(message) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('[SystemClient] Cannot send - not connected');
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
  }
}

// Export singleton
export const systemClient = new SystemClient();
export default SystemClient;
