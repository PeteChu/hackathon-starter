SHELL := /bin/bash

.PHONY: help bootstrap install install-plannotator install-web install-node-api dev dev-node dev-web test test-node build build-node build-web smoke clean

help:
	@echo "Targets:"
	@echo "  make install          Install local dependencies where possible"
	@echo "  make dev-node         Run Node API on :8080"
	@echo "  make dev-web          Run Next.js UI on :3000"
	@echo "  make test             Run Node tests + web typecheck"
	@echo "  make test-e2e         Run Playwright E2E tests (headless)"
	@echo "  make test-e2e-ui      Run Playwright E2E tests (headed)"
	@echo "  make build            Build API and UI"
	@echo "  make smoke            Run API smoke checks against API_URL or localhost:8080"


install-web:
	cd apps/web && pnpm install

install-node-api:
	cd apps/api && pnpm install

install-plannotator:
	@if command -v plannotator >/dev/null 2>&1; then \
		echo "Plannotator already installed"; \
	else \
		curl -fsSL https://plannotator.ai/install.sh | bash; \
	fi

install: install-web install-node-api

bootstrap: install-plannotator install

dev-node:
	cd apps/api && pnpm run dev

dev-web:
	cd apps/web && pnpm run dev

dev: 
	pnpm run dev

test: test-node test-web-typecheck
	@if [ -d apps/web/node_modules ]; then echo "Web deps OK"; else echo "Skipping web tests; run make install-web first"; fi

test-e2e:
	@if [ -d apps/web/node_modules ]; then cd apps/web && pnpm run test:e2e; else echo "Skipping E2E tests; run make install-web first"; fi

test-e2e-ui:
	@if [ -d apps/web/node_modules ]; then cd apps/web && pnpm run test:e2e:ui; else echo "Skipping E2E tests (headed); run make install-web first"; fi

test-web-typecheck:
	@if [ -d apps/web/node_modules ]; then cd apps/web && pnpm run typecheck; else echo "Skipping web typecheck; run make install-web first"; fi


test-node:
	@if [ -d apps/api/node_modules ]; then cd apps/api && pnpm test; else echo "Skipping Node API tests; run make install-node-api first"; fi

build: build-node build-web


build-node:
	@if [ -d apps/api/node_modules ]; then cd apps/api && pnpm run build; else echo "Skipping Node API build; run make install-node-api first"; fi

build-web:
	@if [ -d apps/web/node_modules ]; then cd apps/web && pnpm run build; else echo "Skipping web build; run make install-web first"; fi

smoke:
	./scripts/smoke-test.sh

clean:
	rm -rf apps/api/dist apps/web/dist
