import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export const createVitestConfig = (packagePath: string) => {
  return defineConfig({
    plugins: [react()],
    test: {
      environment: "jsdom",
      setupFiles: [resolve(__dirname, "test-setup.ts")],
      globals: true,
      css: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: [
          "node_modules/",
          "dist/",
          "**/*.d.ts",
          "**/*.config.*",
          "**/test-setup.ts",
        ],
      },
    },
    resolve: {
      alias: {
        "@reiki-goddess/shared-components": resolve(
          __dirname,
          "packages/shared-components/src"
        ),
        "@reiki-goddess/design-system": resolve(
          __dirname,
          "packages/design-system/src"
        ),
        "@reiki-goddess/shared-utils": resolve(
          __dirname,
          "packages/shared-utils/src"
        ),
        "@reiki-goddess/shared-assets": resolve(
          __dirname,
          "packages/shared-assets"
        ),
      },
    },
  });
};
