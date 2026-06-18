---
name: api-contract
description: Design or revise a minimal REST API contract — endpoints, request/response JSON, Zod validation rules, a consistent error shape, and frontend fetch notes — for the Fastify + Zod backend, and write docs/api-contract.md. Use after /solution-architect and before implementing any backend or frontend code.
argument-hint: "[feature or entity name]"
---

# API Contract

Update `docs/api-contract.md`. Backend and frontend implement against this file in parallel, so it has to be exact enough that neither side has to guess — a guessed contract is the most common source of demo-day wiring bugs.

## Load domain context

Read **`CONTEXT.md`** (and `CONTEXT-MAP.md` if present), `docs/problem-brief.md`, and `docs/architecture.md` before designing endpoints. Use the canonical glossary terms for resource names, field names, and URL path segments, and honor the component/storage boundaries from the architecture. Consistent terminology across the API contract, frontend fetch calls, and test names prevents wiring bugs — a mismatch between "Order" in the glossary and "purchase" in the URL is exactly the kind of guesswork that creates demo-day failures.

If `CONTEXT.md` is absent, rely on `docs/problem-brief.md` and `docs/architecture.md`.

## Match the real server

The starter at `apps/api/src/server.ts` already shows the patterns — follow them, don't invent new ones:

- Routes registered on the Fastify app; the file exports `buildServer()` so each route is unit-testable without booting a port.
- Validation via `z.safeParse(Schema, request.body)` → on error, `reply.code(400).send(...)`.
- Config from `process.env` with safe defaults (`PORT ?? 8080`, `CORS_ORIGIN ?? 'http://localhost:3000'`). Never hardcode credentials.

> Note: the starter returns plain strings on errors (`"bad request"`, `"unauthorized"`). New routes should return the JSON error shape below — that's the target the frontend can build a reliable error UI against.

## What to capture

1. **Endpoint table** — method, path, purpose, request body, response, status codes. Include `GET /healthz` (already exists → `{ ok: true, service: "api-node" }`).
2. **Error shape** — one consistent JSON shape, e.g. `{ "error": { "code": "validation_error", "message": "..." } }`. `400` validation, `401`/`403` auth, `404` missing, `500` unexpected.
3. **Validation rules** — the Zod constraints per field (lengths, formats), written so they can be lifted straight into a schema.
4. **Example JSON** — happy-path request and response for the demo slice, specific enough to become frontend mocks/fixtures.
5. **Frontend fetch notes** — base URL (`/api` proxy or `http://localhost:8080`), the env var the web app reads, and how errors surface in the UI.

## Rules

- Keep it minimal. Don't add endpoints the next demo slice doesn't need — each extra endpoint costs time on both sides.
- Every field in a response should be something the UI actually renders.

## Output

- Updated `docs/api-contract.md`.
- The three test cases to write in `/test-fast`: happy path, validation error, not-found/empty state.
- Next step: run `/task-slicer`, then `/implement-vertical-slice` on the first endpoint.
