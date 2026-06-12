# syntax=docker/dockerfile:1
#
# Build from the repo root (the pnpm workspace + packages/* are required):
#   docker build -f apps/api/Dockerfile -t cj-api .
#
FROM node:24.16.0-alpine AS base
RUN corepack enable
WORKDIR /repo

# --- deps: install the full workspace ---------------------------------------
# The API build extends @workspace/typescript-config, so we need the whole
# workspace installed (the runtime image will not).
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
RUN pnpm install --frozen-lockfile

# --- builder: compile the API, then bundle a prod deploy dir ----------------
FROM deps AS builder
COPY . .
RUN pnpm --filter api build
# /srv gets api's package.json + a self-contained prod-only node_modules.
# --legacy: pnpm v10 requires it for non-injected workspace packages (api has
# no runtime workspace deps, so legacy deploy is exactly right here).
RUN pnpm --filter api deploy --prod --legacy /srv

# --- runner: minimal runtime image ------------------------------------------
FROM node:24.16.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /srv ./
# `pnpm deploy` honors .gitignore, so dist/ isn't copied above — add it explicitly.
COPY --from=builder /repo/apps/api/dist ./dist
EXPOSE 8080
CMD ["node", "dist/server.js"]
