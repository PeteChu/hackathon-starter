---
name: implement-vertical-slice
description: Implement one complete user-visible vertical slice through the Next.js UI, Fastify API, and a focused test — touching the smallest file set, then verifying. Manual invocation only because it edits code.
disable-model-invocation: true
argument-hint: "[slice name]"
---

# Implement Vertical Slice

Implement only the requested slice. Do not refactor unrelated code — that's how scope leaks in mid-hackathon and how working features break right before the demo.

## Workflow

1. **Load context** — read `docs/problem-brief.md`, `docs/architecture.md`, `docs/api-contract.md`, and the slice's row in `docs/task-board.md`.
2. **Find the smallest file set.** Typically: one Fastify route in `apps/api/src/server.ts`, one Next.js route or page under `apps/web/app/`, and one test.
3. **Backend first.** Add the route with Zod validation and typed JSON, following the patterns already in `server.ts` (`z.safeParse`, `reply.code`). Read any secret from `process.env` — never hardcode credentials, and mirror new vars in `.env.example`.
4. **Test as you go.** Add a vitest test against `buildServer()` — one happy path and one validation failure. Run `make test` to confirm.
5. **Frontend.** Build the UI path and all four states: loading, empty, success, error. Make the value proposition visible in 10 seconds (CLAUDE.md rule #4: headline, value prop, primary action, results, proof metric). Next.js 16 has breaking changes — per `apps/web/CLAUDE.md`, read `node_modules/next/dist/docs/` for anything you're unsure about rather than relying on prior-version memory.
6. **Verify.** Run the narrowest useful command: `make test`, then `make build`. Boot both with `make dev-node` + `make dev-web` and click the primary action once, end to end.
7. **Update `docs/task-board.md`** — mark done / remaining.

## Stop and report

- Files changed.
- Verification command(s) run and the actual result (pass/fail — paste the key line, don't paraphrase).
- The single remaining risk for the demo.
- Next step: run `/test-fast`, then start the next slice.
