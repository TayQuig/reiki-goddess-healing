import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test-setup.ts",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData.ts",
        "src/main.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@reiki-goddess/shared-components": resolve(
        __dirname,
        "../../packages/shared-components/src"
      ),
      "@reiki-goddess/design-system": resolve(
        __dirname,
        "../../packages/design-system/src"
      ),
      "@reiki-goddess/shared-utils": resolve(
        __dirname,
        "../../packages/shared-utils/src"
      ),
    },
  },
});