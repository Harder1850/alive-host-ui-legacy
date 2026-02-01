# ALIVE Host UI

Launcher and human-facing interface for the ALIVE system.

**Starts alive-system. Pure transport. No intelligence. No authority.**

## Quick Start
```bash
npm install
npm start
```

Open http://localhost:3001

System will start automatically on port 7070.

## What It Does

1. **Spawns alive-system** on startup (port 7070)
2. **Serves the web interface** on port 3001
3. **Routes messages** between browser and system
4. **Observes only** - never decides or acts

## Architecture
```
Browser (http://localhost:3001)
  ? WebSocket
Host UI (this repo - launcher + server)
  ? spawns & routes
alive-system (port 7070)
  ? orchestrates
alive-body ? alive-core
```

Host UI talks **only** to alive-system. Never directly to body or core.

## Structure
```
+-- server.js                 # Launcher + WebSocket bridge
+-- public/index.html         # Entry point
+-- src/
    +-- host/coordinator.js   # Wires panels + services
    +-- panels/
    ¦   +-- input-panel.js    # Text, voice, file, URL input
    ¦   +-- output-panel.js   # Renders system streams
    +-- services/
    ¦   +-- system-client.js  # WebSocket client to alive-system
    +-- stores/
    ¦   +-- ui-state.js       # Ephemeral UI state only
    +-- styles/main.css
```

## How It Starts Everything

When you run `npm start`:

1. server.js spawns `npm start` in ../alive-system
2. alive-system starts on port 7070
3. Host UI server starts on port 3001
4. Browser connects to http://localhost:3001
5. Browser WebSocket connects to system on port 7070

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

## Stopping ALIVE
```bash
Ctrl+C
```

This gracefully shuts down both the UI and alive-system.
