ALIVE Host UI

The ALIVE Host UI is a human-facing interface layer for the ALIVE system.

It provides:

input surfaces (text, voice, controls)

visual output (logs, telemetry, summaries)

observability into system state

It does not:

think

decide

execute

store memory

enforce policy

The Host UI is replaceable, optional, and low-authority by design.

Architectural Role
Human
  ⇅
Host UI (alive-host-ui)
  ⇅
alive-system
  ⇅
alive-body
  ⇅
alive-core


The Host UI communicates only through approved system interfaces and never directly with core or body internals.

Binding Contracts (Must Read)

All development in this repository is governed by the following documents:

HOST_UI_BOUNDARIES.md
Defines what the Host UI is and is not allowed to do.

HOST_UI_INVARIANTS.md
Lists non-negotiable invariants. Violations are architectural errors.

HOST_UI_ARCHITECTURE.md
Describes the intended structure and data flow of the Host UI.

HOST_UI_REPO_RULES.md
Defines filesystem, dependency, and repository isolation rules.

These documents are authoritative.

Key Principle

The Host UI is a window, not a brain — and never a hand on the controls.

If removing this repository breaks ALIVE, something is wrong.

Status

This repository may evolve rapidly in appearance and tooling,
but its authority and boundaries are frozen.