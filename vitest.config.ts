import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "packages/web/src"),
    },
  },
  test: {
    environment: "node",
    setupFiles: [resolve(__dirname, "vitest.setup.ts")],
    testTimeout: 15000,
    fileParallelism: false
  }
});
