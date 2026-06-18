# Claude Kit Notes

Project skills live in `.claude/skills/<skill-name>/SKILL.md` and are invoked with `/skill-name` from Claude Code in this repo.

Project subagents live in `.claude/agents/*.md`. Restart the Claude Code session after editing subagent files directly on disk.

## Recommended hackathon flow

Run these in order — each writes or updates a doc in `docs/`:

```text
/grill-with-docs                          ← optional prelude (fuzzy domain / new cycle)
/problem-framer <challenge>
/solution-architect
/api-contract
/task-slicer
/implement-vertical-slice <slice>
/test-fast
/demo-story
```

`/grill-with-docs` is the optional context-gathering gateway. It produces
`CONTEXT.md` (a domain glossary) and, when warranted, ADRs in `docs/adr/`.
Every downstream skill reads `CONTEXT.md` when present to keep terminology
consistent. Use it when the problem domain uses unfamiliar terms, or when
you're starting a new feature cycle and want to re-anchor the vocabulary.

## Use subagents explicitly when useful

```text
Use the backend-node agent to implement the Fastify route + Zod schema for <feature>.
Use the frontend-nextjs agent to build or polish the main demo screen in apps/web.
Use the qa-engineer agent to run the /test-fast pass.
Use the product-strategist agent to pressure-test MVP scope against the judging rubric.
Use the pitch-coach agent to rehearse the demo and judge Q&A.
```
