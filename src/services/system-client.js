/**
 * System Client
 * 
 * Connects browser directly to alive-system via WebSocket.
 * This is the ONLY outbound channel. Host has no other authority.
 */

const SYSTEM_URL = 'ws://localhost:7070/?type=host';

let socket = null;
let connected = false;
let messageHandler = null;

/**
 * Connect to alive-system.
 */
export function connect(onMessage) {
  messageHandler = onMessage;
  
  socket = new WebSocket(SYSTEM_URL);
  
  socket.onopen = () => {
    connected = true;
    console.log('[system-client] Connected to alive-system');
    if (messageHandler) {
      messageHandler({ type: 'status', connected: true });
    }
  };
  
  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      console.log('[system-client] Received:', msg);
      if (messageHandler) {
        messageHandler(msg);
      }
    } catch (err) {
      console.error('[system-client] Failed to parse message:', err);
    }
  };
  
  socket.onclose = () => {
    connected = false;
    console.log('[system-client] Disconnected from alive-system');
    if (messageHandler) {
      messageHandler({ type: 'status', connected: false });
    }
    // Auto-reconnect after 3 seconds
    setTimeout(() => connect(messageHandler), 3000);
  };
  
  socket.onerror = (err) => {
    console.error('[system-client] WebSocket error:', err);
  };
}

/**
 * Send an observation to alive-system.
 */
export function sendObservation(modality, raw, meta = {}) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('[system-client] Not connected, cannot send observation');
    return false;
  }
  
  const observation = {
    type: 'observation',
    source: 'host-ui',
    modality: modality,
    raw: raw,
    meta: meta
  };
  
  console.log('[system-client] Sending observation:', observation);
  socket.send(JSON.stringify(observation));
  return true;
}

/**
 * Send text observation.
 */
export function sendText(text) {
  return sendObservation('text', text);
}

/**
 * Send voice observation.
 */
export function sendVoice(text, audioData = null) {
  return sendObservation('voice', text, { audioData });
}

/**
 * Check if connected.
 */
export function isConnected() {
  return connected && socket && socket.readyState === WebSocket.OPEN;
}

export default {
  connect,
  sendObservation,
  sendText,
  sendVoice,
  isConnected
};
