# shadcn/ui monorepo template

This is a Next.js monorepo template with shadcn/ui.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```

## Reference demo (replaceable)

The repo ships with a minimal **Hackathon Idea Board** demo so the kit runs end-to-end out of the box: post ideas, upvote them, watch a live leaderboard. It's a **placeholder to prove the stack works — not the real challenge.**

Run it in two terminals:

```bash
make dev-node   # API on http://localhost:8080
make dev-web    # UI on http://localhost:3000
```

Open http://localhost:3000.

### Replace it with your real challenge

The demo is confined to a small, easily-deleted file set:

- `apps/api/src/lib/store.ts`, `apps/api/src/lib/ideas.ts`
- the `/api/ideas` routes in `apps/api/src/server.ts`
- `apps/web/app/page.tsx`, `apps/web/lib/api.ts`
- `apps/api/src/ideas.test.ts`

Then run the workflow to fill the template docs for your real challenge:

```text
/problem-framer <your challenge>
/solution-architect
/api-contract
/task-slicer
/implement-vertical-slice <slice>
/test-fast
/demo-story
```
