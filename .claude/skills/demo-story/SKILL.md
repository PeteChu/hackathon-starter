---
name: demo-story
description: Craft a concise hackathon pitch, live demo script, judge Q&A, and fallback plan — tied to the working slice and a measurable proof metric — and write docs/demo-script.md and docs/pitch.md. Use in the final third of the hackathon, or whenever you need to rehearse the presentation.
argument-hint: "[demo length, judging rubric]"
---

# Demo Story

Update `docs/demo-script.md` and `docs/pitch.md`. Judges remember a story and a number — not a feature list.

## Pitch structure

1. **One-line problem + user.** Who hurts, and how much.
2. **Why the current workflow is painful** — the workaround they use today.
3. **What the product does** — one sentence a non-engineer can repeat.
4. **Live demo flow** — the exact clicks, scripted.
5. **Measurable impact** — the proof metric from `docs/problem-brief.md`, shown on screen.
6. **Why it can become production** — point at the production path in `docs/architecture.md`.
7. **What you'd build next.**

## Rules

- **Open with the 10-second hook** (CLAUDE.md rule #4): headline, value prop, primary action, result, proof metric — judges decide fast.
- **No architecture deep-dive** unless a judge asks. Mention one credible technical decision only.
- **Be honest about limits**, framed as next-step plans, not apologies.
- **Prep Q&A** on security, scalability, adoption, and data quality — cross-check `docs/judging-scorecard.md` so your answers map onto the criteria that get scored.
- **Have a fallback** — a screen recording or local data so a live failure doesn't end the demo.

## Output

- Updated `docs/demo-script.md` (opening, 3-minute flow, fallback, judge Q&A) and `docs/pitch.md`.
- Next step: rehearse with the `pitch-coach` subagent; run `/test-fast` to lock the demo path.
