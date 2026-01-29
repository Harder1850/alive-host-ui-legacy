# ALIVE Host UI

Human-facing interface for the ALIVE system.

**Pure transport. No intelligence. No authority.**

## Quick Start

```bash
npm install
npm start
```

Open http://localhost:3000

## Architecture

```
Human
  ⇅
Host UI (this repo)
  ⇅
alive-system
  ⇅
alive-body → alive-core
```

Host UI talks **only** to alive-system. Never directly to body or core.

## Structure

```
├── server.js                 # WebSocket bridge (pure passthrough)
├── public/index.html         # Entry point
└── src/
    ├── host/coordinator.js   # Wires panels + services
    ├── panels/
    │   ├── input-panel.js    # Text, voice, file, URL input
    │   └── output-panel.js   # Renders system streams
    ├── services/
    │   └── system-client.js  # WebSocket client to alive-system
    ├── stores/
    │   └── ui-state.js       # Ephemeral UI state only
    └── styles/main.css
```

## Connecting alive-system

System connects as WebSocket client:

```javascript
const ws = new WebSocket('ws://localhost:3000/ws?type=system');

// Receive requests from UI
ws.on('message', (data) => {
  const { type, intent, context } = JSON.parse(data);
  // System decides what to do
});

// Send render instructions to UI
ws.send(JSON.stringify({
  type: 'stream',
  html: '<p>System decided to show this.</p>'
}));
```

## Invariants

| Rule | Constraint |
|------|------------|
| UI-01 | No cognition |
| UI-02 | No authority |
| UI-03 | No execution |
| UI-04 | No memory ownership |
| UI-05 | Read-only observability |
| UI-06 | Replaceability |
| UI-07 | No boundary bypass |

**If removing this repository breaks ALIVE, something is wrong.**
