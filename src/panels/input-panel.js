/**
 * Input Panel
 * 
 * Collects human input and emits requests.
 * No cognition. No interpretation.
 * 
 * Supports:
 *   - Text input
 *   - Voice input
 *   - File drop
 *   - URL drop
 */

import { systemClient } from '../services/system-client.js';

class InputPanel {
  constructor(container) {
    this.container = container;
    this.isListening = false;
    this.recognition = null;
    this.transcript = '';
    
    this._initSpeechRecognition();
    this._render();
    this._bindEvents();
  }

  _initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SR();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        
        this._updateTranscript(interim);
        
        if (final) {
          this._sendObservation('voice', final.trim());
          this._updateTranscript('');
        }
      };

      this.recognition.onerror = () => this._stopListening();
      this.recognition.onend = () => {
        if (this.isListening) this.recognition.start();
      };
    }
  }

  _render() {
    this.container.innerHTML = `
      <div class="input-panel">
        <div class="drop-zone" data-action="file-pick">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        
        <button class="voice-btn" data-action="voice-toggle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
        
        <form class="text-input-form">
          <div class="transcript-display"></div>
          <input 
            type="text" 
            class="text-input" 
            placeholder="Type or speak..."
            autocomplete="off"
          />
        </form>
      </div>
    `;

    // Cache elements
    this.elements = {
      dropZone: this.container.querySelector('.drop-zone'),
      voiceBtn: this.container.querySelector('.voice-btn'),
      form: this.container.querySelector('.text-input-form'),
      input: this.container.querySelector('.text-input'),
      transcript: this.container.querySelector('.transcript-display')
    };
  }

  _bindEvents() {
    // Text submit
    this.elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = this.elements.input.value.trim();
      if (text) {
        this._sendObservation('text', text);
        this.elements.input.value = '';
      }
    });

    // Voice toggle
    this.elements.voiceBtn.addEventListener('click', () => {
      this.isListening ? this._stopListening() : this._startListening();
    });

    // File picker
    this.elements.dropZone.addEventListener('click', () => this._openFilePicker());

    // Drag and drop on document
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => this._handleDrop(e));
  }

  _startListening() {
    if (!this.recognition) return;
    this.isListening = true;
    this.elements.voiceBtn.classList.add('listening');
    this.recognition.start();
  }

  _stopListening() {
    if (!this.recognition) return;
    this.isListening = false;
    this.elements.voiceBtn.classList.remove('listening');
    this.recognition.stop();
  }

  _updateTranscript(text) {
    this.transcript = text;
    this.elements.transcript.textContent = text;
    this.elements.transcript.style.display = text ? 'block' : 'none';
  }

  _openFilePicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) this._processFile(file);
    };
    input.click();
  }

  _handleDrop(e) {
    e.preventDefault();
    
    // Check for URL
    const text = e.dataTransfer.getData('text');
    if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
      this._sendObservation('url', text);
      return;
    }
    
    // Check for files
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      this._processFile(files[0]);
    }
  }

  _processFile(file) {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      this._sendObservation('file', event.target.result, {
        name: file.name,
        type: file.type,
        size: file.size
      });
    };
    
    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  }

  /**
   * Send observation to system
   * No interpretation - raw passthrough
   */
  _sendObservation(modality, raw, meta = {}) {
    systemClient.sendObservation(modality, raw, meta);
  }

  /**
   * Enable/disable input based on connection status
   */
  setEnabled(enabled) {
    this.elements.input.disabled = !enabled;
    this.elements.input.placeholder = enabled 
      ? 'Type or speak...' 
      : 'Waiting for system...';
  }
}

export default InputPanel;
