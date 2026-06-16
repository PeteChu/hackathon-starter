---
name: test-fast
description: Add and run the fastest meaningful tests for a hackathon slice — API handler tests against buildServer(), Zod validation tests, a frontend typecheck/build, and a smoke test against the running API — and update docs/test-plan.md. Manual invocation recommended.
argument-hint: "[feature or risk area]"
context: fork
agent: qa-engineer
---

# Test Fast

Focus only on tests that prevent demo embarrassment. A hackathon doesn't need coverage — it needs the demo path to not break on stage.

## Steps

1. **Read what changed** — the slice's files and `docs/api-contract.md`.
2. **One happy-path + one failure test.** Test Fastify routes against `buildServer()` with vitest (no need to boot a port). Branch `z.safeParse` on `result.success` and cover the failure branch — it's the most common demo-time bug. If the store is module-level, reset it in `afterEach` so tests stay isolated.
3. **Narrowest command first** — `make test` (runs the API tests). Then `make build` for a frontend typecheck/build.
4. **Smoke the running system** — with `make dev-node` up, run `make smoke`. It curls `/healthz` and `/login` and catches wiring, CORS, and config bugs that unit tests miss.
5. **Update `docs/test-plan.md`** — critical journey, automated checks, manual demo checks.

## Report

- What was tested, with the command and the actual result for each (don't paraphrase pass/fail).
- What is still untested, and whether it's a real demo risk.
- The single highest remaining demo risk.

Prefer the `qa-engineer` subagent for this whole pass — it's scoped to exactly this.
