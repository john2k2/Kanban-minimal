import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: [],
    globals: true,
    include: ["tests/unit/**/*.spec.ts"],
    exclude: [
      "tests/**/visual.spec.ts",
      "tests/**/kanban-visual.spec.ts",
      "node_modules",
      "dist",
    ],
  },
});
