/**
 * Output Panel (Canvas)
 * 
 * Renders content as instructed by alive-system.
 * No cognition. No interpretation.
 * 
 * Receives render instructions and displays them.
 * 
 * NOTE: System is authority for content. Sanitization is System's
 * responsibility, not Host's. Host renders what System instructs.
 */

import { uiState } from '../stores/ui-state.js';

class OutputPanel {
  constructor(container) {
    this.container = container;
    this._render();
    this._subscribeToState();
  }

  _render() {
    this.container.innerHTML = `
      <div class="output-panel">
        <div class="canvas"></div>
      </div>
    `;
    
    this.canvas = this.container.querySelector('.canvas');
  }

  _subscribeToState() {
    uiState.subscribe((state) => {
      this._updateCanvas(state.canvas, state.systemConnected);
    });
  }

  _updateCanvas(renderData, connected) {
    // Not connected - show waiting state
    if (!connected) {
      this.canvas.innerHTML = `
        <div class="standalone">
          <div class="waiting-indicator"></div>
          <p>Waiting for alive-system</p>
          <p class="hint">Connect to ws://localhost:7070/?type=host</p>
        </div>
      `;
      return;
    }

    // Connected but no content
    if (!renderData) {
      this.canvas.innerHTML = `
        <div class="blank-canvas">
          <p>Ready</p>
        </div>
      `;
      return;
    }

    // Render content from system
    this._renderInstruction(renderData);
  }

  _renderInstruction(data) {
    const { canvas, content } = data;

    // Handle different canvas types
    switch (canvas) {
      case 'text':
        this._renderText(content);
        break;
      case 'document':
        this._renderDocument(content);
        break;
      case 'dashboard':
        this._renderDashboard(content);
        break;
      case 'viz':
        this._renderViz(content);
        break;
      case 'blank':
        this.canvas.innerHTML = `<div class="blank-canvas"><p>Ready</p></div>`;
        break;
      default:
        // Fallback: render as text
        this._renderText(content);
    }
  }

  _renderText(content) {
    if (!content) {
      this.canvas.innerHTML = `<div class="blank-canvas"><p>Ready</p></div>`;
      return;
    }

    // Handle { text: '...' } or { status: '...' } or plain string
    let text = '';
    if (typeof content === 'string') {
      text = content;
    } else if (content.text) {
      text = content.text;
    } else if (content.status) {
      text = `[${content.status}]`;
    } else {
      text = JSON.stringify(content, null, 2);
    }

    this.canvas.innerHTML = `
      <div class="render-content">
        <p>${this._escapeHtml(text)}</p>
      </div>
    `;
  }

  _renderDocument(content) {
    // If content has HTML, render it directly
    if (content?.html) {
      this.canvas.innerHTML = `<div class="render-content document-view">${content.html}</div>`;
      return;
    }
    // Otherwise fall back to text
    this._renderText(content);
  }

  _renderDashboard(content) {
    // Placeholder for dashboard rendering
    this.canvas.innerHTML = `
      <div class="render-content dashboard-view">
        <pre>${this._escapeHtml(JSON.stringify(content, null, 2))}</pre>
      </div>
    `;
  }

  _renderViz(content) {
    // Placeholder for visualization rendering
    this.canvas.innerHTML = `
      <div class="render-content viz-view">
        <pre>${this._escapeHtml(JSON.stringify(content, null, 2))}</pre>
      </div>
    `;
  }

  _escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export default OutputPanel;
