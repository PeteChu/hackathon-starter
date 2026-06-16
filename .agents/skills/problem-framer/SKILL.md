---
name: problem-framer
description: Turn a vague hackathon challenge into a crisp problem brief — target user, painful job, success metric, MVP scope, assumptions, and a demo wow moment — and write docs/problem-brief.md. Use at the very start of a hackathon, whenever requirements are unclear, or before running /solution-architect.
argument-hint: "[challenge text, judging criteria, constraints]"
---

# Problem Framer

Create or update `docs/problem-brief.md`. Every later skill reads this file, so getting the problem sharp here is the highest-leverage 15 minutes of the hackathon — a fuzzy brief cascades into fuzzy architecture, fuzzy tasks, and a fuzzy demo.

## Gather inputs

Read whatever exists before asking the user: the challenge statement, `docs/judging-scorecard.md`, the README, and any screenshots or notes that were pasted in. Pull the judging criteria into the brief verbatim — they define what "winning" means, so every scope decision should trace back to them.

## Fill the brief

1. **Target user + pain** — name the primary user and the specific, painful job. A concrete workaround they use _today_ proves the pain is real and gives you something to show in the demo.
2. **Winning insight** — one sentence on why this user will care.
3. **Success metric** — a north-star metric, plus a **demo proof metric** you can actually show on screen in seconds (a number, a before/after, a time saved). If you can't put it on screen, it doesn't count toward the judging rubric.
4. **Constraints** — time, data access, security/compliance, integration limits, and the judging criteria.
5. **MVP scope** — Must-ship / Should-ship / **Explicitly-not-building**. The "not building" list matters most: it's how you protect demo time when scope grows.
6. **Assumptions** — write the assumption and keep moving, unless the gap touches safety, credentials, or access to company systems (CLAUDE.md decision rule #2). Don't block on the rest.

## Choose the slice

Prefer a smaller slice with a strong proof metric over a broad platform. A demo that solves one painful job end-to-end beats ten half-built features — that's decision rule #1 in CLAUDE.md.

## Output

- Updated `docs/problem-brief.md` with every section filled (no empty headers left behind).
- A short summary: the highest-leverage MVP slice and the single riskiest assumption to validate first.
- Next step: run `/solution-architect` to fix the build approach.
