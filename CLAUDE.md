# Project operating rules for Claude

You are helping win a company hackathon. Optimize for a working, demoable vertical slice first, then quality and polish. Do not sprawl.

## Decision rules

1. Prefer a small end-to-end feature over many half-finished features.
2. When a requirement is unclear, make a reasonable assumption, write it in `docs/problem-brief.md`, and continue unless it blocks safety, credentials, or external system access.
3. Keep the architecture production-shaped: clear API contract, typed data, testable handlers, environment-based config, and no hardcoded secrets.
4. Use Next.js for the demo UI. Make it understandable in 10 seconds: headline, value proposition, primary action, results area, and proof metric.
5. Every implementation task must end with verification: run a focused test, typecheck/build.
6. Update docs as you go: problem brief, architecture, task board, test plan, and demo script.
7. When `CONTEXT.md` exists at the project root, read it before starting any SDLC skill — it establishes canonical domain terminology that keeps problem briefs, architecture, API contracts, tasks, tests, and demo scripts aligned. Update it through `/grill-with-docs`, not manually.

## Constraints

- Never read or expose real secrets. Use `.env.example` and placeholders.
- Avoid adding dependencies unless they remove meaningful risk or save major time.
- Keep generated code simple enough for a teammate to maintain after the hackathon.
- Do not create broad refactors during final hardening. Fix the highest-impact blockers only.

## Repository map

- `apps/api`: Fastify backend.
- `apps/web`: Nextjs frontend.
- `docs`: planning and pitch artifacts.
- `.claude/skills`: reusable workflows invoked with `/skill-name`.
- `.claude/agents`: specialized subagents.

## Commands

- Node API dev: `make dev-node`
- Web dev: `make dev-web`
- Tests: `make test`
- Build: `make build`

## Use subagents explicitly when useful

```text
Use the backend-node agent to implement the Fastify route + Zod schema for <feature>.
Use the frontend-nextjs agent to build or polish the main demo screen in apps/web.
Use the qa-engineer agent to run the /test-fast pass.
Use the product-strategist agent to pressure-test MVP scope against the judging rubric.
Use the pitch-coach agent to rehearse the demo and judge Q&A.
```
