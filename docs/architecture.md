# Architecture

Status: draft

## Stack

- **Backend**: Fastify 5 + Zod 4 (TypeScript) in `apps/api`. Entry: `apps/api/src/server.ts`, which exports `buildServer()` so routes are testable without booting a port.
- **Frontend**: Next.js 16 App Router in `apps/web` (`app/` directory). Shared UI via the `@workspace/ui` package; styling is Tailwind v4.
- **Monorepo**: pnpm workspaces + turbo. Shared configs in `packages/` (`eslint-config`, `typescript-config`, `ui`).
- **Run**: `make dev-node` (API on :8080), `make dev-web` (UI on :3000), `make test`, `make build`.

## Components

| Component | Responsibility | Owner |
| --- | --- | --- |
| Next.js UI | Demo workflow and visualization | frontend-nextjs |
| Fastify API | Business logic, Zod validation, typed JSON contract | backend-node |
| Storage | Hackathon default: in-memory; production replacement later | backend-node |
| Integrations | Company systems / MCP / mock adapters | backend-node |

## Request flow

1. User performs the primary action in the UI.
2. UI calls an API route (base URL from env; default `http://localhost:8080`).
3. API validates input with Zod, runs logic, returns typed JSON (or the shared error shape).
4. UI shows the result and the proof metric.

## Data model

Document the entities the slice touches here. Keep storage behind one module so the later DB swap is a one-file change.

## Config & secrets

Every tunable reads `process.env` with a safe default. Current: `PORT ?? 8080`, `CORS_ORIGIN ?? 'http://localhost:3000'`. Never hardcode credentials; mirror new vars in `.env.example` with placeholders.

## Production path after winning

- Replace in-memory storage with the company standard database, behind the same interface.
- Add authn/authz and audit logging.
- Add observability, dashboards, and migrations.
- Deploy behind the standard gateway.

## Key tradeoffs

| Decision | Why | Risk | Mitigation |
| --- | --- | --- | --- |
| In-memory store for MVP | Fastest vertical slice | Data resets on restart | Keep API contract stable for later DB swap |
| Plain-string errors in starter | Speed | No machine-readable errors for UI | New routes use the JSON error shape in `docs/api-contract.md` |
