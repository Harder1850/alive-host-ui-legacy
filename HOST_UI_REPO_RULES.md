Repository Scope

alive-host-ui is a standalone repository.

It must never contain:

alive-core code

alive-body code

alive-system code

Filesystem Rules
Correct Layout
C:\Users\mikeh\dev\
  alive-host-ui\
  alive-host-cli\
  alive-core\
  alive-body\
  alive-system\

Forbidden

Creating an umbrella alive\ directory

Nesting repos inside each other

Copying code across repo boundaries

Each repo must be:

independently cloneable

independently deletable

independently testable

Dependency Rules

The Host UI may depend on:

UI frameworks

visualization libraries

networking utilities (client-side)

The Host UI may not depend on:

core logic

body adapters

execution logic

policy engines

Contribution Rule

Any PR that:

adds authority

adds execution

adds cognition

bypasses system routing

must be rejected.

Repo Rule Summary

The Host UI is an interface repository, not a system repository.