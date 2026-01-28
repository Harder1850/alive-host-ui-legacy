Role

The Host UI is a human interaction shell.

It:

presents information

collects input

visualizes state

It does not:
decide

act

enforce

High-Level Architecture
Human
  ⇅
Host UI (alive-host-ui)
  ⇅
alive-system (API / streams)
  ⇅
alive-body (adapters, execution)
  ⇅
alive-core (cognition)

Internal Host UI Structure

Recommended (non-binding) structure:

alive-host-ui/
  src/
    layout/        # shell layout, docking, panels
    panels/        # passive UI components
    services/      # API clients (read-only)
    stores/        # UI-only state (ephemeral)

layout/

windowing

docking

panel arrangement

panels/

input panel

output panel

telemetry panel

logs panel

Panels:

subscribe to data

render state

emit requests

services/

Services may:

connect to alive-system APIs

open streams

fetch telemetry

Services may not:

call adapters

execute logic

store cognition

stores/

Stores may contain:

UI preferences

layout state

view state

Stores may not contain:

memory

decisions

authority flags

Data Flow
Input
Human → Host UI → Request → alive-system

Output
alive-system → Host UI → Human


The Host UI is never in the middle of a decision loop.

UI Philosophy

Panels are passive

Requests are explicit

Power is downstream

UI is disposable