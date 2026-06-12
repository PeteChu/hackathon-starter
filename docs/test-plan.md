# Test Plan

## Critical user journey

1.
2.
3.

## Automated checks

- `make test` — API handler tests against `buildServer()` (happy path + validation failure).
- `make build` — frontend typecheck/build.
- `make smoke` — curls `/healthz` and `/login` against a running API (start it with `make dev-node`).

## Manual demo checks

- [ ] Fresh browser load works.
- [ ] Primary action works.
- [ ] Result is visible and understandable.
- [ ] Failure state does not embarrass the demo.
- [ ] README explains how to run.
