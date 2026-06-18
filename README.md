# CJ Hackathon Kit

A **hackathon starter kit**: a production-shaped Next.js + Fastify monorepo
paired with a Claude Code "kit" of skills and subagents that take a team from a
vague challenge to a working, demoable vertical slice — fast.

The kit gives you two things:

1. **A working stack out of the box** — Next.js 16 + Fastify 5 + Zod, typed data,
   testable handlers, env-based config, and a minimal demo so the whole thing
   runs end-to-end on first `make`.
2. **A guided workflow** — project skills (`/grill-with-docs`, `/problem-framer`, `/solution-architect`,
   `/api-contract`, …) and specialized subagents (`backend-node`, `frontend-nextjs`,
   `qa-engineer`, …) that fill in the planning docs and implement the slice with you.

> The shipped "Hackathon Idea Board" demo (post ideas, upvote, live leaderboard) is
> a **placeholder to prove the stack works — not the real challenge.** See
> [Replace the demo](#replace-the-demo) to swap in your own.

## Quick start

Requires Node ≥ 24 and pnpm 10.

```bash
make bootstrap    # install web + api dependencies + plannotator (plan & code review for agent)
make dev-node     # API on http://localhost:8080
make dev-web      # UI on http://localhost:3000  (in a second terminal)
```

Open <http://localhost:3000>.

Other targets: `make test`, `make build`, `make smoke`.

## Repository map

| Path             | What's here                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| `apps/api`       | Fastify backend. Entry `src/server.ts` exports `buildServer()` so routes are testable without booting a port.         |
| `apps/web`       | Next.js 16 App Router frontend. Shared UI via the `@workspace/ui` package, Tailwind v4.                               |
| `packages/`      | Shared workspace packages: `ui`, `eslint-config`, `typescript-config`.                                                |
| `docs/`          | Planning & pitch artifacts: problem brief, architecture, API contract, task board, test plan, demo script, scorecard. |
| `.claude/skills` | Reusable hackathon workflows, invoked with `/skill-name`.                                                             |
| `.claude/agents` | Specialized subagents for backend, frontend, QA, strategy, and pitch.                                                 |

See `CLAUDE.md` for the operating rules the kit is built around, and
`docs/architecture.md` for the stack details.

## The hackathon workflow

Run these in order from Claude Code in this repo — each writes or updates a doc
in `docs/`, so the planning trail stays intact:

```text
/grill-with-docs                        ← optional: context-gathering prelude
  (when domain terms are fuzzy or a new feature cycle begins)
/problem-framer <your challenge>
/solution-architect
/api-contract
/task-slicer
/implement-vertical-slice <slice>
/test-fast
/demo-story
```

**`/grill-with-docs`** is an optional discovery phase that runs before
`/problem-framer`. It interviews you about the domain, sharpens terminology,
and produces `CONTEXT.md` — a shared glossary that every downstream skill can
reference. Use it when:

- The challenge uses unfamiliar or overloaded domain terms.
- You're starting a new feature cycle and want to re-establish vocabulary.
- You want to stress-test assumptions against existing documentation before
  committing to a problem brief.

Every downstream skill (`/problem-framer` through `/demo-story`) will
read `CONTEXT.md` when present to keep terminology consistent across all
planning docs.

## Replace the demo

The placeholder demo is confined to a small, easily-deleted file set:

- `apps/api/src/lib/store.ts`, `apps/api/src/lib/ideas.ts`
- the `/api/ideas` routes in `apps/api/src/server.ts`
- `apps/web/app/page.tsx`, `apps/web/lib/api.ts`
- `apps/api/src/ideas.test.ts`

Delete those, run `/grill-with-docs` first (if the domain needs glossary sharpening),
then `/problem-framer` with your real challenge, and the workflow
rebuilds the slice on top of the same stack.

## Adding UI components

To add shadcn/ui components, run at the root of the repo:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This places components in `packages/ui/src/components`. Use them in your app via:

```tsx
import { Button } from "@workspace/ui/components/button"
```
