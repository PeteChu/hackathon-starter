import { defineConfig } from "vitest/config"

// Only ever run source tests. Without this, vitest also picks up compiled
// `dist/**/*.test.js` (emitted by `tsc`), which double-runs the suite and —
// after a route rename — runs stale compiled tests against dead code.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    exclude: ["dist/**", "node_modules/**"],
  },
})
