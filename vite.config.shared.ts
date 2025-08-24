import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export const createViteConfig = (options: {
  entry: string;
  publicDir?: string;
  base?: string;
  plugins?: any[];
}) => {
  return defineConfig({
    plugins: [react(), ...(options.plugins || [])],
    publicDir: options.publicDir || "./static",
    base: options.base || "./",
    css: {
      postcss: {
        plugins: [require("tailwindcss")()],
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
    build: {
      rollupOptions: {
        input: options.entry,
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            if (id.includes('@reiki-goddess/shared-components')) {
              return 'shared-components';
            }
            if (id.includes('@reiki-goddess/design-system')) {
              return 'design-system';
            }
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      sourcemap: process.env.NODE_ENV === 'production' ? false : true,
      minify: 'esbuild',
      target: 'es2020'
    },
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
  });
};
