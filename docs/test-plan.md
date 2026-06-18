# Test Plan

> **Status:** Draft · **Owner:** qa-engineer · **Audience:** Team · **Updated:** Scaffold

## Critical user journey

<!-- When filling for your challenge, describe the exact steps a user takes end-to-end. This becomes the demo script's backbone. Example:
1. User opens the app and sees the problem state.
2. User performs the primary action (e.g., submits a form).
3. User sees the result with proof metric.
-->

1.
2.
3.

## Automated checks

- `make test` — API handler tests against `buildServer()` (happy path + validation failure).
- `make build` — frontend typecheck/build.
- `make smoke` — curls `/healthz` and the primary demo endpoint(s) against a running API (start it with `make dev-node`).

> **Note:** After replacing the starter demo, update `scripts/smoke-test.sh` to curl the real demo endpoints instead of `/login`.

## Manual demo checks

<!-- Verify each of these before the demo freeze. If any check fails, either fix it or document why it's demo-safe. -->

- [ ] Fresh browser load works.
- [ ] Primary action works.
- [ ] Result is visible and understandable.
- [ ] Failure state does not embarrass the demo.
- [ ] README explains how to run.
