# syntax=docker/dockerfile:1
#
# Build from the repo root (needs the pnpm workspace + packages/ui):
#   docker build -f apps/web/Dockerfile -t cj-web .
#
# Requires `output: "standalone"` in apps/web/next.config.ts so next build
# emits .next/standalone (minimal node_modules + server.js).
#
FROM node:24.16.0-alpine AS base
RUN corepack enable
WORKDIR /repo

# --- deps: install the full workspace ---------------------------------------
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
RUN pnpm install --frozen-lockfile

# --- builder: build the Next.js app (standalone output) ---------------------
FROM deps AS builder
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN pnpm --filter web build

# --- runner: tiny image from the standalone output --------------------------
# standalone mirrors the monorepo layout, so server.js lands at apps/web/server.js.
FROM node:24.16.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=builder /repo/apps/web/.next/standalone ./
COPY --from=builder /repo/apps/web/.next/static ./apps/web/.next/static
# If a public/ dir is added later, also copy it:
# COPY --from=builder /repo/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
