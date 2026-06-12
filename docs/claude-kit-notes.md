# Claude Kit Notes

Project skills live in `.claude/skills/<skill-name>/SKILL.md` and are invoked with `/skill-name` from Claude Code in this repo.

Project subagents live in `.claude/agents/*.md`. Restart the Claude Code session after editing subagent files directly on disk.

## Recommended hackathon flow

Run these in order — each writes or updates a doc in `docs/`:

```text
/problem-framer <challenge>
/solution-architect
/api-contract
/task-slicer
/implement-vertical-slice <slice>
/test-fast
/demo-story
```

## Use subagents explicitly when useful

```text
Use the backend-node agent to implement the Fastify route + Zod schema for <feature>.
Use the frontend-nextjs agent to build or polish the main demo screen in apps/web.
Use the qa-engineer agent to run the /test-fast pass.
Use the product-strategist agent to pressure-test MVP scope against the judging rubric.
Use the pitch-coach agent to rehearse the demo and judge Q&A.
```
