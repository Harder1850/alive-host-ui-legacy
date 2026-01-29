# ALIVE Host UI - AI Agent Instructions

## Project Mission
The Host UI is a **human-facing interface layer** for ALIVE, implementing the role of **visual shell only**. It displays, collects input, and emits requests—but never thinks, decides, executes, or stores authority.

## Core Architecture

```
Human
  ⇅
Host UI (alive-host-ui) ← YOU ARE HERE
  ⇅
alive-system (orchestration)
  ⇅
alive-body (execution/adapters)
  ⇅
alive-core (cognition)
```

**Key:** Host UI communicates **only with alive-system**. Direct calls to core or body are architectural violations.

## Non-Negotiable Invariants
These are hard rules, not guidelines:

1. **UI-01 — No Cognition**: Never reason, infer, rank, or reinterpret. All cognition belongs downstream.
2. **UI-02 — No Authority**: Never approve/deny actions or override policy. Authority is downstream only.
3. **UI-03 — No Execution**: Emit requests only. Never trigger side effects or call adapters.
4. **UI-04 — No Memory Ownership**: Store ephemeral UI state only (layout, theme, visibility). Never persist cognition.
5. **UI-05 — Read-Only Observability**: Display telemetry and summaries as-provided. Never mutate state.
6. **UI-06 — Replaceability**: Must be deletable without breaking ALIVE. System must function headless.
7. **UI-07 — No Boundary Bypass**: Never call alive-core/alive-body directly. Always route through alive-system.

## Request/Response Contract

### Allowed Host UI → System Requests
- **Action Requests**: Declarative human intent with context, no execution parameters
- **Query Requests**: Read-only (status, summaries, logs, resource usage)
- **Subscription Requests**: Passive streams (telemetry, logs, output, state changes)

**Example (Wrong)**: Parsing a decision and caching it  
**Example (Right)**: Displaying a decision summary exactly as provided

### System → Host UI Responses
- Acknowledgements (receipt only, not approval)
- Decision Outcomes (accepted/rejected/deferred/escalated)
- Streamed Output (logs, progress, traces, cognitive summaries)
- Errors (display-only, never retry autonomously)

## Repository Isolation Rules

### Correct Filesystem Layout
```
C:\Users\mikeh\dev\
  alive-host-ui\           ← This repo (standalone)
  alive-host-cli\
  alive-system\
  alive-body\
  alive-core\
```

### Forbidden
- ❌ Nesting other ALIVE repos inside alive-host-ui
- ❌ Creating umbrella alive\ directory
- ❌ Copying core/body/system code into this repo
- ❌ Adding core logic, body adapters, or policy engines

## Expected Directory Structure

```
src/
  host/          # Shell/windowing/docking, entry point
  panels/        # Passive UI components (input, output, telemetry, logs)
  services/      # API clients (read-only, streaming)
  stores/        # UI-only state (ephemeral layout/theme)
  styles/        # CSS/styling
```

### Module Responsibilities
- **panels/**: Subscribe to data, render state, emit requests (no logic)
- **services/**: Open streams, fetch telemetry (no caching decisions)
- **stores/**: Layout state, theme, panel visibility (no cognition data)
- **host/**: Windowing, docking, panel arrangement

## Data Flow Pattern

```
Input:   Human → Host UI → Request → alive-system
Output:  alive-system → Host UI → Human

⚠️ Host UI is NEVER in the middle of a decision loop.
```

## Dependencies Rules

✅ **Allowed**:
- UI frameworks
- Visualization libraries
- Client-side networking (HTTP, WebSocket, SSE)
- Testing frameworks

❌ **Forbidden**:
- Core logic
- Body adapters
- Execution engines
- Policy validators
- Cognition libraries
- ALIVE internal modules

## Development Guardrails

**Before submitting code:**
1. Verify no direct calls to alive-core or alive-body
2. Confirm all system calls go through alive-system API only
3. Check no business logic/policy enforcement in UI components
4. Ensure no long-term memory storage beyond ephemeral state
5. Validate no autonomic retry/adaptation behavior

**Code Review Rejection Criteria:**
- Adds authority, execution, or cognition
- Bypasses system routing
- Copies system/body/core code
- Persists non-ephemeral state
- Implements policy logic

## Testing Philosophy
- Test panels independently (mock subscriptions)
- Test services as API consumers (mock alive-system responses)
- Test stores for state transitions only
- Never test business logic (doesn't belong in Host UI)
- Integration tests should verify request/response compliance

## Key Reference Files
- [HOST_SYSTEM_API_CONTRACT.md](../../HOST_SYSTEM_API_CONTRACT.md) — Binding API contract
- [HOST_UI_INVARIANTS.md](../../HOST_UI_INVARIANTS.md) — Hard rules (read first)
- [HOST_UI_BOUNDARIES.md](../../HOST_UI_BOUNDARIES.md) — Architectural constraints
- [HOST_UI_ARCHITECTURE.md](../../HOST_UI_ARCHITECTURE.md) — Structure and data flow
- [HOST_UI_REPO_RULES.md](../../HOST_UI_REPO_RULES.md) — Filesystem and dependency rules

## One-Sentence Rule
**The Host UI may ask, observe, and display — but never decide or act.**
