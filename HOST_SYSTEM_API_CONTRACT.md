ALIVE Host ↔ System API Contract
1. Purpose

This document defines the only permitted interface between the ALIVE Host UI and alive-system.

Its goals are to:

Preserve separation of concerns

Prevent authority leakage into the UI

Guarantee replaceability of the Host UI

Ensure auditability and security

This contract is binding for all current and future development.

2. Roles
Host UI (Client)

The Host UI is a human-facing client.

It may:

Send requests

Subscribe to streams

Display responses

It may not:

Execute actions

Make decisions

Enforce policy

Modify system state

System (Server)

alive-system is the sole orchestration layer.

It:

Validates requests

Routes to body/core

Enforces policy and authority

Emits observable state

3. Communication Model
Allowed Transport (non-binding)

HTTP / HTTPS

WebSocket / SSE

Local IPC (desktop deployments)

Transport choice does not affect authority.

Directionality
Host UI  →  System   (requests only)
System   →  Host UI  (responses, streams)


No other direction is permitted.

4. Request Types (Host → System)

The Host UI may send only declarative requests.

4.1 Action Request

A request to consider an action.

Properties:

intent (human-stated goal)

optional context

no execution parameters

no authority claims

The Host UI does not know:

whether the action is allowed

whether it will be executed

how it would be executed

4.2 Query Request

A request for read-only information.

Examples:

system status

memory summaries

audit logs

resource usage

Queries may not:

mutate state

trigger execution

cause side effects

4.3 Subscription Request

A request to receive streams of data.

Examples:

telemetry

logs

output streams

state changes

Subscriptions are:

passive

revocable

non-authoritative

5. Response Types (System → Host)
5.1 Acknowledgement

Indicates receipt of a request, not approval.

5.2 Decision Outcome

Indicates whether a request was:

accepted

rejected

deferred

escalated (e.g., human confirmation)

The Host UI does not influence the outcome.

5.3 Streamed Output

Continuous data emitted by the system.

Examples:

logs

progress updates

execution traces

cognitive summaries

5.4 Error Response

Errors are informational, not actionable.

The Host UI must:

display errors

not retry autonomously

not adapt behavior programmatically

6. Forbidden Interactions

The Host UI must never:

Call alive-core directly

Call alive-body adapters directly

Inject policy logic

Embed execution instructions

Cache authority decisions

Replay requests automatically

Modify request semantics based on outcomes

7. Trust & Security Model

All Host UI inputs are untrusted

All Host UI outputs are display-only

System validates everything

No secrets or credentials are trusted to the Host UI

The Host UI is treated as a hostile surface by default.

8. Replaceability Guarantee

Any Host UI that:

follows this contract

emits compliant requests

consumes compliant responses

must be able to replace any other Host UI without system changes.

9. Invariant Summary

The following must always be true:

Host UI sends requests, not commands

System decides everything

Execution never originates from the UI

Authority never crosses into the UI

Removing the UI does not affect ALIVE behavior

10. One-Sentence Rule

The Host UI may ask, observe, and display — but never decide or act.

Status

This contract is frozen until explicitly revised alongside system governance changes.