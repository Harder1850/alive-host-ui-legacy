/**
 * Output Panel
 * 
 * Renders responses from alive-system.
 * No intelligence. Pure display.
 */

let outputElement = null;
let statusIndicator = null;

/**
 * Initialize output panel.
 */
export function initOutputPanel() {
  outputElement = document.getElementById('output-panel');
  statusIndicator = document.getElementById('status-indicator');
  
  if (!outputElement) {
    console.error('[output-panel] Output panel not found');
  }
}

/**
 * Handle message from system.
 */
export function handleMessage(msg) {
  console.log('[output-panel] Handling message:', msg);
  
  if (msg.type === 'status') {
    updateStatus(msg.connected);
    return;
  }
  
  if (msg.type === 'render') {
    renderContent(msg);
    return;
  }
  
  // Legacy/simple format
  if (msg.content) {
    if (typeof msg.content === 'string') {
      addMessage(msg.content, 'system');
    } else if (msg.content.text) {
      addMessage(msg.content.text, 'system');
    } else if (msg.content.status) {
      addMessage(`[${msg.content.status}]`, 'status');
    } else {
      addMessage(JSON.stringify(msg.content), 'system');
    }
  }
}

/**
 * Render content based on canvas type.
 */
function renderContent(render) {
  const { canvas, content } = render;
  
  switch (canvas) {
    case 'text':
      if (content.text) {
        addMessage(content.text, 'system');
      } else if (content.status) {
        addMessage(`[${content.status}]`, 'status');
      }
      break;
      
    case 'document':
      addMessage('[Document render not yet implemented]', 'status');
      break;
      
    case 'dashboard':
      addMessage('[Dashboard render not yet implemented]', 'status');
      break;
      
    case 'viz':
      addMessage('[Visualization render not yet implemented]', 'status');
      break;
      
    case 'blank':
      // Clear output
      if (outputElement) {
        outputElement.innerHTML = '';
      }
      break;
      
    default:
      addMessage(JSON.stringify(content), 'system');
  }
}

/**
 * Update connection status indicator.
 */
function updateStatus(connected) {
  if (statusIndicator) {
    statusIndicator.className = connected ? 'connected' : 'disconnected';
    statusIndicator.title = connected ? 'Connected to alive-system' : 'Disconnected';
  }
}

/**
 * Add a message to the output.
 */
export function addMessage(text, type = 'system') {
  if (!outputElement) return;
  
  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.textContent = text;
  outputElement.appendChild(msg);
  outputElement.scrollTop = outputElement.scrollHeight;
}

export default {
  init: initOutputPanel,
  handleMessage,
  addMessage
};
