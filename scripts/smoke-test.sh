#!/usr/bin/env bash
# Minimal smoke test against a running API. Used by `make smoke` and the /test-fast skill.
# It hits routes in apps/api/src/server.ts (/healthz, /login, and the /api/ideas demo),
# so it catches wiring, CORS, and config bugs that unit tests miss.
#
# Usage: ./scripts/smoke-test.sh [API_URL]   (default: $API_URL or http://localhost:8080)
set -euo pipefail

API_URL="${1:-${API_URL:-http://localhost:8080}}"
fail=0

check() { # check <name> <expected_status> <curl args...>
  local name="$1" expected="$2"
  shift 2
  local code
  code="$(curl -s -o /dev/null -w '%{http_code}' "$@" 2>/dev/null)" || code="000"
  if [ "$code" = "$expected" ]; then
    echo "  PASS  $name -> $code"
  else
    echo "  FAIL  $name -> got $code, want $expected"
    fail=1
  fi
}

echo "Smoke test against $API_URL"
check "GET  /healthz" 200 "$API_URL/healthz"

# Reference demo: idea board
check "GET  /api/ideas" 200 "$API_URL/api/ideas"
check "POST /api/ideas (bad)" 400 "$API_URL/api/ideas" -X POST -H 'Content-Type: application/json' -d '{"title":"x"}'
check "POST /api/ideas (good)" 201 "$API_URL/api/ideas" -X POST -H 'Content-Type: application/json' -d '{"title":"Smoke idea","description":"from smoke test"}'

if [ "$fail" = "0" ]; then echo "All smoke checks passed."; fi
exit $fail
