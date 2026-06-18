---
name: task-slicer
description: Convert the problem brief and architecture into a time-boxed hackathon task board of vertical slices — with owners, dependencies, effort estimates, and explicit cut lines — and write docs/task-board.md. Use before implementation and whenever scope starts growing.
argument-hint: "[available hours, team size, judging criteria]"
---

# Task Slicer

Update `docs/task-board.md`. This is where you defend demo time against scope creep — the single most common way hackathons fail is a board full of half-finished features.

## Load domain context

Read **`CONTEXT.md`** (and `CONTEXT-MAP.md` if present) before slicing. Use canonical glossary terms in task outcomes and acceptance checks — a task outcome like "Customer places an Order" is clearer and more consistent than "user creates a purchase" when the glossary defines those terms precisely. This alignment prevents confusion between teammates and keeps the demo narrative consistent.

If `CONTEXT.md` is absent, rely on `docs/problem-brief.md`.

## Task shape

Each task gets:

- **Outcome** — a user-visible result, not "set up the database." If a judge can't see it, it's not the outcome. Use canonical terminology from `CONTEXT.md` where applicable.
- **Files likely touched** — e.g. `apps/api/src/server.ts`, `apps/web/app/page.tsx`, a new test file.
- **Acceptance check** — one sentence a teammate can verify, ideally by eye on the demo screen.
- **Effort** — S / M / L.
- **Owner** — `backend-node`, `frontend-nextjs`, or human.
- **Cut decision** — keep / defer / kill.

## Rules (in priority order)

1. **The first task is a complete vertical slice** — UI → API → proof metric, end to end, however ugly. A working skeleton in hour 1 beats a polished half in hour 4.
2. **Every slice ends in a demo checkpoint** — something you can show, record, or screenshot. This is your live-demo fallback.
3. **Score tasks by judge-visible ROI.** Cross-check `docs/judging-scorecard.md` — a task that moves "working demo" or "user value" beats one that moves "technical quality" alone.
4. **Build a cut list from the start.** Move Should-ship items onto it the moment you're behind. Protect the final presentation block like a hard deadline.
5. **Keep infra tasks only if they unblock the demo or production credibility.**

## Output

- Updated `docs/task-board.md` with Now / Next / Later / Cut list all filled in.
- The next three actions in order, with the first one runnable via `/implement-vertical-slice`.
