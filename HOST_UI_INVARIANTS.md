Purpose

This document defines the hard invariants of the ALIVE Host UI.
Violating any invariant constitutes an architectural breach.

These invariants are not guidelines. They are rules.

Invariants
UI-01 — No Cognition

The Host UI must never:

reason

infer

rank

summarize semantically

reinterpret outputs

All cognition belongs to alive-core.

UI-02 — No Authority

The Host UI must never:

approve actions

deny actions

override policy

escalate privileges

All authority belongs to alive-body and alive-system.

UI-03 — No Execution

The Host UI must never:

execute commands

call adapters directly

trigger side effects

The Host UI may only emit requests.

UI-04 — No Memory Ownership

The Host UI must never:

store long-term memory

persist cognition state

cache execution outcomes

Allowed storage is ephemeral UI state only:

layout

theme

panel visibility

UI-05 — Read-Only Observability

The Host UI may:

display telemetry

stream outputs

show summaries (as provided)

The Host UI may not:

modify system state

mutate memory

annotate cognition internally

UI-06 — Replaceability

The Host UI must be:

deletable without breaking ALIVE

replaceable by another UI

optional at runtime

ALIVE must function headless.

UI-07 — No Boundary Bypass

The Host UI must never:

call alive-core directly

call alive-body adapters directly

bypass alive-system orchestration

Invariant Statement

If removing the Host UI breaks ALIVE, the Host UI is wrong.