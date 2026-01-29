/**
 * Input Panel
 * 
 * Handles text and voice input.
 * Sends observations via system-client.
 */

import { sendText, sendVoice } from './system-client.js';

let inputElement = null;
let micButton = null;
let recognition = null;
let isListening = false;

/**
 * Initialize input panel.
 */
export function initInputPanel() {
  inputElement = document.getElementById('input-field');
  micButton = document.getElementById('mic-button');
  
  if (!inputElement) {
    console.error('[input-panel] Input field not found');
    return;
  }
  
  // Handle Enter key
  inputElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitInput();
    }
  });
  
  // Setup voice input if available
  if (micButton && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    setupVoiceInput();
  } else if (micButton) {
    micButton.style.display = 'none';
  }
}

/**
 * Submit current input.
 */
function submitInput() {
  const text = inputElement.value.trim();
  if (!text) return;
  
  console.log('[input-panel] Submitting:', text);
  
  // Send to system
  const sent = sendText(text);
  
  if (sent) {
    // Show in output (user message)
    addToOutput(text, 'user');
    // Clear input
    inputElement.value = '';
  } else {
    console.error('[input-panel] Failed to send - not connected');
    addToOutput('[Not connected to system]', 'error');
  }
}

/**
 * Setup voice recognition.
 */
function setupVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  
  recognition.onstart = () => {
    isListening = true;
    micButton.classList.add('listening');
    console.log('[input-panel] Voice recognition started');
  };
  
  recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    // Update input field with current transcript
    if (finalTranscript) {
      inputElement.value = finalTranscript;
    } else if (interimTranscript) {
      inputElement.value = interimTranscript;
    }
  };
  
  recognition.onend = () => {
    isListening = false;
    micButton.classList.remove('listening');
    console.log('[input-panel] Voice recognition ended');
    
    // DO NOT clear input - keep the transcribed text
    // User can edit or press Enter to submit
    
    // Auto-submit if we have text (optional - remove if you want manual submit)
    const text = inputElement.value.trim();
    if (text) {
      // Give user a moment to see the text before submitting
      setTimeout(() => {
        if (inputElement.value.trim() === text) {
          submitInput();
        }
      }, 500);
    }
  };
  
  recognition.onerror = (event) => {
    console.error('[input-panel] Voice recognition error:', event.error);
    isListening = false;
    micButton.classList.remove('listening');
  };
  
  // Mic button click handler
  micButton.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
    } else {
      inputElement.value = ''; // Clear for new voice input
      recognition.start();
    }
  });
}

/**
 * Add message to output panel.
 */
function addToOutput(text, type = 'system') {
  const output = document.getElementById('output-panel');
  if (!output) return;
  
  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.textContent = text;
  output.appendChild(msg);
  output.scrollTop = output.scrollHeight;
}

export default {
  init: initInputPanel
};
