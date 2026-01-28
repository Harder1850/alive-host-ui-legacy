ALIVE Host UI Boundary Contract
1. Purpose

This document defines the non-negotiable boundaries of the ALIVE Host UI.

Its purpose is to:

Prevent architectural drift

Preserve safety and authority guarantees

Keep the host fully replaceable

Ensure clean separation between interface and intelligence

This contract applies to all current and future development of alive-host-ui.

2. Definition of the Host UI

The Host UI is:

A human-facing interface

A visual and interactive shell

A read-only observer of system state

A request emitter, never an executor

The Host UI is not:

A controller

A decision-maker

A policy engine

A runtime

A cognitive system

3. Architectural Position

ALIVE consists of the following components:

Human
  ⇅
Host UI  (alive-host-ui)
  ⇅
System   (alive-system)
  ⇅
Body     (alive-body)
  ⇅
Core     (alive-core)

The Host UI:

Communicates only with alive-system and approved APIs

Never calls alive-core directly

Never bypasses alive-body

Never performs execution

4. Authority and Power Constraints

The Host UI has zero authority.

It may:

Display state

Collect human input

Emit requests for action

Visualize logs, telemetry, and memory summaries

It may never:

Execute actions

Approve actions

Override policy

Write memory

Trigger adapters

Invoke AI models

Perform reasoning or ranking

If the UI appears to “do” something, it is architecturally wrong.

5. Data Handling Rules
Allowed:

Read-only telemetry

Read-only summaries

Streaming outputs

Human input (text, voice, selection)

Forbidden:

Persistent storage of cognition data

Long-term memory

State that influences decision-making

Cached execution outcomes

The Host UI may maintain ephemeral UI state only
(e.g., panel layout, theme, window size).

6. Panel and Plugin Constraints

Panels and plugins:

Must be passive

Must subscribe to data, not control it

Must emit requests, not commands

Must declare required data sources explicitly

No panel may:

Contain business logic

Contain execution logic

Encode policy decisions

7. Filesystem Boundary (Critical)

The Host UI is a standalone repository.

Correct layout:
C:\Users\mikeh\dev\
  alive-host-ui\
  alive-host-cli\
  alive-core\
  alive-body\
  alive-system\

Forbidden:

Nesting other ALIVE repos inside alive-host-ui

Creating an umbrella alive\ directory

Copying core/body/system code into the host

The Host UI must remain fully deletable without impacting ALIVE.

8. Technology Neutrality

The Host UI:

May be web-based, desktop-based, or CLI-based

May be rewritten or replaced at any time

Must not assume a specific frontend framework

Must not encode workflow assumptions

UI convenience must never shape system architecture.

9. Security & Trust Model

The Host UI is:

A low-trust surface

A human-facing edge

A potential attack vector

Therefore:

All outputs are treated as display-only

All inputs are treated as untrusted

All requests must be validated downstream

The Host UI is never a trust anchor.

10. Invariant Summary

The following invariants must always hold:

The Host UI is replaceable

The Host UI has no authority

The Host UI does not execute

The Host UI does not think

The Host UI does not store memory

The Host UI cannot bypass governance

11. One-Sentence Rule

The Host UI is a window, not a brain — and never a hand on the controls.