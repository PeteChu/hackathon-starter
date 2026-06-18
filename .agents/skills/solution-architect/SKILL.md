---
name: solution-architect
description: Design the system architecture for the hackathon slice — components, request flow, data model, storage choice (PostgreSQL vs MongoDB, self-hosted — no SaaS unless the hackathon allows it), env/secrets, and production path — and write docs/architecture.md for the Next.js + Fastify stack. Use right after /problem-framer and before /api-contract, whenever the build approach, components, data flow, or storage are undecided.
argument-hint: "[problem-brief summary or feature focus]"
---

# Solution Architect

Update `docs/architecture.md`. This is the bridge between the problem and the code: it fixes the build approach before anyone writes a route or a component, so backend and frontend can move in parallel without rework.

## Load domain context

Before designing, read **`CONTEXT.md`** (and `CONTEXT-MAP.md` if present) to anchor your architecture in the project's canonical domain language. Use the glossary terms for entity names, field names, and relationships in the data model and request flow sections. If `CONTEXT.md` is absent, rely on `docs/problem-brief.md`.

> **Keep `CONTEXT.md` clean.** Do not push implementation decisions, storage choices, or architecture details into `CONTEXT.md` — those belong in `docs/architecture.md`. `CONTEXT.md` is a glossary only.

## Ground truth for this repo

The stack is already decided — don't re-litigate it, just design within it:

- **Backend**: Fastify 5 + Zod 4 in `apps/api` (TypeScript). Entry is `apps/api/src/server.ts`, which exports `buildServer()` so every route is testable without booting a port.
- **Frontend**: Next.js 16 App Router in `apps/web` (`app/` directory). Shared UI lives in the `@workspace/ui` package; styling is Tailwind v4.
- **Monorepo**: pnpm workspaces + turbo. Shared configs live in `packages/` (`eslint-config`, `typescript-config`, `ui`).
- **Run commands**: `make dev-node` (API on :8080), `make dev-web` (UI on :3000), `make test`, `make build`.

Flag for any frontend work: Next.js 16 has breaking changes. Per `apps/web/CLAUDE.md`, the agent must read `node_modules/next/dist/docs/` before writing app code — don't trust prior-version knowledge.

## Storage selection (PostgreSQL vs MongoDB)

The in-memory store at `apps/api/src/lib/store.ts` is the **default for hackathon speed** — stay there unless the slice genuinely needs persistence.

**Upgrade to a real DB only when at least one is true for the demo:**

- Data must survive a restart, or be shared across more than one process/container.
- You need joins, transactions, or relational integrity across entities.
- The dataset is large enough that a flat in-memory array stops being a believable proof metric.

If none apply, stay in-memory and skip the rest of this section.

**Choose by data shape first, team familiarity as a tiebreaker:**

- **PostgreSQL** — relational data, joins across entities, ACID transactions, a fixed/strict schema, or complex queries/aggregations. Minimal driver to add: `pg`.
- **MongoDB** — flexible/nested documents, a schema that will change rapidly during the hackathon, or read-mostly "fetch document by id" with little cross-entity joining. Minimal driver to add: `mongodb`.
- **Tiebreaker:** if data fit is close, pick whichever the team can stand up and operate fastest under hackathon time. (Adding an ORM like Prisma/Drizzle is a separate dependency decision — only if it removes real risk or saves major time, per the repo rules.)

**No SaaS / external third-party services unless the hackathon allows them.** Managed or hosted databases (Supabase, MongoDB Atlas, Neon, PlanetScale, …) are **not allowed by default**. Check the hackathon rules first and record the answer in `docs/architecture.md`. Default to self-hosted: a local **Docker container via `docker-compose`** (canonical for the demo), or a local install as fallback.

**Keep it behind the interface.** Whatever you pick, the store stays behind the existing module interface in `apps/api/src/lib/store.ts` (today: `listIdeas`, `addIdea`, `voteIdea`, `resetStore`). Swapping in Postgres or Mongo is a one-file change that reimplements those exports — routes and the API contract don't move. That is what makes the swap safe mid-hackathon.

## What to capture

1. **Component table** — React UI, API, Storage, Integrations. One-line responsibility each, and the owner agent (`backend-node` / `frontend-nextjs`) so tasks dispatch cleanly later. The Storage row must state the chosen store **and** a one-line why (in-memory / self-hosted PostgreSQL / self-hosted MongoDB) per the Storage selection section.
2. **Request flow** — the primary action end to end: UI click → API route → Zod validation → logic → typed JSON → UI shows result + proof metric.
3. **Data model** — the entities the slice touches, plus the storage decision from the Storage selection section. In-memory is the default for speed; if a real DB is chosen, name it and its self-hosted setup (local Docker container), and keep it behind the store interface in `apps/api/src/lib/store.ts` so the swap stays a one-file change.
4. **Config & secrets** — every tunable reads `process.env` with a safe default (the starter already does `PORT ?? 8080` and `CORS_ORIGIN ?? 'http://localhost:3000'`). Never hardcode credentials; mirror any new var in `.env.example` with a placeholder. If a real DB is chosen, add its connection var (`DATABASE_URL` for Postgres, `MONGODB_URI` for Mongo) as a **placeholder pointing at a local default** — never a real credential.
5. **Production path** — 4–5 concrete bullets on what changes after the hackathon (real DB, authn/authz + audit, observability, deploy behind the company gateway). Judges score this criterion, so be specific, not aspirational.
6. **Key tradeoffs** — one table: decision / why / risk / mitigation. The in-memory-store-for-speed tradeoff is the canonical entry; add a row for the storage decision (PostgreSQL vs MongoDB / why: chosen by data shape / risk: wrong pick forces rework mid-hackathon / mitigation: store behind the module interface so a swap stays one-file).

## Rules

- Choose the fastest path to one complete end-to-end slice, not the most "correct" design. Architecture serves the demo.
- Keep the API contract stable enough that swapping storage later doesn't change routes — you'll pin the exact shapes in `/api-contract` next.
- Prefer one already-installed dependency over a new one (decision rule: only add a dependency if it removes real risk or saves major time).
- No SaaS or managed/external database (Supabase, MongoDB Atlas, Neon, PlanetScale, …) unless the hackathon rules explicitly allow external third-party services; default to a local Docker container. Record the permission check in `docs/architecture.md`.

## Output

- Updated `docs/architecture.md` with every section filled (no empty headers), including the **storage decision** (in-memory / self-hosted PostgreSQL / self-hosted MongoDB) and the result of the **external-service-permission check**.
- One line naming the riskiest component to build first.
- Next step: run `/api-contract` to fix the endpoint shapes.
